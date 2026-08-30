'use client';

import {
    DAILY_SESSION_GOAL,
    PROJECT_STATUS_LABELS,
    type BadHabitWithChecks,
    type FocusProject,
    type FocusTask,
    type HabitState,
} from '@/lib/focus/types';
import { Card, Dot, Num, Pill, TaskBadges } from './ui';
import { HabitsTracker } from './HabitsTracker';

function StatCard({
    label,
    value,
    valueClass = 'text-omq-ink',
    trailing,
}: {
    label: string;
    value: number;
    valueClass?: string;
    trailing?: React.ReactNode;
}) {
    return (
        <Card className="p-6">
            <div className="text-[13px] text-omq-muted mb-3">{label}</div>
            <div className="flex items-baseline gap-2">
                <span
                    dir="ltr"
                    className={`text-4xl font-extrabold tracking-[-1px] leading-none ${valueClass}`}
                >
                    {value}
                </span>
                {trailing}
            </div>
        </Card>
    );
}

/**
 * Section « البيانات » : les trois chiffres du jour, puis les projets.
 * Les cases à cocher écrivent le même `status` que le kanban — cocher ici fait
 * passer la tâche en « منجز » là-bas.
 */
export function DataView({
    projects,
    tasks,
    urgentCount,
    todaySessions,
    todayMinutes,
    onToggleDone,
    busyTaskId,
    habits,
    todayIso,
    busyHabitId,
    onCycleHabit,
    onCreateHabit,
    onArchiveHabit,
}: {
    projects: FocusProject[];
    tasks: FocusTask[];
    urgentCount: number;
    todaySessions: number;
    todayMinutes: number;
    onToggleDone: (task: FocusTask) => void;
    busyTaskId: string | null;
    habits: BadHabitWithChecks[];
    todayIso: string;
    busyHabitId: string | null;
    onCycleHabit: (habit: BadHabitWithChecks, iso: string, next: HabitState | null) => void;
    onCreateHabit: (title: string, ruleNote: string) => Promise<boolean>;
    onArchiveHabit: (habit: BadHabitWithChecks) => void;
}) {
    const today = new Date().toLocaleDateString('ar', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const primary = projects.filter((p) => p.status === 'vital');
    const secondary = projects.filter((p) => p.status !== 'vital');
    const tasksOf = (p: FocusProject) => tasks.filter((t) => t.project_id === p.id);

    return (
        <>
            <header className="flex items-baseline justify-between mb-8">
                <h1 className="text-[32px] font-extrabold tracking-[-0.4px] text-omq-ink m-0">
                    البيانات
                </h1>
                <div className="text-[13px] text-omq-muted">{today}</div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <StatCard
                    label="المهام العاجلة"
                    value={urgentCount}
                    valueClass={urgentCount > 0 ? 'text-omq-urgent' : 'text-omq-ink'}
                    trailing={
                        urgentCount > 0 ? (
                            <Pill tone="urgent">تتطلب انتباهك</Pill>
                        ) : (
                            <span className="text-xs text-omq-muted">لا شيء عاجل</span>
                        )
                    }
                />
                <StatCard
                    label="جلسات اليوم"
                    value={todaySessions}
                    valueClass="text-omq-accent"
                    trailing={
                        <span className="text-xs text-omq-muted">
                            من هدف <Num>{DAILY_SESSION_GOAL}</Num>
                        </span>
                    }
                />
                <StatCard
                    label="دقائق العمل اليوم"
                    value={todayMinutes}
                    trailing={<span className="text-xs font-bold text-omq-sage">دقيقة</span>}
                />
            </div>

            {projects.length === 0 && (
                <Card className="p-10 text-center text-[13px] text-omq-faint">
                    لا توجد مشاريع بعد.
                </Card>
            )}

            {primary.map((project) => {
                const list = tasksOf(project);
                return (
                    <section key={project.id} className="mb-8">
                        <div className="flex items-center gap-2.5 mb-3.5">
                            <Dot color={project.color} />
                            <span className="font-extrabold text-xl tracking-[-0.2px] text-omq-ink">
                                {project.name}
                            </span>
                            <Pill tone={project.status === 'vital' ? 'urgent' : 'neutral'}>
                                {PROJECT_STATUS_LABELS[project.status]}
                            </Pill>
                            <span className="mr-auto text-[12.5px] text-omq-faint">
                                <Num>{list.length}</Num> مهام
                            </span>
                        </div>

                        <Card className="overflow-hidden">
                            {list.length === 0 ? (
                                <div className="px-6 py-8 text-center text-[13px] text-omq-faint">
                                    لا توجد مهام في هذا المشروع.
                                </div>
                            ) : (
                                list.map((task, i) => (
                                    <button
                                        key={task.id}
                                        type="button"
                                        onClick={() => onToggleDone(task)}
                                        disabled={busyTaskId === task.id}
                                        className={`w-full flex items-center gap-3.5 px-6 py-4 text-right transition-colors hover:bg-omq-panel disabled:opacity-50 ${
                                            i < list.length - 1 ? 'border-b border-omq-divider' : ''
                                        }`}
                                    >
                                        <span
                                            className={`w-4 h-4 rounded-[5px] border-[1.5px] shrink-0 grid place-items-center transition-colors ${
                                                task.status === 'done'
                                                    ? 'bg-omq-sage border-omq-sage'
                                                    : 'bg-omq-surface border-omq-dot'
                                            }`}
                                        >
                                            {task.status === 'done' && (
                                                <svg
                                                    viewBox="0 0 12 12"
                                                    className="w-2.5 h-2.5"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M2 6.5 4.5 9 10 3"
                                                        fill="none"
                                                        stroke="#FFFFFF"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                        <span
                                            className={`text-sm flex-1 ${
                                                task.status === 'done'
                                                    ? 'text-omq-faint line-through'
                                                    : 'text-omq-ink'
                                            }`}
                                        >
                                            {task.title}
                                        </span>
                                        <TaskBadges task={task} />
                                    </button>
                                ))
                            )}
                        </Card>
                    </section>
                );
            })}

            {secondary.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {secondary.map((project) => {
                        const count = tasksOf(project).length;
                        return (
                            <Card
                                key={project.id}
                                className={`p-6 ${project.status === 'paused' ? 'opacity-[0.72]' : ''}`}
                            >
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <Dot color={project.color} />
                                    <span className="font-extrabold text-base text-omq-ink">
                                        {project.name}
                                    </span>
                                    <span className="mr-auto">
                                        <Pill tone="neutral">
                                            {PROJECT_STATUS_LABELS[project.status]}
                                        </Pill>
                                    </span>
                                </div>
                                <div className="text-[13px] text-omq-muted">
                                    {project.subtitle ?? (
                                        <span className="text-omq-faint">
                                            {count > 0 ? (
                                                <>
                                                    <Num>{count}</Num> مهام
                                                </>
                                            ) : (
                                                'بانتظار بقية التفاصيل…'
                                            )}
                                        </span>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

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
