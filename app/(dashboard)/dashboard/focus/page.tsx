"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useFocusTasks, FocusTask, TaskCategory, TaskStatus, TaskType } from "@/lib/hooks/useFocusTasks";
import { useFocusSubtasks, FocusSubtask } from "@/lib/hooks/useFocusSubtasks";
import {
    Lock, Play, Pause, Square, X, Timer, Tag, Clock, Loader2,
    CheckCircle2, AlertCircle, PauseCircle, Plus, Target,
    MoreVertical, Pencil, Trash2, History, Circle, CheckCircle,
    Repeat, Check, BarChart3, Archive, ListChecks, ChevronLeft
} from "lucide-react";

const ADMIN_EMAIL = "academyfrance75@gmail.com";

interface FocusSession {
    id: string;
    user_id: string;
    task_title: string;
    category: string | null;
    notes: string | null;
    planned_duration_minutes: number;
    started_at: string;
    ended_at: string | null;
    paused_seconds: number;
    status: "running" | "paused" | "completed" | "abandoned";
    task_id: string | null;
    subtask_id: string | null;
    focus_tasks: { id: string; title: string; category: string | null } | null;
    focus_subtasks: { id: string; title: string } | null;
    created_at: string;
    updated_at: string;
}

interface SessionsResponse {
    sessions: FocusSession[];
    stats: { totalMinutes: number; completedCount: number; abandonedCount: number };
}

const QUICK_DURATIONS = [25, 40, 60, 90];

const STATUS_LABELS: Record<string, string> = {
    running: "قيد التنفيذ",
    paused: "متوقف مؤقتاً",
    completed: "مكتمل",
    abandoned: "ملغى",
};

const CATEGORY_META: Record<TaskCategory, { label: string; bg: string; text: string }> = {
    personal: { label: "شخصي", bg: "rgba(59, 130, 246, 0.15)", text: "#93C5FD" },
    professional: { label: "مهني", bg: "rgba(197, 160, 78, 0.15)", text: "#FDE68A" },
};

const TYPE_META: Record<TaskType, { label: string; subtitle: string; icon: any; bg: string; text: string }> = {
    recurring: {
        label: "متكررة",
        subtitle: "تتكرر يومياً أو أسبوعياً",
        icon: Repeat,
        bg: "rgba(167, 139, 250, 0.15)",
        text: "#C4B5FD",
    },
    one_time: {
        label: "مرة واحدة",
        subtitle: "تنتهي بعد إنجازها",
        icon: Check,
        bg: "rgba(96, 165, 250, 0.15)",
        text: "#93C5FD",
    },
    long_term: {
        label: "طويلة المدى",
        subtitle: "تأخذ عدة جلسات",
        icon: BarChart3,
        bg: "rgba(251, 146, 60, 0.15)",
        text: "#FDBA74",
    },
};

function pad(n: number): string {
    return String(n).padStart(2, "0");
}

function formatHMS(totalSeconds: number): string {
    const s = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${pad(m)}:${pad(sec)}`;
    return `${pad(m)}:${pad(sec)}`;
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("ar-u-nu-latn", { hour: "2-digit", minute: "2-digit" });
}

// Compact Arabic duration: "X س Y د" / "X د" / "أقل من دقيقة"
function formatDuration(seconds: number): string {
    if (seconds <= 0) return "0 د";
    if (seconds < 60) return "أقل من دقيقة";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} د`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h >= 24 || m === 0) return `${h} س`;
    return `${h} س ${m} د`;
}

function formatMinutesArabic(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0) return `${h} ساعة و ${m} دقيقة`;
    return `${m} دقيقة`;
}

function todayISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDateArabicShort(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("ar-u-nu-latn", {
        day: "numeric", month: "long",
    });
}

