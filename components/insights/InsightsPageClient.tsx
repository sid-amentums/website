'use client'

import { useMemo, useState } from 'react'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/insights/ArticleCard'

export default function InsightsPageClient({ articles }: { articles: Article[] }) {
  const categories = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category))),
    [articles]
  )
  const [active, setActive] = useState<string | null>(null)

  const filtered = active ? articles.filter((a) => a.category === active) : articles

  return (
    <div className="px-6 pb-24 md:px-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border py-11">
        <div>
          <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wide text-red">
            Latest · World &amp; India
          </div>
          <h1 className="font-serif text-3xl text-ink md:text-5xl">Javelin Insights.</h1>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActive(null)}
            className={`rounded-pill border-[1.5px] px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
              active === null ? 'border-ink bg-ink text-w' : 'border-border-2 text-mid hover:bg-off'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-pill border-[1.5px] px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
                active === cat ? 'border-ink bg-ink text-w' : 'border-border-2 text-mid hover:bg-off'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-sm text-mid">No articles in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-px bg-pale md:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
