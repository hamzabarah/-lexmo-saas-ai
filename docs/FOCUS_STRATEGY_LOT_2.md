# Mission 007 — structure stratégique minimale

Livraison locale, au-dessus de Focus V0 `db28351`. Aucune migration distante,
aucun déploiement, aucun commit ni Lot 3 effectués par cette mission.
Le timer, les tâches, les sous-tâches, l'agenda, l'authentification et Pilotage
ne sont pas reconstruits. Aucun nouvel écran stratégique n'est livré : les
opérations sont accessibles par les API administrateur et le MCP existant.

## État vérifié avant changement

Lecture REST du 8 septembre 2026, vers 08:01 UTC, projet Supabase
`ruhkuamtmgzjkcdyrpel` : 3 projets, 5 tâches, 2 sous-tâches, 4 sessions closes,
0 habitudes, 0 relevés. Les quatre tables Pilotage existent et sont vides.
Les projets exposent seulement les neuf colonnes V0. `os_phases` et
`project_records` ne sont pas exposées dans le catalogue REST.
REST ne prouve pas l'absence d'objets non exposés, ni les ACL/triggers réels.
La migration vérifie donc ses dépendances et refuse les objets inattendus.

## Modèle et règles

`os_phases` évite toute confusion avec `/dashboard/phases`, qui appartient
à la formation et à la progression élèves. Une phase porte `user_id`, `name`,
`position`, `starts_on`, `ends_on`, `mission`, `status`, `created_at`, `updated_at`.
Les dates peuvent être préparées progressivement ; si les deux sont présentes,
la fin ne peut précéder le début. Les positions peuvent être identiques ; l'UUID
départage alors l'ordre. Aucun calendrier ou objectif 1M n'est prérempli.
Statuts : `planned`, `active`, `paused`, `completed`, `cancelled`.

Les projets existants conservent leurs champs et leurs valeurs. Ajouts :

| Champ | Règle |
| --- | --- |
| `phase_id` | Phase appartenant au même opérateur, facultative |
| `objective_id` | Lien facultatif vers `pilotage_objectives.id`, sans duplication |
| `engine` | `acquisition`, `conversion`, `expansion`, `systeme`, `risque` |
| `purpose`, `hypothesis`, `expected_outcome`, `success_criteria` | Textes facultatifs, 10 000 caractères maximum chacun |
| `priority` | `urgent` ou `normal` ; défaut `normal` |
| `delivery_deadline`, `evaluation_deadline` | Dates facultatives ; évaluation au plus tôt à la livraison |
| `planned_time_minutes` | Entier positif ou nul ; temps humain prévisionnel |
| `planned_cost_eur` | Montant prévisionnel positif ou nul, centimes EUR |

Les nouveaux champs facultatifs restent NULL sur les projets existants ; aucune
phase, aucun moteur ou résultat historique n'est inféré. La priorité `normal`
est un défaut explicite, pas une estimation de priorité historique.

Le lifecycle réutilise `status`, sans second champ concurrent : `queued`
(prévu), `vital` (actif), `paused`, puis `evaluating`, `completed`, `cancelled`.
Les anciens statuts restent valides. « Projets actifs » signifie `vital` ou
`evaluating`. La liste ordinaire conserve les projets terminés et abandonnés,
nécessaires à l'affichage de l'historique. Le statut projet est descriptif :
le passage à `completed` ne termine ni ne bloque automatiquement les tâches
ou sessions. Les règles du moteur Focus V0 restent inchangées.

Les dates métier sont des jours calendaires Europe/Paris (`YYYY-MM-DD`), pas
des instants UTC de minuit. Les horodatages sont des `timestamptz` serveur,
restitués selon Europe/Paris. Les calculs du contexte utilisent la même
précision milliseconde et les mêmes règles pause/durée explicite que Focus V0.
Les sessions ouvertes, même expirées, ne produisent aucun temps clôturé et
ne sont jamais fermées par une lecture. Le temps Focus reste du temps humain,
même lorsque le MCP a démarré la session ; il ne mesure pas le temps IA autonome.

## Records et contexte

