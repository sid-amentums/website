import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import Script from 'next/script'
import { getAppSettings } from '@/lib/settings/appSettings'
import CartProvider from '@/components/cart/CartProvider'
import CartDrawer from '@/components/cart/CartDrawer'
import AuthModal from '@/components/auth/AuthModal'
import AuthListener from '@/components/auth/AuthListener'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
})

export const metadata: Metadata = {
  title: 'Amentum Sports',
  description: 'Precision-engineered javelins for every level of the sport.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { ga_measurement_id } = await getAppSettings()

  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased`}>
        <CartProvider />
        <CartDrawer />
        <AuthListener />
        <AuthModal />
        {children}
        {ga_measurement_id ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga_measurement_id}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga_measurement_id}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  )
}
