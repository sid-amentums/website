import { z } from 'zod'

export const tagsSchema = z.object({
  tags: z.array(z.string().trim().min(1).max(30)).max(10),
})

export const noteSchema = z.object({
  body: z.string().trim().min(1).max(2000),
})

export const emailSchema = z.object({
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(5000),
})
