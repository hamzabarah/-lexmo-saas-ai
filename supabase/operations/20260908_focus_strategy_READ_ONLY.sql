-- Mission 007: run this entire file in the Supabase SQL Editor BEFORE Lot 2.
-- READ ONLY: one catalog/data SELECT, no DDL, DML, DO, or application RPC call.
-- No titles, email addresses, user identifiers, function bodies, or query text
-- are returned. Existing Focus history is counted, never reset or repaired.
-- Any SQL error / missing result / BLOCKED marker means STOP; do not migrate.
-- An OK result is valid only for this snapshot. Stop Focus/MCP use, explicitly
-- close any running/paused session, then migrate without resuming old writes.
-- This is intentionally NOT a migration and is safe to repeat.
BEGIN READ ONLY;
SET LOCAL statement_timeout = '30s';
SET LOCAL lock_timeout = '5s';
WITH
focus_tables(name) AS (VALUES ('focus_projects'),('focus_tasks'),('focus_subtasks'),
  ('focus_sessions'),('focus_bad_habits'),('focus_habit_checks')),
new_columns(name) AS (VALUES ('phase_id'),('objective_id'),('engine'),('purpose'),
  ('hypothesis'),('expected_outcome'),('success_criteria'),('priority'),
  ('delivery_deadline'),('evaluation_deadline'),('planned_time_minutes'),('planned_cost_eur')),
new_relations(name) AS (VALUES ('os_phases'),('project_records'),('os_phases_pkey'),
  ('project_records_pkey'),('os_phases_owner_position'),('focus_projects_phase'),
  ('focus_projects_objective'),('focus_projects_active'),('project_records_project_history')),
new_functions(name) AS (VALUES ('focus_strategy_guard'),('focus_record_guard'),
  ('focus_record_payload_valid'),('focus_project_context')),
new_project_constraints(name) AS (VALUES ('focus_projects_phase_id_fkey'),
  ('focus_projects_objective_id_fkey'),('focus_projects_engine_check'),('focus_projects_purpose_check'),
  ('focus_projects_hypothesis_check'),('focus_projects_expected_outcome_check'),
  ('focus_projects_success_criteria_check'),('focus_projects_priority_check'),
  ('focus_projects_planned_time_minutes_check'),('focus_projects_planned_cost_eur_check'),
  ('focus_projects_deadlines_check')),
expected_columns(table_name,column_name,type_name,not_null) AS (VALUES
  ('focus_projects','id','uuid',true),('focus_projects','user_id','uuid',true),
  ('focus_projects','name','text',true),('focus_projects','subtitle','text',false),
  ('focus_projects','status','text',true),('focus_projects','color','text',true),
  ('focus_projects','position','integer',true),('focus_projects','created_at','timestamp with time zone',true),
  ('focus_projects','updated_at','timestamp with time zone',true),
  ('pilotage_objectives','id','uuid',true),('pilotage_objectives','title','text',true),
  ('pilotage_objectives','lever','text',true),('pilotage_objectives','baseline_value','numeric',false),
  ('pilotage_objectives','target_value','numeric',true),('pilotage_objectives','unit','text',true),
  ('pilotage_objectives','source_of_truth','text',true),('pilotage_objectives','due_date','date',true),
  ('pilotage_objectives','status','text',true),('pilotage_objectives','created_at','timestamp with time zone',true),
  ('focus_sessions','task_id','uuid',true),('focus_sessions','subtask_id','uuid',false),
  ('focus_sessions','paused_seconds','integer',true),('focus_sessions','planned_duration_minutes','integer',true),
  ('focus_sessions','paused_at','timestamp with time zone',false),
  ('focus_sessions','duration_override_seconds','integer',false),('focus_sessions','completion_source','text',false),
  ('focus_subtasks','completed_session_id','uuid',false),('focus_subtasks','archived_at','timestamp with time zone',false),
  ('focus_tasks','completed_at','timestamp with time zone',false),('focus_tasks','archived_at','timestamp with time zone',false)),
-- MD5 is a change detector, not a security credential. Sources are the exact
-- three function bodies in 20260908_focus_v0.sql, with CRLF normalized to LF.
expected_functions(signature,body_md5,definer,return_type) AS (VALUES
  ('public.focus_execution_guard()','6700317ddd53b9eb979afcd0d67810d0',false,'trigger'),
  ('public.focus_preserve_session()','4826faa6a9b2c802f86a991f35022858',false,'trigger'),
  ('public.focus_session_command(uuid,text,jsonb)','752b82de2d49a99a92acc0655947d0f0',true,'jsonb')),
