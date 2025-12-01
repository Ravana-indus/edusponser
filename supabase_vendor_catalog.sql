-- Vendors, Catalog, Orders schema for EduSponsor (Supabase)
-- Idempotent-ish creation; adjust as needed.

create table if not exists public.vendors (
  name text primary key,
  vendor_name text not null,
  vendor_category text,
  contact_person text,
  email text,
  phone text,
  address text,
  website text,
  business_registration text,
  tax_id text,
  business_type text,
  employee_count int,
  established_year int,
  description text,
  status text default 'active',
  verification_status text default 'pending',
  join_date date default now(),
  average_rating numeric,
  total_reviews int,
  response_time text,
  fulfillment_rate numeric,
  profile_image text,
  cover_image text,
  notes text
);

create table if not exists public.vendor_categories (
  name text primary key,
  category_name text not null,
  description text,
  is_active boolean default true,
  parent_category text
);

-- Product categories (for catalog items)
create table if not exists public.product_categories (
  name text primary key,
  category_name text not null,
  description text,
  is_active boolean default true,
  parent_category text
);

-- Ensure legacy vendor category key exists in product_categories before changing FK
insert into public.product_categories(name, category_name)
values ('VCAT-general', 'General')
on conflict (name) do nothing;

create table if not exists public.catalog_items (
  name text primary key,
  item_name text not null,
  description text,
  category text references public.product_categories(name),
  vendor text references public.vendors(name) on delete set null,
  point_price int not null,
  approximate_value_lkr numeric,
  image text,
  is_active boolean default true,
  stock_quantity int,
  created_date timestamp with time zone default now(),
  last_updated timestamp with time zone default now(),
  max_quantity_per_month int,
  weight numeric,
  dimensions text,
  warranty_period int,
  return_policy text,
  item_code text
);

-- If previously linked to vendor_categories, drop that FK before adding the new one
alter table public.catalog_items drop constraint if exists catalog_items_category_fkey;
alter table public.catalog_items
  add constraint catalog_items_category_fkey foreign key (category)
  references public.product_categories(name);

create table if not exists public.purchase_orders (
  name text primary key,
  student text references public.students(name) on delete set null,
  vendor text references public.vendors(name) on delete set null,
  total_points int not null,
  status text not null default 'pending',
  request_date date default now(),
  approved_date date,
  fulfilled_date date,
  rejection_reason text,
  qr_code text,
  notes text,
  delivery_method text check (delivery_method in ('pickup','delivery')),
  delivery_address text,
  expected_delivery_date date,
  actual_delivery_date date,
  approved_by text,
  fulfilled_by text
);

create table if not exists public.purchase_order_items (
  name text primary key,
  parent text references public.purchase_orders(name) on delete cascade,
  parenttype text,
  parentfield text,
  item text references public.catalog_items(name),
  quantity int not null,
  points_per_item int not null,
  total_points int not null
);

-- Additional vendor-related tables
create table if not exists public.vendor_documents (
  name text primary key,
  parent text references public.vendors(name) on delete cascade,
  parenttype text,
  parentfield text,
  document_type text,
  document_name text,
  file text,
  status text default 'pending',
  verification_date date,
  verified_by text,
  notes text
);

create table if not exists public.vendor_specialties (
  name text primary key,
  parent text references public.vendors(name) on delete cascade,
  parenttype text,
  parentfield text,
  specialty text
);

create table if not exists public.vendor_certifications (
  name text primary key,
  parent text references public.vendors(name) on delete cascade,
  parenttype text,
  parentfield text,
  certification_name text,
  issuing_authority text,
  issue_date date,
  expiry_date date,
  certificate_file text
);

create table if not exists public.payment_accounts (
  name text primary key,
  vendor text references public.vendors(name) on delete cascade,
  bank_name text,
  account_number text,
  account_holder text,
  branch text,
  is_primary boolean default false,
  status text default 'active',
  account_type text,
  swift_code text,
  routing_number text
);

create table if not exists public.vendor_payments (
  name text primary key,
  vendor text references public.vendors(name) on delete set null,
  payment_amount numeric not null,
  payment_date timestamp with time zone default now(),
  payment_method text,
  payment_account text references public.payment_accounts(name) on delete set null,
  reference_number text,
  status text default 'pending',
  notes text,
  processed_by text,
  processed_date timestamp with time zone
);

