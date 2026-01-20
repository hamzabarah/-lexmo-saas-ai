-- Seed Phases 2-11
-- Unlocks all phases for testing purposes

DO $$
DECLARE
  p_id uuid;
  m_id uuid;
BEGIN
  -- Clean up existing Phases 2-11 if any
  DELETE FROM public.phases WHERE phase_number >= 2;
  

  -- Phase 2: SMART ENTRY
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
  VALUES (2, 'المرحلة 2: الدخول الذكي إلى الإيكومرس', 'SMART ENTRY', 'هذه المرحلة تمنح المبتدئ كل البنية للبدء من الصفر', '#ffd700', 21, false)
  RETURNING id INTO p_id;

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 13, 'MOD 13', 'مقدمة الإيكومرس 🌍', 'مقدمة الإيكومرس 🌍', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 13, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 14, 'MOD 14', 'اختيار النيتش 🎯', 'اختيار النيتش 🎯', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 14, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 15, 'MOD 15', 'دراسة السوق 📊', 'دراسة السوق 📊', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 15, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 16, 'MOD 16', 'المنافسين 🔍', 'المنافسين 🔍', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 16, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 17, 'MOD 17', 'المنتج الرابح 💎', 'المنتج الرابح 💎', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 17, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 18, 'MOD 18', 'المورد المثالي 🏭', 'المورد المثالي 🏭', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 18, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 19, 'MOD 19', 'إنشاء المتجر 🛒', 'إنشاء المتجر 🛒', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 19, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 20, 'MOD 20', 'تصميم المتجر 🎨', 'تصميم المتجر 🎨', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 20, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 21, 'MOD 21', 'صفحة المنتج 📄', 'صفحة المنتج 📄', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 21, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 22, 'MOD 22', 'Checkout محسّن 💳', 'Checkout محسّن 💳', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 22, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 23, 'MOD 23', 'الشحن والتوصيل 📦', 'الشحن والتوصيل 📦', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 23, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 24, 'MOD 24', 'خدمة العملاء 💬', 'خدمة العملاء 💬', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 24, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 25, 'MOD 25', 'البريد الإلكتروني 📧', 'البريد الإلكتروني 📧', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 25, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 26, 'MOD 26', 'Upsells & Bundles 🎁', 'Upsells & Bundles 🎁', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 26, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 27, 'MOD 27', 'التحليلات 📈', 'التحليلات 📈', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 27, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 28, 'MOD 28', 'الأتمتة 🤖', 'الأتمتة 🤖', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 28, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 29, 'MOD 29', 'أول طلبية 🎉', 'أول طلبية 🎉', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 29, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 30, 'MOD 30', 'تحسين التحويل 🔄', 'تحسين التحويل 🔄', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 30, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 31, 'MOD 31', 'Scale المتجر 🚀', 'Scale المتجر 🚀', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 31, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 32, 'MOD 32', 'الأخطاء الشائعة ⚠️', 'الأخطاء الشائعة ⚠️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 32, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 33, 'MOD 33', 'المصادقة النهائية ✅', 'المصادقة النهائية ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 33, false);

  -- Phase 3: SYSTEM BUILDING
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
  VALUES (3, 'المرحلة 3: بناء سيستم قوي قبل أي بزنس', 'SYSTEM BUILDING', 'الأساسات القوية تضمن لك الاستمرارية', '#10b981', 12, false)
  RETURNING id INTO p_id;

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 34, 'MOD 34', 'البنية التحتية 🏗️', 'البنية التحتية 🏗️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 34, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 35, 'MOD 35', 'الأدوات الأساسية 🛠️', 'الأدوات الأساسية 🛠️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 35, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 36, 'MOD 36', 'إدارة الوقت ⏰', 'إدارة الوقت ⏰', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 36, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 37, 'MOD 37', 'إدارة المال 💰', 'إدارة المال 💰', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 37, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 38, 'MOD 38', 'فريق العمل 👥', 'فريق العمل 👥', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 38, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 39, 'MOD 39', 'SOPs والعمليات 📋', 'SOPs والعمليات 📋', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 39, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 40, 'MOD 40', 'الأتمتة المتقدمة 🤖', 'الأتمتة المتقدمة 🤖', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 40, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 41, 'MOD 41', 'التقارير والمتابعة 📊', 'التقارير والمتابعة 📊', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 41, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 42, 'MOD 42', 'حماية البزنس 🛡️', 'حماية البزنس 🛡️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 42, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 43, 'MOD 43', 'التوسع الآمن 📈', 'التوسع الآمن 📈', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 43, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 44, 'MOD 44', 'بناء الفريق 🏢', 'بناء الفريق 🏢', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 44, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 45, 'MOD 45', 'المصادقة النهائية ✅', 'المصادقة النهائية ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 45, false);

  -- Phase 4: TIKTOK SHOP
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
  VALUES (4, 'المرحلة 4: TikTok Shop Mastery', 'TIKTOK SHOP', 'استغل قوة TikTok للبيع المباشر', '#a855f7', 15, false)
  RETURNING id INTO p_id;

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 46, 'MOD 46', 'مقدمة TikTok Shop 📱', 'مقدمة TikTok Shop 📱', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 46, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 47, 'MOD 47', 'إنشاء الحساب 🔧', 'إنشاء الحساب 🔧', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 47, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 48, 'MOD 48', 'ربط المتجر 🔗', 'ربط المتجر 🔗', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 48, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 49, 'MOD 49', 'إضافة المنتجات 📦', 'إضافة المنتجات 📦', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 49, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 50, 'MOD 50', 'تحسين الـ Listings 📝', 'تحسين الـ Listings 📝', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 50, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 51, 'MOD 51', 'المحتوى العضوي 🎬', 'المحتوى العضوي 🎬', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 51, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 52, 'MOD 52', 'LIVE Selling 🔴', 'LIVE Selling 🔴', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 52, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 53, 'MOD 53', 'Affiliate Program 🤝', 'Affiliate Program 🤝', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 53, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 54, 'MOD 54', 'TikTok Ads للشوب 📢', 'TikTok Ads للشوب 📢', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 54, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 55, 'MOD 55', 'تحليل الأداء 📊', 'تحليل الأداء 📊', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 55, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 56, 'MOD 56', 'خدمة عملاء TikTok 💬', 'خدمة عملاء TikTok 💬', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 56, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 57, 'MOD 57', 'الشحن والفلفلمنت 🚚', 'الشحن والفلفلمنت 🚚', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 57, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 58, 'MOD 58', 'Scale TikTok Shop 🚀', 'Scale TikTok Shop 🚀', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 58, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 59, 'MOD 59', 'أخطاء TikTok Shop ⚠️', 'أخطاء TikTok Shop ⚠️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 59, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 60, 'MOD 60', 'المصادقة النهائية ✅', 'المصادقة النهائية ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 60, false);

  -- Phase 5: DROPSHIPPING 2.0
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
  VALUES (5, 'المرحلة 5: Next-Generation Dropshipping', 'DROPSHIPPING 2.0', 'الجيل الجديد من الدروبشيبينغ', '#f97316', 12, false)
  RETURNING id INTO p_id;

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 61, 'MOD 61', 'الدروبشيبينغ الحديث 🆕', 'الدروبشيبينغ الحديث 🆕', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 61, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 62, 'MOD 62', 'الموردين الجدد 🏭', 'الموردين الجدد 🏭', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 62, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 63, 'MOD 63', 'Agent خاص 🤝', 'Agent خاص 🤝', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 63, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 64, 'MOD 64', 'Private Label 🏷️', 'Private Label 🏷️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 64, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 65, 'MOD 65', '3PL Fulfillment 📦', '3PL Fulfillment 📦', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 65, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 66, 'MOD 66', 'US/EU Suppliers 🌍', 'US/EU Suppliers 🌍', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 66, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 67, 'MOD 67', 'Branding المنتج 🎨', 'Branding المنتج 🎨', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 67, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 68, 'MOD 68', 'تسريع الشحن 🚀', 'تسريع الشحن 🚀', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 68, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 69, 'MOD 69', 'هوامش أعلى 💰', 'هوامش أعلى 💰', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 69, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 70, 'MOD 70', 'Quality Control ✅', 'Quality Control ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 70, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 71, 'MOD 71', 'Scale بدون مشاكل 📈', 'Scale بدون مشاكل 📈', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 71, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 72, 'MOD 72', 'المصادقة النهائية ✅', 'المصادقة النهائية ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 72, false);

  -- Phase 6: META ADS
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
  VALUES (6, 'المرحلة 6: Facebook & Instagram Ads', 'META ADS', 'إتقان إعلانات ميتا للوصول لجمهورك', '#3b82f6', 12, false)
  RETURNING id INTO p_id;

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 73, 'MOD 73', 'أساسيات Meta Ads 📘', 'أساسيات Meta Ads 📘', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 73, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 74, 'MOD 74', 'Business Manager 🏢', 'Business Manager 🏢', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 74, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 75, 'MOD 75', 'Pixel & API 🔧', 'Pixel & API 🔧', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 75, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 76, 'MOD 76', 'هيكل الحملات 📊', 'هيكل الحملات 📊', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 76, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 77, 'MOD 77', 'الاستهداف الذكي 🎯', 'الاستهداف الذكي 🎯', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 77, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 78, 'MOD 78', 'الكريتيف الرابح 🎬', 'الكريتيف الرابح 🎬', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 78, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 79, 'MOD 79', 'Copywriting 📝', 'Copywriting 📝', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 79, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 80, 'MOD 80', 'Testing Strategy 🧪', 'Testing Strategy 🧪', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 80, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 81, 'MOD 81', 'تحليل النتائج 📈', 'تحليل النتائج 📈', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 81, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 82, 'MOD 82', 'Scaling Meta 🚀', 'Scaling Meta 🚀', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 82, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 83, 'MOD 83', 'حل المشاكل 🔧', 'حل المشاكل 🔧', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 83, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 84, 'MOD 84', 'المصادقة النهائية ✅', 'المصادقة النهائية ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 84, false);

  -- Phase 7: TIKTOK ADS
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
  VALUES (7, 'المرحلة 7: TikTok Ads Mastery', 'TIKTOK ADS', 'الإعلانات الأرخص والأكثر فعالية', '#ec4899', 12, false)
  RETURNING id INTO p_id;

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 85, 'MOD 85', 'أساسيات TikTok Ads 📱', 'أساسيات TikTok Ads 📱', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 85, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 86, 'MOD 86', 'إنشاء Ad Account 🔧', 'إنشاء Ad Account 🔧', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 86, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 87, 'MOD 87', 'Pixel Setup 📊', 'Pixel Setup 📊', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 87, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 88, 'MOD 88', 'أنواع الحملات 📋', 'أنواع الحملات 📋', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 88, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 89, 'MOD 89', 'استهداف TikTok 🎯', 'استهداف TikTok 🎯', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 89, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 90, 'MOD 90', 'UGC Content 🎬', 'UGC Content 🎬', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 90, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 91, 'MOD 91', 'Spark Ads 🔥', 'Spark Ads 🔥', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 91, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 92, 'MOD 92', 'Testing TikTok 🧪', 'Testing TikTok 🧪', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 92, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 93, 'MOD 93', 'تحليل الأداء 📈', 'تحليل الأداء 📈', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 93, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 94, 'MOD 94', 'Scaling TikTok 🚀', 'Scaling TikTok 🚀', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 94, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 95, 'MOD 95', 'مشاكل وحلول 🔧', 'مشاكل وحلول 🔧', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 95, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 96, 'MOD 96', 'المصادقة النهائية ✅', 'المصادقة النهائية ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 96, false);

  -- Phase 8: SNAPCHAT ADS
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
  VALUES (8, 'المرحلة 8: Snapchat Ads Mastery', 'SNAPCHAT ADS', 'اكتشف سوق الخليج بتكلفة زهيدة', '#facc15', 12, false)
  RETURNING id INTO p_id;

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 97, 'MOD 97', 'لماذا Snapchat؟ 👻', 'لماذا Snapchat؟ 👻', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 97, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 98, 'MOD 98', 'إنشاء الحساب 🔧', 'إنشاء الحساب 🔧', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 98, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 99, 'MOD 99', 'Pixel Snapchat 📊', 'Pixel Snapchat 📊', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 99, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 100, 'MOD 100', 'أنواع الإعلانات 📋', 'أنواع الإعلانات 📋', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 100, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 101, 'MOD 101', 'استهداف الخليج 🎯', 'استهداف الخليج 🎯', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 101, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 102, 'MOD 102', 'الكريتيف الخليجي 🎬', 'الكريتيف الخليجي 🎬', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 102, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 103, 'MOD 103', 'Collection Ads 🛒', 'Collection Ads 🛒', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 103, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 104, 'MOD 104', 'Story Ads 📖', 'Story Ads 📖', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 104, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 105, 'MOD 105', 'Testing Snap 🧪', 'Testing Snap 🧪', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 105, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 106, 'MOD 106', 'تحليل وتحسين 📈', 'تحليل وتحسين 📈', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 106, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 107, 'MOD 107', 'Scaling Snapchat 🚀', 'Scaling Snapchat 🚀', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 107, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 108, 'MOD 108', 'المصادقة النهائية ✅', 'المصادقة النهائية ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 108, false);

  -- Phase 9: GOOGLE ADS
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
  VALUES (9, 'المرحلة 9: Google Ads Mastery', 'GOOGLE ADS', 'استهدف من يبحث عن منتجك', '#ef4444', 15, false)
  RETURNING id INTO p_id;

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 109, 'MOD 109', 'أساسيات Google Ads 🔍', 'أساسيات Google Ads 🔍', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 109, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 110, 'MOD 110', 'أنواع الحملات 📋', 'أنواع الحملات 📋', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 110, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 111, 'MOD 111', 'Search Ads 🔎', 'Search Ads 🔎', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 111, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 112, 'MOD 112', 'Shopping Ads 🛒', 'Shopping Ads 🛒', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 112, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 113, 'MOD 113', 'Merchant Center 🏪', 'Merchant Center 🏪', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 113, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 114, 'MOD 114', 'Performance Max 🚀', 'Performance Max 🚀', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 114, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 115, 'MOD 115', 'YouTube Ads 📺', 'YouTube Ads 📺', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 115, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 116, 'MOD 116', 'Display Ads 🖼️', 'Display Ads 🖼️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 116, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 117, 'MOD 117', 'Keyword Research 🔑', 'Keyword Research 🔑', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 117, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 118, 'MOD 118', 'Bidding Strategies 💰', 'Bidding Strategies 💰', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 118, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 119, 'MOD 119', 'تحليل وتحسين 📈', 'تحليل وتحسين 📈', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 119, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 120, 'MOD 120', 'Scaling Google 🚀', 'Scaling Google 🚀', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 120, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 121, 'MOD 121', 'مشاكل وحلول 🔧', 'مشاكل وحلول 🔧', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 121, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 122, 'MOD 122', 'Remarketing 🔄', 'Remarketing 🔄', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 122, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 123, 'MOD 123', 'المصادقة النهائية ✅', 'المصادقة النهائية ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 123, false);

  -- Phase 10: BRAND BUILDING
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
  VALUES (10, 'المرحلة 10: بناء علامة تجارية قوية', 'BRAND BUILDING', 'من منتج إلى براند يستمر', '#14b8a6', 12, false)
  RETURNING id INTO p_id;

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 124, 'MOD 124', 'ما هو البراند؟ 🏷️', 'ما هو البراند؟ 🏷️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 124, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 125, 'MOD 125', 'هوية العلامة 🎨', 'هوية العلامة 🎨', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 125, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 126, 'MOD 126', 'قصة البراند 📖', 'قصة البراند 📖', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 126, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 127, 'MOD 127', 'التموقع 🎯', 'التموقع 🎯', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 127, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 128, 'MOD 128', 'تجربة العميل ⭐', 'تجربة العميل ⭐', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 128, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 129, 'MOD 129', 'ولاء العملاء 💝', 'ولاء العملاء 💝', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 129, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 130, 'MOD 130', 'Social Proof 📱', 'Social Proof 📱', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 130, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 131, 'MOD 131', 'PR والصحافة 📰', 'PR والصحافة 📰', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 131, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 132, 'MOD 132', 'Influencers 🤳', 'Influencers 🤳', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 132, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 133, 'MOD 133', 'Community 👥', 'Community 👥', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 133, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 134, 'MOD 134', 'حماية البراند 🛡️', 'حماية البراند 🛡️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 134, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 135, 'MOD 135', 'المصادقة النهائية ✅', 'المصادقة النهائية ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 135, false);

  -- Phase 11: AMAZON FBA
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, total_modules, is_locked)
  VALUES (11, 'المرحلة 11: Amazon FBA Mastery', 'AMAZON FBA', 'من الفكرة إلى Brand قابل للبيع', '#6366f1', 15, false)
  RETURNING id INTO p_id;

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 136, 'MOD 136', 'عقلية Amazon 🧠', 'عقلية Amazon 🧠', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 136, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 137, 'MOD 137', 'إنشاء الحساب 🔧', 'إنشاء الحساب 🔧', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 137, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 138, 'MOD 138', 'Product Research 🔍', 'Product Research 🔍', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 138, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 139, 'MOD 139', 'Differentiation 💎', 'Differentiation 💎', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 139, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 140, 'MOD 140', 'Sourcing 🏭', 'Sourcing 🏭', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 140, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 141, 'MOD 141', 'Shipping to FBA 📦', 'Shipping to FBA 📦', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 141, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 142, 'MOD 142', 'Listing Optimization 📝', 'Listing Optimization 📝', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 142, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 143, 'MOD 143', 'Amazon SEO 🔎', 'Amazon SEO 🔎', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 143, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 144, 'MOD 144', 'PPC Amazon 📢', 'PPC Amazon 📢', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 144, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 145, 'MOD 145', 'Reviews Strategy ⭐', 'Reviews Strategy ⭐', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 145, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 146, 'MOD 146', 'Brand Registry 🏷️', 'Brand Registry 🏷️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 146, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 147, 'MOD 147', 'A+ Content 🎨', 'A+ Content 🎨', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 147, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 148, 'MOD 148', 'Scaling Amazon 🚀', 'Scaling Amazon 🚀', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 148, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 149, 'MOD 149', 'Protection 🛡️', 'Protection 🛡️', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 149, false);

  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, objective_ar, content_ar, expected_result_ar, order_index, is_locked)
  VALUES (p_id, 150, 'MOD 150', 'المصادقة النهائية ✅', 'المصادقة النهائية ✅', 'Visualisation Only - Pending Content', 'Content coming soon...', 'Pending...', 150, false);

END $$;
