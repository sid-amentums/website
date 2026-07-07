import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import type { Article } from '@/lib/types'

export const revalidate = 0

export default async function AdminArticlesPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  const articles = (data ?? []) as Article[]

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-ink">Articles</h1>
          <Link
            href="/admin/articles/new"
            className="rounded-pill bg-ink px-5 py-2 text-xs font-medium text-w hover:bg-red"
          >
            New Article
          </Link>
        </div>

        {articles.length === 0 ? (
          <p className="text-sm text-mid">No articles yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-border">
                  <td className="px-3 py-3 text-sm text-ink">{a.title}</td>
                  <td className="px-3 py-3 text-xs text-mid">{a.category}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-pill px-2.5 py-1 text-[11px] font-medium uppercase ${
                        a.status === 'published' ? 'bg-[#25D366]/10 text-[#1a6b3a]' : 'bg-off2 text-dim'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="text-xs font-medium text-ink underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
