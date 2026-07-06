import Image from 'next/image'
import Link from 'next/link'

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex h-nav items-center justify-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/brand/amentum_logo.png" alt="Amentum Sports" width={28} height={28} />
          <span className="text-[13px] font-semibold tracking-wide">
            <em className="text-red not-italic">A</em>mentum Sports
          </span>
        </Link>
      </header>
      <main className="min-h-screen">{children}</main>
    </>
  )
}
