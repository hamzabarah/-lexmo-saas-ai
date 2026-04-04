"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function StarRating({ count, total }: { count: number; total: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#D4A843" stroke="#D4A843" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <span className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {count}.0 ({total})
      </span>
    </div>
  );
}

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

function GrayedCard({ image, alt, title, price, oldPrice }: {
  image: string; alt: string; title: string; price: string; oldPrice: string;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0A0A0A]" style={{ boxShadow: '0 4px 20px rgba(197,160,78,0.05)' }}>
      <img src={image} alt={alt} className="w-full aspect-video object-cover opacity-40 grayscale" />
      <div className="p-4 space-y-2">
        <h3 className="text-gray-500 font-bold text-sm leading-snug">{title}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-600 text-lg font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{oldPrice}</span>
          <span className="text-gray-500 text-lg font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{price}</span>
        </div>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
        <span className="bg-red-900/80 text-red-200 font-bold text-lg px-6 py-3 rounded-xl border border-red-700/50">
          نفذت الأماكن
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const [closedAt, setClosedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        setRegistrationsOpen(data.settings?.registrations_open ?? true);
        setClosedAt(data.settings?.registrations_closed_at || null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const showClosed = loaded && !registrationsOpen;

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-cairo flex flex-col items-center" dir="rtl">

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-red {
          0%, 100% { background-color: rgba(220,38,38,0.08); }
          50% { background-color: rgba(220,38,38,0.2); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-3px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
        @keyframes glow-telegram {
          0%, 100% { box-shadow: 0 0 10px rgba(0,136,204,0.3); }
          50% { box-shadow: 0 0 25px rgba(0,136,204,0.6); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-red { animation: pulse-red 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.6s ease-in-out infinite; }
        .animate-glow-telegram { animation: glow-telegram 2s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>

      {/* Header — ECOMY logo */}
      <header className="w-full py-10 flex justify-center">
        <h1 className="text-3xl font-bold font-orbitron tracking-tighter text-[#C5A04E]">
          ECOMY
        </h1>
      </header>

      {/* 3-Card Grid */}
      <section className="flex-1 flex items-center justify-center w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1050px] w-full md:auto-rows-[1fr]">

          {showClosed ? (
            <>
              {/* ========== INSCRIPTIONS FERMÉES — Col span 2 ========== */}
              <div className="md:col-span-2 animate-fade-in-up">
                <div className="rounded-2xl overflow-hidden border border-red-900/40 animate-pulse-red">
                  {/* Red pulsing bar */}
                  <div className="h-1 bg-red-600 animate-pulse" />

                  <div className="p-8 space-y-6 text-center">
                    {/* Shaking icon */}
                    <div className="text-6xl animate-shake">⛔</div>

                    {/* Main title */}
                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                      🚫 التسجيلات مغلقة 🚫
                    </h2>

                    {/* Subtitle */}
                    <p className="text-red-400 text-lg font-bold">
                      لقد فاتتك الفرصة... الأماكن امتلأت بالكامل
                    </p>

                    {/* Dramatic text */}
                    <div className="space-y-1">
                      <p className="text-gray-400 text-sm">
                        كان بإمكانك أن تكون من بين الناجحين الآن
                      </p>
                      <p className="text-gray-400 text-sm">
                        لكنك تأخرت... والأبواب أُغلقت
                      </p>
                    </div>

                    {/* Timer */}
                    {closedAt && <ClosedTimer closedAt={closedAt} />}

                    {/* Grayed out cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <GrayedCard
                        image="/images/ecommerce-banner.png"
                        alt="تكوين التجارة الإلكترونية"
                        title="اربح من الإنترنت | التجارة الإلكترونية"
                        price="197 €"
                        oldPrice="1970 €"
                      />
                      <GrayedCard
                        image="/images/diagnostic-banner.png"
                        alt="تشخيص بزنس"
                        title="تشخيص بزنس | اكتشف البزنس المناسب لك"
                        price="97 €"
                        oldPrice="970 €"
                      />
                    </div>

                    {/* Telegram CTA */}
                    <a
                      href="https://t.me/ecom_europe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-base px-8 py-4 rounded-xl transition-colors animate-glow-telegram mt-4"
                    >
                      <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      🔔 انضم لقناة التلغرام حتى لا تفوتك الفرصة القادمة
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* ========== MODE NORMAL — Card 1 Formation ========== */}
              <Link
                href="/formation"
                className="group flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-200"
                style={{ boxShadow: '0 4px 20px rgba(197,160,78,0.1)' }}
              >
                <img
                  src="/images/ecommerce-banner.png"
                  alt="تكوين التجارة الإلكترونية"
                  className="w-full aspect-video object-cover"
                />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <StarRating count={5} total="453" />
                  <h3 className="text-white font-bold text-[15px] leading-snug">
                    اربح من الإنترنت | التجارة الإلكترونية
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>197 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      تخفيض %90
                    </span>
                  </div>
                  <div className="flex-1" />
                  <div className="w-full text-center bg-[#10B981] group-hover:bg-[#0D9668] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors">
                    ابدأ الآن
                  </div>
                </div>
              </Link>

              {/* ========== MODE NORMAL — Card 2 Diagnostic ========== */}
              <Link
                href="/diagnostic"
                className="group flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-200"
                style={{ boxShadow: '0 4px 20px rgba(197,160,78,0.1)' }}
              >
                <img
                  src="/images/diagnostic-banner.png"
                  alt="تشخيص بزنس"
                  className="w-full aspect-video object-cover"
                />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <StarRating count={5} total="120" />
                  <h3 className="text-white font-bold text-[15px] leading-snug">
                    تشخيص بزنس | اكتشف البزنس المناسب لك
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>97 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      تخفيض %90
                    </span>
                  </div>
                  <div className="flex-1" />
                  <div className="w-full text-center bg-[#E8600A] group-hover:bg-[#D15509] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors">
                    احجز موعدك
                  </div>
                </div>
              </Link>
            </>
          )}

          {/* Card 3 — Connexion espace membre (TOUJOURS visible) */}
          <Link
            href="/login"
            className="group flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-200"
            style={{ boxShadow: '0 4px 20px rgba(255,255,255,0.03)' }}
          >
            <img
              src="/images/members-area.png"
              alt="منطقة الأعضاء"
              className="w-full aspect-video object-cover"
            />
            <div className="p-5 space-y-3 flex-1 flex flex-col">
              <h3 className="text-white font-bold text-[15px] leading-snug">
                عندي حساب بالفعل
              </h3>
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

      {/* Telegram Community Banner */}
      <section className="w-full px-4 pb-8">
        <a
          href="https://t.me/ecom_europe"
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-[1050px] mx-auto flex items-center justify-center gap-4 bg-[#111111]/60 border border-[#C5A04E]/10 rounded-2xl px-8 py-4 hover:border-[#C5A04E]/30 transition-colors"
        >
          <svg className="w-6 h-6 text-[#26A5E4] shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          <span className="text-gray-400 text-sm font-semibold">انضم لمجتمعنا على تيليغرام</span>
        </a>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center">
        <a href="/legal/terms" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
          Terms & Conditions
        </a>
      </footer>
    </main>
  );
}
