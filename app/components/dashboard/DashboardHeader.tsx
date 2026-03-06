import { Bell } from "lucide-react";

export default function DashboardHeader({ title, subtitle }: { title: string, subtitle?: string }) {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white font-cairo">{title}</h1>
                {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full bg-[#1A1A1A] hover:bg-[#1A1A1A] text-gray-500 hover:text-white transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
