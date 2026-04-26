# 📚 PLAN D'INJECTION DES 500 LEÇONS - SYSTÈME OPTIMISÉ

## 🎯 ANALYSE DE LA STRUCTURE ACTUELLE

### Ce qui existe déjà ✅
1. **Table `lessons`** - Stocke le contenu des leçons
2. **Table `tasks`** - Stocke les tâches/checklists pour chaque leçon
3. **Système de parsing** - Le site parse automatiquement le markdown et extrait les checklists

### Structure d'une leçon
```markdown
---
phase: 1
module: 1
lesson: 1
title_ar: "أنت لست بائعاً، أنت سفير 2.0"
title_en: "You're Not a Seller, You're an Ambassador 2.0"
duration_minutes: 30
difficulty: "beginner"
badge: "🧠"
---

# Contenu markdown...
```

---

## 🚀 WORKFLOW OPTIMISÉ (3 OPTIONS)

### ✅ OPTION 1 : BATCH UPLOAD (RECOMMANDÉE)

**Concept :** Tu me donnes 10-50 leçons à la fois dans un dossier structuré.

#### Structure du dossier :
```
content/lessons/
├── phase-1/
│   ├── module-01/
│   │   ├── lesson-01.md
│   │   ├── lesson-02.md
│   │   ├── ...
│   │   └── lesson-12.md
│   ├── module-02/
│   │   ├── lesson-01.md
│   │   ├── ...
│   └── ...
```

#### Script d'injection automatique :

**1. Tu places tes fichiers markdown dans `content/lessons/`**

**2. Je crée un script `inject-all-lessons.ts`** qui :
   - ✅ Scanne tous les fichiers `.md`
   - ✅ Extrait le frontmatter (métadonnées)
   - ✅ Extrait le contenu markdown
   - ✅ **PARSE automatiquement les checklists** (détecte `- [ ]`)
   - ✅ Insère dans `lessons` table
   - ✅ Insère les tâches dans `tasks` table
   - ✅ Tout en UNE SEULE EXÉCUTION

**3. Tu exécutes UNE SEULE FOIS :**
```bash
npm run inject-lessons
```

**✅ Résultat :** 500 leçons + toutes leurs tâches injectées en 1-2 minutes !

---

### 🔄 OPTION 2 : GOOGLE SHEETS / EXCEL

**Concept :** Tu remplis un tableau, j'importe tout.

#### Template du tableau :
| phase | module | lesson | title_ar | title_en | content | tasks (JSON) |
|-------|--------|--------|----------|----------|---------|--------------|
| 1 | 1 | 1 | أنت سفير | Ambassador | # Contenu... | ["تمرين 1", "تمرين 2"] |
| 1 | 1 | 2 | ... | ... | ... | [...] |

**Avantages :**
- ✅ Facile à remplir
- ✅ Collaboration possible (partager le Google Sheet)
- ✅ Export CSV → Script d'import

**Script :**
```typescript
// import-from-csv.ts
// Lit le CSV et injecte tout en base
```

---

### 📦 OPTION 3 : ZIP UPLOAD

**Concept :** Tu prépares tout localement, tu m'envoies un ZIP.

1. Tu crées tous les fichiers markdown
2. Tu les zippe
3. Je crée un script qui dézippe et injecte tout

---

## 🎨 GESTION AUTOMATIQUE DES CHECKLISTS

### Comment ça marche actuellement :

Le markdown contient :
```markdown
## 🎬 الإجراء الفوري

- [ ] اكتب هذه العبارة 10 مرات
- [ ] أجب على هذا السؤال
- [ ] شاهد نفسك في المرآة وقل
```

### Le script va :

1. **Détecter** toutes les lignes commençant par `- [ ]`
2. **Extraire** le texte de chaque tâche
3. **Créer** une entrée dans la table `tasks` :
   ```sql
   INSERT INTO tasks (lesson_id, task_text_ar, order_index)
   VALUES 
     (lesson_id, 'اكتب هذه العبارة 10 مرات', 1),
     (lesson_id, 'أجب على هذا السؤال', 2),
     (lesson_id, 'شاهد نفسك في المرآة وقل', 3);
   ```

**✅ AUTOMATIQUE - TU N'AS RIEN À FAIRE !**

---

## 📝 FORMAT DE FICHIER MARKDOWN STANDARDISÉ

### Template obligatoire :

