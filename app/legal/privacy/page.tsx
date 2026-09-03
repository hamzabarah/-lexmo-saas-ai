import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "سياسة الخصوصية — ECOMY",
  description:
    "ما الذي تجمعه ECOMY من بيانات، ولماذا، ومع من تتقاسمها، وما هي حقوقك بموجب اللائحة الأوروبية GDPR.",
  alternates: { canonical: "/legal/privacy" },
};

const TOOLS: { name: string; role: string }[] = [
  { name: "Supabase", role: "قاعدة البيانات والمصادقة (استضافة آمنة)" },
  { name: "Stripe", role: "معالجة الدفع" },
  { name: "Resend", role: "إرسال رسائل التفعيل" },
  { name: "Google Analytics", role: "إحصائيات الزيارات" },
  { name: "YouTube (nocookie)", role: "عرض فيديوهات الدروس بوضع الخصوصية المعزّز" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-400 py-16 px-4 font-cairo" dir="rtl">
      <div className="mx-auto" style={{ maxWidth: '800px' }}>

        {/* Back link */}
        <Link href="/" className="inline-block text-[#C5A04E] text-sm font-semibold hover:underline mb-8">
          &rarr; العودة إلى الرئيسية
        </Link>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          سياسة الخصوصية
        </h1>
        <p className="text-sm text-gray-500 mb-12">آخر تحديث : 3 سبتمبر 2026</p>

        <div className="space-y-10 text-[15px] leading-[1.95]">

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">1. من نحن</h2>
            <p>ECOMY (www.ecomy.ai) منصة تكوين في التجارة الإلكترونية. هذه الصفحة تشرح ما نجمعه من بيانات، ولماذا، ومع من نتقاسمها، وما هي حقوقك.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">2. البيانات التي نجمعها</h2>
            <ul className="list-disc list-inside space-y-2 marker:text-[#C5A04E]">
              <li><strong className="text-white font-bold">عند إنشاء الحساب</strong> : البريد الإلكتروني، الاسم، وكلمة مرور مشفّرة.</li>
              <li><strong className="text-white font-bold">عند الدفع</strong> : تتم معالجة الدفع بالكامل لدى Stripe. نحن لا نرى ولا نخزّن رقم بطاقتك أبداً.</li>
              <li><strong className="text-white font-bold">أثناء استخدام المنصة</strong> : تقدمك في الدروس (الدروس المكتملة، نتائج الاختبارات) لنحفظ لك مسارك.</li>
              <li><strong className="text-white font-bold">في مسار التشخيص</strong> : إجاباتك على الاستبيان، لإعداد التقييم وخطة العمل.</li>
              <li><strong className="text-white font-bold">تصفح الموقع</strong> : إحصائيات مجهولة عبر Google Analytics (صفحات مزارة، مدة الزيارة).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">3. الأدوات التي نستخدمها</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-white/15">
                    <th className="py-2 px-3 text-white font-bold text-sm">الأداة</th>
                    <th className="py-2 px-3 text-white font-bold text-sm">الدور</th>
                  </tr>
                </thead>
                <tbody>
                  {TOOLS.map((t) => (
                    <tr key={t.name} className="border-b border-white/[0.06]">
                      <td className="py-2.5 px-3 text-gray-300 whitespace-nowrap">{t.name}</td>
                      <td className="py-2.5 px-3">{t.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4">لا نبيع بياناتك لأي طرف ثالث، ولا نرسل رسائل تسويقية دون طلبك.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">4. مدة الاحتفاظ</h2>
            <p>نحتفظ ببيانات حسابك طيلة مدة اشتراكك (الوصول مدى الحياة). يمكنك طلب حذف حسابك وبياناتك في أي وقت.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">5. حقوقك (اللائحة الأوروبية GDPR)</h2>
            <p>لك الحق في الاطلاع على بياناتك، تصحيحها، حذفها، أو طلب نسخة منها. راسلنا عبر البريد المذكور في <Link href="/legal/terms" className="text-[#C5A04E] hover:underline">شروط الاستخدام</Link> — نرد خلال 30 يوماً.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C5A04E] mb-3">6. الكوكيز</h2>
            <p>نستخدم كوكيز تقنية ضرورية لتسجيل الدخول، وكوكيز إحصائية (Google Analytics). يمكنك ضبط متصفحك لرفض الكوكيز غير الضرورية.</p>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-6 border-t border-white/10 flex items-center justify-center gap-5">
          <Link href="/legal/terms" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
            شروط الاستخدام
          </Link>
          <span className="text-gray-700">·</span>
          <Link href="/legal/refund" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
            سياسة الاسترجاع
          </Link>
        </div>

      </div>
    </div>
  );
}
