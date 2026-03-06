"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import {
    DollarSign,
    BookOpen,
    Settings,
    LogOut,
    Menu,
    X,
    Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";

const MENU_ITEMS = [
    { icon: BookOpen, label: "الدروس", href: "/dashboard/phases" },
    { icon: Settings, label: "الإعدادات", href: "/dashboard/settings" },
];

const ADMIN_ITEMS = [
    { icon: Shield, label: "لوحة الإدارة", href: "/dashboard/admin" },
    { icon: DollarSign, label: "المبيعات المباشرة", href: "/dashboard/ventes-live" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email === 'academyfrance75@gmail.com') {
                setIsAdmin(true);
            }
        };
        checkAdmin();
    }, []);

    const allItems = isAdmin ? [...MENU_ITEMS, ...ADMIN_ITEMS] : MENU_ITEMS;

    return (
        <>
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C5A04E]/10">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/dashboard" className="shrink-0">
                            <h1 className="text-xl font-bold font-orbitron tracking-tighter text-[#C5A04E]">
                                ECOMY
                            </h1>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {allItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-bold",
                                            isActive
                                                ? "bg-[#1A1A1A] text-white shadow-[0_0_15px_rgba(197,160,78,0.1)]"
                                                : "text-gray-500 hover:text-white hover:bg-[#1A1A1A]"
                                        )}
                                    >
                                        <item.icon size={18} className={clsx(isActive && "text-[#C5A04E] drop-shadow-[0_0_5px_rgba(197,160,78,0.5)]")} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}

                            {/* Logout */}
                            <form action={logout}>
                                <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-sm font-bold cursor-pointer">
                                    <LogOut size={18} />
                                    <span>تسجيل الخروج</span>
                                </button>
                            </form>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors lg:hidden"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden border-t border-[#C5A04E]/10 bg-[#0A0A0A]/95 backdrop-blur-md">
                        <div className="px-4 py-3 space-y-1">
                            {allItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold",
                                            isActive
                                                ? "bg-[#1A1A1A] text-white"
                                                : "text-gray-500 hover:text-white hover:bg-[#1A1A1A]"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <item.icon size={20} className={clsx(isActive && "text-[#C5A04E]")} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}

                            <form action={logout}>
                                <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-bold cursor-pointer">
                                    <LogOut size={20} />
                                    <span>تسجيل الخروج</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
