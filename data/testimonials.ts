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
  | "rembourse-formation"
  | "maman"
  | "reconversion";

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
  maman: "أم وربة بيت",
  reconversion: "إعادة توجيه مهني",
};

export const ALL_TAGS = Object.keys(TAG_LABELS) as Tag[];

/* ─────────────────────────────────────────────
   DONNÉES — remplacer les 3 entrées DEMO ci-dessous
   par les vrais témoignages au fur et à mesure.
   ───────────────────────────────────────────── */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "youssef-france",
    type: "video",
    name: "يوسف",
    country: "🇫🇷",
    result: "32 سنة من فرنسا — يشارك تجربته مع تكوين إيكومي",
    videoUrl: "https://www.youtube.com/watch?v=si7JJTEE_iY",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
    featured: true,
  },
  {
    id: "fatima-zahra-algerie",
    type: "video",
    name: "فاطمة الزهراء",
    country: "🇩🇿",
    result: "طالبة من الجزائر — بدأت التجارة الإلكترونية بجانب دراستها",
    videoUrl: "https://www.youtube.com/watch?v=jUNm6l7b3NM",
    tags: ["salarie-etudiant", "petit-budget"],
    date: "2026-06-04",
  },
  {
    id: "reconversion-hotellerie-autriche",
    type: "video",
    name: "[الاسم]",
    country: "🇦🇹",
    result: "من قطاع الفندقة بالنمسا إلى عالم التجارة الإلكترونية",
    videoUrl: "https://www.youtube.com/watch?v=uxMF_wPGO-I",
    tags: ["reconversion", "salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "nariman-france",
    type: "video",
    name: "ناريمان",
    country: "🇫🇷",
    result: "جزائرية مقيمة بفرنسا — تحكي تجربتها مع التكوين",
    videoUrl: "https://www.youtube.com/watch?v=Y9v_7Bhst1U",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "rabia-hollande",
    type: "video",
    name: "ربيعة",
    country: "🇳🇱",
    result: "أم وربة بيت من هولندا — انطلقت في التجارة الإلكترونية من البيت",
    videoUrl: "https://www.youtube.com/watch?v=4_Rz7g1RkvM",
    tags: ["maman"],
    date: "2026-06-04",
    featured: true,
  },
  {
    id: "experte-financiere-france",
    type: "video",
    name: "[الاسم]",
    country: "🇫🇷",
    result: "خبيرة مالية في فرنسا — شهادتها حول جدية التكوين",
    videoUrl: "https://www.youtube.com/watch?v=8mZHM_H4e8k",
    tags: ["sceptique-converti", "reconversion"],
    date: "2026-06-04",
    featured: true,
  },
  {
    id: "nour-elhouda-suisse",
    type: "video",
    name: "نور الهدى",
    country: "🇨🇭",
    result: "57 سنة من سويسرا — أثبتت أن العمر مجرد رقم في التجارة الإلكترونية",
    videoUrl: "https://www.youtube.com/watch?v=Ck7ywQoM5D8",
    tags: ["reconversion"],
    date: "2026-06-04",
  },
  {
    id: "mohamed-espagne",
    type: "video",
    name: "محمد",
    country: "🇪🇸",
    result: "45 سنة، مغربي مقيم بإسبانيا — تجربته مع التكوين",
    videoUrl: "https://www.youtube.com/watch?v=7zwurQVI6FM",
    tags: ["salarie-etudiant", "reconversion"],
    date: "2026-06-04",
  },
  {
    id: "maman-assistante-medicale",
    type: "video",
    name: "[الاسم]",
    country: "🇫🇷",
    result: "مساعدة طبيبة، 57 سنة وأم لبنتين — بدأت بجانب عملها",
    videoUrl: "https://www.youtube.com/watch?v=RH9-kGKDhWw",
    tags: ["maman", "salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "sanaa-france",
    type: "video",
    name: "سناء",
    country: "🇫🇷",
    result: "36 سنة من فرنسا — تحكي مسارها مع إيكومي",
    videoUrl: "https://www.youtube.com/watch?v=qnMMsqu7hdY",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "abdelwahed-france",
    type: "video",
    name: "عبد الواحد",
    country: "🇫🇷",
    result: "33 سنة، جزائري من فرنسا — رأيه في التكوين",
    videoUrl: "https://www.youtube.com/watch?v=E1GgTqB77as",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "maria-france",
    type: "video",
    name: "ماريا",
    country: "🇫🇷",
    result: "28 سنة، جزائرية من فرنسا — تجربتها من البداية",
    videoUrl: "https://www.youtube.com/watch?v=2mwkgkQdk7w",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "camelia-canada",
    type: "video",
    name: "كاميليا",
    country: "🇨🇦",
    result: "26 سنة، جزائرية مقيمة بكندا — انطلاقتها في التجارة الإلكترونية",
    videoUrl: "https://www.youtube.com/watch?v=7oAO_RcqG5Q",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "sofia-maman",
    type: "video",
    name: "صوفيا",
    country: "🇫🇷",
    result: "أم وربة بيت، 32 سنة — بنت مشروعها من المنزل",
    videoUrl: "https://www.youtube.com/watch?v=WUkg5wa_V7A",
    tags: ["maman"],
    date: "2026-06-04",
  },
  {
    id: "fadwa-france",
    type: "video",
    name: "فدوى",
    country: "🇫🇷",
    result: "أم لـ 3 أطفال من فرنسا — وفّقت بين العائلة والتجارة الإلكترونية",
    videoUrl: "https://www.youtube.com/watch?v=vy2XDpm6bbA",
    tags: ["maman"],
    date: "2026-06-04",
  },
  {
    id: "hayat-france",
    type: "video",
    name: "حياة",
    country: "🇫🇷",
    result: "40 سنة، أم لـ 3 أبناء من فرنسا — قصتها مع التكوين",
    videoUrl: "https://www.youtube.com/watch?v=Lkfhxj0iHvc",
    tags: ["maman"],
    date: "2026-06-04",
  },
  {
    id: "hicham-france",
    type: "video",
    name: "هشام",
    country: "🇫🇷",
    result: "37 سنة، جزائري من فرنسا — رأيه بعد التكوين",
    videoUrl: "https://www.youtube.com/watch?v=OOorwFiyJic",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "chaimaa-france",
    type: "video",
    name: "شيماء",
    country: "🇫🇷",
    result: "31 سنة من فرنسا — تجربتها مع أكاديمية إيكومي",
    videoUrl: "https://www.youtube.com/watch?v=xxBFaWQT3mw",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "oussama-espagne",
    type: "video",
    name: "أسامة",
    country: "🇪🇸",
    result: "مقيم بإسبانيا — يشارك رأيه في التكوين",
    videoUrl: "https://www.youtube.com/watch?v=uzbTncqixLQ",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "maman-2filles-france",
    type: "video",
    name: "[الاسم]",
    country: "🇫🇷",
    result: "أم لبنتين، 38 سنة من فرنسا — بدأت مشروعها بجانب حياتها العائلية",
    videoUrl: "https://www.youtube.com/watch?v=1wSRYckTeGc",
    tags: ["maman"],
    date: "2026-06-04",
  },
  {
    id: "abdelaziz-paris",
    type: "video",
    name: "عبد العزيز",
    country: "🇫🇷",
    result: "38 سنة من باريس — رأيه في الأكاديمية",
    videoUrl: "https://www.youtube.com/watch?v=iQq5sBJ-CPc",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "abdelilah-france",
    type: "video",
    name: "عبد الإله",
    country: "🇫🇷",
    result: "46 سنة من فرنسا — تجربته مع تكوين إيكومي",
    videoUrl: "https://www.youtube.com/watch?v=TSY75AVYxsw",
    tags: ["reconversion"],
    date: "2026-06-04",
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
