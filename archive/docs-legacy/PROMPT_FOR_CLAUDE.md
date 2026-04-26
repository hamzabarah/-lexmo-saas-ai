# 📚 PROMPT POUR CLAUDE - CRÉATION DES 500 LEÇONS

Copie-colle ce prompt à Claude pour qu'il crée les leçons dans le format exact :

---

## 🎯 MISSION

Tu es un expert en création de contenu pédagogique pour un programme de formation e-commerce en arabe. Tu vas créer des leçons au format Markdown qui seront automatiquement injectées dans une plateforme d'apprentissage.

---

## 📋 FORMAT OBLIGATOIRE

Chaque leçon DOIT suivre EXACTEMENT ce format :

```markdown
---
phase: [NUMÉRO]
module: [NUMÉRO]
lesson: [NUMÉRO]
title_ar: "[TITRE EN ARABE]"
title_en: "[TITRE EN ANGLAIS]"
duration_minutes: [DURÉE]
difficulty: "[beginner|intermediate|advanced]"
badge: "[EMOJI]"
---

# 🎯 هدف الدرس

[Un paragraphe décrivant ce que l'étudiant va apprendre - minimum 100 mots]

---

# 📚 المحتوى الرئيسي

[Contenu détaillé de la leçon - minimum 3000 mots]

## [Sous-section 1]

[Contenu...]

## [Sous-section 2]

[Contenu...]

[...etc...]

---

# ✅ النقاط الأساسية

🔑 **Point clé 1** - [Explication]

💎 **Point clé 2** - [Explication]

🎯 **Point clé 3** - [Explication]

[Minimum 5 points clés]

---

# 🎬 الإجراء الفوري

**افعل هذا الآن، قبل الانتقال للدرس التالي:**

- [ ] [Tâche concrète et actionnable 1]
- [ ] [Tâche concrète et actionnable 2]
- [ ] [Tâche concrète et actionnable 3]
- [ ] [Tâche concrète et actionnable 4]
- [ ] [Tâche concrète et actionnable 5]

[Minimum 3 tâches, maximum 10]

---

# 📝 تمرين عملي

## التمرين: [Nom de l'exercice]

[Description détaillée de l'exercice pratique avec instructions claires]

[Exemple de format attendu si applicable]

---

# ✅ قائمة التحقق من الفهم

قبل الانتقال إلى الدرس التالي، تأكد من أنك تستطيع الإجابة بـ "نعم" على جميع هذه النقاط:

- [ ] **[Compétence/compréhension 1]**
- [ ] **[Compétence/compréhension 2]**
- [ ] **[Compétence/compréhension 3]**
- [ ] **[Compétence/compréhension 4]**
- [ ] **[Compétence/compréhension 5]**

[Minimum 5 items de vérification]

---

# 🚀 أنت الآن جاهز للدرس التالي!

[Phrase de conclusion motivante + teaser du prochain cours]

**مبروك على إتمام الدرس [NUMÉRO]! 🎉**
```

---

## ⚠️ RÈGLES CRITIQUES À RESPECTER

### 1. FRONTMATTER (En-tête YAML)
- ✅ TOUJOURS entre `---` au début du fichier
- ✅ `phase`, `module`, `lesson` = nombres entiers
- ✅ `title_ar` = titre en arabe entre guillemets
- ✅ `title_en` = titre en anglais entre guillemets (optionnel mais recommandé)
- ✅ `duration_minutes` = durée estimée (15-45 minutes généralement)
- ✅ `difficulty` = exactement "beginner" OU "intermediate" OU "advanced"
- ✅ `badge` = Un seul emoji pertinent

### 2. CHECKLISTS (TRÈS IMPORTANT!)
- ✅ Format EXACT : `- [ ] Texte de la tâche`
- ✅ UN ESPACE entre `-` et `[`
- ✅ UN ESPACE entre `]` et le texte
- ✅ PAS de `*` ou `+`, seulement `-`
- ❌ FAUX : `-[ ] Tâche` ou `- []Tâche` ou `* [ ] Tâche`
- ✅ JUSTE : `- [ ] Tâche`

### 3. SECTIONS OBLIGATOIRES
Chaque leçon DOIT contenir dans cet ordre :
1. 🎯 هدف الدرس
2. 📚 المحتوى الرئيسي
3. ✅ النقاط الأساسية
4. 🎬 الإجراء الفوري
5. 📝 تمرين عملي
6. ✅ قائمة التحقق من الفهم
7. 🚀 Conclusion

### 4. LONGUEUR DU CONTENU
- ✅ Objectif : 100-200 mots
- ✅ Contenu principal : 3000-5000 mots
- ✅ Points clés : 5-8 points
- ✅ Actions immédiates : 3-10 tâches
- ✅ Checklist compréhension : 5-10 items

### 5. STYLE D'ÉCRITURE
- ✅ Ton conversationnel mais professionnel
- ✅ Utilise des exemples concrets
- ✅ Inclus des tableaux de comparaison quand pertinent
- ✅ Utilise des emojis pour rendre visuellement attractif
- ✅ Structuré avec des sous-titres clairs
- ✅ Évite le jargon technique non expliqué

---

## 📊 EXEMPLE COMPLET D'UNE LEÇON