create table if not exists public.vendor_analytics (
  name text primary key,
  vendor text references public.vendors(name) on delete cascade,
  period text,
  start_date date,
  end_date date,
  total_orders int,
  total_revenue numeric,
  total_points_earned int,
  average_order_value numeric,
  fulfillment_rate numeric,
  average_rating numeric,
  total_reviews int,
  response_time_avg text
);

create table if not exists public.vendor_reviews (
  name text primary key,
  vendor text references public.vendors(name) on delete cascade,
  student text references public.students(name) on delete set null,
  purchase_order text references public.purchase_orders(name) on delete set null,
  rating int not null,
  review_title text,
  review_text text,
  review_date date default now(),
  is_verified boolean default false,
  status text default 'approved',
  helpful_count int default 0
);

create table if not exists public.vendor_applications (
  name text primary key,
  application_number text unique,
  business_name text,
  business_category text references public.vendor_categories(name),
  contact_person text,
  email text,
  phone text,
  address text,
  website text,
  business_registration text,
  tax_id text,
  business_type text,
  employee_count int,
  established_year int,
  description text,
  application_date date default now(),
  status text default 'pending',
  reviewed_by text,
  review_date date,
  rejection_reason text,
  notes text
);

create table if not exists public.application_documents (
  name text primary key,
  parent text references public.vendor_applications(name) on delete cascade,
  parenttype text,
  parentfield text,
  document_type text,
  document_name text,
  file text,
  upload_date date default now()
);

-- Optional: education levels tied to catalog items
create table if not exists public.education_levels (
  name text primary key,
  parent text references public.catalog_items(name) on delete cascade,
  parenttype text,
  parentfield text,
  education_level text
);

-- Basic RLS
alter table public.vendors enable row level security;
alter table public.vendor_categories enable row level security;
alter table public.product_categories enable row level security;
alter table public.catalog_items enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.vendor_documents enable row level security;
alter table public.vendor_specialties enable row level security;
alter table public.vendor_certifications enable row level security;
alter table public.payment_accounts enable row level security;
alter table public.vendor_payments enable row level security;
alter table public.vendor_analytics enable row level security;
alter table public.vendor_reviews enable row level security;
alter table public.vendor_applications enable row level security;
alter table public.application_documents enable row level security;
alter table public.education_levels enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='vendors' and policyname='vendors read'
  ) then
    create policy "vendors read" on public.vendors
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='vendors' and policyname='vendors write'
  ) then
    create policy "vendors write" on public.vendors
      for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='vendor_categories' and policyname='vendor_categories read'
  ) then
    create policy "vendor_categories read" on public.vendor_categories
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='vendor_categories' and policyname='vendor_categories write'
  ) then
    create policy "vendor_categories write" on public.vendor_categories
      for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='product_categories' and policyname='product_categories read'
  ) then
    create policy "product_categories read" on public.product_categories
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='product_categories' and policyname='product_categories write'
  ) then
    create policy "product_categories write" on public.product_categories
      for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='catalog_items' and policyname='catalog read'
  ) then
    create policy "catalog read" on public.catalog_items
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='catalog_items' and policyname='catalog write'
  ) then
    create policy "catalog write" on public.catalog_items
      for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='purchase_orders' and policyname='po read'
  ) then
    create policy "po read" on public.purchase_orders
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='purchase_orders' and policyname='po write'
  ) then
    create policy "po write" on public.purchase_orders
      for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='purchase_order_items' and policyname='poi read'
  ) then
    create policy "poi read" on public.purchase_order_items
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='purchase_order_items' and policyname='poi write'
  ) then
    create policy "poi write" on public.purchase_order_items
      for all using (true) with check (true);
  end if;

  -- New tables policies
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_documents' and policyname='vendor_documents read'
  ) then
    create policy "vendor_documents read" on public.vendor_documents for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_documents' and policyname='vendor_documents write'
  ) then
    create policy "vendor_documents write" on public.vendor_documents for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_specialties' and policyname='vendor_specialties read'
  ) then
    create policy "vendor_specialties read" on public.vendor_specialties for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_specialties' and policyname='vendor_specialties write'
  ) then
    create policy "vendor_specialties write" on public.vendor_specialties for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_certifications' and policyname='vendor_certifications read'
  ) then
    create policy "vendor_certifications read" on public.vendor_certifications for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_certifications' and policyname='vendor_certifications write'
  ) then
    create policy "vendor_certifications write" on public.vendor_certifications for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='payment_accounts' and policyname='payment_accounts read'
  ) then
    create policy "payment_accounts read" on public.payment_accounts for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='payment_accounts' and policyname='payment_accounts write'
  ) then
    create policy "payment_accounts write" on public.payment_accounts for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_payments' and policyname='vendor_payments read'
  ) then
    create policy "vendor_payments read" on public.vendor_payments for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_payments' and policyname='vendor_payments write'
  ) then
    create policy "vendor_payments write" on public.vendor_payments for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_analytics' and policyname='vendor_analytics read'
  ) then
    create policy "vendor_analytics read" on public.vendor_analytics for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_analytics' and policyname='vendor_analytics write'
  ) then
    create policy "vendor_analytics write" on public.vendor_analytics for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_reviews' and policyname='vendor_reviews read'
  ) then
    create policy "vendor_reviews read" on public.vendor_reviews for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_reviews' and policyname='vendor_reviews write'
  ) then
    create policy "vendor_reviews write" on public.vendor_reviews for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_applications' and policyname='vendor_applications read'
  ) then
    create policy "vendor_applications read" on public.vendor_applications for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='vendor_applications' and policyname='vendor_applications write'
  ) then
    create policy "vendor_applications write" on public.vendor_applications for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='application_documents' and policyname='application_documents read'
  ) then
    create policy "application_documents read" on public.application_documents for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='application_documents' and policyname='application_documents write'
  ) then
    create policy "application_documents write" on public.application_documents for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='education_levels' and policyname='education_levels read'
  ) then
    create policy "education_levels read" on public.education_levels for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='education_levels' and policyname='education_levels write'
  ) then
    create policy "education_levels write" on public.education_levels for all using (true) with check (true);
  end if;
