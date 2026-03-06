"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
    {
        q: "ما الذي يجعل ECOMY مختلفاً عن البرامج الأخرى؟",
        a: "ECOMY ليس مجرد كورس تشاهده وتنسى. إنه نظام متكامل صُمم لتحقيق النتائج.\n\n✅ منهجية عملية: لا نظريات مملة، كل درس له تطبيق مباشر\n✅ 11 مرحلة + 150 وحدة: أشمل برنامج في السوق\n✅ نتائج مضمونة: +10,000 طالب حققوا نتائج حقيقية\n✅ دعم مستمر: مجتمع نشط + دعم فني سريع\n✅ تحديثات دائمة: المحتوى يتطور مع السوق"
    },
    {
        q: "هل هذا البرنامج مناسب للمبتدئين؟",
        a: "نعم 100%! تم تصميم ECOMY خصيصاً للمبتدئين. نبدأ معك من الصفر، خطوة بخطوة.\n\nلا تحتاج أي خبرة سابقة في:\n- التجارة الإلكترونية\n- الإعلانات\n- التصميم\n- البرمجة\n\nكل ما تحتاجه هو الالتزام والرغبة في التعلم."
    },
    {
        q: "متى سأبدأ برؤية النتائج؟",
        a: "النتائج تعتمد على التزامك، لكن هذا ما يحققه طلابنا عادة:\n\n📊 الأسبوع 1-2: أول عمولات ومبيعات\n📊 الشهر 1: $500 - $2,000 ممكنة\n📊 الشهر 3: $5,000 - $10,000 للملتزمين\n📊 الشهر 6+: $10,000 - $50,000 للمتفوقين\n\n⚠️ تنبيه: النتائج تختلف من شخص لآخر حسب الجهد والالتزام."
    },
    {
        q: "كم أحتاج من رأس المال للبدء؟",
        a: "يمكنك البدء بميزانية صغيرة:\n\n💰 الحد الأدنى: $200 - $500 للبدء\n💰 المثالي: $1,000 - $2,000 لنتائج أسرع\n\nهذا يشمل:\n- إنشاء المتجر\n- أول حملة إعلانية\n- شراء عينات\n\n📌 ملاحظة: في المرحلة الأولى (Extraction) يمكنك البدء بـ $0 وتحقيق أرباح بدون رأس مال."
    },
    {
        q: "كم من الوقت أحتاج يومياً؟",
        a: "للحصول على نتائج جيدة، ننصح بـ:\n\n⏰ الحد الأدنى: 1-2 ساعة يومياً\n⏰ المثالي: 3-4 ساعات يومياً\n⏰ Full-time: 6-8 ساعات للنتائج السريعة\n\nيمكنك التعلم والتطبيق:\n- في المساء بعد العمل\n- في عطلة نهاية الأسبوع\n- أثناء استراحات العمل"
    },
    {
        q: "ما هي طرق الدفع المتاحة؟",
        a: "نقبل جميع طرق الدفع الآمنة:\n\n💳 البطاقات البنكية (Visa, Mastercard, American Express)\n💳 PayPal\n💳 Apple Pay / Google Pay\n\nجميع المدفوعات تتم عبر Stripe - أكثر منصات الدفع أماناً في العالم.\n\n🔒 بياناتك محمية 100% ولا نحتفظ بمعلومات بطاقتك."
    },
    {
        q: "هل هناك ضمان استرداد المال؟",
        a: "نعم! نقدم ضمان 30 يوم بدون أسئلة.\n\n🛡️ إذا لم تكن راضياً عن البرنامج خلال 30 يوم، تواصل معنا وسنرد لك كامل المبلغ.\n\nلماذا نقدم هذا الضمان؟\n- نثق في جودة المحتوى\n- نريدك أن تجرب بدون خوف\n- +10,000 طالب راضون"
    },
    {
        q: "هل يمكنني الوصول للمحتوى مدى الحياة؟",
        a: "نعم! عند انضمامك لـ ECOMY، تحصل على:\n\n♾️ وصول مدى الحياة لجميع المحتويات\n♾️ جميع التحديثات المستقبلية مجاناً\n♾️ المراحل الجديدة التي نضيفها\n♾️ الأدوات والقوالب الجديدة\n\nلا اشتراكات شهرية. ادفع مرة واحدة واستفد للأبد."
    },
    {
        q: "ما نوع الدعم المتاح؟",
        a: "نقدم دعم متعدد المستويات:\n\n📱 مجتمع Telegram/Discord نشط 24/7\n💬 دعم فني سريع عبر الإيميل\n🔴 جلسات Live أسبوعية (لـ Elite)\n👤 مرافقة شخصية (لـ Empire Coaching)\n\nمتوسط وقت الرد: أقل من 24 ساعة."
    },
    {
        q: "هل البرنامج يعمل في بلدي؟",
        a: "نعم! ECOMY يعمل في أي بلد في العالم.\n\n🌍 نغطي:\n- الدول العربية (الخليج، المغرب العربي، مصر...)\n- أوروبا\n- أمريكا وكندا\n- أي بلد آخر\n\nنعلمك كيف تبيع عالمياً بغض النظر عن موقعك الجغرافي."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-20 bg-[#1A1A1A]/50">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold font-cairo mb-4 leading-tight">
                        الأسئلة <span className="text-[#D4B85C]">الشائعة</span>
                    </h2>
                    <p className="text-xl text-gray-500">إجابات على كل تساؤلاتك قبل الانضمام</p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="border border-[#C5A04E]/10 rounded-2xl bg-[#1A1A1A] overflow-hidden hover:border-[#C5A04E]/30 transition-colors duration-300">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-right hover:bg-[#1A1A1A] transition-colors group"
                            >
                                <span className="font-bold text-lg text-white group-hover:text-[#C5A04E] transition-colors">{faq.q}</span>
                                {openIndex === i ? <Minus className="text-[#C5A04E]" /> : <Plus className="text-gray-500 group-hover:text-[#C5A04E] transition-colors" />}
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-[#C5A04E]/10 mt-2 whitespace-pre-line">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
