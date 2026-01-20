-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABLES DEFINITION
-- ==========================================

-- PHASES
create table if not exists public.phases (
  id uuid default uuid_generate_v4() primary key,
  phase_number int not null,
  title_ar text not null,
  title_en text,
  description_ar text,
  color text,
  icon text,
  total_modules int default 0,
  is_locked boolean default true,
  unlock_condition text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MODULES
create table if not exists public.modules (
  id uuid default uuid_generate_v4() primary key,
  phase_id uuid references public.phases(id) on delete cascade not null,
  module_number int not null,
  badge text,
  title_ar text not null,
  title_en text,
  emoji text,
  objective_ar text,
  prerequisites_ar text,
  content_ar text,
  expected_result_ar text,
  order_index int not null,
  is_locked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TASKS
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  task_text_ar text not null,
  order_index int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER PROGRESS
create table if not exists public.user_progress (
  user_id uuid references auth.users(id) on delete cascade not null,
  module_id uuid references public.modules(id) on delete cascade not null,
  task_id uuid references public.tasks(id) on delete cascade not null,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  primary key (user_id, task_id)
);

-- USER PHASE PROGRESS (Summary)
create table if not exists public.user_phase_progress (
  user_id uuid references auth.users(id) on delete cascade not null,
  phase_id uuid references public.phases(id) on delete cascade not null,
  completed_modules int default 0,
  is_unlocked boolean default false,
  primary key (user_id, phase_id)
);

-- ==========================================
-- 2. RLS POLICIES (Security)
-- ==========================================
alter table public.phases enable row level security;
alter table public.modules enable row level security;
alter table public.tasks enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_phase_progress enable row level security;

-- Read access for authenticated users
create policy "Public phases are viewable by everyone" on public.phases for select using (true);
create policy "Modules are viewable by everyone" on public.modules for select using (true);
create policy "Tasks are viewable by everyone" on public.tasks for select using (true);

-- User Progress: Users can insert/update their own progress
create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress update" on public.user_progress for update using (auth.uid() = user_id);

-- ==========================================
-- 3. DATA SEEDING (Phase 1 Content)
-- ==========================================

DO $$
DECLARE
  p_id uuid;
  m_id uuid;
BEGIN
  -- Clear existing data for strict consistency
  DELETE FROM public.tasks;
  DELETE FROM public.modules;
  DELETE FROM public.phases WHERE phase_number = 1;

  -- Insert Phase 1
  INSERT INTO public.phases (phase_number, title_ar, title_en, description_ar, color, icon, total_modules, is_locked)
  VALUES (1, 'برنامج السفير', 'Ambassador Program', 'من 0€ إلى 10,000€… بخطة واضحة ومصادَق عليها خطوة بخطوة', '#00d2ff', '🤝', 30, false)
  RETURNING id INTO p_id;

  -- ---------------------------------------------
  -- Module 01
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 1, 'AMB 01', 'أنت لست بائعاً، أنت سفير 🤝', 'You''re not a seller, you''re an Ambassador', '🤝', 
          'إزالة الخوف من "البيع" وفهم دورك الحقيقي', 
          'هناك فرق كبير بين "البيع" و"مشاركة حل". أنت لست تاجراً تبحث عن زبائن، بل أنت دليل يساعد الناس على تغيير حياتهم.' || chr(10) || 
          'الناس يشترون بسببك لأنهم يثقون بك. الثقة الإنسانية أقوى من أي إعلان.' || chr(10) || 
          'نحن نوصي بالبرنامج لأننا نؤمن به حقاً. الأخلاق أولاً.' || chr(10) || 
          'أنت تغير حياة الناس وتكسب 50% عمولة في نفس الوقت.', 
          'في نهاية هذه الوحدة: ستكون قد فهمت دورك كسفير وأزلت الخوف من "البيع"', 1)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهمت الفرق بين "البيع" و"مشاركة حل"', 1),
  (m_id, 'فهمت أنني دليل يساعد الناس، لست تاجراً', 2),
  (m_id, 'فهمت أهمية الثقة الإنسانية', 3),
  (m_id, 'فهمت أن الأخلاق أولاً: نوصي لأننا نؤمن', 4),
  (m_id, 'فهمت أنني أغير حياة الناس وأكسب 50%', 5),
  (m_id, 'كتبت سبب قيامي بهذا: "لماذا أفعل هذا؟"', 6),
  (m_id, 'أنا مستعد للخطوة التالية', 7);

  -- ---------------------------------------------
  -- Module 02
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 2, 'AMB 02', 'التكنولوجيا لم تعد تخيفك 📱', 'Technology shouldn''t scare you anymore', '📱', 
          'إزالة الخوف من التقنية والتكنولوجيا', 
          'الهاتف يكفي! لا تحتاج حاسوباً.' || chr(10) || 
          'لا تحتاج أن تكون خبيراً. إذا كنت تعرف استخدام واتساب، يمكنك النجاح.' || chr(10) || 
          'التكرار أهم من الكمال. كل خطأ هو درس جديد.' || chr(10) || 
          'سنشرح لك كل شيء كأنك طفل في العاشرة. خطوة بخطوة.' || chr(10) || 
          'من الطبيعي أن تكون مبتدئاً. الكل بدأ من الصفر.',
          'في نهاية هذه الوحدة: ستكون قد أزلت خوفك من التكنولوجيا وأصبحت مستعداً للتعلم', 2)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهمت أن الهاتف يكفي', 1),
  (m_id, 'فهمت أنني لا أحتاج أن أكون خبيراً', 2),
  (m_id, 'فهمت أن التكرار أهم من الكمال', 3),
  (m_id, 'فهمت أن كل خطأ درس جديد', 4),
  (m_id, 'فهمت أن كل شيء سيُشرح خطوة بخطوة', 5),
  (m_id, 'قبلت أن أكون مبتدئاً (وهذا طبيعي)', 6),
  (m_id, 'أنا مستعد للتعلم بدون خوف', 7);

  -- ---------------------------------------------
  -- Module 03
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 3, 'AMB 03', 'أسلوب حياة السفير: حياتك الجديدة 🌴', 'Ambassador Lifestyle: Your new life', '🌴', 
          'تصور الحياة التي تبنيها', 
          'البزنس أونلاين يعني حرية جغرافية كاملة.' || chr(10) || 
          'اعمل من هاتفك، من أي مكان في العالم.' || chr(10) || 
          'لا مدير، لا ساعات عمل محددة.' || chr(10) || 
          'اكسب المال حتى وأنت نائم.' || chr(10) || 
          'تخيل: تعمل من مقهى، من الشاطئ، من بيتك.' || chr(10) || 
          'ماذا ستفعل بـ 10,000€ إضافية؟' || chr(10) || 
          'تخيل حياتك بعد 6 أشهر، بعد سنة...',
          'في نهاية هذه الوحدة: ستكون قد تصورت حياتك الجديدة وأصبح لديك دافع قوي', 3)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهمت معنى الحرية الجغرافية', 1),
  (m_id, 'فهمت أنني أستطيع العمل من أي مكان', 2),
  (m_id, 'فهمت أنه لا يوجد مدير أو ساعات محددة', 3),
  (m_id, 'فهمت مفهوم الدخل السلبي', 4),
  (m_id, 'تخيلت أماكن يمكنني العمل منها', 5),
  (m_id, 'كتبت ماذا سأفعل بـ 10,000€ إضافية', 6),
  (m_id, 'تخيلت حياتي بعد 6 أشهر وسنة', 7);

  -- ---------------------------------------------
  -- Module 04
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 4, 'AMB 04', 'غير علاقتك بالمال 💰', 'Change your relationship with money', '💰', 
          'إزالة المعتقدات السلبية عن المال', 
          'المال ليس شيئاً سيئاً، إنه أداة.' || chr(10) || 
          'أنت تستحق كسب المال من خلال مساعدة الناس.' || chr(10) || 
          '997€ هو استثمار، ليس مصروفاً.' || chr(10) || 
          'الناس يدفعون مقابل الحلول التي تعمل.' || chr(10) || 
          'أنت لا "تأخذ" المال، بل "تتبادل" القيمة.' || chr(10) || 
          'اكتب: "أنا أستحق أن أكسب [X]€ شهرياً"' || chr(10) || 
          'أزل الشعور بالذنب من كسب المال.',
          'في نهاية هذه الوحدة: ستكون قد غيرت علاقتك بالمال وأصبحت مستعداً للكسب', 4)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهمت أن المال أداة وليس شيئاً سيئاً', 1),
  (m_id, 'فهمت أنني أستحق الكسب من مساعدة الناس', 2),
  (m_id, 'فهمت أن 997€ استثمار وليس مصروف', 3),
  (m_id, 'فهمت لماذا يدفع الناس مقابل الحلول', 4),
  (m_id, 'فهمت مفهوم تبادل القيمة', 5),
  (m_id, 'كتبت: "أنا أستحق أن أكسب ___€ شهرياً"', 6),
  (m_id, 'أزلت الشعور بالذنب من كسب المال', 7);

  -- ---------------------------------------------
  -- Module 05
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 5, 'AMB 05', 'حدد هدفك و"لماذا" 🎯', 'Define your goal and your "Why"', '🎯', 
          'تحديد هدف واضح وسبب قوي للاستمرار', 
          'حدد هدفك المالي: 1,000€؟ 5,000€؟ 10,000€؟' || chr(10) || 
          'احسب كم شخص تحتاج مساعدته (عمولة 50%):' || chr(10) || 
          '• باقة الطالب: 499€ عمولة' || chr(10) || 
          '• باقة البزنس: 749€ عمولة' || chr(10) || 
          '• باقة المنتور: 2,499€ عمولة' || chr(10) || 
          'حدد "لماذا" العميق: (العائلة، الحرية، السفر، الديون...)' || chr(10) || 
          'اكتب هدفك على ورقة وضعها في مكان ظاهر.' || chr(10) || 
          'بيعتان في الشهر من باقة البزنس = ~1,500€/شهر',
          'في نهاية هذه الوحدة: ستكون قد حددت هدفاً واضحاً وسبباً قوياً للاستمرار', 5)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'حددت هدفي المالي: ___€', 1),
  (m_id, 'حسبت كم شخص أحتاج مساعدته', 2),
  (m_id, 'حددت "لماذا" العميق الخاص بي', 3),
  (m_id, 'كتبت هدفي على ورقة ووضعتها في مكان ظاهر', 4),
  (m_id, 'حددت موعداً نهائياً لهدفي الأول', 5),
  (m_id, 'فهمت أن 2 بيعة/شهر = ~1,500€', 6),
  (m_id, 'وقعت التزاماً مع نفسي', 7);

  -- ---------------------------------------------
  -- Module 06
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 6, 'AMB 06', 'افهم ما توصي به 📚', 'Understand what you recommend', '📚', 
          'معرفة البرنامج بدون أن تكون خبيراً', 
          'ما هي أكاديمية LEXMO؟ نظام متكامل لتعلم التجارة الإلكترونية والربح من الإنترنت.' || chr(10) || 
          'لمن يتوجه البرنامج؟ المبتدئين، من يريدون تغيير حياتهم، الباحثين عن دخل إضافي.' || chr(10) || 
          'ماذا يتعلم الطلاب؟ التجارة الإلكترونية، الإعلانات، بناء البراند، أمازون...' || chr(10) || 
          'لماذا يشتري الناس؟ التحول + المرافقة + المجتمع.' || chr(10) || 
          'البرنامج يحتوي على: 11 مرحلة، 150 وحدة، 28 هدية (قيمتها $60,000+).',
          'في نهاية هذه الوحدة: ستكون قد فهمت البرنامج وأصبحت قادراً على شرحه ببساطة', 6)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهمت ما هي أكاديمية LEXMO', 1),
  (m_id, 'فهمت لمن يتوجه البرنامج', 2),
  (m_id, 'فهمت ماذا يتعلم الطلاب', 3),
  (m_id, 'فهمت لماذا يشتري الناس', 4),
  (m_id, 'فهمت محتوى البرنامج (11 مرحلة، 150 وحدة)', 5),
  (m_id, 'فهمت قيمة الهدايا ($60,000+)', 6),
  (m_id, 'أستطيع الشرح في 30 ثانية', 7);

  -- ---------------------------------------------
  -- Module 07 (Packages)
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 7, 'AMB 07', 'الباقات الثلاث بالتفصيل 🎁', 'The 3 Packs explained', '🎁', 
          'معرفة شرح كل باقة بالحجج الصحيحة', 
          '📦 باقة الطالب: 997€ (توفير 1,000€). عمولتك: 499€. لمن يريد التعلم فقط.' || chr(10) || 
          '📦 باقة البزنس (الأكثر شعبية): 1,497€ (توفير 1,500€). عمولتك: 749€. لمن يريد التعلم والكسب.' || chr(10) || 
          '📦 باقة المنتور: 4,997€ (توفير 5,000€). عمولتك: 2,499€. لمن يريد مرافقة VIP.',
          'في نهاية هذه الوحدة: ستكون قد حفظت كل الباقات وأصبحت قادراً على شرحها بثقة', 7)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'حفظت تفاصيل باقة الطالب (997€ / توفير 1,000€ / عمولة 499€)', 1),
  (m_id, 'حفظت تفاصيل باقة البزنس (1,497€ / توفير 1,500€ / عمولة 749€)', 2),
  (m_id, 'حفظت تفاصيل باقة المنتور (4,997€ / توفير 5,000€ / عمولة 2,499€)', 3),
  (m_id, 'حفظت الحجة الخاصة بكل باقة', 4),
  (m_id, 'أعرف لمن أوصي بكل باقة', 5),
  (m_id, 'حفظت الجدول الكامل', 6),
  (m_id, 'لن أضغط على أحد - أترك له الاختيار', 7);

   -- ---------------------------------------------
  -- Module 08
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 8, 'AMB 08', 'جولة داخل الأكاديمية 🖥️', 'Academy guided tour', '🖥️', 
          'معرفة إظهار داخل الأكاديمية في فيديو', 
          'كيف تدخل إلى الأكاديمية (خطوة بخطوة).' || chr(10) || 
          'التنقل في الواجهة، لوحة التحكم، المراحل الـ 11، الهدايا، وقسم "أرباحي".',
          'في نهاية هذه الوحدة: ستكون قادراً على إظهار الأكاديمية في فيديو بثقة', 8)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'أعرف كيف أدخل الأكاديمية', 1),
  (m_id, 'أعرف كيف أتنقل في الواجهة', 2),
  (m_id, 'أعرف كيف أظهر لوحة التحكم', 3),
  (m_id, 'أعرف كيف أظهر المراحل الـ 11', 4),
  (m_id, 'أعرف كيف أظهر وحدات مرحلة', 5),
  (m_id, 'أعرف كيف أظهر الهدايا الـ 28', 6),
  (m_id, 'أستطيع شرح كل قسم بكلمات بسيطة', 7);

  -- ---------------------------------------------
  -- Module 09
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 9, 'AMB 09', 'صفحة البيع بالتفصيل 📄', 'Sales page explained', '📄', 
          'معرفة إظهار صفحة البيع بدون عدوانية', 
          'فهم دور صفحة البيع (هي تبيع بدلاً عنك).' || chr(10) || 
          'شرح العنوان الرئيسي، الشهادات (الدليل الاجتماعي)، نتائج الطلاب، الباقات، الهدايا، والضمان.',
          'في نهاية هذه الوحدة: ستكون قادراً على عرض صفحة البيع بطريقة طبيعية ومقنعة', 9)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهمت دور صفحة البيع', 1),
  (m_id, 'أعرف أين أضغط وماذا أُظهر', 2),
  (m_id, 'أستطيع شرح العنوان الرئيسي', 3),
  (m_id, 'أعرف كيف أُظهر الشهادات', 4),
  (m_id, 'أعرف كيف أُظهر نتائج الطلاب', 5),
  (m_id, 'أعرف كيف أُظهر الباقات والأسعار', 6),
  (m_id, 'أستطيع توجيه شخص حتى زر التسجيل', 7);

  -- ---------------------------------------------
  -- Module 10
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 10, 'AMB 10', 'رابطك الشخصي وكود الخصم 🔗', 'Your unique link and promo code', '🔗', 
          'الحصول على أدوات السفير وحفظها', 
          'ادخل إلى أكاديمية LEXMO ثم اذهب إلى "أرباحي".' || chr(10) || 
          'ابحث عن رابطك الشخصي (LEX-XXXXX) وكود الخصم (PROMO-XXXXX).' || chr(10) || 
          'احفظهما في الملاحظات وأرسلهما لنفسك على واتساب.' || chr(10) || 
          'افهم: كل بيعة عبر رابطك = 50% لك.',
          'في نهاية هذه الوحدة: ستكون قد حصلت على أدواتك وأصبحت جاهزاً للمشاركة', 10)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'دخلت إلى أكاديمية LEXMO', 1),
  (m_id, 'ذهبت إلى "أرباحي"', 2),
  (m_id, 'وجدت رابطي الشخصي', 3),
  (m_id, 'وجدت كود الخصم الخاص بي', 4),
  (m_id, 'نسختهما في ملاحظات الهاتف', 5),
  (m_id, 'أرسلتهما لنفسي على واتساب', 6),
  (m_id, 'اختبرت الرابط وتأكدت أنه يعمل', 7);

  -- ---------------------------------------------
  -- Module 11
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 11, 'AMB 11', 'جهز هاتفك للعمل 📲', 'Prepare your phone for work', '📲', 
          'الحصول على هاتف جاهز لصناعة المحتوى', 
          'نظف ذاكرة الهاتف وعدسة الكاميرا.' || chr(10) || 
          'حمل التطبيقات الضرورية: TikTok, Instagram, CapCut, Canva.' || chr(10) || 
          'أنشئ مجلد "LEXMO" لتنظيم فيديوهاتك.',
          'في نهاية هذه الوحدة: هاتفك جاهز للعمل', 11)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'نظفت ذاكرة الهاتف', 1),
  (m_id, 'نظفت عدسة الكاميرا', 2),
  (m_id, 'تأكدت من وجود مساحة كافية', 3),
  (m_id, 'حملت تطبيق TikTok', 4),
  (m_id, 'حملت تطبيق Instagram', 5),
  (m_id, 'حملت تطبيق CapCut', 6),
  (m_id, 'حملت تطبيق Canva', 7),
  (m_id, 'أنشأت مجلد "LEXMO"', 8),
  (m_id, 'جربت الكاميرا', 9);

  -- ---------------------------------------------
  -- Module 12
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 12, 'AMB 12', 'إنشاء حساب TikTok احترافي 🎵', 'Create a professional TikTok account', '🎵', 
          'الحصول على حساب TikTok جاهز للنشر', 
          'سجل بالإيميل، اختر اسم مستخدم احترافي، أضف صورة بروفايل وبايو جذاب.' || chr(10) || 
          'حول الحساب إلى "تجاري".',
          'في نهاية هذه الوحدة: حساب TikTok جاهز', 12)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فتحت تطبيق TikTok وضغطت تسجيل', 1),
  (m_id, 'اخترت التسجيل بالإيميل', 2),
  (m_id, 'أنشأت كلمة سر قوية', 3),
  (m_id, 'اخترت اسم مستخدم احترافي', 4),
  (m_id, 'أضفت صورة بروفايل احترافية', 5),
  (m_id, 'كتبت البايو', 6),
  (m_id, 'حولت الحساب إلى تجاري', 7),
  (m_id, 'أضفت رابطي في البايو (عندما يتوفر)', 8);

  -- ---------------------------------------------
  -- Module 13
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 13, 'AMB 13', 'إنشاء حساب Instagram احترافي 📸', 'Create a professional Instagram account', '📸', 
          'الحصول على حساب Instagram جاهز للنشر', 
          'أنشئ حساباً جديداً، حوله إلى احترافي (فئة رائد أعمال)، جهز البايو والبروفايل.',
          'في نهاية هذه الوحدة: حساب Instagram جاهز', 13)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فتحت Instagram وأنشأت حساب جديد', 1),
  (m_id, 'سجلت بالإيميل', 2),
  (m_id, 'أضفت نفس صورة البروفايل', 3),
  (m_id, 'كتبت البايو', 4),
  (m_id, 'حولت الحساب إلى احترافي', 5),
  (m_id, 'اخترت فئة رائد أعمال', 6),
  (m_id, 'أضفت رابطي في البايو', 7);

  -- ---------------------------------------------
  -- Module 14
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 14, 'AMB 14', 'تعلم تصوير الشاشة 📹', 'Learn screen recording', '📹', 
          'معرفة عمل "تسجيل شاشة" بسهولة', 
          'فعل ميزة تسجيل الشاشة من إعدادات هاتفك. جرب تسجيل 10 ثواني.',
          'في نهاية هذه الوحدة: تعرف كيف تسجل شاشة هاتفك', 14)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فعلت ميزة تسجيل الشاشة', 1),
  (m_id, 'وجدت زر بدء التسجيل', 2),
  (m_id, 'جربت تسجيل 10 ثواني', 3),
  (m_id, 'تعلمت تفعيل/إيقاف الميكروفون', 4),
  (m_id, 'عرفت أين تُحفظ الفيديوهات', 5);

  -- ---------------------------------------------
  -- Module 15
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 15, 'AMB 15', 'أنواع الفيديوهات الممكنة 🎭', 'Types of videos you can make', '🎭', 
          'فهم كل الإمكانيات بدون إظهار الوجه', 
          'فيديو شاشة + صوتي، فيديو نصوص، فيديو "Lifestyle"، جولة في الأكاديمية.',
          'في نهاية هذه الوحدة: اخترت 3 أنواع لأبدأ بها', 15)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهمت أنواع الفيديوهات بدون وجه', 1),
  (m_id, 'اخترت 3 أنواع سأبدأ بها', 2);

  -- ---------------------------------------------
  -- Module 16
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 16, 'AMB 16', 'تصوير صفحة البيع 🖥️', 'Recording the sales page', '🖥️', 
          'إنشاء فيديو يُظهر صفحة البيع', 
          'افتح صفحة البيع، وسجل الشاشة وأنت تمرر ببطء، مركزاً على العناوين والشهادات والضمان.',
          'في نهاية هذه الوحدة: لديك فيديو جاهز لصفحة البيع', 16)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'سجلت فيديو لصفحة البيع', 1),
  (m_id, 'أظهرت الأقسام المهمة', 2),
  (m_id, 'حفظت الفيديو', 3);

  -- ---------------------------------------------
  -- Module 17
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 17, 'AMB 17', 'تصوير داخل الأكاديمية 🎓', 'Recording inside the Academy', '🎓', 
          'إظهار ما يحصل عليه الناس بعد التسجيل', 
          'ادخل الأكاديمية وسجل جولة سريعة (داشبورد، مراحل، هدايا).',
          'في نهاية هذه الوحدة: لديك فيديو جولة في الأكاديمية', 17)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'سجلت جولة داخل الأكاديمية', 1),
  (m_id, 'أظهرت القيمة الكبيرة', 2),
  (m_id, 'حفظت الفيديو', 3);

  -- ---------------------------------------------
  -- Module 18
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 18, 'AMB 18', 'تصوير محتوى "Lifestyle" 🌅', 'Recording "Lifestyle" content', '🌅', 
          'إظهار حرية العمل أونلاين', 
          'صور مقتطفات من حياتك اليومية تظهر الحرية (قهوة، مكان عمل، نزهة). هذه ستكون خلفيات رائعة.',
          'في نهاية هذه الوحدة: لديك مكتبة فيديوهات خلفية', 18)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'صورت مقتطفات Lifestyle', 1),
  (m_id, 'استخدمت الضوء الطبيعي', 2),
  (m_id, 'حفظت الفيديوهات في مجلد', 3);

  -- ---------------------------------------------
  -- Module 19
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 19, 'AMB 19', 'مونتاج بسيط بـ CapCut ✂️', 'Simple editing with CapCut', '✂️', 
          'تحويل الفيديو الخام إلى فيديو احترافي', 
          'استخدم CapCut لقص الفيديو، إضافة نص، وإضافة موسيقى خلفية.',
          'في نهاية هذه الوحدة: تعرف أساسيات المونتاج', 19)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'استخدمت CapCut لمونتاج فيديو', 1),
  (m_id, 'أضفت موسيقى ونص', 2),
  (m_id, 'صدرت الفيديو بجودة عالية', 3);

  -- ---------------------------------------------
  -- Module 20
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 20, 'AMB 20', 'إضافة الترجمة التلقائية 💬', 'Adding automatic subtitles', '💬', 
          'أن يُفهم الفيديو حتى بدون صوت', 
          'استخدم ميزة الترجمة التلقائية في CapCut لأن 80% من الناس يشاهدون بدون صوت.',
          'في نهاية هذه الوحدة: فيديوهاتك مترجمة واحترافية', 20)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'جربت الترجمة التلقائية', 1),
  (m_id, 'راجعت النص وصححته', 2),
  (m_id, 'نسقت شكل النص', 3);

  -- ---------------------------------------------
  -- Module 21
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 21, 'AMB 21', 'سكريبتات الفيديو الجاهزة 📝', 'Ready-to-use video scripts', '📝', 
          'عدم التوقف أبداً أمام الكاميرا', 
          'انسخ السكريبتات الجاهزة (جولة، لماذا انضممت، الشهادة...) واحفظها في ملاحظاتك.',
          'في نهاية هذه الوحدة: لديك مخزون من الأفكار والسكريبتات', 21)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'نسخت السكريبتات الجاهزة', 1),
  (m_id, 'قرأت كل سكريبت بصوت عالٍ', 2),
  (m_id, 'اخترت 3 لأبدأ بها', 3);

  -- ---------------------------------------------
  -- Module 22
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 22, 'AMB 22', 'العناوين والوصف الجذاب 🧲', 'Attractive titles and descriptions', '🧲', 
          'أن يضغط الناس على فيديوهاتك', 
          'العنوان هو 80% من النجاح. استخدم العناوين الجذابة المُقدمة.',
          'في نهاية هذه الوحدة: تعرف كيف تكتب عناوين تجذب الانتباه', 22)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'نسخت العناوين الجذابة', 1),
  (m_id, 'فهمت أهمية الوصف القصير', 2);

  -- ---------------------------------------------
  -- Module 23
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 23, 'AMB 23', 'النصوص على الفيديو 📺', 'Text on video', '📺', 
          'إنشاء تأثير بصري بالنص', 
          'استخدم النصوص لعمل Hook (خطف انتباه) و CTA (دعوة لاتخاذ إجراء).',
          'في نهاية هذه الوحدة: تعرف كيف تستخدم النصوص بذكاء', 23)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'نسخت نصوص Hook و CTA', 1),
  (m_id, 'فهمت كيفية تنسيق النصوص', 2);

  -- ---------------------------------------------
  -- Module 24
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 24, 'AMB 24', 'النشر على TikTok 📤', 'Publishing on TikTok', '📤', 
          'نشر أول فيديو على TikTok', 
          'خطوات رفع الفيديو على TikTok، إضافة الوصف، الهاشتاغ، والرابط.',
          'في نهاية هذه الوحدة: نشرت أول فيديو لك!', 24)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'رفعت الفيديو على TikTok', 1),
  (m_id, 'أضفت الوصف والهاشتاغ', 2),
  (m_id, 'نشرت الفيديو!', 3),
  (m_id, 'شاركت الرابط مع نفسي', 4);

  -- ---------------------------------------------
  -- Module 25
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 25, 'AMB 25', 'النشر على Instagram Reels 📤', 'Publishing on Instagram Reels', '📤', 
          'نشر نفس الفيديو على Instagram', 
          'أعد نشر نفس الفيديو كـ Reel لزيادة الوصول.',
          'في نهاية هذه الوحدة: نشرت أول Reel!', 25)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'رفعت الفيديو كـ Reel', 1),
  (m_id, 'شاركت في الستوري', 2);

  -- ---------------------------------------------
  -- Module 26
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 26, 'AMB 26', 'روتينك اليومي كسفير 📅', 'Your daily Ambassador routine', '📅', 
          'بناء عادة بسيطة وواقعية', 
          'خصص 30-60 دقيقة يومياً: صباحاً للرد، نهاراً للتصوير، مساءً للمونتاج والنشر.',
          'في نهاية هذه الوحدة: لديك جدول عمل واضح', 26)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهمت الروتين اليومي', 1),
  (m_id, 'التزمت بنشر فيديو واحد على الأقل يومياً', 2),
  (m_id, 'حفظت برنامج الأسبوع', 3);

  -- ---------------------------------------------
  -- Module 27
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 27, 'AMB 27', 'الرد على التعليقات والرسائل 💬', 'Responding to comments and messages', '💬', 
          'تحويل الفضوليين إلى مسجلين', 
          'رد على الجميع بلطف. استخدم الرسائل الصوتية للتطمين. أرسل الرابط فقط للمهتمين.',
          'في نهاية هذه الوحدة: تعرف كيف تتفاعل مع جمهورك', 27)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'سأرد على كل تعليق ورسالة', 1),
  (m_id, 'سأستخدم الرسائل الصوتية', 2),
  (m_id, 'سأكون صبوراً ولطيفاً', 3);

  -- ---------------------------------------------
  -- Module 28
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 28, 'AMB 28', 'الرد على الاعتراضات 🛡️', 'Handling objections', '🛡️', 
          'الحصول على رد لكل شك', 
          'احفظ الردود الجاهزة على الاعتراضات الشائعة (غالي، نصب، ما عندي وقت...).',
          'في نهاية هذه الوحدة: لديك إجابة لكل سؤال', 28)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'حفظت الردود على الاعتراضات', 1),
  (m_id, 'تدربت على الإجابة بطبيعية', 2);

  -- ---------------------------------------------
  -- Module 29
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 29, 'AMB 29', 'مرافقة العميل حتى التسجيل 🤝', 'Guiding the client to registration', '🤝', 
          'توجيه الشخص خطوة بخطوة حتى الدفع', 
          'عندما يقرر الشخص، أرسل الرابط والكود، وابق معه خطوة بخطوة حتى يتم الدفع.',
          'في نهاية هذه الوحدة: تعرف كيف تغلق البيعة', 29)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'أعرف كيف أوجه العميل', 1),
  (m_id, 'أوصي بالباقة المناسبة', 2),
  (m_id, 'أساعده في خطواته الأولى', 3);

  -- ---------------------------------------------
  -- Module 30
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 30, 'AMB 30', 'الوصول لـ 10,000€ والاستمرار 🏆', 'Reaching 10,000€ and continuing', '🏆', 
          'تحقيق الهدف والانتقال للمستوى التالي', 
          'هدف واقعي: 3-4 بيعات/شهر. استمر في التحسين وتوثيق الرحلة.',
          'في نهاية هذه الوحدة: لديك خطة للوصول إلى 10k', 30)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'فهمت الهدف المطلوب', 1),
  (m_id, 'سأتابع إحصائياتي', 2),
  (m_id, 'لن أستسلم', 3);

  -- ---------------------------------------------
  -- Module Bonus
  -- ---------------------------------------------
  INSERT INTO public.modules (phase_id, module_number, badge, title_ar, title_en, emoji, objective_ar, content_ar, expected_result_ar, order_index)
  VALUES (p_id, 31, 'AMB FINAL', 'المصادقة النهائية 🎓', 'Final Validation', '🎓', 
          'التأكد من إتمام كل شيء', 
          'راجع كل الوحدات، احجز موعد المصادقة، وافتح المرحلة 2.',
          'في نهاية هذه الوحدة: أنت سفير معتمد!', 31)
  RETURNING id INTO m_id;

  INSERT INTO public.tasks (module_id, task_text_ar, order_index) VALUES
  (m_id, 'راجعت كل الوحدات', 1),
  (m_id, 'تأكدت من إكمال كل المهام', 2),
  (m_id, 'حجزت موعد المصادقة', 3),
  (m_id, 'فتحت المرحلة 2', 4),
  (m_id, 'احتفلت بإنجازي! 🎉', 5);

END $$;
