import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (Service Role) to bypass RLS for updates
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const API_SECRET = process.env.API_SECRET_LIVE_UPDATE || 'lexmo-live-secret-2026';

export async function POST(req: NextRequest) {
    try {
        // 1. Security Check
        const secret = req.headers.get('x-api-secret');
        if (secret !== API_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Data
        const body = await req.json();

        // 3. Update Supabase
        const { error } = await supabaseAdmin
            .from('live_dashboard_state')
            .upsert({
                id: 1,
                data: body,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Dashboard updated' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
