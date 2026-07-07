import { z } from 'zod'

export const articleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  title: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(60),
  author: z.string().trim().min(1).max(80),
  summary: z.string().trim().max(400).nullable().optional(),
  read_time: z.string().trim().max(20).nullable().optional(),
  body: z.string().min(1),
  status: z.enum(['draft', 'published']),
  published_at: z.string().nullable().optional(),
})

export type ArticleInput = z.infer<typeof articleSchema>
