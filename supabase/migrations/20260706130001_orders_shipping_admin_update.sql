-- Module 2 (Order Tracking, DTDC manual entry). Admins need to set
-- awb_number/shipping_status on existing orders from the admin panel.
-- orders_update_none_client (20260706120009) intentionally blocks ALL
-- client-side updates so payment status can only ever be flipped by the
-- service_role verify route. This migration carves out a narrow, admin-only
-- exception for the two logistics columns ONLY — column-level grants mean
-- that even if an admin session's UPDATE statement tried to also touch
-- `status` or `razorpay_*`, Postgres would reject it for lacking column
-- privilege, independent of the RLS policy check.
grant update (awb_number, shipping_status) on public.orders to authenticated;

create policy "orders_update_shipping_admin_only" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());
-- Combines via OR with orders_update_none_client (permissive policies on the
-- same command OR together): non-admins still get `false` and are blocked
-- entirely; admins get `true` here but remain constrained to the two
-- granted columns above.
