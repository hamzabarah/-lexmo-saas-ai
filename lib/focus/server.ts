// Opérations serveur du module focus.
//
// SERVEUR UNIQUEMENT : ce fichier lit la clé service-role, qui contourne RLS.
// Il ne contrôle aucune identité — l'appelant est responsable de s'être
// authentifié avant. Le propriétaire des données est TOUJOURS l'administrateur,
// résolu ici depuis son e-mail, jamais depuis une valeur reçue en requête.

import { createClient } from '@supabase/supabase-js';
import { ADMIN_EMAIL } from '@/lib/admin-auth';
import { closeExpiredSessions } from '@/lib/focus-session-expiry';
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

export const todayIso = () => new Date().toISOString().slice(0, 10);

/** Erreur métier destinée à être montrée telle quelle à l'appelant. */
export class FocusError extends Error {}

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

export async function createTask(input: {
    title: string;
    projectName: string;
    priority: TaskPriority;
    status?: TaskStatus;
}): Promise<FocusTask> {
    const userId = await resolveAdminUserId();
    const project = await findProjectByName(input.projectName);

    // Mêmes conventions que POST /api/focus/tasks : une tâche datée est de type
    // 'one_time', ce qui la rend visible dans l'interface web du jour.
    const { data, error } = await getAdmin()
        .from('focus_tasks')
        .insert({
            user_id: userId,
            project_id: project.id,
            title: input.title.trim(),
            priority: input.priority,
            status: input.status ?? 'todo',
            task_type: 'one_time',
            scheduled_date: todayIso(),
            category: 'professional',
        })
        .select()
        .single();

    if (error) throw new FocusError(error.message);
    return data as FocusTask;
}

export async function updateTask(
    taskId: string,
    patch: {
        title?: string;
        status?: TaskStatus;
        priority?: TaskPriority;
        projectName?: string;
    }
): Promise<FocusTask> {
    await getTask(taskId); // vérifie l'existence et la propriété

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.title !== undefined) update.title = patch.title.trim();
    if (patch.status !== undefined) update.status = patch.status;
    if (patch.priority !== undefined) update.priority = patch.priority;
    if (patch.projectName !== undefined) {
        update.project_id = (await findProjectByName(patch.projectName)).id;
    }

    const { data, error } = await getAdmin()
        .from('focus_tasks')
        .update(update)
        .eq('id', taskId)
        .select()
        .single();

    if (error) throw new FocusError(error.message);
    return data as FocusTask;
}

