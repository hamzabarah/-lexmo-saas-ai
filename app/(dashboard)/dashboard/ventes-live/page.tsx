import DashboardClient from './DashboardClient';
import { cookies } from 'next/headers';
import { Lock } from 'lucide-react';
import { createClient as createServerClient } from '@/utils/supabase/server';

const ADMIN_EMAIL = 'academyfrance75@gmail.com';

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

    // Reserve a l'administrateur, comme les pages /dashboard/focus.
    // Le controle est fait ICI, avant getInitialData() : cette page est un
    // Server Component, les chiffres de ventes seraient sinon deja rendus dans
    // le HTML envoye au visiteur, meme masques ensuite cote client.
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.email !== ADMIN_EMAIL) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-12 max-w-lg text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">الوصول مقيد</h2>
                    <p className="text-gray-400">هذه الصفحة محجوزة للمسؤول</p>
                </div>
            </div>
        );
    }

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
