-- Seed Phase 2 Structure (Modules 13-33)
-- Generated manually based on User Structure

DO $$
DECLARE
  p_id uuid;
  m_id uuid;
BEGIN
  -- 1. Ensure Phase 2 exists and matches requirements
  -- We assume Phase 2 ID might exist from previous generic seed, we grab it.
  SELECT id INTO p_id FROM public.phases WHERE phase_number = 2;
  
  IF p_id IS NULL THEN
    INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
    VALUES (2, 'الدخول الذكي إلى الإيكومرس', 'SMART ENTRY', 'هذه المرحلة تمنح المبتدئ كل البنية للبدء من الصفر', '#ffd700', 21, false)
    RETURNING id INTO p_id;
  ELSE
    UPDATE public.phases SET 
      title_ar = 'الدخول الذكي إلى الإيكومرس',
      title_en = 'SMART ENTRY',
      description_ar = 'هذه المرحلة تمنح المبتدئ كل البنية للبدء من الصفر',
      color = '#ffd700',
      total_modules = 21,
      is_locked = false
    WHERE id = p_id;
  END IF;

  -- 2. Clear existing modules for Phase 2 to avoid duplicates
  DELETE FROM public.modules WHERE phase_id = p_id;


  -- =============================================
  -- Module 13: مقدمة الإيكومرس 🌍
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 13, 'SE 01', 'مقدمة الإيكومرس 🌍', 'Ecommerce Introduction', 'توفير 2,000€ من الأخطاء', '
## مقدمة الإيكومرس 🌍

*المحتوى قيد التحميل...*

