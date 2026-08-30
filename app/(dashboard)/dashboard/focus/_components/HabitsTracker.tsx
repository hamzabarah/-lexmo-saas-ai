'use client';

import { useState } from 'react';
import {
    HABIT_WINDOW_DAYS,
    habitStreak,
    lastDays,
    nextHabitState,
    type BadHabitWithChecks,
    type HabitState,
} from '@/lib/focus/types';
import { Card, Num } from './ui';

const DAY_LETTERS = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']; // dimanche → samedi

function dayLetter(iso: string): string {
    return DAY_LETTERS[new Date(`${iso}T00:00:00Z`).getUTCDay()];
}

/** Une pastille de jour : vide, évitée, ou craqué. */
function DayCell({
    iso,
    state,
    isToday,
    disabled,
    onClick,
}: {
    iso: string;
    state: HabitState | undefined;
    isToday: boolean;
    disabled: boolean;
    onClick: () => void;
}) {
    const base =
        'w-9 h-9 rounded-[10px] grid place-items-center text-[13px] font-bold transition-colors border';

    const skin =
        state === 'avoided'
            ? 'bg-[#EDF1E4] text-omq-sage border-[#DCE4CE]'
            : state === 'failed'
              ? 'bg-omq-urgent-bg text-omq-urgent border-[#F2D8D3]'
              : 'bg-omq-bg text-omq-faint border-transparent hover:border-omq-border-strong';

    const label =
        state === 'avoided' ? 'تجنبتها' : state === 'failed' ? 'لم أتجنبها' : 'غير مسجل';

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={`${iso} — ${label}`}
            aria-label={`${iso} — ${label}`}
            className={`${base} ${skin} ${isToday ? 'ring-2 ring-omq-accent/30' : ''} disabled:opacity-50`}
        >
            {state === 'avoided' ? '✓' : state === 'failed' ? '✗' : ''}
        </button>
    );
}

