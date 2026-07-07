import Link from 'next/link'
import Reveal from '@/components/home/Reveal'
import { createClient } from '@/lib/supabase/server'
import type { Article } from '@/lib/types'

export default async function InsightsPreview() {
  const supabase = createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  const articles = (data ?? []) as Article[]
  if (articles.length === 0) return null

  return (
    <section className="bg-off px-6 pb-0 pt-[72px] md:px-12">
      <Reveal variant="up" className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wide text-red">
            Amentum Insights
          </div>
          <h2 className="font-serif text-3xl text-ink md:text-5xl">From the field.</h2>
        </div>
        <Link
          href="/insights"
          className="rounded-pill border border-border-2 px-5 py-2 text-xs font-medium text-ink transition-colors hover:border-ink"
        >
          All articles →
        </Link>
      </Reveal>
      <Reveal variant="scale">
        <div className="grid grid-cols-1 gap-px bg-pale md:grid-cols-3">
          {articles.map((article) => {
            const date = article.published_at
              ? new Date(article.published_at).toLocaleDateString('en-IN', {
                  month: 'short',
                  year: 'numeric',
                })
              : null
            return (
              <Link
                key={article.id}
                href={`/insights/${article.slug}`}
                className="block bg-w p-9 transition-colors hover:bg-off"
              >
                <div className="mb-3 text-[10px] font-medium uppercase tracking-wide text-red">
                  {article.category}
                  {date ? ` · ${date}` : ''}
                </div>
                <div className="mb-2.5 font-serif text-xl leading-snug tracking-tight text-ink">
                  {article.title}
                </div>
                {article.summary ? (
                  <div className="mt-2 text-[13px] leading-relaxed text-mid">{article.summary}</div>
                ) : null}
                {article.read_time ? (
                  <div className="mt-2 text-xs text-dim">{article.read_time} read</div>
                ) : null}
                <span className="mt-4 inline-block text-xs font-medium text-ink">
                  Read Full Article →
                </span>
              </Link>
            )
          })}
        </div>
      </Reveal>
    </section>
  )
}
