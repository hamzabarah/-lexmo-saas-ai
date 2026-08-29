'use client';

import { useState } from 'react';
import {
    BREAK_MINUTES,
    DAILY_SESSION_GOAL,
    DURATION_PRESETS,
    type FocusProject,
    type FocusSession,
    type FocusTask,
} from '@/lib/focus/types';
import { Card, Dot, Num } from './ui';
import { CircularTimer } from './CircularTimer';

function MiniStat({
    label,
    value,
    valueClass = 'text-omq-ink',
}: {
    label: string;
    value: number;
    valueClass?: string;
}) {
    return (
        <Card className="px-6 py-5 flex items-center justify-between">
            <span className="text-[13px] text-omq-muted">{label}</span>
            <span
                dir="ltr"
                className={`text-[26px] font-extrabold tracking-[-0.5px] ${valueClass}`}
            >
                {value}
            </span>
        </Card>
    );
}

/** Points de progression de la journée : ●●○○ */
function SessionDots({ done, goal }: { done: number; goal: number }) {
    const total = Math.max(goal, done);
    return (
        <div className="flex items-center gap-2" aria-label={`${done} / ${goal}`}>
            {Array.from({ length: total }).map((_, i) => (
                <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                        background:
                            i < done ? 'var(--color-omq-accent)' : 'var(--color-omq-track)',
                    }}
                />
            ))}
        </div>
    );
}

