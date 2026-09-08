import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import { FocusError } from './db';
import { recordPageSchema } from './strategy-schemas';

/** Strategic data can reference global Pilotage objectives: keep every route admin-only. */
export async function focusStrategyResponse(
    run: (userId: string) => Promise<unknown>,
    key?: string,
    authenticate: () => Promise<{ id: string } | null> = requireAdmin,
) {
    const admin = await authenticate();
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    try {
        const data = await run(admin.id);
        return NextResponse.json(key ? { [key]: data } : data);
    } catch (error) {
        if (error instanceof ZodError || error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid Focus strategy request' }, { status: 400 });
        }
        if (error instanceof FocusError) {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }
        // Do not expose database errors, request bodies or credentials in the response/log.
        console.error('[focus] strategy request failed');
        return NextResponse.json({ error: 'Focus strategy request failed' }, { status: 500 });
    }
}

const queryNumber = (value: unknown) => typeof value === 'string' ? Number(value) : value;
export const projectRecordPageSchema = z.object({
    limit: z.preprocess(queryNumber, recordPageSchema.shape.limit),
    offset: z.preprocess(queryNumber, recordPageSchema.shape.offset),
}).strict();
