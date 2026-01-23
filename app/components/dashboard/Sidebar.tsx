"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import {
    LayoutDashboard,
    DollarSign,
    BookOpen,
    Gift,
    Bot,
    Settings,
    LogOut,
    Menu,
    X,
    Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import FadeIn from "@/app/components/FadeIn";
import { createClient } from "@/utils/supabase/client";

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: "/dashboard" },
    { icon: BookOpen, label: "المراحل", href: "/dashboard/phases" },
    { icon: Settings, label: "الإعدادات", href: "/dashboard/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState<{ name: string | null } | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email || null);
                const { data } = await supabase
                    .from('users')
                    .select('name')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            }
        };
        fetchUser();
    }, []);

    const displayName = profile?.name || "Member";
    const initials = displayName.substring(0, 2).toUpperCase();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMenu}
                className="fixed top-4 right-4 z-50 p-2 bg-[#030712]/80 backdrop-blur-md border border-white/10 rounded-lg lg:hidden"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed top-0 right-0 h-screen w-72 bg-[#030712] border-l border-white/10 overflow-y-auto z-40 transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="p-6 flex flex-col h-full">
                    {/* Logo */}
                    <div className="mb-10 text-center">
                        <h1 className="text-2xl font-bold font-orbitron tracking-tighter">
                            LEXMO<span className="text-[#00d2ff]">.AI</span>
                        </h1>
                    </div>

                    {/* User Profile Snippet */}
                    <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00d2ff] to-[#9d50bb] p-[2px]">
                            <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center text-xs font-bold">
                                {initials}
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-bold text-sm truncate">{displayName}</div>
                            <div className="text-xs text-gray-400">مستوى المبتدئ</div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {MENU_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(0,210,255,0.1)]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {isActive && (
                                        <div className="absolute top-0 bottom-0 right-0 w-1 bg-[#00d2ff] rounded-l shadow-[0_0_10px_#00d2ff]" />
                                    )}
                                    <item.icon size={20} className={clsx(isActive ? "text-[#00d2ff] drop-shadow-[0_0_5px_rgba(0,210,255,0.5)]" : "group-hover:text-white transition-colors")} />
                                    <span className="font-bold">{item.label}</span>
                                </Link>
                            );
                        })}

                        {/* Admin Panel Link - Only visible for admin */}
                        {userEmail === 'academyfrance75@gmail.com' && (
                            <>
                                <Link
                                    href="/dashboard/admin"
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                        pathname === '/dashboard/admin'
                                            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(0,210,255,0.1)]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {pathname === '/dashboard/admin' && (
                                        <div className="absolute top-0 bottom-0 right-0 w-1 bg-[#00d2ff] rounded-l shadow-[0_0_10px_#00d2ff]" />
                                    )}
                                    <Shield
                                        size={20}
                                        className={clsx(
                                            pathname === '/dashboard/admin'
                                                ? "text-[#00d2ff] drop-shadow-[0_0_5px_rgba(0,210,255,0.5)]"
                                                : "group-hover:text-white transition-colors"
                                        )}
                                    />
                                    <span className="font-bold">لوحة الإدارة</span>
                                </Link>

                                <Link
                                    href="/dashboard/ventes-live"
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                        pathname === '/dashboard/ventes-live'
                                            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(0,210,255,0.1)]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {pathname === '/dashboard/ventes-live' && (
                                        <div className="absolute top-0 bottom-0 right-0 w-1 bg-[#00d2ff] rounded-l shadow-[0_0_10px_#00d2ff]" />
                                    )}
                                    <DollarSign
                                        size={20}
                                        className={clsx(
                                            pathname === '/dashboard/ventes-live'
                                                ? "text-[#00d2ff] drop-shadow-[0_0_5px_rgba(0,210,255,0.5)]"
                                                : "group-hover:text-white transition-colors"
                                        )}
                                    />
                                    <span className="font-bold">المبيعات المباشرة</span>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Logout */}
                    <form action={logout} className="mt-auto">
                        <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                            <LogOut size={20} />
                            <span className="font-bold">تسجيل الخروج</span>
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
