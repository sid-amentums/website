-- vault.decrypted_secrets is not exposed via PostgREST by default (and
-- shouldn't be) — this RPC is the only server-side read path, restricted to
-- service_role exactly like the write RPC in 20260706120008_vault_rpc.sql.
-- Called only from lib/razorpay/getKeySecret.ts inside app/api/razorpay/**
-- route handlers — never from anything that returns data to the client.
create or replace function public.get_vault_secret(p_secret_name text)
returns text
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_value text;
begin
  select decrypted_secret into v_value
  from vault.decrypted_secrets
  where name = p_secret_name;
  return v_value;
end;
$$;

revoke all on function public.get_vault_secret(text) from public;
revoke all on function public.get_vault_secret(text) from anon, authenticated;
grant execute on function public.get_vault_secret(text) to service_role;
