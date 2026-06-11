"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Tag } from "lucide-react";

export interface BlogGridItem {
  slug: string;
  title: string;
  description: string;
  cover: string;
  dateLabel: string;
  category: string; // Arabic theme label
}

const ALL = "الكل";

export default function BlogGrid({
  posts,
  categories,
}: {
  posts: BlogGridItem[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>(ALL);

  // Count of posts per category (for the filter chips).
  const counts = useMemo(() => {
    const c: Record<string, number> = { [ALL]: posts.length };
    for (const p of posts) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [posts]);

  // Only show category chips that actually have posts.
  const visibleCategories = useMemo(
    () => categories.filter((cat) => (counts[cat] ?? 0) > 0),
    [categories, counts],
  );

  const filtered = useMemo(
    () => (active === ALL ? posts : posts.filter((p) => p.category === active)),
    [posts, active],
  );

  return (
    <>
      {/* Filter bar */}
      <div className="mb-12 flex flex-wrap justify-center gap-2.5">
        {[ALL, ...visibleCategories].map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "border-[#C5A04E] bg-[#C5A04E] text-[#0A0A0A] shadow-[0_0_20px_-6px_rgba(197,160,78,0.6)]"
                  : "border-white/10 bg-[#111111] text-gray-300 hover:border-[#C5A04E]/40 hover:text-white"
              }`}
            >
              {cat}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none ${
                  isActive ? "bg-black/15 text-[#0A0A0A]" : "bg-white/5 text-gray-500"
                }`}
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {counts[cat] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-gray-500">لا توجد مقالات في هذا القسم بعد.</p>
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111] transition-all duration-200 hover:border-[#C5A04E]/40 hover:shadow-[0_0_28px_-8px_rgba(197,160,78,0.35)]"
            >
              {/* Cover */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#0A0A0A]">
                {post.cover && (
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                  {post.category && (
                    <span className="inline-flex items-center gap-1 text-[#C5A04E]">
                      <Tag className="h-3.5 w-3.5" />
                      {post.category}
                    </span>
                  )}
                  {post.dateLabel && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.dateLabel}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-[#C5A04E]">
                  {post.title}
                </h2>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-400">
                  {post.description}
                </p>

                <span className="mt-4 text-sm font-bold text-[#C5A04E]">اقرأ المقال ←</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
