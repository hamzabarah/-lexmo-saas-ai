'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

interface LessonFooterProps {
    nextLesson?: {
        url: string;
        title: string;
    };
    onComplete?: () => void;
    isLessonCompleted?: boolean;
}

export default function LessonFooter({ nextLesson, onComplete, isLessonCompleted = false }: LessonFooterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 pt-8 border-t border-[#E8E0D4]"
        >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Complete Button */}
                {onComplete && (
                    <button
                        onClick={onComplete}
                        className="group flex items-center gap-3 px-8 py-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-xl transition-all duration-300 text-green-600 hover:text-green-700 font-semibold"
                    >
                        <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                        <span>إكمال الدرس</span>
                    </button>
                )}

                {/* Next Lesson - Conditional on Completion */}
                {nextLesson && (
                    isLessonCompleted ? (
                        <Link
                            href={nextLesson.url}
                            className="group flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-[#C9A84C] to-[#B8860B] hover:shadow-lg hover:shadow-[#C9A84C]/20 rounded-xl transition-all duration-300 text-white font-semibold hover:scale-105"
                        >
                            <span>الدرس التالي: {nextLesson.title}</span>
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform rotate-180" />
                        </Link>
                    ) : (
                        <div className="group flex items-center gap-4 px-8 py-4 bg-[#F5F1EB] border-2 border-[#E8E0D4] rounded-xl cursor-not-allowed opacity-60">
                            <Lock size={20} className="text-[#64607A]" />
                            <div className="flex flex-col items-start">
                                <span className="text-[#64607A] font-semibold">الدرس التالي مقفل</span>
                                <span className="text-xs text-[#9B9AAF]">أكمل المهام أولاً</span>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Back to Unit */}
            <div className="mt-8 text-center">
                <Link
                    href="../"
                    className="inline-flex items-center gap-2 text-[#64607A] hover:text-[#C9A84C] transition-colors text-sm"
                >
                    <ArrowLeft size={16} className="rotate-180" />
                    <span>العودة إلى الوحدة</span>
                </Link>
            </div>
        </motion.div>
    );
}
