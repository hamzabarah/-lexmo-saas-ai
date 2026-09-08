import { NextRequest } from 'next/server';
import { createProjectRecordFor, listProjectRecordsFor } from '@/lib/focus/strategy';
import { focusStrategyResponse, projectRecordPageSchema } from '@/lib/focus/strategy-http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    return focusStrategyResponse(async (userId) => listProjectRecordsFor(
        userId,
        (await context.params).id,
        projectRecordPageSchema.parse(Object.fromEntries(req.nextUrl.searchParams)),
    ), 'records');
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    return focusStrategyResponse(async (userId) => createProjectRecordFor(
        userId, (await context.params).id, await req.json(),
    ), 'record');
}
