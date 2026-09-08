import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const preflight = readFileSync('supabase/operations/20260908_focus_strategy_READ_ONLY.sql', 'utf8');
const v0 = readFileSync('supabase/migrations/20260908_focus_v0.sql', 'utf8');
const owner = '00000000-0000-4000-8000-000000000001';
const tables = ['auth.users', 'pilotage_objectives', 'focus_projects', 'focus_tasks',
    'focus_subtasks', 'focus_sessions', 'focus_bad_habits', 'focus_habit_checks'];
type Report = {
    marker: string; transaction_read_only: string;
    blockers: { code: string; object: string }[];
    counts: Record<string, number>; data_checks: Record<string, number>;
    event_triggers: { evtname: string; standard_compatible: boolean; applies_to_lot2: boolean; requires_review: boolean }[];
};
async function fixture() {
    const db = new PGlite();
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
      CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text);
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;
      CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT '{}'::jsonb $$;`);
    for (const name of ['20260427_focus_sessions', '20260427_focus_tasks', '20260427_focus_subtasks',
        '20260427_focus_task_types', '20260830_focus_projects', '20260830_focus_tasks_archive',
        '20260904_focus_subtask_session', '20260830_focus_bad_habits', '20260908_focus_v0', '20260823_pilotage_system']) {
        await db.exec(readFileSync(`supabase/migrations/${name}.sql`, 'utf8'));
    }
    await db.exec(`GRANT USAGE ON SCHEMA public TO anon,authenticated,service_role;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
      GRANT ALL ON focus_projects TO anon,authenticated;`);
    await db.query('INSERT INTO auth.users VALUES ($1,$2)', [owner, 'not-returned@example.invalid']);
    await db.exec(`INSERT INTO pilotage_objectives(title,lever,target_value,unit,source_of_truth,due_date)
      VALUES('Do not expose objective content','conversion',1000000,'EUR','source','2028-02-28')`);
    const project = (await db.query<{ id: string }>(
        'INSERT INTO focus_projects(user_id,name) VALUES($1,$2) RETURNING id', [owner, 'Do not expose project content'])).rows[0];
    const task = (await db.query<{ id: string }>(
        'INSERT INTO focus_tasks(user_id,project_id,title) VALUES($1,$2,$3) RETURNING id', [owner, project.id, 'Do not expose task content'])).rows[0];
    await db.query('INSERT INTO focus_subtasks(user_id,task_id,title) VALUES($1,$2,$3)', [owner, task.id, 'Child']);
    const session = (await db.query<{ value: { id: string } }>(
        `SELECT focus_session_command($1,'start',$2::jsonb) AS value`, [owner, JSON.stringify({ task_id: task.id })])).rows[0].value;
    await db.query(`SELECT focus_session_command($1,'stop',$2::jsonb)`, [owner, JSON.stringify({ id: session.id, actual_minutes: 3 })]);
    await db.query(`UPDATE focus_tasks SET status='done' WHERE id=$1`, [task.id]);
    return { db, task };
}
async function run(db: PGlite) {
    const results = await db.exec(preflight);
    const result = results.flatMap(r => r.rows).find(r => 'preflight' in r) as { preflight: Report } | undefined;
    assert.ok(result, 'the complete script returns one JSON report');
    return result.preflight;
}
async function snapshot(db: PGlite) {
    const data: Record<string, unknown> = {};
    for (const table of tables) data[table] = (await db.query(`SELECT to_jsonb(t) AS row FROM ${table} t ORDER BY id`)).rows;
    // Catalog rows, grants, policies and function definitions, not just row counts.
    const catalog = (await db.query(`SELECT jsonb_build_object(
      'tables',(SELECT jsonb_agg(to_jsonb(c) ORDER BY oid) FROM pg_class c WHERE relnamespace IN ('public'::regnamespace,'auth'::regnamespace)),
      'columns',(SELECT jsonb_agg(to_jsonb(a) ORDER BY attrelid,attnum) FROM pg_attribute a WHERE attrelid IN (SELECT oid FROM pg_class WHERE relnamespace IN ('public'::regnamespace,'auth'::regnamespace))),
      'functions',(SELECT jsonb_agg(to_jsonb(p) ORDER BY oid) FROM pg_proc p WHERE pronamespace IN ('public'::regnamespace,'auth'::regnamespace,to_regnamespace('extensions'))),
      'triggers',(SELECT jsonb_agg(to_jsonb(t) ORDER BY oid) FROM pg_trigger t),
      'event_triggers',(SELECT jsonb_agg(to_jsonb(e) ORDER BY oid) FROM pg_event_trigger e),
      'constraints',(SELECT jsonb_agg(to_jsonb(c) ORDER BY oid) FROM pg_constraint c),
      'policies',(SELECT jsonb_agg(to_jsonb(p) ORDER BY oid) FROM pg_policy p),
      'default_privileges',(SELECT jsonb_agg(to_jsonb(d) ORDER BY oid) FROM pg_default_acl d)
    ) AS catalog`)).rows;
    return { data, catalog };
}

test('strategy preflight contains only a read-only transaction, local timeouts and one SELECT', () => {
    const sql = preflight.replace(/--[^\n]*/g, '').replace(/'(?:''|[^'])*'/g, "''");
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
    assert.equal(statements.length, 5);
    assert.equal(statements[0], 'BEGIN READ ONLY');
    assert.match(statements[1], /^SET LOCAL statement_timeout = ''$/);
    assert.match(statements[2], /^SET LOCAL lock_timeout = ''$/);
    assert.match(statements[3], /^WITH\s/);
    assert.doesNotMatch(statements[3], /\b(INSERT|UPDATE|DELETE|MERGE|CREATE|ALTER|DROP|TRUNCATE|DO|CALL|GRANT|REVOKE|COPY|LOCK|nextval|setval|set_config|dblink|pg_notify)\b/i);
    assert.equal(statements[4], 'COMMIT');
    assert.doesNotMatch(statements[3], /public\.focus_session_command\s*\(/);
});

test('V0 function fingerprints in preflight match the repository migration, independently of the database', () => {
    for (const name of ['focus_execution_guard', 'focus_preserve_session', 'focus_session_command']) {
        const body = v0.match(new RegExp(`CREATE OR REPLACE FUNCTION public\\.${name}\\([\\s\\S]*?AS \\$\\$([\\s\\S]*?)\\$\\$;`))?.[1];
        assert.ok(body, name);
        const fingerprint = createHash('md5').update(body.replace(/\r\n/g, '\n')).digest('hex');
        assert.ok(preflight.includes(fingerprint), `${name}: repository body and preflight fingerprint agree`);
    }
});

test('clean populated V0 is accepted with legacy project grants; all rows/catalog/ACLs remain identical', async () => {
    const { db } = await fixture();
    try {
        const before = await snapshot(db);
        const report = await run(db);
        assert.deepEqual(report.blockers, []);
        assert.equal(report.marker, 'FOCUS_STRATEGY_PREFLIGHT_OK');
        assert.equal(report.transaction_read_only, 'on');
        assert.equal(report.counts.focus_sessions, 1);
        assert.equal(report.data_checks.open_sessions, 0);
        assert.deepEqual(await snapshot(db), before);
        assert.doesNotMatch(JSON.stringify(report), /not-returned@example|Do not expose|00000000-0000-4000/);
        assert.deepEqual((await run(db)).blockers, []);
        assert.deepEqual(await snapshot(db), before);
    } finally { await db.close(); }
});

test('preflight rejects conflicts, altered V0 guards, permissions and unsuitable dependencies', async t => {
    const cases = [
        ['phase table conflict', 'CREATE TABLE os_phases(id uuid)', 'new_relation_name_conflict'],
        ['phase type conflict', "CREATE TYPE os_phases AS ENUM ('existing')", 'new_type_name_conflict'],
        ['project column conflict', 'ALTER TABLE focus_projects ADD COLUMN engine text', 'new_project_column_conflict'],
        ['record table conflict', 'CREATE TABLE project_records(id uuid)', 'new_relation_name_conflict'],
        ['reserved index conflict', 'CREATE INDEX focus_projects_active ON focus_projects(id)', 'new_relation_name_conflict'],
        ['objective key missing', 'ALTER TABLE pilotage_objectives DROP CONSTRAINT pilotage_objectives_pkey CASCADE', 'referenced_id_not_uuid_nonnull_unique'],
        ['guard disabled', 'ALTER TABLE focus_sessions DISABLE TRIGGER focus_session_history_guard', 'v0_trigger_missing_disabled_or_changed'],
        ['guard body changed', "CREATE OR REPLACE FUNCTION public.focus_preserve_session() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN RETURN NEW; END $$", 'v0_function_changed_or_missing'],
        ['RPC client execute', 'GRANT EXECUTE ON FUNCTION focus_session_command(uuid,text,jsonb) TO authenticated', 'v0_rpc_client_permission_unsafe'],
        ['session table grant', 'GRANT TRUNCATE ON focus_sessions TO anon', 'v0_session_table_permission_unsafe'],
        ['session column grant', 'GRANT UPDATE(notes) ON focus_sessions TO authenticated', 'v0_session_column_permission_unsafe'],
        ['service bypass missing', 'ALTER ROLE service_role NOBYPASSRLS', 'service_role_missing_bypassrls'],
        ['RLS disabled', 'ALTER TABLE pilotage_objectives DISABLE ROW LEVEL SECURITY', 'rls_missing_or_non_table'],
        ['open uniqueness removed', 'DROP INDEX focus_one_open_v0', 'v0_open_session_index_changed_or_missing'],
        ['state constraint changed', 'ALTER TABLE focus_sessions DROP CONSTRAINT focus_v0_session_state; ALTER TABLE focus_sessions ADD CONSTRAINT focus_v0_session_state CHECK (true)', 'v0_state_constraint_changed_or_missing'],
        ['unexpected dependent view', 'CREATE VIEW unexpected_strategy_dependency AS SELECT id FROM focus_projects', 'dependent_view_review'],
        ['applicable DDL event trigger', `CREATE FUNCTION ddl_probe() RETURNS event_trigger LANGUAGE plpgsql AS $$ BEGIN RETURN; END $$;
          CREATE EVENT TRIGGER ddl_probe ON ddl_command_end WHEN TAG IN ('CREATE TABLE') EXECUTE FUNCTION ddl_probe()`, 'enabled_event_trigger_review'],
        ['constraint drop event trigger', `CREATE FUNCTION drop_probe() RETURNS event_trigger LANGUAGE plpgsql AS $$ BEGIN RETURN; END $$;
          CREATE EVENT TRIGGER drop_probe ON sql_drop WHEN TAG IN ('ALTER TABLE') EXECUTE FUNCTION drop_probe()`, 'enabled_event_trigger_review'],
        ['atypical replication mode', "SET session_replication_role='replica'", 'atypical_session_replication_role'],
        ['already applied strategy', readFileSync('supabase/migrations/20260908_focus_strategy.sql', 'utf8'), 'new_project_column_conflict'],
    ] as const;
    for (const [name, change, expected] of cases) await t.test(name, async () => {
        const { db } = await fixture();
        try {
            await db.exec(change);
            const before = await snapshot(db);
            const report = await run(db);
            assert.equal(report.marker, 'FOCUS_STRATEGY_PREFLIGHT_BLOCKED');
            assert.ok(report.blockers.some(b => b.code === expected), JSON.stringify(report.blockers));
            assert.deepEqual(await snapshot(db), before);
        } finally { await db.close(); }
    });
});

test('an event trigger restricted to CREATE EXTENSION cannot run during this migration and does not block', async () => {
    const { db } = await fixture();
    try {
        await db.exec(`CREATE FUNCTION extension_probe() RETURNS event_trigger LANGUAGE plpgsql AS $$ BEGIN RETURN; END $$;
          CREATE EVENT TRIGGER extension_probe ON ddl_command_end WHEN TAG IN ('CREATE EXTENSION') EXECUTE FUNCTION extension_probe()`);
        const before = await snapshot(db);
        const report = await run(db);
        assert.equal(report.marker, 'FOCUS_STRATEGY_PREFLIGHT_OK');
        assert.deepEqual(report.blockers, []);
        assert.deepEqual(await snapshot(db), before);
    } finally { await db.close(); }
});

test('insufficient pg_stat_activity visibility blocks instead of silently reporting zero activity as safe', async () => {
    const { db } = await fixture();
    try {
        await db.exec('GRANT USAGE ON SCHEMA auth TO service_role; GRANT SELECT ON auth.users TO service_role; SET ROLE service_role');
        const report = await run(db);
        assert.equal(report.marker, 'FOCUS_STRATEGY_PREFLIGHT_BLOCKED');
        assert.ok(report.blockers.some(b => b.code === 'activity_visibility_insufficient'));
        await db.exec('RESET ROLE');
    } finally { await db.close(); }
});

test('an open session blocks the intervention without expiring, closing or modifying it', async () => {
    const { db, task } = await fixture();
    try {
        await db.query(`UPDATE focus_tasks SET status='todo' WHERE id=$1`, [task.id]);
        await db.query(`SELECT focus_session_command($1,'start',$2::jsonb)`, [owner, JSON.stringify({ task_id: task.id })]);
        const before = await snapshot(db);
        const report = await run(db);
        assert.equal(report.marker, 'FOCUS_STRATEGY_PREFLIGHT_BLOCKED');
        assert.ok(report.blockers.some(b => b.code === 'open_sessions_close_explicitly_before_migration'));
        assert.equal(report.data_checks.open_sessions, 1);
        assert.deepEqual(await snapshot(db), before);
    } finally { await db.close(); }
});

// Official Supabase PostgreSQL definitions, pinned to upstream commit
// ea6aa74e43a9da0032626361535e5aa3cd698bda (not production observations).
// https://github.com/supabase/postgres/tree/ea6aa74e43a9da0032626361535e5aa3cd698bda/migrations/db/migrations
// Only the event function definitions are copied; platform migrations are never
// executed by this fixture. Preserve body whitespace for independent digests.
const officialHooks = {
    // migrations/db/migrations/20220321174452_fix-postgrest-alter-type-event-trigger.sql
    ddl: `CREATE OR REPLACE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$ LANGUAGE plpgsql;`,
    // migrations/db/migrations/20220321174452_fix-postgrest-alter-type-event-trigger.sql
    drop: `CREATE OR REPLACE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$ LANGUAGE plpgsql;`,
    // migrations/db/migrations/20220317095840_pg_graphql.sql
    graphql2022: `CREATE OR REPLACE FUNCTION extensions.grant_pg_graphql_access()
RETURNS event_trigger
LANGUAGE plpgsql
AS $func$
    DECLARE
    func_is_graphql_resolve bool;
    BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant all on function graphql.resolve to postgres, anon, authenticated, service_role;

        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            SELECT graphql.resolve(query, coalesce(variables, '{}'));
        $$;

        grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    END IF;

    END;
$func$;`,
    // migrations/db/migrations/20231017062225_grant_pg_graphql_permissions_for_custom_roles.sql
    graphql2023: `create or replace function extensions.grant_pg_graphql_access()
    returns event_trigger
    language plpgsql
AS $func$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when \`graphql.resolve\` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after \`graphql.resolve\`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$func$;`,
    // migrations/db/migrations/20260421000001_rescope_pg_graphql_access_trigger.sql
    graphql2026: `create or replace function extensions.grant_pg_graphql_access()
    returns event_trigger
    language plpgsql
as $func$
begin
    if not exists (
        select 1
        from pg_event_trigger_ddl_commands() ev
        join pg_catalog.pg_extension e on ev.objid = e.oid
        where e.extname = 'pg_graphql'
    ) then
        return;
    end if;

    drop function if exists graphql_public.graphql;
    create or replace function graphql_public.graphql(
        "operationName" text default null,
        query text default null,
        variables jsonb default null,
        extensions jsonb default null
    )
        returns jsonb
        language sql
    as $$
        select graphql.resolve(
            query := query,
            variables := coalesce(variables, '{}'),
            "operationName" := "operationName",
            extensions := extensions
        );
    $$;

    -- Attach the wrapper to the extension so DROP EXTENSION cascades to it,
    -- which in turn triggers set_graphql_placeholder to reinstall the "not enabled" stub.
    alter extension pg_graphql add function graphql_public.graphql(text, text, jsonb, jsonb);

    grant usage on schema graphql to postgres, anon, authenticated, service_role;
    grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    grant usage on schema graphql to postgres with grant option;
    grant usage on schema graphql_public to postgres with grant option;
end;
$func$;`,
} as const;

