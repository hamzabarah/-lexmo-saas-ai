export type Lesson = {
    id: number;
    title: string;
    type: 'video' | 'quiz' | 'pdf';
    videoUrl?: string;
    duration?: string;
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
                    { id: 1, title: "الدليل الكامل للبحث عن المنتج الرابح", type: "pdf" },
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
                    { id: 1, title: "دليل شوبيفاي الكامل", type: "pdf" },
                ],
            },
        ],
    },
];

export function getStepContent(stepNumber: number): StepContent | undefined {
    return stepsContent.find(s => s.stepNumber === stepNumber);
}
