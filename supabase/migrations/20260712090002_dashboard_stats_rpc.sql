-- Admin dashboard: pushes aggregation into Postgres instead of shipping raw
-- order rows to the client. Runs with the caller's own authenticated session
-- (not service_role) — gated by an in-body is_admin() check, matching every
-- other admin-read path in this project.

create or replace function public.admin_dashboard_summary(p_days int default 30)
returns table (
  all_time_revenue_inr numeric,
  all_time_order_count bigint,
  recent_revenue_inr numeric,
  recent_order_count bigint,
  avg_order_value_inr numeric
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Forbidden';
  end if;

  return query
  select
    coalesce(sum(o.amount_inr) filter (where o.status = 'paid'), 0),
    count(*) filter (where o.status = 'paid'),
    coalesce(
      sum(o.amount_inr) filter (where o.status = 'paid' and o.paid_at >= now() - make_interval(days => p_days)),
      0
    ),
    count(*) filter (where o.status = 'paid' and o.paid_at >= now() - make_interval(days => p_days)),
    case
      when count(*) filter (where o.status = 'paid') > 0
        then round(sum(o.amount_inr) filter (where o.status = 'paid') / count(*) filter (where o.status = 'paid'), 2)
      else 0
    end
  from public.orders o;
end;
$$;

grant execute on function public.admin_dashboard_summary(int) to authenticated;

-- Unnests each order's items jsonb array (one row per line item) to rank
-- products by revenue over the trailing window.
create or replace function public.admin_top_products(p_days int default 30, p_limit int default 5)
returns table (
  product_id uuid,
  product_name text,
  quantity_sold bigint,
  revenue_inr numeric
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Forbidden';
  end if;

  return query
  select
    (item ->> 'product_id')::uuid,
    item ->> 'name_snapshot',
    sum((item ->> 'quantity')::int),
    sum((item ->> 'quantity')::int * (item ->> 'unit_price_snapshot')::numeric)
  from public.orders o,
    jsonb_array_elements(o.items) as item
  where o.status = 'paid'
    and o.paid_at >= now() - make_interval(days => p_days)
  group by item ->> 'product_id', item ->> 'name_snapshot'
  order by sum((item ->> 'quantity')::int * (item ->> 'unit_price_snapshot')::numeric) desc
  limit p_limit;
end;
$$;

grant execute on function public.admin_top_products(int, int) to authenticated;
