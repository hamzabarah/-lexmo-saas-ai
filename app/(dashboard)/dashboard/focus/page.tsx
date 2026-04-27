"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useFocusTasks, FocusTask, TaskCategory, TaskStatus } from "@/lib/hooks/useFocusTasks";
import {
    Lock, Play, Pause, Square, X, Timer, Tag, Clock, Loader2,
    CheckCircle2, AlertCircle, PauseCircle, Plus, Target,
    MoreVertical, Pencil, Trash2, History, Circle, CheckCircle
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
    focus_tasks: { id: string; title: string; category: string | null } | null;
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

const TASK_FILTERS: { value: "all" | TaskStatus; label: string }[] = [
    { value: "all", label: "الكل" },
    { value: "todo", label: "للقيام" },
    { value: "in_progress", label: "قيد التنفيذ" },
    { value: "done", label: "مكتمل" },
];

const CATEGORY_META: Record<TaskCategory, { label: string; bg: string; text: string }> = {
    personal: { label: "شخصي", bg: "rgba(59, 130, 246, 0.15)", text: "#93C5FD" },
    professional: { label: "مهني", bg: "rgba(197, 160, 78, 0.15)", text: "#FDE68A" },
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

function formatMinutesArabic(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0) return `${h} ساعة و ${m} دقيقة`;
    return `${m} دقيقة`;
}

function formatSecondsAsMinutesArabic(totalSeconds: number): string {
    return formatMinutesArabic(Math.floor(totalSeconds / 60));
}

function todayISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDateArabic(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("ar-u-nu-latn", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
}

export default function FocusPage() {
    const [authChecked, setAuthChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    // Sessions data
    const [sessionsData, setSessionsData] = useState<SessionsResponse | null>(null);
    const [sessionsLoading, setSessionsLoading] = useState(true);

    // Tasks
    const today = useMemo(() => todayISO(), []);
    const tasksApi = useFocusTasks(today);

    // Selected task (pre-filled in tracker form, not yet started)
    const [selectedTask, setSelectedTask] = useState<FocusTask | null>(null);

    // Tracker form state
    const [plannedMinutes, setPlannedMinutes] = useState<number>(40);
    const [customDuration, setCustomDuration] = useState<string>("");
    const [freeTitle, setFreeTitle] = useState("");
    const [starting, setStarting] = useState(false);

    // Active session ticker
    const [, setTick] = useState(0);
    const pauseStartedAtRef = useRef<number | null>(null);

    // Modals
    const [stopModal, setStopModal] = useState<{ session: FocusSession; notes: string } | null>(null);
    const [savingStop, setSavingStop] = useState(false);
    const [detailModal, setDetailModal] = useState<FocusSession | null>(null);

    // Tasks UI state
    const [taskFilter, setTaskFilter] = useState<"all" | TaskStatus>("all");
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [editTaskModal, setEditTaskModal] = useState<FocusTask | null>(null);
    const [historyModal, setHistoryModal] = useState<FocusTask | null>(null);

    // ─── Admin auth check ───
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setAuthorized(user?.email === ADMIN_EMAIL);
            setAuthChecked(true);
        });
    }, []);

    // ─── Load sessions ───
    const refreshSessions = useCallback(async () => {
        try {
            const res = await fetch("/api/focus", { credentials: "include" });
            if (!res.ok) return;
            const json: SessionsResponse = await res.json();
            setSessionsData(json);
        } catch {
            /* */
        }
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

    const elapsedSeconds = useMemo(() => {
        if (!activeSession) return 0;
        const startMs = new Date(activeSession.started_at).getTime();
        const nowMs = activeSession.status === "paused" && pauseStartedAtRef.current
            ? pauseStartedAtRef.current
            : Date.now();
        const raw = (nowMs - startMs) / 1000 - (activeSession.paused_seconds || 0);
        return Math.max(0, Math.floor(raw));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSession, sessionsData]);

    const plannedSeconds = (activeSession?.planned_duration_minutes || 0) * 60;
    const overtime = activeSession && elapsedSeconds > plannedSeconds && plannedSeconds > 0;

    // ─── Tracker actions ───
    const handleStart = async () => {
        const title = (selectedTask?.title || freeTitle).trim();
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
                }),
            });
            if (res.ok) {
                setFreeTitle("");
                setCustomDuration("");
                setSelectedTask(null);
                await refreshSessions();
                if (selectedTask) await tasksApi.refresh();
            }
        } catch {
            /* */
        }
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
        setFreeTitle("");
    };

    const toggleTaskDone = async (task: FocusTask) => {
        if (task.status === "done") {
            await tasksApi.markAsTodo(task);
        } else {
            await tasksApi.markAsDone(task.id);
        }
    };

    // ─── Filtered tasks ───
    const filteredTasks = useMemo(() => {
        if (taskFilter === "all") return tasksApi.tasks;
        return tasksApi.tasks.filter((t) => t.status === taskFilter);
    }, [tasksApi.tasks, taskFilter]);

    // ─── Render ───
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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* ──────────── SECTION 1 — TASKS ──────────── */}
            <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                        <Target className="w-6 h-6 text-[#C5A04E]" />
                        <h2 className="text-xl font-bold text-white">مهام اليوم</h2>
                    </div>
                    <button
                        onClick={() => setShowAddTaskModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A04E] text-white text-sm font-bold hover:bg-[#D4B85C] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة مهمة
                    </button>
                </div>
                <p className="text-xs text-gray-500 mb-4">{formatDateArabic(today)}</p>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {TASK_FILTERS.map((f) => {
                        const count =
                            f.value === "all"
                                ? tasksApi.tasks.length
                                : tasksApi.stats[f.value as TaskStatus] || 0;
                        return (
                            <button
                                key={f.value}
                                onClick={() => setTaskFilter(f.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                    taskFilter === f.value
                                        ? "bg-[#C5A04E] text-white"
                                        : "bg-[#1A1A1A] text-gray-400 hover:bg-[#222222]"
                                }`}
                            >
                                {f.label} {count > 0 && <span className="opacity-70">({count})</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Task list */}
                {tasksApi.loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        {taskFilter === "all"
                            ? "لا توجد مهام لهذا اليوم. ابدأ بإضافة مهمة!"
                            : "لا توجد مهام في هذه الفئة"}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredTasks.map((task) => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                isActiveTask={activeSession?.task_id === task.id}
                                onToggleDone={() => toggleTaskDone(task)}
                                onStartSession={() => startSessionFromTask(task)}
                                onEdit={() => setEditTaskModal(task)}
                                onDelete={async () => {
                                    if (confirm(`حذف المهمة "${task.title}"؟`)) {
                                        await tasksApi.deleteTask(task.id);
                                    }
                                }}
                                onShowHistory={() => setHistoryModal(task)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ──────────── SECTION 2 — TRACKER ──────────── */}
            <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Timer className="w-6 h-6 text-[#C5A04E]" />
                    <h2 className="text-xl font-bold text-white">متتبع التركيز</h2>
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
                        onClearSelectedTask={() => setSelectedTask(null)}
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

            {/* ──────────── SESSIONS LIST ──────────── */}
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
                    <div className="text-center py-10 text-gray-500 text-sm">
                        لا توجد جلسات اليوم
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sessions.map((s) => (
                            <SessionRow key={s.id} session={s} onClick={() => setDetailModal(s)} />
                        ))}
                    </div>
                )}
            </div>

            {/* ──────────── MODALS ──────────── */}
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
                        <button
                            onClick={() => setStopModal(null)}
                            disabled={savingStop}
                            className="flex-1 px-4 py-3 rounded-xl bg-[#1A1A1A] text-gray-400 font-bold hover:bg-[#222222] transition-colors disabled:opacity-50"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleStopConfirm}
                            disabled={savingStop}
                            className="flex-1 px-4 py-3 rounded-xl bg-[#C5A04E] text-white font-bold hover:bg-[#D4B85C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
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

            {showAddTaskModal && (
                <Modal onClose={() => setShowAddTaskModal(false)}>
                    <TaskForm
                        defaultDate={today}
                        onCancel={() => setShowAddTaskModal(false)}
                        onSubmit={async (data) => {
                            await tasksApi.createTask(data);
                            setShowAddTaskModal(false);
                        }}
                    />
                </Modal>
            )}

            {editTaskModal && (
                <Modal onClose={() => setEditTaskModal(null)}>
                    <TaskForm
                        task={editTaskModal}
                        defaultDate={today}
                        onCancel={() => setEditTaskModal(null)}
                        onSubmit={async (data) => {
                            await tasksApi.updateTask(editTaskModal.id, data);
                            setEditTaskModal(null);
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
        </div>
    );
}

// ─── Task row ─────────────────────────────────────────────────
function TaskRow({
    task,
    isActiveTask,
    onToggleDone,
    onStartSession,
    onEdit,
    onDelete,
    onShowHistory,
}: {
    task: FocusTask;
    isActiveTask: boolean;
    onToggleDone: () => void;
    onStartSession: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onShowHistory: () => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const cat = task.category ? CATEGORY_META[task.category] : null;
    const isDone = task.status === "done";
    const inProgress = task.status === "in_progress" || isActiveTask;

    return (
        <div
            className={`flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] transition-all border ${
                inProgress
                    ? "border-[#C5A04E]/40"
                    : isDone
                    ? "border-white/[0.04] opacity-60"
                    : "border-white/[0.04]"
            }`}
        >
            {/* Checkbox (right in RTL) */}
            <button onClick={onToggleDone} className="shrink-0" aria-label={isDone ? "إلغاء الإكمال" : "إكمال"}>
                {isDone ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                    <Circle className="w-5 h-5 text-gray-500 hover:text-gray-300 transition-colors" />
                )}
            </button>

            {/* Title + meta */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${isDone ? "text-gray-500 line-through" : "text-white"}`}>
                    {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    {cat && (
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: cat.bg, color: cat.text }}
                        >
                            {cat.label}
                        </span>
                    )}
                    {task.total_time_seconds > 0 && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatSecondsAsMinutesArabic(task.total_time_seconds)}
                        </span>
                    )}
                    {task.sessions_count > 0 && (
                        <span className="text-[10px] text-gray-600">· {task.sessions_count} جلسة</span>
                    )}
                </div>
            </div>

            {/* Start session button */}
            {!isDone && (
                <button
                    onClick={onStartSession}
                    disabled={isActiveTask}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C5A04E]/10 text-[#C5A04E] text-xs font-bold hover:bg-[#C5A04E]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Play className="w-3 h-3" />
                    {isActiveTask ? "نشطة" : "ابدأ جلسة"}
                </button>
            )}

            {/* Menu */}
            <div className="relative shrink-0">
                <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-[#1A1A1A] hover:text-white transition-colors"
                    aria-label="القائمة"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setMenuOpen(false)}
                        />
                        <div className="absolute left-0 top-full mt-1 z-50 min-w-[180px] bg-[#1A1A1A] border border-[#C5A04E]/15 rounded-xl shadow-xl py-1 text-right">
                            <MenuItem icon={<Pencil className="w-4 h-4" />} label="تعديل" onClick={() => { setMenuOpen(false); onEdit(); }} />
                            <MenuItem icon={<History className="w-4 h-4" />} label="السجل" onClick={() => { setMenuOpen(false); onShowHistory(); }} />
                            <MenuItem icon={<Trash2 className="w-4 h-4" />} label="حذف" danger onClick={() => { setMenuOpen(false); onDelete(); }} />
                        </div>
                    </>
                )}
            </div>
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

