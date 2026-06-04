import Link from "next/link";
import { ArrowLeft, Sparkles, Target, ShoppingBag } from "lucide-react";

/* ════════════════════════════════════════════════
   <BlogCTA /> — reusable call-to-action box.
   - Auto-inserted at the end of every article.
   - Also insertable mid-article from MDX: <BlogCTA />
     or <BlogCTA variant="diagnostic" />.
   ════════════════════════════════════════════════ */

type Variant = "formation" | "diagnostic" | "shopify";

interface BlogCTAProps {
  variant?: Variant;
}

interface VariantConfig {
  badge: string;
  title: string;
  subtitle: string;
  oldPrice?: string;
  price?: string;
  button: string;
  href: string;
  external?: boolean;
  Icon: typeof Sparkles;
}

const VARIANTS: Record<Variant, VariantConfig> = {
  formation: {
    badge: "تكوين شامل",
    title: "ابدأ تجارتك الإلكترونية من الصفر",
    subtitle:
      "تكوين كامل خطوة بخطوة في الدروبشيبينغ وإعلانات فيسبوك وتيكتوك — من اختيار المنتج حتى أول مبيعة.",
    oldPrice: "970€",
    price: "197€",
    button: "احصل على التكوين الآن",
    href: "/formation-basic",
    Icon: Sparkles,
  },
  diagnostic: {
    badge: "تشخيص فردي",
    title: "احجز جلسة تشخيص بزنس خاصة بك",
    subtitle:
      "جلسة فردية 45 دقيقة مع خبير لتحديد البزنس المناسب لك وخطة عمل واضحة حسب إمكانياتك وميزانيتك.",
    oldPrice: "970€",
    price: "97€",
    button: "احجز جلستك الآن",
    href: "/diagnostic",
    Icon: Target,
  },
  shopify: {
    badge: "عرض خاص",
    title: "أنشئ متجر شوبيفاي الخاص بك",
    subtitle:
      "ابدأ متجرك الإلكتروني مع شوبيفاي — عرض حصري: 1€ فقط لأول 3 أشهر.",
    button: "جرّب شوبيفاي الآن",
    href: "https://shopify.pxf.io/WO4qKJ",
    external: true,
    Icon: ShoppingBag,
  },
};

export default function BlogCTA({ variant = "formation" }: BlogCTAProps) {
  const c = VARIANTS[variant];
  const { Icon } = c;

  const button = (
    <span className="inline-flex items-center gap-2 rounded-xl bg-[#C5A04E] px-7 py-3.5 text-base font-bold text-[#0A0A0A] transition-all duration-200 hover:bg-[#d4b35e] hover:shadow-[0_0_24px_-4px_rgba(197,160,78,0.6)]">
      {c.button}
      <ArrowLeft className="h-5 w-5" />
    </span>
  );

  return (
    <div className="not-prose my-10 overflow-hidden rounded-2xl border border-[#C5A04E]/25 bg-gradient-to-br from-[#141414] to-[#0c0c0c] p-7 text-right shadow-xl sm:p-9">
      <div className="flex items-center gap-2 text-[#C5A04E]">
        <Icon className="h-5 w-5" />
        <span className="text-sm font-bold tracking-wide">{c.badge}</span>
      </div>

      <h3 className="mt-3 text-2xl font-extrabold leading-snug text-white sm:text-3xl">
        {c.title}
      </h3>

      <p className="mt-3 text-base leading-relaxed text-gray-300">{c.subtitle}</p>

      {c.price && (
        <div className="mt-5 flex items-center justify-end gap-3">
          {c.oldPrice && (
            <span className="text-lg text-gray-500 line-through decoration-red-500/70">
              {c.oldPrice}
            </span>
          )}
          <span className="text-3xl font-extrabold text-[#C5A04E]">{c.price}</span>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        {c.external ? (
          <a href={c.href} target="_blank" rel="noopener noreferrer sponsored">
            {button}
          </a>
        ) : (
          <Link href={c.href}>{button}</Link>
        )}
      </div>
    </div>
  );
}
