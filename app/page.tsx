"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

function StarRating({ count, total }: { count: number; total: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#D4A843" stroke="#D4A843" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <span className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {count}.0 ({total})
      </span>
    </div>
  );
}

function ClosedTimer({ closedAt }: { closedAt: string }) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    function update() {
      const diff = Date.now() - new Date(closedAt).getTime();
      if (diff < 0) { setElapsed(''); return; }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      if (hours > 0) {
        setElapsed(`${hours} ساعة و ${minutes} دقيقة`);
      } else {
        setElapsed(`${minutes} دقيقة`);
      }
    }
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [closedAt]);

  if (!elapsed) return null;
  return (
    <div className="flex items-center justify-center gap-2 text-red-400/80 text-sm font-bold">
      <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      مغلق منذ {elapsed}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPACT PROMO INFO (counter + inline timer)
   Shows inside the formation card, above CTA
   ═══════════════════════════════════════════════ */
function CompactPromoInfo({ settings }: { settings: any }) {
  const {
    promo_places_total: total = 12,
    promo_places_prises: serverTaken = 0,
    promo_duree_heures: dureeHeures = 48,
    promo_interval_minutes: intervalMinutes = 20,
    promo_started_at: startedAt,
  } = settings;

  const [simulatedExtra, setSimulatedExtra] = useState(0);
  const [timer, setTimer] = useState({ h: 0, m: 0, s: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!startedAt || !intervalMinutes) return;
    function calc() {
      const elapsed = Date.now() - new Date(startedAt).getTime();
      return Math.max(0, Math.floor(elapsed / (intervalMinutes * 60000)));
    }
    setSimulatedExtra(calc());
    const iv = setInterval(() => setSimulatedExtra(calc()), 10000);
    return () => clearInterval(iv);
  }, [startedAt, intervalMinutes]);

  useEffect(() => {
    if (!startedAt) return;
    const endTime = new Date(startedAt).getTime() + dureeHeures * 3600000;
    function tick() {
      const rem = endTime - Date.now();
      if (rem <= 0) { setExpired(true); setTimer({ h: 0, m: 0, s: 0 }); return; }
      setTimer({
        h: Math.floor(rem / 3600000),
        m: Math.floor((rem % 3600000) / 60000),
        s: Math.floor((rem % 60000) / 1000),
      });
    }
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [startedAt, dureeHeures]);

  const taken = Math.min(serverTaken + simulatedExtra, total);
  const remaining = total - taken;
  if (remaining <= 0 || expired) return null;

  const isUrgent = remaining <= 3;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="space-y-2 mb-2">
      <div className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg ${isUrgent ? 'bg-red-950/60 border border-red-800/40' : 'bg-[#C5A04E]/10 border border-[#C5A04E]/20'}`}>
        <span className="text-base">🔥</span>
        <span className={`font-bold text-sm ${isUrgent ? 'text-red-400 animate-pulse' : 'text-[#C5A04E]'}`}>
          باقي {remaining} أماكن فقط
        </span>
      </div>
      <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs">
        <span>⏳</span>
        <span>ينتهي العرض خلال</span>
        <span className={`font-bold ${isUrgent ? 'text-red-400' : 'text-[#ffd700]'}`} style={{ fontFamily: 'Inter, monospace' }}>
          {pad(timer.h)}:{pad(timer.m)}:{pad(timer.s)}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NAMES LIST + COUNTRY MAP (shared data)
   ═══════════════════════════════════════════════ */
const NAMES: { name: string; gender: 'm' | 'f'; flag: string }[] = [
  { name: 'أحمد', gender: 'm', flag: '🇫🇷' },
  { name: 'محمد', gender: 'm', flag: '🇧🇪' },
  { name: 'يوسف', gender: 'm', flag: '🇩🇪' },
  { name: 'إبراهيم', gender: 'm', flag: '🇮🇹' },
  { name: 'عمر', gender: 'm', flag: '🇪🇸' },
  { name: 'علي', gender: 'm', flag: '🇫🇷' },
  { name: 'حسن', gender: 'm', flag: '🇬🇧' },
  { name: 'خالد', gender: 'm', flag: '🇳🇱' },
  { name: 'طارق', gender: 'm', flag: '🇫🇷' },
  { name: 'سمير', gender: 'm', flag: '🇧🇪' },
  { name: 'كريم', gender: 'm', flag: '🇫🇷' },
  { name: 'ياسين', gender: 'm', flag: '🇩🇪' },
  { name: 'نور الدين', gender: 'm', flag: '🇮🇹' },
  { name: 'مراد', gender: 'm', flag: '🇫🇷' },
  { name: 'رشيد', gender: 'm', flag: '🇪🇸' },
  { name: 'بلال', gender: 'm', flag: '🇬🇧' },
  { name: 'أنس', gender: 'm', flag: '🇫🇷' },
  { name: 'أيوب', gender: 'm', flag: '🇳🇱' },
  { name: 'زكريا', gender: 'm', flag: '🇧🇪' },
  { name: 'سعيد', gender: 'm', flag: '🇫🇷' },
  { name: 'عبد الله', gender: 'm', flag: '🇩🇪' },
  { name: 'حمزة', gender: 'm', flag: '🇫🇷' },
  { name: 'إلياس', gender: 'm', flag: '🇮🇹' },
  { name: 'آدم', gender: 'm', flag: '🇫🇷' },
  { name: 'رامي', gender: 'm', flag: '🇪🇸' },
  { name: 'فيصل', gender: 'm', flag: '🇬🇧' },
  { name: 'هشام', gender: 'm', flag: '🇫🇷' },
  { name: 'وليد', gender: 'm', flag: '🇳🇱' },
  { name: 'منير', gender: 'm', flag: '🇧🇪' },
  { name: 'جمال', gender: 'm', flag: '🇫🇷' },
  { name: 'عادل', gender: 'm', flag: '🇩🇪' },
  { name: 'نبيل', gender: 'm', flag: '🇫🇷' },
  { name: 'صلاح', gender: 'm', flag: '🇮🇹' },
  { name: 'مصطفى', gender: 'm', flag: '🇫🇷' },
  { name: 'عماد', gender: 'm', flag: '🇪🇸' },
  { name: 'رياض', gender: 'm', flag: '🇬🇧' },
  { name: 'سفيان', gender: 'm', flag: '🇫🇷' },
  { name: 'حاتم', gender: 'm', flag: '🇳🇱' },
  { name: 'توفيق', gender: 'm', flag: '🇧🇪' },
  { name: 'ماجد', gender: 'm', flag: '🇫🇷' },
  { name: 'فاروق', gender: 'm', flag: '🇩🇪' },
  { name: 'عزيز', gender: 'm', flag: '🇫🇷' },
  { name: 'سامي', gender: 'm', flag: '🇮🇹' },
  { name: 'باسم', gender: 'm', flag: '🇫🇷' },
  { name: 'رضا', gender: 'm', flag: '🇪🇸' },
  { name: 'عثمان', gender: 'm', flag: '🇬🇧' },
  { name: 'لطفي', gender: 'm', flag: '🇫🇷' },
  { name: 'نادر', gender: 'm', flag: '🇳🇱' },
  { name: 'شريف', gender: 'm', flag: '🇧🇪' },
  { name: 'زياد', gender: 'm', flag: '🇫🇷' },
  { name: 'فاطمة', gender: 'f', flag: '🇫🇷' },
  { name: 'مريم', gender: 'f', flag: '🇧🇪' },
  { name: 'سارة', gender: 'f', flag: '🇩🇪' },
  { name: 'نور', gender: 'f', flag: '🇫🇷' },
  { name: 'ليلى', gender: 'f', flag: '🇮🇹' },
  { name: 'أمينة', gender: 'f', flag: '🇫🇷' },
  { name: 'حنان', gender: 'f', flag: '🇪🇸' },
  { name: 'سلمى', gender: 'f', flag: '🇬🇧' },
  { name: 'ياسمين', gender: 'f', flag: '🇫🇷' },
  { name: 'إيمان', gender: 'f', flag: '🇳🇱' },
  { name: 'هاجر', gender: 'f', flag: '🇧🇪' },
  { name: 'خديجة', gender: 'f', flag: '🇫🇷' },
  { name: 'سناء', gender: 'f', flag: '🇩🇪' },
  { name: 'رانيا', gender: 'f', flag: '🇫🇷' },
  { name: 'لينا', gender: 'f', flag: '🇮🇹' },
  { name: 'دنيا', gender: 'f', flag: '🇫🇷' },
  { name: 'غزلان', gender: 'f', flag: '🇪🇸' },
  { name: 'سميرة', gender: 'f', flag: '🇬🇧' },
  { name: 'نجاة', gender: 'f', flag: '🇫🇷' },
  { name: 'وفاء', gender: 'f', flag: '🇳🇱' },
  { name: 'عبد الرحمن', gender: 'm', flag: '🇲🇦' },
  { name: 'أيمن', gender: 'm', flag: '🇩🇿' },
  { name: 'حمدي', gender: 'm', flag: '🇹🇳' },
  { name: 'عصام', gender: 'm', flag: '🇲🇦' },
  { name: 'وسيم', gender: 'm', flag: '🇩🇿' },
  { name: 'عبد الكريم', gender: 'm', flag: '🇹🇳' },
  { name: 'مهدي', gender: 'm', flag: '🇲🇦' },
  { name: 'أشرف', gender: 'm', flag: '🇩🇿' },
  { name: 'هيثم', gender: 'm', flag: '🇹🇳' },
  { name: 'سيف الدين', gender: 'm', flag: '🇲🇦' },
  { name: 'فهد', gender: 'm', flag: '🇸🇦' },
  { name: 'سلطان', gender: 'm', flag: '🇦🇪' },
  { name: 'تركي', gender: 'm', flag: '🇸🇦' },
  { name: 'ناصر', gender: 'm', flag: '🇰🇼' },
  { name: 'بندر', gender: 'm', flag: '🇸🇦' },
  { name: 'عبد العزيز', gender: 'm', flag: '🇶🇦' },
  { name: 'مشاري', gender: 'm', flag: '🇰🇼' },
  { name: 'راشد', gender: 'm', flag: '🇦🇪' },
  { name: 'حمد', gender: 'm', flag: '🇧🇭' },
  { name: 'خليفة', gender: 'm', flag: '🇴🇲' },
];

const FLAG_TO_COUNTRY: Record<string, string> = {
  '🇫🇷': 'فرنسا', '🇧🇪': 'بلجيكا', '🇩🇪': 'ألمانيا', '🇮🇹': 'إيطاليا',
  '🇪🇸': 'إسبانيا', '🇬🇧': 'بريطانيا', '🇳🇱': 'هولندا', '🇲🇦': 'المغرب',
  '🇩🇿': 'الجزائر', '🇹🇳': 'تونس', '🇸🇦': 'السعودية', '🇦🇪': 'الإمارات',
  '🇰🇼': 'الكويت', '🇶🇦': 'قطر', '🇧🇭': 'البحرين', '🇴🇲': 'عُمان',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatEntry(p: typeof NAMES[0]) {
  const verb = p.gender === 'f' ? 'انضمت' : 'انضم';
  const country = FLAG_TO_COUNTRY[p.flag] || '';
  return `✅ ${p.name} من ${country} ${p.flag} ${verb}`;
}

/* ═══════════════════════════════════════════════
   ACTIVITY TICKER — scrolling band at top
   ═══════════════════════════════════════════════ */
function ActivityTicker() {
  const tickerText = useMemo(() => {
    const shuffled = shuffle(NAMES);
    // Take 30 names for a good-length ticker, repeat set for seamless loop
    const entries = shuffled.slice(0, 30).map(p => formatEntry(p));
    return entries.join('  •  ');
  }, []);

  return (
    <div className="w-full bg-[#111111] border-b border-[#C5A04E]/10 overflow-hidden" style={{ height: '42px' }}>
      <div className="ticker-track flex items-center h-full whitespace-nowrap">
        <span className="ticker-content text-gray-300 text-sm px-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {tickerText}  •
        </span>
        <span className="ticker-content text-gray-300 text-sm px-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {tickerText}  •
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VIEWER COUNT BADGE — live viewers pill
   ═══════════════════════════════════════════════ */
function ViewerCountBadge({ promoActive, placesRemaining }: { promoActive: boolean; placesRemaining?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const min = promoActive ? 30 : 5;
    const max = promoActive ? 85 : 20;
    // Initial value
    setCount(min + Math.floor(Math.random() * (max - min)));

    const iv = setInterval(() => {
      setCount(prev => {
        const delta = Math.floor(Math.random() * 5) + 1;
        const direction = Math.random() > 0.5 ? 1 : -1;
        let next = prev + delta * direction;

        // When few places remain, bias upward
        if (promoActive && placesRemaining !== undefined && placesRemaining <= 5) {
          next = prev + Math.floor(Math.random() * 4) + 1;
        }

        // Clamp
        if (next < min) next = min + Math.floor(Math.random() * 3);
        if (next > max) next = max - Math.floor(Math.random() * 3);
        return next;
      });
    }, (8 + Math.random() * 7) * 1000); // 8-15s

    return () => clearInterval(iv);
  }, [promoActive, placesRemaining]);

  if (count === 0) return null;

  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center gap-2 bg-[#111111] border border-white/10 rounded-full px-4 py-1.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-white text-[13px] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {count} شخص يشاهد الآن
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LIVE REGISTRATIONS LIST — last 5 entries
   ═══════════════════════════════════════════════ */
function LiveRegistrationsList({ promoActive, promoSettings }: { promoActive: boolean; promoSettings: any }) {
  const [entries, setEntries] = useState<{ person: typeof NAMES[0]; time: number }[]>([]);
  const shuffledRef = useRef<typeof NAMES>([]);
  const indexRef = useRef(0);

  const getNext = useCallback(() => {
    if (indexRef.current >= shuffledRef.current.length) {
      shuffledRef.current = shuffle(NAMES);
      indexRef.current = 0;
    }
    const p = shuffledRef.current[indexRef.current];
    indexRef.current++;
    return p;
  }, []);

  useEffect(() => {
    shuffledRef.current = shuffle(NAMES);

    if (promoActive && promoSettings.promo_started_at && promoSettings.promo_interval_minutes) {
      // Promo mode: calculate simulated registrations from start time
      const startMs = new Date(promoSettings.promo_started_at).getTime();
      const intervalMs = promoSettings.promo_interval_minutes * 60000;
      const elapsed = Date.now() - startMs;
      const totalSimulated = Math.max(0, Math.floor(elapsed / intervalMs));

      // Generate last 5 entries with real timings
      const initial: { person: typeof NAMES[0]; time: number }[] = [];
      for (let i = Math.max(0, totalSimulated - 5); i < totalSimulated; i++) {
        const entryTime = startMs + i * intervalMs;
        initial.push({ person: getNext(), time: entryTime });
      }
      setEntries(initial.reverse()); // newest first

      // Check for new simulated entries periodically
      const iv = setInterval(() => {
        const now = Date.now();
        const currentCount = Math.floor((now - startMs) / intervalMs);
        setEntries(prev => {
          const newestTime = prev.length > 0 ? prev[0].time : 0;
          const expectedNewestTime = startMs + (currentCount - 1) * intervalMs;
          if (expectedNewestTime > newestTime && currentCount > 0) {
            const newEntry = { person: getNext(), time: expectedNewestTime };
            return [newEntry, ...prev].slice(0, 5);
          }
          return prev;
        });
      }, 10000);

      return () => clearInterval(iv);
    } else {
      // Inactive mode: show 5 entries with fictional times
      const now = Date.now();
      const gaps = [2, 5, 12, 18, 25]; // minutes ago
      const initial = gaps.map(g => ({
        person: getNext(),
        time: now - g * 60000,
      }));
      setEntries(initial);

      // Add a new one every 30-45s
      const iv = setInterval(() => {
        setEntries(prev => {
          const newEntry = { person: getNext(), time: Date.now() };
          return [newEntry, ...prev].slice(0, 5);
        });
      }, (30 + Math.random() * 15) * 1000);

      return () => clearInterval(iv);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoActive, promoSettings.promo_started_at, promoSettings.promo_interval_minutes]);

  const [, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(iv);
  }, []);

  function timeAgo(ts: number) {
    const diff = Math.max(0, Math.floor((Date.now() - ts) / 60000));
    if (diff === 0) return 'منذ لحظات';
    if (diff === 1) return 'منذ دقيقة';
    if (diff === 2) return 'منذ دقيقتين';
    if (diff <= 10) return `منذ ${diff} دقائق`;
    return `منذ ${diff} دقيقة`;
  }

  if (entries.length === 0) return null;

  return (
    <section className="w-full px-4 pb-6">
      <div className="max-w-[500px] mx-auto">
        <h3 className="text-white text-base font-bold mb-3 text-center">📋 آخر التسجيلات</h3>
        <div className="bg-[#111111] border border-[#C5A04E]/15 rounded-2xl overflow-hidden">
          {entries.map((entry, i) => {
            const verb = entry.person.gender === 'f' ? 'انضمت' : 'انضم';
            const country = FLAG_TO_COUNTRY[entry.person.flag] || '';
            return (
              <div
                key={`${entry.person.name}-${entry.time}-${i}`}
                className={`flex items-center justify-between px-4 py-3 ${i < entries.length - 1 ? 'border-b border-white/5' : ''} ${i === 0 ? 'animate-fade-in' : ''}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-green-400 text-sm shrink-0">✅</span>
                  <span className="text-white text-sm truncate">
                    {entry.person.name} من {country} {entry.person.flag}
                  </span>
                </div>
                <span className="text-gray-500 text-xs shrink-0 mr-3">{timeAgo(entry.time)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   HOMEPAGE
   ═══════════════════════════════════════════════ */
export default function HomePage() {
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const [closedAt, setClosedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [promoActive, setPromoActive] = useState(false);
  const [promoSettings, setPromoSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        const s = data.settings || {};
        setRegistrationsOpen(s.registrations_open ?? true);
        setClosedAt(s.registrations_closed_at || null);
        setPromoActive(s.promo_active ?? false);
        setPromoSettings(s);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Poll promo data every 15s when promo is active
  useEffect(() => {
    if (!promoActive) return;
    const interval = setInterval(() => {
      fetch('/api/admin/settings')
        .then(r => r.json())
        .then(data => {
          const s = data.settings || {};
          setPromoSettings(s);
          setRegistrationsOpen(s.registrations_open ?? true);
          setClosedAt(s.registrations_closed_at || null);
          if (!s.promo_active) setPromoActive(false);
        })
        .catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [promoActive]);

  const showClosed = loaded && !registrationsOpen;
  const showPromo = loaded && promoActive && registrationsOpen;

  // Calculate remaining places for viewer badge pressure
  const placesRemaining = useMemo(() => {
    if (!promoActive || !promoSettings.promo_started_at) return undefined;
    const total = promoSettings.promo_places_total || 12;
    const serverTaken = promoSettings.promo_places_prises || 0;
    const intervalMin = promoSettings.promo_interval_minutes || 20;
    const elapsed = Date.now() - new Date(promoSettings.promo_started_at).getTime();
    const simulated = Math.floor(elapsed / (intervalMin * 60000));
    return Math.max(0, total - Math.min(serverTaken + simulated, total));
  }, [promoActive, promoSettings]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-cairo flex flex-col items-center" dir="rtl">

      {/* CSS Animations */}
      <style>{`
        @keyframes glow-telegram {
          0%, 100% { box-shadow: 0 0 10px rgba(0,136,204,0.3); }
          50% { box-shadow: 0 0 25px rgba(0,136,204,0.6); }
        }
        .animate-glow-telegram { animation: glow-telegram 2s ease-in-out infinite; }

        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
          width: max-content;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>

      {/* 1. Activity Ticker — scrolling band */}
      {loaded && <ActivityTicker />}

      {/* 2. Header — ECOMY logo */}
      <header className="w-full py-10 flex justify-center">
        <h1 className="text-3xl font-bold font-orbitron tracking-tighter text-[#C5A04E]">
          ECOMY
        </h1>
      </header>

      {/* 3. Viewer Count Badge */}
      {loaded && (
        <div className="pb-4">
          <ViewerCountBadge promoActive={promoActive} placesRemaining={placesRemaining} />
        </div>
      )}

      {/* 4. 3-Card Grid */}
      <section className="flex-1 flex items-center justify-center w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1050px] w-full md:auto-rows-[1fr]">

          {/* Card 1 — Formation E-commerce */}
          <div className="relative flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(197,160,78,0.1)' }}>
            {showClosed ? (
              <>
                <img src="/images/ecommerce-banner.png" alt="تكوين التجارة الإلكترونية" className="w-full aspect-video object-cover" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <StarRating count={5} total="453" />
                  <h3 className="text-white font-bold text-[15px] leading-snug">اربح من الإنترنت | التجارة الإلكترونية</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>497 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">تخفيض %75</span>
                  </div>
                  <div className="flex-1" />
                  <div className="w-full text-center bg-gray-700 text-gray-400 text-[15px] font-bold py-3.5 rounded-xl cursor-not-allowed">
                    ابدأ الآن
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl">
                  <span className="bg-red-900/90 text-red-200 font-bold text-lg px-6 py-3 rounded-xl border border-red-700/50">
                    نفذت الأماكن
                  </span>
                </div>
              </>
            ) : (
              <Link href="/formation" className="group flex flex-col flex-1">
                <img src="/images/ecommerce-banner.png" alt="تكوين التجارة الإلكترونية" className="w-full aspect-video object-cover" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <StarRating count={5} total="453" />
                  <h3 className="text-white font-bold text-[15px] leading-snug">اربح من الإنترنت | التجارة الإلكترونية</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>1970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>497 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">تخفيض %75</span>
                  </div>
                  <div className="flex-1" />
                  {showPromo && <CompactPromoInfo settings={promoSettings} />}
                  <div className="w-full text-center bg-[#10B981] group-hover:bg-[#0D9668] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors">
                    ابدأ الآن
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Card 2 — Diagnostic Business */}
          <div className="relative flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(197,160,78,0.1)' }}>
            {showClosed ? (
              <>
                <img src="/images/diagnostic-banner.png" alt="تشخيص بزنس" className="w-full aspect-video object-cover" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <StarRating count={5} total="120" />
                  <h3 className="text-white font-bold text-[15px] leading-snug">تشخيص بزنس | اكتشف البزنس المناسب لك</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>97 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">تخفيض %90</span>
                  </div>
                  <div className="flex-1" />
                  <div className="w-full text-center bg-gray-700 text-gray-400 text-[15px] font-bold py-3.5 rounded-xl cursor-not-allowed">
                    احجز موعدك
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl">
                  <span className="bg-red-900/90 text-red-200 font-bold text-lg px-6 py-3 rounded-xl border border-red-700/50">
                    نفذت الأماكن
                  </span>
                </div>
              </>
            ) : (
              <Link href="/diagnostic" className="group flex flex-col flex-1">
                <img src="/images/diagnostic-banner.png" alt="تشخيص بزنس" className="w-full aspect-video object-cover" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <StarRating count={5} total="120" />
                  <h3 className="text-white font-bold text-[15px] leading-snug">تشخيص بزنس | اكتشف البزنس المناسب لك</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-500 text-xl font-black line-through" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>970 €</span>
                    <span className="text-white text-xl font-black" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>97 €</span>
                    <span className="inline-block bg-[#C5A04E]/10 text-[#C5A04E] text-[11px] font-bold px-2.5 py-0.5 rounded-full">تخفيض %90</span>
                  </div>
                  <div className="flex-1" />
                  <div className="w-full text-center bg-[#E8600A] group-hover:bg-[#D15509] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors">
                    احجز موعدك
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Card 3 — Connexion espace membre */}
          <Link
            href="/login"
            className="group flex flex-col bg-[#0A0A0A] rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-200"
            style={{ boxShadow: '0 4px 20px rgba(255,255,255,0.03)' }}
          >
            <img src="/images/members-area.png" alt="منطقة الأعضاء" className="w-full aspect-video object-cover" />
            <div className="p-5 space-y-3 flex-1 flex flex-col">
              <h3 className="text-white font-bold text-[15px] leading-snug">عندي حساب بالفعل</h3>
              <p className="text-gray-500 text-sm">الدخول إلى المنصة</p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-[#1A1A1A] border-2 border-[#0A0A0A] flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-[#C5A04E]/20 border-2 border-[#0A0A0A] flex items-center justify-center">
                    <span className="text-[#C5A04E] text-[9px] font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>+</span>
                  </div>
                </div>
                <span className="text-gray-400 text-xs font-bold">+1000 عضو مسجل</span>
              </div>
              <div className="flex-1" />
              <div className="w-full text-center bg-[#1A1A1A] group-hover:bg-[#222222] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors border border-white/10">
                تسجيل الدخول
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Closed registrations banner */}
      {showClosed && (
        <section className="w-full px-4 pb-6">
          <div className="max-w-[1050px] mx-auto rounded-2xl border border-red-900/30 bg-[#0A0A0A] p-8 text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              🚫 التسجيلات مغلقة 🚫
            </h2>
            <p className="text-red-400 text-base font-bold">
              لقد فاتتك الفرصة... الأماكن امتلأت بالكامل
            </p>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">كان بإمكانك أن تكون من بين الناجحين الآن</p>
              <p className="text-gray-400 text-sm">لكنك تأخرت... والأبواب أُغلقت</p>
            </div>
            {closedAt && <ClosedTimer closedAt={closedAt} />}
            <a
              href="https://t.me/ecom_europe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-base px-8 py-4 rounded-xl transition-colors animate-glow-telegram mt-2"
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              🔔 انضم لقناة التلغرام حتى لا تفوتك الفرصة القادمة
            </a>
          </div>
        </section>
      )}

      {/* 5. Live Registrations List */}
      {loaded && registrationsOpen && (
        <LiveRegistrationsList promoActive={promoActive} promoSettings={promoSettings} />
      )}

      {/* Telegram Community Banner */}
      <section className="w-full px-4 pb-8">
        <a
          href="https://t.me/ecom_europe"
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-[1050px] mx-auto flex items-center justify-center gap-4 bg-[#111111]/60 border border-[#C5A04E]/10 rounded-2xl px-8 py-4 hover:border-[#C5A04E]/30 transition-colors"
        >
          <svg className="w-6 h-6 text-[#26A5E4] shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          <span className="text-gray-400 text-sm font-semibold">انضم لمجتمعنا على تيليغرام</span>
        </a>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center">
        <a href="/legal/terms" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
          Terms & Conditions
        </a>
      </footer>
    </main>
  );
}
