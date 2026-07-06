-- Guest carts live in browser localStorage only, never here. A carts row is
-- created/updated the moment a guest authenticates and the merge-on-login
-- runs (see app/api/cart/merge/route.ts).
--
-- items jsonb shape (shared by guest localStorage cart, carts.items, and
-- orders.items so the same zod schema validates all three):
--   [{ "product_id":"uuid", "variant_id":"v1", "name_snapshot":"...",
--      "variant_label_snapshot":"...", "unit_price_snapshot":26000,
--      "quantity":1 }, ...]
-- *_snapshot fields are display-only — never trusted for pricing.
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index carts_user_id_idx on public.carts (user_id) where user_id is not null;

alter table public.carts enable row level security;
