import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';
import { generateAccessToken } from '@/lib/access-links';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

interface OverviewRow {
    id: string;
    token: string;
    label: string;
    created_at: string;
    expires_at: string;
    is_active: boolean;
    uses_count: number;
    last_used_at: string | null;
    distinct_ips: number;
}

/** Liste des liens, avec usages et nombre d'IP distinctes. */
export async function GET(request: NextRequest) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await getAdmin().rpc('access_links_overview');
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const origin = request.nextUrl.origin;
        const links = ((data ?? []) as OverviewRow[]).map((row) => ({
            ...row,
            url: `${origin}/dashboard/phases?access=${encodeURIComponent(row.token)}`,
            is_expired: new Date(row.expires_at).getTime() <= Date.now(),
        }));

        return NextResponse.json({ links });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/** Création d'un lien : label + durée de validité en jours. */
export async function POST(request: NextRequest) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const label = typeof body.label === 'string' ? body.label.trim() : '';
        const days = Number(body.days);

        if (!label) {
            return NextResponse.json({ error: 'Le label est obligatoire' }, { status: 400 });
        }
        if (label.length > 120) {
            return NextResponse.json({ error: 'Label trop long (120 caractères max)' }, { status: 400 });
        }
        if (!Number.isInteger(days) || days < 1 || days > 365) {
            return NextResponse.json({ error: 'Durée invalide (1 à 365 jours)' }, { status: 400 });
        }

        const token = generateAccessToken();
        const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

        const { data, error } = await getAdmin()
            .from('access_links')
            .insert({ token, label, expires_at: expiresAt })
            .select('id, token, label, created_at, expires_at, is_active, uses_count, last_used_at')
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log(`[access-link] creation label="${label}" expire=${expiresAt} par=${admin.email}`);

        return NextResponse.json({
            link: {
                ...data,
                distinct_ips: 0,
                is_expired: false,
                url: `${request.nextUrl.origin}/dashboard/phases?access=${encodeURIComponent(token)}`,
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
