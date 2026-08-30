import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import {
    FocusError,
    archiveTask,
    createHabit,
    createTask,
    endSession,
    findHabit,
    getOverview,
    listTasks,
    setHabitCheck,
    startSession,
    todayIso,
    updateTask,
} from '@/lib/focus/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ───────────────────────────────── auth ─────────────────────────────────

/**
 * Jeton partagé attendu sur chaque requête.
 *
 * AUCUNE valeur de repli : si MCP_SECRET_TOKEN est absent de l'environnement,
 * `expected` vaut undefined et TOUTES les requêtes sont refusées. Un secret
 * codé en dur transformerait le dépôt en clé d'accès.
 */
function isAuthorized(request: Request): boolean {
    const expected = process.env.MCP_SECRET_TOKEN;

    if (!expected) {
        console.error('[mcp] MCP_SECRET_TOKEN absent de l’environnement — toutes les requêtes sont refusées.');
        return false;
    }

    const header = request.headers.get('authorization') ?? '';
    const bearer = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : null;

    // Le connecteur personnalisé de Claude.ai ne permet pas toujours de poser
    // un en-tête : le jeton est alors accepté en paramètre d'URL.
    const query = new URL(request.url).searchParams.get('token');

    const provided = bearer ?? query;
    if (!provided) return false;

    return timingSafeEqual(provided, expected);
}

/** Comparaison à durée constante : ne renseigne pas sur le préfixe correct. */
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

const unauthorized = () =>
    new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
    });

// ───────────────────────────── mise en forme ─────────────────────────────

const text = (value: unknown) => ({
    content: [
        { type: 'text' as const, text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) },
    ],
});

/** Les erreurs métier remontent lisibles ; le reste ne fuite aucun détail. */
async function guard(run: () => Promise<unknown>) {
    try {
        return text(await run());
    } catch (error) {
        if (error instanceof FocusError) {
            return { content: [{ type: 'text' as const, text: `Erreur : ${error.message}` }], isError: true };
        }
        console.error('[mcp] erreur inattendue', error);
        return { content: [{ type: 'text' as const, text: 'Erreur interne.' }], isError: true };
    }
}

const TaskStatus = z.enum(['todo', 'in_progress', 'done']);
const Priority = z.enum(['urgent', 'normal']);
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu : AAAA-MM-JJ');

// ───────────────────────────────── outils ─────────────────────────────────

