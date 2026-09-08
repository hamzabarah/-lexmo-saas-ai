import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { recordedSeconds } from '../lib/focus/time';

const migration = readFileSync('supabase/migrations/20260908_focus_strategy.sql', 'utf8');
const owner = '00000000-0000-4000-8000-000000000001';
const other = '00000000-0000-4000-8000-000000000002';
const row = async (db: PGlite, sql: string, args: unknown[] = []) =>
    (await db.query<Record<string, any>>(sql, args)).rows[0];
const command = async (db: PGlite, action: string, data: unknown) =>
    (await row(db, 'SELECT public.focus_session_command($1,$2,$3::jsonb) AS value', [owner, action, JSON.stringify(data)])).value;

async function fixture() {
    const db = new PGlite();
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
      CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text);
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;
      CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT '{}'::jsonb $$;`);
    for (const name of ['20260427_focus_sessions', '20260427_focus_tasks', '20260427_focus_subtasks',
        '20260427_focus_task_types', '20260830_focus_projects', '20260830_focus_tasks_archive',
        '20260904_focus_subtask_session', '20260908_focus_v0', '20260823_pilotage_system']) {
        await db.exec(readFileSync(`supabase/migrations/${name}.sql`, 'utf8'));
    }
    // Match Supabase's server role while recording V0 permissions before Lot 2.
    await db.exec(`GRANT USAGE ON SCHEMA public TO anon,authenticated,service_role;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
      GRANT SELECT,INSERT,UPDATE ON focus_projects TO authenticated;`);
    await db.query('INSERT INTO auth.users VALUES ($1,$2),($3,$4)', [owner, 'fixture@example.invalid', other, 'other@example.invalid']);
    const objective = await row(db, `INSERT INTO pilotage_objectives(title,lever,target_value,unit,source_of_truth,due_date)
      VALUES('Existing goal','conversion',1000000,'EUR','source','2028-02-28') RETURNING *`);
    const project = await row(db, `INSERT INTO focus_projects(user_id,name,status) VALUES($1,'Existing project','vital') RETURNING *`, [owner]);
    const task = await row(db, 'INSERT INTO focus_tasks(user_id,project_id,title) VALUES($1,$2,$3) RETURNING *', [owner, project.id, 'Existing task']);
    const subtask = await row(db, 'INSERT INTO focus_subtasks(user_id,task_id,title) VALUES($1,$2,$3) RETURNING *', [owner, task.id, 'Existing subtask']);
    const started = await command(db, 'start', { task_id: task.id, subtask_id: subtask.id });
    await db.query('UPDATE focus_subtasks SET is_completed=true WHERE id=$1', [subtask.id]);
    await command(db, 'stop', { id: started.id, actual_minutes: 7, notes: 'Real V0 history before additive migration' });
    return { db, objective, project, task, subtask };
}

async function snapshot(db: PGlite, names: string[]) {
    const result: Record<string, unknown> = {};
    for (const name of names) result[name] = (await db.query(`SELECT to_jsonb(t) AS value FROM ${name} t ORDER BY id`)).rows;
    return result;
}

test('strategy migration preserves V0 history, existing project values, other business rows and project permissions', async () => {
    const { db, project, task } = await fixture();
    try {
        const tables = ['auth.users', 'pilotage_objectives', 'focus_tasks', 'focus_subtasks', 'focus_sessions'];
        const before = await snapshot(db, tables);
        const priorProject = await row(db, 'SELECT * FROM focus_projects WHERE id=$1', [project.id]);
        const permissions = async () => (await db.query(`SELECT grantee,privilege_type FROM information_schema.role_table_grants
          WHERE table_schema='public' AND table_name='focus_projects' ORDER BY grantee,privilege_type`)).rows;
        const priorPermissions = await permissions();
        await db.exec(migration);
        assert.deepEqual(await snapshot(db, tables), before);
        assert.deepEqual(await permissions(), priorPermissions);
        const afterProject = await row(db, 'SELECT * FROM focus_projects WHERE id=$1', [project.id]);
        assert.deepEqual(Object.fromEntries(Object.keys(priorProject).map(key => [key, afterProject[key]])), priorProject);
        assert.equal(afterProject.phase_id, null);
        assert.equal(afterProject.engine, null);
        assert.equal(afterProject.priority, 'normal');
        assert.equal((await row(db, 'SELECT count(*)::int AS count FROM os_phases')).count, 0);
        assert.equal((await row(db, 'SELECT count(*)::int AS count FROM project_records')).count, 0);
        await assert.rejects(db.exec(migration), /already_installed_or_unexpected_objects/);
        await db.exec('ROLLBACK');
        assert.deepEqual(await snapshot(db, tables), before);
        // Old Focus web/MCP session engine still executes unchanged after the migration.
        const started = await command(db, 'start', { task_id: task.id });
        const paused = await command(db, 'pause', { id: started.id });
        assert.equal(paused.status, 'paused');
        const resumed = await command(db, 'resume', { id: started.id });
        assert.equal(resumed.status, 'running');
        const stopped = await command(db, 'stop', { id: started.id, actual_minutes: 2 });
        assert.equal(stopped.duration_override_seconds, 120);
        await db.query("UPDATE focus_tasks SET status='done' WHERE id=$1", [task.id]);
        assert.ok((await row(db, 'SELECT completed_at FROM focus_tasks WHERE id=$1', [task.id])).completed_at);
    } finally { await db.close(); }
});

test('phases and enriched projects enforce ownership, lifecycle, dates, engines and budgets in PostgreSQL', async () => {
    const { db, objective } = await fixture();
    try {
        await db.exec(migration);
        const phase = await row(db, `INSERT INTO os_phases(user_id,name,position,starts_on,ends_on,mission,status,created_at)
          VALUES($1,'Phase 1',1,'2026-09-01','2026-12-31','Mission','active','1970-01-01') RETURNING *`, [owner]);
        assert.ok(+new Date(phase.created_at) > Date.parse('2026-01-01'));
        const foreign = await row(db, "INSERT INTO os_phases(user_id,name) VALUES($1,'Foreign') RETURNING *", [other]);
        const project = await row(db, `INSERT INTO focus_projects(user_id,name,phase_id,objective_id,engine,purpose,hypothesis,
          expected_outcome,success_criteria,priority,delivery_deadline,evaluation_deadline,planned_time_minutes,planned_cost_eur,status)
          VALUES($1,'Enriched',$2,$3,'acquisition','Purpose','Hypothesis','Outcome','Criteria','urgent',
            '2026-09-30','2026-10-07',600,123.45,'evaluating') RETURNING *`, [owner, phase.id, objective.id]);
        assert.equal(project.phase_id, phase.id);
        assert.equal(project.objective_id, objective.id);
        assert.equal(Number(project.planned_cost_eur), 123.45);
        assert.equal(project.engine, 'acquisition');
        assert.equal(project.status, 'evaluating');
        for (const engine of ['conversion', 'expansion', 'systeme', 'risque']) {
            await db.query('UPDATE focus_projects SET engine=$1 WHERE id=$2', [engine, project.id]);
        }
        for (const status of ['queued', 'vital', 'paused', 'evaluating', 'completed', 'cancelled']) {
            await db.query('UPDATE focus_projects SET status=$1 WHERE id=$2', [status, project.id]);
        }
        for (const sql of [
            "UPDATE focus_projects SET engine='unknown' WHERE id=$1",
            "UPDATE focus_projects SET evaluation_deadline='2026-09-29' WHERE id=$1",
            'UPDATE focus_projects SET planned_time_minutes=-1 WHERE id=$1',
            'UPDATE focus_projects SET planned_cost_eur=-0.01 WHERE id=$1',
            "UPDATE focus_projects SET priority='low' WHERE id=$1",
            "UPDATE focus_projects SET purpose=repeat('x',10001) WHERE id=$1",
        ]) await assert.rejects(db.query(sql, [project.id]), /check constraint/);
        await assert.rejects(db.query('UPDATE focus_projects SET phase_id=$1 WHERE id=$2', [foreign.id, project.id]), /focus_phase_forbidden/);
        await assert.rejects(db.query('UPDATE focus_projects SET user_id=$1 WHERE id=$2', [other, project.id]), /identity_immutable/);
        await assert.rejects(db.query('UPDATE os_phases SET user_id=$1 WHERE id=$2', [other, phase.id]), /identity_immutable/);
        await assert.rejects(db.query("UPDATE os_phases SET ends_on='2026-08-31' WHERE id=$1", [phase.id]), /check constraint/);
        await assert.rejects(db.query("INSERT INTO os_phases(user_id,name) VALUES($1,'  ')", [owner]), /check constraint/);
        await assert.rejects(db.query('DELETE FROM os_phases WHERE id=$1', [phase.id]), /foreign key constraint/);
        await assert.rejects(db.query('DELETE FROM pilotage_objectives WHERE id=$1', [objective.id]), /foreign key constraint/);
        const oldCreated = project.created_at;
        const updated = await row(db, "UPDATE focus_projects SET subtitle='changed',created_at='1970-01-01',updated_at='1970-01-01' WHERE id=$1 RETURNING *", [project.id]);
        assert.deepEqual(updated.created_at, oldCreated);
        assert.ok(+new Date(updated.updated_at) >= +new Date(project.updated_at));
        // Existing authenticated grants/policies may still edit legacy fields,
        // but must not expose new strategy or global Pilotage links directly.
        await db.exec(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql
          AS $$ SELECT '${owner}'::uuid $$; GRANT USAGE ON SCHEMA auth TO authenticated; SET ROLE authenticated;`);
        const legacy = await row(db, "INSERT INTO focus_projects(user_id,name) VALUES($1,'Legacy browser project') RETURNING *", [owner]);
        assert.equal(legacy.phase_id, null);
        assert.equal(legacy.status, 'queued');
        assert.equal((await row(db, "UPDATE focus_projects SET name='Legacy renamed',status='vital' WHERE id=$1 RETURNING *", [legacy.id])).name, 'Legacy renamed');
        // A pre-existing private phase link does not block unrelated legacy edits.
        assert.equal((await row(db, "UPDATE focus_projects SET subtitle='Legacy edit after enrichment' WHERE id=$1 RETURNING *", [project.id])).subtitle,
            'Legacy edit after enrichment');
        await assert.rejects(db.query("INSERT INTO focus_projects(user_id,name,objective_id) VALUES($1,'Direct global link',$2)", [owner, objective.id]), /focus_strategy_admin_required/);
        await assert.rejects(db.query("INSERT INTO focus_projects(user_id,name,engine) VALUES($1,'Direct strategy','acquisition')", [owner]), /focus_strategy_admin_required/);
        await assert.rejects(db.query("INSERT INTO focus_projects(user_id,name,status) VALUES($1,'Direct lifecycle','evaluating')", [owner]), /focus_strategy_admin_required/);
        for (const sql of [
            "UPDATE focus_projects SET engine='conversion' WHERE id=$1",
            "UPDATE focus_projects SET priority='urgent' WHERE id=$1",
            "UPDATE focus_projects SET status='completed' WHERE id=$1",
            "UPDATE focus_projects SET delivery_deadline='2026-10-01' WHERE id=$1",
        ]) await assert.rejects(db.query(sql, [legacy.id]), /focus_strategy_admin_required/);
        await assert.rejects(db.query('UPDATE focus_projects SET objective_id=$1 WHERE id=$2', [objective.id, legacy.id]), /focus_strategy_admin_required/);
        await assert.rejects(db.query('UPDATE focus_projects SET phase_id=$1 WHERE id=$2', [phase.id, legacy.id]), /focus_strategy_admin_required/);
        await db.exec('RESET ROLE; SET ROLE service_role');
        const serverUpdated = await row(db, `UPDATE focus_projects SET objective_id=$1,phase_id=$2,engine='systeme',status='evaluating'
          WHERE id=$3 RETURNING *`, [objective.id, phase.id, legacy.id]);
        assert.equal(serverUpdated.objective_id, objective.id);
        assert.equal(serverUpdated.engine, 'systeme');
        await db.exec('RESET ROLE');
    } finally { await db.close(); }
});

