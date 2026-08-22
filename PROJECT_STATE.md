# 📊 RAPPORT D'ÉTAT COMPLET — ECOMY (ex-LEXMO)

> **Document mis à jour le 22/08/2026** (version initiale : 26/04/2026) — destiné à une instance Claude sans contexte préalable.
> Répertoire racine : `c:\Users\user\Desktop\lexmo-saas-ai\`
> Branche Git : `main` — dernier commit `2a63df7` (07/08/2026)
> **Chaque section a été revérifiée contre le code au 22/08/2026** : ce qui n'existait plus a été retiré, ce qui manquait a été ajouté.

---

## ⚠️ Règle de vérification — à lire avant d'écrire quoi que ce soit dans ce document

> **Ne jamais inférer l'état de la production à partir de fichiers locaux.**
> `.env.local` est ignoré par git et ne dit rien de Vercel.
> Toute affirmation sur la production doit s'appuyer sur un comportement observé, pas sur un fichier de développement.
> Si l'information n'est pas vérifiable depuis le dépôt, l'écrire explicitement comme non vérifiée plutôt que de conclure.

Cette règle est née d'une erreur réelle : les versions d'avril **et** du 22/08 de ce document affirmaient toutes deux que Stripe tournait en mode test, sur la seule foi du préfixe de clé lu dans `.env.local`. Les paiements réels arrivaient en fait sur le compte live — l'encaissement ne passe même pas par cette variable. Reconduire une vérification sur le même fichier local a reproduit la faute au lieu de la corriger.

**Ce qui est observable depuis le dépôt** : le code, les migrations, les dépendances, et les réponses HTTP de la production (`curl`).
**Ce qui ne l'est pas** : les variables d'environnement Vercel, l'état réel du schéma Supabase, la configuration du dashboard Stripe, les DNS, et tout réglage fait dans une interface tierce. Pour ces sujets, écrire « non vérifiable depuis le dépôt ».

---

## 📑 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack technique complète](#2-stack-technique-complète)
3. [Architecture](#3-architecture)
4. [Modèle de données](#4-modèle-de-données)
5. [Espace membre](#5-espace-membre)
6. [Système de cours](#6-système-de-cours)
7. [Blog SEO](#7-blog-seo)
8. [Système de liens d'accès](#8-système-de-liens-daccès)
9. [Autres fonctionnalités](#9-autres-fonctionnalités)
10. [Routes et endpoints](#10-routes-et-endpoints)
11. [Interface d'administration](#11-interface-dadministration)
12. [Composants frontend](#12-composants-frontend)
13. [Services backend](#13-services-backend)
14. [Sécurité](#14-sécurité)
15. [Configuration](#15-configuration)
16. [Tests](#16-tests)
17. [Déploiement](#17-déploiement)
18. [Historique récent](#18-historique-récent)
19. [Alertes de sécurité](#19-alertes-de-sécurité)
20. [📍 État au 22/08/2026](#20--état-au-22082026)

---

## 1. Vue d'ensemble

### Identité
- **Nom commercial** : `ECOMY` (logo `font-orbitron`, doré `#C5A04E`)
- **Domaine de production** : `www.ecomy.ai` — l'apex `ecomy.ai` est redirigé en 301 vers `www` par le middleware ([middleware.ts:7-14](middleware.ts#L7-L14)). 🔍 *Source : code. La redirection n'a pas été testée sur l'apex et dépend aussi du DNS — hors dépôt.*
- **Nom du repo / package** : `temp_app` ([package.json:2](package.json#L2)) — le dossier `lexmo-saas-ai` est historique
- **Email admin** : `academyfrance75@gmail.com` (hardcodé, pas via variable d'environnement)
- **Email d'envoi (Resend)** : le code retombe sur `noreply@ecomy.ai` par défaut si `RESEND_FROM_EMAIL` n'est pas définie ([lib/resend.ts:5](lib/resend.ts#L5)). 🔍 **La valeur en production n'est pas vérifiable depuis le dépôt** (variables Vercel). Le fait que les clients soient bien activés après paiement indique que les emails partent.

### Type & objectif
Plateforme **e-learning + coaching 1-to-1 + vente de formations**, en **arabe (RTL)**, ciblant le **monde arabophone (MENA + diaspora européenne)**. Contenu : **dropshipping / e-commerce Shopify + publicité Facebook & TikTok**, sur **26 phases** et **136 leçons** dont **84 vidéos YouTube**.

Depuis mai 2026 s'y ajoute un **blog SEO arabe de 326 articles** (§7). 🔍 *Sa part réelle dans l'acquisition n'est pas vérifiable depuis le dépôt* — aucune donnée d'audience n'a été consultée.

### Public cible
Débutants arabophones intéressés par le e-commerce. Pays couverts (articles + sélecteurs) : Maroc, Algérie, Tunisie, Arabie Saoudite, Émirats, Koweït, Qatar, Bahreïn, Oman, Égypte, Irak, Jordanie, Libye, Liban, Syrie, Yémen, Soudan, Mauritanie, Palestine + diaspora (France, Belgique, Allemagne, Italie, Espagne, UK, Pays-Bas, Suède, Canada, Australie).

### État global
- **Production active** sur Vercel, déploiement automatique sur push `main`
- **Paiements en production** — l'encaissement passe par des **Payment Links statiques** dont le mode est défini côté Stripe, pas par une variable de ce dépôt. `.env.local` contient une clé de test, ce qui est normal en développement local et **ne dit rien de la production**, dont les variables vivent chez Vercel
- Working tree : plusieurs dossiers non suivis (`ecomy-video-factory/`, brouillons de logos, visuels de vente)

### Modèle économique
3 offres one-shot via **Stripe Payment Links** (URLs fixes en dur dans les pages de vente, pas de session créée dynamiquement, pas d'abonnement récurrent) :

| Offre | Prix | Plan DB | Détection | Contenu |
|---|---|---|---|---|
| Formation E-commerce complète | **497 €** | `ecommerce` | montant `49700` | Formation + accompagnement Telegram |
| Formation sans accompagnement | **197 €** | `ecommerce_basic` | montant `19700` | Auto-apprentissage, pas de support |
| Diagnostic Business | **97 €** | `diagnostic` | montant `9700` | Session 45 min Google Meet + plan d'action |

> La détection du plan se fait sur `session.amount_total`, **pas sur le `price_id`**.

---

## 2. Stack technique complète

### Frontend
- **Next.js 16.1.3** (App Router, RSC + Server Actions) · **React 19.2.3** · **TypeScript 5**
- **Tailwind CSS v4** + `@tailwindcss/typography`
  > ⚠️ En Tailwind v4, `tailwind.config.ts` **n'est pas chargé**. La configuration réelle (thème, plugins) vit dans [app/globals.css](app/globals.css) via `@plugin` / `@theme`. Le fichier `tailwind.config.ts` subsiste à la racine mais est **inerte** — le modifier n'a aucun effet.
- `clsx` + `tailwind-merge` ([utils/cn.ts](utils/cn.ts)) · **Framer Motion 12** · **lucide-react**
- `react-fast-marquee`, `react-countup` — UI animée
- `chart.js` + `react-chartjs-2` — graphiques `/dashboard/ventes-live`
- **next-mdx-remote 6** — rendu des articles de blog
- `react-markdown` + `remark-gfm` + `react-syntax-highlighter` — bilans diagnostic, contenus riches
- `flag-icons` — drapeaux pays
- `zustand 5` — **présent en dépendance, totalement inutilisé** : zéro occurrence dans `app/`, `lib/`, `components/`, `utils/`. Le state est en `useState` local ou dans des hooks maison
- Polices : **Cairo** (arabe), **Orbitron** (logo) via `next/font/google`

### Backend (in-process Next.js)
- **Route Handlers** (`app/api/**/route.ts`) + **Server Actions** ([app/(auth)/actions.ts](app/(auth)/actions.ts))
- **Middleware Edge** ([middleware.ts](middleware.ts) → [utils/supabase/middleware.ts](utils/supabase/middleware.ts)) : canonicalisation du domaine, rafraîchissement de session Supabase, protection de `/dashboard`, validation des liens d'accès
- `app/actions/` existe mais est **vide** (`course.ts` supprimé)

### Base de données
- **Supabase (Postgres managé)** — la référence du projet vit dans les variables d'environnement, non reproduite ici
- Pas d'ORM : `@supabase/supabase-js@2.90` + `@supabase/ssr@0.8`
- **RLS activé partout**, policies admin par email hardcodé. ✅ *Vérifié en base le 22/08 par test comportemental — voir §4.0.*
- Le code serveur utilise systématiquement la **service-role key** (bypass RLS) et refait le contrôle d'accès en TypeScript

### Authentification
- **Supabase Auth** (email + mot de passe + magic link), PKCE pour le reset
- Sessions en cookies via `@supabase/ssr` · **Pas d'OAuth**, pas de 2FA
- Contrôle admin par email hardcodé, centralisé depuis août 2026 dans [lib/admin-auth.ts](lib/admin-auth.ts)
- **Voie d'accès alternative** : les liens d'accès (§8) ouvrent la formation **sans compte ni cookie**

### Stockage de fichiers
- **Pas de storage Supabase.** Vidéos en iFrame `youtube-nocookie.com`
- Statique dans `public/` : `images/` (avatars, preuves, visuels de vente), `images/covers/` (326 couvertures d'articles), `etapes/` (vignettes 1→26)
- Aucun upload utilisateur

### Contenu éditorial
- **326 articles MDX** dans `content/blog/`, front-matter parsé par `gray-matter` ([lib/blog.ts](lib/blog.ts))
- Plans éditoriaux et réservoirs de sujets en CSV/XLSX dans `content/`
- Contrat de rédaction : [content/editorial/GUIDE-REDACTION.md](content/editorial/GUIDE-REDACTION.md)

### Paiement, email, hébergement
- **Stripe 20.2** · encaissement par Payment Links statiques · webhook sur `checkout.session.completed`. Le SDK n'est instancié que dans le webhook, et uniquement pour `webhooks.constructEvent` — une vérification HMAC locale qui n'appelle pas l'API Stripe
- **Resend 6.9** ([lib/resend.ts](lib/resend.ts)) : activation post-paiement, confirmation de réservation · [lib/telegram.ts](lib/telegram.ts) pour les notifications Telegram
- **Vercel**, déploiement sur push `main`, **aucun fichier CI/CD** dans le repo
- **Google Analytics 4** via `@next/third-parties/google`

---

## 3. Architecture

### Arborescence réelle
```
lexmo-saas-ai/
├── app/
│   ├── (auth)/                          # login, register, forgot-password, payment-success
│   │   ├── actions.ts                   # Server Actions : login, signup, logout, resetPassword, updatePassword
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                   # Sidebar + AccessLinkKeeper (propagation du token)
│   │   └── dashboard/
│   │       ├── page.tsx                 # Router : redirige vers /coaching ou /phases selon le plan
│   │       ├── phases/
│   │       │   ├── page.tsx             # Grille des 26 étapes (StepCard) + gate d'abonnement
│   │       │   ├── stepsData.ts         # 583 l. — catalogue des leçons (URLs vidéo, quiz, clés de contenu)
│   │       │   ├── error.tsx, loading.tsx
│   │       │   └── [id]/
│   │       │       ├── page.tsx         # Lecteur de phase — ⚠️ AUCUN contrôle d'abonnement (§19)
│   │       │       ├── LessonContentRenderer.tsx  # 7382 l. — tout le contenu textuel
│   │       │       ├── QuizRenderer.tsx
│   │       │       └── quizData.ts      # 1195 l.
│   │       ├── coaching/                # Parcours diagnostic 5 étapes + questionnaire/ (diagnostic v2)
│   │       ├── focus/                   # Minuteur de concentration + focus/stats
│   │       ├── admin/
│   │       │   ├── page.tsx             # 1716 l.
│   │       │   ├── AccessLinksSection.tsx        # Liens d'accès
│   │       │   └── DiagnosticSubmissionsSection.tsx  # 637 l. — diagnostic v2
│   │       ├── ventes-live/
│   │       ├── settings/                # Mot de passe uniquement
│   │       └── reset-password/
│   ├── api/                             # 25 route handlers (voir §10.2)
│   ├── auth/{verify,auth-code-error}/
│   ├── blog/                            # Index, [slug], categorie/[cat]
│   ├── components/                      # ⚠️ Réduit à 4 fichiers : blog/BlogCTA + dashboard/{Card,Sidebar,StepCard}
│   ├── diagnostic/, formation/, formation-basic/, a-propos/, avis-preview/
│   ├── legal/terms/                     # ⚠️ SEUL fichier légal restant (§19)
│   ├── layout.tsx                       # html dir="rtl" lang="ar", GA4, JSON-LD
│   ├── page.tsx                         # 773 l. — homepage
│   ├── sitemap.ts, robots.ts
│   └── globals.css                      # ⭐ Config Tailwind v4 réelle
├── components/                          # Composants hors App Router
│   ├── AccessDebugFooter.tsx, AccessLinkKeeper.tsx, AccessLinkRecovery.tsx
│   ├── blog/                            # 14 composants MDX (carrousels, FAQ, TOC, timeline…)
│   ├── sales/SalesSections.tsx
│   └── testimonials/                    # ProofGallery, VideoCarousel, Lightbox, Flag
├── lib/
│   ├── access-links.ts                  # Validation token (edge-safe), liste blanche, journalisation
│   ├── access-token-client.ts           # Lecture du token côté client
│   ├── admin-auth.ts                    # requireAdmin() — contrôle admin par session
│   ├── blog.ts                          # Lecture MDX, catégories, slugs, sitemap
│   ├── check-subscription.ts, diagnostic-questions.ts (335 l.)
│   ├── hooks/{useProgress,useFocusTasks,useFocusSubtasks}.ts
│   ├── resend.ts, telegram.ts, supabaseAdmin.ts
├── utils/{cn.ts, supabase/{client,server,middleware}.ts}
├── middleware.ts
├── content/{blog/*.mdx (326), editorial/, *.csv, *.xlsx}
├── supabase/migrations/                 # 13 migrations (voir §4)
├── scripts/                             # .mjs (blog, plans) + .py (visuels, logos)
├── archive/{docs-legacy/, sql-legacy/}  # Vestiges LEXMO, non utilisés
└── PROJECT_STATE.md, CLEANUP_AUDIT.md, GUIDE_STRIPE.md, README.md (boilerplate)
```

> **Nettoyage effectué depuis avril 2026** : ont disparu `app/actions/course.ts`, `lib/course-content.ts`, `app/components/{Hero,Navbar,Footer,Pricing,…}`, `app/components/lesson/`, `app/components/course/`, les routes `phases/[id]/units/[unitId]/`, `/dashboard/lesson-demo`, `content/lessons/`, `supabase/schema.sql`, `project_structure.txt`, les dossiers vides `app/api/{auth,stripe}/` et la trentaine de `.sql` ad-hoc à la racine.

### Flux paiement → activation
```
Page de vente → Stripe Payment Link → Checkout hébergé
  → checkout.session.completed → POST /api/webhooks/stripe
      ├─ Resend : email d'activation (prioritaire)
      ├─ Insert/Update user_subscriptions (status=active, plan selon le montant)
      └─ Incrément du compteur promo, auto-fermeture si plein
  → /register?email=… → signup() vérifie qu'une subscription existe pour cet email
  → /dashboard → redirige vers /phases (formation) ou /coaching (diagnostic)
```

### Flux d'accès à la formation (deux voies)
```
Voie normale :   cookie de session Supabase → middleware → page → gate client (/api/check-subscription)
Voie lien :      ?access=<token> dans l'URL → middleware valide en base → page
                 → gate client (/api/check-subscription?access=…) → hasAccess:true
```

### Flux booking diagnostic (5 étapes)
```
1. Formulaire (nom + email Meet)  → POST /api/coaching-profile
2. Calendrier                     → GET/POST /api/bookings (9h-19h, 30 j glissants) + email
3. Countdown                      → jusqu'à booking_date
4. Diagnostic rempli par l'admin  → POST/PATCH /api/admin/diagnostic → publication
5. Validation client              → PATCH /api/coaching-profile {action:'validate_diagnostic'}
```

### Patterns
- **Route Groups** `(auth)` / `(dashboard)` pour des layouts distincts sans impacter l'URL
- **Service-role bypass RLS** dans toutes les routes serveur, contrôle d'accès refait en TS
- **Polling client** plutôt que websockets (60 s pour la promo)
- **Contenu de cours en TypeScript hardcodé**, contenu de blog en fichiers MDX — rien en base
- **Admin par email hardcodé** (anti-pattern assumé, §14)

---

## 4. Modèle de données

> Le contenu de cours n'est **pas** en base : il vit dans `stepsData.ts`, `quizData.ts` et `LessonContentRenderer.tsx`. Le blog vit en fichiers MDX. La base ne stocke que les **utilisateurs, paiements, parcours et progression**.

### 4.0 État réel des migrations — vérifié en base le 22/08/2026

> **Méthode** : chaque table et chaque colonne ajoutée a été interrogée via l'API REST Supabase avec la clé service-role (lectures seules). Un fichier de migration ne prouve pas son application : c'est la base qui tranche.

| Fichier | Apport | Statut en base |
|---|---|---|
| `20260127_init_live_dashboard.sql` | `live_dashboard_state` | ✅ appliquée |
| `20260318_coaching_profiles.sql` | `coaching_profiles` | ✅ appliquée |
| `20260318_coaching_system.sql` | `availability_slots` + colonnes de `bookings` | ⚠️ **partielle** — voir ci-dessous |
| `20260323_coaching_diagnostics.sql` | `coaching_diagnostics` | ✅ appliquée |
| `20260419_ecommerce_plans.sql` | Valeurs `ecommerce` / `ecommerce_basic` au CHECK | ✅ appliquée (165 lignes `ecommerce`, 21 `ecommerce_basic` en base) |
| `20260426_lesson_progress.sql` | `lesson_progress` | ✅ appliquée (4483 lignes) |
| `20260427_focus_sessions.sql` | `focus_sessions` | ✅ appliquée |
| `20260427_focus_tasks.sql` | `focus_tasks` | ✅ appliquée |
| `20260427_focus_subtasks.sql` | `focus_subtasks` | ✅ appliquée |
| `20260427_focus_task_types.sql` | `focus_tasks.task_type` | ✅ appliquée |
| `20260509_diagnostic_v2.sql` | `diagnostic_submissions` | ✅ appliquée |
| `20260807_access_links.sql` | `access_links`, `access_link_uses` | ✅ appliquée (4 liens, 120 usages) |
| `20260807_access_link_progress.sql` | `access_link_progress` | ✅ appliquée (9 lignes) |

**Les 16 tables attendues existent.** Une seule migration est incomplète :

**`20260318_coaching_system.sql` — partiellement appliquée.** La table `availability_slots` existe et la colonne `bookings.product_type` aussi, mais les deux autres colonnes de `bookings` **manquent** :

| Colonne | État | Utilisée par le code ? |
|---|---|---|
| `product_type` | ✅ existe | oui — [bookings/route.ts:152](app/api/bookings/route.ts#L152), [coaching-profile/route.ts:39](app/api/coaching-profile/route.ts#L39), admin |
| `telegram_link` | ❌ absente | non |
| `admin_notes` | ❌ absente | non |
| `module_id` | ❌ absente | non (colonne legacy) |

> **Aucun impact fonctionnel** : le code ne référence aucune des trois colonnes manquantes. Soit on rejoue la partie `ALTER TABLE` de la migration, soit on la retire du fichier pour que fichier et base coïncident. À arbitrer.

**Test de RLS (comportemental, clé anon vs service-role)**

| Table | Lignes (service-role) | Lignes (anon) | Verdict |
|---|---|---|---|
| `users` | 192 | 0 | bloquée |
| `user_subscriptions` | 198 | 0 | bloquée |
| `lesson_progress` | 4483 | 0 | bloquée |
| `diagnostic_submissions` | 1 | refus | bloquée |
| `access_links` | 4 | 0 | bloquée |
| `access_link_uses` | 120 | 0 | bloquée |
| `access_link_progress` | 9 | 0 | bloquée |
| `focus_tasks` | 7 | 0 | bloquée |
| `bookings` | 2 | 0 | bloquée |
| `live_dashboard_state` | 1 | **1** | lisible publiquement — **par conception** |

Les tokens de `access_links` sont donc bien inaccessibles avec la clé anon, comme voulu (§4.13).

> 🔍 **Non vérifiés en base** : le détail des policies RLS (seul leur *effet* a été testé), les triggers, les contraintes CHECK elles-mêmes, et les `REVOKE`/`GRANT` sur les fonctions. PostgREST n'expose pas le catalogue Postgres.

### 4.1 `auth.users`
Géré par Supabase Auth. `raw_user_meta_data` contient `name`, `phone`, `country` (alimentés par `signup()`).

### 4.2 `public.users` (profil étendu)
Table historique alimentée par le trigger `on_auth_user_created` ([supabase/triggers.sql](supabase/triggers.sql)). 🔍 *Source : fichier SQL — l'existence du trigger n'a pas été vérifiée en base. La table, elle, existe et contient 192 lignes.* Colonnes : `id`, `email`, `name`, `phone`, `country`, `level`, `avatar_url`, `ref_code` (`LEX-XXXXX`), `promo_code`, timestamps. Le code récent lit surtout `auth.users` via `auth.admin.listUsers()`.

### 4.3 `public.user_subscriptions` ⭐
Table centrale des paiements ([supabase/user_subscriptions.sql](supabase/user_subscriptions.sql)).

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK→auth.users, **nullable** | peut être créé avant le signup |
| `email` | text NOT NULL UNIQUE | clé fonctionnelle |
| `plan` | text | CHECK inclut encore les valeurs legacy `spark`, `emperor`, `legend` |
| `status` | text | `pending` / `active` / `inactive` |
| `activated_at`, `created_at` | timestamptz | |

**RLS** : owner en SELECT (par `user_id` ou email) ; admin en écriture.

### 4.4 `public.live_dashboard_state` (singleton `id=1`)
Blob JSONB `data` servant de store global : `live_actuel`, `ventes[]`, `stats`, `graphique[]`, et surtout **`settings`** (`registrations_open`, `show_company_info`, `promo_active`, `promo_places_total`, `promo_places_prises`, `promo_duree_heures`, `promo_interval_minutes`, `promo_started_at`).

### 4.5 `public.coaching_profiles`
Un profil par user (`user_id` UNIQUE) : `full_name`, `google_meet_email`, `current_step` (1..5).

### 4.6 `public.bookings`
`user_id`, `booking_date`, `status` (`scheduled`/`completed`/`cancelled`), `telegram_link`, `admin_notes`, `product_type` (défaut `diagnostic`).

### 4.7 `public.coaching_diagnostics`
Un diagnostic par client : `answers` (jsonb), `summary`, `recommended_business`, `action_plan`, `recommendation`, `published`, `client_validated`.

### 4.8 `public.coaching_blocked_slots`
`id`, `slot_datetime` — créneaux bloqués manuellement par l'admin.

### 4.9 `public.availability_slots`
Créneaux récurrents (`day_of_week`, `hour`, `minute`, `duration_minutes`, `is_active`).
> ⚠️ **Non câblée** : `/api/bookings` génère les créneaux 9h-19h en dur sans lire cette table.

### 4.10 `public.lesson_progress` ⭐ *(ajouté 26/04/2026)*
Progression réelle des élèves — **contredit l'ancienne version de ce document qui disait le tracking inexistant**.

| Colonne | Type | Notes |
|---|---|---|
| `user_id` | uuid **NOT NULL** FK→auth.users | |
| `phase_id` | integer | |
| `lesson_id` | text | clé `chapitre-id` |
| `is_completed` | boolean | |
| `completion_method` | text | `manual` / `auto_video` / `quiz` |
| `time_spent_seconds` | integer | cumulé |
| `quiz_score`, `quiz_total` | integer | meilleur score conservé |

`UNIQUE(user_id, phase_id, lesson_id)`. RLS owner + admin.

### 4.11 `public.focus_sessions`, `focus_tasks`, `focus_subtasks` *(27/04/2026)*
Module de concentration (type Pomodoro) : tâches, sous-tâches, sessions minutées. RLS owner + admin.

### 4.12 `public.diagnostic_submissions` ⭐ *(09/05/2026 — diagnostic v2)*
Questionnaire de **180 questions** + bilan + plan + suivi de projet. Une soumission par user (`UNIQUE(user_id)`).

| Colonne | Notes |
|---|---|
| `status` | `in_progress` → `completed` → `analyzing` → `bilan_published` → `plan_published` → `in_development` |
| `responses` | jsonb — toutes les réponses |
| `current_block`, `current_question` | reprise du questionnaire là où il s'est arrêté |
| `bilan_content`, `plan_content` | Markdown rédigé par l'admin |
| `project_steps` | jsonb — étapes de suivi (`done`/`in_progress`/`locked`) |
| `completed_at`, `bilan_published_at`, `plan_published_at` | |

> Les tables v1 (`coaching_profiles`, `coaching_diagnostics`, `bookings`) sont **conservées intactes** et toujours utilisées par le parcours 5 étapes.

### 4.13 `public.access_links` + `access_link_uses` ⭐ *(07/08/2026)*
Voir §8.

`access_links` : `token` (UNIQUE, en clair), `label`, `expires_at`, `is_active`, `uses_count`, `last_used_at`.
`access_link_uses` : `link_id`, `used_at`, `ip`, `user_agent`, `path` — c'est le **nombre d'IP distinctes** qui révèle qu'un lien circule.

**RLS activée sans policy publique** : même avec la clé anon, les tokens sont illisibles. Deux fonctions `SECURITY DEFINER` (`record_access_link_use`, `access_links_overview`) avec `REVOKE` sur `anon`/`authenticated`.

### 4.14 `public.access_link_progress` *(07/08/2026)*
Progression des porteurs de lien, **table séparée** de `lesson_progress` (dont `user_id` est `NOT NULL REFERENCES auth.users`, incompatible avec un visiteur sans compte). Clé `link_id` avec `ON DELETE CASCADE` : supprimer le lien supprime la progression.

### 4.15 Tables legacy sans usage
`progress`, `user_progress`, `user_phase_progress`, `affiliates`, `commissions`, `phases`, `modules`, `tasks`, `lessons`.

### Relations clés
```
auth.users 1 ─┬─< user_subscriptions      (par user_id ou email)
              ├─< coaching_profiles       (UNIQUE)
              ├─< coaching_diagnostics    (UNIQUE)
              ├─< diagnostic_submissions  (UNIQUE)
              ├─< bookings                (1-N)
              ├─< lesson_progress         (1-N)
              └─< focus_tasks/sessions    (1-N)

access_links 1 ─┬─< access_link_uses      (1-N, journal)
                └─< access_link_progress  (1-N, progression)

live_dashboard_state (singleton id=1, JSONB)
```

---

## 5. Espace membre

### 5.1 Inscription (`/register`)
⚠️ **Particularité critique** : `signup()` vérifie qu'une row existe dans `user_subscriptions` pour l'email **avant** d'autoriser la création du compte. Le paiement doit donc précéder l'inscription. Si l'email Stripe diffère de celui du formulaire → erreur en arabe. L'email passé en `?email=` (lien Resend) est verrouillé.

### 5.2 Connexion (`/login`)
Server Action `login()` → `signInWithPassword`. Pas de « se souvenir de moi », pas de 2FA, pas d'OAuth.
Depuis août 2026, la page monte aussi [AccessLinkRecovery](components/AccessLinkRecovery.tsx) (§8) — sans token mémorisé, comportement strictement inchangé.

### 5.3 → 5.5 Mot de passe
`/forgot-password` (client, PKCE) → email Supabase → `/auth/verify` (3 cas : session active, échange PKCE, magic link) → `/dashboard/reset-password`.

### 5.6 Profil & paramètres (`/dashboard/settings`)
**Uniquement** le changement de mot de passe. ⚠️ Nom, téléphone, pays, email, photo : non modifiables par l'utilisateur.

### 5.7 Tableau de bord (`/dashboard`)
N'affiche rien : routeur qui redirige vers `/dashboard/coaching` (plan `diagnostic`) ou `/dashboard/phases`.

### 5.8 Rôles & permissions
| Rôle | Détection | Accès |
|---|---|---|
| **Admin** | `user.email === 'academyfrance75@gmail.com'` | Tout, y compris `/dashboard/admin`, `/ventes-live`, `/focus`, mode démo coaching |
| **Étudiant formation** | `plan IN ('ecommerce','ecommerce_basic', legacy)` | `/dashboard/phases/*` |
| **Client diagnostic** | `plan === 'diagnostic'` | `/dashboard/coaching` |
| **Porteur de lien d'accès** | `?access=<token>` valide dans l'URL | `/dashboard/phases/*` **uniquement** (§8) |

⚠️ Pas de table `roles`, pas de permissions granulaires. La sidebar ([Sidebar.tsx:22-36](app/components/dashboard/Sidebar.tsx#L22-L36)) bascule entre `FORMATION_ITEMS` et `DIAGNOSTIC_ITEMS`, et ajoute `ADMIN_ITEMS` (admin, ventes-live, coaching, focus) si admin.

### 5.9 Suppression de compte
⚠️ Aucune fonctionnalité utilisateur. Côté admin, un bouton passe `subscription.status` à `inactive` (le compte auth subsiste).

### 5.10 Historique d'activité
Aucun audit log général. **Seule exception** : `access_link_uses` journalise date, IP, user-agent et chemin pour chaque ouverture d'un lien d'accès.

---

## 6. Système de cours

### 6.1 Structure (TypeScript hardcodé)
```
Phase (1..26)  — « étape » / « مرحلة »
  └─ Chapter (titre arabe)
      └─ Lesson (id, title, type: 'video'|'quiz'|'pdf', videoUrl?, duration?, content?)
```
136 leçons, dont 84 vidéos. Les URLs sont construites au build par `youtubeEmbed()` ([stepsData.ts:21](app/(dashboard)/dashboard/phases/stepsData.ts#L21)), qui **découpe sur `v=`** : il faut donc toujours lui passer une URL `watch?v=<ID>`, jamais une forme `youtu.be/<ID>`.

### 6.2 Catalogue (`/dashboard/phases`)
Grille de 26 `StepCard` (vrais `<Link href>`). Rendue **après hydratation** : le HTML serveur ne contient qu'un écran de chargement, le temps de l'appel à `/api/check-subscription`. C'est cette page qui porte le **gate d'abonnement** (écran `الوصول مقيد` + [AccessDebugFooter](components/AccessDebugFooter.tsx) discret pour le diagnostic).

### 6.3 Lecteur de phase (`/dashboard/phases/[id]`)
iFrame `youtube-nocookie.com` + overlays anti-partage (masquent titre, logo et « Watch on YouTube » sans bloquer les contrôles). Sidebar de navigation entre leçons via `<button>` + state local (pas de navigation d'URL).

> ⚠️ **Cette page n'a AUCUN contrôle d'abonnement** — elle ne lit `checkUserSubscription()` que pour décider de l'affichage du bloc Telegram. Voir §19.

### 6.4 Suivi de progression ✅ *(implémenté depuis le 26/04/2026)*
[lib/hooks/useProgress.ts](lib/hooks/useProgress.ts) + `/api/progress` + table `lesson_progress` :
- Complétion **manuelle** (bouton) ou **automatique** à 90 % de la durée estimée de la vidéo
- Temps passé bufferisé côté client, vidé toutes les 30 s
- Meilleur score de quiz conservé
- Barres de progression par phase et globale
- **Entièrement non bloquant** : toute erreur réseau est avalée ([useProgress.ts:44](lib/hooks/useProgress.ts#L44)), la page s'affiche même si l'API échoue

### 6.5 Quiz
`QuizRenderer` + `quizData.ts` (1195 l.) : mélange des réponses, scoring, enregistrement via `/api/progress`.

### 6.6 Non implémenté
Certificats · favoris · avis élèves réels · prérequis entre cours · édition de cours en admin (tout passe par un déploiement).

---

## 7. Blog SEO

> **Fonctionnalité majeure absente de la version précédente de ce document**, qui indiquait « Blog : aucun ».

### 7.1 Volume et organisation
- **326 articles MDX** dans `content/blog/`, en arabe fusha
- **11 catégories** ([lib/blog.ts:26-38](lib/blog.ts#L26-L38)) : fondamentaux, marketing-publicite, produits-fournisseurs, par-pays, paiement-logistique, legal-fiscalite, outils-ia, creation-magasin, marque-dropshipping, temoignages, choix-formation
- **326 couvertures** dans `public/images/covers/`

### 7.2 Routes
| URL | Rôle |
|---|---|
| `/blog` | Index, grille par thèmes |
| `/blog/[slug]` | Article (SSG, `generateStaticParams`) |
| `/blog/categorie/[cat]` | Page-catégorie — maillage interne (commit `91ff393`) |

### 7.3 Composants MDX (`components/blog/`)
`VideoCarousel`, `ProofCarousel`, `ProofImage`, `ClientVideo`, `ComparisonTable`, `FAQ`, `DirectAnswer`, `GeoTabs`, `HonestList`, `Timeline`, `TableOfContents`, `ReadingProgress`, `CTABox`, `BlogGrid`.

> **Règle éditoriale** : dans les articles, les vidéos et captures passent **toujours** par `<VideoCarousel>` / `<ProofCarousel>`, jamais en élément isolé.

### 7.4 SEO
- [app/sitemap.ts](app/sitemap.ts) : pages statiques + catégories non vides + 326 articles
- [app/robots.ts](app/robots.ts) : bloque `/api/`, `/dashboard/`, `/avis-preview`, les pages d'auth et **`/formation-basic`** (espace membre, commit `7dd45b1`)
- Canonicalisation `www` en 301 par le middleware
- JSON-LD et og-image dans [app/layout.tsx](app/layout.tsx)
- [next.config.ts](next.config.ts) porte une **redirection permanente** d'un ancien slug et surtout `outputFileTracingExcludes: {"*": ["public/**"]}` — sans quoi les ~400 Mo de covers étaient embarqués dans chaque fonction serverless et dépassaient la limite Vercel de 300 Mo

### 7.5 Production des articles
Deux commandes Claude Code : [.claude/commands/lot-articles.md](.claude/commands/lot-articles.md) et [.claude/commands/production-auto.md](.claude/commands/production-auto.md). Plans éditoriaux en CSV dans `content/`. Contrat qualité : [GUIDE-REDACTION.md](content/editorial/GUIDE-REDACTION.md).

---

## 8. Système de liens d'accès

> Construit le 07/08/2026 pour débloquer un client payant dont la session n'atteignait jamais le serveur (`reason=no-auth` sur deux téléphones, y compris en navigation privée), alors que ses identifiants fonctionnaient ailleurs.

### 8.1 Principe
Une URL porteuse d'un token ouvre la formation **sans compte, sans mot de passe et sans cookie**. Le token est lu **dans l'URL à chaque requête** et nulle part ailleurs — poser un cookie après validation aurait fait dépendre l'accès du mécanisme précisément défaillant.

### 8.2 Chaîne complète
| Étage | Fichier | Rôle |
|---|---|---|
| Validation edge | [lib/access-links.ts](lib/access-links.ts) | `fetch` REST direct (pas de supabase-js : le middleware tourne sur edge), **sans cache** — d'où une désactivation immédiate sans redéploiement. Toute erreur réseau **refuse** l'accès |
| Liste blanche | idem | `/dashboard/phases` et `/dashboard/phases/*` **uniquement**, évaluée **avant** l'appel à la base. Refus par défaut : toute page ajoutée ensuite est hors de portée |
| Middleware | [utils/supabase/middleware.ts](utils/supabase/middleware.ts) | Branche insérée avant la redirection `/login`. Journalise et compte via `event.waitUntil()`, hors du chemin de réponse |
| Comptage | idem | Uniquement sur `sec-fetch-dest: document` — les navigations RSC repasseraient sinon par là et rendraient `uses_count` ininterprétable |
| Gate client | [app/api/check-subscription/route.ts](app/api/check-subscription/route.ts) | Sans session mais avec token valide → `hasAccess:true`, plan synthétique `ecommerce` |
| Progression | [app/api/progress/route.ts](app/api/progress/route.ts) | Résout un « owner » : session → `lesson_progress`, lien → `access_link_progress`. **La session prime toujours** |
| Propagation | [components/AccessLinkKeeper.tsx](components/AccessLinkKeeper.tsx) | Voir 8.3 |
| Rattrapage | [components/AccessLinkRecovery.tsx](components/AccessLinkRecovery.tsx) | Sur `/login`, renvoie dans la formation si un token est mémorisé **et** qu'on vient de `/dashboard` |

### 8.3 Propagation du token — le point non évident
Sans cookie, une navigation ne transporte le token que si l'URL le porte. Or les liens internes pointent vers `/dashboard/...` « nu ».

**La réécriture de l'attribut `href` ne suffit pas** : le `<Link>` de Next navigue avec le `href` de ses **props React**, jamais avec l'attribut du DOM. La première implémentation réécrivait l'attribut et échouait donc silencieusement — clic → Next partait sans token → middleware refusait → rattrapage → retour au point de départ, soit un clic sans effet visible.

La version actuelle combine deux mécanismes :
1. **Interception du clic en phase de capture sur `document`**, avant React, avec `stopPropagation()` puis navigation complète (`location.assign`) token compris. Ctrl/Cmd/Shift-clic, clic milieu, `target="_blank"`, liens externes et boutons ne sont **pas** interceptés.
2. **Réécriture des `href`** conservée pour le clic milieu, le nouvel onglet et le « copier l'adresse du lien ».

Une copie du token est gardée en `sessionStorage` — **ce n'est pas une session** : elle n'est jamais envoyée au serveur et ne sert qu'à reconstruire l'URL si un lien échappe à la propagation. Le middleware pose `?access=denied` sur un token refusé, ce qui casse la boucle de rattrapage.

> **Conséquence assumée** : pour un porteur de lien, la navigation est un **rechargement de page complet**, pas une transition SPA. Chaque URL est donc réellement revalidée.

### 8.4 Administration
Section « Liens d'accès » en tête de `/dashboard/admin` ([AccessLinksSection.tsx](app/(dashboard)/dashboard/admin/AccessLinksSection.tsx)) : création (label + 7/30/90/365 jours), tableau des ouvertures, **nombre d'IP distinctes** (surligné dès 2 — signal qu'un lien circule), copie du lien, désactivation/réactivation immédiate.

### 8.5 Limites connues
- Le lien est un **identifiant au porteur** : quiconque l'a entre. C'est le prix de « il clique et il est dedans ». Contrepoids : expiration, coupure immédiate, journal d'IP.
- Le token est stocké **en clair** en base (choix assumé pour permettre le bouton « Copier le lien »).
- La progression d'un porteur de lien **n'est pas transférée** s'il obtient plus tard un vrai compte.

---

## 9. Autres fonctionnalités

### 9.1 Promo cinématique (homepage)
Compteur de places (réel `promo_places_prises` + simulé par intervalle), countdown, compteur de viewers aléatoire, ticker de noms simulés. Auto-fermeture quand le timer expire ou que les places sont pleines. Config dans `live_dashboard_state.data.settings`, pilotée depuis l'admin, lue par la homepage en polling **60 s** ([app/page.tsx:39](app/page.tsx#L39)).

### 9.2 Dashboard ventes en direct (`/dashboard/ventes-live`)
Compteurs, liste des ventes, stats agrégées, graphique de cumul. APIs : `GET /api/live/data` (public), `POST /api/live/update` (header `x-api-secret`), `GET /api/live/reset` et `/api/live/fix-date` (**désormais protégés par session admin**).

### 9.3 Module Focus (`/dashboard/focus`)
Minuteur de concentration avec tâches et sous-tâches, page de statistiques. Visible dans la sidebar **admin uniquement**.

### 9.4 Diagnostic v2 (180 questions)
Questionnaire long ([lib/diagnostic-questions.ts](lib/diagnostic-questions.ts), 335 l.) accessible via `/dashboard/coaching/questionnaire`, sauvegarde de la position (`current_block`/`current_question`), puis rédaction admin d'un bilan et d'un plan en Markdown, publication par étapes, et suivi de projet (`project_steps`). Coexiste avec le parcours v1 en 5 étapes.

### 9.5 Support et communication
Pas de chat in-app. Support externe via **Telegram** (canal général sur la homepage, compte direct dans les phases, masqué pour le plan `ecommerce_basic`).

### 9.6 Non implémenté
Recherche · notifications in-app / push / SMS · codes promo consommables (`LEX-XXXXX` généré mais jamais lu par Stripe) · affiliation (tables `affiliates`/`commissions` dormantes, aucune UI) · i18n (arabe RTL uniquement) · toggle de thème (sombre permanent) · audit a11y systématique.

---

## 10. Routes et endpoints

### 10.1 Pages
| URL | Accès |
|---|---|
| `/` | Public |
| `/formation`, `/formation-basic`, `/diagnostic` | Public (pages de vente) |
| `/a-propos` | Public |
| `/blog`, `/blog/[slug]`, `/blog/categorie/[cat]` | Public |
| `/avis-preview` | Public (exclu de l'index) |
| `/legal/terms` | Public |
| `/login`, `/register`, `/forgot-password`, `/payment-success` | Public (redirection vers `/dashboard` si déjà connecté) |
| `/auth/verify`, `/auth/auth-code-error` | Public |
| `/dashboard` | Session requise |
| `/dashboard/phases`, `/dashboard/phases/[id]` | Session **ou lien d'accès valide** |
| `/dashboard/coaching`, `/coaching/questionnaire` | Session |
| `/dashboard/focus`, `/focus/stats` | Session (admin en pratique) |
| `/dashboard/admin`, `/dashboard/ventes-live` | Session admin |
| `/dashboard/settings`, `/dashboard/reset-password` | Session |

**Middleware** — routes publiques : `/` (comparé **exactement**), `/login`, `/register`, `/reset-password`, `/payment-success`, `/api/webhooks/stripe`, `/formation`, `/diagnostic`, `/blog`.
- `/dashboard/*` sans session **et sans token valide** → `/login`
- `/login` avec session → `/dashboard`
- ⚠️ `/formation-basic` n'est pas listé explicitement : il passe via le `startsWith('/formation')`. Fragile si on renomme.

### 10.2 Endpoints
**Server Actions** ([actions.ts](app/(auth)/actions.ts)) : `login`, `signup`, `logout`, `resetPassword`, `updatePassword`.

| Méthode | URL | Auth |
|---|---|---|
| GET | `/api/check-subscription` | session **ou** `?access=` — réponses en `no-store` strict |
| GET/POST | `/api/progress` | session **ou** `?access=` |
| GET | `/api/verify-payment?email=…` | aucune — **rate-limité** (5 req/min/IP, en mémoire) |
| GET/POST/PATCH | `/api/coaching-profile` | session |
| GET | `/api/bookings` | aucune (renvoie des ISO de créneaux) |
| POST | `/api/bookings` | session + plan diagnostic |
| GET/POST/PATCH | `/api/diagnostic-submission`, `/complete` | session |
| GET/POST | `/api/focus`, `/focus/tasks`, `/focus/subtasks`, `/focus/stats` | session |
| GET | `/api/live/data` | aucune (par conception) |
| POST | `/api/live/update` | header `x-api-secret` ⚠️ valeur de repli en dur (§19) |
| GET | `/api/live/reset`, `/api/live/fix-date` | **session admin** |
| POST | `/api/webhooks/stripe` | signature Stripe |
| GET | `/api/admin/settings` | **aucune** (la homepage en a besoin) |
| POST | `/api/admin/settings` | session admin |
| — | `/api/admin/access-links`, `/[id]` | session admin (`requireAdmin`) |
| — | `/api/admin/create-student` | session admin (`requireAdmin`) |
| — | `/api/admin/availability`, `/blocked-slots`, `/diagnostic`, `/diagnostic-submissions`, `/[userId]` | session admin |

---

## 11. Interface d'administration

`/dashboard/admin` — 1716 lignes. Le contrôle d'accès de la **page** est côté client (`useEffect`), mais **toutes les APIs sous-jacentes vérifient la session côté serveur**.

Sections : statistiques · réglages du site (infos société, ouverture des inscriptions) · promo · **liens d'accès** (§8.4) · création manuelle d'élève (mot de passe généré) · table des membres et abonnements (activer/désactiver) · calendrier de disponibilités et créneaux bloqués · réservations · clients coaching · diagnostic v1 (modale) · **diagnostic v2** ([DiagnosticSubmissionsSection.tsx](app/(dashboard)/dashboard/admin/DiagnosticSubmissionsSection.tsx), 637 l. : statuts, rédaction Markdown du bilan et du plan, publication, étapes de projet).

⚠️ **Pas de gestion de cours en admin** : modifier une leçon exige un déploiement.

---

## 12. Composants frontend

- **`app/components/`** — réduit à 4 fichiers : `blog/BlogCTA.tsx`, `dashboard/{Card,Sidebar,StepCard}.tsx`. Tous les composants de l'ancienne homepage ont été supprimés.
- **`components/`** — `AccessDebugFooter`, `AccessLinkKeeper`, `AccessLinkRecovery` · `blog/` (14 composants MDX) · `sales/SalesSections` · `testimonials/` (`ProofGallery`, `VideoCarousel`, `Lightbox`, `Flag`)
- **Hooks** : `useProgress`, `useFocusTasks`, `useFocusSubtasks`
- **Layouts** : racine (RTL, GA4, JSON-LD), `(auth)` (centré), `(dashboard)` (Sidebar + AccessLinkKeeper sous `<Suspense>`), plus des layouts dédiés pour `/formation`, `/formation-basic`, `/diagnostic`

---

## 13. Services backend

| Fichier | Rôle |
|---|---|
| [lib/access-links.ts](lib/access-links.ts) | Validation edge-safe des tokens, liste blanche, génération, journalisation |
| [lib/access-token-client.ts](lib/access-token-client.ts) | Lecture du token dans l'URL côté client (`withAccessToken`) |
| [lib/admin-auth.ts](lib/admin-auth.ts) | `requireAdmin()` — **le seul contrôle admin non contournable** |
| [lib/blog.ts](lib/blog.ts) | Lecture MDX, catégories, slugs, articles liés, sitemap |
| [lib/check-subscription.ts](lib/check-subscription.ts) | Helper client du gate d'abonnement |
| [lib/diagnostic-questions.ts](lib/diagnostic-questions.ts) | Les 180 questions du diagnostic v2 |
| [lib/resend.ts](lib/resend.ts) | Emails d'activation et de confirmation |
| [lib/telegram.ts](lib/telegram.ts) | Notifications Telegram |
| [lib/supabaseAdmin.ts](lib/supabaseAdmin.ts) | Singleton service-role — **sous-utilisé**, la plupart des routes recréent leur client |

**Middlewares** : un seul, `middleware.ts` → `updateSession()`.
**Validators** : aucun schéma (pas de Zod) — checks `if (!field)` manuels.
**Jobs / cron** : aucun.
**Webhooks** : Stripe uniquement.
**Scripts** (`scripts/`) : `.mjs` pour le blog et les plans éditoriaux (`check-plan`, `set-statut`, `migrate-vague5`, `diag-acces`), `.py` pour les visuels (`generate-covers`, `generate-cards`, `generate-logo`, `make-sales-thumbs`).

---

## 14. Sécurité

### 14.1 Authentification
Supabase Auth + cookies via `@supabase/ssr`, PKCE pour le reset.

### 14.2 Autorisation
Email admin **hardcodé** dans une dizaine de fichiers TS et dans les policies SQL. Aucune table `roles`. Changer d'admin = grep + replace + redéploiement + migration SQL.

Depuis août 2026, [lib/admin-auth.ts](lib/admin-auth.ts) centralise le contrôle par session. **Les 9 routes `/api/admin/*` vérifient toutes la session côté serveur** (3 via `requireAdmin()`, 6 via un `verifyAdmin()` local équivalent).

### 14.3 Protection des routes ✅ *(corrigée le 07/08/2026)*
> ⚠️ **La version précédente de ce document décrivait `/dashboard` comme protégé. Ce n'était pas le cas.**
>
> `publicRoutes` était testé avec `startsWith` sur une liste contenant `'/'` — or **tout** chemin commence par `/`. Toutes les routes étaient donc considérées publiques et la protection de `/dashboard` n'était **jamais atteinte** : la formation entière était lisible sans aucun compte (vérifié en production : `GET /dashboard/phases/1` → 200 avec le contenu des leçons).
>
> Corrigé au commit `2eee04e` : `'/'` est désormais comparé **exactement**. Vérifié en production : `/dashboard/phases`, `/phases/1`, `/admin` et `/coaching` renvoient tous `307 → /login` sans session.

État actuel :
- **Middleware** : session requise pour `/dashboard/*`, sauf lien d'accès valide sur la liste blanche
- **Backend** : chaque route admin revérifie la session
- **Frontend** : gate d'abonnement client sur `/dashboard/phases`, `/coaching`, `/coaching/questionnaire`

### 14.4 Validation des inputs
Checks manuels côté serveur, contraintes HTML côté client. **Pas de validation typée** (Zod absent).

### 14.5 CSRF / XSS / SQL injection
CSRF couvert par les Server Actions et le cookie + contrôle serveur. XSS : React échappe par défaut, pas de `dangerouslySetInnerHTML` dans les zones sensibles. SQL injection : aucune query brute, tout passe par le client Supabase paramétré.

### 14.6 Rate limiting
Quasi absent. **Seule exception** : `/api/verify-payment` (5 req/min/IP, en mémoire — donc par instance serverless, la limite réelle est plus haute sous fan-out). `/login`, `/register` et les routes admin n'ont aucune limite.

### 14.7 Stockage de secrets
`.env.local` exclu par `.gitignore`. Voir §19.

---

## 15. Configuration

### 15.1 Variables d'environnement (noms uniquement)
| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client browser & server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client browser |
| `SUPABASE_URL` | Même cible, utilisée par une partie des routes serveur |
| `SUPABASE_SERVICE_ROLE_KEY` 🔐 | Bypass RLS — utilisée par le middleware et toutes les routes serveur |
| `STRIPE_SECRET_KEY` 🔐 | Stripe |
| `STRIPE_WEBHOOK_SECRET` 🔐 | Vérification de signature |
| `RESEND_API_KEY` 🔐 | Email transactionnel |
| `RESEND_FROM_EMAIL` | Expéditeur |
| `API_SECRET_LIVE_UPDATE` 🔐 | Header `x-api-secret` de `/api/live/update` |

> **Aucune valeur n'est reproduite dans ce document.** Deux incohérences de nommage à connaître : `SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_URL` coexistent et pointent au même endroit, mais les fichiers ne lisent pas tous la même.

### 15.2 Fichiers de configuration
| Fichier | Rôle |
|---|---|
| [next.config.ts](next.config.ts) | `outputFileTracingExcludes` sur `public/**` (limite Vercel 300 Mo) + une redirection permanente de slug |
| [app/globals.css](app/globals.css) | ⭐ **La vraie config Tailwind v4** (`@plugin`, `@theme`) |
| `tailwind.config.ts` | ⚠️ **Inerte** — non chargé en v4, conservé par inertie |
| [tsconfig.json](tsconfig.json), [postcss.config.mjs](postcss.config.mjs), [eslint.config.mjs](eslint.config.mjs) | Standard Next |

### 15.3 Dev / staging / prod
Aucune distinction explicite dans le dépôt : pas de `.env.development` / `.env.production`. Les variables de production sont configurées **dans le dashboard Vercel** et ne sont pas consultables depuis le dépôt — `.env.local` ne concerne que le poste de développement.

---

## 16. Tests

❌ **Aucun test automatisé** : pas de `__tests__/`, pas de `*.test.ts`, aucun runner en dépendances.
Linter : `npm run lint` (ESLint). Pas de Prettier.
La vérification avant déploiement repose sur `npx tsc --noEmit` + `npx next build` + des tests manuels en production via `curl`.

---

## 17. Déploiement

```bash
npm install
# Configurer .env.local (voir §15.1)
npm run dev      # http://localhost:3000
npm run build    # next build
npm run start    # prod local
```

- **Vercel**, déploiement automatique sur push `main`. Aucun Dockerfile, aucun `vercel.json`, aucun GitHub Actions.
- **Migrations** : pas de Supabase CLI (`supabase/config.toml` absent). Les SQL de `supabase/migrations/` sont à appliquer **manuellement** dans le SQL Editor Supabase, dans l'ordre du nom de fichier. C'est une étape facile à oublier : le code déployé qui attend une table absente échoue en 500 (silencieusement pour la progression, qui est non bloquante).
- **Webhook Stripe en local** : voir [GUIDE_STRIPE.md](GUIDE_STRIPE.md).
- **Vérifier qu'un déploiement est en ligne** : `GET /api/check-subscription` renvoie `build` (SHA court), `env` et la référence Supabase à chaque réponse, y compris sans session.

---

## 18. Historique récent

### Chronologie des grands chantiers
| Période | Chantier |
|---|---|
| Janvier 2026 | Lancement LEXMO, système de paiement, live dashboard |
| Mars-avril 2026 | Coaching v1 (5 étapes), plans e-commerce, renommage **ECOMY** |
| 26-27 avril 2026 | `lesson_progress` (suivi de progression réel), module Focus |
| 9 mai 2026 | **Diagnostic v2** (180 questions) |
| Mai-juillet 2026 | **Blog SEO** : production des 326 articles par lots automatisés |
| Juillet 2026 | Refonte accueil, visuels de vente, logo, 326 couvertures |
| Début août 2026 | SEO : canonicalisation `www`, `/formation-basic` exclu de l'index, pages-catégories |
| 6-7 août 2026 | **Liens d'accès** + fermeture de deux failles de sécurité |

### 10 derniers commits
```
2a63df7  fix(access): navigation cassee pour les porteurs de lien + progression
2eee04e  feat(access): systeme de liens d'acces + fermeture de deux failles
915c8bc  fix(access): anti-cache sur check-subscription + marqueur diagnostic
91ff393  feat(seo): pages-categories + maillage interne blog
7dd45b1  fix(seo): bloque /formation-basic dans robots.txt
bd3e855  fix(blog): aligne slug et nom de fichier
81f6995  fix(seo): canonicalise le domaine sur www.ecomy.ai
494c934  revert(brand): retire le logo visible des pages
98ac646  feat(brand): logo ECOMY — favicon, headers, og-image, JSON-LD
4aaec46  fix(diagnostic): image hero non rognee sur mobile
```

---

## 19. Alertes de sécurité

### 19.1 🔴 `/dashboard/phases/[id]` n'a aucun contrôle d'abonnement — **ouvert**
La page de leçon ([phases/[id]/page.tsx:38-41](app/(dashboard)/dashboard/phases/[id]/page.tsx#L38-L41)) ne lit `checkUserSubscription()` que pour décider de l'affichage du bloc Telegram. **Tout utilisateur connecté, même sans abonnement actif, lit l'intégralité de la formation en tapant l'URL directement.** Le gate ne protège que la page d'index. Le correctif du middleware ne referme pas cette faille.

### 19.2 🟠 Secret de repli en dur pour `/api/live/update` — **ouvert**
[app/api/live/update/route.ts:10](app/api/live/update/route.ts#L10) : si `API_SECRET_LIVE_UPDATE` est absente, le code retombe sur une **valeur codée en dur dans le fichier** (donc dans le dépôt). Quiconque lit le code peut écrire dans `live_dashboard_state`. Il faut retirer le repli et échouer si la variable manque.

### 19.3 🟠 Fallback `plan='spark'` dans le webhook Stripe — **ouvert**
[webhooks/stripe/route.ts:112](app/api/webhooks/stripe/route.ts#L112) : si l'insert avec `plan='ecommerce'` échoue à cause de la CHECK constraint, le code retombe sur `'spark'`. Cela masque un bug réel et pollue la base avec des plans faux. À supprimer une fois la contrainte nettoyée.

### 19.4 🟡 `GET /api/verify-payment?email=…` — énumération
Sans authentification : permet de tester si un email a payé (utile pour du phishing ciblé). Atténué par un rate limit de 5 req/min/IP, mais celui-ci est **en mémoire par instance**, donc contournable par fan-out serverless.

### 19.5 🟡 Modèle d'autorisation fragile
Email admin hardcodé en une dizaine d'endroits (TS + SQL). Aucune table `roles`. Perte ou compromission de cet email = reprise de contrôle par grep, remplacement, redéploiement et migration SQL.

### 19.6 🟡 Logs verbeux
Le webhook Stripe journalise emails, IDs de session et montants. `[check-subscription]` et `[access-link]` journalisent emails, labels et IP. Accessible à quiconque a accès aux logs Vercel — à durcir si conformité RGPD stricte.

### 19.7 ✅ Fermées le 07/08/2026
- **`/dashboard` non protégé** (formation lisible sans compte) — voir §14.3
- **`create-student` acceptait un admin auto-déclaré** : la route comparait un champ `adminEmail` lu **dans le corps de la requête**, valeur choisie par l'appelant. N'importe qui pouvait créer un élève avec un abonnement actif. Remplacé par un contrôle de session. Vérifié en production : requête forgée → **401**.
- **`/api/live/reset` et `/api/live/fix-date`**, signalées ouvertes en avril, sont désormais protégées par session admin.
- **`.env.local`** : correctement exclu par `.gitignore`. Reste à vérifier une fois l'historique complet (`git log --all --full-history -- .env.local`) ; tout secret ayant fuité même brièvement doit être rotaté.

---

## 20. 📍 État au 22/08/2026

### ✅ Terminé et vérifié en production
| Domaine | État |
|---|---|
| Homepage, pages de vente (497/197/97), `/a-propos` | Fonctionnelles |
| Paiement Stripe + webhook + email d'activation | Fonctionnel en production (paiements réels confirmés par le propriétaire) |
| Inscription / connexion / reset (PKCE) | Fonctionnels |
| Formation : 26 phases, 136 leçons, 84 vidéos, quiz | Complète |
| **Suivi de progression** (auto-complétion vidéo à 90 %, temps passé, quiz) | Fonctionnel |
| **Blog SEO** : 326 articles, 11 pages-catégories, sitemap, robots, canonicalisation `www` | Complet |
| Coaching v1 (5 étapes) + **Diagnostic v2** (180 questions) | Fonctionnels |
| Module Focus | Fonctionnel |
| Admin : membres, promo, créneaux, diagnostics, liens d'accès | Fonctionnel |
| **Liens d'accès** : middleware, périmètre, propagation, désactivation immédiate, journal d'IP | Déployé et vérifié |
| **Protection de `/dashboard`** | Corrigée et vérifiée (307 → `/login`) |

### 🟡 En cours / à confirmer
- **Le parcours complet d'un porteur de lien n'a pas encore été validé de bout en bout par un humain** : ouvrir le lien → cliquer une phase → cliquer un chapitre → lancer une vidéo. Les étages ont été vérifiés séparément (serveur, HTML, interception de clic testée sous jsdom, 12/12), mais pas la chaîne complète dans un vrai navigateur. **Faisceau d'indices favorable relevé en base le 22/08** : 4 liens créés, 120 usages journalisés et 9 lignes de progression — des leçons ont donc bien été ouvertes *et* cochées par un porteur de lien. Cela ne remplace pas une validation humaine du parcours.
- **Migration `20260807_access_link_progress.sql`** : non appliquée au 07/08, ✅ **appliquée depuis** — vérifié en base le 22/08 (la table existe et contient 9 lignes).

### 🔴 Cassé / incorrect
- **`app/sitemap.ts` déclare `/legal/privacy` et `/legal/refund`**, qui **n'existent plus** (seul `/legal/terms` subsiste). Le sitemap soumet donc deux URLs en 404 aux moteurs — soit recréer les pages, soit les retirer du sitemap.
- **`/dashboard/phases/[id]` sans contrôle d'abonnement** (§19.1).

### 📉 Dette technique connue
| Sujet | Détail |
|---|---|
| `LessonContentRenderer.tsx` | **7382 lignes** — monolithe ingérable, à éclater par phase |
| `admin/page.tsx` | **1716 lignes** — à découper en sections comme l'a été le diagnostic v2 |
| Clients Supabase admin | Recréés à la volée dans 10+ fichiers ; [lib/supabaseAdmin.ts](lib/supabaseAdmin.ts) existe mais reste sous-utilisé |
| `SUPABASE_URL` vs `NEXT_PUBLIC_SUPABASE_URL` | Deux variables pour la même cible, usage incohérent selon les fichiers |
| CHECK `user_subscriptions.plan` | Autorise encore `spark`, `emperor`, `legend`. ✅ Vérifié en base le 22/08 : **8 lignes portent `plan='spark'`**, contre 165 `ecommerce`, 21 `ecommerce_basic` et 4 `diagnostic`. **Origine établie — ce n'est PAS le fallback du §19.3** : le commit `369152e` (09/03/2026) écrivait `plan: 'spark'` **en dur** dans le webhook, jusqu'à sa correction par `279cc90` (25/03/2026, « rename spark to ecommerce »). Les 8 lignes sont datées du 9 au 25 mars et tombent toutes dans cette fenêtre : ce sont les lignes normales de l'époque à produit unique. Le fallback du §19.3, ajouté le 26/04, **n'a jamais tiré** — il produirait des lignes postérieures au 19/04, et il n'en existe aucune. Sans conséquence d'accès : `spark` n'est traité comme un plan inférieur nulle part et donne les mêmes droits que `ecommerce` |
| `tailwind.config.ts` | Inerte depuis le passage en v4, mais toujours présent : piège pour la prochaine session |
| `availability_slots` | Table jamais lue — `/api/bookings` génère 9h-19h en dur |
| Tables legacy | `progress`, `user_progress`, `user_phase_progress`, `affiliates`, `commissions`, `phases`, `modules`, `tasks`, `lessons` |
| Aucun test automatisé | Toute vérification est manuelle |
| Aucune migration automatisée | Étape manuelle facile à oublier entre push et mise en service |
| `zustand` | Dépendance **totalement inutilisée** (zéro occurrence dans le code) — désinstallable |
| Contenu non éditable | Modifier une leçon exige un déploiement |
| Message français résiduel | « Erreur lors de la mise à jour du mot de passe. » dans une UI 100 % arabe |
| GA4 partout | Chargé aussi sur `/dashboard/*`, non filtré |

### 🧭 Pour la prochaine session
1. **Le contenu de cours est en TypeScript hardcodé**, le blog en MDX — rien n'est en base.
2. **`tailwind.config.ts` ne sert à rien** : modifier [app/globals.css](app/globals.css).
3. **`youtubeEmbed()` découpe sur `v=`** : toujours lui passer une URL `watch?v=<ID>`.
4. **Deux voies d'accès coexistent** : session cookie et lien d'accès par URL. Toute modification du middleware ou du gate doit préserver les deux.
5. **Ne jamais faire dépendre un lien d'accès d'un cookie** — c'est précisément le mécanisme défaillant qui a motivé sa création.
6. **Le `<Link>` de Next navigue avec ses props, pas avec l'attribut `href` du DOM.** Réécrire l'attribut ne change rien à la navigation client.
7. **Vérifier qu'une migration a été appliquée** avant de conclure qu'une fonctionnalité est cassée.
8. **Le contrôle admin par `adminEmail` dans le corps d'une requête ne prouve rien.** Utiliser [lib/admin-auth.ts](lib/admin-auth.ts).
9. **`/api/check-subscription` est la sonde de déploiement** : elle renvoie `build`, `env` et la référence Supabase sans authentification.
10. **Ce document n'est pas une source de vérité automatique** — la version d'avril affirmait que `/dashboard` était protégé alors qu'il ne l'était pas. Vérifier contre le code.

---

*Mis à jour le 22 août 2026 par relecture complète du codebase, section par section, contre le code réellement déployé (commit `2a63df7`).*
