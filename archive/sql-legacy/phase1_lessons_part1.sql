-- =====================================================
-- PHASE 1 LESSONS PART 1: MODULES 1-5
-- =====================================================

DO $$
DECLARE
  phase1_id UUID;
  mod1_id UUID;
  mod2_id UUID;
  mod3_id UUID;
  mod4_id UUID;
  mod5_id UUID;
BEGIN
  -- Get Phase 1 ID
  SELECT id INTO phase1_id FROM public.phases WHERE phase_number = 1;
  
  -- Get module IDs for modules 1-5
  SELECT id INTO mod1_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 1;
  SELECT id INTO mod2_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 2;
  SELECT id INTO mod3_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 3;
  SELECT id INTO mod4_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 4;
  SELECT id INTO mod5_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 5;

  -- =====================================================
  -- MODULE 1: عقلية السفير الحديث (12 lessons)
  -- =====================================================
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (mod1_id, 1, 'أنت لست بائعاً، أنت سفير 2.0', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (mod1_id, 2, 'لماذا يفشل 99% من المسوقين بالعمولة', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (mod1_id, 3, 'سيكولوجية المال عبر الإنترنت', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (mod1_id, 4, 'حدد "لماذا" العاطفي القوي الخاص بك', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (mod1_id, 5, 'هدفك 10,000€: خارطة طريق واقعية', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (mod1_id, 6, 'إدارة متلازمة المحتال', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (mod1_id, 7, 'انضباط السفير: نظامك اليومي الجديد', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (mod1_id, 8, 'تحويل الفشل إلى دروس ثمينة', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (mod1_id, 9, 'عقلية "أنا غني بالفعل"', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (mod1_id, 10, 'التصور والتأكيدات اليومية القوية', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (mod1_id, 11, 'مذكرة السفير اليومية', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (mod1_id, 12, 'الاحتفال بكل انتصار صغير', '[سأعطيك المحتوى لاحقاً]', FALSE, 12)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 2: فهم النظام البيئي (14 lessons)
  -- =====================================================
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (mod2_id, 1, 'عالم التجارة الإلكترونية في 2025', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (mod2_id, 2, 'لماذا هذا البرنامج يبيع نفسه عملياً', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (mod2_id, 3, 'تحليل مفصل: باقة الشرارة (€997)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (mod2_id, 4, 'تحليل مفصل: باقة الإمبراطور (€1,497)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (mod2_id, 5, 'تحليل مفصل: باقة الأسطورة (€3,997)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (mod2_id, 6, 'أي باقة توصي بها حسب ملف العميل', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (mod2_id, 7, 'جولة كاملة داخل الأكاديمية - الجزء 1', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (mod2_id, 8, 'جولة كاملة داخل الأكاديمية - الجزء 2', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (mod2_id, 9, 'جولة كاملة داخل الأكاديمية - الجزء 3', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (mod2_id, 10, 'تحليل صفحة البيع كمحترف', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (mod2_id, 11, 'نقاط الألم لجمهورك المستهدف', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (mod2_id, 12, 'توقع الاعتراضات قبل أن تأتي', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (mod2_id, 13, 'فهم رحلة العميل الكاملة', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (mod2_id, 14, '

موقعك الفريد في السوق', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 3: الإعداد التقني الكامل (13 lessons)
  -- =====================================================
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (mod3_id, 1, 'هاتفك الذكي: تحويله إلى استوديو احترافي', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (mod3_id, 2, 'التطبيقات الضرورية 2025', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (mod3_id, 3, 'إنشاء حساب TikTok محسّن لعام 2025', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (mod3_id, 4, 'الإعدادات المتقدمة لـ TikTok', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (mod3_id, 5, 'إنشاء حساب Instagram محسّن لعام 2025', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (mod3_id, 6, 'الإعدادات المتقدمة لـ Instagram', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (mod3_id, 7, 'إعدادات الخصوصية والأمان', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (mod3_id, 8, 'تنظيم هاتفك للإنتاجية القصوى', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (mod3_id, 9, 'الإكسسوارات المفيدة (حامل ثلاثي، إضاءة، ميكروفون)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (mod3_id, 10, 'تثبيت وتكوين CapCut المتقدم', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (mod3_id, 11, 'نظام التخزين السحابي لتنظيم المحتوى', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
 (mod3_id, 12, 'نظام النسخ الاحتياطي التلقائي', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (mod3_id, 13, 'قائمة التحقق النهائية للإعداد المثالي', '[سأعطيك المحتوى لاحقاً]', FALSE, 13)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 4: الجمالية الاحترافية الإلزامية (14 lessons)
  -- =====================================================
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (mod4_id, 1, 'القاعدة الذهبية #1: لا تُظهر أبداً هاتفاً مكسوراً', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (mod4_id, 2, 'القاعدة الذهبية #2: لا تُظهر أبداً كمبيوتر قبيح أو قديم', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (mod4_id, 3, 'تنظيف شاشتك قبل كل تسجيل', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (mod4_id, 4, 'خلفية الشاشة: محايدة، احترافية، أو ملهمة', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (mod4_id, 5, 'السطوع: دائماً 100% عند التصوير', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (mod4_id, 6, 'الوضع الداكن مقابل الوضع الفاتح', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (mod4_id, 7, 'إخفاء الإشعارات المحرجة', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (mod4_id, 8, 'تنظيم التطبيقات: الشاشة الرئيسية المثالية', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (mod4_id, 9, 'البطارية والإشارة: دائماً في الحد الأقصى', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (mod4_id, 10, 'زوايا الكاميرا المناسبة للإعداد', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (mod4_id, 11, 'الإضاءة: لا تصور أبداً في الظلام', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (mod4_id, 12, 'الديكور خلفك (إذا كان مرئياً): مرتب واحترافي', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (mod4_id, 13, 'قائمة التحقق قبل التسجيل: 15 نقطة', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (mod4_id, 14, 'أمثلة على الإعدادات المثالية مقابل ما يجب تجنبه', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 5: إنشاء الأفاتار بالذكاء الاصطناعي (15 lessons)
  -- =====================================================
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (mod5_id, 1, 'مقدمة إلى الأفاتارات بالذكاء الاصطناعي في 2025', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (mod5_id, 2, 'أفضل المنصات (HeyGen، Synthesia، D-ID)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (mod5_id, 3, 'HeyGen: دليل كامل خطوة بخطوة', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (mod5_id, 4, 'إنشاء أول أفاتار واقعي لك', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (mod5_id, 5, 'اختيار المظهر المثالي لمجالك', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (mod5_id, 6, 'تخصيص صوت الأفاتار (اللغات، النبرات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (mod5_id, 7, 'الصوت الذكوري مقابل الأنثوي: التأثير على المبيعات', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (mod5_id, 8, 'كتابة نصوص محسّنة للأفاتار', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (mod5_id, 9, 'إنشاء فيديوهات مع الأفاتار (سير العمل الكامل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (mod5_id, 10, 'مزامنة الشفاه والتعبيرات الطبيعية', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (mod5_id, 11, 'إضافة ترجمات تلقائية أنيقة', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (mod5_id, 12, 'دمج الأفاتار في خلفيات مختلفة', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (mod5_id, 13, 'إنشاء عدة أفاتارات للتنويع', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (mod5_id, 14, 'التصدير والتحسين لـ TikTok و Instagram', '[سأعطيك المحتوى لاحقاً]', FALSE, 14),
  (mod5_id, 15, 'البدائل المجانية ومنخفضة التكلفة', '[سأعطيك المحتوى لاحقاً]', FALSE, 15)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

END $$;

-- Verification
SELECT 'Modules 1-5 Lessons Added!' as status,
  (SELECT COUNT(*) FROM public.lessons WHERE module_id IN (
    SELECT id FROM public.modules WHERE phase_id = (SELECT id FROM public.phases WHERE phase_number = 1) AND module_number BETWEEN 1 AND 5
  )) as lessons_count;
-- Expected: 68 lessons
