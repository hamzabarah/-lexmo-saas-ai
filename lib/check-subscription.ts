import { withAccessToken } from './access-token-client';

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
    // Marqueurs de diagnostic (présents même quand hasAccess=false) : servent
    // à identifier compte + déploiement + projet Supabase sur une capture.
    email?: string | null;
    build?: string;
    env?: string;
    supabaseRef?: string;
    // Renseigné uniquement quand l'accès vient d'un lien d'accès (pas d'une session).
    accessLabel?: string;
}

/**
 * Check if the current user has an active subscription
 * Calls server API route that uses service role to bypass RLS
 */
export async function checkUserSubscription(): Promise<SubscriptionCheckResult> {
    try {
        // Le token voyage dans l'URL de l'appel, pas dans un en-tête ni un
        // cookie : même source de vérité que côté middleware.
        const res = await fetch(withAccessToken('/api/check-subscription'), {
            credentials: 'include',
            cache: 'no-store',
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
