-- Fixes a real gap in 20260706130001: Supabase's default project bootstrap
-- already grants `authenticated` full UPDATE on all columns of every table
-- in the public schema. GRANT is additive, not restrictive — adding a
-- narrower `grant update (awb_number, shipping_status)` on top of an
-- existing full-table UPDATE grant does NOT narrow it. Verified by directly
-- PATCHing `status` on an order as the admin session — it worked, when it
-- should have been rejected for lacking column privilege.
--
-- The fix: REVOKE the broad grant first, then re-grant only the two
-- intended columns. This is what actually restricts an admin session to
-- logistics fields only — RLS alone (is_admin()) was never enough, because
-- RLS operates at the row level, not the column level.
revoke update on public.orders from authenticated;
grant update (awb_number, shipping_status) on public.orders to authenticated;
