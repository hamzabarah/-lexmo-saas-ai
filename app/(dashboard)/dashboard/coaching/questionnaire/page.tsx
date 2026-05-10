"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { checkUserSubscription, SubscriptionCheckResult } from "@/lib/check-subscription";
import {
    BLOCKS, TOTAL_QUESTIONS, QUESTIONS, getQuestion,
    getNextVisibleQuestionId, getFirstVisibleQuestionId, isQuestionVisible,
    countVisibleQuestions, countAnsweredQuestions, type ResponsesMap, type DiagnosticQuestion,
} from "@/lib/diagnostic-questions";
import { Lock, ArrowLeft, ArrowRight, CheckCircle, Loader2, MessageCircle, Sparkles } from "lucide-react";

type SubmissionStatus = 'in_progress' | 'completed' | 'analyzing' | 'bilan_published' | 'plan_published' | 'in_development';

interface Submission {
    id: string;
    user_id: string;
    status: SubmissionStatus;
    responses: ResponsesMap;
    current_block: number;
    current_question: number;
}

function TelegramHelpBlock() {
    return (
        <a
            href="https://t.me/ecomyyy"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-l from-[#229ED9]/10 to-[#229ED9]/5 border border-[#229ED9]/20 hover:border-[#229ED9]/40 rounded-2xl p-4 transition-all"
        >
            <div className="flex items-center justify-center gap-3 text-center">
                <MessageCircle className="w-5 h-5 text-[#229ED9] shrink-0" />
                <div>
                    <p className="text-white font-bold text-sm">💬 محتاج مساعدة؟</p>
                    <p className="text-gray-400 text-xs mt-0.5">تواصل معي على تلغرام 📩 — t.me/ecomyyy</p>
                </div>
            </div>
        </a>
    );
}

export default function QuestionnairePage() {
    const router = useRouter();
    const [subscriptionCheck, setSubscriptionCheck] = useState<SubscriptionCheckResult | null>(null);
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [blockTransition, setBlockTransition] = useState<number | null>(null);

    // Local state for the current question's draft answer (so multi/text can be edited).
    const [currentAnswer, setCurrentAnswer] = useState<string | string[]>('');
    const lastLoadedQuestionId = useRef<number | null>(null);

    // Bootstrap: check subscription, load or create submission shell.
    useEffect(() => {
        (async () => {
            const sub = await checkUserSubscription();
            setSubscriptionCheck(sub);
            const hasAccess = sub?.hasAccess && (sub?.subscription?.plan === 'diagnostic' || sub?.isAdmin);
            if (!hasAccess) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch('/api/diagnostic-submission');
                if (res.ok) {
                    const data = await res.json();
                    if (data.submission) {
                        setSubmission(data.submission);
                    }
                    // If no submission yet, that's fine — first POST will create one.
                }
            } catch (err) {
                console.error('Load submission failed:', err);
            }
            setLoading(false);
        })();
    }, []);

    // Redirect away if the submission is already finalized.
    useEffect(() => {
        if (submission && submission.status !== 'in_progress') {
            router.replace('/dashboard/coaching');
        }
    }, [submission, router]);

    // Compute the current question — either submission.current_question, or the first
    // visible question (Q1) for a brand-new user.
    const responses: ResponsesMap = useMemo(() => submission?.responses || {}, [submission]);
    const currentQuestionId = useMemo(() => {
        if (submission) return submission.current_question;
        return 1;
    }, [submission]);

    const currentQuestion: DiagnosticQuestion | null = useMemo(() => {
        // Make sure the question is actually visible — if not, advance to next visible.
        const q = getQuestion(currentQuestionId);
        if (!q) return null;
        if (!isQuestionVisible(q, responses)) {
            const next = getFirstVisibleQuestionId(currentQuestionId, responses);
            return next ? getQuestion(next) || null : null;
        }
        return q;
    }, [currentQuestionId, responses]);

    // When the visible question changes, prime currentAnswer from saved response.
    useEffect(() => {
        if (!currentQuestion) return;
        if (lastLoadedQuestionId.current === currentQuestion.id) return;
        lastLoadedQuestionId.current = currentQuestion.id;
        const saved = responses[String(currentQuestion.id)];
        if (saved) {
            setCurrentAnswer(saved.answer);
        } else {
            setCurrentAnswer(currentQuestion.type === 'multi' ? [] : '');
        }
    }, [currentQuestion, responses]);

    // Progress
    const totalVisible = useMemo(() => countVisibleQuestions(responses), [responses]);
    const answeredCount = useMemo(() => countAnsweredQuestions(responses), [responses]);
    // Which "position" (1-indexed) is the current question in the visible sequence?
    const currentPosition = useMemo(() => {
        if (!currentQuestion) return totalVisible;
        let pos = 0;
        for (const q of QUESTIONS) {
            if (!isQuestionVisible(q, responses)) continue;
            pos++;
            if (q.id === currentQuestion.id) return pos;
        }
        return pos;
    }, [currentQuestion, responses, totalVisible]);
    const progressPct = totalVisible > 0 ? Math.round((Math.max(0, currentPosition - 1) / totalVisible) * 100) : 0;

    const blockMeta = useMemo(() => {
        if (!currentQuestion) return BLOCKS[BLOCKS.length - 1];
        return BLOCKS.find(b => b.id === currentQuestion.block) || BLOCKS[0];
    }, [currentQuestion]);

    const saveAnswer = useCallback(async (
        questionId: number,
        answer: string | string[],
    ): Promise<{ done: boolean; nextQuestionId: number | null; submission: Submission } | null> => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch('/api/diagnostic-submission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, answer }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'حدث خطأ أثناء الحفظ');
                return null;
            }
            setSubmission(data.submission);
            return data;
        } catch (err: any) {
            setError(err.message || 'حدث خطأ');
            return null;
        } finally {
            setSaving(false);
        }
    }, []);

    const navigateTo = useCallback(async (target: number) => {
        if (!submission) return;
        try {
            const res = await fetch('/api/diagnostic-submission', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_question: target }),
            });
            if (res.ok) {
                const data = await res.json();
                setSubmission(data.submission);
            }
        } catch (err) {
            console.error('Navigate failed:', err);
        }
    }, [submission]);

    const handleNext = useCallback(async () => {
        if (!currentQuestion) return;

        // Validate
        if (currentQuestion.type === 'text') {
            if (typeof currentAnswer !== 'string' || !currentAnswer.trim()) {
                setError('عافاك أكتب جواب قبل ما تكمل');
                return;
            }
        } else if (currentQuestion.type === 'multi') {
            if (!Array.isArray(currentAnswer) || currentAnswer.length === 0) {
                setError('عافاك ختار على الأقل اختيار واحد');
                return;
            }
        } else {
            if (typeof currentAnswer !== 'string' || !currentAnswer) {
                setError('عافاك ختار جواب');
                return;
            }
        }

        const previousBlock = currentQuestion.block;
        const result = await saveAnswer(currentQuestion.id, currentAnswer);
        if (!result) return;

        // If the next question is in a new block, show the block-completion banner briefly.
        const nextQ = result.nextQuestionId ? getQuestion(result.nextQuestionId) : null;
        if (nextQ && nextQ.block !== previousBlock) {
            setBlockTransition(previousBlock);
            setTimeout(() => setBlockTransition(null), 1800);
        }

        if (result.done) {
            // Finalize on server (changes status, sends notifications).
            setSubmitting(true);
            try {
                const res = await fetch('/api/diagnostic-submission/complete', { method: 'POST' });
                const data = await res.json();
                if (res.ok) {
                    if (data.submission) setSubmission(data.submission);
                } else {
                    setError(data.error || 'حدث خطأ');
                }
            } catch (err: any) {
                setError(err.message || 'حدث خطأ');
            } finally {
                setSubmitting(false);
            }
        }
    }, [currentQuestion, currentAnswer, saveAnswer]);

    const handlePrev = useCallback(async () => {
        if (!currentQuestion) return;
        // Find previous visible question
        let prevId: number | null = null;
        for (let id = currentQuestion.id - 1; id >= 1; id--) {
            const q = getQuestion(id);
            if (q && isQuestionVisible(q, responses)) {
                prevId = id;
                break;
            }
        }
        if (prevId) await navigateTo(prevId);
    }, [currentQuestion, responses, navigateTo]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-500 text-lg">جاري التحميل...</div>
            </div>
        );
    }

    const hasDiagnosticAccess =
        subscriptionCheck?.hasAccess &&
        (subscriptionCheck?.subscription?.plan === 'diagnostic' || subscriptionCheck?.isAdmin);
    if (!hasDiagnosticAccess) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-12 max-w-lg text-center">
                    <Lock className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">الوصول مقيد</h2>
                    <p className="text-gray-400">هاد المنطقة مخصصة لعملاء التشخيص</p>
                </div>
            </div>
        );
    }

    // Final screen — questionnaire submitted, analysis in progress.
    if (submission && submission.status !== 'in_progress') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-12 max-w-lg text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">✅ تم إرسال الاستبيان</h2>
                    <p className="text-gray-400 mb-6">جاري التحليل — كنرجعو ليك في أقل من 48 ساعة</p>
                    <Link
                        href="/dashboard/coaching"
                        className="inline-flex items-center gap-2 bg-[#C5A04E] hover:bg-[#D4B85C] text-white font-bold px-6 py-3 rounded-xl transition"
                    >
                        <span>الرجوع للوحة</span>
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-500">لا يوجد سؤال متاح</div>
            </div>
        );
    }

    if (submitting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-[#C5A04E] animate-spin" />
                <p className="text-white text-lg font-bold">✅ تم إرسال الاستبيان</p>
                <p className="text-gray-400 text-sm">جاري التحليل...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-2 space-y-4 min-h-[80vh] flex flex-col">
            {/* Top bar: block + progress */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[#C5A04E] font-bold">
                        <span className="text-base">📋</span>
                        <span>الجزء {blockMeta.id} من 9</span>
                        <span className="text-gray-500 font-normal hidden sm:inline">— {blockMeta.title}</span>
                    </div>
                    <span className="text-gray-400 font-bold">
                        سؤال {currentPosition} من {totalVisible}
                    </span>
                </div>
                <div className="w-full bg-[#0A0A0A] rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
                <div className="text-center text-xs text-gray-500">
                    {progressPct}% — {answeredCount} جواب محفوظ {saving && <span className="text-[#C5A04E]">• كنحفظ...</span>}
                </div>
            </div>

            {/* Block transition banner */}
            {blockTransition !== null && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 text-center animate-pulse">
                    <p className="text-green-400 font-bold">
                        ✅ كملتي الجزء {blockTransition} من 9 — كمل باقي الأسئلة 💪
                    </p>
                </div>
            )}

            {/* Question card */}
            <div className="flex-1 flex items-center">
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-6 md:p-8 w-full">
                    <h2 className="text-white text-xl md:text-2xl font-bold leading-relaxed mb-3">
                        {currentQuestion.text}
                    </h2>
                    {currentQuestion.helper && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 border-r-2 border-[#C5A04E]/30 pr-3">
                            {currentQuestion.helper}
                        </p>
                    )}

                    {/* Single choice */}
                    {currentQuestion.type === 'single' && (
                        <div className="space-y-2">
                            {currentQuestion.options!.map(opt => {
                                const selected = currentAnswer === opt;
                                return (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            setError(null);
                                            setCurrentAnswer(opt);
                                        }}
                                        disabled={saving}
                                        className={`w-full text-right py-3.5 px-5 rounded-xl border transition-all ${
                                            selected
                                                ? 'bg-[#C5A04E]/15 border-[#C5A04E] text-white'
                                                : 'bg-[#1A1A1A] border-transparent hover:border-[#C5A04E]/40 hover:bg-[#C5A04E]/5 text-gray-300'
                                        } ${saving ? 'opacity-60' : ''}`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className={`w-4 h-4 rounded-full border-2 shrink-0 transition ${
                                                selected ? 'border-[#C5A04E] bg-[#C5A04E]' : 'border-gray-600'
                                            }`}>
                                                {selected && <span className="block w-1.5 h-1.5 bg-[#0A0A0A] rounded-full m-auto mt-[3px]" />}
                                            </span>
                                            <span className="flex-1">{opt}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Multi choice */}
                    {currentQuestion.type === 'multi' && (
                        <div className="space-y-2">
                            <p className="text-gray-500 text-xs mb-2">يمكن تختار أكثر من جواب</p>
                            {currentQuestion.options!.map(opt => {
                                const arr = Array.isArray(currentAnswer) ? currentAnswer : [];
                                const selected = arr.includes(opt);
                                return (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            setError(null);
                                            const next = selected
                                                ? arr.filter(x => x !== opt)
                                                : [...arr, opt];
                                            setCurrentAnswer(next);
                                        }}
                                        disabled={saving}
                                        className={`w-full text-right py-3.5 px-5 rounded-xl border transition-all ${
                                            selected
                                                ? 'bg-[#C5A04E]/15 border-[#C5A04E] text-white'
                                                : 'bg-[#1A1A1A] border-transparent hover:border-[#C5A04E]/40 hover:bg-[#C5A04E]/5 text-gray-300'
                                        } ${saving ? 'opacity-60' : ''}`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className={`w-4 h-4 rounded border-2 shrink-0 transition flex items-center justify-center ${
                                                selected ? 'border-[#C5A04E] bg-[#C5A04E]' : 'border-gray-600'
                                            }`}>
                                                {selected && <CheckCircle className="w-3 h-3 text-[#0A0A0A]" />}
                                            </span>
                                            <span className="flex-1">{opt}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Text */}
                    {currentQuestion.type === 'text' && (
                        <textarea
                            value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                            onChange={(e) => {
                                setError(null);
                                setCurrentAnswer(e.target.value);
                            }}
                            placeholder="اكتب الجواب ديالك هنا..."
                            rows={4}
                            className="w-full bg-[#0A0A0A] border border-[#C5A04E]/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] focus:border-[#C5A04E] resize-none placeholder-gray-600"
                        />
                    )}

                    {error && (
                        <p className="text-red-400 text-sm mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between gap-3">
                <button
                    onClick={handlePrev}
                    disabled={!submission || currentQuestion.id === 1 || saving}
                    className="flex items-center gap-2 bg-[#1A1A1A] border border-[#C5A04E]/10 text-gray-300 hover:text-white hover:border-[#C5A04E]/30 font-bold px-5 py-3 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>السابق</span>
                </button>

                <button
                    onClick={handleNext}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] hover:opacity-90 text-white font-bold px-6 py-3 rounded-xl transition disabled:opacity-50 flex-1 sm:flex-initial justify-center"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>كنحفظ...</span>
                        </>
                    ) : currentPosition === totalVisible ? (
                        <>
                            <Sparkles className="w-4 h-4" />
                            <span>إرسال الاستبيان</span>
                        </>
                    ) : (
                        <>
                            <span>التالي</span>
                            <ArrowLeft className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>

            <div className="pt-2">
                <TelegramHelpBlock />
            </div>
        </div>
    );
}