/** Retire la tâche des listes sans rien effacer : ses sessions restent en base. */
export async function archiveTask(taskId: string): Promise<FocusTask> {
    await getTask(taskId);

    const { data, error } = await getAdmin()
        .from('focus_tasks')
        .update({ archived_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();

    if (error) throw new FocusError(error.message);
    return data as FocusTask;
}

// ──────────────────────────────── sessions ────────────────────────────────

/**
 * Toutes les sessions non cloturees, de la plus ancienne a la plus recente.
 *
 * AUCUN filtre de date, volontairement : une session oubliee reste ouverte
 * indefiniment, et c'est justement celle-la qu'il faut voir. Filtrer sur une
 * fenetre glissante la rendrait invisible ici tout en la laissant bloquer le
 * demarrage d'une nouvelle session.
 */
export async function listOpenSessions(): Promise<FocusSession[]> {
    const userId = await resolveAdminUserId();
    const { data, error } = await getAdmin()
        .from('focus_sessions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['running', 'paused'])
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
    const userId = await resolveAdminUserId();
    // Avant de refuser le demarrage : une session perimee ne doit JAMAIS
    // bloquer. On la cloture, puis on relit les sessions reellement ouvertes.
    await closeExpiredSessions(userId);
    const task = await getTask(taskId);

    const open = await listOpenSessions();
    if (open.length > 0) {
        const detail = open
            .map((s) => `${s.id} — « ${s.task_title} », ouverte depuis le ${s.started_at.slice(0, 10)}`)
            .join(' | ');
        throw new FocusError(
            `${open.length} session(s) déjà ouverte(s) : ${detail}. Termine-la d'abord avec end_session.`
        );
    }

    const admin = getAdmin();

    const { data, error } = await admin
        .from('focus_sessions')
        .insert({
            user_id: userId,
            task_id: task.id,
            task_title: task.title,
            category: task.category,
            planned_duration_minutes: plannedMinutes,
            status: 'running',
        })
        .select()
        .single();

    if (error) throw new FocusError(error.message);

    if (task.status === 'todo') {
        await admin
            .from('focus_tasks')
            .update({ status: 'in_progress', updated_at: new Date().toISOString() })
            .eq('id', task.id);
    }

    return data as FocusSession;
}

/**
 * Clôture une session.
 *
 * `actualMinutes` force la durée effective : on place `ended_at` de sorte que
 * (ended_at − started_at − paused_seconds) vaille exactement ce nombre de
 * minutes, puisque c'est ainsi que le reste du code mesure le temps travaillé.
 */
export async function endSession(
    sessionId?: string,
    note?: string,
    actualMinutes?: number
): Promise<FocusSession> {
    const userId = await resolveAdminUserId();
    await closeExpiredSessions(userId);
    const admin = getAdmin();

    // Garde-fou : sans identifiant, on cloture l'unique session ouverte.
    // On refuse de deviner des qu'il y en a plusieurs — fermer la mauvaise
    // fausserait le temps de travail sans que personne ne s'en apercoive.
    let targetId = sessionId;
    if (!targetId) {
        const open = await listOpenSessions();
        if (open.length === 0) throw new FocusError('Aucune session ouverte.');
        if (open.length > 1) {
            const detail = open
                .map((s) => `${s.id} — « ${s.task_title} », ouverte depuis le ${s.started_at.slice(0, 10)}`)
                .join(' | ');
            throw new FocusError(
                `${open.length} sessions sont ouvertes, precise session_id : ${detail}.`
            );
        }
        targetId = open[0].id;
    }

    const { data: existing, error: readErr } = await admin
        .from('focus_sessions')
        .select('*')
        .eq('id', targetId)
        .maybeSingle();

    if (readErr) throw new FocusError(readErr.message);
    if (!existing || existing.user_id !== userId) throw new FocusError('Session introuvable.');
    if (existing.ended_at) throw new FocusError('Cette session est déjà terminée.');

    const started = new Date(existing.started_at).getTime();
    const paused = existing.paused_seconds ?? 0;
    const endedAt =
        actualMinutes !== undefined
            ? new Date(started + (actualMinutes * 60 + paused) * 1000)
            : new Date();

    const update: Record<string, unknown> = {
        status: 'completed',
        ended_at: endedAt.toISOString(),
        updated_at: new Date().toISOString(),
    };
    if (note) update.notes = note;

    const { data, error } = await admin
        .from('focus_sessions')
        .update(update)
        .eq('id', targetId)
        .select()
        .single();

    if (error) throw new FocusError(error.message);
    return data as FocusSession;
}

/** Secondes effectivement travaillées, pauses déduites. */
function effectiveSeconds(s: {
    started_at: string;
    ended_at: string | null;
    paused_seconds: number | null;
}): number {
    if (!s.ended_at) return 0;
    const elapsed = (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 1000;
    return Math.max(0, Math.floor(elapsed - (s.paused_seconds ?? 0)));
}

// ──────────────────────────────── habitudes ────────────────────────────────

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
    await closeExpiredSessions(userId);
    const admin = getAdmin();
    const today = todayIso();

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 120);

    const [sessionsRes, projects, tasks, habits] = await Promise.all([
        admin
            .from('focus_sessions')
            .select('id, task_title, planned_duration_minutes, started_at, ended_at, paused_seconds, status')
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
        (s) => s.started_at.slice(0, 10) === today && s.status === 'completed'
    );
    const minutes = Math.round(
        todaySessions.reduce((sum, s) => sum + effectiveSeconds(s), 0) / 60
    );

    // Série de jours consécutifs avec au moins une session terminée.
    const activeDays = new Set(
        sessions.filter((s) => s.status === 'completed').map((s) => s.started_at.slice(0, 10))
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
