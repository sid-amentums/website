'use client'

export default function ImageHoverPreview({
  src,
  alt,
  children,
  previewClassName = 'h-56 w-56',
}: {
  src: string
  alt: string
  children: React.ReactNode
  previewClassName?: string
}) {
  return (
    <div className="group relative">
      {children}
      <div
        className={`pointer-events-none absolute left-full top-0 z-50 ml-2 hidden overflow-hidden rounded-lg border border-border-2 bg-w p-1 shadow-lg group-hover:block ${previewClassName}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-contain" />
      </div>
    </div>
  )
}
