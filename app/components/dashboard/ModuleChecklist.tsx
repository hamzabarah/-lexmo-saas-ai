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
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    ✅ المهام المطلوبة
                </h3>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-400">التقدم</span>
                        <span className="text-lg font-bold text-[#00d2ff]">{progress}%</span>
                    </div>

                    {/* Interior Circular Progress */}
                    <div className="relative w-12 h-12">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-gray-800"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="text-[#00d2ff] transition-all duration-500 ease-out"
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
                                ? "bg-green-500/5 border-green-500/20 hover:bg-green-500/10"
                                : "bg-white/5 border-white/5 hover:border-[#00d2ff]/30 hover:bg-white/[0.07]"}
                        `}
                    >
                        <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center transition-colors
                            ${task.is_completed ? "text-green-500" : "text-gray-500 group-hover:text-[#00d2ff]"}
                        `}>
                            {task.is_completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </div>

                        <span className={`
                            text-base flex-1 transition-colors
                            ${task.is_completed ? "text-gray-400 line-through" : "text-gray-200"}
                        `}>
                            {task.task_text_ar}
                        </span>
                    </div>
                ))}
            </div>

            {/* Validation Button - Only shows when 100% complete */}
            {progress === 100 && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="p-1 rounded-2xl bg-gradient-to-r from-[#00d2ff] to-cyan-600">
                        <button className="w-full bg-[#0a0a0a] hover:bg-[#151515] rounded-xl py-4 px-6 flex items-center justify-center gap-3 transition-all group">
                            <span className="text-xl">📅</span>
                            <span className="font-bold text-lg text-white group-hover:text-[#00d2ff] transition-colors">
                                حجز موعد المصادقة
                            </span>
                        </button>
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-2">
                        تهانينا! لقد أكملت هذه الوحدة.
                    </p>
                </div>
            )}
        </div>
    );
}
