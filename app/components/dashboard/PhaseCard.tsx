import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import Card from "./Card";

interface PhaseCardProps {
    id: number;
    title: string;
    subtitle?: string;
    progress: number; // 0 to 100
    totalModules: number;
    completedModules: number;
    isLocked?: boolean;
    color?: string;
}

export default function PhaseCard({
    id,
    title,
    subtitle,
    progress,
    totalModules,
    completedModules,
    isLocked,
    color = "#00d2ff"
}: PhaseCardProps) {
    return (
        <Link href={isLocked ? "#" : `/dashboard/phases/${id}`} className={isLocked ? "pointer-events-none opacity-60 grayscale-[0.5]" : ""}>
            <Card className="group hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                                backgroundColor: isLocked ? "#1f2937" : `${color}15`,
                                color: isLocked ? "#9ca3af" : color
                            }}
                        >
                            {isLocked ? "🔒 مرحلة مغلقة" : `PHASE ${id}`}
                        </span>
                        {progress === 100 && (
                            <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">✅ مكتمل</span>
                        )}
                        {!isLocked && progress < 100 && (
                            <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">🔓 متاح</span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold mb-1 group-hover:text-[#C9A84C] transition-colors">{title}</h3>
                    {subtitle && <p className="text-sm text-[#64607A] mb-4 font-cairo">{subtitle}</p>}
                </div>

                <div className="mt-auto">
                    <div className="flex justify-between text-xs text-[#64607A] mb-2 font-medium">
                        <span>{progress}% مكتمل</span>
                        <span>{completedModules}/{totalModules} وحدة</span>
                    </div>
                    <div className="h-2 w-full bg-[#E8E0D4] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: color
                            }}
                        />
                    </div>

                    <div className="flex justify-end mt-4">
                        <button className={isLocked ? "text-gray-400 font-bold text-sm" : "flex items-center gap-2 text-sm font-bold text-[#1A1A2E] group-hover:gap-3 transition-all"}>
                            {isLocked ? "أكمل المرحلة السابقة 🔒" : "بدء التعلم"}
                            {!isLocked && <ArrowLeft size={16} className="text-[#C9A84C]" />}
                        </button>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
