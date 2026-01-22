'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Shield, Mail, AlertCircle, UserPlus, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserData {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    country?: string;
    created_at: string;
}

interface Subscription {
    id: string;
    user_id: string | null;
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

    // Add Student Form State
    const [newStudentEmail, setNewStudentEmail] = useState('');
    const [newStudentPlan, setNewStudentPlan] = useState('spark');
    const [addingStudent, setAddingStudent] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    const ADMIN_EMAIL = 'academyfrance75@gmail.com';
    const REGISTER_URL = 'https://lexmo-saas-ai.vercel.app/register';

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
                .select('id, email, name, phone, country, created_at')
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
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async () => {
        if (!newStudentEmail || !newStudentEmail.includes('@')) {
            alert('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }

        setAddingStudent(true);

        try {
            // Create pending subscription
            const { error } = await supabase
                .from('user_subscriptions')
                .insert({
                    email: newStudentEmail,
                    plan: newStudentPlan,
                    status: 'pending',
                    user_id: null
                });

            if (error) throw error;

            // Prepare email
            const subject = '🎉 مرحباً بك في LEXMO.AI - أنشئ حسابك الآن';
            const body = `مرحباً،

تم تسجيلك في برنامج LEXMO.AI للتجارة الإلكترونية!

لإكمال التسجيل وإنشاء حسابك، يرجى الضغط على الرابط التالي:
${REGISTER_URL}

بعد إنشاء حسابك، ستتمكن من الوصول إلى جميع محتويات البرنامج.

مع تحياتنا،
فريق LEXMO.AI`;

            // Open mailto
            window.location.href = `mailto:${newStudentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Reload data
            await loadData();

            // Reset form
            setNewStudentEmail('');
            setNewStudentPlan('spark');

            alert('تم إضافة الطالب بنجاح! ✅');
        } catch (error) {
            console.error('Error adding student:', error);
            alert('حدث خطأ أثناء إضافة الطالب');
        } finally {
            setAddingStudent(false);
        }
    };

    const handleActivate = async (email: string, plan: string) => {
        try {
            const { error } = await supabase
                .from('user_subscriptions')
                .update({
                    status: 'active',
                    activated_at: new Date().toISOString()
                })
                .eq('email', email);

            if (error) throw error;

            await loadData();
            alert('تم تفعيل الاشتراك بنجاح!');
        } catch (error) {
            console.error('Error activating subscription:', error);
            alert('حدث خطأ أثناء التفعيل');
        }
    };

    const handleDeactivate = async (email: string) => {
        try {
            const { error } = await supabase
                .from('user_subscriptions')
                .update({ status: 'inactive' })
                .eq('email', email);

            if (error) throw error;

            await loadData();
            alert('تم إلغاء تفعيل الاشتراك');
        } catch (error) {
            console.error('Error deactivating subscription:', error);
            alert('حدث خطأ أثناء الإلغاء');
        }
    };

    // Calculate statistics
    const totalStudents = subscriptions.length;
    const activeStudents = subscriptions.filter(s => s.status === 'active').length;
    const pendingStudents = subscriptions.filter(s => s.status === 'pending').length;

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
                    <p className="text-gray-400">إدارة الطلاب والاشتراكات</p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            <div className="text-gray-400 text-sm">عدد الطلاب الكلي</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{totalStudents}</div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="text-gray-400 text-sm">الطلاب النشطين</div>
                        </div>
                        <div className="text-3xl font-bold text-green-500">{activeStudents}</div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div className="text-gray-400 text-sm">في انتظار التفعيل</div>
                        </div>
                        <div className="text-3xl font-bold text-orange-500">{pendingStudents}</div>
                    </div>
                </div>

                {/* Add New Student Section */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <UserPlus className="w-6 h-6 text-blue-500" />
                        <h2 className="text-2xl font-bold text-white">إضافة طالب جديد</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={newStudentEmail}
                                onChange={(e) => setNewStudentEmail(e.target.value)}
                                placeholder="student@example.com"
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Plan Dropdown */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">الخطة</label>
                            <select
                                value={newStudentPlan}
                                onChange={(e) => setNewStudentPlan(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="spark">🚀 Spark</option>
                                <option value="emperor">👑 Emperor</option>
                                <option value="legend">💎 Legend</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-end">
                            <button
                                onClick={handleAddStudent}
                                disabled={addingStudent}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addingStudent ? 'جاري الإضافة...' : 'إرسال رابط التسجيل'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-2xl font-bold text-white">جميع الأعضاء</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50 border-b border-gray-700">
                                <tr>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">البريد الإلكتروني</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الاسم</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الهاتف</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">البلد</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الخطة</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الحالة</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">تاريخ التسجيل</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {subscriptions.map((subscription) => {
                                    const userData = users.find(u => u.email === subscription.email);

                                    const statusConfig = {
                                        active: { text: 'نشط', color: 'text-green-500 bg-green-500/10' },
                                        pending: { text: 'في الانتظار', color: 'text-orange-500 bg-orange-500/10' },
                                        inactive: { text: 'غير نشط', color: 'text-red-500 bg-red-500/10' }
                                    };

                                    const status = statusConfig[subscription.status as keyof typeof statusConfig] || statusConfig.pending;

                                    const planIcons = {
                                        spark: '🚀',
                                        emperor: '👑',
                                        legend: '💎'
                                    };

                                    return (
                                        <tr key={subscription.id} className="hover:bg-gray-800/30 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-300 text-sm">{subscription.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{userData?.name || '-'}</td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{userData?.phone || '-'}</td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{userData?.country || '-'}</td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">
                                                {planIcons[subscription.plan as keyof typeof planIcons]} {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {new Date(subscription.created_at).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {subscription.status !== 'active' && (
                                                        <button
                                                            onClick={() => handleActivate(subscription.email, subscription.plan)}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                                        >
                                                            تفعيل
                                                        </button>
                                                    )}
                                                    {subscription.status === 'active' && (
                                                        <button
                                                            onClick={() => handleDeactivate(subscription.email)}
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

                {subscriptions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        لا توجد بيانات للعرض
                    </div>
                )}
            </div>
        </div>
    );
}
