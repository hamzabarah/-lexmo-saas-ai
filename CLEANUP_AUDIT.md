# 🧹 AUDIT DU CODE MORT & VESTIGES LEXMO

> **Date** : 2026-04-26
> **Audit non destructif** — aucune suppression effectuée. Ce document est un inventaire à valider avant action.
> Méthodologie : grep récursif sur le repo (hors `node_modules/`, `.next/`, `.git/`) pour chaque candidat suspect, en excluant les auto-références (le fichier qui se définit lui-même).

## Légende
- 🟢 **DEAD CODE confirmé** — aucun import/référence depuis le code actif. Sûr à supprimer.
- 🟡 **VESTIGE PARTIEL** — référencé seulement par d'autres fichiers vestiges (chaîne morte). Sûr à supprimer en bloc.
- 🟠 **À TRANCHER** — référencé par du code potentiellement actif, demande validation humaine.
- 🔴 **ACTIF** — utilisé par le code actuel, ne pas toucher.

---

## A) Composants frontend

| Composant | État | Importé par | Verdict |
|---|---|---|---|
| [app/components/Hero.tsx](app/components/Hero.tsx) | 🟢 | Aucun (0 import) | DEAD — homepage actuelle ne l'utilise pas |
| [app/components/Navbar.tsx](app/components/Navbar.tsx) | 🟢 | Aucun (0 import) | DEAD |
| [app/components/Footer.tsx](app/components/Footer.tsx) | 🟢 | Aucun (0 import) | DEAD — `app/page.tsx` a son propre footer inline |
| [app/components/FAQ.tsx](app/components/FAQ.tsx) | 🟢 | Aucun (0 import) | DEAD — landings ont leur FAQ inline |
| [app/components/Pricing.tsx](app/components/Pricing.tsx) | 🟢 | Aucun (0 import) | DEAD — contient encore les anciens plans `spark/emperor/legend` + Stripe link unique pour les 3 |
| [app/components/AvisClients.tsx](app/components/AvisClients.tsx) | 🟢 | Aucun (0 import) | DEAD |
| [app/components/Bonus.tsx](app/components/Bonus.tsx) | 🟢 | Aucun (0 import) | DEAD |
| [app/components/Phases.tsx](app/components/Phases.tsx) | 🟢 | Aucun (0 import) | DEAD — utilise `ProgressCircle` et `StatCard` (chaîne morte) |
| [app/components/WhoIsThisFor.tsx](app/components/WhoIsThisFor.tsx) | 🟢 | Aucun (0 import) | DEAD |
| [app/components/FloatingCTA.tsx](app/components/FloatingCTA.tsx) | 🟢 | Aucun (0 import) | DEAD |
| [app/components/LoginSection.tsx](app/components/LoginSection.tsx) | 🟢 | Aucun (0 import) | DEAD |
| [app/components/FadeIn.tsx](app/components/FadeIn.tsx) | 🟡 | `Pricing.tsx`, `WhoIsThisFor.tsx`, `AvisClients.tsx` (tous DEAD) | DEAD via chaîne morte — supprimable si on supprime ses appelants |
| [app/components/dashboard/PhaseCard.tsx](app/components/dashboard/PhaseCard.tsx) | 🟡 | Uniquement `app/components/Phases.tsx` (DEAD) | DEAD via chaîne morte |
| [app/components/dashboard/ModuleChecklist.tsx](app/components/dashboard/ModuleChecklist.tsx) | 🟡 | Aucun import direct trouvé. Importe `toggleTask` (DEAD) | DEAD — vérifier qu'aucun MD ne le référence |
| [app/components/dashboard/StatCard.tsx](app/components/dashboard/StatCard.tsx) | 🟡 | Uniquement `Phases.tsx` (DEAD) | DEAD via chaîne morte |
| [app/components/dashboard/ProgressCircle.tsx](app/components/dashboard/ProgressCircle.tsx) | 🟡 | Uniquement `Phases.tsx` (DEAD) | DEAD via chaîne morte |
| [app/components/dashboard/DashboardHeader.tsx](app/components/dashboard/DashboardHeader.tsx) | 🟡 | Uniquement `app/(dashboard)/dashboard/phases/[id]/units/[unitId]/page.tsx` (DEAD route — voir B) | DEAD via chaîne morte |
| [app/components/course/LessonView.tsx](app/components/course/LessonView.tsx) | 🟡 | Uniquement `app/(dashboard)/dashboard/phases/[id]/units/[unitId]/lessons/[lessonId]/page.tsx` (DEAD route) | DEAD via chaîne morte |
| [app/components/lesson/](app/components/lesson/) (8 fichiers + index.ts) | 🟡 | `LessonView.tsx` (DEAD) + `lesson-demo/page.tsx` (DEAD) + `EXAMPLE_USAGE.tsx` (DEAD lui-même) | DEAD via chaîne morte |
| [app/components/lesson/EXAMPLE_USAGE.tsx](app/components/lesson/EXAMPLE_USAGE.tsx) | 🟢 | Aucun (fichier d'exemple) | DEAD |
| [app/components/lesson/README.md](app/components/lesson/README.md) | 🟢 | Aucun (doc statique) | DEAD avec le dossier |
| **Composants ACTIFS (à NE PAS toucher)** | | | |
| [app/components/dashboard/Sidebar.tsx](app/components/dashboard/Sidebar.tsx) | 🔴 | `app/(dashboard)/layout.tsx` | ACTIF |
| [app/components/dashboard/Card.tsx](app/components/dashboard/Card.tsx) | 🔴 | login, register, forgot-password, phases/error.tsx, units/[unitId]/page.tsx | ACTIF (4 imports actifs) |
| [app/components/dashboard/StepCard.tsx](app/components/dashboard/StepCard.tsx) | 🔴 | `phases/page.tsx` | ACTIF |

### Bilan A
**11 composants 🟢 dead direct + 8 dead par chaîne (incluant tout le dossier `lesson/`)**.
Suppression sûre = `Hero, Navbar, Footer, FAQ, Pricing, AvisClients, Bonus, Phases, WhoIsThisFor, FloatingCTA, LoginSection, FadeIn` + dashboard `{PhaseCard, ModuleChecklist, StatCard, ProgressCircle, DashboardHeader}` + `course/LessonView.tsx` + dossier `lesson/`.

---

## B) Routes legacy & dossiers vides

| Élément | État | Référencé par | Verdict |
|---|---|---|---|
| `app/api/auth/` | 🟢 | Dossier vide (0 fichier) | DEAD — supprimer le dossier |
| `app/api/stripe/` | 🟢 | Dossier vide (0 fichier) | DEAD — supprimer le dossier |
| [app/(dashboard)/dashboard/lesson-demo/page.tsx](app/(dashboard)/dashboard/lesson-demo/page.tsx) | 🟢 | Aucun lien (la seule mention `/dashboard/lesson-demo` est sa propre `url:` interne) | DEAD — page démo orpheline |
| [app/(dashboard)/dashboard/phases/[id]/units/[unitId]/page.tsx](app/(dashboard)/dashboard/phases/[id]/units/[unitId]/page.tsx) | 🟡 | Référencé seulement par `LessonView.tsx` (DEAD) | DEAD route — la nav active va à `/dashboard/phases/[id]` directement |
| [app/(dashboard)/dashboard/phases/[id]/units/[unitId]/lessons/[lessonId]/page.tsx](app/(dashboard)/dashboard/phases/[id]/units/[unitId]/lessons/[lessonId]/page.tsx) | 🟡 | Aucune nav active (mention dans `EXAMPLE_USAGE.tsx` DEAD) | DEAD route |

### Bilan B
- 2 dossiers API vides → supprimer
- 1 page de démo orpheline → supprimer
- 2 pages routes legacy `units/[unitId]/...` → supprimer (nettoie aussi tout le sous-arbre)

---

## C) Server Actions & lib legacy

| Élément | État | Référencé par | Verdict |
|---|---|---|---|
| [app/actions/course.ts](app/actions/course.ts) — `getPhases()` | 🟢 | Aucun consommateur | DEAD |
| `getPhaseDetails()` | 🟢 | Aucun (collision de nom avec `lib/course-content.ts:1099` mais l'autre n'est pas importé non plus) | DEAD |
| `getUnitDetails()` | 🟡 | `units/[unitId]/page.tsx` (DEAD) + `units/[unitId]/lessons/[lessonId]/page.tsx` (DEAD) | DEAD via chaîne |
| `getLessonDetails()` | 🟡 | `units/[unitId]/lessons/[lessonId]/page.tsx` (DEAD) | DEAD via chaîne |
| `toggleTask()` | 🟡 | `LessonView.tsx` + `ModuleChecklist.tsx` (tous deux DEAD) | DEAD via chaîne |
| **Verdict global** | | | Le **fichier entier `app/actions/course.ts` est DEAD** une fois les routes/composants legacy supprimés |
| [lib/course-content.ts](lib/course-content.ts) (constante `PHASES`) | 🟢 | Aucun import. La seule mention externe est dans `generate_sql.js` (script racine legacy) | DEAD |
| [lib/supabaseAdmin.ts](lib/supabaseAdmin.ts) | 🟠 | **Aucun import** dans le code actif (export default jamais consommé). Mais c'est le seul singleton propre. | À TRANCHER : soit supprimer (currently dead), soit refactorer pour l'utiliser et dédupliquer les 27 `createClient(SUPABASE_URL, SERVICE_ROLE_KEY)` à la volée |
| [lib/check-subscription.ts](lib/check-subscription.ts) | 🔴 | Importé par `phases/page.tsx`, `phases/[id]/page.tsx`, `coaching/page.tsx`, `Sidebar.tsx`, etc. | ACTIF |
| [lib/resend.ts](lib/resend.ts) | 🔴 | Importé par `webhook/stripe/route.ts`, `bookings/route.ts` | ACTIF |

### Bilan C
- `app/actions/course.ts` (entier, ~250 lignes) → DEAD à supprimer après cleanup B
- `lib/course-content.ts` (~1100 lignes selon `getPhaseDetails:1099`) → DEAD
- `lib/supabaseAdmin.ts` → décision produit : supprimer OU refactorer pour utilisation

---

## D) Scripts dev (`scripts/`)

| Script | État | Tables ciblées | Verdict |
|---|---|---|---|
| [scripts/inject-lessons.ts](scripts/inject-lessons.ts) | 🟢 | `phases`, `modules`, `lessons`, `tasks` (toutes legacy DB) | DEAD — flow d'injection abandonné, contenu désormais en TS hardcodé |
| [scripts/extract-tasks.ts](scripts/extract-tasks.ts) | 🟢 | idem | DEAD |
| [scripts/create-lesson-progress.ts](scripts/create-lesson-progress.ts) | 🟢 | (à vérifier mais même époque) | DEAD probable |
| [scripts/update-lesson1.ts](scripts/update-lesson1.ts) | 🟢 | `phases`, `modules`, `lessons` | DEAD — patch one-shot historique |
| [scripts/README.md](scripts/README.md) | 🟢 | Doc des 4 scripts | DEAD avec eux |
| [package.json:10-12](package.json#L10-L12) — npm scripts `inject-lessons*` | 🟢 | Pointent vers les scripts DEAD | DEAD — supprimer aussi les 3 entrées `"scripts"` |
| [package-scripts.json](package-scripts.json) | 🟢 | Doublon du même mécanisme | DEAD probable (vérifier qu'aucun outil ne le lit) |

### Bilan D
**Tout le dossier `scripts/`** + entrées `inject-lessons*` dans `package.json` + `package-scripts.json` racine → DEAD.

---

## E) Contenu legacy (markdown)

| Élément | État | Verdict |
|---|---|---|
| `content/lessons/phase-1/module-01/` (12 fichiers `lesson-XX.md`) | 🟢 | DEAD — référencé seulement par `inject-lessons.ts` (DEAD) et docs `INJECTION_GUIDE.md` (DEAD) |
| `content/lessons/phase-1/module-02/` (14 fichiers) | 🟢 | DEAD — contient des chaînes "LEXMO/lexmo.ai" (cf. K) |
| `content/lessons/phase-1/module-03/` (13 fichiers `*-LEXMO.md`) | 🟢 | DEAD — nom de fichier suffixé "LEXMO" parle de lui-même |
| Tout le dossier `content/` | 🟢 | DEAD — supprimer en bloc |

### Bilan E
**~39 fichiers Markdown legacy** dans `content/lessons/phase-1/` → suppression sûre. Aucune route ne les sert, aucun script actif ne les lit.

---

## F) Tables DB legacy (à vérifier dans Supabase avant DROP)

> Pour chaque table, vérifié dans le code TS si elle est lue/écrite.

| Table | Lue/écrite par code actif ? | Verdict |
|---|---|---|
| `public.users` | 🔴 ACTIF — lu par `admin/page.tsx:552` (`from('users').select('id,email,name,phone,country,created_at')`) et `api/admin/create-student/route.ts:114` (commenté en partie). Webhook Stripe utilise `auth.admin.listUsers()` plutôt que `public.users` | À CONSERVER — l'admin panel l'affiche |
| `public.progress` | 🟢 Aucune référence dans `app/`, `lib/`, `utils/` | DEAD table — DROP envisageable |
| `public.user_progress` | 🟡 Référencé seulement par `app/actions/course.ts` (DEAD fichier) | DEAD via chaîne — DROP envisageable une fois `actions/course.ts` supprimé |
| `public.user_phase_progress` | 🟢 Aucune référence | DEAD table |
| `public.affiliates` | 🟢 Aucune référence dans le code | DEAD table — pas d'UI affilié |
| `public.commissions` | 🟢 Aucune référence | DEAD table |
| `public.phases` | 🟡 Référencé par `actions/course.ts` (DEAD) + `scripts/*` (DEAD) | DEAD via chaîne |
| `public.modules` | 🟡 Idem | DEAD via chaîne |
| `public.tasks` | 🟡 Idem | DEAD via chaîne |
| `public.lessons` | 🟡 Idem | DEAD via chaîne |
| `public.availability_slots` | 🟠 ACTIF dans le code (`api/admin/availability/route.ts` GET/POST/DELETE) MAIS aucune UI admin ne l'appelle (l'admin utilise `coaching_blocked_slots` à la place). Le code de `bookings/route.ts` génère les créneaux 9h-19h **par défaut sans lire cette table** | À TRANCHER : la route est exposée mais inutile en pratique. Soit DROP table + DELETE route, soit migrer vraiment vers ce système |
| **Tables ACTIVES** | | |
| `public.user_subscriptions` | 🔴 ACTIF | À CONSERVER |
| `public.live_dashboard_state` | 🔴 ACTIF | À CONSERVER |
| `public.coaching_profiles` | 🔴 ACTIF | À CONSERVER |
| `public.coaching_diagnostics` | 🔴 ACTIF | À CONSERVER |
| `public.coaching_blocked_slots` | 🔴 ACTIF | À CONSERVER |
| `public.bookings` | 🔴 ACTIF | À CONSERVER |

### Bilan F
- **6 tables 100% DEAD** : `progress`, `user_phase_progress`, `affiliates`, `commissions`, `phases`, `modules`, `tasks`, `lessons` (en réalité 8)
- **2 tables DEAD via chaîne** : `user_progress` (à supprimer après `actions/course.ts`)
- **1 décision** : `availability_slots` (route exposée mais non câblée à l'UI)
- **6 tables actives** à conserver

---

## G) Colonnes legacy dans tables actives

| Colonne | Tables | Lecture/écriture par code actif ? | Verdict |
|---|---|---|---|
| `users.ref_code` | `public.users` | 🟢 Aucune référence dans `app/`. Seulement dans `supabase/triggers.sql` (auto-génère) | DEAD colonne — vestige affiliation |
| `users.promo_code` | `public.users` | 🟢 Aucune référence dans `app/` | DEAD colonne — vestige promo individuel |
| `users.level` (`Mubtadi/Mutakaddim/Nokhba`) | `public.users` | 🟢 Aucune référence dans `app/`. Mention uniquement dans `supabase/schema.sql` et docs MD | DEAD colonne — vestige gamification |
| `bookings.module_id` | `public.bookings` | 🟢 Aucune référence dans `app/` (seulement dans `actions/course.ts` DEAD pour autre chose : `from('user_progress').eq('module_id', …)`) | DEAD colonne — vestige bookings module-based |
| `bookings.telegram_link` | `public.bookings` | 🟢 Pas vu en lecture/écriture dans le code | DEAD colonne probable — vérifier si l'admin l'utilise dans des notes |
| `bookings.admin_notes` | `public.bookings` | 🟢 Pas vu en lecture/écriture | DEAD colonne probable |
| **Trigger `handle_new_user()`** | | 🔴 Utilisé à chaque signup (auto-fill ref_code + promo_code) | À RÉÉCRIRE : retirer la génération `LEX-XXXXX` et `PROMO-XXXXX`, garder uniquement l'insertion basique. Sinon erreur si on DROP les colonnes |

### Bilan G
- 4 colonnes 🟢 DEAD à dropper : `ref_code`, `promo_code`, `level`, `module_id`
- 2 colonnes 🟢 DEAD probables : `telegram_link`, `admin_notes` (à valider avec l'admin)
- 1 trigger à mettre à jour avant tout DROP

---

## H) Contraintes DB legacy

### `user_subscriptions.plan` CHECK constraint
**État actuel** (cf. [supabase/migrations/20260419_ecommerce_plans.sql](supabase/migrations/20260419_ecommerce_plans.sql)) :
```sql
CHECK (plan IN ('spark', 'emperor', 'legend', 'diagnostic', 'ecommerce', 'ecommerce_basic'))
```

**Plans réellement utilisés en prod (commit `dddfa4f`)** : `ecommerce`, `ecommerce_basic`, `diagnostic`.

**Référence aux anciens plans dans le code actif** :
| Fichier | Ligne | Code | Statut |
|---|---|---|---|
| [app/api/check-subscription/route.ts:34](app/api/check-subscription/route.ts#L34) | 34 | `plan: 'legend'` (admin override fake subscription) | 🟠 ACTIF — ce hack donne au compte admin un faux plan `legend` pour bypass l'accès |
| [app/api/webhooks/stripe/route.ts:160-162](app/api/webhooks/stripe/route.ts#L160-L162) | 160-162 | Fallback `upsertSubscription('spark')` si CHECK refuse | 🟠 ACTIF mais c'est un hack pour contourner la contrainte legacy |
| [lib/resend.ts:7](lib/resend.ts#L7) | 7 | `plan: string = 'spark'` (default param) | 🟡 ACTIF mais default jamais réellement utilisé (le webhook passe toujours un plan explicite) |
| [app/(dashboard)/dashboard/admin/page.tsx:623](app/(dashboard)/dashboard/admin/page.tsx#L623) | 623 | `setNewStudentPlan('spark')` après création | 🟠 ACTIF — bug visible (réinit sur plan obsolète) |
| [app/(dashboard)/dashboard/admin/page.tsx:1072-1075](app/(dashboard)/dashboard/admin/page.tsx#L1072-L1075) | 1072-1075 | Dictionnaire `planIcons = { spark, diagnostic, emperor, legend }` | 🟠 ACTIF — affiche emoji par plan, manque `ecommerce`/`ecommerce_basic` |

**Recommandation** :
1. Migration SQL pour réduire la CHECK à `('diagnostic', 'ecommerce', 'ecommerce_basic')`
2. Migrer les rows existantes (`UPDATE user_subscriptions SET plan='ecommerce' WHERE plan IN ('spark','emperor','legend')`) — **vérifier d'abord combien de rows réelles**
3. Supprimer le fallback `'spark'` dans le webhook
4. Corriger l'admin override `'legend'` → `'ecommerce'` (ou mieux, ajouter un flag `isAdmin` séparé)
5. Mettre à jour `setNewStudentPlan('ecommerce')` et `planIcons`
6. Changer le default param `'spark'` de `sendActivationEmail` en `'ecommerce'`

---

## I) Fichiers SQL ad-hoc à la racine

**25 fichiers `.sql` à la racine** (en dehors de `supabase/migrations/`) :

| Fichier | Type | Verdict |
|---|---|---|
| `add_phase1_modules_32_36.sql` | Seed legacy | 🟢 ARCHIVABLE — schéma `phases/modules` DEAD |
| `fix_phase2_unit1_lesson1_tasks.sql` | Patch legacy | 🟢 ARCHIVABLE |
| `fix_tasks_rls.sql` | Patch RLS legacy | 🟢 ARCHIVABLE |
| `fix_unique_constraint.sql` | Patch legacy | 🟢 ARCHIVABLE |
| `force_fix_lesson1.sql` | Patch one-shot | 🟢 ARCHIVABLE |
| `force_fix_unit2_full.sql` … `force_fix_unit10_full.sql` (9 fichiers) | Seeds legacy massifs | 🟢 ARCHIVABLE |
| `insert_phase2_structure.sql` | Seed legacy | 🟢 ARCHIVABLE |
| `insert_phase2_unit1_full.sql` | Seed legacy | 🟢 ARCHIVABLE |
| `insert_phase2_v2.sql` | Seed legacy | 🟢 ARCHIVABLE |
| `lock_future_content_v2.sql` | Patch legacy | 🟢 ARCHIVABLE |
| `refactor_schema_v2.sql` | Refactor legacy | 🟢 ARCHIVABLE |
| `seed_phase2_unit1_complete.sql` | Seed legacy | 🟢 ARCHIVABLE |
| `seed_phase2_unit2.sql` | Seed legacy | 🟢 ARCHIVABLE |
| `seed_phases_2_11.sql` | Seed legacy | 🟢 ARCHIVABLE |
| `supabase_schema.sql` | Schéma legacy v1 | 🟢 ARCHIVABLE — remplacé par `supabase/migrations/*` |
| `update_lesson1_prototype.sql` | Patch legacy | 🟢 ARCHIVABLE |
| `update_phase2_module01.sql` | Patch legacy | 🟢 ARCHIVABLE |

### Bilan I
**Tous les .sql à la racine sont DEAD** — ils opèrent sur des tables `phases/modules/units/tasks/lessons` legacy.
**Recommandation** : déplacer dans un dossier `archive/sql-legacy/` (ou supprimer si l'historique git est suffisant).

### À conserver
- `supabase/migrations/` (5 migrations actives)
- `supabase/user_subscriptions.sql` — schéma de la table principale
- `supabase/triggers.sql` — trigger `handle_new_user` actif (à mettre à jour, voir G)

### À examiner dans `supabase/`
| Fichier | Verdict |
|---|---|
| `supabase/schema.sql` (108 lignes — `users`, `progress`, `affiliates`, etc.) | 🟢 Schéma legacy partiel — peut être archivé |
| `supabase/fix_database.sql`, `fix_admin_rls.sql`, `fix_admin_rls_v2.sql`, `fix_rls_policies.sql`, `fix_trigger_v3.sql`, `fix_user_access.sql` | 🟢 Patches one-shot — archivables |
| `supabase/INSTALL_*.sql`, `RESTORE_ALL_11_PHASES.sql`, `phase1_*.sql`, `migrate_user_subscriptions.sql`, `update_lesson1_content.sql`, `create_lesson_progress_table.sql`, `generate_lessons_sql.py` | 🟢 Tous legacy — archivables |
| `supabase/GUIDE_INSTALLATION_RAPIDE.md`, `INSTALLATION_COMPLETE.md`, `INSTALLATION_PHASE1.md` | 🟢 Docs legacy |

---

## J) Fichiers Markdown à la racine

**13 fichiers `.md` à la racine** :

| Fichier | Verdict |
|---|---|
| `README.md` | 🟠 Boilerplate Next.js inchangé — à RÉÉCRIRE pour ECOMY (instructions setup, env vars, deploy) |
| `PROJECT_STATE.md` | 🔴 ACTIF — créé lors de l'audit précédent, à conserver |
| `CLEANUP_AUDIT.md` | 🔴 ACTIF — ce fichier |
| `GUIDE_STRIPE.md` | 🟠 À VÉRIFIER — encore utile pour la procédure `stripe listen` ? Si oui, à mettre à jour avec les bonnes URL |
| `WEBHOOK_SETUP.md` | 🟢 Fichier vide (0 octet) — DEAD à supprimer |
| `CHECKLIST_FINALE_LANCEMENT.md` | 🟢 Notes de lancement passées — ARCHIVABLE |
| `RAPPORT_FINAL_LANCEMENT.md` | 🟢 ARCHIVABLE — mentionne `support@lexmo.ai` |
| `INJECTION_GUIDE.md` | 🟢 Doc du flow `inject-lessons` (DEAD) — ARCHIVABLE |
| `LESSON_INJECTION_PLAN.md` | 🟢 Doc du même flow — ARCHIVABLE |
| `MESSAGE_COMPLET_POUR_CLAUDE.md` | 🟢 Brief LEXMO ancien — ARCHIVABLE |
| `PROMPT_FOR_CLAUDE.md` | 🟢 Brief LEXMO ancien — ARCHIVABLE |
| `SAAS_BRIEF_FOR_CLAUDE.md` | 🟢 Brief LEXMO ancien (mentionne Mubtadi/Mutakaddim/Nokhba) — ARCHIVABLE |
| `STRUCTURE_LANDING_PAGE_AMBASSADEUR.md` | 🟢 Spec LEXMO Ambassador — ARCHIVABLE |
| `PROGRESSION_LOGIC.md` | 🟢 Spec progression LEXMO — ARCHIVABLE |
| `project_structure.txt` | 🟢 Snapshot ancien — DEAD |

### Bilan J
- 1 fichier vide à supprimer (`WEBHOOK_SETUP.md`)
- 9 fichiers MD legacy à archiver (`archive/docs-legacy/`)
- `README.md` à réécrire
- `GUIDE_STRIPE.md` à valider/mettre à jour

---

## K) Constantes & chaînes "LEXMO"

### K.1 Mot-clé `LEXMO` ou `lexmo` dans le code actif

| Fichier | Ligne | Contexte | Verdict |
|---|---|---|---|
| `.env.local` | `RESEND_FROM_EMAIL=noreply@lexmo.ai` | Env var | 🔴 BUG — voir L |
| Aucun fichier `.ts`/`.tsx` actif ne contient le mot "LEXMO" | | | ✅ CLEAN |

### K.2 Préfixe `LEX-`
| Lieu | Verdict |
|---|---|
| `supabase/triggers.sql` ligne 30 : `'LEX-' \|\| generate_random_code(5)` | 🟠 ACTIF (trigger) — à supprimer en même temps que la colonne `ref_code` |
| `supabase/fix_database.sql` (legacy) | 🟢 DEAD avec le fichier |

### K.3 Email `support@lexmo.ai`
| Lieu | Verdict |
|---|---|
| `RAPPORT_FINAL_LANCEMENT.md` | 🟢 doc legacy |
| `STRUCTURE_LANDING_PAGE_AMBASSADEUR.md` | 🟢 doc legacy |
| `content/lessons/phase-1/module-02/lesson-03.md` | 🟢 contenu legacy |
| **Aucun fichier `.ts`/`.tsx` actif** ne mentionne `support@lexmo.ai` | | ✅ CLEAN |

### K.4 Domaine `lexmo.ai`
| Lieu | Verdict |
|---|---|
| `.env.local` (RESEND_FROM_EMAIL) | 🔴 À CHANGER vers `noreply@ecomy.ai` |
| `content/lessons/phase-1/module-02/lesson-03.md`, `lesson-04.md` | 🟢 contenu legacy |
| `content/lessons/phase-1/module-01/lesson-12.md` (`@lexmo_ambassador_ar`) | 🟢 contenu legacy |
| `STRUCTURE_LANDING_PAGE_AMBASSADEUR.md` | 🟢 doc legacy |
| Doc `PROJECT_STATE.md` | 🔴 ACTIF — mentions historiques attendues |

### Bilan K
**Le code TypeScript actif est propre** (0 occurrence). Tous les vestiges "LEXMO" sont :
1. Dans `content/lessons/` (DEAD, voir E)
2. Dans des `.md` racine (legacy, voir J)
3. Dans `supabase/triggers.sql` (à mettre à jour avec les colonnes `ref_code/promo_code`)
4. Dans `.env.local` (RESEND_FROM_EMAIL — bug critique, voir L)

---

## L) Variables d'environnement

### Variables présentes dans `.env.local`
| Variable | Présente | Utilisée dans le code ? | Verdict |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | 🔴 ACTIF (utils/supabase, lib/supabaseAdmin, middleware, plusieurs API) | OK |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | 🔴 ACTIF | OK |
| `SUPABASE_URL` | ✅ | 🔴 ACTIF (10+ routes admin/webhook utilisent `process.env.SUPABASE_URL` avec fallback `NEXT_PUBLIC_SUPABASE_URL`) | OK (doublon volontaire) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | 🔴 ACTIF | OK |
| `STRIPE_SECRET_KEY` | ✅ | 🔴 ACTIF (`webhooks/stripe/route.ts`) | OK (en mode TEST `sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | ✅ | 🔴 ACTIF | OK |
| `RESEND_API_KEY` | ✅ | 🔴 ACTIF (`lib/resend.ts`) | OK |
| `RESEND_FROM_EMAIL` | ✅ valeur `noreply@lexmo.ai` | 🔴 ACTIF (`lib/resend.ts:5`) | 🔴 **BUG** : pointe vers ancien domaine. Code attendait `noreply@ecomy.ai`. Soit le DNS de `lexmo.ai` est toujours actif (à vérifier), soit les emails échouent silencieusement |

### Variables utilisées par le code mais ABSENTES de `.env.local`
| Variable | Utilisée par | Conséquence |
|---|---|---|
| `API_SECRET_LIVE_UPDATE` | `app/api/live/update/route.ts:10` | Fallback hardcodé `'ecomy-live-secret-2026'` — fonctionne mais le secret n'est pas réellement secret |

### Bilan L
- ✅ Aucune variable inutilisée
- 🔴 **`RESEND_FROM_EMAIL` à corriger** : `noreply@lexmo.ai` → `noreply@ecomy.ai` (et **vérifier que le domaine est validé dans Resend**)
- ⚠️ `API_SECRET_LIVE_UPDATE` à définir explicitement (sinon valeur fallback connue par lecture du code)
- ⚠️ Stripe en mode TEST — confirmer si c'est intentionnel pour cet environnement ou s'il faut basculer en LIVE

---

## 📋 Récapitulatif global

### Code 100% mort à supprimer (sûr — ordre suggéré)

**Étape 1 — Composants & pages orphelines** (~20 fichiers)
- `app/components/{Hero,Navbar,Footer,FAQ,Pricing,AvisClients,Bonus,Phases,WhoIsThisFor,FloatingCTA,LoginSection,FadeIn}.tsx`
- `app/components/dashboard/{PhaseCard,ModuleChecklist,StatCard,ProgressCircle,DashboardHeader}.tsx`
- `app/components/course/LessonView.tsx` + dossier `course/`
- Tout `app/components/lesson/`
- `app/(dashboard)/dashboard/lesson-demo/`
- `app/(dashboard)/dashboard/phases/[id]/units/` (sous-arbre complet)
- `app/api/auth/`, `app/api/stripe/` (dossiers vides)

**Étape 2 — Server actions & lib** (3 fichiers)
- `app/actions/course.ts`
- `lib/course-content.ts`
- `lib/supabaseAdmin.ts` (à trancher)

**Étape 3 — Scripts & contenu** (~45 fichiers)
- Tout `scripts/`
- Tout `content/`
- Entrées `inject-lessons*` dans [package.json:10-12](package.json#L10-L12)
- `package-scripts.json` racine

**Étape 4 — SQL ad-hoc & docs racine** (~30 fichiers)
- 25 `.sql` à la racine → archive
- `WEBHOOK_SETUP.md` (vide) → supprimer
- 9 `.md` legacy à la racine → archive
- `README.md` → réécrire
- `project_structure.txt` → supprimer

**Étape 5 — DB Supabase** (à exécuter en migration)
1. Mettre à jour `handle_new_user()` trigger : retirer `ref_code`/`promo_code`
2. `ALTER TABLE users DROP COLUMN ref_code, promo_code, level`
3. `ALTER TABLE bookings DROP COLUMN module_id` (et possiblement `telegram_link`, `admin_notes`)
4. `DROP TABLE progress, user_progress, user_phase_progress, affiliates, commissions, phases, modules, tasks, lessons` (vérifier qu'aucune row utile n'y traîne)
5. `DROP TABLE availability_slots` (à trancher) + supprimer `app/api/admin/availability/`
6. Migrer rows `user_subscriptions` (`UPDATE … SET plan='ecommerce' WHERE plan IN ('spark','emperor','legend')`)
7. Réduire la CHECK constraint à `('diagnostic','ecommerce','ecommerce_basic')`

**Étape 6 — Code à mettre à jour pour aligner avec la nouvelle DB**
- [app/api/check-subscription/route.ts:34](app/api/check-subscription/route.ts#L34) : `'legend'` → `'ecommerce'`
- [app/api/webhooks/stripe/route.ts:158-163](app/api/webhooks/stripe/route.ts#L158-L163) : retirer le fallback `'spark'`
- [lib/resend.ts:7](lib/resend.ts#L7) : default param `'spark'` → `'ecommerce'`
- [app/(dashboard)/dashboard/admin/page.tsx:623](app/(dashboard)/dashboard/admin/page.tsx#L623) : `setNewStudentPlan('spark')` → `'ecommerce'`
- [app/(dashboard)/dashboard/admin/page.tsx:1072-1075](app/(dashboard)/dashboard/admin/page.tsx#L1072-L1075) : remplacer `planIcons` par `{ ecommerce, ecommerce_basic, diagnostic }`

**Étape 7 — Env**
- `.env.local` : changer `RESEND_FROM_EMAIL=noreply@lexmo.ai` → `noreply@ecomy.ai`
- Vérifier validation domaine dans Resend
- Définir explicitement `API_SECRET_LIVE_UPDATE` (en générant une vraie clé)

---

## ⚠️ À NE PAS toucher

- Tout sous `app/api/{admin,bookings,coaching-profile,check-subscription,verify-payment,live,webhooks}/`
- `app/(auth)/`, `app/(dashboard)/dashboard/{coaching,admin,settings,reset-password,phases,ventes-live}/`
- `app/{formation,formation-basic,diagnostic,legal,auth}/`
- `app/page.tsx`, `app/layout.tsx`
- `app/components/dashboard/{Sidebar,Card,StepCard}.tsx`
- `lib/{check-subscription,resend}.ts`
- `utils/`
- `middleware.ts`
- `supabase/migrations/`
- `supabase/user_subscriptions.sql`, `supabase/triggers.sql` (à mettre à jour, pas supprimer)
- `app/(dashboard)/dashboard/phases/{stepsData.ts,page.tsx,error.tsx,loading.tsx,[id]/{page.tsx,LessonContentRenderer.tsx,QuizRenderer.tsx,quizData.ts}}`

---

## 🚦 Décisions à prendre AVANT toute action

| # | Question | Impact |
|---|---|---|
| 1 | Confirmer que `availability_slots` n'est plus utilisée nulle part en prod | DROP table + DELETE route |
| 2 | Confirmer que `bookings.{telegram_link, admin_notes}` ne stocke pas de données utiles actuellement | DROP colonnes |
| 3 | Confirmer que les rows `user_subscriptions` avec `plan IN ('spark','emperor','legend')` sont toutes des tests à migrer/supprimer | UPDATE/DELETE rows |
| 4 | Confirmer que `lib/supabaseAdmin.ts` doit être supprimé OU refactoré pour usage | Décision archi |
| 5 | Confirmer qu'on conserve le mode TEST Stripe ou qu'on bascule en LIVE | Sécurité |
| 6 | Confirmer que `noreply@ecomy.ai` est validé dans Resend (sinon les emails échoueront après changement) | Continuité service |
| 7 | Garder l'historique des `.sql` legacy via Git ou archiver dans un dossier dédié | Espace disque vs traçabilité |

---

*Audit généré le 2026-04-26 — aucun fichier supprimé, aucune table modifiée.*

---

## Z) Compléments d'audit (zones initialement omises)

> Ajouté le 2026-04-26. Vérifications supplémentaires sur les pages cachées et le contenu textuel des fichiers monolithes.

### Z.1 — Inventaire EXHAUSTIF des pages.tsx

**Méthode** : `Glob app/**/page.tsx` + `find app -type d` pour vérifier les dossiers vides.

#### Z.1.a — Inventaire complet des 24 page.tsx

| URL | Fichier | Statut | Vu en audit précédent ? |
|---|---|---|---|
| `/` | `app/page.tsx` | 🔴 ACTIF | ✅ |
| `/formation` | `app/formation/page.tsx` | 🔴 ACTIF | ✅ |
| `/formation-basic` | `app/formation-basic/page.tsx` | 🔴 ACTIF | ✅ |
| `/diagnostic` | `app/diagnostic/page.tsx` | 🔴 ACTIF | ✅ |
| `/login` | `app/(auth)/login/page.tsx` | 🔴 ACTIF | ✅ |
| `/register` | `app/(auth)/register/page.tsx` | 🔴 ACTIF | ✅ |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | 🔴 ACTIF | ✅ |
| `/payment-success` | `app/(auth)/payment-success/page.tsx` | 🔴 ACTIF | ✅ |
| `/auth/verify` | `app/auth/verify/page.tsx` | 🔴 ACTIF | ✅ |
| `/auth/auth-code-error` | `app/auth/auth-code-error/page.tsx` | 🔴 ACTIF | ✅ |
| `/legal/terms` | `app/legal/terms/page.tsx` | 🔴 ACTIF | ✅ |
| `/legal/privacy` | `app/legal/privacy/page.tsx` | 🔴 ACTIF | ✅ |
| `/legal/refund` | `app/legal/refund/page.tsx` | 🟠 ACTIF mais **contient legacy** (voir Z.3) | ✅ |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | 🔴 ACTIF (router) | ✅ |
| `/dashboard/phases` | `app/(dashboard)/dashboard/phases/page.tsx` | 🔴 ACTIF | ✅ |
| `/dashboard/phases/[id]` | `app/(dashboard)/dashboard/phases/[id]/page.tsx` | 🔴 ACTIF | ✅ |
| `/dashboard/phases/[id]/units/[unitId]` | …`/units/[unitId]/page.tsx` | 🟡 DEAD route | ✅ |
| `/dashboard/phases/[id]/units/[unitId]/lessons/[lessonId]` | …`/lessons/[lessonId]/page.tsx` | 🟡 DEAD route | ✅ |
| `/dashboard/coaching` | `app/(dashboard)/dashboard/coaching/page.tsx` | 🔴 ACTIF | ✅ |
| `/dashboard/admin` | `app/(dashboard)/dashboard/admin/page.tsx` | 🔴 ACTIF | ✅ |
| `/dashboard/ventes-live` | `app/(dashboard)/dashboard/ventes-live/page.tsx` | 🔴 ACTIF | ✅ |
| `/dashboard/settings` | `app/(dashboard)/dashboard/settings/page.tsx` | 🔴 ACTIF | ✅ |
| `/dashboard/reset-password` | `app/(dashboard)/dashboard/reset-password/page.tsx` | 🔴 ACTIF | ✅ |
| `/dashboard/lesson-demo` | `app/(dashboard)/dashboard/lesson-demo/page.tsx` | 🟢 DEAD | ✅ |

**Conclusion** : ✅ **Aucune page cachée non identifiée précédemment.** L'audit initial était exhaustif sur ce point.

#### Z.1.b — Pages explicitement cherchées et NON TROUVÉES

| Pattern recherché | Présent dans le repo ? |
|---|---|
| `app/ambassadeur/` | ❌ Absent |
| `app/cours/` ou `app/courses/` | ❌ Absent |
| `app/mubtadi/`, `app/mutakaddim/`, `app/nokhba/` | ❌ Absent |
| `app/[slug]/` (route dynamique racine) | ❌ Absent |
| Routes en arabe (`app/المرحلة/`) | ❌ Absent |
| `app/sfir/`, `app/affilie/`, `app/affiliate/` | ❌ Absent |
| `app/blog/`, `app/articles/` | ❌ Absent |
| `app/spark/`, `app/emperor/`, `app/legend/` | ❌ Absent |
| `app/payment-success/` (à la racine, hors `(auth)`) | ❌ Absent |

#### Z.1.c — 🆕 NOUVEAU dossier vide trouvé

| Élément | État | Verdict |
|---|---|---|
| `app/legal/cgv/` | 🟢 **Dossier VIDE** (aucun fichier) — non détecté dans l'audit initial | DEAD — supprimer le dossier. Aucune route active n'y mène (`grep /legal/cgv` → 0 résultat). Soit vestige d'une ancienne CGV, soit placeholder oublié. |

### Z.2 — Audit textuel des 3 monolithes de contenu

**Méthode** : grep insensible à la casse sur 8 patterns critiques dans :
- [app/(dashboard)/dashboard/phases/[id]/LessonContentRenderer.tsx](app/(dashboard)/dashboard/phases/[id]/LessonContentRenderer.tsx) (7382 lignes)
- [app/(dashboard)/dashboard/phases/stepsData.ts](app/(dashboard)/dashboard/phases/stepsData.ts) (583 lignes)
- [app/(dashboard)/dashboard/phases/[id]/quizData.ts](app/(dashboard)/dashboard/phases/[id]/quizData.ts) (1195 lignes)

#### Z.2.a — Résultats par pattern

| Pattern | LessonContentRenderer.tsx | stepsData.ts | quizData.ts |
|---|---|---|---|
| `LEXMO` / `Lexmo` / `lexmo` | ✅ 0 occurrence | ✅ 0 occurrence | ✅ 0 occurrence |
| `lexmo.ai` | ✅ 0 | ✅ 0 | ✅ 0 |
| `ambassadeur` / `Ambassador` / `ambassador` | ✅ 0 | ✅ 0 | ✅ 0 |
| `سفير` / `أمبسادور` (ambassadeur arabe) | ✅ 0 | ✅ 0 | ✅ 0 |
| `Mubtadi` / `Mutakaddim` / `Nokhba` | ✅ 0 | ✅ 0 | ✅ 0 |
| `LEX-XXXXX` (pattern de code) | ✅ 0 | ✅ 0 | ✅ 0 |
| `@lexmo.ai` (anciens emails) | ✅ 0 | ✅ 0 | ✅ 0 |
| `t.me/` (autres que `ecom_europe` et `ecomyyy`) | ✅ 0 | ✅ 0 | ✅ 0 |
| `spark` / `emperor` / `legend` (anciens plans, casse insensible) | ✅ 0 | ✅ 0 | ✅ 0 |
| `Spark` / `Emperor` / `Legend` arabes (`سبارك`, `إمبرور`, `ليجند`) | ✅ 0 | ✅ 0 | ✅ 0 |

**Faux positifs identifiés et écartés** :
- `LessonContentRenderer.tsx` matches sur `المبتدئين` (= "débutants") et `المتقدمة` (= "avancées") — ce sont des **mots arabes courants** utilisés dans le contenu pédagogique normal ("الميزانية المثالية للمبتدئين" = "le budget idéal pour les débutants"). **Aucun rapport** avec les niveaux LEXMO transliterés `Mubtadi` / `Mutakaddim`.
- `stepsData.ts:184` : `الإعدادات المتقدمة` = "réglages avancés" — terme générique de feature.

#### Z.2.b — Verdict Z.2

🟢 **Le contenu textuel des 3 monolithes est 100% PROPRE.**
Aucun mot-clé LEXMO/legacy. Aucune URL/email obsolète. Aucune mention des anciens plans. **Aucune action requise** sur ces 3 fichiers concernant le contenu. (La taille de `LessonContentRenderer.tsx` reste un problème de maintenance, mais c'est un point séparé.)

### Z.3 — 🚨 DÉCOUVERTE CRITIQUE NON DEMANDÉE : page légale active polluée

En cherchant les mots-clés LEXMO ailleurs, j'ai trouvé que **`app/legal/refund/page.tsx` (page CGU active liée depuis le footer)** contient **7 mentions actives** des plans/programmes LEXMO **legacy** :

| Ligne | Contenu | Problème |
|---|---|---|
| `40` | `<li><strong>باقة الأسطورة (Legend):</strong> بعد بدء الجلسات الشخصية 1-على-1</li>` | Mention plan `Legend` qui n'existe plus |
| `65` | `<li>الباقة المشتراة (Spark / Emperor / Legend)</li>` | Liste les 3 plans LEXMO legacy comme info à fournir lors d'une demande |
| `105` | `<li>إزالة من المجتمع VIP (إذا كنت في Emperor أو Legend)</li>` | Référence Emperor + Legend |
| `106` | `<li>إلغاء حقوق السفير (إذا كنت سفيراً نشطاً)</li>` | Référence au programme **Ambassador / سفير** (LEXMO) qui n'existe pas dans ECOMY |
| `111` | `<h2>6. ضمان خاص - باقة الأسطورة (Legend)</h2>` | **Section entière** dédiée au plan Legend |
| `114` | `بالنسبة لباقة الأسطورة (€2,997)` | Prix `€2,997` qui n'est plus offert (les prix actuels sont 497/197/97) |
| `136` | `<li>إذا حضرت عدة جلسات شخصية (Legend)</li>` | Mention sessions 1-on-1 plan Legend |

**Impact** : 🔴 **Risque légal réel.** Cette page est :
- Liée depuis le footer (`/legal/refund` dans `app/components/Footer.tsx:23` — composant legacy DEAD MAIS aussi probablement référencée ailleurs)
- Affichée publiquement aux clients
- Décrit une politique de remboursement **basée sur des plans qui n'existent plus**, ce qui peut créer une ambiguïté juridique en cas de litige (un client pourrait invoquer le "ضمان البيع الأول 30 jours" du plan Legend même si ce plan n'est plus vendu)

**Recommandation prioritaire** : 🔴 **Réécrire intégralement `app/legal/refund/page.tsx`** pour ne mentionner que les 3 plans actuels :
- `Formation E-commerce complète` (497€)
- `Formation E-commerce sans accompagnement` (197€)
- `Diagnostic Business` (97€)

Définir clairement la politique de remboursement de chacun (notamment : que devient le remboursement du diagnostic une fois la session Google Meet effectuée ?). Supprimer toute mention de `Spark/Emperor/Legend/أسطورة/سفير/مجتمع VIP/حقوق إعادة البيع/جلسات شخصية`.

#### Z.3.a — Vérification des autres pages légales

| Page | Mentions legacy ? |
|---|---|
| `app/legal/terms/page.tsx` | ✅ 0 occurrence trouvée — propre |
| `app/legal/privacy/page.tsx` | ✅ 0 occurrence trouvée — propre |
| `app/legal/refund/page.tsx` | 🔴 **7 occurrences — voir tableau ci-dessus** |

#### Z.3.b — Vérification des landings publiques

| Landing | Mentions legacy ? |
|---|---|
| `app/page.tsx` (homepage) | ✅ 0 occurrence — propre |
| `app/formation/page.tsx` | ✅ 0 occurrence — propre |
| `app/formation-basic/page.tsx` | ✅ 0 occurrence — propre |
| `app/diagnostic/page.tsx` | ✅ 0 occurrence — propre |

### Z.4 — Récapitulatif Z

#### À ajouter aux verdicts précédents

| Élément | État | Verdict | Priorité |
|---|---|---|---|
| `app/legal/cgv/` (dossier vide) | 🟢 DEAD | Supprimer dossier | Basse |
| `app/legal/refund/page.tsx` (lignes 40, 65, 105-106, 111, 114, 136) | 🔴 ACTIF mais POLLUÉ | **Réécrire intégralement** pour aligner sur plans `ecommerce`/`ecommerce_basic`/`diagnostic` | 🔴 **HAUTE** (risque légal) |

#### Confirmations rassurantes (pas d'action requise)

- ✅ Contenu pédagogique des 26 phases (`LessonContentRenderer.tsx`, `stepsData.ts`, `quizData.ts`) **100% propre** — pas de référence LEXMO
- ✅ Aucune page cachée legacy (pas de `/ambassadeur`, `/cours`, `/spark`, `/emperor`, `/legend`, `/mubtadi`, etc.)
- ✅ Pages `terms` et `privacy` propres
- ✅ Les 3 landings publiques (`formation`, `formation-basic`, `diagnostic`) propres
- ✅ Homepage propre

#### Mise à jour de l'étape 6 du plan de cleanup principal

L'étape 6 (cf. récapitulatif global) doit être **complétée** par :

> 6.bis — Réécrire `app/legal/refund/page.tsx` :
> - Supprimer toutes les mentions `Spark / Emperor / Legend / أسطورة / سفير / حقوق إعادة البيع / مجتمع VIP / جلسات شخصية 1-على-1 / €2,997 / €1,497 / €997 / €697`
> - Définir la politique de remboursement pour chacun des 3 plans actuels
> - Aligner avec ce qui est réellement vendu sur Stripe aujourd'hui

#### Mise à jour de l'étape 1 du plan de cleanup principal

L'étape 1 doit être complétée par :
- Supprimer le dossier vide `app/legal/cgv/`

---

*Section Z ajoutée le 2026-04-26 — découverte critique : politique de remboursement obsolète à réécrire en priorité.*
