'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface LessonObjectiveProps {
    objective: string;
}

export default function LessonObjective({ objective }: LessonObjectiveProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
        >
            <div className="bg-gradient-to-r from-[#C9A84C]/10 to-[#B8860B]/10 border border-[#C9A84C]/20 rounded-xl p-6 md:p-8 relative overflow-hidden">
                {/* Icon */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#C9A84C]/20 rounded-lg flex items-center justify-center">
                        <Target className="text-[#C9A84C]" size={24} />
                    </div>

                    <div className="flex-1">
                        {/* Label */}
                        <h3 className="text-[#C9A84C] font-bold text-lg mb-3 flex items-center gap-2">
                            🎯 هدف الدرس
                        </h3>

                        {/* Objective Text */}
                        <p className="text-[#1A1A2E] text-lg leading-relaxed font-ar">
                            {objective}
                        </p>
                    </div>
                </div>

                {/* Decorative gradient */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C9A84C]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#B8860B]/10 rounded-full blur-3xl" />
            </div>
        </motion.div>
    );
}
