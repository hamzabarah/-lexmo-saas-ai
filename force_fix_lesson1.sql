-- FORCE FIX: Re-create Lesson 1 (Clean Slate)
-- The user sees no tasks for Lesson 1, likely due to duplicate entries or ID mismatch.
-- This script DELETES all instances of Lesson 1 and re-creates ONE single correct version.

DO $$
DECLARE
  p_id uuid;
  u_id uuid;
  new_l_id uuid;
  content text;
BEGIN
  -- 1. Get IDs
  SELECT id INTO p_id FROM public.phases WHERE phase_number = 2;
  SELECT id INTO u_id FROM public.course_modules WHERE phase_id = p_id AND module_number = 1;

  -- 2. DELETE ALL existing "Lesson 1"s for this Unit (Clean Slate)
  -- This cascades to 'tasks' and 'user_progress' automatically.
  DELETE FROM public.lessons 
  WHERE course_module_id = u_id AND module_number = 1;

  -- 3. Prepare Content
  content := '### 【🎯 هدف الدرس】
فهم الإيكومرس بكلمات بسيطة جداً

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 【ما هو الإيكومرس؟】

ببساطة شديدة: الإيكومرس = بيع منتجات عبر الإنترنت.

بدلاً من أن يكون عندك محل في الشارع، 
يكون عندك "متجر" على الإنترنت.

### 【💡 نصيحة ذهبية】
**الإيكومرس ليس معقداً!**
إذا كنت تعرف تستخدم واتساب،
يمكنك تعلم الإيكومرس.

### 【لماذا الآن؟】

✅ 2.14 مليار شخص يشترون أونلاين
✅ السوق ينمو 15% كل سنة
✅ يمكنك البدء من هاتفك فقط

### 【⚠️ خطأ شائع】
**"أحتاج خبرة تقنية للبدء"**
❌ خطأ! كل ما تحتاجه هو الرغبة في التعلم

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 【🎯 النتيجة】
أنت الآن تفهم أساسيات الإيكومرس!

**💰 سيناريو الربح:** هذا الفهم سيوفر لك 2,000€ من الأخطاء';

  -- 4. Re-Insert SINGLE Lesson 1
  INSERT INTO public.lessons (phase_id, course_module_id, module_number, title_ar, title_en, content_ar, order_index, is_locked)
  VALUES (p_id, u_id, 1, 'فهم ما هو الإيكومرس الحقيقي', 'What is Ecommerce', content, 1, false)
  RETURNING id INTO new_l_id;

  -- 5. Insert Tasks for this NEW Lesson ID
  INSERT INTO public.tasks (lesson_id, task_text_ar, order_index) VALUES
  (new_l_id, 'فهمت أن الإيكومرس = بيع عبر الإنترنت', 1),
  (new_l_id, 'فهمت أن الفرصة كبيرة الآن', 2),
  (new_l_id, 'فهمت أنني لا أحتاج خبرة سابقة', 3);

END $$;
