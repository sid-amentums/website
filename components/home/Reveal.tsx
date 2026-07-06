'use client'

import { useEffect, useRef, useState } from 'react'

type RevealVariant = 'up' | 'scale' | 'fade'

const VARIANT_CLASSES: Record<RevealVariant, { hidden: string; shown: string }> = {
  up: { hidden: 'opacity-0 translate-y-8', shown: 'opacity-100 translate-y-0' },
  scale: { hidden: 'opacity-0 scale-[0.965]', shown: 'opacity-100 scale-100' },
  fade: { hidden: 'opacity-0', shown: 'opacity-100' },
}

// Replicates the legacy prototype's .r/.rs/.rfade scroll-reveal classes:
// fades/slides elements in once as they enter the viewport.
export default function Reveal({
  children,
  variant = 'up',
  delayMs = 0,
  className = '',
}: {
  children: React.ReactNode
  variant?: RevealVariant
  delayMs?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const classes = VARIANT_CLASSES[variant]

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-spring ${visible ? classes.shown : classes.hidden} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}
