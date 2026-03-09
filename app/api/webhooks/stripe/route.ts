import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const emailFromDetails = session.customer_details?.email;
    const emailFromSession = (session as any).customer_email;
    const emailFromMetadata = session.metadata?.email;
    const email = emailFromDetails || emailFromSession || emailFromMetadata;

    console.log('🔍 [STEP 3] customer_details.email :', emailFromDetails);
    console.log('🔍 [STEP 3] customer_email :', emailFromSession);
    console.log('🔍 [STEP 3] metadata.email :', emailFromMetadata);
    console.log('🔍 [STEP 3] Email utilisé :', email);

    if (!email) {
        console.error('❌ [STEP 3] No email found in checkout session');
        return;
    }

    const supabase = getSupabaseAdmin();

    const { data: existing, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('id, status')
        .eq('email', email)
        .single();

    console.log('🔍 [STEP 4] Supabase lookup:', JSON.stringify({ existing, fetchError }));

    if (existing) {
        const { error } = await supabase
            .from('user_subscriptions')
            .update({
                status: 'active',
                activated_at: new Date().toISOString(),
            })
            .eq('email', email);

        if (error) {
            console.error('❌ [STEP 4] Error updating subscription:', error);
            throw error;
        }
        console.log('✅ [STEP 4] Supabase updated - subscription activated for:', email);
    } else {
        const { error } = await supabase
            .from('user_subscriptions')
            .insert({
                email,
                plan: 'spark',
                status: 'active',
                activated_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
            });

        if (error) {
            console.error('❌ [STEP 4] Error creating subscription:', error);
            throw error;
        }
        console.log('✅ [STEP 4] Supabase updated - new subscription created for:', email);
    }

    console.log('🔍 [STEP 5] Sending activation email to:', email);

    try {
        const result = await sendActivationEmail(email);
        console.log('✅ [STEP 5] Email envoyé avec succès:', JSON.stringify(result));
    } catch (emailError: any) {
        console.error('❌ [STEP 5] Email sending failed:', emailError?.message || emailError);
    }
}

export async function POST(req: NextRequest) {
    console.log('🔍 [STEP 1] Webhook reçu');
    console.log('🔍 [STEP 1] Webhook secret prefix:', process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10));
    console.log('🔍 [STEP 1] Stripe key prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 12));

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-12-15.clover',
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    if (!webhookSecret) {
        console.error('❌ [STEP 1] STRIPE_WEBHOOK_SECRET is not set');
        return NextResponse.json(
            { error: 'Stripe webhook secret is not set' },
            { status: 500 }
        );
    }

    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        console.error('❌ [STEP 1] Missing stripe-signature header');
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
        console.error('❌ [STEP 2] Signature vérification ÉCHOUÉE:', err.message);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    console.log('✅ [STEP 2] Signature vérifiée - Event:', event.type, '- ID:', event.id);

    if (event.type === 'checkout.session.completed') {
        try {
            await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        } catch (error: any) {
            console.error('❌ Error handling checkout.session.completed:', error);
            return NextResponse.json(
                { error: 'Webhook handler failed' },
                { status: 500 }
            );
        }
    } else {
        console.log('ℹ️ Event type ignoré:', event.type);
    }

    console.log('✅ [DONE] Webhook traité avec succès');
    return NextResponse.json({ received: true });
}
