"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const CTA_TEXT = "\u0633\u062C\u0644 \u0642\u0628\u0644 \u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u062A\u0633\u062C\u064A\u0644";

const faqData = [
  {
    q: "\u0647\u0644 \u0627\u0644\u0643\u0648\u0631\u0633 \u0645\u0646\u0627\u0633\u0628 \u0644\u0644\u0645\u0628\u062A\u062F\u0626\u064A\u0646\u061F",
    a: "\u0646\u0639\u0645\u060C \u0627\u0644\u0643\u0648\u0631\u0633 \u0645\u0635\u0645\u0645 \u062E\u0635\u064A\u0635\u0627\u064B \u0644\u0644\u0645\u0628\u062A\u062F\u0626\u064A\u0646 \u0645\u0646 \u0627\u0644\u0635\u0641\u0631. \u0646\u0628\u062F\u0623 \u0645\u0639\u0643 \u0645\u0646 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u062A\u062C\u0631 \u062E\u0637\u0648\u0629 \u0628\u062E\u0637\u0648\u0629 \u062D\u062A\u0649 \u062A\u062D\u0642\u064A\u0642 \u0623\u0648\u0644 \u0645\u0628\u064A\u0639\u0629 \u0648\u0645\u0627 \u0628\u0639\u062F\u0647\u0627.",
  },
  {
    q: "\u0643\u0645 \u0645\u0646 \u0627\u0644\u0648\u0642\u062A \u0623\u062D\u062A\u0627\u062C \u0644\u0623\u0628\u062F\u0623 \u0623\u0631\u0628\u062D\u061F",
    a: "\u0645\u0639\u0638\u0645 \u0627\u0644\u0637\u0644\u0627\u0628 \u064A\u0628\u062F\u0623\u0648\u0646 \u0628\u062A\u062D\u0642\u064A\u0642 \u0645\u0628\u064A\u0639\u0627\u062A \u062E\u0644\u0627\u0644 2-4 \u0623\u0633\u0627\u0628\u064A\u0639 \u0645\u0646 \u0628\u062F\u0627\u064A\u0629 \u0627\u0644\u062A\u0637\u0628\u064A\u0642. \u0627\u0644\u0646\u062A\u0627\u0626\u062C \u062A\u0639\u062A\u0645\u062F \u0639\u0644\u0649 \u0645\u062F\u0649 \u0627\u0644\u062A\u0632\u0627\u0645\u0643 \u0628\u0627\u0644\u062A\u0637\u0628\u064A\u0642.",
  },
  {
    q: "\u0647\u0644 \u0623\u062D\u062A\u0627\u062C \u0631\u0623\u0633 \u0645\u0627\u0644 \u0643\u0628\u064A\u0631 \u0644\u0644\u0628\u062F\u0621\u061F",
    a: "\u0644\u0627\u060C \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0628\u062F\u0621 \u0628\u0645\u064A\u0632\u0627\u0646\u064A\u0629 \u0628\u0633\u064A\u0637\u0629. \u0646\u0639\u0644\u0645\u0643 \u0643\u064A\u0641 \u062A\u0628\u062F\u0623 \u0628\u0623\u0642\u0644 \u062A\u0643\u0644\u0641\u0629 \u0645\u0645\u0643\u0646\u0629 \u0648\u062A\u0646\u0645\u0651\u064A \u0645\u0634\u0631\u0648\u0639\u0643 \u062A\u062F\u0631\u064A\u062C\u064A\u0627\u064B.",
  },
  {
    q: "\u0647\u0644 \u064A\u0648\u062C\u062F \u062F\u0639\u0645 \u0628\u0639\u062F \u0627\u0644\u0634\u0631\u0627\u0621\u061F",
    a: "\u0646\u0639\u0645\u060C \u0644\u062F\u064A\u0643 \u0648\u0635\u0648\u0644 \u0645\u062F\u0649 \u0627\u0644\u062D\u064A\u0627\u0629 \u0644\u0644\u0645\u062D\u062A\u0648\u0649 \u0628\u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0645\u062C\u062A\u0645\u0639 \u062E\u0627\u0635 \u0644\u0644\u0637\u0644\u0627\u0628 \u0644\u0644\u062F\u0639\u0645 \u0648\u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629.",
  },
  {
    q: "\u0645\u0627 \u0627\u0644\u0641\u0631\u0642 \u0628\u064A\u0646\u0643\u0645 \u0648\u0628\u064A\u0646 \u0627\u0644\u0643\u0648\u0631\u0633\u0627\u062A \u0627\u0644\u0623\u062E\u0631\u0649\u061F",
    a: "\u0646\u0642\u062F\u0645 27 \u0645\u0631\u062D\u0644\u0629 \u0639\u0645\u0644\u064A\u0629 \u0645\u0639 \u0623\u0643\u062B\u0631 \u0645\u0646 120 \u062F\u0631\u0633 \u0641\u064A\u062F\u064A\u0648\u060C \u062A\u063A\u0637\u064A \u0643\u0644 \u0634\u064A\u0621 \u0645\u0646 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u062A\u062C\u0631 \u0625\u0644\u0649 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0629 \u0639\u0644\u0649 \u0641\u064A\u0633\u0628\u0648\u0643 \u0648\u062A\u064A\u0643 \u062A\u0648\u0643. \u0643\u0644 \u0634\u064A\u0621 \u0645\u064F\u062D\u062F\u0651\u062B \u0644\u0633\u0646\u0629 2026.",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const slides = [0, 1, 2];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  // Shared components
  const Carousel = (
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
            <p className="text-white/30 text-lg">{"\u0635\u0648\u0631\u0629"} {s + 1}</p>
          </div>
        ))}
      </div>
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
  );

  const RatingLine = (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="text-[#FFD700] fill-[#FFD700]" />
        ))}
      </div>
      <span className="text-[#6B7280] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>5.0 (5)</span>
    </div>
  );

  const PriceLine = (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-gray-500 text-2xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 \u20AC</span>
      <span className="text-[#1A1A1A] text-2xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>197 \u20AC</span>
      <span className="inline-block bg-[#D1FAE5] text-[#065F46] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
        {"\u062A\u062E\u0641\u064A\u0636"} %90
      </span>
    </div>
  );

  const Title = (
    <h1 className="text-[#1A1A1A] text-2xl lg:text-3xl font-bold leading-relaxed">
      {"\u0645\u0646 \u0635\u0641\u0631 \u0625\u0644\u0649"} \u20AC10,000 {"\u0634\u0647\u0631\u064A\u0627\u064B | 27 \u0645\u0631\u062D\u0644\u0629 \u0639\u0645\u0644\u064A\u0629 \u062E\u0637\u0648\u0629 \u0628\u062E\u0637\u0648\u0629 | \u0627\u0628\u062F\u0623 \u0627\u0644\u064A\u0648\u0645"}
    </h1>
  );

  const Description = (
    <div className="space-y-4 text-[#4B5563] text-[15px] leading-[1.9]">
      <p>
        {"\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0625\u064A\u0643\u0648\u0645\u064A - \u0627\u0644\u0645\u0646\u0635\u0629 \u0631\u0642\u0645 1 \u0641\u064A \u0627\u0644\u0639\u0627\u0644\u0645 \u0627\u0644\u0639\u0631\u0628\u064A \u0644\u062A\u0639\u0644\u064A\u0645 \u0627\u0644\u062A\u062C\u0627\u0631\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0645\u0646 \u0627\u0644\u0635\u0641\u0631 \u062D\u062A\u0649 \u0627\u0644\u0631\u0628\u062D. \u0646\u0633\u0627\u0639\u062F\u0643 \u062A\u0628\u0646\u064A \u0645\u062A\u062C\u0631\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0648\u062A\u0628\u062F\u0623 \u062A\u0631\u0628\u062D \u0645\u0646 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A \u0628\u062E\u0637\u0648\u0627\u062A \u0639\u0645\u0644\u064A\u0629 \u0648\u0645\u062C\u0631\u0628\u0629. \u0623\u0643\u062B\u0631 \u0645\u0646 120 \u062F\u0631\u0633 \u0641\u064A\u062F\u064A\u0648 \u0639\u0645\u0644\u064A \u0641\u064A 27 \u0645\u0631\u062D\u0644\u0629."}
      </p>
    </div>
  );

  const FAQ = (
    <div className="space-y-4">
      <h2 className="text-[#1A1A1A] text-xl font-bold">{"\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629"}</h2>
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
  );

  const Reviews = (
    <div className="space-y-4">
      <h2 className="text-[#1A1A1A] text-xl font-bold">{"\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u0639\u0645\u0644\u0627\u0621"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { flag: "\uD83C\uDDF2\uD83C\uDDE6", name: "\u064A\u0648\u0633\u0641", date: "\u0645\u0646\u0630 \u064A\u0648\u0645\u064A\u0646", text: "\u0648\u0627\u0644\u0644\u0647 \u0645\u0627 \u0643\u0646\u062A\u0634 \u0643\u0646\u0635\u062F\u0642 \u0623\u0646\u0646\u064A \u063A\u0627\u062F\u064A \u0646\u0628\u064A\u0639 \u0623\u0648\u0646\u0644\u0627\u064A\u0646\u060C \u0648\u062F\u0627\u0628\u0627 \u0643\u0627\u064A\u0646 \u0646\u0647\u0627\u0631 \u0645\u0627 \u0645\u0634\u0627 \u0628\u0644\u0627 \u0637\u0644\u0628\u064A\u0627\u062A. \u0627\u0644\u0634\u0631\u062D \u0628\u0633\u064A\u0637 \u0648\u0648\u0627\u0636\u062D \u0648\u0643\u0644 \u0645\u0631\u062D\u0644\u0629 \u0645\u0628\u0646\u064A\u0629 \u0639\u0644\u0649 \u0627\u0644\u0644\u064A \u0642\u0628\u0644\u0647\u0627. \u0634\u0643\u0631\u0627 \u0639\u0644\u0649 \u0647\u0627\u062F \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0627\u0644\u0631\u0627\u0626\u0639!" },
          { flag: "\uD83C\uDDE9\uD83C\uDDFF", name: "\u0623\u0645\u064A\u0646", date: "\u0645\u0646\u0630 5 \u0623\u064A\u0627\u0645", text: "\u0645\u0646 \u0623\u062D\u0633\u0646 \u0627\u0644\u062F\u0648\u0631\u0627\u062A \u0627\u0644\u0644\u064A \u0634\u0641\u062A\u0647\u0627 \u0641\u064A \u062D\u064A\u0627\u062A\u064A. \u0628\u062F\u0623\u062A \u0645\u0646 \u0627\u0644\u0635\u0641\u0631 \u0648\u0645\u0627 \u0639\u0646\u062F\u064A \u062D\u062A\u0649 \u062A\u062C\u0631\u0628\u0629\u060C \u0648\u062E\u0644\u0627\u0644 \u0623\u0633\u0628\u0648\u0639\u064A\u0646 \u062D\u0642\u0642\u062A \u0623\u0648\u0644 \u0645\u0628\u064A\u0639\u0629! \u0645\u0627 \u062A\u0648\u0642\u0639\u062A\u0634 \u064A\u0643\u0648\u0646 \u0627\u0644\u0623\u0645\u0631 \u0633\u0647\u0644 \u0628\u0647\u0627\u062F \u0627\u0644\u0634\u0643\u0644" },
          { flag: "\uD83C\uDDF8\uD83C\uDDE6", name: "\u0639\u0628\u062F\u0627\u0644\u0644\u0647", date: "\u0645\u0646\u0630 \u0623\u0633\u0628\u0648\u0639", text: "\u0623\u0641\u0636\u0644 \u0627\u0633\u062A\u062B\u0645\u0627\u0631 \u0639\u0645\u0644\u062A\u0647 \u0641\u064A \u062D\u064A\u0627\u062A\u064A. \u0627\u0644\u0645\u062D\u062A\u0648\u0649 \u0634\u0627\u0645\u0644 \u0648\u0645\u0641\u0635\u0644 \u0648\u0627\u0644\u0634\u0631\u062D \u0648\u0627\u0636\u062D \u062C\u062F\u0627\u064B \u062D\u062A\u0649 \u0644\u0644\u0645\u0628\u062A\u062F\u0626\u064A\u0646. \u062D\u0642\u0642\u062A \u0623\u0648\u0644 2000\u20AC \u0641\u064A \u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0623\u0648\u0644 \u0645\u0646 \u0627\u0644\u062A\u0637\u0628\u064A\u0642" },
          { flag: "\uD83C\uDDF9\uD83C\uDDF3", name: "\u0633\u0627\u0645\u064A", date: "\u0645\u0646\u0630 \u0623\u0633\u0628\u0648\u0639\u064A\u0646", text: "\u0628\u0631\u0646\u0627\u0645\u062C \u0645\u0645\u062A\u0627\u0632 \u0628\u0635\u062D! \u0643\u0646\u062A \u062E\u0627\u064A\u0641 \u0646\u0628\u062F\u0623 \u0644\u0623\u0646\u064A \u0645\u0627 \u0639\u0646\u062F\u064A \u062E\u0628\u0631\u0629\u060C \u0628\u0633 \u0627\u0644\u062F\u0648\u0631\u0629 \u0634\u0631\u062D\u062A \u0643\u0644 \u0634\u064A \u0645\u0646 \u0627\u0644\u0635\u0641\u0631. \u0648\u062F\u0627\u0628\u0627 \u0639\u0646\u062F\u064A \u0645\u062A\u062C\u0631 \u0643\u064A\u0628\u064A\u0639 \u0643\u0644 \u064A\u0648\u0645 \uD83D\uDD25" },
          { flag: "\uD83C\uDDEA\uD83C\uDDEC", name: "\u0645\u062D\u0645\u062F", date: "\u0645\u0646\u0630 3 \u0623\u0633\u0627\u0628\u064A\u0639", text: "\u0631\u0628\u0646\u0627 \u064A\u062C\u0632\u064A\u0643 \u062E\u064A\u0631\u060C \u0627\u0644\u062F\u0648\u0631\u0629 \u062F\u064A \u063A\u064A\u0631\u062A \u062D\u064A\u0627\u062A\u064A. \u0645\u0646 \u0623\u0648\u0644 \u0623\u0633\u0628\u0648\u0639 \u0628\u062F\u0623\u062A \u0623\u0634\u0648\u0641 \u0646\u062A\u0627\u064A\u062C \u062D\u0642\u064A\u0642\u064A\u0629. \u0627\u0644\u0634\u0631\u062D \u0639\u0645\u0644\u064A \u0648\u0645\u0628\u0627\u0634\u0631 \u0648\u0645\u0641\u064A\u0634 \u0643\u0644\u0627\u0645 \u0641\u0627\u0636\u064A. \u0623\u0646\u0635\u062D \u0628\u064A\u0647\u0627 \u0623\u064A \u062D\u062F \u0639\u0627\u064A\u0632 \u064A\u0628\u062F\u0623 \u0641\u064A \u0627\u0644\u062A\u062C\u0627\u0631\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629" },
        ].map((review, i) => (
          <div key={i} className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-2xl p-5 space-y-3" dir="rtl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '24px', lineHeight: 1 }}>{review.flag}</span>
                <span className="text-[#111111] font-bold text-sm">{review.name}</span>
              </div>
              <span className="text-[#888888] text-xs">{review.date}</span>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={14} className="text-[#FFD700] fill-[#FFD700]" />
              ))}
            </div>
            <p className="text-[#333333] text-sm leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const CTAButton = (
    <a
      ref={ctaRef}
      href="#"
      className="block w-full text-center bg-[#F97316] hover:bg-[#EA580C] text-white text-lg font-bold py-4 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
      style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}
    >
      {CTA_TEXT}
    </a>
  );

  return (
    <main className="min-h-screen bg-white font-cairo" dir="rtl">
      <div className="mx-auto py-8" style={{ maxWidth: '1100px', padding: '32px 24px' }}>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ===== LEFT COLUMN — Main Content ===== */}
          <div className="flex-1 min-w-0 space-y-8 pb-32 lg:pb-8">

            {/* Carousel — always first */}
            {Carousel}

            {/* Mobile only: Rating + Price + CTA before title */}
            <div className="lg:hidden space-y-4">
              {RatingLine}
              {PriceLine}
              {CTAButton}
            </div>

            {/* Title */}
            {Title}

            {/* Description */}
            {Description}

            {/* FAQ */}
            {FAQ}

            {/* Reviews */}
            {Reviews}
          </div>

          {/* ===== RIGHT SIDEBAR (sticky) — desktop only ===== */}
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
                    <p className="text-white/40 text-sm">{"\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C"}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {RatingLine}

                  <h3 className="text-[#1A1A1A] font-bold text-[15px] leading-snug">
                    {"\u0627\u0631\u0628\u062D \u0645\u0646 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A | \u0627\u0644\u062A\u062C\u0627\u0631\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629"}
                  </h3>

                  {PriceLine}

                  <a
                    href="#"
                    className="block w-full text-center bg-[#F97316] hover:bg-[#EA580C] text-white text-[15px] font-bold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-[1px]"
                    style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}
                  >
                    {CTA_TEXT}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE STICKY BOTTOM BAR — appears when CTA scrolls out ===== */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white lg:hidden transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.06)' }}
      >
        <div className="px-4 py-3 flex items-center gap-4">
          <div className="shrink-0" dir="ltr">
            <span className="text-[#1A1A1A] text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>197 \u20AC</span>
          </div>
          <a
            href="#"
            className="flex-1 text-center bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold py-3 rounded-xl transition-all duration-200"
            style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}
          >
            {CTA_TEXT}
          </a>
        </div>
      </div>
    </main>
  );
}
