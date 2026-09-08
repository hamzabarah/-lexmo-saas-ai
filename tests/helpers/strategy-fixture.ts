import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { createClient } from '@supabase/supabase-js';

export const OWNER = '00000000-0000-4000-8000-000000000001';
export const OTHER = '00000000-0000-4000-8000-000000000002';
export async function strategyFixture() {
    const db = new PGlite();
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
        CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY, email text);
        CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;
        CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT '{}'::jsonb $$;`);
    for (const name of ['20260427_focus_sessions', '20260427_focus_tasks', '20260427_focus_subtasks',
        '20260427_focus_task_types', '20260830_focus_projects', '20260830_focus_tasks_archive',
        '20260904_focus_subtask_session', '20260830_focus_bad_habits', '20260908_focus_v0',
        '20260823_pilotage_system', '20260908_focus_strategy']) {
        await db.exec(readFileSync(`supabase/migrations/${name}.sql`, 'utf8'));
    }
    await db.query('INSERT INTO auth.users VALUES ($1,$2),($3,$4)',
        [OWNER, 'operator@example.invalid', OTHER, 'other@example.invalid']);
    const calls: { method: string; table: string }[] = [];
    const identifier = (value: string) => {
        assert.match(value, /^[a-z_]+$/); return `"${value}"`;
    };
    // In-process transport for the actual Supabase query builders and shared
    // services. Every SQL statement executes in isolated PostgreSQL; no network.
    // This intentionally implements only the REST operations exercised below.
    const client = createClient('http://isolated.invalid', 'isolated-test-key', {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { fetch: async (input, init) => {
            const url = new URL(String(input)); assert.equal(url.hostname, 'isolated.invalid');
            const method = init?.method ?? 'GET', table = url.pathname.replace('/rest/v1/', '');
            calls.push({ method, table });
            try {
                const payload = init?.body ? JSON.parse(String(init.body)) : {};
                if (table === 'rpc/focus_project_context') {
                    assert.equal(method, 'POST');
                    const result = await db.query<{ context: unknown }>(
                        'SELECT public.focus_project_context($1,$2) AS context', [payload.p_user, payload.p_project]);
                    return Response.json(result.rows[0].context);
                }
                assert.ok(['focus_projects', 'os_phases', 'project_records'].includes(table));
                const values: unknown[] = [];
                const bind = (value: unknown) => { values.push(value); return `$${values.length}`; };
                let sql = '';
                if (method === 'POST') {
                    const keys = Object.keys(payload);
                    sql = `INSERT INTO ${identifier(table)} (${keys.map(identifier).join(',')}) VALUES (${keys.map(k => bind(payload[k])).join(',')}) RETURNING *`;
                } else {
                    const assignments = method === 'PATCH' ? Object.keys(payload)
                        .map(k => `${identifier(k)}=${bind(payload[k])}`).join(',') : '';
                    const filters: string[] = [];
                    for (const [key, value] of url.searchParams) {
                        if (['select', 'order', 'offset', 'limit'].includes(key)) continue;
                        if (value.startsWith('eq.')) filters.push(`${identifier(key)}=${bind(value.slice(3))}`);
                        else if (value.startsWith('in.(') && value.endsWith(')'))
                            filters.push(`${identifier(key)} IN (${value.slice(4, -1).split(',').map(bind).join(',')})`);
                        else throw new Error('Unsupported isolated filter');
                    }
                    const where = filters.length ? ' WHERE ' + filters.join(' AND ') : '';
                    if (method === 'PATCH') sql = `UPDATE ${identifier(table)} SET ${assignments}${where} RETURNING *`;
                    else {
                        assert.equal(method, 'GET');
                        const order = (url.searchParams.get('order') ?? 'id.asc').split(',').map(o => {
                            const [key, direction] = o.split('.'); assert.ok(['asc', 'desc'].includes(direction));
                            return `${identifier(key)} ${direction}`;
                        }).join(',');
                        sql = `SELECT * FROM ${identifier(table)}${where} ORDER BY ${order}`;
                        for (const key of ['limit', 'offset']) if (url.searchParams.has(key)) {
                            const amount = Number(url.searchParams.get(key)); assert.ok(Number.isSafeInteger(amount) && amount >= 0);
                            sql += ` ${key} ${amount}`;
                        }
                    }
                }
                // PostgreSQL JSON conversion matches PostgREST's numeric/date
                // wire representation, unlike a driver's raw NUMERIC strings.
                const result = await db.query<{ record: unknown }>(
                    `WITH payload_rows AS (${sql}) SELECT to_jsonb(payload_rows) AS record FROM payload_rows`, values);
                const rows = result.rows.map(r => r.record);
                const single = new Headers(init?.headers).get('accept')?.includes('application/vnd.pgrst.object+json');
                if (single && rows.length !== 1)
                    return Response.json({ code: 'PGRST116', message: 'Not one row', details: `${rows.length} rows` }, { status: 406 });
                return Response.json(single ? rows[0] : rows);
            } catch (e) {
                const error = e as { message: string; code?: string };
                return Response.json({ message: error.message, code: error.code ?? 'TEST_ERROR', details: null, hint: null }, { status: 400 });
            }
        } },
    });
    return { db, client, calls };
}
