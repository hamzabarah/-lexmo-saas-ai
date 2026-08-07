import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

/**
 * Activation / désactivation d'un lien.
 * La coupure est effective au prochain contrôle du middleware, qui ne met
 * jamais ce lookup en cache : aucun redéploiement n'est nécessaire.
 */
export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await ctx.params;
        const body = await request.json();

        if (typeof body.is_active !== 'boolean') {
            return NextResponse.json({ error: 'is_active (booléen) requis' }, { status: 400 });
        }

        const { data, error } = await getAdmin()
            .from('access_links')
            .update({ is_active: body.is_active })
            .eq('id', id)
            .select('id, label, is_active')
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log(`[access-link] ${body.is_active ? 'reactivation' : 'desactivation'} label="${data.label}" par=${admin.email}`);

        return NextResponse.json({ link: data });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
