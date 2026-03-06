"use client";

import { useState, useTransition } from "react";
import { login } from "../actions";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import Card from "@/app/components/dashboard/Card";

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <Card className="w-full">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">تسجيل الدخول</h2>
            <p className="text-center text-gray-500 mb-8 text-sm">أدخل بياناتك للوصول إلى التدريب</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                    <div className="relative">
                        <input name="email" type="email" required placeholder="email@example.com" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#1E3A8A] transition-colors" />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">كلمة المرور</label>
                    <div className="relative">
                        <input name="password" type="password" required placeholder="أدخل كلمة المرور" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#1E3A8A] transition-colors" />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
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
                    {isPending ? <Loader2 className="animate-spin" /> : "تسجيل الدخول"}
                </button>
            </form>

            <div className="mt-4 text-center">
                <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-[#1E3A8A] transition-colors">
                    نسيت كلمة المرور؟
                </Link>
            </div>
        </Card>
    );
}
