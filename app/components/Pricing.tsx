"use client";

import { Check, X, Shield, CreditCard, Gift } from "lucide-react";
import FadeIn from "./FadeIn";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function Pricing() {
    return (
        <Suspense fallback={<div className="py-20 text-center">Loading pricing...</div>}>
            <PricingContent />
        </Suspense>
    );
}

function PricingContent() {
    const searchParams = useSearchParams();
    const hasAmbassadorCode = searchParams.get('ref') || searchParams.get('code');

    // PLACEHOLDERS - REPLACE WITH YOUR ACTUAL STRIPE PAYMENT LINKS
    const SPARK_LINK = "https://buy.stripe.com/PLACEHOLDER_SPARK";
    const EMPEROR_LINK = "https://buy.stripe.com/PLACEHOLDER_EMPEROR";
    const LEGEND_LINK = "https://buy.stripe.com/PLACEHOLDER_LEGEND";

    return (
        <section id="pricing" className="py-20 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#9d50bb]/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <FadeIn className="text-center mb-16">
                    {hasAmbassadorCode && (
                        <div className="inline-block bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-1 rounded-full text-sm font-bold mb-6 animate-pulse">
                            🎉 تم تفعيل كود السفير: خصم خاص لك!
                        </div>
                    )}
                    <h2 className="text-4xl lg:text-5xl font-bold font-cairo mb-4 leading-tight">
                        اختر خطتك وابدأ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#9d50bb]">رحلة الثراء</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">استثمارك اليوم هو مفتاح حريتك غداً</p>

                    <CountdownTimer />
                </FadeIn>

                <FadeIn delay={0.2} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* PACK 1: SPARK */}
                    <PriceCard
                        title="الشرارة 🚀"
                        subtitle="أشعل بداية رحلتك"
                        price={hasAmbassadorCode ? "997" : "1,497"}
                        original={hasAmbassadorCode ? "1,497" : "2,997"}
                        features={[
                            "نظام Lexmo.AI الأساسي",
                            "دورة التجارة الإلكترونية الشاملة (10 وحدات)",
                            "قوالب صفحات المنتج الجاهزة",
                            "قائمة 100+ منتج رابح",
                            "الوصول للمجتمع العام",
                            "تحديثات مجانية لمدة سنة",
                            "دعم عبر البريد الإلكتروني"
                        ]}
                        missingFeatures={[
                            "حقوق إعادة البيع",
                            "المكافآت الـ 28 الحصرية",
                            "مجتمع VIP",
                            "جلسات Live"
                        ]}
                        buttonText="🚀 ابدأ رحلتك"
                        ambassadorProfit="498"
                        paymentLink={SPARK_LINK}
                    />

                    {/* PACK 2: EMPEROR */}
                    <div className="relative transform lg:-translate-y-4 lg:scale-105 z-10">
                        <div className="absolute -inset-1 bg-gradient-to-b from-[#00d2ff] to-[#9d50bb] rounded-3xl blur opacity-40 animate-pulse" />
                        <PriceCard
                            title="الإمبراطور 👑"
                            subtitle="ابنِ إمبراطوريتك الخاصة"
                            price={hasAmbassadorCode ? "1,497" : "2,497"}
                            original={hasAmbassadorCode ? "2,497" : "4,997"}
                            features={[
                                "كل ما في \"الشرارة\"",
                                "28 مكافأة \"غير عادلة\" حصرية (قيمتها €20,000+)",
                                "نظام أتمتة المبيعات بالكامل",
                                "قوالب إعلانات جاهزة (Facebook + TikTok)",
                                "سكريبتات البيع والإقناع",
                                "دخول مجتمع النخبة VIP",
                                "جلسات Live أسبوعية",
                                "تحديثات مدى الحياة",
                                "دعم أولوية (رد خلال 24 ساعة)",
                                "حقوق إعادة البيع (كن سفيراً!)",
                                "صفحة بيع جاهزة باسمك"
                            ]}
                            badge="الأكثر طلباً"
                            isPopular
                            buttonText="⚡ انضم إلى النخبة"
                            ambassadorProfit="748"
                            paymentLink={EMPEROR_LINK}
                        />
                    </div>

                    {/* PACK 3: LEGEND */}
                    <PriceCard
                        title="الأسطورة 💎"
                        subtitle="نحن نبني إمبراطوريتك معك"
                        price={hasAmbassadorCode ? "4,997" : "9,997"}
                        original={hasAmbassadorCode ? "9,997" : "14,997"}
                        features={[
                            "كل ما في \"الإمبراطور\"",
                            "مرافقة شخصية 1-على-1 (12 جلسة)",
                            "بناء متجرك بالكامل (Done For You)",
                            "اختيار المنتج الرابح معك",
                            "إعداد الإعلانات الأولى",
                            "إدارة أول حملة إعلانية ممولة",
                            "تواصل مباشر واتساب خاص",
                            "مراجعات أسبوعية لمدة 3 أشهر",
                            "ضمان أول بيع خلال 30 يوم أو استرداد كامل"
                        ]}
                        buttonText="👑 احجز مكانك الآن"
                        accentColor="violet"
                        ambassadorProfit="1,000"
                        badge="للجادين فقط"
                        paymentOption="أو 3 × €3,500"
                        warningText="⚠️ 5 أماكن فقط شهرياً"
                        paymentLink={LEGEND_LINK}
                    />
                </FadeIn>

                <div className="mt-20 text-center">
                    <div className="flex justify-center flex-wrap gap-8 mb-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-400"><CreditCard /> STRIPE</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-400">VISA</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-400">MASTERCARD</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-400">PAYPAL</div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-4">
                        <Shield className="w-4 h-4 text-[#10b981]" />
                        دفع آمن 100% عبر Stripe
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                        <Shield className="w-4 h-4 text-[#10b981]" />
                        ضمان استرداد 30 يوم - بدون أسئلة
                    </div>
                </div>
            </div>
        </section>
    );
}

