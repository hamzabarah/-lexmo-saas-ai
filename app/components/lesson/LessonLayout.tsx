'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LessonLayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean;
}

export default function LessonLayout({ children, showSidebar = false }: LessonLayoutProps) {
    return (
        <div className="min-h-screen bg-[#F5F1EB]">
            {/* Background Grid Pattern */}
            <div
                className="fixed inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle, #C9A84C 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Main Container */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    {children}
                </motion.div>
            </div>

            {/* Floating Gradients */}
            <div className="fixed top-20 right-0 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-20 left-0 w-96 h-96 bg-[#B8860B]/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
