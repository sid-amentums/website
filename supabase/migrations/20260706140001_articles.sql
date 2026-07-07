-- Module 3: Insights/Blog CMS.
create type article_status as enum ('draft', 'published');

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  author text not null,
  summary text,
  read_time text,               -- e.g. '8 min' — admin-entered, matches legacy prototype's format
  body text not null,           -- HTML content (admin-authored only, not user-submitted, so
                                 -- rendering it as trusted markup client-side is an accepted risk)
  status article_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_status_idx on public.articles (status) where status = 'published';
create index articles_published_at_idx on public.articles (published_at desc);

alter table public.articles enable row level security;

create policy "articles_select_published_public" on public.articles
  for select using (status = 'published' or public.is_admin());

create policy "articles_admin_write" on public.articles
  for all using (public.is_admin()) with check (public.is_admin());