expected_triggers(table_name,name,signature,type_bits) AS (VALUES
  ('focus_tasks','focus_tasks_execution_guard','public.focus_execution_guard()',31),
  ('focus_subtasks','focus_subtasks_execution_guard','public.focus_execution_guard()',31),
  ('focus_sessions','focus_session_history_guard','public.focus_preserve_session()',27)),
required_rls(name) AS (VALUES ('focus_projects'),('focus_sessions'),('pilotage_objectives')),
-- Only events/tags reachable by this migration need a DDL side-effect review.
-- No trigger is trusted just because its name looks like a Supabase default.
-- https://www.postgresql.org/docs/17/event-trigger-matrix.html
-- https://www.postgresql.org/docs/17/catalog-pg-event-trigger.html
-- Reviewed Supabase sources, pinned to commit ea6aa74e43a9da0032626361535e5aa3cd698bda:
-- https://github.com/supabase/postgres/tree/ea6aa74e43a9da0032626361535e5aa3cd698bda/migrations/db/migrations
-- Bodies below come from 20220321174452_fix-postgrest-alter-type-event-trigger.sql,
-- 20220317095840_pg_graphql.sql, 20231017062225_grant_pg_graphql_permissions_for_custom_roles.sql,
-- and 20260421000001_rescope_pg_graphql_access_trigger.sql. Only CRLF is normalized.
-- Both owners must be supabase_admin (the platform migration runner in db/migrate.sh).
-- PostgREST ddl_watch runs for our DDL; it notifies for CREATE TABLE/FUNCTION/TRIGGER,
-- ALTER TABLE and COMMENT, not CREATE INDEX or GRANT/REVOKE. It changes no business rows.
-- drop_watch runs for DROP CONSTRAINT, but a table constraint is not a watched object type.
-- Legacy GraphQL hooks run for the four CREATE FUNCTION statements, but only change
-- GraphQL objects when the new function is named resolve. All four Lot 2 names are focus_*.
-- The 2026 GraphQL hook is restricted to CREATE EXTENSION, absent from Lot 2.
-- Ecomy's observed GraphQL body dd3f... is EXACTLY the 2026 source with only
-- pg_catalog. added before pg_event_trigger_ddl_commands(). Its empty search_path
-- is safe for these catalog-qualified/built-in references. Its CREATE FUNCTION
-- binding is NOT the upstream 2026 binding: the OID join has no classid filter.
-- Therefore this specific combination is accepted only when pg_graphql is absent,
-- which proves that the hook returns before any GraphQL DDL/grant, regardless of OIDs.
-- The two observed PostgREST bodies are unchanged; only their empty search_path differs.
-- Exact singleton proconfig arrays are checked: no additional settings are accepted.
-- https://supabase.com/docs/guides/database/functions
-- This allowlist applies ONLY to the reviewed 20260908_focus_strategy.sql migration.
-- Recheck immediately before intervention; no extension/configuration change may
-- occur between this snapshot and the migration. No GraphQL repair is performed here.
-- Unknown bodies/configuration/owners remain blocked; no trigger is disabled or executed here.
known_supabase_event_triggers(name,event,tags,function_name,body_md5,function_config,requires_graphql_absent,source_revision) AS (VALUES
  ('pgrst_ddl_watch','ddl_command_end',NULL::text[],'pgrst_ddl_watch',
    '7f27b8118fea5c88b0164331292859e3',NULL::text[],false,'20220321174452'),
  ('pgrst_drop_watch','sql_drop',NULL::text[],'pgrst_drop_watch',
    'bc09cc3003d66f91844af4cb05e203b7',NULL::text[],false,'20220321174452'),
  ('issue_pg_graphql_access','ddl_command_end',ARRAY['CREATE FUNCTION'],'grant_pg_graphql_access',
    '03f711be02dbeee5204473fe9349832d',NULL::text[],false,'20220317095840'),
  ('issue_pg_graphql_access','ddl_command_end',ARRAY['CREATE FUNCTION'],'grant_pg_graphql_access',
    '27ec0d7b5d11307e5bb2bb2226d07a71',NULL::text[],false,'20231017062225'),
  ('issue_pg_graphql_access','ddl_command_end',ARRAY['CREATE EXTENSION'],'grant_pg_graphql_access',
    '6bb1d2b391560d7101764157104ba354',NULL::text[],false,'20260421000001'),
  ('pgrst_ddl_watch','ddl_command_end',NULL::text[],'pgrst_ddl_watch',
    '7f27b8118fea5c88b0164331292859e3',ARRAY['search_path=""'],false,'20220321174452-empty-search-path'),
  ('pgrst_drop_watch','sql_drop',NULL::text[],'pgrst_drop_watch',
    'bc09cc3003d66f91844af4cb05e203b7',ARRAY['search_path=""'],false,'20220321174452-empty-search-path'),
  ('issue_pg_graphql_access','ddl_command_end',ARRAY['CREATE FUNCTION'],'grant_pg_graphql_access',
    'dd3f3e2bb94cff45ef24b9cecb6af1c8',ARRAY['search_path=""'],true,'20260421000001-qualified-builtin-legacy-binding')),
