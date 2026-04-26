-- =====================================================
-- PHASE 1 COMPLETE INSTALLATION - MASTER FILE
-- برنامج السفير (Ambassador Program)
-- =====================================================
-- Execute this ENTIRE file in Supabase SQL Editor
-- It will create everything in the correct order
-- =====================================================

-- STEP 1: Create Tables and RLS
-- (from phase1_skeleton.sql)
-- NOTE: Using CREATE IF NOT EXISTS to preserve existing phases

CREATE TABLE IF NOT EXISTS public.phases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_id UUID REFERENCES public.phases(id) ON DELETE CASCADE NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  lesson_number INTEGER NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  content_ar TEXT DEFAULT '[سأعطيك المحتوى لاحقاً]',
  content_en TEXT,
  video_url TEXT,
  resources JSON,
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view phases" ON public.phases;
DROP POLICY IF EXISTS "Anyone can view modules" ON public.modules;
DROP POLICY IF EXISTS "Anyone can view lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admin can manage phases" ON public.phases;
DROP POLICY IF EXISTS "Admin can manage modules" ON public.modules;
DROP POLICY IF EXISTS "Admin can manage lessons" ON public.lessons;

-- RLS Policies (everyone can read for now)
CREATE POLICY "Anyone can view phases" ON public.phases FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view modules" ON public.modules FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (TRUE);

-- Admin policies
CREATE POLICY "Admin can manage phases" ON public.phases FOR ALL USING (auth.email() = 'academyfrance75@gmail.com');
CREATE POLICY "Admin can manage modules" ON public.modules FOR ALL USING (auth.email() = 'academyfrance75@gmail.com');
CREATE POLICY "Admin can manage lessons" ON public.lessons FOR ALL USING (auth.email() = 'academyfrance75@gmail.com');


-- STEP 2: Insert Phase 1
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


-- STEP 3: Insert all 40 Modules
DO $$ 
DECLARE
  phase1_id UUID;
