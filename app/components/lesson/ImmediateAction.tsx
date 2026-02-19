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
            <div className="bg-gradient-to-br from-[#C9A84C]/10 to-[#B8860B]/5 border-2 border-[#C9A84C]/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-[#1A1A2E] flex items-center gap-3">
                        <span className="text-3xl">{title.split(' ')[0]}</span>
                        <span className="bg-gradient-to-r from-[#C9A84C] to-[#B8860B] bg-clip-text text-transparent">
                            {title.split(' ').slice(1).join(' ')}
                        </span>
                    </h3>

                    {isComplete && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
                        >
                            <Check size={16} />
                            مكتمل!
                        </motion.div>
                    )}
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-[#64607A]">التقدم</span>
                        <span className="text-[#C9A84C] font-mono">{completedCount}/{items.length}</span>
                    </div>
                    <div className="h-2 bg-[#E8E0D4] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-[#C9A84C] to-[#B8860B]"
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
                                ? 'bg-[#C9A84C]/5 border border-[#C9A84C]/20'
                                : 'bg-white border border-[#E8E0D4] hover:border-[#C9A84C]/20'
                                }`}
                        >
                            <Checkbox.Root
                                checked={checkedItems[index.toString()] || false}
                                onCheckedChange={() => toggleItem(index)}
                                className="w-6 h-6 rounded-lg border-2 border-[#C9A84C] flex items-center justify-center bg-white hover:bg-[#C9A84C]/10 transition-colors cursor-pointer flex-shrink-0 mt-0.5"
                                id={`action-${lessonId}-${index}`}
                            >
                                <Checkbox.Indicator className="text-[#C9A84C]">
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
                                    ? 'text-[#64607A] line-through'
                                    : 'text-[#1A1A2E] hover:text-[#C9A84C]'
                                    }`}
                            >
                                {item}
                            </label>
                        </motion.div>
                    ))}
                </div>

                {/* Decorative */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none" />
            </div>
        </motion.div>
    );
}
