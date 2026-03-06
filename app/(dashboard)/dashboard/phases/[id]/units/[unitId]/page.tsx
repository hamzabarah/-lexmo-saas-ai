import Link from "next/link";
import { ArrowLeft, ArrowRight, PlayCircle, Lock, BookOpen } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import Card from "@/app/components/dashboard/Card";
import { getUnitDetails } from "@/app/actions/course";

export default async function UnitDetailPage({ params }: { params: Promise<{ id: string, unitId: string }> }) {
    const { id, unitId } = await params;
    const phaseNumber = parseInt(id);
    const unitNumber = parseInt(unitId);

    // Fetch Unit and its Lessons
    const unit = await getUnitDetails(phaseNumber, unitNumber);

    if (!unit) {
        return <div className="p-8 text-center text-gray-500">الوحدة غير موجودة</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href={`/dashboard/phases/${phaseNumber}`}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowRight size={16} />
                    <span>العودة للوحدات</span>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="bg-[#008060]/10 text-[#008060] px-3 py-1 rounded-full text-xs font-mono border border-[#008060]/20">
                        {unit.badge}
                    </span>
                </div>
            </div>

            <DashboardHeader
                title={`${unit.module_number}. ${unit.title_ar}`}
                subtitle={unit.title_en}
            />

            {/* Profit Scenario / Objective Card if exists */}
            {(unit.objective_ar || unit.expected_result_ar) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#008060]/5 border border-[#008060]/10 p-4 rounded-xl">
                        <h4 className="text-[#008060] font-bold text-sm mb-2 flex items-center gap-2">
                            <BookOpen size={16} /> سيناريو الربح
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {unit.objective_ar || "..."}
                        </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-xl">
                        <h4 className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
                            <BookOpen size={16} /> النتيجة المتوقعة
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {unit.expected_result_ar || "..."}
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-[#008060]">📚</span> الدروس ({unit.lessons.length})
                </h3>

                <div className="grid gap-3">
                    {unit.lessons.map((lesson: any, index: number) => {
                        const isAvailable = !lesson.is_locked;
                        const lessonUrl = isAvailable
                            ? `/dashboard/phases/${phaseNumber}/units/${unitNumber}/lessons/${lesson.lesson_number}`
                            : "#";

                        return (
                            <Link
                                key={lesson.id}
                                href={lessonUrl}
                                className={!isAvailable ? "pointer-events-none" : ""}
                            >
                                <div className={`
                                    flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                                    ${isAvailable
                                        ? "bg-[#f4f6f8] border-gray-200 hover:border-[#008060]/30 hover:bg-[#008060]/5 cursor-pointer"
                                        : "bg-[#f4f6f8]/50 border-gray-200 opacity-50 grayscale"
                                    }
                                `}>
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                            ${isAvailable ? "bg-[#008060]/10 text-[#008060]" : "bg-gray-100 text-gray-600"}
                                        `}>
                                            {isAvailable ? <PlayCircle size={20} /> : <Lock size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-gray-900 font-medium mb-0.5">
                                                الدرس {lesson.lesson_number}: {lesson.title_ar}
                                            </h4>
                                            <p className="text-xs text-gray-500 font-mono">
                                                {lesson.title_en}
                                            </p>
                                        </div>
                                    </div>

                                    {isAvailable && (
                                        <ArrowLeft size={18} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}

                    {unit.lessons.length === 0 && (
                        <div className="p-8 text-center border border-dashed border-gray-200 rounded-xl text-gray-500">
                            لا توجد دروس في هذه الوحدة بعد.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
