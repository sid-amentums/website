-- Daily revenue/order-count series for the dashboard's revenue chart.
-- generate_series ensures every day in the window appears (as zero) even
-- with no sales that day, so the chart never has gaps.
create or replace function public.admin_revenue_timeseries(p_days int default 30)
returns table (
  bucket_date date,
  revenue_inr numeric,
  order_count bigint
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
    d.bucket_date,
    coalesce(sum(o.amount_inr), 0),
    coalesce(count(o.id), 0)
  from generate_series(
    (current_date - (p_days - 1)),
    current_date,
    interval '1 day'
  ) as d(bucket_date)
  left join public.orders o
    on o.status = 'paid'
    and date_trunc('day', o.paid_at)::date = d.bucket_date
  group by d.bucket_date
  order by d.bucket_date;
end;
$$;

grant execute on function public.admin_revenue_timeseries(int) to authenticated;

-- Order status funnel (all statuses, by created_at) over the window.
create or replace function public.admin_order_status_breakdown(p_days int default 30)
returns table (
  status order_status,
  order_count bigint
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
  select o.status, count(*)
  from public.orders o
  where o.created_at >= now() - make_interval(days => p_days)
  group by o.status
  order by count(*) desc;
end;
$$;

grant execute on function public.admin_order_status_breakdown(int) to authenticated;

-- admin_dashboard_summary gains previous-period comparison columns (drives
-- the dashboard's trend arrows) — return shape changed, so drop first
-- (CREATE OR REPLACE cannot change a `returns table` column list).
drop function if exists public.admin_dashboard_summary(int);

create function public.admin_dashboard_summary(p_days int default 30)
returns table (
  all_time_revenue_inr numeric,
  all_time_order_count bigint,
  recent_revenue_inr numeric,
  recent_order_count bigint,
  avg_order_value_inr numeric,
  previous_period_revenue_inr numeric,
  previous_period_order_count bigint
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
    end,
    coalesce(
      sum(o.amount_inr) filter (
        where o.status = 'paid'
        and o.paid_at >= now() - make_interval(days => p_days * 2)
        and o.paid_at < now() - make_interval(days => p_days)
      ),
      0
    ),
    count(*) filter (
      where o.status = 'paid'
      and o.paid_at >= now() - make_interval(days => p_days * 2)
      and o.paid_at < now() - make_interval(days => p_days)
    )
  from public.orders o;
end;
$$;

grant execute on function public.admin_dashboard_summary(int) to authenticated;
