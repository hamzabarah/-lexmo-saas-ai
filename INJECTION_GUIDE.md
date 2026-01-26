# 🚀 GUIDE D'INJECTION DES LEÇONS

## ✅ **PROCÉDURE COMPLÈTE**

### **Étape 1 : Préparer les fichiers**

Place tes fichiers markdown dans la structure suivante :

```
content/lessons/
└── phase-1/
    └── module-01/
        ├── lesson-01.md ✅ (déjà fait)
        ├── lesson-02.md ← NOUVEAU
        ├── lesson-03.md ← NOUVEAU
        ├── ...
        └── lesson-12.md ← NOUVEAU
```

---

### **Étape 2 : Vérifier le format**

Chaque fichier DOIT avoir ce format :

```markdown
---
phase: 1
module: 1
lesson: 2  ← IMPORTANT : doit correspondre au numéro du fichier
title_ar: "Titre de la leçon"
title_en: "Lesson Title"
duration_minutes: 30
difficulty: "beginner"
badge: "🎯"
---

# 🎯 هدف الدرس
[Contenu...]

# 🎬 الإجراء الفوري
- [ ] Tâche 1
- [ ] Tâche 2
[...]
```

---

### **Étape 3 : Exécuter le script**

#### **Option A : Injecter tout le Module 1**
```bash
npm run inject-lessons
```

#### **Option B : Injecter avec filtres**
```bash
# Seulement Phase 1, Module 1
npx tsx scripts/inject-lessons.ts --phase=1 --module=1

# Dossier personnalisé
npx tsx scripts/inject-lessons.ts --dir=content/lessons/phase-2/module-05
```

---

## 📊 **CE QUE LE SCRIPT FAIT AUTOMATIQUEMENT**

1. ✅ Scanne tous les fichiers `.md` dans le dossier
2. ✅ Lit et parse le frontmatter (métadonnées)
3. ✅ Trouve le `module_id` correspondant en base
4. ✅ Insère ou met à jour la leçon dans la table `lessons`
5. ✅ Extrait toutes les lignes `- [ ]` (checkboxes)
6. ✅ Insère les tâches dans la table `tasks`
7. ✅ Affiche un résumé complet

**Tu n'as RIEN d'autre à faire !**

---

## 🎯 **EXEMPLE DE SORTIE**

```
============================================================
📚 LESSON INJECTION SCRIPT
============================================================
Directory: content/lessons/phase-1/module-01
============================================================

📚 Found 12 lesson files

📖 Injecting: Phase 1, Module 1, Lesson 2
   Title: لماذا يفشل 99% من المسوقين بالعمولة
   ✅ Lesson inserted successfully!
   🔍 Found 8 tasks
   ✅ 8 tasks injected

📖 Injecting: Phase 1, Module 1, Lesson 3
   Title: سيكولوجية المال عبر الإنترنت
   ✅ Lesson inserted successfully!
   🔍 Found 10 tasks
   ✅ 10 tasks injected

[... etc ...]

============================================================
🎉 COMPLETE!
   Lessons injected: 11
   Total tasks: 95
============================================================
```

---

## ⚠️ **CHECKLIST AVANT D'EXÉCUTER**

- [ ] Tous les fichiers sont dans `content/lessons/phase-1/module-01/`
- [ ] Noms de fichiers : `lesson-02.md`, `lesson-03.md`, etc.
- [ ] Chaque fichier a le frontmatter complet
- [ ] Les numéros de leçons correspondent (`lesson: 2` pour `lesson-02.md`)
- [ ] Le serveur de dev tourne (`npm run dev` dans un autre terminal)

---

## 🔧 **DÉPANNAGE**

### Erreur : "Module not found"
→ Vérifie que le module existe en base (Module 1 de Phase 1 doit exister)

### Erreur : "Lesson already exists"
→ Normal ! Le script va mettre à jour la leçon existante

### Erreur : "No tasks found"
→ Vérifie que tu as bien des lignes `- [ ]` dans le markdown

### Les tâches ne s'affichent pas
→ Attends 2-3 secondes et rafraîchis la page du dashboard

---

## 🚀 **PRÊT À LANCER ?**

1. ✅ Places tes 11 fichiers dans `content/lessons/phase-1/module-01/`
2. ✅ Exécute : `npm run inject-lessons`
3. ✅ Attends 30 secondes
4. ✅ **C'EST FAIT !** 🎉

Teste sur : https://lexmo-saas-ai.vercel.app/dashboard/phases/1/units/1

---

**DIS-MOI QUAND TU ES PRÊT ET ON LANCE ! 🚀**
