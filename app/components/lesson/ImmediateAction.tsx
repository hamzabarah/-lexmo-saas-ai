'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, Rocket } from 'lucide-react';

interface ImmediateActionProps {
    lessonId: string;
    items: string[];
    title?: string;
}

export default function ImmediateAction({
    lessonId,
    items,
    title = "🚀 الإجراءات الفورية"
}: ImmediateActionProps) {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [isComplete, setIsComplete] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`lesson_${lessonId}_actions`);
        if (saved) {
            setCheckedItems(JSON.parse(saved));
        }
    }, [lessonId]);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem(`lesson_${lessonId}_actions`, JSON.stringify(checkedItems));

        // Check if all complete
        const allComplete = items.every((_, index) => checkedItems[index.toString()]);
        setIsComplete(allComplete);
    }, [checkedItems, items, lessonId]);

    const toggleItem = (index: number) => {
        setCheckedItems(prev => ({
            ...prev,
            [index.toString()]: !prev[index.toString()]
        }));
    };

    const completedCount = Object.values(checkedItems).filter(Boolean).length;
    const progress = (completedCount / items.length) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="my-12"
        >
            <div className="bg-gradient-to-br from-neo-cyan/10 to-neo-violet/5 border-2 border-neo-cyan/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-3xl">{title.split(' ')[0]}</span>
                        <span className="bg-gradient-neo bg-clip-text text-transparent">
                            {title.split(' ').slice(1).join(' ')}
                        </span>
                    </h3>

                    {isComplete && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
                        >
                            <Check size={16} />
                            مكتمل!
                        </motion.div>
                    )}
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-neo-gray-300">التقدم</span>
                        <span className="text-neo-cyan font-mono">{completedCount}/{items.length}</span>
                    </div>
                    <div className="h-2 bg-neo-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-neo"
                        />
                    </div>
                </div>

                {/* Checklist */}
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${checkedItems[index.toString()]
                                    ? 'bg-neo-cyan/5 border border-neo-cyan/20'
                                    : 'bg-neo-gray-900/50 border border-neo-gray-800 hover:border-neo-cyan/20'
                                }`}
                        >
                            <Checkbox.Root
                                checked={checkedItems[index.toString()] || false}
                                onCheckedChange={() => toggleItem(index)}
                                className="w-6 h-6 rounded-lg border-2 border-neo-cyan flex items-center justify-center bg-neo-black hover:bg-neo-cyan/10 transition-colors cursor-pointer flex-shrink-0 mt-0.5"
                                id={`action-${lessonId}-${index}`}
                            >
                                <Checkbox.Indicator className="text-neo-cyan">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                        <Check size={16} strokeWidth={3} />
                                    </motion.div>
                                </Checkbox.Indicator>
                            </Checkbox.Root>

                            <label
                                htmlFor={`action-${lessonId}-${index}`}
                                className={`flex-1 text-lg cursor-pointer transition-all ${checkedItems[index.toString()]
                                        ? 'text-neo-gray-400 line-through'
                                        : 'text-white hover:text-neo-cyan'
                                    }`}
                            >
                                {item}
                            </label>
                        </motion.div>
                    ))}
                </div>

                {/* Decorative */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-neo-cyan/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-neo-violet/10 rounded-full blur-3xl pointer-events-none" />
            </div>
        </motion.div>
    );
}
