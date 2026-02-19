"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' });
            return;
        }

        startTransition(async () => {
            const supabase = createClient();

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: 'تم تعيين كلمة المرور بنجاح!' });
                (event.target as HTMLFormElement).reset();
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-[100px] -z-10" />

            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-8 text-center font-orbitron">إعدادات الحساب ⚙️</h1>

            {/* Password Section */}
            <div className="bg-white border border-[#E8E0D4] rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#C9A84C]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-[#C9A84C]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">كلمة المرور</h2>
                    <p className="text-[#64607A]">قم بتعيين كلمة مرور لتسجيل الدخول</p>
                </div>

                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-4 mb-8 text-right" dir="rtl">
                    <p className="text-sm text-[#C9A84C] leading-relaxed">
                        💡 <strong>اختياري:</strong> يمكنك دائمًا تسجيل الدخول باستخدام الرابط السحري (Magic Link) المرسل عبر البريد الإلكتروني.
                        تعيين كلمة مرور يسمح لك بتسجيل الدخول بشكل أسرع.
                    </p>
                </div>

                <form onSubmit={handleSetPassword} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#64607A] block text-right mb-2">كلمة المرور الجديدة</label>
                        <input
                            name="newPassword"
                            type="password"
                            required
                            minLength={6}
                            placeholder="6 أحرف كحد أدنى"
                            className="w-full bg-[#F5F1EB] border border-[#E8E0D4] text-[#1A1A2E] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all text-right"
                            dir="rtl"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#64607A] block text-right mb-2">تأكيد كلمة المرور</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            placeholder="أعد كتابة كلمة المرور"
                            className="w-full bg-[#F5F1EB] border border-[#E8E0D4] text-[#1A1A2E] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all text-right"
                            dir="rtl"
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 flex-row-reverse ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-600'
                            : 'bg-red-50 border border-red-200 text-red-500'
                            }`} dir="rtl">
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-[#C9A84C] to-[#B8860B] hover:from-[#B8860B] hover:to-[#C9A84C] text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#C9A84C]/25 hover:shadow-[#C9A84C]/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-4"
                    >
                        {isPending ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
                    </button>
                </form>
            </div>
        </div>
    );
}
