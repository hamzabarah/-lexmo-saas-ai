'use client';

import { useState, useEffect, useRef } from 'react';
import { Flame, Plus, Trash2, Edit3, X, Trophy, Users, Clock, Target, Play, Square } from 'lucide-react';

interface Challenge {
    id: string;
    name: string;
    total_days: number;
    target_revenue: number;
    current_revenue: number;
    team_count: number;
    started_at: string;
    is_active: boolean;
}

interface Task {
    id: string;
    challenge_id: string;
    day_number: number;
    time_text: string;
    task_text: string;
    status: 'todo' | 'in_progress' | 'done';
}

export default function ChallengeTracker() {
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(1);
    const [elapsed, setElapsed] = useState({ hours: 0, minutes: 0, seconds: 0 });

    // Create form
    const [formName, setFormName] = useState('من 0 ل 1000€');
    const [formDays, setFormDays] = useState(7);
    const [formTarget, setFormTarget] = useState(1000);
    const [formTeam, setFormTeam] = useState(156);
    const [creating, setCreating] = useState(false);

    // Edit mode
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editTarget, setEditTarget] = useState(0);
    const [editTeam, setEditTeam] = useState(0);

    // Revenue input
    const [revenueInput, setRevenueInput] = useState('');
    const [updatingRevenue, setUpdatingRevenue] = useState(false);

    // New task
    const [newTaskTime, setNewTaskTime] = useState('');
    const [newTaskText, setNewTaskText] = useState('');
    const [addingTask, setAddingTask] = useState(false);

    // Flash effect for status change
    const [flashTaskId, setFlashTaskId] = useState<string | null>(null);

    // Celebration
    const [showCelebration, setShowCelebration] = useState(false);
    const prevRevenueRef = useRef(0);

    // Load challenge data
    useEffect(() => {
        loadChallenge();
    }, []);

    // Elapsed timer
    useEffect(() => {
        if (!challenge) return;
        function tick() {
            const diff = Date.now() - new Date(challenge!.started_at).getTime();
            if (diff < 0) return;
            setElapsed({
                hours: Math.floor(diff / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        }
        tick();
        const iv = setInterval(tick, 1000);
        return () => clearInterval(iv);
    }, [challenge?.started_at]);

    // Auto-detect current day
    useEffect(() => {
        if (!challenge) return;
        const daysPassed = Math.floor((Date.now() - new Date(challenge.started_at).getTime()) / 86400000);
        const currentDay = Math.min(Math.max(daysPassed + 1, 1), challenge.total_days);
        setActiveDay(currentDay);
    }, [challenge?.started_at, challenge?.total_days]);

    // Celebration trigger
    useEffect(() => {
        if (!challenge) return;
        if (challenge.current_revenue >= challenge.target_revenue && prevRevenueRef.current < challenge.target_revenue) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 4000);
        }
        prevRevenueRef.current = challenge.current_revenue;
    }, [challenge?.current_revenue, challenge?.target_revenue]);

    const loadChallenge = async () => {
        try {
            const res = await fetch('/api/admin/challenges');
            const data = await res.json();
            setChallenge(data.challenge || null);
            setTasks(data.tasks || []);
            if (data.challenge) {
                setRevenueInput(String(data.challenge.current_revenue || 0));
            }
        } catch (e) {
            console.error('Error loading challenge:', e);
        } finally {
            setLoading(false);
        }
    };

    const createChallenge = async () => {
        if (!formName.trim() || formDays < 1 || formTarget < 1) return;
        setCreating(true);
        try {
            const res = await fetch('/api/admin/challenges', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formName,
                    total_days: formDays,
                    target_revenue: formTarget,
                    team_count: formTeam,
                }),
            });
            const data = await res.json();
            if (data.challenge) {
                setChallenge(data.challenge);
                setTasks([]);
                setRevenueInput('0');
                setActiveDay(1);
            }
        } catch (e) {
            console.error('Error creating challenge:', e);
        } finally {
            setCreating(false);
        }
    };

    const endChallenge = async () => {
        if (!challenge || !confirm('هل أنت متأكد من إنهاء التحدي؟')) return;
        try {
            await fetch('/api/admin/challenges', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: challenge.id, is_active: false }),
            });
            setChallenge(null);
            setTasks([]);
        } catch (e) {
            console.error('Error ending challenge:', e);
        }
    };

    const saveEdit = async () => {
        if (!challenge) return;
        try {
            const res = await fetch('/api/admin/challenges', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: challenge.id,
                    name: editName,
                    target_revenue: editTarget,
                    team_count: editTeam,
                }),
            });
            const data = await res.json();
            if (data.challenge) setChallenge(data.challenge);
            setEditing(false);
        } catch (e) {
            console.error('Error updating challenge:', e);
        }
    };

    const updateRevenue = async () => {
        if (!challenge) return;
        const val = parseFloat(revenueInput) || 0;
        setUpdatingRevenue(true);
        try {
            const res = await fetch('/api/admin/challenges', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: challenge.id, current_revenue: val }),
            });
            const data = await res.json();
            if (data.challenge) setChallenge(data.challenge);
        } catch (e) {
            console.error('Error updating revenue:', e);
        } finally {
            setUpdatingRevenue(false);
        }
    };

    const addTask = async () => {
        if (!challenge || !newTaskText.trim()) return;
        setAddingTask(true);
        try {
            const res = await fetch('/api/admin/challenges/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challenge_id: challenge.id,
                    day_number: activeDay,
                    time_text: newTaskTime,
                    task_text: newTaskText,
                }),
            });
            const data = await res.json();
            if (data.task) {
                setTasks(prev => [...prev, data.task]);
                setNewTaskTime('');
                setNewTaskText('');
            }
        } catch (e) {
            console.error('Error adding task:', e);
        } finally {
            setAddingTask(false);
        }
    };

    const updateTaskStatus = async (taskId: string, status: string) => {
        try {
            const res = await fetch('/api/admin/challenges/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: taskId, status }),
            });
            const data = await res.json();
            if (data.task) {
                setTasks(prev => prev.map(t => t.id === taskId ? data.task : t));
                if (status === 'done') {
                    setFlashTaskId(taskId);
                    setTimeout(() => setFlashTaskId(null), 600);
                }
            }
        } catch (e) {
            console.error('Error updating task:', e);
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            await fetch(`/api/admin/challenges/tasks?id=${taskId}`, { method: 'DELETE' });
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (e) {
            console.error('Error deleting task:', e);
        }
    };

    // Computed
    const dayTasks = tasks.filter(t => t.day_number === activeDay);
    const allTasksDone = tasks.filter(t => t.status === 'done').length;
    const allTasksTotal = tasks.length;
    const revenuePercent = challenge ? Math.min((challenge.current_revenue / challenge.target_revenue) * 100, 100) : 0;
    const dayPercent = challenge ? Math.min((activeDay / challenge.total_days) * 100, 100) : 0;

    // Work time for current day
    const dayTaskTimes = dayTasks.filter(t => t.time_text).map(t => t.time_text).sort();
    const workTime = dayTaskTimes.length >= 2
        ? (() => {
            const first = dayTaskTimes[0];
            const last = dayTaskTimes[dayTaskTimes.length - 1];
            const [h1, m1] = first.split(':').map(Number);
            const [h2, m2] = last.split(':').map(Number);
            const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
            if (diff <= 0) return null;
            const wh = Math.floor(diff / 60);
            const wm = diff % 60;
            return `${wh} ساعة${wm > 0 ? ` و ${wm} دقيقة` : ''}`;
        })()
        : null;

    const pad = (n: number) => String(n).padStart(2, '0');

    if (loading) {
        return (
            <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl p-6 mb-8">
                <div className="text-gray-500 text-center py-8">جاري التحميل...</div>
            </div>
        );
    }

    // ═══════════════════════════════════
    // NO ACTIVE CHALLENGE — CREATE FORM
    // ═══════════════════════════════════
    if (!challenge) {
        return (
            <div className="bg-[#111111]/50 border border-[#C5A04E]/10 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Flame className="w-6 h-6 text-orange-500" />
                    <h2 className="text-2xl font-bold text-white">🔥 التحدي</h2>
                </div>

                <div className="bg-[#0A0A0A] border border-[#C5A04E]/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-[#C5A04E] mb-6 text-center">🚀 إنشاء تحدي جديد</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">اسم التحدي</label>
                            <input
                                type="text"
                                value={formName}
                                onChange={e => setFormName(e.target.value)}
                                placeholder="من 0 ل 1000€"
                                className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] text-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">عدد الأيام</label>
                            <input
                                type="number"
                                min={1}
                                max={365}
                                value={formDays}
                                onChange={e => setFormDays(parseInt(e.target.value) || 7)}
                                className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] text-center text-xl font-bold"
                                style={{ fontFamily: 'Orbitron, monospace' }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">الهدف بالأورو (€)</label>
                            <input
                                type="number"
                                min={1}
                                value={formTarget}
                                onChange={e => setFormTarget(parseInt(e.target.value) || 1000)}
                                className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] text-center text-xl font-bold"
                                style={{ fontFamily: 'Orbitron, monospace' }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">عدد الأعضاء</label>
                            <input
                                type="number"
                                min={0}
                                value={formTeam}
                                onChange={e => setFormTeam(parseInt(e.target.value) || 0)}
                                className="w-full bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A04E] text-center text-xl font-bold"
                                style={{ fontFamily: 'Orbitron, monospace' }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={createChallenge}
                        disabled={creating || !formName.trim()}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {creating ? 'جاري الإنشاء...' : '🚀 ابدأ التحدي'}
                    </button>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════
    // ACTIVE CHALLENGE — FULL TRACKER
    // ═══════════════════════════════════
    return (
        <div className="bg-[#0A0A0A] border border-[#C5A04E]/20 rounded-2xl overflow-hidden mb-8">
            {/* Celebration overlay */}
            {showCelebration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="text-center animate-bounce">
                        <div className="text-8xl mb-4">🎉🏆🎉</div>
                        <div className="text-4xl font-bold text-[#C5A04E]" style={{ fontFamily: 'Orbitron, monospace' }}>
                            تم تحقيق الهدف!
                        </div>
                    </div>
                    {/* Golden flash */}
                    <div className="absolute inset-0 bg-[#C5A04E]/10 animate-pulse pointer-events-none" />
                </div>
            )}

            {/* ═══ HEADER BAR ═══ */}
            <div className="bg-gradient-to-r from-[#0A0A0A] via-[#111111] to-[#0A0A0A] border-b border-[#C5A04E]/20 px-6 py-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <Flame className="w-6 h-6 text-orange-500" />
                        </div>
                        {editing ? (
                            <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="bg-[#1A1A1A] border border-[#C5A04E]/30 text-white rounded-lg px-3 py-1.5 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#C5A04E]"
                            />
                        ) : (
                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                🔥 تحدي {challenge.total_days} أيام — {challenge.name}
                            </h2>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {editing ? (
                            <>
                                <button onClick={saveEdit} className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-500/30 transition">حفظ</button>
                                <button onClick={() => setEditing(false)} className="bg-gray-700/50 text-gray-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition">إلغاء</button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => { setEditing(true); setEditName(challenge.name); setEditTarget(challenge.target_revenue); setEditTeam(challenge.team_count); }}
                                    className="bg-[#1A1A1A] border border-[#C5A04E]/10 text-gray-400 px-4 py-2 rounded-lg text-sm font-bold hover:text-white transition flex items-center gap-1.5"
                                >
                                    <Edit3 className="w-3.5 h-3.5" /> تعديل
                                </button>
                                <button
                                    onClick={endChallenge}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/20 transition flex items-center gap-1.5"
                                >
                                    <Square className="w-3.5 h-3.5" /> إنهاء التحدي
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ MAIN STATS GRID ═══ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-[#C5A04E]/10">
                {/* Day Counter */}
                <div className="p-5 md:p-6 border-l border-[#C5A04E]/10 text-center">
                    <p className="text-gray-500 text-xs mb-2">📅 اليوم</p>
                    <div className="text-4xl md:text-5xl font-bold text-[#C5A04E]" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {activeDay}
                    </div>
                    <p className="text-gray-600 text-xs mt-1">من {challenge.total_days}</p>
                    {/* Mini day progress */}
                    <div className="mt-3 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#C5A04E] to-[#D4B85C] rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${dayPercent}%` }}
                        />
                    </div>
                </div>

                {/* Revenue Counter */}
                <div className="p-5 md:p-6 border-l border-[#C5A04E]/10 text-center">
                    <p className="text-gray-500 text-xs mb-2">💰 الإيرادات</p>
                    <div className="text-3xl md:text-4xl font-bold text-green-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {challenge.current_revenue}€
                    </div>
                    <p className="text-gray-600 text-xs mt-1">الهدف: {editing ? (
                        <input type="number" value={editTarget} onChange={e => setEditTarget(parseInt(e.target.value) || 0)} className="inline w-20 bg-[#1A1A1A] border border-[#C5A04E]/30 text-white rounded px-2 py-0.5 text-xs" />
                    ) : `${challenge.target_revenue}€`}</p>
                    {/* Revenue progress */}
                    <div className="mt-3 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${revenuePercent >= 100 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 animate-pulse' : 'bg-gradient-to-r from-green-500 to-emerald-400'}`}
                            style={{ width: `${revenuePercent}%` }}
                        />
                    </div>
                </div>

                {/* Timer */}
                <div className="p-5 md:p-6 border-l border-[#C5A04E]/10 text-center">
                    <p className="text-gray-500 text-xs mb-2">⏱ منذ البداية</p>
                    <div className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {pad(elapsed.hours)}:{pad(elapsed.minutes)}
                    </div>
                    <p className="text-gray-600 text-xs mt-1">
                        <span className="text-white/50" style={{ fontFamily: 'Orbitron, monospace' }}>:{pad(elapsed.seconds)}</span>
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        <span className="text-green-400 text-[10px] font-bold">LIVE</span>
                    </div>
                </div>

                {/* Team */}
                <div className="p-5 md:p-6 text-center">
                    <p className="text-gray-500 text-xs mb-2">👥 الأعضاء</p>
                    <div className="text-4xl md:text-5xl font-bold text-blue-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {editing ? (
                            <input type="number" value={editTeam} onChange={e => setEditTeam(parseInt(e.target.value) || 0)} className="w-24 bg-[#1A1A1A] border border-[#C5A04E]/30 text-blue-400 text-center rounded-lg px-2 py-1 text-3xl" style={{ fontFamily: 'Orbitron, monospace' }} />
                        ) : challenge.team_count}
                    </div>
                    <p className="text-gray-600 text-xs mt-1">عضو في الفريق</p>
                </div>
            </div>

            {/* ═══ REVENUE INPUT ═══ */}
            <div className="px-6 py-4 border-b border-[#C5A04E]/10 bg-[#080808]">
                <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-gray-400 text-sm shrink-0">تحديث الإيرادات:</span>
                    <input
                        type="number"
                        value={revenueInput}
                        onChange={e => setRevenueInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && updateRevenue()}
                        className="bg-[#1A1A1A] border border-green-500/20 text-green-400 rounded-lg px-4 py-2 w-32 text-center font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
                        style={{ fontFamily: 'Orbitron, monospace' }}
                    />
                    <span className="text-gray-500 text-sm">€</span>
                    <button
                        onClick={updateRevenue}
                        disabled={updatingRevenue}
                        className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-500/30 transition disabled:opacity-50"
                    >
                        {updatingRevenue ? '...' : '💰 تحديث'}
                    </button>
                </div>
            </div>

            {/* ═══ DAY NAVIGATION ═══ */}
            <div className="px-6 py-3 border-b border-[#C5A04E]/10 bg-[#080808] overflow-x-auto">
                <div className="flex gap-1.5 min-w-max">
                    {Array.from({ length: challenge.total_days }, (_, i) => i + 1).map(day => {
                        const daysPassed = Math.floor((Date.now() - new Date(challenge.started_at).getTime()) / 86400000) + 1;
                        const isCurrentDay = day === Math.min(daysPassed, challenge.total_days);
                        const isActive = day === activeDay;
                        const dayTaskCount = tasks.filter(t => t.day_number === day).length;
                        const dayDoneCount = tasks.filter(t => t.day_number === day && t.status === 'done').length;

                        return (
                            <button
                                key={day}
                                onClick={() => setActiveDay(day)}
                                className={`relative px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                    isActive
                                        ? 'bg-[#C5A04E] text-black shadow-lg shadow-[#C5A04E]/20'
                                        : isCurrentDay
                                            ? 'bg-[#C5A04E]/20 text-[#C5A04E] border border-[#C5A04E]/30'
                                            : 'bg-[#1A1A1A] text-gray-500 hover:text-gray-300 hover:bg-[#222]'
                                }`}
                            >
                                اليوم {day}
                                {dayTaskCount > 0 && (
                                    <span className={`mr-1.5 text-[10px] ${isActive ? 'text-black/60' : 'text-gray-600'}`}>
                                        ({dayDoneCount}/{dayTaskCount})
                                    </span>
                                )}
                                {isCurrentDay && !isActive && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C5A04E] rounded-full animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ═══ TASKS TABLE ═══ */}
            <div className="px-6 py-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#C5A04E]" />
                    مهام اليوم {activeDay}
                    {dayTasks.length > 0 && (
                        <span className="text-sm text-gray-500 font-normal">({dayTasks.filter(t => t.status === 'done').length}/{dayTasks.length})</span>
                    )}
                </h3>

                {dayTasks.length > 0 ? (
                    <div className="space-y-2 mb-4">
                        {dayTasks.map(task => (
                            <div
                                key={task.id}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                                    flashTaskId === task.id ? 'bg-green-500/30 scale-[1.02]' :
                                    task.status === 'done' ? 'bg-green-950/20 border border-green-500/10' :
                                    task.status === 'in_progress' ? 'bg-orange-950/20 border border-orange-500/10' :
                                    'bg-[#111111] border border-[#C5A04E]/5'
                                }`}
                            >
                                {/* Time */}
                                <div className="shrink-0 w-16 text-center">
                                    <span className="text-sm font-bold text-gray-400" style={{ fontFamily: 'Orbitron, monospace' }}>
                                        {task.time_text || '—'}
                                    </span>
                                </div>

                                {/* Task text */}
                                <div className="flex-1 min-w-0">
                                    <span className={`text-sm ${task.status === 'done' ? 'text-gray-500 line-through' : 'text-white'}`}>
                                        {task.task_text}
                                    </span>
                                </div>

                                {/* Status selector */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => updateTaskStatus(task.id, 'todo')}
                                        className={`px-2 py-1 rounded text-[11px] font-bold transition ${task.status === 'todo' ? 'bg-gray-600 text-white' : 'bg-[#1A1A1A] text-gray-600 hover:text-gray-300'}`}
                                    >
                                        ⬜
                                    </button>
                                    <button
                                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                        className={`px-2 py-1 rounded text-[11px] font-bold transition ${task.status === 'in_progress' ? 'bg-orange-500/30 text-orange-400' : 'bg-[#1A1A1A] text-gray-600 hover:text-gray-300'}`}
                                    >
                                        ⏳
                                    </button>
                                    <button
                                        onClick={() => updateTaskStatus(task.id, 'done')}
                                        className={`px-2 py-1 rounded text-[11px] font-bold transition ${task.status === 'done' ? 'bg-green-500/30 text-green-400' : 'bg-[#1A1A1A] text-gray-600 hover:text-gray-300'}`}
                                    >
                                        ✅
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-600 text-sm mb-4">
                        لا توجد مهام لهذا اليوم بعد
                    </div>
                )}

                {/* Add task form */}
                <div className="flex items-center gap-2 bg-[#111111] border border-[#C5A04E]/10 rounded-xl px-4 py-3">
                    <input
                        type="text"
                        value={newTaskTime}
                        onChange={e => setNewTaskTime(e.target.value)}
                        placeholder="00:00"
                        className="bg-[#1A1A1A] border border-[#C5A04E]/10 text-white rounded-lg px-3 py-2 w-20 text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A04E]"
                        style={{ fontFamily: 'Orbitron, monospace' }}
                    />
                    <input
                        type="text"
                        value={newTaskText}
                        onChange={e => setNewTaskText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTask()}
                        placeholder="أضف مهمة جديدة..."
                        className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none"
                    />
                    <button
                        onClick={addTask}
                        disabled={addingTask || !newTaskText.trim()}
                        className="bg-[#C5A04E]/20 text-[#C5A04E] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#C5A04E]/30 transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                    >
                        <Plus className="w-4 h-4" /> إضافة
                    </button>
                </div>
            </div>

            {/* ═══ STATS FOOTER ═══ */}
            <div className="grid grid-cols-3 gap-0 border-t border-[#C5A04E]/10 bg-[#080808]">
                <div className="p-4 text-center border-l border-[#C5A04E]/10">
                    <p className="text-gray-600 text-[10px] mb-1">✅ المهام المنجزة</p>
                    <p className="text-white font-bold text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {allTasksDone}<span className="text-gray-600">/{allTasksTotal}</span>
                    </p>
                </div>
                <div className="p-4 text-center border-l border-[#C5A04E]/10">
                    <p className="text-gray-600 text-[10px] mb-1">⏱ وقت العمل اليوم</p>
                    <p className="text-white font-bold text-sm">
                        {workTime || '—'}
                    </p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-gray-600 text-[10px] mb-1">👥 أعضاء الفريق</p>
                    <p className="text-blue-400 font-bold text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {challenge.team_count}
                    </p>
                </div>
            </div>
        </div>
    );
}