`project_records` contient `id`, `user_id`, `project_id`, `type`, `title`,
`content`, `payload`, `created_at`. Les cinq types partagent le même service.
`payload` est un objet JSON structuré et contrôlé, de 16 KiB maximum :

| Type | Champs du payload |
| --- | --- |
| `decision` | `rationale`, `alternatives` (liste de textes) facultatifs |
| `output` | `url` HTTP(S), `format` facultatifs ; aucun contenu téléchargé |
| `result` | `metric` et `value` ensemble, `unit`, `source` facultatifs ; texte qualitatif possible dans `content` |
| `lesson` | `next_action` facultatif |
| `cost` | `amount_eur` obligatoire, positif ou nul et au centime ; `category` facultatif |

Un coût enregistré est réel/déclaré ; il ne déclenche aucun paiement et n'est
pas déduit du budget prévisionnel. Les totaux EUR sont calculés en décimal SQL.
Les cinq types sont horodatés par le serveur. Les records sont conservés en
ajout seulement : pas d'UPDATE, DELETE ni TRUNCATE. La suppression d'un projet
référencé par un record est refusée. Une modification du projet ne modifie
aucun record ni aucune session déjà enregistrée.

Limites intentionnelles : pas de clé d'idempotence ; répéter `record_cost`
ajoute un nouveau coût. Les outils d'écriture ne sont pas annoncés idempotents.
Après un timeout, consulter les records avant de rejouer une écriture.
Il n'existe pas encore d'annulation/rectification financière : vérifier les
montants avant l'enregistrement. Un record explicatif n'annule pas un coût.
Ce registre minimal n'est pas un logiciel de comptabilité.

`focus_project_context(p_user uuid, p_project uuid)` est une fonction SQL
`STABLE`, réservée à `service_role`, sans écriture. Elle fournit :

