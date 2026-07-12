-- Extends the admin_set_vault_secret allow-list from
-- 20260706120008_vault_rpc.sql with the two integration secrets anticipated
-- back when that comment said "msg91_auth_key is intentionally NOT in the
-- allowed list yet" — same idea, different vendor. Everything else about the
-- function (lockdown to service_role, upsert-by-name logic) is unchanged.
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
  if p_secret_name not in (
    'razorpay_key_secret',
    'razorpay_webhook_secret',
    'whatsapp_access_token',
    'mailchimp_api_key'
  ) then
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

revoke all on function public.admin_set_vault_secret(text, text) from public;
revoke all on function public.admin_set_vault_secret(text, text) from anon, authenticated;
grant execute on function public.admin_set_vault_secret(text, text) to service_role;
