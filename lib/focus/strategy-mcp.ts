import type { McpServer } from '@modelcontextprotocol/server';
import { z, ZodError } from 'zod';
import { FocusError } from './db';
import {
    createProjectSchema, updateProjectSchema, projectFilterSchema,
    createPhaseSchema, updatePhaseSchema, recordSchemas, recordPageSchema,
} from './strategy-schemas';

type StrategyServices = Pick<typeof import('./strategy'),
    | 'createProjectFor' | 'updateProjectFor' | 'getProjectFor' | 'listProjectsFor'
    | 'createPhaseFor' | 'updatePhaseFor' | 'listPhasesFor'
    | 'createProjectRecordFor' | 'listProjectRecordsFor' | 'getProjectContextFor'>;

type StrategyDependencies = {
    resolveAdminUserId: () => Promise<string>;
    services: StrategyServices;
};

const text = (value: unknown) => ({
    content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
});

/** Only transport adaptation lives here; web and MCP use the same schemas and services. */
export function registerFocusStrategyTools(
    server: Pick<McpServer, 'registerTool'>,
    { resolveAdminUserId, services }: StrategyDependencies,
) {
    function register(
        name: string,
        description: string,
        inputSchema: z.ZodObject,
        readOnly: boolean,
        run: (userId: string, input: Record<string, unknown>) => Promise<unknown>,
    ) {
        server.registerTool(name, {
            description,
            inputSchema,
            annotations: { readOnlyHint: readOnly, destructiveHint: false, idempotentHint: readOnly, openWorldHint: false },
        }, async (input) => {
            try {
                const parsed = inputSchema.parse(input);
                return text(await run(await resolveAdminUserId(), parsed));
            } catch (error) {
                const message = error instanceof ZodError ? 'Invalid Focus strategy request'
                    : error instanceof FocusError ? error.message : 'Focus strategy request failed';
                return { content: [{ type: 'text' as const, text: message }], isError: true };
            }
        });
    }

    const projectId = z.object({ project_id: z.string().uuid() }).strict();
    register('create_project', 'Créer un projet Focus : nom seul compatible, stratégie facultative.',
        createProjectSchema, false, (userId, input) => services.createProjectFor(userId, input));
    register('get_project', 'Lire un projet Focus appartenant à l’opérateur.',
        projectId, true, (userId, input) => services.getProjectFor(userId, input.project_id as string));
    register('update_project', 'Modifier uniquement les champs fournis du projet ; conserver ses tâches et son historique.',
        z.object({ ...updateProjectSchema.shape, project_id: z.string().uuid() }).strict(), false,
        (userId, { project_id, ...input }) => services.updateProjectFor(userId, project_id as string, updateProjectSchema.parse(input)));
    register('list_active_projects', 'Lister les projets en cours ou en évaluation ; filtres facultatifs phase, moteur et statut.',
        projectFilterSchema.omit({ active_only: true }), true,
        (userId, input) => services.listProjectsFor(userId, projectFilterSchema.parse({ ...input, active_only: true })));

    register('create_phase', 'Créer une phase avec nom, ordre, dates, mission et statut.',
        createPhaseSchema, false, (userId, input) => services.createPhaseFor(userId, input));
    register('update_phase', 'Modifier les champs fournis d’une phase sans supprimer ses projets.',
        z.object({ ...updatePhaseSchema.shape, phase_id: z.string().uuid() }).strict(), false,
        (userId, { phase_id, ...input }) => services.updatePhaseFor(userId, phase_id as string, updatePhaseSchema.parse(input)));
    register('list_phases', 'Lire les phases de l’opérateur dans leur ordre.',
        z.object({}).strict(), true, (userId) => services.listPhasesFor(userId));

    const recordDescriptions = {
        decision: 'Enregistrer une décision horodatée pour le projet.',
        output: 'Enregistrer un livrable horodaté pour le projet.',
        result: 'Enregistrer un résultat horodaté pour le projet.',
        lesson: 'Enregistrer un apprentissage horodaté pour le projet.',
        cost: 'Enregistrer un coût réel en EUR ; ce record ne déclenche aucun paiement.',
    } as const;
    for (const type of Object.keys(recordDescriptions) as (keyof typeof recordDescriptions)[]) {
        register(`record_${type}`, recordDescriptions[type],
            z.object({ ...recordSchemas[type].shape, project_id: z.string().uuid() }).strict(), false,
            (userId, { project_id, ...input }) => services.createProjectRecordFor(userId, project_id as string, { ...input, type }));
    }
    register('list_project_records', 'Lire l’historique des records du projet, par pages de 100 au maximum.',
        projectId.extend(recordPageSchema.shape), true, (userId, { project_id, limit, offset }) => services.listProjectRecordsFor(userId, project_id as string, {
            limit: limit as number | undefined, offset: offset as number | undefined,
        }));
    register('get_project_context', 'Lire le projet, sa phase, son objectif Pilotage lié et son activité Focus existante. Aucune écriture ni clôture implicite.',
        projectId, true, (userId, input) => services.getProjectContextFor(userId, input.project_id as string));
}
