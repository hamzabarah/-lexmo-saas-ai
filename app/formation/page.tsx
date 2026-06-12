"use client";

import { useState, useEffect } from "react";
import { Star, ChevronDown } from "lucide-react";
import VideoCarousel from "@/components/testimonials/VideoCarousel";
import ProofGallery from "@/components/testimonials/ProofGallery";
import { WhyItWorks, CoachingCard, WhatYouGet, IsThisForYou } from "@/components/sales/SalesSections";

const CTA_TEXT = "سجل قبل إغلاق التسجيل";
const STRIPE_LINK = "https://buy.stripe.com/4gM4gz4SQ5fP7lP44rgfu04";
const PRODUCT_TITLE = "اربح من الإنترنت | التجارة الإلكترونية";

const faqData: {
  q: string;
  a: string;
  link?: { href: string; label: string };
}[] = [
  {
    q: "هل الكورس مناسب للمبتدئين؟",
    a: "نعم، الكورس مصمم خصيصاً للمبتدئين من الصفر. نبدأ معك من إنشاء المتجر خطوة بخطوة حتى تحقيق أول مبيعة وما بعدها — ومع المرافقة الشخصية تمسك يدك في كل خطوة.",
  },
  {
    q: "كم من الوقت أحتاج لأبدأ أربح؟",
    a: "معظم الطلاب يبدأون بتحقيق مبيعات خلال 2-4 أسابيع من بداية التطبيق. النتائج تعتمد على مدى التزامك بالتطبيق.",
  },
  {
    q: "هل أحتاج رأس مال كبير للبدء؟",
    a: "لا، يمكنك البدء بميزانية بسيطة. نعلمك كيف تبدأ بأقل تكلفة ممكنة وتنمّي مشروعك تدريجياً.",
  },
  {
    q: "هل يوجد دعم بعد الشراء؟",
    a: "نعم، عرض 497€ يتضمن مرافقة شخصية: متابعة فردية، مراجعة متجرك قبل الإطلاق، وأولوية في الإجابة على أسئلتك، بالإضافة إلى وصول مدى الحياة لكل المحتوى.",
  },
  {
    q: "ما الفرق بينكم وبين الكورسات الأخرى؟",
    a: "نقدم 27 مرحلة عملية مع أكثر من 120 درس فيديو، تغطي كل شيء من إنشاء المتجر إلى الإعلانات المدفوعة على فيسبوك وتيك توك. كل شيء مُحدّث لسنة 2026 — مع مرافقة شخصية تمسك يدك خطوة بخطوة.",
  },
  {
    q: "ما الفرق بين عرض 197€ وعرض 497€؟",
    a: "نفس التكوين الكامل ونفس المحتوى في الاثنين. عرض 497€ يضيف المرافقة الشخصية: متابعة فردية، مراجعة متجرك قبل الإطلاق، وأولوية في الإجابة على أسئلتك — لمن يريد الوصول أسرع بيد تمسك يده.",
    link: { href: "/formation-basic", label: "اكتشف عرض التعلم الذاتي 197€ ←" },
  },
  {
    q: "هل أحتاج ميزانية غير ثمن التكوين؟",
    a: "نعم، ميزانية صغيرة للإعلانات والاختبار (300-500€ تكفي لبداية جدية) — وستتعلم في التكوين كيف تصرفها بذكاء دون حرقها.",
  },
];