```markdown
---
phase: 1                    # Numéro de phase
module: 1                   # Numéro de module
lesson: 1                   # Numéro de leçon
title_ar: "Titre arabe"     # Titre en arabe
title_en: "English Title"   # Titre en anglais (optionnel)
duration_minutes: 30        # Durée estimée
difficulty: "beginner"      # beginner | intermediate | advanced
badge: "🧠"                 # Emoji du badge
---

# 🎯 هدف الدرس

[Objectif de la leçon]

---

# 📚 المحتوى الرئيسي

[Contenu principal...]

---

# ✅ النقاط الأساسية

- Point 1
- Point 2
- Point 3

---

# 🎬 الإجراء الفوري

- [ ] Tâche 1
- [ ] Tâche 2
- [ ] Tâche 3

---

# 📝 تمرين عملي

[Exercice pratique...]

---

# ✅ قائمة التحقق من الفهم

- [ ] Vérification 1
- [ ] Vérification 2
```

**✅ Respecte ce format et tout sera automatique !**

---

## 🛠️ SCRIPT D'INJECTION AUTOMATIQUE

### Voici ce que je vais créer :

```typescript
// scripts/inject-all-lessons.ts

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

async function injectAllLessons() {
  const supabase = createClient(...);
  
  // 1. Scanner tous les fichiers .md
  const lessonsDir = './content/lessons';
  const files = getAllMarkdownFiles(lessonsDir);
  
  console.log(`📚 Found ${files.length} lessons`);
  
  for (const file of files) {
    // 2. Lire le fichier
    const content = readFileSync(file, 'utf-8');
    
    // 3. Parser le frontmatter
    const { data: metadata, content: markdown } = matter(content);
    
    // 4. Trouver le module_id
    const moduleId = await getModuleId(metadata.phase, metadata.module);
    
    // 5. Insérer la leçon
    const { data: lesson } = await supabase
      .from('lessons')
      .insert({
        module_id: moduleId,
        lesson_number: metadata.lesson,
        title_ar: metadata.title_ar,
        title_en: metadata.title_en,
        content_ar: markdown,
        duration_minutes: metadata.duration_minutes,
      })
      .select()
      .single();
    
    // 6. Extraire et insérer les tâches
    const tasks = extractTasks(markdown);
    
    if (tasks.length > 0) {
      await supabase.from('tasks').insert(
        tasks.map((task, index) => ({
          lesson_id: lesson.id,
          task_text_ar: task,
          order_index: index + 1,
        }))
      );
    }
    
    console.log(`✅ Injected: Phase ${metadata.phase}, Module ${metadata.module}, Lesson ${metadata.lesson}`);
  }
  
  console.log(`🎉 All done! ${files.length} lessons injected!`);
}

// Fonction pour extraire les tâches
function extractTasks(markdown: string): string[] {
  const taskRegex = /^- \[ \] (.+)$/gm;
  const tasks: string[] = [];
  let match;
  
  while ((match = taskRegex.exec(markdown)) !== null) {
    tasks.push(match[1].trim());
  }
  
  return tasks;
}
```

---

## 📊 COMPARAISON DES OPTIONS

| Critère | Option 1: Batch MD | Option 2: Google Sheets | Option 3: ZIP |
|---------|-------------------|------------------------|---------------|
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Rapidité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Flexibilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Checklists auto** | ✅ Oui | ⚠️ Manuel | ✅ Oui |
| **Recommandé** | ✅ **OUI** | Non | Peut-être |

---

## 🎯 PROCHAINES ÉTAPES

### Choix 1 : Option Batch Markdown (RECOMMANDÉE)

1. **Je crée le script d'injection** (`inject-all-lessons.ts`)
2. **Tu prépares tes leçons** dans `content/lessons/phase-X/module-Y/lesson-Z.md`
3. **Tu exécutes** : `npm run inject-lessons`
4. **✅ DONE** - Toutes les leçons + checklists injectées !

### Choix 2 : Option Google Sheets

1. **Je crée un template Google Sheets**
2. **Tu remplis** le tableau
3. **Tu exportes en CSV**
4. **J'exécute** le script d'import

### Choix 3 : Autre méthode ?

Dis-moi si tu as une autre idée !

---

## ❓ TES QUESTIONS À RÉPONDRE

1. **Quelle option préfères-tu ?** (Je recommande Option 1)
2. **As-tu déjà les 500 leçons quelque part ?** (Word, Google Docs, etc.)
3. **Format actuel ?** (Texte brut, fichiers séparés, etc.)
4. **Combien de leçons peux-tu préparer aujourd'hui ?**

---

## ⚡ AVANTAGES DE L'OPTION 1 (BATCH MARKDOWN)

✅ **Une seule commande** pour tout injecter
✅ **Détection automatique** des checklists (pas besoin de créer des SQL)
✅ **Versionnable** avec Git (tu peux garder une trace de tout)
✅ **Réutilisable** - si tu changes un contenu, re-run le script
✅ **Preview** - tu peux voir le markdown avant l'injection
✅ **Pas de limite** - 500, 1000, 10000 leçons, même processus

---

**DIS-MOI QUELLE OPTION TU VEUX ET JE COMMENCE À CODER ! 🚀**