graphql_extension_state AS (SELECT EXISTS (
  SELECT 1 FROM pg_catalog.pg_extension WHERE extname='pg_graphql'
) AS present),
event_trigger_catalog AS (SELECT e.evtname,e.evtevent,e.evtenabled,e.evttags,
  pg_get_userbyid(e.evtowner) AS event_owner,
  jsonb_build_object('schema',n.nspname,'name',p.proname,'owner',pg_get_userbyid(p.proowner),
    'language',l.lanname,'security_definer',p.prosecdef,
    'search_path',(SELECT setting FROM unnest(p.proconfig) setting WHERE setting LIKE 'search_path=%'),
    'normalized_body_md5',md5(replace(p.prosrc,chr(13)||chr(10),chr(10)))) AS function_metadata,
  known.source_revision AS reviewed_supabase_revision,
  known.name IS NOT NULL AND (NOT known.requires_graphql_absent OR NOT graphql.present) AS standard_compatible,
  CASE WHEN known.requires_graphql_absent THEN 'pg_graphql_must_be_absent' END AS compatibility_condition,
  graphql.present AS graphql_extension_present,
  evtenabled IN ('O','A') AND CASE
    WHEN evtevent IN ('ddl_command_start','ddl_command_end') THEN evttags IS NULL OR evttags &&
      ARRAY['CREATE TABLE','CREATE INDEX','CREATE FUNCTION','CREATE TRIGGER','ALTER TABLE','COMMENT','GRANT','REVOKE']::text[]
    WHEN evtevent IN ('sql_drop','table_rewrite') THEN evttags IS NULL OR 'ALTER TABLE'=ANY(evttags)
    WHEN evtevent='login' THEN false
    ELSE true END AS applies_to_lot2
  FROM pg_event_trigger e JOIN pg_proc p ON p.oid=e.evtfoid
  JOIN pg_namespace n ON n.oid=p.pronamespace JOIN pg_language l ON l.oid=p.prolang
  CROSS JOIN graphql_extension_state graphql
  LEFT JOIN known_supabase_event_triggers known ON known.name=e.evtname AND known.event=e.evtevent
    AND known.tags IS NOT DISTINCT FROM e.evttags AND e.evtenabled='O'
    AND n.nspname='extensions' AND p.proname=known.function_name
    AND pg_get_userbyid(e.evtowner)='supabase_admin' AND pg_get_userbyid(p.proowner)='supabase_admin'
    AND l.lanname='plpgsql' AND p.prorettype='event_trigger'::regtype AND p.pronargs=0
    AND p.prokind='f' AND NOT p.prosecdef AND p.proconfig IS NOT DISTINCT FROM known.function_config AND p.probin IS NULL
    AND p.provolatile='v' AND p.proparallel='u' AND NOT p.proisstrict
    AND NOT p.proretset AND NOT p.proleakproof
    AND md5(replace(p.prosrc,chr(13)||chr(10),chr(10)))=known.body_md5),
event_trigger_scope AS (SELECT e.*,applies_to_lot2 AND NOT standard_compatible AS requires_review
  FROM event_trigger_catalog e),
