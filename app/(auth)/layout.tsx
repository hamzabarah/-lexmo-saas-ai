import Link from "next/link";
import "../globals.css";

export const metadata = {
    title: "تسجيل الدخول - ECOMY",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 relative overflow-hidden font-cairo">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#008060]/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#006e52]/5 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                {/* Logo */}
                <Link href="/" className="mb-8 group">
                    <h1 className="text-4xl font-bold font-orbitron tracking-tighter text-gray-900 group-hover:scale-105 transition-transform">
                        ECOMY
                    </h1>
                </Link>

                {children}
            </div>
        </div>
    );
}
