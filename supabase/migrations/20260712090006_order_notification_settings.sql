-- Public-safe order-notification config: recipient list and sender address
-- are not secret, same split as every other integration's plain-id columns
-- vs its Vault-backed secret (see 20260712090007_vault_allowlist_resend.sql
-- for the resend_api_key allow-list entry).
alter table public.app_settings
  add column if not exists order_notification_emails text,      -- comma-separated
  add column if not exists order_notification_from_email text;  -- Resend requires a verified sender
