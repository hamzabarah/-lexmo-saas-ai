import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllPosts,
  formatArabicDate,
  getThemeMap,
  BLOG_CATEGORIES,
  SITE_URL,
} from "@/lib/blog";
import BlogGrid, { type BlogGridItem } from "@/components/blog/BlogGrid";

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
    images: [{ url: "/images/brand/og-image.png", width: 1200, height: 630 }],
  },
};

export default function BlogIndexPage() {
  const themeMap = getThemeMap();
  const posts: BlogGridItem[] = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    cover: post.cover,
    dateLabel: formatArabicDate(post.date),
    // Canonical grouping from the editorial CSV; fall back to frontmatter category.
    category: themeMap[post.slug] || post.category || "",
  }));
  const categories = BLOG_CATEGORIES.map((c) => c.ar);

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-[#0A0A0A] font-cairo text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        {/* Header */}
        <header className="mb-12 text-center">
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
          <BlogGrid posts={posts} categories={categories} />
        )}
      </div>

      <footer className="w-full border-t border-white/10 py-6 flex items-center justify-center gap-5">
        <Link href="/" className="text-xs text-gray-500 hover:text-[#C5A04E] transition-colors">
          الرئيسية
        </Link>
        <span className="text-gray-700">·</span>
        <a href="/legal/terms" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
          Terms &amp; Conditions
        </a>
      </footer>
    </main>
  );
}
