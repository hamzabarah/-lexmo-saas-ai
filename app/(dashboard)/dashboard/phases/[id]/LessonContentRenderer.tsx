"use client";

import React from "react";

/* ─── Styled section helpers ─── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-bold text-[#C5A04E] mt-12 mb-6 pb-3 border-b border-[#C5A04E]/20">{children}</h2>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-bold text-white mt-8 mb-4">{children}</h3>
);

const SubSubTitle = ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-lg font-bold text-[#C5A04E]/80 mt-6 mb-3">{children}</h4>
);

const Paragraph = ({ children }: { children: React.ReactNode }) => (
    <p className="text-gray-300 leading-[1.9] mb-4">{children}</p>
);

const GreenList = ({ items }: { items: string[] }) => (
    <ul className="space-y-2 mb-6">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300 leading-relaxed">
                <span className="text-green-400 mt-1 shrink-0">&#x2714;</span>
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

const RedList = ({ items }: { items: string[] }) => (
    <ul className="space-y-2 mb-6">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300 leading-relaxed">
                <span className="text-red-400 mt-1 shrink-0">&#x2716;</span>
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

const BulletList = ({ items }: { items: string[] }) => (
    <ul className="space-y-2 mb-6">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300 leading-relaxed">
                <span className="text-[#C5A04E] mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#C5A04E]" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

const Divider = () => <hr className="border-[#C5A04E]/10 my-10" />;

const ToolCard = ({ name, price, site, description, features, strategy }: {
    name: string; price: string; site: string; description?: string;
    features: string[]; strategy?: { title: string; items: string[] };
}) => (
    <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h4 className="text-lg font-bold text-white">{name}</h4>
            <div className="flex items-center gap-3 text-sm">
                <span className="text-[#C5A04E] font-bold">{price}</span>
                <span className="text-gray-500">{site}</span>
            </div>
        </div>
        {description && <Paragraph>{description}</Paragraph>}
        <p className="text-sm font-bold text-gray-400 mb-2">المميزات:</p>
        <BulletList items={features} />
        {strategy && (
            <>
                <p className="text-sm font-bold text-gray-400 mb-2">{strategy.title}:</p>
                <BulletList items={strategy.items} />
            </>
        )}
    </div>
);

const StepCard = ({ num, title, items }: { num: number; title: string; items: string[] }) => (
    <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-full bg-[#C5A04E]/20 text-[#C5A04E] font-bold flex items-center justify-center text-sm shrink-0"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{num}</span>
            <h4 className="text-white font-bold">{title}</h4>
        </div>
        <BulletList items={items} />
    </div>
);

/* ─── Main content ─── */
function Phase5ProductResearch() {
    return (
        <div className="p-6 lg:p-8 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
            {/* Hero Title */}
            <h1 className="text-3xl font-bold text-white mb-2">الدليل الكامل للبحث عن المنتج الرابح</h1>
            <p className="text-[#C5A04E] text-lg mb-8">كل ما تحتاج معرفته لإيجاد منتجات رابحة بأدوات مجانية ومدفوعة</p>

            {/* ═══════ Section 1 ═══════ */}
            <SectionTitle>1. ما هو المنتج الرابح؟</SectionTitle>
            <Paragraph>
                المنتج الرابح هو منتج كيحقق مبيعات كبيرة وأرباح عالية في وقت قصير. مش أي منتج كيصلح للدروبشيبينغ، خاص يكون عندو مميزات معينة باش يكون رابح.
            </Paragraph>

            <SubSubTitle>معايير المنتج الرابح:</SubSubTitle>
            <GreenList items={[
                "كيحل مشكلة حقيقية عند الناس",
                'عندو "عامل الواو" (Wow Factor) — يعني كيثير الانتباه من أول نظرة',
                "سعر البيع بين 20€ و 60€ (الهامش المثالي)",
                "صعب يلقاوه في المتاجر العادية",
                "خفيف الوزن وسهل الشحن",
                "ما عندوش مشاكل قانونية",
                "كيقدر يتسوق عبر الفيديو (قابل للتسويق بالمحتوى)",
            ]} />

            <SubSubTitle>ما يجب تجنبه:</SubSubTitle>
            <RedList items={[
                "منتجات ثقيلة أو كبيرة الحجم (تكاليف الشحن عالية)",
                "منتجات إلكترونية معقدة (مشاكل المرتجعات)",
                "منتجات غذائية أو طبية (مشاكل قانونية)",
                "منتجات مشبعة بزاف (الكل كيبيعها)",
                "منتجات بثمن رخيص بزاف (هامش ربح ضعيف)",
            ]} />

            <Divider />

            {/* ═══════ Section 2 ═══════ */}
            <SectionTitle>2. الأدوات المجانية للبحث عن المنتج</SectionTitle>

            {/* TikTok */}
            <SubTitle>أ) TikTok — أقوى أداة مجانية</SubTitle>
            <Paragraph>
                TikTok هو المكان رقم 1 لإيجاد المنتجات الرابحة لأن المنتجات الفيروسية كتبدأ من هنا.
            </Paragraph>
            <SubSubTitle>كيفاش تستعمل TikTok:</SubSubTitle>
            <BulletList items={[
                'ابحث بهاد الكلمات: "TikTok made me buy it", "Amazon finds", "must have", "unboxing"',
                "شوف الفيديوهات اللي عندها ملايين المشاهدات",
                'ركز على المنتجات اللي الناس كتعلق عليها "وين نقدر نشريه؟"',
                "تابع الحسابات اللي كتنشر منتجات جديدة",
                "استعمل الفلتر: آخر 7 أيام أو آخر 30 يوم",
            ]} />
            <SubSubTitle>علامات المنتج الرابح على TikTok:</SubSubTitle>
            <GreenList items={[
                "فيديو عندو +1 مليون مشاهدة",
                'تعليقات فيها "وين نشريه؟" أو "عطيني الرابط"',
                "الفيديو محطوط من أقل من شهر",
            ]} />

            {/* AliExpress */}
            <SubTitle>ب) AliExpress — مصدر المنتجات</SubTitle>
            <Paragraph>AliExpress هو المورد الرئيسي للدروبشيبينغ.</Paragraph>
            <SubSubTitle>كيفاش تستعمل AliExpress:</SubSubTitle>
            <BulletList items={[
                'روح لقسم "Top Selling" أو "Best Sellers"',
                "شوف المنتجات اللي عندها +1000 طلبية",
                "قارن الأسعار بين الموردين",
                "اقرأ التعليقات والتقييمات (4.5 نجوم على الأقل)",
                "شوف صور الزبائن الحقيقية",
            ]} />
            <SubSubTitle>نصائح مهمة:</SubSubTitle>
            <GreenList items={[
                "اختار موردين عندهم تقييم +95%",
                "تأكد من وقت الشحن (أقل من 15 يوم مع ePacket)",
                "اطلب عينة قبل ما تبدأ تبيع",
            ]} />

            {/* Amazon */}
            <SubTitle>ج) Amazon — كنز المنتجات</SubTitle>
            <Paragraph>Amazon Best Sellers هو مصدر ممتاز لإيجاد المنتجات اللي الناس فعلاً كتشريها.</Paragraph>
            <SubSubTitle>كيفاش تستعمل Amazon:</SubSubTitle>
            <BulletList items={[
                "روح لصفحة Amazon Best Sellers",
                "تصفح الأقسام: Home & Kitchen, Beauty, Sports, Electronics",
                'شوف قسم "Movers & Shakers" (المنتجات اللي كتطلع بسرعة)',
                'شوف قسم "New Releases"',
                "لقيتي منتج مثير؟ ابحث عليه في AliExpress بثمن أرخص",
            ]} />

            {/* Facebook Ad Library */}
            <SubTitle>د) Facebook Ad Library — تجسس على المنافسين</SubTitle>
            <Paragraph>Facebook Ad Library كتخليك تشوف كل الإعلانات النشطة على Facebook و Instagram.</Paragraph>
            <SubSubTitle>كيفاش تستعمل Facebook Ad Library:</SubSubTitle>
            <BulletList items={[
                "روح ل facebook.com/ads/library",
                "اختار البلد (France, USA, UK)",
                'اختار "All Ads"',
                'ابحث بكلمات مثل: "50% OFF", "Free Shipping", "Buy Now", "Order Now"',
                "شوف الإعلانات اللي نشطة من أكثر من أسبوعين (يعني رابحة)",
            ]} />
            <SubSubTitle>علامات الإعلان الناجح:</SubSubTitle>
            <GreenList items={[
                "نشط من أكثر من 14 يوم",
                "عندو عدة نسخ (variants) — يعني المعلن كيختبر",
                "فيديو + صور المنتج واضحة",
                "صفحة المتجر احترافية",
            ]} />

            {/* Google Trends */}
            <SubTitle>هـ) Google Trends — تأكد من الطلب</SubTitle>
            <Paragraph>Google Trends كيوريك إذا المنتج عندو طلب متزايد أو لا.</Paragraph>
            <SubSubTitle>كيفاش تستعمل Google Trends:</SubSubTitle>
            <BulletList items={[
                "روح ل trends.google.com",
                "اكتب اسم المنتج بالإنجليزية",
                "شوف إذا المنحنى كيطلع (Trending Up) = منتج جيد",
                "إذا كيهبط = المنتج مشبع",
                "قارن بين عدة منتجات باش تختار الأفضل",
            ]} />

            {/* Pinterest */}
            <SubTitle>و) Pinterest — مصدر منسي</SubTitle>
            <Paragraph>Pinterest فيه منتجات كثيرة كتنتشر قبل ما توصل TikTok.</Paragraph>
            <SubSubTitle>كيفاش تستعمل Pinterest:</SubSubTitle>
            <BulletList items={[
                'ابحث ب: "cool gadgets", "home hacks", "must have products"',
                "شوف البنات (Pins) اللي عندها تفاعل كبير",
                "كثير من المنتجات الرابحة في مجال المنزل والجمال كتبدأ من Pinterest",
            ]} />

            <Divider />

            {/* ═══════ Section 3 ═══════ */}
            <SectionTitle>3. الأدوات المدفوعة للبحث عن المنتج</SectionTitle>

            <ToolCard
                name="أ) Minea — الأفضل للمبتدئين"
                price="من 49€/شهر"
                site="minea.com"
                description="Minea هي أداة كتجمع الإعلانات من Facebook, TikTok, Pinterest وSnapchat في مكان واحد."
                features={[
                    "كتوريك الإعلانات الناجحة مع الأرقام (likes, comments, shares)",
                    "كتقدر تفلتر حسب البلد، المدة، نوع المنتج",
                    "كتوريك المتجر ديال المنافس",
                    "كتوريك المورد على AliExpress",
                    "كتوريك تطور الإعلان مع الوقت",
                ]}
                strategy={{
                    title: "كيفاش تستعمل",
                    items: [
                        "فلتر بالبلد اللي بغيت تبيع فيه",
                        "فلتر بالإعلانات النشطة من +7 أيام",
                        "رتب حسب التفاعل (Engagement)",
                        "شوف المنتجات اللي عندها أعلى تفاعل",
                    ],
                }}
            />

            <ToolCard
                name="ب) Adspy — قاعدة بيانات ضخمة"
                price="149$/شهر"
                site="adspy.com"
                description="Adspy عنده أكبر قاعدة بيانات للإعلانات على Facebook و Instagram."
                features={[
                    "+150 مليون إعلان في قاعدة البيانات",
                    "فلاتر متقدمة بزاف (بالنص، التعليقات، البلد، اللغة)",
                    'كتقدر تبحث في التعليقات (مثلاً "where can I buy")',
                    "كتوريك تاريخ الإعلان ومدة نشاطه",
                ]}
                strategy={{
                    title: "أفضل استراتيجية",
                    items: [
                        'ابحث في التعليقات عن "I need this" أو "Link please"',
                        "فلتر الإعلانات النشطة من +14 يوم",
                        "شوف الإعلانات اللي عندها +1000 تعليق",
                    ],
                }}
            />

            <ToolCard
                name="ج) Ecomhunt — منتجات جاهزة"
                price="29.99$/شهر"
                site="ecomhunt.com"
                description="Ecomhunt كيعطيك منتجات رابحة جاهزة كل يوم مع تحليل كامل."
                features={[
                    "كل يوم منتجات جديدة مقترحة",
                    "تحليل كامل: سعر البيع، سعر الشراء، الهامش",
                    "روابط الموردين جاهزة",
                    "إعلانات نموذجية جاهزة",
                    "تحليل المنافسين",
                ]}
            />

            <ToolCard
                name="د) Sell The Trend — ذكاء اصطناعي"
                price="39.97$/شهر"
                site="sellthetrend.com"
                description="Sell The Trend كيستعمل الذكاء الاصطناعي لإيجاد المنتجات الرابحة."
                features={[
                    '"NEXUS" — محرك بحث ذكي كيحلل ملايين المنتجات',
                    "كيوريك المنتجات اللي كيطلعو (Trending)",
                    "كيعطيك تقدير المبيعات والأرباح",
                    "كيوريك إعلانات المنافسين",
                    "متكامل مع Shopify",
                ]}
            />

            <ToolCard
                name="هـ) Dropship.io — تحليل المتاجر"
                price="29$/شهر"
                site="dropship.io"
                features={[
                    "كيوريك المبيعات المقدرة لأي متجر Shopify",
                    "كيوريك المنتجات الأكثر مبيعاً في أي متجر",
                    "قاعدة بيانات للموردين",
                    "كيوريك تطور المبيعات مع الوقت",
                ]}
            />

            <ToolCard
                name="و) Pipiads — متخصص في TikTok"
                price="77$/شهر"
                site="pipiads.com"
                features={[
                    "أكبر قاعدة بيانات لإعلانات TikTok",
                    "كتوريك الإعلانات الناجحة مع أرقام المشاهدات",
                    "فلاتر حسب البلد، المدة، التفاعل",
                    "كتوريك المنتج والمتجر مباشرة",
                ]}
            />

            <Divider />

            {/* ═══════ Section 4 ═══════ */}
            <SectionTitle>4. طريقة البحث خطوة بخطوة</SectionTitle>

            <StepCard num={1} title="ابدأ بالبحث المجاني (30 دقيقة يومياً)" items={[
                "10 دقائق على TikTok — ابحث عن منتجات فيروسية",
                "10 دقائق على Facebook Ad Library — شوف الإعلانات النشطة",
                "10 دقائق على Amazon Best Sellers — شوف المنتجات اللي كتنباع",
            ]} />

            <StepCard num={2} title="سجل المنتجات المحتملة" items={[
                "حط كل منتج مثير في ملف (Excel أو Google Sheets)",
                "سجل: اسم المنتج، سعر AliExpress، سعر البيع المقترح، رابط المنتج",
            ]} />

            <StepCard num={3} title="تحقق من المعايير" items={[
                "واش كيحل مشكلة؟",
                "واش الهامش فوق 15€؟",
                "واش كيقدر يتسوق بفيديو؟",
                "واش خفيف وسهل الشحن؟",
                "واش Google Trends كيطلع؟",
                "واش ما كاينش منافسة كبيرة بزاف؟",
            ]} />

            <StepCard num={4} title="تحقق من المورد" items={[
                "ابحث على المنتج في AliExpress",
                "اختار مورد عندو +95% تقييم",
                "تأكد من وقت الشحن",
                "اطلب عينة (مهم بزاف!)",
            ]} />

            <StepCard num={5} title="اختبر المنتج" items={[
                "ما تقضيش أسابيع في البحث",
                "اختار 1-3 منتجات واختبرهم بإعلانات صغيرة",
                "المنتج اللي كيجيب مبيعات = واصل عليه",
                "المنتج اللي ما جاب والو = بدلو بسرعة",
            ]} />

            <Divider />

            {/* ═══════ Section 5 ═══════ */}
            <SectionTitle>5. معايير اختيار المنتج النهائي</SectionTitle>
            <Paragraph>جدول التقييم — نقط كل منتج من 10:</Paragraph>

            {/* Styled Table */}
            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20 rounded-tr-lg">المعيار</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الوصف</th>
                            <th className="text-center text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20 rounded-tl-lg">النقطة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { criteria: "حل مشكلة", desc: "واش كيحل مشكلة حقيقية؟", score: "/2" },
                            { criteria: "عامل الواو", desc: "واش كيثير الانتباه؟", score: "/2" },
                            { criteria: "الهامش", desc: "واش الهامش فوق 15€؟", score: "/2" },
                            { criteria: "قابلية التسويق", desc: "واش كيقدر يتسوق بفيديو؟", score: "/2" },
                            { criteria: "المنافسة", desc: "واش المنافسة معقولة؟", score: "/2" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.criteria}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.desc}</td>
                                <td className="text-center text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{row.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SubSubTitle>النتيجة:</SubSubTitle>
            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3">
                    <span className="text-green-400 font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>8-10</span>
                    <span className="text-green-400">نقاط = منتج ممتاز — ابدأ فيه</span>
                </div>
                <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3">
                    <span className="text-yellow-400 font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>6-7</span>
                    <span className="text-yellow-400">نقاط = منتج مقبول — ممكن تختبرو</span>
                </div>
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3">
                    <span className="text-red-400 font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>&lt;6</span>
                    <span className="text-red-400">نقاط = بدل المنتج</span>
                </div>
            </div>

            <Divider />

            {/* ═══════ Section 6 ═══════ */}
            <SectionTitle>6. أخطاء شائعة يجب تجنبها</SectionTitle>

            {[
                { num: 1, title: "البحث بلا ما تبدأ", text: 'كثير من الناس كيقضيو أسابيع كيقلبو على المنتج "المثالي" وما كيبداوش أبداً. الحل: اختار منتج معقول واختبرو.' },
                { num: 2, title: "تقليد المنافسين بالضبط", text: "إذا لقيتي منتج ناجح عند منافس، ما تنسخش نفس الإعلان ونفس المتجر. غير الزاوية التسويقية وكن مبدع." },
                { num: 3, title: "تجاهل جودة المورد", text: "المورد الرخيص ماشي دائماً الأفضل. اختار مورد عندو جودة عالية حتى لو الثمن أغلى شوية." },
                { num: 4, title: "ما طلبتش عينة", text: "دائماً اطلب عينة من المنتج قبل ما تبدأ تبيع. خاص تشوف الجودة بعينيك." },
                { num: 5, title: "الاستسلام بسرعة", text: "المنتج الأول ما غاديش يكون دائماً ناجح. الدروبشيبينغ هو لعبة الاختبار. اختبر، تعلم، وواصل." },
            ].map((err) => (
                <div key={err.num} className="bg-red-500/5 border border-red-500/10 rounded-xl p-5 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-red-400 font-bold">الخطأ {err.num}:</span>
                        <span className="text-white font-bold">{err.title}</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{err.text}</p>
                </div>
            ))}

            <Divider />

            {/* ═══════ Summary ═══════ */}
            <div className="bg-[#C5A04E]/5 border border-[#C5A04E]/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-[#C5A04E] mb-5">ملخص سريع</h2>
                <ol className="space-y-3 mb-6">
                    {[
                        "ابدأ بالأدوات المجانية (TikTok, Amazon, Facebook Ad Library)",
                        "سجل كل منتج مثير في ملف",
                        "طبق معايير الاختيار (حل مشكلة، هامش، قابلية التسويق)",
                        "تحقق من المورد واطلب عينة",
                        "اختبر بسرعة وما تخافش من الفشل",
                        "المنتج الرابح = اختبار + صبر + تحليل",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300 leading-relaxed">
                            <span className="w-7 h-7 rounded-full bg-[#C5A04E]/20 text-[#C5A04E] font-bold flex items-center justify-center text-sm shrink-0 mt-0.5"
                                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{i + 1}</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ol>
                <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20">
                    <p className="text-[#C5A04E] font-bold leading-relaxed">
                        نصيحة ذهبية: المنتج الرابح مش هو اللي كيبان رابح، هو اللي كيبيع فعلاً. الاختبار هو اللي كيفرق بين اللي كيربح واللي كيخسر.
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ─── Phase 11: Shopify Guide ─── */
function Phase11ShopifyGuide() {
    return (
        <div className="p-6 lg:p-8 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
            <h1 className="text-3xl font-bold text-white mb-2">الدليل الكامل لفتح متجر شوبيفاي من الصفر</h1>
            <p className="text-[#C5A04E] text-lg mb-8">كل ما تحتاج معرفته لإنشاء وإطلاق متجرك الإلكتروني على شوبيفاي</p>

            {/* ═══════ Section 1 ═══════ */}
            <SectionTitle>1. شنو هو شوبيفاي ولماذا هو الأفضل</SectionTitle>
            <Paragraph>
                شوبيفاي هو أكبر منصة في العالم لإنشاء المتاجر الإلكترونية. أكثر من مليون متجر كيستعملو شوبيفاي حول العالم.
            </Paragraph>

            <SubSubTitle>علاش شوبيفاي أحسن اختيار:</SubSubTitle>
            <GreenList items={[
                "سهل الاستعمال — ما محتاجش أي خبرة في البرمجة",
                "فيه كل الأدوات اللي محتاج: دفع، شحن، تصميم، تسويق",
                "دعم فني 24/7",
                "آلاف التطبيقات والإضافات",
                "آمن وموثوق — شوبيفاي كيتكلف بالأمان والاستضافة",
                "كيتوافق مع كل بوابات الدفع العالمية",
            ]} />

            <SubSubTitle>شوبيفاي مناسب ل:</SubSubTitle>
            <BulletList items={[
                "الدروبشيبينغ",
                "بيع المنتجات الفيزيائية",
                "بيع المنتجات الرقمية",
                "بيع الخدمات",
                "متاجر البراند الخاصة",
            ]} />

            <Divider />

            {/* ═══════ Section 2 ═══════ */}
            <SectionTitle>2. التسجيل وفتح الحساب</SectionTitle>

            <SubSubTitle>الخطوات:</SubSubTitle>
            <BulletList items={[
                "ادخل على shopify.com",
                'اضغط على "Start free trial"',
                "دخل الإيميل ديالك",
                "اختر كلمة سر قوية",
                "دخل اسم المتجر (تقدر تبدلو من بعد)",
                "جاوب على الأسئلة (نوع المنتج، واش عندك مبيعات...)",
                "دخل العنوان ديالك (مهم للفواتير والضرائب)",
            ]} />

            <SubSubTitle>نصائح مهمة:</SubSubTitle>
            <GreenList items={[
                "استعمل إيميل احترافي (ماشي إيميل شخصي)",
                "اسم المتجر خاصو يكون عندو علاقة بالنيتش ديالك",
                "فترة التجربة المجانية كتكون عادة 3 أيام + شهر بـ $1",
            ]} />

            <Divider />

            {/* ═══════ Section 3 ═══════ */}
            <SectionTitle>3. اختيار الباقة المناسبة</SectionTitle>

            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الباقة</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الثمن/شهر</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">مناسبة ل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { plan: "Basic", price: "$39", desc: "المبتدئين — فيها كل اللي محتاج للبداية" },
                            { plan: "Shopify", price: "$105", desc: "المتاجر اللي بدات كتكبر وكتحتاج تقارير أكثر" },
                            { plan: "Advanced", price: "$399", desc: "المتاجر الكبيرة اللي عندها فريق عمل ومبيعات عالية" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.plan}</td>
                                <td className="text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{row.price}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    النصيحة: ابدأ بالباقة Basic فيها كلشي اللي محتاج.
                </p>
            </div>

            <SubSubTitle>كل الباقات فيها:</SubSubTitle>
            <GreenList items={[
                "منتجات غير محدودة",
                "شهادة SSL مجانية (أمان)",
                "أكواد الخصم",
                "استرداد السلات المتروكة",
                "تقارير أساسية",
            ]} />

            <Divider />

            {/* ═══════ Section 4 ═══════ */}
            <SectionTitle>4. شراء اسم النطاق (Domain)</SectionTitle>
            <Paragraph>
                شنو هو اسم النطاق؟ هو العنوان اللي كيكتبوه العملاء باش يوصلو لمتجرك. مثال: mystore.com
            </Paragraph>

            <SubSubTitle>من فين تشريه؟</SubSubTitle>
            <BulletList items={[
                "من داخل شوبيفاي (الأسهل — كيتربط تلقائياً)",
                "من Namecheap أو GoDaddy (أرخص شوية ولكن خاصك تربطو يدوياً)",
            ]} />

            <SubSubTitle>قواعد اختيار اسم النطاق:</SubSubTitle>
            <GreenList items={[
                "قصير وسهل الحفظ",
                "سهل النطق والكتابة",
                "ما فيهش أرقام ولا رموز (-)",
                "عندو علاقة بالنيتش ديالك",
                "بامتداد .com (الأفضل) أو .store",
            ]} />

            <SubSubTitle>أمثلة مزيانة:</SubSubTitle>
            <GreenList items={[
                "beautyglam.com (نيتش التجميل)",
                "petzone.store (نيتش الحيوانات)",
                "fitgear.com (نيتش الرياضة)",
            ]} />

            <SubSubTitle>أمثلة خايبة:</SubSubTitle>
            <RedList items={[
                "my-best-store-2024-morocco.com (طويل ومعقد)",
                "abc123shop.com (ما عندو معنى)",
            ]} />

            <Divider />

            {/* ═══════ Section 5 ═══════ */}
            <SectionTitle>5. اختيار وتخصيص القالب (Theme)</SectionTitle>

            <SubSubTitle>كيفاش تختار القالب:</SubSubTitle>
            <BulletList items={[
                "ادخل على Online Store > Themes",
                "اختر من القوالب المجانية (Dawn هو الأفضل للمبتدئين)",
                "اضغط Customize باش تبدأ تعدل",
            ]} />

            <SubSubTitle>شنو خاصك تشوف في القالب:</SubSubTitle>
            <GreenList items={[
                "سرعة التحميل (كل ما كان سريع كل ما كان أحسن)",
                "متجاوب مع الهاتف (أغلب العملاء كيشريو من الهاتف)",
                "سهل التخصيص",
                "فيه أقسام كافية (Hero banner, Featured products, Testimonials...)",
            ]} />

            <SubSubTitle>تخصيص القالب:</SubSubTitle>
            <BulletList items={[
                "غير الألوان باش تتوافق مع البراند ديالك",
                "حط الشعار ديالك",
                "عدل الخطوط (Font)",
                "أضف الأقسام اللي محتاج",
                "حط صور احترافية عالية الجودة",
            ]} />

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    نصيحة ذهبية: ما تصرفش وقت كبير في التصميم من البداية. متجر بسيط ونظيف أحسن من متجر معقد. ركز على المنتج والتسويق.
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 6 ═══════ */}
            <SectionTitle>6. تصميم الشعار (Logo)</SectionTitle>

            <SubSubTitle>أدوات مجانية لتصميم الشعار:</SubSubTitle>
            <BulletList items={[
                "Canva (الأسهل — فيه قوالب جاهزة)",
                "أدوات الذكاء الاصطناعي (مثل DALL-E, Midjourney)",
                "Hatchful من شوبيفاي (مولد شعارات مجاني)",
            ]} />

            <SubSubTitle>قواعد الشعار الاحترافي:</SubSubTitle>
            <GreenList items={[
                "بسيط وواضح",
                "كيبان مزيان في حجم صغير (على الهاتف)",
                "ألوان متناسقة مع البراند",
                "ما فيهش تفاصيل كثيرة",
                "كيخدم على خلفية بيضاء وسوداء",
            ]} />

            <Divider />

            {/* ═══════ Section 7 ═══════ */}
            <SectionTitle>7. إعداد صفحة المنتج</SectionTitle>

            <SubSubTitle>العناصر الأساسية:</SubSubTitle>
            <BulletList items={[
                "عنوان المنتج: واضح وجذاب",
                "الصور: على الأقل 5 صور عالية الجودة من زوايا مختلفة",
                "الوصف: كيحكي الفوائد ماشي غير المميزات",
                "الثمن: واضح + ثمن مشطوب إلى كان عندك عرض",
                "المتغيرات: الألوان، الأحجام...",
                "التقييمات: مهمة بزاف لبناء الثقة",
                "زر الشراء: بارز وواضح",
            ]} />

            <SubSubTitle>نصائح لوصف المنتج:</SubSubTitle>
            <GreenList items={[
                "ابدأ بالمشكلة اللي كيحلها المنتج",
                "استعمل نقاط (Bullet points) للمميزات",
                "حط فوائد ماشي مميزات تقنية",
                "أضف شهادات العملاء",
                "حط ضمان أو عرض خاص",
            ]} />

            <Divider />

            {/* ═══════ Section 8 ═══════ */}
            <SectionTitle>8. أنواع المتاجر</SectionTitle>

            <SubTitle>متجر المنتج الواحد (One Product Store)</SubTitle>
            <BulletList items={[
                "مركز على منتج واحد فقط",
                "صفحة بيع قوية ومقنعة",
                "مثالي للمبتدئين",
                "أسهل في التسويق",
            ]} />

            <SubTitle>متجر النيتش (Niche Store)</SubTitle>
            <BulletList items={[
                "متخصص في مجال واحد (مثل التجميل، المطبخ، الحيوانات)",
                "كيبني ثقة لأنه متخصص",
                "تسويق أسهل لأن الجمهور محدد",
                "مثالي للنمو على المدى الطويل",
            ]} />

            <SubTitle>متجر المنتجات العامة (General Store)</SubTitle>
            <BulletList items={[
                "فيه منتجات من نيتشات مختلفة",
                "مرن — تقدر تتيستي بزاف ديال المنتجات",
                "صعب تبني براند قوي",
                "مناسب للتيست في البداية",
            ]} />

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    النصيحة: ابدأ بمتجر منتج واحد أو نيتش. ما تبداش بمتجر عام حتى تفهم كيفاش كيخدم الدروبشيبينغ.
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 9 ═══════ */}
            <SectionTitle>9. إعدادات الدفع</SectionTitle>

            <SubSubTitle>بوابات الدفع الأساسية:</SubSubTitle>
            <BulletList items={[
                "Shopify Payments: الأفضل إلى كان متوفر في بلادك (بلا عمولة إضافية)",
                "PayPal: مهم بزاف — بزاف ديال العملاء كيفضلوه",
                "Stripe: بديل ممتاز لـ Shopify Payments",
                "COD (الدفع عند الاستلام): ضروري للسوق المغربي والعربي",
            ]} />

            <SubSubTitle>كيفاش تفعل طرق الدفع:</SubSubTitle>
            <BulletList items={[
                "ادخل Settings > Payments",
                "اختر البوابة اللي بغيتي",
                "دخل المعلومات المطلوبة",
                "فعل وجرب",
            ]} />

            <SubSubTitle>نصائح:</SubSubTitle>
            <GreenList items={[
                "فعل أكبر عدد ممكن من طرق الدفع",
                "كل طريقة دفع ناقصة = عملاء ضايعين",
                "تأكد أن العملة صحيحة",
            ]} />

            <Divider />

            {/* ═══════ Section 10 ═══════ */}
            <SectionTitle>10. إعدادات الشحن</SectionTitle>

            <SubSubTitle>كيفاش تضبط مناطق الشحن:</SubSubTitle>
            <BulletList items={[
                "ادخل Settings > Shipping and delivery",
                "أنشئ مناطق شحن حسب البلدان اللي كتبيع فيها",
                "حدد ثمن الشحن لكل منطقة",
                "حدد مدة التوصيل المتوقعة",
            ]} />

            <SubSubTitle>استراتيجيات الشحن:</SubSubTitle>
            <BulletList items={[
                "شحن مجاني: زيد الثمن على المنتج وحط شحن مجاني — العملاء كيحبو هادا",
                "شحن بثمن ثابت: نفس الثمن لكل الطلبيات",
                "شحن حسب الوزن أو الثمن: كيتغير حسب الطلبية",
            ]} />

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    {`نصيحة: "شحن مجاني" هو أقوى حافز للشراء. إلى أمكن، دمج ثمن الشحن في ثمن المنتج.`}
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 11 ═══════ */}
            <SectionTitle>11. الضرائب والرسوم</SectionTitle>

            <SubSubTitle>القواعد الأساسية:</SubSubTitle>
            <BulletList items={[
                "شوبيفاي كيحسب الضرائب أوتوماتيكياً حسب البلد",
                "في أمريكا: Sales Tax كتختلف حسب الولاية",
                "في أوروبا: VAT عادة 20%",
                "في المغرب والخليج: حسب القوانين المحلية",
            ]} />

            <SubSubTitle>كيفاش تضبطها:</SubSubTitle>
            <BulletList items={[
                "ادخل Settings > Taxes and duties",
                "شوبيفاي كيقترح عليك الإعدادات حسب الموقع ديالك",
                "تقدر تختار واش الأثمنة شاملة الضريبة ولا بلا ضريبة",
            ]} />

            <Divider />

            {/* ═══════ Section 12 ═══════ */}
            <SectionTitle>12. المستخدمون والصلاحيات</SectionTitle>

            <SubSubTitle>أمتى تحتاج تضيف مستخدمين:</SubSubTitle>
            <BulletList items={[
                "عندك مساعد لخدمة العملاء",
                "عندك شخص كيدير ليك الإعلانات",
                "عندك محاسب",
            ]} />

            <SubSubTitle>كيفاش تحدد الصلاحيات:</SubSubTitle>
            <BulletList items={[
                "مساعد خدمة العملاء → وصول للطلبيات والرسائل فقط",
                "مسوق → وصول للمنتجات والتقارير",
                "محاسب → وصول للتقارير المالية فقط",
                "ما تعطيش وصول كامل لحد غير أنت",
            ]} />

            <Divider />

            {/* ═══════ Section 13 ═══════ */}
            <SectionTitle>13. الإشعارات واللغات</SectionTitle>

            <SubSubTitle>الإشعارات المهمة اللي خاصك تفعلها:</SubSubTitle>
            <GreenList items={[
                "تأكيد الطلبية (Order Confirmation)",
                "تأكيد الشحن (Shipping Confirmation)",
                "تحديث التتبع (Shipping Update)",
                "إيميل السلة المتروكة (Abandoned Cart)",
                "تأكيد الإرجاع (Refund Confirmation)",
            ]} />

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    نصيحة: خصص الإيميلات بالبراند ديالك — الشعار، الألوان. إيميل احترافي كيبني الثقة.
                </p>
            </div>

            <SubSubTitle>اللغات:</SubSubTitle>
            <BulletList items={[
                "تقدر تضيف لغات متعددة (عربي، فرنسي، إنجليزي)",
                "مهم إلى كنت كتبيع في أسواق مختلفة",
            ]} />

            <Divider />

            {/* ═══════ Section 14 ═══════ */}
            <SectionTitle>14. الصفحات القانونية</SectionTitle>

            <SubSubTitle>الصفحات الضرورية:</SubSubTitle>
            <BulletList items={[
                "سياسة الإرجاع (Refund Policy): شروط إرجاع المنتج والمدة المسموحة",
                "سياسة الخصوصية (Privacy Policy): كيفاش كتحمي بيانات العملاء",
                "شروط الاستخدام (Terms of Service): القواعد العامة لاستعمال المتجر",
                "سياسة الشحن (Shipping Policy): مدة التوصيل والأثمنة",
            ]} />

            <SubSubTitle>صفحات إضافية مهمة:</SubSubTitle>
            <BulletList items={[
                "About Us: قصة البراند ديالك",
                "Contact Us: إيميل + فورمولير اتصال + واتساب",
                "FAQ: الأسئلة الشائعة",
            ]} />

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    نصيحة: استعمل مولد السياسات ديال شوبيفاي كنقطة بداية وعدلهم حسب متجرك.
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 15 ═══════ */}
            <SectionTitle>15. تتبع الطلبات</SectionTitle>

            <SubSubTitle>الأساسيات:</SubSubTitle>
            <BulletList items={[
                "فاش كتأكد الطلبية (Fulfill) دخل رقم التتبع",
                "العميل كيتوصل أوتوماتيكياً بإيميل فيه رابط التتبع",
            ]} />

            <SubSubTitle>تطبيقات التتبع:</SubSubTitle>
            <BulletList items={[
                "AfterShip: صفحة تتبع احترافية بالبراند ديالك",
                "17Track: كيدعم أغلب شركات الشحن",
            ]} />

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    نصيحة: صفحة تتبع بالبراند ديالك كتبني الثقة وكتقلل الاستفسارات.
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 16 ═══════ */}
            <SectionTitle>16. الطلبية التجريبية (Test Order)</SectionTitle>
            <Paragraph>قبل ما تطلق متجرك، دير طلبية تجريبية:</Paragraph>

            <StepCard num={1} title="تفعيل وضع الاختبار" items={[
                "فعل Bogus Gateway في إعدادات الدفع",
            ]} />
            <StepCard num={2} title="دير طلبية كعميل عادي" items={[
                "اختار منتج وأضفو للسلة",
                "أكمل عملية الدفع بالكامل",
            ]} />
            <StepCard num={3} title="تأكد من كلشي" items={[
                "صفحة المنتج كتبان مزيان",
                "عملية الدفع سهلة",
                "إيميل التأكيد وصل",
                "التتبع خدام",
                "الموقع سريع على الهاتف",
            ]} />
            <StepCard num={4} title="رجع الإعدادات" items={[
                "أطفئ Bogus Gateway ورجع البوابة الحقيقية",
            ]} />

            <Divider />

            {/* ═══════ Section 17 — Final Checklist ═══════ */}
            <SectionTitle>17. Checklist النهائي قبل الإطلاق</SectionTitle>

            <div className="space-y-3 mb-8">
                {[
                    "الحساب مفعل والباقة مختارة",
                    "اسم النطاق مشرى ومربوط",
                    "القالب مخصص واحترافي",
                    "الشعار موجود",
                    "المنتجات مضافة (صور + وصف + أثمنة)",
                    "طرق الدفع مفعلة",
                    "مناطق الشحن مضبوطة",
                    "الضرائب مضبوطة",
                    "الصفحات القانونية موجودة (Refund, Privacy, Terms, Shipping)",
                    "صفحة About Us و Contact Us جاهزة",
                    "الإشعارات مفعلة",
                    "تتبع الطلبات جاهز",
                    "الطلبية التجريبية ناجحة",
                    "الموقع سريع وكيخدم مزيان على الهاتف",
                    "الميزانية للإعلانات جاهزة",
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl px-5 py-3">
                        <span className="text-[#C5A04E] shrink-0">&#x2610;</span>
                        <span className="text-gray-300">{item}</span>
                    </div>
                ))}
            </div>

            <Divider />

            {/* ═══════ Summary ═══════ */}
            <div className="bg-[#C5A04E]/5 border border-[#C5A04E]/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-[#C5A04E] mb-5">الخلاصة</h2>
                <Paragraph>
                    فتح متجر على شوبيفاي بسيط إلى مشيتي خطوة بخطوة. ما تحاولش تدير كلشي في يوم واحد. ابدأ بالأساسيات وتطور مع الوقت. المهم تبدا!
                </Paragraph>
                <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20">
                    <p className="text-[#C5A04E] font-bold leading-relaxed text-center">
                        © Lexmo Academy 2026 — جميع الحقوق محفوظة
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ─── Phase 12: Import Product ─── */
function Phase12ImportProduct() {
    return (
        <div className="p-6 lg:p-8 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
            <h1 className="text-3xl font-bold text-white mb-2">من AliExpress إلى متجرك — استيراد المنتج وتعديله خطوة بخطوة</h1>
            <p className="text-[#C5A04E] text-lg mb-8">كل ما تحتاج معرفته لاستيراد المنتجات وتعديلها باحترافية</p>

            {/* ═══════ Section 1 ═══════ */}
            <SectionTitle>1. تجهيز المتجر لاستقبال المنتجات</SectionTitle>
            <Paragraph>قبل ما تبدأ تستورد، تأكد من هاد الحاجات:</Paragraph>

            <div className="space-y-3 mb-6">
                {[
                    "المتجر مفتوح وخدام",
                    "الباقة مفعلة (ولو Basic)",
                    "اسم النطاق مربوط",
                    "طرق الدفع مفعلة",
                    "مناطق الشحن مضبوطة",
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl px-5 py-3">
                        <span className="text-[#C5A04E] shrink-0">&#x2610;</span>
                        <span className="text-gray-300">{item}</span>
                    </div>
                ))}
            </div>

            <SubSubTitle>الخطوات:</SubSubTitle>
            <BulletList items={[
                "ادخل لمتجرك على shopify.com",
                "تأكد أنك في لوحة التحكم (Dashboard)",
                "في القائمة اليسرى، اضغط على Products",
                "غادي تلقى الصفحة فارغة — هذا عادي، دابا غادي نضيفو المنتجات",
            ]} />

            <Divider />

            {/* ═══════ Section 2 ═══════ */}
            <SectionTitle>2. تثبيت تطبيق DSers (الاستيراد الأوتوماتيكي)</SectionTitle>
            <Paragraph>
                شنو هو DSers؟ هو تطبيق مجاني كيربط متجرك شوبيفاي مع AliExpress. كيخليك تستورد المنتجات بضغطة زر وكيدير الطلبيات أوتوماتيكياً.
            </Paragraph>

            <SubSubTitle>خطوات التثبيت:</SubSubTitle>
            <StepCard num={1} title="فتح App Store" items={[
                "في لوحة تحكم شوبيفاي، اضغط على Apps في القائمة اليسرى",
                "اضغط على Shopify App Store (كيفتح في صفحة جديدة)",
            ]} />
            <StepCard num={2} title="البحث والتثبيت" items={[
                "في خانة البحث، كتب: DSers",
                "غادي يبان ليك DSers‑AliExpress Dropshipping — اضغط عليه",
                "اضغط على الزر Add app (أخضر)",
                "غادي يرجعك للمتجر ديالك — اضغط Install app",
            ]} />
            <StepCard num={3} title="التسجيل والربط" items={[
                "غادي يطلب منك تسجل حساب DSers: اضغط Sign up with Shopify (الأسهل)",
                "بعد التسجيل، غادي يطلب منك تربط حساب AliExpress: اضغط Link AliExpress Account",
                "سجل دخول بحساب AliExpress ديالك (إلى ما عندكش حساب، أنشئ واحد مجاني على aliexpress.com)",
                "اضغط Authorize باش تأكد الربط",
            ]} />

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3 mb-6">
                <span className="text-green-400 font-bold">مبروك! DSers مثبت ومربوط</span>
            </div>

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    ملاحظة مهمة: DSers مجاني حتى 3000 منتج. الباقة المجانية كافية تماماً للبداية.
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 3 ═══════ */}
            <SectionTitle>3. البحث عن المنتج على AliExpress</SectionTitle>

            <SubTitle>الطريقة 1: البحث من داخل DSers (الأسهل)</SubTitle>
            <BulletList items={[
                "في لوحة تحكم DSers، اضغط على Find Suppliers في القائمة العلوية",
                'في خانة البحث، كتب اسم المنتج بالإنجليزية (مثال: "kitchen vegetable cutter")',
                "غادي تظهر ليك قائمة بالمنتجات",
            ]} />
            <SubSubTitle>قلب على المنتج اللي عندو:</SubSubTitle>
            <GreenList items={[
                "تقييم 4.5 أو أكثر",
                "أكثر من 1000 طلبية",
                "شحن ePacket متوفر",
            ]} />

            <SubTitle>الطريقة 2: البحث على موقع AliExpress + استيراد بالإضافة</SubTitle>
            <BulletList items={[
                "افتح aliexpress.com في تبويب جديد",
                "قلب على المنتج اللي بغيتي",
                "فاش تلقاه، انسخ رابط المنتج (URL) من شريط العنوان",
                "ارجع ل DSers",
                "اضغط على Import from AliExpress URL",
                "لصق الرابط واضغط Search",
            ]} />

            <SubSubTitle>نصائح البحث:</SubSubTitle>
            <GreenList items={[
                "قلب بالإنجليزية دائماً (النتائج أكثر)",
                "استعمل كلمات مفتاحية دقيقة",
                'فلتر بـ "Orders" باش تشوف الأكثر مبيعاً أولاً',
                "شوف التقييمات بالصور من العملاء الحقيقيين",
            ]} />

            <Divider />

            {/* ═══════ Section 4 ═══════ */}
            <SectionTitle>4. استيراد المنتج لمتجرك</SectionTitle>

            <SubSubTitle>الخطوات بالتفصيل:</SubSubTitle>
            <BulletList items={[
                "فاش تلقى المنتج المناسب في DSers، اضغط على Add to Import List (زر برتقالي)",
                "غادي يتحول المنتج ل Import List (قائمة الاستيراد)",
                "اضغط على Import List في القائمة العلوية ديال DSers",
                "غادي تلقى المنتج كيتسنى — هنا غادي تعدل عليه قبل ما تنشرو",
                "اضغط على المنتج باش تفتح صفحة التعديل",
            ]} />

            <SubSubTitle>غادي تشوف 4 تبويبات:</SubSubTitle>
            <BulletList items={[
                "Product (العنوان والوصف)",
                "Variants (المتغيرات والأثمنة)",
                "Images (الصور)",
                "Shipping (الشحن)",
            ]} />

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 mb-6">
                <p className="text-red-400 font-bold leading-relaxed">
                    {`مهم جداً: ما تضغطش على "Push to Shopify" دابا! عدل أولاً كلشي ثم انشر.`}
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 5 ═══════ */}
            <SectionTitle>5. تعديل عنوان المنتج</SectionTitle>
            <Paragraph>
                القاعدة الذهبية: العنوان ديال AliExpress ديما طويل ومعقد وفيه كلمات مفتاح للسيو ديالهم. خاصك تبدلو بعنوان قصير وجذاب.
            </Paragraph>

            <SubSubTitle>مثال:</SubSubTitle>
            <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-5 py-3">
                    <span className="text-red-400 font-bold shrink-0">عنوان AliExpress:</span>
                    <span className="text-gray-400">{`"2024 New Arrival Kitchen Vegetable Cutter Slicer Multi-Function Food Chopper Manual Mandoline Slicer with Container"`}</span>
                </div>
                <div className="flex items-start gap-3 bg-green-500/5 border border-green-500/10 rounded-xl px-5 py-3">
                    <span className="text-green-400 font-bold shrink-0">عنوانك:</span>
                    <span className="text-gray-300">{`"قاطع الخضروات الذكي — حضر أي وجبة في دقائق"`}</span>
                </div>
            </div>

            <SubSubTitle>خطوات التعديل:</SubSubTitle>
            <BulletList items={[
                "في تبويب Product، غادي تلقى خانة Title",
                "امسح العنوان القديم كامل",
                "اكتب عنوان جديد: قصير (5-10 كلمات)، فيه الفائدة الرئيسية، بالعربية إلى كنت كتبيع في سوق عربي",
            ]} />

            <SubSubTitle>صيغ عناوين ناجحة:</SubSubTitle>
            <GreenList items={[
                "[اسم المنتج] — [الفائدة الرئيسية]",
                '[الفائدة] + [لمن] (مثال: "بشرة صافية بلا مجهود — كريم طبيعي 100%")',
                '[الحل] + [المشكلة] (مثال: "ودع آلام الظهر — مصحح وضعية الجسم")',
            ]} />

            <Divider />

            {/* ═══════ Section 6 ═══════ */}
            <SectionTitle>6. كتابة وصف يبيع</SectionTitle>
            <Paragraph>
                امسح الوصف ديال AliExpress نهائياً. دائماً كيكون ضعيف ومترجم ترجمة آلية.
            </Paragraph>

            <SubSubTitle>هيكل الوصف المثالي:</SubSubTitle>

            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <h4 className="text-white font-bold mb-2">الجزء 1 — المشكلة (2-3 أسطر)</h4>
                <Paragraph>ابدأ بالمشكلة اللي كيعاني منها العميل.</Paragraph>
                <div className="bg-[#0A0A0A] rounded-lg p-3 border border-[#C5A04E]/5">
                    <p className="text-gray-400 italic">{`مثال: "عياتي وأنت كتقطع الخضرة بالسكين العادي؟ كتاخذ 30 دقيقة باش تحضر سالطة وحدة؟"`}</p>
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <h4 className="text-white font-bold mb-2">الجزء 2 — الحل = منتجك (2-3 أسطر)</h4>
                <Paragraph>قدم المنتج كحل للمشكلة.</Paragraph>
                <div className="bg-[#0A0A0A] rounded-lg p-3 border border-[#C5A04E]/5">
                    <p className="text-gray-400 italic">{`مثال: "قاطع الخضروات الذكي غادي يخليك تحضر أي وجبة في أقل من 5 دقائق — بلا مجهود وبلا خطر الجروح."`}</p>
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <h4 className="text-white font-bold mb-2">الجزء 3 — المميزات كفوائد</h4>
                <GreenList items={[
                    "كيقطع الخضرة في ثواني — وفر 25 دقيقة كل يوم",
                    "7 أشكال قطع مختلفة — تنوع في الطبخ بلا أدوات إضافية",
                    "آمن 100% — حماية للأصابع مدمجة",
                    "سهل التنظيف — كيتغسل في ثواني",
                    "حجم صغير — ما كياخذش بلاصة في المطبخ",
                ]} />
            </div>

            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <h4 className="text-white font-bold mb-2">الجزء 4 — الدليل الاجتماعي</h4>
                <div className="bg-[#0A0A0A] rounded-lg p-3 border border-[#C5A04E]/5">
                    <p className="text-gray-400 italic">{`"أكثر من 10,000 عميل سعيد حول العالم"`}</p>
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <h4 className="text-white font-bold mb-2">الجزء 5 — العرض + Call to Action</h4>
                <div className="bg-[#0A0A0A] rounded-lg p-3 border border-[#C5A04E]/5 space-y-2">
                    <p className="text-gray-400 italic">{`"🎁 عرض خاص لمدة محدودة — اطلب دابا واستفد من الشحن المجاني!"`}</p>
                    <p className="text-gray-400 italic">{`"⚠️ الكمية محدودة — اضغط على أضف إلى السلة دابا"`}</p>
                </div>
            </div>

            <Divider />

            {/* ═══════ Section 7 ═══════ */}
            <SectionTitle>7. تعديل الصور</SectionTitle>
            <Paragraph>
                القاعدة: صور AliExpress فيها كتابة صينية وعلامات مائية. خاصك تعدلها أو تبدلها.
            </Paragraph>

            <SubSubTitle>خطوات التعديل:</SubSubTitle>
            <Paragraph>في تبويب Images في DSers، غادي تشوف كل صور المنتج.</Paragraph>

            <SubSubTitle>احذف الصور اللي فيها:</SubSubTitle>
            <RedList items={[
                "كتابة صينية",
                "علامات مائية",
                "جودة رديئة",
                "خلفية خايبة",
            ]} />

            <SubSubTitle>خلي الصور اللي:</SubSubTitle>
            <GreenList items={[
                "واضحة وعالية الجودة",
                "كتوري المنتج من زوايا مختلفة",
                "كتوري المنتج في الاستعمال",
            ]} />

            <SubSubTitle>الترتيب المثالي للصور:</SubSubTitle>
            <StepCard num={1} title="الصورة الرئيسية" items={["المنتج على خلفية بيضاء"]} />
            <StepCard num={2} title="صورة الاستعمال" items={["شخص كيستعمل المنتج"]} />
            <StepCard num={3} title="زاوية أخرى" items={["المنتج من زاوية مختلفة"]} />
            <StepCard num={4} title="التفاصيل" items={["صورة قريبة للتفاصيل"]} />
            <StepCard num={5} title="Infographic" items={["المميزات مكتوبة على الصورة"]} />
            <StepCard num={6} title="الحجم" items={["مقارنة مع يد أو شيء معروف"]} />

            <SubSubTitle>أدوات تعديل الصور:</SubSubTitle>
            <BulletList items={[
                "Canva (مجاني): حذف الخلفية، إضافة نصوص، تصميم Infographic",
                "Remove.bg (مجاني): حذف الخلفية أوتوماتيكياً",
            ]} />

            <Divider />

            {/* ═══════ Section 8 ═══════ */}
            <SectionTitle>8. التسعير الصحيح</SectionTitle>

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    القاعدة الذهبية: ثمن البيع = ثمن الشراء × 2.5 إلى × 4 (على الأقل)
                </p>
            </div>

            <SubSubTitle>مثال عملي:</SubSubTitle>
            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <tbody>
                        {[
                            { label: "ثمن المنتج على AliExpress", value: "$5" },
                            { label: "ثمن الشحن من المورد", value: "$2" },
                            { label: "التكلفة الإجمالية", value: "$7" },
                            { label: "ثمن البيع المقترح", value: "$24.99 (هامش 3.5x)" },
                            { label: "مصاريف الإعلان المتوقعة", value: "$7-10 لكل بيعة" },
                            { label: "الربح الصافي", value: "≈ $10 لكل بيعة" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.label}</td>
                                <td className="text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SubSubTitle>خطوات تعديل الثمن:</SubSubTitle>
            <BulletList items={[
                "في تبويب Variants في DSers",
                "في خانة Price، حط ثمن البيع ديالك",
                "في خانة Compare at price، حط ثمن أعلى (الثمن القديم المشطوب) — هذا كيعطي إحساس بالخصم",
                "مثال: Price = $24.99 / Compare at = $49.99",
            ]} />

            <SubSubTitle>استراتيجيات التسعير:</SubSubTitle>
            <GreenList items={[
                "الأثمنة النفسية: $24.99 بدل $25 / $19.97 بدل $20",
                'ثمن مشطوب: دائماً حط "Compare at price" أعلى من الثمن الحقيقي',
                'Bundle (حزمة): "اشتري 2 واحصل على خصم 20%"',
                "شحن مجاني: زيد $5-10 على الثمن وحط شحن مجاني",
            ]} />

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    نصيحة: شوف بشحال المنافسين كيبيعو نفس المنتج. ما تكونش أغلى بزاف ولا أرخص بزاف.
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 9 ═══════ */}
            <SectionTitle>9. إضافة المتغيرات (ألوان، أحجام)</SectionTitle>

            <SubSubTitle>الخطوات:</SubSubTitle>
            <BulletList items={[
                "في تبويب Variants في DSers",
                "احذف المتغيرات اللي ما بغيتيش تبيعها (ألوان ما عندهاش طلب، أحجام ما كاينينش في السوق ديالك)",
                'عدل أسماء المتغيرات: بدل "Black" ب "أسود" (إلى كنت كتبيع بالعربية)',
            ]} />

            <SubSubTitle>مثال:</SubSubTitle>
            <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-5 py-3">
                    <span className="text-red-400 font-bold shrink-0">AliExpress:</span>
                    <span className="text-gray-400">{`"Option A / Option B / Option C"`}</span>
                </div>
                <div className="flex items-start gap-3 bg-green-500/5 border border-green-500/10 rounded-xl px-5 py-3">
                    <span className="text-green-400 font-bold shrink-0">متجرك:</span>
                    <span className="text-gray-300">{`"أسود / أبيض / أزرق" أو "S / M / L / XL"`}</span>
                </div>
            </div>

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    نصيحة: ما تخليش بزاف ديال المتغيرات. 3-5 ألوان و 4-5 أحجام كافي. الاختيارات الكثيرة كتشتت العميل.
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 10 ═══════ */}
            <SectionTitle>10. إعدادات الشحن للمنتج</SectionTitle>

            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">طريقة الشحن</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">المدة</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الثمن</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">مناسبة ل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { method: "AliExpress Standard", time: "15-25 يوم", price: "رخيص", fit: "أغلب الأسواق" },
                            { method: "ePacket", time: "10-20 يوم", price: "معقول", fit: "أمريكا وأوروبا" },
                            { method: "FedEx/DHL", time: "5-10 أيام", price: "غالي", fit: "العملاء اللي بغاو سرعة" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.method}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{row.time}</td>
                                <td className="text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10">{row.price}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.fit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    نصيحة مهمة: دائماً اختار طريقة شحن عندها رقم تتبع (Tracking number). العملاء كيبغيو يتبعو الطلبية ديالهم.
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 11 ═══════ */}
            <SectionTitle>11. نشر المنتج</SectionTitle>

            <SubSubTitle>الخطوة الأخيرة — راجع كلشي:</SubSubTitle>
            <GreenList items={[
                "العنوان مزيان وجذاب",
                "الوصف مكتوب باحترافية",
                "الصور نظيفة ومرتبة",
                "الأثمنة مضبوطة",
                "المتغيرات معدلة",
                "الشحن مختار",
            ]} />

            <SubSubTitle>النشر:</SubSubTitle>
            <BulletList items={[
                "اضغط على Push to Shopify (الزر الأزرق الكبير)",
                "اختر Collection اللي بغيتي تحط فيها المنتج",
                "اضغط Push",
            ]} />

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3 mb-6">
                <span className="text-green-400 font-bold">المنتج تنشر في متجرك!</span>
            </div>

            <SubSubTitle>بعد النشر:</SubSubTitle>
            <BulletList items={[
                "ارجع لشوبيفاي > Products",
                "اضغط على المنتج باش تشوف كيف باين",
                "اضغط Preview باش تشوف الصفحة كما غادي يشوفها العميل",
                "تأكد أن كلشي باين مزيان على الهاتف والكمبيوتر",
            ]} />

            <Divider />

            {/* ═══════ Section 12 — Checklist ═══════ */}
            <SectionTitle>12. Checklist قبل ما تنشر</SectionTitle>

            <div className="space-y-3 mb-8">
                {[
                    "العنوان قصير وجذاب (ماشي عنوان AliExpress)",
                    "الوصف مكتوب بأسلوبك (ماشي نسخ من AliExpress)",
                    "الوصف فيه: المشكلة + الحل + المميزات + العرض",
                    "على الأقل 5 صور عالية الجودة",
                    "ما كاينش كتابة صينية أو علامات مائية في الصور",
                    "الصورة الرئيسية هي الأحسن",
                    "الثمن مناسب (2.5x إلى 4x من تكلفة الشراء)",
                    "ثمن مشطوب موجود (Compare at price)",
                    "المتغيرات معدلة (أسماء واضحة)",
                    "طريقة الشحن مختارة (مع رقم تتبع)",
                    "المنتج في Collection مناسبة",
                    "الصفحة كتبان مزيان على الهاتف",
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl px-5 py-3">
                        <span className="text-[#C5A04E] shrink-0">&#x2610;</span>
                        <span className="text-gray-300">{item}</span>
                    </div>
                ))}
            </div>

            <Divider />

            {/* ═══════ Summary ═══════ */}
            <div className="bg-[#C5A04E]/5 border border-[#C5A04E]/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-[#C5A04E] mb-5">الخلاصة</h2>
                <Paragraph>
                    الاستيراد من AliExpress سهل مع DSers، ولكن السر هو التعديل. ما تنشرش المنتج كما هو من AliExpress أبداً. خذ وقتك في تعديل العنوان، الوصف، الصور، والأثمنة. هذا هو الفرق بين متجر كيبيع ومتجر كيفشل.
                </Paragraph>
                <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20">
                    <p className="text-[#C5A04E] font-bold leading-relaxed text-center">
                        © Lexmo Academy 2026 — جميع الحقوق محفوظة
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ─── Phase 13: Store Design ─── */
function Phase13StoreDesign() {
    return (
        <div className="p-6 lg:p-8 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
            <h1 className="text-3xl font-bold text-white mb-2">الدليل الكامل — تعديل المتجر وتصميم الصور</h1>
            <p className="text-[#C5A04E] text-lg mb-8">كل ما تحتاج معرفته لتخصيص متجرك وتصميم صور احترافية</p>

            {/* ═══════ Section 1 ═══════ */}
            <SectionTitle>1. إعداد الثيم (Theme Settings)</SectionTitle>

            <SubTitle>الدخول للمحرر</SubTitle>
            <BulletList items={[
                "ادخل للوحة التحكم admin.shopify.com",
                "اضغط Online Store > Themes",
                "اضغط Customize على القالب النشط",
                "اضغط على Theme settings أسفل القائمة اليسرى",
            ]} />

            <SubTitle>الألوان (Colors)</SubTitle>
            <Paragraph>اضغط على Colors وعدل الألوان التالية:</Paragraph>

            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">العنصر</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الوصف</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">النصيحة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { el: "Primary color", desc: "اللون الرئيسي (الأزرار والروابط)", tip: "اختر لون قوي يمثل البراند ديالك" },
                            { el: "Secondary color", desc: "اللون الثانوي", tip: "مكمل للون الرئيسي" },
                            { el: "Background", desc: "خلفية الصفحات", tip: "أبيض أو فاتح جداً" },
                            { el: "Text color", desc: "لون النصوص", tip: "أسود أو رمادي غامق (#333333)" },
                            { el: "Sale badge", desc: "علامة التخفيض", tip: "أحمر (#E95460)" },
                            { el: "Buttons", desc: "لون الأزرار", tip: "لون بارز (أخضر / برتقالي / أحمر)" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.el}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.desc}</td>
                                <td className="text-gray-300 py-3 px-4 border border-[#C5A04E]/10">{row.tip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    نصيحة: استعمل coolors.co باش تختار ألوان متناسقة.
                </p>
            </div>

            <SubTitle>الخطوط (Typography)</SubTitle>
            <BulletList items={[
                "اضغط على Typography",
                "Headings font: خط العناوين — اختر خط واضح وقوي",
                "Body font: خط النصوص — اختر خط سهل القراءة",
                "للمتاجر بالعربية: تأكد أن الخط كيدعم العربية (خطوط مقترحة: Cairo / Tajawal / IBM Plex Sans Arabic)",
                "Font size: خلي Body بـ 16px (مريح للقراءة)",
            ]} />

            <SubTitle>الشعار (Logo)</SubTitle>
            <BulletList items={[
                "اضغط على Logo",
                "اضغط Select image وحمل الشعار ديالك",
                "Logo width: عادة بين 120 و 200 بيكسل",
            ]} />
            <SubSubTitle>Favicon (الأيقونة الصغيرة):</SubSubTitle>
            <BulletList items={[
                "الحجم 32 × 32 بيكسل",
                "صيغة PNG بخلفية شفافة",
            ]} />

            <SubTitle>إعدادات السلة (Cart)</SubTitle>
            <BulletList items={[
                "اضغط على Cart",
                "Cart type: اختر Drawer (سلة جانبية — أحسن لتجربة المستخدم)",
                "فعل Enable cart note باش العميل يقدر يكتب ملاحظة",
            ]} />

            <SubTitle>إعدادات السوشل ميديا</SubTitle>
            <BulletList items={[
                "اضغط على Social media",
                "حط روابط حساباتك: Instagram, Facebook, TikTok, Twitter/X",
            ]} />

            <Divider />

            {/* ═══════ Section 2 ═══════ */}
            <SectionTitle>2. إنشاء الهيدر (Header)</SectionTitle>
            <Paragraph>الهيدر هو الشريط العلوي اللي كيبان في كل صفحة.</Paragraph>

            <SubTitle>تعديل الهيدر في المحرر</SubTitle>
            <BulletList items={[
                "في Theme Editor، اضغط على قسم Header فوق القائمة اليسرى",
            ]} />

            <SubSubTitle>الشعار:</SubSubTitle>
            <BulletList items={[
                "تأكد أن الشعار محمل (من Theme Settings)",
                "Logo position: اختر Middle center أو Top left حسب التفضيل",
            ]} />

            <SubSubTitle>القائمة الرئيسية (Main Menu):</SubSubTitle>
            <BulletList items={[
                "Menu: اختر Main menu",
                "إلى ما عندكش قائمة، أنشئها: ارجع للوحة التحكم > Online Store > Navigation > Add menu",
                'سميها "Main menu" وأضف الروابط:',
            ]} />
            <GreenList items={[
                "الرئيسية (Home page)",
                "المتجر (All products)",
                "من نحن (About Us)",
                "اتصل بنا (Contact Us)",
            ]} />

            <SubSubTitle>شريط الإعلان (Announcement Bar):</SubSubTitle>
            <BulletList items={[
                "فوق الهيدر، اضغط على Announcement bar وفعلو",
                'اكتب عرض جذاب — مثال: "شحن مجاني لجميع الطلبيات — لمدة محدودة!"',
                "اختر لون خلفية بارز وحط رابط إلى صفحة المنتج أو المجموعة",
            ]} />

            <SubSubTitle>عناصر إضافية في الهيدر:</SubSubTitle>
            <GreenList items={[
                "Enable search: فعل البحث",
                "Enable cart icon: فعل أيقونة السلة",
                "Sticky header: فعل هذا الخيار باش الهيدر يبقى ثابت فاش العميل كينزل في الصفحة (مهم بزاف)",
            ]} />

            <Divider />

            {/* ═══════ Section 3 ═══════ */}
            <SectionTitle>3. إنشاء الفوتر (Footer)</SectionTitle>
            <Paragraph>الفوتر هو الشريط السفلي اللي كيبان في كل صفحة.</Paragraph>

            <SubSubTitle>إضافة القائمة السريعة:</SubSubTitle>
            <BulletList items={[
                "اضغط Add block > Menu واختر Footer menu",
                "أضف الروابط:",
            ]} />
            <BulletList items={[
                "سياسة الإرجاع (Refund policy)",
                "سياسة الخصوصية (Privacy policy)",
                "شروط الاستخدام (Terms of service)",
                "سياسة الشحن (Shipping policy)",
                "اتصل بنا (Contact)",
            ]} />

            <SubSubTitle>إضافة نص عن المتجر:</SubSubTitle>
            <BulletList items={[
                "اضغط Add block > Rich text",
                "في Heading اكتب اسم البراند ديالك",
                "في Text اكتب وصف قصير عن المتجر",
            ]} />

            <SubSubTitle>إضافة النشرة البريدية (Newsletter):</SubSubTitle>
            <BulletList items={[
                "اضغط Add block > Email signup",
                'Heading: "اشترك في النشرة البريدية"',
                'Subtext: "توصل بالعروض الحصرية والمنتجات الجديدة"',
            ]} />

            <SubSubTitle>أيقونات الدفع:</SubSubTitle>
            <GreenList items={[
                "فعل Show payment icons — غادي تبان أيقونات Visa / Mastercard / PayPal أوتوماتيكياً",
            ]} />

            <Divider />

            {/* ═══════ Section 4 ═══════ */}
            <SectionTitle>4. تخصيص الصفحة الرئيسية (Home Page)</SectionTitle>

            <SubTitle>القسم 1: البانر الرئيسي (Image Banner)</SubTitle>
            <BulletList items={[
                "اضغط على Image banner أو أضفو: Add section > Image banner",
                "حمل البانر: الحجم المثالي 1920 × 800 بيكسل",
                'Heading: العنوان الرئيسي (مثال: "احصل على بشرة صافية في 7 أيام")',
                'Subheading: النص الفرعي (مثال: "منتج طبيعي 100% — شحن مجاني")',
                'Button label: نص الزر (مثال: "تسوق الآن")',
                "Banner height: اختر Medium أو Large",
                "Show overlay: فعلو إلى كانت الصورة فاتحة باش النص يكون مقروء",
            ]} />

            <SubTitle>القسم 2: المنتجات المميزة (Featured Collection)</SubTitle>
            <BulletList items={[
                "اضغط Add section > Featured collection",
                'Heading: "منتجاتنا الأكثر مبيعاً"',
                "Maximum products to show: 4 أو 6 أو 8",
                'فعل Enable "View all" button',
            ]} />

            <SubTitle>القسم 3: صورة مع نص (Image with Text)</SubTitle>
            <BulletList items={[
                "اضغط Add section > Image with text",
                "حمل صورة المنتج في الاستعمال (Lifestyle)",
                'Heading: "علاش هذا المنتج مختلف؟"',
                "Text: اكتب 3-4 أسطر عن المنتج والفوائد ديالو",
            ]} />

            <SubTitle>القسم 4: المميزات (Multicolumn)</SubTitle>
            <BulletList items={[
                "اضغط Add section > Multicolumn",
                'Heading: "لماذا تختارنا"',
                "أضف 4 أعمدة:",
            ]} />

            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-center text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">العمود</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">العنوان</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">النص</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { icon: "🚚", title: "شحن مجاني", text: "توصيل مجاني لجميع الطلبيات" },
                            { icon: "✅", title: "ضمان 30 يوم", text: "إلى ما عجبكش المنتج نردو ليك فلوسك" },
                            { icon: "🔒", title: "دفع آمن", text: "معلوماتك محمية بتشفير عالي" },
                            { icon: "💬", title: "خدمة عملاء", text: "فريق متوفر للإجابة على أسئلتك" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-center py-3 px-4 border border-[#C5A04E]/10 text-2xl">{row.icon}</td>
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.title}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.text}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SubTitle>القسم 5: شهادات العملاء (Testimonials)</SubTitle>
            <BulletList items={[
                "اضغط Add section > Multicolumn",
                'Heading: "آراء عملائنا"',
                "أضف 3 شهادات مع أسماء وتقييمات",
            ]} />

            <SubTitle>القسم 6: دعوة للشراء (CTA)</SubTitle>
            <BulletList items={[
                "اضغط Add section > Rich text",
                'Heading: "عرض محدود — ما تضيع الفرصة"',
                'Text: "اطلب الآن واستفد من الشحن المجاني + خصم 20%"',
                'Button label: "اطلب الآن"',
            ]} />

            <SubSubTitle>الترتيب النهائي للصفحة الرئيسية (من فوق لتحت):</SubSubTitle>
            <div className="space-y-2 mb-6">
                {[
                    "Announcement Bar",
                    "Header",
                    "Image Banner (البانر الرئيسي)",
                    "Featured Collection (المنتجات المميزة)",
                    "Image with Text (قصة المنتج)",
                    "Multicolumn (المميزات)",
                    "Testimonials (شهادات العملاء)",
                    "CTA (دعوة للشراء)",
                    "Newsletter (النشرة البريدية)",
                    "Footer",
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300 leading-relaxed">
                        <span className="w-7 h-7 rounded-full bg-[#C5A04E]/20 text-[#C5A04E] font-bold flex items-center justify-center text-sm shrink-0"
                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{i + 1}</span>
                        <span>{item}</span>
                    </div>
                ))}
            </div>

            <Divider />

            {/* ═══════ Section 5 ═══════ */}
            <SectionTitle>5. تخصيص صفحة المجموعة (Collection Page)</SectionTitle>
            <BulletList items={[
                "في القائمة المنسدلة اختر Collections > Default collection",
                "Products per row: 3 أو 4",
                "Rows: 4 إلى 8",
            ]} />

            <SubSubTitle>الإعدادات المهمة:</SubSubTitle>
            <GreenList items={[
                "Enable filtering: فعلو — باش العميل يقدر يفلتر حسب الثمن أو اللون",
                "Enable sorting: فعلو — باش العميل يقدر يرتب",
                "Show secondary image on hover: فعلو",
                "Show price: فعلو",
            ]} />
            <RedList items={[
                "Show vendor: أطفيه (ما بغيناش العميل يشوف اسم المورد)",
            ]} />

            <Divider />

            {/* ═══════ Section 6 ═══════ */}
            <SectionTitle>6. تخصيص صفحة المنتج (Product Page)</SectionTitle>

            <SubTitle>قسم صور المنتج (Media)</SubTitle>
            <BulletList items={[
                "Desktop layout: اختر Stacked أو Thumbnail carousel",
                "Enable image zoom: فعلو",
                "Enable video looping: فعلو إلى كان عندك فيديو",
            ]} />

            <SubTitle>قسم معلومات المنتج</SubTitle>
            <GreenList items={[
                "Enable sticky add to cart: فعلو — زر \"أضف للسلة\" كيبقى ثابت",
            ]} />
            <RedList items={[
                "Show vendor: أطفيه",
                "Show SKU: أطفيه",
            ]} />

            <SubTitle>إضافة أقسام قابلة للطي (Collapsible Content)</SubTitle>
            <Paragraph>اضغط Add block {'>'} Collapsible row وأضف:</Paragraph>

            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-center text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الترتيب</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">العنوان</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">المحتوى</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { num: "1", title: "المميزات", content: "قائمة المميزات والفوائد" },
                            { num: "2", title: "طريقة الاستعمال", content: "الخطوات بالتفصيل" },
                            { num: "3", title: "المواصفات", content: "الحجم / الوزن / المادة / اللون" },
                            { num: "4", title: "معلومات الشحن", content: "مدة التوصيل وثمن الشحن" },
                            { num: "5", title: "سياسة الإرجاع", content: "شروط الإرجاع والمدة" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-center text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{row.num}</td>
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.title}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.content}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SubTitle>إضافة أقسام تحت المنتج</SubTitle>
            <BulletList items={[
                'منتجات مشابهة: Add section > Related products — Heading: "قد يعجبك أيضاً"',
                "شهادات العملاء: Add section > Multicolumn",
                "ضمانات الثقة (Trust badges): شحن مجاني / ضمان / دفع آمن",
            ]} />

            <Divider />

            {/* ═══════ Section 7 ═══════ */}
            <SectionTitle>7. تخصيص صفحة الاتصال (Contact Page)</SectionTitle>

            <SubSubTitle>إنشاء الصفحة:</SubSubTitle>
            <BulletList items={[
                "ارجع للوحة التحكم > Online Store > Pages > Add page",
                'Title: "اتصل بنا"',
                'Content: "عندك سؤال أو استفسار؟ فريقنا جاهز لمساعدتك!"',
            ]} />

            <SubSubTitle>أضف معلومات التواصل:</SubSubTitle>
            <BulletList items={[
                "الإيميل",
                "الواتساب",
                "وقت الرد: أقل من 24 ساعة",
            ]} />

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 mb-6">
                <p className="text-red-400 font-bold leading-relaxed">
                    مهم جداً: في قسم Theme template اختر contact — هذا كيضيف فورمولير الاتصال أوتوماتيكياً
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 8 ═══════ */}
            <SectionTitle>8. تخصيص صفحة الدفع وصفحة الشكر</SectionTitle>

            <SubTitle>صفحة الدفع (Checkout)</SubTitle>
            <Paragraph>ارجع للوحة التحكم {'>'} Settings {'>'} Checkout</Paragraph>
            <BulletList items={[
                "Customer contact method: اختر Email أو Both",
                "Full name: اختر Require first and last name",
                "Company name: اختر Hidden",
                "Shipping address phone number: اختر Required",
            ]} />
            <GreenList items={[
                "فعل Show email marketing option at checkout",
                "فعل Preselect signup option",
            ]} />

            <SubSubTitle>تخصيص شكل صفحة الدفع:</SubSubTitle>
            <BulletList items={[
                "في Theme Editor > القائمة المنسدلة > Checkout",
                "حمل الشعار، عدل الألوان والخطوط باش تتوافق مع المتجر",
            ]} />

            <SubTitle>صفحة الشكر (Thank You Page)</SubTitle>
            <BulletList items={[
                'أضف Rich text: "شكراً لك على طلبيتك! كنتواصل معاك قريباً"',
                "أضف Image with text: عرض منتج آخر (Upsell)",
            ]} />

            <Divider />

            {/* ═══════ Section 9 ═══════ */}
            <SectionTitle>9. تصميم الصور بالذكاء الاصطناعي</SectionTitle>

            <SubSubTitle>أنواع الصور اللي محتاج تصممها:</SubSubTitle>
            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">نوع الصورة</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الحجم</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الاستعمال</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الأداة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { type: "صورة المنتج (خلفية بيضاء)", size: "1000 × 1000", use: "الصورة الرئيسية", tool: "Remove.bg + Canva" },
                            { type: "صورة Lifestyle", size: "1000 × 1000", use: "المنتج في الاستعمال", tool: "ChatGPT/DALL-E أو Ideogram" },
                            { type: "Infographic", size: "1000 × 1000", use: "المميزات على الصورة", tool: "Canva" },
                            { type: "بانر الصفحة الرئيسية", size: "1920 × 800", use: "Hero Banner", tool: "Canva" },
                            { type: "بانر المجموعة", size: "1200 × 400", use: "فوق صفحة Collection", tool: "Canva" },
                            { type: "مقارنة قبل/بعد", size: "1000 × 1000", use: "إعلانات وصفحة المنتج", tool: "Canva" },
                            { type: "Favicon", size: "32 × 32", use: "أيقونة تبويب المتصفح", tool: "Canva" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.type}</td>
                                <td className="text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{row.size}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.use}</td>
                                <td className="text-gray-300 py-3 px-4 border border-[#C5A04E]/10">{row.tool}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SubTitle>الأداة 1: حذف الخلفية (Remove.bg)</SubTitle>
            <BulletList items={[
                "ادخل remove.bg وحمل صورة المنتج",
                "الخلفية كتتحيد في ثواني",
                "حمل النتيجة بصيغة PNG (خلفية شفافة)",
            ]} />

            <SubTitle>الأداة 2: تصميم بـ Canva</SubTitle>
            <SubSubTitle>صورة Infographic:</SubSubTitle>
            <BulletList items={[
                "ادخل canva.com > Create a design > Custom: 1000 × 1000",
                "حط خلفية بيضاء أو فاتحة",
                "حط صورة المنتج (بدون خلفية) في الوسط",
                "من Elements أضف أسهم أو خطوط",
                "أضف نصوص المميزات بجانب كل سهم",
            ]} />

            <SubSubTitle>بانر الصفحة الرئيسية:</SubSubTitle>
            <BulletList items={[
                "Custom: 1920 × 800",
                "حط خلفية (gradient أو صورة lifestyle)",
                "على جهة: صورة المنتج كبيرة",
                "على الجهة الأخرى: العنوان + النص + الزر",
            ]} />

            <SubTitle>الأداة 3: الذكاء الاصطناعي (ChatGPT/DALL-E)</SubTitle>
            <SubSubTitle>صور Lifestyle:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-4 mb-4">
                <p className="text-gray-400 italic text-sm leading-relaxed">
                    {`"Product photo of a kitchen vegetable cutter on a marble countertop, modern kitchen background, natural lighting, commercial photography style, 4K quality"`}
                </p>
            </div>

            <SubSubTitle>صور المنتج على خلفية بيضاء:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-4 mb-4">
                <p className="text-gray-400 italic text-sm leading-relaxed">
                    {`"Product photo of [المنتج] on pure white background, studio lighting, e-commerce style, high quality, centered"`}
                </p>
            </div>

            <SubTitle>الأداة 4: ضغط الصور (TinyPNG)</SubTitle>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 mb-6">
                <p className="text-red-400 font-bold leading-relaxed">
                    مهم جداً باش المتجر يكون سريع:
                </p>
            </div>
            <BulletList items={[
                "ادخل tinypng.com وحمل الصور ديالك",
                "الموقع كيضغطهم (كينقص الحجم 50-80% بلا فقدان الجودة)",
                "هاد الصور هي اللي تحملها في المتجر",
            ]} />

            <Divider />

            {/* ═══════ Section 10 — Final Checklist ═══════ */}
            <SectionTitle>10. Checklist النهائي</SectionTitle>

            {[
                {
                    category: "Theme Settings",
                    items: [
                        "الألوان متناسقة (3 ألوان كحد أقصى)",
                        "الخطوط واضحة وكتدعم العربية",
                        "الشعار محمل + Favicon",
                        "إعدادات السلة = Drawer",
                        "روابط السوشل ميديا مضافة",
                    ],
                },
                {
                    category: "Header",
                    items: [
                        "الشعار باين مزيان",
                        "القائمة الرئيسية فيها: الرئيسية / المتجر / من نحن / اتصل بنا",
                        "Announcement bar مفعل مع عرض جذاب",
                        "البحث والسلة باينين",
                        "Sticky header مفعل",
                    ],
                },
                {
                    category: "Footer",
                    items: [
                        "روابط السياسات موجودة",
                        "نص عن المتجر",
                        "النشرة البريدية مفعلة",
                        "أيقونات الدفع باينة",
                    ],
                },
                {
                    category: "الصفحة الرئيسية",
                    items: [
                        "بانر رئيسي احترافي مع عنوان وزر",
                        "منتجات مميزة",
                        "قسم المميزات (شحن / ضمان / دفع آمن)",
                        "شهادات العملاء",
                        "دعوة للشراء (CTA)",
                    ],
                },
                {
                    category: "صفحة المنتج",
                    items: [
                        "على الأقل 5 صور احترافية",
                        "عنوان جذاب + ثمن واضح + ثمن مشطوب",
                        "وصف يبيع (مشكلة + حل + مميزات)",
                        "أقسام قابلة للطي",
                        "زر شراء بارز + Sticky add to cart",
                        "منتجات مشابهة + Trust badges",
                    ],
                },
                {
                    category: "صفحة المجموعة",
                    items: [
                        "فلترة وترتيب مفعلين",
                        "3-4 منتجات في كل صف",
                        "الصورة الثانية كتبان على Hover",
                    ],
                },
                {
                    category: "صفحة الاتصال",
                    items: [
                        "فورمولير الاتصال موجود",
                        "الإيميل والواتساب باينين",
                        "وقت الرد محدد",
                    ],
                },
                {
                    category: "صفحة الدفع",
                    items: [
                        "الشعار موجود",
                        "الألوان متناسقة مع المتجر",
                        "التسويق بالإيميل مفعل",
                    ],
                },
                {
                    category: "الصور",
                    items: [
                        "كل الصور عالية الجودة",
                        "بلا علامات مائية أو كتابة أجنبية",
                        "مضغوطة بـ TinyPNG",
                        "المتجر سريع التحميل",
                    ],
                },
            ].map((section, si) => (
                <div key={si} className="mb-6">
                    <SubSubTitle>{section.category}</SubSubTitle>
                    <div className="space-y-2">
                        {section.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl px-5 py-3">
                                <span className="text-[#C5A04E] shrink-0">&#x2610;</span>
                                <span className="text-gray-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <Divider />

            {/* ═══════ Summary ═══════ */}
            <div className="bg-[#C5A04E]/5 border border-[#C5A04E]/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-[#C5A04E] mb-5">الخلاصة</h2>
                <Paragraph>
                    التصميم الاحترافي ماشي رفاهية — هو ضرورة. العميل كيحكم على متجرك في أول 3 ثواني. إلى بان احترافي كيثق ويشري. إلى بان رديء كيخرج وما يرجعش. خذ وقتك في كل خطوة من هاد الدليل وغادي يكون عندك متجر يفتخر بيه.
                </Paragraph>
                <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20">
                    <p className="text-[#C5A04E] font-bold leading-relaxed text-center">
                        © Lexmo Academy 2026 — جميع الحقوق محفوظة
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ─── Phase 14: Essential Apps ─── */
function Phase14EssentialApps() {
    return (
        <div className="p-6 lg:p-8 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
            <h1 className="text-3xl font-bold text-white mb-2">التطبيقات الأساسية</h1>
            <p className="text-[#C5A04E] text-lg mb-8">كل التطبيقات اللي محتاج تثبتها باش متجرك يكون احترافي ويبيع أكثر</p>

            {/* Table of Contents */}
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-[#C5A04E] mb-4">جدول المحتويات</h3>
                <div className="space-y-2">
                    {[
                        "كيفاش تثبت أي تطبيق على شوبيفاي",
                        "تطبيق العروض المجمعة (Bundle)",
                        "تطبيق تتبع الطرود (Order Tracking)",
                        "تطبيق تقييمات العملاء (Reviews)",
                        "تطبيق برنامج الولاء (Loyalty Program)",
                        "تطبيق تحسين محركات البحث (SEO)",
                        "التسويق بالإيميل (Email Marketing)",
                        "أتمتة الفواتير (Invoicing)",
                        "تطبيقات إضافية مفيدة",
                        "Checklist النهائي",
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-gray-300 leading-relaxed">
                            <span className="w-7 h-7 rounded-full bg-[#C5A04E]/20 text-[#C5A04E] font-bold flex items-center justify-center text-sm shrink-0"
                                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{i + 1}</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════ Section 1 ═══════ */}
            <SectionTitle>1. كيفاش تثبت أي تطبيق على شوبيفاي</SectionTitle>
            <Paragraph>هاد الخطوات كتطبقها على أي تطبيق:</Paragraph>

            <StepCard num={1} title="الدخول للمتجر" items={[
                "ادخل للوحة تحكم شوبيفاي admin.shopify.com",
                "في القائمة اليسرى اضغط على Apps",
            ]} />
            <StepCard num={2} title="البحث والتثبيت" items={[
                "اضغط على Shopify App Store (كيفتح في صفحة جديدة)",
                "في خانة البحث كتب اسم التطبيق",
                "اضغط على التطبيق اللي بغيتي",
                "اضغط على الزر Add app (أو Install)",
            ]} />
            <StepCard num={3} title="التفعيل" items={[
                "غادي يرجعك للمتجر ديالك — اضغط Install app",
                "اتبع خطوات الإعداد الخاصة بالتطبيق",
            ]} />

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3 mb-6">
                <span className="text-green-400 font-bold">مبروك! التطبيق مثبت</span>
            </div>

            <SubSubTitle>نصائح مهمة قبل ما تثبت أي تطبيق:</SubSubTitle>
            <GreenList items={[
                "شوف التقييم — ما تثبتش تطبيق أقل من 4 نجوم",
                "شوف عدد التقييمات — كل ما كانو كثر كل ما كان موثوق",
                "شوف واش عندو Free plan — ابدأ بالمجاني دائماً",
            ]} />
            <RedList items={[
                "ما تثبتش تطبيقات بزاف — كل تطبيق زائد كيبطئ المتجر",
                "حيد أي تطبيق ما كتستعملوش",
            ]} />

            <Divider />

            {/* ═══════ Section 2 ═══════ */}
            <SectionTitle>2. تطبيق العروض المجمعة — Bundle</SectionTitle>

            <SubSubTitle>شنو هو؟</SubSubTitle>
            <Paragraph>
                {`تطبيق كيخلي العملاء يشريو أكثر من منتج مع بعض بثمن مخفض. مثال: "اشتري 2 واحصل على الثالث مجاناً" أو "وفر 20% فاش تشري الحزمة الكاملة".`}
            </Paragraph>

            <SubSubTitle>علاش مهم؟</SubSubTitle>
            <GreenList items={[
                "كيزيد متوسط قيمة الطلبية (Average Order Value)",
                "العميل كيحس أنه كيوفر الفلوس",
                "كيزيد الأرباح ديالك بدون ما تزيد مصاريف الإعلان",
            ]} />

            <SubSubTitle>التطبيق المقترح:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 className="text-lg font-bold text-white">Shopify Bundles</h4>
                    <span className="text-green-400 font-bold text-sm">مجاني — تطبيق رسمي ديال شوبيفاي</span>
                </div>
                <p className="text-gray-500 text-sm">البديل: Bundler - Product Bundles (مجاني + خيارات مدفوعة)</p>
            </div>

            <SubSubTitle>خطوات التثبيت والإعداد:</SubSubTitle>
            <BulletList items={[
                "في App Store قلب على Shopify Bundles",
                "اضغط Add app > Install app",
                "من لوحة التحكم ادخل ل Apps > Bundles",
                "اضغط Create bundle",
                "اختر نوع العرض:",
            ]} />

            <SubTitle>النوع 1: Fixed bundle (حزمة ثابتة)</SubTitle>
            <Paragraph>أنت كتختار المنتجات اللي في الحزمة. مثال: &quot;حزمة العناية بالبشرة = كريم + سيروم + غسول&quot;</Paragraph>
            <BulletList items={[
                "اضغط Fixed bundle",
                'Title: اكتب اسم الحزمة (مثال: "حزمة العناية الكاملة")',
                "Products: اضغط Add products واختر المنتجات",
                "Discount: حدد نسبة الخصم (مثال: 20%)",
                "اضغط Save",
            ]} />

            <SubTitle>النوع 2: Multipack (نفس المنتج × عدة وحدات)</SubTitle>
            <Paragraph>{`مثال: "اشتري 3 بثمن 2" أو "وفر 30% على 3 وحدات"`}</Paragraph>
            <BulletList items={[
                "اضغط Multipack",
                "اختر المنتج",
                "حدد العدد (مثال: 3)",
                "حدد الخصم (مثال: 30%)",
                "اضغط Save",
            ]} />

            <SubSubTitle>عرض العروض في صفحة المنتج:</SubSubTitle>
            <BulletList items={[
                "العرض كيبان أوتوماتيكياً في صفحة المنتج",
                "العميل كيشوف الثمن العادي والثمن المخفض",
                "تأكد أن العرض باين مزيان على الهاتف",
            ]} />

            <SubSubTitle>نصائح:</SubSubTitle>
            <GreenList items={[
                "ما تديرش خصم أكبر من 30% باش تحافظ على هامش الربح",
                "جرب عدة عروض وشوف أي واحد كيبيع أكثر",
                "حط العرض في الصفحة الرئيسية أيضاً",
            ]} />

            <Divider />

            {/* ═══════ Section 3 ═══════ */}
            <SectionTitle>3. تطبيق تتبع الطرود — Order Tracking</SectionTitle>

            <SubSubTitle>شنو هو؟</SubSubTitle>
            <Paragraph>
                تطبيق كيعطي العملاء صفحة تتبع احترافية بالبراند ديالك باش يشوفو فين وصلات الطلبية ديالهم.
            </Paragraph>

            <SubSubTitle>علاش مهم؟</SubSubTitle>
            <GreenList items={[
                'كيقلل أسئلة "فين وصلات الطلبية ديالي؟" بنسبة 80%',
                "كيبني الثقة عند العميل",
                "كيقلل طلبات الإرجاع والاسترداد",
                "صفحة التتبع بالبراند ديالك كتبقي التجربة كاملة عندك",
            ]} />

            <SubSubTitle>التطبيق المقترح:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 className="text-lg font-bold text-white">AfterShip Order Tracking</h4>
                    <span className="text-green-400 font-bold text-sm">مجاني حتى 50 طلبية/شهر</span>
                </div>
                <p className="text-gray-500 text-sm">البديل: Parcel Panel Order Tracking (مجاني حتى 20 طلبية/شهر)</p>
            </div>

            <SubSubTitle>خطوات التثبيت:</SubSubTitle>
            <BulletList items={[
                "في App Store قلب على AfterShip Order Tracking",
                "اضغط Add app > Install app",
                "أنشئ حساب AfterShip (مجاني)",
                "غادي يفتح لوحة تحكم AfterShip",
            ]} />

            <SubTitle>إعداد صفحة التتبع</SubTitle>
            <BulletList items={[
                "في قائمة AfterShip اضغط على Tracking Pages",
                "اضغط Customize tracking page",
                "Logo: حمل الشعار ديالك",
                "Colors: غير الألوان باش تتوافق مع البراند ديالك",
                "Language: اختر العربية أو الفرنسية أو الإنجليزية حسب السوق",
                "Product recommendations: فعلها — كتعرض منتجات إضافية في صفحة التتبع = مبيعات زائدة",
                "اضغط Save",
            ]} />

            <SubTitle>إعداد الإشعارات</SubTitle>
            <BulletList items={[
                "اضغط على Notifications",
                "فعل الإشعارات التالية:",
            ]} />
            <GreenList items={[
                "In transit (في الطريق)",
                "Out for delivery (خرج للتوصيل)",
                "Delivered (تم التوصيل)",
                "Exception (مشكل في التوصيل)",
            ]} />
            <BulletList items={[
                "Channel: اختر Email (وممكن تزيد SMS إلى بغيتي)",
                "عدل قوالب الإيميل بالبراند ديالك (الشعار + الألوان)",
                "اضغط Save",
            ]} />

            <SubTitle>إضافة رابط التتبع في المتجر</SubTitle>
            <BulletList items={[
                "ارجع للوحة تحكم شوبيفاي",
                "Online Store > Navigation > Footer menu",
                "اضغط Add menu item",
                'Name: "تتبع طلبيتك"',
                "Link: الصق رابط صفحة التتبع من AfterShip",
                "اضغط Save",
            ]} />

            <Divider />

            {/* ═══════ Section 4 ═══════ */}
            <SectionTitle>4. تطبيق تقييمات العملاء — Reviews</SectionTitle>

            <SubSubTitle>شنو هو؟</SubSubTitle>
            <Paragraph>
                تطبيق كيخلي العملاء يحطو تقييمات ونجوم وصور على المنتجات ديالك.
            </Paragraph>

            <SubSubTitle>علاش مهم؟</SubSubTitle>
            <GreenList items={[
                "93% ديال العملاء كيقراو التقييمات قبل ما يشريو",
                "التقييمات كتبني الثقة بزاف",
                "المنتج بتقييمات كيبيع 270% أكثر من المنتج بلا تقييمات",
                "التقييمات بالصور أقوى بزاف",
            ]} />

            <SubSubTitle>التطبيق المقترح:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 className="text-lg font-bold text-white">Judge.me Product Reviews</h4>
                    <span className="text-green-400 font-bold text-sm">مجاني — أفضل تطبيق تقييمات</span>
                </div>
                <p className="text-gray-500 text-sm">البديل: Loox Product Reviews (مدفوع — متخصص في تقييمات بالصور)</p>
            </div>

            <SubSubTitle>خطوات التثبيت:</SubSubTitle>
            <BulletList items={[
                "في App Store قلب على Judge.me",
                "اضغط Add app > Install app",
                "غادي يفتح معالج الإعداد (Setup Wizard)",
            ]} />

            <SubTitle>الإعداد الأساسي</SubTitle>
            <BulletList items={[
                "Review widget: اضغط Enable — هذا كيضيف النجوم والتقييمات في صفحة المنتج أوتوماتيكياً",
                "Star rating badge: اضغط Enable — النجوم كيبانو تحت اسم المنتج في صفحة المجموعة",
            ]} />
            <SubSubTitle>Review form — عدل الفورمولير:</SubSubTitle>
            <GreenList items={[
                "فعل Photo upload — باش العملاء يحملو صور",
                "فعل Video upload — باش يحملو فيديوهات",
            ]} />

            <SubTitle>إعداد الإيميلات الأوتوماتيكية</SubTitle>
            <BulletList items={[
                "في قائمة Judge.me اضغط على Email settings",
                "Review request email: فعلو — هذا الإيميل اللي كيتوصل بيه العميل بعد التوصيل كيطلب منو يحط تقييم",
                "Send after: اختر 14 يوم بعد الطلبية (باش يكون المنتج وصل)",
                "Reminder email: فعلو — تذكير إلى ما حطش التقييم",
                "Send reminder after: 7 أيام بعد أول إيميل",
            ]} />
            <SubSubTitle>عدل قالب الإيميل:</SubSubTitle>
            <BulletList items={[
                "حط الشعار ديالك",
                "غير الألوان",
                'عدل النص: "شكراً لشرائك من [اسم المتجر]! نبغيو نسمعو رأيك — حط تقييمك وشاركنا تجربتك"',
                "اضغط Save",
            ]} />

            <SubTitle>استيراد تقييمات (للمتاجر الجديدة)</SubTitle>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 mb-6">
                <p className="text-red-400 font-bold leading-relaxed">
                    مهم: متجر جديد بلا تقييمات كيخوف العملاء. الحل:
                </p>
            </div>
            <BulletList items={[
                "في Judge.me اضغط على Import reviews",
                "اختر Import from AliExpress",
                "الصق رابط المنتج على AliExpress",
                "اختر عدد التقييمات (10-20 كافي للبداية)",
                "فلتر: اختر غير التقييمات ب 4 و 5 نجوم",
                "فلتر: اختر غير التقييمات اللي فيها صور",
                "اضغط Import",
                "راجع التقييمات المستوردة واحذف أي تقييم ما مناسبش",
            ]} />

            <Divider />

            {/* ═══════ Section 5 ═══════ */}
            <SectionTitle>5. تطبيق برنامج الولاء — Loyalty Program</SectionTitle>

            <SubSubTitle>شنو هو؟</SubSubTitle>
            <Paragraph>
                نظام نقاط ومكافآت كيحفز العملاء يعاودو يشريو من عندك.
            </Paragraph>

            <SubSubTitle>علاش مهم؟</SubSubTitle>
            <GreenList items={[
                "جلب عميل جديد كيكلف 5 أضعاف الحفاظ على عميل قديم",
                "العملاء المخلصين كيصرفو 67% أكثر من العملاء الجداد",
                "كيبني علاقة طويلة مع العميل",
            ]} />

            <SubSubTitle>التطبيق المقترح:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 className="text-lg font-bold text-white">BON Loyalty Rewards Referrals</h4>
                    <span className="text-green-400 font-bold text-sm">مجاني حتى 250 عضو</span>
                </div>
                <p className="text-gray-500 text-sm">البديل: Smile.io (مجاني حتى 200 عضو)</p>
            </div>

            <SubTitle>إعداد نظام النقاط</SubTitle>
            <Paragraph>اضغط على Earning rules (قواعد كسب النقاط) وفعل هاد القواعد:</Paragraph>

            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الفعل</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">النقاط المقترحة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { action: "إنشاء حساب", points: "100 نقطة" },
                            { action: "كل $1 مصروفة", points: "10 نقاط" },
                            { action: "متابعة على إنستغرام", points: "50 نقطة" },
                            { action: "متابعة على فيسبوك", points: "50 نقطة" },
                            { action: "مشاركة المتجر مع صديق", points: "200 نقطة" },
                            { action: "يوم عيد ميلاد العميل", points: "200 نقطة" },
                            { action: "كتابة تقييم", points: "100 نقطة" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.action}</td>
                                <td className="text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10">{row.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SubTitle>إعداد المكافآت</SubTitle>
            <Paragraph>اضغط على Rewards (المكافآت) وأضف:</Paragraph>

            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">النقاط المطلوبة</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">المكافأة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { points: "500 نقطة", reward: "خصم $5" },
                            { points: "1000 نقطة", reward: "خصم $10" },
                            { points: "1500 نقطة", reward: "شحن مجاني" },
                            { points: "2500 نقطة", reward: "خصم $25" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{row.points}</td>
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.reward}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SubTitle>إعداد المظهر</SubTitle>
            <BulletList items={[
                "اضغط على Widget settings",
                "Widget position: اختر Bottom right",
                "Colors: غير الألوان باش تتوافق مع البراند",
                "Language: اختر العربية أو الفرنسية",
                "Widget icon: اختر أيقونة مناسبة (هدية أو نجمة)",
                "اضغط Save",
            ]} />

            <Divider />

            {/* ═══════ Section 6 ═══════ */}
            <SectionTitle>6. تطبيق تحسين محركات البحث — SEO</SectionTitle>

            <SubSubTitle>شنو هو؟</SubSubTitle>
            <Paragraph>
                تطبيق كيساعدك تحسن المتجر ديالك باش يظهر في نتائج البحث على Google بلا ما تدفع على الإعلانات.
            </Paragraph>

            <SubSubTitle>علاش مهم؟</SubSubTitle>
            <GreenList items={[
                "زوار مجانيين من Google = مبيعات بلا مصاريف إعلان",
                "كيبني مصداقية (الناس كيثقو في نتائج Google)",
                "استثمار طويل المدى — كل ما كبر المحتوى كل ما زادو الزوار",
            ]} />

            <SubSubTitle>التطبيق المقترح:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 className="text-lg font-bold text-white">SEO King</h4>
                    <span className="text-green-400 font-bold text-sm">مجاني + خيارات مدفوعة</span>
                </div>
                <p className="text-gray-500 text-sm">البديل: Plug in SEO (مجاني + خيارات مدفوعة)</p>
            </div>

            <SubTitle>الإعدادات الأساسية</SubTitle>
            <BulletList items={[
                "SEO Audit: غادي يوريك المشاكل اللي في المتجر — اتبع التوصيات",
            ]} />
            <SubSubTitle>Meta titles — عدل عناوين الصفحات:</SubSubTitle>
            <BulletList items={[
                'الصفحة الرئيسية: "[اسم المتجر] — [الوصف]"',
                'مثال: "GlamBeauty — منتجات العناية بالبشرة الطبيعية | شحن مجاني"',
            ]} />
            <SubSubTitle>Meta descriptions — عدل الوصف:</SubSubTitle>
            <BulletList items={[
                'مثال: "اكتشف أفضل منتجات العناية بالبشرة الطبيعية. نتائج مضمونة في 7 أيام. شحن مجاني لجميع الطلبيات."',
            ]} />
            <GreenList items={[
                "Image alt text: التطبيق كيضيف أوتوماتيكياً نص بديل للصور (مهم للسيو)",
                "JSON-LD: فعلو — كيساعد Google يفهم محتوى المتجر (المنتجات، الأثمنة، التقييمات)",
            ]} />

            <SubTitle>تحسينات يدوية مهمة (بدون تطبيق)</SubTitle>
            <BulletList items={[
                "ارجع للوحة التحكم > Products > اختر منتج",
                "انزل لقسم Search engine listing",
                "اضغط Edit",
                "Page title: عنوان مختصر فيه الكلمة المفتاحية (أقل من 60 حرف)",
                "Meta description: وصف جذاب فيه الكلمة المفتاحية (أقل من 160 حرف)",
                "URL handle: رابط نظيف وقصير (مثال: products/face-cream بدل products/2024-new-arrival-face-cream-serum)",
                "اضغط Save",
            ]} />

            <Divider />

            {/* ═══════ Section 7 ═══════ */}
            <SectionTitle>7. التسويق بالإيميل — Email Marketing</SectionTitle>

            <SubSubTitle>شنو هو؟</SubSubTitle>
            <Paragraph>إرسال إيميلات أوتوماتيكية ويدوية للعملاء باش تبيع أكثر.</Paragraph>

            <SubSubTitle>علاش مهم؟</SubSubTitle>
            <GreenList items={[
                "أعلى عائد استثمار في التسويق: كل $1 كتصرف على الإيميل كيرجع $42",
                "كيبني علاقة مع العملاء",
                "كيرجع العملاء اللي شراو مرة ويخليهم يعاودو",
                "السلات المتروكة (Abandoned Cart) — 70% ديال السلات كيتتركو، الإيميل كيرجع منها نسبة مزيانة",
            ]} />

            <SubSubTitle>التطبيق المقترح:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 className="text-lg font-bold text-white">Shopify Email</h4>
                    <span className="text-green-400 font-bold text-sm">مجاني حتى 10,000 إيميل/شهر — مدمج مع شوبيفاي</span>
                </div>
                <p className="text-gray-500 text-sm">البديل: Klaviyo (أقوى — مجاني حتى 250 مشترك)</p>
            </div>

            <SubSubTitle>خطوات التثبيت:</SubSubTitle>
            <BulletList items={[
                "في لوحة التحكم اضغط على Marketing",
                "اضغط Shopify Email > Create campaign",
                "إلى ما كانش مثبت، غادي يطلب منك تثبتو — اضغط Install",
            ]} />

            <SubTitle>الإيميلات الأوتوماتيكية (Automations)</SubTitle>
            <Paragraph>في Marketing {'>'} Automations {'>'} اضغط Create automation. أنشئ هاد الأوتوماتيكيات:</Paragraph>

            {/* Automation 1 */}
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-[#C5A04E]/20 text-[#C5A04E] font-bold flex items-center justify-center text-sm shrink-0"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1</span>
                    <h4 className="text-white font-bold">إيميل ترحيبي (Welcome Email)</h4>
                </div>
                <BulletList items={[
                    "Trigger: العميل سجل حسابو (Customer signs up)",
                    "Delay: فوري",
                    'العنوان: "مرحباً بك في [اسم المتجر]!"',
                    "النص: شكر + تقديم البراند + كود خصم 10% على أول طلبية",
                    "الكود: WELCOME10",
                    'زر: "تسوق الآن"',
                ]} />
            </div>

            {/* Automation 2 */}
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-[#C5A04E]/20 text-[#C5A04E] font-bold flex items-center justify-center text-sm shrink-0"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>2</span>
                    <h4 className="text-white font-bold">استرداد السلة المتروكة (Abandoned Cart)</h4>
                </div>
                <BulletList items={[
                    "Trigger: Checkout abandoned (العميل ترك السلة)",
                    "Delay: 1 ساعة بعد الترك",
                    'العنوان: "نسيتي شي حاجة؟"',
                    '"لاحظنا أنك تركتي منتجات في السلة ديالك. لا تخلي هاد الفرصة تفوتك!"',
                    "صورة المنتج اللي في السلة",
                    'زر: "أكمل طلبيتك"',
                ]} />
                <SubSubTitle>إيميل تذكير ثاني: 24 ساعة بعد الأول</SubSubTitle>
                <BulletList items={[
                    'العنوان: "آخر فرصة! خصم 10% على طلبيتك"',
                    "أضف كود خصم باش تحفزو يكمل",
                ]} />
            </div>

            {/* Automation 3 */}
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-[#C5A04E]/20 text-[#C5A04E] font-bold flex items-center justify-center text-sm shrink-0"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>3</span>
                    <h4 className="text-white font-bold">شكر بعد الشراء (Post-Purchase Thank You)</h4>
                </div>
                <BulletList items={[
                    "Trigger: Order fulfilled (الطلبية تشحنات)",
                    "Delay: فوري",
                    'العنوان: "شكراً لطلبيتك!"',
                    "النص: تأكيد الشحن + رابط التتبع + نصائح استعمال المنتج",
                    'زر: "تتبع طلبيتك"',
                ]} />
            </div>

            {/* Automation 4 */}
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-[#C5A04E]/20 text-[#C5A04E] font-bold flex items-center justify-center text-sm shrink-0"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>4</span>
                    <h4 className="text-white font-bold">طلب التقييم (Review Request)</h4>
                </div>
                <BulletList items={[
                    "Trigger: Order delivered (وصلات الطلبية)",
                    "Delay: 7 أيام بعد التوصيل",
                    'العنوان: "كيف كانت تجربتك؟"',
                    '"نبغيو نسمعو رأيك! شاركنا تقييمك وساعد عملاء آخرين ياخذو القرار"',
                    'زر: "حط تقييمك" (رابط Judge.me)',
                ]} />
            </div>

            {/* Automation 5 */}
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-[#C5A04E]/20 text-[#C5A04E] font-bold flex items-center justify-center text-sm shrink-0"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>5</span>
                    <h4 className="text-white font-bold">إعادة الاستهداف (Win-Back)</h4>
                </div>
                <BulletList items={[
                    "Trigger: Customer hasn't purchased in 60 days",
                    "Delay: 60 يوم بعد آخر شراء",
                    'العنوان: "وحشتينا! عرض خاص غير ليك"',
                    '"فات وقت من آخر مرة تسوقتي عندنا. رجع واستفد من خصم 15%!"',
                    "كود: COMEBACK15",
                    'زر: "تسوق الآن"',
                ]} />
            </div>

            <SubTitle>إنشاء حملات يدوية</SubTitle>
            <BulletList items={[
                "حملة أسبوعية: منتجات جديدة أو عروض خاصة",
                "حملة موسمية: رمضان / العيد / Black Friday / الصيف",
                "حملة تعليمية: نصائح ومحتوى مفيد عن النيتش ديالك",
            ]} />

            <Divider />

            {/* ═══════ Section 8 ═══════ */}
            <SectionTitle>8. أتمتة الفواتير — Invoicing</SectionTitle>

            <SubSubTitle>شنو هو؟</SubSubTitle>
            <Paragraph>تطبيق كيولد الفواتير أوتوماتيكياً لكل طلبية وكيرسلها للعميل.</Paragraph>

            <SubSubTitle>علاش مهم؟</SubSubTitle>
            <GreenList items={[
                "احترافية — العميل كيتوصل بفاتورة رسمية",
                "قانوني — بعض الدول كتفرض إرسال فاتورة",
                "محاسبة — كيسهل عليك تتبع المبيعات والضرائب",
            ]} />

            <SubSubTitle>التطبيق المقترح:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 className="text-lg font-bold text-white">Order Printer Pro</h4>
                    <span className="text-green-400 font-bold text-sm">مجاني — تطبيق رسمي ديال شوبيفاي</span>
                </div>
                <p className="text-gray-500 text-sm">البديل: Sufio - Professional Invoices (مدفوع — أكثر احترافية)</p>
            </div>

            <SubTitle>إعداد قالب الفاتورة</SubTitle>
            <BulletList items={[
                "في التطبيق اضغط على Templates",
                "اختر Invoice",
                "اضغط Customize",
            ]} />
            <SubSubTitle>عدل المعلومات:</SubSubTitle>
            <BulletList items={[
                "Logo: حمل الشعار ديالك",
                "Company name: اسم المتجر أو الشركة",
                "Address: العنوان ديالك",
                "Email: الإيميل ديال المتجر",
                "Tax ID: رقم الضريبة (إلى كان عندك)",
                "Colors: عدل الألوان باش تتوافق مع البراند",
                "Language: اختر اللغة المناسبة",
                "اضغط Save",
            ]} />

            <SubTitle>إعداد الإرسال الأوتوماتيكي</SubTitle>
            <BulletList items={[
                "اضغط على Settings > Automation",
                "فعل Auto-send invoice",
                'Trigger: اختر "When order is created" (فاش الطلبية تتنشأ)',
                "الفاتورة غادي تتولد وتتوصل للعميل أوتوماتيكياً بالإيميل",
                "اضغط Save",
            ]} />

            <Divider />

            {/* ═══════ Section 9 ═══════ */}
            <SectionTitle>9. تطبيقات إضافية مفيدة</SectionTitle>

            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">التطبيق</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الاستعمال</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">مجاني؟</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { app: "Vitals", use: "+40 أداة في تطبيق واحد (عداد تنازلي / pop-ups / wishlist)", free: "تجربة مجانية ثم $29.99/شهر" },
                            { app: "Tidio", use: "شات مباشر مع العملاء", free: "مجاني حتى 50 محادثة/شهر" },
                            { app: "Privy", use: "Pop-ups لجمع الإيميلات وعروض خاصة", free: "مجاني حتى 100 مشترك" },
                            { app: "ReConvert", use: "صفحة شكر محسنة مع Upsell", free: "مجاني حتى 49 طلبية/شهر" },
                            { app: "DSers", use: "استيراد المنتجات من AliExpress", free: "مجاني حتى 3000 منتج" },
                            { app: "Oberlo/Zendrop", use: "بدائل DSers للاستيراد", free: "خطط مجانية متوفرة" },
                            { app: "PageFly", use: "بناء صفحات مخصصة (Landing pages)", free: "مجاني لصفحة واحدة" },
                            { app: "Lucky Orange", use: "تسجيل زيارات العملاء وخرائط الحرارة", free: "تجربة مجانية" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.app}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.use}</td>
                                <td className="text-green-400 py-3 px-4 border border-[#C5A04E]/10 text-sm">{row.free}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    نصيحة: ما تثبتش كل هاد التطبيقات مرة وحدة. ابدأ بالأساسيات (Reviews + Tracking + Email) وزيد مع الوقت.
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 10 — Checklist ═══════ */}
            <SectionTitle>10. Checklist النهائي</SectionTitle>

            {[
                {
                    category: "التطبيقات الأساسية (ضرورية)",
                    items: [
                        "تطبيق العروض المجمعة مثبت ومفعل (Bundle)",
                        "عرض واحد على الأقل منشئ (مثال: اشتري 2 واحصل على خصم)",
                        "تطبيق تتبع الطرود مثبت ومفعل (AfterShip)",
                        "صفحة التتبع مخصصة بالبراند",
                        "إشعارات التتبع مفعلة",
                        "رابط التتبع مضاف في الفوتر",
                        "تطبيق التقييمات مثبت ومفعل (Judge.me)",
                        "تقييمات مستوردة من AliExpress (10-20)",
                        "إيميل طلب التقييم الأوتوماتيكي مفعل",
                    ],
                },
                {
                    category: "التطبيقات المتقدمة (مهمة)",
                    items: [
                        "برنامج الولاء مثبت ومفعل",
                        "قواعد كسب النقاط مضبوطة",
                        "المكافآت محددة",
                        "تطبيق SEO مثبت ومفعل",
                        "عناوين الصفحات محسنة",
                        "الأوصاف محسنة",
                    ],
                },
                {
                    category: "التسويق بالإيميل",
                    items: [
                        "Shopify Email أو Klaviyo مثبت",
                        "إيميل ترحيبي مفعل (Welcome)",
                        "إيميل السلة المتروكة مفعل (Abandoned Cart)",
                        "إيميل شكر بعد الشراء مفعل (Thank You)",
                        "إيميل طلب التقييم مفعل (Review Request)",
                        "إيميل إعادة الاستهداف مفعل (Win-Back)",
                    ],
                },
                {
                    category: "الفواتير",
                    items: [
                        "تطبيق الفواتير مثبت",
                        "قالب الفاتورة مخصص (الشعار + المعلومات)",
                        "الإرسال الأوتوماتيكي مفعل",
                    ],
                },
                {
                    category: "العام",
                    items: [
                        "كل التطبيقات خدامة مزيان",
                        "المتجر مازال سريع (التطبيقات ما بطأتوش)",
                        "ما كاينش تطبيقات زائدة غير مستعملة",
                    ],
                },
            ].map((section, si) => (
                <div key={si} className="mb-6">
                    <SubSubTitle>{section.category}</SubSubTitle>
                    <div className="space-y-2">
                        {section.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl px-5 py-3">
                                <span className="text-[#C5A04E] shrink-0">&#x2610;</span>
                                <span className="text-gray-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <Divider />

            {/* ═══════ Summary ═══════ */}
            <div className="bg-[#C5A04E]/5 border border-[#C5A04E]/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-[#C5A04E] mb-5">الخلاصة</h2>
                <Paragraph>
                    التطبيقات هي اللي كتحول متجرك من متجر بسيط لمتجر احترافي. ابدأ بالأساسيات: التقييمات والتتبع والإيميل. ثم زيد باقي التطبيقات مع الوقت. والأهم: ما تنساش تتبع النتائج وتشوف أي تطبيق كيجيب ليك أفضل عائد.
                </Paragraph>
                <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20">
                    <p className="text-[#C5A04E] font-bold leading-relaxed text-center">
                        © Lexmo Academy 2026 — جميع الحقوق محفوظة
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ─── Phase 22: Ad Campaign ─── */
function Phase22AdCampaign() {
    return (
        <div className="p-6 lg:p-8 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
            <h1 className="text-3xl font-bold text-white mb-2">إنشاء حملة إعلانية</h1>
            <p className="text-[#C5A04E] text-lg mb-8">دليل عملي خطوة بخطوة لإنشاء أول حملة إعلانية على فيسبوك وإنستغرام</p>

            {/* Table of Contents */}
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-[#C5A04E] mb-4">جدول المحتويات</h3>
                <div className="space-y-2">
                    {[
                        "التجهيز قبل إنشاء الحملة",
                        "تثبيت البيكسل (Facebook Pixel)",
                        "ربط المتجر بفيسبوك",
                        "المثال التطبيقي — المنتج اللي غادي نعلنو عليه",
                        "إنشاء الحملة (Campaign)",
                        "إعداد المجموعة الإعلانية (Ad Set)",
                        "إنشاء الإعلان (Ad)",
                        "مراجعة ونشر الحملة",
                        "استراتيجيات التيست",
                        "الميزانية المثالية للمبتدئين",
                        "Checklist قبل ما تنشر",
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-gray-300 leading-relaxed">
                            <span className="w-7 h-7 rounded-full bg-[#C5A04E]/20 text-[#C5A04E] font-bold flex items-center justify-center text-sm shrink-0"
                                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{i + 1}</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════ Section 1 ═══════ */}
            <SectionTitle>1. التجهيز قبل إنشاء الحملة</SectionTitle>
            <Paragraph>قبل ما تصرف سنتيم واحد، تأكد من هاد الحاجات:</Paragraph>

            <div className="space-y-3 mb-6">
                {[
                    "المتجر جاهز 100% (منتج + صور + وصف + دفع + شحن + سياسات)",
                    "صفحة فيسبوك منشأة واحترافية",
                    "مدير الأعمال (Business Manager) منشأ",
                    "حساب إعلاني (Ad Account) مفتوح",
                    "بطاقة الدفع مضافة في حساب الإعلانات",
                    "البيكسل (Pixel) مثبت على المتجر",
                    "المنتج اللي غادي تعلن عليه مختار ومجهز",
                    "الفيديو أو الصور ديال الإعلان جاهزين",
                    "النص الإعلاني مكتوب",
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl px-5 py-3">
                        <span className="text-[#C5A04E] shrink-0">&#x2610;</span>
                        <span className="text-gray-300">{item}</span>
                    </div>
                ))}
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 mb-6">
                <p className="text-red-400 font-bold leading-relaxed">
                    إلى ما درتيش هاد الخطوات، ارجع للمراحل 16 و 17.
                </p>
            </div>

            <Divider />

            {/* ═══════ Section 2 ═══════ */}
            <SectionTitle>2. تثبيت البيكسل (Facebook Pixel)</SectionTitle>

            <SubSubTitle>شنو هو البيكسل؟</SubSubTitle>
            <Paragraph>
                كود صغير كتحطو في المتجر ديالك. كيتبع كل شيء: شكون دخل للمتجر، شكون شاف المنتج، شكون ضاف للسلة، شكون شرى. هاد المعلومات كتستعملها فيسبوك باش تلقى ليك عملاء شبيهين.
            </Paragraph>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3">
                    <span className="text-red-400 font-bold">بلا بيكسل = كتعلن أعمى.</span>
                </div>
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3">
                    <span className="text-green-400 font-bold">مع بيكسل = كتعلن بذكاء.</span>
                </div>
            </div>

            <SubTitle>الخطوة 1: إنشاء البيكسل</SubTitle>
            <BulletList items={[
                "ادخل business.facebook.com",
                "في القائمة اليسرى اضغط على All tools",
                "اضغط على Events Manager",
                "اضغط على Connect data sources (الزر الأخضر)",
                "اختر Web",
                "اختر Facebook Pixel",
                "اضغط Connect",
                'Pixel name: سميه باسم المتجر (مثال: "GlamBeauty Pixel")',
                "Website URL: حط رابط المتجر ديالك",
                "اضغط Continue",
            ]} />

            <SubTitle>الخطوة 2: ربط البيكسل بشوبيفاي</SubTitle>
            <BulletList items={[
                "ارجع للوحة تحكم شوبيفاي",
                "اضغط على Online Store > Preferences",
                "انزل لقسم Facebook Pixel",
                "الصق Pixel ID (رقم البيكسل اللي نسختيه من فيسبوك)",
                "اضغط Save",
            ]} />

            <SubTitle>الطريقة الأحسن (عبر تطبيق Facebook & Instagram)</SubTitle>
            <BulletList items={[
                "في شوبيفاي اضغط Apps > Shopify App Store",
                "قلب على Facebook & Instagram",
                "اضغط Add app > Install app",
                "اضغط Start setup",
                "سجل دخول بحساب فيسبوك ديالك",
                "اختر Business Manager ديالك",
                "اختر Ad Account ديالك",
                "اختر Pixel ديالك",
                "اختر صفحة فيسبوك ديالك",
                "اضغط Complete setup",
            ]} />

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3 mb-6">
                <span className="text-green-400 font-bold">البيكسل مربوط أوتوماتيكياً</span>
            </div>

            <SubTitle>الخطوة 3: التأكد أن البيكسل خدام</SubTitle>
            <BulletList items={[
                "ثبت إضافة Facebook Pixel Helper على Chrome",
                'ادخل Chrome Web Store > قلب على "Facebook Pixel Helper" > Add to Chrome',
                "ادخل للمتجر ديالك",
                "اضغط على أيقونة الإضافة في شريط المتصفح",
                "إلى كان البيكسل خدام غادي تشوف علامة خضراء مع رقم البيكسل",
                "تجول في المتجر: شوف منتج > ضيف للسلة > ابدأ الدفع",
            ]} />

            <SubSubTitle>تأكد أن الأحداث كتبان في Events Manager:</SubSubTitle>
            <GreenList items={[
                "PageView",
                "ViewContent",
                "AddToCart",
                "InitiateCheckout",
            ]} />

            <Divider />

            {/* ═══════ Section 3 ═══════ */}
            <SectionTitle>3. ربط المتجر بفيسبوك</SectionTitle>
            <Paragraph>إلى كنتي ثبتي تطبيق Facebook & Instagram في الخطوة السابقة، هذا خلاص مدار.</Paragraph>

            <SubSubTitle>تأكد أن هاد العناصر مربوطة:</SubSubTitle>
            <Paragraph>ادخل شوبيفاي {'>'} Apps {'>'} Facebook & Instagram وشوف أن كلشي أخضر:</Paragraph>
            <GreenList items={[
                "Facebook account connected",
                "Business Manager connected",
                "Ad account connected",
                "Facebook Pixel connected",
                "Facebook Page connected",
                "Commerce account connected",
                "Data sharing enabled (اختر Maximum للأفضل نتائج)",
            ]} />

            <Divider />

            {/* ═══════ Section 4 ═══════ */}
            <SectionTitle>4. المثال التطبيقي — المنتج اللي غادي نعلنو عليه</SectionTitle>
            <Paragraph>باش يكون الشرح واقعي، غادي نستعملو مثال حقيقي:</Paragraph>

            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <tbody>
                        {[
                            { label: "المنتج", value: "قاطع الخضروات الذكي" },
                            { label: "ثمن الشراء", value: "$7 (منتج $5 + شحن $2)" },
                            { label: "ثمن البيع", value: "$29.99" },
                            { label: "الهامش قبل الإعلان", value: "$22.99" },
                            { label: "السوق المستهدف", value: "المغرب + السعودية" },
                            { label: "الجمهور", value: "نساء 25-55 سنة مهتمات بالطبخ والمطبخ" },
                            { label: "ميزانية التيست", value: "$50 (5 أيام × $10/يوم)" },
                            { label: "الهدف", value: "مبيعات (Conversions)" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.label}</td>
                                <td className="text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10">{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Divider />

            {/* ═══════ Section 5 ═══════ */}
            <SectionTitle>5. إنشاء الحملة (Campaign)</SectionTitle>

            <SubTitle>الدخول لمدير الإعلانات</SubTitle>
            <BulletList items={[
                "ادخل business.facebook.com",
                "في القائمة اليسرى اضغط All tools",
                "اضغط على Ads Manager",
                "اضغط على الزر الأخضر + Create",
            ]} />

            <SubTitle>الخطوة 1: اختيار الهدف (Campaign Objective)</SubTitle>
            <BulletList items={[
                "غادي تبان ليك 6 أهداف",
            ]} />
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3 mb-4">
                <span className="text-green-400 font-bold">اختر Sales (مبيعات) — هذا كيقول لفيسبوك: &quot;قلب ليا على الناس اللي غادي يشريو فعلاً&quot;</span>
            </div>
            <BulletList items={["اضغط Continue"]} />

            <SubTitle>الخطوة 2: إعدادات الحملة</SubTitle>
            <SubSubTitle>Campaign name — سميها باسم واضح:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-4 mb-4">
                <p className="text-gray-400 text-sm mb-1">مثال:</p>
                <p className="text-white font-bold">{`"قاطع الخضروات — مبيعات — تيست 1"`}</p>
                <p className="text-gray-500 text-sm mt-1">القاعدة: [المنتج] — [الهدف] — [رقم التيست]</p>
            </div>
            <BulletList items={[
                "Special ad categories: إلى ما كنتيش كتبيع عقارات أو توظيف أو سياسة، خليها فارغة",
            ]} />
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 mb-4">
                <span className="text-red-400 font-bold">CBO (Campaign budget optimization): أطفيها في البداية — باش تتحكم في الميزانية على مستوى المجموعة الإعلانية</span>
            </div>
            <BulletList items={["اضغط Next"]} />

            <Divider />

            {/* ═══════ Section 6 ═══════ */}
            <SectionTitle>6. إعداد المجموعة الإعلانية (Ad Set)</SectionTitle>
            <Paragraph>هنا كتحدد: شكون غادي يشوف الإعلان ديالك، فين، وبشحال.</Paragraph>

            <SubSubTitle>الاسم:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-4 mb-4">
                <p className="text-gray-400 text-sm mb-1">مثال:</p>
                <p className="text-white font-bold">{`"المغرب — نساء 25-55 — اهتمامات الطبخ"`}</p>
                <p className="text-gray-500 text-sm mt-1">القاعدة: [البلد] — [الجمهور] — [الاستهداف]</p>
            </div>

            <SubTitle>التحويل (Conversion)</SubTitle>
            <BulletList items={[
                "Conversion location: اختر Website",
                "Pixel: اختر البيكسل ديالك",
                'Conversion event: اختر Purchase (شراء) — هذا كيقول لفيسبوك: "قلب ليا على الناس اللي غادي يشريو، ماشي غير يزورو"',
            ]} />

            <SubTitle>الميزانية والجدولة</SubTitle>
            <BulletList items={[
                "Budget: اختر Daily budget",
                "Amount: $10 في اليوم (للتيست)",
                "Start date: اختر اليوم أو غداً",
                "End date: حط 5 أيام من بعد (باش ما تنساش توقفها)",
            ]} />

            <SubTitle>الجمهور (Audience)</SubTitle>

            <SubSubTitle>الموقع الجغرافي:</SubSubTitle>
            <BulletList items={[
                'Locations: اضغط وكتب "Morocco" أو "Saudi Arabia"',
                "اختر People living in this location (الناس اللي ساكنين فيها)",
            ]} />

            <SubSubTitle>العمر والجنس:</SubSubTitle>
            <BulletList items={[
                "Age: 25 - 55",
                "Gender: Women (نساء)",
            ]} />

            <SubSubTitle>الاهتمامات (Detailed Targeting):</SubSubTitle>
            <BulletList items={[
                "اضغط Edit بجانب Detailed targeting",
                "في خانة البحث كتب واحد واحد وزيدهم:",
            ]} />
            <GreenList items={[
                '"Cooking" (الطبخ)',
                '"Kitchen" (المطبخ)',
                '"Recipe" (وصفات)',
                '"Food" (الأكل)',
                '"Home cooking" (الطبخ المنزلي)',
            ]} />
            <BulletList items={["اضغط Save this audience باش تحفظو للمستقبل"]} />

            <SubSubTitle>حجم الجمهور:</SubSubTitle>
            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3">
                    <span className="text-green-400 font-bold">المثالي: بين 1 مليون و 10 مليون</span>
                </div>
            </div>
            <BulletList items={[
                "إلى كان صغير بزاف: وسع الاهتمامات أو العمر",
                "إلى كان كبير بزاف: ضيق الاهتمامات أو الموقع",
            ]} />

            <SubTitle>أماكن العرض (Placements)</SubTitle>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3 mb-4">
                <span className="text-green-400 font-bold">اختر Advantage+ placements (فيسبوك كيختار أحسن الأماكن أوتوماتيكياً)</span>
            </div>
            <Paragraph>أو إلى بغيتي تتحكم: اختر Manual placements وفعل:</Paragraph>
            <GreenList items={[
                "Facebook Feed",
                "Facebook Reels",
                "Instagram Feed",
                "Instagram Reels",
                "Instagram Stories",
            ]} />
            <RedList items={[
                "أطفي باقي الأماكن في البداية",
            ]} />
            <BulletList items={["اضغط Next"]} />

            <Divider />

            {/* ═══════ Section 7 ═══════ */}
            <SectionTitle>7. إنشاء الإعلان (Ad)</SectionTitle>
            <Paragraph>هنا كتصنع المحتوى اللي غادي يشوفوه الناس.</Paragraph>

            <SubSubTitle>الاسم:</SubSubTitle>
            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-4 mb-4">
                <p className="text-gray-400 text-sm mb-1">مثال:</p>
                <p className="text-white font-bold">{`"فيديو 1 — قاطع الخضروات — عربي"`}</p>
                <p className="text-gray-500 text-sm mt-1">القاعدة: [نوع المحتوى] — [المنتج] — [اللغة]</p>
            </div>

            <SubTitle>الهوية (Identity)</SubTitle>
            <BulletList items={[
                "Facebook Page: اختر الصفحة ديالك",
                "Instagram account: اختر حساب إنستغرام ديالك (إلى كان عندك)",
            ]} />

            <SubTitle>إعداد الإعلان (Ad Setup)</SubTitle>
            <BulletList items={[
                "Create ad: اختر هذا الخيار (إنشاء إعلان جديد)",
                "Format: اختر Single image or video",
            ]} />

            <SubTitle>المحتوى (Ad Creative)</SubTitle>
            <SubSubTitle>الفيديو أو الصورة:</SubSubTitle>
            <BulletList items={[
                "اضغط Add media",
                "اختر Add video (الفيديو أحسن بكثير من الصور)",
                "حمل الفيديو ديال المنتج",
                "Thumbnail: اختر أحسن صورة من الفيديو كغلاف",
            ]} />

            <SubSubTitle>مواصفات الفيديو المثالي:</SubSubTitle>
            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <tbody>
                        {[
                            { label: "المدة", value: "15-30 ثانية (الأحسن)" },
                            { label: "النسبة", value: "9:16 (عمودي) للريلز والستوريز / 1:1 (مربع) للفييد" },
                            { label: "الدقة", value: "1080 × 1920 (عمودي) أو 1080 × 1080 (مربع)" },
                            { label: "حجم الملف", value: "أقل من 30 ميغا" },
                            { label: "أول 3 ثواني", value: "خاصهم يجذبو الانتباه — هنا العميل كيقرر واش يكمل يتفرج" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.label}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SubSubTitle>هيكل الفيديو الناجح (15-30 ثانية):</SubSubTitle>
            <StepCard num={1} title='ثانية 1-3: الخطاف (Hook)' items={[
                '"عياتي وأنت كتقطع الخضرة بالسكين؟"',
            ]} />
            <StepCard num={2} title="ثانية 4-10: المشكلة" items={[
                "مشهد شخص كيعاني مع تقطيع الخضرة بالسكين العادي",
            ]} />
            <StepCard num={3} title="ثانية 11-20: الحل" items={[
                "المنتج في الاستعمال — سرعة + سهولة + نتيجة",
            ]} />
            <StepCard num={4} title="ثانية 21-25: المميزات" items={[
                "3 مميزات سريعة مع نص على الفيديو",
            ]} />
            <StepCard num={5} title="ثانية 26-30: الدعوة للشراء" items={[
                '"اطلب الآن — شحن مجاني! الرابط في الوصف"',
            ]} />

            <SubTitle>النص الإعلاني (Primary Text)</SubTitle>

            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <h4 className="text-white font-bold mb-3">مثال بالدارجة المغربية:</h4>
                <div className="text-gray-300 leading-[2] whitespace-pre-line text-sm">
{`عياتي وأنت كتقطع الخضرة بالسكين العادي؟
قاطع الخضروات الذكي غادي يخليك تحضر أي وجبة في أقل من 5 دقائق!

✅ 7 أشكال قطع مختلفة
✅ آمن 100% — حماية للأصابع
✅ سهل التنظيف — كيتغسل في ثواني
✅ حجم صغير — ما كياخذش بلاصة

عرض خاص لمدة محدودة — شحن مجاني!
اطلب دابا قبل ما يسالي`}
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-4">
                <h4 className="text-white font-bold mb-3">مثال بالعربية الفصحى (للسعودية):</h4>
                <div className="text-gray-300 leading-[2] whitespace-pre-line text-sm">
{`هل سئمت من تقطيع الخضروات بالسكين التقليدي؟
قاطع الخضروات الذكي يجعلك تحضر أي وجبة في أقل من 5 دقائق!

✅ 7 أشكال قطع مختلفة
✅ آمن 100% مع حماية مدمجة
✅ سهل التنظيف
✅ حجم صغير لا يأخذ مساحة

عرض لفترة محدودة — شحن مجاني!
اطلب الآن`}
                </div>
            </div>

            <SubSubTitle>باقي الحقول:</SubSubTitle>
            <BulletList items={[
                'Headline: العنوان القصير — مثال: "قاطع الخضروات الذكي — وفر 30 دقيقة كل يوم"',
                'Description: الوصف الإضافي — مثال: "عرض محدود — الكمية محدودة"',
                "Call to Action: اختر Shop Now (تسوق الآن)",
                "Website URL: حط رابط صفحة المنتج في متجرك",
            ]} />

            <SubSubTitle>معاينة الإعلان:</SubSubTitle>
            <Paragraph>على اليمين غادي تشوف كيفاش غادي يبان الإعلان. تأكد أنه كيبان مزيان في:</Paragraph>
            <GreenList items={[
                "Facebook Feed",
                "Instagram Feed",
                "Instagram Stories",
                "Facebook Reels",
            ]} />

            <Divider />

            {/* ═══════ Section 8 ═══════ */}
            <SectionTitle>8. مراجعة ونشر الحملة</SectionTitle>
            <Paragraph>قبل ما تضغط Publish، راجع كلشي:</Paragraph>
            <BulletList items={[
                "اضغط Review في أسفل الصفحة",
                "فيسبوك غادي يوريك ملخص الحملة",
            ]} />

            <SubSubTitle>تأكد من:</SubSubTitle>
            <GreenList items={[
                "الهدف: Sales (مبيعات)",
                "الميزانية: $10/يوم",
                "المدة: 5 أيام",
                "الجمهور: صحيح (البلد + العمر + الجنس + الاهتمامات)",
                "البيكسل: مربوط",
                "حدث التحويل: Purchase",
                "الفيديو/الصورة: كيبان مزيان",
                "النص: بلا أخطاء",
                "الرابط: كيودي لصفحة المنتج الصحيحة",
                "زر CTA: Shop Now",
            ]} />

            <SubTitle>النشر</SubTitle>
            <BulletList items={[
                "إلى كلشي مزيان اضغط Publish",
                "الحملة غادي تدخل لمرحلة In Review (المراجعة)",
                "فيسبوك كيراجع الإعلان — عادة كياخذ بين 15 دقيقة و 24 ساعة",
                "بعد الموافقة الحالة كتولي Active",
                "إلى تم الرفض: غادي يوريك السبب — صححو وعاود أرسلو",
            ]} />

            <SubSubTitle>أسباب الرفض الشائعة:</SubSubTitle>
            <RedList items={[
                "صور قبل/بعد مبالغ فيها",
                "ادعاءات صحية غير مثبتة",
                "محتوى مضلل",
                'نص فيه كلمات ممنوعة ("ضمان 100%" / "أفضل منتج في العالم")',
            ]} />

            <Divider />

            {/* ═══════ Section 9 ═══════ */}
            <SectionTitle>9. استراتيجيات التيست</SectionTitle>

            <SubTitle>الاستراتيجية 1: تيست الجمهور (Audience Testing)</SubTitle>
            <Paragraph>الهدف: تلقى أحسن جمهور. أنشئ 3 مجموعات إعلانية في نفس الحملة، كل وحدة بجمهور مختلف:</Paragraph>

            <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">المجموعة</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الجمهور</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الميزانية</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { set: "Ad Set 1", audience: "نساء 25-45 — اهتمام: الطبخ", budget: "$10/يوم" },
                            { set: "Ad Set 2", audience: "نساء 25-45 — اهتمام: أدوات المطبخ", budget: "$10/يوم" },
                            { set: "Ad Set 3", audience: "نساء 25-55 — اهتمام: وصفات الطبخ", budget: "$10/يوم" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.set}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.audience}</td>
                                <td className="text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{row.budget}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    بعد 3-5 أيام: شوف أي مجموعة جابت أحسن نتائج وزيد الميزانية ديالها.
                </p>
            </div>

            <SubTitle>الاستراتيجية 2: تيست المحتوى (Creative Testing)</SubTitle>
            <Paragraph>الهدف: تلقى أحسن إعلان. أنشئ مجموعة إعلانية وحدة فيها 3 إعلانات مختلفة:</Paragraph>

            <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الإعلان</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">المحتوى</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { ad: "Ad 1", content: "فيديو 15 ثانية — خطاف بالمشكلة" },
                            { ad: "Ad 2", content: "فيديو 30 ثانية — شرح مفصل" },
                            { ad: "Ad 3", content: "صورة Infographic — المميزات مكتوبة" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.ad}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.content}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Paragraph>فيسبوك غادي يعرض الثلاثة ويركز على اللي كيجيب أحسن نتائج أوتوماتيكياً.</Paragraph>

            <SubTitle>الاستراتيجية 3: تيست البلدان (Country Testing)</SubTitle>
            <Paragraph>الهدف: تلقى أحسن سوق.</Paragraph>

            <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">المجموعة</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">البلد</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الميزانية</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { set: "Ad Set 1", country: "المغرب", budget: "$10/يوم" },
                            { set: "Ad Set 2", country: "السعودية", budget: "$10/يوم" },
                            { set: "Ad Set 3", country: "الإمارات", budget: "$10/يوم" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.set}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.country}</td>
                                <td className="text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{row.budget}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Divider />

            {/* ═══════ Section 10 ═══════ */}
            <SectionTitle>10. الميزانية المثالية للمبتدئين</SectionTitle>

            <SubSubTitle>القاعدة الذهبية:</SubSubTitle>
            <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20 mb-6">
                <p className="text-[#C5A04E] font-bold leading-relaxed">
                    ميزانية التيست = 3 × ثمن المنتج × 5 أيام
                </p>
                <p className="text-gray-400 text-sm mt-2">
                    مثال: المنتج ب $30 → 3 × 30 = $90 → 90/5 = $18/يوم
                </p>
            </div>

            <SubSubTitle>سيناريوهات الميزانية:</SubSubTitle>
            <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#C5A04E]/10">
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">الميزانية الإجمالية</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">التقسيم</th>
                            <th className="text-right text-[#C5A04E] font-bold py-3 px-4 border border-[#C5A04E]/20">المدة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { budget: "$50 (الحد الأدنى)", split: "$10/يوم × مجموعة وحدة", duration: "5 أيام" },
                            { budget: "$100 (مقبول)", split: "$10/يوم × مجموعتين", duration: "5 أيام" },
                            { budget: "$150 (مثالي)", split: "$10/يوم × 3 مجموعات", duration: "5 أيام" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                                <td className="text-white font-bold py-3 px-4 border border-[#C5A04E]/10">{row.budget}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.split}</td>
                                <td className="text-gray-400 py-3 px-4 border border-[#C5A04E]/10">{row.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SubSubTitle>متى تزيد الميزانية:</SubSubTitle>
            <GreenList items={[
                "المنتج كيبيع بربح (ROAS أكثر من 2)",
                "تكلفة الشراء (CPA) أقل من هامش الربح",
                "زيد الميزانية ب 20-30% كل يومين (ماشي ضعفها مرة وحدة)",
            ]} />

            <SubSubTitle>متى توقف الحملة:</SubSubTitle>
            <RedList items={[
                "صرفتي ضعف ثمن المنتج بلا ولا بيعة (مثال: صرفتي $60 والمنتج ب $30 وما بعتي والو)",
                "تكلفة الشراء أكبر من هامش الربح",
                "5 أيام بلا نتائج رغم تفاعل مزيان",
            ]} />

            <Divider />

            {/* ═══════ Section 11 — Checklist ═══════ */}
            <SectionTitle>11. Checklist قبل ما تنشر</SectionTitle>

            {[
                {
                    category: "التجهيز",
                    items: [
                        "المتجر جاهز 100%",
                        "البيكسل مثبت وخدام (تأكد بPixel Helper)",
                        "المتجر مربوط بفيسبوك عبر التطبيق",
                        "بطاقة الدفع مضافة في حساب الإعلانات",
                    ],
                },
                {
                    category: "الحملة (Campaign)",
                    items: [
                        "الهدف: Sales",
                        "الاسم واضح ومنظم",
                        "CBO مطفي (في البداية)",
                    ],
                },
                {
                    category: "المجموعة الإعلانية (Ad Set)",
                    items: [
                        "حدث التحويل: Purchase",
                        "الميزانية: $10-20/يوم",
                        "المدة: 5 أيام",
                        "الموقع الجغرافي محدد",
                        "العمر والجنس محددين",
                        "الاهتمامات مضافة",
                        "حجم الجمهور بين 1 مليون و 10 مليون",
                    ],
                },
                {
                    category: "الإعلان (Ad)",
                    items: [
                        "الصفحة الصحيحة مختارة",
                        "الفيديو/الصورة محملة وكتبان مزيان",
                        "أول 3 ثواني في الفيديو جذابة",
                        "النص الإعلاني مكتوب بلا أخطاء",
                        "العنوان قصير وجذاب",
                        "الرابط كيودي لصفحة المنتج الصحيحة",
                        "زر CTA: Shop Now",
                        "المعاينة مزيانة على كل الأماكن",
                    ],
                },
                {
                    category: "بعد النشر",
                    items: [
                        "الحملة في حالة Active",
                        "ما تقيسش على النتائج في أول 24 ساعة (فيسبوك كيتعلم)",
                        "راجع النتائج بعد 48-72 ساعة",
                        "ما تبدلش في الحملة كل يوم (كل تعديل كيرجع فيسبوك للمرحلة ديال التعلم)",
                    ],
                },
            ].map((section, si) => (
                <div key={si} className="mb-6">
                    <SubSubTitle>{section.category}</SubSubTitle>
                    <div className="space-y-2">
                        {section.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl px-5 py-3">
                                <span className="text-[#C5A04E] shrink-0">&#x2610;</span>
                                <span className="text-gray-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <Divider />

            {/* ═══════ Summary ═══════ */}
            <div className="bg-[#C5A04E]/5 border border-[#C5A04E]/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-[#C5A04E] mb-5">الخلاصة</h2>
                <Paragraph>
                    أول حملة ماشي خاصها تجيب أرباح — خاصها تجيب بيانات. البيانات هي اللي غادي تعلمك شنو خدام وشنو ما خدامش. اتبع هاد الخطوات بالضبط وما تستعجلش النتائج. التيست هو المرحلة الأهم.
                </Paragraph>
                <div className="bg-[#C5A04E]/10 rounded-xl p-4 border border-[#C5A04E]/20">
                    <p className="text-[#C5A04E] font-bold leading-relaxed text-center">
                        © Lexmo Academy 2026 — جميع الحقوق محفوظة
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Phase 23 – Lesson 1 : الأرقام الأساسية اللي خاصك تفهمها
   ═══════════════════════════════════════════════════════════════ */
function Phase23AdMetrics() {
    return (
        <div className="p-6 lg:p-8 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
            <h1 className="text-3xl font-bold text-white mb-2">الأرقام الأساسية اللي خاصك تفهمها 📊</h1>
            <p className="text-[#C5A04E] text-lg mb-8">هاد الأرقام هي اللي غادي تعتامد عليها باش تعرف واش الحملة ديالك ناجحة ولا لا</p>

            {/* ═══════ Section 1 — جدول المؤشرات ═══════ */}
            <SectionTitle>جدول المؤشرات الأساسية</SectionTitle>
            <Paragraph>كل رقم عندو معنى وقيمة مثالية خاصك تعرفها:</Paragraph>

            <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border border-[#C5A04E]/10 rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-[#C5A04E]/10 text-[#C5A04E]">
                            <th className="p-3 text-right font-bold">الرقم</th>
                            <th className="p-3 text-right font-bold">الاسم</th>
                            <th className="p-3 text-right font-bold">شنو كيعني</th>
                            <th className="p-3 text-right font-bold">المثالي</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {[
                            ["Impressions", "مرات الظهور", "شحال من مرة بان الإعلان ديالك", "كل ما كثر كل ما كان أحسن"],
                            ["Reach", "الوصول", "شحال من شخص فريد شاف الإعلان", "كل ما كثر كل ما كان أحسن"],
                            ["CPM", "تكلفة الألف ظهور", "شحال كتخلص على 1000 ظهور", "أقل من $15 مزيان"],
                            ["CPC", "تكلفة النقرة", "شحال كتخلص على كل نقرة", "أقل من $1 ممتاز"],
                            ["CTR", "نسبة النقر", "النسبة المئوية ديال الناس اللي نقرو", "أكثر من %2 مزيان"],
                            ["Add to Cart", "الإضافة للسلة", "شحال من واحد ضاف المنتج للسلة", "—"],
                            ["Initiate Checkout", "بداية الدفع", "شحال من واحد بدا عملية الدفع", "—"],
                            ["Purchase", "الشراء", "شحال من واحد شرى فعلاً", "🎯 الهدف!"],
                            ["CPA", "تكلفة الشراء الواحد", "شحال صرفتي باش جبتي بيعة وحدة", "أقل من هامش الربح"],
                            ["ROAS", "العائد على الإنفاق", "شحال رجع ليك مقابل كل دولار صرفتيه", "أكثر من 2 = رابح"],
                            ["Frequency", "التكرار", "شحال من مرة نفس الشخص شاف الإعلان", "أقل من 3 مزيان"],
                        ].map(([key, name, meaning, ideal], i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-[#1A1A1A]" : "bg-[#111]"}>
                                <td className="p-3 font-mono text-[#C5A04E] font-bold">{key}</td>
                                <td className="p-3 font-bold text-white">{name}</td>
                                <td className="p-3">{meaning}</td>
                                <td className="p-3 text-green-400">{ideal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Divider />

            {/* ═══════ Section 2 — شرح المؤشرات المهمة ═══════ */}
            <SectionTitle>📌 شرح المؤشرات المهمة</SectionTitle>

            {/* 1 — Impressions */}
            <SubTitle>1️⃣ Impressions — مرات الظهور</SubTitle>
            <BulletList items={[
                "شحال من مرة بان الإعلان ديالك للناس",
                "شخص واحد يقدر يشوف الإعلان أكثر من مرة",
                "كل ما كثر العدد كل ما كان أحسن",
            ]} />

            {/* 2 — Reach */}
            <SubTitle>2️⃣ Reach — الوصول</SubTitle>
            <BulletList items={[
                "شحال من شخص فريد شاف الإعلان ديالك",
                "الفرق مع Impressions: الوصول كيحسب كل شخص مرة وحدة فقط",
                "كل ما كثر كل ما كان أحسن",
            ]} />

            {/* 3 — CPM */}
            <SubTitle>3️⃣ CPM — تكلفة الألف ظهور</SubTitle>
            <Paragraph>شحال كتخلص على كل 1000 ظهور</Paragraph>
            <GreenList items={["أقل من $15 = مزيان"]} />
            <RedList items={["أكثر من $15 = غالي — خاصك تراجع الاستهداف"]} />

            {/* 4 — CPC */}
            <SubTitle>4️⃣ CPC — تكلفة النقرة</SubTitle>
            <Paragraph>شحال كتخلص على كل نقرة على الإعلان</Paragraph>
            <GreenList items={["أقل من $1 = ممتاز"]} />
            <RedList items={["أكثر من $2 = غالي — خاصك تحسن الإعلان"]} />

            {/* 5 — CTR */}
            <SubTitle>5️⃣ CTR — نسبة النقر</SubTitle>
            <Paragraph>النسبة المئوية ديال الناس اللي نقرو على الإعلان من بين اللي شافوه</Paragraph>
            <GreenList items={["أكثر من %2 = مزيان"]} />
            <RedList items={["أقل من %1 = الإعلان ما كيجذبش — خاصك تبدل المحتوى"]} />

            {/* 6 — Add to Cart */}
            <SubTitle>6️⃣ Add to Cart — الإضافة للسلة</SubTitle>
            <BulletList items={[
                "شحال من واحد ضاف المنتج للسلة",
                "هذا كيعني عندو اهتمام بالمنتج",
            ]} />

            {/* 7 — Initiate Checkout */}
            <SubTitle>7️⃣ Initiate Checkout — بداية الدفع</SubTitle>
            <BulletList items={[
                "شحال من واحد بدا عملية الدفع",
                "إلى كان هاد الرقم مزيان ولكن ما كيشريوش = مشكل في صفحة الدفع",
            ]} />

            {/* 8 — Purchase */}
            <SubTitle>8️⃣ Purchase — الشراء 🎯</SubTitle>
            <BulletList items={[
                "شحال من واحد شرى فعلاً",
                "هذا هو الهدف النهائي ديال أي حملة",
            ]} />

            {/* 9 — CPA */}
            <SubTitle>9️⃣ CPA (Cost per Purchase) — تكلفة الشراء الواحد</SubTitle>
            <Paragraph>شحال صرفتي باش جبتي بيعة وحدة</Paragraph>
            <GreenList items={["خاصو يكون أقل من هامش الربح ديالك"]} />

            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-6 space-y-3">
                <p className="text-sm font-bold text-[#C5A04E] mb-2">أمثلة عملية:</p>
                <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-400 mt-1 shrink-0">✅</span>
                    <span>إلى هامش الربح ديالك 20$ و CPA = 15$ → رابح 5$ على كل بيعة</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-red-400 mt-1 shrink-0">❌</span>
                    <span>إلى هامش الربح ديالك 20$ و CPA = 25$ → خاسر 5$ على كل بيعة</span>
                </div>
            </div>

            {/* 10 — ROAS */}
            <SubTitle>🔟 ROAS — العائد على الإنفاق</SubTitle>
            <Paragraph>شحال رجع ليك مقابل كل دولار صرفتيه في الإعلانات</Paragraph>
            <GreenList items={["أكثر من 2 = رابح (كل دولار صرفتيه رجع ليك 2 دولار أو أكثر)"]} />
            <RedList items={["أقل من 1 = خاسر (كتصرف أكثر من اللي كتربح)"]} />

            {/* 11 — Frequency */}
            <SubTitle>1️⃣1️⃣ Frequency — التكرار</SubTitle>
            <Paragraph>شحال من مرة نفس الشخص شاف الإعلان ديالك</Paragraph>
            <GreenList items={["أقل من 3 = مزيان"]} />
            <RedList items={["أكثر من 4 = الناس بداو يملو من الإعلان — خاصك تبدل المحتوى أو توسع الجمهور"]} />

            <Divider />

            {/* ═══════ الخلاصة ═══════ */}
            <div className="bg-gradient-to-br from-[#C5A04E]/10 to-transparent border border-[#C5A04E]/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-[#C5A04E] mb-3">📌 الخلاصة</h3>
                <Paragraph>
                    هاد الأرقام هي البوصلة ديالك. ما تطلقش حملة إعلانية بلا ما تفهمهم. كل رقم كيعطيك معلومة مهمة على شنو خاصك تصلح باش تحسن النتائج ديالك.
                </Paragraph>
            </div>

            <Divider />
            <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                    © Lexmo Academy 2026 — جميع الحقوق محفوظة
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Phase 23 – Lesson 2 : كيفاش تقرا لوحة التحكم
   ═══════════════════════════════════════════════════════════════ */
function Phase23DashboardReading() {
    return (
        <div className="p-6 lg:p-8 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
            <h1 className="text-3xl font-bold text-white mb-2">كيفاش تقرا لوحة التحكم 🖥️</h1>
            <p className="text-[#C5A04E] text-lg mb-8">تعلم تقرا الأرقام من الأعلى للأسفل باش تاخد القرارات الصحيحة</p>

            {/* ═══════ Section 1 — الدخول ═══════ */}
            <SectionTitle>الدخول للوحة التحكم</SectionTitle>

            <StepCard num={1} title="ادخل business.facebook.com" items={["افتح المتصفح وادخل للرابط"]} />
            <StepCard num={2} title="اضغط على Ads Manager" items={["من القائمة الجانبية اختار مدير الإعلانات"]} />
            <StepCard num={3} title="غادي تشوف 3 مستويات" items={["الحملات → المجموعات الإعلانية → الإعلانات"]} />

            <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border border-[#C5A04E]/10 rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-[#C5A04E]/10 text-[#C5A04E]">
                            <th className="p-3 text-right font-bold">المستوى</th>
                            <th className="p-3 text-right font-bold">الاسم</th>
                            <th className="p-3 text-right font-bold">شنو كيوريك</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        <tr className="bg-[#1A1A1A]">
                            <td className="p-3 font-bold text-white">المستوى 1</td>
                            <td className="p-3 font-mono text-[#C5A04E]">Campaigns (الحملات)</td>
                            <td className="p-3">الصورة الكبيرة — الأداء العام ديال كل حملة</td>
                        </tr>
                        <tr className="bg-[#111]">
                            <td className="p-3 font-bold text-white">المستوى 2</td>
                            <td className="p-3 font-mono text-[#C5A04E]">Ad Sets (المجموعات الإعلانية)</td>
                            <td className="p-3">التفاصيل — أداء كل جمهور على حدا</td>
                        </tr>
                        <tr className="bg-[#1A1A1A]">
                            <td className="p-3 font-bold text-white">المستوى 3</td>
                            <td className="p-3 font-mono text-[#C5A04E]">Ads (الإعلانات)</td>
                            <td className="p-3">الأداء الفردي — أداء كل إعلان على حدا</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Divider />

            {/* ═══════ Section 2 — كيفاش تقرا النتائج ═══════ */}
            <SectionTitle>كيفاش تقرا النتائج — الترتيب الصحيح</SectionTitle>

            {/* الخطوة 1 */}
            <SubTitle>الخطوة 1: ابدأ من Campaigns (الحملات) 📊</SubTitle>
            <Paragraph>هنا كتشوف الصورة الكبيرة:</Paragraph>
            <BulletList items={[
                "شحال صرفتي إجمالياً",
                "شحال من بيعة جابت الحملة",
                "ROAS ديال الحملة كاملة",
            ]} />
            <GreenList items={["إلى الحملة كتربح → نزل للتفاصيل"]} />
            <RedList items={["إلى الحملة خاسرة بزاف → وقفها ما تضيعش الوقت"]} />

            {/* الخطوة 2 */}
            <SubTitle>الخطوة 2: انزل ل Ad Sets (المجموعات الإعلانية) 🎯</SubTitle>
            <Paragraph>هنا كتشوف أي جمهور أحسن. قارن بين المجموعات:</Paragraph>
            <BulletList items={[
                "أي جمهور عندو أقل CPA (تكلفة الشراء)؟",
                "أي جمهور عندو أحسن CTR (نسبة النقر)؟",
                "أي جمهور عندو أحسن ROAS (العائد على الإنفاق)؟",
            ]} />
            <GreenList items={["المجموعة اللي كتجيب نتائج → زيد الميزانية ديالها"]} />
            <RedList items={["المجموعة اللي ما كتجيبش نتائج → وقفها"]} />

            {/* الخطوة 3 */}
            <SubTitle>الخطوة 3: انزل ل Ads (الإعلانات) 🎬</SubTitle>
            <Paragraph>هنا كتشوف أي إعلان أحسن. قارن بين الإعلانات:</Paragraph>
            <BulletList items={[
                "أي فيديو/صورة جابت أكثر نقرات؟",
                "أي نص إعلاني جاب أكثر مبيعات؟",
                "أي إعلان عندو أحسن CTR؟",
            ]} />
            <GreenList items={["الإعلان اللي كيجيب نتائج → خليه خدام"]} />
            <RedList items={["الإعلان اللي ما كيجيبش نتائج → وقفو وجرب محتوى جديد"]} />

            <Divider />

            {/* ═══════ Section 3 — ملخص ═══════ */}
            <SectionTitle>📌 ملخص طريقة القراءة</SectionTitle>

            <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border border-[#C5A04E]/10 rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-[#C5A04E]/10 text-[#C5A04E]">
                            <th className="p-3 text-right font-bold">الترتيب</th>
                            <th className="p-3 text-right font-bold">المستوى</th>
                            <th className="p-3 text-right font-bold">السؤال اللي كتجاوب عليه</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        <tr className="bg-[#1A1A1A]">
                            <td className="p-3 text-[#C5A04E] font-bold">1️⃣</td>
                            <td className="p-3 font-mono font-bold text-white">Campaigns</td>
                            <td className="p-3">واش الحملة ككل رابحة ولا خاسرة؟</td>
                        </tr>
                        <tr className="bg-[#111]">
                            <td className="p-3 text-[#C5A04E] font-bold">2️⃣</td>
                            <td className="p-3 font-mono font-bold text-white">Ad Sets</td>
                            <td className="p-3">أي جمهور كيجيب أحسن نتائج؟</td>
                        </tr>
                        <tr className="bg-[#1A1A1A]">
                            <td className="p-3 text-[#C5A04E] font-bold">3️⃣</td>
                            <td className="p-3 font-mono font-bold text-white">Ads</td>
                            <td className="p-3">أي إعلان كيجيب أحسن نتائج؟</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Divider />

            {/* ═══════ Section 4 — نصائح مهمة ═══════ */}
            <SectionTitle>⚠️ نصائح مهمة</SectionTitle>

            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-6 space-y-4">
                <div className="flex items-start gap-3 text-gray-300">
                    <span className="shrink-0">🕐</span>
                    <span>ما تقيسش النتائج في أول 24 ساعة — فيسبوك كيتعلم</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                    <span className="shrink-0">📊</span>
                    <span>أول قراءة حقيقية ديرها بعد 48-72 ساعة</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                    <span className="shrink-0">🔄</span>
                    <span>ما تبدلش في الحملة كل يوم — كل تعديل كيرجع فيسبوك لمرحلة التعلم</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                    <span className="shrink-0">📝</span>
                    <span>سجل الأرقام كل يوم في ملف Excel أو Google Sheets باش تتبع التطور</span>
                </div>
            </div>

            <Divider />

            {/* ═══════ الخلاصة ═══════ */}
            <div className="bg-gradient-to-br from-[#C5A04E]/10 to-transparent border border-[#C5A04E]/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-[#C5A04E] mb-3">📌 الخلاصة</h3>
                <Paragraph>
                    لوحة التحكم هي المرآة ديال الحملة ديالك. تعلم تقراها من الأعلى (الحملة) للأسفل (الإعلانات) باش تعرف فين المشكل وفين الفرصة. القرارات ديالك خاصهم يكونو مبنيين على الأرقام ماشي على الإحساس.
                </Paragraph>
            </div>

            <Divider />
            <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                    © Lexmo Academy 2026 — جميع الحقوق محفوظة
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Phase 23 – Lesson 3 : تخصيص الأعمدة (Customize Columns)
   ═══════════════════════════════════════════════════════════════ */
function Phase23CustomizeColumns() {
    return (
        <div className="p-6 lg:p-8 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin" dir="rtl">
            <h1 className="text-3xl font-bold text-white mb-2">تخصيص الأعمدة (Customize Columns) ⚙️</h1>
            <p className="text-[#C5A04E] text-lg mb-8">خصص لوحة التحكم ديالك باش تشوف غير الأرقام اللي كتحتاج</p>

            {/* ═══════ Section 1 — علاش ═══════ */}
            <SectionTitle>علاش خاصك تخصص الأعمدة؟</SectionTitle>
            <Paragraph>
                الأعمدة الافتراضية في Ads Manager ما كتكفيش. ما كتوريكش الأرقام المهمة اللي خاصك تراقبها. خاصك تضيف الأعمدة اللي كتعطيك الصورة الكاملة على أداء الحملة ديالك.
            </Paragraph>

            <Divider />

            {/* ═══════ Section 2 — خطوات التخصيص ═══════ */}
            <SectionTitle>خطوات التخصيص</SectionTitle>

            <SubTitle>الخطوة 1: الوصول للإعدادات</SubTitle>
            <StepCard num={1} title="ادخل Ads Manager" items={["افتح مدير الإعلانات من business.facebook.com"]} />
            <StepCard num={2} title="اضغط على Columns" items={["فوق الجدول على اليمين"]} />
            <StepCard num={3} title="اضغط على Customize columns" items={["غادي تفتح ليك نافذة التخصيص"]} />

            <SubTitle>الخطوة 2: إضافة الأعمدة بالترتيب</SubTitle>
            <Paragraph>ابحث وأضف هاد الأعمدة بهاد الترتيب بالضبط:</Paragraph>

            <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border border-[#C5A04E]/10 rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-[#C5A04E]/10 text-[#C5A04E]">
                            <th className="p-3 text-right font-bold">الترتيب</th>
                            <th className="p-3 text-right font-bold">العمود</th>
                            <th className="p-3 text-right font-bold">علاش مهم</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {[
                            ["1", "Amount spent", "شحال صرفتي"],
                            ["2", "Impressions", "شحال من ظهور"],
                            ["3", "Reach", "شحال من شخص وصلتيه"],
                            ["4", "Frequency", "شحال من مرة نفس الشخص شاف الإعلان"],
                            ["5", "CPM", "تكلفة 1000 ظهور"],
                            ["6", "Link clicks", "عدد النقرات على الرابط"],
                            ["7", "CPC (cost per link click)", "تكلفة النقرة"],
                            ["8", "CTR (link click-through rate)", "نسبة النقر"],
                            ["9", "Add to cart", "عدد الإضافات للسلة"],
                            ["10", "Cost per add to cart", "تكلفة كل إضافة للسلة"],
                            ["11", "Initiate checkout", "عدد بدايات الدفع"],
                            ["12", "Purchases", "عدد المبيعات"],
                            ["13", "Cost per purchase", "تكلفة البيعة الوحدة"],
                            ["14", "Purchase conversion value", "قيمة المبيعات"],
                            ["15", "ROAS", "العائد على الإنفاق"],
                        ].map(([num, col, why], i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-[#1A1A1A]" : "bg-[#111]"}>
                                <td className="p-3 text-[#C5A04E] font-bold text-center">{num}</td>
                                <td className="p-3 font-mono font-bold text-white">{col}</td>
                                <td className="p-3">{why}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SubTitle>الخطوة 3: حفظ الإعدادات</SubTitle>
            <StepCard num={1} title='اضغط Save as preset' items={["باش تحفظ الأعمدة ديالك"]} />
            <StepCard num={2} title='سميها "My Dashboard"' items={["اختار اسم سهل تتعرف عليه"]} />
            <StepCard num={3} title="اضغط Apply" items={["غادي يتطبق التخصيص مباشرة"]} />

            <div className="bg-[#1A1A1A] border border-green-500/20 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-400 mt-1 shrink-0">✅</span>
                    <span>دابا كل مرة تدخل Ads Manager غادي تلقى الأعمدة ديالك جاهزة — ما خاصكش تعاود تضيفها كل مرة.</span>
                </div>
            </div>

            <Divider />

            {/* ═══════ Section 3 — شنو كتوريك كل مجموعة ═══════ */}
            <SectionTitle>📌 شنو كتوريك كل مجموعة ديال الأعمدة</SectionTitle>

            {/* أعمدة الوصول */}
            <SubTitle>🔵 أعمدة الوصول (1-5)</SubTitle>
            <Paragraph>كتوريك شحال من ناس شافو الإعلان وبشحال:</Paragraph>
            <BulletList items={[
                "Amount spent → الميزانية اللي صرفتي",
                "Impressions + Reach → الانتشار ديال الإعلان",
                "Frequency → واش الناس بداو يملو من الإعلان",
                "CPM → واش كتخلص بزاف على الظهور",
            ]} />

            {/* أعمدة التفاعل */}
            <SubTitle>🟢 أعمدة التفاعل (6-8)</SubTitle>
            <Paragraph>كتوريك واش الناس كينقرو على الإعلان:</Paragraph>
            <BulletList items={[
                "Link clicks → شحال نقرو",
                "CPC → شحال كتخلص على كل نقرة",
                "CTR → واش الإعلان كيجذب الناس",
            ]} />

            {/* أعمدة التحويل */}
            <SubTitle>🟡 أعمدة التحويل (9-11)</SubTitle>
            <Paragraph>كتوريك واش الناس كيكملو مسار الشراء:</Paragraph>
            <BulletList items={[
                "Add to cart → كاينين ناس مهتمين",
                "Cost per add to cart → بشحال كتجيب كل واحد مهتم",
                "Initiate checkout → كاينين ناس قراب يشريو",
            ]} />

            {/* أعمدة المبيعات */}
            <SubTitle>🔴 أعمدة المبيعات (12-15)</SubTitle>
            <Paragraph>كتوريك النتيجة النهائية — الفلوس:</Paragraph>
            <BulletList items={[
                "Purchases → شحال من بيعة",
                "Cost per purchase → تكلفة كل بيعة",
                "Purchase conversion value → مجموع المبيعات",
                "ROAS → واش رابح ولا خاسر",
            ]} />

            <Divider />

            {/* ═══════ Section 4 — نصيحة مهمة ═══════ */}
            <SectionTitle>⚠️ نصيحة مهمة</SectionTitle>

            <div className="bg-[#1A1A1A] border border-[#C5A04E]/10 rounded-xl p-5 mb-6 space-y-4">
                <div className="flex items-start gap-3 text-gray-300">
                    <span className="shrink-0">💡</span>
                    <span>هاد الترتيب ديال الأعمدة ماشي عشوائي — كيتبع مسار العميل من الظهور حتى الشراء</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                    <span className="shrink-0">📊</span>
                    <span>كل مرة كتحلل حملة، قراها من اليمين لليسار (من Amount spent حتى ROAS)</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                    <span className="shrink-0">🔄</span>
                    <span>هاد الأعمدة كتبقى محفوظة — ما خاصكش تعاودها كل مرة</span>
                </div>
            </div>

            <Divider />

            {/* ═══════ الخلاصة ═══════ */}
            <div className="bg-gradient-to-br from-[#C5A04E]/10 to-transparent border border-[#C5A04E]/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-[#C5A04E] mb-3">📌 الخلاصة</h3>
                <Paragraph>
                    تخصيص الأعمدة هو أول حاجة خاصك ديرها قبل ما تبدا تحلل أي حملة. بلا هاد الأعمدة غادي تكون كتشوف أرقام ما كتنفعكش. حفظها مرة وحدة واستعملها ديما.
                </Paragraph>
            </div>

            <Divider />
            <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                    © Lexmo Academy 2026 — جميع الحقوق محفوظة
                </p>
            </div>
        </div>
    );
}

/* ─── Router ─── */
const CONTENT_MAP: Record<string, () => React.ReactElement> = {
    phase5_product_research: Phase5ProductResearch,
    phase11_shopify_guide: Phase11ShopifyGuide,
    phase12_import_product: Phase12ImportProduct,
    phase13_store_design: Phase13StoreDesign,
    phase14_essential_apps: Phase14EssentialApps,
    phase22_ad_campaign: Phase22AdCampaign,
    phase23_ad_metrics: Phase23AdMetrics,
    phase23_dashboard_reading: Phase23DashboardReading,
    phase23_customize_columns: Phase23CustomizeColumns,
};

export default function LessonContentRenderer({ contentKey }: { contentKey: string }) {
    const Component = CONTENT_MAP[contentKey];
    if (!Component) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-xl text-gray-500">المحتوى غير متوفر</p>
            </div>
        );
    }
    return <Component />;
}
