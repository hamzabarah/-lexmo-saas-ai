-- 1. Create a robust function that doesn't fail on duplicate keys
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, country, created_at)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', 'Member'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'country',
    now()
  )
  ON CONFLICT (id) DO NOTHING; -- Key fix: If row exists, do nothing (no error)
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Ensure public.users exists and has correct permissions
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

-- Allow admins to read all
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.users;
CREATE POLICY "Admin can view all profiles" ON public.users FOR SELECT USING (
  auth.jwt() ->> 'email' = 'academyfrance75@gmail.com'
);
