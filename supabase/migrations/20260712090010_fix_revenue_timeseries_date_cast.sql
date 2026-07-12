-- Fix: generate_series(date, date, interval) returns timestamptz, not date
-- ("Returned type timestamp with time zone does not match expected type
-- date in column 1") — Postgres does not implicitly cast this for
-- `return query`, unlike a plain SELECT. Cast the bucket explicitly.
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
    d.bucket_date::date,
    coalesce(sum(o.amount_inr), 0),
    coalesce(count(o.id), 0)
  from generate_series(
    (current_date - (p_days - 1)),
    current_date,
    interval '1 day'
  ) as d(bucket_date)
  left join public.orders o
    on o.status = 'paid'
    and date_trunc('day', o.paid_at)::date = d.bucket_date::date
  group by d.bucket_date
  order by d.bucket_date;
end;
$$;

grant execute on function public.admin_revenue_timeseries(int) to authenticated;
