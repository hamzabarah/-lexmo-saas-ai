import {
    LessonLayout,
    LessonHeader,
    LessonObjective,
    ContentBlock,
    ImmediateAction,
    KeyTakeaways,
    PracticalExample,
    LessonFooter,
} from '@/app/components/lesson';

// Example lesson data
const sampleLesson = {
    id: 'lesson-1',
    title_ar: 'أنت لست بائعاً، أنت سفير 2.0',
    title_en: "You're Not a Seller, You're an Ambassador 2.0",
    module_number: 1,
    lesson_number: 1,
    badge: '🧠 العقلية',
    duration_minutes: 30,
    objective: 'تحويل عقليتك من "البائع التقليدي" إلى "السفير الحديث" - شخص يبني الثقة والقيمة بدلاً من دفع المنتجات.',
    content: `## المقدمة

في هذا الدرس، سوف نكسر الصورة النمطية التقليدية "للبائع" ونعيد تحديد دورك كسفير حديث.

### الفرق الأساسي

| البائع التقليدي ❌ | السفير 2.0 ✅ |
|-------------------|---------------|
| يدفع المنتجات | يقدم الحلول |
| يركز على العمولة | يركز على القيمة |

### المبادئ الأساسية

**الأصالة قبل كل شيء** - كن حقيقياً في نهجك. الناس يمكنهم اكتشاف عدم الصدق.

**القيمة أولاً، المبيعات ثانياً** - وفر دائماً قيمة قبل أن تطلب البيع.

**بناء المجتمع، وليس قائمة العملاء** - أنشئ عائلة من المتابعين المخلصين.`,
};

// Action items
const actionItems = [
    'اكتب بيان مهمتك الشخصي كسفير (لماذا تفعل هذا؟)',
    'حدد 3 طرق ستوفر بها القيمة قبل طلب البيع',
    'قم بإنشاء قائمة بالقيم الأساسية التي تمثلها',
    'راجع جميع منشوراتك الأخيرة - هل تبيع أم تساعد؟',
];

// Key takeaways
const takeaways = [
    'تحول عقليتك من "البيع" إلى "المساعدة"',
    'بناء ثقة حقيقية من خلال القيمة المتسقة',
    'التركيز على العلاقات طويلة الأمد',
    'كن سفيراً حقيقياً للمنتجات التي تؤمن بها',
];

export default function SampleLessonPage() {
    return (
        <LessonLayout>
            {/* Hero Header */}
            <LessonHeader
                title_ar={sampleLesson.title_ar}
                title_en={sampleLesson.title_en}
                module_number={sampleLesson.module_number}
                lesson_number={sampleLesson.lesson_number}
                badge={sampleLesson.badge}
                duration_minutes={sampleLesson.duration_minutes}
                progress={0}
            />

            {/* Lesson Objective */}
            <LessonObjective objective={sampleLesson.objective} />

            {/* Main Content (Markdown) */}
            <ContentBlock content={sampleLesson.content} />

            {/* Practical Example */}
            <PracticalExample
                title="مثال عملي"
                content='**السيناريو**: شخص ما يسأل عن البرنامج على Instagram. البائع يقول: "اشترِ الآن!" السفير يقول: "مرحباً! سعيد بمساعدتك. ما هي أهدافك الرئيسية؟"'
                type="success"
            />

            {/* Key Takeaways */}
            <KeyTakeaways points={takeaways} />

            {/* Interactive Actions */}
            <ImmediateAction
                lessonId={sampleLesson.id}
                items={actionItems}
                title="🚀 الإجراءات الفورية"
            />

            {/* Footer Navigation */}
            <LessonFooter
                nextLesson={{
                    url: '/dashboard/phases/1/units/1/lessons/2',
                    title: 'سيكولوجية المال عبر الإنترنت',
                }}
            />
        </LessonLayout>
    );
}
