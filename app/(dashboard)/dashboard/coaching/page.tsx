"use client";

import { useEffect, useState } from "react";
import { checkUserSubscription, SubscriptionCheckResult } from "@/lib/check-subscription";
import { Lock, Calendar, Clock, CheckCircle } from "lucide-react";

interface BookingData {
    id: string;
    booking_date: string;
    status: string;
}

export default function CoachingPage() {
    const [subscriptionCheck, setSubscriptionCheck] = useState<SubscriptionCheckResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [booking, setBooking] = useState<BookingData | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkUserSubscription().then(result => {
            setSubscriptionCheck(result);
            setLoading(false);

            if (result?.hasAccess && result?.subscription?.plan === 'diagnostic') {
                loadSlots();
            }
        });
    }, []);

    const loadSlots = async () => {
        setSlotsLoading(true);
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            setAvailableSlots(data.slots || []);
        } catch {
            console.error('Error loading slots');
        }
        setSlotsLoading(false);
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

    // Access check: must have 'diagnostic' plan
    const hasDiagnosticAccess =
        subscriptionCheck?.hasAccess &&
        subscriptionCheck?.subscription?.plan === 'diagnostic';

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

    // Show confirmation if booked
    if (booking) {
        const date = new Date(booking.booking_date);
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="bg-[#111111]/50 border border-green-500/20 rounded-2xl p-10">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">تم تأكيد حجزك!</h2>
                    <p className="text-gray-400 mb-2">موعد جلستك:</p>
                    <p className="text-[#C5A04E] text-xl font-bold">
                        {date.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        {' — '}
                        {date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-400 mt-6 text-sm">سيتم إرسال رابط تيليغرام إلى بريدك الإلكتروني قبل الجلسة</p>
                </div>
            </div>
        );
    }

    // Group slots by date for display
    const slotsByDate: Record<string, string[]> = {};
    for (const slot of availableSlots) {
        const dateKey = new Date(slot).toLocaleDateString('ar-EG', {
            weekday: 'long', month: 'long', day: 'numeric'
        });
        if (!slotsByDate[dateKey]) slotsByDate[dateKey] = [];
        slotsByDate[dateKey].push(slot);
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white">حجز جلسة التشخيص</h1>
                <p className="text-gray-400">اختر الموعد المناسب لجلستك الفردية 45 دقيقة على تيليغرام</p>
            </div>

            {/* Slot Picker */}
            {slotsLoading ? (
                <div className="text-center text-gray-500 py-12">جاري تحميل المواعيد...</div>
            ) : availableSlots.length === 0 ? (
                <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">لا توجد مواعيد متاحة حالياً</p>
                    <p className="text-gray-500 text-sm mt-2">
                        تواصل معنا على{' '}
                        <a href="mailto:lexmoacadmy@gmail.com" className="text-[#C5A04E] hover:underline">lexmoacadmy@gmail.com</a>
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(slotsByDate).map(([dateLabel, slots]) => (
                        <div key={dateLabel} className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-2xl p-6">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#C5A04E]" />
                                {dateLabel}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {slots.map(slot => {
                                    const time = new Date(slot).toLocaleTimeString('ar-EG', {
                                        hour: '2-digit', minute: '2-digit'
                                    });
                                    const isSelected = selectedSlot === slot;
                                    return (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition-all ${
                                                isSelected
                                                    ? 'bg-[#C5A04E] border-[#C5A04E] text-white'
                                                    : 'bg-[#1A1A1A] border-[#C5A04E]/20 text-gray-300 hover:border-[#C5A04E]/50'
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

            {/* Confirm Button */}
            {selectedSlot && (
                <div className="text-center space-y-3">
                    <p className="text-gray-400 text-sm">
                        الموعد المختار:{' '}
                        <span className="text-[#C5A04E] font-bold">
                            {new Date(selectedSlot).toLocaleString('ar-EG', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </span>
                    </p>
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <button
                        onClick={handleBook}
                        disabled={bookingLoading}
                        className="bg-[#C5A04E] hover:bg-[#D4B85C] text-white font-bold px-12 py-4 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {bookingLoading ? 'جاري الحجز...' : 'تأكيد الحجز'}
                    </button>
                </div>
            )}
        </div>
    );
}
