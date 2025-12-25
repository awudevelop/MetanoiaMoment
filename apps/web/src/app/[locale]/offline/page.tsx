'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { WifiOff, RefreshCw, Home } from 'lucide-react'
import { Button } from '@metanoia/ui'

export default function OfflinePage() {
  const t = useTranslations('pwa.offline')
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  // If we're back online, redirect
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        window.location.reload()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-warm-50 to-warm-100 px-4">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-warm-200 animate-pulse-soft">
          <WifiOff className="h-12 w-12 text-warm-500" />
        </div>

        {/* Title */}
        <h1 className="mb-4 font-display text-3xl font-bold text-warm-900">
          {isOnline ? t('backOnline') : t('title')}
        </h1>

        {/* Description */}
        <p className="mb-8 text-warm-600">
          {isOnline ? t('reconnecting') : t('description')}
        </p>

        {/* Actions */}
        {!isOnline && (
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button onClick={handleRetry} className="group">
              <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
              {t('tryAgain')}
            </Button>
            <Button variant="outline" onClick={handleGoHome}>
              <Home className="mr-2 h-4 w-4" />
              {t('goHome')}
            </Button>
          </div>
        )}

        {/* Loading indicator when back online */}
        {isOnline && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        )}

        {/* Tips */}
        {!isOnline && (
          <div className="mt-12 rounded-lg bg-white/50 p-6 text-left">
            <h2 className="mb-3 font-semibold text-warm-900">{t('tips.title')}</h2>
            <ul className="space-y-2 text-sm text-warm-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                {t('tips.tip1')}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                {t('tips.tip2')}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                {t('tips.tip3')}
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="fixed -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-100 opacity-50 blur-3xl" />
      <div className="fixed -right-20 -top-20 h-64 w-64 rounded-full bg-accent-100 opacity-50 blur-3xl" />
    </div>
  )
}
