import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

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
            return NextResponse.json({ hasAccess: false, subscription: null });
        }

        // Admin bypass
        if (user.email === 'academyfrance75@gmail.com') {
            return NextResponse.json({
                hasAccess: true,
                subscription: {
                    id: 'admin-override',
                    user_id: user.id,
                    email: user.email,
                    plan: 'legend',
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
            return NextResponse.json({ hasAccess: false, subscription: null });
        }

        // If user_id is missing, update it now
        if (!subscription.user_id) {
            await admin
                .from('user_subscriptions')
                .update({ user_id: user.id })
                .eq('email', user.email!);
        }

        return NextResponse.json({
            hasAccess: true,
            subscription,
        });
    } catch (error) {
        console.error('Error checking subscription:', error);
        return NextResponse.json({ hasAccess: false, subscription: null });
    }
}
