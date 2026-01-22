import Link from 'next/link';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
    const adminEmail = 'academyfrance75@gmail.com';

    return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 md:p-12 text-center">
                    {/* Success Message in Arabic */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        تم استلام دفعتك بنجاح!
                    </h1>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

                    {/* Instructions */}
                    <div className="space-y-6 text-gray-300 text-lg leading-relaxed mb-8" dir="rtl">
                        <p>
                            شكراً لثقتك بنا! لقد تم استلام دفعتك بنجاح.
                        </p>

                        <p className="text-yellow-400 font-semibold">
                            الخطوات التالية:
                        </p>

                        <ol className="list-decimal list-inside space-y-3 text-right">
                            <li>قم بإنشاء حسابك على المنصة</li>
                            <li>تواصل معنا عبر البريد الإلكتروني لتفعيل اشتراكك</li>
                            <li>سنقوم بتفعيل حسابك خلال 24 ساعة كحد أقصى</li>
                        </ol>

                        <p className="text-sm text-gray-400 mt-6">
                            بمجرد تفعيل حسابك، ستتمكن من الوصول إلى جميع محتويات البرنامج
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {/* Create Account Button */}
                        <Link
                            href="/register"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                        >
                            <span>إنشاء حساب</span>
                            <ArrowRight className="w-5 h-5 rotate-180" />
                        </Link>

                        {/* Contact Admin Button */}
                        <a
                            href={`mailto:${adminEmail}?subject=طلب تفعيل الاشتراك&body=مرحباً، لقد أتممت الدفع وأرغب في تفعيل اشتراكي.%0D%0A%0D%0Aالبريد الإلكتروني المستخدم في التسجيل: `}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 border border-gray-700 hover:border-gray-600 hover:scale-105"
                        >
                            <Mail className="w-5 h-5" />
                            <span>تواصل معنا للتفعيل</span>
                        </a>
                    </div>

                    {/* Admin Email Display */}
                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <p className="text-sm text-gray-400 mb-2">البريد الإلكتروني للتواصل:</p>
                        <a
                            href={`mailto:${adminEmail}`}
                            className="text-blue-400 hover:text-blue-300 font-mono text-sm md:text-base transition-colors"
                        >
                            {adminEmail}
                        </a>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    إذا كانت لديك أي أسئلة، لا تتردد في التواصل معنا
                </p>
            </div>
        </div>
    );
}