client_roles AS (SELECT oid,rolname FROM pg_roles WHERE rolname IN ('anon','authenticated')),
counts AS (SELECT jsonb_build_object(
  'focus_projects',(SELECT count(*) FROM public.focus_projects),
  'focus_tasks',(SELECT count(*) FROM public.focus_tasks),
  'focus_subtasks',(SELECT count(*) FROM public.focus_subtasks),
  'focus_sessions',(SELECT count(*) FROM public.focus_sessions),
  'focus_bad_habits',(SELECT count(*) FROM public.focus_bad_habits),
  'focus_habit_checks',(SELECT count(*) FROM public.focus_habit_checks)) AS value),
data_checks AS (SELECT
  (SELECT count(*) FROM public.focus_sessions WHERE ended_at IS NULL AND status IN ('running','paused')) AS open_sessions,
  (SELECT count(*) FROM public.focus_tasks WHERE (status='done') IS DISTINCT FROM (completed_at IS NOT NULL)) AS inconsistent_task_completion,
  (SELECT count(*) FROM public.focus_subtasks WHERE is_completed IS DISTINCT FROM (completed_at IS NOT NULL)) AS inconsistent_subtask_completion,
  (SELECT count(*) FROM public.focus_tasks t JOIN public.focus_projects p ON p.id=t.project_id WHERE t.user_id<>p.user_id) AS task_project_owner_mismatch,
  (SELECT count(*) FROM public.focus_subtasks s JOIN public.focus_tasks t ON t.id=s.task_id WHERE s.user_id<>t.user_id) AS subtask_owner_mismatch,
  (SELECT count(*) FROM public.focus_sessions s LEFT JOIN public.focus_tasks t ON t.id=s.task_id
    WHERE t.id IS NULL OR s.user_id<>t.user_id) AS session_owner_mismatch,
  (SELECT count(*) FROM public.focus_sessions s JOIN public.focus_subtasks st ON st.id=s.subtask_id
    WHERE s.user_id<>st.user_id OR s.task_id<>st.task_id) AS session_subtask_mismatch,
  (SELECT count(*) FROM public.focus_subtasks st JOIN public.focus_sessions s ON s.id=st.completed_session_id
    WHERE s.user_id<>st.user_id OR s.task_id<>st.task_id) AS completed_session_mismatch,
  (SELECT count(*) FROM public.focus_sessions WHERE ended_at<started_at OR paused_seconds<0
    OR duration_override_seconds<0 OR (status IN ('running','paused')) IS DISTINCT FROM (ended_at IS NULL)) AS invalid_session_intervals),
activity AS (SELECT count(*) AS count FROM pg_stat_activity WHERE pid<>pg_backend_pid()
  AND datname=current_database() AND state IS DISTINCT FROM 'idle'
  AND query ~* '(focus_(projects|tasks|subtasks|sessions|bad_habits|habit_checks|session_command)|os_phases|project_records)'),
