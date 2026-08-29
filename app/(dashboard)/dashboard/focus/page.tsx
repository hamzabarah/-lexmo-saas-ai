"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { OmqShell } from "./_components/OmqShell";

const ADMIN_EMAIL = "academyfrance75@gmail.com";

export default function FocusPage() {
    // Contrôle d'accès inchangé : vérification de l'e-mail admin côté client,
    // comme dans la version précédente de cette page.
    const [authChecked, setAuthChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setAuthorized(user?.email === ADMIN_EMAIL);
            setAuthChecked(true);
        });
    }, []);

    if (!authChecked) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-500 text-lg">جاري التحميل...</div>
            </div>
        );
    }

    if (!authorized) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-12 max-w-lg text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">الوصول مقيد</h2>
                    <p className="text-gray-400">هذه الصفحة محجوزة للمسؤول</p>
                </div>
            </div>
        );
    }

    return <OmqShell />;
}
