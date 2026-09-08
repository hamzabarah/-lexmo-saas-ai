// Opérations serveur du module focus.
//
// SERVEUR UNIQUEMENT : ce fichier lit la clé service-role, qui contourne RLS.
// Il ne contrôle aucune identité — l'appelant est responsable de s'être
// authentifié avant. Le propriétaire des données est TOUJOURS l'administrateur,
// résolu ici depuis son e-mail, jamais depuis une valeur reçue en requête.

import { createClient } from '@supabase/supabase-js';
import { ADMIN_EMAIL } from '@/lib/admin-auth';
import { createProjectFor, createTaskFor, updateTaskFor, archiveTaskFor, sessionCommand, FocusError } from './commands';
import { parisDate, recordedSeconds } from './time';
export { FocusError } from './commands';
import type {
    BadHabit,
    FocusProject,
    FocusSession,
    FocusTask,
    HabitState,
    TaskPriority,
    TaskStatus,
} from './types';

function getAdmin() {
    return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

export const todayIso = parisDate;

export async function createProject(name: string): Promise<FocusProject> {
    return createProjectFor(await resolveAdminUserId(), { name });
}

/** Erreur métier destinée à être montrée telle quelle à l'appelant. */


// ──────────────────────── identité de l'administrateur ────────────────────────

let cachedAdminId: string | null = null;

/**
 * Identifiant de l'administrateur, seul propriétaire des données focus.
 *
 * Résolu depuis l'e-mail admin codé dans lib/admin-auth, via l'API Auth : le
 * compte n'existe pas dans public.users, on ne peut donc pas le retrouver par
 * une simple jointure. Mis en cache : l'identifiant ne change jamais.
 */
export async function resolveAdminUserId(): Promise<string> {
    if (cachedAdminId) return cachedAdminId;

    const { data, error } = await getAdmin().auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw new FocusError(`Impossible de lister les comptes : ${error.message}`);

    const admin = data.users.find((u) => u.email === ADMIN_EMAIL);
    if (!admin) throw new FocusError('Compte administrateur introuvable.');

    cachedAdminId = admin.id;
    return admin.id;
}

// ──────────────────────────────── projets ────────────────────────────────

export async function listProjects(): Promise<FocusProject[]> {
    const userId = await resolveAdminUserId();
    const { data, error } = await getAdmin()
        .from('focus_projects')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true });

    if (error) throw new FocusError(error.message);
    return (data ?? []) as FocusProject[];
}

/** Retrouve un projet par son nom, insensible à la casse. Message explicite sinon. */
export async function findProjectByName(name: string): Promise<FocusProject> {
    const projects = await listProjects();
    const found = projects.find((p) => p.name.toLowerCase() === name.trim().toLowerCase());
    if (found) return found;

    const names = projects.map((p) => p.name).join(', ') || 'aucun';
    throw new FocusError(`Projet inconnu : « ${name} ». Projets existants : ${names}.`);
}

// ──────────────────────────────── tâches ────────────────────────────────

