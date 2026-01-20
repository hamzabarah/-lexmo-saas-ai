"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Circle, PlayCircle, Lock, Menu } from "lucide-react";
import { toggleTask, type LessonDetails } from "@/app/actions/course";
import { cn } from "@/utils/cn"; // Assuming utility exists, or I will use inline template literals

// Helper for simple class merging if utility is missing
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface LessonViewProps {
    lesson: LessonDetails;
    phaseId: number;
    unitId: number;
    nextLessonId?: number;
    prevLessonId?: number;
}

export default function LessonView({ lesson, phaseId, unitId, nextLessonId, prevLessonId }: LessonViewProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [tasks, setTasks] = useState(lesson.tasks);

    // Calculate Progress
    const completedTasks = tasks.filter(t => t.is_completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const isLessonCompleted = progress === 100;

    const handleToggleTask = (taskId: string, currentStatus: boolean) => {
        // Optimistic Update
        const newStatus = !currentStatus;
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_completed: newStatus } : t));

        startTransition(async () => {
            await toggleTask(taskId, lesson.id, newStatus);
            router.refresh(); // Refresh to update server state/progress elsewhere
        });
    };

    // Custom Content Renderer
    const renderContent = (content: string) => {
        // Split content by sections based on our specialized "【 】" headers or standard headers
        // This is a simple regex parser for the requested formats.

        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];

        let currentList: React.ReactNode[] = [];
        let inTable = false;
        let tableRows: string[][] = [];

        lines.forEach((line, index) => {
            const trimmed = line.trim();

            // 1. Special Boxes (Cyan, Orange, Green)
            if (trimmed.startsWith('### 【') || trimmed.startsWith('【')) {
                const title = trimmed.replace(/### |【|】/g, '').trim();
                let boxColor = "border-gray-700 bg-gray-800/50"; // Default
                let icon = "📝";
                let textColor = "text-white";

                if (title.includes("نصيحة") || title.includes("Tip")) {
                    boxColor = "border-[#00d2ff]/30 bg-[#00d2ff]/5";
                    textColor = "text-[#00d2ff]";
                    icon = "💡";
                } else if (title.includes("خطأ") || title.includes("تحذير") || title.includes("Warning")) {
                    boxColor = "border-orange-500/30 bg-orange-500/5";
                    textColor = "text-orange-500";
                    icon = "⚠️";
                } else if (title.includes("مثال") || title.includes("Example")) {
                    boxColor = "border-green-500/30 bg-green-500/5";
                    textColor = "text-green-500";
                    icon = "📖";
                } else if (title.includes("أرقام") || title.includes("Stats")) {
                    boxColor = "border-purple-500/30 bg-purple-500/5";
                    textColor = "text-purple-500";
                    icon = "📊";
                } else if (title.includes("هدف") || title.includes("Goal")) {
                    boxColor = "border-blue-500/30 bg-blue-500/5 text-center"; // Centered goal
                    textColor = "text-blue-400";
                    icon = "🎯";
                } else if (title.includes("النتيجة") || title.includes("Result")) {
                    boxColor = "border-emerald-500/30 bg-emerald-500/5";
                    textColor = "text-emerald-400";
                    icon = "🎯"; // Or trophy 🏆
                }

                elements.push(
                    <div key={index} className={`my-6 p-4 rounded-xl border ${boxColor}`}>
                        <h4 className={`font-bold text-lg mb-2 flex items-center gap-2 ${textColor}`}>
                            <span>{icon}</span> {title}
                        </h4>
                    </div>
                );
                return;
            }

            // 2. Standard Headers
            if (trimmed.startsWith('## ')) {
                elements.push(<h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">{trimmed.replace('## ', '')}</h2>);
                return;
            }
            if (trimmed.startsWith('### ')) {
                elements.push(<h3 key={index} className="text-xl font-bold text-[#00d2ff] mt-6 mb-3">{trimmed.replace('### ', '')}</h3>);
                return;
            }

            // 3. Lists
            if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                elements.push(
                    <li key={index} className="ml-4 list-disc text-gray-300 mb-2 pl-2 marker:text-[#00d2ff]">
                        {parseBold(trimmed.substring(2))}
                    </li>
                );
                return;
            }

            // 4. Tables (Simple detection)
            if (trimmed.startsWith('|')) {
                if (!inTable) inTable = true;
                const cols = trimmed.split('|').filter(c => c.trim() !== '').map(c => c.trim());
                if (!trimmed.includes('---')) { // Skip separator line
                    tableRows.push(cols);
                }

                // If next line is not table, render table
                const nextLine = lines[index + 1]?.trim();
                if (!nextLine || !nextLine.startsWith('|')) {
                    inTable = false;
                    elements.push(renderTable(tableRows, index));
                    tableRows = [];
                }
                return;
            }

            // 5. Default Paragraph
            if (trimmed.length > 0) {
                elements.push(<p key={index} className="text-gray-300 leading-relaxed mb-4 text-lg">{parseBold(trimmed)}</p>);
            }
        });

        return elements;
    };

    const parseBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const renderTable = (rows: string[][], key: number) => {
        if (rows.length === 0) return null;
        const headers = rows[0];
        const body = rows.slice(1);

        return (
            <div key={key} className="overflow-x-auto my-6 rounded-lg border border-gray-800">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-900">
                        <tr>
                            {headers.map((h, i) => (
                                <th key={i} className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                        {body.map((row, i) => (
                            <tr key={i}>
                                {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* HEADER */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-400 font-mono">
                    <Link href={`/dashboard/phases/${phaseId}`} className="hover:text-[#00d2ff] transition-colors border-b border-transparent hover:border-[#00d2ff]">
                        Phase {phaseId}
                    </Link>
                    <span>/</span>
                    <Link href={`/dashboard/phases/${phaseId}/units/${unitId}`} className="hover:text-[#00d2ff] transition-colors border-b border-transparent hover:border-[#00d2ff]">
                        Unit {unitId}
                    </Link>
                    <span>/</span>
                    <span className="text-white">Lesson {lesson.module_number}</span>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">{lesson.title_ar}</h1>

                <div className="flex gap-4">
                    <span className="px-3 py-1 rounded bg-gray-800 text-gray-300 text-xs flex items-center gap-1">⏱️ 5 دقائق</span>
                    <span className="px-3 py-1 rounded bg-gray-800 text-gray-300 text-xs flex items-center gap-1">📊 سهل</span>
                    {lesson.is_locked && <span className="px-3 py-1 rounded bg-red-900/20 text-red-500 text-xs flex items-center gap-1">🔒 Locked</span>}
                </div>
            </div>

            {/* CONTENT CARD */}
            <div className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2ff]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10" dir="rtl">
                    {(() => {
                        // Split content to inject Tasks between Content and Result if "Result" exists
                        const resultSplitParams = ["### 【🎯 النتيجة】", "### 【النتيجة】", "【🎯 النتيجة】"];
                        let mainContent = lesson.content_ar;
                        let resultContent = "";

                        for (const splitParam of resultSplitParams) {
                            if (lesson.content_ar.includes(splitParam)) {
                                const parts = lesson.content_ar.split(splitParam);
                                mainContent = parts[0];
                                resultContent = splitParam + parts[1]; // Keep header
                                break;
                            }
                        }

                        // If no split (Result not found), render everything in main content
                        // But if we found it, we render Main -> Tasks -> Result

                        if (!resultContent) {
                            return (
                                <>
                                    {renderContent(lesson.content_ar)}
                                    {/* TASKS INSIDE CONTENT CARD? NO, USER WANTS SEPERATE BOXES */}
                                </>
                            );
                        }

                        return (
                            <>
                                {renderContent(mainContent)}
                            </>
                        );
                    })()}
                </div>
            </div>

            {/* TASKS (Now positioned between sections if following strict flow, or kept separate? User visual shows separated boxes) */}
            {/* The user art shows separate boxes for Content, Tasks, Result. */}
            {/* My previous design had one big Content Card, then a Tasks Card. */}
            {/* If I want Tasks BETWEEN Content and Result, I should probably render Result in its OWN card below Tasks. */}

            <div className="mt-8 bg-gray-900/30 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-[#00d2ff]" /> مهام الدرس
                </h3>

                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            onClick={() => handleToggleTask(task.id, task.is_completed)}
                            className={`
                        flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border
                        ${task.is_completed
                                    ? "bg-green-500/10 border-green-500/20"
                                    : "bg-gray-800/50 border-white/5 hover:bg-gray-800"
                                }
                    `}
                        >
                            <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors
                        ${task.is_completed
                                    ? "bg-green-500 border-green-500 text-black"
                                    : "border-gray-500 text-transparent"
                                }
                    `}>
                                {task.is_completed && <CheckCircle2 size={16} />}
                            </div>
                            <span className={`text-lg transition-colors ${task.is_completed ? "text-green-500 line-through" : "text-gray-200"}`}>
                                {task.task_text_ar}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* RESULT SECTION (Rendered Here if it exists) */}
            {(() => {
                const resultSplitParams = ["### 【🎯 النتيجة】", "### 【النتيجة】", "【🎯 النتيجة】"];
                let resultContent = "";

                for (const splitParam of resultSplitParams) {
                    if (lesson.content_ar.includes(splitParam)) {
                        const parts = lesson.content_ar.split(splitParam);
                        resultContent = splitParam + parts[1];
                        break;
                    }
                }

                if (resultContent) {
                    return (
                        <div className="mt-8 bg-[#0a0a0f] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                            {/* Green Glow for Result */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10" dir="rtl">
                                {renderContent(resultContent)}
                            </div>
                        </div>
                    );
                }
                return null;
            })()}

            {/* FOOTER / NAV */}
            <div className="mt-8 flex items-center justify-between">
                {prevLessonId ? (
                    <button
                        onClick={() => router.push(`/dashboard/phases/${phaseId}/units/${unitId}/lessons/${prevLessonId}`)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <ArrowRight size={20} />
                        <span>الدرس السابق</span>
                    </button>
                ) : <div />}

                <div className="flex gap-4">
                    <button
                        disabled={!isLessonCompleted}
                        className={`
                        px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all
                        ${isLessonCompleted
                                ? "bg-green-500 hover:bg-green-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed"
                            }
                    `}
                    >
                        {isLessonCompleted ? "✅ أكملت هذا الدرس" : "أكمل المهام أولاً"}
                    </button>

                    {nextLessonId && (
                        <button
                            onClick={() => router.push(`/dashboard/phases/${phaseId}/units/${unitId}/lessons/${nextLessonId}`)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isLessonCompleted ? "text-white hover:bg-white/5" : "text-gray-600"}`}
                        >
                            <span>الدرس التالي</span>
                            <ArrowLeft size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
