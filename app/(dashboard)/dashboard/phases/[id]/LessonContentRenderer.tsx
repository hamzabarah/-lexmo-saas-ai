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

/* ─── Router ─── */
const CONTENT_MAP: Record<string, () => React.ReactElement> = {
    phase5_product_research: Phase5ProductResearch,
    phase11_shopify_guide: Phase11ShopifyGuide,
    phase12_import_product: Phase12ImportProduct,
    phase13_store_design: Phase13StoreDesign,
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
