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
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
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
                setMessage({ type: 'success', text: 'Mot de passe défini avec succès !' });
                (event.target as HTMLFormElement).reset();
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-8">⚙️ Paramètres du compte</h1>

            {/* Password Section */}
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#00d2ff]/10 rounded-xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-[#00d2ff]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Mot de passe</h2>
                        <p className="text-sm text-gray-400">Définissez un mot de passe pour vous connecter</p>
                    </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-400">
                        💡 <strong>Optionnel :</strong> Vous pouvez toujours vous connecter avec le Magic Link envoyé par email.
                        Définir un mot de passe vous permet de vous connecter plus rapidement.
                    </p>
                </div>

                <form onSubmit={handleSetPassword} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Nouveau mot de passe</label>
                        <input
                            name="newPassword"
                            type="password"
                            required
                            minLength={6}
                            placeholder="Minimum 6 caractères"
                            className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00d2ff] transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Confirmer le mot de passe</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            placeholder="Retapez le mot de passe"
                            className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00d2ff] transition-colors"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 ${message.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                                : 'bg-red-500/10 border border-red-500/20 text-red-500'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[#00d2ff] hover:bg-[#00c2ee] text-black font-bold py-3 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Enregistrement...' : 'Définir le mot de passe'}
                    </button>
                </form>
            </div>

            {/* Info Section */}
            <div className="mt-6 bg-gray-900/30 border border-white/5 rounded-xl p-4">
                <h3 className="text-sm font-bold text-white mb-2">📧 Méthodes de connexion disponibles</h3>
                <ul className="text-xs text-gray-400 space-y-1">
                    <li>• <strong>Magic Link :</strong> Recevez un lien par email (toujours disponible)</li>
                    <li>• <strong>Mot de passe :</strong> Connexion rapide avec email + mot de passe (après configuration)</li>
                </ul>
            </div>
        </div>
    );
}
