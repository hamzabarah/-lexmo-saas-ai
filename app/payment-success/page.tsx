"use client";

import { CheckCircle, Mail, Copy } from "lucide-react";
import { useState } from "react";

export default function PaymentSuccessPage() {
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-[#1e293b] border border-[#00d2ff]/20 rounded-2xl p-8 md:p-12 shadow-2xl">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
                    🎉 Paiement réussi !
                </h1>

                <p className="text-center text-gray-300 mb-8 text-lg">
                    Merci pour votre achat ! Votre paiement a été confirmé.
                </p>

                {/* Instructions Box */}
                <div className="bg-[#0f172a] border border-[#00d2ff]/30 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                        <Mail className="w-6 h-6 text-[#00d2ff] mt-1 flex-shrink-0" />
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">
                                📧 Dernière étape pour activer votre accès
                            </h2>
                            <p className="text-gray-300 mb-4">
                                Pour activer votre compte, envoyez-nous un email avec les informations suivantes :
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#1e293b] border border-white/10 rounded-lg p-4 mb-4">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">📩 À :</p>
                                <div className="flex items-center gap-2">
                                    <code className="text-[#00d2ff] font-mono text-lg">contact@lexmo.ai</code>
                                    <button
                                        onClick={() => handleCopy('contact@lexmo.ai')}
                                        className="p-1 hover:bg-white/10 rounded transition-colors"
                                        title="Copier l'email"
                                    >
                                        <Copy className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-1">📝 Objet :</p>
                                <code className="text-white">Activation compte LEXMO</code>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-2">✍️ Dans le message, incluez :</p>
                                <ul className="space-y-2 text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#00d2ff] mt-1">•</span>
                                        <span>Votre <strong>email de paiement</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#00d2ff] mt-1">•</span>
                                        <span>Une <strong>capture d'écran</strong> de la confirmation de paiement Stripe</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#00d2ff] mt-1">•</span>
                                        <span>Le <strong>pack acheté</strong> (Spark, Emperor ou Legend)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {copied && (
                        <p className="text-green-500 text-sm text-center mb-2">
                            ✅ Email copié dans le presse-papier !
                        </p>
                    )}
                </div>

                {/* Timeline */}
                <div className="bg-gradient-to-r from-[#00d2ff]/10 to-[#9d50bb]/10 border border-[#00d2ff]/20 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">⏱️ Que se passe-t-il ensuite ?</h3>
                    <div className="space-y-3 text-gray-300">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-[#00d2ff]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-[#00d2ff] font-bold">1</span>
                            </div>
                            <p>Vous nous envoyez l'email avec vos informations</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-[#00d2ff]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-[#00d2ff] font-bold">2</span>
                            </div>
                            <p>Nous vérifions votre paiement (sous 24h max)</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-[#00d2ff]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-[#00d2ff] font-bold">3</span>
                            </div>
                            <p>Nous vous envoyons un lien d'inscription personnalisé</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-green-500 font-bold">✓</span>
                            </div>
                            <p className="font-bold text-white">Vous créez votre compte et accédez immédiatement au contenu !</p>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <a
                    href="mailto:contact@lexmo.ai?subject=Activation%20compte%20LEXMO&body=Bonjour,%0D%0A%0D%0AEmail%20de%20paiement%20:%20%0D%0APack%20acheté%20:%20%0D%0A%0D%0A(Joindre%20capture%20d'écran%20du%20paiement)"
                    className="block w-full bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] text-white text-center py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/25"
                >
                    📧 Envoyer l'email maintenant
                </a>

                <p className="text-center text-gray-400 text-sm mt-6">
                    Besoin d'aide ? Répondez à l'email de confirmation Stripe ou contactez-nous.
                </p>
            </div>
        </div>
    );
}