blockers(code,object_name) AS (
  SELECT 'table_missing_or_not_plain_table','public.'||f.name FROM focus_tables f
    LEFT JOIN pg_class c ON c.oid=to_regclass('public.'||f.name) WHERE c.oid IS NULL OR c.relkind<>'r'
  UNION ALL SELECT 'new_relation_name_conflict','public.'||name FROM new_relations WHERE to_regclass('public.'||name) IS NOT NULL
  UNION ALL SELECT 'new_type_name_conflict','public.'||t.typname FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace
    WHERE n.nspname='public' AND t.typname IN ('os_phases','_os_phases','project_records','_project_records')
  UNION ALL SELECT 'new_function_name_conflict','public.'||p.proname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND p.proname IN (SELECT name FROM new_functions)
  UNION ALL SELECT 'new_project_column_conflict','focus_projects.'||a.attname FROM pg_attribute a
    WHERE a.attrelid='public.focus_projects'::regclass AND NOT a.attisdropped AND a.attname IN (SELECT name FROM new_columns)
  UNION ALL SELECT 'new_project_constraint_conflict',conname FROM pg_constraint
    WHERE conrelid='public.focus_projects'::regclass AND conname IN (SELECT name FROM new_project_constraints)
  UNION ALL SELECT 'new_project_trigger_conflict',tgname FROM pg_trigger
    WHERE tgrelid='public.focus_projects'::regclass AND tgname='focus_projects_strategy_guard'
  UNION ALL SELECT 'base_column_mismatch',e.table_name||'.'||e.column_name FROM expected_columns e
    LEFT JOIN pg_attribute a ON a.attrelid=to_regclass('public.'||e.table_name) AND a.attname=e.column_name AND NOT a.attisdropped
    WHERE a.attnum IS NULL OR format_type(a.atttypid,a.atttypmod)<>e.type_name OR a.attnotnull IS DISTINCT FROM e.not_null
  UNION ALL SELECT 'unexpected_base_project_column',a.attname FROM pg_attribute a
    WHERE a.attrelid='public.focus_projects'::regclass AND a.attnum>0 AND NOT a.attisdropped
    AND a.attname NOT IN (SELECT column_name FROM expected_columns WHERE table_name='focus_projects')
  UNION ALL SELECT 'project_status_constraint_mismatch','focus_projects_status_check' WHERE NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conrelid='public.focus_projects'::regclass AND conname='focus_projects_status_check'
      AND contype='c' AND convalidated AND pg_get_constraintdef(oid)=
        'CHECK ((status = ANY (ARRAY[''vital''::text, ''paused''::text, ''queued''::text])))')
  UNION ALL SELECT 'referenced_id_not_uuid_nonnull_unique',r.name FROM (VALUES ('auth.users'),('public.focus_projects'),('public.pilotage_objectives')) r(name)
    WHERE NOT EXISTS (SELECT 1 FROM pg_attribute a JOIN pg_index i ON i.indrelid=a.attrelid
      WHERE a.attrelid=to_regclass(r.name) AND a.attname='id' AND NOT a.attisdropped AND a.atttypid='uuid'::regtype AND a.attnotnull
      AND i.indisunique AND i.indisvalid AND i.indisready AND i.indimmediate AND i.indnkeyatts=1
      AND i.indkey[0]=a.attnum AND i.indpred IS NULL AND i.indexprs IS NULL)
  UNION ALL SELECT 'rls_missing_or_non_table','public.'||r.name FROM required_rls r
    LEFT JOIN pg_class c ON c.oid=to_regclass('public.'||r.name) WHERE c.oid IS NULL OR c.relkind<>'r' OR NOT c.relrowsecurity
  UNION ALL SELECT 'service_role_missing_bypassrls','service_role' WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='service_role' AND rolbypassrls)
  UNION ALL SELECT 'client_role_missing',r.name FROM (VALUES ('anon'),('authenticated')) r(name) WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname=r.name)
  UNION ALL SELECT 'service_role_schema_usage_missing','public' FROM pg_roles r WHERE r.rolname='service_role' AND NOT has_schema_privilege(r.oid,'public','USAGE')
  UNION ALL SELECT 'service_role_table_permission_missing',x.table_name||':'||x.privilege FROM pg_roles r CROSS JOIN
    (VALUES ('public.focus_projects','SELECT'),('public.focus_projects','INSERT'),('public.focus_projects','UPDATE'),('public.pilotage_objectives','SELECT')) x(table_name,privilege)
    WHERE r.rolname='service_role' AND NOT COALESCE(has_table_privilege(r.oid,to_regclass(x.table_name),x.privilege),false)
  UNION ALL SELECT 'v0_function_changed_or_missing',e.signature FROM expected_functions e
    LEFT JOIN pg_proc p ON p.oid=to_regprocedure(e.signature) LEFT JOIN pg_language l ON l.oid=p.prolang
    WHERE p.oid IS NULL OR md5(replace(p.prosrc,chr(13)||chr(10),chr(10)))<>e.body_md5
      OR p.prosecdef IS DISTINCT FROM e.definer OR p.proconfig IS DISTINCT FROM ARRAY['search_path=public']::text[]
      OR l.lanname<>'plpgsql' OR p.prorettype<>e.return_type::regtype OR p.provolatile<>'v'
  UNION ALL SELECT 'v0_marker_missing_or_changed','focus_session_command' WHERE
    obj_description(to_regprocedure('public.focus_session_command(uuid,text,jsonb)'),'pg_proc') IS DISTINCT FROM 'ecomy-focus-v0-20260908'
  UNION ALL SELECT 'v0_trigger_missing_disabled_or_changed',e.name FROM expected_triggers e
    LEFT JOIN pg_trigger t ON t.tgrelid=to_regclass('public.'||e.table_name) AND t.tgname=e.name
    WHERE t.oid IS NULL OR t.tgenabled NOT IN ('O','A') OR t.tgisinternal OR t.tgfoid IS DISTINCT FROM to_regprocedure(e.signature)
      OR t.tgtype<>e.type_bits OR t.tgqual IS NOT NULL OR t.tgnargs<>0 OR cardinality(t.tgattr::smallint[])<>0
  UNION ALL SELECT 'v0_rpc_service_permission_missing','focus_session_command' FROM pg_roles r WHERE r.rolname='service_role'
    AND NOT COALESCE(has_function_privilege(r.oid,to_regprocedure('public.focus_session_command(uuid,text,jsonb)'),'EXECUTE'),false)
  UNION ALL SELECT 'v0_rpc_client_permission_unsafe',r.rolname FROM client_roles r
    WHERE COALESCE(has_function_privilege(r.oid,to_regprocedure('public.focus_session_command(uuid,text,jsonb)'),'EXECUTE'),false)
  UNION ALL SELECT 'v0_session_table_permission_unsafe',r.rolname||':'||p.name FROM client_roles r
    CROSS JOIN (VALUES ('INSERT'),('UPDATE'),('DELETE'),('TRUNCATE')) p(name)
    WHERE has_table_privilege(r.oid,'public.focus_sessions',p.name)
  UNION ALL SELECT 'v0_session_column_permission_unsafe',r.rolname||':'||p.name FROM client_roles r
    CROSS JOIN (VALUES ('INSERT'),('UPDATE')) p(name)
    WHERE has_any_column_privilege(r.oid,'public.focus_sessions',p.name)
  UNION ALL SELECT 'v0_open_session_index_changed_or_missing','focus_one_open_v0' WHERE NOT EXISTS (
    SELECT 1 FROM pg_index i JOIN pg_attribute a ON a.attrelid=i.indrelid AND a.attname='user_id'
    WHERE i.indexrelid=to_regclass('public.focus_one_open_v0') AND i.indrelid='public.focus_sessions'::regclass
      AND i.indisunique AND i.indisvalid AND i.indisready AND i.indimmediate AND i.indnkeyatts=1 AND i.indkey[0]=a.attnum
      AND i.indexprs IS NULL AND md5(pg_get_expr(i.indpred,i.indrelid))='6a60db581bfabd6d386dcbb652b94566')
  UNION ALL SELECT 'v0_state_constraint_changed_or_missing','focus_v0_session_state' WHERE NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conrelid='public.focus_sessions'::regclass AND conname='focus_v0_session_state'
      AND contype='c' AND convalidated AND md5(pg_get_constraintdef(oid))='33b9c36f4c881fe9bc347bab6df14ec7')
  UNION ALL SELECT 'unvalidated_focus_or_objective_constraint',c.conname FROM pg_constraint c
    WHERE c.conrelid IN (SELECT to_regclass('public.'||name) FROM focus_tables UNION ALL SELECT to_regclass('public.pilotage_objectives')) AND NOT c.convalidated
  UNION ALL SELECT 'unexpected_enabled_trigger_review',t.tgrelid::regclass::text||'.'||t.tgname FROM pg_trigger t
    WHERE NOT t.tgisinternal AND t.tgenabled<>'D'
      AND t.tgrelid IN (SELECT to_regclass('public.'||name) FROM focus_tables UNION ALL SELECT to_regclass('public.pilotage_objectives'))
      AND NOT EXISTS (SELECT 1 FROM expected_triggers e WHERE t.tgrelid=to_regclass('public.'||e.table_name) AND t.tgname=e.name)
  UNION ALL SELECT 'enabled_event_trigger_review',evtname FROM event_trigger_scope WHERE requires_review
  UNION ALL SELECT 'graphql_extension_present_with_legacy_event_binding',evtname FROM event_trigger_scope
    WHERE applies_to_lot2 AND compatibility_condition='pg_graphql_must_be_absent' AND graphql_extension_present
  UNION ALL SELECT 'atypical_session_replication_role','session_replication_role' WHERE current_setting('session_replication_role')<>'origin'
  UNION ALL SELECT 'project_or_objective_inheritance_review',c.oid::regclass::text FROM pg_class c
    WHERE c.oid IN ('public.focus_projects'::regclass,'public.pilotage_objectives'::regclass)
      AND (c.relispartition OR EXISTS (SELECT 1 FROM pg_inherits i WHERE i.inhrelid=c.oid OR i.inhparent=c.oid))
  UNION ALL SELECT 'project_or_objective_rule_review',r.ev_class::regclass::text||'.'||r.rulename FROM pg_rewrite r
    WHERE r.ev_class IN ('public.focus_projects'::regclass,'public.pilotage_objectives'::regclass)
  UNION ALL SELECT 'dependent_view_review',r.ev_class::regclass::text FROM pg_depend d JOIN pg_rewrite r ON d.classid='pg_rewrite'::regclass AND r.oid=d.objid
    WHERE d.refclassid='pg_class'::regclass AND d.refobjid IN ('public.focus_projects'::regclass,'public.pilotage_objectives'::regclass)
      AND r.ev_class<>d.refobjid
  UNION ALL SELECT 'open_sessions_close_explicitly_before_migration','focus_sessions' FROM data_checks WHERE open_sessions>0
  UNION ALL SELECT 'focus_data_inconsistency',key FROM data_checks d,LATERAL jsonb_each(to_jsonb(d)-'open_sessions') x(key,value) WHERE value::text<>'0'
  UNION ALL SELECT 'focus_request_in_progress_wait_and_repeat','pg_stat_activity' FROM activity WHERE count>0
  UNION ALL SELECT 'activity_visibility_insufficient','pg_stat_activity' WHERE NOT (
    EXISTS (SELECT 1 FROM pg_roles WHERE rolname=current_user AND rolsuper)
    OR pg_has_role(current_user,'pg_read_all_stats','USAGE'))
),
legacy_permissions AS (SELECT r.rolname,p.name AS privilege FROM client_roles r
  CROSS JOIN (VALUES ('SELECT'),('INSERT'),('UPDATE'),('DELETE'),('TRUNCATE'),('REFERENCES'),('TRIGGER')) p(name)
  WHERE has_table_privilege(r.oid,'public.focus_projects',p.name)),