type GraphqlVersion = 'graphql2022' | 'graphql2023' | 'graphql2026';
async function installOfficialHooks(db: PGlite, graphql: GraphqlVersion = 'graphql2023') {
    // Platform migrations run as supabase_admin (upstream migrations/db/migrate.sh).
    // No extensions, GraphQL implementation or production services are installed.
    await db.exec('CREATE ROLE supabase_admin SUPERUSER; CREATE SCHEMA extensions AUTHORIZATION supabase_admin; SET ROLE supabase_admin');
    await db.exec(officialHooks.ddl);
    await db.exec(officialHooks.drop);
    await db.exec(officialHooks[graphql]);
    await db.exec(`CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end EXECUTE FUNCTION extensions.pgrst_ddl_watch();
      CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop EXECUTE FUNCTION extensions.pgrst_drop_watch();
      CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
        WHEN TAG IN ('${graphql === 'graphql2026' ? 'CREATE EXTENSION' : 'CREATE FUNCTION'}')
        EXECUTE FUNCTION extensions.grant_pg_graphql_access(); RESET ROLE;`);
}

test('official Supabase hook fixture bodies independently match the pinned source fingerprints', () => {
    const expected = {
        ddl: '7f27b8118fea5c88b0164331292859e3', drop: 'bc09cc3003d66f91844af4cb05e203b7',
        graphql2022: '03f711be02dbeee5204473fe9349832d', graphql2023: '27ec0d7b5d11307e5bb2bb2226d07a71',
        graphql2026: '6bb1d2b391560d7101764157104ba354',
    };
    for (const [name, definition] of Object.entries(officialHooks)) {
        const body = definition.match(/\bAS\s+(\$\w*\$)([\s\S]*?)\1/i)?.[2];
        assert.ok(body, name);
        assert.equal(createHash('md5').update(body.replace(/\r\n/g, '\n')).digest('hex'), expected[name as keyof typeof expected]);
    }
});

