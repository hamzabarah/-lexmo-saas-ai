import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import {
  BLOG_CATEGORIES,
  getCategoryBySlug,
  getPostsByCategorySlug,
  formatArabicDate,
  SITE_URL,
} from "@/lib/blog";

// Fully static: only the canonical category slugs exist, anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ cat: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}): Promise<Metadata> {
  const { cat } = await params;
  const category = getCategoryBySlug(cat);
  if (!category) return {};

  const url = `${SITE_URL}/blog/categorie/${category.slug}`;
  const title = `${category.ar} | مدونة ECOMY`;
  const description = `جميع مقالات ودلائل ECOMY في قسم "${category.ar}" — التجارة الإلكترونية والدروبشيبينغ باللغة العربية.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "ECOMY",
      locale: "ar_AR",
      type: "website",
      images: [{ url: "/images/brand/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  const category = getCategoryBySlug(cat);
  if (!category) notFound();

  const posts = getPostsByCategorySlug(category.slug);

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-[#0A0A0A] font-cairo text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/blog" className="transition-colors hover:text-[#C5A04E]">
            المدونة
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{category.ar}</span>
        </nav>

        {/* Header */}
        <header className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full border border-[#C5A04E]/30 bg-[#C5A04E]/10 px-4 py-1.5 text-sm font-bold text-[#C5A04E]">
            قسم
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            {category.ar}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
            جميع المقالات والدلائل في هذا القسم — {posts.length} مقال.
          </p>
        </header>

        {/* Grid */}
        {posts.length === 0 ? (
          <p className="py-20 text-center text-gray-500">
            لا توجد مقالات في هذا القسم بعد.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
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
                  {post.date && (
                    <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatArabicDate(post.date)}
                    </div>
                  )}

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
      </div>

      <footer className="w-full border-t border-white/10 py-6 flex items-center justify-center gap-5">
        <Link href="/" className="text-xs text-gray-500 hover:text-[#C5A04E] transition-colors">
          الرئيسية
        </Link>
        <span className="text-gray-700">·</span>
        <Link href="/blog" className="text-xs text-gray-500 hover:text-[#C5A04E] transition-colors">
          المدونة
        </Link>
        <span className="text-gray-700">·</span>
        <a href="/legal/terms" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
          Terms &amp; Conditions
        </a>
      </footer>
    </main>
  );
}
