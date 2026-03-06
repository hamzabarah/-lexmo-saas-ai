"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginSection() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
                setLoading(false);
                return;
            }

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            setError('حدث خطأ أثناء تسجيل الدخول');
            setLoading(false);
        }
    };

    return (
        <section id="login" className="relative py-20 bg-[#0A0A0A] border-y border-[#C5A04E]/10">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A04E]/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            هل لديك حساب بالفعل؟
                        </h2>
                        <p className="text-gray-500 text-lg">
                            سجّل دخولك للوصول إلى التدريب
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-8 backdrop-blur-sm">
                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="email@example.com"
                                        className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">
                                    كود الدخول (كلمة المرور)
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="أدخل كود الدخول"
                                        className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] hover:from-[#D4B85C] hover:to-[#8d40ab] text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-700/25 hover:shadow-yellow-700/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>جاري التحميل...</span>
                                    </>
                                ) : (
                                    <span>تسجيل

                                        الدخول</span>
                                )}
                            </button>

                            {/* Forgot Password Link */}
                            <div className="text-center">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-gray-500 hover:text-[#C5A04E] transition-colors"
                                >
                                    نسيت كلمة المرور؟
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-500">
                            ليس لديك حساب بعد؟{' '}
                            <a
                                href="#pricing"
                                className="text-[#C5A04E] font-bold hover:text-[#D4B85C] transition-colors"
                            >
                                اشترك الآن ←
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
