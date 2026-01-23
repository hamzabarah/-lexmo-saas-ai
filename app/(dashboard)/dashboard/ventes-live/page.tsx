"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

interface Vente {
    heure: string;
    nom: string;
    pays: string;
    pack: 'Spark' | 'Emperor' | 'Legend';
    prix: number;
    gain: number;
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
    const [newSaleIds, setNewSaleIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/ventes-live.json?t=' + Date.now());
                const jsonData = await response.json();

                // Detect new sales for animation
                const previousCount = data.ventes.length;
                const newCount = jsonData.ventes.length;

                if (newCount > previousCount) {
                    const newIds = new Set<number>();
                    for (let i = previousCount; i < newCount; i++) {
                        newIds.add(i);
                    }
                    setNewSaleIds(newIds);

                    // Remove animation after 2 seconds
                    setTimeout(() => setNewSaleIds(new Set()), 2000);
                }

                setData(jsonData);
            } catch (error) {
                console.error('Erreur chargement données:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [data.ventes.length]);

    const gainMoyen = data.stats.total_ventes > 0
        ? Math.round(data.stats.total_gains / data.stats.total_ventes)
        : 0;

    return (
        <div className="min-h-screen bg-[#030712] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with Live Badge */}
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

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Gains */}
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

                    {/* Total Sales */}
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

                    {/* Average Gain */}
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

                {/* Sales Table */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-bold text-white text-right">آخر المعاملات</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full" dir="rtl">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">الوقت</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">العميل</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">الباقة</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">السعر</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">ربحك</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {data.ventes.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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
                                                <td className="px-6 py-4 text-gray-300 font-mono">
                                                    {vente.heure}
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
                                                    <span className="text-green-500 font-bold font-orbitron">
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