export default function FocusPage() {
    const [authChecked, setAuthChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const [sessionsData, setSessionsData] = useState<SessionsResponse | null>(null);
    const [sessionsLoading, setSessionsLoading] = useState(true);

    const tasksApi = useFocusTasks();

    const [selectedTask, setSelectedTask] = useState<FocusTask | null>(null);
    const [selectedSubtask, setSelectedSubtask] = useState<FocusSubtask | null>(null);

    const [plannedMinutes, setPlannedMinutes] = useState<number>(40);
    const [customDuration, setCustomDuration] = useState<string>("");
    const [freeTitle, setFreeTitle] = useState("");
    const [starting, setStarting] = useState(false);

    const [, setTick] = useState(0);
    const pauseStartedAtRef = useRef<number | null>(null);

    const [stopModal, setStopModal] = useState<{ session: FocusSession; notes: string } | null>(null);
    const [savingStop, setSavingStop] = useState(false);
    const [detailModal, setDetailModal] = useState<FocusSession | null>(null);

    // Add/Edit task modal state — pre-fill task_type per section
    const [taskModal, setTaskModal] = useState<{
        mode: "create" | "edit";
        task?: FocusTask;
        defaultType: TaskType;
    } | null>(null);
    const [historyModal, setHistoryModal] = useState<FocusTask | null>(null);
    const [detailsTaskModal, setDetailsTaskModal] = useState<FocusTask | null>(null);

    // Per-section filters
    const [recurringFilter, setRecurringFilter] = useState<"active" | "all">("active");
    const [oneTimeFilter, setOneTimeFilter] = useState<"today" | "week" | "all">("today");
    const [longTermFilter, setLongTermFilter] = useState<"active" | "done">("active");

    // ─── Auth ───
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setAuthorized(user?.email === ADMIN_EMAIL);
            setAuthChecked(true);
        });
    }, []);

    // ─── Sessions ───
    const refreshSessions = useCallback(async () => {
        try {
            const res = await fetch("/api/focus", { credentials: "include" });
            if (!res.ok) return;
            const json: SessionsResponse = await res.json();
            setSessionsData(json);
        } catch { /* */ }
    }, []);

    useEffect(() => {
        if (!authorized) return;
        setSessionsLoading(true);
        refreshSessions().finally(() => setSessionsLoading(false));
    }, [authorized, refreshSessions]);

    // ─── Active session ───
    const activeSession = useMemo(
        () => sessionsData?.sessions.find((s) => s.status === "running" || s.status === "paused") || null,
        [sessionsData]
    );

    useEffect(() => {
        if (!activeSession || activeSession.status !== "running") return;
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [activeSession]);

    useEffect(() => {
        if (activeSession?.status === "paused" && pauseStartedAtRef.current === null) {
            pauseStartedAtRef.current = Date.now();
        }
        if (activeSession?.status === "running") {
            pauseStartedAtRef.current = null;
        }
    }, [activeSession?.status]);

    // Computed every render — setTick (1s interval) triggers re-renders so the
    // displayed value advances. Don't memoize on [activeSession]: the deps would
    // never change between ticks and the timer would freeze.
    let elapsedSeconds = 0;
    if (activeSession) {
        const startMs = new Date(activeSession.started_at).getTime();
        const nowMs = activeSession.status === "paused" && pauseStartedAtRef.current
            ? pauseStartedAtRef.current
            : Date.now();
        const raw = (nowMs - startMs) / 1000 - (activeSession.paused_seconds || 0);
        elapsedSeconds = Math.max(0, Math.floor(raw));
    }

    const plannedSeconds = (activeSession?.planned_duration_minutes || 0) * 60;
    const overtime = activeSession && elapsedSeconds > plannedSeconds && plannedSeconds > 0;

    // ─── Tracker actions ───
    const handleStart = async () => {
        const title = (selectedSubtask?.title || selectedTask?.title || freeTitle).trim();
        if (!title) return;
        setStarting(true);
        try {
            const res = await fetch("/api/focus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    task_title: title,
                    category: selectedTask?.category || null,
                    planned_duration_minutes: plannedMinutes,
                    task_id: selectedTask?.id || null,
                    subtask_id: selectedSubtask?.id || null,
                }),
            });
            if (res.ok) {
                setFreeTitle("");
                setCustomDuration("");
                setSelectedTask(null);
                setSelectedSubtask(null);
                await refreshSessions();
                if (selectedTask) await tasksApi.refresh();
            }
        } catch { /* */ }
        setStarting(false);
    };

    const handlePause = async () => {
        if (!activeSession) return;
        pauseStartedAtRef.current = Date.now();
        await fetch("/api/focus", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id: activeSession.id, action: "pause" }),
        });
        await refreshSessions();
    };

    const handleResume = async () => {
        if (!activeSession) return;
        const pausedAt = pauseStartedAtRef.current;
        const extraPaused = pausedAt ? Math.floor((Date.now() - pausedAt) / 1000) : 0;
        pauseStartedAtRef.current = null;
        await fetch("/api/focus", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                id: activeSession.id,
                action: "resume",
                paused_seconds: (activeSession.paused_seconds || 0) + extraPaused,
            }),
        });
        await refreshSessions();
    };

    const openStopModal = () => {
        if (!activeSession) return;
        setStopModal({ session: activeSession, notes: "" });
    };

    const handleStopConfirm = async () => {
        if (!stopModal) return;
        setSavingStop(true);
        const session = stopModal.session;
        const pausedAt = pauseStartedAtRef.current;
        const extraPaused =
            session.status === "paused" && pausedAt ? Math.floor((Date.now() - pausedAt) / 1000) : 0;
        const finalPaused = (session.paused_seconds || 0) + extraPaused;
        await fetch("/api/focus", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                id: session.id,
                action: "stop",
                notes: stopModal.notes || undefined,
                paused_seconds: finalPaused,
            }),
        });
        pauseStartedAtRef.current = null;
        setStopModal(null);
        setSavingStop(false);
        await refreshSessions();
        await tasksApi.refresh();
    };

    const handleAbandon = async () => {
        if (!activeSession) return;
        if (!confirm("هل أنت متأكد من إلغاء الجلسة؟")) return;
        const pausedAt = pauseStartedAtRef.current;
        const extraPaused =
            activeSession.status === "paused" && pausedAt ? Math.floor((Date.now() - pausedAt) / 1000) : 0;
        const finalPaused = (activeSession.paused_seconds || 0) + extraPaused;
        await fetch("/api/focus", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                id: activeSession.id,
                action: "abandon",
                paused_seconds: finalPaused,
            }),
        });
        pauseStartedAtRef.current = null;
        await refreshSessions();
        await tasksApi.refresh();
    };

    // ─── Task actions ───
    const startSessionFromTask = (task: FocusTask) => {
        if (activeSession) {
            alert("يوجد جلسة نشطة بالفعل. أنهها أولاً.");
            return;
        }
        setSelectedTask(task);
        setSelectedSubtask(null);
        setFreeTitle("");
    };

    const startSessionFromSubtask = (task: FocusTask, subtask: FocusSubtask) => {
        if (activeSession) {
            alert("يوجد جلسة نشطة بالفعل. أنهها أولاً.");
            return;
        }
        setSelectedTask(task);
        setSelectedSubtask(subtask);
        setFreeTitle("");
        setDetailsTaskModal(null);
    };

    const toggleTaskDone = async (task: FocusTask) => {
        if (task.status === "done") {
            await tasksApi.markAsTodo(task);
        } else {
            await tasksApi.markAsDone(task.id);
        }
    };

    // ─── Filtered tasks per section ───
    const recurringTasks = useMemo(() => {
        const all = tasksApi.getRecurringTasks();
        if (recurringFilter === "active") return all.filter((t) => t.status !== "done");
        return all;
    }, [tasksApi, recurringFilter]);

    const oneTimeTasks = useMemo(() => {
        if (oneTimeFilter === "today") return tasksApi.getOneTimeTasks(todayISO());
        if (oneTimeFilter === "week") return tasksApi.getOneTimeTasksThisWeek();
        return tasksApi.getOneTimeTasks();
    }, [tasksApi, oneTimeFilter]);

    const longTermTasks = useMemo(() => {
        const all = tasksApi.getLongTermTasks();
        if (longTermFilter === "active") return all.filter((t) => t.status !== "done");
        return all.filter((t) => t.status === "done");
    }, [tasksApi, longTermFilter]);

    // ─── Render guards ───
    if (!authChecked) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#C5A04E]" />
            </div>
        );
    }

    if (!authorized) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-12 max-w-lg text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">الوصول مقيد</h2>
                    <p className="text-gray-400">هذه الصفحة محجوزة للمسؤول</p>
                </div>
            </div>
        );
    }

    const sessions = sessionsData?.sessions || [];
    const stats = sessionsData?.stats || { totalMinutes: 0, completedCount: 0, abandonedCount: 0 };

    return (
        <div className="max-w-4xl mx-auto space-y-5">
            {/* Page header */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Timer className="w-7 h-7 text-[#C5A04E]" />
                    <h1 className="text-2xl font-bold text-white">متتبع التركيز</h1>
                </div>
                <Link
                    href="/dashboard/focus/stats"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#C5A04E]/30 text-[#C5A04E] text-sm font-bold hover:bg-[#C5A04E]/10 transition-colors"
                >
                    <BarChart3 className="w-4 h-4" />
                    📊 الإحصائيات
                </Link>
            </div>

            {/* ─── Section 1: Recurring tasks ─── */}
            <TaskSection
                type="recurring"
                tasks={recurringTasks}
                allCount={tasksApi.getRecurringTasks().length}
                loading={tasksApi.loading}
                emptyMessage="لا توجد مهام في هذه الفئة"
                onAdd={() => setTaskModal({ mode: "create", defaultType: "recurring" })}
                renderFilters={() => (
                    <FilterTabs
                        active={recurringFilter}
                        onChange={(v) => setRecurringFilter(v as any)}
                        options={[
                            { value: "active", label: "نشطة" },
                            { value: "all", label: "الكل" },
                        ]}
                    />
                )}
                renderTask={(task) => (
                    <RecurringTaskRow
                        key={task.id}
                        task={task}
                        isActiveTask={activeSession?.task_id === task.id}
                        onStartSession={() => startSessionFromTask(task)}
                        onEdit={() => setTaskModal({ mode: "edit", task, defaultType: task.task_type })}
                        onArchive={() => tasksApi.updateTask(task.id, { status: task.status === "done" ? "in_progress" : "done" })}
                        onDelete={async () => {
                            if (confirm(`حذف المهمة "${task.title}"؟`)) await tasksApi.deleteTask(task.id);
                        }}
                        onShowHistory={() => setHistoryModal(task)}
                        onShowDetails={() => setDetailsTaskModal(task)}
                    />
                )}
            />

            {/* ─── Section 2: One-time tasks ─── */}
            <TaskSection
                type="one_time"
                tasks={oneTimeTasks}
                allCount={tasksApi.getOneTimeTasks().length}
                loading={tasksApi.loading}
                emptyMessage="لا توجد مهام في هذه الفئة"
                onAdd={() => setTaskModal({ mode: "create", defaultType: "one_time" })}
                renderFilters={() => (
                    <FilterTabs
                        active={oneTimeFilter}
                        onChange={(v) => setOneTimeFilter(v as any)}
                        options={[
                            { value: "today", label: "اليوم" },
                            { value: "week", label: "هذا الأسبوع" },
                            { value: "all", label: "الكل" },
                        ]}
                    />
                )}
                renderTask={(task) => (
                    <OneTimeTaskRow
                        key={task.id}
                        task={task}
                        isActiveTask={activeSession?.task_id === task.id}
                        onToggleDone={() => toggleTaskDone(task)}
                        onStartSession={() => startSessionFromTask(task)}
                        onEdit={() => setTaskModal({ mode: "edit", task, defaultType: task.task_type })}
                        onDelete={async () => {
                            if (confirm(`حذف المهمة "${task.title}"؟`)) await tasksApi.deleteTask(task.id);
                        }}
                        onShowHistory={() => setHistoryModal(task)}
                        onShowDetails={() => setDetailsTaskModal(task)}
                    />
                )}
            />

            {/* ─── Section 3: Long-term tasks ─── */}
            <TaskSection
                type="long_term"
                tasks={longTermTasks}
                allCount={tasksApi.getLongTermTasks().length}
                loading={tasksApi.loading}
                emptyMessage="لا توجد مهام في هذه الفئة"
                onAdd={() => setTaskModal({ mode: "create", defaultType: "long_term" })}
                renderFilters={() => (
                    <FilterTabs
                        active={longTermFilter}
                        onChange={(v) => setLongTermFilter(v as any)}
                        options={[
                            { value: "active", label: "نشطة" },
                            { value: "done", label: "مكتملة" },
                        ]}
                    />
                )}
                renderTask={(task) => (
                    <LongTermTaskRow
                        key={task.id}
                        task={task}
                        isActiveTask={activeSession?.task_id === task.id}
                        onToggleDone={() => toggleTaskDone(task)}
                        onStartSession={() => startSessionFromTask(task)}
                        onEdit={() => setTaskModal({ mode: "edit", task, defaultType: task.task_type })}
                        onDelete={async () => {
                            if (confirm(`حذف المهمة "${task.title}"؟`)) await tasksApi.deleteTask(task.id);
                        }}
                        onShowHistory={() => setHistoryModal(task)}
                        onShowDetails={() => setDetailsTaskModal(task)}
                    />
                )}
            />

            {/* ─── Tracker section ─── */}
            <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Play className="w-6 h-6 text-[#C5A04E]" />
                    <h2 className="text-xl font-bold text-white">جلسة التركيز</h2>
                </div>
                {activeSession ? (
                    <ActiveSessionView
                        session={activeSession}
                        elapsedSeconds={elapsedSeconds}
                        plannedSeconds={plannedSeconds}
                        overtime={!!overtime}
                        onPause={handlePause}
                        onResume={handleResume}
                        onStop={openStopModal}
                        onAbandon={handleAbandon}
                    />
                ) : (
                    <StartForm
                        selectedTask={selectedTask}
                        selectedSubtask={selectedSubtask}
                        onClearSelected={() => { setSelectedTask(null); setSelectedSubtask(null); }}
                        freeTitle={freeTitle}
                        setFreeTitle={setFreeTitle}
                        plannedMinutes={plannedMinutes}
                        setPlannedMinutes={setPlannedMinutes}
                        customDuration={customDuration}
                        setCustomDuration={setCustomDuration}
                        onStart={handleStart}
                        starting={starting}
                    />
                )}
            </div>

            {/* ─── Today sessions ─── */}
            <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">الجلسات اليوم</h2>
                    {!sessionsLoading && (
                        <p className="text-sm text-gray-500">
                            إجمالي التركيز: <span className="text-[#C5A04E] font-bold">{formatMinutesArabic(stats.totalMinutes)}</span>
                            {" — "}
                            {stats.completedCount} جلسات مكتملة
                            {stats.abandonedCount > 0 && (
                                <span className="text-gray-600"> · {stats.abandonedCount} ملغاة</span>
                            )}
                        </p>
                    )}
                </div>
                {sessionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 text-sm">لا توجد جلسات اليوم</div>
                ) : (
                    <div className="space-y-2">
                        {sessions.map((s) => (
                            <SessionRow key={s.id} session={s} onClick={() => setDetailModal(s)} />
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Modals ─── */}
            {stopModal && (
                <Modal onClose={() => !savingStop && setStopModal(null)}>
                    <h3 className="text-xl font-bold text-white mb-4">ماذا أنجزت؟</h3>
                    <textarea
                        value={stopModal.notes}
                        onChange={(e) => setStopModal({ ...stopModal, notes: e.target.value })}
                        rows={4}
                        autoFocus
                        placeholder="اكتب ما أنجزته خلال هذه الجلسة..."
                        className="w-full bg-[#0A0A0A] border border-[#C5A04E]/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A04E] resize-none"
                    />
                    <div className="flex gap-3 mt-5">
                        <button onClick={() => setStopModal(null)} disabled={savingStop} className="flex-1 px-4 py-3 rounded-xl bg-[#1A1A1A] text-gray-400 font-bold hover:bg-[#222222] transition-colors disabled:opacity-50">إلغاء</button>
                        <button onClick={handleStopConfirm} disabled={savingStop} className="flex-1 px-4 py-3 rounded-xl bg-[#C5A04E] text-white font-bold hover:bg-[#D4B85C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {savingStop ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            حفظ
                        </button>
                    </div>
                </Modal>
            )}

            {detailModal && (
                <Modal onClose={() => setDetailModal(null)}>
                    <SessionDetail session={detailModal} onClose={() => setDetailModal(null)} />
                </Modal>
            )}

            {taskModal && (
                <Modal onClose={() => setTaskModal(null)}>
                    <TaskForm
                        task={taskModal.mode === "edit" ? taskModal.task : undefined}
                        defaultType={taskModal.defaultType}
                        defaultDate={todayISO()}
                        onCancel={() => setTaskModal(null)}
                        onSubmit={async (data) => {
                            if (taskModal.mode === "edit" && taskModal.task) {
                                await tasksApi.updateTask(taskModal.task.id, data);
                            } else {
                                await tasksApi.createTask(data);
                            }
                            setTaskModal(null);
                        }}
                    />
                </Modal>
            )}

            {historyModal && (
                <Modal onClose={() => setHistoryModal(null)}>
                    <TaskHistory
                        task={historyModal}
                        sessions={sessions.filter((s) => s.task_id === historyModal.id)}
                        onClose={() => setHistoryModal(null)}
                    />
                </Modal>
            )}

            {detailsTaskModal && (
                <Modal onClose={() => setDetailsTaskModal(null)} large>
                    <TaskDetailsModal
                        task={detailsTaskModal}
                        recentSessions={sessions.filter((s) => s.task_id === detailsTaskModal.id).slice(0, 10)}
                        onTitleSave={async (newTitle) => {
                            await tasksApi.updateTask(detailsTaskModal.id, { title: newTitle });
                        }}
                        onSubtaskChanged={async () => {
                            await tasksApi.refresh();
                        }}
                        onStartSessionGeneral={() => {
                            startSessionFromTask(detailsTaskModal);
                            setDetailsTaskModal(null);
                        }}
                        onStartSessionSubtask={(subtask) => startSessionFromSubtask(detailsTaskModal, subtask)}
                        onClose={() => setDetailsTaskModal(null)}
                        activeTaskId={activeSession?.task_id || null}
                        activeSubtaskId={activeSession?.subtask_id || null}
                    />
                </Modal>
            )}
        </div>
    );
}

// ─── Reusable section wrapper ─────────────────────────────────
function TaskSection({
    type,
    tasks,
    allCount,
    loading,
    emptyMessage,
    onAdd,
    renderFilters,
    renderTask,
}: {
    type: TaskType;
    tasks: FocusTask[];
    allCount: number;
    loading: boolean;
    emptyMessage: string;
    onAdd: () => void;
    renderFilters: () => React.ReactNode;
    renderTask: (task: FocusTask) => React.ReactNode;
}) {
    const meta = TYPE_META[type];
    const Icon = meta.icon;

    return (
        <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: meta.bg }}
                    >
                        <Icon className="w-4 h-4" style={{ color: meta.text }} />
                    </span>
                    <h2 className="text-base font-bold text-white">{meta.label}</h2>
                    {allCount > 0 && (
                        <span className="text-xs text-gray-500">({allCount})</span>
                    )}
                </div>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-[#C5A04E] text-xs font-bold hover:bg-[#222222] transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    إضافة
                </button>
            </div>

            <div className="mb-3">{renderFilters()}</div>

            {loading ? (
                <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-6 text-gray-600 text-xs">{emptyMessage}</div>
            ) : (
                <div className="space-y-2">{tasks.map(renderTask)}</div>
            )}
        </div>
    );
}

// ─── Filter tabs ──────────────────────────────────────────────
function FilterTabs({
    active,
    onChange,
    options,
}: {
    active: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        active === opt.value
                            ? "bg-[#C5A04E] text-white"
                            : "bg-[#1A1A1A] text-gray-400 hover:bg-[#222222]"
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

// ─── Recurring task row (no checkbox, time stats grid) ────────
function RecurringTaskRow({
    task,
    isActiveTask,
    onStartSession,
    onEdit,
    onArchive,
    onDelete,
    onShowHistory,
    onShowDetails,
}: {
    task: FocusTask;
    isActiveTask: boolean;
    onStartSession: () => void;
    onEdit: () => void;
    onArchive: () => void;
    onDelete: () => void;
    onShowHistory: () => void;
    onShowDetails: () => void;
}) {
    const cat = task.category ? CATEGORY_META[task.category] : null;
    const isArchived = task.status === "done";

    return (
        <div className={`p-3 rounded-xl bg-[#0A0A0A] border ${isActiveTask ? "border-[#C5A04E]/40" : isArchived ? "border-white/[0.04] opacity-60" : "border-white/[0.04]"}`}>
            <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                    <button
                        onClick={onShowDetails}
                        className={`text-sm font-bold text-right hover:underline ${isArchived ? "text-gray-500 line-through" : "text-white"}`}
                    >
                        {task.title}
                    </button>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {cat && (
                            <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: cat.bg, color: cat.text }}
                            >
                                {cat.label}
                            </span>
                        )}
                        {task.subtasks_count > 0 && (
                            <SubtaskCounter task={task} onClick={onShowDetails} />
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    {!isArchived && (
                        <button
                            onClick={onStartSession}
                            disabled={isActiveTask}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#C5A04E]/10 text-[#C5A04E] text-xs font-bold hover:bg-[#C5A04E]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play className="w-3 h-3" />
                            {isActiveTask ? "نشطة" : "ابدأ"}
                        </button>
                    )}
                    <TaskMenu>
                        <MenuItem icon={<ListChecks className="w-4 h-4" />} label="المهام الفرعية" onClick={onShowDetails} />
                        <MenuItem icon={<Pencil className="w-4 h-4" />} label="تعديل" onClick={onEdit} />
                        <MenuItem icon={<History className="w-4 h-4" />} label="السجل" onClick={onShowHistory} />
                        <MenuItem
                            icon={<Archive className="w-4 h-4" />}
                            label={isArchived ? "إلغاء الأرشفة" : "أرشفة"}
                            onClick={onArchive}
                        />
                        <MenuItem icon={<Trash2 className="w-4 h-4" />} label="حذف" danger onClick={onDelete} />
                    </TaskMenu>
                </div>
            </div>

            {/* 4-stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                <StatCell label="اليوم" value={formatDuration(task.time_today_seconds)} />
                <StatCell label="الأسبوع" value={formatDuration(task.time_this_week_seconds)} />
                <StatCell label="الشهر" value={formatDuration(task.time_this_month_seconds)} />
                <StatCell label="الإجمالي" value={formatDuration(task.time_total_seconds)} />
            </div>
        </div>
    );
}

// ─── One-time task row (checkbox + simple total) ──────────────
function OneTimeTaskRow({
    task,
    isActiveTask,
    onToggleDone,
    onStartSession,
    onEdit,
    onDelete,
    onShowHistory,
    onShowDetails,
}: {
    task: FocusTask;
    isActiveTask: boolean;
    onToggleDone: () => void;
    onStartSession: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onShowHistory: () => void;
    onShowDetails: () => void;
}) {
    const cat = task.category ? CATEGORY_META[task.category] : null;
    const isDone = task.status === "done";

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border ${isActiveTask ? "border-[#C5A04E]/40" : isDone ? "border-white/[0.04] opacity-60" : "border-white/[0.04]"}`}>
            <button onClick={onToggleDone} className="shrink-0" aria-label={isDone ? "إلغاء الإكمال" : "إكمال"}>
                {isDone ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-500 hover:text-gray-300 transition-colors" />}
            </button>

            <div className="flex-1 min-w-0">
                <button
                    onClick={onShowDetails}
                    className={`text-sm font-bold text-right hover:underline ${isDone ? "text-gray-500 line-through" : "text-white"}`}
                >
                    {task.title}
                </button>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {cat && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.bg, color: cat.text }}>
                            {cat.label}
                        </span>
                    )}
                    {task.scheduled_date && (
                        <span className="text-[10px] text-gray-500">📅 {formatDateArabicShort(task.scheduled_date)}</span>
                    )}
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        الوقت المنقضي: {formatDuration(task.time_total_seconds)}
                    </span>
                    {task.subtasks_count > 0 && <SubtaskCounter task={task} onClick={onShowDetails} />}
                </div>
            </div>

            {!isDone && (
                <button
                    onClick={onStartSession}
                    disabled={isActiveTask}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#C5A04E]/10 text-[#C5A04E] text-xs font-bold hover:bg-[#C5A04E]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Play className="w-3 h-3" />
                    {isActiveTask ? "نشطة" : "ابدأ"}
                </button>
            )}

            <TaskMenu>
                <MenuItem icon={<ListChecks className="w-4 h-4" />} label="المهام الفرعية" onClick={onShowDetails} />
                <MenuItem icon={<Pencil className="w-4 h-4" />} label="تعديل" onClick={onEdit} />
                <MenuItem icon={<History className="w-4 h-4" />} label="السجل" onClick={onShowHistory} />
                <MenuItem icon={<Trash2 className="w-4 h-4" />} label="حذف" danger onClick={onDelete} />
            </TaskMenu>
        </div>
    );
}

// ─── Long-term task row (checkbox + total + sessions count) ───
function LongTermTaskRow({
    task,
    isActiveTask,
    onToggleDone,
    onStartSession,
    onEdit,
    onDelete,
    onShowHistory,
    onShowDetails,
}: {
    task: FocusTask;
    isActiveTask: boolean;
    onToggleDone: () => void;
    onStartSession: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onShowHistory: () => void;
    onShowDetails: () => void;
}) {
    const cat = task.category ? CATEGORY_META[task.category] : null;
    const isDone = task.status === "done";

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border ${isActiveTask ? "border-[#C5A04E]/40" : isDone ? "border-white/[0.04] opacity-60" : "border-white/[0.04]"}`}>
            <button onClick={onToggleDone} className="shrink-0" aria-label={isDone ? "إلغاء الإكمال" : "إكمال"}>
                {isDone ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-500 hover:text-gray-300 transition-colors" />}
            </button>

            <div className="flex-1 min-w-0">
                <button
                    onClick={onShowDetails}
                    className={`text-sm font-bold text-right hover:underline ${isDone ? "text-gray-500 line-through" : "text-white"}`}
                >
                    {task.title}
                </button>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {cat && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.bg, color: cat.text }}>
                            {cat.label}
                        </span>
                    )}
                    {task.scheduled_date && (
                        <span className="text-[10px] text-gray-500">📅 {formatDateArabicShort(task.scheduled_date)}</span>
                    )}
                    <span className="text-[10px] text-gray-500">
                        الإجمالي: {formatDuration(task.time_total_seconds)} · الجلسات: {task.sessions_count_total}
                    </span>
                    {task.subtasks_count > 0 && <SubtaskCounter task={task} onClick={onShowDetails} />}
                </div>
            </div>

            {!isDone && (
                <button
                    onClick={onStartSession}
                    disabled={isActiveTask}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#C5A04E]/10 text-[#C5A04E] text-xs font-bold hover:bg-[#C5A04E]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Play className="w-3 h-3" />
                    {isActiveTask ? "نشطة" : "ابدأ"}
                </button>
            )}

            <TaskMenu>
                <MenuItem icon={<ListChecks className="w-4 h-4" />} label="المهام الفرعية" onClick={onShowDetails} />
                <MenuItem icon={<Pencil className="w-4 h-4" />} label="تعديل" onClick={onEdit} />
                <MenuItem icon={<History className="w-4 h-4" />} label="السجل" onClick={onShowHistory} />
                <MenuItem icon={<Trash2 className="w-4 h-4" />} label="حذف" danger onClick={onDelete} />
            </TaskMenu>
        </div>
    );
}

// ─── Subtask counter badge ────────────────────────────────────
function SubtaskCounter({ task, onClick }: { task: FocusTask; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="text-[10px] text-gray-400 flex items-center gap-1 hover:text-[#C5A04E] transition-colors"
        >
            <ListChecks className="w-3 h-3" />
            <span dir="ltr">{task.subtasks_completed_count}/{task.subtasks_count}</span>
        </button>
    );
}

// ─── Stat cell (used in recurring grid) ───────────────────────
function StatCell({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-[#0A0A0A] border border-white/[0.04] rounded-lg px-2 py-1.5 text-center">
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">{label}</p>
            <p className="text-xs text-white font-mono mt-0.5">{value}</p>
        </div>
    );
}

// ─── Task menu (3-dot) ────────────────────────────────────────
function TaskMenu({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative shrink-0">
            <button
                onClick={() => setOpen((o) => !o)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-[#1A1A1A] hover:text-white transition-colors"
                aria-label="القائمة"
            >
                <MoreVertical className="w-4 h-4" />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div
                        className="absolute left-0 top-full mt-1 z-50 min-w-[180px] bg-[#1A1A1A] border border-[#C5A04E]/15 rounded-xl shadow-xl py-1 text-right"
                        onClick={() => setOpen(false)}
                    >
                        {children}
                    </div>
                </>
            )}
        </div>
    );
}

function MenuItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                danger ? "text-red-400 hover:bg-red-500/10" : "text-gray-300 hover:bg-[#222222]"
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

// ─── Task form ────────────────────────────────────────────────
function TaskForm({
    task,
    defaultType,
    defaultDate,
    onSubmit,
    onCancel,
}: {
    task?: FocusTask;
    defaultType: TaskType;
    defaultDate: string;
    onSubmit: (data: {
        title: string;
        description?: string;
        category?: TaskCategory;
        scheduled_date?: string;
        task_type: TaskType;
    }) => Promise<void>;
    onCancel: () => void;
}) {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [category, setCategory] = useState<TaskCategory>(task?.category || "professional");
    const [taskType, setTaskType] = useState<TaskType>(task?.task_type || defaultType);
    const [scheduledDate, setScheduledDate] = useState(task?.scheduled_date || defaultDate);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const showDate = taskType !== "recurring";

    const handleSubmit = async () => {
        if (!title.trim()) return;
        if (showDate && !scheduledDate) {
            setError("التاريخ مطلوب");
            return;
        }
        setSubmitting(true);
        setError(null);
        await onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            category,
            scheduled_date: showDate ? scheduledDate : undefined,
            task_type: taskType,
        });
        setSubmitting(false);
    };

    return (
        <div className="space-y-5">
            <h3 className="text-xl font-bold text-white">{task ? "تعديل المهمة" : "إضافة مهمة"}</h3>

            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">عنوان المهمة</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    placeholder="مثال: مراجعة الكود الجديد"
                    className="w-full bg-[#0A0A0A] border border-[#C5A04E]/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A04E]"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">وصف (اختياري)</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="تفاصيل إضافية..."
                    className="w-full bg-[#0A0A0A] border border-[#C5A04E]/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A04E] resize-none"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">الفئة</label>
                <div className="flex gap-2">
                    {(["personal", "professional"] as TaskCategory[]).map((c) => {
                        const meta = CATEGORY_META[c];
                        const active = category === c;
                        return (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border"
                                style={
                                    active
                                        ? { backgroundColor: meta.bg, color: meta.text, borderColor: meta.text }
                                        : { backgroundColor: "#1A1A1A", color: "#9CA3AF", borderColor: "transparent" }
                                }
                            >
                                {meta.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">نوع المهمة</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(["recurring", "one_time", "long_term"] as TaskType[]).map((t) => {
                        const meta = TYPE_META[t];
                        const Icon = meta.icon;
                        const active = taskType === t;
                        return (
                            <button
                                key={t}
                                onClick={() => setTaskType(t)}
                                className="p-3 rounded-xl text-right transition-colors border"
                                style={
                                    active
                                        ? { backgroundColor: meta.bg, borderColor: meta.text }
                                        : { backgroundColor: "#0A0A0A", borderColor: "rgba(255,255,255,0.04)" }
                                }
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon className="w-4 h-4" style={{ color: active ? meta.text : "#9CA3AF" }} />
                                    <span className="text-sm font-bold" style={{ color: active ? meta.text : "#fff" }}>
                                        {meta.label}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-500 leading-tight">{meta.subtitle}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Date — conditional */}
            {showDate && (
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">التاريخ المخطط</label>
                    <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#C5A04E]/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A04E]"
                        dir="ltr"
                    />
                </div>
            )}

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <div className="flex gap-3 pt-2">
                <button onClick={onCancel} disabled={submitting} className="flex-1 px-4 py-3 rounded-xl bg-[#1A1A1A] text-gray-400 font-bold hover:bg-[#222222] transition-colors disabled:opacity-50">
                    إلغاء
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!title.trim() || submitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#C5A04E] text-white font-bold hover:bg-[#D4B85C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    حفظ
                </button>
            </div>
        </div>
    );
}

// ─── Task history ─────────────────────────────────────────────
function TaskHistory({ task, sessions, onClose }: { task: FocusTask; sessions: FocusSession[]; onClose: () => void }) {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">سجل الجلسات</h3>
            <p className="text-sm text-gray-400">{task.title}</p>

            {sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">لا توجد جلسات لهذه المهمة اليوم</div>
            ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {sessions.map((s) => (
                        <div key={s.id} className="bg-[#0A0A0A] border border-white/[0.04] rounded-xl p-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-white">{formatTime(s.started_at)}</span>
                                <span className="text-xs text-gray-500">{STATUS_LABELS[s.status]}</span>
                            </div>
                            {s.notes && <p className="text-xs text-gray-400 mt-2">{s.notes}</p>}
                        </div>
                    ))}
                </div>
            )}

            <button onClick={onClose} className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] text-gray-300 font-bold hover:bg-[#222222] transition-colors">
                إغلاق
            </button>
        </div>
    );
}

// ─── Active session view ──────────────────────────────────────
function ActiveSessionView({
    session, elapsedSeconds, plannedSeconds, overtime,
    onPause, onResume, onStop, onAbandon,
}: {
    session: FocusSession;
    elapsedSeconds: number;
    plannedSeconds: number;
    overtime: boolean;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
    onAbandon: () => void;
}) {
    const isPaused = session.status === "paused";
    const progress = plannedSeconds > 0 ? Math.min(100, (elapsedSeconds / plannedSeconds) * 100) : 0;
    const linkedCat = session.focus_tasks?.category as TaskCategory | undefined;
    const catMeta = linkedCat ? CATEGORY_META[linkedCat] : null;

    return (
        <div className="text-center space-y-6">
            {session.task_id && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A04E]/10 border border-[#C5A04E]/20">
                    <Target className="w-3.5 h-3.5 text-[#C5A04E]" />
                    <span className="text-xs text-[#C5A04E] font-bold">
                        {session.subtask_id ? "مهمة فرعية مرتبطة" : "مهمة مرتبطة"}
                    </span>
                </div>
            )}

            <div className="space-y-2">
                {session.subtask_id && session.focus_tasks && (
                    <p className="text-xs text-gray-500">
                        🎯 {session.focus_tasks.title} <span className="text-gray-600">→</span>
                    </p>
                )}
                <h2 className="text-xl font-bold text-white">{session.task_title}</h2>
                {catMeta && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: catMeta.bg, color: catMeta.text }}>
                        <Tag className="w-3 h-3" />
                        {catMeta.label}
                    </span>
                )}
            </div>

            <div
                dir="ltr"
                className={`text-6xl md:text-8xl font-bold tracking-tight transition-colors ${
                    overtime ? "text-red-400" : isPaused ? "text-gray-500" : "text-white"
                }`}
                style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
                {formatHMS(elapsedSeconds)}
            </div>

            <div className="max-w-md mx-auto">
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${overtime ? "bg-red-400" : "bg-gradient-to-r from-[#C5A04E] to-[#0ea5e9]"}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    المدة المخططة: {session.planned_duration_minutes} دقيقة
                    {overtime && <span className="text-red-400 mr-2">· تجاوز الوقت</span>}
                    {isPaused && <span className="text-yellow-400 mr-2">· متوقف مؤقتاً</span>}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                {isPaused ? (
                    <button onClick={onResume} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#C5A04E] text-white font-bold hover:bg-[#D4B85C] transition-colors">
                        <Play className="w-5 h-5" /> استئناف
                    </button>
                ) : (
                    <button onClick={onPause} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] text-gray-300 font-bold hover:bg-[#222222] transition-colors border border-white/[0.08]">
                        <Pause className="w-5 h-5" /> إيقاف مؤقت
                    </button>
                )}
                <button onClick={onStop} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600/90 text-white font-bold hover:bg-green-600 transition-colors">
                    <Square className="w-5 h-5" /> إنهاء
                </button>
                <button onClick={onAbandon} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] text-red-400 font-bold hover:bg-red-500/10 transition-colors border border-red-500/20">
                    <X className="w-5 h-5" /> إلغاء
                </button>
            </div>
        </div>
    );
}

