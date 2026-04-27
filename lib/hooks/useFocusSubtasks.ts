"use client";

import { useCallback, useEffect, useState } from "react";

export interface FocusSubtask {
    id: string;
    task_id: string;
    user_id: string;
    title: string;
    is_completed: boolean;
    position: number;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    total_time_seconds: number;
    sessions_count: number;
}

export function useFocusSubtasks(taskId: string | null) {
    const [subtasks, setSubtasks] = useState<FocusSubtask[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (!taskId) {
            setSubtasks([]);
            return;
        }
        try {
            const res = await fetch(`/api/focus/subtasks?task_id=${taskId}`, { credentials: "include" });
            if (!res.ok) return;
            const json = await res.json();
            setSubtasks(json.subtasks || []);
        } catch {
            /* */
        }
    }, [taskId]);

    useEffect(() => {
        if (!taskId) {
            setSubtasks([]);
            return;
        }
        setLoading(true);
        refresh().finally(() => setLoading(false));
    }, [taskId, refresh]);

    const createSubtask = useCallback(
        async (title: string) => {
            if (!taskId || !title.trim()) return false;
            const res = await fetch("/api/focus/subtasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ task_id: taskId, title }),
            });
            if (res.ok) await refresh();
            return res.ok;
        },
        [taskId, refresh]
    );

    const updateSubtask = useCallback(
        async (id: string, payload: Partial<{ title: string; is_completed: boolean }>) => {
            const res = await fetch("/api/focus/subtasks", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id, ...payload }),
            });
            if (res.ok) await refresh();
            return res.ok;
        },
        [refresh]
    );

    const deleteSubtask = useCallback(
        async (id: string) => {
            const res = await fetch(`/api/focus/subtasks?id=${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) await refresh();
            return res.ok;
        },
        [refresh]
    );

    const toggleCompleted = useCallback(
        (id: string) => {
            const target = subtasks.find((s) => s.id === id);
            if (!target) return Promise.resolve(false);
            return updateSubtask(id, { is_completed: !target.is_completed });
        },
        [subtasks, updateSubtask]
    );

    return {
        subtasks,
        loading,
        refresh,
        createSubtask,
        updateSubtask,
        deleteSubtask,
        toggleCompleted,
    };
}
