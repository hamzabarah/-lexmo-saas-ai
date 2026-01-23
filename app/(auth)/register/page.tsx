"use client";

import { useState, useTransition } from "react";
import { signup } from "../actions";
import Link from "next/link";
import { Mail, Lock, User, Phone, MapPin, Loader2 } from "lucide-react";
import Card from "@/app/components/dashboard/Card";

export default function RegisterPage() {
    const [isPending, startTransition] = useTransition(); // Corrected hook usage
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("كلمة المرور غير متطابقة");
            return;
        }

        startTransition(async () => {
            const result = await signup(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <Card className="w-full">
            <h2 className="text-2xl font-bold text-center text-white mb-2">أنشئ حسابك 🚀</h2>
            <p className="text-center text-gray-400 mb-8 text-sm">انضم الآن إلى مجتمع النخبة في التجارة الإلكترونية</p>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">الاسم الكامل</label>
                    <div className="relative">
                        <input name="name" type="text" required className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors" />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">البريد الإلكتروني</label>
                    <div className="relative">
                        <input name="email" type="email" required className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors" />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    </div>
                </div>

                {/* Phone & Country Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">رقم الهاتف</label>
                        <div className="relative">
                            <input name="phone" type="tel" className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors" />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">البلد</label>
                        <div className="relative">
                            <select name="country" className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors appearance-none text-gray-400">
                                <option value="SA">السعودية</option>
                                <option value="AE">الإمارات</option>
                                <option value="KW">الكويت</option>
                                <option value="QA">قطر</option>
                                <option value="BH">البحرين</option>
                                <option value="OM">عمان</option>
                                <option value="EG">مصر</option>
                                <option value="DZ">الجزائر</option>
                                <option value="MA">المغرب</option>
                                <option value="other">أخرى</option>
                            </select>
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">كلمة المرور</label>
                    <div className="relative">
                        <input name="password" type="password" required className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors" />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">تأكيد كلمة المرور</label>
                    <div className="relative">
                        <input name="confirmPassword" type="password" required className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#00d2ff] transition-colors" />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
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
                    {isPending ? <Loader2 className="animate-spin" /> : "إنشاء حساب"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                لديك حساب بالفعل؟{" "}
                <Link href="/#login" className="text-[#00d2ff] font-bold hover:underline">
                    سجل دخولك
                </Link>
            </div>
        </Card>
    );
}
