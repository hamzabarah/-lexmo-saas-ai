"use client";

import { useEffect, useState, useCallback } from "react";
import { checkUserSubscription, SubscriptionCheckResult } from "@/lib/check-subscription";
import { Lock, Calendar, Clock, CheckCircle, ClipboardList, Timer, Search, FileText, User, Mail, ChevronLeft, ChevronRight } from "lucide-react";

interface CoachingProfile {
    id: string;
    user_id: string;
    full_name: string | null;
    google_meet_email: string | null;
    current_step: number;
}

interface BookingData {
    id: string;
    booking_date: string;
    status: string;
}

const STEP_CONFIG = [
    { num: 1, title: "معلوماتك", icon: ClipboardList, description: "أدخل اسمك وبريدك الإلكتروني لحجز جلستك" },
    { num: 2, title: "حجز الموعد", icon: Calendar, description: "اختر الموعد المناسب لك لجلسة Google Meet" },
    { num: 3, title: "موعد الجلسة", icon: Timer, description: "العد التنازلي لجلستك الخاصة" },
    { num: 4, title: "التشخيص", icon: Search, description: "تحليل شامل لوضعك واكتشاف البزنس المناسب لك" },
    { num: 5, title: "النتيجة", icon: FileText, description: "ملخص التشخيص + خطة العمل + التوصية" },
];

