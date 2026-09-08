-- MISSION 006 / QUERY 1. Run the WHOLE file in SQL Editor, never a selection.
-- Read-only transaction, one JSON result. No function bodies, SQL activity text or secrets.
BEGIN READ ONLY;
SET LOCAL statement_timeout = '30s';
SET LOCAL lock_timeout = '5s';
WITH
names(name) AS (VALUES ('focus_projects'),('focus_tasks'),('focus_subtasks'),
 ('focus_sessions'),('focus_bad_habits'),('focus_habit_checks')),
scope AS (SELECT c.oid,c.relname,c.relkind,c.relispartition,c.relowner,c.relrowsecurity,c.relforcerowsecurity
 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace JOIN names x ON x.name=c.relname
 WHERE n.nspname='public'),
roles AS (SELECT oid,rolname,rolinherit,rolsuper,rolbypassrls FROM pg_roles
 WHERE rolname IN ('anon','authenticated','service_role',current_user)),
routines AS (SELECT p.*,n.nspname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE p.proname LIKE 'focus\_%' ESCAPE '\'
 OR p.prosrc ~ 'focus_(projects|tasks|subtasks|sessions|bad_habits|habit_checks)'
 OR p.oid IN (SELECT tgfoid FROM pg_trigger WHERE tgrelid IN (SELECT oid FROM scope))
 OR p.oid IN (SELECT evtfoid FROM pg_event_trigger))
