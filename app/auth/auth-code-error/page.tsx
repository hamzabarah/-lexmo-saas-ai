import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function AuthErrorPage({ searchParams }: { searchParams: { error?: string } }) {
    const errorMessage = searchParams?.error;

    return (
        <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md mx-auto p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold font-orbitron">خطأ في الرابط</h1>

                {errorMessage && (
                    <div className="p-3 my-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm font-mono break-all dir-ltr text-left">
                        Error: {decodeURIComponent(errorMessage)}
                    </div>
                )}

                <p className="text-gray-400 text-sm leading-relaxed">
                    الرابط الذي استخدمته غير صالح أو منتهي الصلاحية. يحدث هذا عادةً إذا:
                </p>

                <ul className="text-right text-gray-400 text-sm space-y-2 list-disc list-inside bg-black/20 p-4 rounded-lg">
                    <li>تم استخدام الرابط بالفعل</li>
                    <li>انتهت صلاحية الرابط (صالح لمدة ساعة واحدة)</li>
                    <li>لم يتم نسخ الرابط بالكامل</li>
                </ul>

                <div className="pt-4">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors w-full justify-center"
                    >
                        <ArrowRight size={18} />
                        العودة لتسجيل الدخول
                    </Link>
                </div>
            </div>
        </div>
    );
}
