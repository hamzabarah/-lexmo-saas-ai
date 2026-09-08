import { NextRequest } from 'next/server';
import { getProjectContextFor } from '@/lib/focus/strategy';
import { focusStrategyResponse } from '@/lib/focus/strategy-http';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
    return focusStrategyResponse(async (userId) => getProjectContextFor(userId, (await context.params).id));
}
