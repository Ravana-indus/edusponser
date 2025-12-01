-- Security & Audit schema for EduSponsor (Supabase)
-- Creates user_roles, audit_logs, auditing triggers, and seeds role definitions.
-- Run in Supabase SQL editor. Idempotent.

-- =====================
-- User roles (definition-level)
-- =====================
create table if not exists public.user_roles (
  name text primary key,
  role_name text not null,
  description text,
  role_type text default 'system',
  is_active boolean default true,
  permissions jsonb default '{}'::jsonb
);

-- =====================
-- Audit logs
-- =====================
create table if not exists public.audit_logs (
  name text primary key,
  "user" text,
  user_role text,
  action text not null, -- INSERT/UPDATE/DELETE
  doctype text not null,
  docname text,
  old_value text,
  new_value text,
  timestamp timestamp with time zone default now(),
  ip_address text,
  user_agent text,
  status text default 'success'
);

-- RLS enablement
alter table public.user_roles enable row level security;
alter table public.audit_logs enable row level security;

-- Policies (open read/write, tighten as needed)
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_roles' and policyname='user_roles read') then
    create policy "user_roles read" on public.user_roles for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_roles' and policyname='user_roles write') then
    create policy "user_roles write" on public.user_roles for all using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='audit_logs' and policyname='audit_logs read') then
    create policy "audit_logs read" on public.audit_logs for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='audit_logs' and policyname='audit_logs write') then
    create policy "audit_logs write" on public.audit_logs for all using (true) with check (true);
  end if;
end
$$ language plpgsql;

-- =====================
-- Audit trigger function
-- =====================
create or replace function public.log_audit_change()
returns trigger language plpgsql as $$
begin
  insert into public.audit_logs(
    name, "user", user_role, action, doctype, docname, old_value, new_value, status
  ) values (
    'AUD-' || floor(extract(epoch from now())*1000)::text,
    coalesce(nullif(auth.uid()::text, ''), 'anonymous'),
    null,
    TG_OP,
    TG_TABLE_NAME,
    coalesce((case when TG_OP in ('INSERT','UPDATE') then NEW.name else OLD.name end), null),
    case when TG_OP in ('UPDATE','DELETE') then to_jsonb(OLD)::text else null end,
    case when TG_OP in ('INSERT','UPDATE') then to_jsonb(NEW)::text else null end,
    'success'
  );
  if TG_OP = 'DELETE' then
    return OLD;
  end if;
  return NEW;
end;
$$;

-- =====================
-- Attach triggers to key tables
-- =====================
-- Helper: attach if not exists by dropping same-named trigger first (safe)
-- Students
drop trigger if exists trg_audit_students on public.students;
create trigger trg_audit_students
  after insert or update or delete on public.students
  for each row execute function public.log_audit_change();

-- Donors
drop trigger if exists trg_audit_donors on public.donors;
create trigger trg_audit_donors
  after insert or update or delete on public.donors
  for each row execute function public.log_audit_change();

-- Orders
drop trigger if exists trg_audit_purchase_orders on public.purchase_orders;
create trigger trg_audit_purchase_orders
  after insert or update or delete on public.purchase_orders
  for each row execute function public.log_audit_change();

-- Payments
drop trigger if exists trg_audit_payments on public.payments;
create trigger trg_audit_payments
  after insert or update or delete on public.payments
  for each row execute function public.log_audit_change();

-- Sponsorships
drop trigger if exists trg_audit_sponsorships on public.sponsorships;
create trigger trg_audit_sponsorships
  after insert or update or delete on public.sponsorships
  for each row execute function public.log_audit_change();

-- Catalog items
drop trigger if exists trg_audit_catalog_items on public.catalog_items;
create trigger trg_audit_catalog_items
  after insert or update or delete on public.catalog_items
  for each row execute function public.log_audit_change();

-- =====================
-- Seeds: role definitions
-- =====================
insert into public.user_roles(name, role_name, description, role_type, is_active, permissions) values
  ('ROLE-admin','Admin','Administrator','system',true,'{}'::jsonb),
  ('ROLE-student','Student','Student user','system',true,'{}'::jsonb),
  ('ROLE-donor','Donor','Donor user','system',true,'{}'::jsonb),
  ('ROLE-vendor','Vendor','Vendor user','system',true,'{}'::jsonb)
on conflict (name) do nothing;

-- Index for audit logs
create index if not exists idx_audit_logs_time on public.audit_logs(timestamp desc);

Generate All pending Supabase schema for vendors, catalog, and purchase orders to power those pages end-to-end, and seed minimal rows.