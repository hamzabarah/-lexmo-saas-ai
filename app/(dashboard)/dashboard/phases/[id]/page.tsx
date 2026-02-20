import Link from "next/link";
import { ArrowRight, PlayCircle, CheckCircle2, Lock } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import Card from "@/app/components/dashboard/Card";
import { getPhaseDetails } from "@/app/actions/course";

export default async function PhaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const phaseNumber = parseInt(id);
    const phase = await getPhaseDetails(phaseNumber);

    if (!phase) {
        return <div className="p-8 text-center text-gray-400">المرحلة غير موجودة</div>;
    }

    const isLocked = phase.is_locked;

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <Link href="/dashboard/phases" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowRight size={16} />
                    <span>العودة للمراحل</span>
                </Link>
                <DashboardHeader title={`${phase.title_ar}: ${phase.title_en}`} subtitle={phase.description_ar} />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {phase.units?.map((unit: any, i: number) => {
                    // TODO: In a real scenario, we'd also fetch user progress for the phase view
                    // For now we just show availability based on lock status
                    const isCompleted = false;
                    const isAvailable = !unit.is_locked;

                    return (
                        <Link
                            key={unit.id}
                            href={isAvailable ? `/dashboard/phases/${phase.phase_number}/units/${unit.module_number}` : "#"}
                            className={!isAvailable ? "pointer-events-none" : ""}
                        >
                            <Card className={`transition-colors group cursor-pointer ${isAvailable ? "hover:border-[#00d2ff]/50" : "opacity-60 grayscale-[0.5]"}`}>
                                <div className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCompleted ? "bg-green-500/10 text-green-500" : "bg-[#00d2ff]/10 text-[#00d2ff]"}`}>
                                            {isCompleted ? <CheckCircle2 size={24} /> : <PlayCircle size={24} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-[#00d2ff] bg-[#00d2ff]/10 px-2 py-0.5 rounded">
                                                    {unit.badge || `UNIT ${unit.module_number}`}
                                                </span>
                                                {isAvailable && <span className="text-xs text-gray-400">{unit.lessons_count || 0} درس</span>}
                                            </div>
                                            <h3 className="font-bold text-lg group-hover:text-[#00d2ff] transition-colors">
                                                {unit.module_number}. {unit.title_ar}
                                            </h3>
                                            <p className="text-sm text-gray-400/80 mt-1 line-clamp-1">
                                                {unit.objective_ar || unit.title_en}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {/* Progress Placeholder - could be calculated later */}
                                        <div className="hidden md:block text-right">
                                            <span className="text-xs text-gray-500 block">التقدم</span>
                                            <span className="text-sm font-mono text-[#00d2ff]">0%</span>
                                        </div>
                                        {isAvailable ?
                                            <ArrowRight size={20} className="text-gray-500 group-hover:text-[#00d2ff] group-hover:-translate-x-1 transition-all" />
                                            : <Lock size={20} className="text-gray-600" />
                                        }
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
