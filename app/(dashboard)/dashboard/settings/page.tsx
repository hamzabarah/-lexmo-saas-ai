"use client";

import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import Card from "@/app/components/dashboard/Card";

export default function SettingsPage() {
    return (
        <>
            <DashboardHeader title="الإعدادات ⚙️" subtitle="التحكم في حسابك وتفضيلاتك" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">المعلومات الشخصية</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">الاسم الكامل</label>
                            <input type="text" value="Mohammed E." className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-3 text-white" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">البريد الإلكتروني</label>
                            <input type="email" value="mohammed@example.com" className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-3 text-white" readOnly />
                        </div>
                        <button className="bg-[#00d2ff] text-black px-6 py-2 rounded-lg font-bold mt-4">حفظ التغييرات</button>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">الأمان</h3>
                    <div className="space-y-4">
                        <button className="w-full text-right bg-white/5 hover:bg-white/10 p-4 rounded-lg flex justify-between items-center transition-colors">
                            <span>تغيير كلمة المرور</span>
                            <span className="text-gray-400 text-sm">**********</span>
                        </button>
                        <button className="w-full text-right bg-white/5 hover:bg-white/10 p-4 rounded-lg flex justify-between items-center transition-colors">
                            <span>المصادقة الثنائية (2FA)</span>
                            <span className="text-red-500 text-sm">معطل</span>
                        </button>
                    </div>
                </Card>
            </div>
        </>
    );
}
