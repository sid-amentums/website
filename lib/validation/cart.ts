import { z } from 'zod'

export const cartItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().min(1),
  name_snapshot: z.string().min(1),
  variant_label_snapshot: z.string(),
  unit_price_snapshot: z.number().nonnegative(),
  quantity: z.number().int().positive().max(99),
})

export const cartItemsSchema = z.array(cartItemSchema)

export type CartItemInput = z.infer<typeof cartItemSchema>
