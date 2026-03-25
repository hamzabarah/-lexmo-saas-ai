import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendActivationEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔍 [SUPABASE] URL defined:', !!url, '| Key defined:', !!key);

    if (!url || !key) {
        throw new Error(`Missing Supabase config: URL=${!!url}, KEY=${!!key}`);
    }

    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log('🔍 [STEP 3] === EXTRACTING EMAIL ===');
    console.log('🔍 [STEP 3] Session ID:', session.id);
    console.log('🔍 [STEP 3] Payment status:', session.payment_status);
    console.log('🔍 [STEP 3] Amount total:', session.amount_total);

    const emailFromDetails = session.customer_details?.email;
    const emailFromSession = (session as any).customer_email;
    const emailFromMetadata = session.metadata?.email;
    const email = emailFromDetails || emailFromSession || emailFromMetadata;

    console.log('🔍 [STEP 3] customer_details.email:', emailFromDetails);
    console.log('🔍 [STEP 3] customer_email:', emailFromSession);
    console.log('🔍 [STEP 3] metadata.email:', emailFromMetadata);
    console.log('🔍 [STEP 3] Email final:', email);

    if (!email) {
        console.error('❌ [STEP 3] No email found in checkout session. Full session customer_details:', JSON.stringify(session.customer_details));
        return;
    }

    // Determine product type by amount
    // 19700 = 197€ = formation (plan: 'ecommerce')
    // 9700  = 97€  = diagnostic (plan: 'diagnostic')
    const amountTotal = session.amount_total;
    const plan: string = amountTotal === 9700 ? 'diagnostic' : 'ecommerce';
    console.log('🔍 [STEP 3] amount_total:', amountTotal, '→ plan:', plan);

    console.log('🔍 [STEP 3.5] === SUPABASE INIT ===');
    let supabase;
    try {
        supabase = getSupabaseAdmin();
    } catch (err: any) {
        console.error('❌ [STEP 3.5] Supabase init FAILED:', err.message);
        throw err;
    }

    // Try to find user_id from auth.users by email
    let userId: string | null = null;
    try {
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const authUser = usersData?.users?.find(u => u.email === email);
        userId = authUser?.id || null;
        console.log('🔍 [STEP 3.5] user_id from auth.users:', userId || '(not registered yet)');
    } catch (err: any) {
        console.log('⚠️ [STEP 3.5] Could not lookup user_id (non-blocking):', err?.message);
    }

    console.log('🔍 [STEP 4] === SUPABASE UPSERT ===');

    const { data: existing, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('id, status, plan')
        .eq('email', email)
        .single();

    console.log('🔍 [STEP 4] Existing record:', JSON.stringify(existing));
    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ [STEP 4] Fetch error:', JSON.stringify(fetchError));
    }

    if (existing) {
        const updateData: Record<string, any> = {
            status: 'active',
            activated_at: new Date().toISOString(),
            plan,
        };
        if (userId) updateData.user_id = userId;

        console.log('🔍 [STEP 4] Updating existing record with:', JSON.stringify(updateData));

        const { error } = await supabase
            .from('user_subscriptions')
            .update(updateData)
            .eq('email', email);

        if (error) {
            console.error('❌ [STEP 4] Error updating subscription:', JSON.stringify(error));
            throw error;
        }
        console.log('✅ [STEP 4] Subscription updated for:', email);
    } else {
        const insertData: Record<string, any> = {
            email,
            plan,
            status: 'active',
            activated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
        };
        if (userId) insertData.user_id = userId;

        console.log('🔍 [STEP 4] Inserting new record:', JSON.stringify(insertData));

        const { error } = await supabase
            .from('user_subscriptions')
            .insert(insertData);

        if (error) {
            console.error('❌ [STEP 4] Error creating subscription:', JSON.stringify(error));
            throw error;
        }
        console.log('✅ [STEP 4] New subscription created for:', email);
    }

    console.log('🔍 [STEP 5] === SENDING EMAIL ===');
    console.log('🔍 [STEP 5] RESEND_API_KEY defined:', !!process.env.RESEND_API_KEY);
    console.log('🔍 [STEP 5] RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'noreply@lexmo.ai (default)');
    console.log('🔍 [STEP 5] Sending to:', email, '| Plan:', plan);

    try {
        const result = await sendActivationEmail(email, plan);
        console.log('✅ [STEP 5] Email sent successfully! Resend response:', JSON.stringify(result));
    } catch (emailError: any) {
        console.error('❌ [STEP 5] EMAIL SENDING FAILED!');
        console.error('❌ [STEP 5] Error message:', emailError?.message);
        console.error('❌ [STEP 5] Error details:', JSON.stringify(emailError));
    }

    console.log('✅ [DONE] handleCheckoutCompleted finished for:', email);
}

export async function POST(req: NextRequest) {
    const timestamp = new Date().toISOString();
    console.log('========================================');
    console.log('🔍 [STEP 1] WEBHOOK RECEIVED at', timestamp);
    console.log('🔍 [STEP 1] STRIPE_WEBHOOK_SECRET defined:', !!process.env.STRIPE_WEBHOOK_SECRET);
    console.log('🔍 [STEP 1] STRIPE_SECRET_KEY defined:', !!process.env.STRIPE_SECRET_KEY);
    console.log('🔍 [STEP 1] RESEND_API_KEY defined:', !!process.env.RESEND_API_KEY);
    console.log('🔍 [STEP 1] SUPABASE_URL defined:', !!process.env.SUPABASE_URL);
    console.log('🔍 [STEP 1] NEXT_PUBLIC_SUPABASE_URL defined:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('========================================');

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-12-15.clover',
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    if (!webhookSecret) {
        console.error('❌ [STEP 1] STRIPE_WEBHOOK_SECRET is not set!');
        return NextResponse.json(
            { error: 'Stripe webhook secret is not set' },
            { status: 500 }
        );
    }

    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');

    console.log('🔍 [STEP 1] Payload length:', payload.length, '| Signature present:', !!signature);

    if (!signature) {
        console.error('❌ [STEP 1] Missing stripe-signature header');
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
        console.error('❌ [STEP 2] Signature verification FAILED:', err.message);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    console.log('✅ [STEP 2] Signature verified - Event:', event.type, '- ID:', event.id);

    if (event.type === 'checkout.session.completed') {
        try {
            await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        } catch (error: any) {
            console.error('❌ [FATAL] handleCheckoutCompleted crashed:', error?.message || error);
            console.error('❌ [FATAL] Stack:', error?.stack);
            return NextResponse.json(
                { error: 'Webhook handler failed' },
                { status: 500 }
            );
        }
    } else {
        console.log('ℹ️ Event type ignored:', event.type);
    }

    console.log('✅ [DONE] Webhook processed successfully at', new Date().toISOString());
    return NextResponse.json({ received: true });
}
