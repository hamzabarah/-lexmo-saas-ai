// Lecture du token de lien d'accès CÔTÉ CLIENT.
//
// Le token est lu dans l'URL courante à chaque appel, jamais dans un cookie ni
// dans un stockage : l'URL reste la source de vérité, exactement comme côté
// middleware. Renvoie null pour un élève connecté normalement — les appels
// partent alors inchangés.

export function currentAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('access');
}

/** Ajoute `?access=…` à une URL d'API si — et seulement si — un token est présent. */
export function withAccessToken(url: string): string {
    const token = currentAccessToken();
    if (!token) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}access=${encodeURIComponent(token)}`;
}
