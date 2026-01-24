# 🎨 Premium Lesson Template - Usage Guide

## 📦 What's Included

This premium lesson template system includes **8 reusable components** designed to create a world-class learning experience for 500+ lessons.

### Components

1. **LessonLayout** - Main wrapper with background effects
2. **LessonHeader** - Hero section with title, badge, progress
3. **LessonObjective** - Styled objective block  
4. **ContentBlock** - Universal markdown renderer
5. **ImmediateAction** - Interactive checklist with localStorage
6. **KeyTakeaways** - Numbered summary points
7. **PracticalExample** - Quote-style examples
8. **LessonFooter** - Navigation & completion

---

## 🚀 Quick Start

### 1. Import Components

```typescript
import {
  LessonLayout,
  LessonHeader,
  LessonObjective,
  ContentBlock,
  ImmediateAction,
  KeyTakeaways,
  PracticalExample,
  LessonFooter,
} from '@/app/components/lesson';
```

### 2. Create a Lesson Page

```typescript
// app/(dashboard)/dashboard/phases/[id]/units/[unitId]/lessons/[lessonId]/page.tsx

export default async function LessonPage({ params }) {
  const lesson = await getLessonDetails(params.unitId, params.lessonId);
  
  // Parse content sections from markdown
  const actionItems = extractActionItems(lesson.content_ar);
  const takeaways = extractTakeaways(lesson.content_ar);
  
  return (
    <LessonLayout>
      <LessonHeader
        title_ar={lesson.title_ar}
        title_en={lesson.title_en}
        module_number={lesson.module_number}
        lesson_number={lesson.lesson_number}
        badge="🧠 العقلية"
        duration_minutes={30}
      />

      <LessonObjective objective="هدف الدرس هنا..." />

      <ContentBlock content={lesson.content_ar} />

      <ImmediateAction
        lessonId={lesson.id}
        items={actionItems}
      />

      <KeyTakeaways points={takeaways} />

      <LessonFooter
        nextLesson={{
          url: `/dashboard/phases/1/units/1/lessons/2`,
          title: "الدرس التالي"
        }}
      />
    </LessonLayout>
  );
}
```

---

## 📝 Content Format

Store lesson content in `content_ar` field as markdown:

```markdown
## القسم الأول

النص الرئيسي هنا...

### مثال عملي
> هذا مثال سيتم عرضه كـ PracticalExample

## النقاط الأساسية
1. النقطة الأولى
2. النقطة الثانية

## قائمة الإجراءات
- [ ] الإجراء الأول
- [ ] الإجراء الثاني
```

---

## 🎨 Styling

### Colors
- Neo Black: `#0A0A0F`
- Neo Dark: `#151520`
- Neo Cyan: `#00D9FF`
- Neo Violet: `#8B5CF6`

### Animations
All components use Framer Motion for smooth entrances:
- Fade in
- Slide up
- Scale animations
- Hover effects

### Responsive
- Mobile: Stacked layout
- Tablet: 768px breakpoint
- Desktop: Max width 1280px

---

## 💾 Data Persistence

### Checkboxes
`ImmediateAction` automatically saves state to localStorage:

```typescript
// Saved as:
localStorage.setItem(`lesson_${lessonId}_actions`, JSON.stringify(state));

// Retrieved on mount
const saved = localStorage.getItem(`lesson_${lessonId}_actions`);
```

---

## 🎯 Advanced Usage

### Custom Markdown Renderers

`ContentBlock` includes custom renderers for:
- **Headings** - With cyan underlines
- **Tables** - Styled with hover effects
- **Code blocks** - Syntax highlighted
- **Blockquotes** - As PracticalExample style
- **Lists** - With custom bullets
- **Links** - Cyan hover effect

### Multiple Example Types

```typescript
<PracticalExample
  title="مثال النجاح"
  content="..."
  type="success" // or "warning" or "info"
/>
```

---

## ✅ Reusability Checklist

✅ Works with **ANY** markdown content  
✅ No hardcoded lesson-specific data  
✅ Easy to use for 500+ lessons  
✅ Consistent design across all lessons  
✅ Interactive features auto-save  
✅ Mobile responsive  
✅ RTL Arabic support  
✅ Premium visual quality  

---

## 📦 Dependencies

```json
{
  "react-markdown": "^9.0.0",
  "remark-gfm": "^4.0.0",
  "framer-motion": "^11.0.0",
  "@radix-ui/react-checkbox": "^1.0.0",
  "zustand": "^4.4.0",
  "react-syntax-highlighter": "latest",
  "@tailwindcss/typography": "latest"
}
```

---

## 🚀 Next Steps

1. ✅ Template is ready to use
2. Store lesson content as markdown in database
3. Use helper functions to extract sections (actions, takeaways)
4. Or manually pass props for more control

---

## 💡 Tips

- Keep markdown content clean and structured
- Use consistent emoji prefixes for sections
- Test on mobile devices
- Leverage the interactive checkboxes for engagement
- Use PracticalExample for important callouts

---

**This template is designed to scale to 500+ lessons without modification! 🎉**
