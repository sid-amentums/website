-- Public-safe singleton settings row: Razorpay key_id and GA measurement ID
-- are NOT secret and don't belong in Vault.
create table public.app_settings (
  id int primary key default 1 check (id = 1),
  razorpay_key_id text,
  ga_measurement_id text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

insert into public.app_settings (id) values (1) on conflict (id) do nothing;

alter table public.app_settings enable row level security;
