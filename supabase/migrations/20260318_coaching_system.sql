-- Add 'diagnostic' to plan CHECK constraint
ALTER TABLE user_subscriptions
  DROP CONSTRAINT IF EXISTS user_subscriptions_plan_check;
ALTER TABLE user_subscriptions
  ADD CONSTRAINT user_subscriptions_plan_check
  CHECK (plan IN ('spark', 'emperor', 'legend', 'diagnostic'));

-- Create availability_slots table (admin configures weekly time slots)
CREATE TABLE IF NOT EXISTS public.availability_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
    hour INTEGER NOT NULL CHECK (hour BETWEEN 0 AND 23),
    minute INTEGER NOT NULL DEFAULT 0 CHECK (minute IN (0, 30)),
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns to existing bookings table
ALTER TABLE public.bookings
    ADD COLUMN IF NOT EXISTS telegram_link TEXT,
    ADD COLUMN IF NOT EXISTS admin_notes TEXT,
    ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'diagnostic';

-- RLS for availability_slots
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active slots"
    ON public.availability_slots FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admin can manage slots"
    ON public.availability_slots FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'academyfrance75@gmail.com'
        )
    );

-- RLS for bookings (if not already set)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can manage all bookings"
    ON public.bookings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'academyfrance75@gmail.com'
        )
    );

-- Grant permissions
GRANT SELECT ON public.availability_slots TO authenticated;
GRANT ALL ON public.availability_slots TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_availability_day ON public.availability_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
