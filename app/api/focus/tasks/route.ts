import { recordedSeconds, parisDate, parisMidnight, monday } from '@/lib/focus/time';
import { createTaskFor, updateTaskFor, archiveTaskFor } from '@/lib/focus/commands';
import { focusMutation } from '@/lib/focus/http';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const VALID_TYPES = ['recurring', 'one_time', 'long_term'] as const;

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

const effectiveSeconds = recordedSeconds;

// Period boundaries in UTC ms — keeps stats consistent across server invocations
function getPeriodBoundaries() {
    const today = parisDate();
    return { todayStart: +parisMidnight(today), weekStart: +parisMidnight(monday(today)),
        monthStart: +parisMidnight(today.slice(0,7)+'-01') };
}

// GET: tasks (filterable by date / status / type) + per-task time stats
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dateStr = req.nextUrl.searchParams.get('date');
    const status = req.nextUrl.searchParams.get('status');
    const type = req.nextUrl.searchParams.get('type');

    const admin = getAdmin();
    // Les taches archivees (via le serveur MCP) sortent des listes, ici comme
    // la-bas : l'interface web et le MCP doivent voir exactement la meme chose.
    let query = admin.from('focus_tasks').select('*').eq('user_id', user.id).is('archived_at', null);
    if (dateStr) query = query.eq('scheduled_date', dateStr);
    if (status) query = query.eq('status', status);
    if (type && (VALID_TYPES as readonly string[]).includes(type)) {
        query = query.eq('task_type', type);
    }
    query = query.order('created_at', { ascending: false });

    const { data: tasks, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Aggregate session totals per task (single query, JS-side aggregation)
    const taskIds = (tasks || []).map((t: any) => t.id);
    const aggMap = new Map<string, {
        time_today_seconds: number;
        time_this_week_seconds: number;
        time_this_month_seconds: number;
        time_total_seconds: number;
        sessions_count_total: number;
    }>();
    const subtaskMap = new Map<string, { count: number; completed: number }>();

    if (taskIds.length > 0) {
        // Subtasks counters in one query
        const { data: subtaskRows, error: subtasksError } = await admin
            .from('focus_subtasks')
            .select('task_id, is_completed')
            .in('task_id', taskIds).is('archived_at', null);
        if (subtasksError) return NextResponse.json({ error: subtasksError.message }, { status: 500 });
        for (const st of subtaskRows || []) {
            const entry = subtaskMap.get(st.task_id) || { count: 0, completed: 0 };
            entry.count++;
            if (st.is_completed) entry.completed++;
            subtaskMap.set(st.task_id, entry);
        }

        const { data: sessions, error: sessionsError } = await admin
            .from('focus_sessions')
            .select('task_id, started_at, ended_at, paused_seconds, duration_override_seconds, status')
            .in('task_id', taskIds);
        if (sessionsError) return NextResponse.json({ error: sessionsError.message }, { status: 500 });

        const { todayStart, weekStart, monthStart } = getPeriodBoundaries();

        for (const s of sessions || []) {
            if (!s.task_id) continue;
            const entry = aggMap.get(s.task_id) || {
                time_today_seconds: 0,
                time_this_week_seconds: 0,
                time_this_month_seconds: 0,
                time_total_seconds: 0,
                sessions_count_total: 0,
            };
            entry.sessions_count_total += 1;
            if (s.ended_at) {
                const sec = effectiveSeconds(s);
                const startedMs = new Date(s.started_at).getTime();
                entry.time_total_seconds += sec;
                if (startedMs >= monthStart) entry.time_this_month_seconds += sec;
                if (startedMs >= weekStart) entry.time_this_week_seconds += sec;
                if (startedMs >= todayStart) entry.time_today_seconds += sec;
            }
            aggMap.set(s.task_id, entry);
        }
    }

    const enriched = (tasks || []).map((t: any) => {
        const agg = aggMap.get(t.id) || {
            time_today_seconds: 0,
            time_this_week_seconds: 0,
            time_this_month_seconds: 0,
            time_total_seconds: 0,
            sessions_count_total: 0,
        };
        const sub = subtaskMap.get(t.id) || { count: 0, completed: 0 };
        return {
            ...t,
            ...agg,
            subtasks_count: sub.count,
            subtasks_completed_count: sub.completed,
            // Backward-compat aliases
            total_time_seconds: agg.time_total_seconds,
            sessions_count: agg.sessions_count_total,
        };
    });

    const stats = { todo: 0, in_progress: 0, done: 0 };
    for (const t of enriched) {
        if (t.status in stats) (stats as any)[t.status]++;
    }

    return NextResponse.json({ tasks: enriched, stats });
}

// POST: create a task
export async function POST(req: NextRequest) {
    return focusMutation(req, (user, body) => createTaskFor(user, body), 'task');
}
export async function PATCH(req: NextRequest) {
    return focusMutation(req, (user, body) => updateTaskFor(user, String(body.id), body), 'task');
}
export async function DELETE(req: NextRequest) {
    return focusMutation(req, (user, body) => archiveTaskFor(user, String(body.id)));
}
