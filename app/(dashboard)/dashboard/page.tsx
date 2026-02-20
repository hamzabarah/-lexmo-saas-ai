import ProgressCircle from "@/app/components/dashboard/ProgressCircle";
import { DollarSign, BookOpen, Trophy, Target } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import StatCard from "@/app/components/dashboard/StatCard";
import Card from "@/app/components/dashboard/Card";
import PhaseCard from "@/app/components/dashboard/PhaseCard";
import { getPhases } from "@/app/actions/course";

export default async function DashboardPage() {
    const phases = await getPhases();

    // Determine current phase (e.g. first unlocked phase or last active)
    // For now, let's assume Phase 1 is current, and show next few generally.
    const currentPhase = phases.find(p => p.phase_number === 1) || phases[0];
    const nextPhases = phases.filter(p => p.phase_number > 1 && p.phase_number <= 3);

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white font-cairo mb-2">مرحباً، محمد! 👋</h1>
                    <div className="flex items-center gap-2">
                        <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            مستوى المبتدئ 🌱
                        </span>
                        <span className="text-gray-500 text-sm">|</span>
                        <span className="text-gray-400 text-sm">عضو منذ 3 أيام</span>
                    </div>
                </div>
                <div className="hidden md:block">
                    {/* Search placeholder removed for cleaner look or kept if needed separately */}
                </div>
            </div>

            {/* Top Grid: Progress Circle + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Progress Circle Card */}
                <Card className="flex items-center justify-center py-8">
                    <ProgressCircle
                        percentage={12}
                        completed={18}
                        total={150}
                        size={200}
                    />
                </Card>

                {/* Stats Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard
                        title="إجمالي الأرباح"
                        value="€0"
                        icon={DollarSign}
                        trend=""
                        trendUp={true}
                        color="#ffd700"
                    />
                    <StatCard
                        title="الوحدات المكتملة"
                        value="18/150"
                        icon={BookOpen}
                        color="#00d2ff"
                    />
                    <StatCard
                        title="الترتيب الحالي"
                        value="#-"
                        icon={Trophy}
                        color="#9d50bb"
                    />
                    <StatCard
                        title="الهدف القادم"
                        value="$10k"
                        icon={Target}
                        color="#10b981"
                    />
                </div>
            </div>

            {/* Current Phase & Next Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Left Column: Progress */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold mb-4">المرحلة الحالية</h2>
                        {currentPhase && (
                            <PhaseCard
                                id={currentPhase.phase_number}
                                title={`${currentPhase.title_en}`}
                                subtitle={currentPhase.title_ar}
                                progress={65} // Mock progress
                                totalModules={currentPhase.total_modules}
                                completedModules={8} // Mock completed
                                isLocked={currentPhase.is_locked}
                                color={currentPhase.color || "#09090b"}
                            />
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">المسار الدراسي</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {nextPhases.map(phase => (
                                <PhaseCard
                                    key={phase.id}
                                    id={phase.phase_number}
                                    title={`${phase.title_en}`}
                                    subtitle={phase.title_ar}
                                    progress={0}
                                    totalModules={phase.total_modules}
                                    completedModules={0}
                                    isLocked={phase.is_locked}
                                    color={phase.color || "#09090b"}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Affiliate Mini & Announcements */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-[#9d50bb]/20 to-[#030712]">
                        <h3 className="text-lg font-bold mb-2">برنامج الشراكة 🚀</h3>
                        <p className="text-gray-400 text-sm mb-4">شارك رابطك واربح 70% عمولة على كل مبيعة.</p>
                        <div className="bg-[#030712]/50 p-3 rounded-lg flex items-center justify-between mb-4 border border-white/10">
                            <span className="text-sm text-gray-300 truncate">lexmo.ai/ref/mohammed</span>
                            <button className="text-xs text-[#00d2ff] font-bold">نسخ</button>
                        </div>
                        <button className="w-full bg-[#9d50bb] hover:bg-[#8e44ad] text-white py-2 rounded-lg font-bold transition-colors">
                            الذهاب لصفحة الأرباح
                        </button>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold mb-2">تنبيهات 📢</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] mt-2 shrink-0"></span>
                                <span className="text-gray-300">تم تحديث المرحلة 3 (System Building) بمحتوى جديد.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0"></span>
                                <span className="text-gray-300">لقاء Zoom مباشر يوم الخميس القادم.</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </>
    );
}
