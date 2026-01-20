import { getLessonDetails, getUnitDetails } from "@/app/actions/course";
import LessonView from "@/app/components/course/LessonView";

export default async function LessonPage({ params }: { params: Promise<{ id: string, unitId: string, lessonId: string }> }) {
    const { id, unitId, lessonId } = await params;
    const phaseId = parseInt(id);
    const uId = parseInt(unitId);
    const lId = parseInt(lessonId);

    // 1. Fetch current lesson
    // We need the Unit ID first to fetch the lesson, but `getLessonDetails` expects UnitId (UUID)? 
    // Wait, my `getLessonDetails` implementation uses `unitId` as string (UUID) or number?
    // Let's check `course.ts`. 
    // `getLessonDetails(unitId: string, lessonNumber: number)`
    // So I need to fetch the Unit first to get its UUID.

    // Fetch Unit details (this is cached/fast usually)
    const unit = await getUnitDetails(phaseId, uId);

    if (!unit) {
        return <div className="text-center p-10">Unit not found</div>;
    }

    const lesson = await getLessonDetails(unit.id, lId);

    if (!lesson) {
        return <div className="text-center p-10">Lesson not found</div>;
    }

    // Determine Prev/Next IDs
    // We can assume sequential IDs 1..N based on unit.lessons
    const currentIndex = unit.lessons.findIndex(l => l.module_number === lId);
    const nextLesson = unit.lessons[currentIndex + 1];
    const prevLesson = unit.lessons[currentIndex - 1];

    return (
        <LessonView
            lesson={lesson}
            phaseId={phaseId}
            unitId={uId}
            nextLessonId={nextLesson?.module_number}
            prevLessonId={prevLesson?.module_number}
        />
    );
}