function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isPast, setIsPast] = useState(false);

    useEffect(() => {
        const calc = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const diff = target - now;

            if (diff <= 0) {
                setIsPast(true);
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };

        calc();
        const interval = setInterval(calc, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (isPast) {
        return (
            <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-green-400 text-lg font-bold">تمت الجلسة</p>
            </div>
        );
    }

    const boxes = [
        { value: timeLeft.days, label: "أيام" },
        { value: timeLeft.hours, label: "ساعات" },
        { value: timeLeft.minutes, label: "دقائق" },
        { value: timeLeft.seconds, label: "ثواني" },
    ];

    return (
        <div className="flex justify-center gap-4">
            {boxes.map((box) => (
                <div key={box.label} className="bg-[#0A0A0A] border border-[#C5A04E]/20 rounded-xl px-5 py-4 min-w-[80px] text-center">
                    <div className="text-3xl font-bold text-white font-mono" style={{ fontFamily: 'Inter, system-ui, monospace' }}>
                        {String(box.value).padStart(2, '0')}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 font-bold">{box.label}</div>
                </div>
            ))}
        </div>
    );
}

export default function CoachingPage() {
    const [subscriptionCheck, setSubscriptionCheck] = useState<SubscriptionCheckResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<CoachingProfile | null>(null);
    const [booking, setBooking] = useState<BookingData | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [diagnostic, setDiagnostic] = useState<any>(null);
    const [validating, setValidating] = useState(false);

    // Calendar week state
    const [calendarWeekStart, setCalendarWeekStart] = useState(() => {
        const now = new Date();
        const day = now.getDay();
        const start = new Date(now);
        start.setDate(now.getDate() - day);
        start.setHours(0, 0, 0, 0);
        return start;
    });

    // Form fields (step 1)
    const [fullName, setFullName] = useState("");
    const [googleMeetEmail, setGoogleMeetEmail] = useState("");
    const [formSubmitting, setFormSubmitting] = useState(false);

    const currentStep = profile?.current_step || 1;

    const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    const availableSlotsSet = new Set(availableSlots);

    const loadProfile = useCallback(async () => {
        try {
            const res = await fetch('/api/coaching-profile');
            const data = await res.json();
            if (data.profile) setProfile(data.profile);
            if (data.booking) setBooking(data.booking);
            if (data.diagnostic) setDiagnostic(data.diagnostic);
        } catch {
            console.error('Error loading profile');
        }
    }, []);

    const loadSlots = useCallback(async () => {
        setSlotsLoading(true);
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            setAvailableSlots(data.slots || []);
        } catch {
            console.error('Error loading slots');
        }
        setSlotsLoading(false);
    }, []);

    useEffect(() => {
        checkUserSubscription().then(async (result) => {
            setSubscriptionCheck(result);
            const hasAccess = result?.hasAccess && (result?.subscription?.plan === 'diagnostic' || result?.isAdmin);
            if (hasAccess) {
                await loadProfile();
            }
            setLoading(false);
        });
    }, [loadProfile]);

    // Load slots when step 2 is active
    useEffect(() => {
        if (currentStep === 2) {
            loadSlots();
        }
    }, [currentStep, loadSlots]);

    const handleFormSubmit = async () => {
        if (!fullName.trim() || !googleMeetEmail.trim()) {
            setError('يرجى ملء جميع الحقول');
            return;
        }
        if (!googleMeetEmail.includes('@')) {
            setError('البريد الإلكتروني غير صالح');
            return;
        }

        setFormSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/coaching-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: fullName, google_meet_email: googleMeetEmail }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'حدث خطأ');
            } else {
                setProfile(data.profile);
            }
        } catch {
            setError('حدث خطأ');
        }
        setFormSubmitting(false);
    };

    const handleBook = async () => {
        if (!selectedSlot) return;
        setBookingLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_date: selectedSlot }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'حدث خطأ أثناء الحجز');
            } else {
                setBooking(data.booking);
                // Refresh profile to get updated step
                await loadProfile();
            }
        } catch {
            setError('حدث خطأ أثناء الحجز');
        }
        setBookingLoading(false);
    };

    const handleValidateDiagnostic = async () => {
        setValidating(true);
        try {
            const res = await fetch('/api/coaching-profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'validate_diagnostic' }),
            });
            if (res.ok) {
                await loadProfile();
            }
        } catch {
            console.error('Error validating diagnostic');
        }
        setValidating(false);
    };

    // === ADMIN DEMO STATE (local only, no API calls) ===
    const isAdmin = subscriptionCheck?.isAdmin === true;
    const [demoStep, setDemoStep] = useState(1);
    const [demoName, setDemoName] = useState("");
    const [demoEmail, setDemoEmail] = useState("");
    const [demoSelectedSlot, setDemoSelectedSlot] = useState<string | null>(null);

    // Generate fake slots for demo calendar
    const generateDemoSlots = () => {
        const slots: string[] = [];
        const now = new Date();
        for (let d = 1; d <= 10; d++) {
            const date = new Date(now);
            date.setDate(now.getDate() + d);
            for (const h of [10, 11, 14, 15, 16, 17]) {
                slots.push(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), h, 0, 0)).toISOString());
            }
        }
        return slots;
    };
    const demoSlots = isAdmin ? generateDemoSlots() : [];
    const demoSlotsSet = new Set(demoSlots);

    // Demo fake booking date (tomorrow at 14:00)
    const demoBookingDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 14, 0, 0)).toISOString();
    })();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-500 text-lg">جاري التحميل...</div>
            </div>
        );
    }

    const hasDiagnosticAccess =
        subscriptionCheck?.hasAccess &&
        (subscriptionCheck?.subscription?.plan === 'diagnostic' || subscriptionCheck?.isAdmin);

    if (!hasDiagnosticAccess) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-12 max-w-lg text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">الوصول مقيد</h2>
                    <p className="text-gray-400 mb-6">هذه المنطقة مخصصة لعملاء تشخيص البزنس</p>
                    <a
                        href="/diagnostic"
                        className="inline-block bg-[#E8600A] hover:bg-[#D15509] text-white font-bold px-8 py-3 rounded-xl transition-colors"
                    >
                        اكتشف تشخيص البزنس
                    </a>
                </div>
            </div>
        );
    }

    // =============================================
    // ADMIN DEMO MODE — Visual-only, no Supabase
    // =============================================
    if (isAdmin) {
        const DEMO_VISUAL_STEPS = [
            { icon: "💳", text: "ادفع 97€ على lexmo.ai" },
            { icon: "📧", text: "توصلك رسالة على الإيميل ديالك" },
            { icon: "📝", text: "سجل حسابك في المنصة" },
            { icon: "📅", text: "اختار الموعد اللي يناسبك أنت" },
            { icon: "⏳", text: "استنا يوم الموعد" },
            { icon: "🎥", text: "نتلاقاو على Google Meet — 45 دقيقة" },
            { icon: "📊", text: "توصلك نتيجة التشخيص في حسابك" },
        ];

        const DEMO_STEP_CONFIG = [
            { num: 1, title: "معلوماتك", icon: ClipboardList, description: "أدخل اسمك وبريدك الإلكتروني لحجز جلستك" },
            { num: 2, title: "حجز الموعد", icon: Calendar, description: "اختر الموعد المناسب لك لجلسة Google Meet" },
            { num: 3, title: "موعد الجلسة", icon: Timer, description: "العد التنازلي لجلستك الخاصة" },
            { num: 4, title: "التشخيص", icon: Search, description: "تحليل شامل لوضعك واكتشاف البزنس المناسب لك" },
            { num: 5, title: "النتيجة", icon: FileText, description: "ملخص التشخيص + خطة العمل + التوصية" },
        ];

        return (
            <div className="max-w-3xl mx-auto space-y-4 py-4">
                {/* Header */}
                <div className="text-center space-y-2 mb-4">
                    <h1 className="text-3xl font-bold text-white">جلسة التشخيص</h1>
                    <p className="text-gray-400">أكمل الخطوات للحصول على جلستك الفردية</p>
                </div>

                {/* 7-STEP VISUAL PROCESS BANNER */}
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-center flex-wrap gap-2 md:gap-0">
                        {DEMO_VISUAL_STEPS.map((vs, i) => (
                            <div key={i} className="flex items-center">
                                <div className="flex flex-col items-center text-center min-w-[80px] md:min-w-[90px]">
                                    <div className="w-12 h-12 bg-[#C5A04E]/10 border-2 border-[#C5A04E]/30 rounded-full flex items-center justify-center text-xl mb-2">
                                        {vs.icon}
                                    </div>
                                    <span className="text-[10px] md:text-xs text-gray-300 font-bold leading-tight px-1 max-w-[90px]">
                                        {vs.text}
                                    </span>
                                </div>
                                {i < DEMO_VISUAL_STEPS.length - 1 && (
                                    <div className="text-[#C5A04E]/40 mx-1 text-lg hidden md:block">←</div>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-gray-400 text-sm mt-5 leading-relaxed">
                        أنت اللي كتختار الوقت اللي يناسبك. كنديرو التشخيص مع بعض، ومن بعد كتوصلك النتيجة مباشرة في حسابك 🎯
                    </p>
                </div>

                {/* 5 INTERACTIVE DEMO STEPS */}
                {DEMO_STEP_CONFIG.map((step, idx) => {
                    const isCompleted = demoStep > step.num;
                    const isActive = demoStep === step.num;
                    const isLocked = demoStep < step.num;
                    const Icon = step.icon;
                    const isLast = idx === DEMO_STEP_CONFIG.length - 1;

                    return (
                        <div key={step.num} className="flex gap-4">
                            {/* Step indicator column */}
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                    isCompleted
                                        ? 'bg-green-500/20 border-2 border-green-500'
                                        : isActive
                                            ? 'bg-[#C5A04E]/20 border-2 border-[#C5A04E]'
                                            : 'bg-[#1A1A1A] border-2 border-gray-700'
                                }`}>
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : isLocked ? (
                                        <Lock className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <span className={`text-sm font-bold ${isActive ? 'text-[#C5A04E]' : 'text-gray-500'}`}>
                                            {step.num}
                                        </span>
                                    )}
                                </div>
                                {!isLast && (
                                    <div className={`w-0.5 flex-1 min-h-[20px] ${
                                        isCompleted ? 'bg-green-500/30' : 'bg-gray-700/50'
                                    }`} />
                                )}
                            </div>

                            {/* Step content */}
                            <div className={`flex-1 pb-6`}>
                                {/* Step header */}
                                <div className="flex items-center gap-3 mb-1">
                                    <Icon className={`w-5 h-5 ${
                                        isCompleted ? 'text-green-500' : isActive ? 'text-[#C5A04E]' : 'text-gray-500'
                                    }`} />
                                    <h3 className={`font-bold ${
                                        isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-gray-400'
                                    }`}>
                                        {step.title}
                                        {isCompleted && <span className="text-green-500 text-sm mr-2">✓</span>}
                                        {isLocked && <span className="text-gray-500 text-xs font-normal mr-2">— قريباً</span>}
                                    </h3>
                                </div>
                                <p className={`text-sm mr-8 ${
                                    isCompleted ? 'text-gray-500' : isActive ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    {step.description}
                                </p>

                                {/* Active step content */}
                                {isActive && (
                                    <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-6 mt-3">
                                        {/* DEMO STEP 1: Form */}
                                        {step.num === 1 && (
                                            <div className="space-y-5">
                                                <p className="text-gray-400 text-sm">أدخل معلوماتك لحجز جلسة التشخيص</p>
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm text-white font-semibold mb-2">
                                                        <User className="w-4 h-4" />
                                                        الاسم الكامل
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={demoName}
                                                        onChange={e => setDemoName(e.target.value)}
                                                        placeholder="أدخل اسمك الكامل"
                                                        className="w-full bg-[#F3F4F6] border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] focus:border-[#C5A04E] placeholder-[#9CA3AF]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm text-white font-semibold mb-2">
                                                        <Mail className="w-4 h-4" />
                                                        البريد الإلكتروني لـ Google Meet
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={demoEmail}
                                                        onChange={e => setDemoEmail(e.target.value)}
                                                        placeholder="example@gmail.com"
                                                        dir="ltr"
                                                        className="w-full bg-[#F3F4F6] border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] focus:border-[#C5A04E] placeholder-[#9CA3AF] text-left"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => setDemoStep(2)}
                                                    className="w-full bg-[#C5A04E] hover:bg-[#D4B85C] text-white font-bold py-3.5 rounded-xl transition-colors"
                                                >
                                                    تأكيد
                                                </button>
                                            </div>
                                        )}

                                        {/* DEMO STEP 2: Calendar with fake slots */}
                                        {step.num === 2 && (
                                            <div className="space-y-4">
                                                {/* Week Navigation */}
                                                <div className="flex items-center justify-between">
                                                    <button onClick={() => navigateWeek(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/5">
                                                        <ChevronRight className="w-4 h-4" />
                                                        <span className="text-xs font-bold hidden sm:inline">السابق</span>
                                                    </button>
                                                    <span className="text-white font-bold text-sm">
                                                        {calendarWeekStart.toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        {' — '}
                                                        {(() => { const end = new Date(calendarWeekStart); end.setDate(calendarWeekStart.getDate() + 6); return end.toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'long' }); })()}
                                                    </span>
                                                    <button onClick={() => navigateWeek(1)} className="flex items-center gap-1 text-gray-400 hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/5">
                                                        <span className="text-xs font-bold hidden sm:inline">التالي</span>
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Calendar Grid */}
                                                <div className="overflow-x-auto -mx-6 px-6">
                                                    <div className="min-w-[560px]">
                                                        {/* Day headers */}
                                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                                            {DAY_NAMES.map((dayName, i) => {
                                                                const date = new Date(calendarWeekStart);
                                                                date.setDate(calendarWeekStart.getDate() + i);
                                                                const isToday = date.toDateString() === new Date().toDateString();
                                                                return (
                                                                    <div key={i} className={`text-center py-1.5 rounded-lg ${isToday ? 'bg-[#C5A04E]/10' : ''}`}>
                                                                        <div className={`text-[10px] font-bold ${isToday ? 'text-[#C5A04E]' : 'text-gray-500'}`}>{dayName}</div>
                                                                        <div className={`text-sm font-bold ${isToday ? 'text-[#C5A04E]' : 'text-white'}`}>{date.getDate()}</div>
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
                                                                    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), hour, 0, 0, 0));
                                                                    const iso = date.toISOString();
                                                                    const isAvailable = demoSlotsSet.has(iso);
                                                                    const isPast = date < new Date();
                                                                    const isSelected = demoSelectedSlot === iso;

                                                                    if (isPast || !isAvailable) {
                                                                        return (
                                                                            <div key={di} className="py-1.5 rounded text-[11px] font-bold text-center bg-[#0A0A0A] text-gray-700">
                                                                                {String(hour).padStart(2, '0')}:00
                                                                            </div>
                                                                        );
                                                                    }

                                                                    return (
                                                                        <button
                                                                            key={di}
                                                                            onClick={() => setDemoSelectedSlot(iso)}
                                                                            className={`py-1.5 rounded text-[11px] font-bold transition-all ${
                                                                                isSelected
                                                                                    ? 'bg-[#C5A04E] text-white border border-[#C5A04E]'
                                                                                    : 'bg-[#1A1A1A] text-gray-300 border border-transparent hover:border-[#C5A04E]/40 hover:bg-[#C5A04E]/10'
                                                                            }`}
                                                                        >
                                                                            {String(hour).padStart(2, '0')}:00
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {demoSelectedSlot && (
                                                    <div className="border-t border-[#C5A04E]/10 pt-4 space-y-3">
                                                        <p className="text-gray-400 text-sm text-center">
                                                            الموعد المختار:{' '}
                                                            <span className="text-[#C5A04E] font-bold">
                                                                {new Date(demoSelectedSlot).toLocaleString('ar-u-nu-latn', {
                                                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                                                    hour: '2-digit', minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </p>
                                                        <button
                                                            onClick={() => setDemoStep(3)}
                                                            className="w-full bg-[#C5A04E] hover:bg-[#D4B85C] text-white font-bold py-3.5 rounded-xl transition-colors"
                                                        >
                                                            تأكيد الحجز
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* DEMO STEP 3: Countdown with fake date */}
                                        {step.num === 3 && (
                                            <div className="space-y-6 text-center">
                                                <div>
                                                    <p className="text-gray-400 text-sm mb-1">موعد جلستك</p>
                                                    <p className="text-[#C5A04E] text-lg font-bold">
                                                        {new Date(demoBookingDate).toLocaleDateString('ar-u-nu-latn', {
                                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                        })}
                                                        {' — '}
                                                        {new Date(demoBookingDate).toLocaleTimeString('ar-u-nu-latn', {
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                <CountdownTimer targetDate={demoBookingDate} />
                                                <p className="text-gray-500 text-sm">
                                                    سيتم إرسال رابط Google Meet إلى بريدك الإلكتروني قبل الجلسة
                                                </p>
                                            </div>
                                        )}

                                        {/* DEMO STEP 4 & 5: Locked */}
                                        {(step.num === 4 || step.num === 5) && (
                                            <div className="flex items-center justify-center gap-3 py-4">
                                                <Lock className="w-5 h-5 text-gray-500" />
                                                <span className="text-gray-500 text-sm font-bold">
                                                    سيتم فتحها بعد إتمام المراحل السابقة
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Completed step summary (demo) */}
                                {isCompleted && step.num === 1 && (
                                    <div className="bg-[#111111]/30 border border-green-500/10 rounded-xl px-5 py-3 mt-3">
                                        <p className="text-gray-400 text-sm">
                                            <span className="text-gray-500">الاسم:</span> <span className="text-white">{demoName || 'أحمد'}</span>
                                            {' — '}
                                            <span className="text-gray-500">Google Meet:</span> <span className="text-white" dir="ltr">{demoEmail || 'ahmed@gmail.com'}</span>
                                        </p>
                                    </div>
                                )}

                                {isCompleted && step.num === 2 && (
                                    <div className="bg-[#111111]/30 border border-green-500/10 rounded-xl px-5 py-3 mt-3">
                                        <p className="text-gray-400 text-sm">
                                            <span className="text-gray-500">الموعد:</span>{' '}
                                            <span className="text-white">
                                                {new Date(demoBookingDate).toLocaleString('ar-u-nu-latn', {
                                                    weekday: 'long', month: 'long', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {/* Locked step placeholder */}
                                {isLocked && (step.num === 4 || step.num === 5) && (
                                    <div className="bg-[#111111]/30 border border-gray-700/30 rounded-2xl p-5 mt-3">
                                        <div className="flex items-center justify-center gap-3">
                                            <Lock className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-500 text-sm font-bold">
                                                سيتم فتحها بعد إتمام المراحل السابقة
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    const navigateWeek = (direction: number) => {
        const newStart = new Date(calendarWeekStart);
        newStart.setDate(calendarWeekStart.getDate() + (direction * 7));
        setCalendarWeekStart(newStart);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-4 py-4">
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-white">جلسة التشخيص</h1>
                <p className="text-gray-400">أكمل الخطوات للحصول على جلستك الفردية</p>
            </div>

            {/* Stepper */}
            {STEP_CONFIG.map((step, idx) => {
                const isCompleted = currentStep > step.num;
                const isActive = currentStep === step.num;
                const isLocked = currentStep < step.num;
                const Icon = step.icon;
                const isLast = idx === STEP_CONFIG.length - 1;

                return (
                    <div key={step.num} className="flex gap-4">
                        {/* Step indicator column */}
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                isCompleted
                                    ? 'bg-green-500/20 border-2 border-green-500'
                                    : isActive
                                        ? 'bg-[#C5A04E]/20 border-2 border-[#C5A04E]'
                                        : 'bg-[#1A1A1A] border-2 border-gray-700'
                            }`}>
                                {isCompleted ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : isLocked ? (
                                    <Lock className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <span className={`text-sm font-bold ${isActive ? 'text-[#C5A04E]' : 'text-gray-500'}`}>
                                        {step.num}
                                    </span>
                                )}
                            </div>
                            {!isLast && (
                                <div className={`w-0.5 flex-1 min-h-[20px] ${
                                    isCompleted ? 'bg-green-500/30' : 'bg-gray-700/50'
                                }`} />
                            )}
                        </div>

                        {/* Step content */}
                        <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
                            {/* Step header */}
                            <div className="flex items-center gap-3 mb-1">
                                <Icon className={`w-5 h-5 ${
                                    isCompleted ? 'text-green-500' : isActive ? 'text-[#C5A04E]' : 'text-gray-500'
                                }`} />
                                <h3 className={`font-bold ${
                                    isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-gray-400'
                                }`}>
                                    {step.title}
                                    {isCompleted && <span className="text-green-500 text-sm mr-2">✓</span>}
                                    {isLocked && <span className="text-gray-500 text-xs font-normal mr-2">— قريباً</span>}
                                </h3>
                            </div>
                            <p className={`text-sm mr-8 ${
                                isCompleted ? 'text-gray-500' : isActive ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                {step.description}
                            </p>

                            {/* Active step content */}
                            {isActive && (
                                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-6 mt-3">
                                    {/* STEP 1: Pre-appointment form */}
                                    {step.num === 1 && (
                                        <div className="space-y-5">
                                            <p className="text-gray-400 text-sm">أدخل معلوماتك لحجز جلسة التشخيص</p>

                                            <div>
                                                <label className="flex items-center gap-2 text-sm text-white font-semibold mb-2">
                                                    <User className="w-4 h-4" />
                                                    الاسم الكامل
                                                </label>
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={e => setFullName(e.target.value)}
                                                    placeholder="أدخل اسمك الكامل"
                                                    className="w-full bg-[#F3F4F6] border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] focus:border-[#C5A04E] placeholder-[#9CA3AF]"
                                                />
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-2 text-sm text-white font-semibold mb-2">
                                                    <Mail className="w-4 h-4" />
                                                    البريد الإلكتروني لـ Google Meet
                                                </label>
                                                <input
                                                    type="email"
                                                    value={googleMeetEmail}
                                                    onChange={e => setGoogleMeetEmail(e.target.value)}
                                                    placeholder="example@gmail.com"
                                                    dir="ltr"
                                                    className="w-full bg-[#F3F4F6] border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] focus:border-[#C5A04E] placeholder-[#9CA3AF] text-left"
                                                />
                                            </div>

                                            {error && <p className="text-red-500 text-sm">{error}</p>}

                                            <button
                                                onClick={handleFormSubmit}
                                                disabled={formSubmitting}
                                                className="w-full bg-[#C5A04E] hover:bg-[#D4B85C] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                {formSubmitting ? 'جاري الحفظ...' : 'تأكيد'}
                                            </button>
                                        </div>
                                    )}

                                    {/* STEP 2: Weekly Calendar Picker */}
                                    {step.num === 2 && (
                                        <div className="space-y-4">
                                            {slotsLoading ? (
                                                <div className="text-center text-gray-500 py-8">جاري تحميل المواعيد...</div>
                                            ) : (
                                                <>
                                                    {/* Week Navigation */}
                                                    <div className="flex items-center justify-between">
                                                        <button onClick={() => navigateWeek(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/5">
                                                            <ChevronRight className="w-4 h-4" />
                                                            <span className="text-xs font-bold hidden sm:inline">السابق</span>
                                                        </button>
                                                        <span className="text-white font-bold text-sm">
                                                            {calendarWeekStart.toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            {' — '}
                                                            {(() => { const end = new Date(calendarWeekStart); end.setDate(calendarWeekStart.getDate() + 6); return end.toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'long' }); })()}
                                                        </span>
                                                        <button onClick={() => navigateWeek(1)} className="flex items-center gap-1 text-gray-400 hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/5">
                                                            <span className="text-xs font-bold hidden sm:inline">التالي</span>
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Calendar Grid */}
                                                    <div className="overflow-x-auto -mx-6 px-6">
                                                        <div className="min-w-[560px]">
                                                            {/* Day headers */}
                                                            <div className="grid grid-cols-7 gap-1 mb-2">
                                                                {DAY_NAMES.map((dayName, i) => {
                                                                    const date = new Date(calendarWeekStart);
                                                                    date.setDate(calendarWeekStart.getDate() + i);
                                                                    const isToday = date.toDateString() === new Date().toDateString();
                                                                    return (
                                                                        <div key={i} className={`text-center py-1.5 rounded-lg ${isToday ? 'bg-[#C5A04E]/10' : ''}`}>
                                                                            <div className={`text-[10px] font-bold ${isToday ? 'text-[#C5A04E]' : 'text-gray-500'}`}>{dayName}</div>
                                                                            <div className={`text-sm font-bold ${isToday ? 'text-[#C5A04E]' : 'text-white'}`}>{date.getDate()}</div>
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
                                                                        const isAvailable = availableSlotsSet.has(iso);
                                                                        const isPast = date < new Date();
                                                                        const isSelected = selectedSlot === iso;

                                                                        if (isPast || !isAvailable) {
                                                                            return (
                                                                                <div key={di} className="py-1.5 rounded text-[11px] font-bold text-center bg-[#0A0A0A] text-gray-700">
                                                                                    {String(hour).padStart(2, '0')}:00
                                                                                </div>
                                                                            );
                                                                        }

                                                                        return (
                                                                            <button
                                                                                key={di}
                                                                                onClick={() => setSelectedSlot(iso)}
                                                                                className={`py-1.5 rounded text-[11px] font-bold transition-all ${
                                                                                    isSelected
                                                                                        ? 'bg-[#C5A04E] text-white border border-[#C5A04E]'
                                                                                        : 'bg-[#1A1A1A] text-gray-300 border border-transparent hover:border-[#C5A04E]/40 hover:bg-[#C5A04E]/10'
                                                                                }`}
                                                                            >
                                                                                {String(hour).padStart(2, '0')}:00
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {selectedSlot && (
                                                <div className="border-t border-[#C5A04E]/10 pt-4 space-y-3">
                                                    <p className="text-gray-400 text-sm text-center">
                                                        الموعد المختار:{' '}
                                                        <span className="text-[#C5A04E] font-bold">
                                                            {new Date(selectedSlot).toLocaleString('ar-u-nu-latn', {
                                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                                                hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </p>
                                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                                    <button
                                                        onClick={handleBook}
                                                        disabled={bookingLoading}
                                                        className="w-full bg-[#C5A04E] hover:bg-[#D4B85C] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
                                                    >
                                                        {bookingLoading ? 'جاري الحجز...' : 'تأكيد الحجز'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* STEP 3: Countdown */}
                                    {step.num === 3 && booking && (
                                        <div className="space-y-6 text-center">
                                            <div>
                                                <p className="text-gray-400 text-sm mb-1">موعد جلستك</p>
                                                <p className="text-[#C5A04E] text-lg font-bold">
                                                    {new Date(booking.booking_date).toLocaleDateString('ar-u-nu-latn', {
                                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                    })}
                                                    {' — '}
                                                    {new Date(booking.booking_date).toLocaleTimeString('ar-u-nu-latn', {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>

                                            <CountdownTimer targetDate={booking.booking_date} />

                                            <p className="text-gray-500 text-sm">
                                                سيتم إرسال رابط Google Meet إلى بريدك الإلكتروني قبل الجلسة
                                            </p>
                                        </div>
                                    )}

                                    {/* STEP 4: Diagnostic result */}
                                    {step.num === 4 && diagnostic && (
                                        <div className="space-y-5">
                                            <p className="text-gray-400 text-sm">نتيجة تحليل جلسة التشخيص الخاصة بك</p>

                                            {[
                                                { label: 'ملخص الوضع', value: diagnostic.summary },
                                                { label: 'البزنس المناسب', value: diagnostic.recommended_business },
                                                { label: 'خطة العمل', value: diagnostic.action_plan },
                                                { label: 'التوصية', value: diagnostic.recommendation },
                                            ].map((field, i) => (
                                                <div key={i} className="bg-[#0A0A0A] border border-[#C5A04E]/20 rounded-xl p-4">
                                                    <h4 className="text-[#C5A04E] font-bold text-sm mb-2">{field.label}</h4>
                                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{field.value || '-'}</p>
                                                </div>
                                            ))}

                                            <button
                                                onClick={handleValidateDiagnostic}
                                                disabled={validating}
                                                className="w-full bg-[#C5A04E] hover:bg-[#D4B85C] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                {validating ? 'جاري التأكيد...' : 'لقد استلمت تشخيصي ✅'}
                                            </button>
                                        </div>
                                    )}

                                    {/* STEP 5: Completion */}
                                    {step.num === 5 && (
                                        <div className="text-center space-y-4 py-4">
                                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                                            <h3 className="text-xl font-bold text-white">تهانينا! تم إتمام التشخيص</h3>
                                            <p className="text-gray-400 text-sm">
                                                تم استلام تشخيصك بنجاح. سيتم التواصل معك قريباً بخصوص الخطوات القادمة.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Completed step summary */}
                            {isCompleted && step.num === 1 && profile && (
                                <div className="bg-[#111111]/30 border border-green-500/10 rounded-xl px-5 py-3 mt-3">
                                    <p className="text-gray-400 text-sm">
                                        <span className="text-gray-500">الاسم:</span> <span className="text-white">{profile.full_name}</span>
                                        {' — '}
                                        <span className="text-gray-500">Google Meet:</span> <span className="text-white" dir="ltr">{profile.google_meet_email}</span>
                                    </p>
                                </div>
                            )}

                            {isCompleted && step.num === 2 && booking && (
                                <div className="bg-[#111111]/30 border border-green-500/10 rounded-xl px-5 py-3 mt-3">
                                    <p className="text-gray-400 text-sm">
                                        <span className="text-gray-500">الموعد:</span>{' '}
                                        <span className="text-white">
                                            {new Date(booking.booking_date).toLocaleString('ar-u-nu-latn', {
                                                weekday: 'long', month: 'long', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {isCompleted && step.num === 4 && diagnostic && (
                                <div className="bg-[#111111]/30 border border-green-500/10 rounded-xl px-5 py-3 mt-3">
                                    <p className="text-gray-400 text-sm">
                                        <span className="text-gray-500">البزنس المناسب:</span>{' '}
                                        <span className="text-white">{diagnostic.recommended_business}</span>
                                    </p>
                                </div>
                            )}

                            {/* Locked step placeholder */}
                            {isLocked && (step.num === 4 || step.num === 5) && (
                                <div className="bg-[#111111]/30 border border-gray-700/30 rounded-2xl p-5 mt-3">
                                    <div className="flex items-center justify-center gap-3">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-500 text-sm font-bold">
                                            سيتم فتحها بعد إتمام المراحل السابقة
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
