import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabaseAdmin from '@/lib/supabaseAdmin';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Test endpoint to verify webhook is accessible
export async function GET() {
    return NextResponse.json({
        status: 'OK',
        message: 'Webhook endpoint is accessible. Use POST with Stripe signature for actual webhooks.',
        timestamp: new Date().toISOString(),
        endpoint: '/api/webhooks/stripe'
    }, { status: 200 });
}


export async function POST(req: Request) {
    console.log('🔔 Webhook received at:', new Date().toISOString());

    const body = await req.text();
    const sig = (await headers()).get('stripe-signature') as string;

    console.log('📝 Signature present:', !!sig);

    // Lazy initialization of Stripe to avoid build-time errors
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        console.error('❌ Missing STRIPE_SECRET_KEY');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey, {
        apiVersion: '2025-01-27.acacia' as any,
    });

    let event: Stripe.Event;

    try {
        if (!endpointSecret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        console.log('✅ Webhook signature verified. Event type:', event.type);
    } catch (err: any) {
        console.error(`❌ Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            console.log('💳 Processing checkout.session.completed');
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutSessionCompleted(session);
            break;
        default:
            console.log(`ℹ️ Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    console.log('🎯 handleCheckoutSessionCompleted started');

    const email = session.customer_details?.email;
    const clientReferenceId = session.client_reference_id;
    const metadata = session.metadata;

    console.log('📧 Email:', email);
    console.log('🏷️ Metadata:', metadata);

    if (!email) {
        console.error('❌ No email found in session');
        return;
    }

    const plan = metadata?.plan || 'spark';
    console.log('📦 Plan:', plan);

    let userId: string | null = null;

    // Try to create user
    console.log('👤 Attempting to create user...');
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: { full_name: session.customer_details?.name }
    });

    if (createError) {
        console.log('⚠️ User creation error (might already exist):', createError.message);

        // Find the user ID by email manually? Or just upsert profile by email? 
        // Profiles table uses ID as PK. We need the ID.
        // Let's assume we can find them.
        // Since we can't efficiently search by email in Admin API V2 without specific config, 
        // a common trick is to query the 'profiles' table (if we have RLS off for service role) or 'auth.users' view.
        // But we can't query auth.users from client library easily.

        // WORKAROUND: In a real app, use `supabaseAdmin.from('profiles').select('id').eq('email', email)`
        // presuming profiles are synced.
        // IF profiles not synced, we have an issue.

        // Let's try to get profile by email
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (profile) {
            userId = profile.id;
        } else {
            // User exists in Auth but not in Profiles? Edge case.
            // We can try to sign in via API or just list users ?
            console.error('Could not find existing user ID for email', email);
            return; // Manual intervention needed
        }

    } else {
        userId = newUser.user.id;
        console.log('✅ Created new user with ID:', userId);

        // Send password reset email (acts as magic link for first login)
        console.log('📨 Attempting to send welcome email...');
        try {
            const { data: resetData, error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lexmo-saas-ai.vercel.app'}/auth/callback?next=/dashboard`
                }
            );

            if (resetError) {
                console.error('❌ Error sending reset email:', resetError);
            } else {
                console.log('✅ Reset/Welcome email sent successfully to:', email);
            }
        } catch (error) {
            console.error('❌ Failed to send welcome email:', error);
        }
    }

    if (userId) {
        // 2. Grant Access (Update Profile)
        console.log('💾 Updating profile for user:', userId);
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: userId,
                email: email,
                plan: plan,
                full_name: session.customer_details?.name,
                updated_at: new Date().toISOString()
            });

        if (updateError) {
            console.error('❌ Error updating profile:', updateError);
        } else {
            console.log(`✅ Successfully granted ${plan} access to ${email}`);
        }
    }

    console.log('🏁 handleCheckoutSessionCompleted completed');
}
