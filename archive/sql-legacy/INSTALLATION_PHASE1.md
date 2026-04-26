# Installation du Squelette Phase 1

## 📋 Vue d'ensemble

Vous avez maintenant le squelette complet de la **Phase 1: برنامج السفير (Ambassador Program)** :
- ✅ **40 Modules** (وحدات)
- ✅ **550 Leçons** (دروس)
- ✅ Tous les titres en arabe
- ✅ Contenu placeholder `[سأعطيك المحتوى لاحقاً]`

## 📁 Fichiers SQL Créés

Tous les fichiers sont dans le dossier `supabase/` :

### 1. **phase1_skeleton.sql** ⭐ (À EXÉCUTER EN PREMIER)
- Crée les tables : `phases`, `modules`, `lessons`
- Configure les RLS policies
- Insère Phase 1 et les 40 modules

### 2. **phase1_lessons_part1.sql**
- Modules 1-5 : 69 leçons
- عقلية السفير → إنشاء الأفاتار بالذكاء الاصطناعي

### 3. **phase1_lessons_part2.sql**
- Modules 11-20 : 140 leçons
- استراتيجية التقييمات → البحث والمراقبة

### 4. **phase1_lessons_part3.sql**
- Modules 21-30 : 140 leçons
- سيطرة TikTok → التحليلات والتحسين

### 5. **phase1_lessons_part4.sql** ⭐ (DERNIER)
- Modules 31-40 : 138 leçons
- التوسع → استراتيجيات المستوى التالي

## 🚀 Installation Étape par Étape

### Étape 1: Ouvrir Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Cliquez sur **SQL Editor** dans le menu de gauche

### Étape 2: Exécuter les Scripts SQL (DANS L'ORDRE!)

**Important**: Exécutez les scripts DANS L'ORDRE suivant :

```sql
-- 1️⃣ PREMIER (OBLIGATOIRE)
phase1_skeleton.sql

-- 2️⃣ ENSUITE (dans n'importe quel ordre)
phase1_lessons_part1.sql
phase1_lessons_part2.sql  
phase1_lessons_part3.sql
phase1_lessons_part4.sql
```

#### Comment exécuter chaque script:
1. Ouvrez le fichier SQL dans votre éditeur
2. Copiez **TOUT** le contenu
3. Collez-le dans le SQL Editor de Supabase
4. Cliquez sur **RUN** (ou `Ctrl+Enter`)
5. Attendez le message de succès ✅
6. Passez au script suivant

### Étape 3: Vérification

Après avoir exécuté tous les scripts, vérifiez que tout est bien créé :

```sql
-- Vérifier Phase 1
SELECT * FROM public.phases WHERE phase_number = 1;

-- Compter les modules (devrait être 40)
SELECT COUNT(*) FROM public.modules WHERE phase_id = (SELECT id FROM public.phases WHERE phase_number = 1);

-- Compter les leçons (devrait être ~550)
SELECT COUNT(*) FROM public.lessons 
WHERE module_id IN (
  SELECT id FROM public.modules 
  WHERE phase_id = (SELECT id FROM public.phases WHERE phase_number = 1)
);

-- Voir un exemple de leçon
SELECT m.title_ar as module, l.lesson_number, l.title_ar, l.content_ar
FROM public.lessons l
JOIN public.modules m ON l.module_id = m.id
WHERE m.module_number = 1
LIMIT 5;
```

## ✅ Résultat Attendu

Après installation complète, vous devriez voir :
- ✅ 1 phase
- ✅ 40 modules
- ✅ ~550 leçons
- ✅ Toutes les leçons avec `[سأعطيك المحتوى لاحقاً]`

## 🎯 Prochaines Étapes

Maintenant que le squelette est en place :

### 1. Vérifier dans l'application
Allez sur votre application et naviguez vers `/dashboard/phases/1` pour voir la structure

### 2. Remplir le contenu
Envoyez-moi le contenu pour chaque leçon au format :

```
LEÇON: الوحدة 1 - الدرس 1
CONTENU:
[votre contenu détaillé ici]
```

### 3. Mise à jour automatique
Je mettrai à jour chaque leçon avec son contenu réel en exécutant un UPDATE SQL

## 📊 Structure Complète des Modules

| # | Module | Emoji | Leçons |
|---|--------|-------|--------|
| 1 | عقلية السفير الحديث | 🧠 | 12 |
| 2 | فهم النظام البيئي | 🌍 | 14 |
| 3 | الإعداد التقني الكامل | ⚙️ | 13 |
| 4 | الجمالية الاحترافية | 📱 | 14 |
| 5 | إنشاء الأفاتار بالذكاء الاصطناعي | 🤖 | 15 |
| 6 | تصوير صفحة البيع | 🖥️ | 17 |
| 7 | تصوير الأكاديمية الكاملة | 🎓 | 16 |
| 8 | محتوى "الاكتشاف" | 🎬 | 14 |
| 9 | عرض المكافآت | 🎁 | 14 |
| 10 | إتقان لوحة التحكم | 📊 | 14 |
| 11 | استراتيجية التقييمات | ⭐ | 14 |
| 12 | الحصول على تقييمات خارجية | 🤝 | 14 |
| 13 | فيديوهات بدون وجه | 🎭 | 14 |
| 14 | إنشاء فيديو متقدم | 🎥 | 13 |
| 15 | إتقان المونتاج بـ CapCut | ✂️ | 14 |
| 16 | النصوص والكتابة الإعلانية | ✍️ | 14 |
| 17 | المحتوى المقارن | ⚖️ | 14 |
| 18 | الأدلة الاجتماعية المتقدمة | 💯 | 14 |
| 19 | استراتيجية المحتوى 2025 | 📱 | 14 |
| 20 | البحث والمراقبة | 🔍 | 14 |
| 21 | سيطرة TikTok 2025 | 🎵 | 14 |
| 22 | إتقان Instagram Reels | 📸 | 14 |
| 23 | Stories التي تبيع | 📲 | 14 |
| 24 | مخطط البيع المباشر | 🔴 | 14 |
| 25 | جولة الأكاديمية المباشرة | 🔴 | 14 |
| 26 | نظام البيع | 💰 | 14 |
| 27 | إتقان الاعتراضات | 🛡️ | 14 |
| 28 | تسلسلات البيع | 🎯 | 14 |
| 29 | أتمتة الذكاء الاصطناعي | 🤖 | 14 |
|30 | التحليلات والتحسين | 📊| 14 |
| 31 | التوسع إلى 10 آلاف | 🚀 | 14 |
| 32 | روتين السفير | ⏰ | 14 |
| 33 | الجوانب القانونية | ⚖️ | 14 |
| 34 | الإدارة المالية | 💳 | 14 |
| 35 | العقلية المتقدمة | 🔥 | 14 |
| 36 | استكشاف الأخطاء وإصلاحها | 🔧 | 14 |
| 37 | أسرار التصوير المتقدمة | 🎥 | 14 |
| 38 | محتوى "القيمة" | 💎 | 14 |
| 39 | الشهادة النهائية | 🎓 | 12 |
| 40 | استراتيجيات المستوى التالي | 🌟 | 14 |

**Total: 550 leçons**

## ❓ Support

Si vous rencontrez des erreurs :
1. Vérifiez que vous avez exécuté `phase1_skeleton.sql` en premier
2. Vérifiez les messages d'erreur dans Supabase
3. Assurez-vous que votre base de données est vide (pas de conflits)
4. Partagez-moi l'erreur exacte pour assistance

## 🎉 Félicitations !

Vous avez maintenant la structure complète de votre académie prête à être remplie avec du contenu de qualité !
