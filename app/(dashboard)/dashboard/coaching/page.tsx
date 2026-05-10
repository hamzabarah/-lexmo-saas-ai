"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { checkUserSubscription, SubscriptionCheckResult } from "@/lib/check-subscription";
import {
    Lock, CheckCircle, Sparkles, ClipboardList, Hourglass, FileText, ListChecks,
    Activity, MessageCircle, ArrowLeft,
} from "lucide-react";
import { TOTAL_QUESTIONS, countAnsweredQuestions, countVisibleQuestions, type ResponsesMap } from "@/lib/diagnostic-questions";

type SubmissionStatus = 'in_progress' | 'completed' | 'analyzing' | 'bilan_published' | 'plan_published' | 'in_development';

interface ProjectStep {
    step: string;
    status: 'done' | 'in_progress' | 'locked';
}

interface Submission {
    id: string;
    user_id: string;
    status: SubmissionStatus;
    responses: ResponsesMap;
    current_block: number;
    current_question: number;
    bilan_content: string | null;
    plan_content: string | null;
    project_steps: ProjectStep[];
    completed_at: string | null;
    bilan_published_at: string | null;
    plan_published_at: string | null;
    created_at: string;
    updated_at: string;
}

const STEPS = [
    { num: 1, key: 'welcome',       title: 'مرحبا بك',           emoji: '🎉', icon: Sparkles,     description: 'الخطوات اللي غادي تعدا' },
    { num: 2, key: 'questionnaire', title: 'الاستبيان',          emoji: '📋', icon: ClipboardList, description: '180 سؤال — كنفهموك من الداخل' },
    { num: 3, key: 'analyzing',     title: 'التحليل جاري',       emoji: '⏳', icon: Hourglass,    description: 'كنحللو الملف ديالك — أقل من 48 ساعة' },
    { num: 4, key: 'bilan',         title: 'البيلان جاهز',       emoji: '📊', icon: FileText,     description: 'تشخيص شخصي لوضعيتك ومشروعك' },
    { num: 5, key: 'plan',          title: 'خطة العمل',          emoji: '📋', icon: ListChecks,   description: 'الخطوات العملية باش تبدأ' },
    { num: 6, key: 'tracker',       title: 'المتابعة',           emoji: '🔄', icon: Activity,     description: 'تتبع تقدم المشروع ديالك' },
];

function statusToActiveStep(submission: Submission | null): number {
    if (!submission) return 1;
    switch (submission.status) {
        case 'in_progress':     return 2;
        case 'completed':       return 3;
        case 'analyzing':       return 3;
        case 'bilan_published': return 4;
        case 'plan_published':  return 5;
        case 'in_development':  return 6;
        default:                return 1;
    }
}

