-- Admins are real Supabase Auth users with a role-gate row here. Independence
-- from customer auth comes from customers simply never getting a row inserted
-- here, not from a separate auth system. No hardcoded credentials anywhere.
create table public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role admin_role not null default 'support',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index admin_users_email_idx on public.admin_users (lower(email));

alter table public.admin_users enable row level security;
