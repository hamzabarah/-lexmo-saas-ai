-- Mission 007 / Lot 2. Additive strategy layer; no reset or historical backfill.
-- Apply once after Focus V0 and Pilotage. A replay aborts before any change.
-- No writes to auth, Pilotage, execution history, or other Ecomy business tables.
BEGIN;
SET LOCAL lock_timeout = '5s';

DO $$
BEGIN
  IF to_regprocedure('public.focus_session_command(uuid,text,jsonb)') IS NULL OR
     obj_description(to_regprocedure('public.focus_session_command(uuid,text,jsonb)'), 'pg_proc')
       IS DISTINCT FROM 'ecomy-focus-v0-20260908' THEN
    RAISE EXCEPTION 'focus_strategy_requires_verified_v0';
  END IF;
  IF to_regclass('public.pilotage_objectives') IS NULL OR NOT EXISTS (
    SELECT 1 FROM pg_attribute WHERE attrelid=to_regclass('public.pilotage_objectives')
      AND attname='id' AND atttypid='uuid'::regtype AND NOT attisdropped
  ) THEN RAISE EXCEPTION 'focus_strategy_requires_pilotage_objectives_uuid'; END IF;
  IF to_regclass('public.os_phases') IS NOT NULL OR
     to_regclass('public.project_records') IS NOT NULL OR
     to_regprocedure('public.focus_strategy_guard()') IS NOT NULL OR
     to_regprocedure('public.focus_record_guard()') IS NOT NULL OR
     to_regprocedure('public.focus_record_payload_valid(text,jsonb)') IS NOT NULL OR
     to_regprocedure('public.focus_project_context(uuid,uuid)') IS NOT NULL OR EXISTS (
       SELECT 1 FROM information_schema.columns WHERE table_schema='public'
         AND table_name='focus_projects' AND column_name IN
           ('phase_id','objective_id','engine','purpose','hypothesis','expected_outcome',
            'success_criteria','priority','delivery_deadline','evaluation_deadline',
            'planned_time_minutes','planned_cost_eur')
     ) THEN RAISE EXCEPTION 'focus_strategy_already_installed_or_unexpected_objects'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint
    WHERE conrelid='public.focus_projects'::regclass AND conname='focus_projects_status_check'
      AND contype='c' AND pg_get_constraintdef(oid)=
      'CHECK ((status = ANY (ARRAY[''vital''::text, ''paused''::text, ''queued''::text])))')
  THEN RAISE EXCEPTION 'focus_strategy_unexpected_project_status_constraint'; END IF;
END $$;

-- Small bounded DDL lock, with failure rather than indefinite production blocking.
LOCK TABLE public.focus_projects IN ACCESS EXCLUSIVE MODE;

CREATE TABLE public.os_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  name text NOT NULL CHECK (length(btrim(name)) > 0 AND length(name) <= 200),
  position integer NOT NULL DEFAULT 0 CHECK (position >= 0),
  starts_on date,
  ends_on date,
  mission text CHECK (length(mission) <= 10000),
  status text NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned','active','paused','completed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT os_phases_dates_check CHECK (starts_on IS NULL OR ends_on IS NULL OR ends_on >= starts_on)
);
CREATE INDEX os_phases_owner_position ON public.os_phases(user_id,position,id);

ALTER TABLE public.focus_projects
  ADD COLUMN phase_id uuid REFERENCES public.os_phases(id) ON DELETE RESTRICT,
  ADD COLUMN objective_id uuid REFERENCES public.pilotage_objectives(id) ON DELETE RESTRICT,
  ADD COLUMN engine text CHECK (engine IN ('acquisition','conversion','expansion','systeme','risque')),
  ADD COLUMN purpose text CHECK (length(purpose) <= 10000),
  ADD COLUMN hypothesis text CHECK (length(hypothesis) <= 10000),
  ADD COLUMN expected_outcome text CHECK (length(expected_outcome) <= 10000),
  ADD COLUMN success_criteria text CHECK (length(success_criteria) <= 10000),
  ADD COLUMN priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('urgent','normal')),
  ADD COLUMN delivery_deadline date,
  ADD COLUMN evaluation_deadline date,
  ADD COLUMN planned_time_minutes integer CHECK (planned_time_minutes >= 0),
  ADD COLUMN planned_cost_eur numeric(12,2) CHECK (planned_cost_eur >= 0),
  ADD CONSTRAINT focus_projects_deadlines_check CHECK (
    delivery_deadline IS NULL OR evaluation_deadline IS NULL OR evaluation_deadline >= delivery_deadline
  );
