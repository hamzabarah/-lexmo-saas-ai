"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    FileText, ListChecks, Activity, X, Save, CheckCircle, Eye, Edit3,
    Plus, Trash2, MessageSquare, ClipboardList, Send, AlertCircle, Sparkles,
} from "lucide-react";
import { BLOCKS, getQuestion, type ResponsesMap } from "@/lib/diagnostic-questions";

type SubmissionStatus = 'in_progress' | 'completed' | 'analyzing' | 'bilan_published' | 'plan_published' | 'in_development';

interface ProjectStep {
    step: string;
    status: 'done' | 'in_progress' | 'locked';
}

interface AdminSubmission {
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
    email: string | null;
    user_name: string | null;
    client_name: string | null;
}

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string }> = {
    in_progress:     { label: '⏳ قيد التعبئة',     color: 'text-orange-400 bg-orange-500/10' },
    completed:       { label: '✅ تم الإرسال',       color: 'text-blue-400 bg-blue-500/10' },
    analyzing:       { label: '🔍 جاري التحليل',     color: 'text-purple-400 bg-purple-500/10' },
    bilan_published: { label: '📊 تم نشر البيلان',   color: 'text-green-400 bg-green-500/10' },
    plan_published:  { label: '📋 تم نشر الخطة',     color: 'text-emerald-400 bg-emerald-500/10' },
    in_development:  { label: '🚀 قيد التنفيذ',     color: 'text-cyan-400 bg-cyan-500/10' },
};

const STATUS_OPTIONS: SubmissionStatus[] = ['in_progress', 'completed', 'analyzing', 'bilan_published', 'plan_published', 'in_development'];

