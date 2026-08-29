-- Module « عُمق » : projets et priorités pour le module focus.
--
-- Les maquettes validées rattachent chaque tâche à un projet (pastille de
-- couleur + nom) et lui donnent une priorité. Le schéma focus existant ne
-- portait ni l'un ni l'autre : cette migration les ajoute sans rien retirer.
--
-- À noter : le badge « قيد التنفيذ » des maquettes n'est PAS une priorité,
-- c'est le statut de la tâche (focus_tasks.status = 'in_progress'). La
-- priorité ne distingue donc que « عاجل » du reste.

CREATE TABLE IF NOT EXISTS public.focus_projects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  subtitle   TEXT,
  status     TEXT NOT NULL DEFAULT 'queued'
               CHECK (status IN ('vital', 'paused', 'queued')),
  color      TEXT NOT NULL DEFAULT '#D97757',
  position   INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)
);

ALTER TABLE public.focus_tasks
  ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.focus_projects(id) ON DELETE SET NULL;

ALTER TABLE public.focus_tasks
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'normal';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'focus_tasks_priority_check'
  ) THEN
    ALTER TABLE public.focus_tasks
      ADD CONSTRAINT focus_tasks_priority_check CHECK (priority IN ('urgent', 'normal'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_focus_projects_user ON public.focus_projects(user_id, position);
CREATE INDEX IF NOT EXISTS idx_focus_tasks_project ON public.focus_tasks(project_id);

-- RLS : même modèle que les autres tables focus (propriétaire + admin).
ALTER TABLE public.focus_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own projects"
  ON public.focus_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own projects"
  ON public.focus_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own projects"
  ON public.focus_projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own projects"
  ON public.focus_projects FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access on focus_projects"
  ON public.focus_projects FOR ALL
  USING (auth.jwt() ->> 'email' = 'academyfrance75@gmail.com');

-- ─────────────────────────── Données de départ ───────────────────────────
-- Les 4 projets des maquettes, rattachés au compte administrateur.
-- Rejouable sans effet de bord grâce à UNIQUE (user_id, name).

INSERT INTO public.focus_projects (user_id, name, subtitle, status, color, position)
SELECT u.id, v.name, v.subtitle, v.status, v.color, v.position
FROM auth.users u
CROSS JOIN (VALUES
  ('ECOMY',                          NULL,              'vital',  '#C0392B', 1),
  ('MeteorX',                        'سوق النيازك',     'paused', '#D97757', 2),
  ('قنوات يوتيوب بالذكاء الاصطناعي', NULL,              'queued', '#8A9A5B', 3),
  ('وكيل ذكاء اصطناعي للمحتوى',      NULL,              'queued', '#8A9A5B', 4)
) AS v(name, subtitle, status, color, position)
WHERE u.email = 'academyfrance75@gmail.com'
ON CONFLICT (user_id, name) DO NOTHING;

-- Les 5 tâches ECOMY des maquettes, pour que la page soit lisible au premier
-- chargement. Supprimer ce bloc si tu préfères partir d'un tableau vide.

INSERT INTO public.focus_tasks (user_id, project_id, title, priority, status, task_type, scheduled_date, category)
SELECT p.user_id, p.id, v.title, v.priority, v.status, 'one_time', CURRENT_DATE, 'professional'
FROM public.focus_projects p
CROSS JOIN (VALUES
  ('التحقق من Stripe',                    'urgent', 'todo'),
  ('تحديث تصميم المنصة',                  'urgent', 'todo'),
  ('أداة إنشاء المحتوى',                  'normal', 'in_progress'),
  ('حسابات التواصل الاجتماعي',            'normal', 'todo'),
  ('الخطة الاستراتيجية لمليون يورو 2034', 'normal', 'todo')
) AS v(title, priority, status)
WHERE p.name = 'ECOMY'
  AND NOT EXISTS (
    SELECT 1 FROM public.focus_tasks t
    WHERE t.project_id = p.id AND t.title = v.title
  );
