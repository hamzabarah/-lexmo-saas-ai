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
                <div className="text-gray-500 text-lg">جاري التحميل...</div>
            </div>
        );
    }

    // Show blocking message if user doesn't have access
    if (!subscriptionCheck?.hasAccess) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-12 max-w-2xl text-center">
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
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed" dir="rtl">
                            يجب تفعيل اشتراكك للوصول إلى المحتوى
                        </p>

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

                        {/* Instructions */}
                        <div className="text-gray-500 mb-8" dir="rtl">
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
                        <div className="mt-8 pt-6 border-t border-[#C5A04E]/10">
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
    const steps = [
        { title: "🔑 الأساسيات", description: "في هذه المرحلة غادي تفهم أساسيات اللعبة وكيفاش تختار منتج مربح" },
        { title: "🔍 الأسلحة السرية", description: "غادي تكتاشف الأدوات السرية اللي كيستعملوها المحترفين باش يلقاو المنتجات الرابحة" },
        { title: "🌍 اصطاد المنتج الرابح", description: "تعلم كيفاش تلقى المنتجات الرابحة في أي سوق سواء المغرب أو السعودية أو أمريكا" },
        { title: "🕵️ اسرق أسرار المنافسين", description: "تعلم كيفاش تتجسس على المنافسين وتاخذ أفكارهم بدون ما يعرفوا" },
        { title: "🎯 القرار النهائي", description: "الخطوة الأخيرة — اختار المنتج الرابح وبدأ تبيع" },
        { title: "🚀 أول خطوة", description: "في هذه المرحلة غادي تفتح متجرك على شوبيفاي وتشري الدومين وتختار الباقة المناسبة" },
        { title: "🎨 صمم متجر احترافي", description: "غادي تتعلم كيفاش تختار القالب المناسب وتصمم شعار احترافي وتبني متجرك" },
        { title: "⚙️ إعدادات المتجر", description: "ضبط جميع إعدادات المتجر من الدفع والشحن والضرائب والصلاحيات" },
        { title: "📄 الصفحات القانونية", description: "إنشاء الصفحات القانونية الضرورية لحماية متجرك وبناء ثقة العملاء" },
        { title: "📦 الخطوات الأخيرة", description: "الخطوات الأخيرة قبل ما تبدأ تبيع — إضافة المواقع وتتبع الطلبات" },
        { title: "🛍️ فتح متجر شوبيفاي", description: "دليل كامل فيه كل خطوة خاصك ديرها باش تفتح متجر شوبيفاي احترافي" },
        { title: "🛒 استيراد المنتج", description: "تعلم كيفاش تاخذ المنتج من علي إكسبريس وتحطو في متجرك وتعدل عليه" },
        { title: "🎨 تعديل المتجر", description: "تعلم كيفاش تعدل الصفحة الرئيسية وصفحة المنتج وتصمم صور احترافية بالذكاء الاصطناعي" },
        { title: "🔌 التطبيقات الأساسية", description: "دليل تفصيلي لتثبيت وإعداد التطبيقات اللي كتفرق بين متجر هاوي ومتجر احترافي" },
        { title: "📘 مقدمة فيسبوك أدس", description: "تعرف على أساسيات الإعلانات قبل ما تصرف فلوسك" },
        { title: "🔧 إنشاء الحسابات", description: "أنشئ حساباتك وصفحاتك بالطريقة الصحيحة من أول مرة" },
        { title: "🎯 أهداف الحملات", description: "كل هدف كيجيب نتيجة مختلفة — تعلم تختار الهدف اللي غادي يجيبلك المبيعات" },
        { title: "👥 استهداف الجمهور", description: "السر الأكبر في الإعلانات — كيفاش توصل للناس اللي فعلاً غادي يشريو منك" },
        { title: "⚙️ إعدادات الحملة", description: "الإعدادات اللي كتفرق بين إعلان ناجح وإعلان خاسر" },
        { title: "🎨 إنشاء الإعلان", description: "من الصفر حتى إعلان احترافي جاهز ينزل في السوق" },
        { title: "📊 التحسين والتحليل", description: "تعلم كيفاش تحلل النتائج وتحسن إعلاناتك باش تربح أكثر وتصرف أقل" },
        { title: "🚀 إنشاء حملة إعلانية", description: "دليل كامل خطوة بخطوة لإنشاء أول حملة إعلانية ناجحة على فيسبوك" },
        { title: "📊 تحليل الإعلانات", description: "تعلم كيفاش تقرا الأرقام وتاخذ قرارات ذكية باش تربح أكثر وتصرف أقل" },
        { title: "🎵 منصة إعلانية جديدة", description: "تعرف على إعلانات تيكتوك واختار الهدف الصحيح وأنشئ حسابك الإعلاني" },
        { title: "🎬 أول حملة من الصفر", description: "أنشئ أول حملة إعلانية على تيكتوك خطوة بخطوة — من الصفر حتى النشر" },
        { title: "🔎 اربح أكثر", description: "تعلم كيفاش تقرا الأرقام وتحسن إعلاناتك على تيكتوك باش تربح أكثر" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map((step, index) => (
                <StepCard
                    key={index}
                    stepNumber={index + 1}
                    title={step.title}
                    description={step.description}
                    imageUrl={`/etapes/${index + 1}.png`}
                    progress={0}
                />
            ))}
        </div>
    );
}
