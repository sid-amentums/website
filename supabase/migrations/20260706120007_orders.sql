-- status starts at 'created' (order row + Razorpay order both exist, no
-- payment yet) and only transitions to 'paid' after server-side signature
-- verification succeeds in app/api/razorpay/verify/route.ts — this is the
-- fix for the prototype's forgeable client-only "payment success" flow.
--
-- awb_number / shipping_status are reserved now for module 2 (DTDC manual
-- tracking) since they belong on this table from the start, but no tracking
-- UI is built this session.
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,  -- null only for guest-fallback orders
  is_guest_order boolean not null default false,
  items jsonb not null,                          -- immutable snapshot at order time, same shape as cart items
  subtotal_inr numeric(10,2) not null check (subtotal_inr >= 0),
  discount_inr numeric(10,2) not null default 0 check (discount_inr >= 0),
  amount_inr numeric(10,2) not null check (amount_inr >= 0),   -- subtotal - discount, authoritative charged amount
  coupon_code text references public.coupons(code),
  razorpay_order_id text unique,
  razorpay_payment_id text,
  razorpay_signature text,
  status order_status not null default 'created',
  contact_name text not null,
  contact_phone text not null,
  contact_email text not null,
  shipping_address jsonb not null,               -- {line1, city, state, pincode, country}
  awb_number text,
  shipping_status shipping_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_razorpay_order_id_idx on public.orders (razorpay_order_id);
create index orders_status_idx on public.orders (status);

alter table public.orders enable row level security;
