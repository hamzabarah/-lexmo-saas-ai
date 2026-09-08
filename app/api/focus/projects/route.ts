import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createProjectFor, listProjectsFor, updateProjectFor } from '@/lib/focus/strategy';
import { projectFilterSchema } from '@/lib/focus/strategy-schemas';
import { focusStrategyResponse } from '@/lib/focus/strategy-http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    return focusStrategyResponse(async (userId) => {
        const query = Object.fromEntries(req.nextUrl.searchParams);
        const filter = projectFilterSchema.parse({
            ...query,
            ...(query.active_only === undefined ? {} : {
                active_only: z.enum(['true', 'false']).parse(query.active_only) === 'true',
            }),
        });
        return listProjectsFor(userId, filter);
    }, 'projects');
}

export async function POST(req: NextRequest) {
    return focusStrategyResponse(async (userId) => createProjectFor(userId, await req.json()), 'project');
}

export async function PATCH(req: NextRequest) {
    return focusStrategyResponse(async (userId) => {
        const { id, ...input } = z.object({ id: z.string().uuid() }).passthrough().parse(await req.json());
        return updateProjectFor(userId, id, input);
    }, 'project');
}
