"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Flag from "@/components/testimonials/Flag";
import { getById, getYouTubeThumbnail, getYouTubeId } from "@/data/testimonials";

/** Carte vidéo 9:16 (façade YouTube lazy), reliée à la bibliothèque par id. */
export default function ClientVideo({ id }: { id: string }) {
  const t = getById(id);
  const [playing, setPlaying] = useState(false);
  if (!t) return null;

  const thumb = getYouTubeThumbnail(t.videoUrl);
  const ytId = getYouTubeId(t.videoUrl);

  return (
    <figure className="not-prose mx-auto my-8 w-full max-w-[380px]">
      <div
        className="relative overflow-hidden rounded-2xl border border-[#C5A04E]/15 bg-[#111111]"
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
            className="group absolute inset-0 h-full w-full"
            aria-label={`تشغيل فيديو ${t.name}`}
          >
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumb} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <span className="absolute inset-0 bg-[#1A1A1A]" />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20 transition-colors group-hover:via-black/5" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C5A04E] text-[#0A0A0A] shadow-lg transition-transform duration-200 group-hover:scale-110">
              <Play size={22} className="ms-0.5 fill-[#0A0A0A]" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-gray-300">
        <span className="font-bold text-white">{t.name}</span>
        <Flag code={t.countryCode} />
        <span className="text-gray-600">·</span>
        <span className="text-gray-400">{t.result}</span>
      </figcaption>
    </figure>
  );
}
