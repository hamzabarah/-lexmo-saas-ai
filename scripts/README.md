# 🚀 Script d'Injection de Leçons - Guide d'Utilisation

## 📦 Installation

### 1. Installer les dépendances
```bash
npm install gray-matter tsx --save-dev
```

### 2. Configurer les variables d'environnement

Ajoute ces lignes dans `.env.local` :
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> ⚠️ **Important** : Utilise la **service role key**, pas la clé publique (anon)!

---

## 📁 Structure des Fichiers

Crée cette structure :
```
lexmo-saas-ai/
├── content/
│   └── lessons/
│       ├── phase-1/
│       │   ├── module-01/
│       │   │   ├── lesson-01.md
│       │   │   ├── lesson-02.md
│       │   │   └── ...
│       │   ├── module-02/
│       │   └── ...
│       └── phase-2/
└── scripts/
    └── inject-lessons.ts
```

---

## 📝 Format des Fichiers Markdown

Chaque fichier de leçon doit suivre ce format :

```markdown
---
phase: 1
module: 1
lesson: 1
title_ar: "أنت لست بائعاً، أنت سفير 2.0"
title_en: "You're Not a Seller, You're an Ambassador 2.0"
duration_minutes: 15
difficulty: "easy"
badge: "📚"
---

# 🎯 هدف الدرس
Comprendre que tu n'es pas un simple vendeur, mais un ambassadeur de la marque...

## 📚 المحتوى الرئيسي
[Ton contenu principal ici...]

## ✅ النقاط الأساسية
1. Point clé 1
2. Point clé 2
3. Point clé 3

## 🎬 الإجراء الفوري
- [ ] Tâche 1 à accomplir
- [ ] Tâche 2 à accomplir
- [ ] Tâche 3 à accomplir

## 📝 تمرين عملي
[Exercice pratique...]
```

---

## 🎯 Utilisation

### Test (Dry Run)
Vérifie que tout est OK sans modifier la BDD :
```bash
npm run inject-lessons:dry-run
```

### Injecter UN module (Test)
```bash
npm run inject-lessons:module=1
```

### Injecter TOUT
```bash
npm run inject-lessons
```

---

## 📊 Exemple de Sortie

```
🚀 Starting lesson injection...

📂 Found 12 markdown files

[1/12] Processing: lesson-01-01.md
   Module 1, Lesson 1: أنت لست بائعاً، أنت سفير 2.0
   ✅ Success

[2/12] Processing: lesson-01-02.md
   Module 1, Lesson 2: لماذا الدروبشيبينغ هو الخيار الأفضل؟
   ✅ Success

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 INJECTION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Successful: 12
❌ Failed: 0
📁 Total: 12

🎉 Injection complete!
```

---

## 🛡️ Gestion des Erreurs

Le script gère automatiquement :
- ✅ Fichiers markdown malformés
- ✅ Leçons inexistantes dans la BDD
- ✅ Erreurs réseau Supabase
- ✅ Champs manquants

**Si une leçon échoue, les autres continuent !**

---

## 💡 Conseils

### 1. Commencer petit
```bash
# Crée 2-3 leçons
# Teste avec dry-run
npm run inject-lessons:dry-run

# Si OK, injecte
npm run inject-lessons:module=1
```

### 2. Vérifier sur Vercel
Après injection, va sur :
```
https://lexmo-saas-ai.vercel.app/dashboard/phases/1/units/1/lessons/1
```

### 3. Injecter par batch
```bash
# Modules 1-5
npm run inject-lessons:module=1
npm run inject-lessons:module=2
...

# Ou tout d'un coup
npm run inject-lessons
```

---

## 🔧 Dépannage

### Erreur "Missing environment variables"
→ Vérifie que `.env.local` contient bien les clés Supabase

### Erreur "Module not found"
→ Assure-toi que les modules existent dans Supabase
→ Vérifie que `phase` et `module` dans le frontmatter sont corrects

### Erreur "Lesson not found"
→ Assure-toi que les leçons vides existent déjà dans Supabase
→ Si non, exécute d'abord les scripts SQL de création

---

## 🎉 Prêt à Injecter !

1. ✅ Crée tes fichiers markdown
2. ✅ Lance `npm run inject-lessons:dry-run`
3. ✅ Si OK, lance `npm run inject-lessons`
4. ✅ Vérifie sur Vercel
5. ✅ Répète pour les 500+ leçons !

**Bon courage ! 🚀**
