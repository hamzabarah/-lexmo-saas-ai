"use client";

import { useState, useTransition } from "react";
// import { resetPassword } from "../actions"; // No longer used
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Card from "@/app/components/dashboard/Card";

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        // Use Client-Side Supabase to ensure PKCE Verifier cookie is set in browser
        const supabase = createClient();

        startTransition(async () => {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                // Direct redirect to the generic verification page (skipping the server-side route.ts)
                redirectTo: `${window.location.origin}/auth/verify?next=/dashboard/reset-password`,
            });

            if (error) {
                setError("Impossible d'envoyer l'email. Vérifiez votre adresse.");
                console.error(error);
            } else {
                setSuccess(true);
            }
        });
    };

    return (
        <Card className="w-full">
            <Link href="/#login" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors text-sm">
                <ArrowLeft size={16} />
                عودة لتسجيل الدخول
            </Link>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">نسيت كلمة المرور؟ 🔒</h2>
            <p className="text-center text-gray-500 mb-8 text-sm">أدخل بريدك الإلكتروني لاستعادة حسابك</p>

            {success ? (
                <div className="text-center bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-green-400 mb-2">تم الإرسال بنجاح!</h3>
                    <p className="text-sm text-gray-600">
                        راجع بريدك الإلكتروني واتبع الرابط لإعادة تعيين كلمة المرور.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="name@example.com"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#1E3A8A] transition-colors"
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-bold">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-black font-bold py-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : "إرسال رابط الاستعادة"}
                    </button>
                </form>
            )}
        </Card>
    );
}
