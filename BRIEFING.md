# BRIEFING — Projet ECOMY

> Document d'accueil pour une instance Claude sans aucun contexte préalable. Rédigé le 23/08/2026.
> Factuel. Pour le détail exhaustif (modèle de données, sécurité, dette technique), voir [PROJECT_STATE.md](PROJECT_STATE.md).
>
> **Règle de vérification** : ne jamais inférer l'état de la production à partir de fichiers locaux. `.env.local` est ignoré par git et ne dit rien de la configuration Vercel. Toute affirmation sur la production doit s'appuyer sur un comportement observé. Si une information n'est pas vérifiable depuis le dépôt, l'écrire comme non vérifiée plutôt que de conclure.

---

## 1. En bref

**ECOMY** est une plateforme de formation en ligne au e-commerce, **en arabe**, vendue à des débutants du monde arabophone. Un client paie une fois, reçoit un accès à vie à une formation vidéo de 26 étapes, et selon l'offre, un accompagnement personnalisé.

Le dépôt s'appelle `lexmo-saas-ai` et le package `temp_app` : ce sont des noms historiques. Le produit s'appelait **LEXMO.AI** jusqu'au 4 mars 2026, il s'appelle **ECOMY** depuis. On croise encore des traces de l'ancien nom dans le code (codes de parrainage `LEX-XXXXX`, nom du compte Stripe).

Domaine de production : **www.ecomy.ai**.

---

## 2. Le produit

### Ce qu'il fait
- **Une formation e-commerce** : 26 phases, 136 leçons dont 84 vidéos YouTube intégrées, plus des quiz. Sujets : choix de produit, ouverture d'une boutique Shopify, publicité Facebook et TikTok. Le contenu est en **arabe** (mélange de fusha et de darija marocaine).
- **Un accompagnement individuel** : un parcours de diagnostic business avec une session de 45 minutes en visioconférence, puis un bilan et un plan d'action écrits par l'administrateur.
- **Un blog SEO** : 326 articles en arabe, réparties en 11 catégories. C'est le canal par lequel arrivent les visiteurs depuis les moteurs de recherche.

### À qui il s'adresse
Débutants arabophones voulant se lancer dans le e-commerce ou le dropshipping. Deux populations :
- le **Maghreb et le Moyen-Orient** : Maroc, Algérie, Tunisie, Arabie Saoudite, Émirats, Koweït, Qatar, Bahreïn, Oman, Égypte, Irak, Jordanie, Libye, Liban, Syrie, Yémen, Soudan, Mauritanie, Palestine ;
- la **diaspora en Europe et Amérique du Nord** : France, Belgique, Espagne, Italie, Allemagne, Pays-Bas, Royaume-Uni, Suède, Canada, Australie.

Toute l'interface est en arabe, en **RTL** (`<html lang="ar" dir="rtl">`). Il n'y a pas de système d'internationalisation : c'est mono-langue par construction.

### L'équipe
Une seule personne : le propriétaire, qui est aussi l'unique administrateur. Il n'existe pas de table de rôles — être administrateur, c'est avoir une adresse e-mail précise, comparée en dur dans une dizaine de fichiers.

---

## 3. Stack technique

| Domaine | Choix |
|---|---|
| Framework | **Next.js 16.1.3**, App Router, React 19.2.3, TypeScript 5 |
| Style | **Tailwind CSS v4** — ⚠️ la config vit dans [app/globals.css](app/globals.css) (`@plugin`, `@theme`). Le fichier `tailwind.config.ts` à la racine **n'est pas chargé** en v4, le modifier n'a aucun effet |
| Base de données | **Supabase** (Postgres managé), sans ORM. RLS activée partout, mais le code serveur utilise la clé service-role et refait le contrôle d'accès en TypeScript |
| Authentification | **Supabase Auth** (e-mail + mot de passe, magic link, PKCE pour le reset). Pas d'OAuth, pas de 2FA |
| Paiement | **Stripe**, par Payment Links statiques (voir §5) |
| E-mail | **Resend** — deux e-mails transactionnels seulement |
| Blog | **MDX** lu depuis le disque (`content/blog/`), rendu par `next-mdx-remote`, front-matter parsé par `gray-matter` |
| Vidéo | iFrames `youtube-nocookie.com`. Aucun fichier n'est hébergé |
| Hébergement | **Vercel**, déploiement automatique à chaque push sur `main`. Aucun fichier de CI/CD dans le dépôt |
| Analytics | Google Analytics 4 |
| Divers | Framer Motion, lucide-react, chart.js, react-markdown |

**Il n'y a aucun test automatisé.** La vérification avant déploiement consiste à lancer `npx tsc --noEmit`, `npx next build`, puis à tester manuellement, souvent avec `curl` contre la production.

