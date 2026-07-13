alter table public.products
  add column if not exists featured_best_seller boolean not null default false,
  add column if not exists sale_percent int,
  add column if not exists sale_starts_at timestamptz,
  add column if not exists sale_ends_at timestamptz;

alter table public.products
  add constraint products_sale_percent_range
  check (sale_percent is null or (sale_percent > 0 and sale_percent < 100));

-- Public (anon-callable) lifetime best-seller lookup, used to auto-badge the
-- shop grid/product page. Only ever returns product UUIDs — no order/customer
-- PII — so unlike admin_top_products this is intentionally NOT is_admin()-gated.
create or replace function public.public_best_seller_ids(p_limit int default 3)
returns table (product_id uuid)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  return query
  select (item ->> 'product_id')::uuid
  from public.orders o,
    jsonb_array_elements(o.items) as item
  where o.status = 'paid'
  group by item ->> 'product_id'
  order by sum((item ->> 'quantity')::int) desc
  limit p_limit;
end;
$$;

grant execute on function public.public_best_seller_ids(int) to anon, authenticated;
