import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
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
