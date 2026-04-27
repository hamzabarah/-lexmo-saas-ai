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

// Effective duration of a finished session (excluding paused time), in seconds.
function effectiveSeconds(s: { started_at: string; ended_at: string | null; paused_seconds: number | null }): number {
    if (!s.ended_at) return 0;
    const elapsed = (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 1000;
    return Math.max(0, Math.floor(elapsed - (s.paused_seconds || 0)));
}

// GET: today's sessions (or ?date=YYYY-MM-DD) + computed stats + linked task info
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dateStr = req.nextUrl.searchParams.get('date');
    const target = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
    target.setHours(0, 0, 0, 0);
    const next = new Date(target);
    next.setDate(target.getDate() + 1);

    const admin = getAdmin();
    const { data: sessions, error } = await admin
        .from('focus_sessions')
        .select('*, focus_tasks(id, title, category), focus_subtasks(id, title)')
        .eq('user_id', user.id)
        .gte('started_at', target.toISOString())
        .lt('started_at', next.toISOString())
        .order('started_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let totalMinutes = 0;
    let completedCount = 0;
    let abandonedCount = 0;
    for (const s of sessions || []) {
        if (s.status === 'completed') {
            completedCount++;
            totalMinutes += Math.floor(effectiveSeconds(s) / 60);
        } else if (s.status === 'abandoned') {
            abandonedCount++;
        }
    }

    return NextResponse.json({
        sessions: sessions || [],
        stats: { totalMinutes, completedCount, abandonedCount },
    });
}

// POST: start a new session (optionally linked to a task)
export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { task_title, category, planned_duration_minutes, task_id, subtask_id } = body;

    if (typeof task_title !== 'string' || !task_title.trim()) {
        return NextResponse.json({ error: 'task_title required' }, { status: 400 });
    }

    if (subtask_id && !task_id) {
        return NextResponse.json({ error: 'subtask_id requires task_id' }, { status: 400 });
    }

    const planned =
        typeof planned_duration_minutes === 'number' && planned_duration_minutes > 0
            ? Math.min(planned_duration_minutes, 60 * 8)
            : 40;

    const admin = getAdmin();

    // If linked to a task, verify ownership and bump task to in_progress
    if (task_id) {
        const { data: task } = await admin
            .from('focus_tasks')
            .select('id, user_id, status')
            .eq('id', task_id)
            .single();
        if (!task || task.user_id !== user.id) {
            return NextResponse.json({ error: 'Invalid task_id' }, { status: 403 });
        }
        if (task.status === 'todo') {
            await admin
                .from('focus_tasks')
                .update({ status: 'in_progress', updated_at: new Date().toISOString() })
                .eq('id', task_id);
        }
    }

    // If linked to a subtask, verify it belongs to the parent task
    if (subtask_id) {
        const { data: subtask } = await admin
            .from('focus_subtasks')
            .select('id, user_id, task_id')
            .eq('id', subtask_id)
            .single();
        if (!subtask || subtask.user_id !== user.id || subtask.task_id !== task_id) {
            return NextResponse.json({ error: 'Invalid subtask_id' }, { status: 403 });
        }
    }

    const { data, error } = await admin
        .from('focus_sessions')
        .insert({
            user_id: user.id,
            task_title: task_title.trim(),
            category: category || null,
            planned_duration_minutes: planned,
            status: 'running',
            task_id: task_id || null,
            subtask_id: subtask_id || null,
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ session: data });
}

// PATCH: pause / resume / stop / abandon
export async function PATCH(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, action, notes, paused_seconds } = body;

    if (!id || !action) {
        return NextResponse.json({ error: 'id & action required' }, { status: 400 });
    }

    const admin = getAdmin();

    const { data: existing } = await admin
        .from('focus_sessions')
        .select('id, user_id')
        .eq('id', id)
        .single();

    if (!existing || existing.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const update: Record<string, any> = { updated_at: new Date().toISOString() };

    switch (action) {
        case 'pause':
            update.status = 'paused';
            break;
        case 'resume':
            update.status = 'running';
            break;
        case 'stop':
            update.status = 'completed';
            update.ended_at = new Date().toISOString();
            break;
        case 'abandon':
            update.status = 'abandoned';
            update.ended_at = new Date().toISOString();
            break;
        default:
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (typeof notes === 'string') update.notes = notes;
    if (typeof paused_seconds === 'number' && paused_seconds >= 0) {
        update.paused_seconds = Math.floor(paused_seconds);
    }

    const { data, error } = await admin
        .from('focus_sessions')
        .update(update)
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ session: data });
}
