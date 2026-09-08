import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { parisDate, parisDayBounds, recordedSeconds, monday } from '../lib/focus/time';
import { focusTables, manifestFor, renderReset } from '../scripts/focus-reset-manifest.mjs';
import { createProjectFor, createTaskFor, sessionCommand } from '../lib/focus/commands';

test('frozen reset artifact matches the tested template and read-only preflight cannot reset', () => {
    const file=readFileSync('supabase/operations/20260908_focus_test_reset_ONCE.sql','utf8');
    const manifest=JSON.parse(file.match(/expected jsonb := '([\s\S]*?)'::jsonb/)![1]);
    assert.deepEqual(Object.fromEntries(focusTables.map(t=>[t,manifest[t].length])),{
        focus_projects:4,focus_tasks:17,focus_subtasks:4,focus_sessions:14,focus_bad_habits:4,focus_habit_checks:0,
    });
    assert.equal(file,renderReset(readFileSync('scripts/sql/focus-reset-once.template.sql','utf8'),manifest));
    const preflight=readFileSync('supabase/operations/20260908_focus_snapshot_READ_ONLY.sql','utf8');
    assert.match(preflight,/BEGIN READ ONLY;/);
    assert.doesNotMatch(preflight,/^\s*(TRUNCATE|DELETE|UPDATE|INSERT|ALTER|CREATE|DROP)\s/im);
    assert.match(preflight,/FOCUS_RESET_PREFLIGHT_OK/);
});

test('shared command validation rejects malformed web/MCP inputs before database access', async () => {
    const owner='00000000-0000-4000-8000-000000000001';
    await assert.rejects(createProjectFor(owner,{name:'   '}));
    await assert.rejects(createTaskFor(owner,{title:''}));
    await assert.rejects(createTaskFor(owner,{title:'valid',scheduled_date:'2026-02-30'}));
    await assert.rejects(sessionCommand(owner,'start',{}),/focus_task_required/);
    await assert.rejects(sessionCommand(owner,'start',{task_id:owner,planned_duration_minutes:0}));
    await assert.rejects(sessionCommand(owner,'stop',{actual_minutes:null}));
});

