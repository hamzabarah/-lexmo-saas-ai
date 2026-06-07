"use client";

import { useRef, useState } from "react";
import { ChevronRight, ChevronLeft, Play } from "lucide-react";
import Flag from "@/components/testimonials/Flag";
import { getById, getYouTubeThumbnail, getYouTubeId, type Testimonial } from "@/data/testimonials";

/** Carte vidéo 9:16 — façade YouTube lazy (l'iframe ne charge qu'au clic). */
function Card({ t }: { t: Testimonial }) {
  const [playing, setPlaying] = useState(false);
  const thumb = getYouTubeThumbnail(t.videoUrl);
  const ytId = getYouTubeId(t.videoUrl);

  return (
    <div
      className="relative shrink-0 snap-start overflow-hidden rounded-2xl border border-[#C5A04E]/15 bg-[#111111] w-[65vw] sm:w-[300px]"
      style={{ aspectRatio: "9 / 16" }}
    >
      {playing && ytId ? (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1`}
          title={t.name}
          className="absolute inset-0 h-full w-full"
          allow="accelerated-content; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full text-right"
          aria-label={`تشغيل فيديو ${t.name}`}
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 bg-[#1A1A1A]" />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/25 transition-colors group-hover:via-black/5" />
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C5A04E] text-[#0A0A0A] shadow-lg transition-transform duration-200 group-hover:scale-110">
            <Play size={22} className="ms-0.5 fill-[#0A0A0A]" />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-3">
            <span className="flex items-center justify-end gap-1.5">
              <span className="text-sm font-bold text-white">{t.name}</span>
              <Flag code={t.countryCode} />
            </span>
            <span className="mt-1 block text-[12px] leading-snug text-gray-200 line-clamp-2">{t.result}</span>
          </span>
        </button>
      )}
    </div>
  );
}

/**
 * Mini-carrousel de témoignages vidéo pour les articles — défilement horizontal
 * scroll-snap, swipe mobile, flèches RTL desktop. Sur lg: dépasse la colonne de
 * texte (breakout). Façade YouTube lazy comme ClientVideo.
 */
export default function VideoCarousel({ ids = [] }: { ids?: string[] }) {
  const list = ids.map((id) => getById(id)).filter((t): t is Testimonial => !!t && !!t.videoUrl);
  const scrollerRef = useRef<HTMLDivElement>(null);

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
        {list.map((t) => (
          <Card key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}
