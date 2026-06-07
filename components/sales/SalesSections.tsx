"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/* ════════════════════════════════════════════════
   Sections statiques partagées par les 2 pages de vente.
   La partie variable (prix, lien Stripe, coaching) est
   passée en props depuis chaque page.
   ════════════════════════════════════════════════ */

/** 3. Pourquoi ce système fonctionne — 3 cartes. */
export function WhyItWorks() {
  const cards = [
    {
      icon: "🏷️",
      title: "نظام الماركة، ماشي دروبشيبينغ كلاسيكي",
      text: "تبيع بهامش يصل ×3، بدون حرب أثمنة، بدون مخزون",
    },
    {
      icon: "🤖",
      title: "الذكاء الاصطناعي يخدم معك",
      text: "إيجاد المنتجات، كتابة الإعلانات، التصاميم — في دقائق ماشي أسابيع",
    },
    {
      icon: "🎯",
      title: "نظام مرتب، ماشي معلومات مشتتة",
      text: "27 مرحلة بالترتيب الصحيح — تعرف دائماً شنو الخطوة الجاية، بلا تشتت يوتيوب",
    },
  ];

  return (
    <section className="space-y-5">
      <h2 className="text-white text-xl font-bold">لماذا هذا النظام يخدم؟</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-[#C5A04E]/15 bg-[#111111] p-5 text-center"
          >
            <div className="text-3xl">{c.icon}</div>
            <h3 className="mt-3 text-white font-bold text-[15px] leading-snug">{c.title}</h3>
            <p className="mt-2 text-gray-400 text-sm leading-relaxed">{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** 4. Le programme — accordéon de 6 modules + ligne, + carte coaching (offre 497€). */
export function ProgramModules({ withCoaching = false }: { withCoaching?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const modules = [
    {
      icon: "📦",
      title: "المحور 1 — اختيار المنتج الرابح",
      text: "معايير المنتج القابل للبراندينغ، النيشات الرابحة، أدوات البحث والتحقق، إيجاد المورد",
    },
    {
      icon: "🛍️",
      title: "المحور 2 — بناء متجرك الاحترافي",
      text: "Shopify خطوة بخطوة، هوية الماركة، صفحات بيع تحوّل الزوار لعملاء",
    },
    {
      icon: "📣",
      title: "المحور 3 — الإعلانات المدفوعة",
      text: "فيسبوك، تيك توك، إنستغرام وGoogle باستراتيجيات 2026",
    },
    {
      icon: "📲",
      title: "المحور 4 — الترافيك المجاني",
      text: "Reels وShorts وTikTok أورغانيك لجلب زبناء بلا ميزانية إعلانات",
    },
    {
      icon: "💳",
      title: "المحور 5 — الدفعات والشحن",
      text: "استقبال الأموال بدون مشاكل، إدارة الطلبات والموردين",
    },
    {
      icon: "🚀",
      title: "المحور 6 — التوسع",
      text: "قراءة الأرقام، مضاعفة الإعلانات الرابحة، بناء ماركة طويلة الأمد",
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-white text-xl font-bold">برنامج التكوين 📚</h2>

      <div className="space-y-2">
        {modules.map((m, i) => (
          <div key={i} className="border border-[#C5A04E]/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-right hover:bg-[#1A1A1A] transition"
            >
              <span className="flex items-center gap-2.5">
                <span className="text-xl">{m.icon}</span>
                <span className="text-white font-semibold text-[15px]">{m.title}</span>
              </span>
              <ChevronDown
                size={18}
                className={`text-gray-500 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-4 pr-12 text-gray-400 text-sm leading-relaxed">{m.text}</div>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400">+120 درس فيديو عملي · تحديثات مدى الحياة 🔓</p>

      {withCoaching && (
        <div className="rounded-2xl border border-[#C5A04E]/40 bg-gradient-to-b from-[#C5A04E]/10 to-transparent p-5">
          <h3 className="text-[#C5A04E] font-bold text-[15px]">🤝 المرافقة الشخصية</h3>
          <p className="mt-2 text-gray-300 text-sm leading-relaxed">
            متابعة فردية خطوة بخطوة، مراجعة متجرك ومنتجاتك قبل الإطلاق، وأولوية في الإجابة على أسئلتك
          </p>
        </div>
      )}
    </section>
  );
}

/** Carte dorée "المرافقة الشخصية" (offre 497€ uniquement). */
export function CoachingCard() {
  return (
    <div className="rounded-2xl border border-[#C5A04E]/40 bg-gradient-to-b from-[#C5A04E]/10 to-transparent p-5">
      <h3 className="text-[#C5A04E] font-bold text-[15px]">🤝 المرافقة الشخصية</h3>
      <p className="mt-2 text-gray-300 text-sm leading-relaxed">
        متابعة فردية خطوة بخطوة، مراجعة متجرك ومنتجاتك قبل الإطلاق، وأولوية في الإجابة على أسئلتك
      </p>
    </div>
  );
}

/** 5. Ce que tu reçois aujourd'hui — liste + bandeau prix. */
export function WhatYouGet({
  withCoaching = false,
  bandeau,
}: {
  withCoaching?: boolean;
  bandeau: string;
}) {
  const items = [
    { icon: "🎓", text: "تكوين كامل في التجارة الإلكترونية : 27 مرحلة عملية مرتبة خطوة بخطوة" },
    { icon: "🎥", text: "+120 درس فيديو عملي بالعربية — تشاهد وتطبق مباشرة" },
    { icon: "📝", text: "اختبار (Quiz) في نهاية كل مرحلة — تتأكد أنك فهمت قبل ما تتقدم" },
    { icon: "📄", text: "ملخصات وأدلة PDF قابلة للتحميل — تراجع بسرعة بلا ما تعيد الفيديو" },
    { icon: "🔄", text: "تحديثات مدى الحياة — كل جديد في المجال يوصلك مجاناً" },
    { icon: "🔓", text: "وصول فوري ومدى الحياة لكل المحتوى" },
  ];
  if (withCoaching) {
    items.push({ icon: "🤝", text: "المرافقة الشخصية الكاملة طيلة مسارك" });
  }

  return (
    <section className="space-y-4">
      <h2 className="text-white text-xl font-bold">شنو غادي تستلم فور تسجيلك اليوم؟ 🎁</h2>

      <div className="space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-[#C5A04E]/10 bg-[#111111] p-4"
          >
            <span className="text-[#C5A04E] text-lg shrink-0">✅</span>
            <span className="flex items-start gap-2 text-gray-200 text-[15px] leading-relaxed">
              <span className="shrink-0">{it.icon}</span>
              <span>{it.text}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#C5A04E]/40 bg-[#C5A04E]/10 p-4 text-center text-[#C5A04E] font-bold text-[15px] leading-relaxed">
        {bandeau}
      </div>
    </section>
  );
}

/** 6. هل هذا التكوين لك؟ — deux colonnes (vert / rouge). */
export function IsThisForYou() {
  const yes = [
    "تبحث عن بناء بزنس حقيقي، ماشي ربح سريع وهمي",
    "مستعد تطبق خطوة بخطوة (ساعة إلى ساعتين في اليوم تكفي)",
    "عندك ميزانية صغيرة للبداية (300-500€ للاختبار والإعلانات)",
    "موظف، طالب أو أم في البيت وتريد دخلاً بجانب حياتك",
    "مستعد تتعلم من أخطائك وتواصل التطبيق",
  ];
  const no = [
    "تبحث عن الثراء السريع بدون مجهود",
    "تريد نتائج مضمونة 100% بدون تطبيق",
    "لن تشاهد الدروس ولن تطبقها",
    "غير مستعد لأي استثمار في مشروعك",
  ];

  return (
    <section className="space-y-5">
      <h2 className="text-white text-xl font-bold">هل هذا التكوين لك؟</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-700/40 bg-emerald-950/30 p-5">
          <h3 className="text-emerald-400 font-bold text-base">✅ هذا التكوين لك إذا كنت:</h3>
          <ul className="mt-4 space-y-3">
            {yes.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-200 text-sm leading-relaxed">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-red-800/40 bg-red-950/20 p-5">
          <h3 className="text-red-400 font-bold text-base">❌ هذا التكوين ليس لك إذا كنت:</h3>
          <ul className="mt-4 space-y-3">
            {no.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                <span className="text-red-400 shrink-0">✕</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
