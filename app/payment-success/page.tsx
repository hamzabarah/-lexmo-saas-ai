"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'votre adresse email';
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    const handleResendEmail = async () => {
        setIsResending(true);
        setResendMessage('');

        try {
            const response = await fetch('/api/auth/resend-magic-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setResendMessage('✅ Email renvoyé avec succès ! Vérifiez votre boîte de réception.');
            } else {
                setResendMessage('❌ Erreur lors de l\'envoi. Réessayez dans quelques instants.');
            }
        } catch (error) {
            setResendMessage('❌ Erreur réseau. Vérifiez votre connexion.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        {/* Success Icon */}
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-6 animate-bounce">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            🎉 Paiement réussi !
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl text-gray-300 mb-8">
                            Félicitations ! Votre achat a été confirmé avec succès.
                        </p>

                        {/* Email Info Box */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Mail className="w-6 h-6 text-[#00d2ff]" />
                                <h2 className="text-lg font-bold text-white">Vérifiez votre email</h2>
                            </div>
                            <p className="text-gray-300 mb-2">
                                Un email a été envoyé à :
                            </p>
                            <p className="text-[#00d2ff] font-bold text-lg mb-4">
                                {email}
                            </p>
                            <p className="text-sm text-gray-400">
                                Cliquez sur le lien dans l'email pour accéder immédiatement à votre formation.
                            </p>
                        </div>

                        {/* Resend Button */}
                        <button
                            onClick={handleResendEmail}
                            disabled={isResending}
                            className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto mb-4"
                        >
                            <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                            {isResending ? 'Envoi en cours...' : 'Renvoyer l\'email'}
                        </button>

                        {/* Resend Message */}
                        {resendMessage && (
                            <p className="text-sm mb-6 text-center">
                                {resendMessage}
                            </p>
                        )}

                        {/* Instructions */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 text-left" dir="ltr">
                            <h3 className="text-sm font-bold text-blue-400 mb-2">📧 Vous ne voyez pas l'email ?</h3>
                            <ul className="text-xs text-gray-300 space-y-1">
                                <li>• Vérifiez votre dossier spam/courrier indésirable</li>
                                <li>• Attendez quelques minutes (délai de livraison)</li>
                                <li>• Cliquez sur "Renvoyer l'email" ci-dessus</li>
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <Link
                            href="/login"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-cyan-500/25"
                        >
                            Aller à la page de connexion
                        </Link>
                    </div>
                </div>

                {/* Support Note */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        Besoin d'aide ?{" "}
                        <a href="mailto:support@lexmo.ai" className="text-[#00d2ff] hover:underline">
                            Contactez le support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-white">Chargement...</div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
