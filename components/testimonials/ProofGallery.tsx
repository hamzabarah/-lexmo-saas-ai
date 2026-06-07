"use client";

import { useRef, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Flag from "./Flag";
import Lightbox from "./Lightbox";
import { getScreens, type Testimonial } from "@/data/testimonials";

/** featured:true en premier, ordre stable pour le reste. */
function orderFeaturedFirst(list: Testimonial[]): Testimonial[] {
  return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
}

/**
 * Carte preuve : l'image (conversation verticale) s'affiche ENTIÈRE dans une
 * zone à hauteur fixe avec object-contain (jamais recadrée, fond sombre derrière).
 */
function ProofCard({ t, onOpen }: { t: Testimonial; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative shrink-0 snap-start overflow-hidden rounded-2xl border border-[#C5A04E]/15 bg-[#111111] text-right transition hover:border-[#C5A04E]/40 w-[72vw] sm:w-[320px]"
      aria-label={`تكبير صورة ${t.name}`}
    >
      <div className="flex h-[420px] w-full items-center justify-center bg-black sm:h-[460px]">
        {t.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.image}
            alt={t.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="text-xs text-gray-500">صورة مفقودة</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-end gap-1.5">
          <span className="text-sm font-bold text-white">{t.name}</span>
          <Flag code={t.countryCode} />
        </div>
        <p className="mt-1 text-[12px] leading-snug text-gray-400 line-clamp-2">{t.result}</p>
      </div>
    </button>
  );
}

/**
 * Carrousel de captures d'écran (preuves) — défilement horizontal scroll-snap,
 * swipe sur mobile, flèches RTL sur desktop. Identique en UX à VideoCarousel.
 * Se masque automatiquement si la bibliothèque ne contient aucun screen.
 */
export default function ProofGallery({
  title = "إثباتات حقيقية 📊",
  subtitle = "نتائج موثقة من متاجر أعضائنا",
  screens,
}: {
  title?: string;
  subtitle?: string;
  screens?: Testimonial[];
}) {
  const list = orderFeaturedFirst(screens ?? getScreens());
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Testimonial | null>(null);

  if (list.length === 0) return null;

  const scrollByCards = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="space-y-4" aria-label={title}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-white text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-[13px] leading-snug text-gray-500">{subtitle}</p>}
          <p className="text-[11px] leading-snug text-gray-500">
            نتائج فردية لأعضاء طبقوا التكوين — النتائج تختلف من شخص لآخر وغير مضمونة.
          </p>
        </div>

        {/* Flèches de navigation — desktop uniquement (mobile = swipe) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 pt-1">
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C5A04E]/20 text-[#C5A04E] transition hover:bg-[#C5A04E]/10"
            aria-label="عرض المزيد"
          >
            {/* RTL : "suivant" pointe vers la gauche */}
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C5A04E]/20 text-[#C5A04E] transition hover:bg-[#C5A04E]/10"
            aria-label="السابق"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {list.map((t) => (
          <ProofCard key={t.id} t={t} onOpen={() => setActive(t)} />
        ))}
      </div>

      <Lightbox active={active} onClose={() => setActive(null)} />
    </section>
  );
}
