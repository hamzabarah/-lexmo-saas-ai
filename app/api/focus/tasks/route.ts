import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const VALID_TYPES = ['recurring', 'one_time', 'long_term'] as const;
type TaskType = typeof VALID_TYPES[number];

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

function effectiveSeconds(s: { started_at: string; ended_at: string | null; paused_seconds: number | null }): number {
    if (!s.ended_at) return 0;
    const elapsed = (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 1000;
    return Math.max(0, Math.floor(elapsed - (s.paused_seconds || 0)));
}

// Period boundaries in UTC ms — keeps stats consistent across server invocations
function getPeriodBoundaries() {
    const now = new Date();
    const todayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const dow = new Date(todayStart).getUTCDay(); // 0=Sun
    const daysSinceMonday = dow === 0 ? 6 : dow - 1;
    const weekStart = todayStart - daysSinceMonday * 86400000;
    const monthStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
    return { todayStart, weekStart, monthStart };
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
    let query = admin.from('focus_tasks').select('*').eq('user_id', user.id);
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

    if (taskIds.length > 0) {
        const { data: sessions } = await admin
            .from('focus_sessions')
            .select('task_id, started_at, ended_at, paused_seconds, status')
            .in('task_id', taskIds);

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
            if (s.status === 'completed') {
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
        return {
            ...t,
            ...agg,
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, description, category, scheduled_date, task_type } = body;

    if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json({ error: 'title required' }, { status: 400 });
    }
    if (category && category !== 'personal' && category !== 'professional') {
        return NextResponse.json({ error: 'invalid category' }, { status: 400 });
    }

    const ttype: TaskType = (task_type && (VALID_TYPES as readonly string[]).includes(task_type))
        ? task_type as TaskType
        : 'one_time';

    // Date rules
    if (ttype === 'recurring') {
        if (scheduled_date) {
            return NextResponse.json({ error: 'recurring tasks must not have a scheduled_date' }, { status: 400 });
        }
    } else {
        if (!scheduled_date) {
            return NextResponse.json({ error: 'scheduled_date required for one_time/long_term' }, { status: 400 });
        }
    }

    const admin = getAdmin();
    const { data, error } = await admin
        .from('focus_tasks')
        .insert({
            user_id: user.id,
            title: title.trim(),
            description: description || null,
            category: category || null,
            scheduled_date: ttype === 'recurring' ? null : scheduled_date,
            task_type: ttype,
            status: 'todo',
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ task: data });
}

// PATCH: update a task
export async function PATCH(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, title, description, category, scheduled_date, status, task_type } = body;

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    if (status && !['todo', 'in_progress', 'done'].includes(status)) {
        return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }
    if (category && category !== 'personal' && category !== 'professional') {
        return NextResponse.json({ error: 'invalid category' }, { status: 400 });
    }
    if (task_type && !(VALID_TYPES as readonly string[]).includes(task_type)) {
        return NextResponse.json({ error: 'invalid task_type' }, { status: 400 });
    }

    const admin = getAdmin();

    const { data: existing } = await admin
        .from('focus_tasks')
        .select('id, user_id, status, task_type')
        .eq('id', id)
        .single();
    if (!existing || existing.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const update: Record<string, any> = { updated_at: new Date().toISOString() };
    if (typeof title === 'string') update.title = title.trim();
    if (description !== undefined) update.description = description || null;
    if (category !== undefined) update.category = category || null;
    if (task_type) {
        update.task_type = task_type;
        // Switching to recurring: clear scheduled_date regardless of what client sent
        if (task_type === 'recurring') {
            update.scheduled_date = null;
        } else if (scheduled_date !== undefined) {
            update.scheduled_date = scheduled_date || null;
        }
    } else if (scheduled_date !== undefined) {
        update.scheduled_date = scheduled_date || null;
    }
    if (status) {
        update.status = status;
        if (status === 'done') {
            update.completed_at = new Date().toISOString();
        } else if (existing.status === 'done') {
            update.completed_at = null;
        }
    }

    const { data, error } = await admin
        .from('focus_tasks')
        .update(update)
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ task: data });
}

// DELETE
export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let id: string | null = req.nextUrl.searchParams.get('id');
    if (!id) {
        try {
            const body = await req.json();
            id = body?.id || null;
        } catch {
            /* */
        }
    }
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const admin = getAdmin();
    const { data: existing } = await admin
        .from('focus_tasks')
        .select('id, user_id')
        .eq('id', id)
        .single();
    if (!existing || existing.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await admin.from('focus_tasks').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
