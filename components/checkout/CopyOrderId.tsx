'use client'

import { useState } from 'react'

export default function CopyOrderId({ orderId }: { orderId: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard permission can be denied by the browser — the ID is
      // still selectable text (select-all below), so this is a silent
      // no-op rather than a broken button.
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-border bg-off px-4 py-3.5 text-left">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-dim">Order ID</div>
      <div className="flex items-center justify-between gap-3">
        <code className="select-all break-all text-xs text-ink">{orderId}</code>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-pill border border-border-2 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-ink"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