-- Preserve all former statuses and rows; only extend the accepted lifecycle.
ALTER TABLE public.focus_projects DROP CONSTRAINT focus_projects_status_check;
ALTER TABLE public.focus_projects ADD CONSTRAINT focus_projects_status_check
  CHECK (status IN ('vital','paused','queued','evaluating','completed','cancelled'));
CREATE INDEX focus_projects_phase ON public.focus_projects(phase_id) WHERE phase_id IS NOT NULL;
CREATE INDEX focus_projects_objective ON public.focus_projects(objective_id) WHERE objective_id IS NOT NULL;
CREATE INDEX focus_projects_active ON public.focus_projects(user_id,position,id)
  WHERE status IN ('vital','evaluating');

CREATE FUNCTION public.focus_strategy_guard() RETURNS trigger
LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$
DECLARE phase_owner uuid; strategic_new jsonb; strategic_old jsonb;
  legacy_columns text[] := ARRAY['id','user_id','name','subtitle','status','color','position','created_at','updated_at'];
BEGIN
  IF TG_OP='UPDATE' THEN
    IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'focus_strategy_identity_immutable';
    END IF;
    NEW.created_at := OLD.created_at;
  ELSE NEW.created_at := clock_timestamp(); END IF;
  IF TG_TABLE_NAME='focus_projects' THEN
    -- Keep legacy table ACLs/policies, without extending direct browser writes to
    -- the new admin strategy/Pilotage fields. This guard intentionally runs as
    -- the caller (not SECURITY DEFINER); the server uses service_role.
    IF current_user IN ('anon','authenticated') THEN
      strategic_new := to_jsonb(NEW)-legacy_columns;
      IF TG_OP='INSERT' THEN
        IF jsonb_strip_nulls(strategic_new)<>'{"priority":"normal"}'::jsonb OR
           NEW.status IN ('evaluating','completed','cancelled') THEN
          RAISE EXCEPTION 'focus_strategy_admin_required';
        END IF;
      ELSE
        strategic_old := to_jsonb(OLD)-legacy_columns;
        IF strategic_new IS DISTINCT FROM strategic_old OR
           (NEW.status IS DISTINCT FROM OLD.status AND NEW.status IN ('evaluating','completed','cancelled')) THEN
          RAISE EXCEPTION 'focus_strategy_admin_required';
        END IF;
      END IF;
    END IF;
    -- Existing phase ownership cannot change; a legacy-only update does not
    -- need private os_phases SELECT permission or revalidation of this link.
    IF NEW.phase_id IS NOT NULL AND (TG_OP='INSERT' OR NEW.phase_id IS DISTINCT FROM OLD.phase_id) THEN
      SELECT user_id INTO phase_owner FROM public.os_phases WHERE id=NEW.phase_id FOR KEY SHARE;
      IF phase_owner IS DISTINCT FROM NEW.user_id THEN RAISE EXCEPTION 'focus_phase_forbidden'; END IF;
    END IF;
  END IF;
  NEW.updated_at := clock_timestamp();
  RETURN NEW;
END $$;
CREATE TRIGGER os_phases_strategy_guard BEFORE INSERT OR UPDATE ON public.os_phases
  FOR EACH ROW EXECUTE FUNCTION public.focus_strategy_guard();
CREATE TRIGGER focus_projects_strategy_guard BEFORE INSERT OR UPDATE ON public.focus_projects
  FOR EACH ROW EXECUTE FUNCTION public.focus_strategy_guard();

