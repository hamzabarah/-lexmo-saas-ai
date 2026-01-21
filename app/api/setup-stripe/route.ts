import { NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * ONE-CLICK STRIPE WEBHOOK SETUP
 * 
 * Visit: https://lexmo-saas-ai.vercel.app/api/setup-stripe
 * 
 * This will:
 * 1. Delete old webhooks
 * 2. Create new webhook
 * 3. Show you the new signing secret to copy to Vercel
 */

export async function GET() {
    const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lexmo-saas-ai.vercel.app'}/api/webhooks/stripe`;
    const EVENTS = ['checkout.session.completed'];

    try {
        // Check if Stripe key exists
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({
                error: 'STRIPE_SECRET_KEY not configured in Vercel',
                instructions: 'Add STRIPE_SECRET_KEY to Vercel environment variables first'
            }, { status: 500 });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-01-27.acacia' as any,
        });

        // Step 1: List and delete existing webhooks
        const existingWebhooks = await stripe.webhookEndpoints.list({ limit: 100 });
        const matchingWebhooks = existingWebhooks.data.filter(wh => wh.url === WEBHOOK_URL);

        const deletedWebhooks = [];
        for (const webhook of matchingWebhooks) {
            await stripe.webhookEndpoints.del(webhook.id);
            deletedWebhooks.push(webhook.id);
        }

        // Step 2: Create new webhook
        const newWebhook = await stripe.webhookEndpoints.create({
            url: WEBHOOK_URL,
            enabled_events: EVENTS as any, // TypeScript workaround for Stripe API version
            description: 'Lexmo SaaS - Auto-configured',
        });

        // Step 3: Return success with instructions
        return NextResponse.json({
            success: true,
            message: '✅ Webhook configured successfully!',
            webhook: {
                id: newWebhook.id,
                url: newWebhook.url,
                events: newWebhook.enabled_events,
                status: newWebhook.status
            },
            signingSecret: newWebhook.secret,
            deletedOldWebhooks: deletedWebhooks.length,
            instructions: {
                step1: 'Copy the signing secret below',
                step2: 'Go to Vercel → Settings → Environment Variables',
                step3: 'Update STRIPE_WEBHOOK_SECRET with this value',
                step4: 'Redeploy your application',
                step5: 'Test with a payment or: stripe trigger checkout.session.completed'
            },
            copyThis: {
                variableName: 'STRIPE_WEBHOOK_SECRET',
                value: newWebhook.secret
            }
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error: any) {
        console.error('Setup error:', error);

        return NextResponse.json({
            error: 'Failed to setup webhook',
            message: error.message,
            type: error.type,
            instructions: error.type === 'StripeAuthenticationError'
                ? 'Your Stripe API key is invalid. Check STRIPE_SECRET_KEY in Vercel.'
                : 'Check the error message above and try again.'
        }, { status: 500 });
    }
}
