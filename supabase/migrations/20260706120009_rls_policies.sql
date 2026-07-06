create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and active = true
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- ── app_settings ──────────────────────────────────────────────────────────
create policy "app_settings_select_all" on public.app_settings
  for select using (true);  -- public-safe values, readable by anyone including anon

create policy "app_settings_update_admin_only" on public.app_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- ── admin_users ───────────────────────────────────────────────────────────
create policy "admin_users_select_self_or_admin" on public.admin_users
  for select using (auth.uid() = id or public.is_admin());

create policy "admin_users_no_client_writes" on public.admin_users
  for all using (false) with check (false);
-- All writes happen exclusively via service_role (e.g. an internal
-- "invite admin" API route), never via a client-facing RLS-governed write.

-- ── products ──────────────────────────────────────────────────────────────
create policy "products_select_active_public" on public.products
  for select using (active = true or public.is_admin());

create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ── carts ─────────────────────────────────────────────────────────────────
create policy "carts_select_own" on public.carts
  for select using (auth.uid() = user_id);

create policy "carts_insert_own" on public.carts
  for insert with check (auth.uid() = user_id);

create policy "carts_update_own" on public.carts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "carts_delete_own" on public.carts
  for delete using (auth.uid() = user_id);

-- ── coupons ───────────────────────────────────────────────────────────────
create policy "coupons_select_active_public" on public.coupons
  for select using (active = true or public.is_admin());
  -- Client-side reads active coupons for "valid code" UI feedback only — the
  -- actual discount is always recomputed server-side at order-create time.

create policy "coupons_admin_write" on public.coupons
  for all using (public.is_admin()) with check (public.is_admin());

-- ── orders ────────────────────────────────────────────────────────────────
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

create policy "orders_insert_own_or_guest" on public.orders
  for insert with check (
    auth.uid() = user_id
    or (user_id is null and is_guest_order = true)
  );
  -- Defense-in-depth only: the actual order-creation path always goes through
  -- app/api/razorpay/create-order/route.ts using the service_role client, so
  -- price/amount computation stays entirely server-side.

create policy "orders_update_none_client" on public.orders
  for update using (false) with check (false);
  -- CRITICAL: no client-side UPDATE path exists at all. The only way status
  -- transitions to 'paid' is app/api/razorpay/verify/route.ts using
  -- service_role, which bypasses RLS by design. No client — not even the
  -- legitimate owner — can PATCH their own order to status='paid'.
