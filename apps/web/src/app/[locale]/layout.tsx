import type { Metadata } from 'next'
import { Inter, Lora, Playfair_Display } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MobileNav } from '@/components/layout/mobile-nav'
import { AppProvider } from '@/components/providers/app-provider'
import { ToastProvider } from '@metanoia/ui'
import { JsonLd } from '@/components/seo/json-ld'
import { generateWebsiteJsonLd, generateOrganizationJsonLd, generateOgImageUrl } from '@/lib/seo'
import { InstallPrompt, UpdatePrompt, OfflineIndicator } from '@/components/pwa'
import { SkipLink, LiveRegionProvider } from '@/components/accessibility'
import '../globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const lora = Lora({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'vietnamese'],
  variable: '--font-lora',
  display: 'swap',
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://metanoiamoment.org'

export const metadata: Metadata = {
  title: {
    default: 'Metanoia Moment',
    template: '%s | Metanoia Moment',
  },
  description:
    'Share your testimony of transformation through Jesus Christ. Capture your story for generations.',
  keywords: ['testimony', 'faith', 'Jesus', 'transformation', 'video', 'Christian'],
  authors: [{ name: 'Metanoia Moment' }],
  metadataBase: new URL(SITE_URL),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Metanoia Moment',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Metanoia Moment',
    images: [
      {
        url: generateOgImageUrl({
          title: 'Metanoia Moment',
          description: 'Share your testimony of transformation through Jesus Christ',
        }),
        width: 1200,
        height: 630,
        alt: 'Metanoia Moment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metanoia Moment',
    description: 'Share your testimony of transformation through Jesus Christ.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Providing all messages to the client side
  const messages = await getMessages()

  // Determine text direction for RTL languages
  const dir = ['ar', 'he'].includes(locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Metanoia Moment" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Metanoia Moment" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ed7412" />
        <meta name="msapplication-TileColor" content="#ed7412" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-152x152.png" />

        {/* Splash Screens for iOS */}
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-2048-2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1668-2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1536-2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1125-2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1242-2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />

        <JsonLd data={[generateWebsiteJsonLd(), generateOrganizationJsonLd()]} />
      </head>
      <body
        className={`${inter.variable} ${lora.variable} ${playfair.variable} font-sans`}
      >
        <NextIntlClientProvider messages={messages}>
          <ToastProvider position="top-right">
            <AppProvider>
              <LiveRegionProvider>
                <SkipLink />
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main id="main-content" className="flex-1 pb-20 md:pb-0" tabIndex={-1}>
                    {children}
                  </main>
                  <Footer className="hidden md:block" />
                  <MobileNav />
                </div>
                {/* PWA Components */}
                <OfflineIndicator />
                <InstallPrompt />
                <UpdatePrompt />
              </LiveRegionProvider>
            </AppProvider>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
