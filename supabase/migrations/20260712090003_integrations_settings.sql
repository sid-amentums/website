-- Public-safe integration config: pixel/config ids, not secrets. Access
-- tokens/API keys for the same integrations go through Vault (see
-- 20260712090004_vault_allowlist_whatsapp_mailchimp.sql), same split as the
-- existing razorpay_key_id (plain, here) vs razorpay_key_secret (Vault).
alter table public.app_settings
  add column if not exists meta_pixel_id text,
  add column if not exists whatsapp_phone_number_id text,
  add column if not exists whatsapp_business_account_id text,
  add column if not exists whatsapp_template_name text,
  add column if not exists mailchimp_audience_id text;
