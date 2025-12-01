-- Students, Donors, System schema for EduSponsor (complements base + vendor files)
-- Run in Supabase SQL editor. Designed to be idempotent.

-- =====================
-- Student module tables
-- =====================
create table if not exists public.student_goals (
  name text primary key,
  student text references public.students(name) on delete cascade,
  title text not null,
  description text,
  target_amount int not null default 0,
  current_amount int not null default 0,
  category text,
  target_date date,
  status text default 'active',
  is_public boolean default true,
  created_date timestamp with time zone default now(),
  updated_date timestamp with time zone default now()
);

create table if not exists public.withdrawal_requests (
  name text primary key,
  student text references public.students(name) on delete cascade,
  amount int not null,
  reason text,
  category text,
  status text default 'pending',
  request_date date default now(),
  processed_date date,
  approved_by text,
  rejection_reason text,
  bank_name text,
  account_number text,
  account_holder text,
  branch text,
  conversion_rate numeric,
  cash_amount numeric
);

create table if not exists public.withdrawal_documents (
  name text primary key,
  parent text references public.withdrawal_requests(name) on delete cascade,
  parenttype text,
  parentfield text,
  document_type text,
  document_name text,
  file text
);

create table if not exists public.investments (
  name text primary key,
  student text references public.students(name) on delete cascade,
  amount int not null,
  platform text,
  investment_type text,
  status text default 'active',
  investment_date date,
  maturity_date date,
  expected_return int,
  actual_return int,
  description text,
  transaction_hash text,
  current_value int
);

create table if not exists public.health_insurance (
  name text primary key,
  student text references public.students(name) on delete cascade,
  provider text,
  policy_number text,
  coverage_amount int,
  premium_amount int,
  start_date date,
  expiry_date date,
  status text,
  beneficiary_name text,
  beneficiary_relation text
);

create table if not exists public.coverage_details (
  name text primary key,
  parent text references public.health_insurance(name) on delete cascade,
  parenttype text,
  parentfield text,
  coverage_type text,
  coverage_limit int,
  details text
);

-- Public education updates feed
create table if not exists public.education_updates (
  name text primary key,
  student text references public.students(name) on delete cascade,
  title text not null,
  content text not null,
  type text,
  date date not null,
  is_public boolean default true,
  created_by text,
  created_at timestamp with time zone default now()
);

create table if not exists public.update_attachments (
  name text primary key,
  parent text references public.education_updates(name) on delete cascade,
  parenttype text,
  parentfield text,
  file_name text,
  file text
);

create table if not exists public.update_tags (
  name text primary key,
  parent text references public.education_updates(name) on delete cascade,
  parenttype text,
  parentfield text,
  tag text
);

-- =====================
-- Donor module tables
-- =====================
-- donors already exists in base file
create table if not exists public.sponsorships (
  name text primary key,
  donor text references public.donors(name) on delete cascade,
  student text references public.students(name) on delete cascade,
  start_date date default now(),
  end_date date,
  status text default 'active',
  monthly_amount numeric default 0,
  monthly_points int default 0,
  student_info_hidden boolean default false,
  opt_out_requested_date date,
  opt_out_effective_date date,
  opt_out_reason text
);

create table if not exists public.payments (
  name text primary key,
  donor text references public.donors(name) on delete set null,
  student text references public.students(name) on delete set null,
  sponsorship text references public.sponsorships(name) on delete set null,
  date date default now(),
  amount numeric not null,
  points int default 0,
  status text default 'completed',
  payment_method text,
  transaction_id text,
  processed_date timestamp with time zone,
  failure_reason text
);

-- =====================
-- System tables
-- =====================
create table if not exists public.schools (
  name text primary key,
  school_name text not null,
  school_type text,
  category text,
  address text,
  district text,
  province text,
  phone text,
  email text,
  website text,
  principal_name text,
  principal_phone text,
  principal_email text,
  established_year int,
  student_count int,
  teacher_count int,
  status text default 'active',
  accreditation text,
  facilities text,
  special_programs text,
  contact_person text,
  contact_person_designation text
);

create table if not exists public.districts (
  name text primary key,
  district_name text not null,
  province text,
  code text,
  is_active boolean default true
);

create table if not exists public.provinces (
  name text primary key,
  province_name text not null,
  code text,
  is_active boolean default true
);

