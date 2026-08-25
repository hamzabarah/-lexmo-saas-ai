-- Module de pilotage personnel (réservé à l'administrateur).
--
-- Quatre niveaux : un objectif porte un levier de croissance, des relevés
-- successifs mesurent où il en est, une action tente de le faire bouger, un
-- compte rendu mesure ce que l'action a réellement produit à un horizon donné.
--
-- Comme partout ailleurs dans ce projet : RLS activée SANS policy. Ces tables
-- ne sont jamais lues avec la clé anon — seul le code serveur y accède, en
-- service_role, après avoir vérifié la session administrateur en TypeScript.

CREATE TABLE IF NOT EXISTS public.pilotage_objectives (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  lever           TEXT NOT NULL CHECK (lever IN ('trafic', 'clic', 'conversion', 'panier')),
  baseline_value  NUMERIC,
  target_value    NUMERIC NOT NULL,
  unit            TEXT NOT NULL,
  source_of_truth TEXT NOT NULL,
  due_date        DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'atteint', 'manque', 'abandonne')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Relevés successifs d'un objectif : c'est la TRAJECTOIRE qui est conservée,
-- pas seulement la dernière valeur. Un relevé par objectif et par jour, pour
-- qu'une saisie répétée corrige au lieu d'empiler.
CREATE TABLE IF NOT EXISTS public.pilotage_measurements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objective_id UUID NOT NULL REFERENCES public.pilotage_objectives(id) ON DELETE CASCADE,
  measured_at  DATE NOT NULL,
  value        NUMERIC NOT NULL,
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (objective_id, measured_at)
);

CREATE TABLE IF NOT EXISTS public.pilotage_actions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref              TEXT UNIQUE NOT NULL,
  objective_id     UUID REFERENCES public.pilotage_objectives(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  type             TEXT NOT NULL CHECK (type IN ('contenu', 'live', 'lancement', 'produit')),
  hypothesis       TEXT NOT NULL,
  planned_hours    NUMERIC,
  expected_revenue NUMERIC,
  stripe_link_ref  TEXT,
  scheduled_date   DATE NOT NULL,
  status           TEXT NOT NULL DEFAULT 'prevu'
                     CHECK (status IN ('prevu', 'fait', 'debriefe', 'abandonne')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pilotage_reports (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id        UUID NOT NULL REFERENCES public.pilotage_actions(id) ON DELETE CASCADE,
  horizon          TEXT NOT NULL CHECK (horizon IN ('J+1', 'J+7', 'J+14', 'J+30', 'J+90')),
  reported_at      DATE NOT NULL,
  reach            INTEGER,
  clicks           INTEGER,
  sales_497        INTEGER NOT NULL DEFAULT 0,
  sales_197        INTEGER NOT NULL DEFAULT 0,
  sales_97         INTEGER NOT NULL DEFAULT 0,
  actual_hours     NUMERIC,
  cause            TEXT,
  decision         TEXT CHECK (decision IN ('refaire', 'ajuster', 'arreter')),
  adjustment       TEXT,
  next_action      TEXT,
  next_action_date DATE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (action_id, horizon)
);

CREATE INDEX IF NOT EXISTS idx_pilotage_actions_scheduled ON public.pilotage_actions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_pilotage_reports_action ON public.pilotage_reports(action_id);
CREATE INDEX IF NOT EXISTS idx_pilotage_measurements_objective
  ON public.pilotage_measurements(objective_id, measured_at);

ALTER TABLE public.pilotage_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilotage_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilotage_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilotage_reports ENABLE ROW LEVEL SECURITY;
