'use client';

import { useState } from 'react';
import {
    KANBAN_COLUMNS,
    type FocusProject,
    type FocusTask,
    type TaskStatus,
} from '@/lib/focus/types';
import { Num, ProjectTag, TaskBadges } from './ui';

const ORDER: TaskStatus[] = ['todo', 'in_progress', 'done'];

/**
 * Section « لوحة كانبان ». Trois colonnes en RTL, glisser-déposer natif (aucune
 * dépendance) doublé de deux flèches par carte — le glisser-déposer HTML5 ne
 * fonctionne pas au doigt sur mobile.
 *
 * Écrit le même champ `status` que les cases à cocher de la section البيانات :
 * une seule source de vérité, deux vues.
 */
export function KanbanView({
    projects,
    tasks,
    onMove,
    busyTaskId,
}: {
    projects: FocusProject[];
    tasks: FocusTask[];
    onMove: (task: FocusTask, status: TaskStatus) => void;
    busyTaskId: string | null;
}) {
    const [dragging, setDragging] = useState<string | null>(null);
    const [over, setOver] = useState<TaskStatus | null>(null);

    const projectOf = (t: FocusTask) => projects.find((p) => p.id === t.project_id);

    return (
        <>
            <header className="flex items-baseline justify-between mb-8">
                <h1 className="text-[32px] font-extrabold tracking-[-0.4px] text-omq-ink m-0">
                    لوحة كانبان
                </h1>
                <div className="text-[13px] text-omq-muted">كل المشاريع</div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                {KANBAN_COLUMNS.map((col) => {
                    const list = tasks.filter((t) => t.status === col.status);
                    const isOver = over === col.status;

                    return (
                        <div
                            key={col.status}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setOver(col.status);
                            }}
                            onDragLeave={() => setOver((v) => (v === col.status ? null : v))}
                            onDrop={(e) => {
                                e.preventDefault();
                                setOver(null);
                                const id = e.dataTransfer.getData('text/plain') || dragging;
                                const task = tasks.find((t) => t.id === id);
                                if (task && task.status !== col.status) onMove(task, col.status);
                                setDragging(null);
                            }}
                            className={`bg-omq-bg rounded-2xl p-4 flex flex-col gap-3 transition-colors ${
                                isOver ? 'outline outline-2 outline-omq-accent/40' : ''
                            }`}
                        >
                            <div className="flex items-center gap-2.5 px-2 pb-1">
                                <span className="font-extrabold text-base text-omq-ink">
                                    {col.label}
                                </span>
                                <span
                                    dir="ltr"
                                    className="text-xs font-bold text-omq-muted bg-omq-surface border border-omq-border px-2.5 py-px rounded-full"
                                >
                                    {list.length}
                                </span>
                            </div>

                            {list.length === 0 ? (
                                <div className="border border-dashed border-omq-border-strong rounded-[14px] px-4 py-7 text-center text-[12.5px] text-omq-faint">
                                    {col.status === 'done'
                                        ? 'اسحب مهمة هنا عند إنجازها'
                                        : 'لا توجد مهام هنا'}
                                </div>
                            ) : (
                                list.map((task) => {
                                    const idx = ORDER.indexOf(task.status);
                                    const busy = busyTaskId === task.id;

                                    return (
                                        <article
                                            key={task.id}
                                            draggable={!busy}
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('text/plain', task.id);
                                                e.dataTransfer.effectAllowed = 'move';
                                                setDragging(task.id);
                                            }}
                                            onDragEnd={() => {
                                                setDragging(null);
                                                setOver(null);
                                            }}
                                            className={`bg-omq-surface border rounded-[14px] p-4 shadow-[0_2px_8px_rgba(26,25,21,0.04)] cursor-grab active:cursor-grabbing transition-all hover:shadow-[0_6px_16px_rgba(26,25,21,0.08)] hover:border-omq-border-strong ${
                                                task.status === 'in_progress'
                                                    ? 'border-[#EBD9CF]'
                                                    : 'border-omq-border'
                                            } ${dragging === task.id ? 'opacity-50' : ''} ${
                                                busy ? 'opacity-50' : ''
                                            }`}
                                        >
                                            <div className="text-sm font-bold mb-3 leading-[1.5] text-omq-ink">
                                                {task.title}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TaskBadges task={task} />
                                                <span className="mr-auto">
                                                    <ProjectTag project={projectOf(task)} />
                                                </span>
                                            </div>

                                            {/* Repli tactile du glisser-déposer. */}
                                            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-omq-divider">
                                                <button
                                                    type="button"
                                                    disabled={busy || idx === 0}
                                                    onClick={() => onMove(task, ORDER[idx - 1])}
                                                    aria-label="إلى العمود السابق"
                                                    className="w-7 h-7 rounded-lg border border-omq-border text-omq-muted grid place-items-center transition-colors hover:bg-omq-panel disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <Num>›</Num>
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={busy || idx === ORDER.length - 1}
                                                    onClick={() => onMove(task, ORDER[idx + 1])}
                                                    aria-label="إلى العمود التالي"
                                                    className="w-7 h-7 rounded-lg border border-omq-border text-omq-muted grid place-items-center transition-colors hover:bg-omq-panel disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <Num>‹</Num>
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
