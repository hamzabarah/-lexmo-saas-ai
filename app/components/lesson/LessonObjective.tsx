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
            <div className="bg-gradient-to-r from-neo-cyan/10 to-neo-violet/10 border border-neo-cyan/20 rounded-xl p-6 md:p-8 relative overflow-hidden">
                {/* Icon */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-neo-cyan/20 rounded-lg flex items-center justify-center">
                        <Target className="text-neo-cyan" size={24} />
                    </div>

                    <div className="flex-1">
                        {/* Label */}
                        <h3 className="text-neo-cyan font-bold text-lg mb-3 flex items-center gap-2">
                            🎯 هدف الدرس
                        </h3>

                        {/* Objective Text */}
                        <p className="text-white/90 text-lg leading-relaxed font-ar">
                            {objective}
                        </p>
                    </div>
                </div>

                {/* Decorative gradient */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-neo-cyan/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neo-violet/10 rounded-full blur-3xl" />
            </div>
        </motion.div>
    );
}
