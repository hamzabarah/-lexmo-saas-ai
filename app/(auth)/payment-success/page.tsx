import { CheckCircle, Mail } from 'lucide-react';

export default function PaymentSuccessPage() {
    const adminEmail = 'academyfrance75@gmail.com';
    const emailSubject = 'طلب تفعيل حساب - فاتورة مرفقة';

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-8 md:p-12 text-center">
                    {/* Success Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        تم استلام دفعتك بنجاح! 🎉
                    </h1>

                    {/* Thank You Message */}
                    <p className="text-2xl text-gray-400 mb-8">
                        شكراً لثقتك بنا!
                    </p>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

                    {/* Instructions */}
                    <p className="text-xl text-gray-400 mb-6" dir="rtl">
                        لتفعيل حسابك، يرجى إرسال فاتورة الدفع إلى البريد الإلكتروني التالي:
                    </p>

                    {/* Email Display - Large and Prominent */}
                    <a
                        href={`mailto:${adminEmail}`}
                        className="inline-block text-3xl md:text-4xl font-bold text-[#C5A04E] hover:text-[#D4B85C] font-mono mb-8 transition-colors underline decoration-2 underline-offset-8"
                    >
                        {adminEmail}
                    </a>

                    {/* Send Email Button */}
                    <div className="mb-8">
                        <a
                            href={`mailto:${adminEmail}?subject=${encodeURIComponent(emailSubject)}`}
                            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] hover:from-[#D4B85C] hover:to-[#8d40ab] text-white font-bold px-10 py-5 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-700/25 hover:shadow-yellow-700/40 hover:scale-105 text-lg"
                        >
                            <Mail className="w-6 h-6" />
                            <span>إرسال الفاتورة عبر البريد</span>
                        </a>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

                    {/* Footer Message */}
                    <p className="text-gray-500 text-sm" dir="rtl">
                        سنقوم بإرسال كود الدخول الخاص بك خلال 24 ساعة
                    </p>
                </div>
            </div>
        </div>
    );
}
