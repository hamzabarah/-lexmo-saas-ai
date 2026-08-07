import { createClient } from '@/utils/supabase/server';
import type { User } from '@supabase/supabase-js';

export const ADMIN_EMAIL = 'academyfrance75@gmail.com';

/**
 * Contrôle admin côté serveur, à partir de la SESSION.
 *
 * À utiliser systématiquement dans les routes /api/admin/*. Ne jamais se fier à
 * un email transmis dans le corps ou les en-têtes de la requête : ce sont des
 * valeurs choisies par l'appelant, donc aucune preuve d'identité.
 *
 * Renvoie l'utilisateur admin, ou null (l'appelant répond alors 401/403).
 */
export async function requireAdmin(): Promise<User | null> {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user || user.email !== ADMIN_EMAIL) return null;
        return user;
    } catch {
        return null;
    }
}
