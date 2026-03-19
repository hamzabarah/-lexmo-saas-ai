import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { sendBookingConfirmationEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// GET: Return available slots for the next 30 days
// All slots 9h-19h are available by default, minus blocked slots and existing bookings
export async function GET() {
    try {
        const admin = getAdmin();
        const today = new Date();
        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(today.getDate() + 31);

        // Get blocked slots in range
        const { data: blockedSlots } = await admin
            .from('coaching_blocked_slots')
            .select('slot_datetime')
            .gte('slot_datetime', today.toISOString())
            .lte('slot_datetime', thirtyDaysLater.toISOString());

        // Normalize to epoch ms for reliable comparison (Supabase returns +00:00, JS uses Z)
        const blockedSet = new Set(
            (blockedSlots || []).map((s: any) => new Date(s.slot_datetime).getTime())
        );

        // Get all future non-cancelled bookings
        const { data: existingBookings } = await admin
            .from('bookings')
            .select('booking_date')
            .gte('booking_date', today.toISOString())
            .neq('status', 'cancelled');

        const takenSet = new Set(
            (existingBookings || []).map((b: any) => new Date(b.booking_date).getTime())
        );

        // Generate all slots 9h-19h for today + next 30 days, excluding blocked, booked, and past
        const availableSlots: string[] = [];
        const nowMs = today.getTime();

        for (let dayOffset = 0; dayOffset <= 30; dayOffset++) {
            const d = new Date(today);
            d.setDate(today.getDate() + dayOffset);

            for (let hour = 9; hour <= 19; hour++) {
                // Build UTC date explicitly to avoid timezone day-shift
                const slotDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), hour, 0, 0, 0));
                const ms = slotDate.getTime();

                // Skip past slots
                if (ms <= nowMs) continue;

                const iso = slotDate.toISOString();

                if (!blockedSet.has(ms) && !takenSet.has(ms)) {
                    availableSlots.push(iso);
                }
            }
        }

        return NextResponse.json({ slots: availableSlots });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create a booking
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = getAdmin();
        const isAdmin = user.email === 'academyfrance75@gmail.com';

        // Verify user has diagnostic plan (admin bypasses this check)
        if (!isAdmin) {
            const { data: subscription } = await admin
                .from('user_subscriptions')
                .select('plan, status')
                .eq('email', user.email!)
                .eq('status', 'active')
                .single();

            if (!subscription || subscription.plan !== 'diagnostic') {
                return NextResponse.json({ error: 'No diagnostic subscription found' }, { status: 403 });
            }
        }

        // Check user doesn't already have a scheduled booking
        const { data: existingBooking } = await admin
            .from('bookings')
            .select('id')
            .eq('user_id', user.id)
            .eq('status', 'scheduled')
            .single();

        if (existingBooking) {
            return NextResponse.json({ error: 'لديك جلسة محجوزة بالفعل' }, { status: 400 });
        }

        const { booking_date } = await req.json();

        if (!booking_date) {
            return NextResponse.json({ error: 'Missing booking_date' }, { status: 400 });
        }

        // Verify slot is not blocked by admin
        const { data: blocked } = await admin
            .from('coaching_blocked_slots')
            .select('id')
            .eq('slot_datetime', booking_date)
            .maybeSingle();

        if (blocked) {
            return NextResponse.json({ error: 'هذا الموعد لم يعد متاحاً' }, { status: 409 });
        }

        // Verify slot is not taken by another booking
        const { data: conflict } = await admin
            .from('bookings')
            .select('id')
            .eq('booking_date', booking_date)
            .neq('status', 'cancelled')
            .maybeSingle();

        if (conflict) {
            return NextResponse.json({ error: 'هذا الموعد لم يعد متاحاً' }, { status: 409 });
        }

        const { data: booking, error: insertError } = await admin
            .from('bookings')
            .insert({
                user_id: user.id,
                booking_date,
                status: 'scheduled',
                product_type: 'diagnostic',
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        // Advance coaching profile to step 3 (countdown)
        await admin
            .from('coaching_profiles')
            .update({ current_step: 3, updated_at: new Date().toISOString() })
            .eq('user_id', user.id);

        // Send confirmation email
        try {
            await sendBookingConfirmationEmail(user.email!, booking_date);
        } catch (emailErr) {
            console.error('Failed to send booking confirmation email:', emailErr);
        }

        return NextResponse.json({ booking });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
