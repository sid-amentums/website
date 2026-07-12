alter table public.products
  add column if not exists sort_order int not null default 0;

-- Backfill existing rows with a stable initial order matching today's
-- category-then-name display order, so shipping this doesn't visibly
-- reshuffle the shop/admin product list on day one. Admins can then
-- drag-and-drop to set a real manual order from here.
with ordered as (
  select id, row_number() over (order by category, name) as rn
  from public.products
)
update public.products p
set sort_order = ordered.rn
from ordered
where ordered.id = p.id;
