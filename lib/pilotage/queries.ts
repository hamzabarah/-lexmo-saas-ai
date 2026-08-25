// Accès aux données du module de pilotage.
//
// SERVEUR UNIQUEMENT : ce fichier lit la clé service-role, qui contourne RLS.
// Il ne doit jamais être importé depuis un composant client. L'appelant est
// responsable d'avoir vérifié la session administrateur AVANT d'appeler ces
// fonctions — elles ne contrôlent rien par elles-mêmes.

import { createClient } from '@supabase/supabase-js';
import {
    HORIZON_DAYS,
    REQUIRED_HORIZONS,
    type PendingReport,
    type PilotageAction,
    type PilotageActionWithReports,
    type PilotageMeasurement,
    type PilotageObjective,
    type PilotageObjectiveWithMeasurements,
    type PilotageReport,
} from './types';

function getAdmin() {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

/** Date au format YYYY-MM-DD, décalée de `offsetDays` par rapport à aujourd'hui. */
function isoDate(offsetDays = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
}

/** Nombre de jours entiers écoulés entre une date ISO et aujourd'hui. */
function daysSince(isoDay: string): number {
    const then = new Date(`${isoDay}T00:00:00Z`).getTime();
    const today = new Date(`${isoDate()}T00:00:00Z`).getTime();
    return Math.floor((today - then) / 86_400_000);
}

/**
 * Objectifs encore en cours, du plus urgent au plus lointain, avec leur
 * trajectoire complète : tous les relevés, du plus ancien au plus récent.
 *
 * Le tri des relevés est fait ici, en JavaScript, plutôt que délégué à
 * PostgREST : l'ordre d'une ressource imbriquée dépend de la version du client
 * Supabase, et la trajectoire d'un objectif se compte en dizaines de lignes.
 */
export async function getObjectives(): Promise<PilotageObjectiveWithMeasurements[]> {
    const { data, error } = await getAdmin()
        .from('pilotage_objectives')
        .select('*, pilotage_measurements(*)')
        .eq('status', 'active')
        .order('due_date', { ascending: true });

    if (error) throw new Error(`pilotage_objectives: ${error.message}`);

    type Row = PilotageObjective & { pilotage_measurements: PilotageMeasurement[] | null };

    return ((data ?? []) as Row[]).map(({ pilotage_measurements, ...objective }) => ({
        ...objective,
        measurements: (pilotage_measurements ?? [])
            .slice()
            .sort((a, b) => a.measured_at.localeCompare(b.measured_at)),
    }));
}

/** Actions des 90 derniers jours, les plus récentes d'abord, comptes rendus joints. */
export async function getActions(): Promise<PilotageActionWithReports[]> {
    const { data, error } = await getAdmin()
        .from('pilotage_actions')
        .select('*, pilotage_reports(*)')
        .gte('scheduled_date', isoDate(-90))
        .order('scheduled_date', { ascending: false });

    if (error) throw new Error(`pilotage_actions: ${error.message}`);

    type Row = PilotageAction & { pilotage_reports: PilotageReport[] | null };

    return ((data ?? []) as Row[]).map(({ pilotage_reports, ...action }) => ({
        ...action,
        reports: pilotage_reports ?? [],
    }));
}

/**
 * Comptes rendus attendus mais non saisis.
 *
 * Une action au statut « fait » doit être débriefée aux horizons prévus pour son
 * type (voir REQUIRED_HORIZONS). Un horizon est dû dès que le nombre de jours
 * écoulés depuis la date de l'action l'a atteint. Les actions au statut
 * « prévu », « débriefé » ou « abandonné » ne sont pas concernées.
 *
 * Trié du plus en retard au moins en retard : le haut de liste est ce qui a le
 * plus de chances de ne jamais être fait.
 */
export async function getPendingReports(): Promise<PendingReport[]> {
    const { data, error } = await getAdmin()
        .from('pilotage_actions')
        .select('*, pilotage_reports(horizon)')
        .eq('status', 'fait')
        .order('scheduled_date', { ascending: true });

    if (error) throw new Error(`pilotage_actions (pending): ${error.message}`);

    type Row = PilotageAction & { pilotage_reports: { horizon: string }[] | null };

    const pending: PendingReport[] = [];

    for (const row of (data ?? []) as Row[]) {
        const { pilotage_reports, ...action } = row;
        const done = new Set((pilotage_reports ?? []).map((r) => r.horizon));
        const elapsed = daysSince(action.scheduled_date);

        for (const horizon of REQUIRED_HORIZONS[action.type] ?? []) {
            const dueAfter = HORIZON_DAYS[horizon];
            if (elapsed < dueAfter) continue;
            if (done.has(horizon)) continue;

            pending.push({ action, horizon, daysOverdue: elapsed - dueAfter });
        }
    }

    return pending.sort((a, b) => b.daysOverdue - a.daysOverdue);
}
