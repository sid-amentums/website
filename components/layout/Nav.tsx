import Image from 'next/image'
import Link from 'next/link'
import NavCartButton from '@/components/cart/NavCartButton'
import { createClient } from '@/lib/supabase/server'

export default async function Nav() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="fixed inset-x-0 top-0 z-[600] flex h-nav items-center justify-between border-b border-border bg-w/90 px-6 backdrop-blur-xl md:px-12">
      <Link href="/" className="flex items-center gap-2.5">
        <Image src="/images/brand/amentum_logo.png" alt="Amentum Sports" width={32} height={32} className="object-contain" />
        <span className="text-[13px] font-semibold tracking-wide">
          <em className="text-red not-italic">A</em>mentum Sports
        </span>
      </Link>

      <ul className="hidden gap-9 md:flex">
        <li>
          <Link href="/" className="text-xs text-mid transition-colors hover:text-ink">
            Home
          </Link>
        </li>
        <li>
          <Link href="/shop" className="text-xs text-mid transition-colors hover:text-ink">
            Shop
          </Link>
        </li>
        <li>
          <Link href="/insights" className="text-xs text-mid transition-colors hover:text-ink">
            Insights
          </Link>
        </li>
        {user ? (
          <li>
            <Link
              href="/account/orders"
              className="text-xs text-mid transition-colors hover:text-ink"
            >
              My Orders
            </Link>
          </li>
        ) : null}
      </ul>

      <div className="flex items-center gap-4">
        <NavCartButton />
        <Link
          href="/shop"
          className="rounded-pill bg-ink px-5 py-2 text-xs font-medium text-w transition-all duration-200 hover:scale-[1.03] hover:bg-red"
        >
          Shop Javelins
        </Link>
      </div>
    </nav>
  )
}
