"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleAuth = async () => {
            const supabase = createClient();

            // 1. Get params from window.location (more reliable for hash/search access)
            const currentUrl = new URL(window.location.href);
            const code = currentUrl.searchParams.get("code");
            const next = currentUrl.searchParams.get("next") || "/dashboard";
            const errorDescription = currentUrl.searchParams.get("error_description");

            if (errorDescription) {
                setError(errorDescription);
                return;
            }

            // 1. PRIORITY: Check if session already exists (e.g. user already logged in or Implicit flow handled)
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (session) {
                // Session is active, skip code exchange to avoid "Verifier not found" errors
                router.push(next);
                return;
            }

            // 2. PKCE Handshake (Client Side) - Only if no session yet
            if (code) {
                const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
                if (codeError) {
                    // Even if code exchange fails, we double check if session was established anyway (race condition)
                    const { data: { session: retrySession } } = await supabase.auth.getSession();
                    if (retrySession) {
                        router.push(next);
                        return;
                    }

                    if (codeError.message.includes("code verifier not found")) {
                        // Helpful error for cross-browser reset
                        setError("⚠️ Navigateur différent détecté.\n\nVeuillez COPIER le lien reçus par email et le COLLER dans ce navigateur.");
                    } else {
                        setError(codeError.message);
                    }
                    return;
                }
                // Success
                router.push(next);
                return;
            }

            // 3. Implicit/Hash Handshake
            // Supabase client auto-detects hash fragments like #access_token=...
            const { data: { session: implicitSession }, error: implicitError } = await supabase.auth.getSession();

            if (implicitError) {
                setError(implicitError.message);
                return;
            }

            if (implicitSession) {
                router.push(next);
            } else {
                // 4. Wait for potential Auth State Change (Magic Link Hash processing)
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
                        // For password recovery, we often want to go to the reset page explicitly
                        // But usually 'next' param handles it.
                        router.push(next);
                    }
                });

                // Timeout to avoid infinite loading
                setTimeout(() => {
                    supabase.auth.getUser().then(({ data: { user } }) => {
                        if (!user) setError("Lien invalide ou expiré.");
                    });
                }, 4000);

                return () => subscription.unsubscribe();
            }
        };

        handleAuth();
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center text-red-500 p-4">
                <div className="text-center space-y-4 max-w-md bg-white/5 p-8 rounded-xl border border-white/10">
                    <h1 className="text-2xl font-bold font-orbitron">Erreur de vérification</h1>
                    <p className="text-gray-300 font-mono text-sm break-words">{error}</p>
                    <div className="pt-4">
                        <button
                            onClick={() => router.push("/#login")}
                            className="bg-[#00d2ff] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#00c2ee] transition-colors"
                        >
                            Retour à la connexion
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white">
            <Loader2 className="w-12 h-12 animate-spin text-[#00d2ff] mb-6" />
            <h2 className="text-2xl font-bold font-orbitron text-center">Vérification en cours...</h2>
            <p className="text-gray-400 text-sm mt-2">Validation de votre lien de sécurité</p>
        </div>
    );
}
