# 📚 Système de Progression des Leçons - Logique Complète

## 🎯 Comment ça fonctionne

### 1️⃣ **Quand l'Étudiant OUVRE une Leçon**

```typescript
// app/(dashboard)/dashboard/phases/[id]/units/[unitId]/lessons/[lessonId]/page.tsx

useEffect(() => {
  // Marquer la leçon comme "démarrée"
  await supabase.rpc('start_lesson', {
    p_user_id: user.id,
    p_lesson_id: lessonId,
    p_total_tasks: 10 // Nombre de tâches dans cette leçon
  });
}, []);
```

**Résultat dans la DB :**
```sql
lesson_progress
├── user_id: abc-123
├── lesson_id: lesson-1
├── is_started: TRUE ✅
├── is_completed: FALSE
├── tasks_completed: [] (vide)
├── total_tasks: 10
└── started_at: 2026-01-25 12:45:00
```

---

### 2️⃣ **Quand l'Étudiant COCHE une Tâche**

```typescript
// app/components/lesson/ImmediateAction.tsx

const handleTaskCheck = async (taskIndex: number) => {
  // Sauvegarder dans Supabase
  await supabase.rpc('complete_task', {
    p_user_id: user.id,
    p_lesson_id: lessonId,
    p_task_index: taskIndex
  });
  
  // Mettre à jour l'UI localement
  setCheckedTasks([...checkedTasks, taskIndex]);
};
```

**Résultat dans la DB :**
```sql
lesson_progress
├── tasks_completed: [0, 1, 2] // Tâches 0, 1 et 2 complétées
├── completion_percentage: 30% // 3/10 = 30%
└── last_accessed_at: 2026-01-25 12:50:00
```

---

### 3️⃣ **Quand TOUTES les Tâches sont Complétées**

**Automatiquement (via le TRIGGER SQL) :**

```sql
-- Le trigger détecte que 10/10 tâches sont complétées
is_completed: TRUE ✅
completed_at: 2026-01-25 12:55:00
completion_percentage: 100%
```

---

### 4️⃣ **Débloquer la Leçon Suivante**

```typescript
// Logic dans le composant LessonFooter.tsx

const canAccessNextLesson = async () => {
  // Vérifier si la leçon actuelle est complétée
  const { data } = await supabase.rpc('is_lesson_completed', {
    p_user_id: user.id,
    p_lesson_id: currentLessonId
  });
  
  return data; // TRUE ou FALSE
};

// Afficher ou bloquer le bouton "Leçon Suivante"
<button disabled={!isCurrentLessonCompleted}>
  {isCurrentLessonCompleted 
    ? "📚 Leçon Suivante" 
    : "🔒 أكمل المهام أولاً"}
</button>
```

---

## 📊 **Exemple Concret**

### **Leçon 1 : "أنت لست بائعاً، أنت سفير 2.0"**

**Contenu de la leçon :**
```markdown
# 🎬 الإجراء الفوري

- [ ] اكتب هذه العبارة 10 مرات
- [ ] أجب على هذا السؤال
- [ ] شاهد نفسك في المرآة وقل
```

**Total : 3 tâches**

---

### **Scénario Étudiant "Ahmed"**

| Action | DB État |
|--------|---------|
| Ahmed ouvre Leçon 1 | `is_started: TRUE`, `total_tasks: 3`, `tasks_completed: []` |
| Ahmed coche tâche 1 | `tasks_completed: [0]`, `completion: 33%` |
| Ahmed coche tâche 2 | `tasks_completed: [0, 1]`, `completion: 66%` |
| Ahmed coche tâche 3 | `tasks_completed: [0, 1, 2]`, `completion: 100%`, `is_completed: TRUE` ✅ |
| Ahmed peut maintenant accéder à Leçon 2 | 🚀 Bouton "Leçon Suivante" débloqué |

---

## 🔒 **Règle de Déblocage**

```typescript
// Règle simple :
const canAccessLesson = (lessonNumber: number) => {
  // Leçon 1 toujours accessible
  if (lessonNumber === 1) return true;
  
  // Autres leçons : la leçon précédente doit être complétée
  return isLessonCompleted(lessonNumber - 1);
};
```

---

## 🛠️ **Ce qu'il faut Faire Maintenant**

### Étape 1 : Créer la Table
```bash
# Exécute ce fichier dans Supabase
supabase/create_lesson_progress_table.sql
```

### Étape 2 : Mettre à Jour les Composants
- `ImmediateAction.tsx` : Sauvegarder dans Supabase au lieu de localStorage
- `LessonFooter.tsx` : Vérifier la completion avant d'afficher "Suivant"
- `LessonLayout.tsx` : Appeler `start_lesson()` au chargement

### Étape 3 : Tester
1. Ouvre Leçon 1
2. Coche toutes les tâches
3. Vérifie que le bouton "Leçon 2" se débloque

---

## ❓ **Questions Fréquentes**

### **Q: Et si l'étudiant triche en cochant tout sans faire le travail ?**
**R:** C'est son problème ! Il se tire une balle dans le pied. Ton rôle est de fournir le système, pas de surveiller.

### **Q: Dois-je forcer l'étudiant à compléter toutes les tâches ?**
**R:** Tu peux avoir 2 options :
- **Strict** : TOUTES les tâches requises (comme décrit ci-dessus)
- **Flexible** : 80% des tâches suffisent

### **Q: Et les quizz ?**
**R:** Même logique ! Ajoute `quiz_score` dans `lesson_progress` et requiert un score minimum (ex: 70%)

---

## 🎯 **Résumé Ultra-Court**

1. **Table `lesson_progress`** → Track chaque leçon par étudiant
2. **Checkboxes** → Sauvegardent dans `tasks_completed` (JSONB)
3. **Trigger SQL** → Auto-calcule `completion_percentage` et `is_completed`
4. **Frontend** → Vérifie `is_completed` pour débloquer la leçon suivante

---

**Veux-tu que je crée/modifie les composants React pour implémenter cette logique ?** 🚀
