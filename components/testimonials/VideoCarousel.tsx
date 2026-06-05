"use client";

import { useRef, useState } from "react";
import { ChevronRight, ChevronLeft, Play } from "lucide-react";
import {
  getVideos,
  getYouTubeThumbnail,
  getYouTubeId,
  type Testimonial,
} from "@/data/testimonials";

/** featured:true en premier, ordre stable pour le reste. */
function orderFeaturedFirst(list: Testimonial[]): Testimonial[] {
  return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
}

/**
 * Carte vidéo verticale 9:16 (Short).
 * Façade : la miniature YouTube s'affiche d'abord ; l'iframe ne se charge
 * qu'au clic (pas de CLS, espace réservé par l'aspect-ratio).
 */
function VideoCard({ t }: { t: Testimonial }) {
  const [playing, setPlaying] = useState(false);
  const thumb = getYouTubeThumbnail(t.videoUrl);
  const id = getYouTubeId(t.videoUrl);

  return (
    <div
      className="relative shrink-0 snap-start overflow-hidden rounded-2xl border border-[#C5A04E]/15 bg-[#111111] w-[66vw] sm:w-[210px]"
      style={{ aspectRatio: "9 / 16" }}
    >
      {playing && id ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
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
            <img
              src={thumb}
              alt={t.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 bg-[#1A1A1A]" />
          )}

          {/* Dégradé sombre (haut léger + bas marqué pour la légende) */}
          <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/25 transition-colors group-hover:via-black/5" />

          {/* Bouton play doré au centre */}
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C5A04E] text-[#0A0A0A] shadow-lg transition-transform duration-200 group-hover:scale-110">
            <Play size={22} className="ms-0.5 fill-[#0A0A0A]" />
          </span>

          {/* Légende : nom + drapeau + result (2 lignes max) */}
          <span className="absolute inset-x-0 bottom-0 p-3">
            <span className="flex items-center justify-end gap-1.5">
              <span className="text-sm font-bold text-white">{t.name}</span>
              <span className="text-base leading-none">{t.country}</span>
            </span>
            <span className="mt-1 block text-[12px] leading-snug text-gray-200 line-clamp-2">
              {t.result}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export default function VideoCarousel({
  title = "شوف نتائج طلابنا بأعينهم 🎥",
  videos,
}: {
  title?: string;
  videos?: Testimonial[];
}) {
  const list = orderFeaturedFirst(videos ?? getVideos());
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (list.length === 0) return null;

  const scrollByCards = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="space-y-4" aria-label={title}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-white text-xl font-bold">{title}</h2>

        {/* Flèches de navigation — desktop uniquement (mobile = swipe) */}
        <div className="hidden lg:flex items-center gap-2">
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
          <VideoCard key={t.id} t={t} />
        ))}
      </div>
    </section>
  );
}
