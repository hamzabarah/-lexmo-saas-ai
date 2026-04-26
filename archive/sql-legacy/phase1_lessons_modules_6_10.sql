-- =====================================================
-- PHASE 1 LESSONS: MODULES 6-10
-- =====================================================

DO $$
DECLARE
  phase1_id UUID;
  current_module_id UUID;
BEGIN
  SELECT id INTO phase1_id FROM public.phases WHERE phase_number = 1;

  -- =====================================================
  -- MODULE 6: تصوير صفحة البيع (17 lessons)
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 6;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'لماذا صفحة البيع هي أفضل حليف لك', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'التشريح الكامل لصفحة البيع', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'إعداد الإعداد للتصوير (شاشة نظيفة ومضيئة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'تقنية تسجيل الشاشة السلسة والاحترافية', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'تصوير الرأس والعرض الرئيسي', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'التقاط الباقات الثلاث بالتكبير الاستراتيجي', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'تصوير كل باقة على حدة (التفاصيل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'عرض الوحدات واحدة تلو الأخرى (خلق الرغبة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'الكشف عن الدروس في كل وحدة (معاينة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'تقنية التمرير السلس والجذاب', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'التقاط المكافآت واحدة تلو الأخرى بالتركيز', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'تصوير قسم الشهادات/التقييمات (الدليل الاجتماعي)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'التكبير على الضمانات وعناصر الأمان', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'التقاط السعر المشطوب مقابل السعر الحالي (الإلحاح)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14),
  (current_module_id, 15, 'تصوير زر الدعوة لاتخاذ إجراء بشكل لا يقاوم', '[سأعطيك المحتوى لاحقاً]', FALSE, 15),
  (current_module_id, 16, 'إنشاء 10 نسخ مختلفة من نفس الصفحة', '[سأعطيك المحتوى لاحقاً]', FALSE, 16),
  (current_module_id, 17, 'المونتاج: الإيقاع، الموسيقى، الديناميكية للصفحة', '[سأعطيك المحتوى لاحقاً]', FALSE, 17)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 7: تصوير الأكاديمية الكاملة (16 lessons)
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 7;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'لماذا تصوير الداخل يبيع أكثر من أي شيء', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'جولة في لوحة التحكم: الانطباع الأول المذهل', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'تصوير الصفحة الرئيسية للأكاديمية (التصميم الأنيق)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'التنقل بين المراحل (سلاسة الواجهة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'عرض المرحلة 1: جميع الوحدات مرئية', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'عرض المراحل 2، 3، 4: حجم البرنامج', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'فتح وحدة وعرض جميع الدروس', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'تصوير واجهة الدرس (مشغل الفيديو الاحترافي)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'عرض التقدم (الأشرطة، النسب المئوية، الشارات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'التقاط الموارد القابلة للتنزيل (PDF، النماذج)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'تصوير المجتمع/المجموعة الخاصة (إذا كان متاحاً)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'عرض المكافآت واحدة تلو الأخرى (القيمة المضافة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'إحصائيات لوحة التحكم وتتبع التقدم', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'الشهادات وشارات الإنجاز (التحفيز)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14),
  (current_module_id, 15, 'الدعم والدردشة المدمجة (الطمأنينة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 15),
  (current_module_id, 16, 'إنشاء 20 فيديو مختلف للأكاديمية (التنويعات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 16)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 8: محتوى "الاكتشاف" (14 lessons)
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 8;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, '"لقد اشتركت للتو، انظروا ما وجدت"', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'تصوير تسجيل الدخول الأول الحقيقي (إن أمكن)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'رد فعل حقيقي وعفوي أمام الواجهة', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, '"لم أكن أتوقع هذا..." (مفاجأة إيجابية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'استكشاف الوحدات بدهشة حقيقية', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, '"انتظروا، هناك حتى هذا؟!" (كشف المكافأة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'عد الدروس مباشرة: "أكثر من 200 درس!"', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'اكتشاف الشهادات بإعجاب', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, '"كنت أعتقد أنه X ولكن في الواقع 10X!"', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'تصوير رحلة الفهم التدريجي', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'الأسئلة التي تطرحها أثناء الاكتشاف (القابلية للتواصل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'تلخيص ما تعلمته في 5 دقائق', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, '"لهذا السبب لا أندم على الإطلاق"', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'سلسلة "اليوم 1، 2، 3..." في الأكاديمية', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 9: عرض المكافآت (14 lessons)
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 9;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'إدراج جميع المكافآت المتاحة (الجرد الكامل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'ترتيب المكافآت حسب القيمة المدركة', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'تصوير كل مكافأة على حدة (التركيز)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'إنشاء فيديو "كشف المكافأة" مثير وديناميكي', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'شرح القيمة الحقيقية لكل مكافأة (الأرقام)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, '"هذه المكافأة وحدها تساوي X€ وتحصل عليها مجاناً"', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'عرض كيفية الوصول إلى المكافآت في الأكاديمية', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'الاستخدام العملي للمكافأة (مثال ملموس)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'المكافآت الحصرية مقابل المكافآت القياسية', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'خلق الإلحاح: "هذه المكافآت لن تكون دائماً متاحة"', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'تجميع ديناميكي: "أفضل 5 مكافآت مذهلة"', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'شهادات وهمية: "المكافأة التي غيرت كل شيء بالنسبة لي"', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'إعادة استخدام المكافآت في تنسيقات محتوى مختلفة', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'استراتيجية "مكافأة واحدة في اليوم" لمدة 10 أيام', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 10: إتقان لوحة التحكم (14 lessons)
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 10;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'لماذا لوحة التحكم تبيع وحدها (علم النفس)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'تصوير لوحة التحكم الفارغة (بداية الرحلة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'تصوير لوحة التحكم في التقدم (التحفيز)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'تصوير لوحة التحكم "النجاح" (تحقيق الهدف)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'عناصر لوحة التحكم التي يجب إبرازها', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'الإحصائيات، الرسوم البيانية، أشرطة التقدم', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'الشارات والإنجازات: اللعب الذي يحفز', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, '"هذا هو مكاني بعد 7، 14، 30 يوماً"', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'التوقعات المتفائلة: "في 30 يوماً سأكون هنا"', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'مقارنة قبل/بعد على لوحة التحكم (التحول)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'خلق العاطفة والإلهام مع لوحة التحكم', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'لوحة تحكم أعضاء آخرين (بإذن أو وهمي)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'لوحة التحكم كدليل اجتماعي نهائي', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'فيديوهات تايم لابس لتقدم لوحة التحكم', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

END $$;

-- Verification
SELECT 
  'Modules 6-10 Lessons Added!' as status,
  (SELECT COUNT(*) FROM public.lessons WHERE module_id IN (
    SELECT id FROM public.modules WHERE phase_id = (SELECT id FROM public.phases WHERE phase_number = 1) AND module_number BETWEEN 6 AND 10
  )) as lessons_count;
-- Expected: 75 lessons
