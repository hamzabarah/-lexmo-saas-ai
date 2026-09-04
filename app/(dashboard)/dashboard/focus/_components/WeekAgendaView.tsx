'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    DAILY_MINUTES_GOAL,
    WEEK_DAY_LABELS,
    addDays,
    isoDate,
    startOfWeek,
    weekSessionMinutes,
    type WeekResponse,
    type WeekSession,
} from '@/lib/focus/types';
import { Num } from './ui';

/**
 * Écran « البيانات » — agenda hebdomadaire, LECTURE SEULE.
 * Maquette : design-reference/لوحة البيانات.dc.html, turn 5.
 *
 * Rien ne s'écrit ici. Tout vient des sessions déjà enregistrées par l'écran
 * « جلسات التركيز ». C'est un miroir, pas un formulaire.
 */

type DayBucket = { date: Date; iso: string; label: string; sessions: WeekSession[]; minutes: number };

function Stat({
    value,
    label,
    accent,
}: {
    value: string;
    label: string;
    accent?: 'accent' | 'sage';
}) {
    return (
        <div className="flex items-baseline gap-2">
            <Num
                className={`text-[22px] font-extrabold tracking-[-0.5px] ${
                    accent === 'accent' ? 'text-omq-accent' : 'text-omq-ink'
                }`}
            >
                {value}
            </Num>
            <span
                className={`text-xs ${
                    accent === 'accent' ? 'text-omq-accent-hover font-bold' : 'text-omq-muted'
                }`}
            >
                {label}
            </span>
        </div>
    );
}

function Divider() {
    return <span className="w-px h-6 bg-omq-divider shrink-0" />;
}