-- Typed payloads remain small and structured, instead of accepting arbitrary JSON.
CREATE FUNCTION public.focus_record_payload_valid(record_type text, value jsonb) RETURNS boolean
LANGUAGE plpgsql IMMUTABLE SET search_path=pg_catalog,public AS $$
DECLARE allowed text[]; entry record; amount numeric; text_limit integer;
BEGIN
  IF value IS NULL OR jsonb_typeof(value)<>'object' OR octet_length(value::text)>16384 THEN RETURN false; END IF;
  allowed := CASE record_type
    WHEN 'decision' THEN ARRAY['rationale','alternatives']
    WHEN 'output' THEN ARRAY['url','format']
    WHEN 'result' THEN ARRAY['metric','value','unit','source']
    WHEN 'lesson' THEN ARRAY['next_action']
    WHEN 'cost' THEN ARRAY['amount_eur','category'] END;
  IF allowed IS NULL THEN RETURN false; END IF;
  FOR entry IN SELECT key, val FROM jsonb_each(value) AS fields(key,val) LOOP
    IF NOT entry.key=ANY(allowed) THEN RETURN false; END IF;
    IF entry.key='alternatives' THEN
      IF jsonb_typeof(entry.val)<>'array' THEN RETURN false; END IF;
      IF jsonb_array_length(entry.val)>20 OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(entry.val) item
        WHERE jsonb_typeof(item)<>'string' OR length(item#>>'{}')>2000 OR length(btrim(item#>>'{}'))=0
      ) THEN RETURN false; END IF;
    ELSIF entry.key IN ('amount_eur','value') THEN
      IF jsonb_typeof(entry.val)<>'number' THEN RETURN false; END IF;
      IF entry.key='value' AND abs((entry.val#>>'{}')::numeric)>1.7976931348623157e308::numeric THEN RETURN false; END IF;
    ELSE
      text_limit := CASE entry.key WHEN 'url' THEN 2048 WHEN 'format' THEN 100 WHEN 'metric' THEN 200
        WHEN 'unit' THEN 100 WHEN 'source' THEN 2048 WHEN 'category' THEN 200 ELSE 10000 END;
      IF jsonb_typeof(entry.val)<>'string' OR length(entry.val#>>'{}')>text_limit
        OR length(btrim(entry.val#>>'{}'))=0 THEN RETURN false; END IF;
      IF entry.key='url' AND (entry.val#>>'{}') !~* '^https?://[^[:space:]/?#]+([/?#][^[:space:]]*)?$'
        THEN RETURN false; END IF;
    END IF;
  END LOOP;
  IF record_type='result' AND (value?'metric') IS DISTINCT FROM (value?'value') THEN RETURN false; END IF;
  IF record_type='cost' THEN
    IF NOT value?'amount_eur' THEN RETURN false; END IF;
    amount := (value->>'amount_eur')::numeric;
    IF amount<0 OR amount>9999999999.99 OR amount<>trunc(amount,2) THEN RETURN false; END IF;
  END IF;
  RETURN true;
END $$;

CREATE TABLE public.project_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  project_id uuid NOT NULL REFERENCES public.focus_projects(id) ON DELETE RESTRICT,
  type text NOT NULL CHECK (type IN ('decision','output','result','lesson','cost')),
  title text NOT NULL CHECK (length(btrim(title)) > 0 AND length(title) <= 200),
  content text CHECK (length(content) <= 10000),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT project_records_payload_check CHECK (public.focus_record_payload_valid(type,payload))
);
CREATE INDEX project_records_project_history ON public.project_records(user_id,project_id,created_at DESC,id DESC);

CREATE FUNCTION public.focus_record_guard() RETURNS trigger
LANGUAGE plpgsql SET search_path=pg_catalog,public AS $$
DECLARE project_owner uuid;
BEGIN
  IF TG_OP<>'INSERT' THEN RAISE EXCEPTION 'focus_records_append_only'; END IF;
  SELECT user_id INTO project_owner FROM public.focus_projects WHERE id=NEW.project_id FOR KEY SHARE;
  IF project_owner IS DISTINCT FROM NEW.user_id THEN RAISE EXCEPTION 'focus_project_forbidden'; END IF;
  NEW.created_at := clock_timestamp();
  RETURN NEW;
END $$;
CREATE TRIGGER project_records_history_guard BEFORE INSERT OR UPDATE OR DELETE ON public.project_records
  FOR EACH ROW EXECUTE FUNCTION public.focus_record_guard();
CREATE TRIGGER project_records_truncate_guard BEFORE TRUNCATE ON public.project_records
  FOR EACH STATEMENT EXECUTE FUNCTION public.focus_record_guard();

ALTER TABLE public.os_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_records ENABLE ROW LEVEL SECURITY;
-- Service code authenticates the existing admin and supplies the operator UUID.
-- Existing Focus table ACLs/policies and V0 execution guards are left unchanged.
REVOKE ALL ON TABLE public.os_phases,public.project_records FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT,INSERT,UPDATE ON public.os_phases TO service_role;
GRANT SELECT,INSERT ON public.project_records TO service_role;
REVOKE ALL ON FUNCTION public.focus_strategy_guard(), public.focus_record_guard(),
  public.focus_record_payload_valid(text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.focus_record_payload_valid(text,jsonb) TO service_role;

-- One consistent statement snapshot, no repair/expiration and no implicit writes.
-- Pilotage objectives are global admin records: link/read only, never mutate them.
CREATE FUNCTION public.focus_project_context(p_user uuid,p_project uuid) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE project public.focus_projects; result jsonb;
BEGIN
  IF p_user IS NULL THEN RAISE EXCEPTION 'focus_unauthorized'; END IF;
  SELECT * INTO project FROM public.focus_projects WHERE id=p_project AND user_id=p_user;
  IF NOT FOUND THEN RAISE EXCEPTION 'focus_project_forbidden'; END IF;
  WITH project_tasks AS (
    SELECT t.* FROM public.focus_tasks t WHERE t.project_id=p_project AND t.user_id=p_user
  ), project_sessions AS (
    SELECT s.* FROM public.focus_sessions s JOIN project_tasks t ON t.id=s.task_id WHERE s.user_id=p_user
  ), records AS (
    SELECT r.* FROM public.project_records r WHERE r.project_id=p_project AND r.user_id=p_user
  ), counts AS (
    SELECT (SELECT count(*) FROM project_tasks) AS tasks,
      (SELECT count(*) FROM project_sessions) AS sessions,(SELECT count(*) FROM records) AS records
  )
  SELECT jsonb_build_object(
    'project',to_jsonb(project),
    'phase',(SELECT to_jsonb(p) FROM public.os_phases p WHERE p.id=project.phase_id AND p.user_id=p_user),
    'objective',(SELECT to_jsonb(o) FROM public.pilotage_objectives o WHERE o.id=project.objective_id),
    'records',COALESCE((SELECT jsonb_agg(to_jsonb(r) ORDER BY created_at DESC,id DESC)
      FROM (SELECT * FROM records ORDER BY created_at DESC,id DESC LIMIT 50) r),'[]'::jsonb),
    'tasks',COALESCE((SELECT jsonb_agg(to_jsonb(t) ORDER BY created_at DESC,id DESC)
      FROM (SELECT * FROM project_tasks ORDER BY created_at DESC,id DESC LIMIT 100) t),'[]'::jsonb),
    'recent_sessions',COALESCE((SELECT jsonb_agg(to_jsonb(s) ORDER BY started_at DESC,id DESC)
      FROM (SELECT * FROM project_sessions ORDER BY started_at DESC,id DESC LIMIT 10) s),'[]'::jsonb),
    'counts',to_jsonb(c),
    'truncated',jsonb_build_object('records',c.records>50,'tasks',c.tasks>100,'recent_sessions',c.sessions>10),
    'totals',jsonb_build_object(
      'recorded_seconds',COALESCE((SELECT sum(CASE WHEN ended_at IS NULL THEN 0
        WHEN duration_override_seconds IS NOT NULL THEN greatest(0,duration_override_seconds)
        -- JavaScript Date.parse used by Focus V0 truncates each instant to milliseconds.
        ELSE greatest(0,floor(extract(epoch FROM date_trunc('milliseconds',ended_at)
          -date_trunc('milliseconds',started_at)))-COALESCE(paused_seconds,0)) END)
        FROM project_sessions),0),
      'cost_eur',COALESCE((SELECT sum((payload->>'amount_eur')::numeric) FROM records WHERE type='cost'),0)
    )
  ) INTO result FROM counts c;
  RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.focus_project_context(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.focus_project_context(uuid,uuid) TO service_role;
COMMENT ON FUNCTION public.focus_project_context(uuid,uuid) IS 'ecomy-focus-strategy-20260908';
COMMIT;
