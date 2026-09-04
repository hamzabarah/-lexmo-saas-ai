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

// ─────────────────── habitudes a eviter ───────────────────

export type HabitState = 'avoided' | 'failed';

export interface BadHabit {
    id: string;
    user_id: string;
    title: string;
    rule_note: string | null;
    position: number;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface HabitCheck {
    id: string;
    habit_id: string;
    check_date: string;
    state: HabitState;
}

/** Une habitude et ses releves, indexes par date. */
export interface BadHabitWithChecks extends BadHabit {
    checks: Record<string, HabitState>;
}

/** Nombre de jours affiches dans la bande. */
export const HABIT_WINDOW_DAYS = 7;

/** Les `count` derniers jours en ISO, du plus ancien au plus recent. */
export function lastDays(count: number, todayIso: string): string[] {
    const out: string[] = [];
    const cursor = new Date(`${todayIso}T00:00:00Z`);
    cursor.setUTCDate(cursor.getUTCDate() - (count - 1));
    for (let i = 0; i < count; i += 1) {
        out.push(cursor.toISOString().slice(0, 10));
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return out;
}

/** Etat suivant dans le cycle : vide -> evitee -> craque -> vide. */
export function nextHabitState(current: HabitState | undefined): HabitState | null {
    if (current === undefined) return 'avoided';
    if (current === 'avoided') return 'failed';
    return null;
}

/**
 * Serie de jours consecutifs evites, en remontant depuis aujourd'hui.
 *
 * Un « craque » casse la serie. Une journee non renseignee ne la casse pas
 * mais ne compte pas non plus : on la traverse. La remontee s'arrete au
 * premier releve d'echec, ou faute de releve au-dela de la fenetre connue.
 */
export function habitStreak(
    checks: Record<string, HabitState>,
    todayIso: string,
    maxLookbackDays = 365
): number {
    const cursor = new Date(`${todayIso}T00:00:00Z`);
    let streak = 0;

    for (let i = 0; i < maxLookbackDays; i += 1) {
        const key = cursor.toISOString().slice(0, 10);
        const state = checks[key];
        if (state === 'failed') break;
        if (state === 'avoided') streak += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    return streak;
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

// ───────────────────── agenda hebdomadaire (البيانات) ─────────────────────

/** Objectif quotidien de minutes travaillées, tracé en pointillés. */
export const DAILY_MINUTES_GOAL = 90;

/** Libellés des sept jours, du samedi au vendredi. */
export const WEEK_DAY_LABELS = [
    'السبت',
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
] as const;

/** `YYYY-MM-DD` en heure locale — jamais toISOString(), qui décale d'un jour. */
export function isoDate(d: Date): string {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
    const out = new Date(d);
    out.setDate(out.getDate() + n);
    out.setHours(0, 0, 0, 0);
    return out;
}

/** Samedi de la semaine contenant `d` — la semaine arabe commence le samedi. */
export function startOfWeek(d: Date): Date {
    const out = new Date(d);
    out.setHours(0, 0, 0, 0);
    // getDay(): 0 = dimanche … 6 = samedi. Décalage jusqu'au samedi précédent.
    out.setDate(out.getDate() - ((out.getDay() + 1) % 7));
    return out;
}

/** Une session telle que la renvoie GET /api/focus/week. */
export interface WeekSession {
    id: string;
    task_id: string | null;
    task_title: string;
    notes: string | null;
    planned_duration_minutes: number;
    started_at: string;
    ended_at: string | null;
    paused_seconds: number | null;
    status: SessionStatus;
    focus_tasks: { id: string; title: string; project_id: string | null } | null;
}

export interface WeekResponse {
    weekStart: string;
    sessions: WeekSession[];
    subtasksBySession: { id: string; title: string; completed_session_id: string | null }[];
    projects: { id: string; name: string; color: string }[];
    completedTasks: number;
}

/** Minutes effectivement travaillées sur une session terminée. */
export function weekSessionMinutes(s: WeekSession): number {
    if (!s.ended_at) return 0;
    const elapsed = (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 1000;
    return Math.max(0, Math.round((elapsed - (s.paused_seconds ?? 0)) / 60));
}
