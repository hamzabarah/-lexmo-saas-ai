-- =====================================================
-- PHASE 1 LESSONS PART 3: MODULES 21-40
-- =====================================================

DO $$
DECLARE
  phase1_id UUID;
  current_module_id UUID;
BEGIN
  SELECT id INTO phase1_id FROM public.phases WHERE phase_number = 1;

  -- =====================================================
  -- MODULE 21: سيطرة TikTok 2025
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 21;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'خوارزمية TikTok 2025 موضحة بالتفصيل', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'تحسين ملفك الشخصي للتحويل الأقصى', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'السيرة الذاتية المغناطيسية: 150 حرفاً يبيعون', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'الرابط في السيرة الذاتية: استراتيجية متقدمة وبدائل', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'منشورك الأول: كيف تبدأ بقوة', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'إنشاء سلسلة محتوى إدمانية (المشاهدة المكثفة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'أوقات النشر الاستراتيجية (جمهورك)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'الرد على التعليقات لتعزيز الخوارزمية', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'إنشاء محتوى "قابل للتعليق" (المشاركة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'التعاون والثنائيات الاستراتيجية (النمو)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'TikTok Live: إعداد بث مباشر يبيع (قائمة التحقق)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'تحليلات TikTok: فهم جميع المقاييس', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'تجنب الحظر الظلي والأخطاء القاتلة', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'حيل النمو TikTok 2025 التي تعمل', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 22: إتقان Instagram Reels
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 22;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'Reels مقابل Feed مقابل Stories: ماذا تنشر وأين ومتى', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'تحسين ملفك الشخصي على Instagram للبيع', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'السيرة الذاتية Instagram: الصيغة الفائزة في 150 حرفاً', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'Highlights: التنظيم للتحويل (سرد القصص المرئي)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'Reels: الخوارزمية وأفضل الممارسات 2025', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'لعبة الأغلفة (الصور المصغرة) الجذابة', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'النشر المتقاطع الذكي TikTok → Instagram (التكيف)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'Stories: الأنواع السبعة التي تشارك حقاً', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'Stories المميزة: واجهة العرض الدائمة', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'الملصقات التفاعلية لتعزيز المشاركة', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'Instagram Live: استراتيجية البيع المفصلة', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'أتمتة DM الأخلاقية (بدون بوت) للتأهيل', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'تحليلات Instagram مفككة (المقاييس الرئيسية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'حيل النمو Instagram 2025', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 23: Stories التي تبيع
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 23;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'علم نفس Stories: لماذا تحول', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, '10 قوالب Stories التي تبيع', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'Launch story: الإطار الكامل خطوة بخطوة', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'أنواع launch stories: التشويق، الكشف، الإلحاح', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'العد التنازلي والإلحاح الحقيقي في Stories', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'استطلاعات الرأي والاختبارات للمشاركة وتأهيل العملاء المحتملين', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'وراء الكواليس الأصيل (الاتصال الإنساني)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'شهادات العملاء المدمجة في Stories', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'الأسئلة الشائعة المتوقعة في Stories (الاعتراضات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'ملصقات الروابط: تحسين معدل النقر', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'Stories متسلسلة: إنشاء قمع مبيعات', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'الإيقاع والتردد الأمثل لـ Stories', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'إعادة تدوير وإعادة استخدام أفضل Stories', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'بدائل Stories "swipe up" (بدون 10 آلاف متابع)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 24: مخطط البيع المباشر
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 24;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'لماذا البث المباشر هو السلاح السري النهائي 2025', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'إعداد البث المباشر: قائمة تحقق كاملة 50 نقطة', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'هيكل بث مباشر يبيع (تنسيق 30 دقيقة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'هيكل بث مباشر يبيع (تنسيق 60 دقيقة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'المراحل الثلاث لبث مباشر ناجح (مقدمة، محتوى، إغلاق)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'سيناريو مفصل دقيقة بدقيقة لبث مباشر للبيع', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'إدارة المشاهدين والحفاظ على الطاقة عالية', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'الرد على الأسئلة مباشرة (الاستراتيجية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'خلق الإلحاح في البث المباشر بطريقة أخلاقية', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'الإغلاق أثناء البث المباشر: تقنيات مثبتة', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'بعد البث المباشر: الاستفادة من الزخم (المتابعة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'الترويج لبثك المباشر مسبقاً (التشويق)', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'تحليل وتحسين بثوثك المباشرة (المقاييس)', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'بث مباشر "Academy Tour": عرض الداخل بدون وجه', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 25: جولة الأكاديمية المباشرة
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 25;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'مفهوم ثوري: بث مباشر "داخل الأكاديمية"', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'إعداد البث المباشر لجولة الأكاديمية: قائمة تحقق محددة', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'الهيكل الأمثل لبث جولة الأكاديمية المباشر (60 دقيقة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'البداية الجذابة: "مرحباً، اليوم أريكم كل شيء"', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'التنقل في الأكاديمية في الوقت الفعلي (السلاسة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'التعليق على الوحدات بحماس معدي', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'فتح دروس عشوائية (تأثير المفاجأة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'التفاعل مع المكافآت كما لو كنت تكتشفها', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'قراءة تقييمات صفحة الهبوط مباشرة', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'الرد على الأسئلة بالعرض مباشرة', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'خلق الإلحاح: "العرض ينتهي قريباً"', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'عرض لوحة التحكم والإحصائيات الممكنة', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'إغلاق البث المباشر: دعوة قوية لاتخاذ إجراء', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'بعد البث المباشر: الاستفادة في الرسائل المباشرة (النصوص)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 26: نظام البيع
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 26;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'رحلة الشراء الكاملة من الألف إلى الياء', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'تأهيل العميل المحتمل في 3 أسئلة استراتيجية', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'الرسائل المباشرة: 20 قالب رسالة تحول', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'إنشاء محادثة حقيقية، ليس بيعاً قوياً', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'التوقيت المثالي لإرسال رابط الشراء', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'إدارة "سأفكر في الأمر" بالتعاطف', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'المتابعات الفعالة دون أن تكون ثقيلاً أو مصراً', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'معالجة الاعتراضات الشائعة (30 مثالاً)', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'الإغلاق بالتعاطف والأصالة (الاتصال)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'مرافقة العميل المحتمل حتى الدفع', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'تأكيد التسجيل والتهنئة بحرارة', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'المتابعة بعد البيع للحصول على الشهادات', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'إنشاء عملاء سفراء متكررين', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'نص البيع الحواري الكامل', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 27: إتقان الاعتراضات
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 27;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'الـ 20 اعتراضاً الأكثر شيوعاً المدرجة', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, '"إنه غالٍ جداً" → 10 ردود مختبرة ومعتمدة', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, '"ليس لدي وقت" → التغلب الأنيق', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, '"لست متأكداً من أنه سينجح" → الطمأنينة', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, '"سأتحدث إلى زوجي/عائلتي" → الإدارة', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, '"أخاف من الاحتيال/النصب" → بناء المصداقية', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, '"لن ينجح معي على وجه التحديد" → التخصيص', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, '"سأبدأ غداً/الاثنين/الشهر القادم" → خلق الإلحاح', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, '"ليس لدي مال الآن" → حلول الدفع', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'الاعتراضات الصامتة: اكتشافها ومعالجتها', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'إعادة صياغة إيجابية لجميع الاعتراضات', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'الشهادات كردود على الاعتراضات', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'إنشاء وثيقة مكافحة الاعتراضات الشخصية', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'ممارسة الردود (لعب الأدوار والتدريب)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 28: تسلسلات البيع
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 28;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'سلسلة اليوم 1-7: "أسبوعي الأول في الأكاديمية"', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'سلسلة الاكتشاف: "وحدة واحدة محللة يومياً"', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'سلسلة الم كافآت: "مكافأة واحدة مكشوفة يومياً لمدة 10 أيام"', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'سلسلة التقييمات: "قراءة تقييم واحد من الصفحة يومياً"', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'سلسلة التحول: "قبل مقابل بعد التوثيق"', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'سلسلة الأسئلة الشائعة: "سؤال شائع واحد لكل فيديو"', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'سلسلة الأدلة: "نتائج الأعضاء كل يوم"', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'سلسلة الإلحاح: "لم يتبق سوى X أيام لهذا العرض"', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'سلسلة الامتنان: "ما قدمته لي الأكاديمية"', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'سلسلة لوحة التحكم: "تقدمي أسبوعاً بعد أسبوع"', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'خلق الترقب للحلقة التالية', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'التشويق الفعال: "غداً أريكم الأمر المجنون..."', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'خاتمة السلسلة: "الآن دورك للعب"', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'إعادة استخدام السلاسل التي تعمل (دائمة الخضرة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 29: أتمتة الذكاء الاصطناعي
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 29;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'ChatGPT لإنشاء نصوصك (مطالبات قوية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'توليد أفكار محتوى لا نهائية بالذكاء الاصطناعي', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'الذكاء الاصطناعي لكتابة التسميات التوضيحية والأوصاف المحسنة', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'الردود التلقائية على التعليقات (أخلاقية وفعالة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'إنشاء مرئيات احترافية باستخدام MidJourney/DALL-E', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'التعليق الصوتي بالذكاء الاصطناعي الطبيعي للغاية (ElevenLabs، Murf)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'الترجمة التلقائية للمحتوى متعدد اللغات', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'قوالب Canva + الذكاء الاصطناعي = إنتاج محتوى سريع', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'تحليل الاتجاهات التلقائي (الأدوات)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'إنشاء صور مصغرة جذابة بالذكاء الاصطناعي', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'مساعدك الافتراضي بالذكاء الاصطناعي: سير عمل كامل', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'حدود الذكاء الاصطناعي: البقاء حقيقياً وإنسانياً', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'الجمع بين الذكاء الاصطناعي والأصالة للحصول على أفضل نتيجة', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'أدوات الذكاء الاصطناعي الأساسية 2025 (القائمة المحدثة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- =====================================================
  -- MODULE 30: التحليلات والتحسين
  -- =====================================================
  SELECT id INTO current_module_id FROM public.modules WHERE phase_id = phase1_id AND module_number = 30;
  
  INSERT INTO public.lessons (module_id, lesson_number, title_ar, content_ar, is_locked, display_order) VALUES
  (current_module_id, 1, 'المقاييس العشرة التي تهم حقاً (التركيز)', '[سأعطيك المحتوى لاحقاً]', FALSE, 1),
  (current_module_id, 2, 'فهم الوصول مقابل المرات الظاهرة مقابل المشاركة', '[سأعطيك المحتوى لاحقاً]', FALSE, 2),
  (current_module_id, 3, 'معدل التحويل: حسابه وتحسينه', '[سأعطيك المحتوى لاحقاً]', FALSE, 3),
  (current_module_id, 4, 'اختبار A/B المنهجي على وسائل التواصل الاجتماعي', '[سأعطيك المحتوى لاحقاً]', FALSE, 4),
  (current_module_id, 5, 'تحديد أفضل محتوياتك (وفهم السبب)', '[سأعطيك المحتوى لاحقاً]', FALSE, 5),
  (current_module_id, 6, 'تحديد أسوأ محتوياتك (وتصحيح الأخطاء)', '[سأعطيك المحتوى لاحقاً]', FALSE, 6),
  (current_module_id, 7, 'أنماط النمو: اكتشافها وإعادة إنتاجها', '[سأعطيك المحتوى لاحقاً]', FALSE, 7),
  (current_module_id, 8, 'الأوقات المثلى: العثور على أوقاتك على وجه التحديد', '[سأعطيك المحتوى لاحقاً]', FALSE, 8),
  (current_module_id, 9, 'رؤى الجمهور: من يتابعك حقاً (الديموغرافيا)', '[سأعطيك المحتوى لاحقاً]', FALSE, 9),
  (current_module_id, 10, 'لوحة معلومات شخصية Excel/Sheets (نموذج مقدم)', '[سأعطيك المحتوى لاحقاً]', FALSE, 10),
  (current_module_id, 11, 'مؤشرات الأداء الرئيسية الأسبوعية لتتبعها بدقة', '[سأعطيك المحتوى لاحقاً]', FALSE, 11),
  (current_module_id, 12, 'التقرير الشهري والتعديلات الاستراتيجية', '[سأعطيك المحتوى لاحقاً]', FALSE, 12),
  (current_module_id, 13, 'اتخاذ القرارات المستندة إلى البيانات (المنهجية)', '[سأعطيك المحتوى لاحقاً]', FALSE, 13),
  (current_module_id, 14, 'أدوات التحليلات المتقدمة (مجانية ومدفوعة)', '[سأعطيك المحتوى لاحقاً]', FALSE, 14)
  ON CONFLICT (module_id, lesson_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();


  -- Continue with modules 31-40 in next part...
  
END $$;
