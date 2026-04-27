-- Table des tâches
CREATE TABLE IF NOT EXISTS public.focus_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('personal', 'professional')),
  scheduled_date DATE,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_focus_tasks_user ON public.focus_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_tasks_user_date ON public.focus_tasks(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_focus_tasks_user_status ON public.focus_tasks(user_id, status);

ALTER TABLE public.focus_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own tasks"
  ON public.focus_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own tasks"
  ON public.focus_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own tasks"
  ON public.focus_tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own tasks"
  ON public.focus_tasks FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access on focus_tasks"
  ON public.focus_tasks FOR ALL
  USING (auth.jwt() ->> 'email' = 'academyfrance75@gmail.com');

-- Lier les sessions aux tâches (optionnel : une session peut être libre)
ALTER TABLE public.focus_sessions
  ADD COLUMN IF NOT EXISTS task_id UUID REFERENCES public.focus_tasks(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_focus_sessions_task ON public.focus_sessions(task_id);

-- Remplacer la contrainte category de focus_sessions par perso/pro (cohérence)
ALTER TABLE public.focus_sessions DROP CONSTRAINT IF EXISTS focus_sessions_category_check;
-- Pas de nouveau CHECK : category libre côté sessions car liée à la tâche maintenant
