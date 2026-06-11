import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  HeartHandshake,
  BookOpen,
  GraduationCap,
  Users,
  Star,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { SITE_URL } from "@/lib/blog";
import ProofGallery from "@/components/testimonials/ProofGallery";
import VideoCarousel from "@/components/testimonials/VideoCarousel";

export const metadata: Metadata = {
  title: "من نحن | أكاديمية إيكومي ECOMY — تعلّم التجارة الإلكترونية بصدق",
  description:
    "أكاديمية إيكومي (ECOMY): منصّة عربية تعلّمك التجارة الإلكترونية والدروبشيبينغ بصدق وبلا وعود زائفة. +1000 عضو، تقييم 5★، +300 دليل مجاني، ومرافقة حقيقية حتى أول مبيعة.",
  alternates: { canonical: `${SITE_URL}/a-propos` },
  openGraph: {
    title: "من نحن — أكاديمية إيكومي ECOMY",
    description:
      "نعلّمك التجارة الإلكترونية بصدق وبلا وعود زائفة — +1000 عضو، +300 دليل مجاني، ومرافقة حقيقية.",
    url: `${SITE_URL}/a-propos`,
    siteName: "ECOMY",
    locale: "ar_AR",
    type: "website",
  },
};

/* ── Organization JSON-LD (SEO / GEO) ───────────────────────────── */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "أكاديمية إيكومي",
  alternateName: "ECOMY",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description:
    "أكاديمية عربية متخصّصة في تعليم التجارة الإلكترونية والدروبشيبينغ بصدق وبلا وعود زائفة، مع محتوى مجاني ومرافقة حقيقية حتى أول مبيعة.",
  sameAs: ["https://t.me/ecom_europe", "https://t.me/ecomyyy"],
};

const REASONS = [
  {
    icon: ShieldCheck,
    title: "صدق بلا وعود كاذبة",
    text: "لا نعدك بالثراء في أسبوع. نقول لك الحقيقة بالأرقام والتجارب — النتائج تأتي بالعمل، ونحن نختصر عليك الطريق ونجنّبك الأخطاء المكلفة.",
  },
  {
    icon: HeartHandshake,
    title: "مرافقة حقيقية",
    text: "لست وحدك. خبير يراجع متجرك ويرافقك خطوة بخطوة نحو أول 1000€ — أسرع وأأمن طريق بدل التخبّط بمفردك.",
  },
  {
    icon: BookOpen,
    title: "+300 دليل مجاني",
    text: "مكتبة عربية ضخمة: اختيار المنتجات، شوبيفاي، إعلانات فيسبوك وتيكتوك، الدفع والشحن — تتعلّم مجاناً قبل أن تدفع درهماً.",
  },
  {
    icon: GraduationCap,
    title: "خبرة ونظام مرتّب",
    text: "نظام مرتّب خطوة بخطوة بدل معلومات مشتّتة على يوتيوب — تعرف دائماً ما هي خطوتك القادمة.",
  },
];

