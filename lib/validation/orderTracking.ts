import { z } from 'zod'

export const orderTrackSchema = z.object({
  orderId: z.string().uuid(),
  phone: z.string().regex(/^\d{10}$/, 'Enter a 10-digit mobile number'),
})
