"use client";

import { useEffect, useState } from 'react';
import { DollarSign, Wallet } from 'lucide-react';
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
                backgroundColor: 'rgba(0, 255, 163, 0.1)',
                borderWidth: 3,
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
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#00FFA3',
                bodyColor: '#fff',
                borderColor: '#00FFA3',
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
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6B7280',
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 8
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6B7280',
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

    return (
        <div className="min-h-screen bg-[#050A14] p-8 font-cairo">
            <div className="max-w-[1920px] mx-auto">
                {/* SECTION 1: TOP SPLIT - Graph (65%) + Earnings (35%) */}
                <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 mb-8">

                    {/* LEFT: Growth Chart */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 text-right">نمو الأرباح</h2>
                        <div className="h-80">
                            <Line data={chartConfig} options={chartOptions} />
                        </div>
                    </div>

                    {/* RIGHT: Affiliate Earnings Card */}
                    <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-yellow-500/50 rounded-2xl p-8 flex flex-col justify-center items-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
                        <div className="relative text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Wallet className="w-10 h-10 text-yellow-400" />
                                <h3 className="text-2xl font-bold text-white">أرباح الإحالة</h3>
                            </div>
                            <p className="text-sm text-gray-400 uppercase tracking-wider mb-6">TOTAL PAID COMMISSION</p>
                            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 mb-2 font-orbitron">
                                {data.stats.total_gains.toLocaleString()}€
                            </div>
                            <div className="flex items-center justify-center gap-2 text-green-400 text-lg">
                                <DollarSign className="w-5 h-5" />
                                <span className="font-bold">{data.stats.total_ventes} SALES</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Transactions Table */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-2xl font-bold text-white text-right">آخر المعاملات</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full" dir="rtl">
                            <thead className="bg-gray-800/70">
                                <tr>
                                    <th className="px-6 py-4 text-right text-base font-bold text-gray-200">العميل</th>
                                    <th className="px-6 py-4 text-right text-base font-bold text-gray-200">التاريخ</th>
                                    <th className="px-6 py-4 text-right text-base font-bold text-gray-200">الحالة</th>
                                    <th className="px-6 py-4 text-right text-base font-bold text-gray-200">الباقة</th>
                                    <th className="px-6 py-4 text-right text-base font-bold text-gray-200">الربح</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
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
                                            <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                                                {/* Client with Flag */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3 flex-row-reverse">
                                                        <span className="text-white font-medium text-lg">{vente.nom}</span>
                                                        <span className="text-3xl">{vente.pays}</span>
                                                    </div>
                                                </td>

                                                {/* Date Only */}
                                                <td className="px-6 py-5">
                                                    <span className="text-gray-300 font-medium text-lg">{vente.date}</span>
                                                </td>

                                                {/* Status in English */}
                                                <td className="px-6 py-5">
                                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 text-sm font-bold uppercase tracking-wide">
                                                        PAID
                                                    </span>
                                                </td>

                                                {/* Package in Arabic */}
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${packConfig.bgColor} border ${packConfig.borderColor}`}>
                                                        <span className="text-xl">{packConfig.icon}</span>
                                                        <span className="text-white font-medium text-base">{packConfig.nameAr}</span>
                                                    </span>
                                                </td>

                                                {/* Profit */}
                                                <td className="px-6 py-5">
                                                    <span className="text-green-400 font-bold text-xl font-orbitron">
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
    );
}
