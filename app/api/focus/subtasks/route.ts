import { recordedSeconds } from '@/lib/focus/time';
import { createSubtaskFor, updateSubtaskFor, archiveSubtaskFor } from '@/lib/focus/commands';
import { focusMutation } from '@/lib/focus/http';
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

const effectiveSeconds = recordedSeconds;

// GET: subtasks of a task + per-subtask aggregates
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const taskId = req.nextUrl.searchParams.get('task_id');
    const admin = getAdmin();

    // Ownership check on parent task
    if (taskId) {
        const { data: parentTask } = await admin
            .from('focus_tasks')
            .select('id, user_id')
            .eq('id', taskId)
            .single();
        if (!parentTask || parentTask.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    // Sans task_id : toutes les sous-taches de l'utilisateur. Le kanban en a
    // besoin d'un coup pour afficher le compteur et la barre de chaque carte
    // — une requete par carte serait un N+1 a l'ouverture de l'ecran.
    let query = admin.from('focus_subtasks').select('*').eq('user_id', user.id).is('archived_at', null);
    if (taskId) query = query.eq('task_id', taskId);

    const { data: subtasks, error } = await query
        .order('position', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const subtaskIds = (subtasks || []).map((s: any) => s.id);
    const aggMap = new Map<string, { total_time_seconds: number; sessions_count: number }>();

    if (subtaskIds.length > 0) {
        const { data: sessions, error: sessionsError } = await admin
            .from('focus_sessions')
            .select('subtask_id, started_at, ended_at, paused_seconds, duration_override_seconds, status')
            .in('subtask_id', subtaskIds);
        if (sessionsError) return NextResponse.json({ error: sessionsError.message }, { status: 500 });

        for (const s of sessions || []) {
            if (!s.subtask_id) continue;
            const entry = aggMap.get(s.subtask_id) || { total_time_seconds: 0, sessions_count: 0 };
            entry.sessions_count += 1;
            if (s.ended_at) {
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
    return focusMutation(req, (user, body) => createSubtaskFor(user, body), 'subtask');
}
export async function PATCH(req: NextRequest) {
    return focusMutation(req, (user, body) => updateSubtaskFor(user, String(body.id), body), 'subtask');
}
export async function DELETE(req: NextRequest) {
    return focusMutation(req, (user, body) => archiveSubtaskFor(user, String(body.id)));
}
