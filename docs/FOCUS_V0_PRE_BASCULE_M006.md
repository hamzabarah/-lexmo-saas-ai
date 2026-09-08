# Mission 006 — contrôles de pré-bascule Focus V0

Préparation locale uniquement. Aucun changement de code fonctionnel, aucune
écriture distante, aucun reset, aucune migration ni aucun déploiement effectués.

## Les deux scripts à exécuter manuellement

Dans Supabase, ouvrir le projet `ruhkuamtmgzjkcdyrpel`, puis SQL Editor.
Ouvrir un nouvel onglet pour chaque fichier. Copier **le fichier entier**, sans
sélection partielle, puis Run. Ne pas ouvrir les fichiers RESET ou migration à
cette étape. Aucun secret n'est à saisir ou à transmettre.

1. `supabase/operations/20260908_focus_catalog_READ_ONLY.sql`
   Une transaction READ ONLY contenant les lectures de catalogue ; un seul résultat
   JSON `focus_catalog_report`, étiqueté `FOCUS_CATALOG_REVIEW_REQUIRED`.
   Cette étiquette signifie « rapport produit », pas « feu vert ».
2. `supabase/operations/20260908_focus_snapshot_READ_ONLY.sql`
   Transaction READ ONLY, verrous ACCESS SHARE, vérification de l'état figé des six
   tables. Résultat obligatoire : `FOCUS_RESET_PREFLIGHT_OK`, sans aucune erreur.

Les deux scripts utilisent seulement des lectures, des variables locales et des
contrôles. Aucun DML, DDL, appel métier/RPC ou changement de permission. Le SQL
dynamique de la deuxième requête est exclusivement SELECT sur une liste fermée.
Les SET LOCAL et verrous sont temporaires à la transaction. PostgreSQL peut tenir
ses statistiques et journaux habituels : « lecture seule » concerne le schéma et
les données applicatives, pas l'absence d'activité interne du serveur.

Ne transmettre ni clés, ni jetons, ni chaîne de connexion. Le catalogue n'affiche
pas les corps de fonctions, arguments de triggers ou textes des requêtes actives.
Si une erreur laisse une transaction ouverte/avortée, ROLLBACK puis STOP ; ne pas
retirer les garde-fous pour faire passer le script.

## Lecture du rapport 1

* Contexte : `read_only=on`, six tables ordinaires attendues. Si visibilité des
  activités insuffisante, obtenir une observation administrateur ; ne pas assimiler
  un résultat vide à l'absence d'activité.
* Tables/colonnes : types, NULL, identité/génération, présence de valeurs par défaut,
  propriétaires, RLS et FORCE RLS. Les valeurs par défaut ne sont pas affichées.
* Contraintes/FK : sources, cibles, définition, validation et sens entrant/sortant.
  Les liens internes Focus sont attendus. Les liens sortants vers `auth.users`
  sont attendus et ne permettent pas de supprimer le parent lors du reset.
  Toute autre dépendance externe doit être examinée, jamais ajoutée au reset.
* Index : définitions, unicité, validité et disponibilité. Avant installation V0,
  aucun objet V0 conflictuel ne doit être présent. Examiner les objets existants,
  pas l'historique CLI, et ne pas rejouer les migrations de démonstration.
* Triggers/règles/vues/héritage : les triggers internes des FK sont attendus.
  Tout trigger personnalisé, vue dépendante ou héritage bloque le reset préparé.
  Les événements DDL doivent être examinés pour la future migration. Ne pas les
  désactiver dans cette mission, même s'ils sont gérés par Supabase.
* Fonctions : identités, propriétaires, SECURITY DEFINER, search_path, ACL et droits
  EXECUTE. Détection par dépendances et recherche textuelle des noms de tables.
  Les fonctions contenant du SQL dynamique construit par fragments et les systèmes
  externes peuvent échapper à cette détection. Un contrôle humain reste nécessaire.
