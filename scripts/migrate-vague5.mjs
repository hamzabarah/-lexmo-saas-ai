import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const planPath = path.join(ROOT, "content", "editorial", "plan.csv");

const PREUVES_STD = "Carrousel vidéos + galerie screens (profils et résultats variés)";
const PREUVES_LEGAL = "VideoCarousel seul (crédibilité, aucun screen de gains) — disclaimer « توضيح عام لا استشارة قانونية/مالية » + source officielle, AUCUN chiffre inventé";
const PREUVES_TRANSP = "VideoCarousel seul (crédibilité) — critères de choix, AUCUN tarif inventé, renvoi au site officiel du transporteur";
const CONCURRENT = "à auditer (SERP au moment de la rédaction)";

// fmt: l = liste numérotée, t = tableau comparatif, r = réponse directe
// s: '' | 'legal' | 'transp'
// slug=null => SKIP (doublon)
const rows = [
  // ===== VAGUE B =====
  ["افضل وقت لبدء متجر الكتروني في السنة","afdal-waqt-libidayat-matjar","l",""],
  ["التجارة الإلكترونية للمبتدئين خطوة بخطوة",null,"l",""],
  ["التجارة الإلكترونية مقابل العمل الحر أيهما أفضل",null,"t",""],
  ["الفرق بين دروبشيبينغ والتجارة الإلكترونية","alfarq-dropshipping-wa-tijara","t",""],
  ["خطة عمل متجر الكتروني لاول 90 يوم","khittat-amal-matjar-90-yawm","l",""],
  ["كم رأس مال ابدأ به متجر دروبشيبينغ صغير","kam-ras-mal-dropshipping-saghir","r",""],
  ["كيف اختبر فكرة منتج قبل البدء","kayfa-akhtabir-fikrat-montaj","l",""],
  ["كيف اربح من التجارة الإلكترونية بدون موقع","kayfa-arbah-bidun-mawqie","l",""],
  ["كيف اوازن بين الوظيفة والتجارة الإلكترونية",null,"l",""],
  ["ما الفرق بين المتجر العام والمتجر المتخصص",null,"t",""],
  ["ما هي عيوب التجارة الإلكترونية الحقيقية","maa-hiya-uyub-tijara","r",""],
  ["هل ابدأ بمنتج واحد ام عدة منتجات",null,"r",""],
  ["هل التجارة الإلكترونية مربحة فعلا في 2026",null,"r",""],
  ["هل يمكن البدء في التجارة الإلكترونية بدون خبرة تقنية",null,"r",""],
  ["اعلانات تيك توك في العراق طريقة الدفع","ielanat-tiktok-aliraq-dafe","l",""],
  ["اعلانات فيسبوك في سوريا بدائل الدفع","ielanat-facebook-suria-dafe","l",""],
  ["افضل المنتجات التي تنجح في اعلانات سناب الخليج","afdal-montajat-snapchat-khalij","l",""],
  ["افضل وقت لنشر فيديو منتج على تيك توك","afdal-waqt-nashr-tiktok","l",""],
  ["الفرق بين CBO و ABO في اعلانات فيسبوك","alfarq-cbo-abo","t",""],
  ["الفرق بين اعلانات تيك توك واعلانات فيسبوك",null,"t",""],
  ["تكلفة اعلانات سناب شات في الخليج","taklifat-ielanat-snapchat-khalij","l",""],
  ["حكم إعلانات فيسبوك الممولة شرعا","hukm-ielanat-facebook-sharaan","l","legal"],
  ["دفع اعلانات تيك توك عن طريق فوري","dafe-ielanat-tiktok-fawry","l",""],
  ["دفع اعلانات فيسبوك عن طريق فوري في مصر",null,"l",""],
  ["سبب حظر حساب اعلانات فيسبوك وحلوله",null,"l",""],
  ["سياسة اعلانات فيسبوك للمنتجات الممنوعة","siyasat-facebook-montajat-mamnua","l",""],
  ["كم ميزانية اختبار المنتج على فيسبوك",null,"r",""],
  ["كيف اربح من تيك توك بدون اعلانات ممولة",null,"l",""],
  ["كيف استهدف جمهور دولة عربية محددة","kayfa-astahdif-dawla-arabiya","l",""],
  ["كيف اصنع ريلز لمنتج بدون ظهور",null,"l",""],
  ["كيف اصنع فيديو منتج يصبح فيروسي","kayfa-asnae-video-viral","l",""],
  ["كيف اعيد استهداف الزوار retargeting",null,"l",""],
  ["كيف اكتب نص اعلاني يبيع copywriting",null,"l",""],
  ["لماذا لا تظهر اعلاناتي على فيسبوك","limadha-la-tazhar-ielanati","r",""],
  ["ما هو البكسل وكيف اركبه على شوبيفاي",null,"r",""],
  ["مدير اعلانات تيك توك بالعربي شرح",null,"l",""],
  ["مقاس اعلانات سناب شات الصحيح",null,"l",""],
  ["مكتبة اعلانات تيك توك للبحث عن منتجات",null,"l",""],
  ["منصة ادارة اعلانات سناب شات شرح","snapchat-ads-manager-sharh","l",""],
  ["افضل ثيمات شوبيفاي المجانية لمتجر منتج واحد",null,"l",""],
  ["افضل منصات الطباعة عند الطلب للعرب","afdal-mansat-pod-lil-arab","l",""],
  ["بديل شوبيفاي مجاني للمبتدئين","badil-shopify-majani","l",""],
  ["شوبيفاي في الأردن طريقة الدفع","shopify-fil-urdun","l",""],
  ["شوبيفاي في العراق هل متاح","shopify-fil-iraq","l",""],
  ["شوبيفاي في الكويت بوابات الدفع","shopify-fil-kuwait","l",""],
  ["شوبيفاي مقابل ووردبريس ووكومرس للعرب",null,"t",""],
  ["كم تكلفة اشتراك شوبيفاي الشهري الحقيقية",null,"r",""],
  ["كيف احسن سرعة متجر شوبيفاي",null,"l",""],
  ["كيف اربط دومين عربي بمتجر شوبيفاي","kayfa-arbit-domain-shopify","l",""],
  ["ما هو البرينت اون ديماند وكيف ابدا","ma-houa-print-on-demand","r",""],
  ["متجر شوبيفاي جاهز للبيع","matjar-shopify-jahiz-lilbaye","l",""],
  ["افضل بوابات الدفع للمتاجر العربية","afdal-bawabat-dafe-arabiya","l",""],
  ["الفرق بين الدفع عند الاستلام والدفع المسبق","alfarq-cod-wal-dafe-musbaq","t",""],
  ["بدائل سترايب في الدول العربية","badail-stripe-arabiya","l",""],
  ["كيف استقبل المدفوعات الدولية بدون باي بال",null,"l",""],
  ["كيف اقلل المرتجعات في الدفع عند الاستلام",null,"l",""],
  ["لماذا يرفض العملاء الدفع عند الاستلام","limadha-yarfud-alumalaa-cod","r",""],
  ["نسبة المرتجعات في الدفع عند الاستلام","nisbat-almurtajaat-cod","l",""],
  ["افضل شركات الشحن الدولي للتجارة الإلكترونية","afdal-sharikat-shahn-dawli","l","transp"],
  ["كم يستغرق الشحن من الصين بالدروبشيبينغ","kam-yastaghriq-shahn-min-assin","r",""],
  ["كيف اتعامل مع تأخر الشحنات مع العملاء",null,"l",""],
  ["كيف احسب تكلفة الشحن في متجري","kayfa-ahsib-taklifat-ashahn","l",""],
  ["كيف اختار وكيل شحن موثوق",null,"l",""],
  ["مشاكل التوصيل في الدروبشيبينغ وحلولها","mashakil-attawsil-dropshipping","l",""],
  ["افضل استراتيجيات التسويق عبر البريد الالكتروني للمتاجر",null,"l",""],
  ["افضل كلمات مفتاحية لمتجر الكتروني عربي","afdal-kalimat-muftahiya-seo","l",""],
  ["التسويق بالمؤثرين للمتاجر الصغيرة",null,"l",""],
  ["كيف ابني صفحة انستغرام لمتجري",null,"l",""],
  ["كيف اجلب زبائن لمتجري بدون اعلانات مدفوعة",null,"l",""],
  ["كيف احسن ظهور متجري في جوجل",null,"l",""],
  ["كيف اكتب وصف منتج يقنع بالشراء",null,"l",""],
  ["الوثائق القانونية اللازمة لمتجر الكتروني",null,"l",""],
  ["حقوق الصور والمحتوى في المتجر الالكتروني",null,"l",""],
  ["حكم بيع منتجات غير موجودة في المخزون",null,"l",""],
  ["ضرائب التجارة الإلكترونية في العراق","daraib-tijara-aliraq","l","legal"],
  ["هل احتاج سجل تجاري للبيع اونلاين في الكويت","hal-ahtaj-sijil-tijari-kuwait","r",""],
  ["هل ادفع ضرائب على ارباح المتجر",null,"r",""],
  ["هل الدروبشيبينغ قانوني في الدول العربية","hal-dropshipping-qanuni-arabiya","r","legal"],
  ["استراتيجية التوسع من منتج واحد الى متجر عام","istratijiyat-tawassue-matjar-aam","l",""],
  ["كيف ابني فريق عمل لمتجري الناجح",null,"l",""],
  ["كيف اعيد استثمار ارباح المتجر للنمو",null,"l",""],
  ["كيف اوسع متجري الى اسواق جديدة",null,"l",""],
  ["متى ازيد ميزانية الاعلانات الرابحة",null,"r",""],
  ["متى انتقل من الدروبشيبينغ الى تخزين المنتجات",null,"r",""],
  ["كيف ارفع معدل التحويل في متجري","kayfa-arfae-muaddal-attahwil","l",""],
  ["كيف اصمم صفحة منتج احترافية",null,"l",""],
  ["ما هي صفحة الهبوط landing page وكيف اصممها",null,"r",""],
  ["التكاليف الخفية في التجارة الإلكترونية",null,"l",""],
  ["كم يربح اصحاب المتاجر الالكترونية شهريا",null,"r",""],
  ["متى استرجع رأس مالي في الدروبشيبينغ",null,"r",""],
  ["الفرق بين بيع المنتجات الرقمية والفيزيائية",null,"t",""],
  ["كيف ابيع منتجات رقمية بدون مخزون","kayfa-abie-montajat-raqamiya","l",""],
  ["اخطاء المبتدئين في اعلانات فيسبوك","akhtae-almobtadiin-facebook","l",""],
  ["اخطاء تسعير المنتجات في المتجر","akhtae-tasir-almontajat","l",""],
  ["اكبر الاخطاء التي تقتل المتاجر الجديدة",null,"l",""],
  ["لماذا يفشل 90% من متاجر الدروبشيبينغ",null,"r",""],
  ["لماذا يهجر الزوار سلة الشراء",null,"r",""],
  ["متى اوقف اعلان خاسر",null,"r",""],
  ["قصص نجاح عرب في الدروبشيبينغ 2026",null,"l",""],
  ["أفضل المنتجات الرابحة في السوق العراقي","afdal-montajat-aliraq","l",""],
  ["أفضل بوابات الدفع للمتاجر في الكويت KNET","bawabat-dafe-kuwait-knet","l",""],
  ["أفضل بوابات الدفع لمتجر سعودي","bawabat-dafe-saudi","l",""],
  ["أفضل شركات التوصيل في العراق للمتاجر","afdal-sharikat-tawsil-iraq","l","transp"],
  ["البيع اونلاين في اليمن طرق عملية","albaye-online-yemen","l",""],
  ["التجارة الإلكترونية في الأردن دليل البداية","tijara-electroniya-fil-urdun","l",""],
  ["التجارة الإلكترونية في السودان والتحديات","tijara-electroniya-fi-sudan","l",""],
  ["التجارة الإلكترونية في العراق كيف تبدأ","tijara-electroniya-fil-iraq","l",""],
  ["التجارة الإلكترونية في سوريا وبدائل الدفع","tijara-electroniya-fi-suria","l",""],
  ["التجارة الإلكترونية في عمان والمنتجات الرائجة","tijara-electroniya-fi-oman","l",""],
  ["التجارة الإلكترونية في لبنان رغم الأزمة","tijara-electroniya-fi-lubnan","l",""],
  ["التجارة الإلكترونية في موريتانيا للمبتدئين","tijara-electroniya-fi-muritania","l",""],
  ["بوابات الدفع المتاحة للمتاجر في تونس","bawabat-dafe-tunis","l",""],
  ["بوابات الدفع للمتاجر في البحرين Benefit","bawabat-dafe-bahrain-benefit","l",""],
  ["تكلفة وتراخيص متجر الكتروني في الإمارات","taklifat-taraxis-matjar-imarat","l",""],
  ["دفع اعلانات فيسبوك عبر فوري في مصر",null,"l",""],
  ["شركات الشحن والتوصيل في الأردن","sharikat-shahn-urdun","l","transp"],
  ["ضرائب وزكاة المتجر الإلكتروني في السعودية","daraib-zakat-matjar-saudi","l","legal"],
  ["كيف ابدأ تجارة الكترونية في ليبيا","tijara-electroniya-fi-libia","l",""],
  ["كيف ابدأ متجر الكتروني في فلسطين","matjar-electroni-filastin","l",""],
  ["كيف ابدأ متجر الكتروني في قطر","matjar-electroni-qatar","l",""],
  ["كيف استقبل أرباح المتجر في المغرب بدون باي بال",null,"l",""],
  ["مشاكل الدفع الإلكتروني في الجزائر وحلولها",null,"l",""],
  ["هل احتاج رخصة للبيع اونلاين في الكويت",null,"r",""],
  // ===== VAGUE C =====
  ["أدوات معرفة المنتج الرابح المجانية",null,"l",""],
  ["ادوات تجسس على متاجر المنافسين","adawat-tajassus-almunafisin","l",""],
  ["افضل نيش لمنتجات الاطفال دروبشيبينغ","niche-montajat-atfal","l",""],
  ["الفرق بين منتج موسمي ومنتج دائم","alfarq-montaj-mawsimi-daim","t",""],
  ["المنتج الرابح للسوق العراقي",null,"l",""],
  ["كيف اجد منتج رابح من تيك توك","kayfa-ajid-montaj-min-tiktok","l",""],
  ["كيف اعرف الطلب على منتج في بلد معين","kayfa-aarif-attalab-balad","l",""],
  ["كيف اعرف ان المنتج مشبع","kayfa-aarif-montaj-mushbae","l",""],
  ["كيف اقيم هامش الربح قبل اختيار المنتج","kayfa-oqayyim-hamish-arribh","l",""],
  ["منتجات رابحة لرمضان والاعياد","montajat-ramadan-aiad","l",""],
  ["منتجات رابحة لفصل الصيف دروبشيبينغ","montajat-rabiha-sayf","l",""],
  ["منتجات رابحة للموسم الدراسي","montajat-mawsim-dirasi","l",""],
  ["مواصفات المنتج الرابح في 2026",null,"l",""],
  ["نيش الادوات المنزلية الذكية","niche-adawat-manziliya-dhakiya","l",""],
  ["نيش الاكسسوارات والمجوهرات اونلاين","niche-aksisswarat-mujawharat","l",""],
  ["نيش المنتجات الدينية والاسلامية اونلاين","niche-montajat-diniya","l",""],
  ["نيش المنتجات الرياضية واللياقة دروبشيبينغ","niche-montajat-riyadiya","l",""],
  ["نيش مستلزمات الحيوانات الأليفة في الخليج","niche-mustalzamat-hayawanat","l",""],
  ["نيش منتجات الالعاب والاطفال",null,"l",""],
  ["نيش منتجات التخييم والرحلات","niche-montajat-takhyim","l",""],
  ["نيش منتجات الديكور المنزلي الرابحة","niche-montajat-dikor","l",""],
  ["نيش منتجات السيارات واكسسواراتها","niche-montajat-sayarat","l",""],
  ["نيش منتجات الصحة واللياقة للنساء","niche-montajat-sihha-nisaa","l",""],
  ["نيش منتجات العرسان وحفلات الزفاف","niche-montajat-arsan","l",""],
  ["نيش منتجات العناية بالبشرة للرجال","niche-inaya-bashra-rijal","l",""],
  ["نيش منتجات المطبخ المنزلي الرابحة","niche-montajat-matbakh","l",""],
  ["افضل تطبيقات ربط الموردين بشوبيفاي","afdal-tatbiqat-rabt-muwaridin","l",""],
  ["افضل منصات الموردين للسوق الخليجي","afdal-mansat-muwaridin-khalij","l",""],
  ["الفرق بين الوكيل والمورد في الدروبشيبينغ","alfarq-wakil-wa-muwarid","t",""],
  ["بدائل علي اكسبريس للدروبشيبينغ","badail-aliexpress","l",""],
  ["كيف اتجنب المورد المحتال في الدروبشيبينغ","kayfa-atajannab-muwarid-muhtal","l",""],
  ["كيف اتفاوض مع المورد الصيني",null,"l",""],
  ["كيف اطلب عينة من المورد قبل البيع","kayfa-atlub-ayyina-muwarid","l",""],
  ["موردين دروبشيبينغ في تركيا للعرب","muwaridin-turkia","l",""],
  ["موردين محليين دروبشيبينغ في الخليج","muwaridin-mahalliyin-khalij","l",""],
  ["موردين منتجات رقمية للبيع","muwaridin-montajat-raqamiya","l",""],
  ["اخطاء اختيار النيش الشائعة","akhtae-ikhtiyar-niche","l",""],
  ["التجارة الإلكترونية في ألمانيا للناطقين بالعربية",null,"l",""],
  ["التجارة الإلكترونية في إسبانيا للعرب autónomo","tijara-electroniya-isbania-autonomo","l",""],
  ["التجارة الإلكترونية في كندا للمهاجرين العرب","tijara-electroniya-kanada","l",""],
  ["التجارة الإلكترونية في هولندا ونظام iDEAL","tijara-electroniya-hollanda-ideal","l",""],
  ["التصريح الضريبي للتجارة الإلكترونية في فرنسا للعرب",null,"l","legal"],
  ["دروبشيبينغ في استراليا بالعربية ABN","dropshipping-australia-abn","l",""],
  ["ضريبة Kleinunternehmer للدروبشيبينغ في ألمانيا","daribat-kleinunternehmer-almania","l","legal"],
  ["كيف ابدأ تجارة الكترونية في ايطاليا partita IVA","tijara-electroniya-italia-partita-iva","l",""],
  ["كيف ابدأ تجارة الكترونية في بلجيكا بالعربي",null,"l",""],
  ["كيف ابدأ دروبشيبينغ في امريكا بالعربية LLC","dropshipping-amrica-llc","l",""],
  ["كيف ابدأ متجر الكتروني في السويد بالعربي","tijara-electroniya-suwid","l",""],
  ["كيف اسجل micro-entreprise لمتجر دروبشيبينغ","tasjil-micro-entreprise","l",""],
  ["كيف اسجل متجر دروبشيبينغ في بريطانيا sole trader","tasjil-matjar-britania-sole-trader","l",""],
];

