import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] font-cairo flex flex-col items-center" dir="rtl">

      {/* Header — ECOMY logo */}
      <header className="w-full py-10 flex justify-center">
        <h1 className="text-3xl font-bold font-orbitron tracking-tighter text-[#C5A04E]">
          ECOMY
        </h1>
      </header>

      {/* 3-Card Grid */}
      <section className="flex-1 flex items-center justify-center w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">

          {/* Card 1 — Formation E-commerce */}
          <Link
            href="/formation"
            className="group block bg-[#111111] border border-[#C5A04E]/15 rounded-2xl p-8 hover:border-[#C5A04E]/40 hover:bg-[#141414] transition-all duration-200 text-center space-y-5"
            style={{ boxShadow: '0 4px 24px rgba(197,160,78,0.05)' }}
          >
            <div className="text-5xl">📚</div>
            <h2 className="text-white text-xl font-bold">عندي فكرة وبغيت نبدأ</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              تكوين شامل في التجارة الإلكترونية | 27 مرحلة | 120+ درس
            </p>
            <div className="text-[#C5A04E] text-3xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              197 €
            </div>
            <div className="w-full bg-[#10B981] hover:bg-[#0D9668] text-white font-bold py-3.5 rounded-xl transition-colors text-base">
              ابدأ الآن
            </div>
          </Link>

          {/* Card 2 — Diagnostic Business */}
          <Link
            href="/diagnostic"
            className="group block bg-[#111111] border border-[#C5A04E]/15 rounded-2xl p-8 hover:border-[#C5A04E]/40 hover:bg-[#141414] transition-all duration-200 text-center space-y-5"
            style={{ boxShadow: '0 4px 24px rgba(197,160,78,0.05)' }}
          >
            <div className="text-5xl">🔍</div>
            <h2 className="text-white text-xl font-bold">ما عرفتش من وين نبدأ</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              مكالمة خاصة 45 دقيقة - تحليل وضعك واكتشاف البزنس المناسب لك
            </p>
            <div className="text-[#C5A04E] text-3xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              97 €
            </div>
            <div className="w-full bg-[#E8600A] hover:bg-[#D15509] text-white font-bold py-3.5 rounded-xl transition-colors text-base">
              احجز موعدك
            </div>
          </Link>

          {/* Card 3 — Connexion espace membre */}
          <Link
            href="/login"
            className="group block bg-[#111111] border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:bg-[#141414] transition-all duration-200 text-center space-y-5"
          >
            <div className="text-5xl">🔓</div>
            <h2 className="text-white text-xl font-bold">عندي حساب بالفعل</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              الدخول إلى المنصة
            </p>
            <div className="w-full bg-[#1A1A1A] hover:bg-[#222222] text-white font-bold py-3.5 rounded-xl transition-colors text-base border border-white/10 mt-6">
              تسجيل الدخول
            </div>
          </Link>
        </div>
      </section>

      {/* Telegram Community Banner */}
      <section className="w-full px-4 pb-8">
        <a
          href="https://t.me/TELEGRAM_LINK"
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-5xl mx-auto flex items-center justify-center gap-4 bg-[#111111]/60 border border-[#C5A04E]/10 rounded-2xl px-8 py-4 hover:border-[#C5A04E]/30 transition-colors"
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