/* CTA pair réutilisé à plusieurs endroits de la page. */
function CtaPair({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 sm:flex-row ${className}`}>
      <Link
        href="/formation"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] px-8 py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#0D9668] sm:w-auto"
      >
        <Sparkles className="h-4 w-4" />
        ابدأ الآن
      </Link>
      <Link
        href="/diagnostic"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8600A] px-8 py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#D15509] sm:w-auto"
      >
        احجز تشخيصك
      </Link>
    </div>
  );
}

export default function AProposPage() {
  return (
    <main dir="rtl" lang="ar" className="min-h-screen bg-[#0A0A0A] font-cairo text-white">
      {/* JSON-LD Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* Slim header — wordmark + CTA haut */}
      <header className="w-full px-6 py-6">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between">
          <Link href="/" className="text-2xl font-bold font-orbitron tracking-tighter text-[#C5A04E]">
            ECOMY
          </Link>
          <Link
            href="/formation"
            className="rounded-lg bg-[#10B981] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0D9668]"
          >
            ابدأ الآن
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-20 px-4 py-12 sm:px-6 lg:py-16">

        {/* 1 ─ Accroche / mission */}
        <section className="text-center">
          <span className="mb-4 inline-block rounded-full border border-[#C5A04E]/30 bg-[#C5A04E]/10 px-4 py-1.5 text-sm font-bold text-[#C5A04E]">
            من نحن
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            أكاديمية إيكومي
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-loose text-gray-300 sm:text-lg">
            وُجدنا لسبب واحد: أن يبني العربي — في أوروبا أو في العالم العربي — بزنس
            إلكتروني حقيقي من الصفر، <span className="font-bold text-white">بصدق وبلا وعود كاذبة</span>،
            وبدون أن يقع ضحية الدورات النصّابة التي تبيع الوهم.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-loose text-gray-400">
            مهمتنا أن نختصر عليك سنوات من التخبّط: نظام مرتّب، معرفة صادقة، ومرافقة
            حقيقية حتى أول مبيعة. أنت تنفّذ، ونحن نرافقك.
          </p>
          <CtaPair className="mt-9" />
        </section>

        {/* 2 ─ Preuve sociale : chiffres */}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-[#111111] p-6 text-center">
              <Users className="mb-1 h-6 w-6 text-[#C5A04E]" />
              <span className="text-3xl font-black text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                +1000
              </span>
              <span className="text-sm text-gray-400">عضو مسجّل</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-[#111111] p-6 text-center">
              <div className="mb-1 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#D4A843] text-[#D4A843]" />
                ))}
              </div>
              <span className="text-3xl font-black text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                5.0
              </span>
              <span className="text-sm text-gray-400">453 تقييم موثّق</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-[#111111] p-6 text-center">
              <BookOpen className="mb-1 h-6 w-6 text-[#C5A04E]" />
              <span className="text-3xl font-black text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                +300
              </span>
              <span className="text-sm text-gray-400">دليل مجاني</span>
            </div>
          </div>
        </section>

        {/* 2 (suite) ─ Captures + vidéos réelles (réutilisées du site) */}
        <ProofGallery />
        <VideoCarousel />

        {/* 3 ─ Pourquoi nous */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">لماذا نحن؟</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-400">
              ما الذي يميّزنا عن غيرنا — ولماذا يثق بنا أكثر من 1000 عضو.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {REASONS.map((r) => (
              <div
                key={r.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#111111] p-6 transition-colors hover:border-[#C5A04E]/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C5A04E]/10">
                  <r.icon className="h-6 w-6 text-[#C5A04E]" strokeWidth={1.6} />
                </div>
                <h3 className="text-[15px] font-bold text-white">{r.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-400">{r.text}</p>
              </div>
            ))}
          </div>
          <CtaPair className="mt-10" />
        </section>

        {/* 4/5 ─ Bloc final fort */}
        <section className="rounded-3xl border border-[#C5A04E]/20 bg-gradient-to-br from-[#1A1408] via-[#120E04] to-[#0A0A0A] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold leading-snug text-white sm:text-3xl">
            القرار اليوم: تبقى تتفرّج، ولا تبدأ؟
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-loose text-gray-300">
            كل يوم تأخير هو فرصة تضيع. ابدأ بتشخيص يحدّد لك الطريق الأنسب، أو ادخل
            مباشرة للتكوين والمرافقة — والباقي علينا.
          </p>
          <ul className="mx-auto mt-6 flex max-w-md flex-col gap-2.5 text-right">
            {[
              "نظام مرتّب خطوة بخطوة حتى أول مبيعة",
              "مرافقة حقيقية وخبير يراجع متجرك",
              "صدق بلا وعود كاذبة — تعرف الواقع كما هو",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-[14px] text-gray-200">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]" />
                {line}
              </li>
            ))}
          </ul>
          <CtaPair className="mt-9" />
          <p className="mt-5 text-[12px] leading-relaxed text-gray-500">
            النتائج تختلف من شخص لآخر وغير مضمونة — النجاح يحتاج عملاً والتزاماً.
          </p>
        </section>
      </div>

      {/* Footer */}
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
