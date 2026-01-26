export default function RefundPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#030712] to-[#0f172a] text-white py-20 px-4" dir="rtl">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center font-cairo">سياسة الاسترداد والضمان</h1>

                <div className="prose prose-invert max-w-none space-y-8 text-gray-300 font-cairo">
                    <p className="text-sm text-gray-400">آخر تحديث: 26 يناير 2026</p>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. ضمان الرضا - 30 يوماً</h2>
                        <p className="text-lg">
                            نحن واثقون تماماً من جودة برنامج LEXMO.AI. لذلك نقدم لك <strong className="text-[#00d2ff]">ضمان استرداد كامل لمدة 30 يوماً</strong>.
                        </p>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mt-4">
                            <p className="text-green-400 font-bold text-center text-xl">
                                ✅ إذا لم تكن راضياً على الإطلاق، نعيد لك أموالك بالكامل خلال 30 يوماً
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. شروط الاسترداد</h2>

                        <h3 className="text-xl font-bold text-white mb-2">2.1 المدة</h3>
                        <p>
                            لديك <strong>30 يوماً كاملاً</strong> من تاريخ الشراء لطلب استرداد الأموال.
                        </p>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">2.2 الشروط</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>الطلب يجب أن يتم خلال 30 يوماً من تاريخ الشراء</li>
                            <li>إرسال طلب مكتوب عبر البريد الإلكتروني</li>
                            <li>توضيح سبب الاسترداد (اختياري ولكن يساعدنا على التحسين)</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">2.3 الاستثناءات</h3>
                        <p>لا يمكن استرداد الأموال في الحالات التالية:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>باقة الأسطورة (Legend):</strong> بعد بدء الجلسات الشخصية 1-على-1</li>
                            <li>انتهاك شروط الاستخدام أو السلوك غير اللائق</li>
                            <li>محاولة احتيال أو استخدام بطاقات مسروقة</li>
                            <li>تحميل أو توزيع المحتوى بشكل غير قانوني</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. كيفية طلب الاسترداد</h2>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">الخطوات البسيطة:</h3>
                            <ol className="list-decimal list-inside space-y-3">
                                <li>
                                    <strong>أرسل بريد إلكتروني</strong> إلى: <span className="text-[#00d2ff]">acadmyfrance75@gmail.com</span>
                                </li>
                                <li>
                                    <strong>الموضوع:</strong> "طلب استرداد الأموال"
                                </li>
                                <li>
                                    <strong>المحتوى:</strong>
                                    <ul className="list-disc list-inside mr-6 mt-2 space-y-1">
                                        <li>اسمك الكامل</li>
                                        <li>عنوان البريد الإلكتروني المستخدم عند الشراء</li>
                                        <li>تاريخ الشراء (إذا كنت تتذكره)</li>
                                        <li>الباقة المشتراة (Spark / Emperor / Legend)</li>
                                        <li>سبب الاسترداد (اختياري)</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>الانتظار:</strong> سنرد عليك خلال 24-48 ساعة (أيام العمل)
                                </li>
                                <li>
                                    <strong>التأكيد:</strong> ستتلقى تأكيد الاسترداد عبر البريد الإلكتروني
                                </li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. مواعيد الاسترداد</h2>
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-lg">
                                <p className="font-bold text-white">⏱️ معالجة الطلب</p>
                                <p className="text-sm">1-2 أيام عمل بعد الموافقة</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg">
                                <p className="font-bold text-white">💳 الإرجاع إلى البطاقة</p>
                                <p className="text-sm">5-10 أيام عمل حسب البنك الخاص بك</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg">
                                <p className="font-bold text-white">💰 الإرجاع إلى PayPal</p>
                                <p className="text-sm">1-3 أيام عمل</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-400">
                            ملاحظة: يتم الاسترداد بنفس طريقة الدفع المستخدمة عند الشراء.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. ما يحدث بعد الاسترداد</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>يتم إلغاء الوصول إلى المنصة فوراً</li>
                            <li>إزالة الوصول إلى جميع الدروس والمحتوى</li>
                            <li>إزالة من المجتمع VIP (إذا كنت في Emperor أو Legend)</li>
                            <li>إلغاء حقوق السفير (إذا كنت سفيراً نشطاً)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. ضمان خاص - باقة الأسطورة (Legend)</h2>
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                            <p className="text-lg mb-4">
                                بالنسبة لباقة <strong className="text-purple-400">الأسطورة (€2,997)</strong>، نقدم ضماناً إضافياً:
                            </p>
                            <div className="bg-white/5 p-4 rounded-lg">
                                <p className="font-bold text-white mb-2">🎯 ضمان البيع الأول</p>
                                <p>
                                    إذا لم تحقق أول بيع خلال 30 يوماً بعد تطبيق جميع التوصيات والحضور لجميع الجلسات،
                                    <strong className="text-purple-400"> نعيد لك أموالك كاملة</strong>.
                                </p>
                            </div>
                            <p className="text-sm text-gray-400 mt-4">
                                *يجب إثبات تطبيق جميع الخطوات الموصى بها والحضور لجميع الجلسات.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. الاستردادات الجزئية</h2>
                        <p>
                            في حالات خاصة، قد نقدم استرداداً جزئياً بدلاً من الكامل:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                            <li>إذا استخدمت جزءاً كبيراً من المحتوى (أكثر من 50%)</li>
                            <li>إذا حضرت عدة جلسات شخصية (Legend)</li>
                            <li>إذا مر أكثر من 20 يوماً من الشراء</li>
                        </ul>
                        <p className="mt-4 text-sm">
                            سيتم حساب الاسترداد الجزئي بناءً على الاستخدام الفعلي وبشكل عادل.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. سياسة عدم الإرجاع</h2>
                        <p>لن نقبل طلبات الاسترداد في الحالات التالية:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>بعد مرور 30 يوماً من تاريخ الشراء</li>
                            <li>إذا تم تنزيل جميع الملفات الحصرية والبونصات</li>
                            <li>إذا تم استخدام البرنامج لإنشاء محتوى أو عمل تجاري</li>
                            <li>في حالة الاحتيال أو إساءة الاستخدام</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. النزاعات والخلافات</h2>
                        <p>
                            إذا كانت لديك مشكلة مع المنتج، نشجعك على <strong>التواصل معنا أولاً</strong> قبل طلب رد المبالغ المدفوعة من خلال البنك أو PayPal.
                        </p>
                        <p className="mt-4">
                            نحن ملتزمون بحل أي مشاكل بشكل ودي وسريع. في معظم الحالات، يمكننا إيجاد حل يرضي الطرفين.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. الأسئلة الشائعة</h2>

                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-lg">
                                <p className="font-bold text-white">❓ هل يمكنني الحصول على استرداد إذا لم أحقق نتائج؟</p>
                                <p className="text-sm mt-2">
                                    نعم، إذا كان ذلك خلال 30 يوماً. لكن تذكر أن النتائج تعتمد على تطبيقك للبرنامج.
                                </p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg">
                                <p className="font-bold text-white">❓ ماذا لو لم يناسبني المحتوى؟</p>
                                <p className="text-sm mt-2">
                                    لا مشكلة! يمكنك طلب استرداد كامل خلال 30 يوماً دون الحاجة لتبرير مفصل.
                                </p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg">
                                <p className="font-bold text-white">❓ هل يمكنني إعادة الشراء بعد الاسترداد؟</p>
                                <p className="text-sm mt-2">
                                    نعم، ولكن في هذه الحالة لن يكون هناك ضمان استرداد في المرة الثانية.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. للاتصال</h2>
                        <div className="bg-[#00d2ff]/10 border border-[#00d2ff]/20 rounded-xl p-6">
                            <p className="text-lg mb-4">لأي أسئلة حول سياسة الاسترداد:</p>
                            <ul className="list-none space-y-2">
                                <li><strong>البريد الإلكتروني:</strong> acadmyfrance75@gmail.com</li>
                                <li><strong>الموضوع:</strong> "استفسار حول الاسترداد" أو "طلب استرداد"</li>
                                <li><strong>وقت الاستجابة:</strong> 24-48 ساعة (أيام العمل)</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <p className="text-center text-lg font-bold text-white mb-2">
                            💯 التزامنا تجاهك
                        </p>
                        <p className="text-center text-gray-300">
                            نحن واثقون من أن LEXMO.AI سيغير حياتك. لكن إذا لم تكن راضياً لأي سبب،
                            سنعيد لك أموالك بالكامل خلال 30 يوماً. لا أسئلة معقدة، لا تعقيدات.
                        </p>
                        <p className="text-center text-[#00d2ff] font-bold mt-4">
                            وعدنا لك: رضاك التام أو استرداد أموالك!
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
