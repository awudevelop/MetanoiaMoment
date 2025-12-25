'use client'

import { useEffect, type ReactNode } from 'react'
import { useAppStore, useIsOnline } from '@/lib/stores/app-store'
import { ErrorBoundary } from '@/components/error-boundary'
import { OfflineBanner } from '@/components/offline-banner'
import { GlobalLoadingOverlay } from '@/components/global-loading'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const setOnline = useAppStore((state) => state.setOnline)
  const updateLastActivity = useAppStore((state) => state.updateLastActivity)
  const updateSettings = useAppStore((state) => state.updateSettings)

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline])

  // Track user activity
  useEffect(() => {
    const handleActivity = () => updateLastActivity()

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('scroll', handleActivity)
    window.addEventListener('touchstart', handleActivity)

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
    }
  }, [updateLastActivity])

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    updateSettings({ reducedMotion: mediaQuery.matches })

    const handleChange = (e: MediaQueryListEvent) => {
      updateSettings({ reducedMotion: e.matches })
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [updateSettings])

  return (
    <ErrorBoundary>
      <OfflineStatus />
      <GlobalLoadingOverlay />
      {children}
    </ErrorBoundary>
  )
}

function OfflineStatus() {
  const isOnline = useIsOnline()

  if (isOnline) return null

  return <OfflineBanner />
}
