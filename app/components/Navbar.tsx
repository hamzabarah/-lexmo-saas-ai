"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200 h-20">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold font-orbitron tracking-wider">
                    <span className="text-[#008060]">ECOMY</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link href="#content" className="hover:text-[#008060] transition-colors">المحتوى</Link>
                    <Link href="#reviews" className="hover:text-[#008060] transition-colors">آراء العملاء</Link>
                    <Link href="#pricing" className="hover:text-[#008060] transition-colors">الأسعار</Link>
                    <Link href="#faq" className="hover:text-[#008060] transition-colors">الأسئلة الشائعة</Link>
                </div>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <a
                        href="#login"
                        className="text-white px-5 py-2.5 rounded-full font-bold hover:bg-gray-50 transition-all border border-gray-200"
                    >
                        تسجيل الدخول
                    </a>
                    <a
                        href="#pricing"
                        className="bg-gradient-to-r from-[#008060] to-[#006e52] text-white px-6 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(0,210,255,0.5)] transition-all transform hover:scale-105"
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
                <div className="md:hidden absolute top-20 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 py-6 px-4 flex flex-col gap-4 text-center shadow-2xl">
                    <Link href="#content" onClick={() => setIsOpen(false)} className="text-white text-lg font-medium hover:text-[#008060] transition-colors py-2">المحتوى</Link>
                    <Link href="#reviews" onClick={() => setIsOpen(false)} className="text-white text-lg font-medium hover:text-[#008060] transition-colors py-2">آراء العملاء</Link>
                    <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-white text-lg font-medium hover:text-[#008060] transition-colors py-2">الأسعار</Link>
                    <Link href="#faq" onClick={() => setIsOpen(false)} className="text-white text-lg font-medium hover:text-[#008060] transition-colors py-2">الأسئلة الشائعة</Link>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <a
                        href="#login"
                        onClick={() => setIsOpen(false)}
                        className="border border-gray-300 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-all"
                    >
                        تسجيل الدخول
                    </a>
                    <a
                        href="#pricing"
                        onClick={() => setIsOpen(false)}
                        className="bg-gradient-to-r from-[#008060] to-[#006e52] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-[0_0_20px_rgba(0,210,255,0.5)] transition-all"
                    >
                        ابدأ الآن
                    </a>
                </div>
            )}
        </nav>
    );
}
