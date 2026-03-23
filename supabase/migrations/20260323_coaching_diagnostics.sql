-- Coaching diagnostics table: stores diagnostic session data per client
CREATE TABLE IF NOT EXISTS public.coaching_diagnostics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    answers JSONB DEFAULT '[]'::jsonb,
    summary TEXT,
    recommended_business TEXT,
    action_plan TEXT,
    recommendation TEXT,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    client_validated BOOLEAN DEFAULT false,
    validated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS (service role bypasses it, which is how all our APIs work)
ALTER TABLE public.coaching_diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.coaching_diagnostics
    FOR ALL USING (true) WITH CHECK (true);

-- Index for fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_coaching_diagnostics_user_id ON public.coaching_diagnostics(user_id);
