import { createClient } from '@supabase/supabase-js';

export class FocusError extends Error {}

// Server only. Callers authenticate before supplying the operator's identity.
export function focusAdmin() {
    return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
