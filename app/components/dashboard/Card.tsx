import clsx from "clsx";

export default function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={clsx(
            "bg-white border border-[#E8E0D4] rounded-2xl p-6 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
            className
        )}>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
