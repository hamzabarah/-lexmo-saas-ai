import { cookies } from 'next/headers';
import {
    Lock,
    AlertTriangle,
    Target,
    ListChecks,
    Euro,
    ShoppingCart,
    Clock,
    Gauge,
    CheckCircle2,
    FileWarning,
    TrendingUp,
} from 'lucide-react';
import { requireAdmin } from '@/lib/admin-auth';
import { getActions, getObjectives, getPendingReports } from '@/lib/pilotage/queries';
import {
    ACTION_STATUS_LABELS,
    ACTION_TYPE_LABELS,
    LEVER_LABELS,
    computeAttainment,
    computeRevenue,
    computeSalesCount,
    computeYield,
    latestMeasurement,
    resolveBaseline,
    type PilotageActionWithReports,
    type PilotageReport,
} from '@/lib/pilotage/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ─────────────────────────── helpers de présentation ───────────────────────────

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

function formatDate(iso: string): string {
    return new Date(`${iso}T00:00:00Z`).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

/** Lundi de la semaine en cours, au format YYYY-MM-DD. */
function startOfWeek(): string {
    const d = new Date();
    const day = (d.getDay() + 6) % 7; // 0 = lundi
    d.setDate(d.getDate() - day);
    return d.toISOString().slice(0, 10);
}

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

function daysUntil(iso: string): number {
    const then = new Date(`${iso}T00:00:00Z`).getTime();
    const today = new Date(`${todayIso()}T00:00:00Z`).getTime();
    return Math.round((then - today) / 86_400_000);
}

// ──────────────────────────────── composants ────────────────────────────────

function StatCard({
    icon: Icon,
    label,
    value,
    hint,
    alert = false,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    hint?: string;
    alert?: boolean;
}) {
    return (
        <div
            className={`bg-[#111111] border rounded-2xl p-5 ${
                alert ? 'border-red-500/30' : 'border-[#C5A04E]/10'
            }`}
        >
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${alert ? 'text-red-400' : 'text-[#C5A04E]'}`} />
                <span className="text-xs uppercase tracking-wider text-gray-500">{label}</span>
            </div>
            <div className={`text-2xl font-bold ${alert ? 'text-red-400' : 'text-white'}`}>{value}</div>
            {hint && <div className="text-xs text-gray-600 mt-1">{hint}</div>}
        </div>
    );
}

function SectionTitle({
    icon: Icon,
    children,
    accent = false,
}: {
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    accent?: boolean;
}) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <Icon className={`w-5 h-5 ${accent ? 'text-red-400' : 'text-[#C5A04E]'}`} />
            <h2 className="text-xl font-bold text-white">{children}</h2>
        </div>
    );
}

/**
 * Courbe de trajectoire, en SVG rendu cote serveur : aucune dependance, aucun
 * JavaScript envoye au navigateur. L'echelle verticale s'adapte aux valeurs
 * relevees, l'allure compte plus que la valeur absolue.
 */
function Sparkline({ values }: { values: number[] }) {
    const width = 240;
    const height = 40;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const step = width / (values.length - 1);

    const points = values
        .map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / span) * height).toFixed(1)}`)
        .join(' ');

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-10"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <polyline
                points={points}
                fill="none"
                stroke="#C5A04E"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

function EmptyState({ children }: { children: React.ReactNode }) {
    return <div className="text-center text-gray-600 py-10 text-sm">{children}</div>;
}

// ────────────────────────────────── page ──────────────────────────────────

export default async function PilotagePage() {
    // Rend la page dynamique et non mise en cache.
    await cookies();

    // Contrôle AVANT toute lecture : cette page est un Server Component, un
    // non-administrateur ne doit recevoir aucun chiffre dans le HTML, même
    // masqué ensuite à l'affichage.
    const admin = await requireAdmin();

    if (!admin) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-12 max-w-lg text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">الوصول مقيد</h2>
                    <p className="text-gray-400">هذه الصفحة محجوزة للمسؤول</p>
                </div>
            </div>
        );
    }

    const [objectives, actions, pending] = await Promise.all([
        getObjectives(),
        getActions(),
        getPendingReports(),
    ]);

    // ── Bloc a : semaine en cours ──
    // Les chiffres sont dérivés des comptes rendus rattachés aux actions des 90
    // derniers jours. Un compte rendu tardif sur une action plus ancienne que
    // 90 jours n'y figure donc pas.
    const weekStart = startOfWeek();
    const weekReports: PilotageReport[] = actions
        .flatMap((a) => a.reports)
        .filter((r) => r.reported_at >= weekStart && r.reported_at <= todayIso());

    const weekRevenue = weekReports.reduce((sum, r) => sum + computeRevenue(r), 0);
    const weekSales = weekReports.reduce((sum, r) => sum + computeSalesCount(r), 0);
    const weekHours = weekReports.reduce((sum, r) => sum + (r.actual_hours ?? 0), 0);
    const weekYield = computeYield(weekRevenue, weekHours);
    const weekDone = actions.filter(
        (a) => a.status === 'fait' && a.scheduled_date >= weekStart && a.scheduled_date <= todayIso()
    ).length;

    return (
        <div dir="ltr" className="space-y-8 text-left">
            {/* En-tête */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Pilotage</h1>
                <p className="text-gray-500 text-sm">
                    Semaine du {formatDate(weekStart)} — objectifs, actions et comptes rendus.
                </p>
            </div>

            {/* ── a) Semaine en cours ── */}
            <section>
                <SectionTitle icon={Gauge}>Semaine en cours</SectionTitle>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <StatCard icon={Euro} label="CA de la semaine" value={eur.format(weekRevenue)} />
                    <StatCard icon={ShoppingCart} label="Ventes" value={String(weekSales)} />
                    <StatCard icon={Clock} label="Heures investies" value={`${num.format(weekHours)} h`} />
                    <StatCard
                        icon={Gauge}
                        label="CA par heure"
                        value={weekYield === null ? '—' : `${eur.format(weekYield)}/h`}
                        hint={weekYield === null ? 'aucune heure saisie' : undefined}
                    />
                    <StatCard icon={CheckCircle2} label="Actions faites" value={String(weekDone)} />
                    <StatCard
                        icon={FileWarning}
                        label="CR en retard"
                        value={String(pending.length)}
                        alert={pending.length > 0}
                    />
                </div>
            </section>

            {/* ── b) Comptes rendus en retard ── */}
            <section
                className={`rounded-2xl p-6 border ${
                    pending.length > 0
                        ? 'bg-red-500/[0.04] border-red-500/30'
                        : 'bg-[#111111] border-[#C5A04E]/10'
                }`}
            >
                <SectionTitle icon={AlertTriangle} accent={pending.length > 0}>
                    Comptes rendus en retard
                </SectionTitle>

                {pending.length === 0 ? (
                    <EmptyState>
                        Aucun compte rendu en retard. Une action passée au statut « Fait » apparaîtra ici
                        dès que son horizon de mesure sera atteint.
                    </EmptyState>
                ) : (
                    <div className="space-y-3">
                        {pending.map((p) => (
                            <div
                                key={`${p.action.id}-${p.horizon}`}
                                className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0A0A] border border-red-500/20 rounded-xl px-4 py-3"
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-mono text-xs text-gray-500">{p.action.ref}</span>
                                        <span className="text-white font-medium">{p.action.title}</span>
                                        <span className="text-xs px-2 py-0.5 rounded-lg bg-[#C5A04E]/10 text-[#C5A04E]">
                                            {ACTION_TYPE_LABELS[p.action.type]}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        Action du {formatDate(p.action.scheduled_date)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <span className="text-sm font-mono text-orange-400">{p.horizon}</span>
                                    <span className="text-sm text-red-400 font-medium">
                                        {p.daysOverdue === 0
                                            ? 'dû aujourd’hui'
                                            : `${p.daysOverdue} j de retard`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── c) Objectifs actifs ── */}
            <section>
                <SectionTitle icon={Target}>Objectifs actifs</SectionTitle>

                {objectives.length === 0 ? (
                    <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl">
                        <EmptyState>Aucun objectif actif. La table est vide.</EmptyState>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {objectives.map((o) => {
                            const remaining = daysUntil(o.due_date);
                            const total = Math.max(
                                1,
                                Math.round(
                                    (new Date(`${o.due_date}T00:00:00Z`).getTime() -
                                        new Date(o.created_at).getTime()) /
                                        86_400_000
                                )
                            );
                            const elapsedPct = Math.min(100, Math.max(0, ((total - remaining) / total) * 100));

                            const baseline = resolveBaseline(o, o.measurements);
                            const last = latestMeasurement(o.measurements);
                            const attainment = computeAttainment(baseline, last?.value ?? null, o.target_value);
                            const barPct = attainment === null ? 0 : Math.min(100, Math.max(0, attainment));

                            // L'avance se juge en comparant l'atteinte au temps consommé :
                            // être à 30 % du chemin quand 80 % du délai est passé, c'est en retard.
                            const behind = attainment !== null && attainment + 5 < elapsedPct;

                            return (
                                <div
                                    key={o.id}
                                    className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-5"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className="text-white font-bold">{o.title}</h3>
                                        <span className="shrink-0 text-xs px-2 py-1 rounded-lg bg-[#C5A04E]/10 text-[#C5A04E]">
                                            {LEVER_LABELS[o.lever]}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                                        <div>
                                            <span className="text-gray-600">Départ : </span>
                                            <span className="text-gray-300 font-mono">
                                                {baseline === null ? '—' : `${num.format(baseline)} ${o.unit}`}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Cible : </span>
                                            <span className="text-white font-mono">
                                                {num.format(o.target_value)} {o.unit}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-600">Source de vérité : </span>
                                            <span className="text-gray-300">{o.source_of_truth}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Échéance : </span>
                                            <span className="text-gray-300">{formatDate(o.due_date)}</span>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={
                                                    remaining < 0
                                                        ? 'text-red-400'
                                                        : remaining <= 7
                                                          ? 'text-orange-400'
                                                          : 'text-gray-300'
                                                }
                                            >
                                                {remaining < 0
                                                    ? `${Math.abs(remaining)} j de dépassement`
                                                    : `${remaining} j restants`}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Atteinte : l'information principale */}
                                    {attainment === null ? (
                                        <div className="bg-[#0A0A0A] border border-[#C5A04E]/10 rounded-xl px-4 py-3 text-sm text-gray-500">
                                            Aucun relevé — l’atteinte ne peut pas être calculée.
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-end justify-between mb-1.5">
                                                <span className="text-xs uppercase tracking-wider text-gray-500">
                                                    Atteinte
                                                </span>
                                                <div className="text-right">
                                                    <span
                                                        className={`text-2xl font-bold ${
                                                            attainment >= 100
                                                                ? 'text-green-400'
                                                                : behind
                                                                  ? 'text-orange-400'
                                                                  : 'text-white'
                                                        }`}
                                                    >
                                                        {Math.round(attainment)} %
                                                    </span>
                                                    {last && (
                                                        <span className="text-xs text-gray-600 ml-2 font-mono">
                                                            {num.format(last.value)} {o.unit}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${
                                                        attainment >= 100
                                                            ? 'bg-green-500'
                                                            : behind
                                                              ? 'bg-orange-500'
                                                              : 'bg-gradient-to-r from-[#C5A04E] to-[#0ea5e9]'
                                                    }`}
                                                    style={{ width: `${barPct}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Temps écoulé : information secondaire */}
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                            <span>Temps écoulé</span>
                                            <span className="font-mono">
                                                {Math.round(elapsedPct)} %
                                                {behind && (
                                                    <span className="text-orange-400 ml-2">en retard</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${
                                                    remaining < 0 ? 'bg-red-500/60' : 'bg-gray-600'
                                                }`}
                                                style={{ width: `${elapsedPct}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Trajectoire */}
                                    <div className="mt-4 pt-4 border-t border-[#C5A04E]/10">
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                            <span className="flex items-center gap-1.5">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                Trajectoire
                                            </span>
                                            <span>
                                                {o.measurements.length === 0
                                                    ? 'aucun relevé'
                                                    : `${o.measurements.length} relevé${o.measurements.length > 1 ? 's' : ''} · dernier le ${formatDate(o.measurements[o.measurements.length - 1].measured_at)}`}
                                            </span>
                                        </div>
                                        {o.measurements.length >= 2 ? (
                                            <Sparkline values={o.measurements.map((m) => m.value)} />
                                        ) : (
                                            <div className="text-xs text-gray-700 py-2">
                                                Il faut au moins deux relevés pour tracer une trajectoire.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ── d) Actions récentes ── */}
            <section>
                <SectionTitle icon={ListChecks}>Actions récentes</SectionTitle>

                <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl overflow-hidden">
                    {actions.length === 0 ? (
                        <EmptyState>Aucune action sur les 90 derniers jours.</EmptyState>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-500 border-b border-[#C5A04E]/10">
                                        <th className="text-left font-medium py-3 px-4">Réf.</th>
                                        <th className="text-left font-medium py-3 px-4">Date</th>
                                        <th className="text-left font-medium py-3 px-4">Titre</th>
                                        <th className="text-left font-medium py-3 px-4">Type</th>
                                        <th className="text-left font-medium py-3 px-4">Statut</th>
                                        <th className="text-right font-medium py-3 px-4">CA réalisé</th>
                                        <th className="text-right font-medium py-3 px-4">CA / heure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actions.map((a: PilotageActionWithReports) => {
                                        const revenue = a.reports.reduce((s, r) => s + computeRevenue(r), 0);
                                        const hours = a.reports.reduce(
                                            (s, r) => s + (r.actual_hours ?? 0),
                                            0
                                        );
                                        const yieldPerHour = computeYield(revenue, hours);

                                        return (
                                            <tr
                                                key={a.id}
                                                className="border-b border-[#C5A04E]/5 last:border-b-0"
                                            >
                                                <td className="py-3 px-4 font-mono text-xs text-gray-500">
                                                    {a.ref}
                                                </td>
                                                <td className="py-3 px-4 text-gray-400">
                                                    {formatDate(a.scheduled_date)}
                                                </td>
                                                <td className="py-3 px-4 text-white">{a.title}</td>
                                                <td className="py-3 px-4 text-gray-400">
                                                    {ACTION_TYPE_LABELS[a.type]}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-lg ${
                                                            a.status === 'debriefe'
                                                                ? 'bg-green-500/10 text-green-400'
                                                                : a.status === 'fait'
                                                                  ? 'bg-blue-500/10 text-blue-400'
                                                                  : a.status === 'abandonne'
                                                                    ? 'bg-gray-500/10 text-gray-400'
                                                                    : 'bg-orange-500/10 text-orange-400'
                                                        }`}
                                                    >
                                                        {ACTION_STATUS_LABELS[a.status]}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono text-gray-300">
                                                    {a.reports.length === 0 ? '—' : eur.format(revenue)}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono text-gray-300">
                                                    {yieldPerHour === null
                                                        ? '—'
                                                        : `${eur.format(yieldPerHour)}/h`}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
