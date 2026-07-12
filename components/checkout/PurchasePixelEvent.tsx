'use client'

import { useEffect } from 'react'
import { trackPixelEvent } from '@/lib/analytics/metaPixel'
import type { CartItem } from '@/lib/types'

// Rendered only from the success page after it has already confirmed
// order.status === 'paid' server-side — so any mount of this component is a
// real completed purchase, not a re-fireable client-side guess.
export default function PurchasePixelEvent({
  orderId,
  amountInr,
  items,
}: {
  orderId: string
  amountInr: number
  items: CartItem[]
}) {
  useEffect(() => {
    trackPixelEvent('Purchase', {
      content_ids: items.map((i) => i.product_id).join(','),
      value: amountInr,
      currency: 'INR',
      num_items: items.length,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per successful order render, keyed on orderId
  }, [orderId])

  return null
}
