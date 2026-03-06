import clsx from "clsx";

export default function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={clsx(
            "bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative overflow-hidden",
            className
        )}>
            {/* Optional subtle gradient glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
