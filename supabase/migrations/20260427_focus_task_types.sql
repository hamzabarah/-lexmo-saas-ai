-- Ajouter le champ task_type
ALTER TABLE public.focus_tasks
  ADD COLUMN IF NOT EXISTS task_type TEXT NOT NULL DEFAULT 'one_time'
  CHECK (task_type IN ('recurring', 'one_time', 'long_term'));

-- Rendre scheduled_date nullable (les tâches récurrentes n'ont pas de date)
ALTER TABLE public.focus_tasks
  ALTER COLUMN scheduled_date DROP NOT NULL;

-- Index pour filtrer par type rapidement
CREATE INDEX IF NOT EXISTS idx_focus_tasks_user_type ON public.focus_tasks(user_id, task_type);
