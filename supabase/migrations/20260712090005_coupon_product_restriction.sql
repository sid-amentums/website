-- null/empty = coupon applies to the whole cart (today's behavior,
-- unchanged). Non-empty = coupon only usable when the cart contains at
-- least one of these product ids, and the discount is computed only on
-- those line items — see evaluateCoupon() in lib/validation/coupon.ts.
alter table public.coupons
  add column if not exists eligible_product_ids uuid[];