**Il n'y a pas de Supabase CLI configurée.** Les migrations SQL de `supabase/migrations/` sont appliquées **à la main** dans l'éditeur SQL de Supabase. C'est une étape facile à oublier : du code déployé qui attend une table absente échoue en 500, parfois silencieusement.

### Où est quoi
```
app/(auth)/            login, register, forgot-password, payment-success + Server Actions
app/(dashboard)/       tout l'espace membre et l'admin
app/api/               25 route handlers
app/blog/              index, article, page-catégorie
components/            composants hors App Router (blog, témoignages, liens d'accès)
lib/                   logique métier : blog, abonnement, liens d'accès, admin-auth, e-mail
utils/supabase/        clients Supabase (navigateur, serveur, middleware)
middleware.ts          domaine canonique, session, protection de /dashboard, liens d'accès
content/blog/          326 fichiers .mdx
supabase/migrations/   13 migrations
```

**Le contenu de la formation n'est pas en base.** Il est écrit en dur en TypeScript :
- `app/(dashboard)/dashboard/phases/stepsData.ts` — catalogue des leçons (583 lignes)
- `app/(dashboard)/dashboard/phases/[id]/LessonContentRenderer.tsx` — tout le texte des leçons (**7382 lignes**)
- `app/(dashboard)/dashboard/phases/[id]/quizData.ts` — les quiz (1195 lignes)

Modifier une leçon exige donc un déploiement.

---

## 4. Pages publiques

| URL | Ce qu'elle contient |
|---|---|
| `/` | Accueil : grille de cartes vers les trois offres, compteur de promotion animé, bandeau d'affiliation Shopify |
| `/formation` | Page de vente de la formation complète à 497 € |
| `/formation-basic` | Page de vente de la formation sans accompagnement à 197 €. **Exclue de l'index** dans `robots.ts` |
| `/diagnostic` | Page de vente du diagnostic business à 97 € |
| `/a-propos` | Page de présentation |
| `/blog` | Index du blog, articles groupés par thème |
| `/blog/[slug]` | Un article (326 existants, pré-générés au build) |
| `/blog/categorie/[cat]` | Page-catégorie, 11 catégories, sert au maillage interne |
| `/avis-preview` | Prévisualisation de témoignages. Exclue de l'index |
| `/legal/terms` | Conditions générales. ⚠️ **Seule page légale existante** — `sitemap.ts` déclare aussi `/legal/privacy` et `/legal/refund`, qui n'existent plus et renvoient 404 |
| `/login`, `/register`, `/forgot-password` | Authentification |
| `/payment-success` | Page de remerciement après paiement |
| `/auth/verify`, `/auth/auth-code-error` | Traitement des liens magiques et du flux PKCE |

`sitemap.ts` et `robots.ts` sont générés dynamiquement. L'apex `ecomy.ai` est redirigé en 301 vers `www.ecomy.ai` par le middleware.

---

## 5. L'encaissement

C'est le point le plus contre-intuitif du projet : **l'application ne crée aucune session de paiement.**

### Le circuit
```
1. Le visiteur clique sur le bouton d'achat d'une page de vente.
2. Il est envoyé vers une URL Stripe fixe (Payment Link), écrite en dur dans le code :
      app/formation/page.tsx        → 497 €
      app/formation-basic/page.tsx  → 197 €
      app/diagnostic/page.tsx       →  97 €
3. Il paie sur une page hébergée par Stripe. L'application n'est pas dans la boucle.
4. Stripe émet l'événement checkout.session.completed.
5. POST /api/webhooks/stripe le reçoit et fait, dans cet ordre :
      a. envoie l'e-mail d'activation via Resend (en priorité)
      b. insère ou met à jour une ligne dans user_subscriptions
      c. incrémente le compteur de la promotion, la ferme si elle est pleine
6. Le client clique le lien de l'e-mail → /register?email=...
7. signup() REFUSE de créer le compte s'il n'existe pas déjà une ligne
   user_subscriptions pour cet e-mail. Le paiement doit donc précéder l'inscription.
8. /dashboard redirige selon le plan : diagnostic → /dashboard/coaching,
   sinon → /dashboard/phases.
```

### Les trois offres

| Offre | Prix | Valeur en base (`plan`) | Détection |
|---|---|---|---|
| Formation complète | 497 € | `ecommerce` | montant `49700` |
| Formation sans accompagnement | 197 € | `ecommerce_basic` | montant `19700` |
| Diagnostic business | 97 € | `diagnostic` | montant `9700` |

**Le plan est déduit du montant payé** (`session.amount_total`), pas d'un identifiant de produit Stripe. Changer un prix sans toucher au webhook casse l'attribution du plan.

