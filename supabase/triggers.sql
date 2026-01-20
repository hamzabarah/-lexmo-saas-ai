-- Add columns if not exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ref_code TEXT UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS promo_code TEXT UNIQUE;

-- Function to generate 5-char random alphanum string
CREATE OR REPLACE FUNCTION generate_random_code(length integer) RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Enhanced handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    new_ref_code TEXT;
    new_promo_code TEXT;
    done BOOLEAN;
BEGIN
    -- Generate unique Ref Code (LEX-XXXXX)
    loop
        done := true;
        new_ref_code := 'LEX-' || generate_random_code(5);
        begin
            perform 1 from public.users where ref_code = new_ref_code;
            if found then done := false; end if;
        end;
        exit when done;
    end loop;

    -- Generate unique Promo Code (PROMO-XXXXX)
    loop
        done := true;
        new_promo_code := 'PROMO-' || generate_random_code(5);
        begin
            perform 1 from public.users where promo_code = new_promo_code;
            if found then done := false; end if;
        end;
        exit when done;
    end loop;

  INSERT INTO public.users (id, email, name, phone, country, ref_code, promo_code)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'country',
    new_ref_code,
    new_promo_code
  );
  return new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create trigger to be safe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
