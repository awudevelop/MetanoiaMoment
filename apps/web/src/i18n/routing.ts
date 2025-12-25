import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // Supported languages - easily extensible
  locales: ['en', 'es', 'fr', 'pt', 'zh', 'ar', 'hi', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

// Lightweight wrappers around Next.js' navigation APIs
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
