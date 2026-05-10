-- Diagnostic v2: 180-question questionnaire + bilan + plan + project tracker.
-- The legacy coaching_profiles / coaching_diagnostics / bookings tables are kept untouched.

CREATE TABLE IF NOT EXISTS public.diagnostic_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('in_progress', 'completed', 'analyzing', 'bilan_published', 'plan_published', 'in_development')),
    responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    current_block INT NOT NULL DEFAULT 1,
    current_question INT NOT NULL DEFAULT 1,
    bilan_content TEXT,
    plan_content TEXT,
    project_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    completed_at TIMESTAMPTZ,
    bilan_published_at TIMESTAMPTZ,
    plan_published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_submissions_user ON public.diagnostic_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_submissions_status ON public.diagnostic_submissions(status);

ALTER TABLE public.diagnostic_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own submission" ON public.diagnostic_submissions;
CREATE POLICY "Users can read own submission"
    ON public.diagnostic_submissions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own submission" ON public.diagnostic_submissions;
CREATE POLICY "Users can insert own submission"
    ON public.diagnostic_submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own submission" ON public.diagnostic_submissions;
CREATE POLICY "Users can update own submission"
    ON public.diagnostic_submissions FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can manage submissions" ON public.diagnostic_submissions;
CREATE POLICY "Admin can manage submissions"
    ON public.diagnostic_submissions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
              AND email = 'academyfrance75@gmail.com'
        )
    );

GRANT SELECT, INSERT, UPDATE ON public.diagnostic_submissions TO authenticated;
GRANT ALL ON public.diagnostic_submissions TO service_role;
