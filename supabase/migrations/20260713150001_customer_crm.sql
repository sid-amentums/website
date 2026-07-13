-- Customer CRM: per-customer tags + a unified activity timeline (manual
-- notes and sent-emails share one table, discriminated by `type`, so the
-- admin detail page shows one relationship history rather than two).
create table public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tags text[] not null default '{}',
  updated_at timestamptz not null default now()
);
alter table public.customer_profiles enable row level security;
create policy "customer_profiles_admin_only" on public.customer_profiles
  for all using (public.is_admin()) with check (public.is_admin());

create table public.customer_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  admin_email text not null,
  type text not null check (type in ('note', 'email_sent')),
  subject text,          -- only set for type = 'email_sent'
  body text not null,
  created_at timestamptz not null default now()
);
create index customer_activity_user_id_idx on public.customer_activity (user_id, created_at desc);
alter table public.customer_activity enable row level security;
create policy "customer_activity_admin_only" on public.customer_activity
  for all using (public.is_admin()) with check (public.is_admin());