test('official Supabase hooks pass read-only preflight and Lot 2 migration preserves existing business/history rows', async t => {
    for (const graphql of ['graphql2022', 'graphql2023', 'graphql2026'] as const) await t.test(graphql, async () => {
        const { db } = await fixture();
        try {
            await installOfficialHooks(db, graphql);
            const before = await snapshot(db);
            const report = await run(db);
            assert.equal(report.marker, 'FOCUS_STRATEGY_PREFLIGHT_OK', JSON.stringify(report.blockers));
            assert.equal(report.transaction_read_only, 'on');
            assert.equal(report.event_triggers.length, 3);
            assert.ok(report.event_triggers.every(e => e.standard_compatible && !e.requires_review));
            assert.equal(report.event_triggers.find(e => e.evtname === 'issue_pg_graphql_access')?.applies_to_lot2, graphql !== 'graphql2026');
            assert.deepEqual(await snapshot(db), before);
            // Run the actual unchanged additive migration while the real hook bodies
            // execute. The two PostgREST hooks may emit local schema reload NOTIFY;
            // the GraphQL hook must not change schemas or grants for Focus functions.
            await db.exec(readFileSync('supabase/migrations/20260908_focus_strategy.sql', 'utf8'));
            const after = await snapshot(db);
            for (const table of tables.filter(name => name !== 'focus_projects')) {
                assert.deepEqual(after.data[table], before.data[table], table);
            }
            const priorProjects = before.data.focus_projects as { row: Record<string, unknown> }[];
            const laterProjects = after.data.focus_projects as { row: Record<string, unknown> }[];
            assert.equal(laterProjects.length, priorProjects.length);
            priorProjects.forEach(({ row: old }, i) => {
                assert.deepEqual(Object.fromEntries(Object.keys(old).map(key => [key, laterProjects[i].row[key]])), old);
                assert.equal(laterProjects[i].row.priority, 'normal');
                assert.equal(laterProjects[i].row.phase_id, null);
            });
            const beforeCatalog = (before.catalog[0] as { catalog: Record<string, unknown> }).catalog;
            const afterCatalog = (after.catalog[0] as { catalog: Record<string, unknown> }).catalog;
            assert.deepEqual(afterCatalog.event_triggers, beforeCatalog.event_triggers);
            assert.deepEqual(afterCatalog.default_privileges, beforeCatalog.default_privileges);
            for (const key of ['os_phases', 'project_records']) {
                assert.deepEqual((await db.query(`SELECT * FROM ${key}`)).rows, []);
            }
            assert.deepEqual((await db.query("SELECT nspname FROM pg_namespace WHERE nspname IN ('graphql','graphql_public')")).rows, []);
        } finally { await db.close(); }
    });
});

