-- Focus V0: apply after the separate one-shot test-data reset, before new code.
-- First installation requires an empty execution graph; replay preserves real history.
BEGIN;
SET LOCAL lock_timeout = '5s';
LOCK TABLE public.focus_projects, public.focus_tasks, public.focus_subtasks, public.focus_sessions IN ACCESS EXCLUSIVE MODE;
DO $$ BEGIN
 IF to_regprocedure('public.focus_session_command(uuid,text,jsonb)') IS NOT NULL AND
   obj_description(to_regprocedure('public.focus_session_command(uuid,text,jsonb)'), 'pg_proc') IS DISTINCT FROM 'ecomy-focus-v0-20260908' THEN
   RAISE EXCEPTION 'focus_unexpected_existing_rpc';
 END IF;
 IF to_regprocedure('public.focus_session_command(uuid,text,jsonb)') IS NULL AND (
   to_regclass('public.focus_one_open_v0') IS NOT NULL OR
   to_regprocedure('public.focus_execution_guard()') IS NOT NULL OR
   to_regprocedure('public.focus_preserve_session()') IS NOT NULL OR
   EXISTS(SELECT 1 FROM pg_trigger WHERE NOT tgisinternal AND tgrelid IN
     ('public.focus_tasks'::regclass,'public.focus_subtasks'::regclass,'public.focus_sessions'::regclass))) THEN
   RAISE EXCEPTION 'focus_unexpected_existing_protection';
 END IF;
 IF to_regprocedure('public.focus_session_command(uuid,text,jsonb)') IS NULL AND
    (EXISTS(SELECT 1 FROM public.focus_projects) OR EXISTS(SELECT 1 FROM public.focus_tasks)
     OR EXISTS(SELECT 1 FROM public.focus_subtasks) OR EXISTS(SELECT 1 FROM public.focus_sessions)) THEN
   RAISE EXCEPTION 'focus_v0_requires_empty_tables';
 END IF;
 IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public'
   AND table_name='focus_sessions' AND column_name='engine_version') THEN
   RAISE EXCEPTION 'focus_unexpected_previous_engine: review instead of upgrading implicitly';
 END IF;
END $$;
ALTER TABLE public.focus_sessions ADD COLUMN IF NOT EXISTS paused_at timestamptz;
ALTER TABLE public.focus_sessions ADD COLUMN IF NOT EXISTS duration_override_seconds integer;
ALTER TABLE public.focus_sessions ADD COLUMN IF NOT EXISTS completion_source text;
ALTER TABLE public.focus_subtasks ADD COLUMN IF NOT EXISTS archived_at timestamptz;

-- No legacy exemptions: malformed new rows must fail even outside the RPC.
ALTER TABLE public.focus_sessions ALTER COLUMN task_id SET NOT NULL;
ALTER TABLE public.focus_sessions ALTER COLUMN paused_seconds SET DEFAULT 0;
ALTER TABLE public.focus_sessions ALTER COLUMN paused_seconds SET NOT NULL;
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='public.focus_sessions'::regclass AND conname='focus_v0_session_state') THEN
   ALTER TABLE public.focus_sessions ADD CONSTRAINT focus_v0_session_state CHECK (
     paused_seconds >= 0 AND planned_duration_minutes BETWEEN 1 AND 480
     AND (duration_override_seconds IS NULL OR duration_override_seconds BETWEEN 0 AND 28800)
     AND ((status IN ('running','paused') AND ended_at IS NULL AND completion_source IS NULL AND duration_override_seconds IS NULL)
       OR (status IN ('completed','abandoned') AND ended_at IS NOT NULL AND ended_at >= started_at
           AND completion_source IS NOT NULL AND completion_source IN ('explicit_stop','explicit_duration','estimated_expiry')))
     AND ((status='paused' AND paused_at IS NOT NULL) OR (status<>'paused' AND paused_at IS NULL))
   );
 END IF;
END $$;

-- Every open session participates, with no historical exception.
CREATE UNIQUE INDEX IF NOT EXISTS focus_one_open_v0
 ON public.focus_sessions(user_id) WHERE ended_at IS NULL
 AND status IN ('running', 'paused');

