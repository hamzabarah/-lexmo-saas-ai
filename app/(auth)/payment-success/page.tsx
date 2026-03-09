import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata = {
    title: "تم تفعيل حسابك - ECOMY",
};

export default function PaymentSuccessPage() {
    return (
        <div className="max-w-lg w-full text-center">
            {/* Success Card */}
            <div className="bg-[#111111] border border-[#C5A04E]/15 rounded-2xl p-10 shadow-lg shadow-[#C5A04E]/5">
                {/* Check icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#008060]/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-[#008060]" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                    🎉 تهانينا! تم تفعيل حسابك بنجاح
                </h2>

                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    تم إرسال تفاصيل الوصول إلى بريدك الإلكتروني
                </p>

                {/* CTA Button */}
                <Link
                    href="/login"
                    className="inline-block bg-[#008060] hover:bg-[#006e52] text-white font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#008060]/20 hover:shadow-[#008060]/30"
                >
                    ابدأ التعلم الآن
                </Link>
            </div>

            {/* Support */}
            <p className="mt-8 text-gray-500 text-sm">
                إذا كان لديك أي سؤال، تواصل معنا على{" "}
                <a href="mailto:lexmoacadmy@gmail.com" className="text-[#C5A04E] hover:underline">
                    lexmoacadmy@gmail.com
                </a>
            </p>
        </div>
    );
}
