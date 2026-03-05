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