SELECT jsonb_build_object(
 'report','FOCUS_CATALOG_REVIEW_REQUIRED',
 'context',jsonb_build_object('database',current_database(),'role',current_user,
   'read_only',current_setting('transaction_read_only'),'version',current_setting('server_version'),
   'expected_tables',6,'observed_tables',(SELECT count(*) FROM scope),
   'activity_visibility',pg_has_role(current_user,'pg_read_all_stats','USAGE') OR
     COALESCE((SELECT rolsuper FROM pg_roles WHERE rolname=current_user),false)),
 'tables',COALESCE((SELECT jsonb_agg(to_jsonb(s)) FROM scope s),'[]'::jsonb),
 'columns',COALESCE((SELECT jsonb_agg(jsonb_build_object('table',s.relname,'column',a.attname,
    'type',format_type(a.atttypid,a.atttypmod),'not_null',a.attnotnull,
    'has_default',a.atthasdef,'identity',a.attidentity,'generated',a.attgenerated))
   FROM pg_attribute a JOIN scope s ON s.oid=a.attrelid WHERE a.attnum>0 AND NOT a.attisdropped),'[]'::jsonb),
 'constraints_and_foreign_keys',COALESCE((SELECT jsonb_agg(jsonb_build_object('name',c.conname,
   'source',c.conrelid::regclass::text,'target',CASE WHEN c.confrelid<>0 THEN c.confrelid::regclass::text END,
   'type',c.contype,'validated',c.convalidated,'definition',pg_get_constraintdef(c.oid),
   'external_incoming',c.confrelid IN (SELECT oid FROM scope) AND c.conrelid NOT IN (SELECT oid FROM scope),
   'external_outgoing',c.conrelid IN (SELECT oid FROM scope) AND c.confrelid<>0 AND c.confrelid NOT IN (SELECT oid FROM scope)))
   FROM pg_constraint c WHERE c.conrelid IN (SELECT oid FROM scope) OR c.confrelid IN (SELECT oid FROM scope)),'[]'::jsonb),
 'indexes',COALESCE((SELECT jsonb_agg(jsonb_build_object('table',i.indrelid::regclass::text,
   'index',i.indexrelid::regclass::text,'unique',i.indisunique,'valid',i.indisvalid,'ready',i.indisready,
   'definition',pg_get_indexdef(i.indexrelid))) FROM pg_index i WHERE i.indrelid IN (SELECT oid FROM scope)),'[]'::jsonb),
 'triggers',COALESCE((SELECT jsonb_agg(jsonb_build_object('table',t.tgrelid::regclass::text,
   'name',t.tgname,'enabled',t.tgenabled,'internal',t.tgisinternal,'function',t.tgfoid::regprocedure::text,
   'event_mask',t.tgtype,'argument_count',t.tgnargs)) FROM pg_trigger t WHERE t.tgrelid IN (SELECT oid FROM scope)),'[]'::jsonb),
 'rules',COALESCE((SELECT jsonb_agg(jsonb_build_object('table',r.ev_class::regclass::text,'rule',r.rulename))
   FROM pg_rewrite r WHERE r.ev_class IN (SELECT oid FROM scope)),'[]'::jsonb),
 'external_trigger_bindings',COALESCE((SELECT jsonb_agg(jsonb_build_object('table',t.tgrelid::regclass::text,
   'name',t.tgname,'enabled',t.tgenabled,'function',t.tgfoid::regprocedure::text)) FROM pg_trigger t
   WHERE NOT t.tgisinternal AND t.tgfoid IN (SELECT oid FROM routines)
   AND t.tgrelid NOT IN (SELECT oid FROM scope)),'[]'::jsonb),
 'views',COALESCE((SELECT jsonb_agg(DISTINCT jsonb_build_object('view',r.ev_class::regclass::text,
   'referenced',d.refobjid::regclass::text)) FROM pg_depend d JOIN pg_rewrite r ON r.oid=d.objid
   WHERE d.classid='pg_rewrite'::regclass AND d.refclassid='pg_class'::regclass
   AND d.refobjid IN (SELECT oid FROM scope)),'[]'::jsonb),
 'catalog_dependencies',COALESCE((SELECT jsonb_agg(jsonb_build_object('dependent',pg_describe_object(d.classid,d.objid,d.objsubid),
   'referenced',pg_describe_object(d.refclassid,d.refobjid,d.refobjsubid),'type',d.deptype)) FROM pg_depend d
   WHERE (d.classid='pg_class'::regclass AND d.objid IN (SELECT oid FROM scope))
      OR (d.refclassid='pg_class'::regclass AND d.refobjid IN (SELECT oid FROM scope))),'[]'::jsonb),
 'inheritance',COALESCE((SELECT jsonb_agg(to_jsonb(i)) FROM pg_inherits i
   WHERE i.inhrelid IN (SELECT oid FROM scope) OR i.inhparent IN (SELECT oid FROM scope)),'[]'::jsonb),
 'publications',COALESCE((SELECT jsonb_agg(to_jsonb(p)) FROM pg_publication_tables p
   WHERE p.schemaname='public' AND p.tablename IN (SELECT name FROM names)),'[]'::jsonb),
 'publication_scopes',COALESCE((SELECT jsonb_agg(jsonb_build_object('name',p.pubname,'all_tables',p.puballtables,
   'public_schema',EXISTS(SELECT 1 FROM pg_publication_namespace n WHERE n.pnpubid=p.oid AND n.pnnspid='public'::regnamespace)))
   FROM pg_publication p),'[]'::jsonb),
 'rls_policies',COALESCE((SELECT jsonb_agg(to_jsonb(p)) FROM pg_policies p
   WHERE p.schemaname='public' AND p.tablename IN (SELECT name FROM names)),'[]'::jsonb),
 'table_acl_including_public',COALESCE((SELECT jsonb_agg(jsonb_build_object('table',s.relname,'grantor',a.grantor,
   'grantee',CASE WHEN a.grantee=0 THEN 'PUBLIC' ELSE a.grantee::regrole::text END,
   'privilege',a.privilege_type,'grantable',a.is_grantable)) FROM scope s JOIN pg_class c ON c.oid=s.oid
   CROSS JOIN LATERAL aclexplode(COALESCE(c.relacl,acldefault('r',c.relowner))) a),'[]'::jsonb),
 'column_acl_including_public',COALESCE((SELECT jsonb_agg(jsonb_build_object('table',s.relname,'column',c.attname,
   'grantee',CASE WHEN a.grantee=0 THEN 'PUBLIC' ELSE a.grantee::regrole::text END,'privilege',a.privilege_type))
   FROM scope s JOIN pg_attribute c ON c.attrelid=s.oid CROSS JOIN LATERAL aclexplode(c.attacl) a),'[]'::jsonb),
 'effective_table_permissions',COALESCE((SELECT jsonb_agg(jsonb_build_object('role',r.rolname,'table',s.relname,
   'privilege',v.privilege,'allowed',has_table_privilege(r.oid,s.oid,v.privilege))) FROM roles r CROSS JOIN scope s
   CROSS JOIN (VALUES ('SELECT'),('INSERT'),('UPDATE'),('DELETE'),('TRUNCATE'),('REFERENCES'),('TRIGGER')) v(privilege)),'[]'::jsonb),
 'effective_column_permissions',COALESCE((SELECT jsonb_agg(jsonb_build_object('role',r.rolname,'table',s.relname,
   'privilege',v.privilege,'any_column',has_any_column_privilege(r.oid,s.oid,v.privilege))) FROM roles r CROSS JOIN scope s
   CROSS JOIN (VALUES ('SELECT'),('INSERT'),('UPDATE'),('REFERENCES')) v(privilege)),'[]'::jsonb),
 'roles',COALESCE((SELECT jsonb_agg(to_jsonb(r)) FROM roles r),'[]'::jsonb),
 'role_memberships',COALESCE((SELECT jsonb_agg(jsonb_build_object('member',m.member::regrole::text,
   'role',m.roleid::regrole::text,'admin_option',m.admin_option)) FROM pg_auth_members m),'[]'::jsonb),
 'routines_names_only',COALESCE((SELECT jsonb_agg(jsonb_build_object('routine',p.oid::regprocedure::text,
   'schema',p.nspname,'owner',p.proowner::regrole::text,'security_definer',p.prosecdef,'acl',p.proacl,
   'search_path',(SELECT setting FROM unnest(p.proconfig) setting WHERE setting LIKE 'search_path=%' LIMIT 1)))
   FROM routines p),'[]'::jsonb),
 'routine_execute_permissions',COALESCE((SELECT jsonb_agg(jsonb_build_object('routine',p.oid::regprocedure::text,
   'role',r.rolname,'execute',has_function_privilege(r.oid,p.oid,'EXECUTE'))) FROM routines p CROSS JOIN roles r),'[]'::jsonb),
 'event_triggers',COALESCE((SELECT jsonb_agg(jsonb_build_object('name',e.evtname,'event',e.evtevent,
   'enabled',e.evtenabled,'function',e.evtfoid::regprocedure::text)) FROM pg_event_trigger e),'[]'::jsonb),
 'other_focus_locks',COALESCE((SELECT jsonb_agg(jsonb_build_object('pid',l.pid,'table',l.relation::regclass::text,
   'mode',l.mode,'granted',l.granted)) FROM pg_locks l WHERE l.relation IN (SELECT oid FROM scope)
   AND l.pid IS DISTINCT FROM pg_backend_pid()),'[]'::jsonb),
 'possible_focus_activity_no_query_text',COALESCE((SELECT jsonb_agg(jsonb_build_object('pid',a.pid,
   'state',a.state,'transaction_started',a.xact_start,'query_started',a.query_start,'wait_type',a.wait_event_type))
   FROM pg_stat_activity a WHERE a.pid<>pg_backend_pid() AND a.state IS DISTINCT FROM 'idle'
   AND (a.query ~* 'focus_(projects|tasks|subtasks|sessions|bad_habits|habit_checks|session_command)'
        OR a.pid IN (SELECT pid FROM pg_locks WHERE relation IN (SELECT oid FROM scope)))),'[]'::jsonb)
) AS focus_catalog_report;
COMMIT;
