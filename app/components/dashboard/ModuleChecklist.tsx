'use client';

import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { toggleTask } from '@/app/actions/course';
import { useRouter } from 'next/navigation';

type Task = {
    id: string;
    task_text_ar: string;
    is_completed: boolean;
};

export default function ModuleChecklist({
    tasks,
    moduleId
}: {
    tasks: Task[],
    moduleId: string
}) {
    const [optimisticTasks, setOptimisticTasks] = useState(tasks);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const completedCount = optimisticTasks.filter(t => t.is_completed).length;
    const progress = Math.round((completedCount / optimisticTasks.length) * 100) || 0;

    const handleToggle = async (taskId: string, currentStatus: boolean) => {
        if (isUpdating) return;

        // 1. Optimistic Update
        const newStatus = !currentStatus;
        setOptimisticTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, is_completed: newStatus } : t
        ));

        // 2. Server Update
        try {
            const result = await toggleTask(taskId, moduleId, newStatus);
            if (result.error) {
                // Revert if error
                setOptimisticTasks(prev => prev.map(t =>
                    t.id === taskId ? { ...t, is_completed: currentStatus } : t
                ));
            } else {
                router.refresh(); // Refresh server data to stay in sync
            }
        } catch (error) {
            console.error(error);
            // Revert on crash
            setOptimisticTasks(prev => prev.map(t =>
                t.id === taskId ? { ...t, is_completed: currentStatus } : t
            ));
        }
    };

    return (
        <div className="bg-white border border-[#E8E0D4] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#1A1A2E]">
                    ✅ المهام المطلوبة
                </h3>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm text-[#64607A]">التقدم</span>
                        <span className="text-lg font-bold text-[#C9A84C]">{progress}%</span>
                    </div>

                    {/* Interior Circular Progress */}
                    <div className="relative w-12 h-12">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-[#E8E0D4]"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="text-[#C9A84C] transition-all duration-500 ease-out"
                                strokeDasharray={`${progress}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {optimisticTasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => handleToggle(task.id, task.is_completed)}
                        className={`
                            flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                            ${task.is_completed
                                ? "bg-green-50 border-green-200 hover:bg-green-100"
                                : "bg-[#F5F1EB] border-[#E8E0D4] hover:border-[#C9A84C]/30 hover:bg-[#F5F1EB]/80"}
                        `}
                    >
                        <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center transition-colors
                            ${task.is_completed ? "text-green-600" : "text-[#64607A] group-hover:text-[#C9A84C]"}
                        `}>
                            {task.is_completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </div>

                        <span className={`
                            text-base flex-1 transition-colors
                            ${task.is_completed ? "text-[#64607A] line-through" : "text-[#1A1A2E]"}
                        `}>
                            {task.task_text_ar}
                        </span>
                    </div>
                ))}
            </div>

            {/* Validation Button - Only shows when 100% complete */}
            {progress === 100 && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="p-1 rounded-2xl bg-gradient-to-r from-[#C9A84C] to-[#B8860B]">
                        <button className="w-full bg-white hover:bg-[#F5F1EB] rounded-xl py-4 px-6 flex items-center justify-center gap-3 transition-all group">
                            <span className="text-xl">📅</span>
                            <span className="font-bold text-lg text-[#1A1A2E] group-hover:text-[#C9A84C] transition-colors">
                                حجز موعد المصادقة
                            </span>
                        </button>
                    </div>
                    <p className="text-center text-sm text-[#64607A] mt-2">
                        تهانينا! لقد أكملت هذه الوحدة.
                    </p>
                </div>
            )}
        </div>
    );
}
