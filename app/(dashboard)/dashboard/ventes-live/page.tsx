"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Crown, Zap, CheckCircle } from 'lucide-react';
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

interface LiveNotification {
    id: number;
    message: string;
    icon: string;
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
    const [newSaleIds, setNewSaleIds] = useState<Set<number>>(new Set());
    const [notifications, setNotifications] = useState<LiveNotification[]>([]);
    const [notificationId, setNotificationId] = useState(0);

    // Generate cumulative earnings data for chart
    const generateChartData = () => {
        const days = 30;
        const labels = [];
        const cumulativeData = [];
        let cumulative = 0;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }));

            // Simulate growth
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
            easing: 'easeInOutQuart'
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/ventes-live.json?t=' + Date.now());
                const jsonData = await response.json();

                const previousCount = data.ventes.length;
                const newCount = jsonData.ventes.length;

                if (newCount > previousCount) {
                    const newIds = new Set<number>();
                    for (let i = previousCount; i < newCount; i++) {
                        newIds.add(i);

                        // Add live notification
                        const vente = jsonData.ventes[i];
                        addNotification(`${vente.nom} de ${vente.pays} vient de gagner €${vente.gain}!`);
                    }
                    setNewSaleIds(newIds);
                    setTimeout(() => setNewSaleIds(new Set()), 2000);
                }

                setData(jsonData);
            } catch (error) {
                console.error('Erreur chargement données:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000);

        // Simulate random notifications
        const notifInterval = setInterval(() => {
            const messages = [
                "Sarah de 🇸🇦 a atteint le statut Legend!",
                "Karim de 🇫🇷 vient de gagner €450!",
                "Ahmed de 🇲🇦 a débloqué un nouveau niveau!",
                "Leila de 🇹🇳 vient de parrainer 3 personnes!"
            ];
            addNotification(messages[Math.floor(Math.random() * messages.length)]);
        }, 8000);

        return () => {
            clearInterval(interval);
            clearInterval(notifInterval);
        };
    }, [data.ventes.length]);

    const addNotification = (message: string) => {
        const id = notificationId;
        setNotificationId(id + 1);
        setNotifications(prev => [...prev, { id, message, icon: '🎉' }]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const gainMoyen = data.stats.total_ventes > 0
        ? Math.round(data.stats.total_gains / data.stats.total_ventes)
        : 0;

    // Rank progression
    const currentRank = "Emperor";
    const nextMilestone = 15000;
    const progressPercent = Math.min((data.stats.total_gains / nextMilestone) * 100, 100);

    return (
        <div className="min-h-screen bg-[#050A14] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 font-orbitron">
                            المبيعات المباشرة
                        </h1>
                        <p className="text-gray-400">تتبع المبيعات في الوقت الفعلي</p>
                    </div>

                    {/* Live Badge */}
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </div>
                        <span className="text-red-500 font-bold text-sm">مباشر الآن</span>
                    </div>
                </div>

                {/* Rank Card */}
                <div className="mb-8 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="relative flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-yellow-500/50">
                                👑
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Votre Rang Actuel</p>
                                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                    {currentRank}
                                </h2>
                            </div>
                        </div>
                        <div className="flex-1 max-w-md">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progression vers Legend</span>
                                <span className="text-yellow-400 font-bold">{progressPercent.toFixed(0)}%</span>
                            </div>
                            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-500 text-xs mt-1">
                                {(nextMilestone - data.stats.total_gains).toLocaleString()}€ restants
                            </p>
                        </div>
                    </div>
                </div>

                {/* Growth Chart */}
                <div className="mb-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Croissance des Gains</h2>
                        <div className="flex items-center gap-2 text-green-400">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-bold">+{Math.round((chartData.data[chartData.data.length - 1] / chartData.data[0] - 1) * 100)}%</span>
                        </div>
                    </div>
                    <div className="h-64">
                        <Line data={chartConfig} options={chartOptions} />
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-gray-400 text-sm mb-1 text-right">إجمالي الأرباح</p>
                            <p className="text-3xl font-bold text-white text-right font-orbitron">
                                {data.stats.total_gains.toLocaleString()}€
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-1 text-right">عدد المبيعات</p>
                            <p className="text-3xl font-bold text-white text-right font-orbitron">
                                {data.stats.total_ventes}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/50 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-1 text-right">متوسط الربح</p>
                            <p className="text-3xl font-bold text-white text-right font-orbitron">
                                {gainMoyen.toLocaleString()}€
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="mb-8 flex justify-center">
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full font-bold text-lg text-black shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/80 transition-all transform hover:scale-105 animate-pulse">
                        <span className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Activer Mes Commissions
                            <Zap className="w-5 h-5" />
                        </span>
                    </button>
                </div>

                {/* Sales Table */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-bold text-white text-right">آخر المعاملات</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full" dir="rtl">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">التاريخ</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">العميل</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">الباقة</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">السعر</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">ربحك</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {data.ventes.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            لا توجد مبيعات حتى الآن...
                                        </td>
                                    </tr>
                                ) : (
                                    data.ventes.map((vente, index) => {
                                        const packConfig = PACK_CONFIG[vente.pack];
                                        const isNew = newSaleIds.has(index);

                                        return (
                                            <tr
                                                key={index}
                                                className={`transition-all duration-500 ${isNew
                                                    ? 'bg-green-500/20 animate-pulse'
                                                    : 'hover:bg-gray-800/30'
                                                    }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-300">
                                                        <div className="font-medium">{vente.date || '26 Jan'}</div>
                                                        <div className="text-xs text-gray-500">{vente.heure}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 flex-row-reverse">
                                                        <span className="text-white font-medium">{vente.nom}</span>
                                                        <span className="text-2xl">{vente.pays}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${packConfig.bgColor} border ${packConfig.borderColor}`}>
                                                        <span>{packConfig.icon}</span>
                                                        <span className="text-white font-medium">{packConfig.nameAr}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white font-bold font-orbitron">
                                                    {vente.prix.toLocaleString()}€
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-green-400 font-bold font-orbitron">
                                                        +{vente.gain.toLocaleString()}€
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Payé
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

                {/* Live Notifications */}
                <div className="fixed bottom-6 left-6 z-50 space-y-3 max-w-sm">
                    {notifications.map(notif => (
                        <div
                            key={notif.id}
                            className="bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-xl p-4 shadow-2xl animate-slide-in-left"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{notif.icon}</span>
                                <p className="text-white text-sm font-medium">{notif.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes slide-in-left {
                    from {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}
