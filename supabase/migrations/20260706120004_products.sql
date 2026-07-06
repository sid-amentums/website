-- variants jsonb shape (enforced at the app layer via zod, documented here):
--   [{ "id":"v1", "label":"800g / 90m", "weight_grams":800, "range_meters":90,
--      "price_inr":26000, "active":true }, ...]
-- `id` is a stable per-variant key referenced by cart/order line items — never
-- the array index — so re-ordering variants in admin never breaks historical
-- orders. `price_inr` is authoritative; client-submitted prices are never
-- trusted (recomputed server-side at order-create time).
--
-- images jsonb shape:
--   [{ "url":"...", "alt":"...", "is_primary":true, "sort_order":0 }, ...]
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sku text not null unique,
  category text not null,               -- competition | training | youth | mini | international | institutional
  short_desc text,
  long_desc text,
  level text,                            -- 'Pro / Elite', 'Beginner', etc.
  flex text,                             -- 'Low' | 'Medium' | 'Soft' | 'N/A'
  wa_certified boolean not null default false,
  variants jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  stock int not null default 0,
  checkout_enabled boolean not null default true,   -- false for international brands / institutional (WhatsApp-enquiry only)
  whatsapp_message_template text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products (category);
create index products_active_idx on public.products (active) where active = true;

alter table public.products enable row level security;
