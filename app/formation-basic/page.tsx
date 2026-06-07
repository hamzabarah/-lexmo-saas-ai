"use client";

import { useState, useEffect } from "react";
import { Star, ChevronDown } from "lucide-react";
import VideoCarousel from "@/components/testimonials/VideoCarousel";
import ProofGallery from "@/components/testimonials/ProofGallery";
import { WhyItWorks, ProgramModules, WhatYouGet, IsThisForYou } from "@/components/sales/SalesSections";

const STRIPE_LINK = "https://buy.stripe.com/9B63cvbhe4bLay17gDgfu06";
const PRICE_OLD = "970 €";
const PRICE_NEW = "197 €";

const faqData: {
  q: string;
  a: string;
  link?: { href: string; label: string };
}[] = [
  {
    q: "هل الكورس مناسب للمبتدئين؟",
    a: "نعم، الكورس مصمم خصيصاً للمبتدئين من الصفر. نبدأ معك من إنشاء المتجر خطوة بخطوة حتى تحقيق أول مبيعة وما بعدها.",
  },
  {
    q: "كم من الوقت أحتاج لأبدأ أربح؟",
    a: "معظم الطلاب يبدأون بتحقيق مبيعات خلال 2-4 أسابيع من بداية التطبيق. النتائج تعتمد على مدى التزامك بالتطبيق.",
  },
  {
    q: "هل يوجد دعم بعد الشراء؟",
    a: "هاد العرض مصمم للتعلم الذاتي بوتيرتك. عندك وصول مدى الحياة لكل الدروس، تقدر تراجعها وقت ما تبغيت. الدورة مبنية خطوة بخطوة باش تمشي بنفسك من الصفر حتى المبيعة الأولى.",
  },
  {
    q: "ما الفرق بينكم وبين الكورسات الأخرى؟",
    a: "نقدم 27 مرحلة عملية مع أكثر من 120 درس فيديو، تغطي كل شيء من إنشاء المتجر إلى الإعلانات المدفوعة على فيسبوك وتيك توك. كل شيء مُحدّث لسنة 2026.",
  },
  {
    q: "ما الفرق بين عرض 197€ وعرض 497€؟",
    a: "نفس التكوين الكامل ونفس المحتوى في الاثنين. عرض 497€ يضيف المرافقة الشخصية: متابعة فردية، مراجعة متجرك قبل الإطلاق، وأولوية في الإجابة على أسئلتك — لمن يريد الوصول أسرع بيد تمسك يده.",
    link: { href: "/formation", label: "اكتشف عرض المرافقة الشخصية 497€ ←" },
  },
  {
    q: "هل أحتاج ميزانية غير ثمن التكوين؟",
    a: "نعم، ميزانية صغيرة للإعلانات والاختبار (300-500€ تكفي لبداية جدية) — وستتعلم في التكوين كيف تصرفها بذكاء دون حرقها.",
  },
];

