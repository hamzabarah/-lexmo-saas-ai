import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// Effective seconds for one finished session (excludes paused time)
function effectiveSeconds(s: { started_at: string; ended_at: string | null; paused_seconds: number | null }): number {
    if (!s.ended_at) return 0;
    const elapsed = (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 1000;
    return Math.max(0, Math.floor(elapsed - (s.paused_seconds || 0)));
}

// GET: tasks (filterable by date and status) + stats + per-task aggregates
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dateStr = req.nextUrl.searchParams.get('date');
    const status = req.nextUrl.searchParams.get('status');

    const admin = getAdmin();
    let query = admin.from('focus_tasks').select('*').eq('user_id', user.id);
    if (dateStr) query = query.eq('scheduled_date', dateStr);
    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false });

    const { data: tasks, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Aggregate session totals per task
    const taskIds = (tasks || []).map((t: any) => t.id);
    const aggMap = new Map<string, { total_time_seconds: number; sessions_count: number }>();

    if (taskIds.length > 0) {
        const { data: sessions } = await admin
            .from('focus_sessions')
            .select('task_id, started_at, ended_at, paused_seconds, status')
            .in('task_id', taskIds);

        for (const s of sessions || []) {
            if (!s.task_id) continue;
            const entry = aggMap.get(s.task_id) || { total_time_seconds: 0, sessions_count: 0 };
            entry.sessions_count += 1;
            if (s.status === 'completed') {
                entry.total_time_seconds += effectiveSeconds(s);
            }
            aggMap.set(s.task_id, entry);
        }
    }

    const enriched = (tasks || []).map((t: any) => {
        const agg = aggMap.get(t.id) || { total_time_seconds: 0, sessions_count: 0 };
        return { ...t, total_time_seconds: agg.total_time_seconds, sessions_count: agg.sessions_count };
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
    const { title, description, category, scheduled_date } = body;

    if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json({ error: 'title required' }, { status: 400 });
    }
    if (category && category !== 'personal' && category !== 'professional') {
        return NextResponse.json({ error: 'invalid category' }, { status: 400 });
    }

    const admin = getAdmin();
    const { data, error } = await admin
        .from('focus_tasks')
        .insert({
            user_id: user.id,
            title: title.trim(),
            description: description || null,
            category: category || null,
            scheduled_date: scheduled_date || null,
            status: 'todo',
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ task: data });
}

// PATCH: update a task (title/description/category/scheduled_date/status)
export async function PATCH(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, title, description, category, scheduled_date, status } = body;

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    if (status && !['todo', 'in_progress', 'done'].includes(status)) {
        return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }
    if (category && category !== 'personal' && category !== 'professional') {
        return NextResponse.json({ error: 'invalid category' }, { status: 400 });
    }

    const admin = getAdmin();

    // Ownership check
    const { data: existing } = await admin
        .from('focus_tasks')
        .select('id, user_id, status')
        .eq('id', id)
        .single();
    if (!existing || existing.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const update: Record<string, any> = { updated_at: new Date().toISOString() };
    if (typeof title === 'string') update.title = title.trim();
    if (description !== undefined) update.description = description || null;
    if (category !== undefined) update.category = category || null;
    if (scheduled_date !== undefined) update.scheduled_date = scheduled_date || null;
    if (status) {
        update.status = status;
        if (status === 'done') {
            update.completed_at = new Date().toISOString();
        } else if (existing.status === 'done') {
            // Reverting from done → clear completion timestamp
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

// DELETE: remove a task
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
            /* no body */
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
