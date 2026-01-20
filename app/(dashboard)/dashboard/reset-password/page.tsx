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
            setError("Les mots de passe ne correspondent pas");
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
                <div className="text-center bg-green-500/10 border border-green-500/20 rounded-xl p-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Mot de passe modifié !</h3>
                    <p className="text-gray-300">
                        Votre mot de passe a été mis à jour avec succès.<br />
                        Redirection vers le dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto pt-20 px-4">
            <h1 className="text-3xl font-bold text-white mb-2 font-orbitron">Nouveau mot de passe</h1>
            <p className="text-gray-400 mb-8">Choisissez un nouveau mot de passe sécurisé pour votre compte.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Nouveau mot de passe</label>
                        <div className="relative">
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors text-white"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Confirmer le mot de passe</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors text-white"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
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
                    className="w-full bg-[#00d2ff] hover:bg-[#00c2ee] text-black font-bold py-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : "Mettre à jour le mot de passe"}
                </button>
            </form>
        </div>
    );
}