export default function FormationBasicPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? el.scrollTop / max : 0;
      setShowStickyBar(pct > 0.35 && pct < 0.93);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const Stars = (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className="text-[#D4A843] fill-[#D4A843]" />
      ))}
    </div>
  );

  const PriceRow = (
    <div className="flex items-center justify-center gap-3 flex-wrap" dir="ltr">
      <span className="text-gray-500 text-2xl font-black line-through" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {PRICE_OLD}
      </span>
      <span className="text-white text-3xl font-black" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {PRICE_NEW}
      </span>
      <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
        تخفيض %80
      </span>
    </div>
  );

  const CtaButton = (
    <a
      href={STRIPE_LINK}
      className="block w-full text-center bg-[#C5A04E] hover:bg-[#D4B85C] text-white text-lg font-bold py-4 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
      style={{ boxShadow: "0 4px 14px rgba(197,160,78,0.25)" }}
    >
      ابدأ الآن — وصول فوري
    </a>
  );

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-cairo text-white" dir="rtl">
      <div className="mx-auto max-w-3xl px-5 py-10 space-y-16">

        {/* 1. HERO */}
        <section className="space-y-5 text-center">
          <h1 className="text-3xl sm:text-4xl font-black leading-snug">
            من الصفر إلى أول مبيعة أونلاين 🚀
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            متجر إلكتروني جاهز وخطة واضحة نحو أول 1000€ — حتى لو ما عندك أي خبرة تقنية
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm text-gray-400">
            <span>✅ بدون مخزون</span>
            <span>✅ بدون خبرة سابقة</span>
            <span>✅ خطوة بخطوة</span>
            <span>✅ ساعة إلى ساعتين في اليوم تكفي</span>
          </div>

          <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-[#C5A04E]/20 bg-[#111111] p-6">
            <div className="flex items-center justify-center gap-2">
              {Stars}
              <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                5.0 (453 تقييم)
              </span>
            </div>
            {PriceRow}
            {CtaButton}
            <p className="text-xs text-gray-500">وصول مدى الحياة · انضم لأكثر من 1000 عضو</p>
          </div>
        </section>

        {/* 2. Vidéos */}
        <VideoCarousel />

        {/* 3. Pourquoi ça marche */}
        <WhyItWorks />

        {/* 4. Le programme */}
        <ProgramModules withCoaching={false} />

        {/* 5. Ce que tu reçois */}
        <WhatYouGet
          withCoaching={false}
          bandeau="كل هذا اليوم بـ 197€ فقط بدل 970€ — دفعة واحدة، بلا اشتراك شهري"
        />

        {/* 6. Est-ce pour toi ? */}
        <IsThisForYou />

        {/* 7. تقييمات وإثباتات (section fusionnée) */}
        <ProofGallery />

        {/* 8. FAQ */}
        <section className="space-y-4">
          <h2 className="text-white text-2xl font-bold text-center">الأسئلة الشائعة</h2>
          <div className="space-y-2">
            {faqData.map((item, i) => (
              <div key={i} className="border border-[#C5A04E]/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-right hover:bg-[#1A1A1A] transition"
                >
                  <span className="text-white font-semibold text-[15px]">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                    {item.a}
                    {item.link && (
                      <a
                        href={item.link.href}
                        className="mt-2 block font-semibold text-[#C5A04E] hover:underline"
                      >
                        {item.link.label}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 9. CTA FINAL */}
        <section className="rounded-2xl border border-[#C5A04E]/40 bg-gradient-to-b from-[#C5A04E]/10 to-transparent p-6 text-center space-y-4">
          <h2 className="text-white text-xl sm:text-2xl font-bold leading-snug">
            ابدأ اليوم طريقك نحو أول مبيعة أونلاين 🚀
          </h2>
          {PriceRow}
          {CtaButton}
          <p className="text-xs text-gray-400">دفعة واحدة · وصول مدى الحياة · ⭐ 5.0 من 453 تقييم</p>
        </section>
      </div>

      {/* STICKY BAR mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-[#C5A04E]/15 lg:hidden transition-transform duration-300 ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}
        style={{ boxShadow: "0 -2px 10px rgba(0,0,0,0.4)" }}
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="shrink-0 flex items-baseline gap-1.5" dir="ltr">
            <span className="text-gray-500 text-sm font-bold line-through" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
              {PRICE_OLD}
            </span>
            <span className="text-white text-xl font-black" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
              {PRICE_NEW}
            </span>
          </div>
          <a
            href={STRIPE_LINK}
            className="flex-1 text-center bg-[#C5A04E] hover:bg-[#D4B85C] text-white text-sm font-bold py-3 rounded-xl transition-all duration-200"
            style={{ boxShadow: "0 4px 14px rgba(197,160,78,0.25)" }}
          >
            ابدأ الآن
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-full py-6 pb-24 lg:pb-6 text-center">
        <a href="/legal/terms" className="text-xs text-gray-400 no-underline hover:text-gray-500 transition-colors">
          Terms & Conditions
        </a>
      </div>
    </main>
  );
}
