import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Tag } from "lucide-react";
import { getAllPosts, formatArabicDate, SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "المدونة | ECOMY — مقالات التجارة الإلكترونية والدروبشيبينغ",
  description:
    "مقالات ودلائل عملية حول التجارة الإلكترونية، الدروبشيبينغ، متاجر شوبيفاي، وإعلانات فيسبوك وتيكتوك — باللغة العربية ومن خبراء ECOMY.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "مدونة ECOMY للتجارة الإلكترونية",
    description:
      "مقالات ودلائل عملية حول التجارة الإلكترونية والدروبشيبينغ باللغة العربية.",
    url: `${SITE_URL}/blog`,
    siteName: "ECOMY",
    locale: "ar_AR",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-[#0A0A0A] font-cairo text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        {/* Header */}
        <header className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full border border-[#C5A04E]/30 bg-[#C5A04E]/10 px-4 py-1.5 text-sm font-bold text-[#C5A04E]">
            المدونة
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            مقالات ودلائل التجارة الإلكترونية والدروبشيبينغ
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
            تعلّم خطوة بخطوة كيف تبني تجارتك الإلكترونية من الصفر — اختيار المنتجات،
            متاجر شوبيفاي، وإعلانات فيسبوك وتيكتوك.
          </p>
        </header>

        {/* Empty state */}
        {posts.length === 0 ? (
          <p className="py-20 text-center text-gray-500">
            لا توجد مقالات منشورة بعد. تابعنا قريباً.
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
                  <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                    {post.category && (
                      <span className="inline-flex items-center gap-1 text-[#C5A04E]">
                        <Tag className="h-3.5 w-3.5" />
                        {post.category}
                      </span>
                    )}
                    {post.date && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatArabicDate(post.date)}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-[#C5A04E]">
                    {post.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-400">
                    {post.description}
                  </p>

                  <span className="mt-4 text-sm font-bold text-[#C5A04E]">
                    اقرأ المقال ←
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
