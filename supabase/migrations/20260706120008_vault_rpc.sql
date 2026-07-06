-- Supabase Vault ships as the `vault` schema/extension on hosted Supabase
-- projects. This RPC is the ONLY way to write razorpay_key_secret /
-- razorpay_webhook_secret. There is no corresponding "read" RPC exposed to
-- any role other than service_role reading vault.decrypted_secrets directly,
-- server-side, at call time (see lib/razorpay/getKeySecret.ts). The admin UI
-- never gets a value back — only a write acknowledgement.
--
-- msg91_auth_key is intentionally NOT in the allowed list yet — MSG91 is
-- deferred to a later session. Add it here when that module starts.
create or replace function public.admin_set_vault_secret(
  p_secret_name text,
  p_secret_value text
)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_existing_id uuid;
begin
  if p_secret_name not in ('razorpay_key_secret', 'razorpay_webhook_secret') then
    raise exception 'Unknown secret name: %', p_secret_name;
  end if;

  select id into v_existing_id from vault.secrets where name = p_secret_name;

  if v_existing_id is not null then
    perform vault.update_secret(v_existing_id, p_secret_value);
  else
    perform vault.create_secret(p_secret_value, p_secret_name, 'Amentum admin-managed secret');
  end if;
end;
$$;

-- Lock down execution: only service_role may call this function. The admin
-- UI never calls it directly from the browser with the anon key — it goes
-- through app/api/admin/settings/vault/route.ts, which authenticates the
-- caller against admin_users first, then uses lib/supabase/admin.ts
-- (service_role) to invoke this RPC.
revoke all on function public.admin_set_vault_secret(text, text) from public;
revoke all on function public.admin_set_vault_secret(text, text) from anon, authenticated;
grant execute on function public.admin_set_vault_secret(text, text) to service_role;
