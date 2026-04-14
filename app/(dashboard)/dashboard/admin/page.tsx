'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Shield, Mail, AlertCircle, UserPlus, TrendingUp, Copy, Check, Settings, Eye, EyeOff, Calendar, Trash2, ChevronLeft, ChevronRight, X, MessageSquare, FileText, Send, Lock, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ChallengeTracker from './ChallengeTracker';

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

interface BlockedSlot {
    id: string;
    slot_datetime: string;
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

interface DiagnosticData {
    id: string;
    user_id: string;
    admin_id: string;
    answers: { question: string; answer: string; is_custom: boolean }[];
    summary: string | null;
    recommended_business: string | null;
    action_plan: string | null;
    recommendation: string | null;
    published: boolean;
    published_at: string | null;
    client_validated: boolean;
    validated_at: string | null;
}

const DIAGNOSTIC_QUESTIONS = [
    {
        question: 'ما هو مستواك الحالي في التجارة الإلكترونية؟',
        options: ['مبتدئ تماماً', 'لدي معرفة نظرية', 'لدي تجربة سابقة', 'لدي متجر نشط'],
    },
    {
        question: 'ما هي الميزانية المتاحة لديك للاستثمار؟',
        options: ['أقل من 500€', 'بين 500 و 1000€', 'بين 1000 و 3000€', 'أكثر من 3000€'],
    },
    {
        question: 'كم ساعة يمكنك تخصيصها أسبوعياً؟',
        options: ['أقل من 5 ساعات', 'بين 5 و 10 ساعات', 'بين 10 و 20 ساعة', 'تفرغ كامل'],
    },
];

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);

    // Add Student Form State
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentEmail, setNewStudentEmail] = useState('');
    const [newStudentPlan, setNewStudentPlan] = useState('ecommerce');
    const [creatingStudent, setCreatingStudent] = useState(false);

    // Created student credentials
    const [createdStudent, setCreatedStudent] = useState<CreatedStudent | null>(null);
    const [passwordCopied, setPasswordCopied] = useState(false);

    // Settings
    const [showCompanyInfo, setShowCompanyInfo] = useState(true);
    const [togglingCompanyInfo, setTogglingCompanyInfo] = useState(false);
    const [registrationsOpen, setRegistrationsOpen] = useState(true);
    const [togglingRegistrations, setTogglingRegistrations] = useState(false);

    // Promo state
    const [promoActive, setPromoActive] = useState(false);
    const [promoPlacesTotal, setPromoPlacesTotal] = useState(12);
    const [promoPlacesPrises, setPromoPlacesPrises] = useState(0);
    const [promoDureeHeures, setPromoDureeHeures] = useState(48);
    const [promoIntervalMinutes, setPromoIntervalMinutes] = useState(20);
    const [promoStartedAt, setPromoStartedAt] = useState<string | null>(null);
    const [launchingPromo, setLaunchingPromo] = useState(false);

    // Calendar availability
    const [blockedSlots, setBlockedSlots] = useState<Set<string>>(new Set());
    const [calendarWeekStart, setCalendarWeekStart] = useState(() => {
        const now = new Date();
        const day = now.getDay();
        const start = new Date(now);
        start.setDate(now.getDate() - day);
        start.setHours(0, 0, 0, 0);
        return start;
    });
    const [togglingSlot, setTogglingSlot] = useState<string | null>(null);

    // Bookings
    const [bookings, setBookings] = useState<Booking[]>([]);

    // Coaching clients
    const [coachingClients, setCoachingClients] = useState<CoachingClient[]>([]);

    // Diagnostic modal state
    const [selectedClient, setSelectedClient] = useState<CoachingClient | null>(null);
    const [clientDiagnostic, setClientDiagnostic] = useState<DiagnosticData | null>(null);
    const [diagnosticLoading, setDiagnosticLoading] = useState(false);
    const [diagnosticView, setDiagnosticView] = useState<'fiche' | 'questions' | 'bilan'>('fiche');
    const [diagnosticAnswers, setDiagnosticAnswers] = useState<{ question: string; answer: string; is_custom: boolean }[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [customAnswer, setCustomAnswer] = useState('');
    const [bilanForm, setBilanForm] = useState({ summary: '', recommended_business: '', action_plan: '', recommendation: '' });
    const [savingDiagnostic, setSavingDiagnostic] = useState(false);
    const [publishingDiagnostic, setPublishingDiagnostic] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    const ADMIN_EMAIL = 'academyfrance75@gmail.com';
    const LOGIN_URL = 'https://ecomy.ai/#login';

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
        await loadBlockedSlots();
        await loadBookings();
        await loadCoachingClients();
    };

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            setShowCompanyInfo(data.settings?.show_company_info ?? true);
            setRegistrationsOpen(data.settings?.registrations_open ?? true);
            setPromoActive(data.settings?.promo_active ?? false);
            setPromoPlacesTotal(data.settings?.promo_places_total ?? 12);
            setPromoPlacesPrises(data.settings?.promo_places_prises ?? 0);
            setPromoDureeHeures(data.settings?.promo_duree_heures ?? 48);
            setPromoIntervalMinutes(data.settings?.promo_interval_minutes ?? 20);
            setPromoStartedAt(data.settings?.promo_started_at ?? null);
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

    const toggleRegistrations = async () => {
        setTogglingRegistrations(true);
        const newValue = !registrationsOpen;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`,
            };
            // Save registrations_open
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers,
                body: JSON.stringify({ key: 'registrations_open', value: newValue }),
            });
            if (res.ok) {
                // Save closed_at timestamp
                await fetch('/api/admin/settings', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        key: 'registrations_closed_at',
                        value: newValue ? null : new Date().toISOString(),
                    }),
                });
                setRegistrationsOpen(newValue);
            } else {
                alert('حدث خطأ أثناء تحديث الإعداد');
            }
        } catch (error) {
            console.error('Error toggling registrations:', error);
            alert('حدث خطأ أثناء تحديث الإعداد');
        } finally {
            setTogglingRegistrations(false);
        }
    };

    const launchPromo = async () => {
        setLaunchingPromo(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` };
            const keys: Record<string, any> = {
                promo_active: true,
                promo_places_total: promoPlacesTotal,
                promo_places_prises: 0,
                promo_duree_heures: promoDureeHeures,
                promo_interval_minutes: promoIntervalMinutes,
                promo_started_at: new Date().toISOString(),
                registrations_open: true,
                registrations_closed_at: null,
            };
            for (const [key, value] of Object.entries(keys)) {
                await fetch('/api/admin/settings', { method: 'POST', headers, body: JSON.stringify({ key, value }) });
            }
            setPromoActive(true);
            setPromoPlacesPrises(0);
            setPromoStartedAt(new Date().toISOString());
            setRegistrationsOpen(true);
        } catch (error) {
            console.error('Error launching promo:', error);
            alert('حدث خطأ أثناء تشغيل العرض');
        } finally {
            setLaunchingPromo(false);
        }
    };

    const stopPromo = async () => {
        setLaunchingPromo(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` };
            const keys: Record<string, any> = {
                promo_active: false,
                promo_started_at: null,
            };
            for (const [key, value] of Object.entries(keys)) {
                await fetch('/api/admin/settings', { method: 'POST', headers, body: JSON.stringify({ key, value }) });
            }
            setPromoActive(false);
            setPromoStartedAt(null);
        } catch (error) {
            console.error('Error stopping promo:', error);
            alert('حدث خطأ أثناء إيقاف العرض');
        } finally {
            setLaunchingPromo(false);
        }
    };

    const loadBlockedSlots = async (weekStart?: Date) => {
        try {
            const start = weekStart || calendarWeekStart;
            const end = new Date(start);
            end.setDate(start.getDate() + 7);
            const res = await fetch(`/api/admin/blocked-slots?from=${start.toISOString()}&to=${end.toISOString()}`);
            const data = await res.json();
            const set = new Set<string>((data.slots || []).map((s: any) => new Date(s.slot_datetime).toISOString()));
            setBlockedSlots(set);
        } catch (error) {
            console.error('Error loading blocked slots:', error);
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

    const handleToggleSlot = async (slotDatetime: string) => {
        setTogglingSlot(slotDatetime);
        try {
            const res = await fetch('/api/admin/blocked-slots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slot_datetime: slotDatetime }),
            });
            if (res.ok) {
                const data = await res.json();
                setBlockedSlots(prev => {
                    const next = new Set(prev);
                    if (data.action === 'blocked') {
                        next.add(slotDatetime);
                    } else {
                        next.delete(slotDatetime);
                    }
                    return next;
                });
            }
        } catch (error) {
            console.error('Error toggling slot:', error);
        }
        setTogglingSlot(null);
    };

    const navigateWeek = (direction: number) => {
        const newStart = new Date(calendarWeekStart);
        newStart.setDate(calendarWeekStart.getDate() + (direction * 7));
        setCalendarWeekStart(newStart);
        loadBlockedSlots(newStart);
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

    // ===== Diagnostic handlers =====
    const handleOpenClientFiche = async (client: CoachingClient) => {
        setSelectedClient(client);
        setDiagnosticView('fiche');
        setDiagnosticLoading(true);
        setClientDiagnostic(null);
        setDiagnosticAnswers([]);
        setCurrentQuestionIndex(0);
        setCustomAnswer('');
        setBilanForm({ summary: '', recommended_business: '', action_plan: '', recommendation: '' });

        try {
            const res = await fetch(`/api/admin/diagnostic?user_id=${client.user_id}`);
            const data = await res.json();
            if (data.diagnostic) {
                setClientDiagnostic(data.diagnostic);
                if (data.diagnostic.answers?.length) {
                    setDiagnosticAnswers(data.diagnostic.answers);
                }
                setBilanForm({
                    summary: data.diagnostic.summary || '',
                    recommended_business: data.diagnostic.recommended_business || '',
                    action_plan: data.diagnostic.action_plan || '',
                    recommendation: data.diagnostic.recommendation || '',
                });
            }
        } catch (err) {
            console.error('Error loading diagnostic:', err);
        }
        setDiagnosticLoading(false);
    };

    const handleCloseClientFiche = () => {
        setSelectedClient(null);
        setClientDiagnostic(null);
        setDiagnosticView('fiche');
    };

    const handleStartDiagnostic = () => {
        setDiagnosticView('questions');
        setCurrentQuestionIndex(0);
        setDiagnosticAnswers([]);
        setCustomAnswer('');
    };

    const handleAnswerQuestion = async (answer: string, isCustom: boolean) => {
        const currentQ = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];
        const newAnswers = [...diagnosticAnswers, { question: currentQ.question, answer, is_custom: isCustom }];
        setDiagnosticAnswers(newAnswers);
        setCustomAnswer('');

        if (currentQuestionIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Last question — save answers
            setSavingDiagnostic(true);
            try {
                const res = await fetch('/api/admin/diagnostic', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: selectedClient!.user_id, answers: newAnswers }),
                });
                const data = await res.json();
                if (data.diagnostic) setClientDiagnostic(data.diagnostic);
            } catch (err) {
                console.error('Error saving answers:', err);
            }
            setSavingDiagnostic(false);
            setDiagnosticView('bilan');
        }
    };

    const handleSaveBilan = async (publish: boolean = false) => {
        if (publish) {
            setPublishingDiagnostic(true);
        } else {
            setSavingDiagnostic(true);
        }

        try {
            const res = await fetch('/api/admin/diagnostic', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: selectedClient!.user_id,
                    ...bilanForm,
                    publish,
                }),
            });
            const data = await res.json();
            if (data.diagnostic) {
                setClientDiagnostic(data.diagnostic);
                if (publish) {
                    await loadCoachingClients();
                    alert('تم نشر التشخيص بنجاح');
                }
            }
        } catch (err) {
            console.error('Error saving bilan:', err);
        }
        setSavingDiagnostic(false);
        setPublishingDiagnostic(false);
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

                    {/* Registrations Toggle */}
                    <div className="flex items-center justify-between bg-[#1A1A1A] rounded-lg px-5 py-4 mt-3">
                        <div className="flex items-center gap-3">
                            {registrationsOpen ? (
                                <Eye className="w-5 h-5 text-green-500" />
                            ) : (
                                <Lock className="w-5 h-5 text-red-500" />
                            )}
                            <div>
                                <p className="text-white font-semibold text-sm">التسجيلات</p>
                                <p className="text-gray-500 text-xs mt-0.5">فتح أو إغلاق التسجيلات في الصفحة الرئيسية</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold ${registrationsOpen ? 'text-green-400' : 'text-red-400'}`}>
                                {registrationsOpen ? 'مفتوحة ✅' : 'مغلقة ❌'}
                            </span>
                            <button
                                onClick={toggleRegistrations}
                                disabled={togglingRegistrations}
                                className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                                    registrationsOpen ? 'bg-green-500' : 'bg-red-500'
                                } ${togglingRegistrations ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <span
                                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                                        registrationsOpen ? 'left-0.5 translate-x-7' : 'left-0.5 translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Promo Section */}
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Gift className="w-6 h-6 text-[#C5A04E]" />
                        <h2 className="text-2xl font-bold text-white">عرض محدود</h2>
                        {promoActive && (
                            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full animate-pulse">نشط</span>
                        )}
                    </div>

                    {!promoActive ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">عدد الأماكن</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={promoPlacesTotal}
                                        onChange={(e) => setPromoPlacesTotal(parseInt(e.target.value) || 12)}
                                        className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] text-center text-xl font-bold"
                                        style={{ fontFamily: 'Orbitron, monospace' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">مدة العرض (ساعات)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={168}
                                        value={promoDureeHeures}
                                        onChange={(e) => setPromoDureeHeures(parseInt(e.target.value) || 48)}
                                        className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] text-center text-xl font-bold"
                                        style={{ fontFamily: 'Orbitron, monospace' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">الوقت بين كل تسجيل وهمي (دقائق)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={120}
                                        value={promoIntervalMinutes}
                                        onChange={(e) => setPromoIntervalMinutes(parseInt(e.target.value) || 20)}
                                        className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] text-center text-xl font-bold"
                                        style={{ fontFamily: 'Orbitron, monospace' }}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={launchPromo}
                                disabled={launchingPromo}
                                className="w-full bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] text-white font-bold py-4 rounded-xl text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {launchingPromo ? 'جاري التشغيل...' : '🚀 تشغيل العرض'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-[#1A1A1A] rounded-xl p-4 text-center">
                                    <p className="text-gray-500 text-xs mb-1">الأماكن</p>
                                    <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, monospace' }}>{promoPlacesPrises}/{promoPlacesTotal}</p>
                                </div>
                                <div className="bg-[#1A1A1A] rounded-xl p-4 text-center">
                                    <p className="text-gray-500 text-xs mb-1">المدة</p>
                                    <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, monospace' }}>{promoDureeHeures}h</p>
                                </div>
                                <div className="bg-[#1A1A1A] rounded-xl p-4 text-center">
                                    <p className="text-gray-500 text-xs mb-1">كل</p>
                                    <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, monospace' }}>{promoIntervalMinutes}min</p>
                                </div>
                            </div>
                            <button
                                onClick={stopPromo}
                                disabled={launchingPromo}
                                className="w-full bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-4 rounded-xl text-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                            >
                                {launchingPromo ? 'جاري الإيقاف...' : '⛔ إيقاف العرض'}
                            </button>
                        </>
                    )}
                </div>

                {/* Challenge Tracker */}
                <ChallengeTracker />

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
                                <option value="ecommerce">🛒 التجارة الإلكترونية (497€)</option>
                                <option value="diagnostic">🔍 تشخيص بزنس (97€)</option>
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
                                    <span className="text-white">{createdStudent.plan === 'ecommerce' ? '🛒 التجارة الإلكترونية' : '🔍 تشخيص بزنس'}</span>
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
                                                {new Date(subscription.created_at).toLocaleDateString('ar-u-nu-latn')}
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

                {/* ===== Weekly Calendar Availability ===== */}
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl p-6 mt-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-6 h-6 text-[#C5A04E]" />
                        <h2 className="text-2xl font-bold text-white">إدارة مواعيد التشخيص</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">اضغط على الموعد لحظره (أحمر) أو إتاحته (فارغ). المواعيد الفارغة متاحة للعملاء.</p>

                    {/* Week Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => navigateWeek(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5">
                            <ChevronRight className="w-5 h-5" />
                            <span className="text-sm font-bold">الأسبوع السابق</span>
                        </button>
                        <span className="text-white font-bold text-sm">
                            {calendarWeekStart.toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {' — '}
                            {(() => { const end = new Date(calendarWeekStart); end.setDate(calendarWeekStart.getDate() + 6); return end.toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'long' }); })()}
                        </span>
                        <button onClick={() => navigateWeek(1)} className="flex items-center gap-1 text-gray-400 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5">
                            <span className="text-sm font-bold">الأسبوع التالي</span>
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[700px]">
                            {/* Day headers */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {DAY_NAMES.map((dayName, i) => {
                                    const date = new Date(calendarWeekStart);
                                    date.setDate(calendarWeekStart.getDate() + i);
                                    const isToday = date.toDateString() === new Date().toDateString();
                                    return (
                                        <div key={i} className={`text-center py-2 rounded-lg ${isToday ? 'bg-[#C5A04E]/10' : ''}`}>
                                            <div className={`text-xs font-bold ${isToday ? 'text-[#C5A04E]' : 'text-gray-400'}`}>{dayName}</div>
                                            <div className={`text-lg font-bold ${isToday ? 'text-[#C5A04E]' : 'text-white'}`}>{date.getDate()}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Hour rows */}
                            {Array.from({ length: 11 }, (_, hi) => 9 + hi).map(hour => (
                                <div key={hour} className="grid grid-cols-7 gap-1 mb-1">
                                    {Array.from({ length: 7 }, (_, di) => {
                                        const d = new Date(calendarWeekStart);
                                        d.setDate(calendarWeekStart.getDate() + di);
                                        // Use local date components to build UTC date (avoids day shift)
                                        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), hour, 0, 0, 0));
                                        const iso = date.toISOString();
                                        const isBlocked = blockedSlots.has(iso);
                                        const isPast = date < new Date();
                                        const isToggling = togglingSlot === iso;

                                        // Check if this slot has a booking
                                        const hasBooking = bookings.some(b => new Date(b.booking_date).toISOString() === iso && b.status !== 'cancelled');

                                        return (
                                            <button
                                                key={di}
                                                onClick={() => !isPast && !hasBooking && handleToggleSlot(iso)}
                                                disabled={isPast || isToggling || hasBooking}
                                                className={`py-1.5 rounded text-xs font-bold transition-all ${
                                                    hasBooking
                                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 cursor-not-allowed'
                                                        : isPast
                                                            ? 'bg-[#0A0A0A] text-gray-700 cursor-not-allowed'
                                                            : isBlocked
                                                                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                                                : 'bg-[#1A1A1A] text-gray-300 border border-transparent hover:border-[#C5A04E]/30 hover:bg-[#C5A04E]/5'
                                                } ${isToggling ? 'opacity-50' : ''}`}
                                            >
                                                {String(hour).padStart(2, '0')}:00
                                                {hasBooking && ' 📅'}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-4 h-4 rounded bg-[#1A1A1A] border border-gray-700"></div>
                            <span>متاح</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
                            <span>محظور</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/30"></div>
                            <span>محجوز</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-4 h-4 rounded bg-[#0A0A0A]"></div>
                            <span>ماضي</span>
                        </div>
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
                                                {new Date(booking.booking_date).toLocaleString('ar-u-nu-latn', {
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
                                        <tr key={client.user_id} onClick={() => handleOpenClientFiche(client)} className="hover:bg-[#1A1A1A]/30 transition cursor-pointer">
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
                                                    ? new Date(client.booking_date).toLocaleString('ar-u-nu-latn', {
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

            {/* ===== Diagnostic Modal ===== */}
            {selectedClient && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={handleCloseClientFiche}>
                    <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#C5A04E]/10">
                            <h2 className="text-xl font-bold text-white">
                                {diagnosticView === 'fiche' && 'ملف العميل'}
                                {diagnosticView === 'questions' && `سؤال ${currentQuestionIndex + 1} / ${DIAGNOSTIC_QUESTIONS.length}`}
                                {diagnosticView === 'bilan' && 'تحرير التشخيص'}
                            </h2>
                            <button onClick={handleCloseClientFiche} className="text-gray-400 hover:text-white transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {diagnosticLoading ? (
                                <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
                            ) : diagnosticView === 'fiche' ? (
                                /* ===== FICHE VIEW ===== */
                                <div className="space-y-6">
                                    {/* Client info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#1A1A1A] rounded-xl p-4">
                                            <p className="text-gray-500 text-xs mb-1">الاسم الكامل</p>
                                            <p className="text-white font-semibold">{selectedClient.full_name || '-'}</p>
                                        </div>
                                        <div className="bg-[#1A1A1A] rounded-xl p-4">
                                            <p className="text-gray-500 text-xs mb-1">البريد الإلكتروني</p>
                                            <p className="text-white font-semibold text-sm" dir="ltr">{selectedClient.email}</p>
                                        </div>
                                        <div className="bg-[#1A1A1A] rounded-xl p-4">
                                            <p className="text-gray-500 text-xs mb-1">Google Meet</p>
                                            <p className="text-white font-semibold text-sm" dir="ltr">{selectedClient.google_meet_email || '-'}</p>
                                        </div>
                                        <div className="bg-[#1A1A1A] rounded-xl p-4">
                                            <p className="text-gray-500 text-xs mb-1">تاريخ الجلسة</p>
                                            <p className="text-white font-semibold text-sm">
                                                {selectedClient.booking_date
                                                    ? new Date(selectedClient.booking_date).toLocaleString('ar-u-nu-latn', {
                                                        weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })
                                                    : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step badge */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500 text-sm">الخطوة الحالية:</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            selectedClient.current_step >= 4 ? 'text-green-400 bg-green-500/10' :
                                            selectedClient.current_step === 3 ? 'text-blue-400 bg-blue-500/10' :
                                            'text-orange-400 bg-orange-500/10'
                                        }`}>
                                            {selectedClient.current_step}/5 — {STEP_LABELS[selectedClient.current_step] || '?'}
                                        </span>
                                    </div>

                                    {/* Diagnostic status + actions */}
                                    {clientDiagnostic?.published ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Check className="w-5 h-5 text-green-500" />
                                                <span className="text-green-400 font-semibold">تم نشر التشخيص</span>
                                                {clientDiagnostic.client_validated && (
                                                    <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full mr-2">تم التأكيد من العميل</span>
                                                )}
                                            </div>

                                            {/* Show answers */}
                                            {clientDiagnostic.answers?.length > 0 && (
                                                <div className="space-y-2">
                                                    <h4 className="text-gray-400 text-sm font-bold">الإجابات</h4>
                                                    {clientDiagnostic.answers.map((a: any, i: number) => (
                                                        <div key={i} className="bg-[#0A0A0A] rounded-lg p-3">
                                                            <p className="text-gray-500 text-xs mb-1">{a.question}</p>
                                                            <p className="text-white text-sm">{a.answer} {a.is_custom && <span className="text-[#C5A04E] text-xs">(إجابة مخصصة)</span>}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Show bilan */}
                                            <div className="space-y-2">
                                                <h4 className="text-gray-400 text-sm font-bold">التشخيص</h4>
                                                {[
                                                    { label: 'ملخص الوضع', value: clientDiagnostic.summary },
                                                    { label: 'البزنس المناسب', value: clientDiagnostic.recommended_business },
                                                    { label: 'خطة العمل', value: clientDiagnostic.action_plan },
                                                    { label: 'التوصية', value: clientDiagnostic.recommendation },
                                                ].map((field, i) => (
                                                    <div key={i} className="bg-[#0A0A0A] rounded-lg p-3">
                                                        <p className="text-[#C5A04E] text-xs font-bold mb-1">{field.label}</p>
                                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{field.value || '-'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : clientDiagnostic?.answers?.length ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="w-5 h-5 text-orange-400" />
                                                <span className="text-orange-400 font-semibold">التشخيص قيد التحرير</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setDiagnosticView('questions')}
                                                    className="flex-1 bg-[#1A1A1A] border border-[#C5A04E]/20 hover:border-[#C5A04E]/40 text-white font-bold py-3 rounded-xl transition"
                                                >
                                                    إعادة الأسئلة
                                                </button>
                                                <button
                                                    onClick={() => setDiagnosticView('bilan')}
                                                    className="flex-1 bg-[#C5A04E] hover:bg-[#D4B85C] text-white font-bold py-3 rounded-xl transition"
                                                >
                                                    تحرير التشخيص
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleStartDiagnostic}
                                            className="w-full bg-[#E8600A] hover:bg-[#D15509] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-3"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                            بدء التشخيص
                                        </button>
                                    )}
                                </div>

                            ) : diagnosticView === 'questions' ? (
                                /* ===== QUESTIONS VIEW ===== */
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <p className="text-[#C5A04E] text-sm font-bold mb-2">
                                            السؤال {currentQuestionIndex + 1} من {DIAGNOSTIC_QUESTIONS.length}
                                        </p>
                                        <div className="w-full bg-[#1A1A1A] rounded-full h-1.5 mb-4">
                                            <div
                                                className="bg-[#C5A04E] h-1.5 rounded-full transition-all"
                                                style={{ width: `${((currentQuestionIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
                                            />
                                        </div>
                                        <h3 className="text-white text-lg font-bold">
                                            {DIAGNOSTIC_QUESTIONS[currentQuestionIndex].question}
                                        </h3>
                                    </div>

                                    {/* Option buttons */}
                                    <div className="space-y-2">
                                        {DIAGNOSTIC_QUESTIONS[currentQuestionIndex].options.map((option, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleAnswerQuestion(option, false)}
                                                disabled={savingDiagnostic}
                                                className="w-full text-right bg-[#1A1A1A] border border-[#C5A04E]/10 hover:border-[#C5A04E]/40 hover:bg-[#C5A04E]/5 text-white py-3.5 px-5 rounded-xl transition-all disabled:opacity-50"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom answer */}
                                    <div className="border-t border-gray-800 pt-4">
                                        <p className="text-gray-500 text-sm mb-2">أخرى (إجابة مخصصة)</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={customAnswer}
                                                onChange={e => setCustomAnswer(e.target.value)}
                                                placeholder="اكتب الإجابة هنا..."
                                                className="flex-1 bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] focus:border-[#C5A04E]"
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && customAnswer.trim()) {
                                                        handleAnswerQuestion(customAnswer.trim(), true);
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={() => customAnswer.trim() && handleAnswerQuestion(customAnswer.trim(), true)}
                                                disabled={!customAnswer.trim() || savingDiagnostic}
                                                className="bg-[#C5A04E] hover:bg-[#D4B85C] text-white font-bold px-5 rounded-xl transition disabled:opacity-50"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {savingDiagnostic && (
                                        <p className="text-center text-gray-500 text-sm">جاري حفظ الإجابات...</p>
                                    )}
                                </div>

                            ) : diagnosticView === 'bilan' ? (
                                /* ===== BILAN VIEW ===== */
                                <div className="space-y-6">
                                    {/* Answers summary */}
                                    {diagnosticAnswers.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-gray-400 text-sm font-bold flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                ملخص الإجابات
                                            </h4>
                                            {diagnosticAnswers.map((a, i) => (
                                                <div key={i} className="bg-[#0A0A0A] rounded-lg p-3">
                                                    <p className="text-gray-500 text-xs mb-1">{a.question}</p>
                                                    <p className="text-white text-sm">{a.answer} {a.is_custom && <span className="text-[#C5A04E] text-xs">(مخصصة)</span>}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Bilan form */}
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-[#C5A04E]" />
                                            تحرير التشخيص
                                        </h4>

                                        {[
                                            { key: 'summary' as const, label: 'ملخص الوضع', placeholder: 'اكتب ملخص وضع العميل...' },
                                            { key: 'recommended_business' as const, label: 'البزنس المناسب', placeholder: 'ما هو البزنس المناسب لهذا العميل...' },
                                            { key: 'action_plan' as const, label: 'خطة العمل', placeholder: 'الخطوات العملية التي يجب اتباعها...' },
                                            { key: 'recommendation' as const, label: 'التوصية', placeholder: 'التوصية النهائية للعميل...' },
                                        ].map(field => (
                                            <div key={field.key}>
                                                <label className="block text-sm text-[#C5A04E] font-bold mb-2">{field.label}</label>
                                                <textarea
                                                    value={bilanForm[field.key]}
                                                    onChange={e => setBilanForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                    placeholder={field.placeholder}
                                                    rows={3}
                                                    className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] focus:border-[#C5A04E] resize-none"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => handleSaveBilan(false)}
                                            disabled={savingDiagnostic}
                                            className="flex-1 border border-[#C5A04E]/30 hover:border-[#C5A04E] text-[#C5A04E] font-bold py-3.5 rounded-xl transition disabled:opacity-50"
                                        >
                                            {savingDiagnostic ? 'جاري الحفظ...' : 'حفظ المسودة'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('هل تريد نشر التشخيص؟ سيتمكن العميل من رؤيته فوراً.')) {
                                                    handleSaveBilan(true);
                                                }
                                            }}
                                            disabled={publishingDiagnostic || !bilanForm.summary || !bilanForm.recommended_business}
                                            className="flex-1 bg-[#E8600A] hover:bg-[#D15509] text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50"
                                        >
                                            {publishingDiagnostic ? 'جاري النشر...' : 'نشر التشخيص'}
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
