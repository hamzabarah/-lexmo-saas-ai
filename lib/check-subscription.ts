import { createClient } from '@/utils/supabase/client';

export interface SubscriptionData {
    id: string;
    user_id: string;
    email: string;
    plan: string;
    status: string;
    activated_at: string | null;
    created_at: string;
}

export interface SubscriptionCheckResult {
    hasAccess: boolean;
    subscription: SubscriptionData | null;
}

/**
 * Check if the current user has an active subscription
 * @returns Object with hasAccess boolean and subscription data
 */
export async function checkUserSubscription(): Promise<SubscriptionCheckResult> {
    const supabase = createClient();

    try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return { hasAccess: false, subscription: null };
        }

        // Admin Bypass
        if (user.email === 'academyfrance75@gmail.com') {
            return {
                hasAccess: true,
                subscription: {
                    id: 'admin-override',
                    user_id: user.id,
                    email: user.email!,
                    plan: 'legend',
                    status: 'active',
                    activated_at: new Date().toISOString(),
                    created_at: new Date().toISOString()
                }
            };
        }

        // Query user_subscriptions table
        const { data: subscription, error: subscriptionError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

        if (subscriptionError || !subscription) {
            return { hasAccess: false, subscription: null };
        }

        // User has an active subscription
        return {
            hasAccess: true,
            subscription: subscription as SubscriptionData
        };
    } catch (error) {
        console.error('Error checking subscription:', error);
        return { hasAccess: false, subscription: null };
    }
}