```markdown
---
phase: 1
module: 1
lesson: 2
title_ar: "لماذا يفشل 99% من المسوقين بالعمولة"
title_en: "Why 99% of Affiliate Marketers Fail"
duration_minutes: 25
difficulty: "beginner"
badge: "⚠️"
---

# 🎯 هدف الدرس

في نهاية هذا الدرس، ستفهم الأخطاء القاتلة التي تؤدي إلى فشل معظم المسوقين بالعمولة، وكيف تتجنبها من اليوم الأول. ستتعلم لماذا النجاح في التسويق بالعمولة ليس عن الحظ، بل عن تطبيق استراتيجيات مثبتة وتجنب الفخاخ الشائعة.

---

# 📚 المحتوى الرئيسي

## 📉 الإحصائية المخيفة

الحقيقة الصادمة: أكثر من 99% من المسوقين بالعمولة يفشلون في تحقيق دخل مستدام. لماذا؟

[... 3000+ mots de contenu détaillé ...]

## ❌ الخطأ الأول: عدم بناء الثقة

معظم المسوقين يبدأون بالبيع من اليوم الأول...

[... etc ...]

---

# ✅ النقاط الأساسية

🔑 **99% يفشلون لأنهم يركزون على البيع بدلاً من بناء الثقة** - الثقة تأتي أولاً، المبيعات ثانياً

💎 **النجاح يحتاج لنظام، ليس للحظ** - اتبع استراتيجية واضحة ومثبتة

🎯 **الصبر هو المفتاح** - النتائج تأخذ وقتاً، لا تستسلم مبكراً

---

# 🎬 الإجراء الفوري

**افعل هذا الآن، قبل الانتقال للدرس التالي:**

- [ ] اكتب قائمة بـ 3 أخطاء كنت تفعلها أو كادت أن تفعلها
- [ ] حدد الخطأ الأكبر الذي تريد تجنبه
- [ ] اكتب خطة عمل لتطبيق درس اليوم
- [ ] شارك التزامك مع شخص واحد لمحاسبتك

---

# 📝 تمرين عملي

## التمرين: تحليل حالة فشل

فكر في مسوق بالعمولة تعرفه فشل أو شاهدته على السوشيال ميديا. حلل:

1. ما الأخطاء التي ارتكبها؟
2. كيف كان يمكنه تجنبها؟
3. ما الدروس المستفادة؟

**اكتب إجاباتك في دفترك.**

---

# ✅ قائمة التحقق من الفهم

قبل الانتقال إلى الدرس التالي، تأكد من أنك تستطيع الإجابة بـ "نعم" على جميع هذه النقاط:

- [ ] **أفهم لماذا 99% من المسوقين يفشلون**
- [ ] **يمكنني ذكر 5 أخطاء قاتلة على الأقل**
- [ ] **أعرف كيف أتجنب هذه الأخطاء**
- [ ] **ملتزم بتطبيق نهج مختلف عن الفاشلين**
- [ ] **أفهم أن النجاح يحتاج وقت وصبر**

---

# 🚀 أنت الآن جاهز للدرس التالي!

في الدرس القادم، سنتحدث عن **"سيكولوجية المال عبر الإنترنت"** وكيف تغير علاقتك بالمال لتحقيق نتائج أفضل.

**مبروك على إتمام الدرس 2! 🎉**
```

---

## 🎯 STRUCTURE DU PROGRAMME (POUR CONTEXTE)

### Phase 1: برنامج السفير (40 modules, ~550 leçons)

**Module 1: عقلية السفير الحديث** (12 leçons)
1. أنت لست بائعاً، أنت سفير 2.0
2. لماذا يفشل 99% من المسوقين بالعمولة
3. سيكولوجية المال عبر الإنترنت
4. [... etc]

**Module 2: فهم النظام البيئي** (14 leçons)
1. [Leçon 1]
2. [Leçon 2]
[... etc]

[Continue selon la structure fournie séparément]

---

## 📝 CHECKLIST AVANT DE SOUMETTRE CHAQUE LEÇON

- [ ] Frontmatter présent et correctement formaté
- [ ] Toutes les sections obligatoires présentes
- [ ] Les checklists utilisent le format `- [ ]` exact
- [ ] Contenu minimum 3000 mots
- [ ] Au moins 3 tâches actionnables
- [ ] Au moins 5 points de vérification
- [ ] Ton professionnel mais accessible
- [ ] Pas de fautes d'orthographe en arabe
- [ ] Emojis pertinents utilisés
- [ ] Conclusion motivante

---

## 🚀 LIVRAISON

**Format de nom de fichier :** `lesson-[NUMÉRO].md`

**Exemple :**
- `lesson-01.md`
- `lesson-02.md`
- `lesson-03.md`

**Organisation :**
- Créer un dossier par module
- Nommer clairement : `phase-1/module-01/lesson-01.md`

---

## ⚡ CONSIGNES SPÉCIALES

1. **Cohérence** : Toutes les leçons doivent avoir un style similaire
2. **Progression** : Chaque leçon s'appuie sur la précédente
3. **Actionnable** : Chaque leçon doit avoir des actions concrètes
4. **Motivation** : Termine toujours sur une note inspirante
5. **Arabe standard** : Utilise l'arabe moderne standard, pas dialectal

---

**COMMENCE PAR LA LEÇON 1 DU MODULE 1 ET ATTENDS MA VALIDATION AVANT DE CONTINUER ! ✅**
