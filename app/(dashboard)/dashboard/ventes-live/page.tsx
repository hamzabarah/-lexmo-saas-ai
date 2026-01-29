import { createClient } from '@supabase/supabase-js';
import DashboardClient from './DashboardClient';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Server Component to fetch initial data
 * This is CRITICAL for "Immediate" display without "0 flash"
 */
async function getInitialData() {
    try {
        // Use native fetch with no-store + timestamp to BYPASS ALL CACHES
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/live_dashboard_state?id=eq.1&select=data&t=${Date.now()}`;
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });

        if (!response.ok) {
            console.error("Fetch load error:", response.statusText);
            return null;
        }

        const result = await response.json();
        return result[0]?.data || null;
    } catch (error) {
        console.error("Server Fetch Error:", error);
        return null;
    }
}

export default async function VentesLivePage() {
    // Calling cookies() ensures the page is treated as dynamic and not cached
    await cookies();

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
