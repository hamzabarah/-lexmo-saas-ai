import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Cette route décide de l'accès en temps réel : elle ne doit JAMAIS être
// mise en cache (ni par Next, ni par le CDN, ni par le navigateur).
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// En-têtes anti-cache appliqués à TOUTES les réponses de cette route.
const NO_STORE_HEADERS = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
};

// Marqueurs de diagnostic renvoyés avec CHAQUE réponse : identifient le
// déploiement et le projet Supabase RÉELLEMENT interrogés par ce serveur.
const DEPLOY = {
    build: (process.env.VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7),
    env: process.env.VERCEL_ENV || 'dev',
    supabaseRef: (process.env.SUPABASE_URL || '').split('//')[1]?.split('.')[0] || '—',
};

function jsonNoStore(body: Record<string, unknown>, init?: { status?: number }) {
    return NextResponse.json(body, { ...init, headers: NO_STORE_HEADERS });
}

function getSupabaseAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function GET() {
    try {
        // Get authenticated user from session
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log(`[check-subscription] email=<none> hasAccess=false reason=no-auth build=${DEPLOY.build} env=${DEPLOY.env} db=${DEPLOY.supabaseRef}`);
            return jsonNoStore({ hasAccess: false, subscription: null, email: null, ...DEPLOY });
        }

        // Admin bypass — full access to all areas
        if (user.email === 'academyfrance75@gmail.com') {
            console.log(`[check-subscription] email=${user.email} hasAccess=true reason=admin build=${DEPLOY.build} env=${DEPLOY.env} db=${DEPLOY.supabaseRef}`);
            return jsonNoStore({
                hasAccess: true,
                isAdmin: true,
                email: user.email,
                ...DEPLOY,
                subscription: {
                    id: 'admin-override',
                    user_id: user.id,
                    email: user.email,
                    plan: 'ecommerce',
                    status: 'active',
                    activated_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                },
            });
        }

        // Use service role to bypass RLS
        const admin = getSupabaseAdmin();
        const { data: subscription, error: subError } = await admin
            .from('user_subscriptions')
            .select('*')
            .eq('email', user.email!)
            .eq('status', 'active')
            .single();

        if (subError || !subscription) {
            console.log(`[check-subscription] email=${user.email} hasAccess=false reason=no-active-subscription subError=${subError?.message ?? 'none'} build=${DEPLOY.build} env=${DEPLOY.env} db=${DEPLOY.supabaseRef}`);
            return jsonNoStore({ hasAccess: false, subscription: null, email: user.email, ...DEPLOY });
        }

        // If user_id is missing, update it now
        if (!subscription.user_id) {
            await admin
                .from('user_subscriptions')
                .update({ user_id: user.id })
                .eq('email', user.email!);
        }

        console.log(`[check-subscription] email=${user.email} hasAccess=true reason=active plan=${subscription.plan} build=${DEPLOY.build} env=${DEPLOY.env} db=${DEPLOY.supabaseRef}`);
        return jsonNoStore({ hasAccess: true, subscription, email: user.email, ...DEPLOY });
    } catch (error) {
        console.error('Error checking subscription:', error);
        return jsonNoStore({ hasAccess: false, subscription: null, ...DEPLOY });
    }
}