### Conséquences à connaître
- Le mode (test ou production) des Payment Links est défini **dans le tableau de bord Stripe**, pas par une variable de ce dépôt. Il n'est pas déterminable depuis le code.
- `STRIPE_SECRET_KEY` ne sert qu'à instancier le SDK dans le webhook, et la seule méthode appelée dessus est `webhooks.constructEvent` — une vérification de signature locale qui n'appelle pas l'API Stripe.
- La variable qui compte vraiment est `STRIPE_WEBHOOK_SECRET` : si elle ne correspond pas au bon endpoint, la signature échoue, le webhook répond 400, et le client paie **sans recevoir d'e-mail ni obtenir d'accès**.
- La contrainte `CHECK` sur `plan` autorise encore trois valeurs héritées (`spark`, `emperor`, `legend`). 8 lignes portent `spark` : ce sont des inscriptions du 9 au 25 mars 2026, période où le webhook écrivait cette valeur en dur. Elles ouvrent les mêmes droits que `ecommerce`, sans conséquence.

---

## 6. Espace membre

Trois profils, déduits à la volée — il n'y a pas de table de rôles :

| Profil | Détection | Accès |
|---|---|---|
| Administrateur | l'e-mail de l'utilisateur vaut l'adresse admin, en dur | tout |
| Élève formation | `plan` vaut `ecommerce`, `ecommerce_basic` (ou une valeur héritée) | `/dashboard/phases/*` |
| Client diagnostic | `plan` vaut `diagnostic` | `/dashboard/coaching` |

Pages de l'élève : `/dashboard/phases` (grille des 26 étapes), `/dashboard/phases/[id]` (lecteur vidéo + liste des leçons), `/dashboard/coaching` et `/dashboard/coaching/questionnaire`, `/dashboard/settings` (mot de passe uniquement).

La progression est réelle : elle est enregistrée en base, avec complétion automatique d'une vidéo à 90 % de sa durée estimée, cumul du temps passé et conservation du meilleur score de quiz.

### Deux voies d'accès coexistent
1. **La session** : cookie Supabase, le cas normal.
2. **Le lien d'accès** : une URL contenant `?access=<token>` ouvre la formation **sans compte et sans cookie**. Mécanisme construit en août 2026 pour débloquer un client payant dont la session n'atteignait jamais le serveur. Le token est lu dans l'URL à chaque requête ; il ne doit jamais être transformé en cookie, puisque c'est précisément le cookie qui était défaillant. Le périmètre est limité par liste blanche à `/dashboard/phases*`.

> **Piège rencontré, à ne pas refaire** : le composant `<Link>` de Next navigue avec le `href` de ses props React, **jamais avec l'attribut `href` du DOM**. Réécrire l'attribut pour y ajouter le token ne change donc rien à la navigation client. La solution en place intercepte le clic en phase de capture sur `document`, avant React.

---

## 7. Pages d'administration

Tout tient dans **une seule page**, `/dashboard/admin` (1716 lignes), plus deux pages annexes. Le contrôle d'accès de la page est côté client, mais **toutes les routes API sous-jacentes vérifient la session côté serveur**.

### `/dashboard/admin` — les sections, dans l'ordre d'affichage

