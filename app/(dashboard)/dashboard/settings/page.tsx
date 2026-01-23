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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-8 text-right font-orbitron">⚙️ إعدادات الحساب</h1>

            {/* Password Section */}
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 flex-row-reverse">
                    <div className="w-12 h-12 bg-[#00d2ff]/10 rounded-xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-[#00d2ff]" />
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-white">كلمة المرور</h2>
                        <p className="text-sm text-gray-400">قم بتعيين كلمة مرور لتسجيل الدخول</p>
                    </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 text-right" dir="rtl">
                    <p className="text-sm text-blue-400">
                        💡 <strong>اختياري:</strong> يمكنك دائمًا تسجيل الدخول باستخدام الرابط السحري (Magic Link) المرسل عبر البريد الإلكتروني.
                        تعيين كلمة مرور يسمح لك بتسجيل الدخول بشكل أسرع.
                    </p>
                </div>

                <form onSubmit={handleSetPassword} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block text-right">كلمة المرور الجديدة</label>
                        <input
                            name="newPassword"
                            type="password"
                            required
                            minLength={6}
                            placeholder="6 أحرف كحد أدنى"
                            className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00d2ff] transition-colors text-right"
                            dir="rtl"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block text-right">تأكيد كلمة المرور</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            placeholder="أعد كتابة كلمة المرور"
                            className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00d2ff] transition-colors text-right"
                            dir="rtl"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 flex-row-reverse ${message.type === 'success'
                            ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                            : 'bg-red-500/10 border border-red-500/20 text-red-500'
                            }`} dir="rtl">
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[#00d2ff] hover:bg-[#00c2ee] text-black font-bold py-3 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
                    </button>
                </form>
            </div>

            {/* Info Section */}
            <div className="mt-6 bg-gray-900/30 border border-white/5 rounded-xl p-4 text-right" dir="rtl">
                <h3 className="text-sm font-bold text-white mb-2">📧 طرق تسجيل الدخول المتاحة</h3>
                <ul className="text-xs text-gray-400 space-y-1 mr-4">
                    <li>• <strong>الرابط السحري (Magic Link):</strong> استلم رابطًا عبر البريد الإلكتروني (متاح دائمًا)</li>
                    <li>• <strong>كلمة المرور:</strong> تسجيل دخول سريع باستخدام البريد الإلكتروني + كلمة المرور (بعد الإعداد)</li>
                </ul>
            </div>
        </div>
    );
}
