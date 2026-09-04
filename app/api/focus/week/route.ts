import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { closeExpiredSessions } from '@/lib/focus-session-expiry';
import { startOfWeek, addDays, isoDate } from '@/lib/focus/types';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createAdminClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

/**
 * GET /api/focus/week?start=YYYY-MM-DD
 *
 * Alimente l'agenda hebdomadaire de l'ecran « البيانات ». Lecture seule : cet
 * ecran n'ecrit rien, il ne fait que restituer les sessions enregistrees.
 *
 * `start` est ramene au samedi de la semaine concernee (la semaine arabe
 * commence le samedi). Sans parametre, la semaine courante.
 */
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await closeExpiredSessions(user.id);

    const raw = req.nextUrl.searchParams.get('start');
    const anchor = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T00:00:00`) : new Date();
    if (Number.isNaN(anchor.getTime())) {
        return NextResponse.json({ error: 'invalid start' }, { status: 400 });
    }

    const from = startOfWeek(anchor);
    const to = addDays(from, 7);

    const admin = getAdmin();

    const { data: sessions, error } = await admin
        .from('focus_sessions')
        .select(
            'id, task_id, task_title, notes, planned_duration_minutes, started_at, ended_at, paused_seconds, status, focus_tasks(id, title, project_id)'
        )
        .eq('user_id', user.id)
        .gte('started_at', from.toISOString())
        .lt('started_at', to.toISOString())
        .order('started_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const list = sessions ?? [];

    // Sous-taches validees pendant ces sessions — l'affichage deplie d'un bloc
    // les liste sous la note. Colonne ajoutee par 20260904_focus_subtask_session.
    const sessionIds = list.map((s) => s.id);
    let subtasks: { id: string; title: string; completed_session_id: string | null }[] = [];
    if (sessionIds.length > 0) {
        const { data } = await admin
            .from('focus_subtasks')
            .select('id, title, completed_session_id')
            .eq('user_id', user.id)
            .in('completed_session_id', sessionIds);
        subtasks = data ?? [];
    }

    const { data: projects } = await admin
        .from('focus_projects')
        .select('id, name, color')
        .eq('user_id', user.id);

    // Taches passees a « منجز » pendant la semaine — le chiffre mis en avant.
    const { count: completedTasks } = await admin
        .from('focus_tasks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'done')
        .gte('completed_at', from.toISOString())
        .lt('completed_at', to.toISOString());

    return NextResponse.json({
        weekStart: isoDate(from),
        sessions: list,
        subtasksBySession: subtasks,
        projects: projects ?? [],
        completedTasks: completedTasks ?? 0,
    });
}
