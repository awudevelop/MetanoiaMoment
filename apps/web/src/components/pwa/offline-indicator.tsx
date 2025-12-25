'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { WifiOff, Wifi } from 'lucide-react'

export function OfflineIndicator() {
  const t = useTranslations('pwa.offline')
  const [isOnline, setIsOnline] = useState(true)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowReconnected(true)
      setTimeout(() => setShowReconnected(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowReconnected(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline && !showReconnected) return null

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 ${
        isOnline ? 'bg-accent-600' : 'bg-warm-800'
      } flex animate-slide-in-up items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white shadow-lg`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          {t('backOnline')}
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          {t('title')}
        </>
      )}
    </div>
  )
}
