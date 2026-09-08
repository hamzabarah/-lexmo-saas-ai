"use client";

import { parisDate, monday, addCalendarDays } from '@/lib/focus/time';
import { useCallback, useEffect, useState } from "react";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskCategory = "personal" | "professional";
export type TaskType = "recurring" | "one_time" | "long_term";

export interface FocusTask {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    category: TaskCategory | null;
    scheduled_date: string | null;
    task_type: TaskType;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
    time_today_seconds: number;
    time_this_week_seconds: number;
    time_this_month_seconds: number;
    time_total_seconds: number;
    sessions_count_total: number;
    subtasks_count: number;
    subtasks_completed_count: number;
    // Backward-compat aliases
    total_time_seconds: number;
    sessions_count: number;
}

interface TasksResponse {
    tasks: FocusTask[];
    stats: { todo: number; in_progress: number; done: number };
}

const todayLocalISO = parisDate;
const weekStartLocalISO = monday;

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
            task_type: TaskType;
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
                task_type: TaskType;
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

    const tasks = data?.tasks || [];

    const getTasksByDate = useCallback(
        (d: string) => tasks.filter((t) => t.scheduled_date === d),
        [tasks]
    );

    const getTodayTasks = useCallback(
        () => getTasksByDate(todayLocalISO()),
        [getTasksByDate]
    );

    // ─── Type-specific helpers ───
    const getRecurringTasks = useCallback(
        () => tasks.filter((t) => t.task_type === "recurring"),
        [tasks]
    );

    const getOneTimeTasks = useCallback(
        (d?: string) => {
            const all = tasks.filter((t) => t.task_type === "one_time");
            if (!d) return all;
            return all.filter((t) => t.scheduled_date === d);
        },
        [tasks]
    );

    const getOneTimeTasksThisWeek = useCallback(() => {
        const weekStart = weekStartLocalISO();
        const today = todayLocalISO();
        // Include any one_time task scheduled between Monday and the end of week
        // (kept simple: scheduled_date between weekStart and weekStart+6)
        const weekEndISO = addCalendarDays(weekStart,6);
        void today;
        return tasks.filter(
            (t) =>
                t.task_type === "one_time" &&
                t.scheduled_date !== null &&
                t.scheduled_date >= weekStart &&
                t.scheduled_date <= weekEndISO
        );
    }, [tasks]);

    const getLongTermTasks = useCallback(
        () => tasks.filter((t) => t.task_type === "long_term"),
        [tasks]
    );

    return {
        tasks,
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
        getRecurringTasks,
        getOneTimeTasks,
        getOneTimeTasksThisWeek,
        getLongTermTasks,
    };
}