end
$$ language plpgsql;

-- Seed minimal rows
insert into public.vendor_categories(name, category_name)
values ('VCAT-general', 'General')
on conflict (name) do nothing;

insert into public.vendors(name, vendor_name, email, status, verification_status)
values ('VENDOR-vendor', 'Demo Vendor', 'vendor@example.com', 'active', 'verified')
on conflict (name) do nothing;

insert into public.product_categories(name, category_name)
values ('PCAT-supplies', 'Supplies')
on conflict (name) do nothing;

insert into public.catalog_items(name, item_name, category, vendor, point_price, is_active)
values ('ITEM-notebook', 'Notebook', 'PCAT-supplies', 'VENDOR-vendor', 500, true)
on conflict (name) do nothing;

-- Migrate any legacy rows still pointing to vendor category key
update public.catalog_items
set category = 'PCAT-supplies'
where category = 'VCAT-general';

insert into public.purchase_orders(name, student, vendor, total_points, status, delivery_method)
values ('PO-1', 'ST-student', 'VENDOR-vendor', 500, 'pending', 'pickup')
on conflict (name) do nothing;

insert into public.purchase_order_items(name, parent, parenttype, parentfield, item, quantity, points_per_item, total_points)
values ('POI-1', 'PO-1', 'Purchase Order', 'items', 'ITEM-notebook', 1, 500, 500)
on conflict (name) do nothing;

-- Minimal payment account and payment
insert into public.payment_accounts(name, vendor, bank_name, account_number, account_holder, is_primary)
values ('ACC-1', 'VENDOR-vendor', 'Bank of Example', '1234567890', 'Demo Vendor', true)
on conflict (name) do nothing;

insert into public.vendor_payments(name, vendor, payment_amount, payment_method, payment_account, status)
values ('VPAY-1', 'VENDOR-vendor', 1000, 'bank-transfer', 'ACC-1', 'completed')
on conflict (name) do nothing;

-- Minimal vendor review
insert into public.vendor_reviews(name, vendor, student, purchase_order, rating, review_title, review_text, is_verified, status)
values ('VREV-1', 'VENDOR-vendor', 'ST-student', 'PO-1', 5, 'Great service', 'Fast and helpful', true, 'approved')
on conflict (name) do nothing;

-- Minimal vendor application and document
insert into public.vendor_applications(name, application_number, business_name, business_category, contact_person, email, status)
values ('VAPP-1', 'APP-0001', 'New Vendor LLC', 'VCAT-general', 'Alice', 'newvendor@example.com', 'pending')
on conflict (name) do nothing;

insert into public.application_documents(name, parent, parenttype, parentfield, document_type, document_name, file)
values ('ADOC-1', 'VAPP-1', 'Vendor Application', 'documents', 'business-registration', 'BR Doc', 'https://example.com/br.pdf')
on conflict (name) do nothing;