* Publications : adhésion explicite, publication de tout le schéma public ou de
  toutes les tables. Le reset préparé refuse ces cas en attendant leur examen.
* Permissions : ACL explicites incluant PUBLIC, droits par colonne, droits effectifs
  des rôles anon/authenticated/service_role et du rôle courant, appartenances de
  rôles, politiques RLS. Un privilège SELECT effectif ne signifie pas que RLS
  autorise toutes les lignes. Aucun changement de rôle ou de droits n'est exécuté.
* Activité : autres verrous sur Focus, requêtes/transactions pouvant concerner Focus,
  sans leur texte. Une transaction idle in transaction est à examiner. Les mesures
  sont instantanées, ne prouvent ni l'absence d'une requête HTTP entre deux appels
  SQL ni l'impossibilité d'une nouvelle écriture.

## Lecture du rapport 2

Le manifeste reste celui de Mission 005 : 4 projets, 17 tâches, 4 sous-tâches,
14 sessions, 4 habitudes, zéro relevé, un propriétaire. UUIDs et empreintes de tous
les champs doivent correspondre ; les timestamps sont normalisés en UTC à la
microseconde. Un même comptage avec d'autres lignes ne passe pas.

La requête refuse le moteur déjà installé, les dépendances entrantes externes,
triggers/règles personnalisés, vues dépendantes, publications et partitions.
Les verrous ACCESS SHARE ne bloquent pas les écritures ordinaires : le gel en
amont est obligatoire. Le vrai reset revérifiera sous verrous plus forts.

## Gel exact des anciens accès

Ancien code inspecté : HEAD `c61153e`. Vérifier séparément l'identité du déploiement
effectivement en ligne au moment de l'intervention.

1. Fermer `/dashboard/focus`, ses vues Kanban/timer/agenda et
   `/dashboard/focus/stats` sur tous les appareils, y compris onglets en arrière-plan.
   Arrêter aussi les serveurs locaux utilisant le Supabase réel.
2. Suspendre les clients MCP, agents, conversations actives, planifications et
   scripts connectés à Focus. Aucun outil de `/api/mcp` pendant la fenêtre :
   `get_overview`, `list_tasks`, `create_task`, `update_task`, `archive_task`,
   `start_session`, `end_session`, `check_habit`, `create_habit`, ainsi que les
   nouveaux outils éventuels `create_project`, `pause_session`, `resume_session`,
   `expire_session`. `get_overview` ancien écrit malgré sa présentation en lecture.
3. Faire établir par l'opérateur un blocage EN AMONT de l'application, toutes
   méthodes HTTP, sur `/api/focus` ET `/api/focus/*`, `/api/mcp` ET ses sous-chemins
   éventuels. Couvrir domaine principal, domaines alternatifs et anciennes URLs
   de déploiement pouvant utiliser la même base. Suspendre aussi tout accès direct
   service-role ou SQL automatisé au périmètre Focus. Pas de rotation improvisée
   de la clé partagée Ecomy : elle sert à d'autres modules.
4. Vérifier dans la configuration/logs du point de blocage que les requêtes sont
   refusées avant exécution de l'ancien code. Ne pas tester un ancien GET Focus
   authentifié tant que ce blocage n'est pas établi. Une simple erreur d'application
   ou un écran de maintenance n'est pas une preuve de blocage serveur.
5. Laisser terminer les invocations déjà engagées. Contrôler les logs d'exécution
   de la plateforme : zéro invocation Focus/MCP en cours, aucune nouvelle invocation
   admise. Utiliser la durée maximale réelle configurée, pas un délai inventé.
   Le code MCP annonce 60 s ; cela ne prouve pas la limite des autres routes.
