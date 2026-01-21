import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Plan configurations with prices in EUR
const PLANS = {
    spark: {
        name: 'Pack Spark',
        price: 149700, // €1,497 in cents
        description: 'Formation complète Dropshipping 1.0 + Communauté'
    },
    emperor: {
        name: 'Pack Emperor',
        price: 249700, // €2,497 in cents
        description: 'Spark + Dropshipping 2.0 + Coaching personnalisé'
    },
    legend: {
        name: 'Pack Legend',
        price: 497000, // €4,970 in cents (placeholder)
        description: 'Tout inclus + Accompagnement VIP'
    }
} as const;

type PlanType = keyof typeof PLANS;

export async function POST(req: Request) {
    try {
        const { plan } = await req.json();

        // Validate plan
        if (!plan || !PLANS[plan as PlanType]) {
            return NextResponse.json({
                error: 'Invalid plan. Must be: spark, emperor, or legend'
            }, { status: 400 });
        }

        // Validate Stripe key
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({
                error: 'Stripe not configured'
            }, { status: 500 });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-01-27.acacia' as any,
        });

        const selectedPlan = PLANS[plan as PlanType];
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lexmo-saas-ai.vercel.app';

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: selectedPlan.name,
                            description: selectedPlan.description,
                        },
                        unit_amount: selectedPlan.price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/#pricing`,
            metadata: {
                plan: plan, // This will be sent to the webhook
            },
            customer_email: undefined, // User will enter their email
        });

        console.log('✅ Checkout session created:', session.id, 'for plan:', plan);

        return NextResponse.json({
            url: session.url,
            sessionId: session.id
        });

    } catch (error: any) {
        console.error('❌ Checkout session error:', error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}
