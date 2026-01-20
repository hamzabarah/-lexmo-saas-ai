"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center pt-20 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9d50bb]/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center mb-12">
                {/* Text Content */}
                <div className="text-center lg:text-right space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md mb-4"
                    >
                        <div className="flex -space-x-2 space-x-reverse">
                            <img src="/images/chaima.jpg" alt="Student" className="w-8 h-8 rounded-full border-2 border-[#030712] object-cover" />
                            <img src="/images/dounia.jpg" alt="Student" className="w-8 h-8 rounded-full border-2 border-[#030712] object-cover" />
                            <img src="/images/mohamed.jpg" alt="Student" className="w-8 h-8 rounded-full border-2 border-[#030712] object-cover" />
                        </div>
                        <span dir="ltr" className="text-sm text-gray-300 mr-2 font-cairo">Trusted by +10,000 Students</span>
                    </motion.div>

                    <h1 className="text-5xl lg:text-7xl font-bold font-cairo leading-tight">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
                        >
                            إبدأ مع النظام رقم 1 عالمياً في
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="block text-[#00d2ff] text-glow"
                        >
                            التجارة الإلكترونية
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                    >
                        وحقق استقلالك المالي مثل الآلاف غيرك باتباع منهجية Lexmo الجديدة
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                        <div className="flex flex-col items-center lg:items-start gap-2">
                            <button className="bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(0,210,255,0.6)] transition-all transform hover:scale-105 active:scale-95 duration-300">
                                🚀 ابدأ رحلة النجاح الآن
                            </button>
                            <span className="text-sm text-gray-400 animate-pulse">⚡ انضم إلى نخبة رواد الأعمال اليوم</span>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="relative"
                >
                    <div className="relative w-full aspect-square max-w-md mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00d2ff] to-[#9d50bb] rounded-3xl opacity-20 blur-3xl transform rotate-6 animate-pulse"></div>
                        <div className="relative w-full h-full bg-[#0f172a] border border-white/10 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-sm">
                            <img src="/images/mokup.jpg" alt="Dashboard Mockup" className="w-full h-full object-cover rounded-3xl" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Marquee Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="w-full border-t border-white/5 bg-white/[0.02] py-6"
            >
                <Marquee gradient={false} speed={40}>
                    {["SHOPIFY", "META ADS", "TIKTOK", "SNAPCHAT", "GOOGLE ADS", "STRIPE", "YOUCAN"].map((tech, i) => (
                        <span key={i} className="mx-12 text-gray-600 font-orbitron font-bold text-xl opacity-50 hover:opacity-100 transition-opacity cursor-default">
                            {tech}
                        </span>
                    ))}
                </Marquee>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 10 }}
                transition={{ delay: 2, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500"
            >
                <ArrowDown size={32} />
            </motion.div>
        </section>
    );
}
