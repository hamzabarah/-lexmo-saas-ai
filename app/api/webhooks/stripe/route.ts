import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover', // Exact version required by installed package
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
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
    // The user didn't specify logic, but for now we must return 200 OK so Stripe stops complaining.
    // In a real app, you would switch(event.type) here.

    // Example logging for now
    console.log(`✅ Success: Received Stripe webhook event: ${event.type} (${event.id})`);

    return NextResponse.json({ received: true });
}
