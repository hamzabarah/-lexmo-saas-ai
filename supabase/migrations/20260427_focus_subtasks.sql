-- Table des sous-tâches
CREATE TABLE IF NOT EXISTS public.focus_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.focus_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_focus_subtasks_task ON public.focus_subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_focus_subtasks_user ON public.focus_subtasks(user_id);

ALTER TABLE public.focus_subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own subtasks"
  ON public.focus_subtasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own subtasks"
  ON public.focus_subtasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own subtasks"
  ON public.focus_subtasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own subtasks"
  ON public.focus_subtasks FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access on focus_subtasks"
  ON public.focus_subtasks FOR ALL
  USING (auth.jwt() ->> 'email' = 'academyfrance75@gmail.com');

-- Lier les sessions aux sous-tâches (en plus de task_id)
ALTER TABLE public.focus_sessions
  ADD COLUMN IF NOT EXISTS subtask_id UUID REFERENCES public.focus_subtasks(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_focus_sessions_subtask ON public.focus_sessions(subtask_id);
