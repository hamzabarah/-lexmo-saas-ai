import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

const ADMIN_EMAIL = 'academyfrance75@gmail.com';

function getSupabaseAdmin() {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

async function verifyAdmin() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user && user.email === ADMIN_EMAIL;
}

// POST: Add a new task
export async function POST(req: NextRequest) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { challenge_id, day_number, time_text, task_text } = body;

        if (!challenge_id || !day_number) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const admin = getSupabaseAdmin();

        const { data: task, error } = await admin
            .from('admin_challenge_tasks')
            .insert({
                challenge_id,
                day_number,
                time_text: time_text || '',
                task_text: task_text || '',
                status: 'todo',
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ task });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Update a task (status, time_text, task_text)
export async function PATCH(req: NextRequest) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) return NextResponse.json({ error: 'Missing task id' }, { status: 400 });

        const admin = getSupabaseAdmin();

        const { data: task, error } = await admin
            .from('admin_challenge_tasks')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ task });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove a task
export async function DELETE(req: NextRequest) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing task id' }, { status: 400 });

        const admin = getSupabaseAdmin();

        const { error } = await admin
            .from('admin_challenge_tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
