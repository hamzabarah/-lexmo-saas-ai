"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

function ClosedTimer({ closedAt }: { closedAt: string }) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    function update() {
      const diff = Date.now() - new Date(closedAt).getTime();
      if (diff < 0) { setElapsed(''); return; }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      if (hours > 0) {
        setElapsed(`${hours} ساعة و ${minutes} دقيقة`);
      } else {
        setElapsed(`${minutes} دقيقة`);
      }
    }
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [closedAt]);

  if (!elapsed) return null;
  return (
    <div className="flex items-center justify-center gap-2 text-red-400/80 text-sm font-bold">
      <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      مغلق منذ {elapsed}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HOMEPAGE
   ═══════════════════════════════════════════════ */
export default function HomePage() {
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const [closedAt, setClosedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        const s = data.settings || {};
        setRegistrationsOpen(s.registrations_open ?? true);
        setClosedAt(s.registrations_closed_at || null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const showClosed = loaded && !registrationsOpen;

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-cairo flex flex-col items-center" dir="rtl">

      {/* CSS Animations */}
      <style>{`
        @keyframes glow-telegram {
          0%, 100% { box-shadow: 0 0 10px rgba(0,136,204,0.3); }
          50% { box-shadow: 0 0 25px rgba(0,136,204,0.6); }
        }
        .animate-glow-telegram { animation: glow-telegram 2s ease-in-out infinite; }
      `}</style>

      {/* Header retiré — landing ultra-épurée, zéro distraction : le prospect
          voit directement les cartes et passe à l'action. */}

      {/* Card Grid */}
      <section className="flex-1 flex items-center justify-center w-full px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1180px] w-full md:auto-rows-[1fr]">

          {/* ───────── Rangée 1 : offres payantes ───────── */}

          {/* Card 1 — Diagnostic Business (97€) */}
          <div className="relative flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden ring-1 ring-white/5" style={{ boxShadow: '0 4px 24px rgba(197,160,78,0.10)' }}>
            {showClosed ? (
              <>
                <img src="/images/cards/card-diagnostic.png" alt="تشخيص بزنس" className="w-full aspect-video object-cover" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-[15px] leading-snug">تشخيص بزنس | اكتشف البزنس المناسب لك</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>97 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">تخفيض %90</span>
                  </div>
                  <div className="flex-1" />
                  <div className="w-full text-center bg-gray-700 text-gray-400 text-[15px] font-bold py-3.5 rounded-xl cursor-not-allowed">
                    احجز موعدك
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl">
                  <span className="bg-red-900/90 text-red-200 font-bold text-lg px-6 py-3 rounded-xl border border-red-700/50">
                    نفذت الأماكن
                  </span>
                </div>
              </>
            ) : (
              <Link href="/diagnostic" className="group flex flex-col flex-1">
                <img src="/images/cards/card-diagnostic.png" alt="تشخيص بزنس" className="w-full aspect-video object-cover" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-[15px] leading-snug">تشخيص بزنس | اكتشف البزنس المناسب لك</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>97 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">تخفيض %90</span>
                  </div>
                  <div className="flex-1" />
                  <div className="w-full text-center bg-[#E8600A] group-hover:bg-[#D15509] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors">
                    احجز موعدك
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Card 2 — Formation E-commerce SANS accompagnement (197€) */}
          <div className="relative flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden ring-1 ring-white/5" style={{ boxShadow: '0 4px 24px rgba(197,160,78,0.10)' }}>
            {showClosed ? (
              <>
                <img src="/images/cards/card-formation.png" alt="تكوين التجارة الإلكترونية — بدون مرافقة" className="w-full aspect-video object-cover" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-[15px] leading-snug">أطلق متجرك بنفسك — من الصفر إلى أول مبيعة أونلاين 🚀</h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed">النظام الكامل بين يديك: خطة واضحة من الصفر إلى أول مبيعة — تطبق بوتيرتك، حتى لو ما عندك أي خبرة</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>197 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">تخفيض %80</span>
                  </div>
                  <div className="flex-1" />
                  <div className="w-full text-center bg-gray-700 text-gray-400 text-[15px] font-bold py-3.5 rounded-xl cursor-not-allowed">
                    ابدأ الآن
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl">
                  <span className="bg-red-900/90 text-red-200 font-bold text-lg px-6 py-3 rounded-xl border border-red-700/50">
                    نفذت الأماكن
                  </span>
                </div>
              </>
            ) : (
              <Link href="/formation-basic" className="group flex flex-col flex-1">
                <img src="/images/cards/card-formation.png" alt="تكوين التجارة الإلكترونية — بدون مرافقة" className="w-full aspect-video object-cover" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-[15px] leading-snug">أطلق متجرك بنفسك — من الصفر إلى أول مبيعة أونلاين 🚀</h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed">النظام الكامل بين يديك: خطة واضحة من الصفر إلى أول مبيعة — تطبق بوتيرتك، حتى لو ما عندك أي خبرة</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>197 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">تخفيض %80</span>
                  </div>
                  <div className="flex-1" />
                  <div className="w-full text-center bg-[#10B981] group-hover:bg-[#0D9668] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors">
                    ابدأ الآن
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Card 3 — Formation + Accompagnement (497€) */}
          <div className="relative flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden ring-1 ring-[#C5A04E]/20" style={{ boxShadow: '0 4px 28px rgba(197,160,78,0.16)' }}>
            {/* Badge "الأكثر طلباً" */}
            <div className="absolute top-3 left-3 z-10 bg-[#C5A04E] text-[#0A0A0A] text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
              ⭐ الأكثر طلباً
            </div>
            {showClosed ? (
              <>
                <img src="/images/cards/card-accompagnement.png" alt="تكوين التجارة الإلكترونية" className="w-full aspect-video object-cover" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-[15px] leading-snug">ما غاديش تمشي بوحدك — مرافقة شخصية حتى أول مبيعة 🤝</h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed">نفس النظام الكامل + خبير يراجع متجرك ويرافقك خطوة بخطوة من الصفر إلى أول مبيعة — أسرع وأأمن طريق</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>497 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">تخفيض %75</span>
                  </div>
                  <div className="flex-1" />
                  <div className="w-full text-center bg-gray-700 text-gray-400 text-[15px] font-bold py-3.5 rounded-xl cursor-not-allowed">
                    ابدأ الآن
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl">
                  <span className="bg-red-900/90 text-red-200 font-bold text-lg px-6 py-3 rounded-xl border border-red-700/50">
                    نفذت الأماكن
                  </span>
                </div>
              </>
            ) : (
              <Link href="/formation" className="group flex flex-col flex-1">
                <img src="/images/cards/card-accompagnement.png" alt="تكوين التجارة الإلكترونية" className="w-full aspect-video object-cover" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-[15px] leading-snug">ما غاديش تمشي بوحدك — مرافقة شخصية حتى أول مبيعة 🤝</h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed">نفس النظام الكامل + خبير يراجع متجرك ويرافقك خطوة بخطوة من الصفر إلى أول مبيعة — أسرع وأأمن طريق</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>497 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">تخفيض %75</span>
                  </div>
                  <div className="flex-1" />
                  {/* Promo info — only when promo active */}
                  <div className="w-full text-center bg-[#10B981] group-hover:bg-[#0D9668] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors">
                    ابدأ الآن
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* ───────── Rangée 2 : ressources gratuites ───────── */}

          {/* Card 4 — Contenu gratuit / Blog */}
          <Link
            href="/blog"
            className="group flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden ring-1 ring-white/5 hover:ring-[#C5A04E]/30 hover:scale-[1.02] transition-all duration-200"
            style={{ boxShadow: '0 4px 20px rgba(197,160,78,0.06)' }}
          >
            <div className="relative w-full aspect-video overflow-hidden">
              <img src="/images/cards/card-blog.png" alt="محتوى مجاني" className="w-full aspect-video object-cover" />
              <span className="absolute top-3 right-3 z-10 bg-[#C5A04E] text-[#0A0A0A] text-[11px] font-black px-3 py-1 rounded-full shadow-lg">مجاني</span>
            </div>
            <div className="p-5 space-y-2.5 flex-1 flex flex-col">
              <h3 className="text-white font-bold text-[15px] leading-snug">محتوى مجاني</h3>
              <p className="text-[#C5A04E] text-[13px] font-bold">أكثر من 300 دليل مجاني</p>
              <p className="text-gray-400 text-[13px] leading-relaxed">مقالات ودلائل عملية في التجارة الإلكترونية والدروبشيبينغ — تعلّم خطوة بخطوة بدون أي تكلفة</p>
              <div className="flex-1" />
              <div className="w-full text-center bg-[#1A1A1A] group-hover:bg-[#222222] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors border border-[#C5A04E]/20">
                تصفّح المدونة
              </div>
            </div>
          </Link>

          {/* Card 5 — Qui sommes-nous */}
          <Link
            href="/a-propos"
            className="group flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden ring-1 ring-white/5 hover:ring-[#10B981]/30 hover:scale-[1.02] transition-all duration-200"
            style={{ boxShadow: '0 4px 20px rgba(16,185,129,0.05)' }}
          >
            <div className="relative w-full aspect-video overflow-hidden">
              <img src="/images/cards/card-anous.png" alt="من نحن" className="w-full aspect-video object-cover" />
            </div>
            <div className="p-5 space-y-2.5 flex-1 flex flex-col">
              <h3 className="text-white font-bold text-[15px] leading-snug">من نحن</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed">تعرّف على أكاديمية ECOMY ورؤيتنا: تعليم التجارة الإلكترونية بصدق وبلا وعود زائفة</p>
              <div className="flex-1" />
              <div className="w-full text-center bg-[#1A1A1A] group-hover:bg-[#222222] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors border border-white/10">
                اقرأ المزيد
              </div>
            </div>
          </Link>

          {/* Card 6 — Connexion espace membre */}
          <Link
            href="/login"
            className="group flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden ring-1 ring-white/5 hover:ring-white/15 hover:scale-[1.02] transition-all duration-200"
            style={{ boxShadow: '0 4px 20px rgba(255,255,255,0.03)' }}
          >
            <img src="/images/cards/card-login.png" alt="منطقة الأعضاء" className="w-full aspect-video object-cover" />
            <div className="p-5 space-y-3 flex-1 flex flex-col">
              <h3 className="text-white font-bold text-[15px] leading-snug">عندي حساب بالفعل</h3>
              <p className="text-gray-500 text-sm">الدخول إلى المنصة</p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-[#1A1A1A] border-2 border-[#0A0A0A] flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-[#C5A04E]/20 border-2 border-[#0A0A0A] flex items-center justify-center">
                    <span className="text-[#C5A04E] text-[9px] font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>+</span>
                  </div>
                </div>
                <span className="text-gray-400 text-xs font-bold">+1000 عضو مسجل</span>
              </div>
              <div className="flex-1" />
              <div className="w-full text-center bg-[#1A1A1A] group-hover:bg-[#222222] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors border border-white/10">
                تسجيل الدخول
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Closed registrations banner */}
      {showClosed && (
        <section className="w-full px-4 pb-6">
          <div className="max-w-[1050px] mx-auto rounded-2xl border border-red-900/30 bg-[#0A0A0A] p-8 text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              🚫 التسجيلات مغلقة 🚫
            </h2>
            <p className="text-red-400 text-base font-bold">
              لقد فاتتك الفرصة... الأماكن امتلأت بالكامل
            </p>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">كان بإمكانك أن تكون من بين الناجحين الآن</p>
              <p className="text-gray-400 text-sm">لكنك تأخرت... والأبواب أُغلقت</p>
            </div>
            {closedAt && <ClosedTimer closedAt={closedAt} />}
            <a
              href="https://t.me/ecom_europe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-base px-8 py-4 rounded-xl transition-colors animate-glow-telegram mt-2"
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              🔔 انضم لقناة التلغرام حتى لا تفوتك الفرصة القادمة
            </a>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full py-6 flex items-center justify-center gap-5">
        <Link href="/blog" className="text-xs text-gray-500 hover:text-[#C5A04E] transition-colors">
          المدونة
        </Link>
        <span className="text-gray-700">·</span>
        <a href="/legal/terms" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
          Terms & Conditions
        </a>
      </footer>
    </main>
  );
}