result AS (SELECT jsonb_build_object(
  'marker',CASE WHEN EXISTS (SELECT 1 FROM blockers) THEN 'FOCUS_STRATEGY_PREFLIGHT_BLOCKED' ELSE 'FOCUS_STRATEGY_PREFLIGHT_OK' END,
  'checked_at_utc',to_char(statement_timestamp() AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  'transaction_read_only',current_setting('transaction_read_only'),
  'blockers',COALESCE((SELECT jsonb_agg(jsonb_build_object('code',code,'object',object_name) ORDER BY code,object_name)
    FROM (SELECT DISTINCT code,object_name FROM blockers) b),'[]'::jsonb),
  'counts',(SELECT value FROM counts),
  'data_checks',(SELECT to_jsonb(d) FROM data_checks d),
  'active_focus_requests',(SELECT count FROM activity),
  'event_triggers',COALESCE((SELECT jsonb_agg(to_jsonb(e) ORDER BY evtname) FROM event_trigger_scope e),'[]'::jsonb),
  'v0_marker',obj_description(to_regprocedure('public.focus_session_command(uuid,text,jsonb)'),'pg_proc'),
  'rls',COALESCE((SELECT jsonb_agg(jsonb_build_object('table',r.name,'enabled',c.relrowsecurity,'forced',c.relforcerowsecurity) ORDER BY r.name)
    FROM required_rls r LEFT JOIN pg_class c ON c.oid=to_regclass('public.'||r.name)),'[]'::jsonb),
  'policy_names_only',COALESCE((SELECT jsonb_agg(jsonb_build_object('table',c.relname,'policy',p.polname,'command',p.polcmd) ORDER BY c.relname,p.polname)
    FROM pg_policy p JOIN pg_class c ON c.oid=p.polrelid WHERE c.oid IN (SELECT to_regclass('public.'||name) FROM required_rls)),'[]'::jsonb),
  'legacy_project_permissions_warning',COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY rolname,privilege) FROM legacy_permissions p),'[]'::jsonb),
  'legacy_project_permissions_note','Existing project ACLs/policies are preserved. Lot 2 guards new strategic fields. Broad old permissions require separate review, not an automatic reset or rewrite.',
  'next_step','Only with OK and Focus/MCP usage paused: apply 20260908_focus_strategy.sql once. Never run a Focus reset for Lot 2.'
) AS preflight)
SELECT preflight FROM result;
COMMIT;
