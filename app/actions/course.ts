'use server'

import { createClient } from "@/utils/supabase/server";

// ==========================================
// Types
// ==========================================

export type Phase = {
    id: string;
    phase_number: number;
    title_ar: string;
    title_en: string;
    description_ar: string;
    icon: string;
    color: string;
    total_modules: number; // This might now mean "total units" or "total lessons"? Keeping as is for now.
    is_locked: boolean;
    units?: UnitSummary[]; // Changed from modules
};

// Formerly "Module" - now "Unit" (We7da)
export type UnitSummary = {
    id: string;
    module_number: number; // Unit number (1, 2, 3...)
    title_ar: string;
    title_en: string;
    badge: string;
    is_locked: boolean;
    emoji: string;
    lessons_count?: number;
};

// Formerly "ModuleDetails" - now "UnitDetails"
export type UnitDetails = UnitSummary & {
    lessons: LessonSummary[];
    objective_ar?: string;
    expected_result_ar?: string;
};

// New "Lesson" type (formerly the content holder)
export type LessonSummary = {
    id: string;
    module_number: number; // This is actually 'module_number' in DB (which is lesson number now? No, we need to be careful with column names)
    // In DB migration: 'modules' table renamed to 'lessons'. 'module_number' column remains.
    // So 'module_number' in 'lessons' table is the Lesson Number (1, 2, 3...).
    title_ar: string;
    title_en: string;
    is_locked: boolean;
    is_completed?: boolean; // For UI state
};

export type LessonDetails = LessonSummary & {
    content_ar: string;
    expected_result_ar: string;
    tasks: Task[];
    unit_total_lessons?: number;
};

export type Task = {
    id: string;
    task_text_ar: string;
    order_index: number;
    is_completed: boolean;
};

// ==========================================
// Server Actions
// ==========================================

export async function getPhases() {
    const supabase = await createClient();

    const { data: phases, error } = await supabase
        .from('phases')
        .select('*')
        .order('phase_number', { ascending: true });

    if (error) {
        console.error('Error fetching phases:', error);
        return [];
    }

    return phases as Phase[];
}

// Fetch a Phase and its Units (course_modules)
export async function getPhaseDetails(phaseNumber: number) {
    const supabase = await createClient();

    // 1. Fetch Phase
    const { data: phase, error } = await supabase
        .from('phases')
        .select('*')
        .eq('phase_number', phaseNumber)
        .single();

    if (error || !phase) {
        console.error('Error fetching phase:', error);
        return null;
    }

    // 2. Fetch Units (course_modules)
    const { data: units, error: unitsError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('phase_id', phase.id)
        .order('module_number', { ascending: true });

    if (unitsError) {
        console.error('Error fetching units:', unitsError);
    }

    return {
        ...phase,
        units: units || []
    };
}

// Fetch a Unit and its Lessons
export async function getUnitDetails(phaseNumber: number, unitNumber: number) {
    const supabase = await createClient();

    // 1. Get Phase
    const { data: phase } = await supabase.from('phases').select('id').eq('phase_number', phaseNumber).single();
    if (!phase) return null;

    // 2. Get Unit
    const { data: unit, error: unitError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('phase_id', phase.id)
        .eq('module_number', unitNumber)
        .single();

    if (unitError || !unit) {
        console.error('Error fetching unit:', unitError);
        return null;
    }

    // 3. Get Lessons for this Unit
    const { data: lessons, error: lessonsError } = await supabase
        .from('lessons') // Renamed table
        .select('id, module_number, title_ar, title_en, is_locked')
        .eq('course_module_id', unit.id)
        .order('module_number', { ascending: true }); // Assuming 'order_index' or 'module_number'

    if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
    }

    return {
        ...unit,
        lessons: lessons || []
    } as UnitDetails;
}

// Fetch specific Lesson Details
export async function getLessonDetails(unitId: string, lessonNumber: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get Lesson content
    const { data: lesson, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_module_id', unitId)
        .eq('module_number', lessonNumber)
        .single();

    if (error || !lesson) {
        console.error('Error fetching lesson:', error);
        return null;
    }

    // 1b. Get Tasks Explicitly (Bypassing potential FK relation cache issues)
    const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('order_index', { ascending: true });

    if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
    }

    // 2. Get User Progress (Tasks)
    let completedTaskIds: Set<string> = new Set();
    if (user) {
        const { data: progress } = await supabase
            .from('user_progress')
            .select('task_id')
            .eq('user_id', user.id)
            .eq('lesson_id', lesson.id)
            .eq('is_completed', true);

        if (progress) {
            progress.forEach(p => completedTaskIds.add(p.task_id));
        }
    }

    // 3. Merge progress
    const tasksWithStatus = (tasksData || []).map((task: any) => ({
        id: task.id,
        task_text_ar: task.task_text_ar,
        order_index: task.order_index,
        is_completed: completedTaskIds.has(task.id)
    }));

    return {
        ...lesson,
        tasks: tasksWithStatus
    } as LessonDetails;
}


export async function toggleTask(taskId: string, lessonId: string, isCompleted: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: user.id,
            lesson_id: lessonId, // Renamed column
            task_id: taskId,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null
        }, { onConflict: 'user_id, task_id' });

    if (error) {
        console.error('Error toggling task:', error);
        return { error: error.message };
    }

    return { success: true };
}
