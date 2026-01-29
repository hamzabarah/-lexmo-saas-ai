import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        // 1. Fetch current data
        const { data: record, error: fetchError } = await supabaseAdmin
            .from('live_dashboard_state')
            .select('data')
            .eq('id', 1)
            .single();

        if (fetchError) throw fetchError;

        const currentData = record.data;
        let modified = false;

        // 2. Fix dates in 'ventes'
        if (currentData.ventes && Array.isArray(currentData.ventes)) {
            currentData.ventes = currentData.ventes.map((v: any) => {
                if (v.date === '2026-01-30') {
                    modified = true;
                    return { ...v, date: '2026-01-29' };
                }
                return v;
            });
        }

        // 3. Update if modified
        if (modified) {
            const { error: updateError } = await supabaseAdmin
                .from('live_dashboard_state')
                .update({ data: currentData })
                .eq('id', 1);

            if (updateError) throw updateError;
            return NextResponse.json({ success: true, message: 'Fixed dates from Jan 30 to Jan 29' });
        }

        return NextResponse.json({ success: true, message: 'No dates needed fixing' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
