-- =====================================================
-- PHASE 1 LESSONS PART 4: MODULES 31-40 (FINAL)
-- =====================================================

DO $$
DECLARE
  phase1_id UUID;
  current_module_id UUID;
BEGIN
  SELECT id INTO phase1_id FROM public.phases WHERE phase_number = 1;

  -- =====================================================
  -- MODULE 31: التوسع إلى 10 آلاف
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 31;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'خارطة الطريق الدقيقة والمفصلة نحو 10,000€/شهر', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'كم عدد المبيعات التي تحتاجها (حسابات حقيقية لكل باقة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'زيادة حجم المحتوى بذكاء', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'استراتيجية متعددة المنصات (TikTok + Instagram + أخرى)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'إنشاء حساب ثانٍ استراتيجي (التنويع)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'التعاون والشراكات للتوسع السريع', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'استثمار مكاسبك الأولى بذكاء (إعادة الاستثمار)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'توظيف مساعدك الافتراضي الأول (التفويض)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'التفويض دون فقدان الجودة (تدريب المساعد الافتراضي)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'نظام إنشاء المحتوى بالجملة (الإنتاج الشامل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'خارطة الطريق: الانتقال من 0 إلى 1,000€/شهر', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'خارطة الطريق: الانتقال من 1,000 إلى 5,000€/شهر', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'خارطة الطريق: الانتقال من 5,000 إلى 10,000€/شهر', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'الحفاظ على 10,000€+ بشكل متسق (طويل الأجل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 32: روتين السفير
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 32;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'روتين الصباح للسفير الناجح (الطقوس الصباحية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'حجب الوقت: تنظيم يومك بشكل مثالي', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'المهام الأربع اليومية غير القابلة للتفاوض', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'الإنشاء بالجملة: إنتاج 30 فيديو في يوم واحد', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'إدارة الرسائل المباشرة: نظام فعال في 30 دقيقة', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'المراقبة والإلهام: روتين 15 دقيقة يومياً', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'التحليل والتعديلات: روتين أسبوعي', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'روتين المساء للانتظام (الطقوس المسائية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'يوم العطلة: لماذا هو أمر حاسم تماماً', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'تجنب الإرهاق من إنشاء المحتوى', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'البقاء متحفزاً على المدى الطويل جداً (العقلية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'خطتك الشهرية النموذجية (نموذج مقدم)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'العادات السبع للسفراء بستة أرقام', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'التوازن بين العمل والحياة كسفير', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 33: الجوانب القانونية
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 33;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'الحالة القانونية: ما تحتاجه حسب بلدك', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'الإقرار الضريبي للمسوقين بالعمولة (الالتزامات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'ضريبة القيمة المضافة: هل أنت معني؟ (الحدود والقواعد)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'الإشعارات القانونية والامتثال للائحة العامة لحماية البيانات', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'عقد التسويق بالعمولة: فهم جميع الشروط', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'الملكية الفكرية: ما يمكنك/لا يمكنك فعله', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'حقوق الطبع والنشر على الموسيقى والصور (حقوق النشر)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'التأمين: هل تحتاجه كمسوق بالعمولة؟', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'الفواتير والمحاسبة المبسطة (الأدوات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'الاحتفاظ بإثباتات دخلك (التنظيم)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'التخطيط الضريبي الذكي (التحسين القانوني)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'متى تستشير محاسباً خبيراً/محامياً', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'تجنب الفخاخ القانونية الشائعة للمسوقين بالعمولة', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'قائمة التحقق من الامتثال الكاملة', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 34: الإدارة المالية
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 34;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'استلام عمولاتك: العملية المفصلة الكاملة', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'تكوين حساب الدفع (Stripe، PayPal، إلخ)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'تكرار المدفوعات والمواعيد النهائية (فهم النظام)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'تتبع جميع دخلك بدقة (لوحة المعلومات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'فصل المالية الشخصية والمهنية', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'إنشاء ميزانية شهرية واقعية وقابلة للتحقيق', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'إعادة الاستثمار مقابل الاستمتاع: إيجاد التوازن الصحيح', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'الادخار بذكاء للضرائب (المخصصات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'تنويع مصادر دخلك تدريجياً', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'العقلية أمام المبالغ الكبيرة الأولى من المال', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'تجنب الفخاخ المالية للمبتدئين (النفقات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'تخطيط استقلالك المالي (طويل الأجل)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'استثمار أرباحك بذكاء (الادخار، البورصة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'إنشاء صندوق طوارئ (الأمن المالي)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 35: العقلية المتقدمة
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 35;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'التطور العقلي من 0 إلى 10,000€: التغييرات الضرورية', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'إدارة الخوف من النجاح (نعم، إنه موجود)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'متلازمة المحتال المستوى 2 (عندما تنجح)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'البقاء متواضعاً ولكن طموحاً بشكل لا يصدق', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'التطوير الشخصي المستمر (التدريب الدائم)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'أفضل 10 كتب أساسية للسفراء (القائمة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'الموجهون والنماذج للمتابعة والدراسة', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'بناء المجتمع: إنشاء مجتمع حولك', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'العطاء في المقابل: خلق تأثير إيجابي', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'رؤية واضحة لسنة واحدة، 3 سنوات، 5 سنوات', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'التوازن بين الحياة المهنية/الحياة الشخصية', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'ممارسة الامتنان اليومية والاحتفال', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'التأمل والتصور المتقدمان', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'أن تصبح أفضل نسخة من نفسك', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 36: استكشاف الأخطاء وإصلاحها
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 36;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, '"لا أعرف ماذا أنشر" → 20 حلاً فورياً', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, '"فيديوهاتي لا تعمل" → تشخيص كامل', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, '"ليس لدي مشاهدات" → 15 سبباً محتملاً وحلولاً', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, '"لا أحد يرد على رسائلي المباشرة" → تصحيحات دقيقة', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, '"لم أحقق أي بيع هذا الشهر" → خطة عمل طارئة', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, '"حسابي محظور ظلياً" → إلغاء الحظر خطوة بخطوة', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, '"أفتقر إلى التحفيز" → استعادة النار الداخلية', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, '"ليس لدي وقت" → التحسين الجذري', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, '"المنافسة قوية جداً" → التمايز الاستراتيجي', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, '"أخاف من الكاميرا/الميكروفون" → التغلب النهائي', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, '"محيطي يثبط عزيمتي" → إدارة السلبية', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, '"أبيع فقط بالقطرة" → التسريع', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'الدعم الفني: أين تجد المساعدة بسرعة', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'الأسئلة الشائعة الضخمة: 100 سؤال شائع مجاب عليه', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 37: أسرار التصوير المتقدمة
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 37;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'لقطة الشاشة الاستراتيجية مقابل التسجيل المستمر', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'تكبيرات سلسة واحترافية على العناصر المهمة', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'حركة بطيئة على الأقسام الرئيسية (التركيز)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'تسريع للتصفح السريع (الكفاءة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'شاشة مقسمة: مقارنة عنصرين في وقت واحد', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'Picture-in-picture: أنت + الشاشة (دون إظهار الوجه)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'مؤشر متحرك لتوجيه انتباه المشاهد', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'التظليل والتعليقات التوضيحية الديناميكية في ما بعد الإنتاج', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'طمس استراتيجي لإخفاء العناصر الحساسة', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'انتقالات سينمائية بين صفحات مختلفة', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'حلقات وتكرارات للتركيز الأقصى', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'صادرات محسّنة لكل منصة محددة', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'حفظ وتنظيم جميع لقطاتك الخام (النظام)', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'مكتبة B-rolls قابلة لإعادة الاستخدام (توفير الوقت)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 38: محتوى "القيمة"
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 38;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'لماذا إعطاء قيمة مجانية يجذب المشترين', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'استخراج نصائح مجانية من الأكاديمية (بشكل أخلاقي)', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'مشاركة معاينة كاملة لدرس واحد (التشويق)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, '"ما تعلمته اليوم في الوحدة X"', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'تلخيص استراتيجية قوية من الأكاديمية', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'نصائح مجانية وقابلة للتنفيذ (إثبات شرعيتك)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, '"إليك خطأ مكلف تجنبته الأكاديمية"', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'تقديم القيمة = الثقة = المبيعات الطبيعية', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'التوازن المثالي: 80% قيمة / 20% عرض بيع', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'محتوى تعليمي مستمد مباشرة من الدروس', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, '"أقدم لك هذا مجاناً، تخيل الباقي المدفوع"', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'تشويقات ذكية تجعلك تريد الشراء حقاً', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'إنشاء محتوى "قابل للحفظ" و"قابل للمشاركة" (الانتشار الفيروسي)', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'أن تصبح سلطة معترف بها بفضل محتوى القيمة', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 39: الشهادة النهائية
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 39;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'ملخص كامل لجميع البرنامج (500+ درس)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'التقييم الذاتي: هل أنت جاهز حقاً الآن؟', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'اختبار الشهادة النهائي (100 سؤال)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'التحدي العملي الإلزامي: أول 1,000€ لك', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'توثيق وتقديم نتائجك الملموسة', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'الحصول على شارة السفير المعتمد الرسمية', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'الانضمام إلى مجتمع النخبة من أفضل السفراء', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'الوصول إلى الاجتماعات الرئيسية الشهرية الحصرية', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'فرص متقدمة (الشراكات، الإرشاد)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'الاستمرار في التعلم والتطور (التدريب المستمر)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'برنامج الإرشاد: أن تصبح موجهاً للسفراء الجدد', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'خطة عملك المفصلة للغاية لـ 90 يوماً القادمة', '[سأعطيك المحتوى لاحقاً]', FALSE, 12)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 40: استراتيجيات المستوى التالي
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 40;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'الانتقال من 10 ألف إلى 20 ألف يورو/شهر (خارطة طريق جديدة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'بناء فريق من السفراء تحتك', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'إنشاء برنامج التسويق بالعمولة الخاص بك', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'التنويع نحو منتجات/مجالات أخرى', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'العلامة التجارية الشخصية المتقدمة (حتى بدون إظهار وجهك)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'إنشاء منتجات رقمية تكميلية', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'ندوات وورش عمل مدفوعة (تدفق الإيرادات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'الاستشارة والتدريب 1-على-1 (المتميز)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'الأتمتة القصوى مع الفريق', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'الاستثمار في الإعلانات المدفوعة (Facebook Ads، TikTok Ads)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'إنشاء حركة حول علامتك التجارية', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'بناء الإرث: بناء شيء دائم', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'الأرقام السبعة: خارطة الطريق نحو 100 ألف يورو+/شهر', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'الحرية المالية والجغرافية الكاملة', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

END $$;

-- =====================================================
-- SKELETON COMPLETE!
-- =====================================================
-- ✅ Phase 1: برنامج السفير
-- ✅ 40 Modules
-- ✅ 550 Lessons (all with [سأعطيك المحتوى لاحقاً])
-- =====================================================