// ─── Start form ───────────────────────────────────────────────
function StartForm({
    selectedTask, selectedSubtask, onClearSelected, freeTitle, setFreeTitle,
    plannedMinutes, setPlannedMinutes, customDuration, setCustomDuration,
    onStart, starting,
}: {
    selectedTask: FocusTask | null;
    selectedSubtask: FocusSubtask | null;
    onClearSelected: () => void;
    freeTitle: string;
    setFreeTitle: (v: string) => void;
    plannedMinutes: number;
    setPlannedMinutes: (v: number) => void;
    customDuration: string;
    setCustomDuration: (v: string) => void;
    onStart: () => void;
    starting: boolean;
}) {
    const onCustomBlur = () => {
        const n = parseInt(customDuration, 10);
        if (!Number.isNaN(n) && n > 0) setPlannedMinutes(n);
    };

    return (
        <div className="space-y-6">
            {selectedTask ? (
                <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[#C5A04E]/5 border border-[#C5A04E]/20">
                    <div className="flex items-center gap-2 min-w-0">
                        <Target className="w-5 h-5 text-[#C5A04E] shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs text-[#C5A04E] font-bold mb-0.5">🎯 {selectedSubtask ? "المهمة الفرعية" : "المهمة"}</p>
                            {selectedSubtask ? (
                                <>
                                    <p className="text-gray-500 text-[11px] truncate">{selectedTask.title}</p>
                                    <p className="text-white text-sm font-bold truncate">↳ {selectedSubtask.title}</p>
                                </>
                            ) : (
                                <p className="text-white text-sm font-bold truncate">{selectedTask.title}</p>
                            )}
                        </div>
                    </div>
                    <button onClick={onClearSelected} className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-gray-400 text-xs font-bold hover:bg-[#222222] transition-colors">
                        إلغاء
                    </button>
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">على ماذا تعمل؟</label>
                    <input
                        type="text"
                        value={freeTitle}
                        onChange={(e) => setFreeTitle(e.target.value)}
                        placeholder="مثال: تحسين لوحة الإدارة"
                        className="w-full bg-[#0A0A0A] border border-[#C5A04E]/15 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-[#C5A04E]"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">المدة المخططة</label>
                <div className="flex flex-wrap gap-2">
                    {QUICK_DURATIONS.map((d) => (
                        <button
                            key={d}
                            onClick={() => { setPlannedMinutes(d); setCustomDuration(""); }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                plannedMinutes === d && !customDuration
                                    ? "bg-[#C5A04E] text-white"
                                    : "bg-[#1A1A1A] text-gray-400 hover:bg-[#222222]"
                            }`}
                        >
                            {d} دقيقة
                        </button>
                    ))}
                    <input
                        type="number"
                        min={1}
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                        onBlur={onCustomBlur}
                        placeholder="أخرى"
                        className="w-24 bg-[#1A1A1A] border border-[#C5A04E]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C5A04E]"
                    />
                </div>
            </div>

            <button
                onClick={onStart}
                disabled={(!selectedTask && !freeTitle.trim()) || starting}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#C5A04E] text-white text-lg font-bold hover:bg-[#D4B85C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                ابدأ
            </button>
        </div>
    );
}

// ─── Session row ──────────────────────────────────────────────
function SessionRow({ session, onClick }: { session: FocusSession; onClick: () => void }) {
    const linkedCat = session.focus_tasks?.category as TaskCategory | undefined;
    const catMeta = linkedCat ? CATEGORY_META[linkedCat] : null;
    const realSeconds = session.ended_at
        ? Math.max(0, Math.floor((new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()) / 1000) - (session.paused_seconds || 0))
        : 0;

    const statusIcon =
        session.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-green-500" />
        : session.status === "abandoned" ? <AlertCircle className="w-4 h-4 text-red-500" />
        : session.status === "paused" ? <PauseCircle className="w-4 h-4 text-yellow-500" />
        : <Play className="w-4 h-4 text-[#C5A04E]" />;

    return (
        <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] transition-colors text-right border border-white/[0.04]">
            <div className="shrink-0">{statusIcon}</div>
            <div className="text-xs text-gray-500 font-mono shrink-0 w-12" dir="ltr">{formatTime(session.started_at)}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{session.task_title}</p>
                {session.notes && <p className="text-xs text-gray-500 truncate mt-0.5">{session.notes}</p>}
            </div>
            {catMeta && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: catMeta.bg, color: catMeta.text }}>
                    {catMeta.label}
                </span>
            )}
            {session.status === "completed" && (
                <span className="text-xs text-gray-400 font-mono shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(realSeconds)}
                </span>
            )}
        </button>
    );
}

// ─── Session detail ───────────────────────────────────────────
function SessionDetail({ session, onClose }: { session: FocusSession; onClose: () => void }) {
    const linkedCat = session.focus_tasks?.category as TaskCategory | undefined;
    const catMeta = linkedCat ? CATEGORY_META[linkedCat] : null;
    const realSeconds = session.ended_at
        ? Math.max(0, Math.floor((new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()) / 1000) - (session.paused_seconds || 0))
        : 0;
    const realMinutes = Math.floor(realSeconds / 60);
    const pausedMinutes = Math.floor((session.paused_seconds || 0) / 60);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{session.task_title}</h3>
            {catMeta && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: catMeta.bg, color: catMeta.text }}>
                    <Tag className="w-3 h-3" />
                    {catMeta.label}
                </span>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="الحالة" value={STATUS_LABELS[session.status] || session.status} />
                <Field label="وقت البدء" value={formatTime(session.started_at)} />
                {session.ended_at && <Field label="وقت الانتهاء" value={formatTime(session.ended_at)} />}
                <Field label="المدة المخططة" value={`${session.planned_duration_minutes} دقيقة`} />
                {session.ended_at && <Field label="المدة الفعلية" value={`${realMinutes} دقيقة`} />}
                {session.paused_seconds > 0 && <Field label="الإيقاف المؤقت" value={`${pausedMinutes} دقيقة`} />}
            </div>

            <div className="bg-[#0A0A0A] border border-[#C5A04E]/10 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 mb-2">ملاحظات</p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                    {session.notes || <span className="text-gray-600">لا توجد ملاحظات</span>}
                </p>
            </div>

            <button onClick={onClose} className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] text-gray-300 font-bold hover:bg-[#222222] transition-colors">
                إغلاق
            </button>
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-[#0A0A0A] border border-[#C5A04E]/10 rounded-xl px-3 py-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-white text-sm font-mono">{value}</p>
        </div>
    );
}

// ─── Task details modal (with subtasks) ───────────────────────
function TaskDetailsModal({
    task,
    recentSessions,
    onTitleSave,
    onSubtaskChanged,
    onStartSessionGeneral,
    onStartSessionSubtask,
    onClose,
    activeTaskId,
    activeSubtaskId,
}: {
    task: FocusTask;
    recentSessions: FocusSession[];
    onTitleSave: (title: string) => Promise<void>;
    onSubtaskChanged: () => Promise<void>;
    onStartSessionGeneral: () => void;
    onStartSessionSubtask: (subtask: FocusSubtask) => void;
    onClose: () => void;
    activeTaskId: string | null;
    activeSubtaskId: string | null;
}) {
    const subtasksApi = useFocusSubtasks(task.id);
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleDraft, setTitleDraft] = useState(task.title);
    const [savingTitle, setSavingTitle] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [adding, setAdding] = useState(false);

    const cat = task.category ? CATEGORY_META[task.category] : null;
    const typeMeta = TYPE_META[task.task_type];
    const TypeIcon = typeMeta.icon;

    const completedCount = subtasksApi.subtasks.filter((s) => s.is_completed).length;
    const totalCount = subtasksApi.subtasks.length;

    const handleTitleSave = async () => {
        const t = titleDraft.trim();
        if (!t || t === task.title) {
            setEditingTitle(false);
            setTitleDraft(task.title);
            return;
        }
        setSavingTitle(true);
        await onTitleSave(t);
        setSavingTitle(false);
        setEditingTitle(false);
    };

    const handleAdd = async () => {
        const t = newSubtaskTitle.trim();
        if (!t) return;
        setAdding(true);
        await subtasksApi.createSubtask(t);
        await onSubtaskChanged();
        setNewSubtaskTitle("");
        setAdding(false);
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                {editingTitle ? (
                    <input
                        type="text"
                        value={titleDraft}
                        onChange={(e) => setTitleDraft(e.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleTitleSave();
                            if (e.key === "Escape") { setEditingTitle(false); setTitleDraft(task.title); }
                        }}
                        autoFocus
                        disabled={savingTitle}
                        className="w-full bg-[#1A1A1A] border border-[#C5A04E]/30 rounded-xl px-3 py-2 text-white text-lg font-bold focus:outline-none focus:border-[#C5A04E]"
                    />
                ) : (
                    <h3
                        onClick={() => { setTitleDraft(task.title); setEditingTitle(true); }}
                        className="text-xl font-bold text-white cursor-text hover:bg-[#1A1A1A] rounded-lg px-2 py-1 -mx-2 transition-colors"
                    >
                        {task.title}
                    </h3>
                )}

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: typeMeta.bg, color: typeMeta.text }}
                    >
                        <TypeIcon className="w-3 h-3" />
                        {typeMeta.label}
                    </span>
                    {cat && (
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: cat.bg, color: cat.text }}
                        >
                            {cat.label}
                        </span>
                    )}
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    الإجمالي: <span className="text-[#C5A04E] font-bold">{formatDuration(task.time_total_seconds)}</span>
                    {" · "}
                    {task.sessions_count_total} جلسة
                </p>
            </div>

            <div className="h-px bg-[#C5A04E]/10" />

            {/* Subtasks section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-bold text-white">المهام الفرعية</h4>
                    {totalCount > 0 && (
                        <span className="text-xs text-gray-500">
                            <span dir="ltr">{completedCount} / {totalCount}</span> مكتملة
                        </span>
                    )}
                </div>

                {/* Add field */}
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
                        placeholder="+ إضافة مهمة فرعية..."
                        disabled={adding}
                        className="flex-1 bg-[#1A1A1A] border border-[#C5A04E]/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C5A04E] disabled:opacity-50"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newSubtaskTitle.trim() || adding}
                        className="px-3 py-2 rounded-xl bg-[#C5A04E] text-white text-sm font-bold hover:bg-[#D4B85C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </button>
                </div>

                {/* List */}
                {subtasksApi.loading ? (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                    </div>
                ) : subtasksApi.subtasks.length === 0 ? (
                    <p className="text-center py-6 text-gray-500 text-xs">لا توجد مهام فرعية. أضف واحدة للبدء!</p>
                ) : (
                    <div className="space-y-1.5">
                        {subtasksApi.subtasks.map((st) => (
                            <SubtaskRow
                                key={st.id}
                                subtask={st}
                                isActive={activeTaskId === task.id && activeSubtaskId === st.id}
                                onToggle={async () => {
                                    await subtasksApi.toggleCompleted(st.id);
                                    await onSubtaskChanged();
                                }}
                                onRename={async (newTitle) => {
                                    await subtasksApi.updateSubtask(st.id, { title: newTitle });
                                }}
                                onDelete={async () => {
                                    if (confirm(`حذف المهمة الفرعية "${st.title}"؟`)) {
                                        await subtasksApi.deleteSubtask(st.id);
                                        await onSubtaskChanged();
                                    }
                                }}
                                onStartSession={() => onStartSessionSubtask(st)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Recent sessions */}
            {recentSessions.length > 0 && (
                <>
                    <div className="h-px bg-[#C5A04E]/10" />
                    <div>
                        <h4 className="text-base font-bold text-white mb-3">آخر الجلسات</h4>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                            {recentSessions.map((s) => (
                                <div key={s.id} className="bg-[#1A1A1A] rounded-lg px-3 py-2 text-xs flex items-center gap-2">
                                    <span className="text-gray-500 font-mono shrink-0" dir="ltr">{formatTime(s.started_at)}</span>
                                    <span className="flex-1 text-gray-300 truncate">{s.task_title}</span>
                                    {s.status === "completed" && s.ended_at && (
                                        <span className="text-[#C5A04E] shrink-0 font-mono">
                                            {formatDuration(
                                                Math.max(0, Math.floor((new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 1000) - (s.paused_seconds || 0))
                                            )}
                                        </span>
                                    )}
                                    <span className="text-gray-600 text-[10px] shrink-0">{STATUS_LABELS[s.status]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Footer buttons */}
            <div className="flex gap-3 pt-2">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#1A1A1A] text-gray-300 font-bold hover:bg-[#222222] transition-colors"
                >
                    إغلاق
                </button>
                <button
                    onClick={onStartSessionGeneral}
                    disabled={activeTaskId === task.id}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#C5A04E] text-white font-bold hover:bg-[#D4B85C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Play className="w-4 h-4" />
                    ابدأ جلسة (مهمة عامة)
                </button>
            </div>
        </div>
    );
}

// ─── Subtask row (in details modal) ───────────────────────────
function SubtaskRow({
    subtask,
    isActive,
    onToggle,
    onRename,
    onDelete,
    onStartSession,
}: {
    subtask: FocusSubtask;
    isActive: boolean;
    onToggle: () => Promise<void>;
    onRename: (title: string) => Promise<void>;
    onDelete: () => void;
    onStartSession: () => void;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(subtask.title);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        const t = draft.trim();
        if (!t || t === subtask.title) {
            setEditing(false);
            setDraft(subtask.title);
            return;
        }
        setSaving(true);
        await onRename(t);
        setSaving(false);
        setEditing(false);
    };

    return (
        <div className={`flex items-center gap-2 p-2 rounded-lg bg-[#1A1A1A] border ${isActive ? "border-[#C5A04E]/40" : "border-transparent"} ${subtask.is_completed ? "opacity-60" : ""}`}>
            <button onClick={onToggle} className="shrink-0" aria-label={subtask.is_completed ? "إلغاء" : "إكمال"}>
                {subtask.is_completed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                    <Circle className="w-4 h-4 text-gray-500 hover:text-gray-300 transition-colors" />
                )}
            </button>

            {editing ? (
                <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                        if (e.key === "Escape") { setEditing(false); setDraft(subtask.title); }
                    }}
                    autoFocus
                    disabled={saving}
                    className="flex-1 bg-[#0A0A0A] border border-[#C5A04E]/30 rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:border-[#C5A04E]"
                />
            ) : (
                <button
                    onClick={() => { setDraft(subtask.title); setEditing(true); }}
                    className={`flex-1 text-right text-sm hover:underline ${subtask.is_completed ? "text-gray-500 line-through" : "text-white"}`}
                >
                    {subtask.title}
                </button>
            )}

            {subtask.total_time_seconds > 0 && (
                <span className="text-[10px] text-gray-500 shrink-0 font-mono">
                    {formatDuration(subtask.total_time_seconds)}
                </span>
            )}

            {!subtask.is_completed && (
                <button
                    onClick={onStartSession}
                    disabled={isActive}
                    className="shrink-0 p-1.5 rounded-md bg-[#C5A04E]/10 text-[#C5A04E] hover:bg-[#C5A04E]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="ابدأ جلسة"
                    title="ابدأ جلسة"
                >
                    <Play className="w-3.5 h-3.5" />
                </button>
            )}

            <button
                onClick={onDelete}
                className="shrink-0 p-1.5 rounded-md text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                aria-label="حذف"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

function Modal({ children, onClose, large }: { children: React.ReactNode; onClose: () => void; large?: boolean }) {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in" onClick={onClose}>
            <div
                className={`bg-[#0F0F0F] border border-[#C5A04E]/20 rounded-2xl p-6 w-full max-h-[90vh] overflow-y-auto ${large ? "max-w-2xl" : "max-w-md"}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
