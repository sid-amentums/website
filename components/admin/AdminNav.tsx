'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const linkClass = (href: string) =>
    `text-sm ${pathname === href ? 'text-ink font-medium' : 'text-mid hover:text-ink'}`

  return (
    <nav className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-6">
        <span className="font-serif text-lg text-ink">
          <em className="text-red not-italic">A</em>mentum Admin
        </span>
        <Link href="/admin/products" className={linkClass('/admin/products')}>
          Products
        </Link>
        <Link href="/admin/orders" className={linkClass('/admin/orders')}>
          Orders
        </Link>
        <Link href="/admin/articles" className={linkClass('/admin/articles')}>
          Articles
        </Link>
        <Link href="/admin/settings" className={linkClass('/admin/settings')}>
          Settings
        </Link>
      </div>
      <button onClick={handleLogout} className="text-xs text-mid underline hover:text-ink">
        Log Out
      </button>
    </nav>
  )
}
