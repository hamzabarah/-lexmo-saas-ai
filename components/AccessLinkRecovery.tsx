'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ACCESS_TOKEN_STORAGE_KEY } from './AccessLinkKeeper';

/**
 * Filet de rattrapage, monté sur /login.
 *
 * Si un lien interne échappait à la propagation, l'élève atterrirait ici sans
 * comprendre pourquoi. On regarde alors s'il détient un token mémorisé et on le
 * renvoie dans la formation.
 *
 * Strictement additif : pour un élève normal, sessionStorage est vide, donc la
 * page de connexion se comporte exactement comme avant.
 *
 * `?access=denied` est posé par le middleware quand un token a été présenté et
 * refusé (expiré ou désactivé). C'est le garde-fou anti-boucle : on efface le
 * token mémorisé au lieu de le rejouer indéfiniment.
 */
export default function AccessLinkRecovery() {
    const searchParams = useSearchParams();

    useEffect(() => {
        try {
            if (searchParams.get('access') === 'denied') {
                sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
                return;
            }

            const token = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
            if (!token) return;

            // On ne rebondit que si l'élève a été REJETÉ depuis /dashboard.
            // Sans ce garde-fou, quelqu'un ayant ouvert un lien d'accès dans cet
            // onglet ne pourrait plus atteindre la page de connexion pour se
            // connecter normalement : il serait renvoyé dans la formation.
            const from = document.referrer;
            if (!from) return;

            let cameFromDashboard = false;
            try {
                const url = new URL(from);
                cameFromDashboard =
                    url.origin === window.location.origin && url.pathname.startsWith('/dashboard');
            } catch {
                return;
            }
            if (!cameFromDashboard) return;

            window.location.replace(`/dashboard/phases?access=${encodeURIComponent(token)}`);
        } catch {
            // Stockage indisponible : on laisse la page de connexion normale.
        }
    }, [searchParams]);

    return null;
}
