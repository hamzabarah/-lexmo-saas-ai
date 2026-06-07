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
  country: string; // emoji drapeau, ex: "🇲🇦" (compat / fallback)
  countryCode: string; // code ISO 3166-1 alpha-2 minuscule, ex: "fr" (pour <Flag />)
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
    countryCode: "fr",
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
    countryCode: "dz",
    result: "طالبة من الجزائر — بدأت التجارة الإلكترونية بجانب دراستها",
    videoUrl: "https://www.youtube.com/watch?v=jUNm6l7b3NM",
    tags: ["salarie-etudiant", "petit-budget"],
    date: "2026-06-04",
  },
  {
    id: "reconversion-hotellerie-autriche",
    type: "video",
    name: "متعلم من النمسا",
    country: "🇦🇹",
    countryCode: "at",
    result: "من قطاع الفندقة إلى عالم التجارة الإلكترونية",
    videoUrl: "https://www.youtube.com/watch?v=uxMF_wPGO-I",
    tags: ["reconversion", "salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "nariman-france",
    type: "video",
    name: "ناريمان",
    country: "🇫🇷",
    countryCode: "fr",
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
    countryCode: "nl",
    result: "أم وربة بيت من هولندا — انطلقت في التجارة الإلكترونية من البيت",
    videoUrl: "https://www.youtube.com/watch?v=4_Rz7g1RkvM",
    tags: ["maman"],
    date: "2026-06-04",
    featured: true,
  },
  {
    id: "experte-financiere-france",
    type: "video",
    name: "خبيرة مالية",
    country: "🇫🇷",
    countryCode: "fr",
    result: "شهادتها حول جدية التكوين",
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
    countryCode: "ch",
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
    countryCode: "es",
    result: "45 سنة، مغربي مقيم بإسبانيا — تجربته مع التكوين",
    videoUrl: "https://www.youtube.com/watch?v=7zwurQVI6FM",
    tags: ["salarie-etudiant", "reconversion"],
    date: "2026-06-04",
  },
  {
    id: "maman-assistante-medicale",
    type: "video",
    name: "مساعدة طبية",
    country: "🇫🇷",
    countryCode: "fr",
    result: "57 سنة وأم لبنتين — بدأت بجانب عملها",
    videoUrl: "https://www.youtube.com/watch?v=RH9-kGKDhWw",
    tags: ["maman", "salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "sanaa-france",
    type: "video",
    name: "سناء",
    country: "🇫🇷",
    countryCode: "fr",
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
    countryCode: "fr",
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
    countryCode: "fr",
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
    countryCode: "ca",
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
    countryCode: "fr",
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
    countryCode: "fr",
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
    countryCode: "fr",
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
    countryCode: "fr",
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
    countryCode: "fr",
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
    countryCode: "es",
    result: "مقيم بإسبانيا — يشارك رأيه في التكوين",
    videoUrl: "https://www.youtube.com/watch?v=uzbTncqixLQ",
    tags: ["salarie-etudiant"],
    date: "2026-06-04",
  },
  {
    id: "maman-2filles-france",
    type: "video",
    name: "أم لبنتين",
    country: "🇫🇷",
    countryCode: "fr",
    result: "38 سنة من فرنسا — بدأت مشروعها بجانب حياتها العائلية",
    videoUrl: "https://www.youtube.com/watch?v=1wSRYckTeGc",
    tags: ["maman"],
    date: "2026-06-04",
  },
  {
    id: "abdelaziz-paris",
    type: "video",
    name: "عبد العزيز",
    country: "🇫🇷",
    countryCode: "fr",
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
    countryCode: "fr",
    result: "46 سنة من فرنسا — تجربته مع تكوين إيكومي",
    videoUrl: "https://www.youtube.com/watch?v=TSY75AVYxsw",
    tags: ["reconversion"],
    date: "2026-06-04",
  },

  // ===== SCREENS — 47 preuves consolidées (auditées) =====
  { id: "sc-01", type: "screen", name: "مهدي", country: "🇲🇦", countryCode: "ma", result: "أول 1000$ في 24 ساعة — 28 طلب وكونفيرجن 6.74%", image: "/images/preuves/temoignage-01.png", tags: ["premiere-vente"] },
  { id: "sc-02", type: "screen", name: "شيماء", country: "🇲🇦", countryCode: "ma", result: "≈1700€ في 24 ساعة — الطلبات وحدة ورا وحدة", image: "/images/preuves/temoignage-02.png", tags: ["premiere-vente"] },
  { id: "sc-03", type: "screen", name: "هشام", country: "🇲🇦", countryCode: "ma", result: "1000$ من 15 مبيعة فقط في 24 ساعة", image: "/images/preuves/temoignage-03.png", tags: ["premiere-vente"] },
  { id: "sc-04", type: "screen", name: "ياسين", country: "🇲🇦", countryCode: "ma", result: "15 مبيعة بلا حتى درهم إعلانات في 3 ساعات", image: "/images/preuves/temoignage-04.png", tags: ["petit-budget", "premiere-vente"] },
  { id: "sc-05", type: "screen", name: "سلمى", country: "🇲🇦", countryCode: "ma", result: "2373$ في أسبوع بـ367$ فقط من الإعلانات (ROI ×6.5)", image: "/images/preuves/temoignage-05.png", tags: ["petit-budget"] },
  { id: "sc-06", type: "screen", name: "متدربة", country: "🇲🇦", countryCode: "ma", result: "2234$ في 24 ساعة و53 طلب", image: "/images/preuves/temoignage-06.png", tags: ["premiere-vente"] },
  { id: "sc-07", type: "screen", name: "فارس", country: "🇲🇦", countryCode: "ma", result: "3178€ من متجر واحد في يوم — ربح صافي 1272€", image: "/images/preuves/temoignage-07.png", tags: ["gros-resultat"] },
  { id: "sc-08", type: "screen", name: "أمين", country: "🇲🇦", countryCode: "ma", result: "5090$ في يوم واحد (+115%) — تجاوز المرحلة الصعيبة", image: "/images/preuves/temoignage-08.png", tags: ["gros-resultat"] },
  { id: "sc-09", type: "screen", name: "إلياس", country: "🇲🇦", countryCode: "ma", result: "7046$ في يوم و44 طلب (+159%)", image: "/images/preuves/temoignage-09.png", tags: ["gros-resultat"] },
  { id: "sc-10", type: "screen", name: "غيثة", country: "🇲🇦", countryCode: "ma", result: "9000$ في 5 أيام — ودابا غادية تسكايلي", image: "/images/preuves/temoignage-10.png", tags: ["gros-resultat"] },
  { id: "sc-11", type: "screen", name: "زكي", country: "🇲🇦", countryCode: "ma", result: "9170€ و411 طلب بعد أسبوعين من التكوين", image: "/images/preuves/temoignage-11.png", tags: ["gros-resultat", "rembourse-formation"] },
  { id: "sc-12", type: "screen", name: "ياسين", country: "🇲🇦", countryCode: "ma", result: "10180€ في شهر — كان كيجرب بوحدو بلا نتيجة قبل التكوين", image: "/images/preuves/temoignage-12.png", tags: ["sceptique-converti"] },
  { id: "sc-13", type: "screen", name: "عمر", country: "🇲🇦", countryCode: "ma", result: "4000$ إعلانات → 14000$ مبيعات في 78 ساعة (ROAS ×3.5)", image: "/images/preuves/temoignage-13.png", tags: ["gros-resultat"] },
  { id: "sc-14", type: "screen", name: "خديجة", country: "🇲🇦", countryCode: "ma", result: "هي وراجلها: 14240$ في أسبوع بـSnapchat Ads — بدات من الصفر", image: "/images/preuves/temoignage-14.png", tags: ["gros-resultat", "maman"] },
  { id: "sc-15", type: "screen", name: "الأستاذة نجاة", country: "🇲🇦", countryCode: "ma", result: "معلمة حققت 15031$ في أسبوع بـTikTok Ads بجانب عملها", image: "/images/preuves/temoignage-15.png", tags: ["salarie-etudiant", "gros-resultat"] },
  { id: "sc-16", type: "screen", name: "دنيا", country: "🇲🇦", countryCode: "ma", result: "أول 15000$ ديالها — 408 طلب في 20 يوم", image: "/images/preuves/temoignage-16.png", tags: ["gros-resultat"] },
  { id: "sc-17", type: "screen", name: "طارق", country: "🇲🇦", countryCode: "ma", result: "بدا بـ1000€ في الحساب — 16232$ في 4 أيام (+4400%)", image: "/images/preuves/temoignage-17.png", tags: ["petit-budget", "gros-resultat"] },
  { id: "sc-18", type: "screen", name: "مريم", country: "🇫🇷", countryCode: "fr", result: "مستشارة سابقة في باريس: 25411$ في 12 يوم بساعتين في اليوم — وقدمت استقالتها", image: "/images/preuves/temoignage-18.png", tags: ["salarie-etudiant", "reconversion", "gros-resultat"], featured: true },
  { id: "sc-19", type: "screen", name: "كريم", country: "🇲🇦", countryCode: "ma", result: "هو وشريكو: 27040$ في الشهر بهامش 50% — حتى بلوكاج فيسبوك ما وقفهمش", image: "/images/preuves/temoignage-19.png", tags: ["gros-resultat"] },
  { id: "sc-20", type: "screen", name: "عادل", country: "🇲🇦", countryCode: "ma", result: "هو ومرتو: 30600$ في يوم واحد — «أحسن قرار في حياتي»", image: "/images/preuves/temoignage-20.png", tags: ["gros-resultat"] },
  { id: "sc-21", type: "screen", name: "عمر", country: "🇲🇦", countryCode: "ma", result: "جرب دورات ويوتيوب بلا نتيجة — هنا: 35588$ في 18 يوم", image: "/images/preuves/temoignage-21.png", tags: ["sceptique-converti", "gros-resultat"] },
  { id: "sc-22", type: "screen", name: "إسماعيل", country: "🇲🇦", countryCode: "ma", result: "ما كانش عارف التجارة الإلكترونية قبل 6 شهور — دابا 43 ألف في الشهر على متجرين", image: "/images/preuves/temoignage-22.png", tags: ["gros-resultat"] },
  { id: "sc-23", type: "screen", name: "رشيد", country: "🇨🇭", countryCode: "ch", result: "فتح متجره في فبراير — وفي مارس: أكثر من 50000$ (الهدف كان 20 ألف!)", quote: "فتحت المتجر ديالي في فبراير وفي مارس وصلت لأكثر من 50 ألف دولار — المرة الجاية من نوصل للـ100K غادي نبعث ليك إن شاء الله", image: "/images/preuves/temoignage-23.png", tags: ["gros-resultat"] },
  { id: "sc-24", type: "screen", name: "سفيان", country: "🇮🇹", countryCode: "it", result: "فشل في متجره الأول — المتجر الثاني: 50950€ في شهر، من سالير 1100€ في إيطاليا", quote: "من 1100€ ديال السالير في إيطاليا لـ50K في شهر واحد... هادشي صراحة ما كنتش متوقعو!", image: "/images/preuves/temoignage-24.png", tags: ["sceptique-converti", "salarie-etudiant", "gros-resultat"], featured: true },
  { id: "sc-25", type: "screen", name: "أيوب", country: "🇲🇦", countryCode: "ma", result: "63504€ في أول شهر من النشاط — الهدف: المليون", image: "/images/preuves/temoignage-25.png", tags: ["gros-resultat"] },
  { id: "sc-26", type: "screen", name: "وليد", country: "🇫🇷", countryCode: "fr", result: "شرى دورات من فرنسا وأمريكا بلا نتيجة — هنا: أكثر من 112 ألف يورو مبيعات (+51%)", quote: "شريت بزاف ديال الدورات من فرنسا وأمريكا، ولكن ولا واحد فيهم درت فيه نتائج بحال ديالك", image: "/images/preuves/temoignage-26.png", tags: ["sceptique-converti", "gros-resultat"], featured: true },
  { id: "sc-27", type: "screen", name: "رشيد", country: "🇨🇭", countryCode: "ch", result: "طبق الطريقة كما شرحناها — أول 100K: 105508$ في شهر", image: "/images/preuves/temoignage-27.png", tags: ["gros-resultat"] },
  { id: "sc-28", type: "screen", name: "نبيل", country: "🇲🇦", countryCode: "ma", result: "بداية الرحلة: أول 243€ من المبيعات — «التكوين متقون»", quote: "بفضل التكوين ديالك ما عندي ما نقول غير شكراً من القلب — كولشي كان متقون!", image: "/images/preuves/temoignage-28.png", tags: ["premiere-vente"] },
  { id: "sc-31", type: "screen", name: "حسن", country: "🇸🇦", countryCode: "sa", result: "أكثر من 30 ألف دولار و814 مبيعة", image: "/images/preuves/temoignage-31.png", tags: ["gros-resultat"] },
  { id: "sc-32", type: "screen", name: "إيمان", country: "🇪🇸", countryCode: "es", result: "مغربية في إسبانيا، كانت مبتدئة — أكثر من 100 ألف دولار في 24 يوم", image: "/images/preuves/temoignage-32.png", tags: ["gros-resultat"], featured: true },
  { id: "sc-33", type: "screen", name: "إيمان", country: "🇳🇱", countryCode: "nl", result: "عراقية في هولندا — 56064$ في 11 يوم (+2600%)", quote: "تدريبك من أحسن التدريبات اللي شفتها بالتجارة الإلكترونية — جزء التسويق هذا ما عليه سعر أبد", image: "/images/preuves/temoignage-33.png", tags: ["gros-resultat"] },
  { id: "sc-34", type: "screen", name: "كريم", country: "🇲🇦", countryCode: "ma", result: "31000$ في يوم واحد من متجر واحد بـTikTok Ads — ربح ≈12400$", image: "/images/preuves/temoignage-34.png", tags: ["gros-resultat"] },
  { id: "sc-35", type: "screen", name: "سامر", country: "🇨🇭", countryCode: "ch", result: "26303$ في يوم واحد — «هاد الرقم كنت أحلم فيه بالسنة»", quote: "عملت أكتر من 26 ألف دولار بيوم واحد بس!! هاد الرقم كنت أحلم فيه بالسنة — كل كلمة قلتلي ياها طلعت ذهب", image: "/images/preuves/temoignage-35.png", tags: ["gros-resultat"] },
  { id: "sc-36", type: "screen", name: "ياسمين", country: "🇧🇪", countryCode: "be", result: "جزائرية في بلجيكا — أكثر من 6000$ و87 طلبية في نهار واحد", quote: "درت أكثر من ست آلاف دولار في النهار وحدو! والله غير نقولها وأنا نرعش", image: "/images/preuves/temoignage-36.png", tags: ["gros-resultat"] },
  { id: "sc-37", type: "screen", name: "آمنة", country: "🇳🇱", countryCode: "nl", result: "تونسية في هولندا، أم — أكثر من 9000$ في أقل من 12 ساعة وقدمت استقالتها رسمياً", quote: "اليوم رسمياً قدّمت الاستقالة من خدمتي في هولندا — 9000 دولار في أقل من 12 ساعة وأنا قاعدة في داري مع صغاري", image: "/images/preuves/temoignage-37.png", tags: ["maman", "reconversion", "gros-resultat"], featured: true },
  { id: "sc-38", type: "screen", name: "لين", country: "🇬🇧", countryCode: "gb", result: "فلسطينية في لندن — 33687£ في 7 أيام من دارها", quote: "إنت مش بس مدرّب، إنت غيرتلي حياتي — شكراً لأنك آمنت فينا البنات", image: "/images/preuves/temoignage-38.png", tags: ["gros-resultat"], featured: true },
  { id: "sc-39", type: "screen", name: "سلمى", country: "🇫🇷", countryCode: "fr", result: "مغربية في فرنسا، أم — 33061€ في 9 أيام بعد سنوات من العمل الشاق", quote: "درت 33 ألف يورو في 9 أيام... ماشي غير رقم — رجعَت البنت اللي كانت تحلم وتثق بربها وبنفسها", image: "/images/preuves/temoignage-39.png", tags: ["maman", "reconversion", "gros-resultat"] },
  { id: "sc-40", type: "screen", name: "رلى", country: "🇺🇸", countryCode: "us", result: "أردنية في أمريكا، أم وموظفة منهكة — 43000$ في 10 أيام من بيتها", quote: "بعد 10 أيام؟ صار بحسابي 43 ألف دولار، وكل هاد وأنا ببيتي ببيجامتي — حسّيت حالي رجعت أؤمن بحالي", image: "/images/preuves/temoignage-40.png", tags: ["maman", "salarie-etudiant", "gros-resultat"] },
  { id: "sc-41", type: "screen", name: "أمل", country: "🇺🇸", countryCode: "us", result: "سعودية في أمريكا، متجر بخور — 368172$ في شهر (أكبر نتيجة في المكتبة)", quote: "368 ألف دولار بشهر — أنا اللي كنت أحلم أوصل لألفين... أنا اليوم أنثى قوية، أنثى حرة", image: "/images/preuves/temoignage-41.png", tags: ["gros-resultat"], featured: true },
  { id: "sc-42", type: "screen", name: "جواهر", country: "🇮🇪", countryCode: "ie", result: "بحرينية في إيرلندا — 50184$ في أول يوم بعد الإطلاق", quote: "أول يوم بعد الإطلاق: 50 ألف دولار، وأنا للحين مو مصدقة — مش لأنك دربتني، بل لأنك كنت ضوّي وسط الظلمة", image: "/images/preuves/temoignage-42.png", tags: ["gros-resultat"] },
  { id: "sc-43", type: "screen", name: "خالد", country: "🇫🇮", countryCode: "fi", result: "مهندس عماني في فنلندا — 40962$ بعد شهر واحد من بداية التدريب", quote: "بعد شهر واحد فقط من بداية التدريب حققت 40 ألف دولار!", image: "/images/preuves/temoignage-43.png", tags: ["salarie-etudiant", "gros-resultat"] },
  { id: "sc-44", type: "screen", name: "راشد", country: "🇺🇸", countryCode: "us", result: "إماراتي، موظف بنك سابق — 44909$ في 11 يوم: «اليوم أنا صاحب مشروع، أنا حر»", quote: "في 11 يوم فقط دخلت 44,000 دولار! اليوم أنا صاحب مشروع، أنا حرّ", image: "/images/preuves/temoignage-44.png", tags: ["reconversion", "gros-resultat"] },
  { id: "sc-45", type: "screen", name: "ريم", country: "🇦🇹", countryCode: "at", result: "يمنية لاجئة في النمسا — أكثر من 50000€ في 15 يوم من بيتها", quote: "حققت أكثر من 50,000 يورو وأنا ببيتي، بدون ما أركض، بدون ما أذل نفسي", image: "/images/preuves/temoignage-45.png", tags: ["reconversion", "gros-resultat"], featured: true },
  { id: "sc-46", type: "screen", name: "سارة", country: "🇸🇪", countryCode: "se", result: "إماراتية في السويد، أم في البيت — 42432$ في أقل من 24 ساعة", image: "/images/preuves/temoignage-46.png", tags: ["maman", "gros-resultat"] },
  { id: "sc-47", type: "screen", name: "سامي", country: "🇬🇧", countryCode: "gb", result: "طالب لبناني في بريطانيا — 16950£ في يوم واحد وهو مركز في دراسته", quote: "أنا لسه طالب، وتشوف الفلوس تدخل لحسابك وأنت مركز بدراستك... شعور ما بيتوصف", image: "/images/preuves/temoignage-47.png", tags: ["salarie-etudiant", "gros-resultat"] },
  { id: "sc-48", type: "screen", name: "مريم", country: "🇺🇸", countryCode: "us", result: "قطرية في أمريكا، طالبة بدون خبرة — 186174$ في 8 أيام", quote: "متجري الإلكتروني حقق 186 ألف دولار وأنا بعدني طالبة — أفتخر إني وحدة من طالباتك", image: "/images/preuves/temoignage-48.png", tags: ["salarie-etudiant", "gros-resultat"], featured: true },
  { id: "sc-49", type: "screen", name: "ناصر", country: "🇨🇭", countryCode: "ch", result: "كويتي في سويسرا — 7346$ في يوم واحد و196 طلب", image: "/images/preuves/temoignage-49.png", tags: ["gros-resultat"] },
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