test('Supabase-looking hook names do not bypass body, tags, identity, owner or execution-context checks', async t => {
    const cases: [string, (db: PGlite) => Promise<unknown>][] = [
        ['body changed', db => db.exec(officialHooks.ddl.replace('DECLARE', '-- altered body for negative fixture\nDECLARE'))],
        ['tags broadened', db => db.exec(`DROP EVENT TRIGGER issue_pg_graphql_access; SET ROLE supabase_admin;
          CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end WHEN TAG IN ('CREATE FUNCTION','ALTER TABLE')
          EXECUTE FUNCTION extensions.grant_pg_graphql_access(); RESET ROLE`)],
        ['different target function', db => db.exec(`${officialHooks.ddl.replace('extensions.pgrst_ddl_watch()', 'extensions.different_watch()')}
          ALTER FUNCTION extensions.different_watch() OWNER TO supabase_admin;
          DROP EVENT TRIGGER pgrst_ddl_watch; SET ROLE supabase_admin;
          CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end EXECUTE FUNCTION extensions.different_watch(); RESET ROLE`)],
        ['function owner changed', db => db.exec('ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO CURRENT_USER')],
        ['event owner changed', db => db.exec('ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO CURRENT_USER')],
        ['search path changed', db => db.exec('ALTER FUNCTION extensions.pgrst_ddl_watch() SET search_path=pg_catalog')],
        ['security definer changed', db => db.exec('ALTER FUNCTION extensions.pgrst_ddl_watch() SECURITY DEFINER')],
        ['enabled always instead of origin', db => db.exec('ALTER EVENT TRIGGER pgrst_ddl_watch ENABLE ALWAYS')],
    ];
    for (const [name, change] of cases) await t.test(name, async () => {
        const { db } = await fixture();
        try {
            await installOfficialHooks(db);
            await change(db);
            const before = await snapshot(db);
            const report = await run(db);
            assert.equal(report.marker, 'FOCUS_STRATEGY_PREFLIGHT_BLOCKED');
            assert.ok(report.blockers.some(b => b.code === 'enabled_event_trigger_review'), JSON.stringify(report.blockers));
            assert.ok(report.event_triggers.some(e => !e.standard_compatible && e.requires_review));
            assert.deepEqual(await snapshot(db), before);
        } finally { await db.close(); }
    });
});

