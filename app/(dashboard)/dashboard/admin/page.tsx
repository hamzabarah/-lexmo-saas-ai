'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Shield, Mail, AlertCircle, UserPlus, TrendingUp, Copy, Check, Settings, Eye, EyeOff, Calendar, Trash2 } from 'lucide-react';
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

interface CreatedStudent {
    email: string;
    name: string;
    password: string;
    plan: string;
}

interface AvailabilitySlot {
    id: string;
    day_of_week: number;
    hour: number;
    minute: number;
    is_active: boolean;
}

interface Booking {
    id: string;
    user_id: string;
    booking_date: string;
    status: string;
    product_type: string;
}

interface CoachingClient {
    user_id: string;
    email: string;
    full_name: string | null;
    google_meet_email: string | null;
    current_step: number;
    booking_date: string | null;
    booking_status: string | null;
}

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);

    // Add Student Form State
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentEmail, setNewStudentEmail] = useState('');
    const [newStudentPlan, setNewStudentPlan] = useState('spark');
    const [creatingStudent, setCreatingStudent] = useState(false);

    // Created student credentials
    const [createdStudent, setCreatedStudent] = useState<CreatedStudent | null>(null);
    const [passwordCopied, setPasswordCopied] = useState(false);

    // Settings
    const [showCompanyInfo, setShowCompanyInfo] = useState(true);
    const [togglingCompanyInfo, setTogglingCompanyInfo] = useState(false);

    // Availability
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [newSlotDay, setNewSlotDay] = useState(1);
    const [newSlotHour, setNewSlotHour] = useState(10);
    const [newSlotMinute, setNewSlotMinute] = useState(0);
    const [savingSlot, setSavingSlot] = useState(false);

    // Bookings
    const [bookings, setBookings] = useState<Booking[]>([]);

    // Coaching clients
    const [coachingClients, setCoachingClients] = useState<CoachingClient[]>([]);

    const supabase = createClient();
    const router = useRouter();

    const ADMIN_EMAIL = 'academyfrance75@gmail.com';
    const LOGIN_URL = 'https://ecomy.vercel.app/#login';

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
        await loadSettings();
        await loadAvailability();
        await loadBookings();
        await loadCoachingClients();
    };

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            setShowCompanyInfo(data.settings?.show_company_info ?? true);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const toggleCompanyInfo = async () => {
        setTogglingCompanyInfo(true);
        const newValue = !showCompanyInfo;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ key: 'show_company_info', value: newValue }),
            });
            if (res.ok) {
                setShowCompanyInfo(newValue);
            } else {
                alert('حدث خطأ أثناء تحديث الإعداد');
            }
        } catch (error) {
            console.error('Error toggling company info:', error);
            alert('حدث خطأ أثناء تحديث الإعداد');
        } finally {
            setTogglingCompanyInfo(false);
        }
    };

    const loadAvailability = async () => {
        try {
            const res = await fetch('/api/admin/availability');
            const data = await res.json();
            setAvailabilitySlots(data.slots || []);
        } catch (error) {
            console.error('Error loading availability:', error);
        }
    };

    const loadBookings = async () => {
        try {
            const res = await fetch('/api/bookings');
            // We need an admin endpoint, but for now use the existing bookings data
            // Bookings are loaded via supabase directly
            const { data: bookingsData } = await supabase
                .from('bookings')
                .select('*')
                .order('booking_date', { ascending: false });
            setBookings(bookingsData || []);
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    };

    const handleAddSlot = async () => {
        setSavingSlot(true);
        try {
            const res = await fetch('/api/admin/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ day_of_week: newSlotDay, hour: newSlotHour, minute: newSlotMinute }),
            });
            if (res.ok) {
                await loadAvailability();
            } else {
                alert('حدث خطأ أثناء إضافة الموعد');
            }
        } catch (error) {
            console.error('Error adding slot:', error);
        }
        setSavingSlot(false);
    };

    const handleDeleteSlot = async (slotId: string) => {
        try {
            const res = await fetch('/api/admin/availability', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: slotId }),
            });
            if (res.ok) {
                await loadAvailability();
            }
        } catch (error) {
            console.error('Error deleting slot:', error);
        }
    };

    const handleMarkCompleted = async (bookingId: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'completed' })
                .eq('id', bookingId);
            if (!error) await loadBookings();
        } catch (error) {
            console.error('Error marking booking completed:', error);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('id', bookingId);
            if (!error) await loadBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    };

    const loadCoachingClients = async () => {
        try {
            const { data: profiles } = await supabase
                .from('coaching_profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (!profiles) { setCoachingClients([]); return; }

            // Get bookings for these users
            const userIds = profiles.map((p: any) => p.user_id);
            const { data: clientBookings } = await supabase
                .from('bookings')
                .select('*')
                .in('user_id', userIds)
                .eq('product_type', 'diagnostic')
                .neq('status', 'cancelled');

            const clients: CoachingClient[] = profiles.map((p: any) => {
                const userData = users.find(u => u.id === p.user_id);
                const userBooking = (clientBookings || []).find((b: any) => b.user_id === p.user_id);
                return {
                    user_id: p.user_id,
                    email: userData?.email || p.user_id,
                    full_name: p.full_name,
                    google_meet_email: p.google_meet_email,
                    current_step: p.current_step,
                    booking_date: userBooking?.booking_date || null,
                    booking_status: userBooking?.status || null,
                };
            });

            setCoachingClients(clients);
        } catch (error) {
            console.error('Error loading coaching clients:', error);
        }
    };

    const STEP_LABELS: Record<number, string> = {
        1: 'الاستمارة',
        2: 'حجز الموعد',
        3: 'في الانتظار',
        4: 'التشخيص',
        5: 'النتيجة',
    };

    const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

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

    const handleCreateStudent = async () => {
        if (!newStudentName || !newStudentEmail || !newStudentEmail.includes('@')) {
            alert('يرجى ملء جميع الحقول بشكل صحيح');
            return;
        }

        setCreatingStudent(true);
        setCreatedStudent(null);

        try {
            // Get auth token
            const { data: { session } } = await supabase.auth.getSession();

            // Call API to create student
            const response = await fetch('/api/admin/create-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    name: newStudentName,
                    email: newStudentEmail,
                    plan: newStudentPlan,
                    adminEmail: ADMIN_EMAIL
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create student');
            }

            // Store credentials
            setCreatedStudent({
                email: result.user.email,
                name: result.user.name,
                password: result.password,
                plan: result.plan
            });

            // Reload data
            await loadData();

            // Reset form
            setNewStudentName('');
            setNewStudentEmail('');
            setNewStudentPlan('spark');

        } catch (error: any) {
            console.error('Error creating student:', error);
            alert(`حدث خطأ: ${error.message}`);
        } finally {
            setCreatingStudent(false);
        }
    };

    const copyPassword = () => {
        if (createdStudent) {
            navigator.clipboard.writeText(createdStudent.password);
            setPasswordCopied(true);
            setTimeout(() => setPasswordCopied(false), 2000);
        }
    };

    const sendEmail = () => {
        if (!createdStudent) return;

        const subject = '🎉 مرحباً بك في ECOMY - بيانات الدخول الخاصة بك';
        const body = `مرحباً ${createdStudent.name}،

تهانينا! 🎉

لقد أصبح بإمكانك الآن الوصول إلى ECOMY - أفضل تدريب في التجارة الإلكترونية.

بيانات تسجيل الدخول الخاصة بك:

📧 البريد الإلكتروني: ${createdStudent.email}
🔐 كلمة المرور: ${createdStudent.password}

👉 اضغط هنا لتسجيل الدخول:
${LOGIN_URL}

ننصحك بتغيير كلمة المرور بعد أول تسجيل دخول من إعدادات حسابك.

نراك قريباً في التدريب!

فريق ECOMY`;

        window.location.href = `mailto:${createdStudent.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="text-white text-xl">جاري التحميل...</div>
            </div>
        );
    }

    if (unauthorized) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
                <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">غير مصرح</h1>
                    <p className="text-gray-500 mb-6">ليس لديك صلاحية الوصول إلى هذه الصفحة</p>
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
        <div className="min-h-screen bg-[#0A0A0A] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-white">لوحة الإدارة</h1>
                    </div>
                    <p className="text-gray-500">إدارة الطلاب والاشتراكات</p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            <div className="text-gray-500 text-sm">عدد الطلاب الكلي</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{totalStudents}</div>
                    </div>
                    <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="text-gray-500 text-sm">الطلاب النشطين</div>
                        </div>
                        <div className="text-3xl font-bold text-green-500">{activeStudents}</div>
                    </div>
                    <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div className="text-gray-500 text-sm">في انتظار التفعيل</div>
                        </div>
                        <div className="text-3xl font-bold text-orange-500">{pendingStudents}</div>
                    </div>
                </div>

                {/* Site Settings */}
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Settings className="w-6 h-6 text-[#C5A04E]" />
                        <h2 className="text-2xl font-bold text-white">إعدادات الموقع</h2>
                    </div>

                    <div className="flex items-center justify-between bg-[#1A1A1A] rounded-lg px-5 py-4">
                        <div className="flex items-center gap-3">
                            {showCompanyInfo ? (
                                <Eye className="w-5 h-5 text-green-500" />
                            ) : (
                                <EyeOff className="w-5 h-5 text-gray-500" />
                            )}
                            <div>
                                <p className="text-white font-semibold text-sm">إظهار معلومات الشركة</p>
                                <p className="text-gray-500 text-xs mt-0.5">إظهار أو إخفاء بيانات الشركة في صفحة الشروط والأحكام</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleCompanyInfo}
                            disabled={togglingCompanyInfo}
                            className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                                showCompanyInfo ? 'bg-green-500' : 'bg-gray-600'
                            } ${togglingCompanyInfo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <span
                                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                                    showCompanyInfo ? 'left-0.5 translate-x-7' : 'left-0.5 translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Add New Student Section */}
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <UserPlus className="w-6 h-6 text-blue-500" />
                        <h2 className="text-2xl font-bold text-white">إضافة طالب جديد</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">الاسم</label>
                            <input
                                type="text"
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                                placeholder="الاسم الكامل"
                                className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={newStudentEmail}
                                onChange={(e) => setNewStudentEmail(e.target.value)}
                                placeholder="student@example.com"
                                className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Plan Dropdown */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">الخطة</label>
                            <select
                                value={newStudentPlan}
                                onChange={(e) => setNewStudentPlan(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="spark">📚 Formation (Spark)</option>
                                <option value="diagnostic">🔍 Diagnostic</option>
                                <option value="emperor">👑 Emperor</option>
                                <option value="legend">💎 Legend</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-end">
                            <button
                                onClick={handleCreateStudent}
                                disabled={creatingStudent}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {creatingStudent ? 'جاري الإنشاء...' : 'إنشاء الحساب وإرسال الدعوة'}
                            </button>
                        </div>
                    </div>

                    {/* Created Student Credentials Display */}
                    {createdStudent && (
                        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Check className="w-6 h-6 text-green-500" />
                                <h3 className="text-xl font-bold text-green-500">تم إنشاء الحساب بنجاح! ✅</h3>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-semibold min-w-[120px]">الاسم:</span>
                                    <span className="text-white">{createdStudent.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-semibold min-w-[120px]">البريد الإلكتروني:</span>
                                    <span className="text-white font-mono">{createdStudent.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-semibold min-w-[120px]">كود الدخول:</span>
                                    <code className="bg-[#1A1A1A] px-3 py-1 rounded text-amber-600 font-mono text-lg">
                                        {createdStudent.password}
                                    </code>
                                    <button
                                        onClick={copyPassword}
                                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
                                    >
                                        {passwordCopied ? (
                                            <>
                                                <Check className="w-4 h-4 text-green-500" />
                                                <span className="text-green-500 text-sm">تم النسخ</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-400 text-sm">نسخ</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-semibold min-w-[120px]">الخطة:</span>
                                    <span className="text-white">{createdStudent.plan === 'spark' ? '📚 Formation' : createdStudent.plan === 'diagnostic' ? '🔍 Diagnostic' : createdStudent.plan === 'emperor' ? '👑 Emperor' : '💎 Legend'}</span>
                                </div>
                            </div>

                            <button
                                onClick={sendEmail}
                                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Mail className="w-5 h-5" />
                                <span>إرسال البريد الإلكتروني</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Members Table */}
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-[#C5A04E]/10">
                        <h2 className="text-2xl font-bold text-white">جميع الأعضاء</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#1A1A1A]/50 border-b border-[#C5A04E]/10">
                                <tr>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">البريد الإلكتروني</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الاسم</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الهاتف</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">البلد</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الخطة</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الحالة</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">تاريخ التسجيل</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الإجراءات</th>
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
                                        spark: '📚',
                                        diagnostic: '🔍',
                                        emperor: '👑',
                                        legend: '💎'
                                    };

                                    return (
                                        <tr key={subscription.id} className="hover:bg-[#1A1A1A]/30 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-400 text-sm">{subscription.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">{userData?.name || '-'}</td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">{userData?.phone || '-'}</td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">{userData?.country || '-'}</td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {planIcons[subscription.plan as keyof typeof planIcons]} {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
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

                {/* ===== Availability Management ===== */}
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl p-6 mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="w-6 h-6 text-[#C5A04E]" />
                        <h2 className="text-2xl font-bold text-white">إدارة مواعيد التشخيص</h2>
                    </div>

                    {/* Add new slot form */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">اليوم</label>
                            <select
                                value={newSlotDay}
                                onChange={e => setNewSlotDay(Number(e.target.value))}
                                className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E]"
                            >
                                {DAY_NAMES.map((d, i) => (
                                    <option key={i} value={i}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">الساعة</label>
                            <input
                                type="number"
                                min={0}
                                max={23}
                                value={newSlotHour}
                                onChange={e => setNewSlotHour(Number(e.target.value))}
                                className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">الدقيقة</label>
                            <select
                                value={newSlotMinute}
                                onChange={e => setNewSlotMinute(Number(e.target.value))}
                                className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E]"
                            >
                                <option value={0}>:00</option>
                                <option value={30}>:30</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleAddSlot}
                                disabled={savingSlot}
                                className="w-full bg-[#C5A04E] hover:bg-[#D4B85C] text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                            >
                                {savingSlot ? 'جاري الحفظ...' : 'إضافة موعد'}
                            </button>
                        </div>
                    </div>

                    {/* Existing slots list */}
                    <div className="space-y-2">
                        {availabilitySlots.map(slot => (
                            <div key={slot.id} className="flex items-center justify-between bg-[#1A1A1A] rounded-lg px-4 py-3">
                                <span className="text-white text-sm">
                                    {DAY_NAMES[slot.day_of_week]} — {String(slot.hour).padStart(2, '0')}:{String(slot.minute).padStart(2, '0')}
                                </span>
                                <button
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    className="text-red-500 hover:text-red-400 text-sm transition flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    حذف
                                </button>
                            </div>
                        ))}
                        {availabilitySlots.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-4">لا توجد مواعيد متاحة. أضف مواعيد جديدة.</p>
                        )}
                    </div>
                </div>

                {/* ===== Bookings Table ===== */}
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl overflow-hidden mt-8">
                    <div className="p-6 border-b border-[#C5A04E]/10">
                        <h2 className="text-2xl font-bold text-white">حجوزات التشخيص</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#1A1A1A]/50 border-b border-[#C5A04E]/10">
                                <tr>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">العميل</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">تاريخ الجلسة</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الحالة</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {bookings.map(booking => {
                                    const bookingUser = users.find(u => u.id === booking.user_id);
                                    const statusConfig: Record<string, { text: string; color: string }> = {
                                        scheduled: { text: 'محجوز', color: 'text-blue-400 bg-blue-500/10' },
                                        completed: { text: 'مكتمل', color: 'text-green-400 bg-green-500/10' },
                                        cancelled: { text: 'ملغي', color: 'text-red-400 bg-red-500/10' },
                                    };
                                    const bStatus = statusConfig[booking.status] || statusConfig.scheduled;

                                    return (
                                        <tr key={booking.id} className="hover:bg-[#1A1A1A]/30 transition">
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {bookingUser?.email || booking.user_id}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {new Date(booking.booking_date).toLocaleString('ar-EG', {
                                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bStatus.color}`}>
                                                    {bStatus.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {booking.status === 'scheduled' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleMarkCompleted(booking.id)}
                                                                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition"
                                                            >
                                                                تم الانتهاء
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelBooking(booking.id)}
                                                                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition"
                                                            >
                                                                إلغاء
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {bookings.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            لا توجد حجوزات بعد
                        </div>
                    )}
                </div>

                {/* ===== Coaching Clients Table ===== */}
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl overflow-hidden mt-8">
                    <div className="p-6 border-b border-[#C5A04E]/10">
                        <h2 className="text-2xl font-bold text-white">عملاء التشخيص</h2>
                        <p className="text-gray-500 text-sm mt-1">معلومات العملاء وتقدمهم في مسار التشخيص</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#1A1A1A]/50 border-b border-[#C5A04E]/10">
                                <tr>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">البريد</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الاسم</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">Google Meet</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الخطوة</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">تاريخ الجلسة</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {coachingClients.map(client => {
                                    const stepColor = client.current_step >= 3
                                        ? 'text-green-400 bg-green-500/10'
                                        : client.current_step === 2
                                            ? 'text-blue-400 bg-blue-500/10'
                                            : 'text-orange-400 bg-orange-500/10';

                                    const bookingStatusConfig: Record<string, { text: string; color: string }> = {
                                        scheduled: { text: 'محجوز', color: 'text-blue-400 bg-blue-500/10' },
                                        completed: { text: 'مكتمل', color: 'text-green-400 bg-green-500/10' },
                                    };
                                    const bStatus = client.booking_status
                                        ? bookingStatusConfig[client.booking_status] || { text: client.booking_status, color: 'text-gray-400 bg-gray-500/10' }
                                        : null;

                                    return (
                                        <tr key={client.user_id} className="hover:bg-[#1A1A1A]/30 transition">
                                            <td className="px-6 py-4 text-gray-400 text-sm">{client.email}</td>
                                            <td className="px-6 py-4 text-white text-sm">{client.full_name || '-'}</td>
                                            <td className="px-6 py-4 text-gray-400 text-sm" dir="ltr">{client.google_meet_email || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stepColor}`}>
                                                    {client.current_step}/5 — {STEP_LABELS[client.current_step] || '?'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {client.booking_date
                                                    ? new Date(client.booking_date).toLocaleString('ar-EG', {
                                                        weekday: 'long', month: 'long', day: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {bStatus ? (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bStatus.color}`}>
                                                        {bStatus.text}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-600 text-sm">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {coachingClients.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            لا يوجد عملاء تشخيص بعد
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
