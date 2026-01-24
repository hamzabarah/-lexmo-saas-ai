-- =====================================================
-- PHASE 1 COMPLETE SKELETON
-- برنامج السفير (Ambassador Program)
-- 40 MODULES + 550 LESSONS
-- =====================================================
-- This file contains ALL lesson INSERT statements
-- Each lesson has placeholder content: [سأعطيك المحتوى لاحقاً]
-- =====================================================

DO $$
DECLARE
  phase1_id UUID;
  current_module_id UUID;
BEGIN
  -- Get Phase 1 ID
  SELECT id INTO phase1_id FROM public.phases WHERE phase_number = 1;

  -- =====================================================
  -- MODULE 11: استراتيجية التقييمات
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 11;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'لماذا التقييمات هي سلاحك رقم 1 للبيع', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'الأنواع الخمسة من التقييمات التي تحقق أفضل النتائج', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'تشريح التقييم المثالي (البنية النفسية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'أين تجد التقييمات الحقيقية على صفحة الهبوط', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'تصوير التقييمات الموجودة على الصفحة (التقنية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'تسجيل الشاشة للتقييمات مع التكبير العاطفي', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'إنشاء تقييمك الحقيقي الخاص (حتى لو كنت جديداً)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'نص: "لقد انضممت للتو وهذا ما اكتشفته..."', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'نص: "اليوم 3 في البرنامج، أنا مندهش من..."', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'تصوير شاشتك أثناء الاستكشاف (رد فعل مباشر)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'ردود الفعل الحقيقية عند اكتشاف الوحدات', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'التقاط مفاجأتك أمام المكافآت المخفية', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'شهادة التقدم: اليوم 1، 7، 14، 30', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'إنشاء 30 نسخة مختلفة من التقييمات', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 12: الحصول على تقييمات خارجية
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 12;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'لماذا تحتاج إلى تقييمات خارجية (المصداقية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'التواصل مع أصدقائك: العرض المثالي والأخلاقي', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'تقديم عمولة مقابل تقييم فيديو (فوز-فوز)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'النص الدقيق لإعطائه لأصدقائك لتقييماتهم', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'زملاؤك: كيف تقترب منهم دون إحراج', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'العائلة: إشراكهم دون أن تكون محرجاً', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'إنشاء نظام مكافأة للتقييمات (الحوافز)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'تنظيم جلسة "تقييمات جماعية"', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'تدريب أقاربك على تقديم تقييم جيد (التدريب)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'تصوير ردود أفعالهم عند اكتشاف الأكاديمية', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'التقييمات المتبادلة: أنت + صديق = مصداقية مضاعفة', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'إدارة التقييمات السلبية أو الفاترة (الانعكاس)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'تجميع 10-20 تقييم في فيديو قوي (المونتاج)', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'إعادة استخدام التقييمات في جميع محتوياتك (التعظيم)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 13: فيديوهات بدون وجه
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 13;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'تسجيل الشاشة + تعليق صوتي (سير العمل المفصل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'الأفاتار بالذكاء الاصطناعي يقدم (التكامل الكامل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'فيديوهات النص المتحرك فقط (قوالب CapCut)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'اليدين فقط: تصوير يديك فقط (فعال)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'POV (وجهة النظر) الاستراتيجية دون إظهار الوجه', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'التجميعات والمونتاجات الديناميكية', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'الرسوم المتحركة والموشن ديزاين البسيط (Canva)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'فيديوهات لايف ستايل ضبابية/صورة ظلية (الغموض)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'لقطات مخزون + تعليق صوتي (موارد مجانية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'مشاركة الشاشة مع ردود الفعل الصوتية فقط', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'دروس سكرين كاست احترافية', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'مزج تنسيقات متعددة للتنويع (الإبداع)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'فيديوهات "من فوق الكتف"', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'التنسيقات الرائجة 2025 للاستغلال', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 14: إنشاء فيديو متقدم
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 14;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'أساسيات تكوين الفيديو (قاعدة الأثلاث)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'الإضاءة الطبيعية مقابل الاصطناعية: دليل كامل', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'التأطير وزوايا الكاميرا الاستراتيجية', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'تصوير شاشتك كمحترف (iOS و Android)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'تسجيل الشاشة: تقنيات متقدمة ونصائح', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'إنشاء B-rolls جذابة (لقطات إضافية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'انتقالات سلسة وديناميكية بين المشاهد', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'المؤثرات البصرية الرائجة 2025 (الخلل، التكبير، إلخ)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'النص المتحرك الذي يحتفظ بالانتباه (الطباعة الحركية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'الطبقات والملصقات الفعالة (دون زيادة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'تدرج الألوان للتأثير العاطفي (LUTs)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'التصدير بأفضل جودة (الإعدادات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'التصوير في 4K مقابل 1080p: ما يهم حقاً', '[سأعطيك المحتوى لاحقاً]', FALSE, 13)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 15: إتقان المونتاج بـ CapCut
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 15;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'واجهة CapCut: جولة كاملة وتخصيص', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'استيراد وتنظيم وسائطك بكفاءة', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'القطع والتجميع: أساسيات المونتاج', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'السرعة المتغيرة: التباطؤ والتسريع الاستراتيجي', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'التكبير الديناميكي وتأثيرات الحركة', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'التضمينات و Picture-in-Picture الإبداعية', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'قوالب CapCut: كيفية استخدامها وتخصيصها', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'إنشاء قوالبك الخاصة القابلة لإعادة الاستخدام', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'الترجمة التلقائية: الترجمات التلقائية الأنيقة', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'المؤثرات الصوتية والموسيقى: التوقيت المثالي', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'الانتقالات المتقدمة والإطارات الرئيسية (الرسوم المتحركة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'التصدير لـ TikTok و Instagram (الإعدادات المثلى)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'اختصارات لوحة المفاتيح ونصائح لتوفير الوقت', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'سير العمل الكامل: من الاستيراد إلى التصدير في 10 دقائق', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 16: النصوص والكتابة الإعلانية
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 16;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'تشريح نص فيروسي (البنية الفائزة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'إطار PASTOR للبيع دون أن تكون مُلحاً', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, '30 نصاً جاهزاً للاستخدام (نسخ ولصق فوري)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'خلق الإلحاح الحقيقي دون أن تكون عدوانياً', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'الكلمات المحفزة عاطفياً (القائمة الكاملة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'روي قصتك (حتى لو كانت مخترعة بذكاء)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'الشهادات والدليل الاجتماعي المدمج في النص', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'تحويل الاعتراضات إلى حجج بيع', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'دعوات لاتخاذ إجراء لا تقاوم (صيغ مختبرة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'تكييف لغتك مع جمهورك المستهدف', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'نصوص لتنسيقات مختلفة (15 ثانية، 30 ثانية، 60 ثانية، 3 دقائق)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'اختبار وتحسين نصوصك (اختبار A/B)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'نصوص للبث المباشر مقابل نصوص للفيديوهات المسجلة مسبقاً', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'بنك 100+ عبارة افتتاحية', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 17: المحتوى المقارن
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 17;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, '"ما تحصل عليه مقابل X€" (تفصيل مفصل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'تصوير كل باقة جنباً إلى جنب (المقارنة البصرية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'مزايا الباقة 1 مقابل الباقة 2 مقابل الباقة 3 (جدول)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, '"إذا اشتريت في مكان آخر يكلف X، هنا Y"', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'المقارنة: هذه الأكاديمية مقابل التدريب الكلاسيكي', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'القيمة الإجمالية المحسوبة مقابل السعر الفعلي (الفجوة المذهلة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'عائد الاستثمار المحتمل: كم يمكنك كسب (التوقعات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'الوقت الموفر = المال الموفر (الحسابات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, '"X وحدات = X€ من القيمة كحد أدنى لكل وحدة"', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'عرض الأسعار المشطوبة مقابل الأسعار الحالية (التوفير)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'إنشاء جدول مقارن بصري مؤثر', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, '"لماذا هذه صفقة القرن في 2025"', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'تفكيك اعتراض السعر إلى قيمة مدركة', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'المقارنة مع البرامج الأخرى المعروفة', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 18: الأدلة الاجتماعية المتقدمة
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 18;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'جمع جميع التقييمات المتاحة بشكل منهجي', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'تنظيم التقييمات حسب الموضوع (النتائج، الدعم، الجودة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'تقييم "كنت متشككاً من قبل، الآن أوصي"', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'تقييم "جربت تدريبات أخرى، لكن هذه..."', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'تقييمات مرقمة: "لقد ربحت X€ بفضل هذا البرنامج"', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'تقييم التحول: "حياتي تغيرت تماماً"', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'لقطات شاشة لرسائل رضا العملاء', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'فيديوهات الشهادات (حتى قصيرة، 10-15 ثانية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'إنشاء فسيفساء بصرية من الشهادات المصغرة', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'تحويل التقييمات السلبية إلى إيجابية (سرد القصص)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'الرد علناً على التقييمات (المشاركة المرئية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, '"أكثر من X آلاف شخص راضٍ"', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'جدار الحب: تجميع بصري ضخم للتقييمات', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'دراسات حالة مفصلة لأعضاء ناجحين', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 19: استراتيجية المحتوى 2025
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 19;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'انسَ الهاشتاغات: الخوارزمية الجديدة 2025', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'نظام التوصية TikTok/IG مفكك', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'الأنواع السبعة من المحتوى التي تحقق نجاحاً حالياً', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'قاعدة الثواني الثلاث الأولى (الخطاف الحاسم)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, '50 خطافاً لا يقاوم مختبر ومعتمد', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'سرد القصص الذي يبيع بشكل طبيعي (AIDA 2.0)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'إنشاء محتوى "موقف للتمرير" (إيقاف التمرير)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'علم النفس وراء الفيديوهات الفيروسية', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'المدة المثلى: 7 ثوانٍ، 15 ثانية، 30 ثانية، 60 ثانية أو 3 دقائق؟', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'أوقات النشر الاستراتيجية (التوقيت)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'تكرار النشر للانفجار (الاتساق)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'تحليل ما ينجح عند منافسيك (المراقبة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'تقويمك التحريري الشهري (التنظيم)', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'الأصوات والموسيقى الرائجة التي تحقق أداءً جيداً', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 20: البحث والمراقبة
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 20;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'تحديد أفضل الممارسين في مجالك المحدد', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'التجسس بشكل قانوني وأخلاقي على منافسيك', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'أدوات المراقبة التلقائية (مجانية ومدفوعة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'إنشاء مكتبة الإلهام المنظمة الخاصة بك', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'تحليل الفيديوهات الفيروسية (التفكيك المفصل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'الاتجاهات TikTok/IG للاستغلال الآن', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'الأصوات والموسيقى التي تحقق أداءً في 2025', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'تكييف المحتوى الذي يعمل في مكان آخر (الريمكس)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'الاستلهام من مجالات أخرى (الابتكار عبر المجالات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'إنشاء نظام التنظيم اليومي الخاص بك (الروتين)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'المجموعات والمجتمعات التي يجب الانضمام إليها (التواصل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'النشرات الإخبارية ومصادر المعلومات الأساسية', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'حفظ وتنظيم إلهامك (النظام)', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'تحويل الإلهام إلى محتوى أصلي', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Continue with remaining modules 21-40...
  -- (Due to character limits, I'll create this as part 2)

END $$;
