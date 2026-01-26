"use client";

import { useEffect, useState } from 'react';
import { Wallet, ShoppingBag, TrendingUp, CheckCircle, Clock } from 'lucide-react';
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

interface VentesData {
    ventes: Vente[];
    stats: {
        total_gains: number;
        total_ventes: number;
    };
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
    const [data, setData] = useState<VentesData>({ ventes: [], stats: { total_gains: 0, total_ventes: 0 } });

    // Generate cumulative earnings data for chart with ENGLISH labels
    const generateChartData = () => {
        const days = 30;
        const labels = [];
        const cumulativeData = [];
        let cumulative = 0;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            // English locale for labels: Jan 26
            labels.push(date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));

            cumulative += Math.random() * 500 + 200;
            cumulativeData.push(Math.round(cumulative));
        }

        return { labels, data: cumulativeData };
    };

    const chartData = generateChartData();

    const chartConfig = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Gains Cumulés',
                data: chartData.data,
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
                backgroundColor: 'rgba(5, 10, 20, 0.9)',
                titleColor: '#00FFA3',
                titleFont: { family: 'Inter', size: 13 },
                bodyColor: '#fff',
                bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context: any) => `${context.parsed.y.toLocaleString()}€`
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
                    color: '#6B7280', // Grey text for English labels
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
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#050A14] text-white font-cairo p-6 lg:p-10">
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* BRAND HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        {/* Optional: Add a page title or breadcrumb if needed, keeping it clean for now */}
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-black tracking-wider font-orbitron text-white">
                            LEXMO<span className="text-[#00FFA3]">.AI</span>
                        </h1>
                    </div>
                </div>

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
                                className="text-6xl lg:text-7xl font-black font-orbitron mb-2"
                                style={{
                                    backgroundImage: 'linear-gradient(180deg, #FFD700 0%, #FDB931 50%, #9E7908 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    filter: 'drop-shadow(0 2px 10px rgba(255, 215, 0, 0.2))'
                                }}
                            >
                                <CountUp
                                    end={data.stats.total_gains}
                                    duration={2.5}
                                    separator=","
                                    suffix="€"
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
                                        end={data.stats.total_ventes}
                                        duration={2}
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
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3 flex-row-reverse justify-end">
                                                        <span className="text-gray-200 font-medium text-sm font-inter">{vente.nom}</span>
                                                        <span className={`fi fi-${vente.codePays} fis rounded-full text-xl shadow-lg border border-white/10`} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 justify-end text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        <span className="font-mono text-sm">{vente.date || '26 Jan'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20 text-[10px] font-bold uppercase tracking-wider font-inter">
                                                        PAID
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <span className="text-gray-500 font-mono text-xs">({vente.prix.toLocaleString()}€)</span>
                                                        <span className="text-gray-300 text-sm font-medium">{packConfig.nameAr}</span>
                                                        <span className="text-base">{packConfig.icon}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[#00FFA3] font-bold text-base font-orbitron">
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
            `}</style>
        </div>
    );
}
