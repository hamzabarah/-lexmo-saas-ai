/** Expiry is an explicit write. No reads import a cleanup routine. */
import type { FocusSession } from './focus/types';
export function isSessionExpired(s: FocusSession, now = Date.now()): boolean {
    return s.status === 'running' && !s.ended_at &&
        now >= Date.parse(s.started_at) + (s.planned_duration_minutes * 60 + (s.paused_seconds ?? 0)) * 1000;
}
