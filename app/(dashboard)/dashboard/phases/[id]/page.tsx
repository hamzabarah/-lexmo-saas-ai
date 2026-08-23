import Link from 'next/link';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import StepDetailClient from './StepDetailClient';
import { hasFormationAccess } from '@/lib/server-access';
import { ADMIN_EMAIL } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/**
 * Garde d'accès de la page de leçon.
 *
 * Ce Server Component existe uniquement pour trancher AVANT le rendu : le
 * lecteur ({@link StepDetailClient}) est un composant client, et un contrôle
 * fait à l'intérieur laisserait tout le contenu de la leçon partir dans le HTML
 * avant d'être masqué à l'écran.
 *
 * Le contrôle porte sur le DROIT D'ACCÈS, pas sur le plan : c'est ce qui laisse
 * passer les porteurs de lien d'accès, qui n'ont ni compte ni abonnement.
 */
export default async function StepDetailPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const raw = params.access;
    const accessToken = Array.isArray(raw) ? raw[0] : raw;

    const allowed = await hasFormationAccess(accessToken);

    if (!allowed) {
        return (
            <>
                <div className="mb-8">
                    <Link
                        href="/dashboard/phases"
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
                    >
                        <ArrowRight size={16} />
                        <span>العودة للدروس</span>
                    </Link>
                </div>

                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-12 max-w-2xl text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                                <Lock className="w-10 h-10 text-red-500" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-4">الوصول مقيد 🔒</h2>

                        <p className="text-xl text-gray-400 mb-8 leading-relaxed" dir="rtl">
                            يجب تفعيل اشتراكك للوصول إلى المحتوى
                        </p>

                        <a
                            href={`mailto:${ADMIN_EMAIL}?subject=طلب تفعيل الاشتراك`}
                            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
                        >
                            <Mail className="w-5 h-5" />
                            <span>تواصل معنا للتفعيل</span>
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return <StepDetailClient />;
}
