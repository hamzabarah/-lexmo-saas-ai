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

function effectiveSeconds(s: { started_at: string; ended_at: string | null; paused_seconds: number | null }): number {
    if (!s.ended_at) return 0;
    const elapsed = (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 1000;
    return Math.max(0, Math.floor(elapsed - (s.paused_seconds || 0)));
}

// GET: subtasks of a task + per-subtask aggregates
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const taskId = req.nextUrl.searchParams.get('task_id');
    if (!taskId) return NextResponse.json({ error: 'task_id required' }, { status: 400 });

    const admin = getAdmin();

    // Ownership check on parent task
    const { data: parentTask } = await admin
        .from('focus_tasks')
        .select('id, user_id')
        .eq('id', taskId)
        .single();
    if (!parentTask || parentTask.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: subtasks, error } = await admin
        .from('focus_subtasks')
        .select('*')
        .eq('task_id', taskId)
        .order('position', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const subtaskIds = (subtasks || []).map((s: any) => s.id);
    const aggMap = new Map<string, { total_time_seconds: number; sessions_count: number }>();

    if (subtaskIds.length > 0) {
        const { data: sessions } = await admin
            .from('focus_sessions')
            .select('subtask_id, started_at, ended_at, paused_seconds, status')
            .in('subtask_id', subtaskIds);

        for (const s of sessions || []) {
            if (!s.subtask_id) continue;
            const entry = aggMap.get(s.subtask_id) || { total_time_seconds: 0, sessions_count: 0 };
            entry.sessions_count += 1;
            if (s.status === 'completed') {
                entry.total_time_seconds += effectiveSeconds(s);
            }
            aggMap.set(s.subtask_id, entry);
        }
    }

    const enriched = (subtasks || []).map((s: any) => ({
        ...s,
        total_time_seconds: aggMap.get(s.id)?.total_time_seconds || 0,
        sessions_count: aggMap.get(s.id)?.sessions_count || 0,
    }));

    return NextResponse.json({ subtasks: enriched });
}

// POST: create a subtask
export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { task_id, title } = body;

    if (!task_id) return NextResponse.json({ error: 'task_id required' }, { status: 400 });
    if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json({ error: 'title required' }, { status: 400 });
    }

    const admin = getAdmin();

    // Ownership check on parent task
    const { data: parentTask } = await admin
        .from('focus_tasks')
        .select('id, user_id')
        .eq('id', task_id)
        .single();
    if (!parentTask || parentTask.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Compute next position
    const { data: maxRow } = await admin
        .from('focus_subtasks')
        .select('position')
        .eq('task_id', task_id)
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle();
    const nextPosition = (maxRow?.position ?? -1) + 1;

    const { data, error } = await admin
        .from('focus_subtasks')
        .insert({
            task_id,
            user_id: user.id,
            title: title.trim(),
            position: nextPosition,
            is_completed: false,
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ subtask: { ...data, total_time_seconds: 0, sessions_count: 0 } });
}

// PATCH: update title or completion
export async function PATCH(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, title, is_completed } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const admin = getAdmin();

    const { data: existing } = await admin
        .from('focus_subtasks')
        .select('id, user_id')
        .eq('id', id)
        .single();
    if (!existing || existing.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const update: Record<string, any> = { updated_at: new Date().toISOString() };
    if (typeof title === 'string') {
        if (!title.trim()) return NextResponse.json({ error: 'title cannot be empty' }, { status: 400 });
        update.title = title.trim();
    }
    if (typeof is_completed === 'boolean') {
        update.is_completed = is_completed;
        update.completed_at = is_completed ? new Date().toISOString() : null;
    }

    const { data, error } = await admin
        .from('focus_subtasks')
        .update(update)
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ subtask: data });
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
        .from('focus_subtasks')
        .select('id, user_id')
        .eq('id', id)
        .single();
    if (!existing || existing.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await admin.from('focus_subtasks').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
