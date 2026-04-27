"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { ArrowRight, Loader2, Lock, BarChart3, AlertCircle } from "lucide-react";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
if (typeof window !== "undefined") {
    ChartJS.defaults.font.family = "Cairo, system-ui, sans-serif";
    ChartJS.defaults.color = "#9ca3af";
}

const ADMIN_EMAIL = "academyfrance75@gmail.com";

type Period = "week" | "month";

interface ByDay {
    date: string;
    seconds: number;
    sessions: number;
}

interface TopTask {
    task_id: string;
    title: string;
    category: string | null;
    task_type: string | null;
    total_seconds: number;
    sessions_count: number;
}

interface StatsResponse {
    current: {
        period_start: string;
        period_end: string;
        total_seconds: number;
        total_sessions: number;
        completed_sessions: number;
        abandoned_sessions: number;
        by_day: ByDay[];
        by_category: { personal: number; professional: number; uncategorized: number };
        top_tasks: TopTask[];
    };
    previous?: {
        period_start: string;
        period_end: string;
        total_seconds: number;
        total_sessions: number;
        completed_sessions: number;
        abandoned_sessions: number;
    };
}

// ─── Helpers ──────────────────────────────────────────────────
function formatDuration(seconds: number): string {
    if (seconds <= 0) return "0 د";
    if (seconds < 60) return "أقل من دقيقة";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} د`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h >= 24 || m === 0) return `${h} س`;
    return `${h} س ${m} د`;
}

function formatComparison(current: number, previous: number): {
    percent: number | null;
    direction: "up" | "down" | "same";
    diffSeconds: number;
} {
    const diff = current - previous;
    if (previous === 0 && current === 0) return { percent: 0, direction: "same", diffSeconds: 0 };
    if (previous === 0) return { percent: null, direction: "up", diffSeconds: diff };
    if (current === 0) return { percent: -100, direction: "down", diffSeconds: diff };
    const pct = Math.round(((current - previous) / previous) * 100);
    return {
        percent: pct,
        direction: pct > 0 ? "up" : pct < 0 ? "down" : "same",
        diffSeconds: diff,
    };
}

const CATEGORY_LABELS: Record<string, string> = {
    personal: "شخصي",
    professional: "مهني",
    uncategorized: "بدون فئة",
};

const TYPE_LABELS: Record<string, string> = {
    recurring: "متكررة",
    one_time: "مرة واحدة",
    long_term: "طويلة المدى",
};

const RANK_EMOJI = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

const DAY_NAMES_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function dayLabel(iso: string, period: Period): string {
    const d = new Date(`${iso}T00:00:00Z`);
    if (period === "week") {
        return DAY_NAMES_AR[d.getUTCDay()];
    }
    return String(d.getUTCDate());
}

// ─── Page ─────────────────────────────────────────────────────
export default function FocusStatsPage() {
    const [authChecked, setAuthChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const [period, setPeriod] = useState<Period>("week");
    const [data, setData] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setAuthorized(user?.email === ADMIN_EMAIL);
            setAuthChecked(true);
        });
    }, []);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/focus/stats?period=${period}&compare=true`, {
                credentials: "include",
            });
            if (!res.ok) {
                setError("حدث خطأ. حاول مرة أخرى");
                return;
            }
            const json: StatsResponse = await res.json();
            setData(json);
        } catch {
            setError("حدث خطأ. حاول مرة أخرى");
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        if (authorized) refresh();
    }, [authorized, refresh]);

    if (!authChecked) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#C5A04E]" />
            </div>
        );
    }

    if (!authorized) {
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

    const isEmpty =
        !!data && data.current.total_sessions === 0 && data.current.abandoned_sessions === 0;

    return (
        <div className="max-w-5xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <BarChart3 className="w-7 h-7 text-[#C5A04E]" />
                    <h1 className="text-2xl font-bold text-white">📊 إحصائيات التركيز</h1>
                </div>
                <Link
                    href="/dashboard/focus"
                    className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors"
                >
                    <ArrowRight className="w-4 h-4" />
                    العودة
                </Link>
            </div>

            {/* Period tabs */}
            <div className="flex gap-2">
                {(["week", "month"] as Period[]).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                            period === p
                                ? "bg-[#C5A04E] text-white"
                                : "bg-[#1A1A1A] text-gray-400 hover:bg-[#222222]"
                        }`}
                    >
                        {p === "week" ? "هذا الأسبوع" : "هذا الشهر"}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={refresh}
                        className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 font-bold hover:bg-red-500/30 transition-colors"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            )}

            {/* Loading skeleton */}
            {loading && !data && <StatsSkeleton />}

            {/* Empty state */}
            {!loading && !error && isEmpty && (
                <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-12 text-center">
                    <p className="text-gray-400 mb-4">
                        لم تسجل أي جلسة {period === "week" ? "هذا الأسبوع" : "هذا الشهر"} بعد. ابدأ جلستك الأولى!
                    </p>
                    <Link
                        href="/dashboard/focus"
                        className="inline-block px-6 py-3 rounded-xl bg-[#C5A04E] text-white font-bold hover:bg-[#D4B85C] transition-colors"
                    >
                        العودة للمتتبع
                    </Link>
                </div>
            )}

            {/* Content */}
            {!loading && !error && data && !isEmpty && (
                <StatsContent data={data} period={period} />
            )}
        </div>
    );
}

// ─── Stats content ────────────────────────────────────────────
function StatsContent({ data, period }: { data: StatsResponse; period: Period }) {
    const cur = data.current;
    const prev = data.previous;

    const avgSession =
        cur.completed_sessions > 0 ? Math.floor(cur.total_seconds / cur.completed_sessions) : 0;
    const completionRate =
        cur.total_sessions > 0
            ? Math.round((cur.completed_sessions / cur.total_sessions) * 100)
            : 0;

    const prevAvgSession =
        prev && prev.completed_sessions > 0
            ? Math.floor(prev.total_seconds / prev.completed_sessions)
            : 0;
    const prevCompletionRate =
        prev && prev.total_sessions > 0
            ? Math.round((prev.completed_sessions / prev.total_sessions) * 100)
            : 0;

    const cmpTime = formatComparison(cur.total_seconds, prev?.total_seconds || 0);
    const cmpSessions = formatComparison(cur.total_sessions, prev?.total_sessions || 0);
    const cmpAvg = formatComparison(avgSession, prevAvgSession);
    const cmpRate = formatComparison(completionRate, prevCompletionRate);

    return (
        <div className="space-y-5">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiCard
                    label="إجمالي الوقت"
                    value={formatDuration(cur.total_seconds)}
                    comparison={cmpTime}
                    period={period}
                />
                <KpiCard
                    label="عدد الجلسات"
                    value={String(cur.total_sessions)}
                    comparison={cmpSessions}
                    period={period}
                />
                <KpiCard
                    label="متوسط الجلسة"
                    value={formatDuration(avgSession)}
                    comparison={cmpAvg}
                    period={period}
                />
                <KpiCard
                    label="معدل الإكمال"
                    value={`${completionRate}%`}
                    comparison={cmpRate}
                    period={period}
                    suffix="نقطة"
                />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ActivityChart byDay={cur.by_day} period={period} />
                <CategoryChart byCategory={cur.by_category} totalSeconds={cur.total_seconds} />
            </div>

            {/* Top tasks */}
            <TopTasksList tasks={cur.top_tasks} />

            {/* Comparison summary */}
            {prev && (
                <ComparisonSummary
                    period={period}
                    cur={cur.total_seconds}
                    prev={prev.total_seconds}
                />
            )}
        </div>
    );
}

// ─── KPI card ─────────────────────────────────────────────────
function KpiCard({
    label,
    value,
    comparison,
    period,
    suffix,
}: {
    label: string;
    value: string;
    comparison: ReturnType<typeof formatComparison>;
    period: Period;
    suffix?: string;
}) {
    const periodWord = period === "week" ? "الأسبوع الماضي" : "الشهر الماضي";

    let cmpText = "";
    let cmpColor = "text-gray-500";
    if (comparison.direction === "same" && comparison.percent === 0) {
        cmpText = "بدون تغيير";
    } else if (comparison.percent === null) {
        cmpText = "جديد!";
        cmpColor = "text-green-400";
    } else {
        const sign = comparison.percent > 0 ? "+" : "";
        cmpText = `${sign}${comparison.percent}% vs ${periodWord}`;
        cmpColor = comparison.percent > 0 ? "text-green-400" : comparison.percent < 0 ? "text-red-400" : "text-gray-500";
    }
    void suffix;

    return (
        <div className="bg-[#1A1A1A] border border-[#C5A04E]/15 rounded-2xl p-4">
            <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
            <p className="text-3xl font-bold text-white mb-2" dir="ltr" style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}>
                {value}
            </p>
            <p className={`text-[11px] ${cmpColor}`}>{cmpText}</p>
        </div>
    );
}

// ─── Activity chart (bar) ─────────────────────────────────────
function ActivityChart({ byDay, period }: { byDay: ByDay[]; period: Period }) {
    const labels = byDay.map((d) => dayLabel(d.date, period));
    const dataPoints = byDay.map((d) => +(d.seconds / 3600).toFixed(2)); // hours
    const sessionsData = byDay.map((d) => d.sessions);

    const chartData = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    label: "ساعات",
                    data: dataPoints,
                    backgroundColor: "rgba(197, 160, 78, 0.7)",
                    borderColor: "#C5A04E",
                    borderWidth: 1,
                    borderRadius: 6,
                },
            ],
        }),
        [labels, dataPoints]
    );

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#0A0A0A",
                    titleColor: "#fff",
                    bodyColor: "#9ca3af",
                    borderColor: "#C5A04E",
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        title: (items: any[]) => {
                            const idx = items[0].dataIndex;
                            const day = byDay[idx];
                            const d = new Date(`${day.date}T00:00:00Z`);
                            const dayName = DAY_NAMES_AR[d.getUTCDay()];
                            return `${dayName} ${d.getUTCDate()}`;
                        },
                        label: (item: any) => {
                            const idx = item.dataIndex;
                            const seconds = byDay[idx].seconds;
                            const sess = sessionsData[idx];
                            return `${formatDuration(seconds)} | ${sess} جلسة`;
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: "#6b7280", font: { size: 11 } },
                    grid: { color: "rgba(255,255,255,0.04)" },
                    title: { display: true, text: "ساعات", color: "#9ca3af" },
                },
                x: {
                    ticks: { color: "#9ca3af", font: { size: 11 } },
                    grid: { display: false },
                },
            },
        }),
        [byDay, sessionsData]
    );

    return (
        <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white mb-4">النشاط اليومي</h3>
            <div dir="ltr" className="h-64">
                <Bar data={chartData} options={options as any} />
            </div>
        </div>
    );
}

// ─── Category donut ───────────────────────────────────────────
function CategoryChart({
    byCategory,
    totalSeconds,
}: {
    byCategory: { personal: number; professional: number; uncategorized: number };
    totalSeconds: number;
}) {
    const segments: { key: string; value: number; color: string }[] = [];
    if (byCategory.personal > 0) segments.push({ key: "personal", value: byCategory.personal, color: "#3B82F6" });
    if (byCategory.professional > 0) segments.push({ key: "professional", value: byCategory.professional, color: "#C5A04E" });
    if (byCategory.uncategorized > 0) segments.push({ key: "uncategorized", value: byCategory.uncategorized, color: "#6B7280" });

    const labels = segments.map((s) => CATEGORY_LABELS[s.key]);
    const data = segments.map((s) => s.value);
    const colors = segments.map((s) => s.color);

    const chartData = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: colors,
                    borderColor: "#0A0A0A",
                    borderWidth: 3,
                },
            ],
        }),
        [labels, data, colors]
    );

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#0A0A0A",
                    titleColor: "#fff",
                    bodyColor: "#9ca3af",
                    borderColor: "#C5A04E",
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: (item: any) => {
                            const seconds = item.parsed;
                            const pct = totalSeconds > 0 ? Math.round((seconds / totalSeconds) * 100) : 0;
                            return `${formatDuration(seconds)} (${pct}%)`;
                        },
                    },
                },
            },
        }),
        [totalSeconds]
    );

    return (
        <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white mb-4">التوزيع حسب الفئة</h3>
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-48 h-48 shrink-0" dir="ltr">
                    {segments.length > 0 ? (
                        <>
                            <Doughnut data={chartData} options={options as any} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-[10px] text-gray-500 font-bold">الإجمالي</p>
                                <p className="text-lg font-bold text-white">{formatDuration(totalSeconds)}</p>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-sm text-gray-500">لا توجد بيانات</div>
                    )}
                </div>
                <div className="flex-1 w-full space-y-2">
                    {segments.map((s) => {
                        const pct = totalSeconds > 0 ? Math.round((s.value / totalSeconds) * 100) : 0;
                        return (
                            <div key={s.key} className="flex items-center gap-3">
                                <span
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: s.color }}
                                />
                                <span className="text-sm text-gray-300 flex-1">{CATEGORY_LABELS[s.key]}</span>
                                <span className="text-xs text-gray-500 font-mono">{formatDuration(s.value)}</span>
                                <span className="text-xs text-gray-500 w-10 text-left" dir="ltr">{pct}%</span>
                            </div>
                        );
                    })}
                    {segments.length === 0 && (
                        <p className="text-sm text-gray-500">لا توجد بيانات</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Top tasks list ───────────────────────────────────────────
function TopTasksList({ tasks }: { tasks: TopTask[] }) {
    return (
        <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white mb-4">أكثر 5 مهام نشاطاً</h3>
            {tasks.length === 0 ? (
                <p className="text-center py-6 text-gray-500 text-sm">لا توجد مهام في هذه الفترة</p>
            ) : (
                <div className="space-y-2">
                    {tasks.map((t, idx) => (
                        <div
                            key={t.task_id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/[0.04]"
                        >
                            <span className="text-lg shrink-0 w-7 text-center">{RANK_EMOJI[idx]}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{t.title}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {t.task_type && (
                                        <span className="text-[10px] text-gray-500">
                                            {TYPE_LABELS[t.task_type] || t.task_type}
                                        </span>
                                    )}
                                    {t.category && (
                                        <span className="text-[10px] text-gray-500">
                                            · {CATEGORY_LABELS[t.category] || t.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm text-[#C5A04E] font-bold">{formatDuration(t.total_seconds)}</p>
                                <p className="text-[10px] text-gray-500">{t.sessions_count} جلسة</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Comparison summary ───────────────────────────────────────
function ComparisonSummary({
    period,
    cur,
    prev,
}: {
    period: Period;
    cur: number;
    prev: number;
}) {
    const cmp = formatComparison(cur, prev);
    const periodWord = period === "week" ? "الأسبوع" : "الشهر";
    const prevWord = period === "week" ? "الأسبوع الماضي" : "الشهر الماضي";

    let emoji = "📊";
    let text = "";
    let color = "text-gray-400";

    if (cmp.direction === "same" && cmp.percent === 0) {
        text = `هذا ${periodWord} كنت بنفس الإنتاجية مقارنة بـ${prevWord}`;
        emoji = "🔁";
    } else if (cmp.percent === null) {
        text = `هذا ${periodWord} هو بدايتك! لم تكن لديك جلسات في ${prevWord}`;
        emoji = "🚀";
        color = "text-green-400";
    } else if (cmp.direction === "up") {
        text = `هذا ${periodWord} كنت أكثر إنتاجية بـ ${Math.abs(cmp.percent!)}% مقارنة بـ${prevWord}`;
        emoji = "📈";
        color = "text-green-400";
    } else {
        text = `هذا ${periodWord} انخفضت إنتاجيتك بـ ${Math.abs(cmp.percent!)}% مقارنة بـ${prevWord}`;
        emoji = "📉";
        color = "text-red-400";
    }

    const diffSign = cmp.diffSeconds > 0 ? "+" : "";
    const absDiff = Math.abs(cmp.diffSeconds);

    return (
        <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-5">
            <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{emoji}</span>
                <div>
                    <p className={`text-sm font-bold ${color} mb-1`}>{text}</p>
                    {cmp.diffSeconds !== 0 && (
                        <p className="text-xs text-gray-500">
                            الفرق: <span dir="ltr" className="font-mono">{diffSign}{formatDuration(absDiff)}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Loading skeleton ─────────────────────────────────────────
function StatsSkeleton() {
    return (
        <div className="space-y-5 animate-pulse">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#1A1A1A] rounded-2xl p-4 h-24" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-[#111111] rounded-2xl p-5 h-72" />
                <div className="bg-[#111111] rounded-2xl p-5 h-72" />
            </div>
            <div className="bg-[#111111] rounded-2xl p-5 h-64" />
        </div>
    );
}
