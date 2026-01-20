"use client";

import { X, Check } from "lucide-react";
import FadeIn from "./FadeIn";

const NOT_FOR_YOU = [
    "تبحث عن \"الثراء السريع\" بدون عمل",
    "غير مستعد للالتزام لمدة 90 يوم على الأقل",
    "تريد نتائج بدون تطبيق",
    "تظن أن المال يأتي بدون جهد",
    "تبحث عن أعذار بدلاً من حلول",
    "غير مستعد للاستثمار في نفسك",
    "تستسلم عند أول عقبة",
    "تريد أن نعمل بدلاً عنك"
];

const FOR_YOU = [
    "مستعد للتعلم والتطبيق بجدية",
    "تريد بناء بزنس حقيقي ومستدام",
    "لديك 1-2 ساعة يومياً للعمل",
    "تؤمن أن النجاح يحتاج وقت وجهد",
    "مستعد لاتباع نظام مثبت",
    "تريد تغيير حياتك المالية للأبد",
    "لديك عقلية النمو والتطور",
    "مستعد للاستثمار في مستقبلك"
];

export default function WhoIsThisFor() {
    return (
        <section className="py-20 relative overflow-hidden bg-[#030712]">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-[128px] pointer-events-none -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[128px] pointer-events-none -translate-y-1/2" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <FadeIn className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold font-cairo mb-4 text-red-500">
                        ⛔ LEXMO ليس للجميع
                    </h2>
                    <p className="text-xl text-gray-400">هذا البرنامج ليس مناسباً لك إذا...</p>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* NOT FOR YOU Column */}
                    <FadeIn delay={0.2} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-b from-red-500/20 to-transparent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative bg-[#0f172a]/50 border border-red-500/10 rounded-2xl p-8 h-full backdrop-blur-sm">
                            <h3 className="text-2xl font-bold mb-8 text-red-500 font-cairo border-b border-red-500/10 pb-4">
                                ⛔ ليس لك إذا كنت...
                            </h3>
                            <div className="space-y-4">
                                {NOT_FOR_YOU.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 text-gray-300">
                                        <div className="mt-1 p-1 rounded-full bg-red-500/10 text-red-500 shrink-0">
                                            <X size={16} />
                                        </div>
                                        <span className="leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    {/* FOR YOU Column */}
                    <FadeIn delay={0.4} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-b from-green-500/20 to-transparent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative bg-[#0f172a]/50 border border-green-500/10 rounded-2xl p-8 h-full backdrop-blur-sm">
                            <h3 className="text-2xl font-bold mb-8 text-green-500 font-cairo border-b border-green-500/10 pb-4">
                                ✅ LEXMO مصمم لك إذا...
                            </h3>
                            <div className="space-y-4">
                                {FOR_YOU.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 text-gray-300">
                                        <div className="mt-1 p-1 rounded-full bg-green-500/10 text-green-500 shrink-0">
                                            <Check size={16} />
                                        </div>
                                        <span className="leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>

                <FadeIn delay={0.6} className="text-center mt-12 bg-white/5 border border-white/5 rounded-xl p-6 lg:w-fit mx-auto backdrop-blur-md">
                    <p className="text-xl lg:text-2xl font-bold text-white font-cairo">
                        إذا كنت من النوع الثاني، فمرحباً بك في عائلة <span className="text-[#00d2ff]">LEXMO</span> 🚀
                    </p>
                </FadeIn>
            </div>
        </section>
    );
}
