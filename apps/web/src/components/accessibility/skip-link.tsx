'use client'

import { useTranslations } from 'next-intl'

export function SkipLink() {
  const t = useTranslations('accessibility')

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
    >
      {t('skipToMain')}
    </a>
  )
}
