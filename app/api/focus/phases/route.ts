import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createPhaseFor, listPhasesFor, updatePhaseFor } from '@/lib/focus/strategy';
import { focusStrategyResponse } from '@/lib/focus/strategy-http';

export const dynamic = 'force-dynamic';

export async function GET() {
    return focusStrategyResponse(listPhasesFor, 'phases');
}

export async function POST(req: NextRequest) {
    return focusStrategyResponse(async (userId) => createPhaseFor(userId, await req.json()), 'phase');
}

export async function PATCH(req: NextRequest) {
    return focusStrategyResponse(async (userId) => {
        const { id, ...input } = z.object({ id: z.string().uuid() }).passthrough().parse(await req.json());
        return updatePhaseFor(userId, id, input);
    }, 'phase');
}
