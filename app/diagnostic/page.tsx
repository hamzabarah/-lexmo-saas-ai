"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const CTA_TEXT = "احجز جلستك الآن";
const CTA_URL = "https://buy.stripe.com/9B68wP5WU7nX5dH7gDgfu05";

const faqData = [
  {
    q: "ما هو التشخيص بالضبط؟",
    a: "جلسة فردية 45 دقيقة على تيليغرام مع خبير، نحلل وضعك الحالي ونحدد البزنس المناسب لك بناءً على إمكانياتك وميزانيتك.",
  },
  {
    q: "هل أحتاج خبرة سابقة؟",
    a: "لا، الجلسة مصممة خصيصاً للمبتدئين الذين لا يعرفون من أين يبدأون. سنساعدك على اختيار أفضل مسار لك.",
  },
  {
    q: "كيف يتم الحجز بعد الدفع؟",
    a: "بعد الدفع ستصلك رسالة إلكترونية لإنشاء حسابك. بعد تسجيل الدخول، يمكنك اختيار موعدك المناسب من التواريخ المتاحة.",
  },
  {
    q: "ماذا سأحصل عليه في نهاية الجلسة؟",
    a: "ستحصل على تحليل كامل لوضعك، توصية بالبزنس المناسب لك (ecommerce, coaching, SaaS...) وخطة عمل واضحة للبدء.",
  },
];

export default function DiagnosticPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  const PriceLine = (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-white text-2xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{"97 €"}</span>
    </div>
  );

  const Title = (
    <h1 className="text-white text-2xl lg:text-3xl font-bold leading-relaxed">
      {"تشخيص بزنس | اكتشف البزنس المناسب لك | جلسة فردية 45 دقيقة"}
    </h1>
  );

  const Description = (
    <div className="space-y-4 text-gray-400 text-[15px] leading-[1.9]">
      <p>
        {"ما عرفتش من وين تبدأ؟ ما تقلقش. في جلسة واحدة فقط، غادي نحللو وضعك الحالي ونكتشفو البزنس اللي مناسب لك. سواء كان ecommerce, coaching, SaaS أو أي مجال آخر — غادي تخرج بخطة عمل واضحة."}
      </p>
      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-3">
          <span className="text-[#C5A04E] text-lg">✅</span>
          <span>مكالمة خاصة 45 دقيقة على تيليغرام</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#C5A04E] text-lg">✅</span>
          <span>تحليل وضعك الحالي (ميزانية، مهارات، وقت)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#C5A04E] text-lg">✅</span>
          <span>اكتشاف البزنس المناسب لك</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#C5A04E] text-lg">✅</span>
          <span>خطة عمل واضحة للبدء فوراً</span>
        </div>
      </div>
    </div>
  );

  const FAQ = (
    <div className="space-y-4">
      <h2 className="text-white text-xl font-bold">الأسئلة الشائعة</h2>
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
                className={`text-gray-500 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
              />
            </button>
            {openFaq === i && (
              <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const CTAButton = (
    <a
      ref={ctaRef}
      href={CTA_URL}
      className="block w-full text-center bg-[#E8600A] hover:bg-[#D15509] text-white text-lg font-bold py-4 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
      style={{ boxShadow: '0 4px 14px rgba(232,96,10,0.2)' }}
    >
      {CTA_TEXT}
    </a>
  );

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-cairo" dir="rtl">
      <div className="mx-auto py-8" style={{ maxWidth: '1100px', padding: '32px 24px' }}>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ===== LEFT COLUMN — Main Content ===== */}
          <div className="flex-1 min-w-0 space-y-8 pb-32 lg:pb-8">

            {/* Hero image */}
            <img
              src="/images/sales/hero-diagnostic.png"
              alt="تشخيص بزنس"
              className="w-full h-auto lg:h-[400px] object-contain lg:object-cover rounded-2xl"
            />

            {/* Mobile only: Rating + Price + CTA before title */}
            <div className="lg:hidden space-y-4">
              <p className="text-white text-lg font-bold">تشخيص بزنس | اكتشف البزنس المناسب لك</p>
              {PriceLine}
              {CTAButton}
            </div>

            {/* Title */}
            {Title}

            {/* Description */}
            {Description}

            {/* FAQ */}
            {FAQ}

            {/* Reviews */}
          </div>

          {/* ===== RIGHT SIDEBAR (sticky) — desktop only ===== */}
          <div className="hidden lg:block lg:w-[360px] shrink-0">
            <div className="sticky top-6">
              <div
                className="bg-[#0A0A0A] rounded-2xl overflow-hidden border border-[#C5A04E]/10"
                style={{ boxShadow: '0 4px 20px rgba(197,160,78,0.1)' }}
              >
                {/* Banner image */}
                <img
                  src="/images/sales/petite-diagnostic.webp"
                  alt="تشخيص بزنس"
                  className="w-full aspect-video object-cover"
                />

                {/* Content */}
                <div className="p-5 space-y-3">

                  <h3 className="text-white font-bold text-[15px] leading-snug">
                    تشخيص بزنس | اكتشف البزنس المناسب لك
                  </h3>

                  {PriceLine}

                  <a
                    href={CTA_URL}
                    className="block w-full text-center bg-[#E8600A] hover:bg-[#D15509] text-white text-[15px] font-bold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
                    style={{ boxShadow: '0 4px 14px rgba(232,96,10,0.2)' }}
                  >
                    {CTA_TEXT}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE STICKY BOTTOM BAR ===== */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] lg:hidden transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.06)' }}
      >
        <div className="px-4 py-3 flex items-center gap-4">
          <div className="shrink-0" dir="ltr">
            <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{"97 €"}</span>
          </div>
          <a
            href={CTA_URL}
            className="flex-1 text-center bg-[#E8600A] hover:bg-[#D15509] text-white text-sm font-bold py-3 rounded-xl transition-all duration-200"
            style={{ boxShadow: '0 4px 14px rgba(232,96,10,0.2)' }}
          >
            {CTA_TEXT}
          </a>
        </div>
      </div>
      {/* ===== FOOTER ===== */}
      <div className="w-full py-6 text-center">
        <a href="/legal/terms" className="text-xs text-gray-400 no-underline hover:text-gray-500 transition-colors">
          Terms & Conditions
        </a>
        <span className="text-gray-700">·</span>
        <a href="/legal/refund" className="text-xs text-gray-400 no-underline hover:text-gray-500 transition-colors">
          سياسة الاسترجاع
        </a>
        <span className="text-gray-700">·</span>
        <a href="/legal/privacy" className="text-xs text-gray-400 no-underline hover:text-gray-500 transition-colors">
          سياسة الخصوصية
        </a>
      </div>
    </main>
  );
}
