-- Order & sponsorship workflow RPCs and vendor stats
-- Run in Supabase SQL editor. Idempotent functions (create or replace).

-- Approve purchase order and set approved_by/date
create or replace function public.approve_purchase_order(po_name text, p_approved_by text default null)
returns public.purchase_orders language plpgsql as $$
declare rec public.purchase_orders;
begin
  update public.purchase_orders
  set status = 'approved',
      approved_date = current_date,
      approved_by = p_approved_by
  where name = po_name
  returning * into rec;
  return rec;
end;
$$;

-- Reject purchase order with reason
create or replace function public.reject_purchase_order(po_name text, reason text)
returns public.purchase_orders language plpgsql as $$
declare rec public.purchase_orders;
begin
  update public.purchase_orders
  set status = 'rejected',
      rejection_reason = reason
  where name = po_name
  returning * into rec;
  return rec;
end;
$$;

-- Fulfill purchase order and set fulfilled_by/date
create or replace function public.fulfill_purchase_order(po_name text, p_fulfilled_by text default null)
returns public.purchase_orders language plpgsql as $$
declare rec public.purchase_orders;
begin
  update public.purchase_orders
  set status = 'fulfilled',
      fulfilled_date = current_date,
      fulfilled_by = p_fulfilled_by
  where name = po_name
  returning * into rec;
  return rec;
end;
$$;

-- Cancel purchase order
create or replace function public.cancel_purchase_order(po_name text)
returns public.purchase_orders language plpgsql as $$
declare rec public.purchase_orders;
begin
  update public.purchase_orders
  set status = 'cancelled'
  where name = po_name
  returning * into rec;
  return rec;
end;
$$;

-- Create sponsorship helper
create or replace function public.create_sponsorship(
  donor_name text,
  student_name text,
  monthly_amount numeric default 0,
  monthly_points int default 0
)
returns public.sponsorships language plpgsql as $$
declare sp public.sponsorships;
begin
  insert into public.sponsorships(name, donor, student, status, monthly_amount, monthly_points, start_date)
  values (
    'SPN-' || floor(extract(epoch from now())*1000)::text,
    donor_name,
    student_name,
    'active',
    monthly_amount,
    monthly_points,
    current_date
  ) returning * into sp;
  return sp;
end;
$$;

-- Sponsorship opt-out request
create or replace function public.request_opt_out(sponsorship_name text, reason text)
returns public.sponsorships language plpgsql as $$
declare sp public.sponsorships;
begin
  update public.sponsorships
  set status = 'opt-out-pending',
      opt_out_requested_date = current_date,
      opt_out_reason = reason
  where name = sponsorship_name
  returning * into sp;
  return sp;
end;
$$;

-- Pause/resume sponsorship
create or replace function public.pause_sponsorship(sponsorship_name text)
returns public.sponsorships language plpgsql as $$
declare sp public.sponsorships;
begin
  update public.sponsorships set status = 'paused' where name = sponsorship_name returning * into sp;
  return sp;
end;
$$;

create or replace function public.resume_sponsorship(sponsorship_name text)
returns public.sponsorships language plpgsql as $$
declare sp public.sponsorships;
begin
  update public.sponsorships set status = 'active' where name = sponsorship_name returning * into sp;
  return sp;
end;
$$;

-- Send notification helper
create or replace function public.send_notification(
  recipient_type text,
  recipient text,
  title text,
  message text,
  msg_type text default 'info',
  category text default 'system',
  action_required boolean default false
)
returns public.notifications language plpgsql as $$
declare n public.notifications;
begin
  insert into public.notifications(name, recipient_type, recipient, title, message, type, category, status, created_date, action_required)
  values (
    'NTF-' || floor(extract(epoch from now())*1000)::text,
    recipient_type,
    recipient,
    title,
    message,
    msg_type,
    category,
    'unread',
    now(),
    action_required
  ) returning * into n;
  return n;
end;
$$;

-- Vendor stats helper (used by UI service mapping)
create or replace function public.get_vendor_stats(vendor_name text)
returns json language sql stable as $$
  select json_build_object(
    'total_orders', (select count(*) from public.purchase_orders where vendor = vendor_name),
    'fulfilled_orders', (select count(*) from public.purchase_orders where vendor = vendor_name and status='fulfilled'),
    'total_points', (select coalesce(sum(total_points),0) from public.purchase_orders where vendor = vendor_name),
    'total_reviews', (select count(*) from public.vendor_reviews where vendor = vendor_name),
    'average_rating', (select avg(rating) from public.vendor_reviews where vendor = vendor_name)
  );
$$;
