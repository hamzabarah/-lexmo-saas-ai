import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { closeExpiredSessions } from '@/lib/focus-session-expiry';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createAdminClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

/**
 * GET /api/focus/current — la session ouverte de l'utilisateur, ou null.
 *
 * AUCUN filtre de date, volontairement. GET /api/focus ne renvoie que les
 * sessions du jour demandé : une session démarrée avant minuit, ou depuis le
 * serveur MCP, en sortait — l'écran « جلسات التركيز » se rouvrait alors à
 * l'arrêt sur 45:00 alors qu'une session tournait. C'est ce point d'entrée,
 * et lui seul, qui fait autorité sur « une session est-elle en cours ».
 *
 * Le temps restant n'est pas renvoyé : il se recalcule chez l'appelant depuis
 * `started_at`, de sorte qu'un rafraîchissement de page ou un autre appareil
 * retrouvent la même valeur.
 */
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Clôture d'abord les sessions périmées : une session dont la durée est
    // écoulée ne doit jamais ressortir comme « en cours ».
    await closeExpiredSessions(user.id);

    const { data, error } = await getAdmin()
        .from('focus_sessions')
        .select('*, focus_tasks(id, title, category)')
        .eq('user_id', user.id)
        .in('status', ['running', 'paused'])
        .order('started_at', { ascending: false })
        .limit(1);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const session = data?.[0] ?? null;
    if (!session) return NextResponse.json({ session: null });

    // Filet : si le balayage n'a pas pu clôturer (durée prévue absente ou
    // nulle), on ne présente pas pour autant une session déjà expirée.
    const planned = session.planned_duration_minutes ?? 0;
    if (planned > 0) {
        const expiresAt = new Date(session.started_at).getTime() + planned * 60_000;
        if (expiresAt <= Date.now()) return NextResponse.json({ session: null });
    }

    return NextResponse.json({ session });
}