export default function FormationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? el.scrollTop / max : 0;
      setShowStickyBar(pct > 0.35 && pct < 0.95);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Shared components
  const ProductImage = imgError ? (
    <div className="w-full h-[400px] rounded-2xl bg-[#111111] flex items-center justify-center">
      <span className="text-gray-500 text-lg">صورة المنتج</span>
    </div>
  ) : (
    <img
      src="/images/sales/hero-formation.png"
      alt="صورة المنتج"
      className="w-full h-auto lg:h-[400px] object-contain lg:object-cover rounded-2xl"
      onError={() => setImgError(true)}
    />
  );

  const RatingLine = (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="text-[#D4A843] fill-[#D4A843]" />
        ))}
      </div>
      <span className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>5.0 (453)</span>
    </div>
  );

  const PriceLine = (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-gray-500 text-2xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{"1970 €"}</span>
      <span className="text-white text-2xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{"497 €"}</span>
      <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
        {"تخفيض %75"}
      </span>
    </div>
  );

  const Hero = (
    <div className="space-y-4">
      <h1 className="text-white text-2xl lg:text-3xl font-bold leading-relaxed">
        ما غاديش تمشي بوحدك: من الصفر إلى أول مبيعة بمرافقة شخصية 🤝
      </h1>
      <p className="text-gray-300 text-[15px] lg:text-base leading-[1.9]">
        نفس النظام الكامل + خبير يراجع متجرك ومنتجاتك ويرافقك خطوة بخطوة نحو أول 1000€ — أسرع وأأمن طريق
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-400">
        <span>✅ بدون مخزون</span>
        <span>✅ بدون خبرة سابقة</span>
        <span>✅ خطوة بخطوة</span>
        <span>✅ ساعة إلى ساعتين في اليوم تكفي</span>
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
                {item.link && (
                  <a href={item.link.href} className="mt-2 block font-semibold text-[#C5A04E] hover:underline">
                    {item.link.label}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const CTAButton = (
    <a
      href={STRIPE_LINK}
      className="block w-full text-center bg-[#C5A04E] hover:bg-[#D4B85C] text-white text-lg font-bold py-4 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
      style={{ boxShadow: '0 4px 14px rgba(197,160,78,0.2)' }}
    >
      {CTA_TEXT}
    </a>
  );

  const FinalCta = (
    <div className="rounded-2xl border border-[#C5A04E]/40 bg-gradient-to-b from-[#C5A04E]/10 to-transparent p-6 text-center space-y-4">
      <h2 className="text-white text-xl lg:text-2xl font-bold leading-snug">
        ابدأ اليوم بمرافقة شخصية تمسك يدك نحو أول مبيعة 🤝
      </h2>
      <div className="flex justify-center">{PriceLine}</div>
      <a
        href={STRIPE_LINK}
        className="block w-full text-center bg-[#C5A04E] hover:bg-[#D4B85C] text-white text-lg font-bold py-4 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
        style={{ boxShadow: '0 4px 14px rgba(197,160,78,0.25)' }}
      >
        ابدأ الآن — وصول فوري
      </a>
      <p className="text-xs text-gray-400">دفعة واحدة · وصول مدى الحياة · ⭐ 5.0 من 453 تقييم</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-cairo" dir="rtl">
      {/* Brand header — icône émeraude + wordmark */}
      <header className="mx-auto flex items-center px-6 pt-6" style={{ maxWidth: '1100px' }}>
        <a href="/" className="flex items-center gap-2.5">
          <img src="/images/brand/logo.png" alt="ECOMY" className="h-8 w-8" />
          <span className="text-2xl font-bold font-orbitron tracking-tighter text-[#C5A04E]">ECOMY</span>
        </a>
      </header>
      <div className="mx-auto py-8" style={{ maxWidth: '1100px', padding: '32px 24px' }}>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ===== LEFT COLUMN — Main Content ===== */}
          <div className="flex-1 min-w-0 space-y-8 pb-32 lg:pb-8">

            {/* Banner */}
            {ProductImage}

            {/* Mobile only: Rating + Price + CTA before hero */}
            <div className="lg:hidden space-y-4">
              {RatingLine}
              <p className="text-white text-lg font-bold">{PRODUCT_TITLE}</p>
              {PriceLine}
              {CTAButton}
            </div>

            {/* Hero — la promesse */}
            {Hero}

            {/* Vidéos */}
            <VideoCarousel />

            {/* Pourquoi ça marche */}
            <WhyItWorks />

            {/* Carte dorée : المرافقة الشخصية (au-dessus de "شنو غادي تستلم") */}
            <CoachingCard />

            {/* Ce que tu reçois */}
            <WhatYouGet
              withCoaching={true}
              bandeau="كل هذا اليوم بـ 497€ فقط بدل 1970€ — دفعة واحدة، بلا اشتراك شهري"
            />

            {/* Est-ce pour toi ? */}
            <IsThisForYou />

            {/* تقييمات وإثباتات (section fusionnée) */}
            <ProofGallery />

            {/* FAQ */}
            {FAQ}

            {/* CTA final */}
            {FinalCta}
          </div>

          {/* ===== RIGHT SIDEBAR (sticky) — desktop only ===== */}
          <div className="hidden lg:block lg:w-[360px] shrink-0">
            <div className="sticky top-6">
              <div
                className="bg-[#0A0A0A] rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 4px 20px rgba(197,160,78,0.1)' }}
              >
                {/* Banner Image */}
                <img
                  src="/images/sales/petite-accompagnement.webp"
                  alt="صورة المنتج"
                  className="w-full aspect-video object-cover"
                />

                {/* Content */}
                <div className="p-5 space-y-3">
                  {RatingLine}

                  <h3 className="text-white font-bold text-[15px] leading-snug">
                    {PRODUCT_TITLE}
                  </h3>

                  {PriceLine}

                  <a
                    href={STRIPE_LINK}
                    className="block w-full text-center bg-[#C5A04E] hover:bg-[#D4B85C] text-white text-[15px] font-bold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
                    style={{ boxShadow: '0 4px 14px rgba(197,160,78,0.2)' }}
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
            <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{"497 €"}</span>
          </div>
          <a
            href={STRIPE_LINK}
            className="flex-1 text-center bg-[#C5A04E] hover:bg-[#D4B85C] text-white text-sm font-bold py-3 rounded-xl transition-all duration-200"
            style={{ boxShadow: '0 4px 14px rgba(197,160,78,0.2)' }}
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
      </div>
    </main>
  );
}
