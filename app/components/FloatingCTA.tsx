"use client";

import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";

export default function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling 300px
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToPricing = () => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <a
            href="#pricing"
            className={`fixed bottom-6 right-6 z-[999] bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:shadow-[0_0_30px_rgba(0,210,255,0.6)] transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center gap-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
        >
            <Rocket size={20} />
            <span className="font-cairo">ابدأ الآن</span>
        </a>
    );
}
