-- Admin Challenges System
-- Tracker for timed challenges (e.g. "من 0 ل 1000€ في 7 أيام")

CREATE TABLE IF NOT EXISTS admin_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    total_days INTEGER NOT NULL DEFAULT 7,
    target_revenue NUMERIC NOT NULL DEFAULT 1000,
    current_revenue NUMERIC NOT NULL DEFAULT 0,
    team_count INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_challenge_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID NOT NULL REFERENCES admin_challenges(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL DEFAULT 1,
    time_text TEXT NOT NULL DEFAULT '',
    task_text TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast task lookups
CREATE INDEX IF NOT EXISTS idx_challenge_tasks_challenge_day ON admin_challenge_tasks(challenge_id, day_number);

-- RLS: service role only (admin backend)
ALTER TABLE admin_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_challenge_tasks ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access on admin_challenges"
    ON admin_challenges FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on admin_challenge_tasks"
    ON admin_challenge_tasks FOR ALL
    USING (true) WITH CHECK (true);
