import { Almarai, Tajawal } from 'next/font/google';

// Polices des maquettes « عُمق » : Almarai en principale, Tajawal en repli.
const almarai = Almarai({
    subsets: ['arabic'],
    weight: ['300', '400', '700', '800'],
    variable: '--font-almarai',
    display: 'swap',
});

const tajawal = Tajawal({
    subsets: ['arabic'],
    weight: ['400', '500', '700'],
    variable: '--font-tajawal',
    display: 'swap',
});

/**
 * Ce layout ne fait qu'exposer les variables de police au module focus.
 * Il n'impose aucun fond : la page /dashboard/focus/stats, qui hérite aussi de
 * ce layout, garde son apparence d'origine.
 */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
    return <div className={`${almarai.variable} ${tajawal.variable}`}>{children}</div>;
}
