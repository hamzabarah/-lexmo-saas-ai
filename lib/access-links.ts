// Liens d'accès — helpers partagés entre le middleware (runtime EDGE) et les
// routes API. Tout ici doit rester compatible edge : pas de module `crypto` de
// Node, pas de supabase-js, uniquement fetch() et Web Crypto.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Le token n'est jamais interpolé ailleurs que dans une query string, mais on
// le valide en amont : ça évite un aller-retour réseau sur des valeurs bidon.
const TOKEN_RE = /^[A-Za-z0-9_-]{20,64}$/;

export interface AccessLink {
    id: string;
    label: string;
}

/**
 * Périmètre d'un lien d'accès : la formation, et RIEN d'autre.
 * Liste blanche volontaire — toute page ajoutée plus tard est hors de portée
 * d'un lien tant qu'elle n'est pas explicitement autorisée ici.
 */
export function isAccessLinkPathAllowed(pathname: string): boolean {
    return pathname === '/dashboard/phases' || pathname.startsWith('/dashboard/phases/');
}

/** Token opaque de 32 octets, en base64url (43 caractères). */
export function generateAccessToken(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function restHeaders(): Record<string, string> {
    return {
        apikey: SERVICE_KEY!,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
    };
}

/**
 * Vérifie un token contre la base. AUCUN cache : c'est ce qui rend la
 * désactivation immédiate, sans redéploiement.
 * Renvoie null si le token est inconnu, désactivé ou expiré.
 */
export async function findValidAccessLink(token: string): Promise<AccessLink | null> {
    if (!TOKEN_RE.test(token)) return null;

    if (!SUPABASE_URL || !SERVICE_KEY) {
        console.error('[access-link] configuration manquante (URL ou service role key)');
        return null;
    }

    try {
        const url =
            `${SUPABASE_URL}/rest/v1/access_links` +
            `?token=eq.${encodeURIComponent(token)}` +
            `&is_active=eq.true` +
            `&select=id,label,expires_at&limit=1`;

        const res = await fetch(url, { headers: restHeaders(), cache: 'no-store' });
        if (!res.ok) {
            console.error(`[access-link] lookup HTTP ${res.status}`);
            return null;
        }

        const rows = (await res.json()) as { id: string; label: string; expires_at: string }[];
        const row = rows?.[0];
        if (!row) return null;

        if (new Date(row.expires_at).getTime() <= Date.now()) return null;

        return { id: row.id, label: row.label };
    } catch (error) {
        // Une panne réseau ne doit pas laisser passer : on refuse par défaut.
        console.error('[access-link] lookup échoué', error);
        return null;
    }
}

/**
 * Incrémente le compteur et journalise l'usage (date, IP, user-agent, chemin).
 * À appeler dans un waitUntil : ne doit jamais retarder la réponse, ni la faire
 * échouer si la base ne répond pas.
 */
export async function recordAccessLinkUse(
    token: string,
    ip: string,
    userAgent: string,
    path: string
): Promise<void> {
    if (!SUPABASE_URL || !SERVICE_KEY) return;

    try {
        await fetch(`${SUPABASE_URL}/rest/v1/rpc/record_access_link_use`, {
            method: 'POST',
            headers: restHeaders(),
            body: JSON.stringify({
                p_token: token,
                p_ip: ip,
                p_user_agent: userAgent,
                p_path: path,
            }),
        });
    } catch (error) {
        console.error('[access-link] journalisation échouée', error);
    }
}

export function getClientIp(headers: Headers): string {
    const forwarded = headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return headers.get('x-real-ip') ?? 'unknown';
}
