-- Table de progression des leçons
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase_id INTEGER NOT NULL,
  lesson_id TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completion_method TEXT CHECK (completion_method IN ('manual', 'auto_video', 'quiz')),
  time_spent_seconds INTEGER DEFAULT 0,
  quiz_score INTEGER,
  quiz_total INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, phase_id, lesson_id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_phase ON public.lesson_progress(user_id, phase_id);

-- RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access"
  ON public.lesson_progress FOR ALL
  USING (auth.jwt() ->> 'email' = 'academyfrance75@gmail.com');
