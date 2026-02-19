"use client";

import { updatePassword } from "@/app/(auth)/actions";
import { useState, useTransition } from "react";
import { Loader2, CheckCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("كلمات المرور غير متطابقة");
            return;
        }

        startTransition(async () => {
            const result = await updatePassword(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/dashboard");
                }, 3000);
            }
        });
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto pt-20 px-4">
                <div className="text-center bg-green-50 border border-green-200 rounded-xl p-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-600 mb-2">تم تغيير كلمة المرور بنجاح!</h3>
                    <p className="text-[#64607A]">
                        تم تحديث كلمة المرور الخاصة بك.<br />
                        جاري تحويلك إلى لوحة التحكم...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto pt-20 px-4">
            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2 font-orbitron text-right">كلمة مرور جديدة</h1>
            <p className="text-[#64607A] mb-8 text-right">اختر كلمة مرور جديدة وآمنة لحسابك.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#64607A] block text-right">كلمة المرور الجديدة</label>
                        <div className="relative">
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full bg-[#F5F1EB] border border-[#E8E0D4] rounded-xl px-4 py-3 pl-10 text-right focus:outline-none focus:border-[#C9A84C] transition-colors text-[#1A1A2E]"
                                dir="rtl"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64607A]" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#64607A] block text-right">تأكيد كلمة المرور</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full bg-[#F5F1EB] border border-[#E8E0D4] rounded-xl px-4 py-3 pl-10 text-right focus:outline-none focus:border-[#C9A84C] transition-colors text-[#1A1A2E]"
                                dir="rtl"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64607A]" size={18} />
                        </div>
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
                    className="w-full bg-gradient-to-r from-[#C9A84C] to-[#B8860B] hover:from-[#B8860B] hover:to-[#C9A84C] text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : "حفظ كلمة المرور"}
                </button>
            </form>
        </div>
    );
}
