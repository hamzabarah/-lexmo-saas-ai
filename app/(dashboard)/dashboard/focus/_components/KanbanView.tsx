'use client';

import { useMemo, useState } from 'react';
import type { FocusProject, FocusTask, TaskStatus } from '@/lib/focus/types';
import type { FocusSubtask } from '@/lib/hooks/useFocusSubtasks';
import { Dot, Num } from './ui';

/**
 * Écran « لوحة القيادة » — maquette design-reference/لوحة البيانات.dc.html, turn 4.
 *
 * Trois niveaux de lecture :
 *   1. PROJET      — rangée de chips au-dessus du board, filtre les cartes.
 *   2. TÂCHE       — la carte : titre, tag projet, badge عاجل, compteur de
 *                    sous-tâches et barre de progression.
 *   3. SOUS-TÂCHES — dépliage sur place au clic, cases à cocher.
 *
 * La colonne « قيد التنفيذ » n'a qu'un siège. Le refus vient du serveur
 * (PATCH /api/focus/tasks, code in_progress_seat_taken) ; ici on se contente
 * de le rendre lisible avant le clic.
 */

const ALL = '__all__';

function progressOf(subs: FocusSubtask[]) {
    const total = subs.length;
    const done = subs.filter((s) => s.is_completed).length;
    return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

function TaskCard({
    task,
    project,
    subtasks,
    expanded,
    onToggleExpand,
    onToggleSubtask,
    onMove,
    seated,
    busy,
    variant,
}: {
    task: FocusTask;
    project: FocusProject | undefined;
    subtasks: FocusSubtask[];
    expanded: boolean;
    onToggleExpand: () => void;
    onToggleSubtask: (s: FocusSubtask) => void;
    onMove: (task: FocusTask, status: TaskStatus) => void;
    seated: boolean;
    busy: boolean;
    variant: 'todo' | 'doing' | 'done';
}) {
    const { total, done, pct } = progressOf(subtasks);
    const isDone = variant === 'done';
    const isDoing = variant === 'doing';

    // Barre : verte quand tout est coché, terracotta sinon.
    const barColor = pct === 100 ? '#8A9A5B' : '#D97757';

    return (
        <article
            onClick={onToggleExpand}
            className={`bg-omq-surface rounded-[14px] cursor-pointer transition-shadow ${
                isDoing
                    ? 'border-[1.5px] border-omq-accent p-[18px] shadow-[0_6px_20px_rgba(217,119,87,0.14)]'
                    : `border border-omq-border p-4 shadow-[0_2px_8px_rgba(26,25,21,0.04)] ${
                          isDone ? 'opacity-75' : 'hover:shadow-[0_6px_16px_rgba(26,25,21,0.08)] hover:border-omq-border-strong'
                      }`
            } ${busy ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <div className="flex items-start gap-2 mb-3">
                <span
                    className={`flex-1 leading-[1.5] ${
                        isDoing
                            ? 'text-[15px] font-extrabold text-omq-ink'
                            : isDone
                              ? 'text-sm font-bold line-through text-omq-faint'
                              : 'text-sm font-bold text-omq-ink'
                    }`}
                >
                    {task.title}
                </span>
                {total > 0 && (
                    <span
                        className={`text-xs shrink-0 ${isDoing ? 'text-omq-accent-hover' : 'text-omq-faint'}`}
                    >
                        {expanded ? '⌃' : '⌄'}
                    </span>
                )}
            </div>

            {!isDone && (
                <div className="flex items-center gap-2 mb-3">
                    {task.priority === 'urgent' && (
                        <span className="text-[11px] font-bold text-omq-urgent bg-omq-urgent-bg px-2.5 py-[3px] rounded-full">
                            عاجل
                        </span>
                    )}
                    {project && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-omq-muted">
                            <Dot color={project.color} size={6} />
                            {project.name}
                        </span>
                    )}
                    {total > 0 && (
                        <Num className="mr-auto text-[11px] font-bold text-omq-muted">
                            {done}/{total}
                        </Num>
                    )}
                </div>
            )}

            {total > 0 && (
                <div
                    className="rounded-full bg-omq-bg overflow-hidden"
                    style={{ height: isDoing ? 5 : 4 }}
                >
                    <div
                        className="h-full rounded-full transition-[width] duration-300"
                        style={{ width: `${pct}%`, background: isDone ? '#8A9A5B' : barColor }}
                    />
                </div>
            )}

            {expanded && total > 0 && (
                <div
                    className={`mt-3.5 pt-3 border-t flex flex-col ${
                        isDoing ? 'border-[#F6EBE4] gap-[11px]' : 'border-omq-divider gap-2.5'
                    }`}
                >
                    {subtasks.map((s) => (
                        <div
                            key={s.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSubtask(s);
                            }}
                            className="flex items-center gap-2.5 cursor-pointer"
                        >
                            <span
                                className="rounded-[5px] shrink-0 grid place-items-center text-[10px] text-omq-panel border-[1.5px]"
                                style={{
                                    width: isDoing ? 17 : 16,
                                    height: isDoing ? 17 : 16,
                                    background: s.is_completed ? '#8A9A5B' : '#FFFFFF',
                                    borderColor: s.is_completed ? '#8A9A5B' : '#CFCCC2',
                                }}
                            >
                                {s.is_completed ? '✓' : ''}
                            </span>
                            <span
                                className={`${isDoing ? 'text-[13.5px]' : 'text-[13px]'} ${
                                    s.is_completed ? 'text-omq-faint line-through' : 'text-omq-ink'
                                }`}
                            >
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Repli tactile du glisser-déposer, absent des maquettes mais
                indispensable au doigt : le drag HTML5 ne marche pas sur mobile. */}
            <div
                className={`flex items-center gap-1 mt-3 pt-3 border-t ${
                    isDoing ? 'border-[#F6EBE4]' : 'border-omq-divider'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {variant !== 'todo' && (
                    <button
                        type="button"
                        onClick={() => onMove(task, variant === 'doing' ? 'todo' : 'in_progress')}
                        className="h-7 px-2.5 rounded-lg border border-omq-border text-[11px] text-omq-muted hover:bg-omq-bg"
                    >
                        {variant === 'doing' ? 'للتنفيذ' : 'قيد التنفيذ'}
                    </button>
                )}
                {variant !== 'done' && (
                    <button
                        type="button"
                        disabled={variant === 'todo' && seated}
                        title={
                            variant === 'todo' && seated
                                ? 'مهمة اليوم محجوزة — أنهِ المهمة الجارية أولاً'
                                : undefined
                        }
                        onClick={() => onMove(task, variant === 'todo' ? 'in_progress' : 'done')}
                        className="h-7 px-2.5 rounded-lg border border-omq-border text-[11px] text-omq-muted hover:bg-omq-bg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {variant === 'todo' ? 'قيد التنفيذ' : 'منجز'}
                    </button>
                )}
            </div>
        </article>
    );
}

export function KanbanView({
    projects,
    tasks,
    subtasksByTask,
    onMove,
    onToggleSubtask,
    busyTaskId,
    todayLabel,
}: {
    projects: FocusProject[];
    tasks: FocusTask[];
    subtasksByTask: Record<string, FocusSubtask[]>;
    onMove: (task: FocusTask, status: TaskStatus) => void;
    onToggleSubtask: (s: FocusSubtask) => void;
    busyTaskId: string | null;
    todayLabel: string;
}) {
    const [projectFilter, setProjectFilter] = useState<string>(ALL);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const visible = useMemo(
        () => (projectFilter === ALL ? tasks : tasks.filter((t) => t.project_id === projectFilter)),
        [tasks, projectFilter]
    );

    const todo = visible.filter((t) => t.status === 'todo');
    const doing = visible.filter((t) => t.status === 'in_progress');
    const done = visible.filter((t) => t.status === 'done');

    // Le siège est occupé dès qu'une tâche est « قيد التنفيذ », filtre projet
    // compris : on regarde donc `tasks` et non `visible`.
    const seated = tasks.some((t) => t.status === 'in_progress');

    const projectOf = (t: FocusTask) => projects.find((p) => p.id === t.project_id);

    const toggleExpand = (id: string) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const chips = [{ id: ALL, name: 'كل المشاريع', color: '#6B6A64' }, ...projects];

    const cardProps = (t: FocusTask, variant: 'todo' | 'doing' | 'done') => ({
        key: t.id,
        task: t,
        project: projectOf(t),
        subtasks: subtasksByTask[t.id] ?? [],
        expanded: expanded.has(t.id),
        onToggleExpand: () => toggleExpand(t.id),
        onToggleSubtask,
        onMove,
        seated,
        busy: busyTaskId === t.id,
        variant,
    });

    return (
        <>
            <header className="flex items-baseline justify-between mb-6">
                <h1 className="text-[32px] font-extrabold tracking-[-0.4px] text-omq-ink m-0">
                    لوحة القيادة
                </h1>
                <div className="text-[13px] text-omq-muted">{todayLabel}</div>
            </header>

            {/* Niveau 1 — PROJET */}
            <div className="flex gap-2.5 flex-wrap mb-7">
                {chips.map((c) => {
                    const active = projectFilter === c.id;
                    return (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => setProjectFilter(c.id)}
                            className={`text-[13px] rounded-full px-[18px] py-2 border shadow-[0_1px_3px_rgba(26,25,21,0.04)] transition-colors ${
                                active
                                    ? 'font-bold text-omq-panel bg-omq-accent border-omq-accent'
                                    : 'font-normal text-omq-muted bg-omq-surface border-omq-border hover:bg-omq-bg'
                            }`}
                        >
                            {c.name}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr_1fr] gap-5 items-start">
                {/* للتنفيذ */}
                <section className="bg-omq-bg rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5 px-2 pb-1">
                        <span className="font-extrabold text-base text-omq-ink">للتنفيذ</span>
                        <Num className="text-xs font-bold text-omq-muted bg-omq-surface border border-omq-border px-2.5 py-px rounded-full">
                            {todo.length}
                        </Num>
                    </div>
                    {todo.length === 0 ? (
                        <div className="border border-dashed border-omq-border-strong rounded-[14px] px-4 py-7 text-center text-[12.5px] text-omq-faint">
                            لا توجد مهام هنا
                        </div>
                    ) : (
                        todo.map((t) => <TaskCard {...cardProps(t, 'todo')} />)
                    )}
                </section>

                {/* قيد التنفيذ — le siège unique */}
                <section className="bg-[#F6EBE4] border border-[#EBD9CF] rounded-2xl p-4 flex flex-col gap-3 shadow-[0_4px_16px_rgba(217,119,87,0.08)]">
                    <div className="flex items-center gap-2.5 px-2 pb-1 flex-wrap">
                        <span className="font-extrabold text-base text-omq-accent-hover">
                            قيد التنفيذ
                        </span>
                        <span className="text-[11px] font-bold text-omq-accent-hover bg-omq-surface border border-[#EBD9CF] px-2.5 py-0.5 rounded-full">
                            مهمة اليوم · مقعد واحد
                        </span>
                        <Num className="mr-auto text-xs font-bold text-omq-accent-hover bg-omq-surface border border-[#EBD9CF] px-2.5 py-px rounded-full">
                            {doing.length}
                        </Num>
                    </div>
                    {doing.length === 0 ? (
                        <div className="border border-dashed border-[#E0C4B4] rounded-[14px] px-4 py-8 text-center text-[13px] text-omq-accent-hover">
                            اختر مهمة اليوم من للتنفيذ
                        </div>
                    ) : (
                        doing.map((t) => <TaskCard {...cardProps(t, 'doing')} />)
                    )}
                </section>

                {/* منجز */}
                <section className="bg-omq-bg rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5 px-2 pb-1">
                        <span className="font-extrabold text-base text-omq-ink">منجز</span>
                        <Num className="text-xs font-bold text-omq-muted bg-omq-surface border border-omq-border px-2.5 py-px rounded-full">
                            {done.length}
                        </Num>
                    </div>
                    {done.map((t) => (
                        <TaskCard {...cardProps(t, 'done')} />
                    ))}
                    <div className="border border-dashed border-omq-border-strong rounded-[14px] px-4 py-7 text-center text-[12.5px] text-omq-faint">
                        اسحب مهمة هنا عند إنجازها
                    </div>
                </section>
            </div>
        </>
    );
}