| Section | Ce qu'elle affiche |
|---|---|
| **Statistiques** | Nombre total d'élèves, élèves actifs, comptes en attente d'activation |
| **Réglages du site** | Deux interrupteurs : afficher ou non les informations de société sur les pages légales, ouvrir ou fermer les inscriptions sur l'accueil |
| **Promotion** | Pilotage de la promotion animée de l'accueil : activation, nombre de places total, places déjà prises, durée en heures, intervalle en minutes du compteur simulé |
| **Ajouter un élève** | Formulaire nom / e-mail / plan (497 € ou diagnostic). Crée le compte d'authentification et l'abonnement actif, puis **affiche le mot de passe généré** à transmettre |
| **Table des membres** | E-mail, nom, téléphone, pays, plan, statut, date d'inscription, actions (activer / désactiver l'abonnement) |
| **Calendrier hebdomadaire** | Grille des créneaux par semaine, navigation d'une semaine à l'autre, blocage ou déblocage d'un créneau au clic |
| **Réservations** | Client, date de la séance, statut, actions |
| **Clients coaching** | E-mail, nom, adresse Google Meet, étape atteinte dans le parcours (1 à 5), date de séance, statut |
| **Liens d'accès** | Création d'un lien (libellé + durée 7/30/90/365 jours), puis pour chaque lien : nombre d'ouvertures, **nombre d'adresses IP distinctes** (surligné dès 2, signe qu'un lien circule), dernière utilisation, bouton de copie, activation/désactivation immédiate |
| **Diagnostic v2** | Liste des questionnaires de 180 questions, avec leur statut (en cours, envoyé, en analyse, bilan publié, plan publié, en exécution). Permet de rédiger le bilan et le plan en Markdown, de les publier séparément, et de suivre les étapes du projet du client |
| **Fenêtre de diagnostic (v1)** | Ouverte depuis la table des clients coaching : réponses du client, rédaction du bilan en quatre champs, publication |

### `/dashboard/ventes-live`
Tableau de bord des ventes en direct : places disponibles et restantes, total des gains du jour, nombre de ventes, dernière vente, graphique de croissance des revenus. Les données sont poussées depuis l'extérieur par `POST /api/live/update`.

Réservée à l'administrateur. Le contrôle est fait **côté serveur, avant la lecture des données** : la page est un Server Component, un contrôle côté client aurait laissé les chiffres dans le HTML envoyé au visiteur, simplement masqués à l'affichage. Un non-administrateur voit l'écran `الوصول مقيد`, comme sur les pages `focus`.

### `/dashboard/focus` et `/dashboard/focus/stats`
Minuteur de concentration à usage personnel de l'administrateur : session en cours, sessions du jour, saisie de ce qui a été accompli, tâches et sous-tâches. La page de statistiques montre l'activité quotidienne et la répartition par catégorie. Ces deux pages vérifient l'e-mail administrateur côté client.

---

## 8. En chantier

### Terminé et vérifié en production
Paiement et activation, authentification, formation complète, suivi de progression, blog et son SEO, coaching v1 et diagnostic v2, module focus, panneau d'administration, système de liens d'accès.

### En cours
- **Le parcours complet d'un porteur de lien d'accès** n'a pas encore été validé de bout en bout par un humain : ouvrir le lien, cliquer une phase, cliquer un chapitre, lancer une vidéo. Les étages ont été vérifiés séparément et la base montre 4 liens créés, 120 usages et 9 leçons cochées — mais la chaîne n'a pas été parcourue dans un vrai navigateur.
- **Un client sans trace de paiement** : `abdel063552@gmail.com`, abonnement actif depuis mars, zéro leçon, zéro réservation, zéro profil coaching, et aucune trace chez Stripe sous cet e-mail. Cas à éclaircir avec le propriétaire.

### Défauts connus, non corrigés
| Sujet | Détail |
|---|---|
| `/dashboard/phases/[id]` | **Aucun contrôle d'abonnement.** Tout utilisateur connecté, même sans abonnement actif, lit toute la formation en tapant l'URL. Le contrôle n'existe que sur la page d'index |
| `app/sitemap.ts` | Déclare `/legal/privacy` et `/legal/refund`, qui n'existent plus : deux 404 soumis aux moteurs |
| `/api/live/update` | Protégé par un en-tête secret, mais avec une **valeur de repli écrite en dur dans le fichier**, donc présente dans le dépôt |
| Webhook Stripe | Contient un repli qui écrit `plan='spark'` si l'insertion échoue. Il n'a jamais tiré, mais masquerait un vrai bug le jour où il tirerait |
| Migration `20260318_coaching_system` | Partiellement appliquée : `availability_slots` et `bookings.product_type` existent, mais `telegram_link` et `admin_notes` sont absentes. Sans impact, le code ne les utilise pas |

### Dette technique principale
`LessonContentRenderer.tsx` (7382 lignes) et `admin/page.tsx` (1716 lignes) sont deux monolithes à découper. La dépendance `zustand` est totalement inutilisée. Neuf tables héritées ne servent plus. Aucun test, aucune automatisation des migrations.

---

## 9. Repères pour démarrer

1. **Le contenu de la formation est en TypeScript**, le blog en MDX. Rien de tout cela n'est en base.
2. **Ne pas toucher `tailwind.config.ts`**, il est inerte. La configuration est dans `app/globals.css`.
3. **L'assistant d'intégration YouTube découpe l'URL sur `v=`** : lui passer une URL de la forme `watch?v=<ID>`, jamais `youtu.be/<ID>`.
4. **Deux voies d'accès coexistent** — session et lien d'accès. Toute modification du middleware ou du contrôle d'abonnement doit préserver les deux.
5. **Vérifier qu'une migration a été appliquée** avant de conclure qu'une fonctionnalité est cassée.
6. **`GET /api/check-subscription` est la sonde de déploiement** : elle renvoie le SHA du build, l'environnement et la référence Supabase, sans authentification. C'est le moyen de savoir si un push est réellement en ligne.
7. **Ne jamais authentifier un administrateur sur une valeur envoyée par l'appelant** (corps de requête, en-tête). Utiliser [lib/admin-auth.ts](lib/admin-auth.ts). Cette faille a existé et a été fermée.
8. **Ce document et `PROJECT_STATE.md` ne sont pas des sources de vérité automatiques.** Une version antérieure affirmait que `/dashboard` était protégé alors qu'il ne l'était pas. Vérifier contre le code.
