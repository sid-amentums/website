import { notFound, redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import ArticleForm from '@/components/admin/ArticleForm'
import type { Article } from '@/lib/types'

export const revalidate = 0

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createClient()
  const { data } = await supabase.from('articles').select('*').eq('id', params.id).maybeSingle()

  if (!data) notFound()

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">Edit Article</h1>
        <ArticleForm article={data as Article} />
      </div>
    </div>
  )
}
