"use client";

import { useState, useEffect } from "react";
import { Star, Plus, Minus, ShieldCheck, Play, Target, Store, Smartphone, BarChart3, Bot, Globe, ShoppingCart } from "lucide-react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const faqs = [
    { q: "هل الدورة مناسبة للمبتدئين؟", a: "نعم، الدورة مصممة بالكامل للمبتدئين. حتى لو لم تبع أي منتج عبر الإنترنت من قبل، ستفهم كل شيء خطوة بخطوة من البداية إلى الاحتراف" },
    { q: "هل أحتاج خبرة سابقة في التجارة الإلكترونية؟", a: "لا. الدورة تشرح كل شيء من الصفر: اختيار المنتج الرابح، بناء المتجر الاحترافي، إطلاق الإعلانات، وتحليل النتائج. لا تحتاج أي خبرة مسبقة" },
    { q: "كم من الوقت أحتاج لإكمال الدورة؟", a: "الدورة تحتوي على 27 مرحلة وأكثر من 120 درس فيديو. يمكنك إكمالها في أسبوعين إلى شهر حسب وقتك المتاح. كل درس قصير ومباشر" },
    { q: "هل سأحقق أرباحاً بسرعة؟", a: "النتائج تختلف من شخص لآخر. من يطبق المحتوى بدقة يمكنه رؤية نتائج خلال الأسابيع الأولى. لكن لا نضمن أي مبلغ محدد لأن النجاح يعتمد على مجهودك والتزامك" },
    { q: "هل الدورة خاصة بالمغرب فقط؟", a: "لا. الدورة تغطي البيع في المغرب، السعودية، الإمارات، أمريكا، وأوروبا. يمكنك البيع في أي دولة في العالم" },
  ];

  const features = [
    { icon: Target, title: "البحث عن المنتج الرابح", desc: "اكتشف المنتجات التي تبيع فعلاً" },
    { icon: Store, title: "بناء متجر احترافي", desc: "متجر شوبيفاي جاهز للبيع في أيام" },
    { icon: Smartphone, title: "إعلانات فيسبوك وتيكتوك", desc: "وصول لآلاف العملاء بميزانية صغيرة" },
    { icon: BarChart3, title: "تحليل الأرباح", desc: "اعرف متى تتوقف ومتى تضاعف" },
    { icon: Bot, title: "الذكاء الاصطناعي", desc: "وفّر ساعات من العمل" },
    { icon: Globe, title: "البيع في أي دولة", desc: "المغرب، السعودية، أمريكا، أوروبا" },
  ];

  const platforms = [
    { icon: ShoppingCart, name: "شوبيفاي" },
    { icon: Smartphone, name: "فيسبوك" },
    { icon: Play, name: "تيكتوك" },
    { icon: Globe, name: "علي إكسبريس" },
  ];

  return (
    <main className="min-h-screen bg-[#030712] text-white font-cairo" dir="rtl">

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#d97706]">E</span>COMY
          </span>
          <a href="#" className="bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-bold px-5 py-2 rounded-full transition-all duration-200">
            إشتري الآن
          </a>
        </div>
      </nav>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative pt-14 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d97706]/[0.07] rounded-full blur-[150px]" />
          <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-[#d97706]/[0.04] rounded-full blur-[100px]" />
        </div>

        <div className={`relative max-w-4xl mx-auto px-4 pt-16 pb-20 text-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#d97706]/10 border border-[#d97706]/20 text-[#d97706] text-sm font-bold px-5 py-2 rounded-full mb-8 animate-pulse">
            <span>🔥</span>
            <span>أكثر من 120 درس عملي</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] mb-6">
            من صفر إلى{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#d97706] to-[#f59e0b]">€10,000</span>
            {" "}شهرياً
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            27 مرحلة عملية خطوة بخطوة | ابدأ اليوم
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-10 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-black text-lg">+120</span>
              <span className="text-gray-500">درس</span>
            </div>
            <div className="w-px h-5 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <span className="text-white font-black text-lg">27</span>
              <span className="text-gray-500">مرحلة</span>
            </div>
            <div className="w-px h-5 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <span className="text-white font-black text-lg">5.0</span>
              <Star size={14} className="text-[#d97706] fill-[#d97706]" />
              <span className="text-gray-500">تقييم</span>
            </div>
          </div>

          {/* CTA */}
          <a
            href="#"
            className="inline-block bg-[#d97706] hover:bg-[#b45309] text-white text-xl font-black px-10 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_60px_rgba(217,119,6,0.3)] hover:shadow-[0_0_80px_rgba(217,119,6,0.45)] hover:scale-[1.03]"
          >
            إشتري الآن — 197€ فقط
          </a>
          <p className="text-gray-600 text-sm mt-4">
            السعر الأصلي <span className="line-through">1970€</span> — وفّر 90%
          </p>
        </div>
      </section>

      {/* ===== SECTION 2: SOCIAL PROOF BAR ===== */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-4">ستتعلم البيع على هذه المنصات</p>
          <div className="flex items-center justify-center gap-8 sm:gap-14">
            {platforms.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <p.icon className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-500">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: CE QUE TU VAS APPRENDRE ===== */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black mb-3">ماذا ستتعلم؟</h2>
          <p className="text-gray-500">كل ما تحتاجه لبدء مشروعك الإلكتروني من الصفر</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-[#0f1120] border border-white/5 rounded-2xl p-6 hover:border-[#d97706]/20 transition-all duration-300 group"
            >
              <div className="w-11 h-11 bg-[#d97706]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#d97706]/20 transition-colors">
                <f.icon className="w-5 h-5 text-[#d97706]" />
              </div>
              <h3 className="font-bold text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 4: CAROUSEL + PURCHASE CARD (2 columns) ===== */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Carousel */}
          <div className="flex-1 min-w-0">
            <div className="relative w-full rounded-2xl overflow-hidden bg-[#0f1120] border border-white/5">
              <div className="relative h-[260px] sm:h-[360px] lg:h-[420px]">
                <div className="flex transition-transform duration-500 h-full" style={{ transform: `translateX(${currentSlide * 100}%)` }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-full h-full bg-gradient-to-br from-[#0f1120] to-[#1a1a2e] flex items-center justify-center">
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
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? "bg-[#d97706] w-6" : "bg-white/20 w-2"}`} />
                ))}
              </div>
            </div>

            {/* Description under carousel */}
            <div className="mt-6 space-y-3">
              <h2 className="text-xl font-bold">أكاديمية إيكومي</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                المنصة رقم 1 في العالم العربي لتعليم التجارة الإلكترونية من الصفر حتى الربح.
                نساعدك تبني متجرك الإلكتروني وتبدأ تربح من الإنترنت بخطوات عملية ومجربة.
                أكثر من 120 درس فيديو عملي في 27 مرحلة تغطي كل شيء: البحث عن المنتج الرابح، بناء المتجر،
                إعلانات فيسبوك وتيكتوك، وتحليل الأرباح.
              </p>
            </div>
          </div>

          {/* Sticky Purchase Card */}
          <div className="hidden lg:block lg:w-[340px] shrink-0">
            <div className="sticky top-20">
              <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-[#d97706] fill-[#d97706]" />)}
                  </div>
                  <span className="text-sm text-gray-400">5.0 (1 تقييم)</span>
                </div>

                <h3 className="text-lg font-bold text-white leading-tight">اربح من الإنترنت | التجارة الإلكترونية</h3>

                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-white">197€</span>
                    <span className="text-lg text-gray-500 line-through">1970€</span>
                  </div>
                  <div className="mt-2">
                    <span className="bg-[#d97706]/15 text-[#d97706] text-xs font-bold px-3 py-1 rounded-full border border-[#d97706]/20">وفّر 90%</span>
                  </div>
                </div>

                <a href="#" className="block w-full text-center bg-[#d97706] hover:bg-[#b45309] text-white text-lg font-black py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(217,119,6,0.2)] hover:shadow-[0_0_40px_rgba(217,119,6,0.35)] hover:scale-[1.02]">
                  إشتري الآن
                </a>

                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck size={14} className="text-gray-600" />
                  <span className="text-xs text-gray-600">دفع آمن ومشفّر 100%</span>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-2.5">
                  {["27 مرحلة عملية كاملة", "أكثر من 120 درس فيديو", "وصول مدى الحياة", "تحديثات مجانية", "دعم مباشر عبر البريد"].map((f, i) => (
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
      </section>

      {/* ===== SECTION 5: AVIS CLIENTS ===== */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-center mb-10">ماذا يقول طلابنا</h2>

        {/* Rating Summary */}
        <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-6">
            <div className="text-center shrink-0">
              <p className="text-5xl font-black text-white">5.0</p>
              <div className="flex gap-0.5 mt-1 justify-center">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-[#d97706] fill-[#d97706]" />)}
              </div>
              <p className="text-xs text-gray-500 mt-1">1 تقييم</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3 text-center">{stars}</span>
                  <Star size={11} className="text-[#d97706] fill-[#d97706] shrink-0" />
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#d97706] rounded-full" style={{ width: stars === 5 ? "100%" : "0%" }} />
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-left">{stars === 5 ? "100%" : "0%"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Card */}
        <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#d97706]/20 rounded-full flex items-center justify-center text-[#d97706] font-bold text-sm">R</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Rayan</span>
                <span className="text-xs text-gray-600">@rayan2030</span>
              </div>
              <div className="flex gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-[#d97706] fill-[#d97706]" />)}
              </div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm">
            &ldquo;ومازال مكملت حكى نهار واحد وراني فرحان بزاف! الشرح بسيط لواحد الدرجة ما صعرني شفتها فكاع الدورات اللي درت قبل، والله ما كايلاش شي بحال هادي صراحة، كنظن هاد البرنامج هو أحسن حاجة خلصت فيها ف حياني كاملة&rdquo;
          </p>
        </div>
      </section>

      {/* ===== SECTION 6: GARANTIE ===== */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-[#0f1120] border border-[#d97706]/20 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#d97706]/[0.03]" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-8 h-8 text-[#d97706]" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">ضمان استرداد الأموال 30 يوم</h3>
            <p className="text-gray-400 leading-relaxed">
              إذا لم تكن راضياً 100% نرجعلك فلوسك. بدون أي أسئلة.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: FAQ ===== */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-center mb-10">أسئلة شائعة</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#0f1120] border border-white/5 rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-right gap-3">
                <span className="font-bold text-white text-sm flex-1">{faq.q}</span>
                {openFaq === i
                  ? <Minus size={18} className="text-[#d97706] shrink-0" />
                  : <Plus size={18} className="text-gray-500 shrink-0" />
                }
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-gray-400 leading-relaxed text-sm">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 8: CTA FINAL ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#d97706]/[0.05] to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">جاهز تبدأ رحلتك؟</h2>
          <p className="text-gray-400 text-lg mb-8">انضم الآن وابدأ أول درس خلال دقائق</p>
          <a
            href="#"
            className="inline-block bg-[#d97706] hover:bg-[#b45309] text-white text-xl font-black px-10 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_60px_rgba(217,119,6,0.3)] hover:shadow-[0_0_80px_rgba(217,119,6,0.45)] hover:scale-[1.03]"
          >
            إشتري الآن — 197€ فقط
          </a>
        </div>
      </section>

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
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#030712]/95 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2 shrink-0">
            <span className="text-2xl font-black text-white">197€</span>
            <span className="text-sm text-gray-500 line-through hidden sm:inline">1970€</span>
          </div>
          <a href="#" className="flex-1 max-w-md text-center bg-[#d97706] hover:bg-[#b45309] text-white font-black py-3 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(217,119,6,0.25)]">
            إشتري الآن
          </a>
        </div>
      </div>
    </main>
  );
}