// Observed Supabase variant: the official 2026 definition differs in exactly
// one qualified catalog call. Keep the upstream fixture above unchanged.
const observedGraphqlDefinition = officialHooks.graphql2026.replace(
    'from pg_event_trigger_ddl_commands()', 'from pg_catalog.pg_event_trigger_ddl_commands()');
async function installObservedHooks(db: PGlite) {
    await installOfficialHooks(db, 'graphql2026');
    await db.exec(`SET ROLE supabase_admin; ${observedGraphqlDefinition}
      ALTER FUNCTION extensions.pgrst_ddl_watch() SET search_path TO '';
      ALTER FUNCTION extensions.pgrst_drop_watch() SET search_path TO '';
      ALTER FUNCTION extensions.grant_pg_graphql_access() SET search_path TO '';
      DROP EVENT TRIGGER issue_pg_graphql_access;
      CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end WHEN TAG IN ('CREATE FUNCTION')
        EXECUTE FUNCTION extensions.grant_pg_graphql_access(); RESET ROLE;`);
}
async function hookSettings(db: PGlite) {
    return (await db.query<{ proname: string; proconfig: string[] | null }>(`SELECT proname,proconfig FROM pg_proc
      WHERE pronamespace='extensions'::regnamespace ORDER BY proname`)).rows;
}

