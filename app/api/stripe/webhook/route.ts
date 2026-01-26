import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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

            // V1: Manual process - admin creates account and sends credentials
            // TODO V2: Automate with Supabase
            // const { createClient } = await import('@/utils/supabase/server');
            // const supabase = await createClient();
            // await supabase.from('user_subscriptions').insert({...});

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
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
