export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#030712] to-[#0f172a] text-white py-20 px-4" dir="rtl">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center font-cairo">سياسة الخصوصية وحماية البيانات</h1>

                <div className="prose prose-invert max-w-none space-y-8 text-gray-300 font-cairo">
                    <p className="text-sm text-gray-400">آخر تحديث: 26 يناير 2026</p>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. مقدمة</h2>
                        <p>
                            نحن في LEXMO.AI نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحماية معلوماتك الشخصية.
                        </p>
                        <p className="font-bold mt-4">البريد الإلكتروني: acadmyfrance75@gmail.com</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. البيانات التي نجمعها</h2>
                        <h3 className="text-xl font-bold text-white mb-2">2.1 بيانات التعريف</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>الاسم الكامل</li>
                            <li>عنوان البريد الإلكتروني</li>
                            <li>رقم الهاتف (اختياري)</li>
                            <li>البلد/المنطقة</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">2.2 بيانات الاستخدام</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>تقدمك في الدروس</li>
                            <li>الوحدات المكتملة</li>
                            <li>وقت الوصول والمدة</li>
                            <li>نوع الجهاز والمتصفح</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">2.3 بيانات الدفع</h3>
                        <p>
                            تتم معالجة معلومات الدفع بشكل آمن بواسطة Stripe. لا نقوم بتخزين تفاصيل بطاقتك الائتمانية على خوادمنا.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. كيف نستخدم بياناتك</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>لتوفير الوصول إلى منصة التدريب</li>
                            <li>لمعالجة المدفوعات والفواتير</li>
                            <li>لإرسال تحديثات حول التدريب</li>
                            <li>لتحسين جودة المحتوى والخدمات</li>
                            <li>للامتثال للالتزامات القانونية</li>
                            <li>لإدارة نظام السفراء والعمولات</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. الأساس القانوني للمعالجة</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>تنفيذ العقد:</strong> لتوفير الخدمات التي طلبتها</li>
                            <li><strong>الموافقة:</strong> لإرسال رسائل تسويقية (يمكنك الانسحاب في أي وقت)</li>
                            <li><strong>المصلحة المشروعة:</strong> لتحسين خدماتنا ومنع الاحتيال</li>
                            <li><strong>الالتزام القانوني:</strong> للامتثال للوائح الضريبية والمحاسبية</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. مشاركة البيانات</h2>
                        <p>نشارك بياناتك فقط مع:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Stripe:</strong> لمعالجة المدفوعات</li>
                            <li><strong>Supabase:</strong> لاستضافة قاعدة البيانات</li>
                            <li><strong>Vercel:</strong> لاستضافة المنصة</li>
                            <li><strong>مقدمي خدمات البريد الإلكتروني:</strong> لإرسال الإشعارات</li>
                        </ul>
                        <p className="mt-4 font-bold">نحن لا نبيع بياناتك الشخصية أبداً.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. أمن البيانات</h2>
                        <p>نطبق تدابير أمنية صارمة لحماية بياناتك:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>تشفير SSL/TLS لجميع عمليات النقل</li>
                            <li>تشفير كلمات المرور</li>
                            <li>خوادم آمنة مع جدران حماية</li>
                            <li>وصول محدود إلى البيانات الشخصية</li>
                            <li>نسخ احتياطية منتظمة</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. مدة الاحتفاظ بالبيانات</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>بيانات الحساب:</strong> حتى حذف الحساب أو بعد 3 سنوات من عدم النشاط</li>
                            <li><strong>بيانات الدفع:</strong> 10 سنوات (الالتزامات المحاسبية)</li>
                            <li><strong>بيانات التقدم:</strong> طوال مدة التدريب + 3 سنوات</li>
                            <li><strong>بيانات التسويق:</strong> حتى سحب الموافقة</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. حقوقك</h2>
                        <p>لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>الوصول:</strong> الحصول على نسخة من بياناتك</li>
                            <li><strong>التصحيح:</strong> تصحيح البيانات غير الدقيقة</li>
                            <li><strong>الحذف:</strong> حذف بياناتك (مع استثناءات قانونية)</li>
                            <li><strong>القيود:</strong> تقييد معالجة بياناتك</li>
                            <li><strong>الاعتراض:</strong> الاعتراض على معالجة معينة</li>
                            <li><strong>النقل:</strong> الحصول على بياناتك بتنسيق قابل للقراءة</li>
                            <li><strong>سحب الموافقة:</strong> سحب موافقتك في أي وقت</li>
                        </ul>
                        <p className="mt-4">
                            لممارسة حقوقك، اتصل بنا على: <strong>acadmyfrance75@gmail.com</strong>
                        </p>
                        <p className="text-sm">سنرد على طلبك في غضون 30 يوماً.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. ملفات تعريف الارتباط (Cookies)</h2>
                        <p>نستخدم ملفات تعريف الارتباط لـ:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>الحفاظ على جلستك نشطة</li>
                            <li>تذكر تفضيلاتك</li>
                            <li>تحليل استخدام الموقع (Google Analytics)</li>
                            <li>تحسين الأداء</li>
                        </ul>
                        <p className="mt-4">يمكنك إدارة ملفات تعريف الارتباط عبر إعدادات المتصفح الخاص بك.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. نقل البيانات الدولي</h2>
                        <p>
                            قد يتم نقل بياناتك إلى خوادم موجودة خارج بلدك. نضمن أن جميع عمليات النقل تتم بشكل آمن ووفقاً للقوانين المعمول بها (RGPD).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. القُصّر</h2>
                        <p>
                            خدماتنا مخصصة للأشخاص الذين تبلغ أعمارهم 18 عاماً فما فوق. نحن لا نجمع عن علم بيانات من الأطفال دون سن 18 عاماً.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">12. تعديلات على سياسة الخصوصية</h2>
                        <p>
                            نحتفظ بالحق في تعديل سياسة الخصوصية هذه في أي وقت. سيتم إخطارك بأي تغييرات كبيرة عبر البريد الإلكتروني.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">13. الاتصال</h2>
                        <p>لأي أسئلة حول سياسة الخصوصية هذه:</p>
                        <ul className="list-none space-y-2">
                            <li><strong>البريد الإلكتروني:</strong> acadmyfrance75@gmail.com</li>
                            <li><strong>وقت الاستجابة:</strong> 24-48 ساعة (أيام العمل)</li>
                        </ul>
                    </section>

                    <section className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <p className="text-sm text-gray-400">
                            تدخل سياسة الخصوصية هذه حيز التنفيذ اعتباراً من 26 يناير 2026. من خلال استخدام خدماتنا، فإنك توافق على هذه السياسة.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
