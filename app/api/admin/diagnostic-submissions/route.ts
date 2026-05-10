import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'academyfrance75@gmail.com';

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email === ADMIN_EMAIL ? user : null;
}

// GET: list all diagnostic submissions, joined with user email/name.
export async function GET() {
    try {
        const adminUser = await verifyAdmin();
        if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const admin = getAdmin();
        const { data: submissions, error } = await admin
            .from('diagnostic_submissions')
            .select('*')
            .order('updated_at', { ascending: false });
        if (error) throw error;

        const userIds = (submissions || []).map(s => s.user_id);
        let usersMap: Record<string, { email: string; name?: string }> = {};
        if (userIds.length) {
            const { data: usersData } = await admin
                .from('users')
                .select('id, email, name')
                .in('id', userIds);
            for (const u of usersData || []) {
                usersMap[u.id] = { email: u.email, name: u.name };
            }
        }

        const enriched = (submissions || []).map(s => {
            const responses = (s.responses as Record<string, { question: string; answer: string | string[]; type: string }>) || {};
            const fullName = (responses['1']?.answer as string) || null;
            const u = usersMap[s.user_id];
            return {
                ...s,
                email: u?.email || null,
                user_name: u?.name || null,
                client_name: fullName,
            };
        });

        return NextResponse.json({ submissions: enriched });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
