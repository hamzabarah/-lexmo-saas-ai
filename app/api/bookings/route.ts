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
export async function GET() {
    try {
        const admin = getAdmin();

        // Get active availability slots
        const { data: slots, error } = await admin
            .from('availability_slots')
            .select('*')
            .eq('is_active', true)
            .order('day_of_week')
            .order('hour');

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get all future non-cancelled bookings
        const now = new Date().toISOString();
        const { data: existingBookings } = await admin
            .from('bookings')
            .select('booking_date')
            .gte('booking_date', now)
            .neq('status', 'cancelled');

        const takenTimes = new Set(
            (existingBookings || []).map((b: any) => b.booking_date)
        );

        // Generate concrete datetime slots for next 30 days
        const availableSlots: string[] = [];
        const today = new Date();

        for (let dayOffset = 1; dayOffset <= 30; dayOffset++) {
            const date = new Date(today);
            date.setDate(today.getDate() + dayOffset);
            const dow = date.getDay();

            const daySlots = (slots || []).filter((s: any) => s.day_of_week === dow);

            for (const slot of daySlots) {
                const slotDate = new Date(date);
                slotDate.setHours(slot.hour, slot.minute, 0, 0);
                const iso = slotDate.toISOString();
                if (!takenTimes.has(iso)) {
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

        // Verify slot is not taken
        const { data: conflict } = await admin
            .from('bookings')
            .select('id')
            .eq('booking_date', booking_date)
            .neq('status', 'cancelled')
            .single();

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
