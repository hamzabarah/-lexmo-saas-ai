-- Fix RLS Policies for Tasks Table
-- The application might be blocked from reading tasks if RLS is enabled and no policy exists.

-- 1. Enable RLS (just in case)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tasks;
DROP POLICY IF EXISTS "Public tasks are viewable by everyone" ON public.tasks;

-- 3. Create permissive Select policy
-- Allows any user (anon or authenticated) to read tasks.
CREATE POLICY "Public tasks are viewable by everyone" 
ON public.tasks FOR SELECT 
USING (true);

-- 4. Verify other tables just in case
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;
CREATE POLICY "Lessons are viewable by everyone" ON public.lessons FOR SELECT USING (true);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Units are viewable by everyone" ON public.course_modules;
CREATE POLICY "Units are viewable by everyone" ON public.course_modules FOR SELECT USING (true);
