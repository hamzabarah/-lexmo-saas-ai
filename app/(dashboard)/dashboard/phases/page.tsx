'use client';

import { useEffect, useState } from 'react';
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import PhaseCard from "@/app/components/dashboard/PhaseCard";
import { getPhases } from "@/app/actions/course";
import { checkUserSubscription, SubscriptionCheckResult } from "@/lib/check-subscription";
import { Lock, Mail } from 'lucide-react';

export default function PhasesPage() {
    const [subscriptionCheck, setSubscriptionCheck] = useState<SubscriptionCheckResult | null>(null);
    const [phases, setPhases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const ADMIN_EMAIL = 'academyfrance75@gmail.com';

    useEffect(() => {
        async function checkAccess() {
            try {
                const result = await checkUserSubscription();
                setSubscriptionCheck(result);

                const phasesData = await getPhases();
                setPhases(phasesData);
            } catch (error) {
                console.error('Error checking access:', error);
            } finally {
                setLoading(false);
            }
        }

        checkAccess();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-[#64607A] text-lg">جاري التحميل...</div>
            </div>
        );
    }

    // Show blocking message if user doesn't have access
    if (!subscriptionCheck?.hasAccess) {
        return (
            <>
                <DashboardHeader title="مسار التعلم (11 مرحلة) 🎓" subtitle="أكمل المراحل بالترتيب للوصول إلى هدفك" />

                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="bg-white border border-[#E8E0D4] rounded-2xl p-12 max-w-2xl text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                        {/* Lock Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                                <Lock className="w-10 h-10 text-red-500" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">
                            الوصول مقيد 🔒
                        </h2>

                        {/* Message */}
                        <p className="text-xl text-[#64607A] mb-8 leading-relaxed" dir="rtl">
                            يجب تفعيل اشتراكك للوصول إلى المحتوى
                        </p>

                        <div className="h-px bg-gradient-to-r from-transparent via-[#E8E0D4] to-transparent my-8" />

                        {/* Instructions */}
                        <div className="text-[#64607A] mb-8" dir="rtl">
                            <p className="mb-4">للحصول على الوصول إلى المحتوى:</p>
                            <ol className="list-decimal list-inside space-y-2 text-right inline-block">
                                <li>تأكد من إتمام عملية الدفع</li>
                                <li>تواصل معنا لتفعيل حسابك</li>
                                <li>سيتم تفعيل اشتراكك خلال 24 ساعة</li>
                            </ol>
                        </div>

                        {/* Contact Button */}
                        <a
                            href={`mailto:${ADMIN_EMAIL}?subject=طلب تفعيل الاشتراك&body=مرحباً، أرغب في تفعيل اشتراكي للوصول إلى المحتوى.`}
                            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#C9A84C] to-[#B8860B] hover:from-[#B8860B] hover:to-[#C9A84C] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#C9A84C]/25 hover:shadow-[#C9A84C]/40 hover:scale-105"
                        >
                            <Mail className="w-5 h-5" />
                            <span>تواصل معنا للتفعيل</span>
                        </a>

                        {/* Email Display */}
                        <div className="mt-8 pt-6 border-t border-[#E8E0D4]">
                            <p className="text-sm text-[#64607A] mb-2">البريد الإلكتروني:</p>
                            <a
                                href={`mailto:${ADMIN_EMAIL}`}
                                className="text-[#C9A84C] hover:text-[#B8860B] font-mono text-sm transition-colors"
                            >
                                {ADMIN_EMAIL}
                            </a>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // User has access - show phases normally
    return (
        <>
            <DashboardHeader title="مسار التعلم (11 مرحلة) 🎓" subtitle="أكمل المراحل بالترتيب للوصول إلى هدفك" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {phases.map((phase) => {
                    const isLocked = phase.is_locked;
                    // TODO: Calculate real progress
                    const progress = phase.phase_number === 1 ? 65 : 0;
                    const completed = phase.phase_number === 1 ? 8 : 0;

                    return (
                        <PhaseCard
                            key={phase.id}
                            id={phase.phase_number}
                            title={phase.title_en} // Badge/English Title
                            subtitle={phase.title_ar} // Main Arabic Title
                            progress={progress}
                            totalModules={phase.total_modules}
                            completedModules={completed}
                            isLocked={isLocked}
                            color={phase.color || "#C9A84C"}
                        />
                    );
                })}
            </div>
        </>
    );
}
