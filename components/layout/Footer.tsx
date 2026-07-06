import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ink px-6 pb-8 pt-16 text-w md:px-12">
      <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-4">
        <div>
          <div className="font-serif text-xl">
            <em className="text-red not-italic">A</em>mentum Sports
          </div>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/50">
            Largest javelin store in Asia. Structuring the unstructured since 2018. Making
            javelin a way of life in India.
          </p>
        </div>
        <div>
          <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
            Products
          </h5>
          <ul className="space-y-2 text-[13px] text-white/60">
            <li>
              <Link href="/shop" className="hover:text-white">
                The Nalwa — ₹26,000
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white">
                The Chhatrapati — from ₹16,250
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white">
                Olympic Gold — from ₹13,000
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
            Connect
          </h5>
          <ul className="space-y-2 text-[13px] text-white/60">
            <li>
              <a href="https://www.instagram.com/amentum.sports/" target="_blank" rel="noopener" className="hover:text-white">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://wa.me/+919827654830" target="_blank" rel="noopener" className="hover:text-white">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="tel:+919827654830" className="hover:text-white">
                +91 9827654830
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
            Company
          </h5>
          <ul className="space-y-2 text-[13px] text-white/60">
            <li>
              <Link href="/" className="hover:text-white">
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 pt-6 text-[11px] text-white/40 md:flex-row">
        <div>Structured. Affordable. Elite.</div>
        <div>© 2025 Amentum Sports. All rights reserved.</div>
      </div>
    </footer>
  )
}
