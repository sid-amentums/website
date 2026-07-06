-- Seed data for the 9 Amentum products (verbatim from the legacy prototype's
-- admin/js/admin.js DEFAULT_PRODUCTS), plus the 7 international brands and
-- 3 institutional packages as checkout_enabled=false WhatsApp-enquiry
-- entries in the same table.
--
-- Images reference public/images/products/** and public/images/brand/**
-- (served directly by Next.js from the public/ folder — no Supabase Storage
-- bucket needed for this session). Nalwa and Amentum Red still hotlink the
-- legacy Wix CDN images since no local asset exists yet; swap these for
-- local files under public/images/products/ once supplied (the user has
-- said a real amentum-red.png will be supplied later for Amentum Red).
--
-- Idempotent: re-running this migration updates existing rows by sku rather
-- than erroring or duplicating.

insert into public.products (slug, name, sku, category, level, flex, wa_certified, short_desc, variants, images, active, checkout_enabled)
values
(
  'the-nalwa',
  'The Nalwa (Blue Green)',
  'AM-BLGR',
  'competition',
  'Pro / Elite',
  'Low',
  true,
  'Blue-Green · World Athletics Certified. Named after legendary warrior Haqiqat Rai Nalwa.',
  '[{"id":"v1","label":"800g / 90m","weight_grams":800,"range_meters":90,"price_inr":26000,"active":true}]'::jsonb,
  '[{"url":"https://static.wixstatic.com/media/a4300d_584ea8d99d8b4d4191e793388e4c82ba~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80/a4300d_584ea8d99d8b4d4191e793388e4c82ba~mv2.jpg","alt":"The Nalwa (Blue Green)","is_primary":true,"sort_order":0}]'::jsonb,
  true, true
),
(
  'the-chhatrapati',
  'The Chhatrapati (Purple)',
  'AM-PUO',
  'competition',
  'Intermediate / Pro',
  'Low',
  false,
  'Purple · Named after Chhatrapati Shivaji Maharaj.',
  '[{"id":"v1","label":"600g / 60m","weight_grams":600,"range_meters":60,"price_inr":16250,"active":true},{"id":"v2","label":"800g / 80m","weight_grams":800,"range_meters":80,"price_inr":18200,"active":true}]'::jsonb,
  '[{"url":"/images/products/Purple_White.png","alt":"The Chhatrapati (Purple)","is_primary":true,"sort_order":0},{"url":"/images/products/Purple.png","alt":"The Chhatrapati detail","is_primary":false,"sort_order":1},{"url":"/images/products/purple_tip.png","alt":"The Chhatrapati tip detail","is_primary":false,"sort_order":2}]'::jsonb,
  true, true
),
(
  'olympic-gold',
  'Olympic Gold',
  'AM-BLY',
  'competition',
  'Intermediate',
  'Medium / Low',
  false,
  'Gold finish · Competition spec for women and sub-elite athletes.',
  '[{"id":"v1","label":"600g / 50m","weight_grams":600,"range_meters":50,"price_inr":13000,"active":true},{"id":"v2","label":"700g / 70m","weight_grams":700,"range_meters":70,"price_inr":14300,"active":true},{"id":"v3","label":"800g / 70m","weight_grams":800,"range_meters":70,"price_inr":14300,"active":true}]'::jsonb,
  '[{"url":"/images/products/Olympic_gold.png","alt":"Olympic Gold","is_primary":true,"sort_order":0},{"url":"/images/products/olympic_gold_a.png","alt":"Olympic Gold detail","is_primary":false,"sort_order":1},{"url":"/images/products/olympic_gold_tip.png","alt":"Olympic Gold tip detail","is_primary":false,"sort_order":2}]'::jsonb,
  true, true
),
(
  'black-panther',
  'Black Panther',
  'AM-BLA',
  'training',
  'Intermediate',
  'Medium',
  false,
  'High-impact alloy for daily training in all conditions.',
  '[{"id":"v1","label":"600g","weight_grams":600,"range_meters":null,"price_inr":8000,"active":true},{"id":"v2","label":"700g","weight_grams":700,"range_meters":null,"price_inr":8200,"active":true},{"id":"v3","label":"800g","weight_grams":800,"range_meters":null,"price_inr":8500,"active":true}]'::jsonb,
  '[{"url":"/images/products/Black_Panther.jpg","alt":"Black Panther","is_primary":true,"sort_order":0}]'::jsonb,
  true, true
),
(
  'purple-white',
  'Purple White',
  'AM-PRWH',
  'training',
  'Beginner / Intermediate',
  'Medium',
  false,
  'Two-tone purple and white · 500g · 50m range.',
  '[{"id":"v1","label":"500g / 50m","weight_grams":500,"range_meters":50,"price_inr":7800,"active":true}]'::jsonb,
  '[{"url":"/images/products/Purple_White_2.png","alt":"Purple White","is_primary":true,"sort_order":0},{"url":"/images/products/Purple_grip.png","alt":"Purple White grip detail","is_primary":false,"sort_order":1}]'::jsonb,
  true, true
),
(
  'amentum-red',
  'Amentum Red',
  'AM-RED',
  'youth',
  'Beginner',
  'Medium',
  false,
  'Vibrant red · 600g · High-visibility academy workhorse.',
  '[{"id":"v1","label":"600g","weight_grams":600,"range_meters":null,"price_inr":5460,"active":true}]'::jsonb,
  '[{"url":"https://static.wixstatic.com/media/a4300d_1bd34bb95e8e464b867418e26336a3b8~mv2.jpg/v1/fill/w_400,h_280/a4300d_1bd34bb95e8e464b867418e26336a3b8~mv2.jpg","alt":"Amentum Red","is_primary":true,"sort_order":0}]'::jsonb,
  true, true
),
(
  'gold-kids',
  'Gold Kids',
  'AM-GK500',
  'youth',
  'Beginner',
  'Soft',
  false,
  'Gold finish · 500g · 50m range · For school programmes.',
  '[{"id":"v1","label":"500g / 50m","weight_grams":500,"range_meters":50,"price_inr":4900,"active":true}]'::jsonb,
  '[{"url":"/images/products/gold_500gms.png","alt":"Gold Kids","is_primary":true,"sort_order":0},{"url":"/images/products/GOLD_500_gm.png","alt":"Gold Kids full shot","is_primary":false,"sort_order":1},{"url":"/images/products/gold_500gm_tip.png","alt":"Gold Kids tip detail","is_primary":false,"sort_order":2},{"url":"/images/products/GOLD.jpg","alt":"Gold Kids alternate","is_primary":false,"sort_order":3}]'::jsonb,
  true, true
),
(
  'vayuj-400g',
  'Vayuj 400g',
  'AM-VJ400',
  'mini',
  'Grassroots',
  'N/A',
  false,
  '400g · Record Setter Series · Safe rubber tip.',
  '[{"id":"v1","label":"400g","weight_grams":400,"range_meters":null,"price_inr":1298,"active":true}]'::jsonb,
  '[{"url":"/images/products/blue_vayuj_400gm.jpg","alt":"Vayuj 400g","is_primary":true,"sort_order":0}]'::jsonb,
  true, true
),
(
  'vayuj-300g',
  'Vayuj 300g — Record Setter',
  'AM-VJ300',
  'mini',
  'Grassroots / Special Olympics',
  'N/A',
  false,
  '300g · Official Special Olympics Bharat approved.',
  '[{"id":"v1","label":"300g","weight_grams":300,"range_meters":null,"price_inr":1180,"active":true}]'::jsonb,
  '[{"url":"/images/products/gold_vayuj_300gm.jpg","alt":"Vayuj 300g — Record Setter","is_primary":true,"sort_order":0}]'::jsonb,
  true, true
),
-- International brands — WhatsApp enquiry only, no e-commerce checkout.
(
  'nemeth',
  'Nemeth Javelins',
  'INT-NEMETH',
  'international',
  null, null, true,
  'Hungary · 85m Classic, 80m Special, 85m/80m Club variants.',
  '[]'::jsonb,
  '[{"url":"/images/brand/nemeth_logo.png","alt":"Nemeth Javelins","is_primary":true,"sort_order":0}]'::jsonb,
  true, false
),
(
  'polanik',
  'Polanik',
  'INT-POLANIK',
  'international',
  null, null, false,
  'Poland · Competition & training, men''s & women''s weights.',
  '[]'::jsonb,
  '[{"url":"/images/brand/polanik_logo.png","alt":"Polanik","is_primary":true,"sort_order":0}]'::jsonb,
  true, false
),
(
  'nordic-sport',
  'Nordic Sport',
  'INT-NORDIC',
  'international',
  null, null, false,
  'Sweden · Competition-spec range.',
  '[]'::jsonb,
  '[{"url":"/images/brand/nordic_logo.png","alt":"Nordic Sport","is_primary":true,"sort_order":0}]'::jsonb,
  true, false
),
(
  'gill-athletics',
  'Gill Athletics',
  'INT-GILL',
  'international',
  null, null, false,
  'USA · Collegiate & elite level.',
  '[]'::jsonb,
  '[{"url":"/images/brand/gill_logo.png","alt":"Gill Athletics","is_primary":true,"sort_order":0}]'::jsonb,
  true, false
),
(
  'nishi-athletics',
  'Nishi Athletics',
  'INT-NISHI',
  'international',
  null, null, false,
  'Japan · Precision alloy, popular in Asia.',
  '[]'::jsonb,
  '[{"url":"/images/brand/nishi_logo.png","alt":"Nishi Athletics","is_primary":true,"sort_order":0}]'::jsonb,
  true, false
),
(
  'denfi-sport',
  'Denfi Sport',
  'INT-DENFI',
  'international',
  null, null, true,
  'Denmark · World Athletics-approved precision javelins.',
  '[]'::jsonb,
  '[{"url":"/images/brand/denfi_logo.png","alt":"Denfi Sport","is_primary":true,"sort_order":0}]'::jsonb,
  true, false
),
(
  'turbojav',
  'Turbojav',
  'INT-TURBOJAV',
  'international',
  null, null, false,
  'Global · Training system for schools/beginners.',
  '[]'::jsonb,
  '[{"url":"/images/brand/turbojav_logo.png","alt":"Turbojav","is_primary":true,"sort_order":0}]'::jsonb,
  true, false
),
-- Institutional bulk packages
(
  'starter-pack',
  'Starter Pack',
  'AM-PKG-STARTER',
  'institutional',
  null, null, false,
  '10 units — for schools and small academies getting started.',
  '[{"id":"v1","label":"10 units","weight_grams":null,"range_meters":null,"price_inr":28000,"active":true}]'::jsonb,
  '[]'::jsonb,
  true, true
),
(
  'academy-pack',
  'Academy Pack',
  'AM-PKG-ACADEMY',
  'institutional',
  null, null, false,
  '25 units — for established academies and district programmes.',
  '[{"id":"v1","label":"25 units","weight_grams":null,"range_meters":null,"price_inr":64000,"active":true}]'::jsonb,
  '[]'::jsonb,
  true, true
),
(
  'elite-pack',
  'Elite Pack',
  'AM-PKG-ELITE',
  'institutional',
  null, null, false,
  '50 units — for state-level and large institutional programmes.',
  '[{"id":"v1","label":"50 units","weight_grams":null,"range_meters":null,"price_inr":118000,"active":true}]'::jsonb,
  '[]'::jsonb,
  true, true
)
on conflict (sku) do update set
  name = excluded.name,
  category = excluded.category,
  level = excluded.level,
  flex = excluded.flex,
  wa_certified = excluded.wa_certified,
  short_desc = excluded.short_desc,
  variants = excluded.variants,
  images = excluded.images,
  active = excluded.active,
  checkout_enabled = excluded.checkout_enabled,
  updated_at = now();

-- Seed the 4 coupon codes from the legacy prototype (js/main.js:305-310).
-- LAUNCH20 mirrors the prototype's already-inactive state.
insert into public.coupons (code, type, value, description, active)
values
  ('AMENTUM10', 'percent', 10, '10% off', true),
  ('JAVELIN5', 'flat', 500, '₹500 off', true),
  ('ARENA15', 'percent', 15, '15% off', true),
  ('LAUNCH20', 'percent', 20, '20% off (launch promo, inactive)', false)
on conflict (code) do update set
  type = excluded.type,
  value = excluded.value,
  description = excluded.description,
  active = excluded.active;
