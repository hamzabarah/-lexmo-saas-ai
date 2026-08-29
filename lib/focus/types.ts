// Types du module « عُمق » (/dashboard/focus).
// Miroir du schéma focus_* existant, étendu par 20260830_focus_projects.sql.

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'urgent' | 'normal';
export type TaskType = 'recurring' | 'one_time' | 'long_term';
export type TaskCategory = 'personal' | 'professional' | null;
export type ProjectStatus = 'vital' | 'paused' | 'queued';
export type SessionStatus = 'running' | 'paused' | 'completed' | 'abandoned';

export interface FocusProject {
    id: string;
    user_id: string;
    name: string;
    subtitle: string | null;
    status: ProjectStatus;
    color: string;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface FocusTask {
    id: string;
    user_id: string;
    project_id: string | null;
    title: string;
    description: string | null;
    category: TaskCategory;
    task_type: TaskType;
    priority: TaskPriority;
    scheduled_date: string | null;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
}

export interface FocusSession {
    id: string;
    user_id: string;
    task_id: string | null;
    subtask_id: string | null;
    task_title: string;
    category: string | null;
    notes: string | null;
    planned_duration_minutes: number;
    started_at: string;
    ended_at: string | null;
    paused_seconds: number | null;
    status: SessionStatus;
}

/** Réponse de GET /api/focus?date=… */
export interface DayResponse {
    sessions: FocusSession[];
    stats: { totalMinutes: number; completedCount: number; abandonedCount: number };
}

/** Une journée du découpage renvoyé par GET /api/focus/stats. */
export interface StatsDay {
    date: string;
    seconds: number;
    sessions: number;
}

// ────────────────────────────── libellés ──────────────────────────────

export const KANBAN_COLUMNS: { status: TaskStatus; label: string }[] = [
    { status: 'todo', label: 'للتنفيذ' },
    { status: 'in_progress', label: 'قيد التنفيذ' },
    { status: 'done', label: 'منجز' },
];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
    vital: 'حيوي — يحقق دخلاً',
    paused: 'متوقف مؤقتاً',
    queued: 'قائمة الانتظار',
};

/** Durées proposées au démarrage d'une session, en minutes. */
export const DURATION_PRESETS = [25, 45, 60, 90] as const;
export const DEFAULT_DURATION = 45;
/** Durée de la pause proposée à la fin d'une session, en minutes. */
export const BREAK_MINUTES = 10;
/** Objectif quotidien de sessions, affiché sous « جلسات اليوم ». */
export const DAILY_SESSION_GOAL = 5;

// ────────────────────────────── calculs ──────────────────────────────

/** Secondes réellement travaillées sur une session, pauses déduites. */
export function sessionSeconds(s: FocusSession, now = Date.now()): number {
    const start = new Date(s.started_at).getTime();
    const end = s.ended_at ? new Date(s.ended_at).getTime() : now;
    return Math.max(0, Math.floor((end - start) / 1000) - (s.paused_seconds ?? 0));
}

/** `mm:ss`, chiffres occidentaux, pour le minuteur. */
export function formatClock(totalSeconds: number): string {
    const s = Math.max(0, Math.floor(totalSeconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

/**
 * Nombre de jours consécutifs avec au moins une session, en remontant depuis
 * aujourd'hui. Une journée sans session interrompt la série — sauf s'il s'agit
 * d'aujourd'hui, la journée n'étant pas finie.
 */
export function computeStreak(days: StatsDay[], todayIso: string): number {
    const active = new Set(days.filter((d) => d.sessions > 0).map((d) => d.date));
    const cursor = new Date(`${todayIso}T00:00:00Z`);
    let streak = 0;

    if (!active.has(todayIso)) cursor.setUTCDate(cursor.getUTCDate() - 1);

    for (;;) {
        const key = cursor.toISOString().slice(0, 10);
        if (!active.has(key)) break;
        streak += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    return streak;
}