export function DeepWorkView({
    session,
    remainingSeconds,
    plannedMinutes,
    onPlannedMinutesChange,
    selectedTaskId,
    onSelectTask,
    tasks,
    projects,
    todaySessions,
    todayMinutes,
    streak,
    breakRemaining,
    onStart,
    onPause,
    onResume,
    onStop,
    onStartBreak,
    onSkipBreak,
    busy,
}: {
    session: FocusSession | null;
    remainingSeconds: number;
    plannedMinutes: number;
    onPlannedMinutesChange: (m: number) => void;
    selectedTaskId: string | null;
    onSelectTask: (id: string | null) => void;
    tasks: FocusTask[];
    projects: FocusProject[];
    todaySessions: number;
    todayMinutes: number;
    streak: number;
    breakRemaining: number | null;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onStop: (notes: string) => void;
    onStartBreak: () => void;
    onSkipBreak: () => void;
    busy: boolean;
}) {
    const [asking, setAsking] = useState(false);
    const [notes, setNotes] = useState('');

    const today = new Date().toLocaleDateString('ar', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const openTasks = tasks.filter((t) => t.status !== 'done');
    const currentTask =
        tasks.find((t) => t.id === (session?.task_id ?? selectedTaskId)) ?? null;
    const currentProject = projects.find((p) => p.id === currentTask?.project_id);
    const paused = session?.status === 'paused';
    const onBreak = breakRemaining !== null;

    const total = onBreak
        ? BREAK_MINUTES * 60
        : (session?.planned_duration_minutes ?? plannedMinutes) * 60;

    return (
        <div className="flex flex-col items-center min-h-full">
            <header className="self-stretch flex items-baseline justify-between mb-2">
                <h1 className="text-[32px] font-extrabold tracking-[-0.4px] text-omq-ink m-0">
                    جلسة عمل عميق
                </h1>
                <div className="text-[13px] text-omq-muted">{today}</div>
            </header>

            <div className="self-stretch text-sm text-omq-muted mb-8 flex items-center gap-2 flex-wrap">
                {currentTask ? (
                    <>
                        <span>المهمة الحالية:</span>
                        <b className="text-omq-ink font-bold">{currentTask.title}</b>
                        {currentProject && (
                            <>
                                <span>·</span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Dot color={currentProject.color} size={6} />
                                    {currentProject.name}
                                </span>
                            </>
                        )}
                    </>
                ) : (
                    <span>لم تختر مهمة بعد</span>
                )}
            </div>

            {/* Choix de la tâche et de la durée — masqué pendant une session. */}
            {!session && !onBreak && (
                <div className="self-stretch flex flex-wrap items-center gap-3 mb-8">
                    <select
                        value={selectedTaskId ?? ''}
                        onChange={(e) => onSelectTask(e.target.value || null)}
                        className="flex-1 min-w-[220px] bg-omq-surface border border-omq-border rounded-xl px-4 py-3 text-sm text-omq-ink outline-none focus:border-omq-accent transition-colors"
                    >
                        <option value="">اختر مهمة…</option>
                        {openTasks.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.title}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2">
                        {DURATION_PRESETS.map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => onPlannedMinutesChange(m)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                                    plannedMinutes === m
                                        ? 'bg-omq-accent text-omq-panel border-omq-accent shadow-[0_2px_8px_rgba(217,119,87,0.28)]'
                                        : 'bg-omq-surface text-omq-muted border-omq-border hover:bg-omq-panel'
                                }`}
                            >
                                <Num>{m}</Num>
                            </button>
                        ))}
                        <span className="text-[13px] text-omq-muted">دقيقة</span>
                    </div>
                </div>
            )}

            <div className="mb-10">
                <CircularTimer
                    remainingSeconds={remainingSeconds}
                    totalSeconds={total}
                    plannedMinutes={session?.planned_duration_minutes ?? plannedMinutes}
                    sessionNumber={todaySessions + (session ? 1 : 0)}
                    tone={onBreak ? 'sage' : 'accent'}
                    label={onBreak ? 'استراحة' : undefined}
                />
            </div>

            <div className="mb-8">
                <SessionDots done={todaySessions} goal={DAILY_SESSION_GOAL} />
            </div>

            {/* Commandes */}
            <div className="flex flex-wrap justify-center gap-3 mb-14">
                {onBreak ? (
                    <button
                        type="button"
                        onClick={onSkipBreak}
                        className="px-6 py-3.5 rounded-xl border border-omq-border bg-omq-surface text-[15px] text-omq-muted transition-colors hover:bg-omq-panel hover:text-omq-ink"
                    >
                        إنهاء الاستراحة
                    </button>
                ) : !session ? (
                    <button
                        type="button"
                        onClick={onStart}
                        disabled={busy || !selectedTaskId}
                        className="px-10 py-3.5 rounded-xl bg-omq-accent text-omq-panel font-bold text-[15px] shadow-[0_2px_8px_rgba(217,119,87,0.28)] transition-colors hover:bg-omq-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        ابدأ
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={paused ? onResume : onPause}
                            disabled={busy}
                            className="px-10 py-3.5 rounded-xl bg-omq-accent text-omq-panel font-bold text-[15px] shadow-[0_2px_8px_rgba(217,119,87,0.28)] transition-colors hover:bg-omq-accent-hover disabled:opacity-40"
                        >
                            {paused ? 'استئناف' : 'إيقاف مؤقت'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setAsking(true)}
                            disabled={busy}
                            className="px-6 py-3.5 rounded-xl border border-omq-border bg-omq-surface text-[15px] text-omq-muted transition-colors hover:bg-omq-panel hover:text-omq-ink disabled:opacity-40"
                        >
                            إنهاء الجلسة
                        </button>
                    </>
                )}
            </div>

            {/* « ماذا أنجزت؟ » — conserve l'enregistrement des notes existant. */}
            {asking && (
                <Card className="self-stretch p-6 mb-10">
                    <label className="block text-sm font-bold text-omq-ink mb-3">
                        ماذا أنجزت؟
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="اختياري"
                        className="w-full bg-omq-panel border border-omq-border rounded-xl px-4 py-3 text-sm text-omq-ink outline-none focus:border-omq-accent transition-colors resize-none"
                    />
                    <div className="flex items-center gap-3 mt-4">
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                                onStop(notes.trim());
                                setNotes('');
                                setAsking(false);
                            }}
                            className="px-6 py-2.5 rounded-xl bg-omq-accent text-omq-panel font-bold text-sm transition-colors hover:bg-omq-accent-hover disabled:opacity-40"
                        >
                            حفظ وإنهاء
                        </button>
                        <button
                            type="button"
                            onClick={() => setAsking(false)}
                            className="px-5 py-2.5 rounded-xl border border-omq-border bg-omq-surface text-sm text-omq-muted transition-colors hover:bg-omq-panel"
                        >
                            إلغاء
                        </button>
                    </div>
                </Card>
            )}

            {/* Proposition de pause, après une session terminée. */}
            {!session && !onBreak && todaySessions > 0 && (
                <button
                    type="button"
                    onClick={onStartBreak}
                    className="mb-10 text-sm text-omq-sage font-bold underline underline-offset-4 decoration-omq-sage/40 hover:decoration-omq-sage transition-colors"
                >
                    خذ استراحة <Num>{BREAK_MINUTES}</Num> دقائق
                </button>
            )}

            <div className="self-stretch grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
                <MiniStat label="جلسات اليوم" value={todaySessions} valueClass="text-omq-accent" />
                <MiniStat label="دقائق العمل اليوم" value={todayMinutes} />
                <MiniStat label="سلسلة الأيام" value={streak} valueClass="text-omq-sage" />
            </div>
        </div>
    );
}
