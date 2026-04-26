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
    // 49700 = 497€ = formation complète (plan: 'ecommerce')
    // 19700 = 197€ = formation sans accompagnement (plan: 'ecommerce_basic')
    // 9700  = 97€  = diagnostic (plan: 'diagnostic')
    const amountTotal = session.amount_total;
    const plan: string =
        amountTotal === 9700 ? 'diagnostic'
        : amountTotal === 19700 ? 'ecommerce_basic'
        : 'ecommerce';
    console.log('🔍 [STEP 3] amount_total:', amountTotal, '→ plan:', plan);

    // ===== STEP 4: SEND EMAIL FIRST (highest priority) =====
    // Email is sent BEFORE Supabase to ensure client always gets their registration email
    // even if the database operation fails (e.g. CHECK constraint issue)
    console.log('🔍 [STEP 4] === SENDING EMAIL (PRIORITY) ===');
    console.log('🔍 [STEP 4] RESEND_API_KEY defined:', !!process.env.RESEND_API_KEY);
    console.log('🔍 [STEP 4] RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'noreply@ecomy.ai (default)');
    console.log('🔍 [STEP 4] Sending to:', email, '| Plan:', plan);

    let emailSent = false;
    try {
        const result = await sendActivationEmail(email, plan);
        emailSent = true;
        console.log('✅ [STEP 4] Email sent successfully! Resend response:', JSON.stringify(result));
    } catch (emailError: any) {
        console.error('❌ [STEP 4] EMAIL SENDING FAILED!');
        console.error('❌ [STEP 4] Error message:', emailError?.message);
        console.error('❌ [STEP 4] Error name:', emailError?.name);
        console.error('❌ [STEP 4] Error statusCode:', emailError?.statusCode);
        console.error('❌ [STEP 4] Full error:', JSON.stringify(emailError, Object.getOwnPropertyNames(emailError)));
    }

    // ===== STEP 5: SUPABASE REGISTRATION (non-blocking) =====
    // Even if this fails, the webhook returns 200 so Stripe doesn't retry
    console.log('🔍 [STEP 5] === SUPABASE REGISTRATION ===');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let supabase: any = null;
    try {
        supabase = getSupabaseAdmin();
    } catch (err: any) {
        console.error('❌ [STEP 5] Supabase init FAILED:', err.message);
        console.log('⚠️ [STEP 5] Skipping DB registration. Email sent:', emailSent);
        return;
    }

    // Try to find user_id from auth.users by email
    let userId: string | null = null;
    try {
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const authUser = usersData?.users?.find((u: any) => u.email === email);
        userId = authUser?.id || null;
        console.log('🔍 [STEP 5] user_id from auth.users:', userId || '(not registered yet)');
    } catch (err: any) {
        console.log('⚠️ [STEP 5] Could not lookup user_id (non-blocking):', err?.message);
    }

    const { data: existing, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('id, status, plan')
        .eq('email', email)
        .single();

    console.log('🔍 [STEP 5] Existing record:', JSON.stringify(existing));
    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ [STEP 5] Fetch error:', JSON.stringify(fetchError));
    }

    // Helper: try upsert with a given plan value, fallback to 'spark' if constraint fails
    async function upsertSubscription(targetPlan: string): Promise<boolean> {
        if (existing) {
            const updateData: Record<string, any> = {
                status: 'active',
                activated_at: new Date().toISOString(),
                plan: targetPlan,
            };
            if (userId) updateData.user_id = userId;
            console.log('🔍 [STEP 5] Updating with plan:', targetPlan, JSON.stringify(updateData));

            const { error } = await supabase
                .from('user_subscriptions')
                .update(updateData)
                .eq('email', email);

            if (error) {
                console.error('❌ [STEP 5] Update error (plan=' + targetPlan + '):', JSON.stringify(error));
                return false;
            }
            console.log('✅ [STEP 5] Subscription updated for:', email, '(plan=' + targetPlan + ')');
            return true;
        } else {
            const insertData: Record<string, any> = {
                email,
                plan: targetPlan,
                status: 'active',
                activated_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
            };
            if (userId) insertData.user_id = userId;
            console.log('🔍 [STEP 5] Inserting with plan:', targetPlan, JSON.stringify(insertData));

            const { error } = await supabase
                .from('user_subscriptions')
                .insert(insertData);

            if (error) {
                console.error('❌ [STEP 5] Insert error (plan=' + targetPlan + '):', JSON.stringify(error));
                return false;
            }
            console.log('✅ [STEP 5] New subscription created for:', email, '(plan=' + targetPlan + ')');
            return true;
        }
    }

    const dbSuccess = await upsertSubscription(plan);

    if (!dbSuccess) {
        console.error('❌ [STEP 5] ALL DB attempts failed for:', email, '- Email sent:', emailSent);
    }

    console.log('✅ [DONE] handleCheckoutCompleted finished for:', email, '| emailSent:', emailSent, '| dbSuccess:', dbSuccess);

    // ===== STEP 6: INCREMENT PROMO COUNTER =====
    try {
        const promoSupabase = supabase || getSupabaseAdmin();
        const { data: stateRow } = await promoSupabase
            .from('live_dashboard_state')
            .select('data')
            .eq('id', 1)
            .single();

        const stateData = stateRow?.data || {};
        const settings = stateData.settings || {};

        if (settings.promo_active) {
            const currentTaken = (settings.promo_places_prises || 0) + 1;
            const totalPlaces = settings.promo_places_total || 12;

            const updatedSettings = { ...settings, promo_places_prises: currentTaken };

            // Auto-close if all places taken
            if (currentTaken >= totalPlaces) {
                updatedSettings.promo_active = false;
                updatedSettings.registrations_open = false;
                updatedSettings.registrations_closed_at = new Date().toISOString();
                console.log('🔒 [STEP 6] All promo places taken — auto-closing registrations');
            }

            await promoSupabase
                .from('live_dashboard_state')
                .update({ data: { ...stateData, settings: updatedSettings } })
                .eq('id', 1);

            console.log('✅ [STEP 6] Promo counter incremented:', currentTaken, '/', totalPlaces);
        }
    } catch (promoError: any) {
        console.error('⚠️ [STEP 6] Promo counter update failed (non-blocking):', promoError?.message);
    }
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
            // Log but NEVER return 500 — we don't want Stripe to retry and cause duplicate emails
            console.error('❌ [FATAL] handleCheckoutCompleted crashed:', error?.message || error);
            console.error('❌ [FATAL] Stack:', error?.stack);
        }
    } else {
        console.log('ℹ️ Event type ignored:', event.type);
    }

    // ALWAYS return 200 after successful signature verification
    // This prevents Stripe from retrying and causing duplicate operations
    console.log('✅ [DONE] Webhook processed at', new Date().toISOString());
    return NextResponse.json({ received: true });
}
