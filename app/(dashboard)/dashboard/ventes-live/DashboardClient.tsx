"use client";
// Force Deploy: 2026-01-29 21:05 - Fix Mixed Chart Crash (Reg Controllers)

import { useEffect, useState } from 'react';
import { Wallet, ShoppingBag, TrendingUp, CheckCircle, Clock, AlertTriangle, PlayCircle } from 'lucide-react';
import CountUp from 'react-countup';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    LineController,
    BarController
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    LineController,
    BarController
);

const TIMER_ANIMATIONS = `
@keyframes timer-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.95; }
}
@keyframes timer-pulse-fast {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes timer-urgent-blink {
  0%, 50%, 100% { opacity: 1; background: rgba(239, 68, 68, 0.1); }
  25%, 75% { opacity: 0.8; background: rgba(239, 68, 68, 0.2); }
}
@keyframes timer-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
@keyframes timer-blink-dots {
  0%, 49%, 100% { opacity: 1; }
  50%, 99% { opacity: 0; }
}
@keyframes timer-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

export interface Vente {
    date: string;
    heure: string;
    nom: string;
    codePays: string;
    pays?: string; // Added for precise Emoji support
    pack: 'Spark' | 'Emperor' | 'Legend';
    prix: number;
    gain: number;
    status: 'paid' | 'pending';
}

export interface LiveActuel {
    places_disponibles: number;
    places_prises: number;
    places_restantes: number;
    duree_live_minutes?: number;
    heure_debut?: string;
    heure_fin?: string;
}

export interface GraphiquePoint {
    date: string;
    cumul: number;
}

export interface VentesData {
    ventes: Vente[];
    stats: {
        total_gains: number;
        total_ventes: number;
    };
    live_actuel?: LiveActuel;
    graphique?: GraphiquePoint[];
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

export default function DashboardClient({ initialData }: { initialData: VentesData }) {
    // Initialize with SERVER DATA to avoid flash of 0
    const [data, setData] = useState<VentesData>(initialData);

    // Generate chart data: Aggregating REAL SALES data from JSON
    const generateChartData = (ventes: Vente[]) => {
        // Grouper par vente.date (pas par date du jour)
        const labels = [...new Set(ventes.map(v => v.date))].sort();

        console.log('Ventes dates:', ventes.map(v => v.date));
        console.log('Graph labels:', labels);

        const dailyGainsLocal: number[] = [];
        const dailyCounts: number[] = [];
        const cumulativeData: number[] = [];

        // 1. Group by Date
        const salesByDate: Record<string, { gain: number, count: number }> = {};

        ventes.forEach(v => {
            const dateKey = v.date;
            if (!salesByDate[dateKey]) {
                salesByDate[dateKey] = { gain: 0, count: 0 };
            }
            salesByDate[dateKey].gain += v.gain;
            salesByDate[dateKey].count += 1;
        });

        // 2. Build Arrays
        let runningTotal = 0;

        labels.forEach(dateStr => {
            const dayStats = salesByDate[dateStr] || { gain: 0, count: 0 };
            runningTotal += dayStats.gain;

            dailyGainsLocal.push(dayStats.gain);
            dailyCounts.push(dayStats.count);
            cumulativeData.push(runningTotal);
        });

        return { labels, data: dailyGainsLocal, dailyCounts, cumulativeData };
    };

    const chartData = generateChartData(data.ventes);

    const chartConfig = {
        labels: chartData.labels,
        datasets: [
            {
                type: 'line' as const,
                label: 'Evolution',
                data: chartData.data,
                dailyCounts: chartData.dailyCounts,
                cumulativeData: chartData.cumulativeData,
                borderColor: 'rgba(16, 185, 129, 1)', // Emerald-500
                borderWidth: 3,
                pointRadius: 6,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                tension: 0.4,
                order: 1 // Top layer
            },
            {
                type: 'bar' as const,
                label: 'Gains du Jour',
                data: chartData.data,
                dailyCounts: chartData.dailyCounts,
                cumulativeData: chartData.cumulativeData,
                backgroundColor: 'rgba(0, 255, 163, 0.4)',
                borderRadius: 4,
                borderSkipped: false,
                barThickness: 30, // Fixed pixel width
                maxBarThickness: 30,
                hoverBackgroundColor: '#00FFA3',
                order: 2 // Bottom layer
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { left: 50, right: 20, top: 20, bottom: 20 }
        },
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
                    title: (context: any) => {
                        // Custom Date Format for Title: "29 janvier"
                        const index = context[0].dataIndex;
                        // Retrieve original date string if needed, or re-parse from label?
                        // The label is "Jan 29", we want "29 janvier".
                        // Let's reconstruct from the sorted dates logic or just format the context label if it was "Jan 29"
                        // EASIER: The generateChartData could return full date objects or strings.
                        // But here, let's just use the current date from the logic.
                        // Actually, I can pass the full date strings in a parallel array to dataset, or just parse the label "Jan 29" -> "29 Jan" 
                        // The user asked for "29 janvier".
                        try {
                            const label = context[0].label; // "YYYY-MM-DD"
                            const [y, m, d] = label.split('-').map(Number);
                            const months: Record<number, string> = {
                                1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
                                7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December"
                            };
                            return `${d} ${months[m] || label}`;
                        } catch (e) {
                            return context[0].label;
                        }
                    },
                    label: (context: any) => {
                        const index = context.dataIndex;
                        const dailyGain = context.parsed.y; // Y is now Daily Gain
                        const count = context.dataset.dailyCounts[index];
                        const total = context.dataset.cumulativeData[index]; // Total is passed as extra prop

                        return [
                            `أرباح اليوم : +${dailyGain.toLocaleString()}€`,
                            `إجمالي الأرباح حتى الآن : ${total.toLocaleString()}€`,
                            `${count} مبيعات`
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
                    padding: 10,
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
                // Fetch from Supabase API Bridge with NO-STORE to avoid cache issues
                const response = await fetch('/api/live/data?t=' + Date.now(), {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                const jsonData = await response.json();

                // Only update if we have valid data
                if (jsonData && jsonData.stats) {
                    setData(jsonData);
                }
            } catch (error) {
                console.error('Erreur chargement données:', error);
            }
        };

        // RUN IMMEDIATELY on mount to override any stale SSR data
        fetchData();

        const interval = setInterval(fetchData, 3000); // 3s polling for real-time feel
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

    if (live && live.places_disponibles > 0) {
        if (live.places_restantes >= 5) {
            urgenceStyle = {
                bg: "bg-yellow-500/20",
                border: "border-yellow-500",
                text: "text-yellow-500",
                message: `⚠️ أماكن محدودة اليوم - باقي ${live.places_restantes} أماكن فقط`,
                animate: false,
                icon: <PlayCircle className="w-6 h-6 text-yellow-500" />,
                progressColor: "bg-gradient-to-l from-yellow-500 to-amber-500"
            };
        } else if (live.places_restantes >= 3) {
            urgenceStyle = {
                bg: "bg-orange-600/20",
                border: "border-orange-500",
                text: "text-orange-500",
                message: `🔴 تحذير ! ${live.places_restantes} أماكن فقط !`,
                animate: true,
                icon: <AlertTriangle className="w-7 h-7 animate-pulse text-orange-500" />,
                progressColor: "bg-gradient-to-l from-orange-500 to-red-500"
            };
        } else if (live.places_restantes > 0) {
            urgenceStyle = {
                bg: "bg-red-600/30",
                border: "border-red-600",
                text: "text-red-500",
                message: live.places_restantes === 1 ? "🚨🚨 آخر مكان ! 🚨🚨" : "🔴🔴 مكانان فقط ! أسرع !",
                animate: true,
                icon: <AlertTriangle className="w-8 h-8 animate-ping text-red-500" />,
                progressColor: "bg-gradient-to-l from-red-600 to-red-500"
            };
        }
    }

    const progressPercent = live && live.places_disponibles > 0
        ? Math.min((live.places_prises / live.places_disponibles) * 100, 100)
        : 0;

    // Countdown Logic
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [urgencyLevel, setUrgencyLevel] = useState<'normal' | 'warning' | 'critical' | 'extreme'>('normal');

    useEffect(() => {
        if (!data.live_actuel?.heure_fin) return;

        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(data.live_actuel?.heure_fin || '');
            const diff = end.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("00:00:00");
                setUrgencyLevel('critical');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            setTimeLeft(formattedTime);

            // Set New Urgency Level based on User Request
            const totalMinutes = hours * 60 + minutes;
            if (totalMinutes < 5) {
                setUrgencyLevel('extreme'); // Red (Blink + Shake)
            } else if (totalMinutes < 10) {
                setUrgencyLevel('critical'); // Red (Blink)
            } else if (totalMinutes < 30) {
                setUrgencyLevel('warning'); // Orange (Fast Pulse)
            } else if (totalMinutes < 60) {
                setUrgencyLevel('normal'); // Yellow (Pulse)
            } else {
                setUrgencyLevel('normal'); // Green (Static)
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [data.live_actuel?.heure_fin]);

    // Dynamic styles for massive countdown
    const massiveStyle = (() => {
        const diff = data.live_actuel?.heure_fin ? (new Date(data.live_actuel.heure_fin).getTime() - new Date().getTime()) : 0;
        const totalMinutes = Math.floor(diff / (1000 * 60));

        if (totalMinutes < 5) {
            return {
                container: "border-[#ef4444] shadow-[0_0_60px_rgba(239,68,68,0.3)] bg-red-500/10",
                text: "text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]",
                animate: "animate-[timer-shake_0.5s_infinite,timer-urgent-blink_0.3s_infinite]",
                box: "bg-black/60 border-red-500/50",
                message: "🚨 آخر فرصة! الآن أو أبداً ! 🚨"
            };
        }
        if (totalMinutes < 10) {
            return {
                container: "border-[#ef4444] shadow-[0_0_40px_rgba(239,68,68,0.2)] bg-red-500/5",
                text: "text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]",
                animate: "animate-[timer-urgent-blink_0.5s_infinite]",
                box: "bg-black/40 border-red-500/30",
                message: "🚨 آخر فرصة! الآن أو أبداً ! 🚨"
            };
        }
        if (totalMinutes < 30) {
            return {
                container: "border-[#f97316] shadow-[0_0_30px_rgba(249,115,22,0.15)] bg-orange-500/5",
                text: "text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]",
                animate: "animate-[timer-pulse-fast_1s_infinite]",
                box: "bg-black/30 border-orange-500/30",
                message: "🔥 أسرع ! الوقت ينفذ ! 🔥"
            };
        }
        if (totalMinutes < 60) {
            return {
                container: "border-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.1)] bg-yellow-500/5",
                text: "text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]",
                animate: "animate-[timer-pulse_2s_infinite]",
                box: "bg-black/20 border-yellow-500/20",
                message: "⚠️ الوقت يمر بسرعة !"
            };
        }
        return {
            container: "border-[#22c55e]/30 bg-green-500/5",
            text: "text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]",
            animate: "",
            box: "bg-black/20 border-green-500/20",
            message: "لازال هناك وقت كافٍ"
        };
    })();

    const massiveLevelAnim = (level: string) => {
        switch (level) {
            case 'extreme': return "animate-[timer-shake_0.5s_infinite]";
            case 'critical': return "animate-pulse";
            default: return "";
        }
    };

    const [h, m, s] = timeLeft?.split(':') || ['00', '00', '00'];

    return (
        <div className="min-h-screen bg-[#050A14] text-white font-cairo p-6 lg:p-10 relative overflow-x-hidden">
            <style>{TIMER_ANIMATIONS}</style>

            <div className="max-w-[1600px] mx-auto space-y-8 pt-10">

                {/* BRAND HEADER */}
                <div className="flex justify-between items-center mb-0">
                    <div></div>
                    <div className="text-right">
                        <h1 className="text-2xl font-black tracking-wider font-orbitron text-white">
                            LEXMO<span className="text-[#00FFA3]">.AI</span>
                        </h1>
                    </div>
                </div>

                {/* MASSIVE AGGRESSIVE COUNTDOWN CONTAINER */}
                {timeLeft && (
                    <div className={`w-full rounded-[40px] border-4 p-8 lg:p-16 transition-all duration-500 relative overflow-hidden flex flex-col items-center ${massiveStyle.container} ${massiveStyle.animate}`}>
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                        {/* Top Badge */}
                        <div className="flex flex-col items-center mb-10 text-center relative z-10">
                            <h2 className={`text-2xl lg:text-4xl font-black mb-2 flex items-center gap-3 ${massiveStyle.text}`}>
                                <span className="animate-bounce">🔥</span>
                                أماكن محدودة اليوم
                                <span className="animate-bounce">🔥</span>
                            </h2>
                            <p className="text-white/40 font-mono text-sm tracking-[0.3em] uppercase">Live Session #30295</p>
                        </div>

                        {/* Main Timer Display */}
                        <div className="flex flex-col items-center w-full relative z-10">
                            <h3 className="text-white/60 text-lg lg:text-3xl font-bold uppercase tracking-[0.2em] mb-12 flex items-center gap-4">
                                <Clock className={massiveStyle.text} size={32} />
                                الوقت المتبقي للايڤ
                                <Clock className={massiveStyle.text} size={32} />
                            </h3>

                            <div className="flex items-center justify-center gap-4 md:gap-10 lg:gap-16 w-full max-w-6xl">
                                {/* Hours */}
                                <div className="flex flex-col items-center flex-1 max-w-[280px]">
                                    <div className={`w-full aspect-square md:aspect-[4/3] flex items-center justify-center rounded-3xl md:rounded-[40px] border-2 md:border-4 backdrop-blur-xl transition-all duration-300 ${massiveStyle.box}`}>
                                        <span className={`text-6xl md:text-8xl lg:text-[140px] font-black font-mono leading-none tracking-tighter ${massiveStyle.text}`}>
                                            {h}
                                        </span>
                                    </div>
                                    <span className="text-gray-400 text-sm md:text-2xl font-bold mt-4 uppercase tracking-wider font-cairo">ساعة</span>
                                </div>

                                <span className={`text-4xl md:text-7xl lg:text-[120px] font-black opacity-40 mb-10 animate-[timer-blink-dots_1s_infinite] ${massiveStyle.text}`}>:</span>

                                {/* Minutes */}
                                <div className="flex flex-col items-center flex-1 max-w-[280px]">
                                    <div className={`w-full aspect-square md:aspect-[4/3] flex items-center justify-center rounded-3xl md:rounded-[40px] border-2 md:border-4 backdrop-blur-xl transition-all duration-300 ${massiveStyle.box}`}>
                                        <span className={`text-6xl md:text-8xl lg:text-[140px] font-black font-mono leading-none tracking-tighter ${massiveStyle.text}`}>
                                            {m}
                                        </span>
                                    </div>
                                    <span className="text-gray-400 text-sm md:text-2xl font-bold mt-4 uppercase tracking-wider font-cairo">دقيقة</span>
                                </div>

                                <span className={`text-4xl md:text-7xl lg:text-[120px] font-black opacity-40 mb-10 animate-[timer-blink-dots_1s_infinite] ${massiveStyle.text}`}>:</span>

                                {/* Seconds */}
                                <div className="flex flex-col items-center flex-1 max-w-[280px]">
                                    <div className={`w-full aspect-square md:aspect-[4/3] flex items-center justify-center rounded-3xl md:rounded-[40px] border-2 md:border-4 backdrop-blur-xl transition-all duration-300 ${massiveStyle.box}`}>
                                        <span className={`text-6xl md:text-8xl lg:text-[140px] font-black font-mono leading-none tracking-tighter ${massiveStyle.text}`}>
                                            {s}
                                        </span>
                                    </div>
                                    <span className="text-gray-400 text-sm md:text-2xl font-bold mt-4 uppercase tracking-wider font-cairo">ثانية</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Warning and Progress */}
                        <div className="mt-16 w-full max-w-4xl flex flex-col items-center relative z-10">
                            <h4 className={`text-xl lg:text-4xl font-black mb-8 animate-pulse text-center ${massiveStyle.text}`}>
                                ⚠️ {massiveStyle.message} ⚠️
                            </h4>

                            {/* Progress Bar (Places) */}
                            <div className="w-full h-4 bg-black/40 rounded-full border border-white/10 overflow-hidden relative shadow-inner mb-2">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out absolute left-0 top-0 overflow-hidden ${urgenceStyle.progressColor}`}
                                    style={{ width: `${progressPercent}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[timer-shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                            <div className="flex justify-between w-full text-xs lg:text-lg font-black mt-2" dir="rtl">
                                <span className={massiveStyle.text}>{live?.places_restantes ?? 0} أماكن متبقية</span>
                                <span className="text-white/60">{progressPercent.toFixed(0)}% مكتمل</span>
                            </div>
                        </div>

                        {/* Shimmer Overlay */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                )}

                {/* MAIN GRID: 65% Graph / 35% Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">

                    {/* LEFT: Growth Chart */}
                    <div className="bg-[#0A0F1C] border border-white/10 rounded-3xl p-6 relative overflow-hidden group shadow-2xl">
                        {/* Title */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <span className="w-3 h-3 rounded-full bg-[#00FFA3] absolute animate-ping"></span>
                                    <span className="w-3 h-3 rounded-full bg-[#00FFA3] relative block"></span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">نمو الأرباح</h2>
                                    <p className="text-xs text-gray-400 font-mono">LIVE REVENUE TRACKER</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-[#00FFA3]/10 text-[#00FFA3] rounded-lg text-xs font-bold border border-[#00FFA3]/20">
                                +24% vs yesterday
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="h-[350px] w-full">
                            <Bar data={chartConfig as any} options={chartOptions as any} />
                        </div>
                    </div>

                    {/* RIGHT: Stacked Stat Cards */}
                    <div className="flex flex-col gap-6 h-full">

                        {/* TOP CARD: Total Profits */}
                        <div className="flex-1 bg-gradient-to-br from-[#111] to-[#050505] border border-[#FFD700]/30 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center items-center text-center group shadow-[0_0_30px_rgba(255,215,0,0.05)] hover:shadow-[0_0_50px_rgba(255,215,0,0.1)] transition-all">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                            <div className="absolute top-4 right-4 p-2 bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20 animate-bounce">
                                <Wallet className="w-6 h-6 text-[#FFD700]" />
                            </div>

                            <h3 className="text-[#FFD700] text-sm font-bold tracking-widest uppercase mb-4 opacity-80 font-cairo">إجمالي الأرباح اليوم</h3>

                            {/* Metallic Gold Text */}
                            <div
                                className="text-5xl lg:text-6xl font-black font-orbitron mb-4 whitespace-nowrap tracking-tighter"
                                style={{
                                    backgroundImage: 'linear-gradient(180deg, #FFD700 0%, #FDB931 50%, #9E7908 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    filter: 'drop-shadow(0 4px 20px rgba(255, 215, 0, 0.3))'
                                }}
                            >
                                <CountUp
                                    start={data.stats.total_gains}
                                    end={data.stats.total_gains}
                                    duration={0.5}
                                    separator=","
                                    suffix="€"
                                    preserveValue={true}
                                />
                            </div>

                            <div className="flex flex-col gap-1 items-center animate-pulse mb-6">
                                <span className="text-green-400 font-bold text-lg">+1,245€</span>
                                <span className="text-gray-500 text-xs uppercase tracking-widest font-cairo">آخر عملية بيع</span>
                            </div>

                            {/* MINI TIMER FOR STATS CARD */}
                            {timeLeft && (
                                <div className="w-full pt-4 border-t border-white/5 flex flex-col items-center">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-1 uppercase tracking-tighter">
                                        <Clock size={12} className={massiveStyle.text} />
                                        <span>ينتهي في :</span>
                                    </div>
                                    <div className={`text-2xl font-black font-mono tracking-tighter ${massiveStyle.text} ${massiveLevelAnim(urgencyLevel)}`}>
                                        {timeLeft}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* BOTTOM CARD: Sales Count */}
                        <div className="h-[160px] bg-[#0A0F1C] border border-white/10 rounded-3xl p-6 relative flex items-center justify-between group hover:border-[#00FFA3]/30 transition-colors shadow-lg">
                            <div>
                                <h3 className="text-white text-xl font-bold mb-1">عدد المبيعات</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-orbitron mb-2">SALES COUNT</p>
                                <div className="flex -space-x-3 rtl:space-x-reverse">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0A0F1C] flex items-center justify-center text-xs">👤</div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-[#00FFA3] border-2 border-[#0A0F1C] flex items-center justify-center text-[10px] font-bold text-black">+{data.stats.total_ventes}</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-5xl font-black text-white font-orbitron drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                    <CountUp
                                        start={data.stats.total_ventes}
                                        end={data.stats.total_ventes}
                                        duration={0.5}
                                        preserveValue={true}
                                    />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#00FFA3] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,163,0.4)] mt-2">
                                    <ShoppingBag className="w-5 h-5 text-black font-bold" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>



                {/* TRANSACTION TABLE */}
                <div className="bg-[#0A0F1C] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                        <h2 className="text-lg font-bold text-white">آخر المعاملات (Live)</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full" dir="rtl">
                            <thead>
                                <tr className="bg-black/20 border-b border-white/5">
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider font-orbitron">CLIENT</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider font-orbitron">DATE</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider font-orbitron">STATUS</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 font-cairo">الباقة</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 font-cairo">الربح</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.ventes.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No recent transactions
                                        </td>
                                    </tr>
                                ) : (
                                    data.ventes.map((vente, index) => {
                                        const packConfig = PACK_CONFIG[vente.pack];

                                        // 💡 FINAL ROBUST FIX: FORCE CSS IMAGES (FLAGS)
                                        // The user's Windows machine doesn't render Emojis correctly despite fonts.
                                        // We will map any input (AE, 🇦🇪, etc.) to a 2-letter code for the CSS library.

                                        // 💡 ABSOLUTE FINAL FIX: HANDLE EMOJI INPUTS
                                        // Problem: Input is likely "🇦🇪" (Emoji). Windows displays this as "AE" letters.
                                        // My previous regex rejected "🇦🇪" (len 4). So it showed fallback "🇦🇪" -> "AE".
                                        // Solution: Convert "🇦🇪" -> "ae" to use the Image CSS.

                                        const getTvFlagClass = (pays: string | undefined) => {
                                            if (!pays) return null;

                                            const str = pays.trim();

                                            // 1. Try ASCII direct (e.g. "AE", "fr")
                                            if (str.length === 2 && /^[a-zA-Z]+$/.test(str)) {
                                                return str.toLowerCase();
                                            }

                                            // 2. Try Emoji Map (Manual for common ones)
                                            // 🇦🇪 is typically \uD83C\uDDE6\uD83C\uDDEA in JS
                                            const emojiMap: Record<string, string> = {
                                                '🇦🇪': 'ae', '🇪🇸': 'es', '🇮🇹': 'it', '🇫🇷': 'fr', '🇺🇸': 'us',
                                                '🇩🇪': 'de', '🇳🇱': 'nl', '🇸🇪': 'se', '🇬🇧': 'gb', '🇨🇦': 'ca',
                                                '🇧🇪': 'be', '🇨🇭': 'ch', '🇲🇦': 'ma', '🇩🇿': 'dz', '🇹🇳': 'tn'
                                            };
                                            if (emojiMap[str]) return emojiMap[str];

                                            // 3. Smart Emoji-to-Code Converter (General Case)
                                            // Helper to convert Regional Indicator Sybmols to ASCII
                                            // 🇦 (0x1F1E6) - 127397 = 'a'
                                            if (Array.from(str).length === 2) { // 2 symbols (4 bytes)
                                                try {
                                                    const codePoints = Array.from(str).map(c => c.codePointAt(0)!);
                                                    if (codePoints.every(cp => cp >= 0x1F1E6 && cp <= 0x1F1FF)) {
                                                        const iso = String.fromCharCode(codePoints[0] - 127397) +
                                                            String.fromCharCode(codePoints[1] - 127397);
                                                        return iso.toLowerCase();
                                                    }
                                                } catch (e) { return null; }
                                            }

                                            return null;
                                        };

                                        const flagCode = getTvFlagClass(vente.pays || vente.codePays);
                                        const fallbackText = vente.pays || vente.codePays || "🌍";

                                        return (
                                            <tr
                                                key={index}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-6 py-5 align-middle">
                                                    <div className="flex items-center gap-4 flex-row-reverse justify-end">
                                                        <span className="text-gray-200 font-bold text-base font-inter tracking-wide group-hover:text-white transition-colors">
                                                            {vente.nom}
                                                        </span>

                                                        {/* 🚩 FINAL FIX: CSS IMAGE ONLY */}
                                                        {flagCode ? (
                                                            <span className={`fi fi-${flagCode} fis text-3xl rounded-md shadow-lg`} />
                                                        ) : (
                                                            <span className="text-3xl filter drop-shadow-md">{fallbackText}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-middle">
                                                    <div className="flex items-center gap-2 justify-end text-gray-400">
                                                        <span className="font-mono text-xs opacity-70">
                                                            {(() => {
                                                                const [y, m, d] = vente.date.split('-').map(Number);
                                                                const months: Record<number, string> = {
                                                                    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
                                                                    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
                                                                };
                                                                return `${d} ${months[m] || vente.date}`;
                                                            })()} • {vente.heure}
                                                        </span>
                                                        <Clock className="w-3 h-3 text-[#00FFA3]" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-middle">
                                                    <span className="inline-flex items-center justify-center h-6 px-3 rounded-full bg-[#00FFA3] text-black text-[10px] font-black uppercase tracking-wider font-inter shadow-[0_0_10px_rgba(0,255,163,0.4)]">
                                                        PAID
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 align-middle">
                                                    <div className="flex items-center gap-3 justify-end w-full">
                                                        <div className="flex flex-col items-end mr-1">
                                                            <span className="text-white text-sm font-bold mb-0.5">{packConfig.nameAr}</span>
                                                            <div className="flex items-center gap-1 text-xs">
                                                                <span className="text-gray-500 line-through decoration-white/30">{vente.prix}€</span>
                                                                <span className="text-gray-400">⬅️</span>
                                                                <span className="text-[#00FFA3] font-bold">{vente.gain}€</span>
                                                            </div>
                                                        </div>
                                                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${packConfig.color} shadow-lg text-white`}>
                                                            <span className="text-lg">{packConfig.icon}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-middle">
                                                    <span className="text-[#00FFA3] font-black text-xl font-orbitron tracking-wide text-shadow-glow">
                                                        +{vente.gain}€
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
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Orbitron:wght@400;700;900&display=swap');
                @import url('https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/css/flag-icons.min.css'); 
                
                .font-orbitron { font-family: 'Orbitron', sans-serif; }
                .font-inter { font-family: 'Inter', sans-serif; }
                .text-shadow-glow { text-shadow: 0 0 10px rgba(0, 255, 163, 0.5); }
                
                /* Force flag visibility */
                .fi {
                    background-size: cover;
                    background-position: center;
                    width: 1.5em; /* Explicit size */
                    height: 1.25em; /* Aspect ratio roughly */
                    display: inline-block;
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }
                .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
            `}</style>
        </div>
    );
}
