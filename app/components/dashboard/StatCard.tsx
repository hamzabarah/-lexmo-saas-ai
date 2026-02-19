import { LucideIcon } from "lucide-react";
import Card from "./Card";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: string; // hex color for icon bg
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, color = "#00d2ff" }: StatCardProps) {
    return (
        <Card className="hover:border-[#C9A84C]/30 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[#64607A] text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-[#1A1A2E] font-orbitron">{value}</h3>
                    {trend && (
                        <p className={`text-xs mt-2 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                            {trend}
                        </p>
                    )}
                </div>
                <div
                    className="p-3 rounded-xl"
                    style={{ color: color, backgroundColor: `${color}15` }}
                >
                    <Icon size={24} />
                </div>
            </div>
        </Card>
    );
}
