-- =====================================================
-- PHASE 1 SKELETON: 40 MODULES + 500+ LESSONS
-- برنامج السفير (Ambassador Program)
-- =====================================================

-- =====================================================
-- STEP 1: CREATE TABLES
-- =====================================================

-- PHASES Table
CREATE TABLE IF NOT EXISTS public.phases (
  id SERIAL PRIMARY KEY,
  phase_number INTEGER UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT,
  color TEXT,
  is_locked BOOLEAN DEFAULT FALSE,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODULES (وحدات) Table
CREATE TABLE IF NOT EXISTS public.modules (
  id SERIAL PRIMARY KEY,
  phase_id INTEGER REFERENCES public.phases(id) ON DELETE CASCADE NOT NULL,
  module_number INTEGER NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  objective_ar TEXT,
  objective_en TEXT,
  badge TEXT,
  is_locked BOOLEAN DEFAULT FALSE,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(phase_id, module_number)
);

-- LESSONS (دروس) Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  lesson_number INTEGER NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  content_ar TEXT DEFAULT '[سأعطيك المحتوى لاحقاً]',
  content_en TEXT,
  video_url TEXT,
  resources json,
  duration_minutes INTEGER,
  is_locked BOOLEAN DEFAULT FALSE,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, lesson_number)
);

-- Enable RLS
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policies (everyone can read for now)
CREATE POLICY "Anyone can view phases" ON public.phases FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view modules" ON public.modules FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (TRUE);

-- Admin policies
CREATE POLICY "Admin can manage phases" ON public.phases FOR ALL USING (auth.email() = 'academyfrance75@gmail.com');
CREATE POLICY "Admin can manage modules" ON public.modules FOR ALL USING (auth.email() = 'academyfrance75@gmail.com');
CREATE POLICY "Admin can manage lessons" ON public.lessons FOR ALL USING (auth.email() = 'academyfrance75@gmail.com');


-- =====================================================
-- STEP 2: INSERT PHASE 1
-- =====================================================

INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, description_en, icon, color, is_locked, display_order)
VALUES (
  1,
  'برنامج السفير',
  'Ambassador Program',
  'برنامج شامل لتدريب السفراء على التسويق بالعمولة وتحقيق 10,000€ شهرياً',
  'Comprehensive program to train ambassadors in affiliate marketing and achieve €10,000/month',
  '🏛️',
  '#00d2ff',
  FALSE,
  1
)
ON CONFLICT (phase_number) DO UPDATE SET
  title_ar = EXCLUDED.title_ar,
  title_en = EXCLUDED.title_en,
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  updated_at = NOW();


-- =====================================================
-- STEP 3: INSERT ALL 40 MODULES
-- =====================================================

-- Get phase 1 ID
DO $$ 
DECLARE
  phase1_id INTEGER;
