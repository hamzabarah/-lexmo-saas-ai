-- Fix: Insert Interactive Tasks for Phase 2, Unit 1, Lesson 1
-- The user reported that tasks were not clickable (because they were just text).
-- This script populates the 'tasks' table.

DO $$
DECLARE
  p_id uuid;
  u_id uuid;
  l_id uuid;
BEGIN
  -- 1. Get Phase 2 ID
  SELECT id INTO p_id FROM public.phases WHERE phase_number = 2;

  -- 2. Get Unit 1 ID (Badge SE 01)
  SELECT id INTO u_id FROM public.course_modules 
  WHERE phase_id = p_id AND module_number = 1;

  -- 3. Get Lesson 1 ID
  SELECT id INTO l_id FROM public.lessons 
  WHERE course_module_id = u_id AND module_number = 1;

  -- 4. Clear existing tasks for this lesson (to avoid duplicates if run multiple times)
  DELETE FROM public.tasks WHERE lesson_id = l_id;

  -- 5. Insert Tasks
  INSERT INTO public.tasks (lesson_id, task_text_ar, order_index) VALUES
  (l_id, 'فهمت أن الإيكومرس = بيع عبر الإنترنت', 1),
  (l_id, 'فهمت الفرق بين المحل التقليدي والمتجر الإلكتروني', 2),
  (l_id, 'فهمت أن الفرصة كبيرة الآن', 3),
  (l_id, 'فهمت أنني لا أحتاج خبرة سابقة', 4);

END $$;
