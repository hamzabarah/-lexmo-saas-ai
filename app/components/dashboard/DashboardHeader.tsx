import { Bell, Search } from "lucide-react";

export default function DashboardHeader({ title, subtitle }: { title: string, subtitle?: string }) {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-[#1A1A2E] font-cairo">{title}</h1>
                {subtitle && <p className="text-[#64607A] mt-1">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar (Placeholder) */}
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="بحث..."
                        className="bg-[#F5F1EB] border border-[#E8E0D4] rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:border-[#C9A84C]/50 w-64 text-[#1A1A2E] placeholder:text-[#64607A]"
                    />
                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64607A]" />
                </div>

                <button className="p-2 rounded-full bg-[#F5F1EB] hover:bg-[#E8E0D4] text-[#64607A] hover:text-[#1A1A2E] transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
