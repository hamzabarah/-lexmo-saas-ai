-- 1. Ensure Table Exists with Forgiving Schema
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  country TEXT,
  ref_code TEXT,
  promo_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Make sure Policies exist (Idempotent)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
    END IF;
END
$$;

-- 3. Robust Trigger Function (Simpler & Safer)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert with full data and generated codes
  INSERT INTO public.users (id, email, name, phone, country, ref_code, promo_code)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', 'Member'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'country',
    -- Simple unique-ish code generation using built-in functions to avoid "function not found" errors
    'LEX-' || UPPER(SUBSTRING(md5(random()::text || clock_timestamp()::text) from 1 for 5)),
    'PROMO-' || UPPER(SUBSTRING(md5(random()::text || clock_timestamp()::text) from 6 for 5))
  );
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback: If anything fails (e.g. metadata missing, collision), just insert ID and Email
    -- giving the user access is priority #1.
    BEGIN
        INSERT INTO public.users (id, email, name) 
        VALUES (new.id, new.email, 'Member (Rescue)');
    EXCEPTION WHEN OTHERS THEN
        -- If even that fails, do nothing (Auth User is still created, but profile is missing)
        -- The app will just show empty profile but login will work.
        RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    END;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-bind Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
