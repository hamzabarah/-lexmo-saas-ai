"use client";

import { useState } from "react";
import Flag from "@/components/testimonials/Flag";
import Lightbox from "@/components/testimonials/Lightbox";
import { getById } from "@/data/testimonials";

/** Capture (preuve) de la bibliothèque — image entière, clic = lightbox partagée. */
export default function ProofImage({ id }: { id: string }) {
  const t = getById(id);
  const [open, setOpen] = useState(false);
  if (!t || !t.image) return null;

  return (
    <figure className="not-prose mx-auto my-8 w-full max-w-[380px]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full overflow-hidden rounded-2xl border border-[#C5A04E]/15 bg-[#111111] transition hover:border-[#C5A04E]/40"
        aria-label={`عرض صورة ${t.name} كاملة`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.image} alt={t.name} loading="lazy" className="block h-auto w-full" />
      </button>
      <figcaption className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-gray-300">
        <span className="font-bold text-white">{t.name}</span>
        <Flag code={t.countryCode} />
        <span className="text-gray-600">·</span>
        <span className="text-gray-400">{t.result}</span>
      </figcaption>
      <p className="mt-1 text-center text-xs text-gray-500">🔍 اضغط لعرض الصورة كاملة</p>
      <Lightbox active={open ? t : null} onClose={() => setOpen(false)} />
    </figure>
  );
}
