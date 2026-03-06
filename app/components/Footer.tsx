export default function Footer() {
    return (
        <footer className="py-12 border-t border-[#C5A04E]/10 bg-[#0A0A0A]">
            <div className="container mx-auto px-4">
                {/* Legal Links */}
                <div className="flex flex-wrap justify-center gap-6 mb-6" dir="rtl">
                    <a
                        href="/legal/terms"
                        className="text-gray-500 hover:text-white transition-colors text-sm font-cairo"
                    >
                        الشروط العامة
                    </a>
                    <span className="text-gray-400">•</span>
                    <a
                        href="/legal/privacy"
                        className="text-gray-500 hover:text-white transition-colors text-sm font-cairo"
                    >
                        سياسة الخصوصية
                    </a>
                    <span className="text-gray-400">•</span>
                    <a
                        href="/legal/refund"
                        className="text-gray-500 hover:text-white transition-colors text-sm font-cairo"
                    >
                        سياسة الاسترداد
                    </a>
                </div>

                {/* Contact */}
                <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm font-cairo" dir="rtl">
                        للاتصال: <a href="mailto:acadmyfrance75@gmail.com" className="text-[#C5A04E] hover:underline">acadmyfrance75@gmail.com</a>
                    </p>
                </div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-gray-500 text-sm font-cairo" dir="rtl">
                        © 2026 ECOMY - جميع الحقوق محفوظة
                    </p>
                    <p className="text-gray-400 text-xs mt-2 font-cairo" dir="rtl">
                        من الصفر إلى €10,000 شهرياً | بدون إظهار وجهك
                    </p>
                </div>
            </div>
        </footer>
    );
}

