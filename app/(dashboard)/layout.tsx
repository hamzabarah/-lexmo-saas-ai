import Sidebar from "@/app/components/dashboard/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#030712] text-white font-cairo" dir="rtl">
            {/* Sidebar (Fixed Right) */}
            <Sidebar />

            {/* Main Content Area */}
            {/* lg:mr-72 pushes content to the left of the fixed sidebar on desktop */}
            <main className="flex-1 lg:mr-72 min-h-screen p-4 lg:p-8 overflow-x-hidden">
                <div className="max-w-6xl mx-auto space-y-8 mt-12 lg:mt-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
