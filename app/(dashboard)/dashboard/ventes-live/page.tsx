import { createClient } from '@supabase/supabase-js';
import DashboardClient from './DashboardClient';

// Initialize Supabase Anon Client (Public Read is sufficient for this)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Server Component to fetch initial data
 * This is CRITICAL for "Immediate" display without "0 flash"
 */
async function getInitialData() {
    try {
        const { data, error } = await supabase
            .from('live_dashboard_state')
            .select('data')
            .eq('id', 1)
            .single();

        if (error) {
            console.error("Supabase load error:", error);
            return null; // DashboardClient defaults? Or pass empty
        }

        return data?.data || null;
    } catch (error) {
        console.error("Server Fetch Error:", error);
        return null;
    }
}

export default async function VentesLivePage() {
    const data = await getInitialData();

    // Default fallback if server fetch fails
    const initialData = data || {
        ventes: [],
        stats: { total_gains: 0, total_ventes: 0 },
        live_actuel: { places_disponibles: 0, places_prises: 0, places_restantes: 0 },
        graphique: []
    };

    return <DashboardClient initialData={initialData} />;
}
