import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import AdminNav from '@/components/admin/AdminNav'
import ArticleForm from '@/components/admin/ArticleForm'

export default async function NewArticlePage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">New Article</h1>
        <ArticleForm />
      </div>
    </div>
  )
}
