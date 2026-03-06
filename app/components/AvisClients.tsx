"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import FadeIn from "./FadeIn";

const FILENAMES = [
    "1,2k$-1d.jpg", "1,6k$-1d.jpg", "1k€-1h.jpg", "2,4k$-3h.jpg",
    "2k$-24h.jpg", "3k€-24h.jpg", "5k$-24h.jpg", "6k$-12h.jpg",
    "7,3k$-24h.jpg", "7k€-1d.jpg", "9k-15h.jpg", "9k$-9d.jpg",
    "9k$-12h.jpg", "9k$-15d.jpg", "10k€-24h.jpg", "14k$-4d.jpg",
    "14k$-7d.jpg", "15k$-20d.jpg", "16k$-4d.jpg", "16k£-12h.jpg",
    "25k$-12d.jpg", "26k$-12d.jpg", "27k$-30d.jpg", "30k$-12h.jpg",
    "30k$-24h.jpg", "31k$-12h.jpg", "33k£-7d.jpg", "33k€-12h.jpg",
    "35k$-14d.jpg", "40k$-30d.jpg", "41k$-30d.jpg", "42k$-12h.jpg",
    "43k$-30d.jpg", "43k€-30d.jpg", "44k$-24h.jpg", "44k$-30d.jpg",
    "50k$-12h.jpg", "50k€-20d.jpg", "50k€-30d.jpg", "51k$-7d.jpg",
    "51k$-25d.jpg", "56k$-20d.jpg", "63k€-30d.jpg", "100k$-30d.jpg",
    "100k€-7d.jpg", "105k$-30d.jpg", "186k$-40d.jpg", "243€-3h.jpg",
    "368k$-30d.jpg", "500k$-30d.jpg"
];

// Helper to parse filename: "10k$-24h.jpg" -> { amount: "10k$", time: "24h" }
const parseReview = (filename: string, id: number) => {
    const namePart = filename.replace('.jpg', '');
    const [amount, time] = namePart.split('-');
    return {
        id,
        amount: amount || "???",
        time: time || "???",
        image: `/images/${filename}`
    };
};

const REVIEWS = FILENAMES.map((f, i) => parseReview(f, i));

export default function AvisClients() {
    const [visibleCount, setVisibleCount] = useState(12);

    return (
        <section id="reviews" className="py-20 bg-gray-100/50 overflow-hidden">
            {/* Verified Badge Animation */}
            <style jsx>{`
                @keyframes verified-pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.7;
                    }
                }
                .verified-badge {
                    animation: verified-pulse 2s ease-in-out infinite;
                }
            `}</style>

            <div className="container mx-auto px-4">
                <FadeIn className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold font-cairo mb-4">
                        لقد فعلوها.. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-orange-500">والآن جاء دورك</span>
                    </h2>
                    <p className="text-gray-500 text-lg">موظفون، طلاب، آباء وأمهات — أشخاص عاديون كسروا حاجز الشك والخوف.</p>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {REVIEWS.slice(0, visibleCount).map((review, index) => (
                        <FadeIn
                            key={review.id}
                            delay={index * 0.05}
                            className="group"
                        >
                            {/* Badge Amount & Time - ABOVE the card */}
                            <div dir="ltr" className="mb-2 bg-gradient-to-r from-[#ffd700] to-orange-500 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 w-fit">
                                <span className="text-black font-bold font-orbitron text-sm">💰 {review.amount}</span>
                                <span className="text-black/80 text-xs font-bold">⏱️ {review.time}</span>
                            </div>

                            {/* Card with Image */}
                            <div className="relative rounded-2xl overflow-hidden glass-card hover:border-[#ffd700]/50 transition-all duration-300">
                                {/* Full Image - No Cropping */}
                                <div className="relative bg-[#f4f6f8]">
                                    <img
                                        src={review.image}
                                        alt={`Témoignage ${review.amount} en ${review.time}`}
                                        className="w-full h-auto object-contain"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Verified Badge - BOTTOM RIGHT with PULSE animation */}
                                <div className="verified-badge absolute bottom-3 right-3 z-10 bg-green-500 px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                    <CheckCircle size={14} className="text-white" />
                                    <span className="text-white text-xs font-bold">Verified</span>
                                </div>

                                {/* Subtle Bottom Gradient */}
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {visibleCount < REVIEWS.length && (
                    <FadeIn delay={0.2} className="text-center mt-12">
                        <button
                            onClick={() => setVisibleCount(visibleCount + 12)}
                            className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105"
                        >
                            عرض المزيد من النتائج
                        </button>
                    </FadeIn>
                )}
            </div>
        </section>
    );
}
