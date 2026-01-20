"use client";

import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import Card from "@/app/components/dashboard/Card";
import { Download, Lock, Star, Shield, Zap, Target, Briefcase } from "lucide-react";

// Bonus Categories Data
const BONUS_CATEGORIES = [
    { title: "🟠 مسرعات المرحلة الأولى", color: "#f97316", items: [1, 2, 3, 4] },
    { title: "🔵 دروع الحماية", color: "#3b82f6", items: [5, 6, 7, 8] },
    { title: "🟣 صناعة المحتوى", color: "#a855f7", items: [9, 10, 11, 12] },
    { title: "🔷 الترسانة الإعلانية", color: "#00d2ff", items: [13, 14, 15, 16] },
    { title: "🟢 القوة الصناعية", color: "#10b981", items: [17, 18, 19, 20] },
    { title: "🟡 النخبة والمستقبل", color: "#ffd700", items: [21, 22, 23, 24, 25, 26, 27, 28] }
];

export default function BonusesPage() {
    return (
        <>
            <DashboardHeader title="الهدايا والمكافآت 🎁" subtitle="أدوات وموارد حصرية بقيمة $60,000+ مجاناً لك" />

            <div className="space-y-10">
                {BONUS_CATEGORIES.map((category, catIndex) => (
                    <section key={catIndex}>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-white/5 pb-2">
                            <span className="w-2 h-8 rounded-full" style={{ backgroundColor: category.color }}></span>
                            {category.title}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {category.items.map((item, i) => (
                                <Card key={item} className="group hover:-translate-y-1 transition-transform duration-300">
                                    <div className="absolute top-3 left-3 z-20">
                                        <span className="bg-[#ffd700] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
                                            <Star size={10} fill="black" />
                                            قيمة: $997
                                        </span>
                                    </div>

                                    <div className="h-32 bg-white/5 rounded-xl mb-4 flex items-center justify-center text-gray-700 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                                        <GiftIcon index={catIndex} size={32} color={category.color} opacity={0.5} />
                                    </div>

                                    <h3 className="text-base font-bold mb-2 group-hover:text-white transition-colors">عنوان الهدية المميزة رقم {item}</h3>

                                    <div className="mt-4">
                                        <button
                                            className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${item > 4 ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5' : 'bg-[#00d2ff]/10 text-[#00d2ff] hover:bg-[#00d2ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,210,255,0.4)]'}`}
                                        >
                                            {item > 4 ? (
                                                <>
                                                    <Lock size={14} />
                                                    <span>🔒 يفتح في المرحلة {Math.ceil(item / 2)}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={14} />
                                                    <span>🔓 متاح للتحميل</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </>
    );
}

function GiftIcon({ index, size, color, opacity }: { index: number, size: number, color: string, opacity: number }) {
    const icons = [Zap, Shield, Briefcase, Target, Star, Star];
    const Icon = icons[index % icons.length];
    return <Icon size={size} style={{ color, opacity }} />;
}
