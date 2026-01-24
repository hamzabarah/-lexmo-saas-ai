'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LessonFooterProps {
    nextLesson?: {
        url: string;
        title: string;
    };
    onComplete?: () => void;
}

export default function LessonFooter({ nextLesson, onComplete }: LessonFooterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 pt-8 border-t border-neo-gray-800"
        >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Complete Button */}
                {onComplete && (
                    <button
                        onClick={onComplete}
                        className="group flex items-center gap-3 px-8 py-4 bg-green-500/10 hover:bg-green-500/20 border-2 border-green-500/30 hover:border-green-500/50 rounded-xl transition-all duration-300 text-green-400 hover:text-green-300 font-semibold"
                    >
                        <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                        <span>إكمال الدرس</span>
                    </button>
                )}

                {/* Next Lesson */}
                {nextLesson && (
                    <Link
                        href={nextLesson.url}
                        className="group flex items-center gap-4 px-8 py-4 bg-gradient-neo hover:shadow-neo-lg rounded-xl transition-all duration-300 text-white font-semibold hover:scale-105"
                    >
                        <span>الدرس التالي: {nextLesson.title}</span>
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform rotate-180" />
                    </Link>
                )}
            </div>

            {/* Back to Unit */}
            <div className="mt-8 text-center">
                <Link
                    href="../"
                    className="inline-flex items-center gap-2 text-neo-gray-400 hover:text-neo-cyan transition-colors text-sm"
                >
                    <ArrowLeft size={16} className="rotate-180" />
                    <span>العودة إلى الوحدة</span>
                </Link>
            </div>
        </motion.div>
    );
}
