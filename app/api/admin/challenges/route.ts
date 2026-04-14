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

// GET: Get active challenge + its tasks
export async function GET() {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const admin = getSupabaseAdmin();

        // Get active challenge
        const { data: challenge, error } = await admin
            .from('admin_challenges')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        if (!challenge) return NextResponse.json({ challenge: null, tasks: [] });

        // Get tasks for this challenge
        const { data: tasks, error: tasksError } = await admin
            .from('admin_challenge_tasks')
            .select('*')
            .eq('challenge_id', challenge.id)
            .order('created_at', { ascending: true });

        if (tasksError) throw tasksError;

        return NextResponse.json({ challenge, tasks: tasks || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create a new challenge
export async function POST(req: NextRequest) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { name, total_days, target_revenue, team_count } = body;

        if (!name || !total_days || !target_revenue) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const admin = getSupabaseAdmin();

        // Deactivate any currently active challenges
        await admin
            .from('admin_challenges')
            .update({ is_active: false })
            .eq('is_active', true);

        // Create new challenge
        const { data: challenge, error } = await admin
            .from('admin_challenges')
            .insert({
                name,
                total_days,
                target_revenue,
                current_revenue: 0,
                team_count: team_count || 0,
                started_at: new Date().toISOString(),
                is_active: true,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ challenge });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Update challenge (revenue, team_count, name, end challenge)
export async function PATCH(req: NextRequest) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) return NextResponse.json({ error: 'Missing challenge id' }, { status: 400 });

        const admin = getSupabaseAdmin();

        const { data: challenge, error } = await admin
            .from('admin_challenges')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ challenge });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
