'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface KeyTakeawaysProps {
    points: string[];
}

export default function KeyTakeaways({ points }: KeyTakeawaysProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="my-12"
        >
            <div className="bg-gradient-to-br from-neo-violet/10 to-neo-cyan/5 border border-neo-violet/30 rounded-2xl p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-neo-violet/20 rounded-lg flex items-center justify-center">
                        <Lightbulb className="text-neo-violet" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                        💡 النقاط الأساسية
                    </h3>
                </div>

                {/* Points */}
                <div className="grid gap-4">
                    {points.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-5 bg-neo-black/40 rounded-xl border border-neo-violet/20 hover:border-neo-violet/40 transition-colors group"
                        >
                            <div className="flex-shrink-0 w-8 h-8 bg-neo-violet/20 rounded-full flex items-center justify-center text-neo-violet font-bold text-sm group-hover:scale-110 transition-transform">
                                {index + 1}
                            </div>
                            <p className="flex-1 text-white/90 text-lg leading-relaxed font-ar">
                                {point}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
