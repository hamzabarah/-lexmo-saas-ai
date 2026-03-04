export default function LegalPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#030712] to-[#0f172a] text-white py-20 px-4" dir="rtl">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center font-cairo">الشروط العامة للاستخدام والبيع</h1>

                <div className="prose prose-invert max-w-none space-y-8 text-gray-300 font-cairo">
                    <p className="text-sm text-gray-400">آخر تحديث: 26 يناير 2026</p>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 1. معلومات قانونية</h2>

                        <h3 className="text-xl font-bold text-white mb-2">1.1 الناشر</h3>
                        <div className="bg-white/5 p-4 rounded-lg space-y-2">
                            <p><strong>اسم المنصة:</strong> ECOMY</p>
                            <p><strong>البريد الإلكتروني:</strong> acadmyfrance75@gmail.com</p>
                            <p><strong>الموقع:</strong> https://ecomy.vercel.app</p>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">1.2 الاستضافة</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>المنصة:</strong> Vercel Inc.</li>
                            <li><strong>قاعدة البيانات:</strong> Supabase</li>
                            <li><strong>المدفوعات:</strong> Stripe</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 2. الهدف والقبول</h2>
                        <p>
                            تحدد هذه الشروط العامة كيفية استخدام منصة ECOMY وشراء الخدمات المقدمة.
                        </p>
                        <p className="mt-4">
                            <strong>بإتمام عملية الشراء، فإنك توافق دون تحفظ على هذه الشروط العامة.</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 3. وصف الخدمات</h2>
                        <p>
                            تقدم ECOMY برامج تدريبية عبر الإنترنت في مجال التجارة الإلكترونية والتسويق بالعمولة،
                            منظمة في 11 مرحلة و40 وحدة تدريبية.
                        </p>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">3.1 الباقات المتاحة</h3>

                        <div className="space-y-4 mt-4">
                            <div className="bg-white/5 p-4 rounded-lg border-r-4 border-orange-500">
                                <p className="font-bold text-white text-lg">🚀 الشرارة (Spark) - €997</p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                    <li>نظام Lexmo.AI الأساسي</li>
                                    <li>تكوين تجارة إلكترونية (10 وحدات)</li>
                                    <li>قوالب جاهزة</li>
                                    <li>دعم عبر البريد الإلكتروني</li>
                                    <li>تحديثات لمدة سنة</li>
                                </ul>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg border-r-4 border-cyan-500">
                                <p className="font-bold text-white text-lg">👑 الإمبراطور (Emperor) - €1,497</p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                    <li>كل ما في Spark</li>
                                    <li>28 مكافأة حصرية (قيمة €70,000+)</li>
                                    <li>مجتمع VIP</li>
                                    <li>جلسات Live أسبوعية</li>
                                    <li>تحديثات مدى الحياة</li>
                                    <li>حقوق إعادة البيع (برنامج السفير)</li>
                                </ul>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg border-r-4 border-purple-500">
                                <p className="font-bold text-white text-lg">💎 الأسطورة (Legend) - €3,997</p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                    <li>كل ما في Emperor</li>
                                    <li>مرافقة شخصية 1-على-1 (12 جلسة)</li>
                                    <li>بناء متجرك "Done For You"</li>
                                    <li>إدارة أول حملة إعلانية</li>
                                    <li>واتساب خاص مباشر</li>
                                    <li>ضمان أول بيع 30 يوم</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 4. الأسعار</h2>
                        <p>
                            الأسعار المعروضة على الموقع هي بالي ورو (€) وتشمل جميع الضرائب.
                        </p>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">4.1 أسعار السفراء</h3>
                        <p>العملاء الذين يستخدمون رمز إحالة السفير يحصلون على خصم:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Spark: €697 (بدلاً من €997)</li>
                            <li>Emperor: €997 (بدلاً من €1,497)</li>
                            <li>Legend: €2,997 (بدلاً من €3,997)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 5. الطلب والدفع</h2>

                        <h3 className="text-xl font-bold text-white mb-2">5.1 عملية الطلب</h3>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>اختيار الباقة المطلوبة</li>
                            <li>إعادة التوجيه إلى صفحة الدفع الآمنة Stripe</li>
                            <li>إدخال معلومات الدفع</li>
                            <li>التحقق من الطلب</li>
                            <li>تلقي بريد إلكتروني للتأكيد</li>
                            <li>الوصول الفوري إلى المنصة</li>
                        </ol>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">5.2 وسائل الدفع</h3>
                        <p>نقبل المدفوعات عن طريق:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>البطاقات البنكية (Visa, Mastercard, American Express)</li>
                            <li>PayPal</li>
                            <li>تحويل بنكي (عند الطلب)</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">5.3 الأمان</h3>
                        <p>
                            جميع المدفوعات تتم بشكل آمن عبر Stripe وفقاً لمعايير PCI-DSS.
                            <strong> لا نخزن أبداً معلومات بطاقتك الائتمانية</strong> على خوادمنا.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 6. حق التراجع</h2>
                        <p className="text-lg">
                            وفقاً للتشريعات المعمول بها، لديك <strong className="text-green-400">30 يوماً</strong> لممارسة حقك في التراجع دون إبداء الأسباب.
                        </p>
                        <p className="mt-4">
                            لممارسة هذا الحق، أرسل طلباً إلى: <strong>acadmyfrance75@gmail.com</strong>
                        </p>
                        <p className="mt-2 text-sm">
                            سيتم رد الأموال خلال 14 يوماً من استلام طلبك، بنفس طريقة الدفع المستخدمة عند الشراء.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 7. الوصول إلى الخدمات</h2>

                        <h3 className="text-xl font-bold text-white mb-2">7.1 الوصول إلى المنصة</h3>
                        <p>
                            يتم منح الوصول إلى المنصة فوراً بعد تأكيد الدفع. ستتلقى بريداً إلكترونياً يحتوي على بيانات الاعتماد.
                        </p>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">7.2 مدة الوصول</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Spark:</strong> وصول لمدة سنة واحدة + تحديثات</li>
                            <li><strong>Emperor:</strong> وصول مدى الحياة + تحديثات مدى الحياة</li>
                            <li><strong>Legend:</strong> وصول مدى الحياة + مرافقة 3 أشهر</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">7.3 السرية</h3>
                        <p>
                            بيانات الاعتماد الخاصة بك شخصية ومحدودة الاستخدام. تحظر مشاركتها مع أطراف ثالثة.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 8. الملكية الفكرية</h2>
                        <p>
                            جميع محتويات المنصة (دروس، فيديوهات، مستندات، قوالب) محمية بحقوق الملكية الفكرية
                            وتبقى ملكية حصرية لـ ECOMY.
                        </p>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">8.1 الاستخدام المصرح به</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>استخدام شخصي فقط</li>
                            <li>التنزيل للاستخدام دون اتصال (Emperor و Legend)</li>
                            <li>التطبيق العملي لتطوير نشاطك</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">8.2 الاستخدام المحظور</h3>
                        <p><strong className="text-red-400">يحظر بشكل صارم:</strong></p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>مشاركة بيانات الاعتماد</li>
                            <li>نسخ أو نشر المحتوى</li>
                            <li>إعادة بيع التدريب (إلا حقوق السفير Emperor/Legend)</li>
                            <li>الهندسة العكسية للمحتوى</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 9. برنامج السفراء</h2>
                        <p>
                            تتضمن باقات <strong>Emperor</strong> و <strong>Legend</strong> حقوق إعادة البيع المحدودة.
                        </p>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">9.1 العمولات</h3>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                            <p>💰 <strong>Spark:</strong> €498 لكل عملية بيع (50%)</p>
                            <p>💰 <strong>Emperor:</strong> €748 لكل عملية بيع (50%)</p>
                            <p>💰 <strong>Legend:</strong> €1,000 لكل عملية بيع (33%)</p>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">9.2 الالتزامات</h3>
                        <p>كسفير، أنت ملتزم بـ:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>الترويج بطريقة أخلاقية ونزيهة</li>
                            <li>عدم تقديم وعود كاذبة</li>
                            <li>احترام صورة العلامة التجارية ECOMY</li>
                            <li>الامتثال لقوانين الإعلان والتسويق</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 10. المسؤولية</h2>

                        <h3 className="text-xl font-bold text-white mb-2">10.1 التزام الوسائل</h3>
                        <p>
                            ECOMY ملتزمة ببذل أقصى الجهود لتوفير محتوى عالي الجودة.
                            ومع ذلك، <strong>لا يمكننا ضمان نتائج محددة</strong> حيث تعتمد النتائج على تطبيقك للبرنامج.
                        </p>

                        <h3 className="text-xl font-bold text-white mb-2 mt-4">10.2 إخلاء المسؤولية</h3>
                        <p>ECOMY ليست مسؤولة عن:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>الوصول المؤقت غير المتاح للمنصة</li>
                            <li>فقدان البيانات بسبب مشكلة تقنية</li>
                            <li>الأضرار غير المباشرة الناتجة عن استخدام التدريب</li>
                            <li>النزاعات مع عملائك أو أطراف ثالثة</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 11. القوة القاهرة</h2>
                        <p>
                            لا يمكن تحميل ECOMY المسؤولية في حالة القوة القاهرة، بما في ذلك على سبيل المثال لا الحصر:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>الكوارث الطبيعية</li>
                            <li>انقطاع الاتصالات أو الإنترنت</li>
                            <li>الإضرابات</li>
                            <li>الأزمات الصحية</li>
                            <li>أي ظرف خارج عن سيطرتنا المعقولة</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 12. حماية البيانات</h2>
                        <p>
                            نحن ملتزمون بحماية بياناتك الشخصية وفقاً للائحة العامة لحماية البيانات (RGPD).
                        </p>
                        <p className="mt-2">
                            لمزيد من المعلومات، راجع <a href="/legal/privacy" className="text-[#00d2ff] hover:underline">سياسة الخصوصية</a> الخاصة بنا.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 13. تعديل الشروط</h2>
                        <p>
                            تحتفظ ECOMY بالحق في تعديل هذه الشروط العامة في أي وقت.
                        </p>
                        <p className="mt-2">
                            الشروط المعمول بها هي تلك السارية في تاريخ الطلب.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 14. القانون المعمول به</h2>
                        <p>
                            تخضع هذه الشروط العامة للقانون الفرنسي.
                        </p>
                        <p className="mt-4">
                            في حالة نزاع، سنحاول إيجاد حل ودي قبل اللجوء إلى المحاكم المختصة.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">المادة 15. خدمة العملاء</h2>
                        <div className="bg-[#00d2ff]/10 border border-[#00d2ff]/20 rounded-xl p-6">
                            <p className="text-lg mb-4">لأي أسئلة أو مشاكل، اتصل بنا:</p>
                            <ul className="list-none space-y-2">
                                <li><strong>البريد الإلكتروني:</strong> acadmyfrance75@gmail.com</li>
                                <li><strong>وقت الاستجابة:</strong> 24-48 ساعة (أيام العمل)</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <p className="text-sm text-gray-400 text-center">
                            هذه الشروط العامة سارية المفعول اعتباراً من 26 يناير 2026.
                            باستخدام خدماتنا، فإنك توافق على هذه الشروط دون تحفظ.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