// ─── Task form (create/edit) ──────────────────────────────────
function TaskForm({
    task,
    defaultDate,
    onSubmit,
    onCancel,
}: {
    task?: FocusTask;
    defaultDate: string;
    onSubmit: (data: {
        title: string;
        description?: string;
        category?: TaskCategory;
        scheduled_date?: string;
    }) => Promise<void>;
    onCancel: () => void;
}) {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [category, setCategory] = useState<TaskCategory>(task?.category || "professional");
    const [scheduledDate, setScheduledDate] = useState(task?.scheduled_date || defaultDate);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setSubmitting(true);
        await onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            category,
            scheduled_date: scheduledDate,
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
                    rows={3}
                    placeholder="تفاصيل إضافية..."
                    className="w-full bg-[#0A0A0A] border border-[#C5A04E]/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A04E] resize-none"
                />
            </div>

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
                                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-colors border"
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

            <div className="flex gap-3 pt-2">
                <button
                    onClick={onCancel}
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#1A1A1A] text-gray-400 font-bold hover:bg-[#222222] transition-colors disabled:opacity-50"
                >
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

// ─── Task history (sessions for a task) ───────────────────────
function TaskHistory({
    task,
    sessions,
    onClose,
}: {
    task: FocusTask;
    sessions: FocusSession[];
    onClose: () => void;
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">سجل الجلسات</h3>
            <p className="text-sm text-gray-400">{task.title}</p>

            {sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                    لا توجد جلسات لهذه المهمة اليوم
                </div>
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

            <button
                onClick={onClose}
                className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] text-gray-300 font-bold hover:bg-[#222222] transition-colors"
            >
                إغلاق
            </button>
        </div>
    );
}

// ─── Active session view ──────────────────────────────────────
function ActiveSessionView({
    session,
    elapsedSeconds,
    plannedSeconds,
    overtime,
    onPause,
    onResume,
    onStop,
    onAbandon,
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
            {/* Linked task badge */}
            {session.task_id && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A04E]/10 border border-[#C5A04E]/20">
                    <Target className="w-3.5 h-3.5 text-[#C5A04E]" />
                    <span className="text-xs text-[#C5A04E] font-bold">مهمة مرتبطة</span>
                </div>
            )}

            <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">{session.task_title}</h2>
                {catMeta && (
                    <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: catMeta.bg, color: catMeta.text }}
                    >
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
                        className={`h-full rounded-full transition-all duration-1000 ${
                            overtime ? "bg-red-400" : "bg-gradient-to-r from-[#C5A04E] to-[#0ea5e9]"
                        }`}
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
                    <button
                        onClick={onResume}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#C5A04E] text-white font-bold hover:bg-[#D4B85C] transition-colors"
                    >
                        <Play className="w-5 h-5" /> استئناف
                    </button>
                ) : (
                    <button
                        onClick={onPause}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] text-gray-300 font-bold hover:bg-[#222222] transition-colors border border-white/[0.08]"
                    >
                        <Pause className="w-5 h-5" /> إيقاف مؤقت
                    </button>
                )}
                <button
                    onClick={onStop}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600/90 text-white font-bold hover:bg-green-600 transition-colors"
                >
                    <Square className="w-5 h-5" /> إنهاء
                </button>
                <button
                    onClick={onAbandon}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] text-red-400 font-bold hover:bg-red-500/10 transition-colors border border-red-500/20"
                >
                    <X className="w-5 h-5" /> إلغاء
                </button>
            </div>
        </div>
    );
}