function HabitRow({
    habit,
    days,
    todayIso,
    busy,
    onCycle,
    onArchive,
}: {
    habit: BadHabitWithChecks;
    days: string[];
    todayIso: string;
    busy: boolean;
    onCycle: (habit: BadHabitWithChecks, iso: string) => void;
    onArchive: (habit: BadHabitWithChecks) => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const streak = habitStreak(habit.checks, todayIso);

    return (
        <div className="flex flex-wrap items-center gap-4 px-6 py-5 border-b border-omq-divider last:border-b-0">
            <div className="min-w-[180px] flex-1">
                <div className="text-sm font-bold text-omq-ink">{habit.title}</div>
                {habit.rule_note && (
                    <div className="text-[12px] text-omq-muted mt-1">{habit.rule_note}</div>
                )}
            </div>

            {/* Bande des 7 derniers jours : le plus ancien en premier, donc à
                droite en RTL ; aujourd'hui se lit en dernier, à gauche. */}
            <div className="flex items-center gap-1.5">
                {days.map((iso) => (
                    <div key={iso} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-omq-faint">{dayLetter(iso)}</span>
                        <DayCell
                            iso={iso}
                            state={habit.checks[iso]}
                            isToday={iso === todayIso}
                            disabled={busy}
                            onClick={() => onCycle(habit, iso)}
                        />
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 min-w-[120px] justify-end">
                <span
                    className={`text-[12px] font-bold px-3 py-1.5 rounded-full ${
                        streak > 0
                            ? 'text-omq-sage bg-[#EDF1E4]'
                            : 'text-omq-muted bg-omq-bg'
                    }`}
                >
                    سلسلة: <Num>{streak}</Num> يوم
                </span>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="خيارات"
                        className="w-8 h-8 rounded-lg text-omq-faint grid place-items-center transition-colors hover:bg-omq-bg hover:text-omq-ink"
                    >
                        ⋯
                    </button>

                    {menuOpen && (
                        <>
                            <button
                                type="button"
                                aria-hidden="true"
                                tabIndex={-1}
                                className="fixed inset-0 z-10 cursor-default"
                                onClick={() => setMenuOpen(false)}
                            />
                            <div className="absolute left-0 top-9 z-20 w-44 bg-omq-surface border border-omq-border rounded-xl shadow-[0_6px_16px_rgba(26,25,21,0.08)] overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onArchive(habit);
                                    }}
                                    className="w-full text-right px-4 py-3 text-[13px] text-omq-muted transition-colors hover:bg-omq-panel hover:text-omq-ink"
                                >
                                    أرشفة العادة
                                    <span className="block text-[11px] text-omq-faint mt-0.5">
                                        تختفي من القائمة، ويبقى سجلها
                                    </span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Suivi des habitudes à éviter.
 *
 * Le succès est ici l'absence d'action : une pastille verte signifie « je ne
 * l'ai pas fait ». Le cycle du clic est vide → évitée → craqué → vide, pour
 * qu'une erreur de saisie se corrige sans quitter la ligne.
 */
export function HabitsTracker({
    habits,
    todayIso,
    busyHabitId,
    onCycle,
    onCreate,
    onArchive,
}: {
    habits: BadHabitWithChecks[];
    todayIso: string;
    busyHabitId: string | null;
    onCycle: (habit: BadHabitWithChecks, iso: string, next: HabitState | null) => void;
    onCreate: (title: string, ruleNote: string) => Promise<boolean>;
    onArchive: (habit: BadHabitWithChecks) => void;
}) {
    const [adding, setAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [ruleNote, setRuleNote] = useState('');
    const [saving, setSaving] = useState(false);

    const days = lastDays(HABIT_WINDOW_DAYS, todayIso);

    const submit = async () => {
        if (!title.trim()) return;
        setSaving(true);
        const ok = await onCreate(title.trim(), ruleNote.trim());
        setSaving(false);
        if (ok) {
            setTitle('');
            setRuleNote('');
            setAdding(false);
        }
    };

    return (
        <section className="mt-8">
            <div className="flex items-center gap-2.5 mb-3.5">
                <span aria-hidden="true">🚫</span>
                <h2 className="font-extrabold text-xl tracking-[-0.2px] text-omq-ink m-0">
                    عادات يجب تجنبها
                </h2>
                <button
                    type="button"
                    onClick={() => setAdding((v) => !v)}
                    className="mr-auto text-[12.5px] text-omq-muted transition-colors hover:text-omq-accent"
                >
                    + إضافة عادة
                </button>
            </div>

            <Card className="overflow-visible">
                {habits.length === 0 && !adding && (
                    <div className="px-6 py-8 text-center text-[13px] text-omq-faint">
                        لا توجد عادات مسجلة.
                    </div>
                )}

                {habits.map((habit) => (
                    <HabitRow
                        key={habit.id}
                        habit={habit}
                        days={days}
                        todayIso={todayIso}
                        busy={busyHabitId === habit.id}
                        onCycle={(h, iso) => onCycle(h, iso, nextHabitState(h.checks[iso]))}
                        onArchive={onArchive}
                    />
                ))}

                {adding && (
                    <div className="px-6 py-5 border-t border-omq-divider bg-omq-panel">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="اسم العادة"
                                maxLength={160}
                                className="flex-1 bg-omq-surface border border-omq-border rounded-xl px-4 py-2.5 text-sm text-omq-ink outline-none focus:border-omq-accent transition-colors"
                            />
                            <input
                                value={ruleNote}
                                onChange={(e) => setRuleNote(e.target.value)}
                                placeholder="القاعدة (اختياري)"
                                maxLength={160}
                                className="flex-1 bg-omq-surface border border-omq-border rounded-xl px-4 py-2.5 text-sm text-omq-ink outline-none focus:border-omq-accent transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                            <button
                                type="button"
                                onClick={submit}
                                disabled={saving || !title.trim()}
                                className="px-5 py-2 rounded-xl bg-omq-accent text-omq-panel font-bold text-sm transition-colors hover:bg-omq-accent-hover disabled:opacity-40"
                            >
                                إضافة
                            </button>
                            <button
                                type="button"
                                onClick={() => setAdding(false)}
                                className="px-4 py-2 rounded-xl border border-omq-border bg-omq-surface text-sm text-omq-muted transition-colors hover:bg-omq-panel"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </section>
    );
}
