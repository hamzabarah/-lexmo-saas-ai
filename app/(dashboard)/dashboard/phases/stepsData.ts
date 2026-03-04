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
];

export function getStepContent(stepNumber: number): StepContent | undefined {
    return stepsContent.find(s => s.stepNumber === stepNumber);
}
