// Pure helpers. Never connects to a database or executes SQL.
import { createHash } from 'node:crypto';
export const focusTables = ['focus_projects', 'focus_tasks', 'focus_subtasks', 'focus_sessions', 'focus_bad_habits', 'focus_habit_checks'];
export function fingerprint(row) {
    return Object.fromEntries(Object.entries(row).map(([key, value]) => {
        if (value !== null && key.endsWith('_at')) {
            const text = String(value);
            const fraction = (text.match(/\.(\d+)/)?.[1] ?? '').padEnd(6, '0');
            value = new Date(text).toISOString().split('.')[0] + '.' + fraction + 'Z';
        }
        return [key, value === null ? null : createHash('md5').update(String(value)).digest('hex')];
    }));
}
export function manifestFor(tables) {
    return Object.fromEntries(focusTables.map(table => [table, tables[table].map(row => ({
        id: row.id, owner: row.user_id ?? null, hash: fingerprint(row),
    }))]));
}
export function renderReset(template, manifest) {
    // The manifest contains only UUIDs and hashes, never titles, notes or secrets.
    const encoded = JSON.stringify(manifest);
    if (!/^[a-zA-Z0-9_"{},:\[\].\-]+$/.test(encoded)) throw new Error('Unexpected manifest encoding');
    return template.replace('__FOCUS_MANIFEST__', encoded);
}
