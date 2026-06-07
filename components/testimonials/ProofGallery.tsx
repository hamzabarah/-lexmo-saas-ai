"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Flag from "./Flag";
import { getScreens, type Testimonial } from "@/data/testimonials";

const PAGE_SIZE = 12;

/** featured:true en premier, ordre stable pour le reste. */
function orderFeaturedFirst(list: Testimonial[]): Testimonial[] {
  return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
}

/**
 * Galerie de captures d'écran (preuves) en mosaïque "masonry" (CSS columns).
 * Les captures sont des conversations verticales longues : chaque image garde
 * son ratio naturel et s'affiche ENTIÈRE (jamais recadrée).
 * Pagination "voir plus" (+12) et lightbox plein écran scrollable.
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
  const [active, setActive] = useState<Testimonial | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  if (list.length === 0) return null;

  const shown = list.slice(0, visible);
  const remaining = list.length - visible;

  return (
    <section className="space-y-4" aria-label={title}>
      <div className="space-y-1">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-[13px] leading-snug text-gray-500">{subtitle}</p>}
        <p className="text-[11px] leading-snug text-gray-500">
          نتائج فردية لأعضاء طبقوا التكوين — النتائج تختلف من شخص لآخر وغير مضمونة.
        </p>
      </div>

      {/* Masonry : 2 colonnes mobile · 3 tablette · 4 desktop */}
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
        {shown.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t)}
            className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-[#C5A04E]/15 bg-[#111111] text-right transition hover:border-[#C5A04E]/40"
            aria-label={`تكبير صورة ${t.name}`}
          >
            {t.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={t.image}
                alt={t.name}
                loading="lazy"
                className="block w-full h-auto transition-transform duration-200 group-hover:scale-[1.02]"
              />
            ) : (
              <span className="flex h-40 items-center justify-center text-xs text-gray-500">
                صورة مفقودة
              </span>
            )}
            <div className="p-3">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-sm font-bold text-white">{t.name}</span>
                <Flag code={t.countryCode} />
              </div>
              <p className="mt-1 text-[12px] leading-snug text-gray-400 line-clamp-2">
                {t.result}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Bouton "voir plus" */}
      {remaining > 0 && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-xl border border-[#C5A04E]/40 bg-[#C5A04E]/5 px-6 py-3 text-sm font-bold text-[#C5A04E] transition hover:bg-[#C5A04E]/10"
          >
            شاهد المزيد من الإثباتات 📊 (+{Math.min(PAGE_SIZE, remaining)})
          </button>
        </div>
      )}

      {/* Lightbox plein écran — scrollable pour lire la conversation entière */}
      {active && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-black/90 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="fixed right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
          <figure
            className="mx-auto max-w-2xl py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {active.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.image}
                alt={active.name}
                className="block w-full h-auto rounded-xl"
              />
            )}
            <figcaption className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-gray-300">
              <span className="font-bold text-white">{active.name}</span>
              <Flag code={active.countryCode} />
              <span className="text-gray-600">·</span>
              {active.result}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