const fmtMap = {
  l: "liste numérotée",
  t: "tableau comparatif",
  r: "réponse directe",
};

function csvCell(v) {
  if (v == null) v = "";
  v = String(v);
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

// lire plan.csv existant, trouver max ordre
const existing = fs.readFileSync(planPath, "utf8").replace(/\r\n/g, "\n").replace(/\n+$/,"");
const lines = existing.split("\n");
let maxOrdre = 0;
for (let i = 1; i < lines.length; i++) {
  const m = lines[i].match(/^(\d+),/);
  if (m) maxOrdre = Math.max(maxOrdre, parseInt(m[1], 10));
}

// vérifier slugs uniques
const slugSet = new Set();
for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(",");
  // slug is col index 2 but titre may contain commas -> rough; use regex on existing slugs we know format
}

let ordre = maxOrdre;
const newLines = [];
let kept = 0, skipped = 0;
const usedSlugs = new Set();
for (const [titre, slug, fmt, sens] of rows) {
  if (!slug) { skipped++; continue; }
  if (usedSlugs.has(slug)) throw new Error("Slug dupliqué dans migration: " + slug);
  usedSlugs.add(slug);
  ordre++;
  kept++;
  const preuves = sens === "legal" ? PREUVES_LEGAL : sens === "transp" ? PREUVES_TRANSP : PREUVES_STD;
  const row = [ordre, titre, slug, fmtMap[fmt], CONCURRENT, preuves, "a_faire"]
    .map(csvCell).join(",");
  newLines.push(row);
}

const out = existing + "\n" + newLines.join("\n") + "\n";
fs.writeFileSync(planPath, out, "utf8");
console.log("maxOrdre avant:", maxOrdre);
console.log("Lignes gardées (a_faire):", kept);
console.log("Lignes skippées (doublons):", skipped);
console.log("Nouveau max ordre:", ordre);
console.log("Total rows réservoir traités:", rows.length);
