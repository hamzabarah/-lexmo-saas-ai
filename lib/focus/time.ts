/** UTC instants, Europe/Paris calendar. No locale-dependent parsing. */
export const FOCUS_TIME_ZONE = 'Europe/Paris';
export function parisDate(value: Date | number | string = new Date()): string {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: FOCUS_TIME_ZONE,
        year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(value));
    const get = (type: string) => p.find(x => x.type === type)!.value;
    return `${get('year')}-${get('month')}-${get('day')}`;
}
export function addCalendarDays(day: string, count: number): string {
    const d = new Date(`${day}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + count);
    return d.toISOString().slice(0, 10);
}
export function parisMidnight(day: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(Date.parse(`${day}T00:00:00Z`))
        || new Date(`${day}T00:00:00Z`).toISOString().slice(0,10) !== day) throw new Error('Invalid date');
    const utc = Date.parse(`${day}T00:00:00Z`);
    let value = utc;
    for (let i = 0; i < 3; i++) {
        const parts = new Intl.DateTimeFormat('en-GB', { timeZone: FOCUS_TIME_ZONE,
            year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23' })
            .formatToParts(new Date(value));
        const v = (k: string) => Number(parts.find(p => p.type === k)!.value);
        const represented = Date.UTC(v('year'),v('month')-1,v('day'),v('hour'),v('minute'),v('second'));
        value += utc - represented;
    }
    return new Date(value);
}
export function parisDayBounds(day = parisDate()) {
    return { start: parisMidnight(day), end: parisMidnight(addCalendarDays(day,1)) };
}
export function monday(day = parisDate()): string {
    const dow = new Date(`${day}T12:00:00Z`).getUTCDay();
    return addCalendarDays(day, -((dow+6)%7));
}
export type TimedSession = { started_at: string; ended_at: string | null;
    paused_seconds: number | null; paused_at?: string | null; duration_override_seconds?: number | null };
export function recordedSeconds(s: TimedSession): number {
    if (!s.ended_at) return 0;
    if (s.duration_override_seconds != null) return Math.max(0,s.duration_override_seconds);
    return Math.max(0,Math.floor((Date.parse(s.ended_at)-Date.parse(s.started_at))/1000)-(s.paused_seconds??0));
}
