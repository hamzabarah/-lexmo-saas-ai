"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/login');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        {/* Success Icon */}
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-6 animate-bounce">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            🎉 الدفع تم بنجاح!
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl text-gray-300 mb-8">
                            مبروك! تم تأكيد عملية الشراء بنجاح
                        </p>

                        {/* Info Box */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-right" dir="rtl">
                            <h2 className="text-lg font-bold text-[#00d2ff] mb-4">📧 الخطوات التالية:</h2>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>ستصلك رسالة تأكيد على بريدك الإلكتروني خلال دقائق</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>تم إنشاء حسابك تلقائياً في المنصة</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>يمكنك الآن تسجيل الدخول والبدء في التدريب</span>
                                </li>
                            </ul>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/login"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-cyan-500/25"
                            >
                                تسجيل الدخول الآن
                            </Link>

                            <Link
                                href="/"
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                            >
                                العودة للرئيسية
                            </Link>
                        </div>

                        {/* Auto Redirect Notice */}
                        <p className="text-sm text-gray-500 mt-6">
                            سيتم توجيهك تلقائياً لصفحة تسجيل الدخول خلال {countdown} ثواني...
                        </p>
                    </div>
                </div>

                {/* Support Note */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        هل تواجه مشكلة؟{" "}
                        <a href="mailto:support@lexmo.ai" className="text-[#00d2ff] hover:underline">
                            تواصل مع الدعم
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