- `project`, `phase`, `objective` (l'objectif Pilotage lié seulement) ;
- `records` : les 50 derniers ; `tasks` : les 100 dernières, archivées incluses ;
- `recent_sessions` : les 10 dernières, ouvertes ou closes ;
- `counts` et `truncated` : volumétrie complète et limites atteintes ;
- `totals.recorded_seconds` et `totals.cost_eur` : sur **tout** l'historique du
  projet, indépendamment des limites des listes.

Les records se parcourent aussi via `list_project_records` ou leur route GET
avec `limit` (1 à 100, défaut 50) et `offset` (défaut 0), dans l'ordre antéchronologique.
Le contexte ne crée pas de mentor, d'agent ni de connecteur.

## Points d'entrée pour reprise par un autre agent

Validation commune : `lib/focus/strategy-schemas.ts`.
Services communs : `lib/focus/strategy.ts` ; client et erreur existants extraits
sans changement de comportement dans `lib/focus/db.ts`.
`commands.ts` réexporte `createProjectFor` afin de garder les anciens appels.
`create_project` avec seulement `{ "name": "Projet" }` reste valide.

Toutes les routes stratégiques utilisent le contrôle existant `requireAdmin` :

| Route | Opérations |
| --- | --- |
| `/api/focus/projects` | GET avec filtres facultatifs, POST, PATCH avec `id` |
| `/api/focus/projects/[id]` | GET |
| `/api/focus/projects/[id]/context` | GET |
| `/api/focus/projects/[id]/records` | GET paginé, POST |
| `/api/focus/phases` | GET, POST, PATCH avec `id` |

Les enveloppes historiques `{projects}` et `{project}` sont conservées pour
l'interface administrateur. `/api/focus/projects` refuse désormais les sessions
non administrateur (403) : Pilotage est global et ne doit pas être exposé aux
comptes élèves. Les nouveaux tables/RPC sont privés ; aucun grant anon/authenticated.
Le contrôle de propriété des rattachements est également appliqué en PostgreSQL.
Les anciennes permissions de projets ne donnent pas le droit d'écrire les
nouveaux champs stratégiques via REST direct : un garde SQL le refuse pour
les rôles `anon`/`authenticated`, tout en conservant les opérations V0.

`lib/focus/strategy-mcp.ts` ajoute 14 outils via le handler MCP existant :
`create_project` enrichi, `get_project`, `update_project`, `list_active_projects`,
`create_phase`, `update_phase`, `list_phases`, `record_decision`, `record_output`,
`record_result`, `record_lesson`, `record_cost`, `list_project_records`,
`get_project_context`. Les identifiants MCP sont `project_id` et `phase_id`.
Les lectures ont `readOnlyHint: true` ; aucun appel ne répare ni ne clôture une session.

Exemple de projet (POST API ou `create_project`) :

```json
{
  "name": "Tester un canal d'acquisition",
  "engine": "acquisition",
  "purpose": "Obtenir des demandes qualifiées",
  "hypothesis": "Une démonstration attire des prospects concernés",
  "expected_outcome": "10 demandes",
  "success_criteria": "10 demandes qualifiées mesurées",
  "status": "vital",
  "priority": "urgent",
  "delivery_deadline": "2026-09-20",
  "evaluation_deadline": "2026-09-30",
  "planned_time_minutes": 120,
  "planned_cost_eur": 25
}
```

## Migration et intervention ultérieure

Fichier unique : `supabase/migrations/20260908_focus_strategy.sql`.
Ne jamais rejouer le reset Focus, la migration V0 sur un historique non vide,
ni les migrations anciennes contenant des données de démonstration.

La nouvelle migration vérifie le marqueur V0, la dépendance Pilotage et la
contrainte de statut attendue ; elle refuse les objets déjà présents/inattendus.
Elle s'exécute dans une transaction avec attente maximale de verrou de 5 secondes.
Une seconde application échoue avant modification, ce qui doit conduire à
vérifier l'état installé plutôt qu'à retirer les garde-fous.

Seule contrainte remplacée : celle de `focus_projects.status`, par un ensemble
plus large qui accepte toutes les valeurs antérieures. Aucune suppression de
ligne ou réécriture d'historique. Les FK `RESTRICT` peuvent empêcher une future
suppression d'une phase, d'un objectif Pilotage ou d'un compte référencé ; elles
ne modifient pas ces données et évitent une perte silencieuse du contexte.

Pour une future mise en service contrôlée : vérifier à nouveau le catalogue
SQL et le déploiement V0, disposer d'une récupération récente, appliquer cette
seule migration, vérifier schéma/permissions/historique, puis déployer les seuls
fichiers Lot 2. Faire une recette API/MCP autorisée avant usage. Aucun de ces
actes distants n'est lancé par Mission 007. Les statuts validés ici concernent
la préparation locale, pas une recette Lot 2 en production.

## Vérifications locales

`npm run test:focus` comprend les tests V0 conservés et les suites Lot 2 :

- `tests/focus-strategy-db.test.ts` : migration sur historique V0 présent,
  dépendances, rejouabilité sûre, permissions, propriété, records, budgets,
  agrégats complets, précision temporelle et lectures sans écriture ;
- `tests/focus-strategy-service.test.ts` et `tests/helpers/strategy-fixture.ts` :
  véritables services et query builders Supabase reliés uniquement à PostgreSQL
  PGlite en mémoire, avec un transport REST de test sans réseau ;
- `tests/focus-strategy-mcp.test.ts` : outils, validations partagées, droits HTTP,
  et transport MCP réel avec services isolés, sans appel distant.

Puis `npx tsc --noEmit --incremental false`, build et `git diff --check`.
Les modifications SEO et autres fichiers locaux antérieurs sont exclus de la
copie de validation du build et de la liste de livraison Lot 2.

Résultats du 8 septembre 2026 : **19 tests sur 19 réussis**, TypeScript valide,
build Next.js 16.1.3/Turbopack réussi (376 pages), contrôle des différences
valide, y compris les nouveaux fichiers. Le build isolé utilise les versions
du lockfile, installées sans scripts d'installation. Son avertissement sur la
convention `middleware` existante reste hors périmètre. La copie de validation
et les fichiers livrés ont été comparés par empreinte. HEAD reste `db28351` ;
aucun commit ni déploiement Lot 2 n'est créé.
