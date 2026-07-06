-- Atomic increment so concurrent verified payments using the same coupon
-- never lose an update to a read-modify-write race. Called only from
-- app/api/razorpay/verify/route.ts after a payment is confirmed paid.
create or replace function public.increment_coupon_usage(p_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.coupons set usage_count = usage_count + 1 where code = p_code;
$$;

revoke all on function public.increment_coupon_usage(text) from public;
revoke all on function public.increment_coupon_usage(text) from anon, authenticated;
grant execute on function public.increment_coupon_usage(text) to service_role;
