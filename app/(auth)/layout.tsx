import Link from "next/link";
import "../globals.css";

export const metadata = {
    title: "تسجيل الدخول - LEXMO.AI",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden font-cairo">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00d2ff]/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#9d50bb]/10 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                {/* Logo */}
                <Link href="/" className="mb-8 group">
                    <h1 className="text-4xl font-bold font-orbitron tracking-tighter text-white group-hover:scale-105 transition-transform">
                        LEXMO<span className="text-[#00d2ff]">.AI</span>
                    </h1>
                </Link>

                {children}
            </div>
        </div>
    );
}
