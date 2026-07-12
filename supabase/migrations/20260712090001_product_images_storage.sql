-- Admin panel expansion: real product image upload via Supabase Storage.
-- next.config.mjs already whitelists *.supabase.co/storage/v1/object/public/**
-- (anticipated back when the project images were still local-only files).
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read (product photos are meant to be public), admin-only write —
-- reuses the same public.is_admin() function every other admin-write RLS
-- policy in this project already uses. No service_role needed: the upload
-- route runs with the caller's own admin session via lib/supabase/server.ts.
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
