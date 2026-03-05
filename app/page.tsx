"use client";

import { useState } from "react";
import { Star, Plus, Minus, ShieldCheck, Play } from "lucide-react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const faqs = [
    {
      q: "هل الدورة مناسبة للمبتدئين؟",
      a: "نعم، الدورة مصممة بالكامل للمبتدئين. حتى لو لم تبع أي منتج عبر الإنترنت من قبل، ستفهم كل شيء خطوة بخطوة من البداية إلى الاحتراف",
    },
    {
      q: "هل أحتاج خبرة سابقة في التجارة الإلكترونية؟",
      a: "لا. الدورة تشرح كل شيء من الصفر: اختيار المنتج الرابح، بناء المتجر الاحترافي، إطلاق الإعلانات، وتحليل النتائج. لا تحتاج أي خبرة مسبقة",
    },
    {
      q: "كم من الوقت أحتاج لإكمال الدورة؟",
      a: "الدورة تحتوي على 27 مرحلة وأكثر من 120 درس فيديو. يمكنك إكمالها في أسبوعين إلى شهر حسب وقتك المتاح. كل درس قصير ومباشر",
    },
    {
      q: "هل سأحقق أرباحاً بسرعة؟",
      a: "النتائج تختلف من شخص لآخر. من يطبق المحتوى بدقة يمكنه رؤية نتائج خلال الأسابيع الأولى. لكن لا نضمن أي مبلغ محدد لأن النجاح يعتمد على مجهودك والتزامك",
    },
    {
      q: "هل الدورة خاصة بالمغرب فقط؟",
      a: "لا. الدورة تغطي البيع في المغرب، السعودية، الإمارات، أمريكا، وأوروبا. يمكنك البيع في أي دولة في العالم",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-cairo" dir="rtl">

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#d97706]">E</span>COMY
          </span>
          <a
            href="#"
            className="bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-bold px-5 py-2 rounded-full transition-all duration-200"
          >
            إشتري الآن
          </a>
        </div>
      </nav>

      {/* ===== MAIN LAYOUT: 2 columns ===== */}
      <div className="pt-14 max-w-7xl mx-auto px-4 pb-24">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pt-6">

          {/* ===== LEFT COLUMN (scrollable content) ===== */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Carousel */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-[#1a1a1a]">
              <div className="relative h-[260px] sm:h-[360px] lg:h-[420px]">
                <div
                  className="flex transition-transform duration-500 h-full"
                  style={{ transform: `translateX(${currentSlide * 100}%)` }}
                >
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#252525] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Play className="w-8 h-8 text-[#d97706]" />
                        </div>
                        <p className="text-gray-600 text-sm">صورة {i} — سيتم الإضافة قريباً</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? "bg-[#d97706] w-6" : "bg-white/20 w-2"}`}
                  />
                ))}
              </div>
            </div>

            {/* Title + Description */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">
                من صفر إلى <span className="text-[#d97706]">€10,000</span> شهرياً | 27 مرحلة عملية خطوة بخطوة | ابدأ اليوم
              </h1>
              <p className="text-gray-400 leading-relaxed">
                أكاديمية إيكومي - المنصة رقم 1 في العالم العربي لتعليم التجارة الإلكترونية من الصفر حتى الربح.
                نساعدك تبني متجرك الإلكتروني وتبدأ تربح من الإنترنت بخطوات عملية ومجربة.
                أكثر من 120 درس فيديو عملي في 27 مرحلة تغطي كل شيء: البحث عن المنتج الرابح، بناء المتجر،
                إعلانات فيسبوك وتيكتوك، وتحليل الأرباح.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5" />

            {/* ===== AVIS CLIENTS — Amazon style ===== */}
            <div>
              <h2 className="text-xl font-bold mb-5">التقييمات</h2>

              {/* Rating Summary */}
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 mb-4">
                <div className="flex items-start gap-6">
                  {/* Big number */}
                  <div className="text-center shrink-0">
                    <p className="text-5xl font-black text-white">5.0</p>
                    <div className="flex gap-0.5 mt-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-[#d97706] fill-[#d97706]" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">1 تقييم</p>
                  </div>

                  {/* Progress bars */}
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-3 text-center">{stars}</span>
                        <Star size={11} className="text-[#d97706] fill-[#d97706] shrink-0" />
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#d97706] rounded-full"
                            style={{ width: stars === 5 ? "100%" : "0%" }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-8 text-left">{stars === 5 ? "100%" : "0%"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Card */}
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#d97706]/20 rounded-full flex items-center justify-center text-[#d97706] font-bold text-sm">
                    R
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Rayan</span>
                      <span className="text-xs text-gray-600">@rayan2030</span>
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="text-[#d97706] fill-[#d97706]" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                  &ldquo;ومازال مكملت حكى نهار واحد وراني فرحان بزاف! الشرح بسيط لواحد الدرجة ما صعرني شفتها فكاع الدورات اللي درت قبل، والله ما كايلاش شي بحال هادي صراحة، كنظن هاد البرنامج هو أحسن حاجة خلصت فيها ف حياني كاملة&rdquo;
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5" />

            {/* ===== FAQ ===== */}
            <div>
              <h2 className="text-xl font-bold mb-5">أسئلة شائعة</h2>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-right gap-3"
                    >
                      <span className="font-bold text-white text-sm flex-1">{faq.q}</span>
                      {openFaq === i ? (
                        <Minus size={18} className="text-[#d97706] shrink-0" />
                      ) : (
                        <Plus size={18} className="text-gray-500 shrink-0" />
                      )}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-gray-400 leading-relaxed text-sm">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN (sticky purchase card) ===== */}
          <div className="hidden lg:block lg:w-[340px] shrink-0">
            <div className="sticky top-20">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-5">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-[#d97706] fill-[#d97706]" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">5.0 (1 تقييم)</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white leading-tight">
                  اربح من الإنترنت | التجارة الإلكترونية
                </h3>

                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-white">197€</span>
                    <span className="text-lg text-gray-500 line-through">1970€</span>
                  </div>
                  <div className="mt-2">
                    <span className="bg-[#d97706]/15 text-[#d97706] text-xs font-bold px-3 py-1 rounded-full border border-[#d97706]/20">
                      وفّر 90%
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="#"
                  className="block w-full text-center bg-[#d97706] hover:bg-[#b45309] text-white text-lg font-black py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(217,119,6,0.2)] hover:shadow-[0_0_40px_rgba(217,119,6,0.35)] hover:scale-[1.02]"
                >
                  إشتري الآن
                </a>

                {/* Trust */}
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck size={14} className="text-gray-600" />
                  <span className="text-xs text-gray-600">دفع آمن ومشفّر 100%</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Features */}
                <div className="space-y-2.5">
                  {[
                    "27 مرحلة عملية كاملة",
                    "أكثر من 120 درس فيديو",
                    "وصول مدى الحياة",
                    "تحديثات مجانية",
                    "دعم مباشر عبر البريد",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <ShieldCheck size={15} className="text-[#d97706] shrink-0" />
                      <span className="text-gray-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-6 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-600">© 2025 ECOMY. جميع الحقوق محفوظة</span>
          <div className="flex gap-5 text-xs text-gray-600">
            <a href="/legal/terms" className="hover:text-gray-400 transition-colors">الشروط والأحكام</a>
            <a href="/legal/privacy" className="hover:text-gray-400 transition-colors">سياسة الخصوصية</a>
            <a href="/legal/refund" className="hover:text-gray-400 transition-colors">سياسة الاسترجاع</a>
          </div>
        </div>
      </footer>

      {/* ===== STICKY BOTTOM BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2 shrink-0">
            <span className="text-2xl font-black text-white">197€</span>
            <span className="text-sm text-gray-500 line-through hidden sm:inline">1970€</span>
          </div>
          <a
            href="#"
            className="flex-1 max-w-md text-center bg-[#d97706] hover:bg-[#b45309] text-white font-black py-3 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(217,119,6,0.25)]"
          >
            إشتري الآن
          </a>
        </div>
      </div>
    </main>
  );
}
