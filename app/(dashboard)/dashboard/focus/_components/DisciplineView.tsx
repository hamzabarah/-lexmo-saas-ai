'use client';

import type { BadHabitWithChecks, HabitState } from '@/lib/focus/types';
import { HabitsTracker } from './HabitsTracker';
import { Card, Num } from './ui';

/**
 * Écran « الانضباط ».
 *
 * Recueille les surfaces de saisie que les deux écrans refondus ne peuvent
 * plus porter : « البيانات » est un agenda en lecture seule, et
 * « جلسات التركيز » doit rester sans distraction pendant une session.
 *
 * Même système visuel que les deux écrans validés : en-tête 32 px extrabold,
 * cartes blanches bord #E8E6DF radius 16, ombre discrète, jetons omq-*.
 */
export function DisciplineView({
    habits,
    todayIso,
    busyHabitId,
    urgentCount,
    onCycleHabit,
    onCreateHabit,
    onArchiveHabit,
    todayLabel,
}: {
    habits: BadHabitWithChecks[];
    todayIso: string;
    busyHabitId: string | null;
    urgentCount: number;
    onCycleHabit: (habit: BadHabitWithChecks, iso: string, next: HabitState | null) => void;
    onCreateHabit: (title: string, ruleNote: string) => Promise<boolean>;
    onArchiveHabit: (habit: BadHabitWithChecks) => void;
    todayLabel: string;
}) {
    // Habitudes tenues aujourd'hui, sur celles qui ont un relevé du jour.
    const checkedToday = habits.filter((h) => h.checks[todayIso] !== undefined).length;
    const avoidedToday = habits.filter((h) => h.checks[todayIso] === 'avoided').length;

    return (
        <>
            <header className="flex items-baseline justify-between mb-8 gap-4 flex-wrap">
                <h1 className="text-[32px] font-extrabold tracking-[-0.4px] text-omq-ink m-0">
                    الانضباط
                </h1>
                <div className="text-[13px] text-omq-muted">{todayLabel}</div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <Card className="p-6">
                    <div className="text-[13px] text-omq-muted mb-3">المهام العاجلة</div>
                    <div className="flex items-baseline gap-2">
                        <Num className="text-4xl font-extrabold text-omq-urgent tracking-[-1px] leading-none">
                            {urgentCount}
                        </Num>
                        {urgentCount > 0 && (
                            <span className="text-xs font-bold text-omq-urgent bg-omq-urgent-bg px-2.5 py-[3px] rounded-full">
                                تتطلب انتباهك
                            </span>
                        )}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="text-[13px] text-omq-muted mb-3">عادات مسجّلة اليوم</div>
                    <div className="flex items-baseline gap-2">
                        <Num className="text-4xl font-extrabold text-omq-ink tracking-[-1px] leading-none">
                            {checkedToday}
                        </Num>
                        <span className="text-xs text-omq-muted">
                            من <Num>{habits.length}</Num>
                        </span>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="text-[13px] text-omq-muted mb-3">تجنّبتها اليوم</div>
                    <div className="flex items-baseline gap-2">
                        <Num className="text-4xl font-extrabold text-omq-sage tracking-[-1px] leading-none">
                            {avoidedToday}
                        </Num>
                        <span className="text-xs text-omq-sage font-bold">عادة</span>
                    </div>
                </Card>
            </div>

            <HabitsTracker
                habits={habits}
                todayIso={todayIso}
                busyHabitId={busyHabitId}
                onCycle={onCycleHabit}
                onCreate={onCreateHabit}
                onArchive={onArchiveHabit}
            />
        </>
    );
}
