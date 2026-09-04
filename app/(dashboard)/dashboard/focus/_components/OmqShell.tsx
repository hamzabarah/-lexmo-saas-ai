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
    type BadHabit,
    type BadHabitWithChecks,
    type HabitCheck,
    type HabitState,
    type StatsDay,
    type TaskStatus,
} from '@/lib/focus/types';
import { OmqSidebar, type OmqView } from './OmqSidebar';
import { KanbanView } from './KanbanView';
import { WeekAgendaView } from './WeekAgendaView';
import { DisciplineView } from './DisciplineView';
import type { FocusSubtask } from '@/lib/hooks/useFocusSubtasks';
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

    const [habits, setHabits] = useState<BadHabitWithChecks[]>([]);
    // Toutes les sous-taches, indexees par tache : le kanban en affiche le
    // compteur et la barre sur chaque carte.
    const [subtasksByTask, setSubtasksByTask] = useState<Record<string, FocusSubtask[]>>({});

    const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
    const [busyHabitId, setBusyHabitId] = useState<string | null>(null);
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

    const loadSubtasks = useCallback(async () => {
        const res = await fetch('/api/focus/subtasks', { credentials: 'include' });
        if (!res.ok) return;
        const list: FocusSubtask[] = (await res.json()).subtasks ?? [];
        const grouped: Record<string, FocusSubtask[]> = {};
        for (const st of list) (grouped[st.task_id] ??= []).push(st);
        setSubtasksByTask(grouped);
    }, []);

    const loadHabits = useCallback(async () => {
        const res = await fetch('/api/focus/habits', { credentials: 'include' });
        if (!res.ok) return;
        const { habits: rows, checks } = (await res.json()) as {
            habits: BadHabit[];
            checks: Pick<HabitCheck, 'habit_id' | 'check_date' | 'state'>[];
        };

        // Les relevés arrivent à plat : on les indexe par habitude puis par
        // date, forme dans laquelle la bande et la série se lisent en O(1).
        const byHabit = new Map<string, Record<string, HabitState>>();
        for (const c of checks ?? []) {
            const bucket = byHabit.get(c.habit_id) ?? {};
            bucket[c.check_date] = c.state;
            byHabit.set(c.habit_id, bucket);
        }

        setHabits((rows ?? []).map((h) => ({ ...h, checks: byHabit.get(h.id) ?? {} })));
    }, []);

    const loadAll = useCallback(async () => {
        try {
            const [pRes, tRes, sRes] = await Promise.all([
                fetch('/api/focus/projects', { credentials: 'include' }),
                fetch('/api/focus/tasks', { credentials: 'include' }),
                fetch('/api/focus/stats?period=month&compare=false', { credentials: 'include' }),
                loadHabits(),
                loadSubtasks(),
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
    }, [loadDay, loadHabits, loadSubtasks]);

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

    /** « الخميس 4 سبتمبر 2026 » — en-tete des ecrans qui datent la journee. */
    const longDateLabel = useMemo(
        () =>
            new Intl.DateTimeFormat('ar', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(new Date()),
        []
    );

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
            if (!res.ok) {
                // Le serveur explique pourquoi il refuse (siege unique
                // occupe) : on montre SON message, pas un texte generique.
                const payload = await res.json().catch(() => null);
                throw new Error(payload?.error || 'patch failed');
            }
            const { task: updated } = await res.json();
            if (updated) {
                setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...updated } : t)));
            }
        } catch (e) {
            // Retour à l'état précédent : l'affichage ne doit pas mentir.
            setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
            setError(e instanceof Error && e.message !== 'patch failed' ? e.message : 'تعذر حفظ التغيير');
        } finally {
            setBusyTaskId(null);
        }
    }, []);

    /** Coche/décoche une sous-tâche. Le serveur la rattache à la session ouverte. */
    const toggleSubtask = useCallback(async (st: FocusSubtask) => {
        const next = !st.is_completed;
        setSubtasksByTask((prev) => ({
            ...prev,
            [st.task_id]: (prev[st.task_id] ?? []).map((x) =>
                x.id === st.id ? { ...x, is_completed: next } : x
            ),
        }));
        try {
            const res = await fetch('/api/focus/subtasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: st.id, is_completed: next }),
            });
            if (!res.ok) throw new Error('subtask patch failed');
        } catch {
            setSubtasksByTask((prev) => ({
                ...prev,
                [st.task_id]: (prev[st.task_id] ?? []).map((x) =>
                    x.id === st.id ? { ...x, is_completed: st.is_completed } : x
                ),
            }));
            setError('تعذر تحديث المهمة الفرعية');
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

    /**
     * Cloture automatique quand le compte a rebours atteint zero.
     *
     * Pur confort d'interface : si l'onglet est ferme avant l'echeance, ou si
     * cet appel echoue, le serveur rattrape au prochain acces au module
     * (closeExpiredSessions, lib/focus-session-expiry.ts). La session n'est
     * donc jamais laissee ouverte, et le temps enregistre reste plafonne a la
     * duree prevue dans les deux cas.
     */
    const autoStoppedRef = useRef<string | null>(null);

    useEffect(() => {
        if (breakEndsAt !== null) return;
        if (!session || session.status !== 'running') return;
        if (remainingSeconds > 0) return;
        // Une seule tentative par session, sinon le battement d'une seconde
        // relancerait la requete tant que le rechargement n'a pas eu lieu.
        if (autoStoppedRef.current === session.id) return;
        autoStoppedRef.current = session.id;
        void stop('');
    }, [session, remainingSeconds, breakEndsAt, stop]);

    // ─────────────────────── habitudes a eviter ───────────────────────

    /** Pose ou efface l'etat d'un jour. Mise a jour optimiste, retour arriere en cas d'echec. */
    const cycleHabit = useCallback(
        async (habit: BadHabitWithChecks, iso: string, next: HabitState | null) => {
            setBusyHabitId(habit.id);

            const before = habit.checks;
            const after: Record<string, HabitState> = { ...before };
            if (next === null) delete after[iso];
            else after[iso] = next;

            setHabits((prev) => prev.map((h) => (h.id === habit.id ? { ...h, checks: after } : h)));

            try {
                const res = await fetch('/api/focus/habits/checks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ habit_id: habit.id, check_date: iso, state: next }),
                });
                if (!res.ok) throw new Error('check failed');
            } catch {
                setHabits((prev) =>
                    prev.map((h) => (h.id === habit.id ? { ...h, checks: before } : h))
                );
                setError('تعذر حفظ التغيير');
            } finally {
                setBusyHabitId(null);
            }
        },
        []
    );

    const createHabit = useCallback(
        async (title: string, ruleNote: string): Promise<boolean> => {
            try {
                const res = await fetch('/api/focus/habits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ title, rule_note: ruleNote }),
                });
                if (!res.ok) {
                    setError(res.status === 409 ? 'هذه العادة موجودة بالفعل' : 'تعذر إضافة العادة');
                    return false;
                }
                await loadHabits();
                return true;
            } catch {
                setError('تعذر إضافة العادة');
                return false;
            }
        },
        [loadHabits]
    );

    /**
     * Archive une habitude : elle quitte la liste, son historique reste en base.
     * Aucune donnee de suivi n'est jamais perdue — c'est pour cela qu'on pose
     * `archived_at` au lieu de supprimer la ligne, qui emporterait ses releves
     * en cascade.
     */
    const archiveHabit = useCallback(
        async (habit: BadHabitWithChecks) => {
            setBusyHabitId(habit.id);
            const before = habits;
            setHabits((prev) => prev.filter((h) => h.id !== habit.id));

            try {
                const res = await fetch('/api/focus/habits', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ id: habit.id, archived: true }),
                });
                if (!res.ok) throw new Error('archive failed');
            } catch {
                setHabits(before);
                setError('تعذر أرشفة العادة');
            } finally {
                setBusyHabitId(null);
            }
        },
        [habits]
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
                    ) : view === 'discipline' ? (
                        <DisciplineView
                            habits={habits}
                            todayIso={todayIso()}
                            busyHabitId={busyHabitId}
                            urgentCount={urgentCount}
                            onCycleHabit={cycleHabit}
                            onCreateHabit={createHabit}
                            onArchiveHabit={archiveHabit}
                            todayLabel={longDateLabel}
                        />
                    ) : view === 'data' ? (
                        <WeekAgendaView />
                    ) : view === 'kanban' ? (
                        <KanbanView
                            projects={projects}
                            tasks={tasks}
                            subtasksByTask={subtasksByTask}
                            onMove={setTaskStatus}
                            onToggleSubtask={toggleSubtask}
                            busyTaskId={busyTaskId}
                            todayLabel={longDateLabel}
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
