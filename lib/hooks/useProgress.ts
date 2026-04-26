"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CompletionMethod = "manual" | "auto_video" | "quiz";

interface ProgressRow {
    id: string;
    user_id: string;
    phase_id: number;
    lesson_id: string;
    is_completed: boolean;
    completion_method: CompletionMethod | null;
    time_spent_seconds: number;
    quiz_score: number | null;
    quiz_total: number | null;
    completed_at: string | null;
}

interface ProgressStats {
    totalLessons: number;
    completedLessons: number;
    percentageGlobal: number;
    byPhase: Record<number, number>;
}

interface ProgressData {
    progress: ProgressRow[];
    stats: ProgressStats;
}

const TIME_FLUSH_INTERVAL_MS = 30_000;

export function useProgress() {
    const [data, setData] = useState<ProgressData | null>(null);
    const [loading, setLoading] = useState(true);

    // Pending time-spent buffer keyed by `${phaseId}::${lessonId}` — flushed every 30s
    const pendingTimeRef = useRef<Map<string, number>>(new Map());

    const refresh = useCallback(async () => {
        try {
            const res = await fetch("/api/progress", { credentials: "include" });
            if (!res.ok) return;
            const json = await res.json();
            setData(json);
        } catch {
            /* non-blocking */
        }
    }, []);

    useEffect(() => {
        refresh().finally(() => setLoading(false));
    }, [refresh]);

    const post = useCallback(
        async (body: {
            phase_id: number;
            lesson_id: string;
            completion_method?: CompletionMethod;
            time_spent_seconds?: number;
            quiz_score?: number;
            quiz_total?: number;
        }) => {
            try {
                const res = await fetch("/api/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(body),
                });
                if (res.ok) await refresh();
            } catch {
                /* non-blocking */
            }
        },
        [refresh]
    );

    const markLessonComplete = useCallback(
        (phaseId: number, lessonId: string, method: CompletionMethod) => {
            return post({ phase_id: phaseId, lesson_id: lessonId, completion_method: method });
        },
        [post]
    );

    const recordQuizScore = useCallback(
        (phaseId: number, lessonId: string, score: number, total: number) => {
            return post({
                phase_id: phaseId,
                lesson_id: lessonId,
                completion_method: "quiz",
                quiz_score: score,
                quiz_total: total,
            });
        },
        [post]
    );

    // Buffer time and flush every 30s (debounced)
    const recordTimeSpent = useCallback(
        (phaseId: number, lessonId: string, seconds: number) => {
            if (seconds <= 0) return;
            const key = `${phaseId}::${lessonId}`;
            pendingTimeRef.current.set(key, (pendingTimeRef.current.get(key) || 0) + seconds);
        },
        []
    );

    // Periodic flush
    useEffect(() => {
        const flush = async () => {
            if (pendingTimeRef.current.size === 0) return;
            const entries = Array.from(pendingTimeRef.current.entries());
            pendingTimeRef.current.clear();
            for (const [key, secs] of entries) {
                const [pStr, ...rest] = key.split("::");
                const lessonId = rest.join("::");
                await post({
                    phase_id: Number(pStr),
                    lesson_id: lessonId,
                    time_spent_seconds: secs,
                });
            }
        };
        const id = setInterval(flush, TIME_FLUSH_INTERVAL_MS);
        return () => {
            clearInterval(id);
            // best-effort flush on unmount (fire and forget)
            void flush();
        };
    }, [post]);

    const getPhaseProgress = useCallback(
        (phaseId: number) => {
            const stats = data?.stats;
            if (!stats) return { completed: 0, total: 0, percentage: 0 };
            const percentage = stats.byPhase[phaseId] ?? 0;
            const total = (() => {
                // Derive total back from percentage and completed count when possible
                // (more reliable: ask GET to return totals; for now we stick to percentage)
                return 0;
            })();
            const completed = data!.progress.filter(
                (r) => r.phase_id === phaseId && r.is_completed
            ).length;
            return { completed, total, percentage };
        },
        [data]
    );

    const getGlobalProgress = useCallback(() => {
        const stats = data?.stats;
        if (!stats) return { completed: 0, total: 0, percentage: 0 };
        return {
            completed: stats.completedLessons,
            total: stats.totalLessons,
            percentage: stats.percentageGlobal,
        };
    }, [data]);

    const isLessonCompleted = useCallback(
        (phaseId: number, lessonId: string) => {
            if (!data) return false;
            return data.progress.some(
                (r) => r.phase_id === phaseId && r.lesson_id === lessonId && r.is_completed
            );
        },
        [data]
    );

    return {
        loading,
        markLessonComplete,
        recordQuizScore,
        recordTimeSpent,
        getPhaseProgress,
        getGlobalProgress,
        isLessonCompleted,
        refresh,
    };
}
