"use client";

import { useState } from "react";

/** Onglets par pays — boutons cliquables + panneau doré. */
export default function GeoTabs({ tabs = [] }: { tabs?: string[][] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="not-prose my-8">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              active === i
                ? "bg-[#C5A04E] text-[#0A0A0A]"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {t[0]}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-2xl border border-[#C5A04E]/30 bg-gradient-to-b from-[#C5A04E]/10 to-transparent p-5 text-[15px] leading-loose text-gray-200">
        {tabs[active]?.[1]}
      </div>
    </div>
  );
}