CREATE OR REPLACE FUNCTION public.focus_execution_guard() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE owner_id uuid; parent public.focus_tasks; project_owner uuid;
BEGIN
 IF TG_OP = 'DELETE' THEN
   RAISE EXCEPTION 'focus_history_preserved: archive instead of deleting' USING ERRCODE = 'P0001';
 END IF;
 owner_id := NEW.user_id;
 PERFORM pg_advisory_xact_lock(hashtextextended('focus:' || owner_id::text, 0));
 IF TG_OP = 'UPDATE' AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
   RAISE EXCEPTION 'focus_owner_immutable';
 END IF;
 IF TG_TABLE_NAME = 'focus_tasks' THEN
   IF NEW.project_id IS NOT NULL THEN
     SELECT user_id INTO project_owner FROM public.focus_projects WHERE id = NEW.project_id;
     IF project_owner IS DISTINCT FROM owner_id THEN RAISE EXCEPTION 'focus_project_forbidden'; END IF;
   END IF;
   IF TG_OP = 'UPDATE' THEN
     IF NEW.project_id IS DISTINCT FROM OLD.project_id AND EXISTS
       (SELECT 1 FROM public.focus_sessions WHERE task_id = OLD.id) THEN
       RAISE EXCEPTION 'focus_project_has_history: create another task instead';
     END IF;
     IF (NEW.archived_at IS NOT NULL OR NEW.status <> OLD.status) AND EXISTS
       (SELECT 1 FROM public.focus_sessions WHERE task_id = OLD.id AND ended_at IS NULL
        AND status IN ('running','paused')) THEN
       RAISE EXCEPTION 'focus_task_has_open_session: close it explicitly first';
     END IF;
     IF NEW.status IS DISTINCT FROM OLD.status THEN
       NEW.completed_at := CASE WHEN NEW.status = 'done' THEN clock_timestamp() ELSE NULL END;
     ELSE
       NEW.completed_at := OLD.completed_at;
     END IF;
   ELSE
     NEW.completed_at := CASE WHEN NEW.status = 'done' THEN clock_timestamp() ELSE NULL END;
   END IF;
   IF NEW.status = 'in_progress' AND NEW.archived_at IS NULL AND
      (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status) AND EXISTS
      (SELECT 1 FROM public.focus_tasks WHERE user_id = owner_id AND id <> NEW.id
       AND status = 'in_progress' AND archived_at IS NULL) THEN
     RAISE EXCEPTION 'focus_seat_taken';
   END IF;
 ELSIF TG_TABLE_NAME = 'focus_subtasks' THEN
   SELECT * INTO parent FROM public.focus_tasks WHERE id = NEW.task_id;
   IF parent.user_id IS DISTINCT FROM owner_id THEN RAISE EXCEPTION 'focus_task_forbidden'; END IF;
   IF TG_OP = 'UPDATE' AND NEW.task_id IS DISTINCT FROM OLD.task_id THEN
     RAISE EXCEPTION 'focus_subtask_parent_immutable';
   END IF;
   IF parent.archived_at IS NOT NULL THEN RAISE EXCEPTION 'focus_task_archived'; END IF;
   IF TG_OP = 'INSERT' THEN
     SELECT COALESCE(max(position),-1)+1 INTO NEW.position FROM public.focus_subtasks WHERE task_id=NEW.task_id;
   END IF;
   IF TG_OP = 'INSERT' OR NEW.is_completed IS DISTINCT FROM OLD.is_completed THEN
     NEW.completed_at := CASE WHEN NEW.is_completed THEN clock_timestamp() ELSE NULL END;
     NEW.completed_session_id := NULL;
     IF NEW.is_completed THEN
       SELECT id INTO NEW.completed_session_id FROM public.focus_sessions
        WHERE user_id=owner_id AND task_id=NEW.task_id AND ended_at IS NULL AND status IN ('running','paused')
        ORDER BY started_at DESC LIMIT 1;
     END IF;
   ELSIF TG_OP = 'UPDATE' THEN
     NEW.completed_at := OLD.completed_at;
     NEW.completed_session_id := OLD.completed_session_id;
   END IF;
   IF NEW.archived_at IS NOT NULL AND EXISTS(SELECT 1 FROM public.focus_sessions
     WHERE subtask_id=NEW.id AND ended_at IS NULL AND status IN ('running','paused')) THEN
     RAISE EXCEPTION 'focus_subtask_has_open_session';
   END IF;
   IF NEW.completed_session_id IS NOT NULL AND NOT EXISTS
     (SELECT 1 FROM public.focus_sessions WHERE id = NEW.completed_session_id
      AND user_id = owner_id AND task_id = NEW.task_id) THEN
     RAISE EXCEPTION 'focus_subtask_session_mismatch';
   END IF;
 END IF;
 NEW.updated_at := clock_timestamp();
 RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS focus_tasks_execution_guard ON public.focus_tasks;
