import { z } from 'zod'

export const productVariantSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1).max(60),
  weight_grams: z.number().int().positive().nullable(),
  range_meters: z.number().int().positive().nullable(),
  price_inr: z.number().positive(),
  active: z.boolean(),
})

export const productImageSchema = z.object({
  // Not .url() — legacy seeded products reference local /images/products/...
  // paths (served straight from /public), while uploads via the Storage
  // route produce full https:// URLs. Both render fine through next/image
  // and plain <img>, so any non-empty path is accepted here.
  url: z.string().trim().min(1),
  alt: z.string().trim().max(160),
  is_primary: z.boolean(),
  sort_order: z.number().int().nonnegative(),
})

export const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  name: z.string().trim().min(1).max(200),
  sku: z.string().trim().min(1).max(60),
  category: z.string().trim().min(1).max(60),
  short_desc: z.string().trim().max(300).nullable().optional(),
  long_desc: z.string().trim().max(4000).nullable().optional(),
  level: z.string().trim().max(40).nullable().optional(),
  flex: z.string().trim().max(40).nullable().optional(),
  // No .default() on any field here: productSchema.partial() (below) wraps
  // each field in .optional(), but a ZodDefault still substitutes its
  // default for an *omitted* key even when optional-wrapped — so a
  // {active}-only PATCH would silently reset images/stock/etc. to their
  // defaults. ProductForm always sends every field explicitly on create, so
  // no default is needed there either.
  wa_certified: z.boolean(),
  variants: z.array(productVariantSchema).min(1, 'At least one variant is required'),
  images: z.array(productImageSchema),
  active: z.boolean(),
  stock: z.number().int().nonnegative(),
  checkout_enabled: z.boolean(),
  whatsapp_message_template: z.string().trim().max(500).nullable().optional(),
  featured_best_seller: z.boolean(),
  sale_percent: z.number().int().min(1).max(99).nullable().optional(),
  sale_starts_at: z.string().nullable().optional(),
  sale_ends_at: z.string().nullable().optional(),
})

export type ProductInput = z.infer<typeof productSchema>

// Every field optional — used by the PATCH route so existing {active}-only
// or {variants}-only calls keep working unchanged alongside full-field edits
// from the new admin product form.
export const productPatchSchema = productSchema.partial()
