-- Progression des porteurs de lien d'accès.
--
-- Table SÉPARÉE de lesson_progress, volontairement : là-bas, user_id est
-- NOT NULL REFERENCES auth.users, or un porteur de lien n'a pas de compte.
-- Rendre cette colonne nullable affaiblirait la table de TOUS les élèves pour
-- un cas de dépannage. Ici, la progression est rattachée au lien lui-même :
-- supprimer le lien supprime la progression (ON DELETE CASCADE), et supprimer
-- cette table suffira à revenir en arrière quand le bug de session sera réglé.

CREATE TABLE IF NOT EXISTS public.access_link_progress (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id            UUID NOT NULL REFERENCES public.access_links(id) ON DELETE CASCADE,
  phase_id           INTEGER NOT NULL,
  lesson_id          TEXT NOT NULL,
  is_completed       BOOLEAN DEFAULT FALSE,
  completion_method  TEXT CHECK (completion_method IN ('manual', 'auto_video', 'quiz')),
  time_spent_seconds INTEGER DEFAULT 0,
  quiz_score         INTEGER,
  quiz_total         INTEGER,
  completed_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(link_id, phase_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_access_link_progress_link ON public.access_link_progress(link_id);
CREATE INDEX IF NOT EXISTS idx_access_link_progress_phase ON public.access_link_progress(link_id, phase_id);

-- Comme access_links : RLS active, aucune policy publique. Seule la route
-- /api/progress y accède, en service_role, après avoir validé le token.
ALTER TABLE public.access_link_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on access_link_progress"
  ON public.access_link_progress FOR ALL
  USING (auth.jwt() ->> 'email' = 'academyfrance75@gmail.com');