function TelegramHelpBlock() {
    return (
        <a
            href="https://t.me/ecomyyy"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-l from-[#229ED9]/10 to-[#229ED9]/5 border border-[#229ED9]/20 hover:border-[#229ED9]/40 rounded-2xl p-5 transition-all"
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

function AnalyzingProgress() {
    const [pct, setPct] = useState(8);
    useEffect(() => {
        const id = setInterval(() => {
            setPct(prev => {
                if (prev >= 92) return 92;
                return prev + Math.random() * 3;
            });
        }, 1200);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="space-y-4">
            <div className="w-full bg-[#0A0A0A] rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] transition-all duration-700"
                    style={{ width: `${pct.toFixed(1)}%` }}
                />
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#C5A04E] animate-pulse" />
                <span>الذكاء الاصطناعي + الفريق ديالنا كيخدمو على ملفك</span>
            </div>
        </div>
    );
}

function MarkdownPanel({ content }: { content: string }) {
    return (
        <div className="prose prose-invert prose-sm md:prose-base max-w-none
            prose-headings:text-[#C5A04E] prose-headings:font-bold
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-strong:text-white
            prose-li:text-gray-300
            prose-a:text-[#C5A04E] prose-a:no-underline hover:prose-a:underline
            prose-hr:border-[#C5A04E]/20
            prose-blockquote:border-r-[#C5A04E] prose-blockquote:border-r-4 prose-blockquote:border-l-0 prose-blockquote:text-gray-400
            prose-code:text-[#C5A04E] prose-code:bg-[#0A0A0A] prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    );
}

function ProjectStepsView({ steps }: { steps: ProjectStep[] }) {
    if (!steps.length) {
        return (
            <p className="text-gray-500 text-sm text-center py-8">
                مازال ما تحطاتش الخطوات — كاتنزاد من طرف الإدارة بعد ما تبدا المشروع.
            </p>
        );
    }
    return (
        <div className="space-y-3">
            {steps.map((s, i) => {
                const cfg = s.status === 'done'
                    ? { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/30', label: '✅ تم' }
                    : s.status === 'in_progress'
                        ? { icon: Hourglass, color: 'text-[#C5A04E]', bg: 'bg-[#C5A04E]/10 border-[#C5A04E]/30', label: '⏳ جاري' }
                        : { icon: Lock, color: 'text-gray-500', bg: 'bg-[#1A1A1A] border-gray-700/30', label: '🔒 لم يبدأ بعد' };
                const Icon = cfg.icon;
                return (
                    <div key={i} className={`flex items-center gap-4 ${cfg.bg} border rounded-xl px-5 py-4`}>
                        <Icon className={`w-5 h-5 ${cfg.color} shrink-0`} />
                        <div className="flex-1">
                            <p className="text-white font-semibold text-sm">{s.step}</p>
                        </div>
                        <span className={`text-xs font-bold ${cfg.color} shrink-0`}>{cfg.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default function CoachingPage() {
    const [subscriptionCheck, setSubscriptionCheck] = useState<SubscriptionCheckResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        (async () => {
            const sub = await checkUserSubscription();
            setSubscriptionCheck(sub);
            const hasAccess = sub?.hasAccess && (sub?.subscription?.plan === 'diagnostic' || sub?.isAdmin);
            if (hasAccess) {
                try {
                    const res = await fetch('/api/diagnostic-submission');
                    if (res.ok) {
                        const data = await res.json();
                        setSubmission(data.submission || null);
                    }
                } catch {
                    /* ignore — render onboarding */
                }
            }
            setLoading(false);
        })();
    }, []);

    const activeStep = useMemo(() => statusToActiveStep(submission), [submission]);

    const firstName = useMemo(() => {
        const raw = submission?.responses?.['1']?.answer;
        if (typeof raw !== 'string' || !raw.trim()) return null;
        const trimmed = raw.trim();
        const first = trimmed.split(/\s+/)[0];
        return first || trimmed;
    }, [submission]);

    const questionnaireProgress = useMemo(() => {
        if (!submission) return { answered: 0, total: TOTAL_QUESTIONS, pct: 0 };
        const answered = countAnsweredQuestions(submission.responses);
        const total = countVisibleQuestions(submission.responses);
        const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
        return { answered, total, pct };
    }, [submission]);

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
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">الوصول مقيد</h2>
                    <p className="text-gray-400 mb-6">هاد المنطقة مخصصة لعملاء التشخيص</p>
                    <a
                        href="/diagnostic"
                        className="inline-block bg-[#E8600A] hover:bg-[#D15509] text-white font-bold px-8 py-3 rounded-xl transition-colors"
                    >
                        اكتشف تشخيص البزنس
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-4 py-4">
            {/* Welcome header */}
            <div className="text-center space-y-3 mb-6">
                <div className="inline-flex items-center gap-2 bg-[#C5A04E]/10 border border-[#C5A04E]/30 text-[#C5A04E] text-xs font-bold px-3 py-1.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>مسار التشخيص الشخصي</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {firstName ? `مرحبا ${firstName} 🎉` : 'مرحبا بك 🎉'}
                </h1>
                <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                    حنا هنا باش نفهموك من الداخل ونلقاو ليك المشروع المناسب.
                    شوف الخطوات اللي غادي تعدا وأنت كاتعرف فين واصل في كل لحظة.
                </p>
            </div>

            {/* 6-step roadmap */}
            <div className="space-y-0">
                {STEPS.map((step, idx) => {
                    const isCompleted = activeStep > step.num;
                    const isActive = activeStep === step.num;
                    const isLocked = activeStep < step.num;
                    const Icon = step.icon;
                    const isLast = idx === STEPS.length - 1;

                    return (
                        <div key={step.num} className="flex gap-4">
                            {/* Indicator column */}
                            <div className="flex flex-col items-center">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                    isCompleted
                                        ? 'bg-green-500/20 border-2 border-green-500'
                                        : isActive
                                            ? 'bg-[#C5A04E]/20 border-2 border-[#C5A04E] ring-4 ring-[#C5A04E]/10'
                                            : 'bg-[#1A1A1A] border-2 border-gray-700'
                                }`}>
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : isLocked ? (
                                        <Lock className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <span className="text-base">{step.emoji}</span>
                                    )}
                                </div>
                                {!isLast && (
                                    <div className={`w-0.5 flex-1 min-h-[40px] ${isCompleted ? 'bg-green-500/30' : 'bg-gray-700/50'}`} />
                                )}
                            </div>

                            {/* Content column */}
                            <div className="flex-1 pb-6">
                                <div className="flex items-center gap-3 mb-1">
                                    <Icon className={`w-5 h-5 ${
                                        isCompleted ? 'text-green-500' : isActive ? 'text-[#C5A04E]' : 'text-gray-500'
                                    }`} />
                                    <h3 className={`font-bold text-base md:text-lg ${
                                        isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-gray-400'
                                    }`}>
                                        {step.title}
                                        {isCompleted && <span className="text-green-500 text-sm mr-2">✓ تم</span>}
                                        {isActive && <span className="text-[#C5A04E] text-xs font-normal mr-2">— ⏳ جاري</span>}
                                        {isLocked && <span className="text-gray-500 text-xs font-normal mr-2">— 🔒 لم يبدأ بعد</span>}
                                    </h3>
                                </div>
                                <p className={`text-sm mr-8 ${
                                    isCompleted ? 'text-gray-500' : isActive ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {step.description}
                                </p>

                                {/* Active step content */}
                                {isActive && (
                                    <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-6 mt-4">
                                        {step.key === 'welcome' && (
                                            <div className="space-y-5 text-center">
                                                <p className="text-gray-300 leading-relaxed">
                                                    غادي نسولوك 180 سؤال على وضعيتك، شخصيتك، خبرتك ومحيطك.
                                                    كل سؤال مهم — والأجوبة ديالك غادي تعطينا صورة كاملة باش نلقاو ليك المشروع المناسب.
                                                </p>
                                                <div className="grid grid-cols-3 gap-3 text-center">
                                                    <div className="bg-[#0A0A0A] rounded-xl p-3 border border-[#C5A04E]/10">
                                                        <p className="text-2xl font-bold text-[#C5A04E]">9</p>
                                                        <p className="text-gray-500 text-xs">أجزاء</p>
                                                    </div>
                                                    <div className="bg-[#0A0A0A] rounded-xl p-3 border border-[#C5A04E]/10">
                                                        <p className="text-2xl font-bold text-[#C5A04E]">180</p>
                                                        <p className="text-gray-500 text-xs">سؤال</p>
                                                    </div>
                                                    <div className="bg-[#0A0A0A] rounded-xl p-3 border border-[#C5A04E]/10">
                                                        <p className="text-2xl font-bold text-[#C5A04E]">~30</p>
                                                        <p className="text-gray-500 text-xs">دقيقة</p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-500 text-xs">
                                                    تقدر توقف وترجع في أي وقت — الأجوبة ديالك كتسجل أوتوماتيكيا 💾
                                                </p>
                                                <Link
                                                    href="/dashboard/coaching/questionnaire"
                                                    className="inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] hover:opacity-90 text-white font-bold py-4 rounded-xl transition"
                                                >
                                                    <span>بدء الاستبيان</span>
                                                    <ArrowLeft className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        )}

                                        {step.key === 'questionnaire' && (
                                            <div className="space-y-5">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2 text-sm">
                                                        <span className="text-gray-400">التقدم</span>
                                                        <span className="text-[#C5A04E] font-bold">
                                                            {questionnaireProgress.answered} / {questionnaireProgress.total}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-[#0A0A0A] rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] transition-all duration-500"
                                                            style={{ width: `${questionnaireProgress.pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-gray-400 text-sm leading-relaxed">
                                                    {questionnaireProgress.answered === 0
                                                        ? 'مازال ما بديتي الاستبيان — كملو باش نلقاو ليك المشروع المناسب.'
                                                        : `وصلتي للجزء ${submission?.current_block ?? 1} من 9. كمل من فين وقفتي.`}
                                                </p>
                                                <Link
                                                    href="/dashboard/coaching/questionnaire"
                                                    className="inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] hover:opacity-90 text-white font-bold py-4 rounded-xl transition"
                                                >
                                                    <span>{questionnaireProgress.answered === 0 ? 'بدء الاستبيان' : 'كمل من فين وقفتي'}</span>
                                                    <ArrowLeft className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        )}

                                        {step.key === 'analyzing' && (
                                            <div className="space-y-5 text-center">
                                                <div className="w-16 h-16 mx-auto rounded-full bg-[#C5A04E]/10 border border-[#C5A04E]/30 flex items-center justify-center">
                                                    <Hourglass className="w-7 h-7 text-[#C5A04E] animate-pulse" />
                                                </div>
                                                <h4 className="text-white text-lg font-bold">كنحللو الملف الشخصي ديالك...</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">
                                                    البيلان ديالك غادي يكون جاهز في أقل من <strong className="text-[#C5A04E]">48 ساعة</strong>.
                                                    غادي توصلك إشعار ملي يكون متاح هنا.
                                                </p>
                                                <AnalyzingProgress />
                                            </div>
                                        )}

                                        {step.key === 'bilan' && submission?.bilan_content && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-[#C5A04E]">
                                                    <FileText className="w-5 h-5" />
                                                    <h4 className="font-bold">البيلان ديالك</h4>
                                                </div>
                                                <div className="bg-[#0A0A0A] border border-[#C5A04E]/10 rounded-xl p-5">
                                                    <MarkdownPanel content={submission.bilan_content} />
                                                </div>
                                            </div>
                                        )}

                                        {step.key === 'plan' && submission?.plan_content && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-[#C5A04E]">
                                                    <ListChecks className="w-5 h-5" />
                                                    <h4 className="font-bold">خطة العمل</h4>
                                                </div>
                                                <div className="bg-[#0A0A0A] border border-[#C5A04E]/10 rounded-xl p-5">
                                                    <MarkdownPanel content={submission.plan_content} />
                                                </div>
                                                <a
                                                    href="https://t.me/ecomyyy"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#E8600A] to-[#F97316] hover:opacity-90 text-white font-bold py-4 rounded-xl transition"
                                                >
                                                    <MessageCircle className="w-5 h-5" />
                                                    <span>تواصل معنا باش نبداو</span>
                                                </a>
                                            </div>
                                        )}

                                        {step.key === 'tracker' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-[#C5A04E]">
                                                    <Activity className="w-5 h-5" />
                                                    <h4 className="font-bold">تقدم المشروع</h4>
                                                </div>
                                                <ProjectStepsView steps={submission?.project_steps || []} />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Completed-state summaries */}
                                {isCompleted && step.key === 'questionnaire' && (
                                    <div className="bg-[#111111]/30 border border-green-500/10 rounded-xl px-5 py-3 mt-3">
                                        <p className="text-gray-400 text-sm">
                                            <span className="text-gray-500">تم الاستبيان كامل —</span>{' '}
                                            <span className="text-white">{questionnaireProgress.answered} جواب</span>
                                        </p>
                                    </div>
                                )}
                                {isCompleted && step.key === 'bilan' && submission?.bilan_published_at && (
                                    <div className="bg-[#111111]/30 border border-green-500/10 rounded-xl px-5 py-3 mt-3">
                                        <p className="text-gray-400 text-sm">
                                            <span className="text-gray-500">نشر البيلان:</span>{' '}
                                            <span className="text-white">
                                                {new Date(submission.bilan_published_at).toLocaleDateString('ar-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Telegram help block */}
            <div className="pt-2">
                <TelegramHelpBlock />
            </div>
        </div>
    );
}
