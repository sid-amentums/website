import Link from 'next/link'
import type { Article } from '@/lib/types'

export default function ArticleCard({ article }: { article: Article }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : null

  return (
    <Link href={`/insights/${article.slug}`} className="block bg-w p-9 transition-colors hover:bg-off">
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
      <span className="mt-4 inline-block text-xs font-medium text-ink">Read Full Article →</span>
    </Link>
  )
}
