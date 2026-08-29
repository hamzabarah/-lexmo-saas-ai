'use client';

import { formatClock } from '@/lib/focus/types';
import { Num } from './ui';

/**
 * Minuteur circulaire des maquettes : trois disques concentriques et un
 * `conic-gradient` pour l'arc de progression. Pas de SVG — c'est exactement le
 * procédé de la maquette validée.
 */
export function CircularTimer({
    remainingSeconds,
    totalSeconds,
    plannedMinutes,
    sessionNumber,
    label,
    tone = 'accent',
}: {
    remainingSeconds: number;
    totalSeconds: number;
    plannedMinutes: number;
    sessionNumber: number;
    label?: string;
    tone?: 'accent' | 'sage';
}) {
    const elapsed = Math.max(0, totalSeconds - remainingSeconds);
    const pct = totalSeconds > 0 ? Math.min(100, (elapsed / totalSeconds) * 100) : 0;
    const arc = tone === 'sage' ? 'var(--color-omq-sage)' : 'var(--color-omq-accent)';

    return (
        <div
            className="w-[360px] h-[360px] max-w-full rounded-full grid place-items-center"
            style={{
                background: `conic-gradient(${arc} 0 ${pct}%, var(--color-omq-track) ${pct}% 100%)`,
            }}
        >
            <div className="w-[340px] h-[340px] max-w-full rounded-full bg-omq-panel grid place-items-center">
                <div className="w-[308px] h-[308px] max-w-full rounded-full bg-omq-surface border border-omq-divider shadow-[0_2px_8px_rgba(26,25,21,0.04)] grid place-items-center">
                    <div className="text-center px-6">
                        <div
                            dir="ltr"
                            className="text-[72px] font-extrabold leading-none tracking-[-2.5px] tabular-nums text-omq-ink"
                        >
                            {formatClock(remainingSeconds)}
                        </div>
                        <div className="text-[13px] text-omq-muted mt-3.5">
                            {label ?? (
                                <>
                                    من أصل <Num>{plannedMinutes}</Num> دقيقة · الجلسة{' '}
                                    <Num>{sessionNumber}</Num>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
