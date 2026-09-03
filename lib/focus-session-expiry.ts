/**
 * Auto-expiration des sessions focus, côté serveur, sans cron.
 *
 * Une session reste « running » tant que personne ne la clôture. Si l'onglet
 * est fermé, plus rien ne la termine : elle bloque indéfiniment le démarrage
 * d'une nouvelle session (lib/focus/server.ts → startSession).
 *
 * Le rattrapage se fait donc à la lecture : chaque point d'entrée du module
 * focus appelle closeExpiredSessions() avant de travailler, si bien qu'aucun
 * appelant ne peut observer une session périmée encore ouverte.
 */
import { createClient } from '@supabase/supabase-js';

/** Note ajoutée aux sessions clôturées automatiquement. */
export const AUTO_CLOSE_NOTE = 'clôture automatique — durée prévue écoulée';

/** Statuts considérés comme « session ouverte ». */
const OPEN_STATUSES = ['running', 'paused'] as const;

function getAdmin() {
    return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

type OpenRow = {
    id: string;
    started_at: string;
    planned_duration_minutes: number | null;
    notes: string | null;
};

/**
 * Clôture toutes les sessions ouvertes de `userId` dont la durée prévue est
 * écoulée.
 *
 * La durée enregistrée est **plafonnée à la durée prévue**, jamais le temps
 * réel écoulé : `ended_at` vaut `started_at + planned_duration_minutes`. Le
 * reste du code mesure le travail par `ended_at − started_at − paused_seconds`,
 * donc une session oubliée pendant trois jours compte pour sa durée prévue et
 * non pour 4 320 minutes.
 *
 * Ne lève jamais : ce balayage est un filet de sécurité, il ne doit pas faire
 * échouer la requête qui l'a déclenché. En cas d'erreur, on journalise et on
 * renvoie 0.
 *
 * @returns le nombre de sessions effectivement clôturées.
 */
export async function closeExpiredSessions(userId: string): Promise<number> {
    if (!userId) return 0;

    try {
        const admin = getAdmin();

        // PostgREST ne sait pas comparer deux colonnes entre elles
        // (started_at + planned × 1 min ≤ now()) : on lit les sessions
        // ouvertes — il y en a au plus une poignée — et on filtre ici.
        const { data, error } = await admin
            .from('focus_sessions')
            .select('id, started_at, planned_duration_minutes, notes')
            .eq('user_id', userId)
            .in('status', OPEN_STATUSES as unknown as string[]);

        if (error) {
            console.error('[focus-expiry] lecture des sessions ouvertes :', error.message);
            return 0;
        }

        const now = Date.now();
        let closed = 0;

        for (const row of (data ?? []) as OpenRow[]) {
            const planned = row.planned_duration_minutes ?? 0;
            if (planned <= 0) continue;

            const startedAt = new Date(row.started_at).getTime();
            if (!Number.isFinite(startedAt)) continue;

            const expiresAt = startedAt + planned * 60_000;
            if (expiresAt > now) continue;

            const notes = row.notes?.trim()
                ? `${row.notes.trim()}\n${AUTO_CLOSE_NOTE}`
                : AUTO_CLOSE_NOTE;

            // Le filtre de statut est répété dans l'UPDATE : si l'utilisateur
            // vient de clôturer la session lui-même, la ligne ne correspond
            // plus et on ne réécrit pas par-dessus sa saisie.
            const { error: updateError } = await admin
                .from('focus_sessions')
                .update({
                    status: 'completed',
                    ended_at: new Date(expiresAt).toISOString(),
                    notes,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', row.id)
                .in('status', OPEN_STATUSES as unknown as string[]);

            if (updateError) {
                console.error(`[focus-expiry] cloture de ${row.id} :`, updateError.message);
                continue;
            }
            closed += 1;
        }

        if (closed > 0) {
            console.log(`[focus-expiry] ${closed} session(s) cloturee(s) automatiquement.`);
        }
        return closed;
    } catch (e) {
        console.error('[focus-expiry] echec inattendu :', e);
        return 0;
    }
}