test('one-shot reset is bounded, fails closed and leaves non-Focus sentinels intact', async () => {
    const db = new PGlite();
    try {
        await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
          CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY, email text);
          CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;
          CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT '{}'::jsonb $$;`);
        for (const m of ['20260427_focus_sessions','20260427_focus_tasks','20260427_focus_subtasks',
            '20260427_focus_task_types','20260830_focus_projects','20260830_focus_tasks_archive',
            '20260904_focus_subtask_session','20260830_focus_bad_habits'])
            await db.exec(readFileSync(`supabase/migrations/${m}.sql`,'utf8'));
        await db.exec(`INSERT INTO auth.users VALUES ('00000000-0000-4000-8000-000000000001','fixture@example.invalid');
          INSERT INTO focus_projects(user_id,name) SELECT id,'project' FROM auth.users;
          INSERT INTO focus_tasks(user_id,project_id,title) SELECT user_id,id,'task' FROM focus_projects;
          INSERT INTO focus_subtasks(user_id,task_id,title) SELECT user_id,id,'subtask' FROM focus_tasks;
          INSERT INTO focus_sessions(user_id,task_id,subtask_id,task_title) SELECT user_id,task_id,id,'session' FROM focus_subtasks;
          UPDATE focus_subtasks SET completed_session_id=(SELECT id FROM focus_sessions);
          INSERT INTO focus_bad_habits(user_id,title) SELECT id,'habit' FROM auth.users;
          INSERT INTO focus_habit_checks(habit_id,check_date,state) SELECT id,CURRENT_DATE,'avoided' FROM focus_bad_habits;
          CREATE SCHEMA storage; CREATE TABLE storage.objects(id text); INSERT INTO storage.objects VALUES ('keep');`);
        const outside=['clients','subscriptions','payments','formations','lesson_progress','diagnostics','coaching','pilotage_objectives'];
        for(const t of outside) await db.exec(`CREATE TABLE public.${t}(id integer PRIMARY KEY, value text); INSERT INTO public.${t} VALUES(1,'keep');`);
        const snapshot=async (tables:string[]) => Object.fromEntries(await Promise.all(tables.map(async t=>[t,
            (await db.query<{row:Record<string,unknown>}>(`SELECT to_jsonb(t) AS row FROM ${t} t ORDER BY id`)).rows.map(x=>x.row)])));
        const fixture=await snapshot(focusTables.map(t=>`public.${t}`));
        const manifest=manifestFor(Object.fromEntries(focusTables.map(t=>[t,fixture[`public.${t}`]])));
        const reset=renderReset(readFileSync('scripts/sql/focus-reset-once.template.sql','utf8'),manifest);
        const beforeOutside=await snapshot(['auth.users','storage.objects',...outside]);
        const catalogSql=readFileSync('supabase/operations/20260908_focus_catalog_READ_ONLY.sql','utf8');
        assert.match(catalogSql,/BEGIN READ ONLY;/);
        assert.doesNotMatch(catalogSql,/^\s*(TRUNCATE|DELETE|UPDATE|INSERT|ALTER|CREATE|DROP|GRANT|REVOKE)\s/im);
        const reports=await db.exec(catalogSql);
        const report=reports.flatMap(r=>r.rows).find((r:any)=>r.focus_catalog_report) as any;
        assert.equal(report.focus_catalog_report.context.read_only,'on');
        assert.equal(report.focus_catalog_report.context.observed_tables,6);
        assert.ok(report.focus_catalog_report.effective_table_permissions.length>0);
        await db.exec(reset.replace('BEGIN;','BEGIN READ ONLY;').replace('IN ACCESS EXCLUSIVE MODE','IN ACCESS SHARE MODE')
            .replace(/-- RESTRICT rejects[\s\S]*$/, "SELECT 'FOCUS_RESET_PREFLIGHT_OK' AS result; COMMIT;"));
        assert.deepEqual(await snapshot(focusTables.map(t=>`public.${t}`)),fixture);
        const rejectReset=async (pattern:RegExp) => {
            await assert.rejects(db.exec(reset),pattern); await db.exec('ROLLBACK');
        };
        await db.exec("UPDATE focus_tasks SET title='changed without updated_at'");
        await rejectReset(/snapshot_mismatch/);
        await db.exec("UPDATE focus_tasks SET title='task'");
        await db.exec("INSERT INTO focus_tasks(user_id,title) SELECT id,'extra' FROM auth.users");
        await rejectReset(/snapshot_mismatch/);
        await db.exec("DELETE FROM focus_tasks WHERE title='extra'");
        await db.exec('CREATE TABLE external_link(id uuid REFERENCES focus_tasks(id));');
        await rejectReset(/external_inbound_foreign_key/);
        await db.exec('DROP TABLE external_link; CREATE VIEW external_view AS SELECT id FROM focus_tasks;');
        await rejectReset(/external_view/);
        await db.exec(`DROP VIEW external_view;
          CREATE FUNCTION unsafe_hook() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NULL; END $$;
          CREATE TRIGGER unexpected AFTER TRUNCATE ON focus_tasks FOR EACH STATEMENT EXECUTE FUNCTION unsafe_hook();`);
        await rejectReset(/custom_trigger/);
        await db.exec('DROP TRIGGER unexpected ON focus_tasks;');
        const migration=readFileSync('supabase/migrations/20260908_focus_v0.sql','utf8');
        await assert.rejects(db.exec(migration),/requires_empty_tables/); await db.exec('ROLLBACK');
        assert.deepEqual(await snapshot(focusTables.map(t=>`public.${t}`)),fixture);
        await db.exec(reset);
        for(const t of focusTables) assert.equal((await db.query(`SELECT * FROM ${t}`)).rows.length,0);
        assert.deepEqual(await snapshot(['auth.users','storage.objects',...outside]),beforeOutside);
        await rejectReset(/snapshot_mismatch/); // never erase later data on replay
        await db.exec(migration);
        await rejectReset(/engine_already_installed/);
        assert.deepEqual(await snapshot(['auth.users','storage.objects',...outside]),beforeOutside);
    } finally { await db.close(); }
});

test('Paris calendar: UTC midnight, DST 23h/25h days and Monday', () => {
    assert.equal(parisDate('2026-09-06T22:30:00Z'), '2026-09-07');
    const spring=parisDayBounds('2026-03-29'), autumn=parisDayBounds('2026-10-25');
    assert.equal((+spring.end-+spring.start)/3600000,23);
    assert.equal((+autumn.end-+autumn.start)/3600000,25);
    assert.equal(monday('2026-09-06'),'2026-08-31');
    assert.throws(()=>parisDayBounds('2026-02-30'));
    assert.equal(recordedSeconds({ started_at:'2026-09-01T10:00:00Z',ended_at:'2026-09-01T11:00:00Z',paused_seconds:600 }),3000);
    assert.equal(recordedSeconds({ started_at:'2026-09-01T10:00:00Z',ended_at:'2026-09-01T11:00:00Z',paused_seconds:600,duration_override_seconds:1800 }),1800);
});

test('PostgreSQL migration and execution invariants (isolated, no remote DB)', async () => {
    const db = new PGlite();
    try {
        await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
          CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY, email text);
          CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;
          CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT '{}'::jsonb $$;`);
        const migrations = ['20260427_focus_sessions.sql','20260427_focus_tasks.sql','20260427_focus_subtasks.sql',
            '20260427_focus_task_types.sql','20260830_focus_projects.sql','20260830_focus_tasks_archive.sql',
            '20260904_focus_subtask_session.sql'];
        for (const m of migrations) await db.exec(readFileSync(`supabase/migrations/${m}`,'utf8'));
        const user='00000000-0000-4000-8000-000000000001', other='00000000-0000-4000-8000-000000000002';
        await db.query('INSERT INTO auth.users VALUES ($1,$2),($3,$4)',[user,'test@example.invalid',other,'other@example.invalid']);
        const row = async (sql: string, args: unknown[] = []) => (await db.query<Record<string, any>>(sql,args)).rows[0];
        const migration=readFileSync('supabase/migrations/20260908_focus_v0.sql','utf8');
        await db.exec(migration);
        const project=await row('INSERT INTO focus_projects(user_id,name) VALUES ($1,$2) RETURNING *',[user,'Test']);
        const foreign=await row('INSERT INTO focus_projects(user_id,name) VALUES ($1,$2) RETURNING *',[other,'Other']);
        const task=await row('INSERT INTO focus_tasks(user_id,project_id,title) VALUES ($1,$2,$3) RETURNING *',[user,project.id,'Task']);
        const createdDone=await row("INSERT INTO focus_tasks(user_id,title,status) VALUES($1,'already done','done') RETURNING *",[user]);
        assert.ok(createdDone.completed_at);
        const cmd=async (action:string,data:unknown,u=user) => (await row(
            'SELECT focus_session_command($1,$2,$3::jsonb) AS value',[u,action,JSON.stringify(data)])).value;
        await db.query("UPDATE focus_tasks SET status='done' WHERE id=$1",[task.id]);
        const done=await row('SELECT * FROM focus_tasks WHERE id=$1',[task.id]);
        assert.ok(done.completed_at);
        await db.query("UPDATE focus_tasks SET status='done' WHERE id=$1",[task.id]);
        assert.deepEqual((await row('SELECT completed_at FROM focus_tasks WHERE id=$1',[task.id])).completed_at,done.completed_at);
        await db.query("UPDATE focus_tasks SET status='todo' WHERE id=$1",[task.id]);
        assert.equal((await row('SELECT completed_at FROM focus_tasks WHERE id=$1',[task.id])).completed_at,null);
        await assert.rejects(db.query('UPDATE focus_tasks SET project_id=$1 WHERE id=$2',[foreign.id,task.id]),/focus_project_forbidden/);
        const sameOwnerProject=await row('INSERT INTO focus_projects(user_id,name) VALUES($1,$2) RETURNING *',[user,'Another project']);

        // Two outstanding start requests, no intervening application read.
        const attempts=await Promise.allSettled([cmd('start',{task_id:task.id}),cmd('start',{task_id:task.id})]);
        assert.equal(attempts.filter(a=>a.status==='fulfilled').length,1);
        assert.equal(attempts.filter(a=>a.status==='rejected').length,1);
        const started=(attempts.find(a=>a.status==='fulfilled') as PromiseFulfilledResult<any>).value;
        await assert.rejects(db.query("INSERT INTO focus_sessions(user_id,task_id,task_title) VALUES($1,$2,'second direct start')",[user,task.id]),/focus_one_open_v0/);
        await assert.rejects(cmd('stop',{id:started.id},other),/forbidden/);
        await assert.rejects(db.query('UPDATE focus_tasks SET project_id=$1 WHERE id=$2',[sameOwnerProject.id,task.id]),/has_history/);

        await assert.rejects(db.query('UPDATE focus_tasks SET archived_at=now() WHERE id=$1',[task.id]),/open_session/);
        const sub=await row('INSERT INTO focus_subtasks(user_id,task_id,title) VALUES($1,$2,$3) RETURNING *',[user,task.id,'sub']);
        await db.query('UPDATE focus_subtasks SET is_completed=true WHERE id=$1',[sub.id]);
        assert.equal((await row('SELECT completed_session_id FROM focus_subtasks WHERE id=$1',[sub.id])).completed_session_id,started.id);
        const another=await row('INSERT INTO focus_tasks(user_id,project_id,title) VALUES($1,$2,$3) RETURNING *',[user,project.id,'another']);
        const unrelated=await row('INSERT INTO focus_subtasks(user_id,task_id,title) VALUES($1,$2,$3) RETURNING *',[user,another.id,'unrelated']);
        await db.query('UPDATE focus_subtasks SET is_completed=true WHERE id=$1',[unrelated.id]);
        assert.equal((await row('SELECT completed_session_id FROM focus_subtasks WHERE id=$1',[unrelated.id])).completed_session_id,null);
        const paused=await cmd('pause',{id:started.id});
        assert.deepEqual(await cmd('pause',{id:started.id}),paused);
        await db.query("UPDATE focus_sessions SET paused_at=clock_timestamp()-interval '60 seconds' WHERE id=$1",[started.id]);
        const resumed=await cmd('resume',{id:started.id});
        assert.ok(resumed.paused_seconds>=60);
        assert.equal(resumed.paused_at,null);
        assert.deepEqual(await cmd('resume',{id:started.id}),resumed);
        const stopped=await cmd('stop',{id:started.id,notes:'explicit',actual_minutes:7});
        assert.equal(stopped.duration_override_seconds,420);
        assert.equal(stopped.completion_source,'explicit_duration');
        assert.deepEqual(await cmd('stop',{id:started.id}),stopped); // retry preserves original closure
        await db.query('UPDATE focus_tasks SET archived_at=now() WHERE id=$1',[task.id]);
        assert.equal((await row('SELECT task_id FROM focus_sessions WHERE id=$1',[started.id])).task_id,task.id);
        await assert.rejects(db.query('DELETE FROM focus_tasks WHERE id=$1',[task.id]),/history_preserved/);
        await assert.rejects(db.query('DELETE FROM focus_sessions WHERE id=$1',[started.id]),/history_preserved/);
        await assert.rejects(cmd('start',{task_id:task.id}),/unavailable/);

        const exp=await row(`INSERT INTO focus_sessions(user_id,task_id,task_title,started_at,status,planned_duration_minutes)
            VALUES($1,$2,'expiry',clock_timestamp()-interval '2 hours','running',45) RETURNING *`,[user,another.id]);
        const snapshot=JSON.stringify(await row('SELECT * FROM focus_sessions WHERE id=$1',[exp.id]));
        await db.query('SELECT * FROM focus_sessions');
        assert.equal(JSON.stringify(await row('SELECT * FROM focus_sessions WHERE id=$1',[exp.id])),snapshot);
        const expired=await cmd('expire',{id:exp.id});
        assert.equal(expired.completion_source,'estimated_expiry');
        assert.equal(recordedSeconds(expired),2700);
        assert.deepEqual(await cmd('expire',{id:exp.id}),expired);

        const linked=await cmd('start',{task_id:another.id,subtask_id:unrelated.id});
        assert.equal(linked.subtask_id,unrelated.id);
        await assert.rejects(db.query('UPDATE focus_subtasks SET archived_at=now() WHERE id=$1',[unrelated.id]),/open_session/);
        const normalStop=await cmd('stop',{id:linked.id});
        assert.equal(normalStop.completion_source,'explicit_stop');
        assert.equal(normalStop.duration_override_seconds,null);
        assert.ok(recordedSeconds(normalStop)>=0);
        await db.query('UPDATE focus_subtasks SET archived_at=now() WHERE id=$1',[unrelated.id]);
        assert.equal((await row('SELECT subtask_id FROM focus_sessions WHERE id=$1',[linked.id])).subtask_id,unrelated.id);

        const futureBefore=JSON.stringify((await db.query('SELECT * FROM focus_sessions ORDER BY id')).rows);
        await db.exec(migration);
        assert.equal(JSON.stringify((await db.query('SELECT * FROM focus_sessions ORDER BY id')).rows),futureBefore);
        await assert.rejects(db.query("INSERT INTO focus_sessions(user_id,task_id,task_title,status) VALUES($1,$2,'invalid pause','paused')",[user,another.id]),/focus_v0_session_state/);
        assert.equal((await row("SELECT has_function_privilege('authenticated','focus_session_command(uuid,text,jsonb)','execute') AS allowed")).allowed,false);
    } finally { await db.close(); }
});

test('web and MCP commands share services; read paths contain no cleanup writes', () => {
    const server=readFileSync('lib/focus/server.ts','utf8');
    assert.match(server,/createTaskFor/); assert.match(server,/sessionCommand/);
    assert.match(server,/createProjectFor/);
    const projectRoute=readFileSync('app/api/focus/projects/route.ts','utf8');
    // Strategy adds an admin guard around the same shared creation service.
    assert.match(projectRoute,/focusStrategyResponse/);
    assert.match(projectRoute,/createProjectFor\(userId, await req\.json\(\)\)/);
    assert.doesNotMatch(server,/closeExpiredSessions/);
    for(const file of ['route.ts','tasks/route.ts','subtasks/route.ts','current/route.ts','week/route.ts','stats/route.ts']) {
        const text=readFileSync(`app/api/focus/${file}`,'utf8');
        const get=text.slice(text.indexOf('export async function GET'),text.indexOf('export async function POST')<0?undefined:text.indexOf('export async function POST'));
        assert.doesNotMatch(get,/\.(update|insert|upsert|delete|rpc)\(/);
    }
});