create table if not exists public.system_settings (
  name text primary key,
  points_to_lkr_rate numeric default 1,
  max_products_per_vendor int default 1000,
  max_orders_per_day int default 1000,
  auto_approve_threshold int default 0,
  vendor_approval_required boolean default false,
  email_notifications_enabled boolean default true,
  sms_notifications_enabled boolean default false,
  default_fulfillment_days int default 7,
  max_upload_size int default 5242880,
  supported_file_types text,
  monthly_points_per_dollar int default 0,
  min_withdrawal_amount int default 0,
  max_withdrawal_amount int default 1000000,
  withdrawal_fee_percentage numeric default 0,
  investment_min_amount int default 0,
  insurance_min_coverage int default 0,
  student_approval_required boolean default false,
  donor_verification_required boolean default false
);

create table if not exists public.platform_stats (
  name text primary key,
  total_students int default 0,
  approved_students int default 0,
  pending_students int default 0,
  total_donors int default 0,
  active_donors int default 0,
  total_donated numeric default 0,
  total_points int default 0,
  monthly_revenue numeric default 0,
  active_sponsorships int default 0,
  average_gpa numeric,
  student_retention numeric,
  donor_retention numeric,
  total_vendors int default 0,
  active_vendors int default 0,
  total_orders int default 0,
  fulfilled_orders int default 0,
  period text default 'monthly',
  start_date date default now(),
  end_date date default now()
);

create table if not exists public.communication_logs (
  name text primary key,
  from_user text,
  to_user text,
  from_role text,
  to_role text,
  subject text,
  message text,
  message_type text,
  status text default 'sent',
  sent_date timestamp with time zone default now(),
  read_date timestamp with time zone,
  parent_message text,
  attachments text
);

-- ==============
-- RLS + Policies
-- ==============
alter table public.student_goals enable row level security;
alter table public.withdrawal_requests enable row level security;
alter table public.withdrawal_documents enable row level security;
alter table public.investments enable row level security;
alter table public.health_insurance enable row level security;
alter table public.coverage_details enable row level security;
alter table public.education_updates enable row level security;
alter table public.update_attachments enable row level security;
alter table public.update_tags enable row level security;

alter table public.sponsorships enable row level security;
alter table public.payments enable row level security;

alter table public.schools enable row level security;
alter table public.districts enable row level security;
alter table public.provinces enable row level security;
alter table public.system_settings enable row level security;
alter table public.platform_stats enable row level security;
alter table public.communication_logs enable row level security;

do $$
begin
  -- helper macro replacement by repetition
  perform 1;

  -- Students
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='student_goals' and policyname='student_goals read') then
    create policy "student_goals read" on public.student_goals for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='student_goals' and policyname='student_goals write') then
    create policy "student_goals write" on public.student_goals for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='withdrawal_requests' and policyname='withdrawal_requests read') then
    create policy "withdrawal_requests read" on public.withdrawal_requests for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='withdrawal_requests' and policyname='withdrawal_requests write') then
    create policy "withdrawal_requests write" on public.withdrawal_requests for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='withdrawal_documents' and policyname='withdrawal_documents read') then
    create policy "withdrawal_documents read" on public.withdrawal_documents for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='withdrawal_documents' and policyname='withdrawal_documents write') then
    create policy "withdrawal_documents write" on public.withdrawal_documents for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='investments' and policyname='investments read') then
    create policy "investments read" on public.investments for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='investments' and policyname='investments write') then
    create policy "investments write" on public.investments for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='health_insurance' and policyname='health_insurance read') then
    create policy "health_insurance read" on public.health_insurance for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='health_insurance' and policyname='health_insurance write') then
    create policy "health_insurance write" on public.health_insurance for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='coverage_details' and policyname='coverage_details read') then
    create policy "coverage_details read" on public.coverage_details for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='coverage_details' and policyname='coverage_details write') then
    create policy "coverage_details write" on public.coverage_details for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='education_updates' and policyname='education_updates read') then
    create policy "education_updates read" on public.education_updates for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='education_updates' and policyname='education_updates write') then
    create policy "education_updates write" on public.education_updates for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='update_attachments' and policyname='update_attachments read') then
    create policy "update_attachments read" on public.update_attachments for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='update_attachments' and policyname='update_attachments write') then
    create policy "update_attachments write" on public.update_attachments for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='update_tags' and policyname='update_tags read') then
    create policy "update_tags read" on public.update_tags for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='update_tags' and policyname='update_tags write') then
    create policy "update_tags write" on public.update_tags for all using (true) with check (true);
  end if;

  -- Donors
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='sponsorships' and policyname='sponsorships read') then
    create policy "sponsorships read" on public.sponsorships for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='sponsorships' and policyname='sponsorships write') then
    create policy "sponsorships write" on public.sponsorships for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='payments' and policyname='payments read') then
    create policy "payments read" on public.payments for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='payments' and policyname='payments write') then
    create policy "payments write" on public.payments for all using (true) with check (true);
  end if;

  -- System
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='schools' and policyname='schools read') then
    create policy "schools read" on public.schools for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='schools' and policyname='schools write') then
    create policy "schools write" on public.schools for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='districts' and policyname='districts read') then
    create policy "districts read" on public.districts for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='districts' and policyname='districts write') then
    create policy "districts write" on public.districts for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='provinces' and policyname='provinces read') then
    create policy "provinces read" on public.provinces for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='provinces' and policyname='provinces write') then
    create policy "provinces write" on public.provinces for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='system_settings' and policyname='system_settings read') then
    create policy "system_settings read" on public.system_settings for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='system_settings' and policyname='system_settings write') then
    create policy "system_settings write" on public.system_settings for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='platform_stats' and policyname='platform_stats read') then
    create policy "platform_stats read" on public.platform_stats for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='platform_stats' and policyname='platform_stats write') then
    create policy "platform_stats write" on public.platform_stats for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='communication_logs' and policyname='communication_logs read') then
    create policy "communication_logs read" on public.communication_logs for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='communication_logs' and policyname='communication_logs write') then
    create policy "communication_logs write" on public.communication_logs for all using (true) with check (true);
  end if;
