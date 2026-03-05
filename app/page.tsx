"use client";

import { Star } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-cairo" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ===== LEFT COLUMN (placeholder — content coming later) ===== */}
          <div className="flex-1 min-w-0">
            <div className="h-[2000px] bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-center pt-20">
              <p className="text-gray-400 text-lg">المحتوى الرئيسي — سيتم الإضافة قريباً</p>
            </div>
          </div>

          {/* ===== RIGHT SIDEBAR (sticky) ===== */}
          <div className="hidden lg:block lg:w-[360px] shrink-0">
            <div className="sticky top-6">
              <div
                className="bg-white overflow-hidden"
                dir="ltr"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: '12px' }}
              >
                {/* Banner Image — collée aux bords, zéro margin/padding */}
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
                  {/* Rating — étoiles à gauche, texte à droite */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-[#E35205] fill-[#E35205]" />
                      ))}
                    </div>
                    <span className="text-[#6B7280] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>5.0 (1)</span>
                  </div>

                  {/* Product Title — aligné à gauche, 15px, semibold */}
                  <h3 className="text-[#1A1A1A] text-[15px] font-semibold leading-snug text-left">
                    اربح من الإنترنت | التجارة الإلكترونية
                  </h3>

                  {/* Price — ordre: 1970€ barré, 197€ noir, badge تخفيض */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[#9CA3AF] text-[14px] line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 €</span>
                    <span className="text-[#1A1A1A] text-[16px] font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>197 €</span>
                    <span className="inline-block bg-[#D1FAE5] text-[#065F46] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      تخفيض 90%
                    </span>
                  </div>

                  {/* CTA Button — fond vert solide, texte blanc */}
                  <a
                    href="#"
                    className="block w-full text-center text-white text-[15px] font-semibold transition-all duration-200 hover:-translate-y-[1px]"
                    style={{ backgroundColor: '#10B981', padding: '12px', borderRadius: '10px' }}
                  >
                    Acheter maintenant
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
            Acheter maintenant
          </a>
        </div>
      </div>
    </main>
  );
}
