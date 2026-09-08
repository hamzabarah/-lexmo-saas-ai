import { recordedSeconds, parisDate, parisDayBounds } from '@/lib/focus/time';
import { sessionCommand } from '@/lib/focus/commands';
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

// Effective duration of a finished session (excluding paused time), in seconds.
const effectiveSeconds = recordedSeconds;

// GET: today's sessions (or ?date=YYYY-MM-DD) + computed stats + linked task info
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dateStr = req.nextUrl.searchParams.get('date');
    let bounds;
    try { bounds = parisDayBounds(dateStr || parisDate()); }
    catch { return NextResponse.json({ error: 'Invalid date' }, { status: 400 }); }
    const target = bounds.start, next = bounds.end;

    const admin = getAdmin();
    const { data: sessions, error } = await admin
        .from('focus_sessions')
        // Select the session's subtask, not the inverse completed_session_id relation.
        .select('*, focus_tasks(id, title, category), focus_subtasks!focus_sessions_subtask_id_fkey(id, title)')
        .eq('user_id', user.id)
        .gte('started_at', target.toISOString())
        .lt('started_at', next.toISOString())
        .order('started_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let totalMinutes = 0;
    let completedCount = 0;
    let abandonedCount = 0;
    for (const s of sessions || []) {
        totalMinutes += effectiveSeconds(s) / 60;
        if (s.status === 'completed') {
            completedCount++;

        } else if (s.status === 'abandoned') {
            abandonedCount++;
        }
    }

    return NextResponse.json({
        sessions: sessions || [],
        stats: { totalMinutes: Math.round(totalMinutes), completedCount, abandonedCount },
    });
}

// POST: start a new session (optionally linked to a task)
export async function POST(req: NextRequest) {
    return focusMutation(req, (user, body) => sessionCommand(user, 'start', body), 'session');
}
export async function PATCH(req: NextRequest) {
    return focusMutation(req, (user, body) => sessionCommand(user, String(body.action), body), 'session');
}
