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

/* ─── Router ─── */
const CONTENT_MAP: Record<string, () => React.ReactElement> = {
    phase5_product_research: Phase5ProductResearch,
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
