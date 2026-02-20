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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00d2ff]/5 rounded-full blur-[100px] -z-10" />

            <h1 className="text-3xl font-bold text-white mb-8 text-center font-orbitron">إعدادات الحساب ⚙️</h1>

            {/* Password Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#00d2ff]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-[#00d2ff]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">كلمة المرور</h2>
                    <p className="text-gray-400">قم بتعيين كلمة مرور لتسجيل الدخول</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 text-right" dir="rtl">
                    <p className="text-sm text-blue-400 leading-relaxed">
                        💡 <strong>اختياري:</strong> يمكنك دائمًا تسجيل الدخول باستخدام الرابط السحري (Magic Link) المرسل عبر البريد الإلكتروني.
                        تعيين كلمة مرور يسمح لك بتسجيل الدخول بشكل أسرع.
                    </p>
                </div>

                <form onSubmit={handleSetPassword} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300 block text-right mb-2">كلمة المرور الجديدة</label>
                        <input
                            name="newPassword"
                            type="password"
                            required
                            minLength={6}
                            placeholder="6 أحرف كحد أدنى"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:border-transparent transition-all text-right"
                            dir="rtl"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300 block text-right mb-2">تأكيد كلمة المرور</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            placeholder="أعد كتابة كلمة المرور"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:border-transparent transition-all text-right"
                            dir="rtl"
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 flex-row-reverse ${message.type === 'success'
                            ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                            : 'bg-red-500/10 border border-red-500/20 text-red-500'
                            }`} dir="rtl">
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] hover:from-[#00c2ee] hover:to-[#8d40ab] text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-4"
                    >
                        {isPending ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
                    </button>
                </form>
            </div>
        </div>
    );
}
