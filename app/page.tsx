"use client";

import { useState } from "react";
import { Star, ChevronDown, ChevronUp, ShieldCheck, Zap, BookOpen, Play, Users, TrendingUp } from "lucide-react";

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

  const stats = [
    { icon: BookOpen, value: "120+", label: "درس فيديو" },
    { icon: Play, value: "27", label: "مرحلة عملية" },
    { icon: Users, value: "500+", label: "طالب نشط" },
    { icon: TrendingUp, value: "€10K+", label: "أرباح شهرية" },
  ];

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-cairo" dir="rtl">

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#d97706]">E</span>COMY
          </span>
          <a
            href="#pricing"
            className="bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200"
          >
            إشتري الآن
          </a>
        </div>
      </nav>

      {/* ===== HERO CAROUSEL ===== */}
      <section className="pt-16">
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-[#1a1a1a] overflow-hidden">
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(${currentSlide * 100}%)` }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-[#d97706]" />
                  </div>
                  <p className="text-gray-500 text-lg">صورة {i} — سيتم الإضافة قريباً</p>
                </div>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? "bg-[#d97706] w-8" : "bg-white/20"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN TITLE + DESCRIPTION ===== */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6">
          من صفر إلى <span className="text-[#d97706]">€10,000</span> شهرياً
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 font-bold mb-3">
          27 مرحلة عملية خطوة بخطوة | ابدأ اليوم
        </p>
        <div className="w-16 h-1 bg-[#d97706] rounded-full mx-auto my-8" />
        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
          أكاديمية إيكومي - المنصة رقم 1 في العالم العربي لتعليم التجارة الإلكترونية من الصفر حتى الربح.
          نساعدك تبني متجرك الإلكتروني وتبدأ تربح من الإنترنت بخطوات عملية ومجربة.
          أكثر من 120 درس فيديو عملي في 27 مرحلة تغطي كل شيء: البحث عن المنتج الرابح، بناء المتجر،
          إعلانات فيسبوك وتيكتوك، وتحليل الأرباح.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
              <stat.icon className="w-7 h-7 text-[#d97706] mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-b from-[#1a1a1a] to-[#141414] border border-white/10 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#d97706]/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <div className="inline-block bg-[#d97706]/10 border border-[#d97706]/30 text-[#d97706] text-sm font-bold px-4 py-1.5 rounded-full mb-6">
              وفّر 90%
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">الوصول الكامل للأكاديمية</h2>

            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-2xl text-gray-500 line-through">1970€</span>
              <span className="text-6xl font-black text-white">197€</span>
            </div>
            <p className="text-gray-500 text-sm mb-8">دفعة واحدة — وصول مدى الحياة</p>

            {/* Features */}
            <div className="text-right space-y-3 mb-8 max-w-sm mx-auto">
              {[
                "27 مرحلة عملية كاملة",
                "أكثر من 120 درس فيديو",
                "وصول مدى الحياة",
                "تحديثات مجانية مستقبلية",
                "دعم مباشر عبر البريد",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-[#d97706] shrink-0" />
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="block w-full bg-[#d97706] hover:bg-[#b45309] text-white text-xl font-black py-4 rounded-2xl transition-all duration-200 shadow-[0_0_40px_rgba(217,119,6,0.3)] hover:shadow-[0_0_60px_rgba(217,119,6,0.4)] hover:scale-[1.02]"
            >
              إشتري الآن
            </a>

            <div className="flex items-center justify-center gap-2 mt-4">
              <ShieldCheck size={14} className="text-gray-600" />
              <span className="text-xs text-gray-600">دفع آمن ومشفّر 100%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AVIS CLIENTS ===== */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-4">ماذا يقول طلابنا</h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} className="text-[#d97706] fill-[#d97706]" />
            ))}
          </div>
          <p className="text-gray-400">5.0 — تقييم ممتاز</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-[#d97706]/20 rounded-full flex items-center justify-center text-[#d97706] font-bold text-lg">
              R
            </div>
            <div>
              <p className="font-bold text-white">Rayan</p>
              <p className="text-sm text-gray-500">@rayan2030</p>
            </div>
            <div className="mr-auto flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-[#d97706] fill-[#d97706]" />
              ))}
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed text-lg">
            &ldquo;ومازال مكملت حكى نهار واحد وراني فرحان بزاف! الشرح بسيط لواحد الدرجة ما صعرني شفتها فكاع الدورات اللي درت قبل، والله ما كايلاش شي بحال هادي صراحة، كنظن هاد البرنامج هو أحسن حاجة خلصت فيها ف حياني كاملة&rdquo;
          </p>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-center mb-10">أسئلة شائعة</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-right"
              >
                <span className="font-bold text-white text-lg">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp size={20} className="text-[#d97706] shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500 shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-black mb-4">جاهز تبدأ رحلتك؟</h2>
        <p className="text-gray-400 text-lg mb-8">انضم لأكثر من 500 طالب بدأوا يربحون من الإنترنت</p>
        <a
          href="#pricing"
          className="inline-block bg-[#d97706] hover:bg-[#b45309] text-white text-xl font-black px-12 py-4 rounded-2xl transition-all duration-200 shadow-[0_0_40px_rgba(217,119,6,0.3)] hover:shadow-[0_0_60px_rgba(217,119,6,0.4)] hover:scale-[1.02]"
        >
          إشتري الآن — 197€
        </a>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-600">© 2025 ECOMY. جميع الحقوق محفوظة</span>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="/legal/terms" className="hover:text-gray-400 transition-colors">الشروط والأحكام</a>
            <a href="/legal/privacy" className="hover:text-gray-400 transition-colors">سياسة الخصوصية</a>
            <a href="/legal/refund" className="hover:text-gray-400 transition-colors">سياسة الاسترجاع</a>
          </div>
        </div>
      </footer>

      {/* ===== STICKY MOBILE CTA ===== */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#0f0f0f]/90 backdrop-blur-md border-t border-white/5 md:hidden z-50">
        <a
          href="#pricing"
          className="block w-full text-center bg-[#d97706] hover:bg-[#b45309] text-white py-3 rounded-full font-black shadow-[0_0_20px_rgba(217,119,6,0.3)]"
        >
          إشتري الآن — 197€
        </a>
      </div>
    </main>
  );
}
