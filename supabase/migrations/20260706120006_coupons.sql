-- Seeds the prototype's 4 codes (AMENTUM10, JAVELIN5, ARENA15, LAUNCH20) in
-- 0010_seed_products.sql, but validation is now entirely server-side at
-- order-create time — the prototype's client-side COUPONS object
-- (js/main.js:305-310) was trivially forgeable.
create table public.coupons (
  code text primary key,
  type coupon_type not null,
  value numeric(10,2) not null check (value > 0),
  description text,
  active boolean not null default true,
  usage_count int not null default 0,
  max_uses int,
  min_order_amount numeric(10,2) default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.coupons enable row level security;
