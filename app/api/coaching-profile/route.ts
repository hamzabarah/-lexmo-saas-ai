import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// GET: Return coaching profile for current user + their booking if any
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = getAdmin();

        // Get coaching profile
        const { data: profile } = await admin
            .from('coaching_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        // Get existing booking
        const { data: booking } = await admin
            .from('bookings')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_type', 'diagnostic')
            .neq('status', 'cancelled')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        return NextResponse.json({ profile: profile || null, booking: booking || null });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create/update coaching profile (step 1 → step 2)
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { full_name, google_meet_email } = await req.json();

        if (!full_name || !google_meet_email) {
            return NextResponse.json({ error: 'الاسم والبريد الإلكتروني مطلوبان' }, { status: 400 });
        }

        const admin = getAdmin();

        // Upsert coaching profile
        const { data: profile, error } = await admin
            .from('coaching_profiles')
            .upsert({
                user_id: user.id,
                full_name,
                google_meet_email,
                current_step: 2,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ profile });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Update current_step
export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { current_step } = await req.json();

        if (!current_step || current_step < 1 || current_step > 5) {
            return NextResponse.json({ error: 'Invalid step' }, { status: 400 });
        }

        const admin = getAdmin();

        const { data: profile, error } = await admin
            .from('coaching_profiles')
            .update({ current_step, updated_at: new Date().toISOString() })
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ profile });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
