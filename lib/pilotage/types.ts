// Types du module de pilotage. Miroir de supabase/migrations/20260823_pilotage_system.sql.

export type PilotageLever = 'trafic' | 'clic' | 'conversion' | 'panier';
export type PilotageObjectiveStatus = 'active' | 'atteint' | 'manque' | 'abandonne';
export type PilotageActionType = 'contenu' | 'live' | 'lancement' | 'produit';
export type PilotageActionStatus = 'prevu' | 'fait' | 'debriefe' | 'abandonne';
export type PilotageHorizon = 'J+1' | 'J+7' | 'J+14' | 'J+30' | 'J+90';
export type PilotageDecision = 'refaire' | 'ajuster' | 'arreter';

export interface PilotageObjective {
    id: string;
    title: string;
    lever: PilotageLever;
    baseline_value: number | null;
    target_value: number;
    unit: string;
    source_of_truth: string;
    due_date: string;
    status: PilotageObjectiveStatus;
    created_at: string;
}

/** Un relevé ponctuel de la valeur d'un objectif. La suite des relevés forme sa trajectoire. */
export interface PilotageMeasurement {
    id: string;
    objective_id: string;
    measured_at: string;
    value: number;
    note: string | null;
    created_at: string;
}

/** Un objectif avec sa trajectoire, du relevé le plus ancien au plus récent. */
export interface PilotageObjectiveWithMeasurements extends PilotageObjective {
    measurements: PilotageMeasurement[];
}

export interface PilotageAction {
    id: string;
    ref: string;
    objective_id: string | null;
    title: string;
    type: PilotageActionType;
    hypothesis: string;
    planned_hours: number | null;
    expected_revenue: number | null;
    stripe_link_ref: string | null;
    scheduled_date: string;
    status: PilotageActionStatus;
    created_at: string;
}

export interface PilotageReport {
    id: string;
    action_id: string;
    horizon: PilotageHorizon;
    reported_at: string;
    reach: number | null;
    clicks: number | null;
    sales_497: number;
    sales_197: number;
    sales_97: number;
    actual_hours: number | null;
    cause: string | null;
    decision: PilotageDecision | null;
    adjustment: string | null;
    next_action: string | null;
    next_action_date: string | null;
    created_at: string;
}

/** Une action avec les comptes rendus qui lui sont rattachés. */
export interface PilotageActionWithReports extends PilotageAction {
    reports: PilotageReport[];
}

/** Un compte rendu attendu mais pas encore saisi. */
export interface PendingReport {
    action: PilotageAction;
    horizon: PilotageHorizon;
    /** Nombre de jours écoulés depuis la date à laquelle ce compte rendu était dû. */
    daysOverdue: number;
}

/** Les trois paliers de prix du catalogue, en euros. */
export const PRICES = { p497: 497, p197: 197, p97: 97 } as const;

/** Traduction d'un horizon en nombre de jours après la date de l'action. */
export const HORIZON_DAYS: Record<PilotageHorizon, number> = {
    'J+1': 1,
    'J+7': 7,
    'J+14': 14,
    'J+30': 30,
    'J+90': 90,
};

/**
 * Quels comptes rendus sont attendus selon le type d'action.
 *
 * Un live ou un lancement se juge vite : on regarde le lendemain, puis à une
 * semaine. Un contenu met du temps à produire ses effets (référencement,
 * diffusion), d'où des horizons longs. Un produit se mesure à deux semaines.
 */
export const REQUIRED_HORIZONS: Record<PilotageActionType, PilotageHorizon[]> = {
    live: ['J+1', 'J+7'],
    lancement: ['J+1', 'J+7'],
    contenu: ['J+30', 'J+90'],
    produit: ['J+14'],
};

export const LEVER_LABELS: Record<PilotageLever, string> = {
    trafic: 'Trafic',
    clic: 'Clic',
    conversion: 'Conversion',
    panier: 'Panier',
};

export const ACTION_TYPE_LABELS: Record<PilotageActionType, string> = {
    contenu: 'Contenu',
    live: 'Live',
    lancement: 'Lancement',
    produit: 'Produit',
};

export const ACTION_STATUS_LABELS: Record<PilotageActionStatus, string> = {
    prevu: 'Prévu',
    fait: 'Fait',
    debriefe: 'Débriefé',
    abandonne: 'Abandonné',
};

/** Chiffre d'affaires réellement encaissé sur un compte rendu, en euros. */
export function computeRevenue(
    report: Pick<PilotageReport, 'sales_497' | 'sales_197' | 'sales_97'>
): number {
    return (
        report.sales_497 * PRICES.p497 +
        report.sales_197 * PRICES.p197 +
        report.sales_97 * PRICES.p97
    );
}

/**
 * Chiffre d'affaires par heure investie.
 * Renvoie null si le temps passé est absent ou nul : diviser par zéro
 * donnerait l'illusion d'un rendement infini.
 */
export function computeYield(revenue: number, actualHours: number | null | undefined): number | null {
    if (actualHours === null || actualHours === undefined || actualHours === 0) return null;
    return revenue / actualHours;
}

/**
 * Où en est un objectif, en pourcentage du chemin parcouru entre son point de
 * départ et sa cible.
 *
 * La formule (courant - départ) / (cible - départ) fonctionne dans les deux
 * sens : pour un objectif à la hausse comme pour un objectif à la baisse (faire
 * descendre un coût), numérateur et dénominateur changent de signe ensemble.
 *
 * Renvoie null quand l'atteinte n'a pas de sens : aucun relevé, ou cible
 * confondue avec le point de départ. Le résultat n'est pas borné — un objectif
 * dépassé rend plus de 100.
 */
export function computeAttainment(
    baseline: number | null,
    current: number | null,
    target: number
): number | null {
    if (current === null || current === undefined) return null;
    const start = baseline ?? 0;
    if (target === start) return null;
    return ((current - start) / (target - start)) * 100;
}

/**
 * Point de départ retenu pour le calcul d'atteinte : la valeur de référence
 * saisie sur l'objectif si elle existe, sinon le tout premier relevé.
 */
export function resolveBaseline(
    objective: Pick<PilotageObjective, 'baseline_value'>,
    measurements: PilotageMeasurement[]
): number | null {
    if (objective.baseline_value !== null && objective.baseline_value !== undefined) {
        return objective.baseline_value;
    }
    return measurements.length > 0 ? measurements[0].value : null;
}

/** Dernier relevé en date, ou null si la trajectoire est vide. */
export function latestMeasurement(measurements: PilotageMeasurement[]): PilotageMeasurement | null {
    return measurements.length > 0 ? measurements[measurements.length - 1] : null;
}

/** Nombre total de ventes, tous paliers confondus. */
export function computeSalesCount(
    report: Pick<PilotageReport, 'sales_497' | 'sales_197' | 'sales_97'>
): number {
    return report.sales_497 + report.sales_197 + report.sales_97;
}
