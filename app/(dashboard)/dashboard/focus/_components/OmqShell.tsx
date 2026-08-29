'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    BREAK_MINUTES,
    DEFAULT_DURATION,
    computeStreak,
    type DayResponse,
    type FocusProject,
    type FocusSession,
    type FocusTask,
    type StatsDay,
    type TaskStatus,
} from '@/lib/focus/types';
import { OmqSidebar, type OmqView } from './OmqSidebar';
import { DataView } from './DataView';
import { KanbanView } from './KanbanView';
import { DeepWorkView } from './DeepWorkView';

const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * Coquille du module « عُمق ».
 *
 * Ce composant détient TOUT l'état partagé : projets, tâches, sessions du jour.
 * Les trois vues n'en sont que des projections — cocher une tâche dans
 * « البيانات » et la déplacer dans le kanban écrivent le même champ `status`
 * par le même chemin, il n'y a donc qu'une seule source de vérité.
 *
 * Aucune route API n'a été remplacée : le module réutilise /api/focus,
 * /api/focus/tasks et /api/focus/stats tels qu'ils existaient.
 */
export function OmqShell() {
    const [view, setView] = useState<OmqView>('data');

    const [projects, setProjects] = useState<FocusProject[]>([]);
    const [tasks, setTasks] = useState<FocusTask[]>([]);
    const [day, setDay] = useState<DayResponse | null>(null);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const [plannedMinutes, setPlannedMinutes] = useState<number>(DEFAULT_DURATION);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    // Instant de mise en pause, côté client : l'API attend que le client lui
    // transmette le cumul des pauses au moment de la reprise.
    const pausedAtRef = useRef<number | null>(null);
    const [breakEndsAt, setBreakEndsAt] = useState<number | null>(null);
    const [tick, setTick] = useState(0);

    // ───────────────────────────── chargement ─────────────────────────────

    const loadDay = useCallback(async () => {
        const res = await fetch(`/api/focus?date=${todayIso()}`, { credentials: 'include' });
        if (res.ok) setDay(await res.json());
    }, []);

    const loadAll = useCallback(async () => {
        try {
            const [pRes, tRes, sRes] = await Promise.all([
                fetch('/api/focus/projects', { credentials: 'include' }),
                fetch('/api/focus/tasks', { credentials: 'include' }),
                fetch('/api/focus/stats?period=month&compare=false', { credentials: 'include' }),
            ]);

            if (pRes.ok) setProjects((await pRes.json()).projects ?? []);
            if (tRes.ok) setTasks((await tRes.json()).tasks ?? []);
            if (sRes.ok) {
                const json = await sRes.json();
                const days: StatsDay[] = json?.current?.by_day ?? [];
                setStreak(computeStreak(days, todayIso()));
            }

            await loadDay();
            setError(null);
        } catch {
            setError('تعذر تحميل البيانات');
        } finally {
            setLoading(false);
        }
    }, [loadDay]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    // Battement d'une seconde, uniquement quand un compteur tourne.
    const session = useMemo(
        () => day?.sessions.find((s) => s.status === 'running' || s.status === 'paused') ?? null,
        [day]
    );

    useEffect(() => {
        if (!session && breakEndsAt === null) return;
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [session, breakEndsAt]);

    // ───────────────────────────── dérivés ─────────────────────────────

    const remainingSeconds = useMemo(() => {
        void tick;

        if (breakEndsAt !== null) {
            return Math.max(0, Math.round((breakEndsAt - Date.now()) / 1000));
        }
        if (!session) return plannedMinutes * 60;

        const started = new Date(session.started_at).getTime();
        const ref = pausedAtRef.current ?? Date.now();
        const worked = (ref - started) / 1000 - (session.paused_seconds ?? 0);
        return Math.max(0, Math.round(session.planned_duration_minutes * 60 - worked));
    }, [session, plannedMinutes, breakEndsAt, tick]);

    const breakRemaining = breakEndsAt === null ? null : remainingSeconds;

    // Fin automatique de la pause.
    useEffect(() => {
        if (breakEndsAt !== null && breakRemaining === 0) setBreakEndsAt(null);
    }, [breakEndsAt, breakRemaining]);

    const urgentCount = useMemo(
        () => tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length,
        [tasks]
    );

    const todaySessions = day?.stats.completedCount ?? 0;
    const todayMinutes = day?.stats.totalMinutes ?? 0;

    // ───────────────────────────── actions ─────────────────────────────

    /** Point d'écriture UNIQUE du statut d'une tâche, partagé par les deux vues. */
    const setTaskStatus = useCallback(async (task: FocusTask, status: TaskStatus) => {
        setBusyTaskId(task.id);
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)));

        try {
            const res = await fetch('/api/focus/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: task.id, status }),
            });
            if (!res.ok) throw new Error('patch failed');
            const { task: updated } = await res.json();
            if (updated) {
                setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...updated } : t)));
            }
        } catch {
            // Retour à l'état précédent : l'affichage ne doit pas mentir.
            setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
            setError('تعذر حفظ التغيير');
        } finally {
            setBusyTaskId(null);
        }
    }, []);

    const toggleDone = useCallback(
        (task: FocusTask) => setTaskStatus(task, task.status === 'done' ? 'todo' : 'done'),
        [setTaskStatus]
    );

    const reloadTasks = useCallback(async () => {
        const res = await fetch('/api/focus/tasks', { credentials: 'include' });
        if (res.ok) setTasks((await res.json()).tasks ?? []);
    }, []);

    const startSession = useCallback(async () => {
        const task = tasks.find((t) => t.id === selectedTaskId);
        if (!task) return;

        setBusy(true);
        try {
            const res = await fetch('/api/focus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    task_title: task.title,
                    category: task.category,
                    planned_duration_minutes: plannedMinutes,
                    task_id: task.id,
                }),
            });
            if (!res.ok) throw new Error('start failed');
            pausedAtRef.current = null;
            setBreakEndsAt(null);
            // L'API bascule la tâche en « قيد التنفيذ » : on recharge les deux.
            await Promise.all([loadDay(), reloadTasks()]);
        } catch {
            setError('تعذر بدء الجلسة');
        } finally {
            setBusy(false);
        }
    }, [tasks, selectedTaskId, plannedMinutes, loadDay, reloadTasks]);

    const patchSession = useCallback(
        async (action: string, extra: Record<string, unknown> = {}) => {
            if (!session) return;
            setBusy(true);
            try {
                const res = await fetch('/api/focus', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ id: session.id, action, ...extra }),
                });
                if (!res.ok) throw new Error('patch failed');
                await loadDay();
            } catch {
                setError('تعذر تحديث الجلسة');
            } finally {
                setBusy(false);
            }
        },
        [session, loadDay]
    );

    const pause = useCallback(async () => {
        pausedAtRef.current = Date.now();
        await patchSession('pause');
    }, [patchSession]);

    const resume = useCallback(async () => {
        const pausedAt = pausedAtRef.current;
        const extraPaused = pausedAt ? Math.round((Date.now() - pausedAt) / 1000) : 0;
        pausedAtRef.current = null;
        await patchSession('resume', {
            paused_seconds: (session?.paused_seconds ?? 0) + extraPaused,
        });
    }, [patchSession, session]);

    const stop = useCallback(
        async (notes: string) => {
            pausedAtRef.current = null;
            await patchSession('stop', notes ? { notes } : {});
            await reloadTasks();
        },
        [patchSession, reloadTasks]
    );

    // ───────────────────────────── rendu ─────────────────────────────

    return (
        <div
            className="font-[family-name:var(--font-almarai)] bg-omq-panel text-omq-ink border border-omq-border rounded-[14px] overflow-hidden shadow-[0_6px_24px_rgba(90,80,60,0.1)]"
            dir="rtl"
        >
            <div className="flex flex-col lg:flex-row min-h-[800px]">
                <OmqSidebar
                    view={view}
                    onChange={setView}
                    runningSeconds={session || breakEndsAt !== null ? remainingSeconds : null}
                    isRunning={remainingSeconds > 0}
                    isPaused={session?.status === 'paused'}
                />

                <main className="flex-1 min-w-0 p-6 sm:p-8 lg:px-10 lg:py-8">
                    {error && (
                        <div className="mb-6 rounded-xl border border-omq-urgent/30 bg-omq-urgent-bg px-4 py-3 text-[13px] text-omq-urgent">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="py-24 text-center text-[13px] text-omq-faint">
                            جارٍ التحميل…
                        </div>
                    ) : view === 'data' ? (
                        <DataView
                            projects={projects}
                            tasks={tasks}
                            urgentCount={urgentCount}
                            todaySessions={todaySessions}
                            todayMinutes={todayMinutes}
                            onToggleDone={toggleDone}
                            busyTaskId={busyTaskId}
                        />
                    ) : view === 'kanban' ? (
                        <KanbanView
                            projects={projects}
                            tasks={tasks}
                            onMove={setTaskStatus}
                            busyTaskId={busyTaskId}
                        />
                    ) : (
                        <DeepWorkView
                            session={session as FocusSession | null}
                            remainingSeconds={remainingSeconds}
                            plannedMinutes={plannedMinutes}
                            onPlannedMinutesChange={setPlannedMinutes}
                            selectedTaskId={selectedTaskId}
                            onSelectTask={setSelectedTaskId}
                            tasks={tasks}
                            projects={projects}
                            todaySessions={todaySessions}
                            todayMinutes={todayMinutes}
                            streak={streak}
                            breakRemaining={breakRemaining}
                            onStart={startSession}
                            onPause={pause}
                            onResume={resume}
                            onStop={stop}
                            onStartBreak={() => setBreakEndsAt(Date.now() + BREAK_MINUTES * 60_000)}
                            onSkipBreak={() => setBreakEndsAt(null)}
                            busy={busy}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