test('observed GraphQL fingerprint follows from one catalog qualification in the official 2026 body', () => {
    assert.equal((officialHooks.graphql2026.match(/from pg_event_trigger_ddl_commands\(\)/g) ?? []).length, 1);
    assert.equal(observedGraphqlDefinition.replace('from pg_catalog.pg_event_trigger_ddl_commands()',
        'from pg_event_trigger_ddl_commands()'), officialHooks.graphql2026);
    const body = observedGraphqlDefinition.match(/\bAS\s+(\$\w*\$)([\s\S]*?)\1/i)?.[2];
    assert.ok(body);
    assert.equal(createHash('md5').update(body.replace(/\r\n/g, '\n')).digest('hex'), 'dd3f3e2bb94cff45ef24b9cecb6af1c8');
});

test('observed empty-search-path hooks reproduce the prior false rejection and pass the guarded preflight/migration', async () => {
    const { db } = await fixture();
    try {
        await installObservedHooks(db);
        const settings = await hookSettings(db);
        assert.equal(settings.length, 3);
        for (const entry of settings) assert.deepEqual(entry.proconfig, ['search_path=""']);
        assert.deepEqual((await db.query("SELECT extname FROM pg_extension WHERE extname='pg_graphql'")).rows, []);
        // The previous matcher required proconfig IS NULL for every official
        // function. These three real catalog shapes therefore could not match,
        // independently of names, ownership or their unchanged behavior.
        const priorMatcher = (await db.query<{ compatible: boolean }>(`SELECT p.proconfig IS NULL
          AND md5(replace(p.prosrc,chr(13)||chr(10),chr(10)))=ANY(ARRAY[
            '7f27b8118fea5c88b0164331292859e3','bc09cc3003d66f91844af4cb05e203b7',
            '03f711be02dbeee5204473fe9349832d','27ec0d7b5d11307e5bb2bb2226d07a71',
            '6bb1d2b391560d7101764157104ba354']) AS compatible
          FROM pg_proc p WHERE p.pronamespace='extensions'::regnamespace`)).rows;
        assert.deepEqual(priorMatcher, [{ compatible: false }, { compatible: false }, { compatible: false }]);
        const before = await snapshot(db);
        const report = await run(db);
        assert.equal(report.marker, 'FOCUS_STRATEGY_PREFLIGHT_OK', JSON.stringify(report.blockers));
        assert.equal(report.transaction_read_only, 'on');
        assert.equal(report.event_triggers.length, 3);
        assert.ok(report.event_triggers.every(e => e.standard_compatible && e.applies_to_lot2 && !e.requires_review));
        assert.deepEqual(await snapshot(db), before);
        await db.exec(readFileSync('supabase/migrations/20260908_focus_strategy.sql', 'utf8'));
        const after = await snapshot(db);
        for (const table of tables.filter(name => name !== 'focus_projects')) {
            assert.deepEqual(after.data[table], before.data[table], table);
        }
        const oldProjects = before.data.focus_projects as { row: Record<string, unknown> }[];
        const newProjects = after.data.focus_projects as { row: Record<string, unknown> }[];
        assert.equal(newProjects.length, oldProjects.length);
        oldProjects.forEach(({ row: old }, i) => {
            assert.deepEqual(Object.fromEntries(Object.keys(old).map(key => [key, newProjects[i].row[key]])), old);
        });
        const beforeCatalog = (before.catalog[0] as { catalog: Record<string, unknown> }).catalog;
        const afterCatalog = (after.catalog[0] as { catalog: Record<string, unknown> }).catalog;
        assert.deepEqual(afterCatalog.event_triggers, beforeCatalog.event_triggers);
        assert.deepEqual(afterCatalog.default_privileges, beforeCatalog.default_privileges);
        assert.deepEqual(await hookSettings(db), settings);
        assert.deepEqual((await db.query("SELECT nspname FROM pg_namespace WHERE nspname IN ('graphql','graphql_public')")).rows, []);
        assert.deepEqual((await db.query('SELECT * FROM os_phases')).rows, []);
        assert.deepEqual((await db.query('SELECT * FROM project_records')).rows, []);
    } finally { await db.close(); }
});