function MarkdownPreview({ content }: { content: string }) {
    return (
        <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-[#C5A04E] prose-headings:font-bold
            prose-p:text-gray-300 prose-strong:text-white
            prose-li:text-gray-300 prose-a:text-[#C5A04E]
            prose-hr:border-[#C5A04E]/20
            prose-blockquote:border-r-[#C5A04E] prose-blockquote:border-r-4 prose-blockquote:border-l-0 prose-blockquote:text-gray-400
            prose-code:text-[#C5A04E] prose-code:bg-[#0A0A0A] prose-code:rounded prose-code:px-1 prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    );
}

function MarkdownEditor({
    label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    const [tab, setTab] = useState<'edit' | 'preview'>('edit');
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-[#C5A04E] font-bold">{label}</label>
                <div className="flex bg-[#0A0A0A] border border-[#C5A04E]/10 rounded-lg p-0.5">
                    <button
                        onClick={() => setTab('edit')}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition ${
                            tab === 'edit' ? 'bg-[#C5A04E]/20 text-[#C5A04E]' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <Edit3 className="w-3 h-3" />
                        <span>تحرير</span>
                    </button>
                    <button
                        onClick={() => setTab('preview')}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition ${
                            tab === 'preview' ? 'bg-[#C5A04E]/20 text-[#C5A04E]' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <Eye className="w-3 h-3" />
                        <span>معاينة</span>
                    </button>
                </div>
            </div>
            {tab === 'edit' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={14}
                    className="w-full bg-[#0A0A0A] border border-[#C5A04E]/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] focus:border-[#C5A04E] resize-y font-mono text-sm leading-relaxed"
                    style={{ direction: 'rtl' }}
                />
            ) : (
                <div className="bg-[#0A0A0A] border border-[#C5A04E]/20 rounded-xl px-5 py-4 min-h-[300px]">
                    {value.trim() ? (
                        <MarkdownPreview content={value} />
                    ) : (
                        <p className="text-gray-600 text-sm text-center py-12">— لا يوجد محتوى للمعاينة —</p>
                    )}
                </div>
            )}
        </div>
    );
}

function ResponsesByBlock({ responses }: { responses: ResponsesMap }) {
    const groupedByBlock = useMemo(() => {
        const groups: Record<number, { id: number; question: string; type: string; answer: string | string[] }[]> = {};
        for (const idStr of Object.keys(responses)) {
            const id = Number(idStr);
            const q = getQuestion(id);
            if (!q) continue;
            const r = responses[idStr];
            if (!groups[q.block]) groups[q.block] = [];
            groups[q.block].push({ id, question: r.question || q.text, type: r.type, answer: r.answer });
        }
        for (const k of Object.keys(groups)) {
            groups[Number(k)].sort((a, b) => a.id - b.id);
        }
        return groups;
    }, [responses]);

    if (!Object.keys(groupedByBlock).length) {
        return <p className="text-gray-500 text-sm text-center py-8">لا توجد أجوبة بعد</p>;
    }

    return (
        <div className="space-y-5">
            {BLOCKS.map(block => {
                const items = groupedByBlock[block.id];
                if (!items?.length) return null;
                return (
                    <div key={block.id}>
                        <h4 className="text-[#C5A04E] font-bold text-sm mb-3 flex items-center gap-2 sticky top-0 bg-[#111111] py-1">
                            <span>📋 الجزء {block.id} — {block.title}</span>
                            <span className="text-gray-600 font-normal">({items.length})</span>
                        </h4>
                        <div className="space-y-2">
                            {items.map(item => (
                                <div key={item.id} className="bg-[#0A0A0A] rounded-lg p-3 border border-[#C5A04E]/5">
                                    <p className="text-gray-500 text-xs mb-1">
                                        <span className="text-gray-600">#{item.id}</span> {item.question}
                                    </p>
                                    {Array.isArray(item.answer) ? (
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {item.answer.map((a, i) => (
                                                <span key={i} className="bg-[#C5A04E]/10 text-[#C5A04E] text-xs font-bold px-2 py-1 rounded">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-white text-sm whitespace-pre-wrap">{item.answer || '-'}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ProjectStepsEditor({
    steps, onChange,
}: { steps: ProjectStep[]; onChange: (steps: ProjectStep[]) => void }) {
    const [newStep, setNewStep] = useState('');

    const updateStatus = (idx: number, status: ProjectStep['status']) => {
        const next = [...steps];
        next[idx] = { ...next[idx], status };
        onChange(next);
    };
    const updateText = (idx: number, text: string) => {
        const next = [...steps];
        next[idx] = { ...next[idx], step: text };
        onChange(next);
    };
    const remove = (idx: number) => {
        onChange(steps.filter((_, i) => i !== idx));
    };
    const add = () => {
        if (!newStep.trim()) return;
        onChange([...steps, { step: newStep.trim(), status: 'locked' }]);
        setNewStep('');
    };

    return (
        <div className="space-y-3">
            <p className="text-gray-500 text-sm">أضف خطوات المشروع وحدد حالة كل خطوة. العميل غادي يشوف هاد القائمة في الخطوة 6.</p>

            {steps.length > 0 ? (
                <div className="space-y-2">
                    {steps.map((s, i) => (
                        <div key={i} className="bg-[#0A0A0A] border border-[#C5A04E]/10 rounded-xl p-3 flex items-center gap-2">
                            <span className="text-gray-500 text-xs font-bold w-6 shrink-0 text-center">{i + 1}</span>
                            <input
                                type="text"
                                value={s.step}
                                onChange={e => updateText(i, e.target.value)}
                                className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                            />
                            <select
                                value={s.status}
                                onChange={e => updateStatus(i, e.target.value as ProjectStep['status'])}
                                className="bg-[#1A1A1A] border border-[#C5A04E]/10 text-white text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#C5A04E]"
                            >
                                <option value="locked">🔒 لم يبدأ</option>
                                <option value="in_progress">⏳ جاري</option>
                                <option value="done">✅ تم</option>
                            </select>
                            <button
                                onClick={() => remove(i)}
                                className="text-red-400 hover:text-red-300 transition p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-sm text-center py-4">— لا توجد خطوات بعد —</p>
            )}

            <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#C5A04E]/10 rounded-xl p-2">
                <input
                    type="text"
                    value={newStep}
                    onChange={e => setNewStep(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newStep.trim()) { e.preventDefault(); add(); } }}
                    placeholder="مثال: تحليل السوق"
                    className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 px-2 focus:outline-none"
                />
                <button
                    onClick={add}
                    disabled={!newStep.trim()}
                    className="flex items-center gap-1 bg-[#C5A04E] hover:bg-[#D4B85C] text-white text-xs font-bold px-3 py-2 rounded transition disabled:opacity-40"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>أضف</span>
                </button>
            </div>
        </div>
    );
}

interface DiagnosticModalProps {
    submission: AdminSubmission;
    onClose: () => void;
    onUpdated: (s: AdminSubmission) => void;
}

function DiagnosticModal({ submission, onClose, onUpdated }: DiagnosticModalProps) {
    const [tab, setTab] = useState<'answers' | 'bilan' | 'plan' | 'tracker'>('answers');
    const [bilan, setBilan] = useState(submission.bilan_content || '');
    const [plan, setPlan] = useState(submission.plan_content || '');
    const [steps, setSteps] = useState<ProjectStep[]>(submission.project_steps || []);
    const [status, setStatus] = useState<SubmissionStatus>(submission.status);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const callPatch = useCallback(async (body: Record<string, any>) => {
        setSaving(true);
        setFeedback(null);
        try {
            const res = await fetch(`/api/admin/diagnostic-submissions/${submission.user_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) {
                setFeedback({ type: 'error', text: data.error || 'فشل الحفظ' });
                return null;
            }
            onUpdated(data.submission);
            setFeedback({ type: 'success', text: 'تم الحفظ ✅' });
            setTimeout(() => setFeedback(null), 2500);
            return data.submission as AdminSubmission;
        } catch (err: any) {
            setFeedback({ type: 'error', text: err.message || 'فشل الحفظ' });
            return null;
        } finally {
            setSaving(false);
        }
    }, [submission.user_id, onUpdated]);

    const handleSaveBilan = async (publish: boolean) => {
        const body: Record<string, any> = { bilan_content: bilan };
        if (publish) body.publish = 'bilan';
        const updated = await callPatch(body);
        if (updated) setStatus(updated.status);
    };
    const handleSavePlan = async (publish: boolean) => {
        const body: Record<string, any> = { plan_content: plan };
        if (publish) body.publish = 'plan';
        const updated = await callPatch(body);
        if (updated) setStatus(updated.status);
    };
    const handleSaveSteps = async (advanceToInDevelopment: boolean) => {
        const body: Record<string, any> = { project_steps: steps };
        if (advanceToInDevelopment) body.publish = 'development';
        const updated = await callPatch(body);
        if (updated) setStatus(updated.status);
    };
    const handleStatusChange = async (next: SubmissionStatus) => {
        setStatus(next);
        await callPatch({ status: next });
    };

    const tabs = [
        { key: 'answers' as const, label: 'الأجوبة', icon: MessageSquare },
        { key: 'bilan' as const,   label: 'البيلان', icon: FileText },
        { key: 'plan' as const,    label: 'خطة العمل', icon: ListChecks },
        { key: 'tracker' as const, label: 'متابعة المشروع', icon: Activity },
    ];

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-[#C5A04E]/10 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            {submission.client_name || submission.user_name || 'بدون اسم'}
                        </h2>
                        <p className="text-gray-500 text-sm" dir="ltr">{submission.email || submission.user_id}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <select
                                value={status}
                                onChange={e => handleStatusChange(e.target.value as SubmissionStatus)}
                                disabled={saving}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] cursor-pointer ${STATUS_CONFIG[status].color}`}
                            >
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s} className="bg-[#1A1A1A] text-white">
                                        {STATUS_CONFIG[s].label}
                                    </option>
                                ))}
                            </select>
                            {feedback && (
                                <span className={`text-xs font-bold ${
                                    feedback.type === 'success' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {feedback.text}
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition shrink-0">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#C5A04E]/10 px-2 overflow-x-auto shrink-0">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        const active = tab === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${
                                    active
                                        ? 'border-[#C5A04E] text-[#C5A04E]'
                                        : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{t.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">
                    {tab === 'answers' && <ResponsesByBlock responses={submission.responses} />}

                    {tab === 'bilan' && (
                        <div className="space-y-4">
                            <MarkdownEditor
                                label="محتوى البيلان (Markdown)"
                                value={bilan}
                                onChange={setBilan}
                                placeholder="# تحليل وضعيتك&#10;&#10;## نقاط القوة&#10;- ...&#10;&#10;## التوصية&#10;..."
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleSaveBilan(false)}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 border border-[#C5A04E]/30 hover:border-[#C5A04E] text-[#C5A04E] font-bold py-3 rounded-xl transition disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>حفظ مسودة</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('هل تريد نشر البيلان؟ غادي يبان للعميل فورا.')) {
                                            handleSaveBilan(true);
                                        }
                                    }}
                                    disabled={saving || !bilan.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] hover:opacity-90 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>نشر البيلان</span>
                                </button>
                            </div>
                            {submission.bilan_published_at && (
                                <p className="text-green-400 text-xs flex items-center gap-2">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    تم النشر يوم {new Date(submission.bilan_published_at).toLocaleString('ar-u-nu-latn')}
                                </p>
                            )}
                        </div>
                    )}

                    {tab === 'plan' && (
                        <div className="space-y-4">
                            <MarkdownEditor
                                label="محتوى خطة العمل (Markdown)"
                                value={plan}
                                onChange={setPlan}
                                placeholder="# خطة العمل&#10;&#10;## الأسبوع 1&#10;- ...&#10;&#10;## الأسبوع 2&#10;..."
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleSavePlan(false)}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 border border-[#C5A04E]/30 hover:border-[#C5A04E] text-[#C5A04E] font-bold py-3 rounded-xl transition disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>حفظ مسودة</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('هل تريد نشر خطة العمل؟')) {
                                            handleSavePlan(true);
                                        }
                                    }}
                                    disabled={saving || !plan.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] hover:opacity-90 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>نشر الخطة</span>
                                </button>
                            </div>
                            {submission.plan_published_at && (
                                <p className="text-green-400 text-xs flex items-center gap-2">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    تم النشر يوم {new Date(submission.plan_published_at).toLocaleString('ar-u-nu-latn')}
                                </p>
                            )}
                        </div>
                    )}

                    {tab === 'tracker' && (
                        <div className="space-y-5">
                            <ProjectStepsEditor steps={steps} onChange={setSteps} />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleSaveSteps(false)}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 border border-[#C5A04E]/30 hover:border-[#C5A04E] text-[#C5A04E] font-bold py-3 rounded-xl transition disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>حفظ التحديثات</span>
                                </button>
                                {status !== 'in_development' && (
                                    <button
                                        onClick={() => {
                                            if (confirm('تحويل الحالة إلى "قيد التنفيذ"؟ غادي يشوف العميل خطوات المشروع.')) {
                                                handleSaveSteps(true);
                                            }
                                        }}
                                        disabled={saving || steps.length === 0}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] hover:opacity-90 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span>تفعيل المتابعة</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function DiagnosticSubmissionsSection() {
    const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<AdminSubmission | null>(null);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/diagnostic-submissions');
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'فشل التحميل');
                return;
            }
            setSubmissions(data.submissions || []);
        } catch (err: any) {
            setError(err.message || 'فشل التحميل');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleUpdated = useCallback((updated: AdminSubmission) => {
        setSubmissions(prev => prev.map(s => s.user_id === updated.user_id
            ? { ...s, ...updated, email: s.email, user_name: s.user_name, client_name: s.client_name }
            : s));
        setSelected(prev => prev && prev.user_id === updated.user_id
            ? { ...prev, ...updated, email: prev.email, user_name: prev.user_name, client_name: prev.client_name }
            : prev);
    }, []);

    const counts = useMemo(() => {
        const result: Record<SubmissionStatus, number> = {
            in_progress: 0, completed: 0, analyzing: 0, bilan_published: 0, plan_published: 0, in_development: 0,
        };
        for (const s of submissions) result[s.status]++;
        return result;
    }, [submissions]);

    return (
        <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl overflow-hidden mt-8">
            <div className="p-6 border-b border-[#C5A04E]/10">
                <div className="flex items-center gap-3 mb-2">
                    <ClipboardList className="w-6 h-6 text-[#C5A04E]" />
                    <h2 className="text-2xl font-bold text-white">الديانوستيك (180 سؤال)</h2>
                </div>
                <p className="text-gray-500 text-sm">إدارة الاستبيانات، البيلانات، خطط العمل، ومتابعة المشاريع</p>

                {/* Status counters */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                    {STATUS_OPTIONS.map(s => (
                        <div key={s} className={`rounded-lg px-3 py-2 text-center ${STATUS_CONFIG[s].color}`}>
                            <p className="text-xl font-bold">{counts[s]}</p>
                            <p className="text-[10px] font-bold opacity-90 leading-tight">{STATUS_CONFIG[s].label.replace(/[^؀-ۿ\s]/g, '').trim()}</p>
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#1A1A1A]/50 border-b border-[#C5A04E]/10">
                        <tr>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">العميل</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">البريد</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الحالة</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الأجوبة</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">آخر تحديث</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">جاري التحميل...</td></tr>
                        )}
                        {!loading && submissions.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">لا توجد استبيانات بعد</td></tr>
                        )}
                        {submissions.map(s => {
                            const cfg = STATUS_CONFIG[s.status];
                            const numAnswers = Object.keys(s.responses || {}).length;
                            return (
                                <tr
                                    key={s.id}
                                    onClick={() => setSelected(s)}
                                    className="hover:bg-[#1A1A1A]/30 transition cursor-pointer"
                                >
                                    <td className="px-6 py-4 text-white text-sm font-semibold">
                                        {s.client_name || s.user_name || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm" dir="ltr">{s.email || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                                            {cfg.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">{numAnswers} / 180</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(s.updated_at).toLocaleString('ar-u-nu-latn', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selected && (
                <DiagnosticModal
                    submission={selected}
                    onClose={() => setSelected(null)}
                    onUpdated={handleUpdated}
                />
            )}
        </div>
    );
}
