"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronDown } from "lucide-react";

const CTA_TEXT = "سجل قبل إغلاق التسجيل";

const faqData = [
  {
    q: "هل الكورس مناسب للمبتدئين؟",
    a: "نعم، الكورس مصمم خصيصاً للمبتدئين من الصفر. نبدأ معك من إنشاء المتجر خطوة بخطوة حتى تحقيق أول مبيعة وما بعدها.",
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
    a: "نعم، لديك وصول مدى الحياة للمحتوى بالإضافة إلى مجتمع خاص للطلاب للدعم والمساعدة.",
  },
  {
    q: "ما الفرق بينكم وبين الكورسات الأخرى؟",
    a: "نقدم 27 مرحلة عملية مع أكثر من 120 درس فيديو، تغطي كل شيء من إنشاء المتجر إلى الإعلانات المدفوعة على فيسبوك وتيك توك. كل شيء مُحدّث لسنة 2026.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  // Shared components
  const ProductImage = imgError ? (
    <div className="w-full h-[400px] rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
      <span className="text-gray-500 text-lg">صورة المنتج</span>
    </div>
  ) : (
    <img
      src="/images/product2.jpg"
      alt="صورة المنتج"
      className="w-full h-[400px] object-cover rounded-2xl"
      onError={() => setImgError(true)}
    />
  );

  const RatingLine = (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="text-[#FFD700] fill-[#FFD700]" />
        ))}
      </div>
      <span className="text-[#6B7280] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>5.0 (453)</span>
    </div>
  );

  const PriceLine = (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-gray-500 text-2xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{"1970 €"}</span>
      <span className="text-[#1A1A1A] text-2xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{"197 €"}</span>
      <span className="inline-block bg-[#D1FAE5] text-[#065F46] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
        {"تخفيض %90"}
      </span>
    </div>
  );

  const Title = (
    <h1 className="text-[#1A1A1A] text-2xl lg:text-3xl font-bold leading-relaxed">
      {"من صفر إلى €10,000 شهرياً | 27 مرحلة عملية خطوة بخطوة | ابدأ اليوم"}
    </h1>
  );

  const Description = (
    <div className="space-y-4 text-[#4B5563] text-[15px] leading-[1.9]">
      <p>
        {"أكاديمية إيكومي - المنصة رقم 1 في العالم العربي لتعليم التجارة الإلكترونية من الصفر حتى الربح. نساعدك تبني متجرك الإلكتروني وتبدأ تربح من الإنترنت بخطوات عملية ومجربة. أكثر من 120 درس فيديو عملي في 27 مرحلة."}
      </p>
    </div>
  );

  const FAQ = (
    <div className="space-y-4">
      <h2 className="text-[#1A1A1A] text-xl font-bold">الأسئلة الشائعة</h2>
      <div className="space-y-2">
        {faqData.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-right hover:bg-gray-50 transition"
            >
              <span className="text-[#1A1A1A] font-semibold text-[15px]">{item.q}</span>
              <ChevronDown
                size={18}
                className={`text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
              />
            </button>
            {openFaq === i && (
              <div className="px-5 pb-4 text-[#4B5563] text-sm leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const Reviews = (
    <div className="space-y-5">
      <h2 className="text-[#1A1A1A] text-xl font-bold">تقييمات العملاء</h2>

      {/* Overall rating — Amazon style */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-5xl font-black text-[#1A1A1A]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>5.0</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="text-[#FFD700] fill-[#FFD700]" />
            ))}
          </div>
          <span className="text-[#6B7280] text-sm">453 تقييم</span>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-[#6B7280] w-4 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{stars}</span>
              <Star size={12} className="text-[#FFD700] fill-[#FFD700] shrink-0" />
              <div className="flex-1 h-2.5 bg-[#e5e5e5] rounded-full overflow-hidden">
                <div className="h-full bg-[#FFD700] rounded-full" style={{ width: stars === 5 ? '100%' : '0%' }} />
              </div>
              <span className="text-sm text-[#6B7280] w-8 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{stars === 5 ? 453 : 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200" />

      {/* Sub-header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[#1A1A1A] font-bold text-base">أفضل التقييمات</h3>
        <a href="#" className="text-[#d97706] text-sm font-semibold hover:underline">عرض كل التقييمات</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { flag: "\uD83C\uDDF2\uD83C\uDDE6", name: "يوسف", date: "منذ يومين", text: "والله ما كنتش كنصدق أنني غادي نبيع أونلاين، ودابا كاين نهار ما مشا بلا طلبيات. الشرح بسيط وواضح وكل مرحلة مبنية على اللي قبلها. شكرا على هاد البرنامج الرائع!" },
          { flag: "\uD83C\uDDE9\uD83C\uDDFF", name: "أمين", date: "منذ 5 أيام", text: "من أحسن الدورات اللي شفتها في حياتي. بدأت من الصفر وما عندي حتى تجربة، وخلال أسبوعين حققت أول مبيعة! ما توقعتش يكون الأمر سهل بهاد الشكل" },
          { flag: "\uD83C\uDDF8\uD83C\uDDE6", name: "عبدالله", date: "منذ أسبوع", text: "أفضل استثمار عملته في حياتي. المحتوى شامل ومفصل والشرح واضح جداً حتى للمبتدئين. حققت أول €2000 في الشهر الأول من التطبيق" },
          { flag: "\uD83C\uDDF9\uD83C\uDDF3", name: "سامي", date: "منذ أسبوعين", text: "برنامج ممتاز بصح! كنت خايف نبدأ لأني ما عندي خبرة، بس الدورة شرحت كل شي من الصفر. ودابا عندي متجر كيبيع كل يوم \uD83D\uDD25" },
          { flag: "\uD83C\uDDEA\uD83C\uDDEC", name: "محمد", date: "منذ 3 أسابيع", text: "ربنا يجزيك خير، الدورة دي غيرت حياتي. من أول أسبوع بدأت أشوف نتايج حقيقية. الشرح عملي ومباشر ومفيش كلام فاضي. أنصح بيها أي حد عايز يبدأ في التجارة الإلكترونية" },
        ].map((review, i) => (
          <div key={i} className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-2xl p-5 space-y-3" dir="rtl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '24px', lineHeight: 1 }}>{review.flag}</span>
                <span className="text-[#111111] font-bold text-sm">{review.name}</span>
              </div>
              <span className="text-[#888888] text-xs">{review.date}</span>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={14} className="text-[#FFD700] fill-[#FFD700]" />
              ))}
            </div>
            <p className="text-[#333333] text-sm leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const CTAButton = (
    <a
      ref={ctaRef}
      href="#"
      className="block w-full text-center bg-[#F97316] hover:bg-[#EA580C] text-white text-lg font-bold py-4 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
      style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}
    >
      {CTA_TEXT}
    </a>
  );

  return (
    <main className="min-h-screen bg-white font-cairo" dir="rtl">
      <div className="mx-auto py-8" style={{ maxWidth: '1100px', padding: '32px 24px' }}>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ===== LEFT COLUMN — Main Content ===== */}
          <div className="flex-1 min-w-0 space-y-8 pb-32 lg:pb-8">

            {/* Carousel — always first */}
            {ProductImage}

            {/* Mobile only: Rating + Price + CTA before title */}
            <div className="lg:hidden space-y-4">
              {RatingLine}
              <p className="text-[#1A1A1A] text-lg font-bold">اربح من الإنترنت | التجارة الإلكترونية</p>
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
            {Reviews}
          </div>

          {/* ===== RIGHT SIDEBAR (sticky) — desktop only ===== */}
          <div className="hidden lg:block lg:w-[360px] shrink-0">
            <div className="sticky top-6">
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              >
                {/* Banner Image */}
                <img
                  src="/images/product1.jpg"
                  alt="صورة المنتج"
                  className="w-full aspect-video object-cover"
                />

                {/* Content */}
                <div className="p-5 space-y-3">
                  {RatingLine}

                  <h3 className="text-[#1A1A1A] font-bold text-[15px] leading-snug">
                    اربح من الإنترنت | التجارة الإلكترونية
                  </h3>

                  {PriceLine}

                  <a
                    href="#"
                    className="block w-full text-center bg-[#F97316] hover:bg-[#EA580C] text-white text-[15px] font-bold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
                    style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}
                  >
                    {CTA_TEXT}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE STICKY BOTTOM BAR — appears when CTA scrolls out ===== */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white lg:hidden transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.06)' }}
      >
        <div className="px-4 py-3 flex items-center gap-4">
          <div className="shrink-0" dir="ltr">
            <span className="text-[#1A1A1A] text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{"197 €"}</span>
          </div>
          <a
            href="#"
            className="flex-1 text-center bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold py-3 rounded-xl transition-all duration-200"
            style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}
          >
            {CTA_TEXT}
          </a>
        </div>
      </div>
      {/* ===== FOOTER ===== */}
      <div className="w-full py-6 text-center">
        <a href="/legal/terms" className="text-xs text-gray-600 no-underline hover:text-gray-500 transition-colors">
          Terms & Conditions
        </a>
      </div>
    </main>
  );
}
