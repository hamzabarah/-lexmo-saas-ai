"use client";

import { useState } from "react";
import { Star, Camera } from "lucide-react";
import Flag from "./Flag";
import Lightbox from "./Lightbox";
import { getAll, type Testimonial } from "@/data/testimonials";

const INITIAL = 6;

/** featured:true en premier, ordre stable pour le reste. */
function orderFeaturedFirst(list: Testimonial[]): Testimonial[] {
  return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
}

function ReviewCard({ t, onProof }: { t: Testimonial; onProof: () => void }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#C5A04E]/10 bg-[#111111] p-5" dir="rtl">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, j) => (
          <Star key={j} size={14} className="text-[#D4A843] fill-[#D4A843]" />
        ))}
      </div>

      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-200">“{t.quote}”</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm">{t.name}</span>
          <Flag code={t.countryCode} />
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            عضو موثق ✓
          </span>
        </div>
        {t.image && (
          <button
            type="button"
            onClick={onProof}
            className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[#C5A04E] transition hover:text-[#D4B85C]"
          >
            <Camera size={13} />
            شاهد الإثبات 📸
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Section تقييمات العملاء — cartes générées depuis les entrées de la bibliothèque
 * qui ont une citation (quote). Le bouton "شاهد الإثبات" ouvre l'image (preuve)
 * correspondante dans la lightbox partagée.
 */
export default function CustomerReviews() {
  const quoted = orderFeaturedFirst(getAll().filter((t) => t.quote));
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<Testimonial | null>(null);

  const shown = expanded ? quoted : quoted.slice(0, INITIAL);

  return (
    <div className="space-y-5">
      <h2 className="text-white text-xl font-bold">تقييمات العملاء</h2>

      {/* Note globale + histogramme */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-5xl font-black text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            5.0
          </span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="text-[#D4A843] fill-[#D4A843]" />
            ))}
          </div>
          <span className="text-gray-500 text-sm">453 تقييم</span>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-500 w-4 text-center" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                {stars}
              </span>
              <Star size={12} className="text-[#D4A843] fill-[#D4A843] shrink-0" />
              <div className="flex-1 h-2.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div className="h-full bg-[#D4A843] rounded-full" style={{ width: stars === 5 ? "100%" : "0%" }} />
              </div>
              <span className="text-sm text-gray-500 w-8 text-center" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                {stars === 5 ? 453 : 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-[#C5A04E]/10" />

      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-base">أفضل التقييمات</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <ReviewCard key={t.id} t={t} onProof={() => setActive(t)} />
        ))}
      </div>

      {quoted.length > INITIAL && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-xl border border-[#C5A04E]/40 bg-[#C5A04E]/5 px-6 py-3 text-sm font-bold text-[#C5A04E] transition hover:bg-[#C5A04E]/10"
          >
            {expanded ? "عرض أقل" : `عرض كل التقييمات (${quoted.length})`}
          </button>
        </div>
      )}

      <Lightbox active={active} onClose={() => setActive(null)} />
    </div>
  );
}