BEGIN
  SELECT id INTO phase1_id FROM public.phases WHERE phase_number = 1;

  INSERT INTO public.modules (phase_id, module_number, title_ar, title_en, objective_ar, badge, is_locked, display_order) VALUES
  (phase1_id, 1, 'عقلية السفير الحديث', 'Modern Ambassador Mindset', 'تطوير العقلية الصحيحة لتحقيق النجاح', '🧠', FALSE, 1),
  (phase1_id, 2, 'فهم النظام البيئي', 'Understanding the Ecosystem', 'فهم شامل للبرنامج والعروض', '🌍', FALSE, 2),
  (phase1_id, 3, 'الإعداد التقني الكامل', 'Complete Technical Setup', 'إعداد جميع الأدوات والتطبيقات', '⚙️', FALSE, 3),
  (phase1_id, 4, 'الجمالية الاحترافية الإلزامية', 'Mandatory Professional Aesthetics', 'معايير المظهر الاحترافي', '📱', FALSE, 4),
  (phase1_id, 5, 'إنشاء الأفاتار بالذكاء الاصطناعي', 'AI Avatar Creation', 'إنشاء الأفاتارات الاحترافية', '🤖', FALSE, 5),
  (phase1_id, 6, 'تصوير صفحة البيع', 'Filming the Sales Page', 'تصوير احترافي لصفحة البيع', '🖥️', FALSE, 6),
  (phase1_id, 7, 'تصوير الأكاديمية الكاملة', 'Filming the Complete Academy', 'جولة شاملة داخل الأكاديمية', '🎓', FALSE, 7),
  (phase1_id, 8, 'محتوى "الاكتشاف"', 'Discovery Content', 'إنشاء محتوى اكتشاف جذاب', '🎬', FALSE, 8),
  (phase1_id, 9, 'عرض المكافآت', 'Showcasing Bonuses', 'عرض احترافي للمكافآت', '🎁', FALSE, 9),
  (phase1_id, 10, 'إتقان لوحة التحكم', 'Dashboard Mastery', 'استخدام لوحة التحكم للبيع', '📊', FALSE, 10),
  (phase1_id, 11, 'استراتيجية التقييمات', 'Reviews Strategy', 'الاستفادة القصوى من التقييمات', '⭐', FALSE, 11),
  (phase1_id, 12, 'الحصول على تقييمات خارجية', 'Getting External Reviews', 'جمع تقييمات من الآخرين', '🤝', FALSE, 12),
  (phase1_id, 13, 'فيديوهات بدون وجه', 'Faceless Videos', 'إنشاء محتوى دون إظهار الوجه', '🎭', FALSE, 13),
  (phase1_id, 14, 'إنشاء فيديو متقدم', 'Advanced Video Creation', 'تقنيات التصوير المتقدمة', '🎥', FALSE, 14),
  (phase1_id, 15, 'إتقان المونتاج بـ CapCut', 'CapCut Mastery', 'مهارات المونتاج الاحترافية', '✂️', FALSE, 15),
  (phase1_id, 16, 'النصوص والكتابة الإعلانية', 'Scripts and Copywriting', 'كتابة نصوص بيعية فعالة', '✍️', FALSE, 16),
  (phase1_id, 17, 'المحتوى المقارن', 'Comparative Content', 'إنشاء مقارنات مؤثرة', '⚖️', FALSE, 17),
  (phase1_id, 18, 'الأدلة الاجتماعية المتقدمة', 'Advanced Social Proof', 'استراتيجيات الإثبات الاجتماعي', '💯', FALSE, 18),
  (phase1_id, 19, 'استراتيجية المحتوى 2025', 'Content Strategy 2025', 'استراتيجيات المحتوى الحديثة', '📱', FALSE, 19),
  (phase1_id, 20, 'البحث والمراقبة', 'Research and Monitoring', 'تحليل المنافسين والاتجاهات', '🔍', FALSE, 20),
  (phase1_id, 21, 'سيطرة TikTok 2025', 'TikTok Domination 2025', 'إتقان منصة TikTok', '🎵', FALSE, 21),
  (phase1_id, 22, 'إتقان Instagram Reels', 'Instagram Reels Mastery', 'إتقان Reels على Instagram', '📸', FALSE, 22),
  (phase1_id, 23, 'Stories التي تبيع', 'Stories that Sell', 'استخدام Stories للبيع', '📲', FALSE, 23),
  (phase1_id, 24, 'مخطط البيع المباشر', 'Live Selling Blueprint', 'استراتيجية البيع المباشر', '🔴', FALSE, 24),
  (phase1_id, 25, 'جولة الأكاديمية المباشرة', 'Live Academy Tour', 'جولات مباشرة في الأكاديمية', '🔴', FALSE, 25),
  (phase1_id, 26, 'نظام البيع', 'Sales System', 'نظام البيع الكامل', '💰', FALSE, 26),
  (phase1_id, 27, 'إتقان الاعتراضات', 'Objection Mastery', 'التعامل مع الاعتراضات', '🛡️', FALSE, 27),
  (phase1_id, 28, 'تسلسلات البيع', 'Sales Sequences', 'إنشاء تسلسلات بيع فعالة', '🎯', FALSE, 28),
  (phase1_id, 29, 'أتمتة الذكاء الاصطناعي', 'AI Automation', 'استخدام الذكاء الاصطناعي للأتمتة', '🤖', FALSE, 29),
  (phase1_id, 30, 'التحليلات والتحسين', 'Analytics and Optimization', 'تحليل الأداء والتحسين', '📊', FALSE, 30),
  (phase1_id, 31, 'التوسع إلى 10 آلاف', 'Scaling to 10K', 'الوصول إلى 10,000€ شهرياً', '🚀', FALSE, 31),
  (phase1_id, 32, 'روتين السفير', 'Ambassador Routine', 'الروتين اليومي للنجاح', '⏰', FALSE, 32),
  (phase1_id, 33, 'الجوانب القانونية', 'Legal Aspects', 'القانون والامتثال', '⚖️', FALSE, 33),
  (phase1_id, 34, 'الإدارة المالية', 'Financial Management', 'إدارة الأموال بذكاء', '💳', FALSE, 34),
  (phase1_id, 35, 'العقلية المتقدمة', 'Advanced Mindset', 'العقلية المتقدمة للنجاح', '🔥', FALSE, 35),
  (phase1_id, 36, 'استكشاف الأخطاء وإصلاحها', 'Troubleshooting', 'حل المشاكل الشائعة', '🔧', FALSE, 36),
  (phase1_id, 37, 'أسرار التصوير المتقدمة', 'Advanced Filming Secrets', 'تقنيات التصوير السرية', '🎥', FALSE, 37),
  (phase1_id, 38, 'محتوى "القيمة"', 'Value Content', 'إنشاء محتوى ذو قيمة', '💎', FALSE, 38),
  (phase1_id, 39, 'الشهادة النهائية', 'Final Certification', 'الحصول على الشهادة', '🎓', FALSE, 39),
  (phase1_id, 40, 'استراتيجيات المستوى التالي', 'Next Level Strategies', 'الانتقال إلى المستوى التالي', '🌟', FALSE, 40)
  ON CONFLICT (phase_id, module_number) DO UPDATE SET 
    title_ar = EXCLUDED.title_ar,
    title_en = EXCLUDED.title_en,
    badge = EXCLUDED.badge,
    updated_at = NOW();

END $$;


-- NOTE: The lessons will be inserted in the next section
-- Due to file size, this is split into a separate execution
-- After running this file, run: phase1_all_lessons_MASTER.sql

-- Verification Query
SELECT 
  'Installation Part 1 Complete!' as status,
  (SELECT COUNT(*) FROM public.phases) as phases_count,
  (SELECT COUNT(*) FROM public.modules) as modules_count,
  (SELECT COUNT(*) FROM public.lessons) as lessons_count;