function CountdownTimer() {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTime({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-wrap justify-center gap-4 lg:gap-8 font-orbitron" dir="ltr">
            <TimeBox value={time.days} label="أيام" />
            <span className="text-4xl font-bold text-gray-600 mt-2">:</span>
            <TimeBox value={time.hours} label="ساعات" />
            <span className="text-4xl font-bold text-gray-600 mt-2">:</span>
            <TimeBox value={time.minutes} label="دقائق" />
            <span className="text-4xl font-bold text-gray-600 mt-2">:</span>
            <TimeBox value={time.seconds} label="ثواني" />
        </div>
    );
}

function TimeBox({ value, label }: { value: number, label: string }) {
    return (
        <div className="text-center">
            <div className="bg-[#white]/5 bg-white/5 border border-white/10 rounded-xl p-4 min-w-[80px] lg:min-w-[100px] mb-2 backdrop-blur-sm">
                <div className="text-3xl lg:text-4xl font-bold text-[#ffd700]">{String(value).padStart(2, '0')}</div>
            </div>
            <div className="text-xs text-gray-500 font-cairo">{label}</div>
        </div>
    );
}

function PriceCard({
    title, subtitle, price, original, features, missingFeatures, badge, isPopular, buttonText, accentColor,
    ambassadorProfit, paymentOption, warningText, paymentLink
}: {
    title: string, subitle?: string, subtitle: string, price: string, original: string, features: string[],
    missingFeatures?: string[], badge?: string, isPopular?: boolean, buttonText: string, accentColor?: 'violet' | 'cyan',
    ambassadorProfit?: string, paymentOption?: string, warningText?: string, paymentLink?: string
}) {
    const borderColor = accentColor === 'violet' ? 'border-[#a855f7]/50 hover:border-[#a855f7]' : isPopular ? 'border-[#00d2ff]' : 'border-white/10';
    const btnClass = accentColor === 'violet'
        ? 'bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-lg shadow-purple-500/25'
        : isPopular
            ? 'bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] text-white shadow-lg shadow-cyan-500/25'
            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10';

    return (
        <div className={`relative bg-[#0f172a] border rounded-2xl p-8 h-full flex flex-col ${borderColor} transition-colors duration-300`}>
            {badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-sm font-bold shadow-lg whitespace-nowrap ${accentColor === 'violet' ? 'bg-[#a855f7] shadow-purple-500/20' : 'bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] shadow-cyan-500/20'} text-white`}>
                    {badge}
                </div>
            )}

            <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${accentColor === 'violet' ? 'text-[#a855f7]' : 'text-gray-100'}`}>{title}</h3>
                <p className="text-sm text-gray-400 h-6">{subtitle}</p>
            </div>

            <div className="text-center mb-6">
                <div className="text-sm text-gray-500 line-through mb-1">€{original}</div>
                <div className="text-5xl font-bold text-white font-orbitron">€{price}</div>
                {paymentOption ? (
                    <div className="text-xs text-[#a855f7] font-bold mt-2">{paymentOption}</div>
                ) : (
                    <div className="text-xs text-gray-500 mt-2">دفعة واحدة</div>
                )}
            </div>

            {paymentLink ? (
                <a
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center py-4 rounded-xl font-bold mb-6 transition-all hover:scale-[1.02] active:scale-95 duration-200 ${btnClass}`}
                >
                    {buttonText}
                </a>
            ) : (
                <button className={`w-full py-4 rounded-xl font-bold mb-6 transition-all hover:scale-[1.02] active:scale-95 duration-200 ${btnClass}`}>
                    {buttonText}
                </button>
            )}

            {warningText && (
                <div className="text-center text-xs text-red-400 font-bold mb-6 animate-pulse border border-red-500/20 bg-red-500/5 py-2 rounded-lg">
                    {warningText}
                </div>
            )}

            {ambassadorProfit && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-6 flex items-center justify-center gap-2">
                    <Gift size={16} className="text-green-500" />
                    <span className="text-sm font-bold text-green-400">💰 ربح السفير: €{ambassadorProfit}</span>
                </div>
            )}

            <div className="space-y-4 flex-grow border-t border-white/5 pt-6">
                {features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <div className={`mt-0.5 p-0.5 rounded-full ${accentColor === 'violet' ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'bg-[#00d2ff]/20 text-[#00d2ff]'}`}>
                            <Check size={12} />
                        </div>
                        <span>{feat}</span>
                    </div>
                ))}
                {missingFeatures?.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-500 opacity-60">
                        <div className="mt-0.5 p-0.5 rounded-full bg-red-500/10 text-red-500">
                            <X size={12} />
                        </div>
                        <span className="line-through">{feat}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
