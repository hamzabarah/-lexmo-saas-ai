"use client";

import { Star, ShoppingBag } from "lucide-react";

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
          <div className="hidden lg:block lg:w-[380px] shrink-0">
            <div className="sticky top-5">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4">

                {/* Logo + Brand */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#1A1A1A] font-bold text-sm tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>ecomfy</p>
                    <p className="text-[#6B7280] text-xs">ابني متجرك وابدأ تربح</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                    ))}
                  </div>
                  <span className="text-[#6B7280] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>5.0 (1)</span>
                </div>

                {/* Product Title */}
                <h3 className="text-[#1A1A1A] font-bold text-base leading-snug">
                  اربح من الإنترنت | التجارة الإلكترونية
                </h3>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[#9CA3AF] text-lg line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 €</span>
                    <span className="text-[#10B981] text-3xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>197 €</span>
                  </div>
                  <div>
                    <span className="inline-block bg-[#D1FAE5] text-[#065F46] text-xs font-bold px-3 py-1 rounded-full">
                      Économisez 90%
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="#"
                  className="block w-full text-center bg-[#3B82F6] hover:bg-[#2563EB] text-white text-base font-bold py-3.5 rounded-lg transition-colors duration-200"
                >
                  Acheter maintenant
                </a>

                {/* Footer */}
                <p className="text-[#9CA3AF] text-xs text-center pt-1">
                  Alimenté par ecomfy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE STICKY BOTTOM BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] lg:hidden">
        <div className="px-4 py-3 flex items-center gap-4">
          <div className="shrink-0" dir="ltr">
            <span className="text-[#9CA3AF] text-sm line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 €</span>
            <span className="text-[#10B981] text-xl font-black mr-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}> 197 €</span>
          </div>
          <a
            href="#"
            className="flex-1 text-center bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-bold py-3 rounded-lg transition-colors duration-200"
          >
            Acheter maintenant
          </a>
        </div>
      </div>
    </main>
  );
}
