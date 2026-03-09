import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendActivationEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

async function handleCheckoutCompleted(customerEmail: string) {
    console.log('🔍 [STEP 3] Email client :', customerEmail);

    if (!customerEmail) {
        console.error('❌ [STEP 3] No email found');
        return;
    }

    const supabase = getSupabaseAdmin();

    const { data: existing, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('id, status')
        .eq('email', customerEmail)
        .single();

    console.log('🔍 [STEP 4] Supabase lookup:', JSON.stringify({ existing, fetchError }));

    if (existing) {
        const { error } = await supabase
            .from('user_subscriptions')
            .update({
                status: 'active',
                activated_at: new Date().toISOString(),
            })
            .eq('email', customerEmail);

        if (error) {
            console.error('❌ [STEP 4] Error updating subscription:', error);
            throw error;
        }
        console.log('✅ [STEP 4] Supabase updated - subscription activated for:', customerEmail);
    } else {
        const { error } = await supabase
            .from('user_subscriptions')
            .insert({
                email: customerEmail,
                plan: 'spark',
                status: 'active',
                activated_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
            });

        if (error) {
            console.error('❌ [STEP 4] Error creating subscription:', error);
            throw error;
        }
        console.log('✅ [STEP 4] Supabase updated - new subscription created for:', customerEmail);
    }

    console.log('🔍 [STEP 5] Sending activation email to:', customerEmail);
    console.log('🔍 [STEP 5] RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('🔍 [STEP 5] RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);

    try {
        const result = await sendActivationEmail(customerEmail);
        console.log('✅ [STEP 5] Email envoyé avec succès:', JSON.stringify(result));
    } catch (emailError: any) {
        console.error('❌ [STEP 5] Email sending failed:', emailError?.message || emailError);
        console.error('❌ [STEP 5] Full error:', JSON.stringify(emailError));
    }
}

// ⚠️ TEMPORARY: Signature verification bypassed for testing
export async function POST(req: NextRequest) {
    console.log('🔍 [STEP 1] Webhook reçu (BYPASS MODE)');

    try {
        const body = await req.json();
        console.log('🔍 [STEP 2] Body reçu - type:', body?.type);

        const eventType = body?.type;
        const email = body?.data?.object?.customer_details?.email
            || body?.data?.object?.customer_email
            || body?.email; // fallback for manual test

        console.log('🔍 [STEP 2] Email extrait:', email);

        if (eventType === 'checkout.session.completed' || body?.test) {
            await handleCheckoutCompleted(email);
        } else {
            console.log('ℹ️ Event type ignoré:', eventType);
        }

        console.log('✅ [DONE] Webhook traité avec succès');
        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('❌ Webhook error:', error?.message || error);
        return NextResponse.json({ error: error?.message }, { status: 500 });
    }
}
