# 🛠️ GUIDE DE RÉPARATION : STRIPE WEBHOOKS

Ton code est réparé (l'endpoint existe), mais **Vercel ne connaît pas encore tes mots de passe Stripe**. 
Il faut connecter les clés pour que la sécurité fonctionne.

Suis ces 3 étapes simples :

---

## ÉTAPE 1 : Récupérer tes clés sur Stripe

1. Connecte-toi à ton [Dashboard Stripe](https://dashboard.stripe.com).
2. Vérifie que tu es en mode **Test** (bouton en haut à droite) ou **Live** selon ce que tu utilises.
3. Va dans **Développeurs** > **Clés API**.
   - Copie la **Clé secrète** (`sk_test_...` ou `sk_live_...`).
   - 👉 C'est ta clé `STRIPE_SECRET_KEY`.

4. Va dans **Développeurs** > **Webhooks**.
   - Clique sur l'URL `https://lexmo-saas-ai.vercel.app/api/webhooks/stripe`.
   - Clique sur **"Révéler le secret de signature"** (en haut à droite).
   - Copie cette clé qui commence par `whsec_...`.
   - 👉 C'est ta clé `STRIPE_WEBHOOK_SECRET`.

---

## ÉTAPE 2 : Ajouter les clés sur Vercel

1. Connecte-toi à [Vercel](https://vercel.com).
2. Va dans ton projet **lexmo-saas-ai**.
3. Clique sur l'onglet **Settings** (en haut).
4. Clique sur **Environment Variables** (à gauche).

Ajoute ces 2 nouvelles variables :

| Key (Nom) | Value (Valeur) |
| :--- | :--- |
| `STRIPE_SECRET_KEY` | Colle ta clé `sk_...` ici |
| `STRIPE_WEBHOOK_SECRET` | Colle ta clé `whsec_...` ici |

> **Important :** Décoche les cases si tu veux, mais assure-toi qu'elles sont cochées pour **Production**.

---

## ÉTAPE 3 : Redéployer (CRUCIAL !)

Pour que Vercel prenne en compte ces nouveaux mots de passe, il faut redémarrer le site.

1. Toujours sur Vercel, va dans l'onglet **Deployments**.
2. Clique sur les **3 petits points** (⋮) à droite de ton dernier déploiement (celui en haut de la liste).
3. Clique sur **Redeploy**.
4. Valide.

⏳ Attends 2-3 minutes que ça finisse.

---

## ✅ C'EST FINI !

Stripe va réessayer d'envoyer les webhooks. Les prochaines tentatives afficheront **"200 OK"** en vert sur ton dashboard Stripe.

**Besoin d'aide ?** Je suis là. 🚀
