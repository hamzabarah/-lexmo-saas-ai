"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { quizzes, QuizQuestion } from "./quizData";

/* ─── helpers ─── */
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

interface ShuffledQuestion extends QuizQuestion {
    shuffledOptions: string[];
    correctShuffledIndex: number;
}

function shuffleQuestions(questions: QuizQuestion[]): ShuffledQuestion[] {
    return shuffle(questions).map((q) => {
        const indices = q.options.map((_, i) => i);
        const shuffled = shuffle(indices);
        return {
            ...q,
            shuffledOptions: shuffled.map((i) => q.options[i]),
            correctShuffledIndex: shuffled.indexOf(q.correct),
        };
    });
}

/* ─── localStorage helpers ─── */
function getBestScore(phase: number): number | null {
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(`quiz_best_${phase}`);
    return v !== null ? parseInt(v, 10) : null;
}

function saveBestScore(phase: number, score: number) {
    if (typeof window === "undefined") return;
    const prev = getBestScore(phase);
    if (prev === null || score > prev) {
        localStorage.setItem(`quiz_best_${phase}`, String(score));
    }
}

/* ═══════════════════════════════════════════════════════
   QuizRenderer
   ═══════════════════════════════════════════════════════ */
export default function QuizRenderer({ phaseNumber }: { phaseNumber: number }) {
    const rawQuestions = quizzes[phaseNumber];

    const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [bestScore, setBestScore] = useState<number | null>(null);

    /* initialise / reset */
    const initQuiz = useCallback(() => {
        if (!rawQuestions) return;
        setQuestions(shuffleQuestions(rawQuestions));
        setCurrent(0);
        setSelected(null);
        setAnswered(false);
        setScore(0);
        setFinished(false);
    }, [rawQuestions]);

    useEffect(() => {
        initQuiz();
        setBestScore(getBestScore(phaseNumber));
    }, [initQuiz, phaseNumber]);

    const total = questions.length;
    const q = questions[current];

    /* answer handler */
    const handleSelect = (idx: number) => {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        if (idx === q.correctShuffledIndex) {
            setScore((s) => s + 1);
        }
    };

    /* next / finish */
    const handleNext = () => {
        if (current < total - 1) {
            setCurrent((c) => c + 1);
            setSelected(null);
            setAnswered(false);
        } else {
            const finalScore = score;
            saveBestScore(phaseNumber, finalScore);
            setBestScore(Math.max(finalScore, bestScore ?? 0));
            setFinished(true);
        }
    };

    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    const resultMessage = useMemo(() => {
        if (pct >= 90) return { emoji: "🏆", text: "ممتاز! أنت جاهز للمرحلة التالية", color: "text-green-400" };
        if (pct >= 70) return { emoji: "👏", text: "مزيان! راجع الأجزاء اللي غلطتي فيها", color: "text-blue-400" };
        if (pct >= 50) return { emoji: "💪", text: "مقبول — عاود قرا المرحلة وحاول مرة أخرى", color: "text-yellow-400" };
        return { emoji: "📖", text: "خاصك تعاود المرحلة — ما تقلقش، التكرار كيثبت المعلومات", color: "text-red-400" };
    }, [pct]);

    /* ─── no quiz data ─── */
    if (!rawQuestions || rawQuestions.length === 0) {
        return (
            <div className="p-8 text-center" dir="rtl">
                <p className="text-xl text-gray-500">🧠 الاختبار قيد الإعداد — قريباً</p>
            </div>
        );
    }

    /* ─── score screen ─── */
    if (finished) {
        return (
            <div className="p-6 lg:p-8 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
                <div className="max-w-xl mx-auto text-center space-y-8">
                    {/* header */}
                    <div>
                        <p className="text-6xl mb-4">{resultMessage.emoji}</p>
                        <h2 className="text-2xl font-bold text-white mb-2">نتيجة الاختبار</h2>
                        <p className="text-[#C5A04E] text-lg">المرحلة {phaseNumber}</p>
                    </div>

                    {/* score circle */}
                    <div className="relative w-40 h-40 mx-auto">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#1A1A1A" strokeWidth="8" />
                            <circle
                                cx="50" cy="50" r="42" fill="none"
                                stroke={pct >= 70 ? "#22c55e" : pct >= 50 ? "#eab308" : "#ef4444"}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${(pct / 100) * 264} 264`}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white" style={{ fontFamily: "Orbitron, monospace" }}>{pct}%</span>
                            <span className="text-sm text-gray-500">{score}/{total}</span>
                        </div>
                    </div>

                    {/* message */}
                    <p className={`text-lg font-bold ${resultMessage.color}`}>{resultMessage.text}</p>

                    {bestScore !== null && bestScore > score && (
                        <p className="text-sm text-gray-500">أحسن نتيجة سابقة: {Math.round((bestScore / total) * 100)}% ({bestScore}/{total})</p>
                    )}

                    {/* buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <button
                            onClick={initQuiz}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#C5A04E]/10 text-[#C5A04E] border border-[#C5A04E]/20 hover:bg-[#C5A04E]/20 transition-colors font-bold"
                        >
                            🔄 عاود الاختبار
                        </button>
                        {pct >= 70 && (
                            <a
                                href={`/dashboard/phases/${phaseNumber + 1}`}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors font-bold"
                            >
                                ➡️ المرحلة التالية
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    /* ─── question screen ─── */
    const isCorrect = selected === q.correctShuffledIndex;

    return (
        <div className="p-6 lg:p-8 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* header */}
                <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-white mb-1">🧠 اختبر معلوماتك</h2>
                    <p className="text-gray-500 text-sm">واش فهمتي هاد المرحلة مزيان؟</p>
                </div>

                {/* progress bar */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-l from-[#C5A04E] to-[#0ea5e9] rounded-full transition-all duration-500"
                            style={{ width: `${((current + 1) / total) * 100}%` }}
                        />
                    </div>
                    <span className="text-sm text-gray-500 font-mono shrink-0">
                        سؤال {current + 1} من {total}
                    </span>
                </div>

                {/* question */}
                <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-2xl p-6">
                    <p className="text-lg font-bold text-white leading-relaxed">{q.question}</p>
                </div>

                {/* options */}
                <div className="space-y-3">
                    {q.shuffledOptions.map((opt, idx) => {
                        let borderColor = "border-white/[0.06]";
                        let bg = "bg-[#111111]";
                        let textColor = "text-gray-300";
                        let ring = "";

                        if (answered) {
                            if (idx === q.correctShuffledIndex) {
                                borderColor = "border-green-500/50";
                                bg = "bg-green-500/10";
                                textColor = "text-green-400";
                                ring = "ring-1 ring-green-500/30";
                            } else if (idx === selected) {
                                borderColor = "border-red-500/50";
                                bg = "bg-red-500/10";
                                textColor = "text-red-400";
                                ring = "ring-1 ring-red-500/30";
                            } else {
                                textColor = "text-gray-600";
                            }
                        } else {
                            if (idx === selected) {
                                borderColor = "border-[#C5A04E]/40";
                                bg = "bg-[#C5A04E]/5";
                            }
                        }

                        const letter = ["أ", "ب", "ج", "د"][idx];

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx)}
                                disabled={answered}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border ${borderColor} ${bg} ${ring} transition-all duration-300 text-right ${
                                    !answered ? "hover:bg-[#C5A04E]/5 hover:border-[#C5A04E]/30 cursor-pointer" : "cursor-default"
                                }`}
                            >
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                                    answered && idx === q.correctShuffledIndex
                                        ? "bg-green-500/20 text-green-400"
                                        : answered && idx === selected
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-[#C5A04E]/10 text-[#C5A04E]"
                                }`}>
                                    {answered && idx === q.correctShuffledIndex ? "✅" : answered && idx === selected ? "❌" : letter}
                                </span>
                                <span className={`flex-1 ${textColor} leading-relaxed`}>{opt}</span>
                            </button>
                        );
                    })}
                </div>

                {/* feedback */}
                {answered && (
                    <div className={`rounded-xl p-4 border ${
                        isCorrect
                            ? "bg-green-500/10 border-green-500/20"
                            : "bg-red-500/10 border-red-500/20"
                    }`}>
                        <p className={`font-bold mb-1 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                            {isCorrect ? "✅ إجابة صحيحة!" : "❌ إجابة غير صحيحة"}
                        </p>
                        <p className="text-gray-300 text-sm leading-relaxed">{q.explanation}</p>
                    </div>
                )}

                {/* next button */}
                {answered && (
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 rounded-xl bg-[#C5A04E]/10 text-[#C5A04E] border border-[#C5A04E]/20 hover:bg-[#C5A04E]/20 transition-colors font-bold"
                        >
                            {current < total - 1 ? "السؤال التالي ←" : "🏁 شوف النتيجة"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
