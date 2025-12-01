-- RPCs and Indexes for EduSponsor Supabase
-- Run in SQL editor. Idempotent where possible.

-- =====================
-- Utility RPCs
-- =====================

-- System health: basic counts
create or replace function public.get_system_health()
returns json language sql stable as $$
  select json_build_object(
    'time', now(),
    'students', (select count(*) from public.students),
    'donors', (select count(*) from public.donors),
    'vendors', (select count(*) from public.vendors),
    'orders', (select count(*) from public.purchase_orders),
    'payments', (select count(*) from public.payments)
  );
$$;

-- Generate or compute platform stats for current month
create or replace function public.generate_platform_stats()
returns public.platform_stats language plpgsql as $$
declare
  key text := 'STATS-' || to_char(current_date, 'YYYY-MM');
  rec public.platform_stats;
begin
  insert into public.platform_stats as ps(
    name, total_students, approved_students, pending_students,
    total_donors, active_donors, total_donated, total_points,
    monthly_revenue, active_sponsorships, total_vendors, total_orders,
    fulfilled_orders, period, start_date, end_date
  )
  values (
    key,
    (select count(*) from public.students),
    (select count(*) from public.students where status='approved'),
    (select count(*) from public.students where status='pending'),
    (select count(*) from public.donors),
    (select count(*) from public.donors where status='active'),
    (select coalesce(sum(amount),0) from public.payments where status='completed' and date >= date_trunc('month', current_date)),
    (select coalesce(sum(points),0) from public.payments where status='completed' and date >= date_trunc('month', current_date)),
    (select coalesce(sum(amount),0) from public.payments where status='completed' and date >= date_trunc('month', current_date)),
    (select count(*) from public.sponsorships where status='active'),
    (select count(*) from public.vendors),
    (select count(*) from public.purchase_orders),
    (select count(*) from public.purchase_orders where status='fulfilled'),
    'monthly',
    date_trunc('month', current_date),
    (date_trunc('month', current_date) + interval '1 month' - interval '1 day')
  )
  on conflict (name) do update set
    total_students = excluded.total_students,
    approved_students = excluded.approved_students,
    pending_students = excluded.pending_students,
    total_donors = excluded.total_donors,
    active_donors = excluded.active_donors,
    total_donated = excluded.total_donated,
    total_points = excluded.total_points,
    monthly_revenue = excluded.monthly_revenue,
    active_sponsorships = excluded.active_sponsorships,
    total_vendors = excluded.total_vendors,
    total_orders = excluded.total_orders,
    fulfilled_orders = excluded.fulfilled_orders,
    start_date = excluded.start_date,
    end_date = excluded.end_date
  returning * into rec;
  return rec;
end;
$$;

-- Update donor aggregate stats and return donor row
create or replace function public.update_donor_stats(donor text)
returns public.donors language plpgsql as $$
declare
  rec public.donors;
  total_donated numeric;
  total_points int;
begin
  select coalesce(sum(amount),0), coalesce(sum(points),0)
    into total_donated, total_points
  from public.payments where public.payments.donor = donor and status='completed';

  update public.donors d
  set total_donated = total_donated,
      total_points = total_points
  where d.name = donor
  returning * into rec;

  return rec;
end;
$$;

-- Server info stub
create or replace function public.get_server_info()
returns json language sql stable as $$
  select json_build_object('version','1.0.0','name','EduSponsor Supabase');
$$;

-- System logs: filter communication_logs
create or replace function public.get_system_logs(
  limit_count int default 100,
  offset_count int default 0,
  user_role text default null,
  action text default null,
  date_from date default null,
  date_to date default null
)
returns setof public.communication_logs language plpgsql as $$
begin
  return query
  select * from public.communication_logs cl
  where (user_role is null or cl.from_role = user_role or cl.to_role = user_role)
    and (action is null or cl.status = action or cl.message_type = action)
    and (date_from is null or cl.sent_date::date >= date_from)
    and (date_to is null or cl.sent_date::date <= date_to)
  order by cl.sent_date desc
  offset coalesce(offset_count,0)
  limit coalesce(limit_count,100);
end;
$$;

-- Generic get_list wrapper used by UI for DocType/DocField queries
create or replace function public.get_list(
  doctype text,
  fields jsonb default '[]'::jsonb,
  filters jsonb default '{}'::jsonb,
  order_by text default null,
  limit_count int default 500,
  start int default 0
)
returns setof jsonb language plpgsql stable as $$
begin
  if doctype = 'DocType' then
    return query
    select jsonb_build_object('name', t.table_name)
    from information_schema.tables t
    where t.table_schema = 'public'
    order by coalesce(nullif(order_by,''), 'name')
    offset start limit limit_count;
  elsif doctype = 'DocField' then
    -- Expect filters -> parent = table name
    return query
    select jsonb_build_object(
      'fieldname', c.column_name,
      'fieldtype', c.data_type,
      'label', c.column_name,
      'options', null,
      'reqd', case when c.is_nullable = 'NO' then true else false end
    )
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = coalesce(filters->>'parent','')
    order by c.ordinal_position
    offset start limit limit_count;
  else
    -- Default empty
    return;
  end if;
end;
$$;

-- =====================
-- Helpful indexes
-- =====================
create index if not exists idx_students_status on public.students(status);
create index if not exists idx_students_school on public.students(school);
create index if not exists idx_donors_status on public.donors(status);
create index if not exists idx_notifications_recipient_status on public.notifications(recipient, status);
create index if not exists idx_points_student_date on public.points_transactions(student, date desc);
create index if not exists idx_orders_vendor_status on public.purchase_orders(vendor, status);
create index if not exists idx_orders_student_status on public.purchase_orders(student, status);
create index if not exists idx_catalog_vendor_active on public.catalog_items(vendor, is_active);
create index if not exists idx_catalog_category_active on public.catalog_items(category, is_active);
create index if not exists idx_vendor_reviews_vendor on public.vendor_reviews(vendor);
create index if not exists idx_vendor_payments_vendor on public.vendor_payments(vendor);
