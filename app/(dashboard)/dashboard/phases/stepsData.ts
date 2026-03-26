export type Lesson = {
    id: number;
    title: string;
    type: 'video' | 'quiz' | 'pdf';
    videoUrl?: string;
    duration?: string;
    content?: string;
};

export type Chapter = {
    title: string;
    lessons: Lesson[];
};

export type StepContent = {
    stepNumber: number;
    title: string;
    chapters: Chapter[];
};

function youtubeEmbed(watchUrl: string): string {
    const id = watchUrl.split('v=')[1]?.split('&')[0];
    return `https://www.youtube-nocookie.com/embed/${id}`;
}

export const stepsContent: StepContent[] = [
    {
        stepNumber: 1,
        title: "🔑 الأساسيات",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "مثال تطبيقي على منتج مربح", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=duDBVkOH5tA"), duration: "7m" },
                    { id: 2, title: "سر التفوق على المنافسين", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=Q91j0_g49eg"), duration: "6m" },
                    { id: 3, title: "خصائص المنتج المربح", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=bqtACli_1G0"), duration: "7m" },
                    { id: 4, title: "أسرار اختيار المنتجات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=ZhNkItrWEe8"), duration: "4m" },
                ],
            },
            {
                title: "اختبار المرحلة 1",
                lessons: [
                    { id: 5, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 2,
        title: "🔍 الأسلحة السرية",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "كيفية العثور على المنتجات بالأداة رقم 1", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=QR9carfShpU"), duration: "4m" },
                    { id: 2, title: "البحث بالطريقة المجانية", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=Luujh8TMg9A"), duration: "10m" },
                    { id: 3, title: "البحث بمكتبة الإعلانات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=-pRX91ZwzmY"), duration: "16m" },
                    { id: 4, title: "أفضل 10 أدوات لتحليل الإعلانات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=9OO9E61hXpI"), duration: "4m" },
                ],
            },
            {
                title: "اختبار المرحلة 2",
                lessons: [
                    { id: 5, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 3,
        title: "🌍 اصطاد المنتج الرابح",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "البحث في المغرب", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=eCQIITXn-T0"), duration: "14m" },
                    { id: 2, title: "البحث في السعودية", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=Aj8UhRSIWYQ"), duration: "6m" },
                    { id: 3, title: "البحث في أمريكا", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=-pRX91ZwzmY"), duration: "16m" },
                    { id: 4, title: "البحث من الموردين", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=6QJULCc2GCE"), duration: "22m" },
                    { id: 5, title: "منتجات التجميل من الموردين", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=Jt6QcXH_Hqo"), duration: "6m" },
                ],
            },
            {
                title: "اختبار المرحلة 3",
                lessons: [
                    { id: 6, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 4,
        title: "🕵️ اسرق أسرار المنافسين",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "اكتشف أسرار المتاجر بأداة مجانية", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=waaDuj7kvY4"), duration: "12m" },
                    { id: 2, title: "فكر مثل أكبر رواد التجارة الإلكترونية", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=eUDfPNs6OIg"), duration: "4m" },
                    { id: 3, title: "أفضل 10 أدوات لتحليل الإعلانات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=9OO9E61hXpI"), duration: "4m" },
                ],
            },
            {
                title: "اختبار المرحلة 4",
                lessons: [
                    { id: 4, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 5,
        title: "🎯 القرار النهائي",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "الدليل الكامل للبحث عن المنتج الرابح", type: "pdf", content: "phase5_product_research" },
                ],
            },
        ],
    },
    {
        stepNumber: 6,
        title: "🚀 أول خطوة",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "مقدمة قبل إنشاء المتجر", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=yqC11TsUpNQ") },
                    { id: 2, title: "الخطوة الأولى لفتح متجر إلكتروني", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=v1VFYOpLfjQ") },
                    { id: 3, title: "اختيار الباقة المناسبة", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=pATmUmDsfDY") },
                    { id: 4, title: "شراء اسم النطاق", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=GS26vrjiaR4") },
                ],
            },
            {
                title: "اختبار المرحلة 6",
                lessons: [
                    { id: 5, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 7,
        title: "🎨 صمم متجر احترافي",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "كيف تختار أفضل قالب مجاني", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=Qcr4jlT7_h8") },
                    { id: 2, title: "تصميم شعار المتجر بالذكاء الاصطناعي", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=4Z6zY0kusc8") },
                    { id: 3, title: "متجر المنتج الواحد", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=HNS9gJPYLXs") },
                    { id: 4, title: "متجر المنتجات العامة", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=1WZyxvAd97c") },
                    { id: 5, title: "متجر النيتش", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=MBz5fUDy_ys") },
                ],
            },
            {
                title: "اختبار المرحلة 7",
                lessons: [
                    { id: 6, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 8,
        title: "⚙️ إعدادات المتجر",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "إعدادات معلومات العملاء", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=pKeyjL5gw7I") },
                    { id: 2, title: "طرق الدفع", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=carEXyV5Oss") },
                    { id: 3, title: "مناطق الشحن", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=EMCYpYrIoZc") },
                    { id: 4, title: "الضرائب والرسوم", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=3u9y9oZwKmw") },
                    { id: 5, title: "المستخدمون والصلاحيات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=TTiXnc5d-os") },
                    { id: 6, title: "الإشعارات واللغات والإعدادات المتقدمة", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=upU_d2ieXfU") },
                ],
            },
            {
                title: "اختبار المرحلة 8",
                lessons: [
                    { id: 7, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 9,
        title: "📄 الصفحات القانونية",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "إضافة سياسات المتجر", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=5P2tawLfM5U") },
                    { id: 2, title: "إنشاء صفحة About Us", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=rjQZDGbDsb8") },
                    { id: 3, title: "إنشاء صفحة Contact Us", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=tWccJUfyInw") },
                ],
            },
            {
                title: "اختبار المرحلة 9",
                lessons: [
                    { id: 4, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 10,
        title: "📦 الخطوات الأخيرة",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "إضافة Locations", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=sbPaPim_Ylg") },
                    { id: 2, title: "تتبع الطلبات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=teN0CQPeOQs") },
                ],
            },
            {
                title: "اختبار المرحلة 10",
                lessons: [
                    { id: 3, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 11,
        title: "🛍️ دليل شوبيفاي الكامل",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "دليل شوبيفاي الكامل", type: "pdf", content: "phase11_shopify_guide" },
                ],
            },
        ],
    },
    {
        stepNumber: 12,
        title: "🛒 استيراد المنتج",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "من علي إكسبريس إلى متجرك", type: "pdf", content: "phase12_import_product" },
                ],
            },
            {
                title: "اختبار المرحلة 12",
                lessons: [
                    { id: 2, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 13,
        title: "🎨 تعديل المتجر",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "الدليل الكامل — تعديل المتجر وتصميم الصور", type: "pdf", content: "phase13_store_design" },
                ],
            },
            {
                title: "اختبار المرحلة 13",
                lessons: [
                    { id: 2, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 14,
        title: "🔌 التطبيقات الأساسية",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "التطبيقات الأساسية", type: "pdf", content: "phase14_essential_apps" },
                ],
            },
            {
                title: "اختبار المرحلة 14",
                lessons: [
                    { id: 2, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 15,
        title: "📘 مقدمة فيسبوك أدس",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "مقدمة عن إعلانات فيسبوك", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=s0Hlrw1GCeg") },
                    { id: 2, title: "ما هو مدير الأعمال", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=qgMbMV93KVg") },
                    { id: 3, title: "الفرق بين الحملة والمجموعة والإعلان", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=N1NC1ZkxYMw") },
                    { id: 4, title: "الفرق بين الحساب الشخصي والصفحات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=cwYsvWHQcIg") },
                ],
            },
            {
                title: "اختبار المرحلة 15",
                lessons: [
                    { id: 5, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 16,
        title: "🔧 إنشاء الحسابات",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "إنشاء حساب فيسبوك في دقيقتين", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=sER34ms5sZ0") },
                    { id: 2, title: "إنشاء صفحة فيسبوك احترافية", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=pzpRCHw5EN0") },
                    { id: 3, title: "إنشاء مدير الأعمال", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=WulvNBhzj_o") },
                    { id: 4, title: "فتح حساب إعلاني", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=b8YWV2NpOZk") },
                    { id: 5, title: "شرح نظري لحساب الإعلانات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=9SNq-H-o8Xs") },
                ],
            },
            {
                title: "اختبار المرحلة 16",
                lessons: [
                    { id: 6, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 17,
        title: "🎯 أهداف الحملات",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "ما هو هدف التوعية", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=NmnXLM5QkRg") },
                    { id: 2, title: "ما هو هدف الزيارات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=M4WW2KiE8Ok") },
                    { id: 3, title: "ما هو هدف التفاعل", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=O2HB5XtTwRc") },
                    { id: 4, title: "ما هو هدف العملاء المحتملين", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=qoCyjLzgJFE") },
                    { id: 5, title: "ما هو هدف المبيعات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=I4xrCsdqOnM") },
                    { id: 6, title: "ما هو هدف ترويج التطبيقات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=kcHLo8TnQtk") },
                    { id: 7, title: "الوجهة وكيفية اختيارها", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=YY0fI1hWMxA") },
                    { id: 8, title: "نوع الشراء وكيف يعمل", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=6tFcxnLj9_A") },
                    { id: 9, title: "نظام المزاد", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=2Ka_aNwe0Ps") },
                ],
            },
            {
                title: "اختبار المرحلة 17",
                lessons: [
                    { id: 10, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 18,
        title: "👥 استهداف الجمهور",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "استهداف الجمهور حسب الجنس", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=POycDeC8hcI") },
                    { id: 2, title: "اختيار الفئة العمرية المناسبة", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=lzUR65ebsPk") },
                    { id: 3, title: "تحديد الموقع الجغرافي", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=m18N05fGVxU") },
                    { id: 4, title: "استهداف اللغة", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=prqLNanKF9Q") },
                    { id: 5, title: "الاستهداف بالاهتمامات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=mIDaRRBMNLo") },
                    { id: 6, title: "استهداف العملاء حسب السلوك", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=kNIGx7YM33k") },
                    { id: 7, title: "الاستهداف بالتركيبة السكانية", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=yRgrsIACeZA") },
                    { id: 8, title: "تصنيفات الإعلانات الخاصة", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=9_4ryRSBz38") },
                ],
            },
            {
                title: "اختبار المرحلة 18",
                lessons: [
                    { id: 9, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 19,
        title: "⚙️ إعدادات الحملة",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "اختيار تنسيق الإعلان", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=-3uUWzgrRnc") },
                    { id: 2, title: "أفضل أماكن عرض الإعلانات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=QlTr2JnsIqE") },
                    { id: 3, title: "إعداد اللغات والترجمة", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=kSWaSB3mtvs") },
                    { id: 4, title: "طريقة الدفع", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=fT5xtCzQyj8") },
                    { id: 5, title: "حماية العلامة التجارية", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=0e300Z42g2I") },
                    { id: 6, title: "الميزانية وجدولة الإعلانات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=P39PbIfyGqg") },
                    { id: 7, title: "تتبع الأحداث", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=V4j_z6Y6kSo") },
                ],
            },
            {
                title: "اختبار المرحلة 19",
                lessons: [
                    { id: 8, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 20,
        title: "🎨 إنشاء الإعلان",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "صناعة إعلان ناجح", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=rb1X_95orYc") },
                    { id: 2, title: "كتابة إعلان جذاب", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=jIplBnTwtAo") },
                    { id: 3, title: "إنشاء وتحرير الإعلانات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=EH5_mQpXMko") },
                ],
            },
            {
                title: "اختبار المرحلة 20",
                lessons: [
                    { id: 4, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 21,
        title: "📊 التحسين والتحليل",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "اختيار مكان التحويل الجزء 1", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=kHkmK82vbgY") },
                    { id: 2, title: "اختيار مكان التحويل الجزء 2", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=-40nXLx26h4") },
                    { id: 3, title: "اختيار مكان التحويل الجزء 3", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=EnSqxyiXS84") },
                    { id: 4, title: "اختيار مكان التحويل الجزء 4", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=fxQmctfq9WU") },
                    { id: 5, title: "اختبار الإعلانات", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=HDhscS8QHIE") },
                ],
            },
            {
                title: "اختبار المرحلة 21",
                lessons: [
                    { id: 6, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 22,
        title: "🚀 إنشاء حملة إعلانية",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "إنشاء حملة إعلانية", type: "pdf", content: "phase22_ad_campaign" },
                ],
            },
            {
                title: "اختبار المرحلة 22",
                lessons: [
                    { id: 2, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 23,
        title: "📊 تحليل الإعلانات",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "الأرقام الأساسية", type: "pdf", content: "phase23_ad_metrics" },
                    { id: 2, title: "كيفاش تقرا لوحة التحكم", type: "pdf", content: "phase23_dashboard_reading" },
                    { id: 3, title: "تخصيص الأعمدة Customize Columns", type: "pdf", content: "phase23_customize_columns" },
                    { id: 4, title: "مؤشرات النجاح والفشل", type: "pdf", content: "phase23_success_failure" },
                    { id: 5, title: "متى تزيد الميزانية Scaling", type: "pdf", content: "phase23_scaling" },
                    { id: 6, title: "متى توقف الحملة", type: "pdf", content: "phase23_stop_campaign" },
                    { id: 7, title: "متى تعدل الحملة", type: "pdf", content: "phase23_adjust_campaign" },
                    { id: 8, title: "تحليل مسار العميل Funnel Analysis", type: "pdf", content: "phase23_funnel_analysis" },
                    { id: 9, title: "حساب الربحية الحقيقية", type: "pdf", content: "phase23_profitability" },
                    { id: 10, title: "أخطاء التحليل الشائعة", type: "pdf", content: "phase23_common_mistakes" },
                    { id: 11, title: "مثال تطبيقي كامل", type: "pdf", content: "phase23_practical_example" },
                    { id: 12, title: "Checklist التحليل اليومي", type: "pdf", content: "phase23_daily_checklist" },
                ],
            },
            {
                title: "اختبار المرحلة 23",
                lessons: [
                    { id: 13, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 24,
        title: "🎵 منصة إعلانية جديدة",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "اكتشف المنصة اللي كيتجاهلها الجميع", type: "video" },
                    { id: 2, title: "الأهداف المتوفرة وأي واحد تختار", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=dROBANpg7ow") },
                    { id: 3, title: "افتح حسابك الإعلاني في 5 دقائق", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=XQ5IsE5Weo8") },
                ],
            },
            {
                title: "اختبار المرحلة 24",
                lessons: [
                    { id: 4, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 25,
        title: "🎬 أول حملة من الصفر",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "إنشاء حملة إعلانية — المرحلة 1", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=A1GZUJO-1Wg") },
                    { id: 2, title: "إنشاء حملة إعلانية — المرحلة 2", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=mn7rfIssdpc") },
                    { id: 3, title: "إنشاء حملة إعلانية — المرحلة 3", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=PJjqGYmRg58") },
                    { id: 4, title: "إنشاء حملة إعلانية — المرحلة 4", type: "video", videoUrl: youtubeEmbed("https://www.youtube.com/watch?v=p5Cx_07Kw9Y") },
                    { id: 5, title: "صناعة فيديو إعلاني يوقف السكرول", type: "pdf" },
                    { id: 6, title: "جرب قبل ما تصرف — استراتيجيات ذكية", type: "pdf" },
                ],
            },
            {
                title: "اختبار المرحلة 25",
                lessons: [
                    { id: 7, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
    {
        stepNumber: 26,
        title: "🔎 اربح أكثر",
        chapters: [
            {
                title: "الدروس",
                lessons: [
                    { id: 1, title: "شنو هي الأرقام اللي خاصك تراقبها", type: "pdf" },
                    { id: 2, title: "كيفاش تعرف واش رابح ولا خاسر", type: "pdf" },
                    { id: 3, title: "الحملة ناجحة — دابا كبرها", type: "pdf" },
                    { id: 4, title: "الحملة فاشلة — شنو كتدير", type: "pdf" },
                    { id: 5, title: "احسب أرباحك الحقيقية", type: "pdf" },
                    { id: 6, title: "تطبيق عملي — 5 أيام يوم بيوم", type: "pdf" },
                ],
            },
            {
                title: "اختبار المرحلة 26",
                lessons: [
                    { id: 7, title: "اختبر معلوماتك", type: "quiz" },
                ],
            },
        ],
    },
];

export function getStepContent(stepNumber: number): StepContent | undefined {
    return stepsContent.find(s => s.stepNumber === stepNumber);
}
