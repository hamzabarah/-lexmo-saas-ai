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

// GET: List all availability slots
export async function GET() {
    try {
        const admin = getAdmin();
        const { data, error } = await admin
            .from('availability_slots')
            .select('*')
            .order('day_of_week')
            .order('hour');

        if (error) throw error;
        return NextResponse.json({ slots: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Add a new slot
export async function POST(req: NextRequest) {
    try {
        const user = await verifyAdmin();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { day_of_week, hour, minute } = await req.json();

        const admin = getAdmin();
        const { data, error } = await admin
            .from('availability_slots')
            .insert({ day_of_week, hour, minute: minute || 0 })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ slot: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove a slot
export async function DELETE(req: NextRequest) {
    try {
        const user = await verifyAdmin();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await req.json();

        const admin = getAdmin();
        const { error } = await admin
            .from('availability_slots')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
