-- Views to support vendor, catalog, and purchase order pages
-- Idempotent (CREATE OR REPLACE VIEW)

-- Active catalog with vendor and category labels
create or replace view public.view_active_catalog as
select ci.name as item_id,
       ci.item_name,
       ci.description,
       ci.point_price,
       ci.is_active,
       ci.image,
       v.name as vendor_id,
       v.vendor_name,
       pc.name as category_id,
       pc.category_name
from public.catalog_items ci
left join public.vendors v on v.name = ci.vendor
left join public.product_categories pc on pc.name = ci.category
where ci.is_active = true;

-- Purchase order items expanded (join to order and item)
create or replace view public.view_purchase_order_items_expanded as
select poi.name as poi_id,
       po.name as order_id,
       po.student,
       po.vendor,
       po.status,
       po.request_date,
       poi.item,
       ci.item_name,
       poi.quantity,
       poi.points_per_item,
       poi.total_points
from public.purchase_order_items poi
join public.purchase_orders po on po.name = poi.parent
left join public.catalog_items ci on ci.name = poi.item;

-- Vendor order summary
create or replace view public.view_vendor_order_summary as
select v.name as vendor_id,
       v.vendor_name,
       count(po.*) as total_orders,
       count(nullif((po.status = 'fulfilled')::int, 0)) as fulfilled_orders,
       coalesce(sum(po.total_points), 0) as total_points,
       max(po.request_date) as last_order_date
from public.vendors v
left join public.purchase_orders po on po.vendor = v.name
group by v.name, v.vendor_name;

-- Helpful indexes on materialized columns if needed (views are not indexed)
-- Use direct table indexes already added in prior scripts.

-- Enriched catalog view with optional vendor analytics (latest period per vendor)
create or replace view public.view_vendor_catalog_full as
with latest_analytics as (
  select va.*
  from public.vendor_analytics va
  join (
    select vendor, max(start_date) as max_start
    from public.vendor_analytics
    group by vendor
  ) latest on latest.vendor = va.vendor and latest.max_start = va.start_date
)
select 
  ci.name as item_id,
  ci.item_name,
  ci.description,
  ci.point_price,
  ci.is_active,
  ci.image,
  pc.name as category_id,
  pc.category_name,
  v.name as vendor_id,
  v.vendor_name,
  v.status as vendor_status,
  v.verification_status,
  la.total_orders as vendor_total_orders,
  la.total_points_earned as vendor_total_points,
  la.average_rating as vendor_avg_rating
from public.catalog_items ci
left join public.product_categories pc on pc.name = ci.category
left join public.vendors v on v.name = ci.vendor
left join latest_analytics la on la.vendor = v.name
where ci.is_active = true;

-- Detailed purchase orders view with vendor and student labels
create or replace view public.view_purchase_orders_full as
select 
  po.name as order_id,
  po.status,
  po.request_date,
  po.approved_date,
  po.fulfilled_date,
  po.total_points,
  po.delivery_method,
  po.delivery_address,
  po.expected_delivery_date,
  po.actual_delivery_date,
  v.name as vendor_id,
  v.vendor_name,
  s.name as student_id,
  s.first_name || ' ' || s.last_name as student_name
from public.purchase_orders po
left join public.vendors v on v.name = po.vendor
left join public.students s on s.name = po.student;

-- Extra seed data
insert into public.vendors(name, vendor_name, email, status, verification_status)
values ('VENDOR-tech', 'Tech Supplies Co', 'tech@example.com', 'active', 'verified')
on conflict (name) do nothing;

insert into public.product_categories(name, category_name)
values ('PCAT-tech', 'Tech')
on conflict (name) do nothing;

insert into public.catalog_items(name, item_name, category, vendor, point_price, is_active)
values ('ITEM-headphones', 'Headphones', 'PCAT-tech', 'VENDOR-tech', 2500, true)
on conflict (name) do nothing;

insert into public.purchase_orders(name, student, vendor, total_points, status, delivery_method)
values ('PO-2', 'ST-student', 'VENDOR-tech', 2500, 'approved', 'delivery')
on conflict (name) do nothing;

insert into public.purchase_order_items(name, parent, parenttype, parentfield, item, quantity, points_per_item, total_points)
values ('POI-2', 'PO-2', 'Purchase Order', 'items', 'ITEM-headphones', 1, 2500, 2500)
on conflict (name) do nothing;
