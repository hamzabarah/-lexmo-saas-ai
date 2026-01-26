import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;

            // Get customer email and metadata
            const customerEmail = session.customer_email || session.customer_details?.email;
            const userId = session.metadata?.user_id;
            const plan = session.metadata?.plan;
            const referralCode = session.metadata?.referral_code;

            console.log('✅ Payment successful:', {
                email: customerEmail,
                userId,
                plan,
                amount: session.amount_total,
                referralCode
            });

            // TODO: Grant access to the course
            // TODO: Send welcome email
            // TODO: Record commission for ambassador if referralCode exists

            const supabase = await createClient();

            // Example: Update user subscription status
            if (userId) {
                await supabase
                    .from('user_subscriptions')
                    .insert({
                        user_id: userId,
                        plan: plan,
                        status: 'active',
                        stripe_session_id: session.id,
                        amount_paid: session.amount_total,
                        referral_code: referralCode
                    });
            }

            break;
        }

        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('💰 PaymentIntent succeeded:', paymentIntent.id);
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('❌ Payment failed:', paymentIntent.id);
            // TODO: Send failure email
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
