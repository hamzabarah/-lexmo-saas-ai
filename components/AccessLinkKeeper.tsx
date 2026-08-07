'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const ACCESS_TOKEN_STORAGE_KEY = 'ecomy_access_token';

/**
 * Propagation du token de lien d'accès.
 *
 * Sans cookie, une navigation ne transporte le token que si l'URL le porte. Or
 * les liens internes pointent vers /dashboard/... « nu » : sans réinjection, le
 * middleware ne verrait plus rien au premier clic.
 *
 * DEUX mécanismes, et le second est indispensable :
 *
 * 1. Réécriture des `href` — sert au clic milieu, au « ouvrir dans un nouvel
 *    onglet » et au « copier l'adresse du lien ».
 *
 * 2. Interception du clic — le <Link> de Next navigue avec le href de ses PROPS
 *    React, jamais avec l'attribut href du DOM. Réécrire l'attribut ne change
 *    donc rien à la navigation client : Next partait vers /dashboard/phases/N
 *    sans token, le middleware refusait, et l'élève revenait à son point de
 *    départ — un clic sans effet visible. On prend donc la main sur le clic
 *    avant React et on navigue nous-mêmes, token compris.
 *
 * La copie en sessionStorage n'est PAS une session : elle n'est jamais envoyée
 * au serveur (contrairement à un cookie) et ne sert qu'au filet de rattrapage
 * (cf. AccessLinkRecovery).
 *
 * Sans paramètre `access` dans l'URL, ce composant ne pose AUCUN écouteur et ne
 * fait strictement rien : la navigation des élèves connectés est intacte.
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

        const withToken = (href: string): string => {
            const url = new URL(href, window.location.origin);
            url.searchParams.set('access', token);
            return url.pathname + url.search + url.hash;
        };

        // ── 1. Réécriture des href (nouvel onglet, copier le lien) ──────────
        let frame = 0;

        const patchLinks = () => {
            const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="/dashboard"]');
            anchors.forEach((anchor) => {
                const href = anchor.getAttribute('href');
                if (!href || href.includes('access=')) return;
                anchor.setAttribute('href', withToken(href));
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

        // Les cartes de phases sont rendues après hydratation (la page affiche
        // d'abord un écran de chargement), d'où l'observation du DOM. On
        // n'observe que childList : nos propres réécritures d'attributs ne
        // relancent donc pas l'observateur.
        const observer = new MutationObserver(schedulePatch);
        observer.observe(document.body, { childList: true, subtree: true });

        // ── 2. Interception du clic, AVANT le routeur de Next ───────────────
        const onClick = (event: MouseEvent) => {
            if (event.defaultPrevented) return;
            // Clic gauche seul : on laisse passer Ctrl/Cmd/Shift-clic et clic
            // milieu, que le navigateur traite via le href déjà réécrit.
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const target = event.target;
            if (!(target instanceof Element)) return;

            const anchor = target.closest('a');
            if (!anchor) return;
            if (anchor.hasAttribute('download')) return;

            const anchorTarget = anchor.getAttribute('target');
            if (anchorTarget && anchorTarget !== '_self') return;

            const href = anchor.getAttribute('href');
            if (!href || !href.startsWith('/dashboard')) return;

            // On coupe la propagation en phase de capture : l'écouteur de React
            // est monté plus bas dans l'arbre, il ne verra jamais l'événement.
            event.preventDefault();
            event.stopPropagation();

            // Navigation complète plutôt que transition client : l'URL portant
            // le token est réellement demandée au serveur, donc validée par le
            // middleware à chaque fois.
            window.location.assign(withToken(href));
        };

        document.addEventListener('click', onClick, true);

        return () => {
            observer.disconnect();
            document.removeEventListener('click', onClick, true);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [pathname, searchParams]);

    return null;
}
