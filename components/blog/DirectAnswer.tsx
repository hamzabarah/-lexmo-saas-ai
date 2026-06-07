import type { ReactNode } from "react";

/** Encadré doré "الجواب المباشر" en haut d'article (cible Featured Snippet). */
export default function DirectAnswer({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-[#C5A04E]/40 bg-gradient-to-b from-[#C5A04E]/12 to-transparent p-6">
      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#C5A04E]/15 px-3 py-1 text-xs font-bold text-[#C5A04E]">
        ✅ الجواب المباشر
      </span>
      <div className="text-[15px] leading-loose text-gray-100 [&_strong]:text-white">
        {children}
      </div>
    </div>
  );
}
