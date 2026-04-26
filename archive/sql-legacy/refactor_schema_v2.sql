-- ==============================================================================
-- MIGRATION V2: HIERARCHICAL STRUCTURE (Phase -> CourseModule -> Lesson)
-- ==============================================================================

-- 1. RENAME existing 'modules' table to 'lessons'
--    because it contains the actual content and tasks are linked to it.
ALTER TABLE public.modules RENAME TO lessons;

-- Rename sequences or constraints if necessary (Supabase usually handles basic renames)
-- But we need to update the foreign key in 'tasks' table?
-- Postgres usually keeps the link pointing to the renamed table. 'tasks.module_id' -> 'lessons.id'
-- We should rename the column in tasks for clarity.
ALTER TABLE public.tasks RENAME COLUMN module_id TO lesson_id;
ALTER TABLE public.user_progress RENAME COLUMN module_id TO lesson_id;

-- 2. CREATE new 'course_modules' table (The "Units" / "We7dat")
CREATE TABLE public.course_modules (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    phase_id uuid REFERENCES public.phases(id) ON DELETE CASCADE NOT NULL,
    module_number int NOT NULL,
    badge text,
    title_ar text NOT NULL,
    title_en text,
    emoji text,
    profit_scenario_ar text, -- Added for Phase 2 requirement
    expected_result_ar text, -- Moved from lessons/modules if it belongs to the Unit?
                             -- User said "Unit has Scenario & Result".
    is_locked boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for new table
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course Modules are viewable by everyone" ON public.course_modules FOR SELECT USING (true);


-- 3. LINK 'lessons' to 'course_modules'
ALTER TABLE public.lessons ADD COLUMN course_module_id uuid REFERENCES public.course_modules(id) ON DELETE CASCADE;


-- 4. DATA MIGRATION FOR PHASE 1
--    Phase 1 "Modules" (1-36) are now "Lessons".
--    They need a parent Unit.
DO $$
DECLARE
    p1_id uuid;
    new_unit_id uuid;
BEGIN
    SELECT id INTO p1_id FROM public.phases WHERE phase_number = 1;
    
    -- Create "General Unit" for Phase 1
    INSERT INTO public.course_modules (phase_id, module_number, badge, title_ar, title_en, emoji, is_locked)
    VALUES (p1_id, 1, 'AMB', 'برنامج السفير', 'Ambassador Program', '🤝', false)
    RETURNING id INTO new_unit_id;

    -- Link existing Phase 1 lessons to this Unit
    UPDATE public.lessons
    SET course_module_id = new_unit_id
    WHERE phase_id = p1_id;
END $$;


-- 5. CLEANUP / ADJUSTMENTS
--    Phase 2 data (if any exists from previous attempt) should be re-inserted cleanly later.
--    We can delete orphan lessons (Phase 2 attempts) that don't have a course_module_id yet?
--    Or just leave them null and fix with next script.

DO $$
BEGIN
    -- Fix 'user_phase_progress' logic later (count completed lessons vs modules)
    -- For now, schema is ready.
END $$;
