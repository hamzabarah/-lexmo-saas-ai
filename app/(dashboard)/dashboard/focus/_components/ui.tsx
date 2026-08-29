'use client';

import type { FocusProject, FocusTask } from '@/lib/focus/types';

/** Carte blanche standard des maquettes : bord clair, radius 16, ombre discrète. */
export function Card({
    children,
    className = '',
    radius = 16,
}: {
    children: React.ReactNode;
    className?: string;
    radius?: 14 | 16;
}) {
    return (
        <div
            className={`bg-omq-surface border border-omq-border shadow-[0_2px_8px_rgba(26,25,21,0.04)] ${className}`}
            style={{ borderRadius: radius }}
        >
            {children}
        </div>
    );
}

/** Pilule à fond teinté pâle. Jamais de couleur pleine. */
export function Pill({
    children,
    tone = 'neutral',
}: {
    children: React.ReactNode;
    tone?: 'neutral' | 'urgent' | 'progress' | 'sage';
}) {
    const tones = {
        neutral: 'text-omq-muted bg-omq-bg',
        urgent: 'text-omq-urgent bg-omq-urgent-bg',
        progress: 'text-omq-progress bg-omq-progress-bg',
        sage: 'text-omq-sage bg-[#EDF1E4]',
    } as const;

    return (
        <span className={`text-[11px] font-bold px-[11px] py-[3px] rounded-full ${tones[tone]}`}>
            {children}
        </span>
    );
}

/** Pastille de couleur d'un projet. */
export function Dot({ color, size = 8 }: { color: string; size?: number }) {
    return (
        <span
            className="rounded-full shrink-0 inline-block"
            style={{ width: size, height: size, background: color }}
        />
    );
}

/**
 * Badge d'état d'une tâche.
 * « عاجل » vient de la priorité, « قيد التنفيذ » du statut : ce sont deux
 * informations distinctes, comme dans les maquettes.
 */
export function TaskBadges({ task }: { task: FocusTask }) {
    return (
        <>
            {task.priority === 'urgent' && task.status !== 'done' && <Pill tone="urgent">عاجل</Pill>}
            {task.status === 'in_progress' && <Pill tone="progress">قيد التنفيذ</Pill>}
            {task.status === 'done' && <Pill tone="sage">منجز</Pill>}
        </>
    );
}

/** Étiquette « pastille + nom du projet », telle qu'elle apparaît sur les cartes. */
export function ProjectTag({ project }: { project: FocusProject | undefined }) {
    if (!project) return null;
    return (
        <span className="inline-flex items-center gap-1.5 text-[11px] text-omq-muted">
            <Dot color={project.color} size={6} />
            {project.name}
        </span>
    );
}

/** Chiffres occidentaux isolés du RTL, comme dans les maquettes. */
export function Num({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <span dir="ltr" className={className}>
            {children}
        </span>
    );
}
