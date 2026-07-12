import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5_000_000

// multipart/form-data upload — zod doesn't fit File validation well, so
// this is checked manually. Runs with the caller's own admin session (not
// service_role): storage RLS (product_images_admin_insert) is what actually
// gates this, matching every other admin-write path in the project.
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'File must be a JPEG, PNG, or WebP image' }, { status: 400 })
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')
  const path = `products/${crypto.randomUUID()}-${safeName}`

  const supabase = createClient()
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('product-images').getPublicUrl(path)

  return NextResponse.json({ ok: true, url: publicUrl, path })
}
