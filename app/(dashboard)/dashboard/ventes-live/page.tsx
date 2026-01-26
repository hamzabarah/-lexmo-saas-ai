"use client";

import { useEffect, useState } from 'react';
import { Wallet, ShoppingBag, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
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
    pays: string;
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

const PACK_CONFIG = {
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

    // Generate cumulative earnings data for chart
    const generateChartData = () => {
        const days = 30;
        const labels = [];
        const cumulativeData = [];
        let cumulative = 0;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' }));

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
                backgroundColor: 'rgba(0, 255, 163, 0.15)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#00FFA3',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3,
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
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#00FFA3',
                bodyColor: '#fff',
                borderColor: '#00FFA3',
                borderWidth: 2,
                padding: 16,
                displayColors: false,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 16,
                    weight: 'bold'
                },
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
                    color: '#4B5563',
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 8,
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.02)',
                    drawBorder: false
                },
                ticks: {
                    color: '#4B5563',
                    font: {
                        size: 11
                    },
                    callback: (value: any) => `${value.toLocaleString()}€`
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart' as const
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

    const avgOrder = data.stats.total_ventes > 0
        ? Math.round(data.stats.total_gains / data.stats.total_ventes)
        : 0;

    return (
        <div className="min-h-screen bg-[#03060D] p-8 font-cairo">
            <div className="max-w-[1920px] mx-auto">

                {/* LUXMO HEADER - Crypto Terminal Style */}
                <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 mb-8">

                    {/* LEFT COLUMN: Growth Chart */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm uppercase tracking-widest text-gray-500 font-bold">نمو الأرباح</h2>
                                <div className="flex items-center gap-2 text-[#00FFA3]">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs font-bold">LIVE</span>
                                </div>
                            </div>
                            <div className="h-80" style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 163, 0.3))' }}>
                                <Line data={chartConfig} options={chartOptions} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Wealth Panel */}
                    <div className="flex flex-col gap-6">

                        {/* BLOCK A: Total Profits (The Hero) */}
                        <div className="relative group flex-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-[#FFA500]/20 to-[#FFD700]/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative bg-black/60 backdrop-blur-2xl border-2 border-[#FFD700]/30 rounded-2xl p-8 shadow-2xl flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/50">
                                        <Wallet className="w-5 h-5 text-black" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">TOTAL COMMISSION</p>
                                        <h3 className="text-base font-bold text-white">إجمالي الأرباح</h3>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div
                                        className="text-6xl font-black mb-2 font-orbitron"
                                        style={{
                                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))'
                                        }}
                                    >
                                        {data.stats.total_gains.toLocaleString()}€
                                    </div>
                                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* BLOCK B: Sales Details (2 Cards) */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* Card 1: Sales Count */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[#00FFA3]/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-[#00FFA3]/30 transition-all">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ShoppingBag className="w-4 h-4 text-[#00FFA3]" />
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">SALES</p>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-2">عدد المبيعات</p>
                                    <p className="text-3xl font-black text-white font-orbitron">{data.stats.total_ventes}</p>
                                </div>
                            </div>

                            {/* Card 2: Average Order */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-purple-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-purple-500/30 transition-all">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-4 h-4 text-purple-400" />
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">AVG</p>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-2">متوسط السلة</p>
                                    <p className="text-3xl font-black text-white font-orbitron">{avgOrder}€</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-black/50 to-transparent">
                            <h2 className="text-xl font-bold text-white text-right">آخر المعاملات</h2>
                            <p className="text-xs text-gray-500 text-right mt-1 uppercase tracking-wide">RECENT TRANSACTIONS</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full" dir="rtl">
                                <thead className="bg-black/60">
                                    <tr>
                                        <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-bold text-gray-400">العميل</th>
                                        <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-bold text-gray-400">التاريخ</th>
                                        <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-bold text-gray-400">الحالة</th>
                                        <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-bold text-gray-400">الباقة</th>
                                        <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-bold text-gray-400">الربح</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data.ventes.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-lg">
                                                لا توجد مبيعات حتى الآن...
                                            </td>
                                        </tr>
                                    ) : (
                                        data.ventes.map((vente, index) => {
                                            const packConfig = PACK_CONFIG[vente.pack];

                                            return (
                                                <tr key={index} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3 flex-row-reverse">
                                                            <span className="text-white font-medium text-base">{vente.nom}</span>
                                                            <span className="text-2xl">{vente.pays}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-gray-400 font-medium text-sm">{vente.date}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/30 text-[#00FFA3] text-xs font-bold uppercase tracking-wide">
                                                            PAID
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${packConfig.bgColor} border ${packConfig.borderColor}`}>
                                                            <span className="text-lg">{packConfig.icon}</span>
                                                            <span className="text-white font-medium text-sm">{packConfig.nameAr}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-[#00FFA3] font-bold text-lg font-orbitron">
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
            </div>
        </div>
    );
}
