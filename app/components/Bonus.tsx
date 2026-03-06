"use client";

import { Gift, Lock } from "lucide-react";

const CATEGORIES = [
    { id: 1, title: "مسرعات المرحلة الأولى", color: "#f97316", count: 4 },
    { id: 2, title: "دروع الحماية", color: "#3b82f6", count: 4 },
    { id: 3, title: "صناعة المحتوى", color: "#a855f7", count: 4 },
    { id: 4, title: "الترسانة الإعلانية", color: "#1E3A8A", count: 4 },
    { id: 5, title: "القوة الصناعية", color: "#10b981", count: 4 },
    { id: 6, title: "النخبة والمستقبل", color: "#ffd700", count: 8 },
];

const ALL_BONUSES: Record<number, { title: string; value: string; description: string }[]> = {
    1: [
        { title: "قوالب الرسائل الجاهزة للبيع 📩", value: "$997", description: "50+ رسالة جاهزة للنسخ واللصق تحول المهتمين إلى مشترين في دقائق." },
        { title: "سكربتات المتابعة الذكية 🔄", value: "$497", description: "نظام متابعة مثبت يضاعف مبيعاتك بدون إلحاح أو إزعاج." },
        { title: "قائمة 100 نيتش مربح 💎", value: "$1,497", description: "أفضل النيتشات المجربة والمربحة لعام 2024 مع تحليل كامل لكل نيتش." },
        { title: "حاسبة الأرباح الذكية 🧮", value: "$297", description: "أداة Excel/Sheets تحسب لك الأرباح والتكاليف والهوامش تلقائياً." },
    ],
    2: [
        { title: "دليل الحماية من الحظر 🛡️", value: "$1,997", description: "كل ما تحتاجه لحماية حساباتك الإعلانية من الحظر والتعليق." },
        { title: "قوالب الاستئناف الناجحة 📄", value: "$997", description: "رسائل استئناف مجربة لاسترجاع الحسابات المعلقة على كل المنصات." },
        { title: "نظام Backup الكامل 💾", value: "$497", description: "خطة طوارئ كاملة لحماية بزنسك من أي كارثة غير متوقعة." },
        { title: "دليل الامتثال القانوني ⚖️", value: "$1,497", description: "كل ما تحتاجه للعمل بشكل قانوني 100% في أي بلد." },
    ],
    3: [
        { title: "بنك الأفكار الفيروسية 🔥", value: "$997", description: "+200 فكرة محتوى مجربة تحقق ملايين المشاهدات على كل المنصات." },
        { title: "قوالب Canva الاحترافية 🎨", value: "$1,497", description: "+100 قالب جاهز للتعديل لإنستغرام وتيك توك وفيسبوك." },
        { title: "سكربتات الفيديو الرابحة 🎬", value: "$1,997", description: "هياكل فيديو مجربة تحول المشاهدين إلى مشترين." },
        { title: "أدوات الذكاء الاصطناعي للمحتوى 🤖", value: "$997", description: "قائمة بأفضل أدوات AI لإنشاء محتوى احترافي في دقائق." },
    ],
    4: [
        { title: "مكتبة الإعلانات الرابحة 📚", value: "$2,997", description: "+500 إعلان ناجح من كل المنصات للإلهام والتحليل." },
        { title: "قوالب الـ Creatives الجاهزة 🖼️", value: "$1,997", description: "صور وفيديوهات إعلانية جاهزة للتعديل والاستخدام." },
        { title: "Swipe File نصوص الإعلانات ✍️", value: "$997", description: "+100 نص إعلاني مجرب ومثبت للنسخ والتعديل." },
        { title: "استراتيجيات الاستهداف السرية 🎯", value: "$1,497", description: "استراتيجيات استهداف متقدمة لا يعرفها 99% من المعلنين." },
    ],
    5: [
        { title: "قائمة الموردين الذهبية 🏭", value: "$2,997", description: "أفضل 50 مورد موثوق مع أرقام التواصل المباشر." },
        { title: "قوالب التفاوض مع الموردين 🤝", value: "$997", description: "رسائل جاهزة للحصول على أفضل الأسعار والشروط." },
        { title: "نظام Quality Control 🔍", value: "$1,497", description: "Checklists كاملة لضمان جودة المنتجات قبل الشحن." },
        { title: "دليل الشحن السريع 🚀", value: "$1,997", description: "كيف تشحن منتجاتك في 3-7 أيام بدلاً من 30 يوم." },
    ],
    6: [
        { title: "عضوية مجتمع VIP 👑", value: "$4,997", description: "دخول حصري لمجتمع النخبة مع رواد أعمال يحققون 6-7 أرقام." },
        { title: "جلسات Live أسبوعية 🔴", value: "$2,997", description: "جلسات مباشرة أسبوعية للإجابة على أسئلتك ومتابعة تقدمك." },
        { title: "مراجعة متجرك الشخصية 🔎", value: "$1,997", description: "مراجعة كاملة لمتجرك مع توصيات مخصصة للتحسين." },
        { title: "مراجعة إعلاناتك الشخصية 📊", value: "$1,997", description: "تحليل حملاتك الإعلانية مع خطة تحسين مفصلة." },
        { title: "دليل بيع البزنس 💰", value: "$4,997", description: "كيف تبني بزنس قابل للبيع بـ 6-7 أرقام." },
        { title: "شبكة المؤثرين الحصرية 🤳", value: "$2,997", description: "قائمة +100 مؤثر موثوق جاهزين للتعاون معك." },
        { title: "أدوات Premium مجانية 🛠️", value: "$1,997", description: "وصول مجاني لأدوات مدفوعة بقيمة آلاف الدولارات." },
        { title: "تحديثات مدى الحياة ♾️", value: "$9,997", description: "كل المراحل والأدوات المستقبلية تضاف لك مجاناً وتلقائياً." },
    ],
};

export default function Bonus() {
    return (
        <section className="py-20 bg-gradient-to-b from-[#030712] to-[#f4f6f8]" dir="rtl">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] p-[1px] rounded-full mb-6">
                        <div className="bg-white px-6 py-2 rounded-full">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] font-bold">
                                قيمة إجمالية $148,900
                            </span>
                        </div>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold font-cairo mb-4">
                        28 <span className="text-[#ffd700]">هدية حصرية</span> مجانية
                    </h2>
                    <p className="text-gray-500">أدوات وموارد لا تقدر بثمن لضمان نجاحك</p>
                </div>

                <div className="space-y-16">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.id}>
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: cat.color }}>
                                <Gift size={24} />
                                {cat.title}
                                <span className="text-sm bg-gray-50 px-2 py-0.5 rounded text-gray-500">{cat.count} هدايا</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {ALL_BONUSES[cat.id]?.map((bonus, i) => (
                                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-200 transition-colors group">
                                        <div className="aspect-video bg-gray-100/40 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                                            <Gift className="text-white/10 w-12 h-12 group-hover:scale-110 transition-transform" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute bottom-2 right-2 text-xs font-bold text-[#ffd700]">{bonus.value}</div>
                                        </div>
                                        <h4 className="font-bold mb-2 text-sm md:text-base">{bonus.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-2">{bonus.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
