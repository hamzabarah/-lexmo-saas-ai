"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const slides = [0, 1, 2];

  return (
    <main className="min-h-screen bg-white font-cairo" dir="rtl">
      <div className="mx-auto py-8" style={{ maxWidth: '1100px', padding: '32px 24px' }}>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ===== LEFT COLUMN — Main Content ===== */}
          <div className="flex-1 min-w-0 space-y-8 pb-32 lg:pb-8">

            {/* === Carousel === */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[16/9]">
              <div
                className="flex transition-transform duration-300 h-full"
                style={{ transform: `translateX(${currentSlide * 100}%)` }}
              >
                {slides.map((s) => (
                  <div
                    key={s}
                    className="w-full h-full shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${s === 0 ? '#1a1a2e, #16213e' : s === 1 ? '#0f3460, #16213e' : '#1a1a2e, #0f3460'})` }}
                  >
                    <p className="text-white/30 text-lg">صورة {s + 1}</p>
                  </div>
                ))}
              </div>
              {/* Nav arrows */}
              <button
                onClick={() => setCurrentSlide((p) => (p > 0 ? p - 1 : slides.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition"
              >
                <ChevronLeft size={18} className="text-gray-700" />
              </button>
              <button
                onClick={() => setCurrentSlide((p) => (p < slides.length - 1 ? p + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition"
              >
                <ChevronRight size={18} className="text-gray-700" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((s) => (
                  <button
                    key={s}
                    onClick={() => setCurrentSlide(s)}
                    className={`w-2.5 h-2.5 rounded-full transition ${currentSlide === s ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </div>

            {/* === Badge bar under carousel === */}
            <div className="flex items-center bg-[#1a1a1a] border border-white/5 rounded-b-2xl -mt-8 py-3 px-5">
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-base">🏷️</span>
                <span className="text-white text-sm font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>197 €</span>
              </div>
              {/* Divider */}
              <div className="w-px h-5 bg-white/10 mx-4" />
              {/* By ECOMY */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center overflow-hidden">
                  <span className="text-white text-[10px] font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>E</span>
                </div>
                <span className="text-white text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>By <span className="font-semibold">ECOMY</span></span>
              </div>
            </div>

            {/* === Title === */}
            <h1 className="text-[#1A1A1A] text-2xl lg:text-3xl font-bold leading-relaxed">
              من صفر إلى €10,000 شهرياً | 27 مرحلة عملية خطوة بخطوة | ابدأ اليوم
            </h1>

            {/* === Description === */}
            <div className="space-y-4 text-[#4B5563] text-[15px] leading-[1.9]">
              <p>
                أكاديمية إيكومي - المنصة رقم 1 في العالم العربي لتعليم التجارة الإلكترونية من الصفر حتى الربح. نساعدك تبني متجرك الإلكتروني وتبدأ تربح من الإنترنت بخطوات عملية ومجربة. أكثر من 120 درس فيديو عملي في 27 مرحلة.
              </p>
            </div>

            {/* === Reviews — Amazon style === */}
            <div className="space-y-6">
              <h2 className="text-[#1A1A1A] text-xl font-bold">تقييمات العملاء</h2>

              {/* Overall rating */}
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Left — big number */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-5xl font-black text-[#1A1A1A]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>5.0</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className="text-[#FFD700] fill-[#FFD700]" />
                    ))}
                  </div>
                  <span className="text-[#6B7280] text-sm">تقييم واحد</span>
                </div>

                {/* Right — progress bars */}
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm text-[#6B7280] w-6 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{stars}</span>
                      <Star size={12} className="text-[#FFD700] fill-[#FFD700] shrink-0" />
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FFD700] rounded-full"
                          style={{ width: stars === 5 ? '100%' : '0%' }}
                        />
                      </div>
                      <span className="text-sm text-[#6B7280] w-6 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{stars === 5 ? 1 : 0}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual review */}
              <div className="border-t border-gray-100 pt-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold text-sm">ر</div>
                  <div>
                    <p className="text-[#1A1A1A] font-bold text-sm">ريّان</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="text-[#FFD700] fill-[#FFD700]" />
                        ))}
                      </div>
                      <span className="text-[#9CA3AF] text-xs">منذ أسبوع</span>
                    </div>
                  </div>
                </div>
                <p className="text-[#4B5563] text-sm leading-relaxed">
                  كورس ممتاز والله! بديت من الصفر وخلال 3 أسابيع حققت أول مبيعة. الشرح واضح وعملي، وكل مرحلة مبنية على اللي قبلها. أنصح فيه بشدة لأي شخص يبغى يدخل عالم التجارة الإلكترونية.
                </p>
              </div>
            </div>

            {/* === FAQ === */}
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
          </div>

          {/* ===== RIGHT SIDEBAR (sticky) ===== */}
          <div className="hidden lg:block lg:w-[360px] shrink-0">
            <div className="sticky top-6">
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              >
                {/* Banner Image */}
                <div
                  className="w-full aspect-video"
                  style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-white/40 text-sm">صورة المنتج</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-[#FFD700] fill-[#FFD700]" />
                      ))}
                    </div>
                    <span className="text-[#6B7280] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>5.0 (1)</span>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-[#1A1A1A] font-bold text-[15px] leading-snug">
                    اربح من الإنترنت | التجارة الإلكترونية
                  </h3>

                  {/* Price — single line */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[#1A1A1A] text-2xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>197 €</span>
                    <span className="text-gray-500 text-2xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 €</span>
                    <span className="inline-block bg-[#D1FAE5] text-[#065F46] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      تخفيض %90
                    </span>
                  </div>

                  {/* CTA Button */}
                  <a
                    href="#"
                    className="block w-full text-center bg-[#10B981] hover:bg-[#059669] text-white text-[15px] font-bold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
                    style={{ boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}
                  >
                    إشتري الآن
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE STICKY BOTTOM BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white lg:hidden" style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.06)' }}>
        <div className="px-4 py-3 flex items-center gap-4">
          <div className="shrink-0" dir="ltr">
            <span className="text-[#9CA3AF] text-sm line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 €</span>
            <span className="text-[#1A1A1A] text-xl font-black mr-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}> 197 €</span>
          </div>
          <a
            href="#"
            className="flex-1 text-center bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold py-3 rounded-xl transition-all duration-200"
            style={{ boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}
          >
            إشتري الآن
          </a>
        </div>
      </div>
    </main>
  );
}
