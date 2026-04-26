import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

const ADMIN_EMAIL = 'academyfrance75@gmail.com';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        // Auth check: must be logged-in admin
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (user.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const today = new Date().toISOString().split('T')[0];

        const resetData = {
            ventes: [],
            stats: {
                total_gains: 0,
                total_ventes: 0
            },
            live_actuel: {
                places_disponibles: 10,
                places_prises: 0,
                places_restantes: 10,
                heure_debut: `${today}T06:00:00`,
                heure_fin: `${today}T23:59:59`
            },
            graphique: [
                { date: today, cumul: 0 }
            ]
        };

        // Read current data to preserve settings
        const { data: current } = await supabaseAdmin
            .from('live_dashboard_state')
            .select('data')
            .eq('id', 1)
            .single();

        const existingSettings = current?.data?.settings || {};

        const mergedData = {
            ...resetData,
            settings: existingSettings,
        };

        const { error } = await supabaseAdmin
            .from('live_dashboard_state')
            .update({ data: mergedData })
            .eq('id', 1);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: `Dashboard reset to ${today} successully. All sales cleared.`
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
