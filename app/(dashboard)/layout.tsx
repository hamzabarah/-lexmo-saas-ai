import Sidebar from "@/app/components/dashboard/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#030712] text-white font-cairo" dir="rtl">
            {/* Top Navbar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="min-h-screen pt-24 px-4 pb-4 lg:px-8 lg:pb-8 overflow-x-hidden">
                <div className="max-w-6xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
