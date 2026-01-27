"use client";

import { useEffect, useState } from 'react';
import { Wallet, ShoppingBag, TrendingUp, CheckCircle, Clock, AlertTriangle, PlayCircle } from 'lucide-react';
import CountUp from 'react-countup';
import { Line } from 'react-chartjs-2';
import 'flag-icons/css/flag-icons.min.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface Vente {
    date: string;
    heure: string;
    nom: string;
    codePays: string;
    pack: 'Spark' | 'Emperor' | 'Legend';
    prix: number;
    gain: number;
    status: 'paid' | 'pending';
}

interface LiveActuel {
    places_disponibles: number;
    places_prises: number;
    places_restantes: number;
}

interface VentesData {
    ventes: Vente[];
    stats: {
        total_gains: number;
        total_ventes: number;
    };
    live_actuel?: LiveActuel;
}

const PACK_CONFIG: Record<string, { icon: string; nameAr: string; color: string; bgColor: string; borderColor: string }> = {
    Spark: {
        icon: '🚀',
        nameAr: 'الشرارة',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30'
    },
    Emperor: {
        icon: '👑',
        nameAr: 'الإمبراطور',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30'
    },
    Legend: {
        icon: '💎',
        nameAr: 'الأسطورة',
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30'
    }
};

export default function VentesLivePage() {
    // Initialize with default values (including live status)
    const [data, setData] = useState<VentesData>({
        ventes: [],
        stats: {
            total_gains: 11964,
            total_ventes: 18
        },
        live_actuel: {
            places_disponibles: 7,
            places_prises: 3,
            places_restantes: 4
        }
    });

    // Generate realistic earnings data for chart based on TOTAL GAINS
    const generateChartData = (totalTarget: number) => {
        const days = 30;
        const labels = [];
        const cumulativeData = [];
        const dailyGains = []; // Store daily gains for tooltip

        let rawDailyGains = [];
        let rawTotal = 0;

        for (let i = 0; i < days; i++) {
            let daily = Math.random() > 0.2 ? Math.random() * 800 + 50 : Math.random() * 100;
            rawDailyGains.push(daily);
            rawTotal += daily;
        }

        const adjustmentFactor = totalTarget / rawTotal;
        let runningTotal = 0;

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            labels.push(date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));

            let adjustedDaily = Math.round(rawDailyGains[i] * adjustmentFactor);
            if (i === days - 1) adjustedDaily = totalTarget - runningTotal;

            dailyGains.push(adjustedDaily);
            runningTotal += adjustedDaily;
            cumulativeData.push(runningTotal);
        }

        return { labels, data: cumulativeData, dailyGains };
    };

    const chartData = generateChartData(data.stats.total_gains);

    const chartConfig = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Gains Cumulés',
                data: chartData.data,
                dailyGains: chartData.dailyGains,
                borderColor: '#00FFA3',
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(0, 255, 163, 0.2)');
                    gradient.addColorStop(1, 'rgba(0, 255, 163, 0)');
                    return gradient;
                },
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#00FFA3',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(5, 10, 20, 0.95)',
                titleColor: '#00FFA3',
                titleFont: { family: 'Orbitron', size: 13 },
                bodyColor: '#fff',
                bodyFont: { family: 'Inter', size: 12 },
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    title: (context: any) => context[0].label,
                    label: (context: any) => {
                        const index = context.dataIndex;
                        const dailyGain = context.dataset.dailyGains[index];
                        const total = context.parsed.y;
                        return [
                            `Daily Profit: +${dailyGain.toLocaleString()}€`,
                            `Total: ${total.toLocaleString()}€`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.02)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6B7280',
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 7,
                    font: { family: 'Inter', size: 11 }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.02)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6B7280',
                    font: { family: 'Inter', size: 11 },
                    callback: (value: any) => `${value.toLocaleString()}€`
                }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart' as const
        }
    } as const;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/ventes-live.json?t=' + Date.now());
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Erreur chargement données:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000); // Update every 3 seconds for urgency
        return () => clearInterval(interval);
    }, []);

    // Urgency Banner Logic
    const live = data.live_actuel;
    let urgenceStyle = {
        bg: "bg-green-500/15",
        border: "border-green-500",
        text: "text-green-500",
        message: "✅ اكتمل العدد - نراكم في البث القادم !",
        animate: false,
        icon: <CheckCircle className="w-5 h-5 animate-bounce" />,
        progressColor: "bg-gradient-to-l from-green-500 to-green-400"
    };

    if (live) {
        if (live.places_restantes >= 5) {
            urgenceStyle = {
                bg: "bg-yellow-500/10",
                border: "border-yellow-500",
                text: "text-yellow-500",
                message: `لم يتبقى سوى ${live.places_restantes} أماكن متاحة`,
                animate: false,
                icon: <PlayCircle className="w-5 h-5 text-yellow-500" />,
                progressColor: "bg-gradient-to-l from-yellow-500 to-amber-500"
            };
        } else if (live.places_restantes >= 3) {
            urgenceStyle = {
                bg: "bg-orange-500/15",
                border: "border-orange-500",
                text: "text-orange-500",
                message: `⚠️ لم يتبقى سوى ${live.places_restantes} أماكن لهذا البث المباشر !`,
                animate: false,
                icon: <AlertTriangle className="w-5 h-5 animate-pulse text-orange-500" />,
                progressColor: "bg-gradient-to-l from-orange-500 to-red-500"
            };
        } else if (live.places_restantes > 0) {
            urgenceStyle = {
                bg: "bg-red-500/20",
                border: "border-red-500",
                text: "text-red-500",
                message: live.places_restantes === 1 ? "🔴🔴 مكان واحد فقط متبقي !" : "🔴 مكانان فقط متبقيان ! أسرع !",
                animate: true,
                icon: <AlertTriangle className="w-6 h-6 animate-ping text-red-500" />,
                progressColor: "bg-gradient-to-l from-red-600 to-red-500"
            };
        }
    }

    const progressPercent = live ? Math.min((live.places_prises / live.places_disponibles) * 100, 100) : 0;

    return (
        <div className="min-h-screen bg-[#050A14] text-white font-cairo p-6 lg:p-10">
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* BRAND HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <div></div>
                    <div className="text-right">
                        <h1 className="text-2xl font-black tracking-wider font-orbitron text-white">
                            LEXMO<span className="text-[#00FFA3]">.AI</span>
                        </h1>
                    </div>
                </div>

                {/* URGENCY BANNER */}
                {live && (
                    <div
                        className={`w-full rounded-2xl p-6 border-2 transition-all duration-500 relative overflow-hidden ${urgenceStyle.bg} ${urgenceStyle.border} ${urgenceStyle.animate ? 'banner-urgent' : ''}`}
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">🔥</span>
                            <h2 className="text-xl lg:text-2xl font-bold text-white font-cairo">أماكن محدودة اليوم</h2>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full h-6 bg-white/10 rounded-full overflow-hidden mb-4 shadow-inner">
                            <div
                                className={`h-full transition-all duration-1000 ease-out ${urgenceStyle.progressColor}`}
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-white drop-shadow-md tracking-wider">
                                    تم حجز {live.places_prises} من {live.places_disponibles} أماكن
                                </span>
                            </div>
                        </div>

                        {/* Message */}
                        <div className={`flex items-center gap-3 font-bold text-lg lg:text-xl ${urgenceStyle.text}`}>
                            {urgenceStyle.icon}
                            <span>{urgenceStyle.message}</span>
                        </div>
                    </div>
                )}

                {/* MAIN GRID: 65% Graph / 35% Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">

                    {/* LEFT: Growth Chart */}
                    <div className="bg-[#FFFFFF]/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                        {/* Title */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse"></span>
                                <span className="text-xs font-bold text-[#00FFA3] tracking-wider font-orbitron">LIVE GROWTH</span>
                            </div>
                            <h2 className="text-lg font-bold text-gray-300">نمو الأرباح</h2>
                        </div>

                        {/* Chart Area */}
                        <div className="h-[320px] w-full">
                            <Line data={chartConfig} options={chartOptions} />
                        </div>
                    </div>

                    {/* RIGHT: Stacked Stat Cards */}
                    <div className="flex flex-col gap-6 h-full">

                        {/* TOP CARD: Total Profits */}
                        <div className="flex-1 bg-[#FFFFFF]/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center items-center text-center group hover:border-[#FFD700]/20 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <Wallet className="w-6 h-6 text-[#FFD700]" />
                            </div>

                            <h3 className="text-gray-400 text-lg font-bold mb-1">إجمالي الأرباح</h3>

                            {/* Metallic Gold Text */}
                            <div
                                className="text-5xl lg:text-6xl xl:text-7xl font-black font-orbitron mb-2 whitespace-nowrap tracking-tight"
                                style={{
                                    backgroundImage: 'linear-gradient(180deg, #FFD700 0%, #FDB931 50%, #9E7908 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    filter: 'drop-shadow(0 2px 10px rgba(255, 215, 0, 0.2))'
                                }}
                            >
                                <CountUp
                                    start={data.stats.total_gains}
                                    end={data.stats.total_gains}
                                    duration={1.5}
                                    separator=","
                                    suffix="€"
                                    preserveValue={true}
                                />
                            </div>

                            <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-orbitron">
                                TOTAL COMMISSION
                            </p>
                        </div>

                        {/* BOTTOM CARD: Sales Count */}
                        <div className="h-[140px] bg-[#FFFFFF]/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative flex items-center justify-between group hover:border-[#00FFA3]/20 transition-colors">
                            <div>
                                <h3 className="text-gray-400 text-base font-bold mb-1">عدد المبيعات</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-orbitron">SALES COUNT</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-black text-white font-orbitron">
                                    <CountUp
                                        start={data.stats.total_ventes}
                                        end={data.stats.total_ventes}
                                        duration={1.5}
                                        preserveValue={true}
                                    />
                                </div>
                                <div className="w-12 h-12 rounded-full bg-[#00FFA3]/10 flex items-center justify-center border border-[#00FFA3]/20">
                                    <ShoppingBag className="w-5 h-5 text-[#00FFA3]" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* TRANSACTION TABLE */}
                <div className="bg-[#FFFFFF]/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <div className="flex gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                        <h2 className="text-lg font-bold text-white">آخر المعاملات</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full" dir="rtl">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5">
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider font-orbitron">CLIENT</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider font-orbitron">DATE</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider font-orbitron">STATUS</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 font-cairo">الباقة</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 font-cairo">الربح</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.ventes.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No transactions yet
                                        </td>
                                    </tr>
                                ) : (
                                    data.ventes.map((vente, index) => {
                                        const packConfig = PACK_CONFIG[vente.pack];
                                        const isEven = index % 2 === 0;

                                        return (
                                            <tr
                                                key={index}
                                                className={`transition-colors hover:bg-white/[0.04] ${!isEven ? 'bg-white/[0.01]' : ''}`}
                                            >
                                                <td className="px-6 py-5 align-middle">
                                                    <div className="flex items-center gap-4 flex-row-reverse justify-end">
                                                        <span className="text-gray-200 font-medium text-base font-inter tracking-wide">{vente.nom}</span>
                                                        <span className={`fi fi-${vente.codePays} fis rounded-full text-2xl shadow-lg border border-white/20`} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-middle">
                                                    <div className="flex items-center gap-2 justify-end text-gray-400">
                                                        <Clock className="w-4 h-4 opacity-50" />
                                                        <span className="font-mono text-sm tracking-wide">{vente.date || '26 Jan'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-middle">
                                                    <span className="inline-flex items-center justify-center h-7 px-3 rounded-md bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20 text-[11px] font-bold uppercase tracking-wider font-inter shadow-[0_0_10px_rgba(0,255,163,0.1)]">
                                                        PAID
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 align-middle">
                                                    <div className="flex items-center gap-3 justify-end w-full">
                                                        <div className="flex flex-col items-end mr-1">
                                                            <span className="text-gray-200 text-sm font-bold mb-0.5">{packConfig.nameAr}</span>
                                                            <span className="text-gray-400 font-mono text-xs tracking-wide">({vente.prix.toLocaleString()}€)</span>
                                                        </div>
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 shadow-sm">
                                                            <span className="text-lg filter drop-shadow-md">{packConfig.icon}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-middle">
                                                    <span className="text-[#00FFA3] font-black text-lg font-orbitron tracking-wide filter drop-shadow-[0_0_5px_rgba(0,255,163,0.3)]">
                                                        +{vente.gain.toLocaleString()}€
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Orbitron:wght@400;700;900&display=swap');
                
                .font-orbitron {
                    font-family: 'Orbitron', sans-serif;
                }
                .font-inter {
                    font-family: 'Inter', sans-serif;
                }

                @keyframes urgentPulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
                    }
                    50% {
                        transform: scale(1.02);
                        box-shadow: 0 0 40px rgba(239, 68, 68, 0.6);
                    }
                }

                .banner-urgent {
                    animation: urgentPulse 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
