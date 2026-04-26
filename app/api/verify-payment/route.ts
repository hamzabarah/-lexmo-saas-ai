import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Simple in-memory rate limiter: 5 requests per minute per IP.
// Note: state is per-instance — on serverless platforms (Vercel) each
// container has its own Map, so the real limit can be higher under fan-out.
// Acceptable here as a basic abuse-prevention measure.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const ipHits = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
    const xff = req.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    const real = req.headers.get('x-real-ip');
    if (real) return real.trim();
    return 'unknown';
}

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    const hits = (ipHits.get(ip) || []).filter(ts => ts > cutoff);
    if (hits.length >= RATE_LIMIT_MAX) {
        ipHits.set(ip, hits);
        return false;
    }
    hits.push(now);
    ipHits.set(ip, hits);
    return true;
}

export async function GET(req: NextRequest) {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429, headers: { 'Retry-After': '60' } }
        );
    }

    const email = req.nextUrl.searchParams.get('email');

    if (!email) {
        return NextResponse.json({ hasPaid: false });
    }

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data } = await supabase
        .from('user_subscriptions')
        .select('id, status')
        .eq('email', email)
        .single();

    return NextResponse.json({
        hasPaid: !!data,
    });
}
