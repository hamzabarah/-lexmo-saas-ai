import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default async function StepDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const stepNumber = parseInt(id);

    return (
        <>
            <div className="mb-8">
                <Link href="/dashboard/phases" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowRight size={16} />
                    <span>العودة للدروس</span>
                </Link>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="w-20 h-20 bg-[#00d2ff]/10 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-[#00d2ff]" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">المرحلة {stepNumber}</h1>
                <p className="text-gray-400 text-lg">المحتوى قيد الإعداد... قريباً</p>
            </div>
        </>
    );
}
