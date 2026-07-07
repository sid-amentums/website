import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Article } from '@/lib/types'

export const revalidate = 0

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .maybeSingle()

  if (!data) notFound()
  const article = data as Article

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  return (
    <article>
      <div className="bg-ink px-6 py-[52px] md:px-16">
        <Link href="/insights" className="mb-6 inline-block text-xs text-white/40 hover:text-white/70">
          ← All Insights
        </Link>
        <div className="mb-3.5 text-[10px] font-medium uppercase tracking-wide text-red">
          {article.category}
        </div>
        <h1 className="mb-3 max-w-3xl font-serif text-[clamp(24px,3.5vw,44px)] leading-tight tracking-tight text-w">
          {article.title}
        </h1>
        <div className="text-xs text-white/40">
          {article.author}
          {date ? ` · ${date}` : ''}
          {article.read_time ? ` · ${article.read_time} read` : ''}
        </div>
      </div>

      <div
        className="mx-auto max-w-2xl px-6 py-12 text-[15px] leading-[1.78] text-mid [&_h4]:mb-3 [&_h4]:mt-7 [&_h4]:font-serif [&_h4]:text-xl [&_h4]:tracking-tight [&_h4]:text-ink [&_p]:mb-[18px] [&_strong]:font-medium [&_strong]:text-ink"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      <div className="flex flex-wrap gap-3 border-t border-border px-6 py-8">
        <Link
          href="/shop"
          className="rounded-pill bg-ink px-7 py-3 text-sm font-medium text-w transition-colors hover:bg-red"
        >
          Shop Amentum Javelins →
        </Link>
        <Link
          href="/insights"
          className="rounded-pill border border-border-2 px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          Back to Insights
        </Link>
      </div>
    </article>
  )
}
