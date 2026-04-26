-- Seed Phase 2 Units (Course Modules) and Module 1 Lessons ONLY
-- Respects variable lesson counts by only inserting known content.

DO $$
DECLARE
  p_id uuid;
  u_id uuid;
BEGIN
  -- 1. Ensure Phase 2 exists
  SELECT id INTO p_id FROM public.phases WHERE phase_number = 2;
  
  -- Clear existing Units for Phase 2 (Cascades to lessons)
  DELETE FROM public.course_modules WHERE phase_id = p_id;
  DELETE FROM public.lessons WHERE phase_id = p_id; -- Safety cleanup

  -- =================================================================
  -- UNIT 01: مقدمة الإيكومرس (We have content)
  -- =================================================================
  INSERT INTO public.course_modules (phase_id, module_number, badge, title_ar, title_en, profit_scenario_ar, expected_result_ar, is_locked)
  VALUES (p_id, 1, 'SE 01', 'مقدمة الإيكومرس 🌍', 'Ecommerce Intro', 'توفير 2,000€ من الأخطاء', 'تفهم السوق وتعرف أي طريق تسلك.', false)
  RETURNING id INTO u_id;

      -- Lesson 1
      INSERT INTO public.lessons (phase_id, course_module_id, module_number, title_ar, title_en, content_ar, order_index, is_locked)
      VALUES (p_id, u_id, 1, 'فهم ما هو الإيكومرس الحقيقي', 'What is Ecommerce', 
      '## الدرس 1: فهم ما هو الإيكومرس الحقيقي

**🎯 هدف الدرس:**
فهم الإيكومرس بكلمات بسيطة جداً

### 【ما هو الإيكومرس؟】
ببساطة شديدة: الإيكومرس = بيع منتجات عبر الإنترنت.
بدلاً من أن يكون عندك محل في الشارع، يكون عندك "متجر" على الإنترنت.

### 【مثال بسيط】
❌ **الطريقة التقليدية:** محل، إيجار، مخزون.
✅ **الإيكومرس:** متجر أونلاين، دروبشيبينغ، زبائن عالميين.

### 【لماذا الآن؟】
📊 **أرقام مهمة:**
- 2.14 مليار شخص يشترون أونلاين
- نمو 15% سنويا

✅ **مهمة الدرس:**
☐ فهمت أن الإيكومرس = بيع عبر الإنترنت
☐ فهمت أن الفرصة كبيرة الآن', 1, false);

      -- Lesson 2
      INSERT INTO public.lessons (phase_id, course_module_id, module_number, title_ar, title_en, content_ar, order_index, is_locked)
      VALUES (p_id, u_id, 2, 'الفرق بين النماذج المختلفة', 'Different Models', '## محتوى الدرس 2...', 2, false);

      -- Lesson 3
      INSERT INTO public.lessons (phase_id, course_module_id, module_number, title_ar, title_en, content_ar, order_index, is_locked)
      VALUES (p_id, u_id, 3, 'اختيار النموذج المناسب لك', 'Choosing Model', '## محتوى الدرس 3...', 3, false);

      -- Lesson 4
      INSERT INTO public.lessons (phase_id, course_module_id, module_number, title_ar, title_en, content_ar, order_index, is_locked)
      VALUES (p_id, u_id, 4, 'تحديد رأس المال المطلوب', 'Capital Needed', '## محتوى الدرس 4...', 4, false);

      -- Lesson 5
      INSERT INTO public.lessons (phase_id, course_module_id, module_number, title_ar, title_en, content_ar, order_index, is_locked)
      VALUES (p_id, u_id, 5, 'وضع توقعات واقعية', 'Realistic Expectations', '## محتوى الدرس 5...', 5, false);

      -- Lesson 6
      INSERT INTO public.lessons (phase_id, course_module_id, module_number, title_ar, title_en, content_ar, order_index, is_locked)
      VALUES (p_id, u_id, 6, 'إعداد خطة العمل', 'Action Plan', '## محتوى الدرس 6...', 6, false);

      -- Lesson 7
      INSERT INTO public.lessons (phase_id, course_module_id, module_number, title_ar, title_en, content_ar, order_index, is_locked)
      VALUES (p_id, u_id, 7, 'المصادقة مع الكوتش', 'Coach Validation', '## محتوى الدرس 7...', 7, false);

  -- =================================================================
  -- OTHER UNITS (Placeholders without lessons)
  -- =================================================================
  INSERT INTO public.course_modules (phase_id, module_number, badge, title_ar, title_en, profit_scenario_ar, expected_result_ar) VALUES
  (p_id, 2, 'SE 02', 'اختيار النيتش 🎯', 'Niche Selection', 'اختيار نيتش يحقق +5,000€/شهر', 'نيتشك محدد وجاهز للانطلاق.'),
  (p_id, 3, 'SE 03', 'دراسة السوق 📊', 'Market Research', 'تجنب منتج فاشل = توفير 3,000€', 'تعرف سوقك أفضل من منافسيك.'),
  (p_id, 4, 'SE 04', 'تحليل المنافسين 🔍', 'Competitor Analysis', 'سرقة حصة سوقية = +3,000€', 'تعرف كيف تتفوق على منافسيك.'),
  (p_id, 5, 'SE 05', 'المنتج الرابح 💎', 'Winning Product', 'منتج رابح = +10,000€ في 30 يوم', 'وجدت منتجك الرابح الأول.'),
  (p_id, 6, 'SE 06', 'المورد المثالي 🏭', 'Ideal Supplier', 'مورد ممتاز = هامش +40%', 'لديك مورد موثوق وسعر ممتاز.'),
  (p_id, 7, 'SE 07', 'إنشاء المتجر 🛒', 'Store Creation', 'متجر جاهز للبيع في 24 ساعة', 'متجرك أونلاين وجاهز لاستقبال الطلبات.'),
  (p_id, 8, 'SE 08', 'تصميم المتجر 🎨', 'Store Design', 'تصميم احترافي = +25% تحويل', 'متجرك يبدو كبراند محترف.'),
  (p_id, 9, 'SE 09', 'صفحة المنتج 📄', 'Product Page', 'صفحة محسنة = +35% مبيعات', 'صفحة منتجك تحول الزوار إلى مشترين.'),
  (p_id, 10, 'SE 10', 'Checkout محسّن 💳', 'Checkout Optimization', '+20% تحويل = +2,000€/شهر', 'عملية الدفع سلسة ومربحة.'),
  (p_id, 11, 'SE 11', 'الشحن والتوصيل 📦', 'Shipping', 'شحن سريع = عملاء سعداء', 'نظام شحن محترف يعمل بسلاسة.'),
  (p_id, 12, 'SE 12', 'خدمة العملاء 💬', 'Customer Service', 'خدمة ممتازة = +30% عملاء متكررين', 'عملاؤك يحبونك ويعودون للشراء.'),
  (p_id, 13, 'SE 13', 'Email Marketing 📧', 'Email Marketing', 'Email = +20% إيرادات إضافية', 'نظام إيميل يبيع لك 24/7.'),
  (p_id, 14, 'SE 14', 'Upsells & Bundles 🎁', 'Upsells', '+40% قيمة الطلب', 'كل عميل يشتري أكثر.'),
  (p_id, 15, 'SE 15', 'التحليلات 📈', 'Analytics', 'قرارات ذكية = +50% نمو', 'تفهم أرقامك وتعرف أين تحسن.'),
  (p_id, 16, 'SE 16', 'الأتمتة 🤖', 'Automation', 'توفير 20 ساعة/أسبوع', 'متجرك يعمل شبه تلقائيًا.'),
  (p_id, 17, 'SE 17', 'أول طلبية 🎉', 'First Sale', 'أول طلبية = بداية الحلم!', 'حققت أول بيع حقيقي!'),
  (p_id, 18, 'SE 18', 'تحسين التحويل (CRO) 🔄', 'CRO', '+1% تحويل = +3,000€/شهر', 'متجرك يحول أفضل من المنافسين.'),
  (p_id, 19, 'SE 19', 'Scale المتجر 🚀', 'Scaling', 'من 5,000€ إلى 20,000€/شهر', 'متجرك ينمو بثبات.'),
  (p_id, 20, 'SE 20', 'الأخطاء الشائعة ⚠️', 'Common Mistakes', 'تجنب خسارة 10,000€', 'تعرف كل الأخطاء ولن تقع فيها.'),
  (p_id, 21, 'SE 21', 'المصادقة النهائية ✅', 'Final Validation', 'متجر جاهز + أول مبيعات', 'أنت الآن جاهز للمرحلة 3!');

END $$;
