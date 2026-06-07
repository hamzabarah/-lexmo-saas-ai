"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

/** Accordéon FAQ (＋ → ✕) + JSON-LD FAQPage généré. */
export default function FAQ({ items = [] }: { items?: string[][] }) {
  const [open, setOpen] = useState<number | null>(null);

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="not-prose my-8 space-y-3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {items.map(([q, a], i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-3 p-5 text-right transition-colors hover:bg-[#1A1A1A]"
          >
            <span className="font-bold text-white">{q}</span>
            <Plus
              className={`h-5 w-5 shrink-0 text-[#C5A04E] transition-transform duration-200 ${
                open === i ? "rotate-45" : ""
              }`}
            />
          </button>
          {open === i && <p className="px-5 pb-5 leading-loose text-gray-400">{a}</p>}
        </div>
      ))}
    </div>
  );
}
