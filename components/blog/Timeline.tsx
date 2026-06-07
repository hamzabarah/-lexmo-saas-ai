"use client";

import { useEffect, useRef, useState } from "react";

/** Une étape : apparaît au scroll (IntersectionObserver). */
function Step({ label, text, last }: { label: string; text: string; last: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative pr-8 pb-8 transition-all duration-700 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {!last && <span className="absolute right-[7px] top-3 bottom-0 w-px bg-[#C5A04E]/30" />}
      <span className="absolute right-0 top-1.5 h-3.5 w-3.5 rounded-full bg-[#C5A04E] shadow-[0_0_10px_2px_rgba(197,160,78,0.6)]" />
      <h4 className="font-bold text-[#C5A04E]">{label}</h4>
      <p className="mt-1 text-sm leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}

/** Frise verticale, points or lumineux, apparition au scroll. */
export default function Timeline({ steps = [] }: { steps?: string[][] }) {
  return (
    <div className="not-prose my-8">
      {steps.map((s, i) => (
        <Step key={i} label={s[0]} text={s[1]} last={i === steps.length - 1} />
      ))}
    </div>
  );
}
