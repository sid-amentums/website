'use client'

// Placeholder until the cart store lands (task: guest cart + cart drawer).
// Renders a static cart icon with no count/click behavior yet.
export default function NavCartButton() {
  return (
    <button aria-label="Cart" className="relative flex h-8 w-8 items-center justify-center text-ink">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    </button>
  )
}
