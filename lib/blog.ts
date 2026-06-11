import fs from "fs";
import path from "path";
import matter from "gray-matter";

/* ════════════════════════════════════════════════
   Blog data layer (Option A — static MDX files)
   Reads content/blog/*.mdx, parses front-matter via
   gray-matter. No DB, fully static / SSG friendly.
   ════════════════════════════════════════════════ */

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Editorial CSV mapping each slug to its French theme (canonical grouping). */
export const EDITORIAL_CSV = path.join(
  process.cwd(),
  "content",
  "editorial",
  "liste-titres.csv",
);

/**
 * Ordered blog categories. `fr` matches the CSV `theme` column exactly;
 * `ar` is the label shown in the UI filter bar.
 */
export const BLOG_CATEGORIES: { fr: string; ar: string }[] = [
  { fr: "Fondamentaux e-commerce", ar: "الأساسيات" },
  { fr: "Publicite et marketing", ar: "الإعلانات والتسويق" },
  { fr: "Produits, recherche et fournisseurs", ar: "المنتجات والموردين" },
  { fr: "Par pays", ar: "حسب الدولة" },
  { fr: "Paiement et logistique", ar: "الدفع والشحن" },
  { fr: "Legal, fiscalite et couts", ar: "القانون والضرائب" },
  { fr: "Outils et IA", ar: "الأدوات والذكاء الاصطناعي" },
  { fr: "Creation et optimisation du magasin", ar: "إنشاء المتجر" },
  { fr: "Marque et dropshipping", ar: "العلامة والدروبشيبينغ" },
  { fr: "Temoignages et histoires", ar: "قصص النجاح" },
  { fr: "Choix de formation", ar: "اختيار التكوين" },
];

const THEME_FR_TO_AR: Record<string, string> = Object.fromEntries(
  BLOG_CATEGORIES.map((c) => [c.fr, c.ar]),
);

/** Parse one CSV line, honouring double-quoted fields (with "" escaping). */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

/**
 * Build a `slug -> Arabic theme label` map from the editorial CSV.
 * Unknown / unmapped themes fall back to their raw value.
 */
export function getThemeMap(): Record<string, string> {
  if (!fs.existsSync(EDITORIAL_CSV)) return {};
  const lines = fs
    .readFileSync(EDITORIAL_CSV, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  const map: Record<string, string> = {};
  // Skip header row (numero,titre,slug,theme).
  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const slug = (cols[2] ?? "").trim();
    const theme = (cols[3] ?? "").trim();
    if (slug) map[slug] = THEME_FR_TO_AR[theme] ?? theme;
  }
  return map;
}

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
