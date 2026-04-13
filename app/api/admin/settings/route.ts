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

// GET: Read settings (public, no auth needed)
// Also checks if promo timer expired → auto-closes
export async function GET() {
    try {
        const admin = getSupabaseAdmin();
        const { data, error } = await admin
            .from('live_dashboard_state')
            .select('data')
            .eq('id', 1)
            .single();

        if (error) throw error;

        const currentData = data?.data || {};
        const settings = currentData.settings || {};

        // Auto-close promo if timer expired or slots full
        if (settings.promo_active && settings.promo_started_at && settings.promo_duree_heures) {
            const endTime = new Date(settings.promo_started_at).getTime() + settings.promo_duree_heures * 3600000;
            const taken = settings.promo_places_prises || 0;
            const total = settings.promo_places_total || 12;
            const intervalMin = settings.promo_interval_minutes || 20;
            const elapsed = Date.now() - new Date(settings.promo_started_at).getTime();
            const simulatedTaken = Math.floor(elapsed / (intervalMin * 60000));
            const effectiveTaken = Math.min(taken + simulatedTaken, total);

            if (Date.now() >= endTime || effectiveTaken >= total) {
                const updatedSettings = {
                    ...settings,
                    promo_active: false,
                    registrations_open: false,
                    registrations_closed_at: new Date().toISOString(),
                };
                await admin
                    .from('live_dashboard_state')
                    .update({ data: { ...currentData, settings: updatedSettings } })
                    .eq('id', 1);
                return NextResponse.json({ settings: updatedSettings });
            }
        }

        return NextResponse.json({ settings });
    } catch (error: any) {
        return NextResponse.json({ settings: {} }, { status: 500 });
    }
}

// POST: Update a setting (admin only)
export async function POST(req: NextRequest) {
    try {
        // Verify admin
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { key, value } = body;

        if (!key) {
            return NextResponse.json({ error: 'Missing key' }, { status: 400 });
        }

        const admin = getSupabaseAdmin();

        // Get current data
        const { data: current } = await admin
            .from('live_dashboard_state')
            .select('data')
            .eq('id', 1)
            .single();

        const currentData = current?.data || {};
        const currentSettings = currentData.settings || {};

        // Update the specific setting
        const updatedData = {
            ...currentData,
            settings: {
                ...currentSettings,
                [key]: value,
            },
        };

        const { error } = await admin
            .from('live_dashboard_state')
            .update({ data: updatedData })
            .eq('id', 1);

        if (error) throw error;

        return NextResponse.json({ success: true, settings: updatedData.settings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
