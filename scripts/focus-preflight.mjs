// Read-only REST inspection. No application GET endpoints (some legacy ones write).
import { readFileSync } from 'node:fs';
import { parse } from 'dotenv';
const env = { ...parse(readFileSync('.env.local')), ...process.env };
const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Missing Supabase configuration');
async function read(table, columns) {
    const rows = [];
    for (let offset = 0; ; offset += 500) {
        const res = await fetch(`${url}/rest/v1/${table}?select=${columns}&order=id&limit=500&offset=${offset}`, {
            headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) throw new Error(`${table}: HTTP ${res.status} (details suppressed)`);
        const batch = await res.json(); rows.push(...batch);
        if (batch.length < 500) return rows;
    }
}
try {
    const [projects,tasks,subtasks,sessions] = await Promise.all([
        read('focus_projects','id,user_id'),
        read('focus_tasks','id,user_id,project_id,status,completed_at,archived_at'),
        read('focus_subtasks','id,user_id,task_id,completed_session_id'),
        read('focus_sessions','id,user_id,task_id,subtask_id,status,started_at,ended_at,paused_seconds'),
    ]);
    const open = sessions.filter(s => !s.ended_at && ['running','paused'].includes(s.status));
    const counts = new Map(); for (const s of open) counts.set(s.user_id,(counts.get(s.user_id)||0)+1);
    console.log(JSON.stringify({ inspected_at: new Date().toISOString(),
        rows: { projects: projects.length, tasks: tasks.length, subtasks: subtasks.length, sessions: sessions.length },
        open_sessions: open.length, paused_sessions: open.filter(s=>s.status==='paused').length,
        owners_with_multiple_open_sessions: [...counts.values()].filter(n=>n>1).length,
        sessions_without_task: sessions.filter(s=>!s.task_id).length,
        done_without_completed_at: tasks.filter(t=>t.status==='done'&&!t.completed_at).length,
        invalid_session_intervals: sessions.filter(s=>s.ended_at&&Date.parse(s.ended_at)<Date.parse(s.started_at)).length,
        task_project_owner_mismatches: tasks.filter(t=>t.project_id&&projects.find(p=>p.id===t.project_id)?.user_id!==t.user_id).length,
        subtask_session_mismatches: subtasks.filter(t=>t.completed_session_id&&sessions.find(s=>s.id===t.completed_session_id)?.task_id!==t.task_id).length,
    },null,2));
} catch (error) {
    console.error(error instanceof Error && /^focus_/.test(error.message) ? error.message : 'Read-only preflight unavailable; no data changed.');
    process.exitCode = 1;
}
