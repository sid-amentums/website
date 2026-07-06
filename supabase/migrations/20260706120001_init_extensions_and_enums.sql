-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enums
create type order_status as enum (
  'created',        -- razorpay order created, awaiting payment
  'paid',           -- signature verified server-side, payment confirmed
  'failed',         -- payment attempt failed or was abandoned
  'refunded',       -- manually refunded via Razorpay dashboard, admin marks it
  'cancelled'       -- order cancelled before payment
);

create type shipping_status as enum (
  'pending',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered'
);

create type coupon_type as enum ('percent', 'flat');

create type admin_role as enum ('super_admin', 'catalog_manager', 'support');
