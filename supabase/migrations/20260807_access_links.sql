-- Liens d'accès : URL porteuse d'un token qui ouvre la formation SANS session
-- ni cookie. Le token dans l'URL est la seule source de vérité — le serveur ne
-- lit aucun état local du navigateur.

CREATE TABLE IF NOT EXISTS public.access_links (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token        TEXT NOT NULL UNIQUE,
  label        TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  uses_count   INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_access_links_token ON public.access_links(token);

-- Journal détaillé : c'est le nombre d'IP DISTINCTES qui révèle qu'un lien
-- circule, pas le compteur d'usages.
CREATE TABLE IF NOT EXISTS public.access_link_uses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id    UUID NOT NULL REFERENCES public.access_links(id) ON DELETE CASCADE,
  used_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip         TEXT,
  user_agent TEXT,
  path       TEXT
);

CREATE INDEX IF NOT EXISTS idx_access_link_uses_link ON public.access_link_uses(link_id);

-- RLS active SANS policy publique : même avec la clé anon, la liste des tokens
-- est inaccessible. Seuls le middleware et les routes admin y touchent, en
-- service_role (qui contourne RLS).
ALTER TABLE public.access_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_link_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on access_links"
  ON public.access_links FOR ALL
  USING (auth.jwt() ->> 'email' = 'academyfrance75@gmail.com');

CREATE POLICY "Admin full access on access_link_uses"
  ON public.access_link_uses FOR ALL
  USING (auth.jwt() ->> 'email' = 'academyfrance75@gmail.com');

-- Incrément + journalisation en un seul aller-retour, appelé depuis le
-- middleware via waitUntil (hors du chemin critique de la réponse).
CREATE OR REPLACE FUNCTION public.record_access_link_use(
  p_token      TEXT,
  p_ip         TEXT,
  p_user_agent TEXT,
  p_path       TEXT
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_id UUID;
BEGIN
  UPDATE public.access_links
     SET uses_count = uses_count + 1,
         last_used_at = NOW()
   WHERE token = p_token AND is_active = TRUE
  RETURNING id INTO v_id;

  IF v_id IS NOT NULL THEN
    INSERT INTO public.access_link_uses (link_id, ip, user_agent, path)
    VALUES (v_id, p_ip, p_user_agent, p_path);
  END IF;
END;
$$;

-- Vue admin : les liens + le nombre d'IP distinctes par lien.
CREATE OR REPLACE FUNCTION public.access_links_overview()
RETURNS TABLE (
  id           UUID,
  token        TEXT,
  label        TEXT,
  created_at   TIMESTAMPTZ,
  expires_at   TIMESTAMPTZ,
  is_active    BOOLEAN,
  uses_count   INTEGER,
  last_used_at TIMESTAMPTZ,
  distinct_ips BIGINT
)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT l.id, l.token, l.label, l.created_at, l.expires_at, l.is_active,
         l.uses_count, l.last_used_at,
         COUNT(DISTINCT u.ip) AS distinct_ips
    FROM public.access_links l
    LEFT JOIN public.access_link_uses u ON u.link_id = l.id
   GROUP BY l.id
   ORDER BY l.created_at DESC;
$$;

-- Ces deux fonctions sont SECURITY DEFINER : PostgREST les exposerait à anon
-- par défaut. On coupe, seul service_role peut les appeler.
REVOKE EXECUTE ON FUNCTION public.record_access_link_use(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.access_links_overview() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.record_access_link_use(TEXT, TEXT, TEXT, TEXT) TO service_role;
GRANT  EXECUTE ON FUNCTION public.access_links_overview() TO service_role;