6. Exécuter les deux scripts READ ONLY. Le catalogue doit être lisible avec la
   visibilité suffisante, sans verrou/transaction Focus externe inexpliqué. Le
   manifeste doit correspondre (dont les 14 sessions déjà terminées).
   Recontrôler logs et catalogue après drainage. Zéro session ouverte ne suffit
   pas, à lui seul, à prouver zéro requête active.
7. Maintenir ce blocage à travers reset, migration et installation du nouveau code.
   S'il est impossible de couvrir un ancien accès ou de prouver le drainage : STOP.

### Endpoints anciens susceptibles d'écrire

Clôture implicite vérifiée dans le code ancien sur les GET :
`/api/focus`, `/api/focus/current`, `/api/focus/tasks`, `/api/focus/subtasks`,
`/api/focus/week`, `/api/focus/stats`.

Écritures explicites : POST/PATCH `/api/focus` ; POST/PATCH/DELETE
`/api/focus/tasks`, `/api/focus/subtasks`, `/api/focus/habits` ;
POST `/api/focus/habits/checks`. Le MCP ancien `start_session`, `end_session` et
`get_overview` appellent aussi le nettoyage automatique. Les autres mutations MCP
écrivent directement dans leurs tables. Geler tout le périmètre évite les oublis.

## Séquence finale proposée — non exécutée

1. Nouveau code/build validé, périmètre Git Focus isolé, récupération de
   l'environnement partagé connue, protocole de concurrence isolée validé.
2. Gel et drainage prouvés selon la section précédente.
3. Deux scripts READ ONLY exécutés en entier ; résultats examinés, aucun STOP.
4. Exécution humaine du fichier RESET ONCE déjà préparé, puis six comptages à zéro.
5. Exécution humaine de la migration V0, puis vérification DB : quatre colonnes,
   contraintes d'état, index unique `focus_one_open_v0`, trois fonctions et trois
   triggers, permissions effectives et préservation du périmètre hors Focus.
6. Installation contrôlée du code correspondant, blocage toujours actif.
   Ne jamais rouvrir l'ancien code sur cette base ; confirmer le build déployé.
7. Autoriser temporairement la recette UNIQUEMENT sur le nouveau déploiement pour
   Karim et le client MCP de validation. Garder les anciens déploiements/clients
   bloqués. Sans cette exception contrôlée, les tests seraient eux-mêmes bloqués.
8. Effectuer la recette ci-dessous. Ensuite seulement rouvrir l'usage normal aux
   nouveaux clients. Aucun accès aux anciens déploiements ne doit être rétabli.

Un échec de migration après un reset réussi ne restaure pas les essais. Garder
Focus indisponible et diagnostiquer ; aucune suppression de colonnes ni restauration
globale improvisée. Ne pas appliquer la migration superseded `20260907`.

## Recette minimale sur le nouveau code

Utiliser le compte existant de Karim, authentification habituelle. Ne jamais utiliser
la clé service-role dans le navigateur. Ne pas transmettre les jetons dans le chat.
Noms temporaires : `RECETTE FOCUS V0 <date-heure>`, tâches `cycle API` et `cycle MCP`.

### Cycle API, contrôlé par un opérateur technique

Requêtes authentifiées JSON via la session web existante. P, T et S désignent les
identifiants renvoyés, pas des identifiants à inventer.

1. POST `/api/focus/projects` `{ "name": "RECETTE FOCUS V0 <date-heure>" }` → P.
2. POST `/api/focus/tasks` `{ "title": "cycle API", "project_id": "P" }` → T.
3. POST `/api/focus` `{ "task_id": "T", "planned_duration_minutes": 5 }` → S,
   statut running, started_at serveur, tâche in_progress.
4. Attendre environ 20 s ; PATCH `/api/focus` `{ "id": "S", "action": "pause" }`.
   paused_at non NULL ; UI en pause. Attendre environ 10 s.
5. PATCH `/api/focus` `{ "id": "S", "action": "resume" }` : running,
   paused_at NULL, paused_seconds proche de la pause réellement écoulée.
