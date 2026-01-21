# Stripe Webhook Auto-Setup

## 🚀 Quick Start

Run this script ONCE to automatically configure your Stripe webhook:

```powershell
# Make sure you're in the project directory
cd c:\Users\user\Desktop\lexmo-saas-ai

# Run the setup script
node setup-webhook.js
```

## What it does

1. ✅ Deletes any existing webhooks for your app
2. ✅ Creates a new webhook with the correct URL
3. ✅ Configures `checkout.session.completed` event
4. ✅ Displays the new signing secret

## After running

1. Copy the `whsec_xxx` secret displayed
2. Go to Vercel → Settings → Environment Variables
3. Update `STRIPE_WEBHOOK_SECRET`
4. Redeploy on Vercel

## Troubleshooting

**Error: STRIPE_SECRET_KEY not set**
```powershell
# Set it temporarily for this session
$env:STRIPE_SECRET_KEY="sk_test_your_key_here"
node setup-webhook.js
```

**Or add it to .env.local permanently**
```
STRIPE_SECRET_KEY=sk_test_your_key_here
```

Then run: `node setup-webhook.js`
