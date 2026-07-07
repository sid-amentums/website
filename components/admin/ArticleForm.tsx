'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Article, ArticleStatus } from '@/lib/types'

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter()
  const isEdit = Boolean(article)

  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [category, setCategory] = useState(article?.category ?? '')
  const [author, setAuthor] = useState(article?.author ?? 'Amentum Editorial')
  const [summary, setSummary] = useState(article?.summary ?? '')
  const [readTime, setReadTime] = useState(article?.read_time ?? '')
  const [status, setStatus] = useState<ArticleStatus>(article?.status ?? 'draft')
  const [body, setBody] = useState(article?.body ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category: category.trim(),
      author: author.trim(),
      summary: summary.trim() || null,
      read_time: readTime.trim() || null,
      status,
      body,
    }

    const res = await fetch(isEdit ? `/api/admin/articles/${article!.id}` : '/api/admin/articles', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Could not save article.')
      return
    }
    router.push('/admin/articles')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
        />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
          Slug
        </label>
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true)
            setSlug(e.target.value)
          }}
          required
          className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Category
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Author
          </label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Read Time
          </label>
          <input
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="e.g. 8 min"
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ArticleStatus)}
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
          Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
        />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
          Body (HTML)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={12}
          className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 font-mono text-xs outline-none focus:border-ink focus:bg-w"
        />
        <p className="mt-1 text-[11px] text-dim">
          Plain HTML — use &lt;p&gt;, &lt;h4&gt;, &lt;strong&gt; tags.
        </p>
      </div>
      {error ? <p className="text-xs text-red">{error}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="rounded-pill bg-ink px-7 py-3 text-sm font-medium text-w transition-colors hover:bg-red disabled:opacity-60"
      >
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Article'}
      </button>
    </form>
  )
}
