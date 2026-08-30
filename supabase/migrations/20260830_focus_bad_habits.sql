-- Module « عُمق » : suivi des habitudes à éviter.
--
-- Le principe est inversé par rapport à un tracker classique : le succès,
-- c'est de NE PAS faire la chose. Chaque jour reçoit donc un état parmi
-- « évitée » (réussite) ou « craqué » (échec) — l'absence d'état signifie
-- simplement que la journée n'a pas encore été renseignée.

CREATE TABLE IF NOT EXISTS public.focus_bad_habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  rule_note   TEXT,
  position    INTEGER NOT NULL DEFAULT 0,
  archived_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, title)
);

CREATE TABLE IF NOT EXISTS public.focus_habit_checks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id   UUID NOT NULL REFERENCES public.focus_bad_habits(id) ON DELETE CASCADE,
  check_date DATE NOT NULL,
  state      TEXT NOT NULL CHECK (state IN ('avoided', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (habit_id, check_date)
);

CREATE INDEX IF NOT EXISTS idx_focus_bad_habits_user ON public.focus_bad_habits(user_id, position);
CREATE INDEX IF NOT EXISTS idx_focus_habit_checks_habit ON public.focus_habit_checks(habit_id, check_date);

-- RLS : même modèle que les autres tables focus (propriétaire + admin).
-- Les relevés n'ont pas de user_id : la propriété se lit à travers l'habitude.
ALTER TABLE public.focus_bad_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_habit_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own habits"
  ON public.focus_bad_habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own habits"
  ON public.focus_bad_habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own habits"
  ON public.focus_bad_habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own habits"
  ON public.focus_bad_habits FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access on focus_bad_habits"
  ON public.focus_bad_habits FOR ALL
  USING (auth.jwt() ->> 'email' = 'academyfrance75@gmail.com');

CREATE POLICY "Users manage own habit checks"
  ON public.focus_habit_checks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.focus_bad_habits h
      WHERE h.id = focus_habit_checks.habit_id AND h.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin full access on focus_habit_checks"
  ON public.focus_habit_checks FOR ALL
  USING (auth.jwt() ->> 'email' = 'academyfrance75@gmail.com');

-- ─────────────────────────── Données de départ ───────────────────────────
-- Rejouable sans effet de bord grâce à UNIQUE (user_id, title).

INSERT INTO public.focus_bad_habits (user_id, title, rule_note, position)
SELECT u.id, v.title, v.rule_note, v.position
FROM auth.users u
CROSS JOIN (VALUES
  ('فتح موقع ANEF',                        'ممنوع إلا الجمعة 18:00', 1),
  ('مجموعات فيسبوك للتجنيس',               'ممنوع نهائياً',          2),
  ('TikTok أثناء ساعات العمل',             'ممنوع وقت العمل',        3),
  ('الهاتف بجانبي أثناء جلسة التركيز',     'الهاتف في غرفة أخرى',    4)
) AS v(title, rule_note, position)
WHERE u.email = 'academyfrance75@gmail.com'
ON CONFLICT (user_id, title) DO NOTHING;