test('observed hook support remains strict about config, body and event tags', async t => {
    const cases: [string, (db: PGlite) => Promise<unknown>][] = [
        ['nonempty search path', db => db.exec('ALTER FUNCTION extensions.grant_pg_graphql_access() SET search_path=pg_catalog')],
        ['additional function setting', db => db.exec("ALTER FUNCTION extensions.grant_pg_graphql_access() SET work_mem='8MB'")],
        ['missing empty search path', db => db.exec('ALTER FUNCTION extensions.grant_pg_graphql_access() RESET search_path')],
        ['different observed body', db => db.exec(`${observedGraphqlDefinition.replace('begin\n', 'begin\n    -- negative fixture: changed body\n')}
          ALTER FUNCTION extensions.grant_pg_graphql_access() SET search_path TO ''`)],
        ['different observed event tags', db => db.exec(`DROP EVENT TRIGGER issue_pg_graphql_access; SET ROLE supabase_admin;
          CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end WHEN TAG IN ('CREATE FUNCTION','CREATE TABLE')
          EXECUTE FUNCTION extensions.grant_pg_graphql_access(); RESET ROLE`)],
    ];
    for (const [name, change] of cases) await t.test(name, async () => {
        const { db } = await fixture();
        try {
            await installObservedHooks(db);
            await change(db);
            const before = await snapshot(db);
            const report = await run(db);
            assert.equal(report.marker, 'FOCUS_STRATEGY_PREFLIGHT_BLOCKED');
            assert.ok(report.blockers.some(b => b.code === 'enabled_event_trigger_review'), JSON.stringify(report.blockers));
            assert.deepEqual(await snapshot(db), before);
        } finally { await db.close(); }
    });
});

