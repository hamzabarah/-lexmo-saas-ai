import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// GET: habitudes actives + tous leurs relevés.
// La table reste minuscule (une ligne par habitude et par jour) : tout envoyer
// permet de calculer une série exacte, sans fenêtre arbitraire qui la
// tronquerait au bout de quelques mois.
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = getAdmin();

    const { data: habits, error } = await admin
        .from('focus_bad_habits')
        .select('*')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .order('position', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const ids = (habits ?? []).map((h: { id: string }) => h.id);
    let checks: { habit_id: string; check_date: string; state: string }[] = [];

    if (ids.length > 0) {
        const { data, error: cErr } = await admin
            .from('focus_habit_checks')
            .select('habit_id, check_date, state')
            .in('habit_id', ids);

        if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
        checks = data ?? [];
    }

    return NextResponse.json({ habits: habits ?? [], checks });
}

// POST: créer une habitude.
export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const rule_note = typeof body.rule_note === 'string' ? body.rule_note.trim() : '';

    if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });
    if (title.length > 160) return NextResponse.json({ error: 'title too long' }, { status: 400 });

    const admin = getAdmin();

    const { data: last } = await admin
        .from('focus_bad_habits')
        .select('position')
        .eq('user_id', user.id)
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle();

    const { data, error } = await admin
        .from('focus_bad_habits')
        .insert({
            user_id: user.id,
            title,
            rule_note: rule_note || null,
            position: (last?.position ?? 0) + 1,
        })
        .select()
        .single();

    if (error) {
        // Contrainte UNIQUE (user_id, title)
        if (error.code === '23505') {
            return NextResponse.json({ error: 'habit already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ habit: data });
}

// PATCH: renommer, changer la règle, archiver ou désarchiver.
export async function PATCH(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, title, rule_note, archived } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const admin = getAdmin();

    const { data: existing } = await admin
        .from('focus_bad_habits')
        .select('id, user_id')
        .eq('id', id)
        .maybeSingle();

    if (!existing || existing.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof title === 'string' && title.trim()) update.title = title.trim();
    if (rule_note !== undefined) update.rule_note = rule_note || null;
    if (archived !== undefined) update.archived_at = archived ? new Date().toISOString() : null;

    const { data, error } = await admin
        .from('focus_bad_habits')
        .update(update)
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ habit: data });
}

// DELETE: suppression définitive (les relevés partent en cascade).
export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const admin = getAdmin();

    const { data: existing } = await admin
        .from('focus_bad_habits')
        .select('id, user_id')
        .eq('id', id)
        .maybeSingle();

    if (!existing || existing.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await admin.from('focus_bad_habits').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
}
