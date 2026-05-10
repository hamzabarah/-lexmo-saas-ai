import { NextRequest, NextResponse } from 'next/server';
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

const VALID_STATUSES = ['in_progress', 'completed', 'analyzing', 'bilan_published', 'plan_published', 'in_development'];

interface ProjectStep {
    step: string;
    status: 'done' | 'in_progress' | 'locked';
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ userId: string }> }) {
    try {
        if (!await verifyAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { userId } = await ctx.params;

        const admin = getAdmin();
        const { data: submission } = await admin
            .from('diagnostic_submissions')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const { data: userData } = await admin
            .from('users')
            .select('id, email, name')
            .eq('id', userId)
            .maybeSingle();

        return NextResponse.json({
            submission,
            user: userData ? { email: userData.email, name: userData.name } : null,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH: update bilan_content / plan_content / project_steps / status.
// Body fields are all optional — only provided ones are written.
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ userId: string }> }) {
    try {
        if (!await verifyAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { userId } = await ctx.params;

        const body = await req.json();
        const updates: Record<string, any> = { updated_at: new Date().toISOString() };

        if (typeof body.bilan_content === 'string') {
            updates.bilan_content = body.bilan_content;
        }
        if (typeof body.plan_content === 'string') {
            updates.plan_content = body.plan_content;
        }
        if (Array.isArray(body.project_steps)) {
            const cleaned: ProjectStep[] = [];
            for (const item of body.project_steps) {
                if (!item || typeof item.step !== 'string') continue;
                const status = item.status;
                if (status !== 'done' && status !== 'in_progress' && status !== 'locked') continue;
                cleaned.push({ step: item.step, status });
            }
            updates.project_steps = cleaned;
        }
        if (typeof body.status === 'string') {
            if (!VALID_STATUSES.includes(body.status)) {
                return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
            }
            updates.status = body.status;
            if (body.status === 'bilan_published') {
                updates.bilan_published_at = new Date().toISOString();
            }
            if (body.status === 'plan_published') {
                updates.plan_published_at = new Date().toISOString();
            }
        }

        // Auto-bump status when content is published for the first time.
        if (typeof body.publish === 'string') {
            if (body.publish === 'bilan') {
                updates.status = 'bilan_published';
                updates.bilan_published_at = new Date().toISOString();
            } else if (body.publish === 'plan') {
                updates.status = 'plan_published';
                updates.plan_published_at = new Date().toISOString();
            } else if (body.publish === 'development') {
                updates.status = 'in_development';
            }
        }

        const admin = getAdmin();
        const { data, error } = await admin
            .from('diagnostic_submissions')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;

        return NextResponse.json({ submission: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
