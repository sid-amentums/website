import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// SERVICE_ROLE client — bypasses RLS entirely. Import this ONLY inside app/api/**
// route handlers that have already authorized the caller themselves (e.g. via
// requireAdmin(), or the Razorpay verify route's own signature check). Never
// import this file from components/**, any "use client" file, or anything that
// could end up in a browser bundle — SUPABASE_SERVICE_ROLE_KEY must never leave
// the server. Enforced by the no-restricted-imports ESLint rule in .eslintrc.json.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
