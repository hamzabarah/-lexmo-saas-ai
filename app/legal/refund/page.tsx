import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "سياسة الاسترجاع — ECOMY",
  description:
    "شروط الاسترجاع والتراجع الخاصة بمنتجات ECOMY الرقمية وجلسة التشخيص.",
  alternates: { canonical: "/legal/refund" },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-400 py-16 px-4 font-cairo" dir="rtl">
      <div className="mx-auto" style={{ maxWidth: '800px' }}>

        {/* Back link */}
        <Link href="/" className="inline-block text-[#C5A04E] text-sm font-semibold hover:underline mb-8">
          &rarr; العودة إلى الرئيسية
        </Link>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          سياسة الاسترجاع
        </h1>
        <p className="text-sm text-gray-500 mb-12">آخر تحديث : 3 سبتمبر 2026</p>

        <div className="space-y-10 text-[15px] leading-[1.95]">

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">
              1. المبدأ : وصول فوري، بدون استرجاع
            </h2>
            <p>منتجات ECOMY هي محتوى رقمي (تكوين بالفيديو) وخدمات شخصية (جلسة تشخيص). عند إتمام الدفع، تحصل فوراً على وصول كامل ودائم لكل محتوى التكوين.</p>
            <p className="mt-3">بموجب القانون الأوروبي والفرنسي (المادة L221-28 من قانون الاستهلاك الفرنسي)، فإنك بتأكيد شرائك والحصول على الوصول الفوري للمحتوى الرقمي، <strong className="text-white font-bold">تتنازل صراحةً عن حق التراجع البالغ 14 يوماً</strong>، وبالتالي لا يمكن استرجاع المبلغ بعد فتح الوصول.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">
              2. لماذا هذه السياسة ؟
            </h2>
            <p>لأن المحتوى الرقمي يُستهلك بمجرد الاطلاع عليه ولا يمكن «إرجاعه». نعوّض ذلك بالشفافية قبل الشراء : صفحات البيع تصف المحتوى بدقة (عدد المراحل والدروس)، والمدونة تضم أكثر من 300 دليل مجاني لتقييم جودة منهجنا قبل أي التزام.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">
              3. جلسة التشخيص (97 €)
            </h2>
            <p>يمكن تغيير موعد الجلسة مجاناً حتى 48 ساعة قبل الموعد المحدد، عبر مراسلتنا. بعد انعقاد الجلسة، لا يمكن استرجاع المبلغ.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">
              4. الحالات الاستثنائية التي نسترجع فيها المبلغ كاملاً
            </h2>
            <ul className="list-disc list-inside space-y-2 marker:text-[#C5A04E]">
              <li>دفع مزدوج بالخطأ ;</li>
              <li>خصم مبلغ دون الحصول على أي وصول للمنتج خلال 72 ساعة، بعد تواصلك معنا وتعذّر حل المشكلة تقنياً.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">
              5. التواصل
            </h2>
            <p>لأي طلب متعلق بالدفع أو الوصول : راسلنا عبر البريد المذكور في <Link href="/legal/terms" className="text-[#C5A04E] hover:underline">شروط الاستخدام</Link>. نرد خلال 48 ساعة عمل.</p>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-6 border-t border-white/10 flex items-center justify-center gap-5">
          <Link href="/legal/terms" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
            شروط الاستخدام
          </Link>
          <span className="text-gray-700">·</span>
          <Link href="/legal/privacy" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
            سياسة الخصوصية
          </Link>
        </div>

      </div>
    </div>
  );
}
