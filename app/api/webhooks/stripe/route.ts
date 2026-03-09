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
    const email = session.customer_details?.email;

    if (!email) {
        console.error('❌ No email found in checkout session');
        return;
    }

    console.log(`📧 Processing checkout for: ${email}`);

    const supabase = getSupabaseAdmin();

    // Check if subscription already exists
    const { data: existing } = await supabase
        .from('user_subscriptions')
        .select('id, status')
        .eq('email', email)
        .single();

    if (existing) {
        // Update existing subscription to active
        const { error } = await supabase
            .from('user_subscriptions')
            .update({
                status: 'active',
                activated_at: new Date().toISOString(),
            })
            .eq('email', email);

        if (error) {
            console.error('❌ Error updating subscription:', error);
            throw error;
        }
        console.log(`✅ Subscription updated to active for: ${email}`);
    } else {
        // Insert new subscription
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
            console.error('❌ Error creating subscription:', error);
            throw error;
        }
        console.log(`✅ New subscription created for: ${email}`);
    }

    // Send activation email
    try {
        await sendActivationEmail(email);
    } catch (emailError) {
        // Don't fail the webhook if email fails — subscription is already active
        console.error('⚠️ Email sending failed (subscription still activated):', emailError);
    }
}

export async function POST(req: NextRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-12-15.clover',
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    if (!webhookSecret) {
        return NextResponse.json(
            { error: 'Stripe webhook secret is not set' },
            { status: 500 }
        );
    }

    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    // Handle the event
    console.log(`✅ Received Stripe event: ${event.type} (${event.id})`);

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
    }

    return NextResponse.json({ received: true });
}
