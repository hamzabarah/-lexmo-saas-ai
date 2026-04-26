-- =====================================================
-- RESTORE ALL 11 PHASES + PHASE 1 MODULES
-- =====================================================
-- This script recreates ALL phases from the screenshot
-- Phase 1: UNLOCKED (برنامج السفير)
-- Phases 2-11: LOCKED (verrouillées)
-- =====================================================

-- STEP 1: Insert ALL 11 Phases
INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, description_en, icon, color, is_locked, display_order)
VALUES 
  -- Phase 1: برنامج السفير (UNLOCKED)
  (1, 'برنامج السفير', 'Ambassador Program', 'برنامج السفير', 'برنامج السفير', '🏛️', '#00d2ff', FALSE, 1),
  
  -- Phase 2: SMART ENTRY (LOCKED)
  (2, 'الدخول الذكي إلى الإيكوميرس', 'SMART ENTRY', 'الدخول الذكي إلى الإيكوميرس', 'Smart Entry to E-commerce', '✅', '#10b981', TRUE, 2),
  
  -- Phase 3: SYSTEM BUILDING (LOCKED)
  (3, 'بناء النظام', 'SYSTEM BUILDING', 'المرحلة 3: بناء نظام مالي قوي', 'Building a Strong Financial System', '🔧', '#8b5cf6', TRUE, 3),
  
  -- Phase 4: META ADS (LOCKED)
  (4, 'إتقان إعلانات ميتا', 'META ADS', 'المرحلة 4: Facebook & Instagram Ads', 'META Ads Mastery', '📱', '#3b82f6', TRUE, 4),
  
  -- Phase 5: DROPSHIPPING 2.0 (LOCKED)
  (5, 'دروبشيبينغ 2.0', 'DROPSHIPPING 2.0', 'المرحلة 5: Next-Generation Dropshipping', 'Dropshipping 2.0', '📦', '#f97316', TRUE, 5),
  
  -- Phase 6: TIKTOK SHOP (LOCKED)
  (6, 'متجر تيك توك', 'TIKTOK SHOP', 'المرحلة 6: TikTok Shop Mastery', 'TikTok Shop Mastery', '🎵', '#ec4899', TRUE, 6),
  
  -- Phase 7: GOOGLE ADS (LOCKED)
  (7, 'إعلانات جوجل', 'GOOGLE ADS', 'المرحلة 7: Google Ads Mastery', 'Google Ads Mastery', '🔍', '#ef4444', TRUE, 7),
  
  -- Phase 8: SNAPCHAT ADS (LOCKED)
  (8, 'إعلانات سناب شات', 'SNAPCHAT ADS', 'المرحلة 8: Snapchat Ads Mastery', 'Snapchat Ads Mastery', '👻', '#eab308', TRUE, 8),
  
  -- Phase 9: TIKTOK ADS (LOCKED)
  (9, 'إعلانات تيك توك', 'TIKTOK ADS', 'المرحلة 9: TikTok Ads Mastery', 'TikTok Ads Mastery', '🎥', '#06b6d4', TRUE, 9),
  
  -- Phase 10: AMAZON FBA (LOCKED)
  (10, 'أمازون FBA', 'AMAZON FBA', 'المرحلة 10: Amazon FBA Mastery', 'Amazon FBA Mastery', '📦', '#f59e0b', TRUE, 10),
  
  -- Phase 11: BRAND BUILDING (LOCKED)
  (11, 'بناء علامة تجارية قوية', 'BRAND BUILDING', 'المرحلة 11: بناء علامة تجارية قوية', 'Building a Strong Brand', '🏆', '#a855f7', TRUE, 11)
  
ON CONFLICT (phase_number) DO UPDATE SET
  title_ar = EXCLUDED.title_ar,
  title_en = EXCLUDED.title_en,
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  is_locked = EXCLUDED.is_locked,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();


-- STEP 2: Insert 40 Modules for Phase 1 ONLY
DO $$ 
DECLARE
  phase1_id UUID;
BEGIN
  -- Get Phase 1 ID
  SELECT id INTO phase1_id FROM public.phases WHERE phase_number = 1;

  -- Insert all 40 modules for Phase 1
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
    objective_ar = EXCLUDED.objective_ar,
    badge = EXCLUDED.badge,
    is_locked = EXCLUDED.is_locked,
    updated_at = NOW();

END $$;


-- Verification Query
SELECT 
  'All 11 Phases Restored!' as status,
  (SELECT COUNT(*) FROM public.phases) as total_phases,
  (SELECT COUNT(*) FROM public.phases WHERE is_locked = FALSE) as unlocked_phases,
  (SELECT COUNT(*) FROM public.phases WHERE is_locked = TRUE) as locked_phases,
  (SELECT COUNT(*) FROM public.modules WHERE phase_id = (SELECT id FROM public.phases WHERE phase_number = 1)) as phase1_modules;

-- Expected result:
-- total_phases: 11
-- unlocked_phases: 1 (Phase 1)
-- locked_phases: 10 (Phases 2-11)
-- phase1_modules: 40
