-- Lock Future Content Script
-- Purpose: 
-- 1. Unlock Phases 1 & 2 (Modules 1-10) because they have content.
-- 2. Lock Phases 3 to 11 (Modules 11+) because content is not integrated yet.
-- 3. Ensure Units 1-10 are unlocked.
-- 4. Ensure Units 11+ are locked.

BEGIN;

-- 1. Update Phases
-- Unlock Phases 1 and 2
UPDATE public.phases
SET is_locked = false
WHERE phase_number <= 2;

-- Lock Phases 3 through 11
UPDATE public.phases
SET is_locked = true
WHERE phase_number >= 3;

-- 2. Update Units (Course Modules)
-- Unlock Units 1 through 10
UPDATE public.course_modules
SET is_locked = false
WHERE module_number <= 10;

-- Lock Units 11 through 21 (and any others beyond 10)
UPDATE public.course_modules
SET is_locked = true
WHERE module_number > 10;

-- Optional: Lock Lessons for locked units to ensure consistency
-- We update lessons where the parent unit is locked.
UPDATE public.lessons
SET is_locked = true
WHERE course_module_id IN (
    SELECT id FROM public.course_modules WHERE is_locked = true
);

-- Unlock Lessons for unlocked units (optional, but ensures access)
UPDATE public.lessons
SET is_locked = false
WHERE course_module_id IN (
    SELECT id FROM public.course_modules WHERE is_locked = false
);

COMMIT;