/** Bloc d'une session dans une colonne de jour. Repliable. */
function SessionBlock({
    session,
    projectName,
    projectColor,
    subtasks,
    open,
    onToggle,
    today,
}: {
    session: WeekSession;
    projectName: string | null;
    projectColor: string;
    subtasks: { id: string; title: string }[];
    open: boolean;
    onToggle: () => void;
    today: boolean;
}) {
    const running = session.status === 'running' || session.status === 'paused';
    const minutes = weekSessionMinutes(session);
    const note = session.notes?.trim() ?? '';

    return (
        <div
            onClick={onToggle}
            className={`bg-omq-surface rounded-[11px] p-3 shadow-[0_1px_3px_rgba(26,25,21,0.04)] min-h-24 cursor-pointer transition-shadow hover:shadow-[0_4px_12px_rgba(26,25,21,0.07)] border ${
                today ? 'border-[#EBD9CF]' : 'border-omq-border'
            }`}
        >
            <div className="flex items-start gap-1.5 mb-1.5">
                <span className="text-[12.5px] font-bold leading-[1.5] flex-1 min-w-0 [overflow-wrap:anywhere] text-omq-ink">
                    {session.task_title}
                </span>
                <span className="text-[10px] text-omq-faint shrink-0">{open ? '⌃' : '⌄'}</span>
            </div>

            <div className="flex items-center gap-1.5 mb-2">
                {projectName && (
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] text-omq-muted min-w-0">
                        <span
                            className="w-[5px] h-[5px] rounded-full shrink-0"
                            style={{ background: projectColor }}
                        />
                        <span className="truncate">{projectName}</span>
                    </span>
                )}
                {running ? (
                    <span className="mr-auto inline-flex items-center gap-1.5 text-[10.5px] font-bold text-omq-sage shrink-0">
                        <span className="w-[5px] h-[5px] rounded-full bg-omq-sage" />
                        جارية الآن
                    </span>
                ) : (
                    <span className="mr-auto text-[10.5px] font-bold text-omq-accent shrink-0">
                        <Num>{minutes}</Num> دقيقة
                    </span>
                )}
            </div>

            {/* La note « ماذا أنجزت » est VISIBLE, tronquée à une ligne. */}
            <div
                className={`text-[11px] text-omq-faint leading-[1.6] [overflow-wrap:anywhere] ${
                    open ? '' : 'overflow-hidden text-ellipsis whitespace-nowrap'
                }`}
            >
                {running && !note ? 'الجلسة قيد التقدم…' : note || '—'}
            </div>

            {open && subtasks.length > 0 && (
                <div className="mt-2 border-t border-omq-divider pt-2 flex flex-col gap-1.5">
                    {subtasks.map((s) => (
                        <span
                            key={s.id}
                            className="inline-flex items-start gap-1.5 text-[10.5px] text-[#6E7F47]"
                        >
                            <b className="font-extrabold shrink-0">✓</b>
                            <span className="[overflow-wrap:anywhere]">{s.title}</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export function WeekAgendaView() {
    const [offset, setOffset] = useState(0);
    const [data, setData] = useState<WeekResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState<Set<string>>(new Set());

    const weekStart = useMemo(() => addDays(startOfWeek(new Date()), offset * 7), [offset]);
    const todayIso = isoDate(new Date());

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetch(`/api/focus/week?start=${isoDate(weekStart)}`, { credentials: 'include' })
            .then((r) => (r.ok ? r.json() : null))
            .then((json) => {
                if (!cancelled) setData(json);
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [weekStart]);

    const toggle = useCallback((id: string) => {
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const projectById = useMemo(() => {
        const map = new Map<string, { name: string; color: string }>();
        for (const p of data?.projects ?? []) map.set(p.id, { name: p.name, color: p.color });
        return map;
    }, [data]);

    const days: DayBucket[] = useMemo(() => {
        const out: DayBucket[] = [];
        for (let i = 0; i < 7; i += 1) {
            const date = addDays(weekStart, i);
            const iso = isoDate(date);
            const sessions = (data?.sessions ?? []).filter((s) => s.started_at.slice(0, 10) === iso);
            const minutes = sessions.reduce((acc, s) => acc + weekSessionMinutes(s), 0);
            out.push({ date, iso, label: WEEK_DAY_LABELS[i], sessions, minutes });
        }
        return out;
    }, [weekStart, data]);

    const totals = useMemo(() => {
        const sessions = (data?.sessions ?? []).filter((s) => s.status === 'completed');
        const minutes = sessions.reduce((acc, s) => acc + weekSessionMinutes(s), 0);
        return {
            hours: (minutes / 60).toFixed(minutes % 60 === 0 ? 0 : 2).replace(/\.?0+$/, '') || '0',
            sessions: sessions.length,
            workedDays: days.filter((d) => d.minutes > 0).length,
        };
    }, [data, days]);

    /** Répartition du temps par projet, sur la semaine affichée. */
    const distribution = useMemo(() => {
        const byProject = new Map<string, number>();
        let total = 0;
        for (const s of data?.sessions ?? []) {
            const m = weekSessionMinutes(s);
            if (m <= 0) continue;
            const pid = s.focus_tasks?.project_id ?? '__none__';
            byProject.set(pid, (byProject.get(pid) ?? 0) + m);
            total += m;
        }
        if (total === 0) return [];
        return [...byProject.entries()]
            .map(([pid, m]) => ({
                id: pid,
                name: projectById.get(pid)?.name ?? 'أخرى',
                color: projectById.get(pid)?.color ?? '#DDD9CE',
                pct: Math.round((m / total) * 100),
            }))
            .sort((a, b) => b.pct - a.pct);
    }, [data, projectById]);

    /** Série de jours consécutifs travaillés, en remontant depuis aujourd'hui. */
    const streak = useMemo(() => {
        const active = new Set(days.filter((d) => d.minutes > 0).map((d) => d.iso));
        const cursor = new Date();
        cursor.setHours(0, 0, 0, 0);
        if (!active.has(isoDate(cursor))) cursor.setDate(cursor.getDate() - 1);
        let n = 0;
        while (active.has(isoDate(cursor))) {
            n += 1;
            cursor.setDate(cursor.getDate() - 1);
        }
        return n;
    }, [days]);

    const subtasksOf = useCallback(
        (sessionId: string) =>
            (data?.subtasksBySession ?? []).filter((s) => s.completed_session_id === sessionId),
        [data]
    );

    const rangeLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1} – ${addDays(weekStart, 6).getDate()}/${addDays(weekStart, 6).getMonth() + 1}`;
    const maxMinutes = Math.max(DAILY_MINUTES_GOAL, ...days.map((d) => d.minutes));

    return (
        <div className="flex flex-col">
            {/* Barre du haut : navigation + les cinq chiffres */}
            <div className="flex items-center gap-4 flex-wrap mb-7">
                <h1 className="text-[32px] font-extrabold tracking-[-0.4px] text-omq-ink m-0">
                    البيانات
                </h1>
                <div className="flex items-center gap-1 bg-omq-surface border border-omq-border rounded-[10px] p-1 shadow-[0_1px_3px_rgba(26,25,21,0.04)]">
                    {/* RTL : « précédent » pointe vers la droite. */}
                    <button
                        type="button"
                        onClick={() => setOffset((o) => o - 1)}
                        aria-label="الأسبوع السابق"
                        className="w-7 h-7 grid place-items-center rounded-[7px] text-omq-muted text-sm hover:bg-omq-bg hover:text-omq-ink"
                    >
                        ›
                    </button>
                    <span className="text-[13px] font-bold px-3 text-omq-ink whitespace-nowrap">
                        {offset === 0 ? 'الأسبوع الحالي' : <Num>{rangeLabel}</Num>}
                    </span>
                    <button
                        type="button"
                        disabled={offset >= 0}
                        onClick={() => setOffset((o) => Math.min(0, o + 1))}
                        aria-label="الأسبوع التالي"
                        className="w-7 h-7 grid place-items-center rounded-[7px] text-omq-muted text-sm hover:bg-omq-bg hover:text-omq-ink disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        ‹
                    </button>
                </div>
                <span className="text-[13px] text-omq-muted">
                    <Num>{rangeLabel}</Num>
                </span>

                <div className="mr-auto flex items-center gap-6 flex-wrap bg-omq-surface border border-omq-border rounded-[14px] py-2.5 pr-3.5 pl-6 shadow-[0_2px_8px_rgba(26,25,21,0.04)]">
                    <div className="flex items-baseline gap-2 bg-[#F0F3E8] border border-[#DDE5CC] rounded-[10px] px-4 py-2">
                        <Num className="text-[26px] font-extrabold tracking-[-0.5px] text-[#6E7F47] leading-none">
                            {data?.completedTasks ?? 0}
                        </Num>
                        <span className="text-[12.5px] text-[#6E7F47] font-bold">
                            المهام المنجزة هذا الأسبوع
                        </span>
                    </div>
                    <Divider />
                    <Stat value={totals.hours} label="إجمالي الساعات" />
                    <Divider />
                    <Stat value={String(totals.sessions)} label="عدد الجلسات" />
                    <Divider />
                    <Stat value={String(totals.workedDays)} label="أيام العمل" />
                    <Divider />
                    <Stat value={String(streak)} label="🔥 سلسلة الأيام" accent="accent" />
                </div>
            </div>

            {/* Répartition du temps par projet */}
            <div className="flex items-center gap-4 flex-wrap mb-6">
                <span className="text-[12.5px] font-bold text-omq-muted shrink-0">
                    توزيع الوقت حسب المشروع
                </span>
                <div className="flex-1 min-w-[120px] h-2 rounded-full overflow-hidden flex bg-omq-bg">
                    {distribution.length === 0 ? (
                        <div className="w-full bg-omq-bg" />
                    ) : (
                        distribution.map((d) => (
                            <div key={d.id} style={{ width: `${d.pct}%`, background: d.color }} />
                        ))
                    )}
                </div>
                {distribution.map((d) => (
                    <span
                        key={d.id}
                        className="inline-flex items-center gap-1.5 text-[11.5px] text-omq-muted shrink-0"
                    >
                        <span
                            className="w-2 h-2 rounded-[3px]"
                            style={{ background: d.color }}
                        />
                        {d.name} <b className="font-bold"><Num>{d.pct}%</Num></b>
                    </span>
                ))}
            </div>

            {loading && !data ? (
                <div className="py-24 text-center text-[13px] text-omq-faint">جارٍ التحميل…</div>
            ) : (
                <>
                    {/* Grille de sept jours — largeurs strictement égales. */}
                    <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-3 mb-7 items-stretch">
                        {days.map((d) => {
                            const isToday = d.iso === todayIso;
                            return (
                                <div
                                    key={d.iso}
                                    className={`min-w-0 rounded-[14px] p-3 flex flex-col gap-2.5 ${
                                        isToday
                                            ? 'bg-[#F6EBE4] border-[1.5px] border-omq-accent shadow-[0_6px_20px_rgba(217,119,87,0.12)]'
                                            : 'bg-omq-bg'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-1">
                                        <div className="min-w-0">
                                            <div
                                                className={`text-[13px] ${
                                                    isToday
                                                        ? 'font-extrabold text-omq-accent-hover'
                                                        : 'font-bold text-omq-muted'
                                                }`}
                                            >
                                                {d.label}
                                            </div>
                                            <Num
                                                className={`text-[11px] ${
                                                    isToday
                                                        ? 'text-omq-accent-hover opacity-70'
                                                        : 'text-omq-faint'
                                                }`}
                                            >
                                                {d.date.getDate()}/{d.date.getMonth() + 1}
                                            </Num>
                                        </div>
                                        {isToday && (
                                            <span className="text-[10px] font-bold text-omq-panel bg-omq-accent px-2 py-0.5 rounded-full shrink-0">
                                                اليوم
                                            </span>
                                        )}
                                    </div>

                                    {d.minutes > 0 ? (
                                        <div className="flex items-baseline gap-1">
                                            <Num
                                                className={`text-[20px] font-extrabold tracking-[-0.5px] ${
                                                    isToday ? 'text-omq-accent-hover' : 'text-omq-ink'
                                                }`}
                                            >
                                                {d.minutes}
                                            </Num>
                                            <span
                                                className={`text-[11px] ${
                                                    isToday ? 'text-omq-accent-hover' : 'text-omq-muted'
                                                }`}
                                            >
                                                دقيقة
                                            </span>
                                        </div>
                                    ) : (
                                        <Num className="text-[20px] font-extrabold tracking-[-0.5px] text-omq-dot">
                                            0
                                        </Num>
                                    )}

                                    {d.sessions.length === 0 ? (
                                        <div className="flex-1 grid place-items-center text-xs text-[#B5B2A6]">
                                            لا جلسات
                                        </div>
                                    ) : (
                                        d.sessions.map((s) => {
                                            const pid = s.focus_tasks?.project_id ?? null;
                                            const proj = pid ? projectById.get(pid) : undefined;
                                            return (
                                                <SessionBlock
                                                    key={s.id}
                                                    session={s}
                                                    projectName={proj?.name ?? null}
                                                    projectColor={proj?.color ?? '#DDD9CE'}
                                                    subtasks={subtasksOf(s.id)}
                                                    open={open.has(s.id)}
                                                    onToggle={() => toggle(s.id)}
                                                    today={isToday}
                                                />
                                            );
                                        })
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Graphique — même grille, donc alignement exact. */}
                    <div>
                        <div className="flex items-baseline justify-between mb-4.5 gap-3 flex-wrap">
                            <span className="text-sm font-bold text-omq-ink">دقائق العمل اليومية</span>
                            <span className="inline-flex items-center gap-2 text-[11.5px] text-omq-muted">
                                <span className="w-[18px] border-t-2 border-dashed border-omq-dot" />
                                الهدف اليومي: <Num>{DAILY_MINUTES_GOAL}</Num> دقيقة
                            </span>
                        </div>
                        <div className="relative h-[120px]">
                            <div
                                className="absolute left-0 right-0 border-t-2 border-dashed border-[#E0DDD2]"
                                style={{ bottom: `${(DAILY_MINUTES_GOAL / maxMinutes) * 100}%` }}
                            />
                            <div className="relative h-full grid grid-cols-[repeat(7,minmax(0,1fr))] gap-3 items-end">
                                {days.map((d) => {
                                    const isToday = d.iso === todayIso;
                                    const h =
                                        d.minutes > 0
                                            ? Math.max(6, (d.minutes / maxMinutes) * 100)
                                            : 0;
                                    return (
                                        <div
                                            key={d.iso}
                                            className="h-full flex flex-col items-center justify-end gap-1.5 min-w-0"
                                        >
                                            <div
                                                className="w-full max-w-[44px]"
                                                style={{
                                                    height: d.minutes > 0 ? `${h}%` : 3,
                                                    minHeight: 3,
                                                    borderRadius: d.minutes > 0 ? '6px 6px 3px 3px' : 3,
                                                    background:
                                                        d.minutes === 0
                                                            ? '#E8E6DF'
                                                            : d.minutes >= DAILY_MINUTES_GOAL
                                                              ? '#D97757'
                                                              : '#E5A88F',
                                                }}
                                            />
                                            <span
                                                className={`text-[11px] truncate max-w-full ${
                                                    isToday
                                                        ? 'text-omq-accent-hover font-extrabold'
                                                        : d.minutes > 0
                                                          ? 'text-omq-muted font-bold'
                                                          : 'text-omq-faint'
                                                }`}
                                            >
                                                {d.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
