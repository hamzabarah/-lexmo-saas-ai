"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Flag from "./Flag";
import type { Testimonial } from "@/data/testimonials";

/**
 * Lightbox plein écran partagée (galerie de preuves + cartes d'avis).
 * Conteneur scrollable + image en largeur naturelle → on peut scroller / zoomer
 * pour lire la conversation entière sur mobile. Esc ou clic sur le fond ferment.
 */
export default function Lightbox({
  active,
  onClose,
}: {
  active: Testimonial | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, onClose]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="إغلاق"
      >
        <X size={20} />
      </button>
      <figure className="mx-auto max-w-2xl py-2" onClick={(e) => e.stopPropagation()}>
        {active.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active.image}
            alt={active.name}
            className="block h-auto w-full rounded-xl"
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
  );
}
