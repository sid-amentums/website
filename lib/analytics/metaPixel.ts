'use client'

type PixelEventParams = Record<string, string | number | undefined>

// No-ops if the Meta Pixel base script hasn't loaded (pixel not configured
// in Settings, or fbq not yet ready) — every call site treats this as
// fire-and-forget, same contract as the WhatsApp/Mailchimp server helpers.
export function trackPixelEvent(eventName: string, params?: PixelEventParams) {
  if (typeof window === 'undefined') return
  const fbq = (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq
  if (typeof fbq !== 'function') return
  fbq('track', eventName, params)
}
