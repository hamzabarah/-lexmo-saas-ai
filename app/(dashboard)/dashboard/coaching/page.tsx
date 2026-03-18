"use client";

import { useEffect, useState, useCallback } from "react";
import { checkUserSubscription, SubscriptionCheckResult } from "@/lib/check-subscription";
import { Lock, Calendar, Clock, CheckCircle, ClipboardList, Timer, Search, FileText, User, Mail, Sparkles } from "lucide-react";

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
    { num: 1, title: "الاستمارة", icon: ClipboardList, description: "أدخل اسمك وبريدك الإلكتروني لحجز جلستك", color: "#C5A04E" },
    { num: 2, title: "حجز الموعد", icon: Calendar, description: "اختر الموعد المناسب لك لجلسة Google Meet", color: "#E8600A" },
    { num: 3, title: "موعد الجلسة", icon: Timer, description: "العد التنازلي لجلستك الخاصة", color: "#3B82F6" },
    { num: 4, title: "التشخيص", icon: Search, description: "تحليل شامل لوضعك واكتشاف البزنس المناسب لك", color: "#8B5CF6" },
    { num: 5, title: "النتيجة", icon: FileText, description: "ملخص التشخيص + خطة العمل + التوصية", color: "#10B981" },
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
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-green-500/10">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-green-400 text-xl font-bold">تمت الجلسة ✓</p>
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
        <div className="flex justify-center gap-3 sm:gap-5">
            {boxes.map((box, i) => (
                <div key={box.label} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-[#3B82F6]/30 to-transparent rounded-2xl blur-sm" />
                    <div className="relative bg-[#0A0A0A] border border-[#3B82F6]/30 rounded-2xl px-4 sm:px-6 py-4 min-w-[70px] sm:min-w-[90px] text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Inter, system-ui, monospace' }}>
                            {String(box.value).padStart(2, '0')}
                        </div>
                        <div className="text-[#3B82F6] text-xs mt-1.5 font-bold">{box.label}</div>
                    </div>
                    {i < boxes.length - 1 && (
                        <span className="absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 text-[#3B82F6]/40 text-xl font-bold select-none hidden sm:block">:</span>
                    )}
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

    // Form fields (step 1)
    const [fullName, setFullName] = useState("");
    const [googleMeetEmail, setGoogleMeetEmail] = useState("");
    const [formSubmitting, setFormSubmitting] = useState(false);

    const currentStep = profile?.current_step || 1;

    const loadProfile = useCallback(async () => {
        try {
            const res = await fetch('/api/coaching-profile');
            const data = await res.json();
            if (data.profile) setProfile(data.profile);
            if (data.booking) setBooking(data.booking);
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
                await loadProfile();
            }
        } catch {
            setError('حدث خطأ أثناء الحجز');
        }
        setBookingLoading(false);
    };

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

    // Group slots by date for step 2
    const slotsByDate: Record<string, string[]> = {};
    for (const slot of availableSlots) {
        const dateKey = new Date(slot).toLocaleDateString('ar-EG', {
            weekday: 'long', month: 'long', day: 'numeric'
        });
        if (!slotsByDate[dateKey]) slotsByDate[dateKey] = [];
        slotsByDate[dateKey].push(slot);
    }

    const progressPercent = Math.max(0, ((currentStep - 1) / (STEP_CONFIG.length - 1)) * 100);

    return (
        <div className="max-w-3xl mx-auto py-6 px-4">
            {/* Premium Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-[#C5A04E]/10 border border-[#C5A04E]/20 rounded-full px-5 py-1.5 mb-4">
                    <Sparkles className="w-4 h-4 text-[#C5A04E]" />
                    <span className="text-[#C5A04E] text-sm font-bold">COACHING 1:1</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">جلسة التشخيص الفردية</h1>
                <p className="text-gray-400">رحلتك نحو اكتشاف البزنس المناسب لك</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400 font-bold">التقدم</span>
                    <span className="text-sm font-bold text-[#C5A04E]">{currentStep - 1}/{STEP_CONFIG.length} مراحل مكتملة</span>
                </div>
                <div className="relative h-2.5 bg-[#1A1A1A] rounded-full overflow-hidden border border-white/5">
                    <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                            width: `${progressPercent}%`,
                            background: 'linear-gradient(90deg, #C5A04E, #E8600A)',
                        }}
                    />
                </div>
                {/* Step dots on progress bar */}
                <div className="relative flex justify-between mt-[-9px] px-0">
                    {STEP_CONFIG.map((step) => {
                        const isCompleted = currentStep > step.num;
                        const isActive = currentStep === step.num;
                        return (
                            <div key={step.num} className="flex flex-col items-center">
                                <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                                    isCompleted
                                        ? 'bg-[#C5A04E] border-[#C5A04E]'
                                        : isActive
                                            ? 'bg-[#0A0A0A] border-[#C5A04E] ring-4 ring-[#C5A04E]/20'
                                            : 'bg-[#1A1A1A] border-gray-700'
                                }`} />
                                <span className={`text-[10px] mt-1 font-bold ${
                                    isCompleted ? 'text-[#C5A04E]' : isActive ? 'text-white' : 'text-gray-600'
                                }`}>{step.num}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Steps */}
            <div className="space-y-5">
                {STEP_CONFIG.map((step) => {
                    const isCompleted = currentStep > step.num;
                    const isActive = currentStep === step.num;
                    const isLocked = currentStep < step.num;
                    const Icon = step.icon;

                    return (
                        <div key={step.num} className="relative">
                            {/* Glow effect for active step */}
                            {isActive && (
                                <div className="absolute -inset-0.5 rounded-2xl blur-md opacity-30"
                                    style={{ background: `linear-gradient(135deg, ${step.color}40, transparent)` }} />
                            )}

                            <div className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                                isCompleted
                                    ? 'bg-[#0D1117] border-green-500/20'
                                    : isActive
                                        ? 'bg-[#0D1117] border-opacity-40'
                                        : 'bg-[#0A0A0A]/60 border-white/5'
                            }`}
                                style={isActive ? { borderColor: `${step.color}60` } : {}}
                            >
                                {/* Step Header - Always visible */}
                                <div className={`flex items-center gap-4 p-5 ${isActive ? 'pb-0' : ''}`}>
                                    {/* Step Number Circle */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                        isCompleted
                                            ? 'bg-green-500/15'
                                            : isActive
                                                ? 'bg-opacity-15'
                                                : 'bg-white/5'
                                    }`}
                                        style={isActive ? { backgroundColor: `${step.color}20` } : isCompleted ? {} : {}}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : isLocked ? (
                                            <Lock className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <Icon className="w-6 h-6" style={{ color: step.color }} />
                                        )}
                                    </div>

                                    {/* Step Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                                isCompleted
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : isActive
                                                        ? 'bg-opacity-10 text-opacity-100'
                                                        : 'bg-white/5 text-gray-600'
                                            }`}
                                                style={isActive ? { backgroundColor: `${step.color}15`, color: step.color } : {}}
                                            >
                                                {isCompleted ? '✓ مكتملة' : isActive ? `الخطوة ${step.num}` : isLocked ? 'قريباً' : ''}
                                            </span>
                                        </div>
                                        <h3 className={`text-lg font-bold mt-1 ${
                                            isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-gray-500'
                                        }`}>
                                            {step.title}
                                        </h3>
                                        <p className={`text-sm mt-0.5 ${
                                            isCompleted ? 'text-gray-500' : isActive ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Right side indicator */}
                                    {isLocked && (
                                        <div className="shrink-0">
                                            <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
                                                <Lock className="w-3 h-3 text-gray-600" />
                                                <span className="text-xs text-gray-600 font-bold">قريباً</span>
                                            </div>
                                        </div>
                                    )}
                                    {isCompleted && (
                                        <div className="shrink-0">
                                            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Completed step summary */}
                                {isCompleted && step.num === 1 && profile && (
                                    <div className="px-5 pb-4 pt-2">
                                        <div className="bg-green-500/5 border border-green-500/10 rounded-xl px-4 py-3">
                                            <p className="text-sm text-gray-400">
                                                <span className="text-gray-500">الاسم:</span>{' '}
                                                <span className="text-white font-semibold">{profile.full_name}</span>
                                                <span className="text-gray-700 mx-2">|</span>
                                                <span className="text-gray-500">Meet:</span>{' '}
                                                <span className="text-white font-semibold" dir="ltr">{profile.google_meet_email}</span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isCompleted && step.num === 2 && booking && (
                                    <div className="px-5 pb-4 pt-2">
                                        <div className="bg-green-500/5 border border-green-500/10 rounded-xl px-4 py-3">
                                            <p className="text-sm text-gray-400">
                                                <span className="text-gray-500">الموعد:</span>{' '}
                                                <span className="text-white font-semibold">
                                                    {new Date(booking.booking_date).toLocaleString('ar-EG', {
                                                        weekday: 'long', month: 'long', day: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Active step content */}
                                {isActive && (
                                    <div className="p-5 pt-4">
                                        <div className="border-t border-white/5 pt-5">
                                            {/* STEP 1: Pre-appointment form */}
                                            {step.num === 1 && (
                                                <div className="space-y-5">
                                                    <div>
                                                        <label className="flex items-center gap-2 text-sm text-white font-semibold mb-2">
                                                            <User className="w-4 h-4 text-[#C5A04E]" />
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
                                                            <Mail className="w-4 h-4 text-[#C5A04E]" />
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
                                                        className="w-full bg-gradient-to-l from-[#C5A04E] to-[#D4B85C] hover:from-[#D4B85C] hover:to-[#C5A04E] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-[#C5A04E]/20"
                                                    >
                                                        {formSubmitting ? 'جاري الحفظ...' : 'تأكيد والمتابعة ←'}
                                                    </button>
                                                </div>
                                            )}

                                            {/* STEP 2: Slot picker */}
                                            {step.num === 2 && (
                                                <div className="space-y-5">
                                                    {slotsLoading ? (
                                                        <div className="text-center text-gray-500 py-8">جاري تحميل المواعيد...</div>
                                                    ) : availableSlots.length === 0 ? (
                                                        <div className="text-center py-8">
                                                            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                                            <p className="text-gray-400">لا توجد مواعيد متاحة حالياً</p>
                                                            <p className="text-gray-500 text-sm mt-2">
                                                                تواصل معنا على{' '}
                                                                <a href="mailto:lexmoacadmy@gmail.com" className="text-[#C5A04E] hover:underline">lexmoacadmy@gmail.com</a>
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {Object.entries(slotsByDate).map(([dateLabel, slots]) => (
                                                                <div key={dateLabel}>
                                                                    <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                                                                        <Calendar className="w-4 h-4 text-[#E8600A]" />
                                                                        {dateLabel}
                                                                    </h4>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {slots.map(slot => {
                                                                            const time = new Date(slot).toLocaleTimeString('ar-EG', {
                                                                                hour: '2-digit', minute: '2-digit'
                                                                            });
                                                                            const isSelected = selectedSlot === slot;
                                                                            return (
                                                                                <button
                                                                                    key={slot}
                                                                                    onClick={() => setSelectedSlot(slot)}
                                                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                                                                                        isSelected
                                                                                            ? 'bg-[#E8600A] border-[#E8600A] text-white shadow-lg shadow-[#E8600A]/20'
                                                                                            : 'bg-[#0A0A0A] border-white/10 text-gray-300 hover:border-[#E8600A]/40 hover:bg-[#E8600A]/5'
                                                                                    }`}
                                                                                >
                                                                                    <Clock className="w-4 h-4" />
                                                                                    {time}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {selectedSlot && (
                                                        <div className="border-t border-white/5 pt-4 space-y-3">
                                                            <p className="text-gray-400 text-sm text-center">
                                                                الموعد المختار:{' '}
                                                                <span className="text-[#E8600A] font-bold">
                                                                    {new Date(selectedSlot).toLocaleString('ar-EG', {
                                                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                                                        hour: '2-digit', minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </p>
                                                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                                            <button
                                                                onClick={handleBook}
                                                                disabled={bookingLoading}
                                                                className="w-full bg-gradient-to-l from-[#E8600A] to-[#FF7A1F] hover:from-[#FF7A1F] hover:to-[#E8600A] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-[#E8600A]/20"
                                                            >
                                                                {bookingLoading ? 'جاري الحجز...' : 'تأكيد الحجز ←'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* STEP 3: Countdown */}
                                            {step.num === 3 && booking && (
                                                <div className="space-y-6 text-center">
                                                    <div className="bg-[#3B82F6]/5 border border-[#3B82F6]/10 rounded-xl p-4">
                                                        <p className="text-gray-400 text-sm mb-1">موعد جلستك</p>
                                                        <p className="text-[#3B82F6] text-lg font-bold">
                                                            {new Date(booking.booking_date).toLocaleDateString('ar-EG', {
                                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                            })}
                                                            {' — '}
                                                            {new Date(booking.booking_date).toLocaleTimeString('ar-EG', {
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
                                        </div>
                                    </div>
                                )}

                                {/* Premium locked overlay for steps 4 & 5 */}
                                {isLocked && (step.num === 4 || step.num === 5) && (
                                    <div className="px-5 pb-5">
                                        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-l from-white/[0.02] to-transparent p-4">
                                            <div className="flex items-center justify-center gap-3 text-gray-600">
                                                <div className="flex gap-1">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-700 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-bold">سيتم فتحها بعد إتمام المراحل السابقة</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom trust badge */}
            <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-2 text-gray-600 text-sm">
                    <Lock className="w-3.5 h-3.5" />
                    <span>جلسة خاصة و سرية 100%</span>
                </div>
            </div>
        </div>
    );
}
