import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabaseAdmin from '@/lib/supabaseAdmin';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const sig = (await headers()).get('stripe-signature') as string;

    // Lazy initialization of Stripe to avoid build-time errors
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        console.error('Missing STRIPE_SECRET_KEY');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey, {
        apiVersion: '2025-01-27.acacia' as any,
    });

    let event: Stripe.Event;

    try {
        if (!endpointSecret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutSessionCompleted(session);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const email = session.customer_details?.email;
    const clientReferenceId = session.client_reference_id; // Could be affiliate ID
    const metadata = session.metadata; // Expecting { plan: 'spark' | 'emperor' | 'legend' }

    if (!email) {
        console.error('No email found in session');
        return;
    }

    const plan = metadata?.plan || 'spark'; // Default to spark if missing

    // 1. Check if user exists
    const { data: { users }, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
    // Note: listUsers isn't efficient for lookup by email but standard 'getUserByEmail' doesn't exist in admin API directly in same way. 
    // Actually, supabaseAdmin.auth.admin.listUsers() is paginated.
    // Better: Try to create, catch error if exists.

    let userId: string | null = null;

    // Try to create user
    // We set email_confirm: true so they can login immediately (if we send them a magic link or they reset password)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: { full_name: session.customer_details?.name }
    });

    if (createError) {
        // User likely exists
        console.log('User might already exist:', createError.message);

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
        console.log('Created new user:', userId);

        // Send Magic Link email for first-time login
        try {
            const { data: magicLinkData, error: magicLinkError } = await supabaseAdmin.auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lexmo-saas-ai.vercel.app'}/auth/callback?next=/dashboard`
                }
            });

            if (magicLinkError) {
                console.error('Error sending magic link:', magicLinkError);
            } else {
                console.log('Magic link email sent to:', email);
            }
        } catch (error) {
            console.error('Failed to send magic link:', error);
        }
    }

    if (userId) {
        // 2. Grant Access (Update Profile)
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
            console.error('Error updating profile:', updateError);
        } else {
            console.log(`Successfully granted ${plan} access to ${email}`);
        }
    }
}
