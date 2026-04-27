"use client";

import { useCallback, useEffect, useState } from "react";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskCategory = "personal" | "professional";

export interface FocusTask {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    category: TaskCategory | null;
    scheduled_date: string | null;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
    total_time_seconds: number;
    sessions_count: number;
}

interface TasksResponse {
    tasks: FocusTask[];
    stats: { todo: number; in_progress: number; done: number };
}

export function useFocusTasks(date?: string) {
    const [data, setData] = useState<TasksResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const url = date ? `/api/focus/tasks?date=${date}` : "/api/focus/tasks";
            const res = await fetch(url, { credentials: "include" });
            if (!res.ok) return;
            const json: TasksResponse = await res.json();
            setData(json);
        } catch {
            /* non-blocking */
        }
    }, [date]);

    useEffect(() => {
        setLoading(true);
        refresh().finally(() => setLoading(false));
    }, [refresh]);

    const createTask = useCallback(
        async (payload: {
            title: string;
            description?: string;
            category?: TaskCategory;
            scheduled_date?: string;
        }) => {
            const res = await fetch("/api/focus/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            if (res.ok) await refresh();
            return res.ok;
        },
        [refresh]
    );

    const updateTask = useCallback(
        async (
            id: string,
            payload: Partial<{
                title: string;
                description: string | null;
                category: TaskCategory | null;
                scheduled_date: string | null;
                status: TaskStatus;
            }>
        ) => {
            const res = await fetch("/api/focus/tasks", {
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

    const deleteTask = useCallback(
        async (id: string) => {
            const res = await fetch(`/api/focus/tasks?id=${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) await refresh();
            return res.ok;
        },
        [refresh]
    );

    const markAsDone = useCallback(
        (id: string) => updateTask(id, { status: "done" }),
        [updateTask]
    );

    const markAsTodo = useCallback(
        (task: FocusTask) =>
            updateTask(task.id, {
                status: task.sessions_count > 0 ? "in_progress" : "todo",
            }),
        [updateTask]
    );

    const getTasksByDate = useCallback(
        (d: string) => data?.tasks.filter((t) => t.scheduled_date === d) || [],
        [data]
    );

    const getTodayTasks = useCallback(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        return getTasksByDate(`${yyyy}-${mm}-${dd}`);
    }, [getTasksByDate]);

    return {
        tasks: data?.tasks || [],
        stats: data?.stats || { todo: 0, in_progress: 0, done: 0 },
        loading,
        refresh,
        createTask,
        updateTask,
        deleteTask,
        markAsDone,
        markAsTodo,
        getTasksByDate,
        getTodayTasks,
    };
}
