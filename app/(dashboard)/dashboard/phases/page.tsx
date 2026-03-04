'use client';

import { useEffect, useState } from 'react';
import StepCard from "@/app/components/dashboard/StepCard";
import { checkUserSubscription, SubscriptionCheckResult } from "@/lib/check-subscription";
import { Lock, Mail } from 'lucide-react';

export default function PhasesPage() {
    const [subscriptionCheck, setSubscriptionCheck] = useState<SubscriptionCheckResult | null>(null);
    const [loading, setLoading] = useState(true);

    const ADMIN_EMAIL = 'academyfrance75@gmail.com';

    useEffect(() => {
        async function checkAccess() {
            try {
                const result = await checkUserSubscription();
                setSubscriptionCheck(result);
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
                <div className="text-gray-400 text-lg">جاري التحميل...</div>
            </div>
        );
    }

    // Show blocking message if user doesn't have access
    if (!subscriptionCheck?.hasAccess) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 max-w-2xl text-center">
                        {/* Lock Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                                <Lock className="w-10 h-10 text-red-500" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl font-bold text-white mb-4">
                            الوصول مقيد 🔒
                        </h2>

                        {/* Message */}
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed" dir="rtl">
                            يجب تفعيل اشتراكك للوصول إلى المحتوى
                        </p>

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

                        {/* Instructions */}
                        <div className="text-gray-400 mb-8" dir="rtl">
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
                            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                        >
                            <Mail className="w-5 h-5" />
                            <span>تواصل معنا للتفعيل</span>
                        </a>

                        {/* Email Display */}
                        <div className="mt-8 pt-6 border-t border-gray-800">
                            <p className="text-sm text-gray-500 mb-2">البريد الإلكتروني:</p>
                            <a
                                href={`mailto:${ADMIN_EMAIL}`}
                                className="text-blue-400 hover:text-blue-300 font-mono text-sm transition-colors"
                            >
                                {ADMIN_EMAIL}
                            </a>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // User has access - show steps
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <StepCard
                stepNumber={1}
                title="الأساسيات"
                description="تعرّف على أساسيات التجارة الإلكترونية والدروبشيبينغ. ستفهم كيف يعمل هذا المجال، كم تحتاج من المال للبدء، والأخطاء التي يقع فيها المبتدئون."
                imageUrl="/images/etapes/1.png"
                progress={0}
            />
        </div>
    );
}
