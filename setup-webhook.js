/**
 * STRIPE WEBHOOK AUTO-SETUP SCRIPT
 * 
 * This script will:
 * 1. Delete any existing webhooks pointing to your app
 * 2. Create a new webhook with the correct configuration
 * 3. Display the new signing secret for you to add to Vercel
 * 
 * Usage:
 *   node setup-webhook.js
 */

const Stripe = require('stripe');

// Configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_URL = 'https://lexmo-saas-ai.vercel.app/api/webhooks/stripe';
const EVENTS_TO_LISTEN = ['checkout.session.completed'];

async function setupWebhook() {
    console.log('🚀 Starting Stripe Webhook Auto-Setup...\n');

    // Validate Stripe key
    if (!STRIPE_SECRET_KEY) {
        console.error('❌ ERROR: STRIPE_SECRET_KEY environment variable is not set!');
        console.log('\n💡 Set it in your .env.local file or run:');
        console.log('   $env:STRIPE_SECRET_KEY="sk_test_your_key_here"; node setup-webhook.js\n');
        process.exit(1);
    }

    if (!STRIPE_SECRET_KEY.startsWith('sk_test_')) {
        console.error('⚠️  WARNING: You are using a LIVE Stripe key!');
        console.log('   This script is designed for TEST mode.');
        console.log('   Press Ctrl+C to cancel or wait 5 seconds to continue...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2025-01-27.acacia',
    });

    try {
        // Step 1: List existing webhooks
        console.log('📋 Step 1: Checking for existing webhooks...');
        const existingWebhooks = await stripe.webhookEndpoints.list({ limit: 100 });

        const matchingWebhooks = existingWebhooks.data.filter(wh =>
            wh.url === WEBHOOK_URL
        );

        if (matchingWebhooks.length > 0) {
            console.log(`   Found ${matchingWebhooks.length} existing webhook(s) for this URL`);

            // Step 2: Delete existing webhooks
            console.log('\n🗑️  Step 2: Deleting existing webhooks...');
            for (const webhook of matchingWebhooks) {
                await stripe.webhookEndpoints.del(webhook.id);
                console.log(`   ✅ Deleted webhook: ${webhook.id}`);
            }
        } else {
            console.log('   No existing webhooks found for this URL');
        }

        // Step 3: Create new webhook
        console.log('\n✨ Step 3: Creating new webhook...');
        const newWebhook = await stripe.webhookEndpoints.create({
            url: WEBHOOK_URL,
            enabled_events: EVENTS_TO_LISTEN,
            description: 'Lexmo SaaS - Auto-configured webhook',
        });

        console.log('   ✅ Webhook created successfully!');
        console.log(`   Webhook ID: ${newWebhook.id}`);
        console.log(`   URL: ${newWebhook.url}`);
        console.log(`   Events: ${newWebhook.enabled_events.join(', ')}`);

        // Step 4: Display signing secret
        console.log('\n🔑 Step 4: Webhook Signing Secret');
        console.log('   ═══════════════════════════════════════════════════════');
        console.log(`   ${newWebhook.secret}`);
        console.log('   ═══════════════════════════════════════════════════════');

        console.log('\n📝 NEXT STEPS:');
        console.log('   1. Copy the signing secret above (starts with whsec_)');
        console.log('   2. Go to Vercel → Your Project → Settings → Environment Variables');
        console.log('   3. Update STRIPE_WEBHOOK_SECRET with the new value');
        console.log('   4. Redeploy your application on Vercel');
        console.log('   5. Test with: stripe trigger checkout.session.completed\n');

        console.log('✅ Setup complete!\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        if (error.type === 'StripeAuthenticationError') {
            console.log('\n💡 Your Stripe API key is invalid or expired.');
            console.log('   Get a new one from: https://dashboard.stripe.com/test/apikeys\n');
        }
        process.exit(1);
    }
}

// Run the setup
setupWebhook().catch(console.error);
