-- USERS Table (extends auth.users)
-- Stores public user profile data
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  phone text,
  country text,
  level text default 'Mubtadi', -- Mubtadi, Mutakaddim, Nokhba
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Policies for users
create policy "Users can view their own profile" 
  on public.users for select 
  using ( auth.uid() = id );

create policy "Users can update their own profile" 
  on public.users for update 
  using ( auth.uid() = id );

-- PROGRESS Table
-- Tracks user progress through phases and modules
create table if not exists public.progress (
  user_id uuid references public.users(id) on delete cascade not null,
  module_id text not null, -- e.g., '1', '2', 'vip-01'
  phase_id integer,
  tasks_completed text[], -- Array of completed task IDs
  is_completed boolean default false,
  completed_at timestamptz,
  last_accessed timestamptz default now(),
  primary key (user_id, module_id)
);

alter table public.progress enable row level security;

create policy "Users can view their own progress" 
  on public.progress for select 
  using ( auth.uid() = user_id );

create policy "Users can update their own progress" 
  on public.progress for all 
  using ( auth.uid() = user_id );

-- AFFILIATES Table
-- Stores affiliate program data for users
create table if not exists public.affiliates (
  user_id uuid references public.users(id) on delete cascade not null primary key,
  ref_code text unique not null,
  earnings decimal(10, 2) default 0.00,
  sales_count integer default 0,
  clicks_count integer default 0,
  created_at timestamptz default now()
);

alter table public.affiliates enable row level security;

create policy "Users can view their own affiliate data" 
  on public.affiliates for select 
  using ( auth.uid() = user_id );

-- COMMISSIONS Table
-- Detailed log of affiliate commissions
create table if not exists public.commissions (
  id uuid default gen_random_uuid() primary key,
  affiliate_id uuid references public.affiliates(user_id) on delete cascade not null,
  sale_amount decimal(10, 2) not null,
  commission_amount decimal(10, 2) not null,
  status text default 'pending', -- pending, paid, cancelled
  created_at timestamptz default now()
);

alter table public.commissions enable row level security;

create policy "Users can view their own commissions" 
  on public.commissions for select 
  using ( auth.uid() = affiliate_id );

-- BOOKINGS Table
-- Stores coaching session bookings
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  module_id text, -- Which authentication module this is for
  booking_date timestamptz not null,
  status text default 'scheduled', -- scheduled, completed, cancelled
  created_at timestamptz default now()
);

alter table public.bookings enable row level security;

create policy "Users can view their own bookings" 
  on public.bookings for select 
  using ( auth.uid() = user_id );

-- FUNCTION to handle new user signup trigger
-- Automatically inserts a row into public.users when a new auth.user is created
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- TRIGGER for new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
