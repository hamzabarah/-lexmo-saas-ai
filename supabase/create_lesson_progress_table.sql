-- ================================================================
-- TABLE: lesson_progress
-- ================================================================
-- Tracks individual lesson progress for each user
-- Including tasks completion and overall lesson completion
-- ================================================================

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  
  -- Progress tracking
  is_started BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0, -- 0-100
  
  -- Tasks tracking
  tasks_completed JSONB DEFAULT '[]'::jsonb, -- Array of completed task indices: [0, 1, 2]
  total_tasks INTEGER DEFAULT 0,
  
  -- Time tracking
  time_spent_seconds INTEGER DEFAULT 0, -- Total time spent on this lesson
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one progress record per user per lesson
  UNIQUE(user_id, lesson_id)
);

-- ================================================================
-- INDEXES for performance
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id 
  ON public.lesson_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id 
  ON public.lesson_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed 
  ON public.lesson_progress(user_id, is_completed);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Users can only view their own progress
CREATE POLICY "Users can view their own lesson progress" 
  ON public.lesson_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can create their own lesson progress" 
  ON public.lesson_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own lesson progress" 
  ON public.lesson_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- ================================================================
-- FUNCTION: Update lesson completion percentage
-- ================================================================
CREATE OR REPLACE FUNCTION update_lesson_completion_percentage()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate completion percentage based on tasks completed
  IF NEW.total_tasks > 0 THEN
    NEW.completion_percentage := (
      (jsonb_array_length(NEW.tasks_completed)::float / NEW.total_tasks::float) * 100
    )::integer;
  END IF;
  
  -- Auto-mark as completed if all tasks are done
  IF NEW.total_tasks > 0 AND jsonb_array_length(NEW.tasks_completed) >= NEW.total_tasks THEN
    NEW.is_completed := TRUE;
    IF NEW.completed_at IS NULL THEN
      NEW.completed_at := NOW();
    END IF;
  END IF;
  
  -- Update timestamp
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- TRIGGER: Auto-update completion on task changes
-- ================================================================
CREATE TRIGGER trigger_update_lesson_completion
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_completion_percentage();

-- ================================================================
-- HELPER FUNCTIONS
-- ================================================================

-- Function to mark a lesson as started
CREATE OR REPLACE FUNCTION start_lesson(
  p_user_id UUID,
  p_lesson_id UUID,
  p_total_tasks INTEGER DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
  v_progress_id UUID;
BEGIN
  INSERT INTO public.lesson_progress (
    user_id,
    lesson_id,
    is_started,
    started_at,
    total_tasks
  )
  VALUES (
    p_user_id,
    p_lesson_id,
    TRUE,
    NOW(),
    p_total_tasks
  )
  ON CONFLICT (user_id, lesson_id) 
  DO UPDATE SET
    is_started = TRUE,
    started_at = COALESCE(lesson_progress.started_at, NOW()),
    last_accessed_at = NOW(),
    total_tasks = EXCLUDED.total_tasks
  RETURNING id INTO v_progress_id;
  
  RETURN v_progress_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark a task as completed
CREATE OR REPLACE FUNCTION complete_task(
  p_user_id UUID,
  p_lesson_id UUID,
  p_task_index INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.lesson_progress
  SET 
    tasks_completed = CASE 
      WHEN tasks_completed ? p_task_index::text THEN tasks_completed
      ELSE tasks_completed || jsonb_build_array(p_task_index)
    END,
    last_accessed_at = NOW()
  WHERE user_id = p_user_id 
    AND lesson_id = p_lesson_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if lesson is completed
CREATE OR REPLACE FUNCTION is_lesson_completed(
  p_user_id UUID,
  p_lesson_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_completed BOOLEAN;
BEGIN
  SELECT is_completed INTO v_is_completed
  FROM public.lesson_progress
  WHERE user_id = p_user_id 
    AND lesson_id = p_lesson_id;
  
  RETURN COALESCE(v_is_completed, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- VERIFICATION QUERY
-- ================================================================
-- Run this to verify the table was created successfully:
-- 
-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
--   AND table_name = 'lesson_progress'
-- ORDER BY ordinal_position;
-- ================================================================
