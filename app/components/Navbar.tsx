"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 h-20">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold font-orbitron tracking-wider">
                    <span className="text-[#00d2ff]">LEXMO</span>
                    <span className="text-[#9d50bb]">.AI</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <Link href="#content" className="hover:text-[#00d2ff] transition-colors">المحتوى</Link>
                    <Link href="#reviews" className="hover:text-[#00d2ff] transition-colors">آراء العملاء</Link>
                    <Link href="#pricing" className="hover:text-[#00d2ff] transition-colors">الأسعار</Link>
                    <Link href="#faq" className="hover:text-[#00d2ff] transition-colors">الأسئلة الشائعة</Link>
                </div>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <a
                        href="#login"
                        className="text-white px-5 py-2.5 rounded-full font-bold hover:bg-white/5 transition-all border border-white/10"
                    >
                        تسجيل الدخول
                    </a>
                    <a
                        href="#pricing"
                        className="bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] text-white px-6 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(0,210,255,0.5)] transition-all transform hover:scale-105"
                    >
                        ابدأ الآن
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 w-full glass border-b border-white/10 py-6 px-4 flex flex-col gap-4 text-center">
                    <Link href="#content" onClick={() => setIsOpen(false)} className="hover:text-[#00d2ff]">المحتوى</Link>
                    <Link href="#reviews" onClick={() => setIsOpen(false)} className="hover:text-[#00d2ff]">آراء العملاء</Link>
                    <Link href="#pricing" onClick={() => setIsOpen(false)} className="hover:text-[#00d2ff]">الأسعار</Link>
                    <Link href="#faq" onClick={() => setIsOpen(false)} className="hover:text-[#00d2ff]">الأسئلة الشائعة</Link>
                    <a
                        href="#login"
                        onClick={() => setIsOpen(false)}
                        className="border border-white/10 text-white px-6 py-3 rounded-full font-bold mt-2"
                    >
                        تسجيل الدخول
                    </a>
                    <a
                        href="#pricing"
                        onClick={() => setIsOpen(false)}
                        className="bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] text-white px-6 py-3 rounded-full font-bold"
                    >
                        ابدأ الآن
                    </a>
                </div>
            )}
        </nav>
    );
}
