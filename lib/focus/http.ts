import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { FocusError } from './commands';
import { z, ZodError } from 'zod';

export async function focusMutation(req: NextRequest,
    run: (userId: string, body: Record<string, unknown>) => Promise<unknown>, key?: string) {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = z.object({}).passthrough().parse(req.method === 'DELETE'
            ? { id: req.nextUrl.searchParams.get('id') ?? (await req.json()).id }
            : await req.json());
        const data = await run(user.id, body);
        return NextResponse.json(key ? { [key]: data } : { success: true });
    } catch (e) {
        if (e instanceof ZodError || e instanceof SyntaxError)
            return NextResponse.json({ error: 'Invalid Focus request' }, { status: 400 });
        if (e instanceof FocusError)
            return NextResponse.json({ error: e.message }, { status: 409 });
        console.error('[focus] command failed', e);
        return NextResponse.json({ error: 'Focus command failed' }, { status: 500 });
    }
}