test('typed records are append-only, private, timestamped by server and strictly attached to their owner', async () => {
    const { db, project } = await fixture();
    try {
        await db.exec(migration);
        const insert = (type: string, payload: unknown, user = owner) => row(db,
            `INSERT INTO project_records(user_id,project_id,type,title,payload,created_at)
             VALUES($1,$2,$3,'Record',$4::jsonb,'1970-01-01') RETURNING *`, [user, project.id, type, JSON.stringify(payload)]);
        const payloads = {
            decision: { rationale: 'Reason', alternatives: ['Alternative'] },
            output: { url: 'https://www.ecomy.ai/formation', format: 'page' },
            result: { metric: 'conversion', value: 1.2, unit: '%', source: 'measurement' },
            lesson: { next_action: 'Review next week' },
            cost: { amount_eur: 12.34, category: 'tool' },
        };
        for (const [type, payload] of Object.entries(payloads)) {
            const record = await insert(type, payload);
            assert.deepEqual(record.payload, payload);
            assert.ok(+new Date(record.created_at) > Date.parse('2026-01-01'));
            await assert.rejects(db.query("UPDATE project_records SET title='changed' WHERE id=$1", [record.id]), /append_only/);
            await assert.rejects(db.query('DELETE FROM project_records WHERE id=$1', [record.id]), /append_only/);
        }
        await assert.rejects(db.exec('TRUNCATE project_records'), /append_only/);
        await assert.rejects(insert('decision', {}, other), /focus_project_forbidden/);
        for (const [type, payload] of [
            ['decision', { unknown: 'x' }], ['decision', { alternatives: [4] }], ['decision', { rationale: null }],
            ['decision', { alternatives: Array.from({ length: 21 }, () => 'x') }], ['decision', { rationale: '  ' }],
            ['output', { url: 'javascript:alert(1)' }], ['result', { metric: 'sales' }], ['result', { value: 1 }],
            ['result', { metric: 'sales', value: '1' }], ['lesson', { next_action: 'x'.repeat(10001) }],
            ['cost', {}], ['cost', { amount_eur: -0.01 }], ['cost', { amount_eur: 1.001 }],
            ['cost', { amount_eur: 10000000000 }], ['cost', { amount_eur: null }], ['decision', []],
            ['decision', { rationale: 'x'.repeat(10000), alternatives: ['x'.repeat(10000)] }],
        ] as [string, unknown][]) await assert.rejects(insert(type, payload), /check constraint/);
        const metadata = await row(db, `SELECT
          (SELECT count(*)::int FROM pg_policies WHERE schemaname='public' AND tablename IN ('os_phases','project_records')) AS policies,
          (SELECT bool_and(relrowsecurity) FROM pg_class WHERE oid IN ('os_phases'::regclass,'project_records'::regclass)) AS rls`);
        assert.deepEqual(metadata, { policies: 0, rls: true });
        for (const role of ['anon', 'authenticated']) for (const table of ['os_phases', 'project_records']) {
            for (const privilege of ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']) {
                assert.equal((await row(db, 'SELECT has_table_privilege($1,$2,$3) AS allowed', [role, table, privilege])).allowed, false);
            }
        }
        for (const privilege of ['UPDATE', 'DELETE', 'TRUNCATE']) {
            assert.equal((await row(db, 'SELECT has_table_privilege($1,$2,$3) AS allowed', ['service_role', 'project_records', privilege])).allowed, false);
        }
        await db.exec('SET ROLE service_role');
        assert.equal((await insert('decision', {})).type, 'decision');
        await assert.rejects(db.exec('UPDATE project_records SET title=title'), /permission denied/);
        await assert.rejects(db.exec('TRUNCATE project_records'), /permission denied/);
        await db.exec('RESET ROLE');
    } finally { await db.close(); }
});

