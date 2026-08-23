import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { findValidAccessLink } from '@/lib/access-links';
import { ADMIN_EMAIL } from '@/lib/admin-auth';

/**
 * Décide, CÔTÉ SERVEUR, si l'appelant a droit au contenu de la formation.
 *
 * Reprend les trois règles de /api/check-subscription, dans le même ordre :
 *   1. l'administrateur passe toujours ;
 *   2. une session avec un abonnement `active` passe ;
 *   3. sans session, un lien d'accès valide passe — c'est ce qui préserve les
 *      porteurs de lien, qui n'ont ni compte ni cookie.
 *
 * À utiliser dans un Server Component pour bloquer AVANT le rendu : un contrôle
 * côté client laisse le contenu partir dans le HTML, puis le masque seulement à
 * l'affichage.
 */
export async function hasFormationAccess(accessToken?: string | null): Promise<boolean> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            if (user.email === ADMIN_EMAIL) return true;

            const admin = createAdminClient(
                process.env.SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );

            const { data: subscription } = await admin
                .from('user_subscriptions')
                .select('id')
                .eq('email', user.email!)
                .eq('status', 'active')
                .maybeSingle();

            return Boolean(subscription);
        }

        // Pas de session : le lien d'accès reste recevable.
        if (accessToken) {
            const link = await findValidAccessLink(accessToken);
            if (link) return true;
        }

        return false;
    } catch (error) {
        // Une panne ne doit pas ouvrir l'accès : on refuse par défaut.
        console.error('[server-access] échec du contrôle', error);
        return false;
    }
}
