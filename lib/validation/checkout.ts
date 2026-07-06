import { z } from 'zod'

// No price/snapshot fields accepted from the client — only identifiers and
// quantity. The server re-fetches live product/variant prices and builds
// the item snapshot itself (see app/api/razorpay/create-order/route.ts).
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        variant_id: z.string().min(1),
        quantity: z.number().int().positive().max(99),
      })
    )
    .min(1),
  couponCode: z.string().nullable().optional(),
  contact: z.object({
    name: z.string().min(1),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be a 10-digit number'),
    email: z.string().email(),
  }),
  shippingAddress: z.object({
    line1: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    country: z.literal('IN'),
  }),
  isGuestCheckout: z.boolean().optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
