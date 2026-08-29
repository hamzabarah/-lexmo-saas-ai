'use client';

import { formatClock } from '@/lib/focus/types';
import { Dot } from './ui';

export type OmqView = 'data' | 'kanban' | 'focus';

const NAV: { id: OmqView; label: string }[] = [
    { id: 'data', label: 'البيانات' },
    { id: 'kanban', label: 'لوحة كانبان' },
    { id: 'focus', label: 'جلسات التركيز' },
];

/**
 * Navigation du module, fidèle aux maquettes : 232 px, fond sable, logo عُمق,
 * quatre entrées dont التقارير désactivée, et le minuteur de la session en
 * cours épinglé en bas — visible depuis n'importe quelle section.
 */
export function OmqSidebar({
    view,
    onChange,
    runningSeconds,
    isRunning,
    isPaused,
}: {
    view: OmqView;
    onChange: (v: OmqView) => void;
    runningSeconds: number | null;
    isRunning: boolean;
    isPaused: boolean;
}) {
    return (
        <aside className="w-[232px] flex-none border-l border-omq-border bg-omq-bg p-6 px-4 flex flex-col gap-0.5">
            <div className="flex items-center gap-3 px-3 py-2 mb-6">
                <div className="w-8 h-8 rounded-[9px] bg-omq-accent grid place-items-center font-extrabold text-[15px] text-omq-panel shadow-[0_2px_6px_rgba(217,119,87,0.25)]">
                    ع
                </div>
                <div className="font-extrabold text-base tracking-[-0.2px] text-omq-ink">عُمق</div>
            </div>

            {NAV.map((item) => {
                const active = view === item.id;
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onChange(item.id)}
                        className={
                            active
                                ? 'flex items-center gap-[11px] px-3 py-2.5 rounded-[10px] bg-omq-surface border border-omq-border shadow-[0_2px_8px_rgba(26,25,21,0.04)] text-omq-accent text-sm font-bold text-right'
                                : 'flex items-center gap-[11px] px-3 py-2.5 rounded-[10px] text-omq-muted text-sm text-right transition-colors hover:bg-white/75 hover:text-omq-ink'
                        }
                    >
                        <Dot color={active ? 'var(--color-omq-accent)' : 'var(--color-omq-dot)'} />
                        {item.label}
                    </button>
                );
            })}

            {/* التقارير : prévue, pas encore construite. */}
            <div
                className="flex items-center gap-[11px] px-3 py-2.5 rounded-[10px] text-omq-faint text-sm cursor-not-allowed select-none"
                aria-disabled="true"
                title="قريباً"
            >
                <Dot color="var(--color-omq-dot)" />
                <span>التقارير</span>
                <span className="mr-auto text-[10px] font-bold text-omq-muted bg-omq-surface border border-omq-border px-2 py-[2px] rounded-full">
                    قريباً
                </span>
            </div>

            {runningSeconds !== null && (
                <div className="mt-auto border border-omq-border rounded-[14px] p-4 bg-omq-surface shadow-[0_2px_8px_rgba(26,25,21,0.04)]">
                    <div className="flex items-center gap-[7px] text-[11.5px] text-omq-muted mb-2">
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                                background: isPaused
                                    ? 'var(--color-omq-faint)'
                                    : 'var(--color-omq-sage)',
                            }}
                        />
                        {isPaused ? 'جلسة متوقفة مؤقتاً' : 'جلسة تركيز جارية'}
                    </div>
                    <div
                        dir="ltr"
                        className="text-[28px] font-extrabold text-omq-accent tabular-nums tracking-[-0.5px] leading-none"
                    >
                        {formatClock(runningSeconds)}
                    </div>
                    {!isRunning && (
                        <div className="text-[11px] text-omq-faint mt-2">انتهى الوقت المخطط</div>
                    )}
                </div>
            )}
        </aside>
    );
}
