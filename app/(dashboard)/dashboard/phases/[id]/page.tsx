"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ArrowLeft, BookOpen, Play, FileText, HelpCircle, CheckCircle2, Circle, Clock } from "lucide-react";
import { getStepContent, Lesson } from "../stepsData";

export default function StepDetailPage() {
    const params = useParams();
    const stepNumber = parseInt(params.id as string);
    const step = getStepContent(stepNumber);

    const [activeLessonIndex, setActiveLessonIndex] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

    // Flatten all lessons for navigation
    const allLessons = useMemo(() => {
        if (!step) return [];
        const lessons: { lesson: Lesson; chapterTitle: string }[] = [];
        step.chapters.forEach(ch => {
            ch.lessons.forEach(l => {
                lessons.push({ lesson: l, chapterTitle: ch.title });
            });
        });
        return lessons;
    }, [step]);

    // No content for this step
    if (!step) {
        return (
            <>
                <div className="mb-8">
                    <Link href="/dashboard/phases" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowRight size={16} />
                        <span>العودة للدروس</span>
                    </Link>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <div className="w-20 h-20 bg-[#00d2ff]/10 rounded-full flex items-center justify-center mb-6">
                        <BookOpen className="w-10 h-10 text-[#00d2ff]" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">المرحلة {stepNumber}</h1>
                    <p className="text-gray-400 text-lg">المحتوى قيد الإعداد... قريباً</p>
                </div>
            </>
        );
    }

    const activeItem = allLessons[activeLessonIndex];
    const activeLesson = activeItem?.lesson;

    const totalLessons = allLessons.length;
    const completedCount = completedLessons.size;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const toggleComplete = (key: string) => {
        setCompletedLessons(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const lessonKey = (lesson: Lesson, chapterTitle: string) => `${chapterTitle}-${lesson.id}`;

    const goNext = () => {
        if (activeLessonIndex < allLessons.length - 1) {
            setActiveLessonIndex(activeLessonIndex + 1);
        }
    };

    const goPrev = () => {
        if (activeLessonIndex > 0) {
            setActiveLessonIndex(activeLessonIndex - 1);
        }
    };

    const getLessonIcon = (type: string, isActive: boolean) => {
        if (type === 'quiz') return <HelpCircle size={18} className={isActive ? "text-[#00d2ff]" : "text-gray-500"} />;
        if (type === 'pdf') return <FileText size={18} className={isActive ? "text-[#00d2ff]" : "text-gray-500"} />;
        return <Play size={18} className={isActive ? "text-[#00d2ff]" : "text-gray-500"} />;
    };

    // Track global lesson index for sidebar
    let globalIndex = 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard/phases" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowRight size={16} />
                    <span>العودة للدروس</span>
                </Link>
            </div>

            {/* Title + Progress */}
            <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-6">
                <h1 className="text-2xl font-bold text-white mb-4">{step.title}</h1>
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-l from-[#00d2ff] to-[#0ea5e9] rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-sm text-gray-400 font-mono shrink-0">{completedCount}/{totalLessons}</span>
                </div>
            </div>

            {/* Main Content: Video + Sidebar */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Video Area (right in RTL = main content) */}
                <div className="flex-1 space-y-4">
                    {/* Video Player / Content */}
                    <div className="bg-[#0f1120] border border-white/5 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                        {activeLesson?.type === 'video' && activeLesson.videoUrl ? (
                            <div
                                className="relative w-full rounded-2xl overflow-hidden"
                                style={{ paddingBottom: '56.25%' }}
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                <iframe
                                    src={`${activeLesson.videoUrl}?rel=0&modestbranding=1&iv_load_policy=3&showinfo=0&controls=1&enablejsapi=1`}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={activeLesson.title}
                                />
                                {/* TOP-LEFT: hides channel logo + name on hover */}
                                <div
                                    className="absolute top-0 left-0 z-10"
                                    style={{ width: '70%', height: '60px', background: 'linear-gradient(to bottom, #181818 60%, transparent)' }}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                                {/* TOP-RIGHT: hides share/more buttons on hover */}
                                <div
                                    className="absolute top-0 right-0 z-10"
                                    style={{ width: '35%', height: '60px', background: 'linear-gradient(to bottom, #181818 60%, transparent)' }}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                                {/* BOTTOM-LEFT: hides "Watch on YouTube" button */}
                                <div
                                    className="absolute bottom-0 left-0 z-10"
                                    style={{ width: '240px', height: '46px', backgroundColor: '#181818' }}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                                {/* BOTTOM-RIGHT: hides YouTube logo watermark + settings */}
                                <div
                                    className="absolute bottom-0 right-0 z-10"
                                    style={{ width: '200px', height: '46px', backgroundColor: '#181818' }}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                                {/* CENTER: hides red YouTube play button when paused */}
                                <div
                                    className="absolute z-10 pointer-events-none"
                                    style={{ top: '35%', left: '30%', width: '40%', height: '30%', background: 'radial-gradient(ellipse, rgba(24,24,24,0.85) 0%, transparent 70%)' }}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                {activeLesson?.type === 'quiz' ? (
                                    <HelpCircle className="w-16 h-16 text-[#00d2ff]/30 mb-4" />
                                ) : (
                                    <FileText className="w-16 h-16 text-[#00d2ff]/30 mb-4" />
                                )}
                                <p className="text-xl text-gray-400">قريباً — سيتم الإضافة قريباً</p>
                            </div>
                        )}
                    </div>

                    {/* Lesson Title + Nav */}
                    <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">{activeLesson?.title}</h2>
                            {activeLesson?.duration && (
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <Clock size={14} />
                                    {activeLesson.duration}
                                </span>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                            <button
                                onClick={goPrev}
                                disabled={activeLessonIndex === 0}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ArrowRight size={16} />
                                <span>السابق</span>
                            </button>

                            <button
                                onClick={() => toggleComplete(lessonKey(activeLesson!, activeItem!.chapterTitle))}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-colors ${
                                    completedLessons.has(lessonKey(activeLesson!, activeItem!.chapterTitle))
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                        : "bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20 hover:bg-[#00d2ff]/20"
                                }`}
                            >
                                <CheckCircle2 size={16} />
                                <span>{completedLessons.has(lessonKey(activeLesson!, activeItem!.chapterTitle)) ? "مكتمل" : "إكمال الدرس"}</span>
                            </button>

                            <button
                                onClick={goNext}
                                disabled={activeLessonIndex === allLessons.length - 1}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span>التالي</span>
                                <ArrowLeft size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lesson Sidebar (left in RTL) */}
                <div className="lg:w-80 shrink-0">
                    <div className="bg-[#0f1120] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                            <h3 className="font-bold text-white">المحتوى</h3>
                        </div>

                        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                            {step.chapters.map((chapter, ci) => (
                                <div key={ci}>
                                    {/* Chapter Header */}
                                    <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {chapter.title}
                                        </span>
                                    </div>

                                    {/* Lessons */}
                                    {chapter.lessons.map((lesson) => {
                                        const currentGlobalIndex = globalIndex;
                                        globalIndex++;
                                        const isActive = currentGlobalIndex === activeLessonIndex;
                                        const key = lessonKey(lesson, chapter.title);
                                        const isCompleted = completedLessons.has(key);

                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setActiveLessonIndex(currentGlobalIndex)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors border-b border-white/5 last:border-b-0 ${
                                                    isActive
                                                        ? "bg-[#00d2ff]/10 border-r-2 border-r-[#00d2ff]"
                                                        : "hover:bg-white/5"
                                                }`}
                                            >
                                                {/* Checkbox */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleComplete(key); }}
                                                    className="shrink-0"
                                                >
                                                    {isCompleted ? (
                                                        <CheckCircle2 size={18} className="text-green-500" />
                                                    ) : (
                                                        <Circle size={18} className="text-gray-600" />
                                                    )}
                                                </button>

                                                {/* Icon */}
                                                {getLessonIcon(lesson.type, isActive)}

                                                {/* Title + Duration */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm truncate ${isActive ? "text-white font-bold" : isCompleted ? "text-gray-500 line-through" : "text-gray-300"}`}>
                                                        {lesson.title}
                                                    </p>
                                                </div>

                                                {lesson.duration && (
                                                    <span className="text-xs text-gray-600 shrink-0">{lesson.duration}</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
