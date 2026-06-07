import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Calendar, Tag, ChevronDown } from "lucide-react";
import BlogCTA from "@/app/components/blog/BlogCTA";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { blogMdxComponents } from "@/components/blog/mdxComponents";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  formatArabicDate,
  SITE_URL,
} from "@/lib/blog";

// Fully static: only pre-rendered slugs exist, anything else 404s.
export const dynamicParams = false;

// Composants riches exposés au MDX (DirectAnswer, ProofImage, FAQ, CTABox…).
const mdxComponents = blogMdxComponents;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.draft) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.cover
    ? post.cover.startsWith("http")
      ? post.cover
      : `${SITE_URL}${post.cover}`
    : undefined;

  return {
    title: `${post.title} | ECOMY`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author || "فريق أكاديمية إيكومي" }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "ECOMY",
      locale: "ar_AR",
      type: "article",
      publishedTime: post.date || undefined,
      modifiedTime: post.updated || undefined,
      images: image ? [{ url: image, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.draft) notFound();

  const related = getRelatedPosts(post.slug, post.category, 3);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.cover
    ? post.cover.startsWith("http")
      ? post.cover
      : `${SITE_URL}${post.cover}`
    : `${SITE_URL}/images/ecommerce-banner.png`;

  // L'article fournit-il déjà son propre CTA (<CTABox>) ? Si oui, on n'ajoute
  // pas le CTA automatique en bas (évite un double appel à l'action).
  const hasOwnCta = post.content.includes("<CTABox");

  // ── JSON-LD: BlogPosting ──
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: image ? [image] : undefined,
    datePublished: post.date || undefined,
    dateModified: post.updated || post.date || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: post.author || "فريق أكاديمية إيكومي",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "ECOMY",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
  };

  // ── JSON-LD: FAQPage (from front-matter) ──
  const faqLd =
    post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-[#0A0A0A] font-cairo text-white">
      <ReadingProgress />

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <article className="mx-auto max-w-4xl px-5 py-14 md:px-8 lg:py-20">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/blog" className="transition-colors hover:text-[#C5A04E]">
            المدونة
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{post.category}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {post.category && (
              <span className="inline-flex items-center gap-1.5 text-[#C5A04E]">
                <Tag className="h-4 w-4" />
                {post.category}
              </span>
            )}
            {post.updated && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                آخر تحديث: {formatArabicDate(post.updated)}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-gray-400">
            {post.description}
          </p>
        </header>

        {/* Cover */}
        {post.cover && (
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {/* MDX content */}
        <div
          id="article-body"
          className="prose prose-invert lg:prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:mt-12 prose-h2:scroll-mt-20 prose-h2:text-2xl prose-h3:text-xl
            prose-p:leading-[2] prose-p:text-gray-300
            prose-li:leading-[1.9] prose-li:text-gray-300 prose-strong:text-white
            prose-a:text-[#C5A04E] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-r-4 prose-blockquote:border-l-0
            prose-blockquote:border-[#C5A04E] prose-blockquote:bg-[#111111]
            prose-blockquote:rounded-lg prose-blockquote:py-1 prose-blockquote:px-5
            prose-blockquote:not-italic prose-blockquote:text-gray-300
            prose-img:rounded-xl"
        >
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              parseFrontmatter: true,
              // Contenu de confiance (fichiers MDX du dépôt) : on autorise les
              // expressions JS pour que les props tableau (rows/items/steps/…)
              // soient évaluées. blockDangerousJS reste actif par défaut.
              blockJS: false,
              mdxOptions: { format: "mdx", remarkPlugins: [remarkGfm] },
            }}
          />
        </div>

        {/* CTA automatique en bas — seulement si l'article n'a pas son propre CTABox */}
        {!hasOwnCta && <BlogCTA variant="formation" />}

        {/* FAQ section (from front-matter) */}
        {post.faq.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-extrabold text-white">
              الأسئلة الشائعة
            </h2>
            <div className="space-y-3">
              {post.faq.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-white/10 bg-[#111111] p-5 [&_svg]:open:rotate-180"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-bold text-white">
                    {f.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#C5A04E] transition-transform" />
                  </summary>
                  <p className="mt-3 leading-relaxed text-gray-400">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-white/10 pt-10">
            <h2 className="mb-6 text-2xl font-extrabold text-white">
              مقالات ذات صلة
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111111] transition-all hover:border-[#C5A04E]/40"
                >
                  <div className="relative aspect-video w-full bg-[#0A0A0A]">
                    {r.cover && (
                      <Image
                        src={r.cover}
                        alt={r.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold leading-snug text-white transition-colors group-hover:text-[#C5A04E]">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

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