CREATE TRIGGER focus_tasks_execution_guard BEFORE INSERT OR UPDATE OR DELETE ON public.focus_tasks
 FOR EACH ROW EXECUTE FUNCTION public.focus_execution_guard();
DROP TRIGGER IF EXISTS focus_subtasks_execution_guard ON public.focus_subtasks;
CREATE TRIGGER focus_subtasks_execution_guard BEFORE INSERT OR UPDATE OR DELETE ON public.focus_subtasks
 FOR EACH ROW EXECUTE FUNCTION public.focus_execution_guard();

-- All session transitions use this function, including browser and MCP calls.
CREATE OR REPLACE FUNCTION public.focus_session_command(p_user uuid, p_action text, p_data jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.focus_sessions; t public.focus_tasks; at_time timestamptz;
 sid uuid; planned integer; pause_total integer; expired_at timestamptz;
BEGIN
 IF p_user IS NULL THEN RAISE EXCEPTION 'focus_unauthorized'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('focus:' || p_user::text, 0));
 at_time := clock_timestamp();
 IF p_action = 'start' THEN
   SELECT * INTO t FROM public.focus_tasks WHERE id = (p_data->>'task_id')::uuid AND user_id = p_user;
   IF NOT FOUND OR t.archived_at IS NOT NULL OR t.status = 'done' THEN
     RAISE EXCEPTION 'focus_task_unavailable';
   END IF;
   IF EXISTS (SELECT 1 FROM public.focus_sessions WHERE user_id = p_user
       AND ended_at IS NULL AND status IN ('running','paused')) THEN
     RAISE EXCEPTION 'focus_session_already_open: close the existing session explicitly';
   END IF;
   planned := COALESCE((p_data->>'planned_duration_minutes')::integer, 45);
   IF planned < 1 OR planned > 480 THEN RAISE EXCEPTION 'focus_invalid_duration'; END IF;
   IF p_data->>'subtask_id' IS NOT NULL AND NOT EXISTS
     (SELECT 1 FROM public.focus_subtasks WHERE id = (p_data->>'subtask_id')::uuid
      AND task_id = t.id AND user_id = p_user AND archived_at IS NULL) THEN
     RAISE EXCEPTION 'focus_subtask_forbidden';
   END IF;
   UPDATE public.focus_tasks SET status = 'in_progress' WHERE id = t.id;
   INSERT INTO public.focus_sessions(user_id, task_id, subtask_id, task_title, category,
     planned_duration_minutes, started_at, status)
   VALUES(p_user,t.id,(p_data->>'subtask_id')::uuid,t.title,t.category,planned,at_time,'running')
   RETURNING * INTO s;
   RETURN to_jsonb(s);
 END IF;
 sid := (p_data->>'id')::uuid;
 IF sid IS NULL THEN
   IF (SELECT count(*) FROM public.focus_sessions WHERE user_id = p_user AND ended_at IS NULL
       AND status IN ('running','paused')) <> 1 THEN RAISE EXCEPTION 'focus_choose_open_session'; END IF;
   SELECT id INTO sid FROM public.focus_sessions WHERE user_id = p_user AND ended_at IS NULL
     AND status IN ('running','paused');
 END IF;
 SELECT * INTO s FROM public.focus_sessions WHERE id = sid AND user_id = p_user FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'focus_session_forbidden'; END IF;
 IF s.ended_at IS NOT NULL THEN
   IF (p_action = 'stop' AND s.status = 'completed') OR
      (p_action = 'abandon' AND s.status = 'abandoned') OR
      (p_action = 'expire' AND s.completion_source = 'estimated_expiry') THEN RETURN to_jsonb(s); END IF;
   RAISE EXCEPTION 'focus_session_closed';
 END IF;
 pause_total := COALESCE(s.paused_seconds,0);
 IF s.paused_at IS NOT NULL THEN
   pause_total := pause_total + greatest(0,floor(extract(epoch FROM at_time-s.paused_at))::integer);
 END IF;
 IF p_action = 'pause' THEN
   IF s.status = 'paused' THEN RETURN to_jsonb(s); END IF;
   UPDATE public.focus_sessions SET status='paused', paused_at=at_time, updated_at=at_time WHERE id=s.id;
 ELSIF p_action = 'resume' THEN
   IF s.status = 'running' THEN RETURN to_jsonb(s); END IF;
   UPDATE public.focus_sessions SET status='running', paused_seconds=pause_total, paused_at=NULL,
     updated_at=at_time WHERE id=s.id;
 ELSIF p_action = 'extend' THEN
   planned := (p_data->>'extra_minutes')::integer;
   IF planned IS NULL OR planned < 1 OR s.planned_duration_minutes + planned > 480 THEN
     RAISE EXCEPTION 'focus_invalid_duration'; END IF;
   UPDATE public.focus_sessions SET planned_duration_minutes=planned_duration_minutes+planned,
     updated_at=at_time WHERE id=s.id;
 ELSIF p_action IN ('stop','abandon','expire') THEN
   expired_at := s.started_at + make_interval(secs => s.planned_duration_minutes*60 + COALESCE(s.paused_seconds,0));
   IF p_action = 'expire' AND (s.status <> 'running' OR expired_at > at_time) THEN
     RAISE EXCEPTION 'focus_not_expirable';
   END IF;
   IF p_data ? 'actual_minutes' AND
      ((p_data->>'actual_minutes') IS NULL OR (p_data->>'actual_minutes')::integer < 0 OR (p_data->>'actual_minutes')::integer > 480) THEN
     RAISE EXCEPTION 'focus_invalid_duration'; END IF;
   UPDATE public.focus_sessions SET
     status=CASE WHEN p_action='abandon' THEN 'abandoned' ELSE 'completed' END,
     ended_at=CASE WHEN p_action='expire' THEN expired_at ELSE at_time END,
     paused_seconds=pause_total, paused_at=NULL,
     duration_override_seconds=CASE WHEN p_data ? 'actual_minutes' THEN (p_data->>'actual_minutes')::integer*60 ELSE NULL END,
     completion_source=CASE WHEN p_action='expire' THEN 'estimated_expiry'
       WHEN p_data ? 'actual_minutes' THEN 'explicit_duration' ELSE 'explicit_stop' END,
     notes=CASE WHEN p_data ? 'notes' THEN p_data->>'notes' ELSE notes END,
     updated_at=at_time WHERE id=s.id;
 ELSE RAISE EXCEPTION 'focus_invalid_action'; END IF;
 SELECT * INTO s FROM public.focus_sessions WHERE id=s.id;
 RETURN to_jsonb(s);
END $$;
REVOKE ALL ON FUNCTION public.focus_session_command(uuid,text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.focus_session_command(uuid,text,jsonb) TO service_role;
COMMENT ON FUNCTION public.focus_session_command(uuid,text,jsonb) IS 'ecomy-focus-v0-20260908';

-- Direct table writes could bypass the session state machine. Reads retain RLS.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.focus_sessions FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.focus_preserve_session() RETURNS trigger
LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'focus_history_preserved'; END IF;
 IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.task_id IS DISTINCT FROM OLD.task_id
    OR NEW.subtask_id IS DISTINCT FROM OLD.subtask_id OR NEW.started_at IS DISTINCT FROM OLD.started_at THEN
   RAISE EXCEPTION 'focus_session_identity_immutable';
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS focus_session_history_guard ON public.focus_sessions;
CREATE TRIGGER focus_session_history_guard BEFORE UPDATE OR DELETE ON public.focus_sessions
 FOR EACH ROW EXECUTE FUNCTION public.focus_preserve_session();
COMMIT;
