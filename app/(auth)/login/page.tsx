"use client";

import { useState, useTransition } from "react";
import { login } from "../actions";
import Link from "next/link";
import { Mail, Lock, Loader2, Sparkles } from "lucide-react";
import Card from "@/app/components/dashboard/Card";

type AuthMode = 'magic-link' | 'password';

export default function LoginPage() {
    const [mode, setMode] = useState<AuthMode>('magic-link');
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [magicLinkSent, setMagicLinkSent] = useState(false);

    const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    const handleMagicLinkSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setMagicLinkSent(false);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;

        startTransition(async () => {
            try {
                const response = await fetch('/api/auth/resend-magic-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    setMagicLinkSent(true);
                } else {
                    setError(data.error || 'Erreur lors de l\'envoi du lien');
                }
            } catch (err) {
                setError('Erreur réseau. Vérifiez votre connexion.');
            }
        });
    };

    return (
        <Card className="w-full">
            <h2 className="text-2xl font-bold text-center text-white mb-2">مرحباً بعودتك 👋</h2>
            <p className="text-center text-gray-400 mb-8 text-sm">أدخل بياناتك للدخول إلى لوحة التحكم</p>

            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
                <button
                    onClick={() => { setMode('magic-link'); setError(null); setMagicLinkSent(false); }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${mode === 'magic-link'
                            ? 'bg-[#00d2ff] text-black'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <Sparkles size={16} />
                    Magic Link
                </button>
                <button
                    onClick={() => { setMode('password'); setError(null); setMagicLinkSent(false); }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${mode === 'password'
                            ? 'bg-[#00d2ff] text-black'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <Lock size={16} />
                    Mot de passe
                </button>
            </div>

            {/* Magic Link Form */}
            {mode === 'magic-link' && (
                <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                    {!magicLinkSent ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">البريد الإلكتروني</label>
                                <div className="relative">
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors"
                                    />
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                                ✨ Recevez un lien magique par email pour vous connecter sans mot de passe
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-bold">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-[#00d2ff] hover:bg-[#00c2ee] text-black font-bold py-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="animate-spin" /> : "Envoyer le lien magique"}
                            </button>
                        </>
                    ) : (
                        <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                            <div className="text-4xl mb-4">📧</div>
                            <h3 className="text-lg font-bold text-green-400 mb-2">Email envoyé !</h3>
                            <p className="text-sm text-gray-300 mb-4">
                                Vérifiez votre boîte de réception et cliquez sur le lien pour vous connecter.
                            </p>
                            <button
                                onClick={() => setMagicLinkSent(false)}
                                className="text-[#00d2ff] text-sm hover:underline"
                            >
                                Renvoyer l'email
                            </button>
                        </div>
                    )}
                </form>
            )}

            {/* Password Form */}
            {mode === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">البريد الإلكتروني</label>
                        <div className="relative">
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="name@example.com"
                                className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors"
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-300">كلمة المرور</label>
                            <Link href="/forgot-password" className="text-xs text-[#00d2ff] hover:underline">نسيت كلمة المرور؟</Link>
                        </div>
                        <div className="relative">
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors"
                            />
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
                        className="w-full bg-[#00d2ff] hover:bg-[#00c2ee] text-black font-bold py-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : "تسجيل الدخول"}
                    </button>
                </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-400">
                ليس لديك حساب؟{" "}
                <Link href="/register" className="text-[#00d2ff] font-bold hover:underline">
                    سجل الآن
                </Link>
            </div>
        </Card>
    );
}
