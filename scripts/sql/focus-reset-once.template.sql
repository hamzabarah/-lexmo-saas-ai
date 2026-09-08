-- ONE-SHOT OPERATION, NEVER A NORMAL MIGRATION. No CASCADE. No auth deletion.
-- Generated manifest pins every row, owner and field; any drift aborts.
-- Do not run until all old Focus web/MCP writers are stopped.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
SET LOCAL TIME ZONE 'UTC';
LOCK TABLE public.focus_projects, public.focus_tasks, public.focus_subtasks,
 public.focus_sessions, public.focus_bad_habits, public.focus_habit_checks IN ACCESS EXCLUSIVE MODE;
DO $reset$
DECLARE
 expected jsonb := '__FOCUS_MANIFEST__'::jsonb;
 targets oid[] := ARRAY['public.focus_projects'::regclass::oid,'public.focus_tasks'::regclass::oid,
   'public.focus_subtasks'::regclass::oid,'public.focus_sessions'::regclass::oid,
   'public.focus_bad_habits'::regclass::oid,'public.focus_habit_checks'::regclass::oid];
 tab text; actual jsonb; wanted jsonb;
BEGIN
 IF (SELECT count(*) FROM jsonb_object_keys(expected)) <> 6
 OR (SELECT sum(jsonb_array_length(value)) FROM jsonb_each(expected)) = 0 THEN
   RAISE EXCEPTION 'reset_invalid_manifest';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname=current_user AND (rolsuper OR rolbypassrls)) THEN
   RAISE EXCEPTION 'reset_requires_administrative_visibility';
 END IF;
 IF to_regprocedure('public.focus_session_command(uuid,text,jsonb)') IS NOT NULL THEN
   RAISE EXCEPTION 'reset_refused_engine_already_installed';
 END IF;
 IF EXISTS(SELECT 1 FROM pg_class WHERE oid=ANY(targets) AND (relkind<>'r' OR relispartition))
 OR EXISTS(SELECT 1 FROM pg_inherits WHERE inhrelid=ANY(targets) OR inhparent=ANY(targets)) THEN
   RAISE EXCEPTION 'reset_refused_partition_or_inheritance';
 END IF;
 IF EXISTS(SELECT 1 FROM pg_constraint WHERE contype='f' AND confrelid=ANY(targets) AND NOT conrelid=ANY(targets)) THEN
   RAISE EXCEPTION 'reset_refused_external_inbound_foreign_key';
 END IF;
 IF EXISTS(SELECT 1 FROM pg_trigger WHERE tgrelid=ANY(targets) AND NOT tgisinternal)
 OR EXISTS(SELECT 1 FROM pg_rewrite WHERE ev_class=ANY(targets)) THEN
   RAISE EXCEPTION 'reset_refused_custom_trigger_or_rule';
 END IF;
 -- Refuse downstream views/materialized views rather than silently emptying their source.
 IF EXISTS(SELECT 1 FROM pg_depend d JOIN pg_rewrite r ON r.oid=d.objid
   WHERE d.classid='pg_rewrite'::regclass AND d.refclassid='pg_class'::regclass
   AND d.refobjid=ANY(targets) AND NOT r.ev_class=ANY(targets)) THEN
   RAISE EXCEPTION 'reset_refused_external_view';
 END IF;
 -- Logical subscribers can have external effects. Explicit review is required.
 IF EXISTS(SELECT 1 FROM pg_publication WHERE puballtables)
 OR EXISTS(SELECT 1 FROM pg_publication_rel WHERE prrelid=ANY(targets))
 OR EXISTS(SELECT 1 FROM pg_publication_namespace WHERE pnnspid='public'::regnamespace) THEN
   RAISE EXCEPTION 'reset_refused_publication_review_required';
 END IF;
 FOR tab, wanted IN SELECT key,value FROM jsonb_each(expected) LOOP
   IF tab NOT IN ('focus_projects','focus_tasks','focus_subtasks','focus_sessions','focus_bad_habits','focus_habit_checks') THEN
     RAISE EXCEPTION 'reset_invalid_scope';
   END IF;
   EXECUTE format($q$SELECT COALESCE(jsonb_agg(jsonb_build_object(
     'id', t.id, 'owner', to_jsonb(t)->'user_id',
     'hash', (SELECT jsonb_object_agg(key,md5(CASE WHEN right(key,3)='_at' AND value IS NOT NULL
       THEN to_char(value::timestamptz AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US') || 'Z'
       ELSE value END)) FROM jsonb_each_text(to_jsonb(t)))) ORDER BY t.id),'[]'::jsonb)
     FROM public.%I t$q$,tab) INTO actual;
   SELECT COALESCE(jsonb_agg(value ORDER BY value->>'id'),'[]'::jsonb) INTO wanted FROM jsonb_array_elements(wanted);
   IF actual IS DISTINCT FROM wanted THEN
     RAISE EXCEPTION 'reset_refused_snapshot_mismatch: %',tab;
   END IF;
 END LOOP;
END $reset$;
-- RESTRICT rejects any missing referencing table. No sequence reset requested.
TRUNCATE TABLE public.focus_habit_checks, public.focus_bad_habits,
 public.focus_subtasks, public.focus_sessions, public.focus_tasks, public.focus_projects
 CONTINUE IDENTITY RESTRICT;
COMMIT;
