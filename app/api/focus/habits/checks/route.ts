import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const STATES = ['avoided', 'failed'] as const;

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

/**
 * POST: pose ou efface l'état d'un jour.
 *
 * `state: null` supprime le relevé — c'est la troisième position du cycle
 * vide → évitée → craqué → vide. Un seul point d'entrée pour les trois
 * transitions, plutôt qu'un POST et un DELETE à tenir en cohérence.
 */
export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { habit_id, check_date, state } = body;

    if (!habit_id || typeof check_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(check_date)) {
        return NextResponse.json({ error: 'habit_id & check_date (YYYY-MM-DD) required' }, { status: 400 });
    }
    if (state !== null && !(STATES as readonly string[]).includes(state)) {
        return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
    }

    const admin = getAdmin();

    // L'habitude porte la propriété : on la vérifie avant toute écriture.
    const { data: habit } = await admin
        .from('focus_bad_habits')
        .select('id, user_id')
        .eq('id', habit_id)
        .maybeSingle();

    if (!habit || habit.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (state === null) {
        const { error } = await admin
            .from('focus_habit_checks')
            .delete()
            .eq('habit_id', habit_id)
            .eq('check_date', check_date);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ check: null });
    }

    const { data, error } = await admin
        .from('focus_habit_checks')
        .upsert(
            { habit_id, check_date, state, updated_at: new Date().toISOString() },
            { onConflict: 'habit_id,check_date' }
        )
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ check: data });
}
