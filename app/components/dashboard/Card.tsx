import clsx from "clsx";

export default function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={clsx(
            "bg-[#111111] border border-[#C5A04E]/15 shadow-lg shadow-[#C5A04E]/5 rounded-2xl p-6 relative overflow-hidden",
            className
        )}>
            {/* Optional subtle gradient glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#C5A04E]/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
