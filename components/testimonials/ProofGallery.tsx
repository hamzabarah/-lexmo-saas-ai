"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getScreens, type Testimonial } from "@/data/testimonials";

/**
 * Galerie de captures d'écran (preuves) + lightbox plein écran.
 * Se masque automatiquement si la bibliothèque ne contient aucun screen :
 * dès qu'un screen est ajouté dans data/testimonials.ts, la section apparaît.
 */
export default function ProofGallery({
  title = "إثباتات حقيقية 📊",
  screens,
}: {
  title?: string;
  screens?: Testimonial[];
}) {
  const list = screens ?? getScreens();
  const [active, setActive] = useState<Testimonial | null>(null);

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

  return (
    <section className="space-y-4" aria-label={title}>
      <h2 className="text-white text-xl font-bold">{title}</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {list.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t)}
            className="group overflow-hidden rounded-2xl border border-[#C5A04E]/15 bg-[#111111] text-right transition hover:border-[#C5A04E]/40"
            aria-label={`تكبير صورة ${t.name}`}
          >
            <div className="relative w-full bg-black" style={{ aspectRatio: "4 / 3" }}>
              {t.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                  صورة مفقودة
                </span>
              )}
            </div>
            <div className="p-3">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-sm font-bold text-white">{t.name}</span>
                <span className="text-base leading-none">{t.country}</span>
              </div>
              <p className="mt-1 text-[12px] leading-snug text-gray-400 line-clamp-2">
                {t.result}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox plein écran */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
          <figure
            className="max-h-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {active.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.image}
                alt={active.name}
                className="mx-auto max-h-[80vh] w-auto rounded-xl object-contain"
              />
            )}
            <figcaption className="mt-3 text-center text-sm text-gray-300">
              <span className="font-bold text-white">{active.name}</span> {active.country}
              <span className="mx-2 text-gray-600">·</span>
              {active.result}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
