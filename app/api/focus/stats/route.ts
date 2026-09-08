import { recordedSeconds, parisDate, parisMidnight, addCalendarDays, monday } from '@/lib/focus/time';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

type Period = 'week' | 'month';

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

const effectiveSeconds = recordedSeconds;

const isoDay = parisDate;
function periodBounds(period: Period) {
    const today = parisDate();
    if (period === 'week') {
        const start = monday(today);
        return { current: { start: parisMidnight(start), end: parisMidnight(addCalendarDays(start,7)) },
            previous: { start: parisMidnight(addCalendarDays(start,-7)), end: parisMidnight(start) } };
    }
    const first = today.slice(0,7)+'-01';
    const next = new Date(first+'T12:00:00Z'); next.setUTCMonth(next.getUTCMonth()+1);
    const prev = new Date(first+'T12:00:00Z'); prev.setUTCMonth(prev.getUTCMonth()-1);
    return { current: { start: parisMidnight(first), end: parisMidnight(next.toISOString().slice(0,10)) },
        previous: { start: parisMidnight(prev.toISOString().slice(0,10)), end: parisMidnight(first) } };
}
function generateDayKeys(start: Date, end: Date) {
    const days: string[] = [];
    for (let day = parisDate(start); day < parisDate(end); day = addCalendarDays(day,1)) days.push(day);
    return days;
}

interface SessionRow {
    duration_override_seconds?: number | null;
    id: string;
    started_at: string;
    ended_at: string | null;
    paused_seconds: number | null;
    status: 'running' | 'paused' | 'completed' | 'abandoned';
    task_id: string | null;
    focus_tasks: { category: string | null; title: string | null; task_type: string | null } | null;
}

function summarize(sessions: SessionRow[], dayKeys: string[]) {
    const byDayMap = new Map<string, { seconds: number; sessions: number }>();
    for (const k of dayKeys) byDayMap.set(k, { seconds: 0, sessions: 0 });

    const byCategory = { personal: 0, professional: 0, uncategorized: 0 };
    const byTask = new Map<
        string,
        { task_id: string; title: string; category: string | null; task_type: string | null; total_seconds: number; sessions_count: number }
    >();

    let totalSeconds = 0;
    let totalSessions = 0;
    let completedSessions = 0;
    let abandonedSessions = 0;

    for (const s of sessions) {
        totalSessions++;
        if (s.status === 'abandoned') abandonedSessions++;
        const dayKey = isoDay(new Date(s.started_at));
        const dayBucket = byDayMap.get(dayKey);
        if (dayBucket) dayBucket.sessions += 1;

        if (!s.ended_at) continue;

        if (s.status === 'completed') completedSessions++;
        const sec = effectiveSeconds(s);
        totalSeconds += sec;
        if (dayBucket) dayBucket.seconds += sec;

        // Category: from linked task (if any) — else "uncategorized"
        const cat = s.focus_tasks?.category;
        if (cat === 'personal') byCategory.personal += sec;
        else if (cat === 'professional') byCategory.professional += sec;
        else byCategory.uncategorized += sec;

        // Task aggregate (only if linked)
        if (s.task_id) {
            const entry = byTask.get(s.task_id) || {
                task_id: s.task_id,
                title: s.focus_tasks?.title || '',
                category: s.focus_tasks?.category || null,
                task_type: s.focus_tasks?.task_type || null,
                total_seconds: 0,
                sessions_count: 0,
            };
            entry.total_seconds += sec;
            entry.sessions_count += 1;
            byTask.set(s.task_id, entry);
        }
    }

    const by_day = dayKeys.map((k) => ({
        date: k,
        seconds: byDayMap.get(k)!.seconds,
        sessions: byDayMap.get(k)!.sessions,
    }));

    const top_tasks = Array.from(byTask.values())
        .sort((a, b) => b.total_seconds - a.total_seconds)
        .slice(0, 5);

    return {
        total_seconds: totalSeconds,
        total_sessions: totalSessions,
        completed_sessions: completedSessions,
        abandoned_sessions: abandonedSessions,
        by_day,
        by_category: byCategory,
        top_tasks,
    };
}

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const periodParam = (req.nextUrl.searchParams.get('period') || 'week') as Period;
    if (periodParam !== 'week' && periodParam !== 'month') {
        return NextResponse.json({ error: 'invalid period' }, { status: 400 });
    }
    const compare = req.nextUrl.searchParams.get('compare') !== 'false';

    const { current, previous } = periodBounds(periodParam);

    const admin = getAdmin();

    // Fetch all sessions in [previous.start, current.end[ to cover both periods in one query
    const earliest = compare ? previous.start : current.start;
    const { data: rows, error } = await admin
        .from('focus_sessions')
        .select('id, started_at, ended_at, paused_seconds, duration_override_seconds, status, task_id, focus_tasks(category, title, task_type)')
        .eq('user_id', user.id)
        .gte('started_at', earliest.toISOString())
        .lt('started_at', current.end.toISOString())
        .order('started_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const all = (rows || []) as unknown as SessionRow[];
    const inCurrent = all.filter(
        (s) => new Date(s.started_at) >= current.start && new Date(s.started_at) < current.end
    );
    const inPrevious = compare
        ? all.filter(
              (s) =>
                  new Date(s.started_at) >= previous.start && new Date(s.started_at) < previous.end
          )
        : [];

    const currentDays = generateDayKeys(current.start, current.end);
    const currentSummary = summarize(inCurrent, currentDays);

    const result: any = {
        current: {
            period_start: isoDay(current.start),
            period_end: addCalendarDays(parisDate(current.end), -1), // last day inclusive
            ...currentSummary,
        },
    };

    if (compare) {
        const prevDays = generateDayKeys(previous.start, previous.end);
        const prevSummary = summarize(inPrevious, prevDays);
        result.previous = {
            period_start: isoDay(previous.start),
            period_end: addCalendarDays(parisDate(previous.end), -1),
            total_seconds: prevSummary.total_seconds,
            total_sessions: prevSummary.total_sessions,
            completed_sessions: prevSummary.completed_sessions,
            abandoned_sessions: prevSummary.abandoned_sessions,
        };
    }

    return NextResponse.json(result);
}
