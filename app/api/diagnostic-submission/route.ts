import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import {
    getQuestion,
    getNextVisibleQuestionId,
    getFirstVisibleQuestionId,
    type ResponsesMap,
} from '@/lib/diagnostic-questions';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'academyfrance75@gmail.com';

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

async function authenticateUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
}

async function ensureDiagnosticAccess(userId: string, email: string): Promise<boolean> {
    if (email === ADMIN_EMAIL) return true;
    const admin = getAdmin();
    const { data } = await admin
        .from('user_subscriptions')
        .select('plan, status')
        .eq('user_id', userId)
        .eq('plan', 'diagnostic')
        .eq('status', 'active')
        .maybeSingle();
    if (data) return true;
    const { data: byEmail } = await admin
        .from('user_subscriptions')
        .select('plan, status')
        .eq('email', email)
        .eq('plan', 'diagnostic')
        .eq('status', 'active')
        .maybeSingle();
    return !!byEmail;
}

export async function GET() {
    try {
        const user = await authenticateUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const hasAccess = await ensureDiagnosticAccess(user.id, user.email!);
        if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const admin = getAdmin();
        const { data: submission } = await admin
            .from('diagnostic_submissions')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        return NextResponse.json({ submission: submission || null });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST: save a single answer (auto-save). Body: { questionId, answer }
// Creates the submission row on first call. Updates current_question/current_block.
export async function POST(req: NextRequest) {
    try {
        const user = await authenticateUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const hasAccess = await ensureDiagnosticAccess(user.id, user.email!);
        if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { questionId, answer } = await req.json();

        const q = getQuestion(Number(questionId));
        if (!q) return NextResponse.json({ error: 'Invalid questionId' }, { status: 400 });

        // Validate answer shape against question type
        if (q.type === 'multi') {
            if (!Array.isArray(answer)) {
                return NextResponse.json({ error: 'multi answer must be an array' }, { status: 400 });
            }
        } else {
            if (typeof answer !== 'string') {
                return NextResponse.json({ error: 'answer must be a string' }, { status: 400 });
            }
        }

        const admin = getAdmin();

        // Load existing submission
        const { data: existing } = await admin
            .from('diagnostic_submissions')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        // Don't allow editing once completed
        if (existing && existing.status !== 'in_progress') {
            return NextResponse.json({ error: 'Submission already finalized' }, { status: 409 });
        }

        const responses: ResponsesMap = (existing?.responses as ResponsesMap) || {};
        responses[String(q.id)] = {
            question: q.text,
            answer: q.type === 'multi' ? (answer as string[]) : (answer as string),
            type: q.type,
        };

        // Compute next visible question
        const nextId = getNextVisibleQuestionId(q.id, responses);
        const next = nextId ? getQuestion(nextId) : null;
        const nextQuestion = nextId ?? q.id; // stay on last if done
        const nextBlock = next ? next.block : q.block;

        const payload = {
            user_id: user.id,
            responses,
            current_question: nextQuestion,
            current_block: nextBlock,
            updated_at: new Date().toISOString(),
        };

        const { data: saved, error } = existing
            ? await admin
                .from('diagnostic_submissions')
                .update(payload)
                .eq('user_id', user.id)
                .select()
                .single()
            : await admin
                .from('diagnostic_submissions')
                .insert(payload)
                .select()
                .single();

        if (error) throw error;

        return NextResponse.json({
            submission: saved,
            done: nextId === null,
            nextQuestionId: nextId,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH: navigate (set current_question explicitly — used by "previous" button or block jump).
// Body: { current_question }
export async function PATCH(req: NextRequest) {
    try {
        const user = await authenticateUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const hasAccess = await ensureDiagnosticAccess(user.id, user.email!);
        if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { current_question } = await req.json();
        const target = Number(current_question);
        if (!Number.isInteger(target) || target < 1 || target > 180) {
            return NextResponse.json({ error: 'Invalid current_question' }, { status: 400 });
        }

        const admin = getAdmin();
        const { data: existing } = await admin
            .from('diagnostic_submissions')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
        if (!existing) return NextResponse.json({ error: 'No submission yet' }, { status: 404 });
        if (existing.status !== 'in_progress') {
            return NextResponse.json({ error: 'Submission finalized' }, { status: 409 });
        }

        const responses = (existing.responses as ResponsesMap) || {};
        const visibleId = getFirstVisibleQuestionId(target, responses);
        if (!visibleId) {
            return NextResponse.json({ error: 'No visible question at or after target' }, { status: 400 });
        }
        const q = getQuestion(visibleId)!;

        const { data: saved, error } = await admin
            .from('diagnostic_submissions')
            .update({
                current_question: visibleId,
                current_block: q.block,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .select()
            .single();
        if (error) throw error;

        return NextResponse.json({ submission: saved });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
