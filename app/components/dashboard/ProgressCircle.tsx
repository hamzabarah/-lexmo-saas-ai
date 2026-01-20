"use client";

import { motion } from "framer-motion";

interface ProgressCircleProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    completed: number;
    total: number;
}

export default function ProgressCircle({
    percentage,
    size = 180,
    strokeWidth = 12,
    color = "#00d2ff",
    completed,
    total
}: ProgressCircleProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Background Circle */}
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                </svg>

                {/* Progress Circle with Animation */}
                <svg width={size} height={size} className="absolute top-0 left-0 transform -rotate-90">
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="url(#gradient)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00d2ff" />
                            <stop offset="100%" stopColor="#9d50bb" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-4xl font-bold font-orbitron text-white block mb-1">
                        {percentage}%
                    </span>
                    <span className="text-xs text-gray-400 font-cairo">مكتمل</span>
                </div>
            </div>

            <p className="mt-4 text-gray-300 font-bold">
                أكملت <span className="text-[#00d2ff]">{completed}</span> من <span className="text-gray-400">{total}</span> وحدة
            </p>
        </div>
    );
}