test('project context is read-only, owner-scoped, bounded and totals all history including archived tasks', async () => {
    const { db, project, task, objective } = await fixture();
    try {
        await db.exec(migration);
        const phase = await row(db, "INSERT INTO os_phases(user_id,name) VALUES($1,'Context phase') RETURNING *", [owner]);
        await db.query('UPDATE focus_projects SET phase_id=$1,objective_id=$2 WHERE id=$3', [phase.id, objective.id, project.id]);
        for (let i = 0; i < 12; i++) {
            const session = await command(db, 'start', { task_id: task.id });
            await command(db, 'stop', { id: session.id, actual_minutes: i });
        }
        await db.query(`INSERT INTO focus_sessions(user_id,task_id,task_title,status,started_at,ended_at,paused_seconds,completion_source)
          VALUES($1,$2,'Fractional timing','completed','2026-09-01T10:00:00Z','2026-09-01T10:02:59.750Z',60,'explicit_stop')`, [owner, task.id]);
        const microseconds = { started_at: '2026-09-08T09:00:00.900900Z', ended_at: '2026-09-08T09:00:01.900800Z', paused_seconds: 0 };
        const beforeMicroseconds = (await row(db, 'SELECT focus_project_context($1,$2) AS value', [owner, project.id])).value;
        await db.query(`INSERT INTO focus_sessions(user_id,task_id,task_title,status,started_at,ended_at,paused_seconds,completion_source)
          VALUES($1,$2,'Microsecond boundary','completed',$3,$4,0,'explicit_stop')`,
        [owner, task.id, microseconds.started_at, microseconds.ended_at]);
        const afterMicroseconds = (await row(db, 'SELECT focus_project_context($1,$2) AS value', [owner, project.id])).value;
        assert.equal(recordedSeconds(microseconds), 1);
        assert.equal(afterMicroseconds.totals.recorded_seconds - beforeMicroseconds.totals.recorded_seconds, recordedSeconds(microseconds));
        await db.query('UPDATE focus_tasks SET archived_at=now() WHERE id=$1', [task.id]);
        const archivedContext = (await row(db, 'SELECT focus_project_context($1,$2) AS value', [owner, project.id])).value;
        assert.ok(archivedContext.tasks.find((t: any) => t.id === task.id && t.archived_at));
        await db.query(`INSERT INTO focus_tasks(user_id,project_id,title)
          SELECT $1,$2,'Other task '||n FROM generate_series(1,101) n`, [owner, project.id]);
        const overdueTask = await row(db, `INSERT INTO focus_tasks(user_id,project_id,title)
          VALUES($1,$2,'Pending expiry') RETURNING *`, [owner, project.id]);
        // A read must leave this overdue session open: expiration is an explicit command.
        await db.query(`INSERT INTO focus_sessions(user_id,task_id,task_title,status,started_at,planned_duration_minutes)
          VALUES($1,$2,'Overdue','running',clock_timestamp()-interval '2 hours',1)`, [owner, overdueTask.id]);
        await db.query(`INSERT INTO project_records(user_id,project_id,type,title,payload)
          SELECT $1,$2,'cost','Cost '||n,'{"amount_eur":1.23}'::jsonb FROM generate_series(1,51) n`, [owner, project.id]);
        const otherProject = await row(db, "INSERT INTO focus_projects(user_id,name) VALUES($1,'Other project') RETURNING *", [other]);
        await db.query("INSERT INTO project_records(user_id,project_id,type,title) VALUES($1,$2,'decision','Private')", [other, otherProject.id]);
        const context = async (user = owner, id = project.id) => (await row(db,
            'SELECT focus_project_context($1,$2) AS value', [user, id])).value;
        const tracked = ['focus_projects', 'focus_tasks', 'focus_subtasks', 'focus_sessions', 'os_phases', 'project_records', 'pilotage_objectives', 'auth.users'];
        const before = await snapshot(db, tracked);
        await db.exec('BEGIN READ ONLY');
        const first = await context();
        assert.deepEqual(await context(), first);
        await db.exec('COMMIT');
        assert.deepEqual(await snapshot(db, tracked), before);
        assert.equal(first.phase.id, phase.id);
        assert.equal(first.objective.id, objective.id);
        assert.deepEqual(first.counts, { tasks: 103, sessions: 16, records: 51 });
        assert.deepEqual(first.truncated, { tasks: true, recent_sessions: true, records: true });
        assert.equal(first.tasks.length, 100);
        assert.equal(first.recent_sessions.length, 10);
        assert.equal(first.records.length, 50);
        assert.equal(first.totals.cost_eur, 62.73);
        const sessions = (await db.query<Record<string, any>>('SELECT * FROM focus_sessions ORDER BY started_at')).rows;
        assert.equal(first.totals.recorded_seconds, sessions.reduce((sum, s) => sum + recordedSeconds({
            started_at: new Date(s.started_at).toISOString(), ended_at: s.ended_at ? new Date(s.ended_at).toISOString() : null,
            paused_seconds: s.paused_seconds, duration_override_seconds: s.duration_override_seconds,
        }), 0));
        await assert.rejects(context(other), /focus_project_forbidden/);
        await assert.rejects(context(owner, otherProject.id), /focus_project_forbidden/);
        assert.equal((await row(db, `SELECT provolatile AS volatility,prosecdef AS definer FROM pg_proc
          WHERE oid='focus_project_context(uuid,uuid)'::regprocedure`)).volatility, 's');
        for (const role of ['anon', 'authenticated']) {
            assert.equal((await row(db, "SELECT has_function_privilege($1,'focus_project_context(uuid,uuid)','EXECUTE') AS allowed", [role])).allowed, false);
        }
        await db.exec('SET ROLE service_role; BEGIN READ ONLY');
        assert.deepEqual(await context(), first);
        await db.exec('COMMIT; RESET ROLE');
    } finally { await db.close(); }
});

test('strategy preflight fails closed without the exact V0 marker or with unexpected schema objects', async () => {
    const { db } = await fixture();
    try {
        await db.exec("COMMENT ON FUNCTION focus_session_command(uuid,text,jsonb) IS 'unexpected'");
        await assert.rejects(db.exec(migration), /requires_verified_v0/);
        await db.exec("ROLLBACK; COMMENT ON FUNCTION focus_session_command(uuid,text,jsonb) IS 'ecomy-focus-v0-20260908'");
        await db.exec('CREATE TABLE os_phases(id uuid)');
        await assert.rejects(db.exec(migration), /already_installed_or_unexpected_objects/);
        await db.exec('ROLLBACK');
        assert.equal((await row(db, "SELECT count(*)::int AS count FROM information_schema.columns WHERE table_schema='public' AND table_name='focus_projects' AND column_name='engine'")).count, 0);
        assert.equal((await row(db, "SELECT to_regclass('public.project_records') AS table_name")).table_name, null);
    } finally { await db.close(); }
});
