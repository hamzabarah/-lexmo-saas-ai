import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const supabase = await createClient();

        // Generate and send magic link
        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lexmo-saas-ai.vercel.app'}/auth/callback?next=/dashboard`,
            }
        });

        if (error) {
            console.error('Error sending magic link:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Magic link sent successfully'
        });

    } catch (error: any) {
        console.error('Resend magic link error:', error);
        return NextResponse.json({
            error: 'Failed to send magic link'
        }, { status: 500 });
    }
}
