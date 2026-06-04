/* ════════════════════════════════════════════════
   Bibliothèque centralisée de témoignages clients.
   Source unique de vérité pour les avis élèves.
   AUCUNE page de production ne l'utilise encore —
   seul /avis-preview l'affiche pour vérification.
   ════════════════════════════════════════════════ */

export type Tag =
  | "premiere-vente"
  | "gros-resultat"
  | "petit-budget"
  | "sceptique-converti"
  | "communaute"
  | "salarie-etudiant"
  | "rembourse-formation";

export interface Testimonial {
  id: string;
  type: "video" | "screen";
  name: string;
  country: string; // emoji drapeau, ex: "🇲🇦"
  result: string; // 1 phrase en arabe
  videoUrl?: string; // YouTube (watch?v=ID) / Vimeo / .mp4
  image?: string; // chemin /images/preuves/...
  quote?: string; // citation texte optionnelle
  tags: Tag[];
  date?: string; // ISO "2026-05-12"
  featured?: boolean;
}

/** Libellés arabes des tags (pour l'affichage / filtres). */
export const TAG_LABELS: Record<Tag, string> = {
  "premiere-vente": "أول مبيعة",
  "gros-resultat": "نتيجة كبيرة",
  "petit-budget": "ميزانية صغيرة",
  "sceptique-converti": "متشكك اقتنع",
  communaute: "المجتمع",
  "salarie-etudiant": "موظف / طالب",
  "rembourse-formation": "استرجع ثمن التكوين",
};

export const ALL_TAGS = Object.keys(TAG_LABELS) as Tag[];

/* ─────────────────────────────────────────────
   DONNÉES — remplacer les 3 entrées DEMO ci-dessous
   par les vrais témoignages au fur et à mesure.
   ───────────────────────────────────────────── */
export const TESTIMONIALS: Testimonial[] = [
  // ⚠️ DEMO 1 — vidéo YouTube (format watch?v=ID requis)
  {
    id: "demo-youtube",
    type: "video",
    name: "يوسف (DEMO)",
    country: "🇲🇦",
    result: "حقق أول مبيعة بعد 3 أسابيع من بداية التكوين.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tags: ["premiere-vente", "petit-budget"],
    date: "2026-05-12",
    featured: true,
  },
  // ⚠️ DEMO 2 — vidéo mp4 hébergée (chemin /public ou URL externe)
  {
    id: "demo-mp4",
    type: "video",
    name: "أمينة (DEMO)",
    country: "🇩🇿",
    result: "وصلت إلى 4000€ مبيعات في أول شهر.",
    videoUrl: "/videos/preuves/demo.mp4",
    quote: "كنت متشككة في البداية لكن النتائج غيّرت رأيي تماماً.",
    tags: ["gros-resultat", "sceptique-converti"],
    date: "2026-04-28",
  },
  // ⚠️ DEMO 3 — capture d'écran (preuve image)
  {
    id: "demo-screen",
    type: "screen",
    name: "خالد (DEMO)",
    country: "🇫🇷",
    result: "لوحة تحكم شوبيفاي تُظهر مبيعات بقيمة 1.2k€.",
    image: "/images/preuves/khalid-dashboard.png",
    quote: "بفضل التكوين استرجعت ثمنه في أقل من أسبوعين.",
    tags: ["rembourse-formation", "salarie-etudiant"],
    date: "2026-05-03",
  },
];

/* ─────────────────────────────────────────────
   Fonctions utilitaires
   ───────────────────────────────────────────── */
export function getAll(): Testimonial[] {
  return TESTIMONIALS;
}

export function getById(id: string): Testimonial | undefined {
  return TESTIMONIALS.find((t) => t.id === id);
}

export function getByTag(tag: Tag): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.tags.includes(tag));
}

export function getVideos(): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.type === "video");
}

export function getScreens(): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.type === "screen");
}

/** Nombre de témoignages par tag (pour les compteurs). */
export function countByTag(): Record<Tag, number> {
  const counts = {} as Record<Tag, number>;
  for (const tag of ALL_TAGS) counts[tag] = 0;
  for (const t of TESTIMONIALS) for (const tag of t.tags) counts[tag]++;
  return counts;
}

/* ─────────────────────────────────────────────
   Helpers vidéo (provider, ID YouTube, miniature, embed)
   ───────────────────────────────────────────── */
export type VideoProvider = "youtube" | "vimeo" | "mp4" | "unknown";

export function getVideoProvider(url?: string): VideoProvider {
  if (!url) return "unknown";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.endsWith(".mp4") || url.includes(".mp4")) return "mp4";
  return "unknown";
}

/** Extrait l'ID d'une URL YouTube (watch?v=, youtu.be/, /embed/). */
export function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  // Format recommandé : watch?v=ID
  if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split(/[?&]/)[0];
  if (url.includes("/embed/")) return url.split("/embed/")[1].split(/[?&]/)[0];
  return null;
}

/** Miniature auto YouTube (hqdefault), ou null si non-YouTube. */
export function getYouTubeThumbnail(url?: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/** Extrait l'ID numérique Vimeo. */
export function getVimeoId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

/** URL d'intégration (iframe/video) selon le provider. */
export function getEmbedUrl(url?: string): string | null {
  const provider = getVideoProvider(url);
  if (provider === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : null;
  }
  if (provider === "vimeo") {
    const id = getVimeoId(url);
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }
  if (provider === "mp4") return url ?? null;
  return null;
}
