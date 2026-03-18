-- Create coaching_profiles table for pre-appointment form data + step tracking
CREATE TABLE IF NOT EXISTS public.coaching_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    full_name TEXT,
    google_meet_email TEXT,
    current_step INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- RLS
ALTER TABLE public.coaching_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own coaching profile"
    ON public.coaching_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coaching profile"
    ON public.coaching_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coaching profile"
    ON public.coaching_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all coaching profiles"
    ON public.coaching_profiles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'academyfrance75@gmail.com'
        )
    );

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.coaching_profiles TO authenticated;
GRANT ALL ON public.coaching_profiles TO service_role;

-- Index
CREATE INDEX IF NOT EXISTS idx_coaching_profiles_user ON public.coaching_profiles(user_id);
