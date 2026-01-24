'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface PracticalExampleProps {
    title: string;
    content: string;
    type?: 'success' | 'warning' | 'info';
}

export default function PracticalExample({
    title,
    content,
    type = 'info'
}: PracticalExampleProps) {
    const styles = {
        success: {
            gradient: 'from-green-500/10 to-green-600/5',
            border: 'border-green-500/30',
            icon: 'text-green-400',
            bg: 'bg-green-500/20'
        },
        warning: {
            gradient: 'from-yellow-500/10 to-orange-500/5',
            border: 'border-yellow-500/30',
            icon: 'text-yellow-400',
            bg: 'bg-yellow-500/20'
        },
        info: {
            gradient: 'from-neo-cyan/10 to-neo-violet/5',
            border: 'border-neo-cyan/30',
            icon: 'text-neo-cyan',
            bg: 'bg-neo-cyan/20'
        }
    };

    const style = styles[type];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="my-8"
        >
            <div className={`bg-gradient-to-br ${style.gradient} border-l-4 ${style.border} rounded-xl p-6 md:p-8 relative`}>
                {/* Quote Icon */}
                <div className={`absolute top-6 left-6 w-12 h-12 ${style.bg} rounded-lg flex items-center justify-center opacity-20`}>
                    <Quote size={24} />
                </div>

                {/* Content */}
                <div className="relative">
                    {/* Title */}
                    <h4 className={`text-xl font-bold ${style.icon} mb-4 flex items-center gap-2`}>
                        📌 {title}
                    </h4>

                    {/* Text */}
                    <p className="text-white/90 text-lg leading-relaxed font-ar pr-16">
                        {content}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
