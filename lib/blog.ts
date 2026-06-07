import fs from "fs";
import path from "path";
import matter from "gray-matter";

/* ════════════════════════════════════════════════
   Blog data layer (Option A — static MDX files)
   Reads content/blog/*.mdx, parses front-matter via
   gray-matter. No DB, fully static / SSG friendly.
   ════════════════════════════════════════════════ */

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Canonical site origin (no trailing slash). Override via env in deployment. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ecomy.ai"
).replace(/\/$/, "");

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string; // ISO date — published
  updated: string; // ISO date — last modified
  author: string; // toujours une équipe, jamais un nom de personne
  cover: string; // path under /public or absolute URL
  category: string;
  keywords: string[];
  faq: BlogFaqItem[];
  draft: boolean;
}

export interface BlogPost extends BlogFrontmatter {
  /** Raw MDX body (front-matter stripped). */
  content: string;
}

/** Normalise a raw front-matter object into a typed, defaulted frontmatter. */
function normalize(data: Record<string, unknown>, fallbackSlug: string): BlogFrontmatter {
  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    slug: (data.slug as string) ?? fallbackSlug,
    date: (data.date as string) ?? "",
    updated: (data.updated as string) ?? (data.date as string) ?? "",
    author: (data.author as string) ?? "فريق أكاديمية إيكومي",
    cover: (data.cover as string) ?? "",
    category: (data.category as string) ?? "",
    keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
    faq: Array.isArray(data.faq) ? (data.faq as BlogFaqItem[]) : [],
    draft: Boolean(data.draft),
  };
}

/** Return every .mdx filename slug present on disk (no front-matter parsing). */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

/** Read & parse a single post by slug. Returns null if missing. */
export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) return null;
  // Match by filename first, then by an explicit front-matter slug.
  const candidates = [
    path.join(BLOG_DIR, `${slug}.mdx`),
    path.join(BLOG_DIR, `${slug}.md`),
  ];
  let filePath = candidates.find((p) => fs.existsSync(p));

  if (!filePath) {
    // Fallback: scan for a file whose front-matter slug matches.
    for (const fileSlug of getAllSlugs()) {
      const p = path.join(BLOG_DIR, `${fileSlug}.mdx`);
      if (!fs.existsSync(p)) continue;
      const { data } = matter(fs.readFileSync(p, "utf8"));
      if (data.slug === slug) {
        filePath = p;
        break;
      }
    }
  }
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fallbackSlug = path.basename(filePath).replace(/\.mdx?$/, "");
  return { ...normalize(data, fallbackSlug), content };
}

/**
 * All posts, newest first.
 * @param includeDrafts when false (default) excludes drafts.
 */
export function getAllPosts(includeDrafts = false): BlogPost[] {
  return getAllSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => p !== null)
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Up to `limit` published posts in the same category, excluding `slug`. */
export function getRelatedPosts(slug: string, category: string, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug && p.category === category)
    .slice(0, limit);
}

/** Format an ISO date into Arabic (Gregorian) long form. */
export function formatArabicDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
