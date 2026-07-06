import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cartItemsSchema } from '@/lib/validation/cart'
import { mergeCartItems } from '@/lib/cart/mergeCart'
import type { CartItem } from '@/lib/types'

// Runs with the caller's own RLS-scoped session (not service_role) — this is
// a legitimate "acting as the logged-in user" operation, and carts_insert_own
// / carts_update_own policies already scope it correctly.
export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = cartItemsSchema.safeParse(body?.guestItems ?? [])
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 })
  }
  const guestItems = parsed.data as CartItem[]

  const { data: existingCart } = await supabase
    .from('carts')
    .select('id, items')
    .eq('user_id', user.id)
    .maybeSingle()

  // Re-validate every incoming line against live products — drop anything
  // inactive/deleted rather than trusting the guest cart's snapshot.
  const productIds = Array.from(new Set(guestItems.map((i) => i.product_id)))
  const { data: liveProducts } = productIds.length
    ? await supabase.from('products').select('id, active, variants').in('id', productIds)
    : { data: [] as { id: string; active: boolean; variants: unknown }[] }

  const droppedItems: CartItem[] = []
  const validGuestItems = guestItems.filter((item) => {
    const product = liveProducts?.find((p) => p.id === item.product_id)
    const variants = (product?.variants ?? []) as { id: string; active: boolean }[]
    const variant = variants.find((v) => v.id === item.variant_id)
    const ok = Boolean(product?.active && variant?.active)
    if (!ok) droppedItems.push(item)
    return ok
  })

  const merged = mergeCartItems((existingCart?.items ?? []) as CartItem[], validGuestItems)

  if (existingCart) {
    await supabase
      .from('carts')
      .update({ items: merged, updated_at: new Date().toISOString() })
      .eq('id', existingCart.id)
  } else {
    await supabase.from('carts').insert({ user_id: user.id, items: merged })
  }

  return NextResponse.json({ items: merged, droppedItems })
}
