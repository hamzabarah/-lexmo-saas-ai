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
    isAdmin?: boolean;
    subscription: SubscriptionData | null;
}

/**
 * Check if the current user has an active subscription
 * Calls server API route that uses service role to bypass RLS
 */
export async function checkUserSubscription(): Promise<SubscriptionCheckResult> {
    try {
        const res = await fetch('/api/check-subscription', {
            credentials: 'include',
        });

        if (!res.ok) {
            return { hasAccess: false, subscription: null };
        }

        const data = await res.json();
        return data as SubscriptionCheckResult;
    } catch (error) {
        console.error('Error checking subscription:', error);
        return { hasAccess: false, subscription: null };
    }
}
