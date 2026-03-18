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

// GET: List all blocked slots for a date range
export async function GET(req: NextRequest) {
    try {
        const user = await verifyAdmin();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        const admin = getAdmin();
        let query = admin.from('coaching_blocked_slots').select('*');

        if (from) query = query.gte('slot_datetime', from);
        if (to) query = query.lte('slot_datetime', to);

        const { data, error } = await query.order('slot_datetime');

        if (error) throw error;
        return NextResponse.json({ slots: data || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Toggle a blocked slot (add if not exists, remove if exists)
export async function POST(req: NextRequest) {
    try {
        const user = await verifyAdmin();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slot_datetime } = await req.json();
        if (!slot_datetime) {
            return NextResponse.json({ error: 'Missing slot_datetime' }, { status: 400 });
        }

        const admin = getAdmin();

        // Check if slot already blocked
        const { data: existing } = await admin
            .from('coaching_blocked_slots')
            .select('id')
            .eq('slot_datetime', slot_datetime)
            .maybeSingle();

        if (existing) {
            // Unblock: delete it
            const { error } = await admin
                .from('coaching_blocked_slots')
                .delete()
                .eq('id', existing.id);
            if (error) throw error;
            return NextResponse.json({ action: 'unblocked' });
        } else {
            // Block: insert it
            const { error } = await admin
                .from('coaching_blocked_slots')
                .insert({ slot_datetime });
            if (error) throw error;
            return NextResponse.json({ action: 'blocked' });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
