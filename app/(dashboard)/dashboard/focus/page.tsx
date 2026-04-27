"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Lock, Play, Pause, Square, X, Timer, Tag, Clock, Loader2, CheckCircle2, AlertCircle, PauseCircle } from "lucide-react";

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
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    sessions: FocusSession[];
    stats: { totalMinutes: number; completedCount: number; abandonedCount: number };
}

const CATEGORIES = [
    { value: "code", label: "برمجة", color: "#22d3ee" },
    { value: "design", label: "تصميم", color: "#f472b6" },
    { value: "admin", label: "إدارة", color: "#a78bfa" },
    { value: "etude", label: "دراسة", color: "#34d399" },
    { value: "marketing", label: "تسويق", color: "#fbbf24" },
    { value: "autre", label: "أخرى", color: "#9ca3af" },
];

const QUICK_DURATIONS = [25, 40, 60, 90];

const STATUS_LABELS: Record<string, string> = {
    running: "قيد التنفيذ",
    paused: "متوقف مؤقتاً",
    completed: "مكتمل",
    abandoned: "ملغى",
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

// "Y دقيقة" if no hours, "X ساعة و Y دقيقة" otherwise
function formatMinutesArabic(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0) return `${h} ساعة و ${m} دقيقة`;
    return `${m} دقيقة`;
}

function categoryMeta(value: string | null) {
    return CATEGORIES.find((c) => c.value === value) || null;
}

