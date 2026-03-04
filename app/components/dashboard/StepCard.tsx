"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useState } from "react";

interface StepCardProps {
    stepNumber: number;
    title: string;
    description: string;
    imageUrl?: string;
    progress?: number;
    isLocked?: boolean;
}

export default function StepCard({
    stepNumber,
    title,
    description,
    imageUrl,
    progress = 0,
    isLocked = false,
}: StepCardProps) {
    const [imgError, setImgError] = useState(false);
    const showImage = imageUrl && !imgError;

    const content = (
        <div className="group bg-[#0f1120] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            {/* Image / Placeholder */}
            <div className="relative w-full h-48 bg-[#1a1a2e] overflow-hidden">
                {showImage ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold font-orbitron text-white/10">
                            {stepNumber}
                        </span>
                        <span className="text-sm text-white/20 font-cairo mt-1">
                            المرحلة {stepNumber}
                        </span>
                    </div>
                )}

                {/* Lock overlay */}
                {isLocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white/40" />
                    </div>
                )}

                {/* Step number badge */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                    المرحلة {stepNumber}
                </div>
            </div>

            {/* Content */}
            <div className="p-5" dir="rtl">
                <h3 className="text-lg font-bold text-white mb-2 font-cairo">
                    {title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 font-cairo">
                    {description}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-500">التقدم</span>
                        <span className="text-gray-400 font-mono">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-l from-[#00d2ff] to-[#0ea5e9] rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    if (isLocked) {
        return <div className="cursor-not-allowed opacity-60">{content}</div>;
    }

    return (
        <Link href={`/dashboard/phases/${stepNumber}`}>
            {content}
        </Link>
    );
}
