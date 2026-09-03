import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// Initialize Supabase Anon Client (Public Read)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    // Reserve a l'administrateur, comme /dashboard/ventes-live qui consomme
    // cette route. Le controle est fait ICI, AVANT toute lecture : cet
    // endpoint servait publiquement l'etat du tableau de bord des ventes.
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('live_dashboard_state')
            .select('data')
            .eq('id', 1)
            .single();

        if (error) throw error;

        // Return the nested JSON data with strict CACHE-CONTROL HEADERS
        return new NextResponse(JSON.stringify(data?.data || {}), {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