BEGIN
  SELECT id INTO phase1_id FROM public.phases WHERE phase_number = 1;

  -- Module 1: عقلية السفير الحديث
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 1, 'عقلية السفير الحديث', 'Modern Ambassador Mindset', 'تطوير العقلية الصحيحة لتحقيق النجاح', '🧠', FALSE, 1)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 2: فهم النظام البيئي
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 2, 'فهم النظام البيئي', 'Understanding the Ecosystem', 'فهم شامل للبرنامج والعروض', '🌍', FALSE, 2)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 3: الإعداد التقني الكامل
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 3, 'الإعداد التقني الكامل', 'Complete Technical Setup', 'إعداد جميع الأدوات والتطبيقات', '⚙️', FALSE, 3)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 4: الجمالية الاحترافية الإلزامية
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 4, 'الجمالية الاحترافية الإلزامية', 'Mandatory Professional Aesthetics', 'معايير المظهر الاحترافي', '📱', FALSE, 4)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 5: إنشاء الأفاتار بالذكاء الاصطناعي
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 5, 'إنشاء الأفاتار بالذكاء الاصطناعي', 'AI Avatar Creation', 'إنشاء الأفاتارات الاحترافية', '🤖', FALSE, 5)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 6: تصوير صفحة البيع
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 6, 'تصوير صفحة البيع', 'Filming the Sales Page', 'تصوير احترافي لصفحة البيع', '🖥️', FALSE, 6)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 7: تصوير الأكاديمية الكاملة
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 7, 'تصوير الأكاديمية الكاملة', 'Filming the Complete Academy', 'جولة شاملة داخل الأكاديمية', '🎓', FALSE, 7)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 8: محتوى "الاكتشاف"
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 8, 'محتوى "الاكتشاف"', 'Discovery Content', 'إنشاء محتوى اكتشاف جذاب', '🎬', FALSE, 8)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 9: عرض المكافآت
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 9, 'عرض المكافآت', 'Showcasing Bonuses', 'عرض احترافي للمكافآت', '🎁', FALSE, 9)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 10: إتقان لوحة التحكم
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 10, 'إتقان لوحة التحكم', 'Dashboard Mastery', 'استخدام لوحة التحكم للبيع', '📊', FALSE, 10)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 11: استراتيجية التقييمات
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 11, 'استراتيجية التقييمات', 'Reviews Strategy', 'الاستفادة القصوى من التقييمات', '⭐', FALSE, 11)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 12: الحصول على تقييمات خارجية
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 12, 'الحصول على تقييمات خارجية', 'Getting External Reviews', 'جمع تقييمات من الآخرين', '🤝', FALSE, 12)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 13: فيديوهات بدون وجه
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 13, 'فيديوهات بدون وجه', 'Faceless Videos', 'إنشاء محتوى دون إظهار الوجه', '🎭', FALSE, 13)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 14: إنشاء فيديو متقدم
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 14, 'إنشاء فيديو متقدم', 'Advanced Video Creation', 'تقنيات التصوير المتقدمة', '🎥', FALSE, 14)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 15: إتقان المونتاج بـ CapCut
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 15, 'إتقان المونتاج بـ CapCut', 'CapCut Mastery', 'مهارات المونتاج الاحترافية', '✂️', FALSE, 15)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 16: النصوص والكتابة الإعلانية
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 16, 'النصوص والكتابة الإعلانية', 'Scripts and Copywriting', 'كتابة نصوص بيعية فعالة', '✍️', FALSE, 16)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 17: المحتوى المقارن
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 17, 'المحتوى المقارن', 'Comparative Content', 'إنشاء مقارنات مؤثرة', '⚖️', FALSE, 17)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 18: الأدلة الاجتماعية المتقدمة
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 18, 'الأدلة الاجتماعية المتقدمة', 'Advanced Social Proof', 'استراتيجيات الإثبات الاجتماعي', '💯', FALSE, 18)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 19: استراتيجية المحتوى 2025
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 19, 'استراتيجية المحتوى 2025', 'Content Strategy 2025', 'استراتيجيات المحتوى الحديثة', '📱', FALSE, 19)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 20: البحث والمراقبة
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 20, 'البحث والمراقبة', 'Research and Monitoring', 'تحليل المنافسين والاتجاهات', '🔍', FALSE, 20)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 21: سيطرة TikTok 2025
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 21, 'سيطرة TikTok 2025', 'TikTok Domination 2025', 'إتقان منصة TikTok', '🎵', FALSE, 21)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 22: إتقان Instagram Reels
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 22, 'إتقان Instagram Reels', 'Instagram Reels Mastery', 'إتقان Reels على Instagram', '📸', FALSE, 22)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 23: Stories التي تبيع
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 23, 'Stories التي تبيع', 'Stories that Sell', 'استخدام Stories للبيع', '📲', FALSE, 23)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 24: مخطط البيع المباشر
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 24, 'مخطط البيع المباشر', 'Live Selling Blueprint', 'استراتيجية البيع المباشر', '🔴', FALSE, 24)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 25: جولة الأكاديمية المباشرة
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 25, 'جولة الأكاديمية المباشرة', 'Live Academy Tour', 'جولات مباشرة في الأكاديمية', '🔴', FALSE, 25)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 26: نظام البيع
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 26, 'نظام البيع', 'Sales System', 'نظام البيع الكامل', '💰', FALSE, 26)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 27: إتقان الاعتراضات
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 27, 'إتقان الاعتراضات', 'Objection Mastery', 'التعامل مع الاعتراضات', '🛡️', FALSE, 27)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 28: تسلسلات البيع
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 28, 'تسلسلات البيع', 'Sales Sequences', 'إنشاء تسلسلات بيع فعالة', '🎯', FALSE, 28)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 29: أتمتة الذكاء الاصطناعي
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 29, 'أتمتة الذكاء الاصطناعي', 'AI Automation', 'استخدام الذكاء الاصطناعي للأتمتة', '🤖', FALSE, 29)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 30: التحليلات والتحسين
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 30, 'التحليلات والتحسين', 'Analytics and Optimization', 'تحليل الأداء والتحسين', '📊', FALSE, 30)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 31: التوسع إلى 10 آلاف
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 31, 'التوسع إلى 10 آلاف', 'Scaling to 10K', 'الوصول إلى 10,000€ شهرياً', '🚀', FALSE, 31)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 32: روتين السفير
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 32, 'روتين السفير', 'Ambassador Routine', 'الروتين اليومي للنجاح', '⏰', FALSE, 32)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 33: الجوانب القانونية
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 33, 'الجوانب القانونية', 'Legal Aspects', 'القانون والامتثال', '⚖️', FALSE, 33)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 34: الإدارة المالية
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 34, 'الإدارة المالية', 'Financial Management', 'إدارة الأموال بذكاء', '💳', FALSE, 34)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 35: العقلية المتقدمة
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 35, 'العقلية المتقدمة', 'Advanced Mindset', 'العقلية المتقدمة للنجاح', '🔥', FALSE, 35)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 36: استكشاف الأخطاء وإصلاحها
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 36, 'استكشاف الأخطاء وإصلاحها', 'Troubleshooting', 'حل المشاكل الشائعة', '🔧', FALSE, 36)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 37: أسرار التصوير المتقدمة
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 37, 'أسرار التصوير المتقدمة', 'Advanced Filming Secrets', 'تقنيات التصوير السرية', '🎥', FALSE, 37)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 38: محتوى "القيمة"
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 38, 'محتوى "القيمة"', 'Value Content', 'إنشاء محتوى ذو قيمة', '💎', FALSE, 38)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 39: الشهادة النهائية
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 39, 'الشهادة النهائية', 'Final Certification', 'الحصول على الشهادة', '🎓', FALSE, 39)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

  -- Module 40: استراتيجيات المستوى التالي
  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order)
  VALUES (phase1_id, 40, 'استراتيجيات المستوى التالي', 'Next Level Strategies', 'الانتقال إلى المستوى التالي', '🌟', FALSE, 40)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET title_ar = EXCLUDED.title_ar, updated_at = NOW();

END $$;


-- =====================================================
-- STEP 4: INSERT ALL LESSONS (500+)
-- =====================================================
-- This will be a VERY LONG section with all lessons
-- I'll continue in the next part...
