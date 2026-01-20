"use client";

import { Send, Bot, Sparkles, User } from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import Card from "@/app/components/dashboard/Card";
import { useState } from "react";

const SUGGESTIONS = [
    "كيف أبدأ؟ 🚀",
    "ما هي الخطوة التالية؟ 👣",
    "كيف أزيد مبيعاتي؟ 💰",
    "عندي مشكلة في الإعلانات 📢"
];

export default function CoachPage() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: "مرحباً بك يا بطل! 👋\nأنا الكوتش الذكي الخاص بـ LEXMO. لقد اطلعت على تقدمك، وأرى أنك في المرحلة الأولى.\nكيف يمكنني مساعدتك اليوم في تحقيق أول مبيعة؟" },
        { role: 'user', content: "أواجه مشكلة في اختيار المنتج الرابح، هل لديك نصائح؟" },
        { role: 'ai', content: "بالتأكيد! لاختيار منتج رابح في المرحلة الأولى (Extraction)، ركز على معايير 'الإبهار' (Wow Factor) وحل المشكلة. هل جربت البحث في مكتبة إعلانات TikTok؟" }
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { role: 'user', content: inputValue }]);
        setInputValue("");
        // Simulate AI response capability would go here
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            <DashboardHeader title="الكوتش الذكي 🤖" subtitle="اسألني أي شيء عن التجارة الإلكترونية وسأساعدك" />

            <Card className="flex-1 flex flex-col min-h-0 bg-[#0f172a]/80 p-0 overflow-hidden border-[#9d50bb]/20">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'ai' ? 'bg-[#9d50bb]/10 border-[#9d50bb]/30 text-[#9d50bb]' : 'bg-[#00d2ff]/10 border-[#00d2ff]/30 text-[#00d2ff]'}`}>
                                {msg.role === 'ai' ? <Bot size={20} /> : <span className="text-xs font-bold">ME</span>}
                            </div>

                            {/* Message Bubble */}
                            <div className={`rounded-2xl p-4 max-w-[80%] leading-relaxed text-sm lg:text-base ${msg.role === 'ai' ? 'bg-white/5 rounded-tr-none text-gray-200' : 'bg-[#00d2ff]/10 rounded-tl-none text-white border border-[#00d2ff]/10'}`}>
                                {msg.content.split('\n').map((line, i) => (
                                    <p key={i} className="mb-1 last:mb-0">{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area + Suggestions */}
                <div className="p-4 border-t border-white/10 bg-[#0f172a]">
                    {/* Suggestions */}
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
                        {SUGGESTIONS.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setInputValue(s)}
                                className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:border-[#00d2ff]/30 hover:text-[#00d2ff] text-xs text-gray-400 transition-all"
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="اكتب رسالتك هنا..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 pl-12 focus:outline-none focus:border-[#9d50bb]/50 text-white placeholder:text-gray-600"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-[#9d50bb] text-white rounded-lg hover:bg-[#8e44ad] transition-colors shadow-[0_0_15px_rgba(157,80,187,0.3)]"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
