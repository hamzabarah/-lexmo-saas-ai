-- Lier une sous-tâche cochée à la session de travail pendant laquelle elle
-- a été cochée.
--
-- L'écran « البيانات » (agenda hebdomadaire) affiche, sous chaque bloc de
-- session dépliée, les sous-tâches validées PENDANT cette session. Or
-- focus_subtasks ne portait que is_completed / completed_at : on savait
-- QUAND une sous-tâche avait été cochée, jamais AU COURS DE QUELLE session.
--
-- ON DELETE SET NULL : supprimer une session ne doit pas décocher la
-- sous-tâche, elle perd seulement son rattachement.

ALTER TABLE public.focus_subtasks
  ADD COLUMN IF NOT EXISTS completed_session_id UUID
  REFERENCES public.focus_sessions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_focus_subtasks_completed_session
  ON public.focus_subtasks(completed_session_id);

COMMENT ON COLUMN public.focus_subtasks.completed_session_id IS
  'Session de travail ouverte au moment ou la sous-tache a ete cochee. NULL si cochee hors session, ou si la session a ete supprimee.';