end
$$ language plpgsql;

-- =====
-- Seed
-- =====
-- Schools/geo
insert into public.provinces(name, province_name, code, is_active) values ('PROV-central','Central','CEN',true) on conflict (name) do nothing;
insert into public.districts(name, district_name, province, code, is_active) values ('DIST-springfield','Springfield','PROV-central','SPR',true) on conflict (name) do nothing;
insert into public.schools(name, school_name, school_type, category, address, district, province, phone, status)
values ('SCH-springfield-high','Springfield High','government','secondary','742 Evergreen','DIST-springfield','PROV-central','+1-555-0100','active') on conflict (name) do nothing;

-- Student goals and updates
insert into public.student_goals(name, student, title, description, target_amount, current_amount, category, target_date, status)
values ('GOAL-1','ST-student','Buy textbooks','Need books for semester',5000,1000,'education',current_date + interval '30 days','active') on conflict (name) do nothing;

insert into public.education_updates(name, student, title, content, type, date, is_public)
values ('EDU-1','ST-student','Won science fair','First place in regional fair','achievement',current_date,true) on conflict (name) do nothing;

-- Insurance/Investments/Withdrawals
insert into public.health_insurance(name, student, provider, policy_number, coverage_amount, premium_amount, start_date, expiry_date, status)
values ('INS-1','ST-student','Acme Health','HLT-123',100000,1000,current_date,current_date + interval '1 year','active') on conflict (name) do nothing;

insert into public.coverage_details(name, parent, parenttype, parentfield, coverage_type, coverage_limit)
values ('COV-1','INS-1','Health Insurance','coverage','hospitalization',50000) on conflict (name) do nothing;

insert into public.investments(name, student, amount, platform, investment_type, status, investment_date, expected_return, description)
values ('INV-1','ST-student',2000,'DemoInvest','bonds','active',current_date,100,'Long term') on conflict (name) do nothing;

insert into public.withdrawal_requests(name, student, amount, reason, category, status, request_date)
values ('WDR-1','ST-student',1000,'Study materials','education','pending',current_date) on conflict (name) do nothing;

insert into public.withdrawal_documents(name, parent, parenttype, parentfield, document_type, document_name, file)
values ('WDOC-1','WDR-1','Withdrawal Request','documents','id','ID Scan','https://example.com/id.pdf') on conflict (name) do nothing;

-- Sponsorship + payment
insert into public.sponsorships(name, donor, student, status, monthly_amount, monthly_points)
values ('SPN-1','DONOR-donor','ST-student','active',50,50000) on conflict (name) do nothing;

insert into public.payments(name, donor, student, sponsorship, amount, points, status, payment_method, transaction_id)
values ('PAY-1','DONOR-donor','ST-student','SPN-1',50,50000,'completed','card','TX-123') on conflict (name) do nothing;

-- System settings + platform stats
insert into public.system_settings(name, points_to_lkr_rate, monthly_points_per_dollar)
values ('System Settings', 2, 1000)
on conflict (name) do nothing;

insert into public.platform_stats(name, total_students, total_donors, total_vendors, total_orders, period, start_date, end_date)
values ('STATS-2025-08', 1, 1, 1, 1, 'monthly', date_trunc('month', current_date), (date_trunc('month', current_date) + interval '1 month' - interval '1 day'))
on conflict (name) do nothing;

-- Communication log example
insert into public.communication_logs(name, from_user, to_user, from_role, to_role, subject, message, message_type)
values ('COM-1','student@example.com','donor@example.com','student','donor','Thanks','Thank you for the support','in-app') on conflict (name) do nothing;
