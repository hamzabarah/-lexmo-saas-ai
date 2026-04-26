import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { stepsContent } from '@/app/(dashboard)/dashboard/phases/stepsData';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// Build phase totals from stepsData (single source of truth for lesson catalog)
function getPhaseTotals(): { byPhase: Record<number, number>; total: number } {
    const byPhase: Record<number, number> = {};
    let total = 0;
    for (const step of stepsContent) {
        const count = step.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
        byPhase[step.stepNumber] = count;
        total += count;
    }
    return { byPhase, total };
}

// GET: return user's full progress + computed stats
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdmin();
    const { data: rows, error } = await admin
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const progress = rows || [];
    const { byPhase: totalsByPhase, total: totalLessons } = getPhaseTotals();

    // Count completed lessons per phase
    const completedByPhase: Record<number, number> = {};
    let completedLessons = 0;
    for (const row of progress) {
        if (row.is_completed) {
            completedByPhase[row.phase_id] = (completedByPhase[row.phase_id] || 0) + 1;
            completedLessons++;
        }
    }

    // Percentage per phase
    const byPhase: Record<number, number> = {};
    for (const phaseId of Object.keys(totalsByPhase)) {
        const pid = Number(phaseId);
        const done = completedByPhase[pid] || 0;
        const tot = totalsByPhase[pid] || 0;
        byPhase[pid] = tot > 0 ? Math.round((done / tot) * 100) : 0;
    }

    const percentageGlobal = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return NextResponse.json({
        progress,
        stats: {
            totalLessons,
            completedLessons,
            percentageGlobal,
            byPhase,
        },
    });
}

// POST: upsert lesson progress
export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { phase_id, lesson_id, completion_method, time_spent_seconds, quiz_score, quiz_total } = body;

    if (typeof phase_id !== 'number' || typeof lesson_id !== 'string') {
        return NextResponse.json({ error: 'Missing or invalid phase_id / lesson_id' }, { status: 400 });
    }

    const admin = getAdmin();

    // Read existing row to preserve fields not sent in this request
    const { data: existing } = await admin
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('phase_id', phase_id)
        .eq('lesson_id', lesson_id)
        .maybeSingle();

    const now = new Date().toISOString();
    const isCompletionEvent = completion_method === 'manual' || completion_method === 'auto_video' || completion_method === 'quiz';

    const payload: Record<string, any> = {
        user_id: user.id,
        phase_id,
        lesson_id,
        updated_at: now,
    };

    // Only set completion fields when this call is actually completing the lesson
    if (isCompletionEvent) {
        payload.is_completed = true;
        payload.completion_method = completion_method;
        payload.completed_at = existing?.completed_at || now;
    }

    // Time spent: accumulate (don't overwrite)
    if (typeof time_spent_seconds === 'number' && time_spent_seconds > 0) {
        payload.time_spent_seconds = (existing?.time_spent_seconds || 0) + time_spent_seconds;
    }

    // Quiz score: keep best
    if (typeof quiz_score === 'number' && typeof quiz_total === 'number') {
        const prevScore = existing?.quiz_score ?? -1;
        if (quiz_score > prevScore) {
            payload.quiz_score = quiz_score;
            payload.quiz_total = quiz_total;
        }
    }

    const { data, error } = await admin
        .from('lesson_progress')
        .upsert(payload, { onConflict: 'user_id,phase_id,lesson_id' })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ row: data });
}
