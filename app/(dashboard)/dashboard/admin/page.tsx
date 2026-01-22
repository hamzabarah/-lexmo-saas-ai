'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Shield, Mail, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserData {
    id: string;
    email: string;
    full_name?: string;
    country?: string;
    created_at: string;
}

interface Subscription {
    id: string;
    user_id: string;
    email: string;
    plan: string;
    status: string;
    activated_at: string | null;
    created_at: string;
}

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);
    const [selectedPlans, setSelectedPlans] = useState<{ [key: string]: string }>({});
    const supabase = createClient();
    const router = useRouter();

    const ADMIN_EMAIL = 'academyfrance75@gmail.com';

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.email !== ADMIN_EMAIL) {
            setUnauthorized(true);
            setLoading(false);
            return;
        }

        setUser(user);
        await loadData();
    };

    const loadData = async () => {
        try {
            // Load all users
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('id, email, full_name, country, created_at')
                .order('created_at', { ascending: false });

            if (usersError) throw usersError;

            // Load all subscriptions
            const { data: subsData, error: subsError } = await supabase
                .from('user_subscriptions')
                .select('*')
                .order('created_at', { ascending: false });

            if (subsError) throw subsError;

            setUsers(usersData || []);
            setSubscriptions(subsData || []);

            // Initialize selected plans
            const plans: { [key: string]: string } = {};
            subsData?.forEach((sub: Subscription) => {
                plans[sub.user_id] = sub.plan;
            });
            setSelectedPlans(plans);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (userId: string, userEmail: string) => {
        const plan = selectedPlans[userId] || 'spark';

        try {
            // Check if subscription exists
            const existingSub = subscriptions.find(s => s.user_id === userId);

            if (existingSub) {
                // Update existing subscription
                const { error } = await supabase
                    .from('user_subscriptions')
                    .update({
                        plan,
                        status: 'active',
                        activated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId);

                if (error) throw error;
            } else {
                // Create new subscription
                const { error } = await supabase
                    .from('user_subscriptions')
                    .insert({
                        user_id: userId,
                        email: userEmail,
                        plan,
                        status: 'active',
                        activated_at: new Date().toISOString()
                    });

                if (error) throw error;
            }

            await loadData();
            alert('تم تفعيل الاشتراك بنجاح!');
        } catch (error) {
            console.error('Error activating subscription:', error);
            alert('حدث خطأ أثناء التفعيل');
        }
    };

    const handleDeactivate = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('user_subscriptions')
                .update({
                    status: 'inactive'
                })
                .eq('user_id', userId);

            if (error) throw error;

            await loadData();
            alert('تم إلغاء تفعيل الاشتراك');
        } catch (error) {
            console.error('Error deactivating subscription:', error);
            alert('حدث خطأ أثناء الإلغاء');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <div className="text-white text-xl">جاري التحميل...</div>
            </div>
        );
    }

    if (unauthorized) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
                <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">غير مصرح</h1>
                    <p className="text-gray-400 mb-6">ليس لديك صلاحية الوصول إلى هذه الصفحة</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                    >
                        العودة إلى لوحة التحكم
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-white">لوحة الإدارة</h1>
                    </div>
                    <p className="text-gray-400">إدارة المستخدمين والاشتراكات</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="text-gray-400 text-sm mb-1">إجمالي المستخدمين</div>
                        <div className="text-3xl font-bold text-white">{users.length}</div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="text-gray-400 text-sm mb-1">الاشتراكات النشطة</div>
                        <div className="text-3xl font-bold text-green-500">
                            {subscriptions.filter(s => s.status === 'active').length}
                        </div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="text-gray-400 text-sm mb-1">في انتظار التفعيل</div>
                        <div className="text-3xl font-bold text-yellow-500">
                            {subscriptions.filter(s => s.status === 'pending').length}
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50 border-b border-gray-700">
                                <tr>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">البريد الإلكتروني</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الاسم</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">البلد</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">تاريخ التسجيل</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الحالة</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الخطة</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {users.map((userData) => {
                                    const subscription = subscriptions.find(s => s.user_id === userData.id);
                                    const statusColor = subscription?.status === 'active'
                                        ? 'text-green-500 bg-green-500/10'
                                        : subscription?.status === 'pending'
                                            ? 'text-yellow-500 bg-yellow-500/10'
                                            : 'text-red-500 bg-red-500/10';

                                    return (
                                        <tr key={userData.id} className="hover:bg-gray-800/30 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-300 text-sm">{userData.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{userData.full_name || '-'}</td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{userData.country || '-'}</td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {new Date(userData.created_at).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                                                    {subscription?.status === 'active' ? 'نشط' : subscription?.status === 'pending' ? 'معلق' : 'غير نشط'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={selectedPlans[userData.id] || subscription?.plan || 'spark'}
                                                    onChange={(e) => setSelectedPlans({ ...selectedPlans, [userData.id]: e.target.value })}
                                                    className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="spark">🚀 Spark</option>
                                                    <option value="emperor">👑 Emperor</option>
                                                    <option value="legend">💎 Legend</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleActivate(userData.id, userData.email)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                                    >
                                                        تفعيل
                                                    </button>
                                                    {subscription && (
                                                        <button
                                                            onClick={() => handleDeactivate(userData.id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                                        >
                                                            إلغاء
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        لا توجد بيانات للعرض
                    </div>
                )}
            </div>
        </div>
    );
}
