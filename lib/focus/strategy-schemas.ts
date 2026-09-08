import { z } from 'zod';

export const projectEngineSchema = z.enum(['acquisition', 'conversion', 'expansion', 'systeme', 'risque']);
export const projectStatusSchema = z.enum(['queued', 'vital', 'paused', 'evaluating', 'completed', 'cancelled']);
export const phaseStatusSchema = z.enum(['planned', 'active', 'paused', 'completed', 'cancelled']);
export const recordTypeSchema = z.enum(['decision', 'output', 'result', 'lesson', 'cost']);
const id = z.string().uuid();
const name = z.string().trim().min(1).max(200);
const text = z.string().trim().max(10000).nullable().optional();
const date = z.iso.date().nullable().optional();
const euros = z.number().finite().min(0).max(9999999999.99).multipleOf(0.01);

const projectFields = {
    name: name.optional(), subtitle: text,
    status: projectStatusSchema.optional(), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    position: z.number().int().min(0).max(2147483647).optional(),
    phase_id: id.nullable().optional(), objective_id: id.nullable().optional(),
    engine: projectEngineSchema.nullable().optional(),
    purpose: text, hypothesis: text, expected_outcome: text, success_criteria: text,
    priority: z.enum(['urgent', 'normal']).optional(),
    delivery_deadline: date, evaluation_deadline: date,
    planned_time_minutes: z.number().int().min(0).max(2147483647).nullable().optional(),
    planned_cost_eur: euros.nullable().optional(),
};
const orderedDeadlines = (p: { delivery_deadline?: string | null; evaluation_deadline?: string | null }) =>
    !p.delivery_deadline || !p.evaluation_deadline || p.evaluation_deadline >= p.delivery_deadline;
export const createProjectSchema = z.strictObject({ ...projectFields, name })
    .refine(orderedDeadlines, 'Evaluation must not precede delivery');
export const updateProjectSchema = z.strictObject(projectFields)
    .refine(p => Object.keys(p).length > 0, 'At least one project field is required')
    .refine(orderedDeadlines, 'Evaluation must not precede delivery');
export const projectFilterSchema = z.strictObject({
    active_only: z.boolean().optional(), phase_id: id.optional(),
    engine: projectEngineSchema.optional(), status: projectStatusSchema.optional(),
});
const phaseFields = {
    name: name.optional(), position: z.number().int().min(0).max(2147483647).optional(),
    starts_on: date, ends_on: date, mission: text, status: phaseStatusSchema.optional(),
};
const orderedPhaseDates = (p: { starts_on?: string | null; ends_on?: string | null }) =>
    !p.starts_on || !p.ends_on || p.ends_on >= p.starts_on;
export const createPhaseSchema = z.strictObject({ ...phaseFields, name })
    .refine(orderedPhaseDates, 'Phase end must not precede its start');
export const updatePhaseSchema = z.strictObject(phaseFields)
    .refine(p => Object.keys(p).length > 0, 'At least one phase field is required')
    .refine(orderedPhaseDates, 'Phase end must not precede its start');

const short = (length: number) => z.string().trim().min(1).max(length);
const resultPayload = z.strictObject({
    metric: short(200).optional(), value: z.number().finite().optional(),
    unit: short(100).optional(), source: short(2048).optional(),
}).refine(p => (p.metric === undefined) === (p.value === undefined), 'Metric and value must be supplied together');
const recordFields = { title: name, content: text };
export const recordSchemas = {
    decision: z.strictObject({ ...recordFields, payload: z.strictObject({
        rationale: short(10000).optional(), alternatives: z.array(short(2000)).max(20).optional(),
    }).optional() }),
    output: z.strictObject({ ...recordFields, payload: z.strictObject({
        url: z.url({ protocol: /^https?$/ }).max(2048).optional(), format: short(100).optional(),
    }).optional() }),
    result: z.strictObject({ ...recordFields, payload: resultPayload.optional() }),
    lesson: z.strictObject({ ...recordFields, payload: z.strictObject({ next_action: short(10000).optional() }).optional() }),
    cost: z.strictObject({ ...recordFields, payload: z.strictObject({ amount_eur: euros, category: short(200).optional() }) }),
};
export const createRecordSchema = z.discriminatedUnion('type', [
    recordSchemas.decision.extend({ type: z.literal('decision') }),
    recordSchemas.output.extend({ type: z.literal('output') }),
    recordSchemas.result.extend({ type: z.literal('result') }),
    recordSchemas.lesson.extend({ type: z.literal('lesson') }),
    recordSchemas.cost.extend({ type: z.literal('cost') }),
]).refine(p => new TextEncoder().encode(JSON.stringify(p.payload ?? {})).byteLength <= 16384,
    'Record payload exceeds 16 KiB');
export const recordPageSchema = z.strictObject({
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).max(1000000).default(0),
});
