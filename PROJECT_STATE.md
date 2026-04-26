# 📊 RAPPORT D'ÉTAT COMPLET — ECOMY (ex-LEXMO)

> **Document généré le 26/04/2026** — destiné à une instance Claude sans contexte préalable.
> Répertoire racine : `c:\Users\user\Desktop\lexmo-saas-ai\`
> Branche Git active : `main` (clean)

---

## 📑 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack technique complète](#2-stack-technique-complète)
3. [Architecture](#3-architecture)
4. [Modèle de données — entités](#4-modèle-de-données--entités)
5. [Espace membre](#5-espace-membre)
6. [Système de cours](#6-système-de-cours)
7. [Autres fonctionnalités](#7-autres-fonctionnalités)
8. [Routes et endpoints](#8-routes-et-endpoints)
9. [Interface d'administration](#9-interface-dadministration)
10. [Composants frontend](#10-composants-frontend)
11. [Services backend](#11-services-backend)
12. [Sécurité](#12-sécurité)
13. [Configuration](#13-configuration)
14. [Tests](#14-tests)
15. [Déploiement](#15-déploiement)
16. [Problèmes connus & dette technique](#16-problèmes-connus--dette-technique)
17. [Historique récent](#17-historique-récent)
18. [État de chaque page/fonctionnalité](#18-état-de-chaque-pagefonctionnalité)
19. [⚠️ Alertes de sécurité critiques](#19-alertes-de-sécurité-critiques)

---

## 1. Vue d'ensemble

### Identité
- **Nom commercial actuel** : `ECOMY` (logo en `font-orbitron` couleur `#C5A04E` doré)
- **Domaine de production** : `ecomy.ai` (migré depuis `lexmo.ai` au commit `21aaaa5`)
- **Nom du repo / package** : `temp_app` (cf. [package.json:2](package.json#L2)) — le nom du dossier `lexmo-saas-ai` est historique
- **Email admin / contact** : `academyfrance75@gmail.com` (hardcodé partout, pas via env var)
- **Email d'envoi (Resend)** : `noreply@lexmo.ai` ⚠️ (pas encore migré vers `ecomy.ai`, voir section 16)

### Type & objectif
Plateforme **e-learning + coaching 1-to-1 + e-commerce de formations**, en **arabe (RTL)** principalement, ciblant le **monde arabophone (MENA + diaspora européenne)**. Le contenu enseigne le **dropshipping / e-commerce Shopify + publicité Facebook & TikTok** sur **26 phases** et **plus de 142 leçons vidéo**.

### Public cible
- Débutants arabophones intéressés par le e-commerce / dropshipping
- Pays cibles principaux (vus dans les sélecteurs et noms simulés) : Maroc, Algérie, Tunisie, Arabie Saoudite, Émirats, Koweït, Qatar, Bahreïn, Oman, Égypte + diaspora (France, Belgique, Allemagne, Italie, Espagne, UK, Pays-Bas)

### État global du projet
- **Production active** (Stripe en mode TEST cf. clé `sk_test_…` dans `.env.local`)
- Dernier commit `9a2bfe3` (split du palier 197€ sur sa propre landing)
- Le dossier `.next/` est présent → l'application a été buildée localement
- Pas d'autres branches ; pas de remote configuré visible dans les commits récents
- Working tree propre

### Modèle économique
3 offres payantes one-shot via **Stripe Checkout** (paiement unique, pas d'abonnement récurrent) :

| Offre | Prix | Plan DB | Détection | Description |
|---|---|---|---|---|
| **Formation E-commerce complète** | **497 €** (barré 1970 €) | `ecommerce` | Montant `49700` cents | Toute la formation + accompagnement Telegram (`t.me/ecomyyy`) |
| **Formation E-commerce sans accompagnement** | **197 €** (barré 970 €) | `ecommerce_basic` | Montant `19700` cents | Auto-apprentissage : pas de support Telegram |
| **Diagnostic Business** | **97 €** (barré 970 €) | `diagnostic` | Montant `9700` cents | Session 45 min Google Meet + plan d'action écrit |

Liens Stripe Checkout fixes (vus dans le code) :
- 197€ : `https://buy.stripe.com/9B63cvbhe4bLay17gDgfu06` ([formation-basic/page.tsx:7](app/formation-basic/page.tsx#L7))
- 97€ : `https://buy.stripe.com/9B68wP5WU7nX5dH7gDgfu05` ([diagnostic/page.tsx:7](app/diagnostic/page.tsx#L7))
- 497€ : à confirmer dans `app/formation/page.tsx`

**Bonus affilié visible** : bannière Shopify (`shopify.pxf.io/WO4qKJ`) sur la homepage.

---

## 2. Stack technique complète

### Frontend
- **Framework** : **Next.js 16.1.3** (App Router, RSC + Server Actions)
- **React 19.2.3** + **React-DOM 19.2.3**
- **TypeScript 5** (strict mode présumé via tsconfig)
- **Tailwind CSS v4** + plugin `@tailwindcss/typography` + `@tailwindcss/postcss`
- **clsx** + **tailwind-merge** — composition de classes
- **Framer Motion 12.x** — animations
- **lucide-react 0.562** — icônes
- **react-fast-marquee**, **react-countup** — composants UI animés
- **chart.js + react-chartjs-2** — graphiques (dashboard ventes-live)
- **react-markdown + remark-gfm** + **react-syntax-highlighter** — rendu Markdown
- **flag-icons** — drapeaux pays
- **zustand 5.0.10** — state management (présent en dépendance, peu utilisé en pratique : la majorité du state est `useState` local)
- Polices : **Cairo** (arabe), **Orbitron** (logo) via `next/font/google`

### Backend (in-process Next.js)
- **Next.js Route Handlers** (`app/api/**/route.ts`) + **Server Actions** (`app/(auth)/actions.ts`, `app/actions/course.ts`)
- Aucun backend dédié, tout est sur Vercel-compatible

### Base de données
- **Supabase (Postgres managé)** — projet `ruhkuamtmgzjkcdyrpel.supabase.co`
- Pas d'ORM : utilisation directe de `@supabase/supabase-js@2.90` et `@supabase/ssr@0.8`
- **RLS (Row Level Security)** activé sur quasi toutes les tables, avec politiques admin par email hardcodé

### Authentification
- **Supabase Auth** (e-mail + mot de passe + magic link)
- PKCE flow pour reset password ([app/(auth)/forgot-password/page.tsx:23](app/(auth)/forgot-password/page.tsx#L23))
- Sessions en cookies via `@supabase/ssr` (cookie helpers dans `utils/supabase/`)
- **Pas d'OAuth** (Google, Facebook…) configuré
- Vérification d'admin **par email hardcodé** : `academyfrance75@gmail.com`

### Stockage de fichiers
- **Pas de storage Supabase utilisé** — toutes les vidéos sont des **iFrames YouTube** (`youtube-nocookie.com`)
- Images statiques dans `public/images/` (avatars élèves, screenshots de gains, bannières) — totalement statiques
- Aucun upload utilisateur

### Paiement
- **Stripe** (`stripe@20.2.0`) en mode **TEST**
- Webhook `POST /api/webhooks/stripe` traite `checkout.session.completed`
- Les liens Checkout sont **pré-configurés côté Stripe** (Payment Links), pas créés dynamiquement par l'app

### Email / notifications
- **Resend** (`resend@6.9.3`)
- Templates HTML inline dans [lib/resend.ts](lib/resend.ts)
- 2 emails transactionnels : `sendActivationEmail` (post-paiement) et `sendBookingConfirmationEmail` (réservation Google Meet)
- Pas de notifications in-app, pas de push, pas de SMS

### Hébergement
- **Conçu pour Vercel** (cf. README, `next.config.ts` minimal)
- Aucun fichier de CI/CD, Dockerfile, ni manifeste de déploiement custom

### Analytics
- **Google Analytics 4** : ID `G-P3LDE3ME0N` via `@next/third-parties/google` ([app/layout.tsx:35](app/layout.tsx#L35))

### Dépendances importantes (rôle)
| Package | Rôle |
|---|---|
| `@next/third-parties` | Intégration GA4 |
| `@radix-ui/react-checkbox` | Primitive accessible (peu utilisée) |
| `@supabase/ssr` | Cookies Supabase pour SSR |
| `@supabase/supabase-js` | Client Supabase |
| `chart.js` + `react-chartjs-2` | Graphique sur `/dashboard/ventes-live` |
| `framer-motion` | Animations Hero, etc. |
| `react-fast-marquee` | Bandeau défilant |
| `react-syntax-highlighter` | Code formaté dans certaines leçons |
| `resend` | Email transactionnel |
| `stripe` | Webhook signature verify + types |
| `tsx` (devDep) | Lance les scripts TS dans `scripts/` |
| `gray-matter` (devDep) | Parsing front-matter (semble inutilisé désormais) |

---

## 3. Architecture

### Arborescence simplifiée (commentée)
```
lexmo-saas-ai/
├── app/                                # Next.js App Router (RSC + Server Actions)
│   ├── (auth)/                         # Route group : pages d'auth (login, register, forgot, payment-success)
│   │   ├── actions.ts                  # Server Actions: login(), signup(), logout(), resetPassword(), updatePassword()
│   │   ├── layout.tsx                  # Layout d'auth (centré, logo ECOMY)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx           # email pré-rempli depuis ?email= (post-paiement)
│   │   ├── forgot-password/page.tsx    # PKCE côté client (Supabase resetPasswordForEmail)
│   │   └── payment-success/page.tsx    # Page de remerciement post-Stripe
│   ├── (dashboard)/                    # Route group : zone authentifiée
│   │   ├── layout.tsx                  # Layout avec <Sidebar/> top-nav
│   │   └── dashboard/
│   │       ├── page.tsx                # Redirige vers /coaching ou /phases selon le plan
│   │       ├── phases/                 # Espace formation
│   │       │   ├── page.tsx            # Grille des 26 étapes (StepCard)
│   │       │   ├── stepsData.ts        # 583 lignes : tout le catalogue de leçons (vidéos YT, quiz, contenus)
│   │       │   ├── error.tsx, loading.tsx
│   │       │   └── [id]/
│   │       │       ├── page.tsx        # Lecteur de phase (vidéo + sidebar leçons)
│   │       │       ├── LessonContentRenderer.tsx  # 7382 lignes : tout le contenu textuel des leçons (composants React inline)
│   │       │       ├── QuizRenderer.tsx           # Moteur de quiz (shuffle, scoring, localStorage)
│   │       │       ├── quizData.ts                # 1195 lignes : questions/réponses des 26 phases
│   │       │       └── units/[unitId]/...         # Routes legacy (Module > Unit > Lesson) probablement non utilisées
│   │       ├── coaching/page.tsx       # Espace diagnostic 5 étapes (973 lignes) + ADMIN DEMO MODE
│   │       ├── admin/page.tsx          # Panel admin complet (>700 lignes, partiellement lu)
│   │       ├── ventes-live/            # Dashboard ventes en temps réel
│   │       │   ├── page.tsx            # Server component : fetch initial bypass cache
│   │       │   └── DashboardClient.tsx # Client component temps réel
│   │       ├── settings/page.tsx       # Modifier mot de passe
│   │       ├── reset-password/page.tsx # Étape post-magic-link
│   │       └── lesson-demo/page.tsx    # ⚠️ Page démo (à vérifier utilité)
│   ├── api/                            # Route Handlers
│   │   ├── admin/
│   │   │   ├── settings/route.ts       # Get/Set settings dans live_dashboard_state.data.settings
│   │   │   ├── availability/route.ts   # CRUD availability_slots (semble peu utilisé)
│   │   │   ├── blocked-slots/route.ts  # Toggle créneaux bloqués (coaching_blocked_slots)
│   │   │   ├── create-student/route.ts # Crée user + subscription active (admin only)
│   │   │   └── diagnostic/route.ts     # CRUD coaching_diagnostics (questions/réponses + bilan)
│   │   ├── auth/                       # ⚠️ Vide (dossier sans fichier)
│   │   ├── stripe/                     # ⚠️ Vide (dossier sans fichier)
│   │   ├── bookings/route.ts           # GET (slots dispo) + POST (réserver)
│   │   ├── check-subscription/route.ts # Vérifie l'abonnement actif (utilisé partout en client-side)
│   │   ├── coaching-profile/route.ts   # GET / POST / PATCH du profil coaching + diagnostic
│   │   ├── live/
│   │   │   ├── data/route.ts           # GET public du dashboard ventes-live
│   │   │   ├── update/route.ts         # POST sécurisé par x-api-secret (push externe)
│   │   │   ├── reset/route.ts          # GET reset des ventes (préserve settings)
│   │   │   └── fix-date/route.ts       # GET migration ad-hoc (Jan 30 → Jan 29)
│   │   ├── verify-payment/route.ts     # GET ?email=… → renvoie hasPaid:true/false
│   │   └── webhooks/stripe/route.ts    # POST handler webhook Stripe (envoie email + maj DB + incrémente promo)
│   ├── auth/
│   │   ├── verify/page.tsx             # Page de gestion PKCE / magic link / hash
│   │   └── auth-code-error/page.tsx
│   ├── components/
│   │   ├── Hero.tsx, Navbar.tsx, Footer.tsx, FAQ.tsx, Pricing.tsx, AvisClients.tsx,
│   │   │   Bonus.tsx, Phases.tsx, WhoIsThisFor.tsx, FloatingCTA.tsx, FadeIn.tsx,
│   │   │   LoginSection.tsx           # ⚠️ Composants legacy de l'ancienne homepage (la page actuelle ne les utilise pas tous)
│   │   ├── course/LessonView.tsx
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx            # Top navbar (formation/diagnostic/admin items selon plan)
│   │   │   ├── Card.tsx, DashboardHeader.tsx, ModuleChecklist.tsx,
│   │   │   ├── PhaseCard.tsx, ProgressCircle.tsx, StatCard.tsx, StepCard.tsx
│   │   └── lesson/                     # Composants typés pour rendu pédagogique
│   │       ├── ContentBlock.tsx, ImmediateAction.tsx, KeyTakeaways.tsx,
│   │       ├── LessonFooter.tsx, LessonHeader.tsx, LessonLayout.tsx,
│   │       ├── LessonObjective.tsx, PracticalExample.tsx,
│   │       ├── EXAMPLE_USAGE.tsx       # Fichier d'exemple
│   │       └── index.ts
│   ├── actions/course.ts               # Server actions DB-driven (legacy phase/unit/lesson - probablement non utilisé en prod)
│   ├── diagnostic/page.tsx             # Landing page 97€
│   ├── formation/page.tsx              # Landing page 497€
│   ├── formation-basic/page.tsx        # Landing page 197€
│   ├── legal/{terms,privacy,refund}/page.tsx
│   ├── layout.tsx                      # Root layout : html dir="rtl" lang="ar", GA4
│   ├── page.tsx                        # Homepage : grille de 4 cartes (3 offres + login) + bandeau Shopify
│   ├── globals.css
│   └── favicon.ico
├── lib/
│   ├── check-subscription.ts           # Helper client : fetch /api/check-subscription
│   ├── course-content.ts               # Données legacy (PHASES[]) — semble plus utilisé
│   ├── resend.ts                       # 2 fonctions email HTML
│   └── supabaseAdmin.ts                # Singleton service-role (peu utilisé, la plupart créent à la volée)
├── utils/
│   ├── cn.ts                           # cn() = clsx + tailwind-merge
│   └── supabase/
│       ├── client.ts                   # createBrowserClient
│       ├── server.ts                   # createServerClient avec cookies()
│       └── middleware.ts               # updateSession + protection /dashboard
├── middleware.ts                        # Wrapper qui appelle updateSession
├── content/lessons/phase-1/            # Markdown legacy (modules 01-03) — l'app utilise maintenant TS inline
├── supabase/                           # Migrations + scripts SQL
│   ├── schema.sql, triggers.sql        # Schéma initial (référencés mais ancien)
│   ├── user_subscriptions.sql          # Table principale paiement
│   ├── migrations/
│   │   ├── 20260127_init_live_dashboard.sql
│   │   ├── 20260318_coaching_profiles.sql
│   │   ├── 20260318_coaching_system.sql       # availability_slots + bookings columns
│   │   ├── 20260323_coaching_diagnostics.sql
│   │   └── 20260419_ecommerce_plans.sql       # Ajout 'ecommerce' + 'ecommerce_basic' au CHECK
│   └── *.sql                           # Multitude de scripts ad-hoc (fix_*, force_fix_*, install_*, etc.)
├── scripts/                            # Scripts dev (tsx) : injection de leçons
│   ├── inject-lessons.ts
│   ├── extract-tasks.ts
│   ├── create-lesson-progress.ts
│   ├── update-lesson1.ts
│   └── README.md
├── public/
│   ├── images/                         # ~80 PNG/JPG (avatars + screenshots gains $/€)
│   ├── etapes/                         # 1.png … 26.png (vignettes des étapes)
│   └── ventes-live.json                # Snapshot JSON utilisé pour la page ventes-live
├── package.json, package-lock.json
├── tsconfig.json, next.config.ts (minimal), eslint.config.mjs, postcss.config.mjs
├── tailwind.config.ts                  # Couleurs neo + animations + fonts
├── .env.local                          # ⚠️ Clés secrètes commitées localement (cf. section 19)
├── .gitignore                          # Ignore .env*, .next, node_modules, etc.
├── README.md                           # Boilerplate Next.js par défaut
├── *.md / *.sql                        # Une trentaine de docs/scripts à la racine (legacy)
└── project_structure.txt               # Snapshot ancien
```

### Schéma des flux de données principaux

**Flux paiement → activation :**
```
Utilisateur clic "ابدأ الآن" 
  → /formation (ou /diagnostic, /formation-basic)
  → Stripe Payment Link (URL fixe)
  → Stripe Checkout (hébergé)
  → checkout.session.completed event
  → POST /api/webhooks/stripe
      ├─ Step 4 : Resend.send (email d'activation) [PRIORITAIRE]
      ├─ Step 5 : Insert/Update user_subscriptions (status=active, plan=ecommerce|ecommerce_basic|diagnostic)
      └─ Step 6 : Increment promo counter, auto-close si plein
  → User clique CTA email → /register?email=…
  → Server Action signup() vérifie qu'une subscription existe pour cet email
  → supabase.auth.signUp + redirect /dashboard
  → /dashboard checke le plan → redirige /dashboard/phases (formation) ou /dashboard/coaching (diagnostic)
```

**Flux booking diagnostic (5 étapes) :**
```
Step 1 (form name+email Google Meet) 
  → POST /api/coaching-profile (upsert coaching_profiles, current_step=2)
Step 2 (calendar week)
  → GET /api/bookings → renvoie tous les créneaux 9h-19h dispo (-blocked, -taken, -past, +30j)
  → POST /api/bookings → crée booking, current_step=3, envoie email confirmation
Step 3 (countdown)
  → Animation countdown jusqu'à booking.booking_date
Step 4 (diagnostic)
  → Admin saisit answers + bilan via /dashboard/admin (POST/PATCH /api/admin/diagnostic)
  → Publish → coaching_profiles.current_step=4
Step 5 (validation)
  → Client clique "j'ai reçu" → PATCH /api/coaching-profile {action: 'validate_diagnostic'}
  → coaching_profiles.current_step=5, coaching_diagnostics.client_validated=true
```

**Flux promo cinématique (homepage) :**
```
Admin clique "Lancer promo" → POST /api/admin/settings × N (set promo_active, promo_started_at, etc.)
  → Stockés dans live_dashboard_state.data.settings (single row, id=1)
  → Homepage poll /api/admin/settings toutes les 15s
  → Affichage compteur places (réelles + simulées par interval), countdown, viewers, ticker LIVE noms
  → /api/admin/settings GET auto-close si timer expiré OU promo_places_prises >= total
```

### Séparation frontend/backend
- **Front et back vivent dans la même app Next.js** — pas de monorepo
- Server Actions (`'use server'`) pour login/signup/logout/reset
- Route Handlers (`route.ts`) pour API REST classiques
- Client components (`'use client'`) pour UI interactive

### Patterns utilisés
- **Route Groups** Next.js : `(auth)`, `(dashboard)` pour layouts différents sans impacter l'URL
- **Service-role bypass RLS** dans toutes les routes serveur (admin client créé à la volée)
- **Polling client** plutôt que websockets (15s pour promo, intervalles divers ailleurs)
- **Hardcoded admin email** comme mécanisme d'autorisation (anti-pattern, voir section 12)

---

## 4. Modèle de données — entités

> ⚠️ **Le schéma a évolué de manière incohérente.** Le repo contient à la fois un ancien schéma (`supabase/schema.sql`, `supabase_schema.sql`) avec une hiérarchie *Phases → Modules → Tasks* (style "ambassadeur LEXMO"), et un schéma plus récent réellement utilisé centré sur `user_subscriptions` + `coaching_*`. Le contenu de cours est stocké **en TypeScript hardcodé** (`stepsData.ts`, `quizData.ts`, `LessonContentRenderer.tsx`), **pas en DB** dans la version actuelle.

### 4.1 `auth.users` (géré par Supabase Auth)
- Champs standards Supabase (id UUID, email, encrypted_password, raw_user_meta_data JSONB)
- `raw_user_meta_data` contient `name`, `phone`, `country` (alimentés par signup())

### 4.2 `public.users` (profil étendu — peut être obsolète)
> Défini dans `supabase/schema.sql` + `triggers.sql`. **Pas certain d'être encore utilisé** car le code récent lit directement `auth.users` via `auth.admin.listUsers()`.

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK FK→auth.users(id) | |
| `email` | text NOT NULL | |
| `name`, `phone`, `country` | text | |
| `level` | text default 'Mubtadi' | (Mubtadi, Mutakaddim, Nokhba) — plus utilisé en UI |
| `avatar_url` | text | |
| `ref_code` | text UNIQUE | format `LEX-XXXXX` (généré par trigger) |
| `promo_code` | text UNIQUE | format `PROMO-XXXXX` (généré par trigger) |
| `created_at`, `updated_at` | timestamptz | |

**RLS** : SELECT/UPDATE seulement par owner. **Trigger** `on_auth_user_created` insère automatiquement la row à chaque signup.

### 4.3 `public.user_subscriptions` ⭐ (table principale paiements)
Définie dans [supabase/user_subscriptions.sql](supabase/user_subscriptions.sql) puis modifiée par migrations.

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK→auth.users(id), nullable | nullable car peut être créé avant signup |
| `email` | text NOT NULL UNIQUE | clé fonctionnelle |
| `plan` | text NOT NULL | CHECK (`'spark','emperor','legend','diagnostic','ecommerce','ecommerce_basic'`) ⚠️ valeurs legacy `spark/emperor/legend` toujours dans la contrainte |
| `status` | text NOT NULL default 'pending' | CHECK (`'pending','active','inactive'`) |
| `activated_at` | timestamptz | |
| `created_at` | timestamptz default NOW() | |

**Indexes** : `user_id`, `email`, `status`.
**RLS** : owner peut SELECT (par user_id OU email==auth.email) ; admin (`academyfrance75@gmail.com`) peut INSERT/UPDATE/DELETE.

### 4.4 `public.live_dashboard_state` (singleton)
Une seule row (`id=1`) contenant un blob JSONB `data`. Sert de **store global** pour :
- `data.live_actuel` : compteurs ventes en direct
- `data.ventes` : array d'événements de vente
- `data.stats` : agrégats
- `data.graphique` : série temporelle
- `data.settings` : ⭐ **stockage de toute la config admin live** (registrations_open, registrations_closed_at, show_company_info, promo_active, promo_places_total, promo_places_prises, promo_duree_heures, promo_interval_minutes, promo_started_at)

| Colonne | Type |
|---|---|
| `id` | INT PK default 1 |
| `data` | JSONB |
| `updated_at` | timestamptz |

**RLS** : SELECT public, UPDATE service-role.

### 4.5 `public.coaching_profiles` (parcours diagnostic)
Migration `20260318_coaching_profiles.sql`.

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK→auth.users UNIQUE | un profil par user |
| `full_name` | text | saisie step 1 |
| `google_meet_email` | text | email pour invite Meet |
| `current_step` | int default 1 | 1..5 |
| `created_at`, `updated_at` | timestamptz | |

**RLS** : owner SELECT/INSERT/UPDATE ; admin ALL.

### 4.6 `public.bookings`
Définie dans `supabase/schema.sql`, étendue par migration `20260318_coaching_system.sql`.

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK→users.id | |
| `module_id` | text | (legacy, peu/pas utilisé) |
| `booking_date` | timestamptz NOT NULL | |
| `status` | text default 'scheduled' | 'scheduled' / 'completed' / 'cancelled' |
| `telegram_link` | text (ajouté) | |
| `admin_notes` | text (ajouté) | |
| `product_type` | text default 'diagnostic' (ajouté) | discriminateur |
| `created_at` | timestamptz | |

**Indexes** : `booking_date`, `user_id`. **RLS** : owner SELECT/INSERT ; admin ALL.

### 4.7 `public.coaching_diagnostics` (résultat de session)
Migration `20260323_coaching_diagnostics.sql`.

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK→auth.users UNIQUE | un diagnostic par client |
| `admin_id` | uuid FK→auth.users | qui l'a rempli |
| `answers` | jsonb default '[]' | array `[{question, answer, is_custom}]` |
| `summary`, `recommended_business`, `action_plan`, `recommendation` | text | les 4 champs du bilan |
| `published` | bool default false | |
| `published_at` | timestamptz | |
| `client_validated` | bool default false | |
| `validated_at` | timestamptz | |
| `created_at`, `updated_at` | timestamptz | |

**RLS** : "Service role full access" (la sécurité passe via les API routes admin-checkées). **Index** sur `user_id`.

### 4.8 `public.coaching_blocked_slots`
> Schéma non trouvé en SQL explicite mais utilisé dans [app/api/admin/blocked-slots/route.ts](app/api/admin/blocked-slots/route.ts). Champs vus :

| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `slot_datetime` | timestamptz |

### 4.9 `public.availability_slots` (config créneaux récurrents — peu utilisée)
Migration `20260318_coaching_system.sql`.

| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `day_of_week` | int 0..6 |
| `hour` | int 0..23 |
| `minute` | int (0/30) |
| `duration_minutes` | int default 45 |
| `is_active` | bool default true |
| `created_at` | timestamptz |

> **Note** : la logique actuelle de `/api/bookings` génère les créneaux **9h-19h** **par défaut** sans lire cette table — `availability_slots` semble obsolète/non câblée.

### 4.10 Tables legacy (présentes en SQL mais sans usage évident dans le code actuel)
- `public.progress`, `public.user_progress`, `public.user_phase_progress` — ancien tracking de progression
- `public.affiliates`, `public.commissions` — module d'affiliation jamais activé en UI
- `public.phases`, `public.modules`, `public.tasks`, `public.lessons` — ancien CMS de cours en DB (le code récent utilise des constantes TS à la place)

### Relations clés
```
auth.users 1 ─┬─< user_subscriptions   (par user_id ou email)
              ├─< coaching_profiles    (UNIQUE)
              ├─< coaching_diagnostics (UNIQUE)  
              └─< bookings             (1-N)
live_dashboard_state (singleton id=1, JSONB)
coaching_blocked_slots (free-standing)
```

---

## 5. Espace membre

### 5.1 Inscription (`/register`)
**Fichier** : [app/(auth)/register/page.tsx](app/(auth)/register/page.tsx)

Champs requis : `name`, `email`, `password`, `confirmPassword` (validé front-side).
Champs optionnels : `phone`, `country` (sélecteur 10 valeurs).

⚠️ **Particularité critique** : la fonction [signup()](app/(auth)/actions.ts#L29) **vérifie qu'une row existe dans `user_subscriptions` pour l'email** AVANT d'autoriser le signup. Donc :
- Le paiement Stripe doit être effectué AVANT la création du compte
- Si l'email Stripe ≠ email du formulaire → erreur "هذا البريد الإلكتروني غير مرتبط بعملية دفع"
- Si l'email vient de `?email=…` (lien email Resend) → il est verrouillé (readOnly)

Pas de vérification email confirm classique : `supabase.auth.signUp` est appelé directement, dépend de la config Supabase (probablement `email_confirm: false`).

### 5.2 Connexion (`/login`)
[app/(auth)/login/page.tsx](app/(auth)/login/page.tsx) → Server Action [login()](app/(auth)/actions.ts#L8) → `supabase.auth.signInWithPassword`.
Erreur traduite en arabe si "Invalid login credentials".
**Pas de "se souvenir de moi"**, pas de 2FA, pas d'OAuth.

### 5.3 Mot de passe oublié (`/forgot-password`)
[app/(auth)/forgot-password/page.tsx](app/(auth)/forgot-password/page.tsx) — **côté client** pour gérer le PKCE verifier dans le bon navigateur.
Email envoyé par Supabase (template par défaut) avec `redirectTo` → `/auth/verify?next=/dashboard/reset-password`.

### 5.4 Vérification (`/auth/verify`)
[app/auth/verify/page.tsx](app/auth/verify/page.tsx) — gère 3 cas :
1. Session déjà active → redirect immédiat
2. PKCE flow : `exchangeCodeForSession(code)`
3. Magic link / hash → écoute `onAuthStateChange`

Affiche un message d'erreur si "code verifier not found" demandant à coller le lien dans le bon navigateur.

### 5.5 Reset password (`/dashboard/reset-password`)
[app/(dashboard)/dashboard/reset-password/page.tsx](app/(dashboard)/dashboard/reset-password/page.tsx) — formulaire "nouveau mot de passe + confirmation" → `updatePassword()` Server Action.

### 5.6 Profil & paramètres (`/dashboard/settings`)
[app/(dashboard)/dashboard/settings/page.tsx](app/(dashboard)/dashboard/settings/page.tsx) — **uniquement** changement de mot de passe (min 6 caractères).

⚠️ **Pas de gestion** du nom, téléphone, pays, photo de profil, email — l'utilisateur ne peut pas modifier ses infos perso.

### 5.7 Tableau de bord (`/dashboard`)
[app/(dashboard)/dashboard/page.tsx](app/(dashboard)/dashboard/page.tsx) — **n'affiche rien**, c'est un router serveur :
- Si `plan === 'diagnostic'` → redirect `/dashboard/coaching`
- Sinon → redirect `/dashboard/phases`

### 5.8 Rôles & permissions
**3 "rôles" implicites** déterminés à la volée :
| Rôle | Détection | Accès |
|---|---|---|
| **Admin** | `user.email === 'academyfrance75@gmail.com'` (hardcodé) | Tout : `/dashboard/admin`, `/dashboard/ventes-live`, accès demo coaching, bypass paiement |
| **Étudiant Formation** | `subscription.plan IN ('ecommerce','ecommerce_basic','spark','emperor','legend')` | `/dashboard/phases/*` |
| **Client Diagnostic** | `subscription.plan === 'diagnostic'` | `/dashboard/coaching` |

⚠️ **Pas de table `roles`**, pas de permissions granulaires. La sidebar ([components/dashboard/Sidebar.tsx:21-35](app/components/dashboard/Sidebar.tsx#L21-L35)) bascule entre `FORMATION_ITEMS` et `DIAGNOSTIC_ITEMS` selon le plan, et ajoute `ADMIN_ITEMS` si admin.

### 5.9 Pages selon le rôle
| Page | Public | Étudiant formation | Client diagnostic | Admin |
|---|---|---|---|---|
| `/`, `/formation`, `/formation-basic`, `/diagnostic` | ✅ | ✅ | ✅ | ✅ |
| `/login`, `/register`, `/forgot-password` | ✅ | redirige vers `/dashboard` | redirige vers `/dashboard` | redirige vers `/dashboard` |
| `/dashboard/phases/*` | redirect login | ✅ | bloqué (page check) | ✅ |
| `/dashboard/coaching` | redirect login | bloqué | ✅ | ✅ (mode démo) |
| `/dashboard/admin`, `/dashboard/ventes-live` | redirect login | non listé en sidebar | non listé | ✅ |
| `/dashboard/settings` | redirect login | ✅ | ✅ | ✅ |
| `/legal/*` | ✅ | ✅ | ✅ | ✅ |

### 5.10 Suppression / désactivation de compte
⚠️ **Aucune fonctionnalité utilisateur** pour supprimer son compte.
Côté admin : bouton "Désactiver" qui passe `subscription.status` à `'inactive'` (le compte auth reste).

### 5.11 Historique d'activité
⚠️ **Inexistant**. Aucun audit log, aucune table d'événements utilisateur.

---

## 6. Système de cours

### 6.1 Structure
**Hiérarchie réellement utilisée** (en TypeScript hardcodé dans `stepsData.ts`) :
```
Phase (1..26) — appelée "étape" / "مرحلة"
  └─ Chapter (titre arabe ex. "الدروس", "اختبار المرحلة 1")
      └─ Lesson (id, title, type: 'video'|'quiz'|'pdf', videoUrl?, duration?, content?)
```

> Le schéma DB legacy distingue `phases > modules > tasks` mais ce n'est plus la hiérarchie active.

### 6.2 Types de contenu supportés
- **Vidéo** : iframe YouTube no-cookie, avec **overlays transparents** ([phases/[id]/page.tsx:144-148](app/(dashboard)/dashboard/phases/[id]/page.tsx#L144-L148)) qui bloquent les clics sur le titre/logo YouTube/"Watch on YouTube" → empêche d'ouvrir la vidéo hors plateforme
- **Quiz** : QCM rendu par `QuizRenderer.tsx`, questions tirées de `quizData.ts`, **scoring stocké en localStorage** (`quiz_best_${phase}`) — pas en DB
- **Texte enrichi** : composants React inline dans `LessonContentRenderer.tsx` (7382 lignes !) avec helpers `<SectionTitle>`, `<GreenList>`, `<RedList>`, `<ToolCard>`, etc.
- **PDF** : type déclaré mais peu/pas utilisé en pratique
- **Pas d'audio**, pas de SCORM, pas de fichiers téléchargeables

### 6.3 Création / édition de cours
⚠️ **Aucune interface admin pour créer/éditer du contenu**. Tout est **hardcodé en TypeScript** (`stepsData.ts`, `quizData.ts`, `LessonContentRenderer.tsx`). Modifier un cours = éditer le code + redéployer.

Les scripts dans `scripts/` (`inject-lessons.ts`, `extract-tasks.ts`) suggèrent une ancienne intention d'injecter depuis `content/lessons/phase-1/module-XX/*.md` vers la DB, mais ce flow n'est plus actif.

### 6.4 Catalogue de cours (`/dashboard/phases`)
[app/(dashboard)/dashboard/phases/page.tsx](app/(dashboard)/dashboard/phases/page.tsx) — grille de **26 `StepCard`** (1 par phase). Bloquée derrière `checkUserSubscription()` :
- Sans abonnement actif → écran "الوصول مقيد 🔒" avec mailto
- Avec abonnement → grille avec titre, description, image `/etapes/{n}.png`, barre de progression (toujours 0% — la progression n'est PAS persistée en DB)

⚠️ **Pas de filtres / recherche / catégories / tags**.

### 6.5 Page détail d'un cours / lecteur (`/dashboard/phases/[id]`)
[app/(dashboard)/dashboard/phases/[id]/page.tsx](app/(dashboard)/dashboard/phases/[id]/page.tsx) :
- **Header** : breadcrumb retour + titre étape + barre de progression (calculée localement à partir du Set des leçons cochées)
- **Layout 2 colonnes (RTL)** : iframe vidéo à droite, sidebar leçons à gauche
- **Sidebar** : tous les chapitres+leçons, checkbox compléter, icône type, durée, indicateur actif
- **Navigation** : "Précédent / Suivant" + bouton "Marquer terminé"
- **Bloc Telegram help** ([:209-224](app/(dashboard)/dashboard/phases/[id]/page.tsx#L209-L224)) : visible UNIQUEMENT si `userPlan !== 'ecommerce_basic'` (le plan 197€ exclut le support)

### 6.6 Suivi de progression
⚠️ **Progression NON persistée**. Les leçons cochées vivent dans un `useState<Set<string>>` côté React. **Refresh = perte**.
Aucun appel API n'enregistre `lesson.completed` dans la base.

### 6.7 Système de quiz
[QuizRenderer.tsx](app/(dashboard)/dashboard/phases/[id]/QuizRenderer.tsx) :
- Lit `quizzes[phaseNumber]` depuis [quizData.ts](app/(dashboard)/dashboard/phases/[id]/quizData.ts)
- **Shuffle questions ET options** au démarrage
- Si `quizzes[phase]` est vide ou non défini → fallback "lesson coming soon" (commit `8f751a4` a corrigé un crash quand pas initialisé)
- Score stocké en `localStorage` (clé `quiz_best_${phase}`)
- 26 phases ont des quizzes (commit `d10b497`)

### 6.8 Certificats
❌ **Aucun système de certificat**.

### 6.9 Favoris / wishlist
❌ **Aucun**.

### 6.10 Avis & notes
Affichage de "5.0 (453)" est **statique/hardcodé** ([page.tsx:541](app/page.tsx#L541), `formation/page.tsx:67`, `diagnostic/page.tsx:49`). Pas de système réel de notation.

### 6.11 Prérequis entre cours
❌ **Aucun verrouillage** entre phases. L'utilisateur a accès aux 26 dès activation.

### 6.12 Catalogue des 26 phases
Issu de [phases/page.tsx:98-125](app/(dashboard)/dashboard/phases/page.tsx#L98-L125) :

| # | Titre arabe | Thème |
|---|---|---|
| 1 | 🔑 الأساسيات | Fondamentaux + choix produit |
| 2 | 🔍 الأسلحة السرية | Outils des pros |
| 3 | 🌍 اصطاد المنتج الرابح | Recherche produit (MA, KSA, US) |
| 4 | 🕵️ اسرق أسرار المنافسين | Espionner concurrents |
| 5 | 🎯 القرار النهائي | Choisir le produit |
| 6 | 🚀 أول خطوة | Ouverture Shopify |
| 7 | 🎨 صمم متجر احترافي | Design boutique |
| 8 | ⚙️ إعدادات المتجر | Réglages paiement/livraison |
| 9 | 📄 الصفحات القانونية | Pages légales |
| 10 | 📦 الخطوات الأخيرة | Apps tracking |
| 11 | 🛍️ فتح متجر شوبيفاي | Setup Shopify détaillé |
| 12 | 🛒 استيراد المنتج | Import AliExpress |
| 13 | 🎨 تعديل المتجر | Customisation + IA images |
| 14 | 🔌 التطبيقات الأساسية | Apps essentielles |
| 15 | 📘 مقدمة فيسبوك أدس | Intro Facebook Ads |
| 16 | 🔧 إنشاء الحسابات | Création comptes pub |
| 17 | 🎯 أهداف الحملات | Objectifs de campagne |
| 18 | 👥 استهداف الجمهور | Ciblage audience |
| 19 | ⚙️ إعدادات الحملة | Réglages campagne |
| 20 | 🎨 إنشاء الإعلان | Création créa |
| 21 | 📊 التحسين والتحليل | Optimisation/analyse |
| 22 | 🚀 إنشاء حملة إعلانية | Première campagne FB |
| 23 | 📊 تحليل الإعلانات | Analyse approfondie |
| 24 | 🎵 منصة إعلانية جديدة | TikTok Ads intro |
| 25 | 🎬 أول حملة من الصفر | Première campagne TikTok |
| 26 | 🔎 اربح أكثر | Optimisation TikTok |

---

## 7. Autres fonctionnalités

### 7.1 Système de promo cinématique (homepage)
[app/page.tsx:160-437](app/page.tsx#L160-L437) — bloc `<PromoCardInfo>` qui affiche dans la carte formation :
- **Compteur de places restantes** (mélange real `promo_places_prises` + simulé via `promo_started_at` + `promo_interval_minutes`)
- **Countdown** jusqu'à `started_at + duree_heures`
- **Compteur de viewers** (random 30-85, varie ±1-5 toutes les 8-15s, avec animation slide)
- **Ticker LIVE** avec noms simulés (~140 noms ar + drapeaux pays) qui défile toutes les 8-10s
- Auto-close quand timer = 0 ou places remplies

Toutes les valeurs sont stockées dans `live_dashboard_state.data.settings.promo_*`.

### 7.2 Dashboard ventes en direct (`/dashboard/ventes-live`)
[app/(dashboard)/dashboard/ventes-live/](app/(dashboard)/dashboard/ventes-live/) — page admin qui affiche :
- Compteurs `places_disponibles`, `places_prises`, `places_restantes`
- Liste des ventes (`data.ventes[]`)
- Stats agrégées (`total_gains`, `total_ventes`)
- Graphique cumul (`data.graphique[]`)

API associées :
- `GET /api/live/data` — lecture publique
- `POST /api/live/update` — push de nouvelles données (sécurisé par header `x-api-secret`, défaut `'ecomy-live-secret-2026'`)
- `GET /api/live/reset` — reset (préserve settings)
- `GET /api/live/fix-date` — migration ad-hoc one-shot Jan 30 → Jan 29

### 7.3 Recherche
❌ **Aucune fonctionnalité de recherche** (ni produits, ni leçons, ni utilisateurs).

### 7.4 Notifications
- **Email** : Resend (activation post-paiement + confirmation booking)
- **Pas de notif in-app**, **pas de push web**, **pas de SMS**

### 7.5 Messagerie / Chat / Forum
- **Pas de chat in-app**
- **Support externe via Telegram** : `https://t.me/ecom_europe` (canal général homepage), `https://t.me/ecomyyy` (compte direct dans les phases)

### 7.6 Codes promo / coupons
- Champ `promo_code` `LEX-XXXXX` généré par trigger SQL pour chaque user mais **jamais consommé** côté Stripe (aucun handler)

### 7.7 Affiliation / parrainage
- Tables `affiliates`, `commissions` + colonne `ref_code` `LEX-XXXXX` dans `users`
- ⚠️ **Aucune UI**, aucun calcul de commission, aucun tracking de clics — module **présent mais dormant**

### 7.8 Blog / articles
❌ Aucun.

### 7.9 Pages légales
- [/legal/terms](app/legal/terms/page.tsx) — CGU
- [/legal/privacy](app/legal/privacy/page.tsx) — Confidentialité
- [/legal/refund](app/legal/refund/page.tsx) — Politique de remboursement

Toutes affichent ou cachent les **infos société** selon `settings.show_company_info` (toggle admin).

### 7.10 Multilangue (i18n)
- **Arabe RTL uniquement** (`<html lang="ar" dir="rtl">` dans [layout.tsx:29](app/layout.tsx#L29))
- Quelques chaînes français/anglais résiduelles (messages d'erreur reset password en FR : "Erreur lors de la mise à jour du mot de passe.")
- Pas de framework i18n (next-intl, etc.)

### 7.11 Mode sombre
- **Mode sombre permanent** — `bg-[#0A0A0A]` partout, jamais de toggle
- `darkMode: "class"` dans Tailwind config mais inutilisé

### 7.12 Accessibilité
- Quelques `aria-*` présents mais pas d'audit a11y systématique
- RTL fonctionnel
- Pas de focus rings personnalisés / contrast checked

### 7.13 SEO / Sitemap
- Métadonnées basiques dans `layout.tsx` (title="ECOMY", description="Next Generation E-commerce Training")
- Pas de `sitemap.xml`, pas de `robots.txt` custom, pas d'OpenGraph/Twitter cards
- Pas de SSG explicite (la majorité des pages sont `'use client'` ou `force-dynamic`)

### 7.14 Analytics
- **GA4** uniquement (`G-P3LDE3ME0N`)

### 7.15 Bandeau affiliation Shopify
Bandeau permanent en bas de homepage ([page.tsx:683-717](app/page.tsx#L683-L717)) — lien `https://shopify.pxf.io/WO4qKJ` ("1€ pour 3 mois").

---

## 8. Routes et endpoints

### 8.1 Pages frontend (URL → fichier → accès)

| URL | Fichier | Rôle | Accès |
|---|---|---|---|
| `/` | [app/page.tsx](app/page.tsx) | Homepage 4 cartes (3 offres + login) | Public |
| `/formation` | [app/formation/page.tsx](app/formation/page.tsx) | Landing 497€ | Public |
| `/formation-basic` | [app/formation-basic/page.tsx](app/formation-basic/page.tsx) | Landing 197€ | Public |
| `/diagnostic` | [app/diagnostic/page.tsx](app/diagnostic/page.tsx) | Landing 97€ | Public |
| `/login` | [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx) | Connexion | Public (redirect /dashboard si déjà loggué) |
| `/register` | [app/(auth)/register/page.tsx](app/(auth)/register/page.tsx) | Inscription (post-paiement) | Public |
| `/forgot-password` | [app/(auth)/forgot-password/page.tsx](app/(auth)/forgot-password/page.tsx) | Demande reset | Public |
| `/payment-success` | [app/(auth)/payment-success/page.tsx](app/(auth)/payment-success/page.tsx) | Page de remerciement Stripe | Public (si referer = Stripe) |
| `/auth/verify` | [app/auth/verify/page.tsx](app/auth/verify/page.tsx) | Handler PKCE/magic link | Public |
| `/auth/auth-code-error` | [app/auth/auth-code-error/page.tsx](app/auth/auth-code-error/page.tsx) | Erreur OAuth | Public |
| `/legal/terms` | [app/legal/terms/page.tsx](app/legal/terms/page.tsx) | CGU | Public |
| `/legal/privacy` | [app/legal/privacy/page.tsx](app/legal/privacy/page.tsx) | Vie privée | Public |
| `/legal/refund` | [app/legal/refund/page.tsx](app/legal/refund/page.tsx) | Remboursement | Public |
| `/dashboard` | [app/(dashboard)/dashboard/page.tsx](app/(dashboard)/dashboard/page.tsx) | Router → coaching ou phases | Auth requis |
| `/dashboard/phases` | [app/(dashboard)/dashboard/phases/page.tsx](app/(dashboard)/dashboard/phases/page.tsx) | Catalogue 26 étapes | Auth + plan formation |
| `/dashboard/phases/[id]` | [app/(dashboard)/dashboard/phases/[id]/page.tsx](app/(dashboard)/dashboard/phases/[id]/page.tsx) | Lecteur de phase | Auth + plan formation |
| `/dashboard/phases/[id]/units/[unitId]` | [app/(dashboard)/dashboard/phases/[id]/units/[unitId]/page.tsx](app/(dashboard)/dashboard/phases/[id]/units/[unitId]/page.tsx) | Détail unité (legacy DB) | ⚠️ Probablement non lié |
| `/dashboard/phases/[id]/units/[unitId]/lessons/[lessonId]` | idem | Détail leçon (legacy DB) | ⚠️ Probablement non lié |
| `/dashboard/coaching` | [app/(dashboard)/dashboard/coaching/page.tsx](app/(dashboard)/dashboard/coaching/page.tsx) | Parcours diagnostic 5 étapes | Auth + plan diagnostic OU admin |
| `/dashboard/admin` | [app/(dashboard)/dashboard/admin/page.tsx](app/(dashboard)/dashboard/admin/page.tsx) | Panel admin | Admin only |
| `/dashboard/ventes-live` | [app/(dashboard)/dashboard/ventes-live/page.tsx](app/(dashboard)/dashboard/ventes-live/page.tsx) | Dashboard ventes | Admin only |
| `/dashboard/settings` | [app/(dashboard)/dashboard/settings/page.tsx](app/(dashboard)/dashboard/settings/page.tsx) | Mot de passe | Auth requis |
| `/dashboard/reset-password` | [app/(dashboard)/dashboard/reset-password/page.tsx](app/(dashboard)/dashboard/reset-password/page.tsx) | Définir nouveau MDP | Auth requis (post-magic-link) |
| `/dashboard/lesson-demo` | [app/(dashboard)/dashboard/lesson-demo/page.tsx](app/(dashboard)/dashboard/lesson-demo/page.tsx) | ⚠️ Démo / sandbox | À vérifier |

**Middleware** ([middleware.ts](middleware.ts) + [utils/supabase/middleware.ts](utils/supabase/middleware.ts)) :
- Routes publiques : `/`, `/login`, `/register`, `/reset-password`, `/payment-success`, `/api/webhooks/stripe`, `/formation`, `/diagnostic`
- ⚠️ `/formation-basic` n'est **pas** dans la whitelist — il est traité comme protégé… (mais comme middleware match `startsWith('/formation')`, il l'accepte de fait — fragile)
- `/dashboard/*` sans user → redirect `/login`
- `/login` avec user → redirect `/dashboard`

### 8.2 Endpoints backend (méthode → URL → auth → payload)

#### Auth (Server Actions, pas REST)
| Action | Fichier | Auth | Payload |
|---|---|---|---|
| `login(formData)` | actions.ts:8 | — | `email, password` |
| `signup(formData)` | actions.ts:29 | — (vérifie subscription pré-existante) | `email, password, name, phone, country` |
| `logout()` | actions.ts:80 | session | — |
| `resetPassword(formData)` | actions.ts:86 | — | `email` |
| `updatePassword(formData)` | actions.ts:104 | session | `password` |

#### Subscriptions / users
| Méthode | URL | Auth | Payload | Réponse |
|---|---|---|---|---|
| GET | `/api/check-subscription` | session cookie | — | `{hasAccess, isAdmin?, subscription}` |
| GET | `/api/verify-payment?email=…` | aucune ⚠️ | query `email` | `{hasPaid: bool}` |

#### Coaching / diagnostic
| Méthode | URL | Auth | Payload |
|---|---|---|---|
| GET | `/api/coaching-profile` | session | — → `{profile, booking, diagnostic}` |
| POST | `/api/coaching-profile` | session | `{full_name, google_meet_email}` |
| PATCH | `/api/coaching-profile` | session | `{action: 'validate_diagnostic'}` ou `{current_step}` |
| GET | `/api/bookings` | aucune ⚠️ | — → `{slots: ISO[]}` (publique pour voir les dispos) |
| POST | `/api/bookings` | session + plan diagnostic | `{booking_date}` |

#### Admin (toutes vérifient `user.email === 'academyfrance75@gmail.com'`)
| Méthode | URL | Payload |
|---|---|---|
| GET | `/api/admin/settings` | — (publique pour homepage) |
| POST | `/api/admin/settings` | `{key, value}` (admin via session bearer) |
| GET | `/api/admin/availability` | — |
| POST/DELETE | `/api/admin/availability` | `{day_of_week, hour, minute}` / `{id}` |
| GET | `/api/admin/blocked-slots?from=…&to=…` | — |
| POST | `/api/admin/blocked-slots` | `{slot_datetime}` (toggle) |
| POST | `/api/admin/create-student` | header `Authorization` + body `{name, email, plan, adminEmail}` |
| GET | `/api/admin/diagnostic?user_id=…` | — |
| POST | `/api/admin/diagnostic` | `{user_id, answers}` |
| PATCH | `/api/admin/diagnostic` | `{user_id, summary?, recommended_business?, action_plan?, recommendation?, publish?}` |

#### Webhooks
| Méthode | URL | Auth | Payload |
|---|---|---|---|
| POST | `/api/webhooks/stripe` | Header `stripe-signature` (vérifié contre `STRIPE_WEBHOOK_SECRET`) | Stripe event (gère uniquement `checkout.session.completed`) |

#### Live dashboard
| Méthode | URL | Auth |
|---|---|---|
| GET | `/api/live/data` | publique (anon key) |
| POST | `/api/live/update` | header `x-api-secret` |
| GET | `/api/live/reset` | aucune ⚠️ (anyone can reset!) |
| GET | `/api/live/fix-date` | aucune ⚠️ (one-shot migration laissée publique) |

---

## 9. Interface d'administration

### 9.1 Localisation
**`/dashboard/admin`** — accessible uniquement si `auth.user.email === 'academyfrance75@gmail.com'`. Le check est **côté client** (`useEffect`) avec un fallback "unauthorized" UI.

### 9.2 Fonctionnalités (vues partiellement, fichier ~1000 lignes)

#### Gestion utilisateurs / abonnements
- **Liste de tous les users** (table `users`) avec email, nom, téléphone, pays, date
- **Liste des subscriptions** avec statut, plan, dates
- **Activer / désactiver** une subscription (UPDATE `status`)
- **Créer un étudiant manuellement** : génère un mot de passe alphanumérique 8 chars, crée le user via `auth.admin.createUser` + insère dans `user_subscriptions`. Bouton "Copier mot de passe" + "Envoyer email" (mailto pré-rempli)

#### Settings live
- **Toggle "infos société"** dans pages légales
- **Toggle "registrations open"** (ferme/ouvre toutes les offres avec horodatage)
- **Lancer une promo** : configure `promo_active`, `promo_places_total`, `promo_duree_heures`, `promo_interval_minutes` puis lance avec `promo_started_at = NOW()`
- **Stop promo**

#### Calendrier coaching
- Vue semaine (navigation prev/next)
- **Toggle créneaux bloqués** (clic sur une heure → POST `/api/admin/blocked-slots`)
- **Liste des bookings** existants (lecture directe Supabase client-side)
- Boutons "Marquer terminé" / "Annuler" sur chaque booking

#### Clients diagnostic
- **Liste des `coaching_profiles`** avec leur step actuel et booking
- **Ouvrir fiche client** → modal 3 vues :
  1. **Fiche** : infos client + booking + diagnostic existant
  2. **Questions** : parcours des 3 questions diagnostic prédéfinies (`DIAGNOSTIC_QUESTIONS` dans le composant) + choix multiple ou réponse custom
  3. **Bilan** : 4 textareas (`summary`, `recommended_business`, `action_plan`, `recommendation`) + bouton "Sauvegarder" / "Publier" (le publish met `current_step=4` côté client)

#### Statistiques
- Compteurs basiques visibles (total users, subscriptions actives) — pas de graphique avancé sur la page admin elle-même (le graphique est sur `/dashboard/ventes-live`)

### 9.3 Pas de gestion de cours en admin
⚠️ **Aucun CMS** : pour modifier une leçon, il faut éditer `stepsData.ts` et redéployer.

---

## 10. Composants frontend

### 10.1 Composants UI réutilisables (`app/components/`)
| Composant | Rôle |
|---|---|
| [Hero.tsx](app/components/Hero.tsx) | Hero section ancienne homepage (legacy) |
| [Navbar.tsx](app/components/Navbar.tsx) | Navbar sticky publique (legacy) |
| [Footer.tsx](app/components/Footer.tsx) | Footer avec liens légaux |
| [FAQ.tsx](app/components/FAQ.tsx) | Accordéon FAQ générique |
| [Pricing.tsx](app/components/Pricing.tsx) | Tableau de prix (legacy) |
| [AvisClients.tsx](app/components/AvisClients.tsx) | Témoignages |
| [Bonus.tsx](app/components/Bonus.tsx) | Liste de bonus |
| [Phases.tsx](app/components/Phases.tsx) | Présentation des phases (landing) |
| [WhoIsThisFor.tsx](app/components/WhoIsThisFor.tsx) | Section profilage |
| [FloatingCTA.tsx](app/components/FloatingCTA.tsx) | CTA flottant |
| [FadeIn.tsx](app/components/FadeIn.tsx) | Wrapper anim Framer Motion |
| [LoginSection.tsx](app/components/LoginSection.tsx) | Bloc login intégré (legacy) |

### 10.2 Layouts principaux
- [app/layout.tsx](app/layout.tsx) — root, fonts, GA4, dir="rtl"
- [app/(auth)/layout.tsx](app/(auth)/layout.tsx) — layout centré avec logo
- [app/(dashboard)/layout.tsx](app/(dashboard)/layout.tsx) — layout dashboard avec Sidebar top-nav

### 10.3 Composants métier dashboard (`app/components/dashboard/`)
| Composant | Rôle |
|---|---|
| [Sidebar.tsx](app/components/dashboard/Sidebar.tsx) | Top navbar (formation/diagnostic items selon plan + admin) |
| [Card.tsx](app/components/dashboard/Card.tsx) | Wrapper de carte stylisée |
| [DashboardHeader.tsx](app/components/dashboard/DashboardHeader.tsx) | Header de page interne |
| [ModuleChecklist.tsx](app/components/dashboard/ModuleChecklist.tsx) | Liste de tâches (legacy) |
| [PhaseCard.tsx](app/components/dashboard/PhaseCard.tsx) | Carte phase (legacy DB-driven) |
| [ProgressCircle.tsx](app/components/dashboard/ProgressCircle.tsx) | Cercle de progression SVG |
| [StatCard.tsx](app/components/dashboard/StatCard.tsx) | KPI card |
| [StepCard.tsx](app/components/dashboard/StepCard.tsx) | ⭐ Carte d'étape utilisée dans `/dashboard/phases` |

### 10.4 Composants leçon (`app/components/lesson/`)
Mini-DSL React pour formater les leçons :
[LessonLayout.tsx](app/components/lesson/LessonLayout.tsx), [LessonHeader.tsx](app/components/lesson/LessonHeader.tsx), [LessonFooter.tsx](app/components/lesson/LessonFooter.tsx), [LessonObjective.tsx](app/components/lesson/LessonObjective.tsx), [ContentBlock.tsx](app/components/lesson/ContentBlock.tsx), [ImmediateAction.tsx](app/components/lesson/ImmediateAction.tsx), [KeyTakeaways.tsx](app/components/lesson/KeyTakeaways.tsx), [PracticalExample.tsx](app/components/lesson/PracticalExample.tsx). [EXAMPLE_USAGE.tsx](app/components/lesson/EXAMPLE_USAGE.tsx) sert de doc.

### 10.5 Composants spécialisés
- `LessonContentRenderer.tsx` — **7382 lignes** : tout le contenu textuel des phases est géré ici via un `switch (contentKey)` géant
- `QuizRenderer.tsx` — moteur de quiz
- `ventes-live/DashboardClient.tsx` — dashboard temps-réel

### 10.6 Hooks personnalisés / contextes / stores
⚠️ **Aucun custom hook**, **aucun contexte React**, **zustand pas utilisé** malgré sa présence en deps. Tout le state est local (`useState`, `useEffect`, `useTransition`).

---

## 11. Services backend

### 11.1 Services / classes métier
| Fichier | Rôle |
|---|---|
| [lib/check-subscription.ts](lib/check-subscription.ts) | Wrapper client `fetch /api/check-subscription` |
| [lib/resend.ts](lib/resend.ts) | `sendActivationEmail()`, `sendBookingConfirmationEmail()` (HTML inline) |
| [lib/supabaseAdmin.ts](lib/supabaseAdmin.ts) | Singleton service-role (peu utilisé, la plupart créent à la volée) |
| [lib/course-content.ts](lib/course-content.ts) | Constants `PHASES[]` (legacy) |
| [utils/supabase/{client,server,middleware}.ts](utils/supabase/) | Helpers cookies Supabase |
| [utils/cn.ts](utils/cn.ts) | `cn()` = `twMerge(clsx(...))` |
| [app/actions/course.ts](app/actions/course.ts) | Server Actions DB-driven `getPhases()`, `getPhaseDetails()`, `getUnitDetails()`, `getLessonDetails()`, `toggleTask()` (legacy, alimentait le système DB) |

### 11.2 Middlewares
- [middleware.ts](middleware.ts) — wrapper qui appelle `updateSession`
- [utils/supabase/middleware.ts](utils/supabase/middleware.ts) — gestion cookies SSR + protection routes

### 11.3 Validators
⚠️ Pas de Zod / Yup / Joi. Toutes les validations sont **inline** :
- Front : `required`, `minLength`, `event.preventDefault` sur formulaires
- Back : `if (!field)` simples, retournent `400`

### 11.4 Jobs / tâches planifiées (cron)
⚠️ **Aucun cron**. Pas de `vercel.json` schedule, pas de Edge Functions Supabase.
La logique d'auto-close de promo se fait à chaque `GET /api/admin/settings` (lazy).

### 11.5 Webhooks
- **Entrant** : `/api/webhooks/stripe` (Stripe signature verifiée)
- **Sortant** : envoi email Resend, c'est tout

### 11.6 Scripts dev (`scripts/`)
| Script | But |
|---|---|
| [inject-lessons.ts](scripts/inject-lessons.ts) | Injecter des leçons depuis `content/lessons/phase-1/module-XX/` vers la DB (legacy) |
| [extract-tasks.ts](scripts/extract-tasks.ts) | Extraire les tâches d'un Markdown |
| [create-lesson-progress.ts](scripts/create-lesson-progress.ts) | Bootstrapper progression |
| [update-lesson1.ts](scripts/update-lesson1.ts) | Patch d'une leçon spécifique |

Lancement : `npm run inject-lessons[:dry-run|:module]` (cf. [package.json:11-13](package.json#L11-L13)).

---

## 12. Sécurité

### 12.1 Authentification
- **Supabase Auth** + cookies httpOnly via `@supabase/ssr`
- Sessions persistées navigateur, refreshable
- PKCE pour le reset password (anti-CSRF flow)

### 12.2 Autorisation
- **Hardcoded admin email** `'academyfrance75@gmail.com'` dans :
  - 8+ fichiers (`app/api/admin/*`, `app/api/check-subscription`, `app/api/bookings`, `app/(dashboard)/dashboard/admin/page.tsx`, [phases/page.tsx:12](app/(dashboard)/dashboard/phases/page.tsx#L12), policies SQL)
  - **Anti-pattern** : aucune table `roles`, aucune permission, changer d'admin = grep + replace + redéploiement
- RLS Postgres présentes mais bypass systématique côté code via service-role

### 12.3 Protection des routes
**Frontend** : middleware Next.js + `useEffect` qui appellent `checkUserSubscription`.
**Backend** : chaque route admin commence par `verifyAdmin()` (récupère user via cookies + check email).
⚠️ **Failles vues** :
- `/api/live/reset` — **GET** ouvert, aucune auth → n'importe qui peut reset le dashboard
- `/api/live/fix-date` — idem
- `/api/verify-payment?email=…` — aucune auth, énumération possible des emails ayant payé
- `/api/bookings` GET — public (mais ne renvoie que les ISO de slots, pas critique)

### 12.4 Validation des inputs
- Côté server : checks `if (!field)` minimaux, retourne 400
- Côté client : `required`, `minLength`, `type="email"` HTML
- ⚠️ Pas de validation typée stricte (Zod absent)

### 12.5 CSRF / XSS / SQL injection
- **CSRF** : Supabase + Next.js Server Actions utilisent des tokens, OK pour les actions auth. Les routes API admin **n'ont pas de CSRF token** explicite mais sont protégées par cookie + check email.
- **XSS** : peu de risque car React échappe par défaut. `dangerouslySetInnerHTML` non vu.
- **SQL injection** : aucune query SQL brute, tout passe par le client Supabase paramétré.

### 12.6 Rate limiting
❌ **Aucun**. Pas de package `upstash/ratelimit`, pas de Vercel WAF custom.

### 12.7 Permissions / rôles
Voir 12.2 — modèle binaire admin/non-admin + plan d'abonnement.

### 12.8 Stockage de secrets
⚠️ Voir [section 19](#19-alertes-de-sécurité-critiques).

---

## 13. Configuration

### 13.1 Variables d'environnement utilisées (extraites du code)

| Variable | Type | Utilisation |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL | Client browser & server Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | secret public | Client browser Supabase |
| `SUPABASE_URL` | URL | Service role (mêmes valeurs) |
| `SUPABASE_SERVICE_ROLE_KEY` | secret 🔐 | Toutes les routes server qui bypassent RLS |
| `STRIPE_SECRET_KEY` | secret 🔐 | Webhook signature + types |
| `STRIPE_WEBHOOK_SECRET` | secret 🔐 | Vérif signature webhook |
| `RESEND_API_KEY` | secret 🔐 | Envoi email transactionnel |
| `RESEND_FROM_EMAIL` | email | Sender (default `noreply@ecomy.ai` dans le code, `noreply@lexmo.ai` dans .env.local actuel) |
| `API_SECRET_LIVE_UPDATE` | secret 🔐 | Header `x-api-secret` pour `/api/live/update` (default fallback `'ecomy-live-secret-2026'`) |

### 13.2 Fichiers de configuration
| Fichier | Rôle |
|---|---|
| [next.config.ts](next.config.ts) | Vide (aucune config custom) |
| [tsconfig.json](tsconfig.json) | TS config standard Next.js |
| [tailwind.config.ts](tailwind.config.ts) | Couleurs neo, fontFamily, animations, plugin typography |
| [postcss.config.mjs](postcss.config.mjs) | Tailwind v4 PostCSS |
| [eslint.config.mjs](eslint.config.mjs) | Config ESLint Next |
| [.gitignore](.gitignore) | Standard (ignore .env*, .next, node_modules) |

### 13.3 Différences dev / staging / prod
⚠️ **Aucune distinction explicite**. Pas de `.env.development` / `.env.production`, pas de variable `NODE_ENV` switching côté code (à part Next.js implicite).
- L'URL admin login (`LOGIN_URL = 'https://ecomy.ai/#login'`) est hardcodée
- Stripe en mode TEST mais le domaine cible est prod

---

## 14. Tests

### 14.1 Tests unitaires / intégration / e2e
❌ **Aucun test** : pas de `__tests__/`, pas de `*.test.ts`, pas de `vitest`/`jest`/`playwright`/`cypress` en dépendances.

### 14.2 Couverture
N/A.

### 14.3 Comment lancer les tests
N/A.

### 14.4 Linter
```bash
npm run lint    # ESLint
```
Pas de `prettier` configuré.

---

## 15. Déploiement

### 15.1 Lancer en local
```bash
# 1. Cloner le repo
git clone <url>
cd lexmo-saas-ai

# 2. Installer les dépendances
npm install

# 3. Configurer .env.local (voir section 13.1)
# Copier les valeurs depuis l'environnement de dev existant

# 4. (Optionnel) Appliquer les migrations Supabase
# Pas de Supabase CLI configurée — exécuter manuellement les SQL dans
# supabase/migrations/ via le dashboard Supabase, dans l'ordre chronologique.

# 5. Lancer le serveur de dev
npm run dev
# → http://localhost:3000
```

### 15.2 Build production
```bash
npm run build   # next build
npm run start   # next start (mode prod local)
```

### 15.3 Déploiement
- **Vercel** présumé (boilerplate next.config, README mentionne Vercel)
- **Aucun Dockerfile**, aucune `vercel.json`, aucun GitHub Actions

### 15.4 CI/CD
❌ Aucun pipeline configuré dans le repo.

### 15.5 Webhook Stripe en local
Documenté dans [GUIDE_STRIPE.md](GUIDE_STRIPE.md). Procédure : `stripe listen --forward-to localhost:3000/api/webhooks/stripe` puis copier le signing secret généré dans `STRIPE_WEBHOOK_SECRET`.

### 15.6 Migrations
**Pas de Supabase CLI configurée** dans le repo (`supabase/config.toml` absent). Les fichiers SQL dans `supabase/migrations/` doivent être appliqués manuellement via le dashboard Supabase (SQL editor) **dans l'ordre du nom de fichier**.

---

## 16. Problèmes connus & dette technique

### 16.1 Bugs / incohérences identifiés en exploration
1. **Email expéditeur Resend non migré** : `.env.local` contient `RESEND_FROM_EMAIL=noreply@lexmo.ai` mais le domaine de prod est désormais `ecomy.ai` (commit `21aaaa5`). Les emails sortent depuis l'ancien domaine — soit le DNS de `lexmo.ai` est encore actif, soit les emails échouent silencieusement.
2. **Plans CHECK constraint** : la contrainte `user_subscriptions_plan_check` autorise encore les valeurs legacy `'spark', 'emperor', 'legend'` qui ne sont plus utilisées en prod. Le webhook Stripe ([webhook/route.ts:160-163](app/api/webhooks/stripe/route.ts#L160-L163)) a même un **fallback "spark"** au cas où la contrainte rejette `ecommerce` — preuve d'un correctif incomplet.
3. **Fonction `setNewStudentPlan('spark')`** dans `admin/page.tsx:623` après création d'un étudiant → réinitialise le sélecteur sur un plan obsolète.
4. **Routes API non protégées** : `/api/live/reset`, `/api/live/fix-date`, `/api/verify-payment` n'ont aucune authentification (cf. 12.3).
5. **Routes legacy non liées** : `/dashboard/phases/[id]/units/[unitId]/...` lit la DB (`getUnitDetails`) mais aucun lien n'y mène depuis l'UI actuelle qui utilise le système TS hardcodé.
6. **Dossiers `app/api/auth/` et `app/api/stripe/` vides** — placeholders ou nettoyage incomplet.
7. **Page `/dashboard/lesson-demo`** présente en prod, à vérifier si c'est un vestige de dev.
8. **Composants frontend legacy** non utilisés (`Hero.tsx`, `Navbar.tsx`, `Pricing.tsx`, etc.) — la homepage actuelle ([app/page.tsx](app/page.tsx)) est self-contained.
9. **`/formation-basic` pas dans la whitelist middleware** — fonctionne par chance grâce au `startsWith('/formation')`. Fragile si on renomme.
10. **Reset password message en français** : `"Erreur lors de la mise à jour du mot de passe."` ([actions.ts:113](app/(auth)/actions.ts#L113)) au milieu d'une UI 100% arabe.
11. **GA4 chargé dans toutes les pages** y compris `/dashboard/*` — pas filtré.
12. **Polling 15s sur homepage** (promo settings) consomme beaucoup de quota Supabase si trafic important.
13. **Service-role key hardcodée dans `.env.local` commitable** : voir [section 19](#19-alertes-de-sécurité-critiques).

### 16.2 Code à refactorer
- **`LessonContentRenderer.tsx` (7382 lignes)** : monolithe ingérable. Devrait être éclaté en un fichier par phase (ou lue depuis `content/lessons/`).
- **`/dashboard/admin/page.tsx` (>1000 lignes)** : plusieurs sections devraient être des composants séparés.
- **Trois clients Supabase admin créés à la volée** dans 10+ fichiers, dupliquant `createClient(SUPABASE_URL, SERVICE_ROLE_KEY, …)`. À factoriser dans `lib/supabaseAdmin.ts` (déjà existant mais sous-utilisé).
- **Schéma DB inconsistant** : tables `phases`, `modules`, `tasks`, `lessons`, `progress` legacy à supprimer (ou réactiver cohéremment).

### 16.3 TODO / FIXME présents dans le code
**Aucun TODO/FIXME/HACK/XXX trouvé** par grep dans `app/` et `lib/` (recherche faite). Les seuls "à faire" implicites sont dans les fichiers `.md` à la racine (CHECKLIST_FINALE_LANCEMENT.md, etc.).

### 16.4 Limitations actuelles
- Une seule instance admin (1 email)
- Pas de tracking de progression élève
- Pas de certificat
- Pas de système d'avis réel
- Pas de recherche
- Pas de chat
- Pas d'API publique pour intégrations
- Contenu de cours non éditable sans déploiement
- Stripe en mode TEST (à valider sur la clé prod actuelle)
- Pas de versioning des cours

---

## 17. Historique récent

### 20 derniers commits significatifs
```
9a2bfe3 feat: split 197€ offer onto dedicated /formation-basic landing page
5ca60da feat: add 197€ e-commerce formation offer (no Telegram support)
1a2bff7 remove: delete challenge tracker feature (component, API routes, migration)
0acab3b feat: add cinematic challenge tracker to admin dashboard
296efb8 feat: add Shopify affiliate banner on homepage
21aaaa5 chore: migrate domain from lexmo.ai to ecomy.ai
d1ffeb9 style: upgrade promo card — stacked avatars viewer counter + LIVE ticker
09b6dc0 style: improve promo card visual — pulse counter, block timer, bordered section
b18d927 refactor: integrate all promo elements inside formation card
24b2e84 feat: replace popup notifications with ticker, viewer badge & live list
06f01f6 feat: redesign promo system v2 — compact counter + social proof notifications
d9fddb3 feat: add limited places promo system with countdown and auto-close
c1e8d4a feat: add Telegram help block at bottom of every phase page
8f751a4 fix: prevent crash when quiz questions not yet initialized
d10b497 feat: add quiz questions for ALL 26 phases + quiz lessons for phases 5 & 11
b39dff1 feat: add interactive quiz system for 9 phases
81569d2 feat: add Phase 26 lesson content (6 lessons)
38b6eb5 feat: add Phase 25 lesson content
df1f8d6 fix: overlay only when all slots taken, timer at 0 just blinks red
e931ecf feat: redesign cinematic slots with premium VIP style + countdown timer
```

### Dernières fonctionnalités ajoutées (chronologique récent → ancien)
1. **Split du palier 197€ sur `/formation-basic`** (commits `5ca60da`, `9a2bfe3`)
2. **Bannière affiliée Shopify** sur la homepage (`296efb8`)
3. **Migration de domaine `lexmo.ai` → `ecomy.ai`** (`21aaaa5`)
4. **Refonte v2 du système de promo cinématique** : compteur, ticker LIVE, viewers, slide animations (commits `06f01f6` → `d1ffeb9`)
5. **Bloc Telegram support** au bas de chaque phase (`c1e8d4a`)
6. **Quiz pour les 26 phases** (`b39dff1`, `d10b497`, `8f751a4`)
7. **Contenu textuel des phases 22-26** (Facebook Ads + TikTok Ads)
8. **Refactor des plans** : Spark/Emperor/Legend → Ecommerce/Diagnostic (`dddfa4f`)
9. **Mode démo admin** sur la page coaching (`e6ab704`)
10. **Lien Telegram réel** pour la communauté (`eb69593`)
11. **Intégration Google Analytics 4** (`dc7a156`)

### Sur quoi on travaillait juste avant l'audit
Le dernier commit (`9a2bfe3`) **isole le palier 197€ sur sa propre landing `/formation-basic`** plutôt que de l'avoir avec le palier 497€. Cela suggère qu'on est en phase **d'optimisation des paliers de prix** et **A/B testing des landings**.

Aucun fichier modifié non commité, aucun WIP visible.

---

## 18. État de chaque page/fonctionnalité

| Fonctionnalité | État | Fichiers concernés | Notes |
|---|---|---|---|
| Homepage 4 cartes | ✅ Terminé | [app/page.tsx](app/page.tsx) | Complète avec promo dynamique, fermeture inscriptions, bandeau Shopify |
| Landing `/formation` (497€) | ✅ Terminé | [app/formation/page.tsx](app/formation/page.tsx) | Ratings hardcodés |
| Landing `/formation-basic` (197€) | ✅ Terminé | [app/formation-basic/page.tsx](app/formation-basic/page.tsx) | Ajoutée le commit dernier |
| Landing `/diagnostic` (97€) | ✅ Terminé | [app/diagnostic/page.tsx](app/diagnostic/page.tsx) | |
| Inscription `/register` | ✅ Terminé | [app/(auth)/register/page.tsx](app/(auth)/register/page.tsx) + [actions.ts:29](app/(auth)/actions.ts#L29) | Bloquée si pas de paiement préalable |
| Connexion `/login` | ✅ Terminé | [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx) | |
| Forgot/reset password | ✅ Terminé | [app/(auth)/forgot-password/page.tsx](app/(auth)/forgot-password/page.tsx), [auth/verify](app/auth/verify/page.tsx), [reset-password](app/(dashboard)/dashboard/reset-password/page.tsx) | PKCE flow, message FR résiduel |
| Pages légales | ✅ Terminé | [app/legal/*](app/legal/) | Toggle infos société |
| Webhook Stripe | ✅ Terminé (avec fallback) | [app/api/webhooks/stripe/route.ts](app/api/webhooks/stripe/route.ts) | Email envoyé en priorité, fallback plan='spark' si CHECK échoue |
| Email Resend | ⚠️ Partiel | [lib/resend.ts](lib/resend.ts) | Sender domain non migré (`@lexmo.ai`) |
| Catalogue 26 étapes | ✅ Terminé | [phases/page.tsx](app/(dashboard)/dashboard/phases/page.tsx) | Progression hardcodée à 0% |
| Lecteur de phase | ✅ Terminé | [phases/[id]/page.tsx](app/(dashboard)/dashboard/phases/[id]/page.tsx) | YouTube iframe + overlays anti-share |
| Contenu textuel phases 1-26 | ✅ Terminé | [LessonContentRenderer.tsx](app/(dashboard)/dashboard/phases/[id]/LessonContentRenderer.tsx) | 7382 lignes ⚠️ |
| Quiz 26 phases | ✅ Terminé | [QuizRenderer.tsx](app/(dashboard)/dashboard/phases/[id]/QuizRenderer.tsx), [quizData.ts](app/(dashboard)/dashboard/phases/[id]/quizData.ts) | Score localStorage |
| Tracking de progression | ❌ Non implémenté | — | Pas de table, pas d'API |
| Certificats | ❌ Non implémenté | — | |
| Coaching diagnostic 5 steps | ✅ Terminé | [coaching/page.tsx](app/(dashboard)/dashboard/coaching/page.tsx) (973 lignes) | Mode démo admin inclus |
| Booking calendar | ✅ Terminé | [api/bookings/route.ts](app/api/bookings/route.ts), coaching page | 9h-19h, 30 jours glissants |
| Email confirmation booking | ✅ Terminé | [lib/resend.ts:112](lib/resend.ts#L112) | |
| Admin panel | ✅ Terminé | [admin/page.tsx](app/(dashboard)/dashboard/admin/page.tsx) | Massif (1000+ lignes) |
| Création manuelle d'étudiant | ✅ Terminé | [api/admin/create-student/route.ts](app/api/admin/create-student/route.ts) | Génère mot de passe |
| Toggle promo | ✅ Terminé | admin + [api/admin/settings](app/api/admin/settings/route.ts) | |
| Toggle inscriptions ouvertes | ✅ Terminé | idem | |
| Calendrier blocked slots | ✅ Terminé | [api/admin/blocked-slots](app/api/admin/blocked-slots/route.ts) | |
| Diagnostic (questions + bilan) | ✅ Terminé | [api/admin/diagnostic](app/api/admin/diagnostic/route.ts) | 3 questions hardcodées dans page admin |
| Live dashboard ventes | ✅ Terminé | [ventes-live/](app/(dashboard)/dashboard/ventes-live/), [api/live/](app/api/live/) | Reset + fix-date sans auth ⚠️ |
| Settings (mot de passe) | ✅ Terminé | [settings/page.tsx](app/(dashboard)/dashboard/settings/page.tsx) | Pas d'autres infos modifiables |
| Profil utilisateur (nom, etc.) | ❌ Non implémenté | — | |
| Suppression de compte | ❌ Non implémenté | — | |
| Affiliation | ⚠️ Schema seulement | tables `affiliates`, `commissions` | Pas d'UI |
| Codes promo | ⚠️ Generation seulement | trigger SQL | Pas de check Stripe |
| Avis & notes réels | ❌ Hardcodé | landings | |
| Recherche | ❌ Non implémenté | — | |
| i18n | ❌ Arabe seulement | — | |
| Mode sombre | ⚠️ Permanent | tailwind config | Pas de toggle |
| Tests | ❌ Aucun | — | |
| CI/CD | ❌ Aucun | — | |

---

## 19. ⚠️ Alertes de sécurité critiques

> Ces points sont importants à signaler — ils ont été observés pendant l'exploration.

### 19.1 Secrets exposés dans `.env.local` (potentiellement commit-able)
Le fichier [.env.local](.env.local) contient en clair :
- `SUPABASE_SERVICE_ROLE_KEY` (clé Postgres bypass-RLS, équivalent root DB)
- `STRIPE_SECRET_KEY` (mode test mais dangereux quand même)
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`

Le `.gitignore` exclut bien `.env*` (ligne 34) — donc en théorie pas commité — **MAIS il faut vérifier l'historique git** (`git log --all --full-history -- .env.local`) pour s'assurer qu'aucune version antérieure n'a été commitée. Tout secret exposé même brièvement doit être rotaté.

### 19.2 Endpoints API ouverts sans authentification
- `GET /api/live/reset` — n'importe qui peut reset le dashboard ventes
- `GET /api/live/fix-date` — migration ad-hoc laissée publique
- `GET /api/verify-payment?email=…` — énumération possible des emails ayant payé (utile à un attaquant pour cibler du phishing)
- `GET /api/bookings` — liste les créneaux, peu critique
- `GET /api/admin/settings` — exposé par design (homepage en a besoin) MAIS retourne tous les flags admin (`promo_*`, `registrations_*`, `show_company_info`)

### 19.3 Modèle d'autorisation fragile
- Email admin **hardcodé** en 8+ endroits (côté code TS + policies SQL)
- Aucune table `roles`, aucun système de permissions granulaires
- Si l'email admin est compromis ou perdu → reprise de contrôle = grep + replace + redéploiement (et migration SQL des policies)
- Le check d'admin est partiellement côté **client** (`/dashboard/admin`) — un attaquant qui contourne le React peut quand même voir le DOM (mais pas appeler les APIs sans auth Supabase)

### 19.4 Fallback dangereux dans le webhook Stripe
[webhook/route.ts:160-163](app/api/webhooks/stripe/route.ts#L160-L163) : si l'insert avec `plan='ecommerce'` échoue à cause de la CHECK constraint, le code retombe sur `plan='spark'`. Cela masque un bug réel et pollue silencieusement la DB avec des plans incorrects. À corriger dès que la contrainte est mise à jour.

### 19.5 Pas de rate limiting
Toutes les routes (login, signup, webhooks, admin settings) sont **sans rate limit**. Un attaquant peut tenter du brute-force sur `/login` ou marteler `/api/admin/settings` (15s polling x trafic).

### 19.6 Logs verbeux contenant des données utilisateur
[webhook/route.ts](app/api/webhooks/stripe/route.ts) contient de très nombreux `console.log` avec des emails, IDs de session, montants. En prod, ces logs Vercel sont accessibles à toute personne ayant accès au projet — pas un secret absolu mais à durcir si conformité RGPD stricte requise.

---

## 📌 Notes finales pour la prochaine instance Claude

1. **Le contenu du cours est en TypeScript hardcodé**, pas en DB. Pour modifier une leçon : éditer `app/(dashboard)/dashboard/phases/[id]/LessonContentRenderer.tsx` (7382 lignes !) ou `stepsData.ts` ou `quizData.ts`.
2. **Les noms LEXMO subsistent** dans certains fichiers (ref_codes `LEX-XXXXX`, sender Resend `noreply@lexmo.ai`, dossier du repo). Le nom commercial actuel est **ECOMY** sur **ecomy.ai**.
3. **3 paliers de prix Stripe** : 497€/197€/97€ (montants en cents : 49700/19700/9700). La détection se fait sur `session.amount_total`, **pas sur le `price_id`**.
4. **L'admin email `academyfrance75@gmail.com` est hardcodé** dans une dizaine de fichiers. À traiter comme une constante quasi-immuable.
5. **Pas de tracking de progression élève** — c'est un manque connu. Toute progression vit dans `useState` ou `localStorage`.
6. **Le système de promo cinématique homepage** mélange réel (`promo_places_prises` incrémenté par webhook Stripe) et simulé (interval × minutes écoulées). Configurable depuis `/dashboard/admin`.
7. **Coaching diagnostic** = parcours 5 étapes (form → calendrier → countdown → diagnostic admin → validation client) propre à `plan='diagnostic'`.
8. **Beaucoup de SQL ad-hoc à la racine** (`force_fix_*.sql`, `fix_*.sql`, `seed_*.sql`) — vestiges de migrations manuelles. Les migrations actives sont dans `supabase/migrations/`.
9. **Les composants `app/components/{Hero,Navbar,Pricing,...}.tsx`** sont **legacy** (ancienne homepage). La homepage actuelle ([app/page.tsx](app/page.tsx)) est entièrement self-contained.
10. **Avant toute modif sur les routes `/api/live/*`** : noter que `/reset` et `/fix-date` sont ouverts publiquement — cela peut être intentionnel (cron externe sans secret) ou un oubli. Vérifier avec le propriétaire.

---

*Fin du rapport — généré par exploration manuelle exhaustive du codebase au 26 avril 2026.*