6. Après environ 20 s, PATCH `/api/focus` `{ "id": "S", "action": "stop" }`.
   completed, ended_at présent, completion_source explicit_stop, override NULL.
7. GET `/api/focus/current` → session NULL. Relire `/api/focus`, `/tasks`, `/week`,
   `/stats` et MCP get_overview : pas de modification des timestamps/notes/statuts.
8. PATCH `/api/focus/tasks` `{ "id": "T", "status": "done" }` : completed_at
   présent. Rejouer done : date identique. Repasser todo : completed_at NULL.
9. DELETE `/api/focus/tasks?id=T` : archive, pas suppression. T disparaît du Kanban
   actif, S demeure dans l'historique et garde son task_id.

Vérifier les secondes avec ended_at - started_at - paused_seconds : environ 40 s
de travail pour 50 s écoulées, avec la tolérance réseau. Les écrans arrondissent
parfois les minutes ; ne pas déduire une perte de temps de cet arrondi.

### Cycle MCP et croisement avec le web

1. `create_project` avec un autre nom unique vérifie le démarrage MCP d'un projet.
2. `create_task` : title `cycle MCP`, project_name exact, priority `normal`.
3. `start_session` : task_id retourné, planned_minutes 5.
4. Vérifier dans le web le même identifiant/session et le timer.
5. `pause_session` puis `resume_session` avec session_id ; vérifier l'UI après
   relecture/rechargement (pas de promesse de synchronisation temps réel).
6. `end_session` avec session_id, sans actual_minutes ; vérifier stopped/completed
   côté API. Rejouer : timestamps et durée restent identiques.
7. `update_task` status done, vérifier completed_at via API ; `archive_task`,
   vérifier disparition de la liste active et conservation de la session.

En complément, une tâche/sous-tâche de recette vérifie l'association de session :
POST `/api/focus/subtasks` avec task_id/title, démarrage avec task_id/subtask_id,
cocher la sous-tâche pendant cette session, arrêter puis vérifier son
completed_session_id. Archiver après clôture et conserver les liens.

### Expiration et lecture sans effet de bord

Créer une autre tâche de recette, démarrer via MCP pour 1 minute, fermer toutes
les vues timer (elles demandent explicitement l'expiration), attendre l'échéance.
Appeler `get_overview` deux fois puis GET `/api/focus/current` : la session reste
running avec ended_at NULL. Appeler ensuite `expire_session` : clôture estimée,
completion_source estimated_expiry, 60 secondes enregistrées. Ne pas modifier
started_at ou l'horloge pour accélérer ce test réel. Archiver la tâche après arrêt.

### UI et nettoyage

Contrôler Kanban, cartes, timer, pause/reprise, arrêt, sous-tâches, agenda et stats.
Les dates sont restituées en Europe/Paris. Les projets créés pour la recette restent
identifiés comme tels : aucun archivage de projet n'est exposé actuellement.
Archiver les tâches de recette ; conserver sessions et sous-tâches nécessaires à
la preuve. Ne jamais rejouer le reset pour nettoyer la recette V0.

## STOP et décision

STOP si projet Supabase incertain, visibilité SQL insuffisante, résultat incomplet,
erreur/mismatch, objet conflictuel, effet externe inexpliqué, activité non drainée,
ancien accès non bloqué, récupération non connue, échec de contrainte/permission,
échec de recette ou mauvais build. Ne pas désactiver les protections pour continuer.

Les résultats SQL propres sont nécessaires mais insuffisants. Le test réel à deux
connexions n'a toujours pas été exécuté (PGlite est mono-connexion). Son protocole
est dans FOCUS_V0_ROLLOUT.md. Le gel effectif, la récupération et cette vérification
restent des portes de validation avant un feu vert complet. La recette authentifiée
reste à faire après installation, sous accès limité au nouveau code.

Mission 006 ne commence ni l'intervention ni le Lot 2.
