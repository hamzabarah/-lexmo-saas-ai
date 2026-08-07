import { Suspense } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import AccessLinkKeeper from "@/components/AccessLinkKeeper";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-cairo" dir="rtl">
            {/* Conserve le token du lien d'accès dans les liens internes.
                Inactif s'il n'y a pas de paramètre ?access dans l'URL. */}
            <Suspense fallback={null}>
                <AccessLinkKeeper />
            </Suspense>

            {/* Top Navbar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="min-h-screen pt-24 px-4 pb-4 lg:px-8 lg:pb-8 overflow-x-hidden">
                <div className="max-w-6xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
