'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Target } from 'lucide-react';

interface LessonHeaderProps {
    title_ar: string;
    title_en: string;
    module_number: number;
    lesson_number: number;
    badge?: string;
    duration_minutes?: number;
    progress?: number; // 0-100
}

export default function LessonHeader({
    title_ar,
    title_en,
    module_number,
    lesson_number,
    badge,
    duration_minutes = 30,
    progress = 0,
}: LessonHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-12"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-neo opacity-5 rounded-3xl blur-3xl" />

            {/* Content */}
            <div className="relative bg-gradient-to-br from-neo-dark to-neo-black border border-white/5 rounded-2xl p-8 md:p-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-neo-gray-400 mb-6">
                    <span className="hover:text-neo-cyan transition-colors cursor-pointer">المراحل</span>
                    <ArrowRight size={14} className="rotate-180" />
                    <span className="hover:text-neo-cyan transition-colors cursor-pointer">الوحدة {module_number}</span>
                    <ArrowRight size={14} className="rotate-180" />
                    <span className="text-neo-cyan">الدرس {lesson_number}</span>
                </div>

                {/* Badge &  Metadata */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    {badge && (
                        <span className="bg-neo-cyan/10 text-neo-cyan px-4 py-1.5 rounded-full text-sm font-mono border border-neo-cyan/20">
                            {badge}
                        </span>
                    )}
                    <div className="flex items-center gap-2 text-neo-gray-400 text-sm">
                        <Clock size={16} />
                        <span>{duration_minutes} دقيقة</span>
                    </div>
                    <div className="flex items-center gap-2 text-neo-gray-400 text-sm">
                        <BookOpen size={16} />
                        <span>الدرس {lesson_number} من الوحدة {module_number}</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    <span className="bg-gradient-neo bg-clip-text text-transparent">
                        {title_ar}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-neo-gray-300 font-display tracking-wide">
                    {title_en}
                </p>

                {/* Progress Bar */}
                {progress > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-neo-gray-400">التقدم في الدرس</span>
                            <span className="text-neo-cyan font-mono">{progress}%</span>
                        </div>
                        <div className="h-2 bg-neo-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-neo"
                            />
                        </div>
                    </div>
                )}

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-neo-violet/5 rounded-full blur-2xl" />
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-neo-cyan/5 rounded-full blur-2xl" />
            </div>
        </motion.div>
    );
}