test('observed legacy GraphQL event binding is blocked when pg_graphql is present', async () => {
    const { db } = await fixture();
    try {
        await installObservedHooks(db);
        // Isolated in-memory catalog fixture ONLY: PGlite has no pg_graphql
        // package. Insert its presence marker, never load an extension or call
        // GraphQL. No corresponding operation is performed against Supabase.
        await db.exec(`INSERT INTO pg_catalog.pg_extension
          (oid,extname,extowner,extnamespace,extrelocatable,extversion)
          SELECT 42424242,'pg_graphql',r.oid,'public'::regnamespace,false,'isolated-marker-only'
          FROM pg_roles r WHERE r.rolname=current_user`);
        const extensionBefore = (await db.query('SELECT to_jsonb(e) AS row FROM pg_extension e ORDER BY oid')).rows;
        const before = await snapshot(db);
        const report = await run(db);
        assert.equal(report.marker, 'FOCUS_STRATEGY_PREFLIGHT_BLOCKED');
        assert.ok(report.blockers.some(b => b.code === 'graphql_extension_present_with_legacy_event_binding'), JSON.stringify(report.blockers));
        assert.ok(report.blockers.some(b => b.code === 'enabled_event_trigger_review'));
        assert.equal(report.event_triggers.find(e => e.evtname === 'issue_pg_graphql_access')?.standard_compatible, false);
        assert.deepEqual(await snapshot(db), before);
        assert.deepEqual((await db.query('SELECT to_jsonb(e) AS row FROM pg_extension e ORDER BY oid')).rows, extensionBefore);
    } finally { await db.close(); }
});