---
### توفير 2,000€ من الأخطاء
', 'تفهم السوق وتعرف أي طريق تسلك.', 13, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهم ما هو الإيكومرس الحقيقي', 1),
  (m_id, 'الفرق بين النماذج المختلفة', 2),
  (m_id, 'اختيار النموذج المناسب لك', 3),
  (m_id, 'تحديد رأس المال المطلوب', 4),
  (m_id, 'وضع توقعات واقعية', 5),
  (m_id, 'إعداد خطة العمل', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 14: اختيار النيتش 🎯
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 14, 'SE 02', 'اختيار النيتش 🎯', 'Niche Selection', 'اختيار نيتش يحقق +5,000€/شهر', '
## اختيار النيتش 🎯

*المحتوى قيد التحميل...*

---
### اختيار نيتش يحقق +5,000€/شهر
', 'نيتشك محدد وجاهز للانطلاق.', 14, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهم معنى النيتش', 1),
  (m_id, 'تحليل النيتشات المربحة', 2),
  (m_id, 'تجنب النيتشات الميتة', 3),
  (m_id, 'اختبار فكرتك بسرعة', 4),
  (m_id, 'التحقق من الطلب', 5),
  (m_id, 'اتخاذ القرار النهائي', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 15: دراسة السوق 📊
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 15, 'SE 03', 'دراسة السوق 📊', 'Market Research', 'تجنب منتج فاشل = توفير 3,000€', '
## دراسة السوق 📊

*المحتوى قيد التحميل...*

---
### تجنب منتج فاشل = توفير 3,000€
', 'تعرف سوقك أفضل من منافسيك.', 15, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'أدوات دراسة السوق', 1),
  (m_id, 'تحليل حجم السوق', 2),
  (m_id, 'فهم الجمهور المستهدف', 3),
  (m_id, 'تحديد المشاكل والحلول', 4),
  (m_id, 'قراءة الترندات', 5),
  (m_id, 'توثيق البحث', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 16: تحليل المنافسين 🔍
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 16, 'SE 04', 'تحليل المنافسين 🔍', 'Competitor Analysis', 'سرقة حصة سوقية = +3,000€', '
## تحليل المنافسين 🔍

*المحتوى قيد التحميل...*

---
### سرقة حصة سوقية = +3,000€
', 'تعرف كيف تتفوق على منافسيك.', 16, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'تحديد المنافسين الرئيسيين', 1),
  (m_id, 'تحليل نقاط قوتهم', 2),
  (m_id, 'اكتشاف نقاط ضعفهم', 3),
  (m_id, 'التجسس على إعلاناتهم', 4),
  (m_id, 'فهم استراتيجياتهم', 5),
  (m_id, 'التفوق عليهم', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 17: المنتج الرابح 💎
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 17, 'SE 05', 'المنتج الرابح 💎', 'Winning Product', 'منتج رابح = +10,000€ في 30 يوم', '
## المنتج الرابح 💎

*المحتوى قيد التحميل...*

---
### منتج رابح = +10,000€ في 30 يوم
', 'وجدت منتجك الرابح الأول.', 17, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'معايير المنتج الرابح', 1),
  (m_id, 'أدوات البحث عن المنتجات', 2),
  (m_id, 'تحليل المنتج قبل البيع', 3),
  (m_id, 'حساب هامش الربح', 4),
  (m_id, 'اختبار المنتج بسرعة', 5),
  (m_id, 'اتخاذ قرار نهائي', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 18: المورد المثالي 🏭
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 18, 'SE 06', 'المورد المثالي 🏭', 'Perfect Supplier', 'مورد ممتاز = هامش +40%', '
## المورد المثالي 🏭

*المحتوى قيد التحميل...*

---
### مورد ممتاز = هامش +40%
', 'لديك مورد موثوق وسعر ممتاز.', 18, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'أين تجد الموردين', 1),
  (m_id, 'التفاوض على الأسعار', 2),
  (m_id, 'طلب عينات', 3),
  (m_id, 'تقييم جودة المورد', 4),
  (m_id, 'بناء علاقة طويلة المدى', 5),
  (m_id, 'خطة بديلة', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 19: إنشاء المتجر 🛒
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 19, 'SE 07', 'إنشاء المتجر 🛒', 'Store Creation', 'متجر جاهز للبيع في 24 ساعة', '
## إنشاء المتجر 🛒

*المحتوى قيد التحميل...*

---
### متجر جاهز للبيع في 24 ساعة
', 'متجرك أونلاين وجاهز لاستقبال الطلبات.', 19, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'اختيار المنصة (Shopify/YouCan)', 1),
  (m_id, 'إنشاء الحساب', 2),
  (m_id, 'إعدادات المتجر الأساسية', 3),
  (m_id, 'ربط الدومين', 4),
  (m_id, 'إعداد الدفع', 5),
  (m_id, 'إعداد الشحن', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 20: تصميم المتجر 🎨
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 20, 'SE 08', 'تصميم المتجر 🎨', 'Store Design', 'تصميم احترافي = +25% تحويل', '
## تصميم المتجر 🎨

*المحتوى قيد التحميل...*

---
### تصميم احترافي = +25% تحويل
', 'متجرك يبدو كبراند محترف.', 20, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'اختيار الثيم المناسب', 1),
  (m_id, 'تخصيص الألوان والخطوط', 2),
  (m_id, 'إنشاء الهيدر والفوتر', 3),
  (m_id, 'تصميم الصفحة الرئيسية', 4),
  (m_id, 'إضافة Trust Badges', 5),
  (m_id, 'تحسين السرعة', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 21: صفحة المنتج 📄
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 21, 'SE 09', 'صفحة المنتج 📄', 'Product Page', 'صفحة محسنة = +35% مبيعات', '
## صفحة المنتج 📄

*المحتوى قيد التحميل...*

---
### صفحة محسنة = +35% مبيعات
', 'صفحة منتجك تحول الزوار إلى مشترين.', 21, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'كتابة عنوان جذاب', 1),
  (m_id, 'صور عالية الجودة', 2),
  (m_id, 'وصف يبيع', 3),
  (m_id, 'إضافة الفوائد', 4),
  (m_id, 'Social Proof', 5),
  (m_id, 'Call to Action قوي', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 22: Checkout محسّن 💳
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 22, 'SE 10', 'Checkout محسّن 💳', 'Optimized Checkout', '+20% تحويل = +2,000€/شهر', '
## Checkout محسّن 💳

*المحتوى قيد التحميل...*

---
### +20% تحويل = +2,000€/شهر
', 'عملية الدفع سلسة ومربحة.', 22, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'تبسيط عملية الدفع', 1),
  (m_id, 'إزالة الاحتكاك', 2),
  (m_id, 'إضافة ضمانات', 3),
  (m_id, 'Order Bump', 4),
  (m_id, 'تقليل التخلي عن السلة', 5),
  (m_id, 'اختبار العملية', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 23: الشحن والتوصيل 📦
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 23, 'SE 11', 'الشحن والتوصيل 📦', 'Shipping & Delivery', 'شحن سريع = عملاء سعداء = +Reviews', '
## الشحن والتوصيل 📦

*المحتوى قيد التحميل...*

---
### شحن سريع = عملاء سعداء = +Reviews
', 'نظام شحن محترف يعمل بسلاسة.', 23, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'اختيار شركات الشحن', 1),
  (m_id, 'حساب تكاليف الشحن', 2),
  (m_id, 'تحديد مدة التوصيل', 3),
  (m_id, 'إعداد التتبع', 4),
  (m_id, 'التعامل مع المشاكل', 5),
  (m_id, 'تحسين تجربة العميل', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 24: خدمة العملاء 💬
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 24, 'SE 12', 'خدمة العملاء 💬', 'Customer Service', 'خدمة ممتازة = +30% عملاء متكررين', '
## خدمة العملاء 💬

*المحتوى قيد التحميل...*

---
### خدمة ممتازة = +30% عملاء متكررين
', 'عملاؤك يحبونك ويعودون للشراء.', 24, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'إعداد قنوات التواصل', 1),
  (m_id, 'رسائل جاهزة للرد', 2),
  (m_id, 'التعامل مع الشكاوى', 3),
  (m_id, 'تحويل المشاكل لفرص', 4),
  (m_id, 'بناء ولاء العملاء', 5),
  (m_id, 'أتمتة الردود', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 25: Email Marketing 📧
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 25, 'SE 13', 'Email Marketing 📧', 'Email Marketing', 'Email = +20% إيرادات إضافية', '
## Email Marketing 📧

*المحتوى قيد التحميل...*

---
### Email = +20% إيرادات إضافية
', 'نظام إيميل يبيع لك 24/7.', 25, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'إعداد أداة Email Marketing', 1),
  (m_id, 'بناء قائمة بريدية', 2),
  (m_id, 'Welcome Sequence', 3),
  (m_id, 'Abandoned Cart Emails', 4),
  (m_id, 'Post-Purchase Emails', 5),
  (m_id, 'تحليل النتائج', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 26: Upsells & Bundles 🎁
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 26, 'SE 14', 'Upsells & Bundles 🎁', 'Upsells & Bundles', '+40% قيمة الطلب = +4,000€/شهر', '
## Upsells & Bundles 🎁

*المحتوى قيد التحميل...*

---
### +40% قيمة الطلب = +4,000€/شهر
', 'كل عميل يشتري أكثر.', 26, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهم الـ Upsell', 1),
  (m_id, 'إنشاء Bundles مربحة', 2),
  (m_id, 'One-Click Upsell', 3),
  (m_id, 'Cross-sell ذكي', 4),
  (m_id, 'تحسين AOV', 5),
  (m_id, 'اختبار العروض', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 27: التحليلات 📈
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 27, 'SE 15', 'التحليلات 📈', 'Analytics', 'قرارات ذكية = +50% نمو', '
## التحليلات 📈

*المحتوى قيد التحميل...*

---
### قرارات ذكية = +50% نمو
', 'تفهم أرقامك وتعرف أين تحسن.', 27, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'إعداد Google Analytics', 1),
  (m_id, 'فهم الأرقام المهمة', 2),
  (m_id, 'تتبع التحويلات', 3),
  (m_id, 'تحليل سلوك الزوار', 4),
  (m_id, 'اتخاذ قرارات مبنية على البيانات', 5),
  (m_id, 'تقارير أسبوعية', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 28: الأتمتة 🤖
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 28, 'SE 16', 'الأتمتة 🤖', 'Automation', 'توفير 20 ساعة/أسبوع', '
## الأتمتة 🤖

*المحتوى قيد التحميل...*

---
### توفير 20 ساعة/أسبوع
', 'متجرك يعمل شبه تلقائيًا.', 28, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'أتمتة الطلبات', 1),
  (m_id, 'أتمتة الإيميلات', 2),
  (m_id, 'أتمتة التتبع', 3),
  (m_id, 'أتمتة خدمة العملاء', 4),
  (m_id, 'توفير الوقت', 5),
  (m_id, 'العمل بذكاء', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 29: أول طلبية 🎉
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 29, 'SE 17', 'أول طلبية 🎉', 'First Order', 'أول طلبية = بداية الحلم!', '
## أول طلبية 🎉

*المحتوى قيد التحميل...*

---
### أول طلبية = بداية الحلم!
', 'حققت أول بيع حقيقي!', 29, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'إطلاق أول إعلان', 1),
  (m_id, 'انتظار أول زائر', 2),
  (m_id, 'الحصول على أول طلب', 3),
  (m_id, 'معالجة الطلب بشكل صحيح', 4),
  (m_id, 'متابعة التوصيل', 5),
  (m_id, 'طلب تقييم من العميل', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 30: تحسين التحويل (CRO) 🔄
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 30, 'SE 18', 'تحسين التحويل (CRO) 🔄', 'CRO', '+1% تحويل = +3,000€/شهر', '
## تحسين التحويل (CRO) 🔄

*المحتوى قيد التحميل...*

---
### +1% تحويل = +3,000€/شهر
', 'متجرك يحول أفضل من المنافسين.', 30, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'تحليل نقاط الضعف', 1),
  (m_id, 'A/B Testing', 2),
  (m_id, 'تحسين السرعة', 3),
  (m_id, 'تحسين الصور', 4),
  (m_id, 'تحسين النصوص', 5),
  (m_id, 'تحسين العروض', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 31: Scale المتجر 🚀
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 31, 'SE 19', 'Scale المتجر 🚀', 'Scaling', 'من 5,000€ إلى 20,000€/شهر', '
## Scale المتجر 🚀

*المحتوى قيد التحميل...*

---
### من 5,000€ إلى 20,000€/شهر
', 'متجرك ينمو بثبات.', 31, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'متى تبدأ السكيل', 1),
  (m_id, 'زيادة الميزانية الإعلانية', 2),
  (m_id, 'إضافة منتجات جديدة', 3),
  (m_id, 'فتح أسواق جديدة', 4),
  (m_id, 'توظيف مساعدين', 5),
  (m_id, 'الحفاظ على الربحية', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 32: الأخطاء الشائعة ⚠️
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 32, 'SE 20', 'الأخطاء الشائعة ⚠️', 'Common Mistakes', 'تجنب خسارة 10,000€', '
## الأخطاء الشائعة ⚠️

*المحتوى قيد التحميل...*

---
### تجنب خسارة 10,000€
', 'تعرف كل الأخطاء ولن تقع فيها.', 32, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'أخطاء المبتدئين', 1),
  (m_id, 'أخطاء المنتج', 2),
  (m_id, 'أخطاء الإعلانات', 3),
  (m_id, 'أخطاء المتجر', 4),
  (m_id, 'أخطاء خدمة العملاء', 5),
  (m_id, 'كيف تتجنبها كلها', 6),
  (m_id, 'المصادقة مع الكوتش', 7);


  -- =============================================
  -- Module 33: المصادقة النهائية ✅
  -- =============================================
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 33, 'SE 21', 'المصادقة النهائية ✅', 'Final Validation', 'متجر جاهز + أول مبيعات', '
## المصادقة النهائية ✅

*المحتوى قيد التحميل...*

---
### متجر جاهز + أول مبيعات
', 'أنت الآن جاهز للمرحلة 3!', 33, false)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'مراجعة شاملة للمرحلة', 1),
  (m_id, 'التأكد من إتمام كل المهام', 2),
  (m_id, 'تقديم إثبات المتجر', 3),
  (m_id, 'الحصول على شهادة المرحلة', 4),
  (m_id, 'فتح المرحلة التالية', 5),
  (m_id, 'الانضمام لمجموعة الإيكومرس', 6),
  (m_id, 'المصادقة النهائية مع الكوتش', 7);


END $$;