/** Tâches non archivées, éventuellement filtrées. */
export async function listTasks(filter: {
    status?: TaskStatus;
    projectName?: string;
} = {}): Promise<FocusTask[]> {
    const userId = await resolveAdminUserId();

    let query = getAdmin()
        .from('focus_tasks')
        .select('*')
        .eq('user_id', userId)
        .is('archived_at', null);

    if (filter.status) query = query.eq('status', filter.status);
    if (filter.projectName) {
        const project = await findProjectByName(filter.projectName);
        query = query.eq('project_id', project.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new FocusError(error.message);
    return (data ?? []) as FocusTask[];
}

export async function getTask(taskId: string): Promise<FocusTask> {
    const userId = await resolveAdminUserId();
    const { data, error } = await getAdmin()
        .from('focus_tasks')
        .select('*')
        .eq('id', taskId)
        .maybeSingle();

    if (error) throw new FocusError(error.message);
    if (!data || data.user_id !== userId) throw new FocusError('Tâche introuvable.');
    return data as FocusTask;
}

export async function createTask(input: { title: string; projectName: string; priority: TaskPriority; status?: TaskStatus }): Promise<FocusTask> {
    const userId = await resolveAdminUserId();
    const project = await findProjectByName(input.projectName);
    return createTaskFor(userId, { title: input.title, project_id: project.id, priority: input.priority,
        status: input.status, category: 'professional' });
}
export async function updateTask(taskId: string, patch: { title?: string; status?: TaskStatus; priority?: TaskPriority; projectName?: string }): Promise<FocusTask> {
    const project = patch.projectName === undefined ? undefined : await findProjectByName(patch.projectName);
    return updateTaskFor(await resolveAdminUserId(), taskId, { title: patch.title, status: patch.status,
        priority: patch.priority, ...(project ? { project_id: project.id } : {}) });
}
export async function archiveTask(taskId: string): Promise<FocusTask> {
    return archiveTaskFor(await resolveAdminUserId(), taskId);
}

export async function listOpenSessions(): Promise<FocusSession[]> {
    const userId = await resolveAdminUserId();
    const { data, error } = await getAdmin()
        .from('focus_sessions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['running', 'paused']).is('ended_at', null)
        .order('started_at', { ascending: true });

    if (error) throw new FocusError(error.message);
    return (data ?? []) as FocusSession[];
}

/** La plus recente des sessions ouvertes, ou null. */
export async function getRunningSession(): Promise<FocusSession | null> {
    const open = await listOpenSessions();
    return open.length > 0 ? open[open.length - 1] : null;
}

/**
 * Démarre une session. Reproduit exactement le comportement de
 * POST /api/focus : mêmes colonnes, et la tâche passe de « todo » à
 * « in_progress » — l'interface web voit donc le même état.
 */
export async function startSession(taskId: string, plannedMinutes: number): Promise<FocusSession> {
    return sessionCommand(await resolveAdminUserId(), 'start', { task_id: taskId, planned_duration_minutes: plannedMinutes });
}
export async function endSession(sessionId?: string, note?: string, actualMinutes?: number): Promise<FocusSession> {
    return sessionCommand(await resolveAdminUserId(), 'stop', {
        ...(sessionId ? { id: sessionId } : {}), ...(note !== undefined ? { notes: note } : {}),
        ...(actualMinutes !== undefined ? { actual_minutes: actualMinutes } : {}) });
}
export async function changeSession(action: 'pause' | 'resume' | 'expire', sessionId: string): Promise<FocusSession> {
    return sessionCommand(await resolveAdminUserId(), action, { id: sessionId });
}
const effectiveSeconds = recordedSeconds;

export async function listHabits(): Promise<BadHabit[]> {
    const userId = await resolveAdminUserId();
    const { data, error } = await getAdmin()
        .from('focus_bad_habits')
        .select('*')
        .eq('user_id', userId)
        .is('archived_at', null)
        .order('position', { ascending: true });

    if (error) throw new FocusError(error.message);
    return (data ?? []) as BadHabit[];
}

/** Retrouve une habitude par identifiant ou par titre, insensible à la casse. */
export async function findHabit(titleOrId: string): Promise<BadHabit> {
    const habits = await listHabits();
    const needle = titleOrId.trim().toLowerCase();

    const found =
        habits.find((h) => h.id === titleOrId) ??
        habits.find((h) => h.title.toLowerCase() === needle) ??
        habits.find((h) => h.title.toLowerCase().includes(needle));

    if (found) return found;

    const titles = habits.map((h) => h.title).join(' | ') || 'aucune';
    throw new FocusError(`Habitude introuvable : « ${titleOrId} ». Habitudes existantes : ${titles}.`);
}

export async function setHabitCheck(
    habitId: string,
    date: string,
    state: HabitState | null
): Promise<void> {
    const admin = getAdmin();

    if (state === null) {
        const { error } = await admin
            .from('focus_habit_checks')
            .delete()
            .eq('habit_id', habitId)
            .eq('check_date', date);
        if (error) throw new FocusError(error.message);
        return;
    }

    const { error } = await admin
        .from('focus_habit_checks')
        .upsert(
            { habit_id: habitId, check_date: date, state, updated_at: new Date().toISOString() },
            { onConflict: 'habit_id,check_date' }
        );

    if (error) throw new FocusError(error.message);
}

export async function createHabit(title: string, ruleNote?: string): Promise<BadHabit> {
    const userId = await resolveAdminUserId();
    const existing = await listHabits();

    const { data, error } = await getAdmin()
        .from('focus_bad_habits')
        .insert({
            user_id: userId,
            title: title.trim(),
            rule_note: ruleNote?.trim() || null,
            position: existing.length + 1,
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') throw new FocusError('Cette habitude existe déjà.');
        throw new FocusError(error.message);
    }
    return data as BadHabit;
}

// ──────────────────────────────── vue d'ensemble ────────────────────────────────

export interface Overview {
    date: string;
    today: { sessions: number; minutes: number; streak: number };
    runningSession: { id: string; task_title: string; planned_minutes: number; started_at: string } | null;
    /** Toutes les sessions non cloturees, quelle que soit leur date. */
    openSessions: {
        id: string;
        task_title: string;
        status: string;
        started_at: string;
        age_days: number;
    }[];
    projects: {
        name: string;
        status: string;
        tasks: { id: string; title: string; status: TaskStatus; priority: TaskPriority }[];
    }[];
    unassignedTasks: { id: string; title: string; status: TaskStatus; priority: TaskPriority }[];
    habits: { id: string; title: string; rule_note: string | null; today: HabitState | 'non renseigné'; streak: number }[];
}

export async function getOverview(): Promise<Overview> {
    const userId = await resolveAdminUserId();
    const admin = getAdmin();
    const today = todayIso();

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 120);

    const [sessionsRes, projects, tasks, habits] = await Promise.all([
        admin
            .from('focus_sessions')
            .select('id, task_title, planned_duration_minutes, started_at, ended_at, paused_seconds, duration_override_seconds, status')
            .eq('user_id', userId)
            .gte('started_at', since.toISOString()),
        listProjects(),
        listTasks(),
        listHabits(),
    ]);

    if (sessionsRes.error) throw new FocusError(sessionsRes.error.message);
    const sessions = sessionsRes.data ?? [];

    // Chiffres du jour
    const todaySessions = sessions.filter(
        (s) => parisDate(s.started_at) === today && Boolean(s.ended_at)
    );
    const minutes = Math.round(
        todaySessions.reduce((sum, s) => sum + effectiveSeconds(s), 0) / 60
    );

    // Série de jours consécutifs avec au moins une session terminée.
    const activeDays = new Set(
        sessions.filter((s) => s.status === 'completed').map((s) => parisDate(s.started_at))
    );
    const cursor = new Date(`${today}T00:00:00Z`);
    if (!activeDays.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
    let streak = 0;
    while (activeDays.has(cursor.toISOString().slice(0, 10))) {
        streak += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    // Les sessions ouvertes sont lues SANS fenetre de date : une session
    // oubliee il y a des mois doit rester visible ici, sinon elle bloque
    // start_session tout en etant invisible dans la vue d'ensemble.
    const openSessions = await listOpenSessions();
    const running = openSessions.length > 0 ? openSessions[openSessions.length - 1] : null;

    // Relevés d'habitudes
    const habitIds = habits.map((h) => h.id);
    let checks: { habit_id: string; check_date: string; state: HabitState }[] = [];
    if (habitIds.length > 0) {
        const { data, error } = await admin
            .from('focus_habit_checks')
            .select('habit_id, check_date, state')
            .in('habit_id', habitIds);
        if (error) throw new FocusError(error.message);
        checks = (data ?? []) as typeof checks;
    }

    const byHabit = new Map<string, Record<string, HabitState>>();
    for (const c of checks) {
        const bucket = byHabit.get(c.habit_id) ?? {};
        bucket[c.check_date] = c.state;
        byHabit.set(c.habit_id, bucket);
    }

    const brief = (t: FocusTask) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
    });

    return {
        date: today,
        today: { sessions: todaySessions.length, minutes, streak },
        runningSession: running
            ? {
                  id: running.id,
                  task_title: running.task_title,
                  planned_minutes: running.planned_duration_minutes,
                  started_at: running.started_at,
              }
            : null,
        openSessions: openSessions.map((s) => ({
            id: s.id,
            task_title: s.task_title,
            status: s.status,
            started_at: s.started_at,
            age_days: Math.floor(
                (Date.now() - new Date(s.started_at).getTime()) / 86_400_000
            ),
        })),
        projects: projects.map((p) => ({
            name: p.name,
            status: p.status,
            tasks: tasks.filter((t) => t.project_id === p.id).map(brief),
        })),
        unassignedTasks: tasks.filter((t) => !t.project_id).map(brief),
        habits: habits.map((h) => {
            const own = byHabit.get(h.id) ?? {};
            const c = new Date(`${today}T00:00:00Z`);
            let hStreak = 0;
            for (let i = 0; i < 365; i += 1) {
                const state = own[c.toISOString().slice(0, 10)];
                if (state === 'failed') break;
                if (state === 'avoided') hStreak += 1;
                c.setUTCDate(c.getUTCDate() - 1);
            }
            return {
                id: h.id,
                title: h.title,
                rule_note: h.rule_note,
                today: own[today] ?? ('non renseigné' as const),
                streak: hStreak,
            };
        }),
    };
}
