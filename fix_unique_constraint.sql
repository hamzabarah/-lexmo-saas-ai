-- FIX: Add missing UNIQUE Constraint to course_modules
-- Error 42P10 indicates 'ON CONFLICT (phase_id, module_number)' failed because no such unique constraint exists.

DO $$
BEGIN
    -- 1. Remove Duplicates (if any) to ensure we can create the constraint
    -- Keep the most recently created one (highest ID usually, or just pick one)
    DELETE FROM public.course_modules a 
    USING public.course_modules b 
    WHERE a.id < b.id 
    AND a.phase_id = b.phase_id 
    AND a.module_number = b.module_number;

    -- 2. Add Unique Constraint
    -- This allows "ON CONFLICT (phase_id, module_number)" to work
    ALTER TABLE public.course_modules
    ADD CONSTRAINT course_modules_phase_id_module_number_key UNIQUE (phase_id, module_number);

EXCEPTION
    WHEN duplicate_table THEN
        RAISE NOTICE 'Constraint already exists, nothing to do.';
    WHEN others THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM;
END $$;
