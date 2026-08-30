-- Archivage des tâches du module focus.
--
-- Le serveur MCP expose un outil `archive_task`, mais focus_tasks ne portait
-- aucune notion d'archive : seuls les statuts todo / in_progress / done
-- existaient, et aucun d'eux ne veut dire « retirée de la liste ».
--
-- Même choix que pour les habitudes : on pose une date d'archivage au lieu de
-- supprimer la ligne, qui emporterait l'historique des sessions rattachées.
-- L'interface web et le serveur MCP filtrent tous deux sur cette colonne, pour
-- que les deux voient exactement la même liste.

ALTER TABLE public.focus_tasks
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_focus_tasks_archived
  ON public.focus_tasks(user_id, archived_at);
