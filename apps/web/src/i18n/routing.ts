import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // Supported languages - only include locales with translation files
  // To add a new language: create messages/{locale}.json and add locale here
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

// Lightweight wrappers around Next.js' navigation APIs
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
