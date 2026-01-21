"use client";

import { CheckCircle, Mail, Copy } from "lucide-react";
import { useState } from "react";

export default function PaymentSuccessPage() {
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-[#1e293b] border border-[#00d2ff]/20 rounded-2xl p-8 md:p-12 shadow-2xl">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white font-cairo">
                    🎉 الدفع تم بنجاح !
                </h1>

                <p className="text-center text-gray-300 mb-8 text-lg font-cairo">
                    شكراً لك على الشراء ! تم تأكيد دفعتك بنجاح.
                </p>

                {/* Instructions Box */}
                <div className="bg-[#0f172a] border border-[#00d2ff]/30 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                        <Mail className="w-6 h-6 text-[#00d2ff] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white mb-2 font-cairo">
                                📧 الخطوة الأخيرة لتفعيل حسابك
                            </h2>
                            <p className="text-gray-300 mb-4 font-cairo">
                                لتفعيل حسابك، أرسل لنا بريد إلكتروني يحتوي على المعلومات التالية:
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#1e293b] border border-white/10 rounded-lg p-4 mb-4">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-400 mb-1 font-cairo">📩 إلى:</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <code className="text-[#00d2ff] font-mono text-lg">contact@lexmo.ai</code>
                                    <button
                                        onClick={() => handleCopy('contact@lexmo.ai')}
                                        className="p-2 hover:bg-white/10 rounded transition-colors bg-white/5"
                                        title="نسخ البريد الإلكتروني"
                                    >
                                        <Copy className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-1 font-cairo">📝 الموضوع:</p>
                                <code className="text-white font-cairo">تفعيل حساب LEXMO</code>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-2 font-cairo">✍️ في الرسالة، قم بتضمين:</p>
                                <ul className="space-y-2 text-gray-300 font-cairo">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#00d2ff] mt-1">•</span>
                                        <span><strong>بريدك الإلكتروني</strong> المستخدم في الدفع</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#00d2ff] mt-1">•</span>
                                        <span><strong>لقطة شاشة</strong> لتأكيد الدفع من Stripe</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#00d2ff] mt-1">•</span>
                                        <span><strong>الباقة المشتراة</strong> (Spark أو Emperor أو Legend)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {copied && (
                        <p className="text-green-500 text-sm text-center mb-2 font-cairo">
                            ✅ تم نسخ البريد الإلكتروني !
                        </p>
                    )}
                </div>

                {/* Timeline */}
                <div className="bg-gradient-to-r from-[#00d2ff]/10 to-[#9d50bb]/10 border border-[#00d2ff]/20 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4 font-cairo">⏱️ ماذا سيحدث بعد ذلك؟</h3>
                    <div className="space-y-3 text-gray-300 font-cairo">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-[#00d2ff]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-[#00d2ff] font-bold">1</span>
                            </div>
                            <p>ترسل لنا البريد الإلكتروني مع معلوماتك</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-[#00d2ff]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-[#00d2ff] font-bold">2</span>
                            </div>
                            <p>نتحقق من دفعتك (خلال 24 ساعة كحد أقصى)</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-[#00d2ff]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-[#00d2ff] font-bold">3</span>
                            </div>
                            <p>نرسل لك رابط تسجيل مخصص</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-green-500 font-bold">✓</span>
                            </div>
                            <p className="font-bold text-white">تنشئ حسابك وتصل فوراً إلى المحتوى !</p>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm font-cairo mb-2">
                        💡 نصيحة: افتح بريدك الإلكتروني وأرسل لنا الآن
                    </p>
                    <p className="text-gray-500 text-xs font-cairo">
                        هل تحتاج مساعدة؟ راسلنا على نفس البريد
                    </p>
                </div>
            </div>
        </div>
    );
}
