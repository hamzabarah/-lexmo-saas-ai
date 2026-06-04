"use client";

import { useState, useMemo } from "react";
import {
  getAll,
  ALL_TAGS,
  TAG_LABELS,
  getVideoProvider,
  getYouTubeThumbnail,
  getEmbedUrl,
  type Tag,
  type Testimonial,
} from "@/data/testimonials";

type TypeFilter = "all" | "video" | "screen";

function TagChips({ tags }: { tags: Tag[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-full border border-[#C5A04E]/30 bg-[#C5A04E]/10 px-2 py-0.5 text-[11px] text-[#C5A04E]"
        >
          {TAG_LABELS[t]}
        </span>
      ))}
    </div>
  );
}

function VideoCard({ t }: { t: Testimonial }) {
  const [playing, setPlaying] = useState(false);
  const provider = getVideoProvider(t.videoUrl);
  const thumb = getYouTubeThumbnail(t.videoUrl);
  const embed = getEmbedUrl(t.videoUrl);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
      <div className="relative aspect-video w-full bg-black">
        {!playing ? (
          <button
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex items-center justify-center"
            aria-label="تشغيل الفيديو"
          >
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumb} alt={t.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                {provider === "mp4" ? "فيديو MP4" : "لا توجد معاينة"}
              </div>
            )}
            <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10" />
            <span className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-[#C5A04E] text-[#0A0A0A] shadow-lg">
              ▶
            </span>
          </button>
        ) : provider === "mp4" ? (
          <video src={t.videoUrl} controls autoPlay className="h-full w-full" />
        ) : embed ? (
          <iframe
            src={embed}
            className="h-full w-full"
            allow="accelerated-content; autoplay; encrypted-media"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-red-400">
            URL invalide : {t.videoUrl}
          </div>
        )}
      </div>

      <div className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <span className="font-bold text-white">{t.name}</span>
          <span className="text-lg">{t.country}</span>
        </div>
        <p className="mt-1 text-sm text-gray-300">{t.result}</p>
        {t.quote && <p className="mt-2 text-sm italic text-gray-500">“{t.quote}”</p>}
        <div className="flex justify-end">
          <TagChips tags={t.tags} />
        </div>
        <p className="mt-2 text-[11px] text-gray-600">
          id: {t.id} · {provider}
          {t.date ? ` · ${t.date}` : ""}
          {t.featured ? " · ⭐ featured" : ""}
        </p>
      </div>
    </div>
  );
}

function ScreenCard({ t }: { t: Testimonial }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
      <div className="relative w-full bg-black">
        {t.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.image} alt={t.name} className="w-full object-contain" />
        ) : (
          <div className="flex aspect-video items-center justify-center text-xs text-gray-500">
            صورة مفقودة
          </div>
        )}
      </div>
      <div className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <span className="font-bold text-white">{t.name}</span>
          <span className="text-lg">{t.country}</span>
        </div>
        <p className="mt-1 text-sm text-gray-300">{t.result}</p>
        {t.quote && <p className="mt-2 text-sm italic text-gray-500">“{t.quote}”</p>}
        <div className="flex justify-end">
          <TagChips tags={t.tags} />
        </div>
        <p className="mt-2 text-[11px] text-gray-600">
          id: {t.id}
          {t.image ? ` · ${t.image}` : ""}
          {t.date ? ` · ${t.date}` : ""}
        </p>
      </div>
    </div>
  );
}

export default function AvisPreviewClient() {
  const all = getAll();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [tagFilter, setTagFilter] = useState<Tag | "all">("all");

  const filtered = useMemo(() => {
    return all.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (tagFilter !== "all" && !t.tags.includes(tagFilter)) return false;
      return true;
    });
  }, [all, typeFilter, tagFilter]);

  const totalVideos = all.filter((t) => t.type === "video").length;
  const totalScreens = all.filter((t) => t.type === "screen").length;

  const tagCounts = useMemo(() => {
    const c = {} as Record<Tag, number>;
    for (const tag of ALL_TAGS) c[tag] = 0;
    for (const t of all) for (const tag of t.tags) c[tag]++;
    return c;
  }, [all]);

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-[#0A0A0A] font-cairo text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Bandeau privé */}
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-300">
          🔒 صفحة خاصة للمعاينة فقط — غير مفهرسة (noindex) وغير موجودة في sitemap
        </div>

        <h1 className="text-2xl font-extrabold sm:text-3xl">معاينة مكتبة الشهادات</h1>

        {/* Compteur global */}
        <p className="mt-2 text-gray-400">
          <span className="font-bold text-[#C5A04E]">{totalVideos}</span> فيديو ·{" "}
          <span className="font-bold text-[#C5A04E]">{totalScreens}</span> صورة ·{" "}
          <span className="text-gray-500">المجموع {all.length}</span>
        </p>

        {/* Compteur par tag */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
          {ALL_TAGS.map((tag) => (
            <span key={tag} className="rounded bg-white/5 px-2 py-1">
              {TAG_LABELS[tag]}:{" "}
              <span className="font-bold text-white">{tagCounts[tag]}</span>
            </span>
          ))}
        </div>

        {/* Filtres type */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(["all", "video", "screen"] as TypeFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                typeFilter === f
                  ? "bg-[#C5A04E] text-[#0A0A0A]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {f === "all" ? "الكل" : f === "video" ? "فيديو" : "صور"}
            </button>
          ))}
        </div>

        {/* Filtres tag */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setTagFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              tagFilter === "all"
                ? "bg-[#C5A04E] text-[#0A0A0A]"
                : "border border-white/10 text-gray-300 hover:bg-white/10"
            }`}
          >
            كل الوسوم
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                tagFilter === tag
                  ? "bg-[#C5A04E] text-[#0A0A0A]"
                  : "border border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              {TAG_LABELS[tag]} ({tagCounts[tag]})
            </button>
          ))}
        </div>

        {/* Résultats */}
        <p className="mt-6 text-sm text-gray-500">عدد النتائج: {filtered.length}</p>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) =>
            t.type === "video" ? (
              <VideoCard key={t.id} t={t} />
            ) : (
              <ScreenCard key={t.id} t={t} />
            )
          )}
        </div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-gray-500">لا توجد نتائج بهذا الفلتر.</p>
        )}
      </div>
    </main>
  );
}
