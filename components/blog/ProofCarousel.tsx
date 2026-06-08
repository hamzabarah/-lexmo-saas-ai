"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Flag from "@/components/testimonials/Flag";
import Lightbox from "@/components/testimonials/Lightbox";
import { getById, type Testimonial } from "@/data/testimonials";

/** Carte preuve : image entière (w-full h-auto), clic = lightbox.
 *  `priority` : les 1ères cartes chargent leur image immédiatement ;
 *  les suivantes via IntersectionObserver (rootMargin 400px) pour s'afficher plus tôt au scroll. */
function Card({ t, onOpen, priority = false }: { t: Testimonial; onOpen: () => void; priority?: boolean }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [inView, setInView] = useState(priority);

  useEffect(() => {
    if (priority || inView) return;
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [priority, inView]);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onOpen}
      className="group shrink-0 snap-start overflow-hidden rounded-2xl border border-[#C5A04E]/15 bg-[#111111] text-right transition hover:border-[#C5A04E]/40 w-[65vw] sm:w-[300px]"
      aria-label={`عرض صورة ${t.name} كاملة`}
    >
      {t.image && (priority || inView) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={t.image}
          alt={t.name}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="block h-auto w-full transition-transform duration-200 group-hover:scale-[1.02]"
        />
      ) : (
        // Placeholder qui réserve l'espace tant que l'image n'est pas chargée.
        <div className="w-full bg-[#1A1A1A]" style={{ aspectRatio: "4 / 5" }} />
      )}
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
 * Mini-carrousel de preuves pour les articles — défilement horizontal
 * scroll-snap, swipe mobile, flèches RTL desktop. Sur lg: dépasse la colonne
 * de texte (breakout). <ProofImage> reste disponible pour une preuve seule.
 */
export default function ProofCarousel({ ids = [] }: { ids?: string[] }) {
  const list = ids.map((id) => getById(id)).filter((t): t is Testimonial => !!t && !!t.image);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Testimonial | null>(null);

  if (list.length === 0) return null;

  const scrollByCards = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="not-prose my-8 lg:-mx-20">
      {/* Flèches — desktop uniquement (mobile = swipe) */}
      <div className="mb-2 hidden justify-end gap-2 lg:flex">
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

      <div
        ref={scrollerRef}
        className="flex items-start gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {list.map((t, i) => (
          <Card key={t.id} t={t} onOpen={() => setActive(t)} priority={i < 3} />
        ))}
      </div>

      <Lightbox active={active} onClose={() => setActive(null)} />
    </div>
  );
}