// ─── Start form ───────────────────────────────────────────────
function StartForm({
    selectedTask,
    onClearSelectedTask,
    freeTitle,
    setFreeTitle,
    plannedMinutes,
    setPlannedMinutes,
    customDuration,
    setCustomDuration,
    onStart,
    starting,
}: {
    selectedTask: FocusTask | null;
    onClearSelectedTask: () => void;
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
                            <p className="text-xs text-[#C5A04E] font-bold mb-0.5">🎯 المهمة</p>
                            <p className="text-white text-sm font-bold truncate">{selectedTask.title}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClearSelectedTask}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-gray-400 text-xs font-bold hover:bg-[#222222] transition-colors"
                    >
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
                            onClick={() => {
                                setPlannedMinutes(d);
                                setCustomDuration("");
                            }}
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
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] transition-colors text-right border border-white/[0.04]"
        >
            <div className="shrink-0">{statusIcon}</div>
            <div className="text-xs text-gray-500 font-mono shrink-0 w-12" dir="ltr">{formatTime(session.started_at)}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{session.task_title}</p>
                {session.notes && <p className="text-xs text-gray-500 truncate mt-0.5">{session.notes}</p>}
            </div>
            {catMeta && (
                <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: catMeta.bg, color: catMeta.text }}
                >
                    {catMeta.label}
                </span>
            )}
            {session.status === "completed" && (
                <span className="text-xs text-gray-400 font-mono shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.floor(realSeconds / 60)} دقيقة
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
                <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: catMeta.bg, color: catMeta.text }}
                >
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

            <button
                onClick={onClose}
                className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] text-gray-300 font-bold hover:bg-[#222222] transition-colors"
            >
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

// ─── Modal ───────────────────────────────────────────────────
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#111111] border border-[#C5A04E]/15 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
