"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { toggleTask, type LessonDetails } from "@/app/actions/course";
import {
    LessonLayout,
    LessonHeader,
    LessonObjective,
    ContentBlock,
    ImmediateAction,
    LessonFooter,
} from "@/app/components/lesson";

interface LessonViewProps {
    lesson: LessonDetails;
    phaseId: number;
    unitId: number;
    nextLessonId?: number;
    prevLessonId?: number;
}

export default function LessonView({
    lesson,
    phaseId,
    unitId,
    nextLessonId,
    prevLessonId,
}: LessonViewProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [tasks, setTasks] = useState(lesson.tasks);

    // Calculate Progress
    const completedTasks = tasks.filter((t) => t.is_completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const isLessonCompleted = progress === 100;

    const handleToggleTask = (taskId: string, currentStatus: boolean) => {
        // Optimistic Update
        const newStatus = !currentStatus;
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, is_completed: newStatus } : t))
        );

        startTransition(async () => {
            await toggleTask(taskId, lesson.id, newStatus);
            router.refresh();
        });
    };

    // Extract objective from content if it exists (first paragraph or specific format)
    const extractObjective = (content: string) => {
        const lines = content.split('\n');
        for (let i = 0; i < Math.min(5, lines.length); i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#') && line.length > 20) {
                return line;
            }
        }
        return `تعلم ${lesson.title_ar}`;
    };

    return (
        <LessonLayout>
            {/* Premium Header */}
            <LessonHeader
                title_ar={lesson.title_ar}
                title_en={lesson.title_en || ""}
                module_number={unitId}
                lesson_number={lesson.module_number}
                badge="📚"
                duration_minutes={15}
                progress={progress}
            />

            {/* Lesson Objective */}
            <LessonObjective objective={extractObjective(lesson.content_ar)} />

            {/* Main Content (Markdown) */}
            <ContentBlock content={lesson.content_ar} />

            {/* Tasks Section (Interactive) */}
            {tasks.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="my-12"
                >
                    <div className="bg-gradient-to-br from-neo-cyan/10 to-neo-violet/5 border-2 border-neo-cyan/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <CheckCircle2 className="text-neo-cyan" size={28} />
                                <span className="bg-gradient-neo bg-clip-text text-transparent">
                                    مهام الدرس
                                </span>
                            </h3>

                            <div className="bg-neo-black/50 px-4 py-2 rounded-full text-neo-cyan font-mono text-sm">
                                {completedTasks}/{totalTasks}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="h-2 bg-neo-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full bg-gradient-neo"
                                />
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="space-y-4">
                            {tasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleToggleTask(task.id, task.is_completed)}
                                    className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border ${task.is_completed
                                        ? "bg-green-500/10 border-green-500/30"
                                        : "bg-neo-gray-900/50 border-neo-gray-800 hover:border-neo-cyan/30 hover:bg-neo-gray-900"
                                        }`}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all mt-0.5 ${task.is_completed
                                            ? "bg-green-500 border-green-500 scale-110"
                                            : "border-neo-cyan bg-neo-black hover:bg-neo-cyan/10"
                                            }`}
                                    >
                                        {task.is_completed && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                            >
                                                <CheckCircle2 size={16} className="text-black" strokeWidth={3} />
                                            </motion.div>
                                        )}
                                    </div>

                                    <span
                                        className={`flex-1 text-lg transition-all ${task.is_completed
                                            ? "text-gray-400 line-through"
                                            : "text-white hover:text-neo-cyan"
                                            }`}
                                    >
                                        {task.task_text_ar}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Completion Message */}
                        {isLessonCompleted && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6 p-4 bg-green-500/20 border-2 border-green-500/50 rounded-xl text-center"
                            >
                                <p className="text-green-400 font-bold text-lg">
                                    🎉 أحسنت! لقد أكملت جميع المهام!
                                </p>
                            </motion.div>
                        )}

                        {/* Decorative */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-neo-cyan/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-neo-violet/10 rounded-full blur-3xl pointer-events-none" />
                    </div>
                </motion.div>
            )}

            {/* Footer Navigation */}
            <LessonFooter
                isLessonCompleted={isLessonCompleted}
                nextLesson={
                    nextLessonId
                        ? {
                            url: `/dashboard/phases/${phaseId}/units/${unitId}/lessons/${nextLessonId}`,
                            title: `الدرس ${nextLessonId}`,
                        }
                        : undefined
                }
            />
        </LessonLayout>
    );
}
