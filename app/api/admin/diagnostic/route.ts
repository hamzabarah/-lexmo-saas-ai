import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'academyfrance75@gmail.com';

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email === ADMIN_EMAIL ? user : null;
}

// GET: Load diagnostic for a specific user
export async function GET(req: NextRequest) {
    try {
        const user = await verifyAdmin();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');
        if (!userId) {
            return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
        }

        const admin = getAdmin();
        const { data: diagnostic } = await admin
            .from('coaching_diagnostics')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        return NextResponse.json({ diagnostic: diagnostic || null });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Save diagnostic answers (create or update)
export async function POST(req: NextRequest) {
    try {
        const user = await verifyAdmin();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { user_id, answers } = await req.json();
        if (!user_id || !answers || !Array.isArray(answers)) {
            return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
        }

        const admin = getAdmin();
        const { data, error } = await admin
            .from('coaching_diagnostics')
            .upsert({
                user_id,
                admin_id: user.id,
                answers,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ diagnostic: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Save bilan fields and/or publish
export async function PATCH(req: NextRequest) {
    try {
        const user = await verifyAdmin();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { user_id, summary, recommended_business, action_plan, recommendation, publish } = await req.json();
        if (!user_id) {
            return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
        }

        const admin = getAdmin();
        const updateData: any = { updated_at: new Date().toISOString() };

        if (summary !== undefined) updateData.summary = summary;
        if (recommended_business !== undefined) updateData.recommended_business = recommended_business;
        if (action_plan !== undefined) updateData.action_plan = action_plan;
        if (recommendation !== undefined) updateData.recommendation = recommendation;

        if (publish) {
            updateData.published = true;
            updateData.published_at = new Date().toISOString();
        }

        const { data, error } = await admin
            .from('coaching_diagnostics')
            .update(updateData)
            .eq('user_id', user_id)
            .select()
            .single();

        if (error) throw error;

        // If publishing, advance client to step 4
        if (publish) {
            await admin
                .from('coaching_profiles')
                .update({ current_step: 4, updated_at: new Date().toISOString() })
                .eq('user_id', user_id);
        }

        return NextResponse.json({ diagnostic: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
