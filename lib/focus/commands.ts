import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { parisDate } from './time';

export class FocusError extends Error {}
export function focusAdmin() {
    return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
const uuid = z.string().uuid();
const title = z.string().trim().min(1).max(200);
const taskFields = z.object({
    title: title.optional(), description: z.string().max(10000).nullable().optional(),
    category: z.enum(['personal', 'professional']).nullable().optional(),
    project_id: uuid.nullable().optional(), priority: z.enum(['urgent', 'normal']).optional(),
    status: z.enum(['todo', 'in_progress', 'done']).optional(),
    task_type: z.enum(['one_time', 'long_term', 'recurring']).optional(),
    scheduled_date: z.iso.date().nullable().optional(),
});
function check(error: { message: string } | null) {
    if (error) throw new FocusError(error.message);
}
async function ownedTask(userId: string, id: string) {
    const { data, error } = await focusAdmin().from('focus_tasks').select('*')
        .eq('id', uuid.parse(id)).eq('user_id', userId).maybeSingle();
    check(error);
    if (!data) throw new FocusError('focus_task_forbidden');
    return data;
}
// Minimal bootstrap for an empty Focus database; strategic project fields remain deferred.
export async function createProjectFor(userId: string, input: unknown) {
    const p = z.object({ name: title }).parse(input);
    const { data, error } = await focusAdmin().from('focus_projects')
        .insert({ ...p, user_id: uuid.parse(userId) }).select().single();
    check(error); return data;
}
export async function createTaskFor(userId: string, input: unknown) {
    const p = taskFields.extend({ title }).parse(input);
    const kind = p.task_type ?? 'one_time';
    const { data, error } = await focusAdmin().from('focus_tasks').insert({
        ...p, user_id: userId, task_type: kind,
        scheduled_date: kind === 'recurring' ? null : p.scheduled_date ?? parisDate(),
        status: p.status ?? 'todo', priority: p.priority ?? 'normal',
    }).select().single();
    check(error); return data;
}
export async function updateTaskFor(userId: string, id: string, input: unknown) {
    const old = await ownedTask(userId, id);
    if (old.archived_at) throw new FocusError('focus_task_archived');
    const p = taskFields.parse(input);
    const kind = p.task_type ?? old.task_type;
    const { data, error } = await focusAdmin().from('focus_tasks').update({
        ...p, ...(kind === 'recurring' ? { scheduled_date: null } : {}),
    }).eq('id', id).eq('user_id', userId).select().single();
    check(error); return data;
}
export async function archiveTaskFor(userId: string, id: string) {
    const old = await ownedTask(userId, id);
    if (old.archived_at) return old;
    const { data, error } = await focusAdmin().from('focus_tasks')
        .update({ archived_at: new Date().toISOString() }).eq('id', id).eq('user_id', userId).select().single();
    check(error); return data;
}
const sessionInput = z.object({
    id: uuid.optional(), task_id: uuid.optional(), subtask_id: uuid.nullable().optional(),
    planned_duration_minutes: z.number().int().min(1).max(480).optional(),
    extra_minutes: z.number().int().min(1).max(480).optional(),
    actual_minutes: z.number().int().min(0).max(480).optional(),
    notes: z.string().max(2000).optional(),
});
export async function sessionCommand(userId: string, action: string, input: unknown) {
    z.enum(['start', 'pause', 'resume', 'stop', 'abandon', 'extend', 'expire']).parse(action);
    const p = sessionInput.parse(input);
    if (action === 'start' && !p.task_id) throw new FocusError('focus_task_required');
    const { data, error } = await focusAdmin().rpc('focus_session_command', {
        p_user: uuid.parse(userId), p_action: action, p_data: p,
    });
    check(error); return data;
}
export async function createSubtaskFor(userId: string, input: unknown) {
    const p = z.object({ task_id: uuid, title }).parse(input);
    const parent = await ownedTask(userId, p.task_id);
    if (parent.archived_at) throw new FocusError('focus_task_archived');
    const { data, error } = await focusAdmin().from('focus_subtasks')
        .insert({ ...p, user_id: userId }).select().single();
    check(error); return data;
}
export async function updateSubtaskFor(userId: string, id: string, input: unknown) {
    const p = z.object({ title: title.optional(), is_completed: z.boolean().optional() }).parse(input);
    const { data, error } = await focusAdmin().from('focus_subtasks').update(p)
        .eq('id', uuid.parse(id)).eq('user_id', userId).is('archived_at', null).select().single();
    check(error); return data;
}
export async function archiveSubtaskFor(userId: string, id: string) {
    const { data, error } = await focusAdmin().from('focus_subtasks')
        .update({ archived_at: new Date().toISOString() }).eq('id', uuid.parse(id)).eq('user_id', userId).select().single();
    check(error); return data;
}
