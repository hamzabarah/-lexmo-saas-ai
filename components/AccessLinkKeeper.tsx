'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const ACCESS_TOKEN_STORAGE_KEY = 'ecomy_access_token';

/**
 * Propagation du token de lien d'accès.
 *
 * Sans cookie, une navigation de premier niveau ne transporte le token que si
 * l'URL le porte. Or les liens internes pointent vers /dashboard/... « nu » :
 * au premier clic, le middleware ne verrait plus rien et renverrait l'élève
 * vers /login. Ce composant réécrit donc les liens internes pour qu'ils
 * conservent le paramètre.
 *
 * La copie en sessionStorage n'est PAS une session : elle n'est jamais envoyée
 * au serveur (contrairement à un cookie) et sert uniquement à reconstruire
 * l'URL si un lien nous échappe — cf. AccessLinkRecovery.
 *
 * Sans paramètre `access` dans l'URL, ce composant ne fait strictement rien :
 * la navigation des élèves connectés est inchangée.
 */
export default function AccessLinkKeeper() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('access');

        if (token) {
            try {
                sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
            } catch {
                // Stockage indisponible (navigation privée stricte) : sans
                // gravité, seul le filet de rattrapage est perdu.
            }
        }

        if (!token) return;

        let frame = 0;

        const patchLinks = () => {
            const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="/dashboard"]');
            anchors.forEach((anchor) => {
                const href = anchor.getAttribute('href');
                if (!href || href.includes('access=')) return;
                const separator = href.includes('?') ? '&' : '?';
                anchor.setAttribute('href', `${href}${separator}access=${encodeURIComponent(token)}`);
            });
        };

        const schedulePatch = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                patchLinks();
            });
        };

        patchLinks();

        // Les cartes de phases sont rendues après coup : on suit les ajouts au
        // DOM. On n'observe que childList, pas les attributs — sinon nos
        // propres réécritures relanceraient l'observateur en boucle.
        const observer = new MutationObserver(schedulePatch);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
        };
    }, [pathname, searchParams]);

    return null;
}
