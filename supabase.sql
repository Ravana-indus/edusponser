-- Supabase SQL bootstrap for EduSponsor
-- Run this in Supabase SQL editor

-- Auth-linked profile table (1-1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  email text,
  first_name text,
  last_name text,
  roles text[] default '{}',
  user_image text,
  created_at timestamp with time zone default now()
);

-- Basic entities (adjust as needed)
create table if not exists public.students (
  name text primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  age int,
  education_level text not null,
  school text not null,
  status text not null default 'pending',
  total_points int default 0,
  available_points int default 0,
  invested_points int default 0,
  profile_image text,
  district text,
  province text,
  join_date date default now(),
  last_updated timestamp with time zone default now()
);

create table if not exists public.donors (
  name text primary key,
  first_name text,
  last_name text,
  email text,
  phone text,
  occupation text,
  annual_income text,
  status text default 'active',
  total_donated numeric default 0,
  total_points int default 0,
  join_date date default now(),
  profile_image text
);

create table if not exists public.notifications (
  name text primary key default concat('NTF-', floor(extract(epoch from now())*1000)::text),
  recipient_type text not null,
  recipient text not null,
  title text not null,
  message text not null,
  type text default 'info',
  category text default 'system',
  status text default 'unread',
  created_date timestamp with time zone default now(),
  read_date timestamp with time zone
);

create table if not exists public.student_updates (
  name text primary key default concat('UPD-', floor(extract(epoch from now())*1000)::text),
  student text not null references public.students(name) on delete cascade,
  title text not null,
  content text not null,
  type text not null,
  date date not null,
  is_public boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists public.points_transactions (
  name text primary key default concat('PT-', floor(extract(epoch from now())*1000)::text),
  student text not null references public.students(name) on delete cascade,
  type text not null,
  amount int not null,
  description text,
  date timestamp with time zone default now(),
  category text,
  balance int
);

-- RPCs
create or replace function public.allocate_points(student text, amount int, description text)
returns json language plpgsql as $$
begin
  update public.students set available_points = coalesce(available_points,0) + amount,
    total_points = coalesce(total_points,0) + amount,
    last_updated = now()
  where name = allocate_points.student;

  insert into public.points_transactions(student, type, amount, description, category, balance)
  select student, 'earned', amount, description, 'allocation', s.available_points
  from public.students s
  where s.name = allocate_points.student;

  return json_build_object('ok', true);
end;
$$;

create or replace function public.deduct_points(student text, amount int, description text)
returns json language plpgsql as $$
begin
  update public.students set available_points = greatest(coalesce(available_points,0) - amount, 0),
    last_updated = now()
  where name = deduct_points.student;

  insert into public.points_transactions(student, type, amount, description, category, balance)
  select student, 'spent', amount, description, 'deduction', s.available_points
  from public.students s
  where s.name = deduct_points.student;

  return json_build_object('ok', true);
end;
$$;

-- Storage
-- Create a public bucket named 'uploads' in Storage UI, or via:
-- select storage.create_bucket('uploads', true, 'public');

-- Policies (simplified; tighten for production)
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.donors enable row level security;
alter table public.notifications enable row level security;
alter table public.student_updates enable row level security;
alter table public.points_transactions enable row level security;

-- Basic read access for authenticated
create policy "profiles read own" on public.profiles for select using (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

create policy "students read" on public.students for select using (true);
create policy "students write" on public.students for all using (true) with check (true);

create policy "donors read" on public.donors for select using (true);
create policy "donors write" on public.donors for all using (true) with check (true);

create policy "notifications read own" on public.notifications for select using (recipient = coalesce((select username from public.profiles where id = auth.uid()), ''));
create policy "notifications write" on public.notifications for all using (true) with check (true);

create policy "student_updates read public" on public.student_updates for select using (is_public = true);
create policy "student_updates write" on public.student_updates for all using (true) with check (true);

create policy "points read" on public.points_transactions for select using (true);
create policy "points write" on public.points_transactions for all using (true) with check (true);
