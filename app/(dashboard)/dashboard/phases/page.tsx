

import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import PhaseCard from "@/app/components/dashboard/PhaseCard";
import { getPhases } from "@/app/actions/course";

export default async function PhasesPage() {
    const phases = await getPhases();

    return (
        <>
            <DashboardHeader title="مسار التعلم (11 مرحلة) 🎓" subtitle="أكمل المراحل بالترتيب للوصول إلى هدفك" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {phases.map((phase) => {
                    const isLocked = phase.is_locked;
                    // TODO: Calculate real progress
                    const progress = phase.phase_number === 1 ? 65 : 0;
                    const completed = phase.phase_number === 1 ? 8 : 0;

                    return (
                        <PhaseCard
                            key={phase.id}
                            id={phase.phase_number}
                            title={phase.title_en} // Badge/English Title
                            subtitle={phase.title_ar} // Main Arabic Title
                            progress={progress}
                            totalModules={phase.total_modules}
                            completedModules={completed}
                            isLocked={isLocked}
                            color={phase.color || "#00d2ff"}
                        />
                    );
                })}
            </div>
        </>
    );
}
