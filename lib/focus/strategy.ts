import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { focusAdmin, FocusError } from './db';
import {
    createProjectSchema, updateProjectSchema, projectFilterSchema,
    createPhaseSchema, updatePhaseSchema, createRecordSchema, recordPageSchema,
} from './strategy-schemas';
import type { FocusProject, OsPhase, ProjectRecord } from './types';

const uuid = z.string().uuid();
function check(error: { message: string } | null) {
    if (error) throw new FocusError(error.message);
}

// The adapters authenticate the administrator. In particular, Pilotage has
// global admin objectives, not per-user objectives. Never expose these methods
// through an unauthenticated or ordinary customer endpoint.
// A client can be injected for isolated tests; production always uses focusAdmin.
export function createStrategyService(db: SupabaseClient) {
    const project = async (userId: string, id: string): Promise<FocusProject> => {
        const { data, error } = await db.from('focus_projects').select('*')
            .eq('user_id', uuid.parse(userId)).eq('id', uuid.parse(id)).maybeSingle();
        check(error);
        if (!data) throw new FocusError('focus_project_forbidden');
        return data;
    };
    const phase = async (userId: string, id: string): Promise<OsPhase> => {
        const { data, error } = await db.from('os_phases').select('*')
            .eq('user_id', uuid.parse(userId)).eq('id', uuid.parse(id)).maybeSingle();
        check(error);
        if (!data) throw new FocusError('focus_phase_forbidden');
        return data;
    };
    return {
        async createProjectFor(userId: string, input: unknown): Promise<FocusProject> {
            const p = createProjectSchema.parse(input);
            const { data, error } = await db.from('focus_projects')
                .insert({ ...p, user_id: uuid.parse(userId) }).select().single();
            check(error); return data;
        },
        async updateProjectFor(userId: string, id: string, input: unknown): Promise<FocusProject> {
            const p = updateProjectSchema.parse(input);
            const { data, error } = await db.from('focus_projects').update(p)
                .eq('user_id', uuid.parse(userId)).eq('id', uuid.parse(id)).select().maybeSingle();
            check(error);
            if (!data) throw new FocusError('focus_project_forbidden');
            return data;
        },
        getProjectFor: project,
        async listProjectsFor(userId: string, filter: unknown = {}): Promise<FocusProject[]> {
            const owner = uuid.parse(userId), p = projectFilterSchema.parse(filter);
            const projects: FocusProject[] = [];
            // Avoid silently dropping projects at PostgREST's default page cap.
            for (let offset = 0; ; offset += 1000) {
                let q = db.from('focus_projects').select('*').eq('user_id', owner)
                    .order('position', { ascending: true }).order('id', { ascending: true });
                if (p.active_only) q = q.in('status', ['vital', 'evaluating']);
                if (p.phase_id) q = q.eq('phase_id', p.phase_id);
                if (p.engine) q = q.eq('engine', p.engine);
                if (p.status) q = q.eq('status', p.status);
                const { data, error } = await q.range(offset, offset + 999);
                check(error); projects.push(...(data ?? []));
                if (!data || data.length < 1000) return projects;
            }
        },
        async createPhaseFor(userId: string, input: unknown): Promise<OsPhase> {
            const p = createPhaseSchema.parse(input);
            const { data, error } = await db.from('os_phases')
                .insert({ ...p, user_id: uuid.parse(userId) }).select().single();
            check(error); return data;
        },
        async updatePhaseFor(userId: string, id: string, input: unknown): Promise<OsPhase> {
            const p = updatePhaseSchema.parse(input);
            const { data, error } = await db.from('os_phases').update(p)
                .eq('user_id', uuid.parse(userId)).eq('id', uuid.parse(id)).select().maybeSingle();
            check(error);
            if (!data) throw new FocusError('focus_phase_forbidden');
            return data;
        },
        getPhaseFor: phase,
        async listPhasesFor(userId: string): Promise<OsPhase[]> {
            const owner = uuid.parse(userId), phases: OsPhase[] = [];
            for (let offset = 0; ; offset += 1000) {
                const { data, error } = await db.from('os_phases').select('*').eq('user_id', owner)
                    .order('position', { ascending: true }).order('id', { ascending: true }).range(offset, offset + 999);
                check(error); phases.push(...(data ?? []));
                if (!data || data.length < 1000) return phases;
            }
        },
        async createProjectRecordFor(userId: string, projectId: string, input: unknown): Promise<ProjectRecord> {
            const p = createRecordSchema.parse(input);
            const { data, error } = await db.from('project_records')
                .insert({ ...p, payload: p.payload ?? {}, user_id: uuid.parse(userId), project_id: uuid.parse(projectId) })
                .select().single();
            check(error); return data;
        },
        async listProjectRecordsFor(userId: string, projectId: string, input: unknown = {}): Promise<ProjectRecord[]> {
            const p = recordPageSchema.parse(input);
            await project(userId, projectId);
            const { data, error } = await db.from('project_records').select('*')
                .eq('user_id', userId).eq('project_id', projectId)
                .order('created_at', { ascending: false }).order('id', { ascending: false })
                .range(p.offset, p.offset + p.limit - 1);
            check(error); return data ?? [];
        },
        async getProjectContextFor(userId: string, projectId: string) {
            // One STABLE SQL statement, aggregates over all recorded history.
            // Its list limits and truncation flags are explicit in the response.
            const { data, error } = await db.rpc('focus_project_context', {
                p_user: uuid.parse(userId), p_project: uuid.parse(projectId),
            });
            check(error); return data;
        },
    };
}

export type StrategyService = ReturnType<typeof createStrategyService>;
// Lazy construction means malformed inputs can be checked without a DB client.
export async function createProjectFor(userId: string, input: unknown) {
    const owner = uuid.parse(userId), p = createProjectSchema.parse(input);
    return createStrategyService(focusAdmin()).createProjectFor(owner, p);
}
export async function updateProjectFor(userId: string, id: string, input: unknown) {
    const owner = uuid.parse(userId), projectId = uuid.parse(id), p = updateProjectSchema.parse(input);
    return createStrategyService(focusAdmin()).updateProjectFor(owner, projectId, p);
}
export async function getProjectFor(userId: string, id: string) {
    return createStrategyService(focusAdmin()).getProjectFor(userId, id);
}
export async function listProjectsFor(userId: string, filter: unknown = {}) {
    return createStrategyService(focusAdmin()).listProjectsFor(userId, filter);
}
export async function createPhaseFor(userId: string, input: unknown) {
    return createStrategyService(focusAdmin()).createPhaseFor(userId, input);
}
export async function updatePhaseFor(userId: string, id: string, input: unknown) {
    return createStrategyService(focusAdmin()).updatePhaseFor(userId, id, input);
}
export async function getPhaseFor(userId: string, id: string) {
    return createStrategyService(focusAdmin()).getPhaseFor(userId, id);
}
export async function listPhasesFor(userId: string) {
    return createStrategyService(focusAdmin()).listPhasesFor(userId);
}
export async function createProjectRecordFor(userId: string, projectId: string, input: unknown) {
    return createStrategyService(focusAdmin()).createProjectRecordFor(userId, projectId, input);
}
export async function listProjectRecordsFor(userId: string, projectId: string, input: unknown = {}) {
    return createStrategyService(focusAdmin()).listProjectRecordsFor(userId, projectId, input);
}
export async function getProjectContextFor(userId: string, projectId: string) {
    return createStrategyService(focusAdmin()).getProjectContextFor(userId, projectId);
}