const mcp = createMcpHandler(
    (server) => {
        server.registerTool(
            'get_overview',
            {
                title: 'Vue d’ensemble',
                description:
                    "État complet du module focus : statistiques du jour (sessions, minutes, série), session en cours s'il y en a une, projets avec leurs tâches, et habitudes à éviter avec leur état du jour.",
                inputSchema: z.object({}),
            },
            async () => guard(() => getOverview())
        );

        server.registerTool(
            'list_tasks',
            {
                title: 'Lister les tâches',
                description:
                    'Liste les tâches non archivées. Filtres facultatifs par statut et par nom de projet.',
                inputSchema: z.object({
                    status: TaskStatus.optional().describe('todo, in_progress ou done'),
                    project: z.string().optional().describe('Nom exact du projet'),
                }),
            },
            async ({ status, project }) =>
                guard(async () => {
                    const tasks = await listTasks({ status, projectName: project });
                    return tasks.map((t) => ({
                        id: t.id,
                        title: t.title,
                        status: t.status,
                        priority: t.priority,
                    }));
                })
        );

        server.registerTool(
            'create_task',
            {
                title: 'Créer une tâche',
                description:
                    "Crée une tâche dans un projet existant. Le projet est désigné par son nom ; si le nom est inconnu, la liste des projets disponibles est renvoyée.",
                inputSchema: z.object({
                    title: z.string().min(1).max(200).describe('Intitulé de la tâche'),
                    project_name: z.string().min(1).describe('Nom du projet, ex. ECOMY'),
                    priority: Priority.describe('urgent ou normal'),
                    status: TaskStatus.optional().describe('Par défaut : todo'),
                }),
            },
            async ({ title, project_name, priority, status }) =>
                guard(async () => {
                    const task = await createTask({ title, projectName: project_name, priority, status });
                    return { id: task.id, title: task.title, status: task.status, priority: task.priority };
                })
        );

        server.registerTool(
            'update_task',
            {
                title: 'Modifier une tâche',
                description:
                    'Modifie une tâche existante : intitulé, statut, priorité ou projet. Seuls les champs fournis sont touchés.',
                inputSchema: z.object({
                    task_id: z.string().min(1).describe('Identifiant de la tâche'),
                    title: z.string().min(1).max(200).optional(),
                    status: TaskStatus.optional(),
                    priority: Priority.optional(),
                    project_name: z.string().optional(),
                }),
            },
            async ({ task_id, title, status, priority, project_name }) =>
                guard(async () => {
                    const task = await updateTask(task_id, {
                        title,
                        status,
                        priority,
                        projectName: project_name,
                    });
                    return { id: task.id, title: task.title, status: task.status, priority: task.priority };
                })
        );

        server.registerTool(
            'archive_task',
            {
                title: 'Archiver une tâche',
                description:
                    "Retire une tâche des listes sans rien effacer : ses sessions de travail restent en base. Il n'existe pas de suppression définitive.",
                inputSchema: z.object({
                    task_id: z.string().min(1).describe('Identifiant de la tâche'),
                }),
            },
            async ({ task_id }) =>
                guard(async () => {
                    const task = await archiveTask(task_id);
                    return `Tâche « ${task.title} » archivée.`;
                })
        );

        server.registerTool(
            'start_session',
            {
                title: 'Démarrer une session',
                description:
                    "Démarre une session de travail sur une tâche. La tâche passe automatiquement en « in_progress ». Refuse s'il y a déjà une session en cours.",
                inputSchema: z.object({
                    task_id: z.string().min(1).describe('Identifiant de la tâche'),
                    planned_minutes: z.number().int().min(1).max(480).describe('Durée prévue en minutes'),
                }),
            },
            async ({ task_id, planned_minutes }) =>
                guard(async () => {
                    const s = await startSession(task_id, planned_minutes);
                    return {
                        session_id: s.id,
                        task_title: s.task_title,
                        planned_minutes: s.planned_duration_minutes,
                        started_at: s.started_at,
                    };
                })
        );

        server.registerTool(
            'end_session',
            {
                title: 'Terminer une session',
                description:
                    "Clôture une session en cours. `note` enregistre ce qui a été accompli. `actual_minutes` force la durée effective si elle diffère du temps écoulé.",
                inputSchema: z.object({
                    session_id: z.string().min(1).describe('Identifiant de la session'),
                    note: z.string().max(2000).optional().describe('Ce qui a été accompli'),
                    actual_minutes: z.number().int().min(0).max(480).optional(),
                }),
            },
            async ({ session_id, note, actual_minutes }) =>
                guard(async () => {
                    const s = await endSession(session_id, note, actual_minutes);
                    return { session_id: s.id, task_title: s.task_title, ended_at: s.ended_at };
                })
        );

        server.registerTool(
            'check_habit',
            {
                title: 'Renseigner une habitude',
                description:
                    "Note l'état d'une habitude à éviter pour un jour donné. « avoided » = je ne l'ai pas faite (réussite), « failed » = j'ai craqué, `null` efface le relevé. L'habitude se désigne par son titre ou son identifiant.",
                inputSchema: z.object({
                    habit: z.string().min(1).describe('Titre ou identifiant de l’habitude'),
                    state: z
                        .enum(['avoided', 'failed'])
                        .nullable()
                        .describe('avoided, failed, ou null pour effacer'),
                    date: IsoDate.optional().describe('Par défaut : aujourd’hui'),
                }),
            },
            async ({ habit, state, date }) =>
                guard(async () => {
                    const found = await findHabit(habit);
                    const day = date ?? todayIso();
                    await setHabitCheck(found.id, day, state);
                    const label =
                        state === 'avoided' ? 'évitée' : state === 'failed' ? 'craqué' : 'effacé';
                    return `« ${found.title} » — ${day} : ${label}.`;
                })
        );

        server.registerTool(
            'create_habit',
            {
                title: 'Créer une habitude',
                description: 'Ajoute une habitude à éviter, avec sa règle.',
                inputSchema: z.object({
                    title: z.string().min(1).max(160).describe('Nom de l’habitude'),
                    rule_note: z.string().max(160).optional().describe('Règle, ex. « interdit sauf vendredi 18h »'),
                }),
            },
            async ({ title, rule_note }) =>
                guard(async () => {
                    const h = await createHabit(title, rule_note);
                    return { id: h.id, title: h.title, rule_note: h.rule_note };
                })
        );
    },
    {
        serverInfo: { name: 'ecomy-focus', version: '1.0.0' },
    }
);

// ─────────────────────────── points d'entrée ───────────────────────────

async function handler(request: Request): Promise<Response> {
    if (!isAuthorized(request)) return unauthorized();
    return mcp(request);
}

export { handler as GET, handler as POST, handler as DELETE };