export default function FocusPage() {
    const [authChecked, setAuthChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Start form
    const [taskTitle, setTaskTitle] = useState("");
    const [category, setCategory] = useState<string>("code");
    const [plannedMinutes, setPlannedMinutes] = useState<number>(40);
    const [customDuration, setCustomDuration] = useState<string>("");
    const [starting, setStarting] = useState(false);

    // Timer ticker
    const [, setTick] = useState(0);

    // Pause tracking (client-side: when did the current pause start?)
    const pauseStartedAtRef = useRef<number | null>(null);

    // Stop modal
    const [stopModal, setStopModal] = useState<{ session: FocusSession; notes: string } | null>(null);
    const [savingStop, setSavingStop] = useState(false);

    // Detail modal
    const [detailModal, setDetailModal] = useState<FocusSession | null>(null);

    // ─── Admin auth check ───
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setAuthorized(user?.email === ADMIN_EMAIL);
            setAuthChecked(true);
        });
    }, []);

    // ─── Load sessions ───
    const refresh = useCallback(async () => {
        try {
            const res = await fetch("/api/focus", { credentials: "include" });
            if (!res.ok) return;
            const json: ApiResponse = await res.json();
            setData(json);
        } catch {
            /* non-blocking */
        }
    }, []);

    useEffect(() => {
        if (!authorized) return;
        setLoading(true);
        refresh().finally(() => setLoading(false));
    }, [authorized, refresh]);

    // ─── Active session ticker (1s) ───
    const activeSession = useMemo(
        () => data?.sessions.find((s) => s.status === "running" || s.status === "paused") || null,
        [data]
    );

    useEffect(() => {
        if (!activeSession || activeSession.status !== "running") return;
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [activeSession]);

    // Sync local pause ref with server status
    useEffect(() => {
        if (activeSession?.status === "paused" && pauseStartedAtRef.current === null) {
            pauseStartedAtRef.current = Date.now();
        }
        if (activeSession?.status === "running") {
            pauseStartedAtRef.current = null;
        }
    }, [activeSession?.status]);

    // ─── Compute elapsed seconds for active session ───
    const elapsedSeconds = useMemo(() => {
        if (!activeSession) return 0;
        const startMs = new Date(activeSession.started_at).getTime();
        const nowMs = activeSession.status === "paused" && pauseStartedAtRef.current
            ? pauseStartedAtRef.current
            : Date.now();
        const raw = (nowMs - startMs) / 1000 - (activeSession.paused_seconds || 0);
        return Math.max(0, Math.floor(raw));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSession, data]);

    const plannedSeconds = (activeSession?.planned_duration_minutes || 0) * 60;
    const overtime = activeSession && elapsedSeconds > plannedSeconds && plannedSeconds > 0;

    // ─── Actions ───
    const handleStart = async () => {
        if (!taskTitle.trim()) return;
        setStarting(true);
        try {
            const res = await fetch("/api/focus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    task_title: taskTitle,
                    category,
                    planned_duration_minutes: plannedMinutes,
                }),
            });
            if (res.ok) {
                setTaskTitle("");
                setCustomDuration("");
                await refresh();
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
        await refresh();
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
        await refresh();
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
        await refresh();
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
        await refresh();
    };

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

    const sessions = data?.sessions || [];
    const stats = data?.stats || { totalMinutes: 0, completedCount: 0, abandonedCount: 0 };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Timer className="w-7 h-7 text-[#C5A04E]" />
                <h1 className="text-2xl font-bold text-white">متتبع التركيز</h1>
            </div>

            {/* ─── Active session OR Start form ─── */}
            <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-8">
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
                        taskTitle={taskTitle}
                        setTaskTitle={setTaskTitle}
                        category={category}
                        setCategory={setCategory}
                        plannedMinutes={plannedMinutes}
                        setPlannedMinutes={setPlannedMinutes}
                        customDuration={customDuration}
                        setCustomDuration={setCustomDuration}
                        onStart={handleStart}
                        starting={starting}
                    />
                )}
            </div>

            {/* ─── Today's sessions ─── */}
            <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">اليوم</h2>
                    {!loading && (
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

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        لا توجد جلسات اليوم — ابدأ جلستك الأولى!
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sessions.map((s) => (
                            <SessionRow key={s.id} session={s} onClick={() => setDetailModal(s)} />
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Stop modal ─── */}
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

            {/* ─── Detail modal ─── */}
            {detailModal && (
                <Modal onClose={() => setDetailModal(null)}>
                    <SessionDetail session={detailModal} onClose={() => setDetailModal(null)} />
                </Modal>
            )}
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
    const cat = categoryMeta(session.category);
    const isPaused = session.status === "paused";
    const progress = plannedSeconds > 0 ? Math.min(100, (elapsedSeconds / plannedSeconds) * 100) : 0;

    return (
        <div className="text-center space-y-6">
            {/* Task title + category */}
            <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">{session.task_title}</h2>
                {cat && (
                    <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                        <Tag className="w-3 h-3" />
                        {cat.label}
                    </span>
                )}
            </div>

            {/* Big timer (LTR for digits) */}
            <div
                dir="ltr"
                className={`text-6xl md:text-8xl font-bold tracking-tight transition-colors ${
                    overtime ? "text-red-400" : isPaused ? "text-gray-500" : "text-white"
                }`}
                style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
                {formatHMS(elapsedSeconds)}
            </div>

            {/* Progress bar + planned */}
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

            {/* Controls */}
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
    taskTitle,
    setTaskTitle,
    category,
    setCategory,
    plannedMinutes,
    setPlannedMinutes,
    customDuration,
    setCustomDuration,
    onStart,
    starting,
}: {
    taskTitle: string;
    setTaskTitle: (v: string) => void;
    category: string;
    setCategory: (v: string) => void;
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
            {/* Task title */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">على ماذا تعمل؟</label>
                <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="مثال: تحسين لوحة الإدارة"
                    autoFocus
                    className="w-full bg-[#0A0A0A] border border-[#C5A04E]/15 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-[#C5A04E]"
                />
            </div>

            {/* Duration */}
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

            {/* Category */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">الفئة</label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => setCategory(c.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors border ${
                                category === c.value
                                    ? "border-transparent text-white"
                                    : "border-white/[0.06] text-gray-400 hover:text-white"
                            }`}
                            style={
                                category === c.value
                                    ? { backgroundColor: c.color }
                                    : { backgroundColor: "#1A1A1A" }
                            }
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Start button */}
            <button
                onClick={onStart}
                disabled={!taskTitle.trim() || starting}
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
    const cat = categoryMeta(session.category);
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
            {cat && (
                <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                    {cat.label}
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
    const cat = categoryMeta(session.category);
    const realSeconds = session.ended_at
        ? Math.max(0, Math.floor((new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()) / 1000) - (session.paused_seconds || 0))
        : 0;
    const realMinutes = Math.floor(realSeconds / 60);
    const pausedMinutes = Math.floor((session.paused_seconds || 0) / 60);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{session.task_title}</h3>
            {cat && (
                <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                    <Tag className="w-3 h-3" />
                    {cat.label}
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
                className="bg-[#111111] border border-[#C5A04E]/15 rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
