'use client'

import { useEffect, useState, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

// Platform detection types
export type Platform =
  | 'ios-safari'
  | 'ios-chrome'
  | 'ios-other'
  | 'android-chrome'
  | 'android-samsung'
  | 'android-firefox'
  | 'android-other'
  | 'windows-chrome'
  | 'windows-edge'
  | 'windows-firefox'
  | 'windows-other'
  | 'macos-safari'
  | 'macos-chrome'
  | 'macos-firefox'
  | 'macos-other'
  | 'linux'
  | 'unknown'

export interface PlatformInfo {
  platform: Platform
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'samsung' | 'opera' | 'unknown'
  supportsNativeInstall: boolean
  requiresManualInstall: boolean
  isMobile: boolean
  isTablet: boolean
}

function detectPlatform(): PlatformInfo {
  if (typeof window === 'undefined') {
    return {
      platform: 'unknown',
      os: 'unknown',
      browser: 'unknown',
      supportsNativeInstall: false,
      requiresManualInstall: false,
      isMobile: false,
      isTablet: false,
    }
  }

  const ua = navigator.userAgent.toLowerCase()
  const vendor = navigator.vendor?.toLowerCase() || ''

  // Detect OS
  let os: PlatformInfo['os'] = 'unknown'
  if (/iphone|ipad|ipod/.test(ua)) os = 'ios'
  else if (/android/.test(ua)) os = 'android'
  else if (/windows/.test(ua)) os = 'windows'
  else if (/macintosh|mac os x/.test(ua)) os = 'macos'
  else if (/linux/.test(ua)) os = 'linux'

  // Detect browser
  let browser: PlatformInfo['browser'] = 'unknown'
  if (/samsungbrowser/.test(ua)) browser = 'samsung'
  else if (/edg/.test(ua)) browser = 'edge'
  else if (/firefox|fxios/.test(ua)) browser = 'firefox'
  else if (/opr|opera/.test(ua)) browser = 'opera'
  else if (/chrome|chromium|crios/.test(ua) && vendor.includes('google')) browser = 'chrome'
  else if (/safari/.test(ua) && vendor.includes('apple')) browser = 'safari'

  // Detect device type
  const isMobile = /mobile|iphone|ipod|android.*mobile/.test(ua)
  const isTablet = /ipad|android(?!.*mobile)|tablet/.test(ua)

  // Determine platform string
  let platform: Platform = 'unknown'
  if (os === 'ios') {
    platform = browser === 'safari' ? 'ios-safari' : browser === 'chrome' ? 'ios-chrome' : 'ios-other'
  } else if (os === 'android') {
    platform = browser === 'chrome' ? 'android-chrome' :
               browser === 'samsung' ? 'android-samsung' :
               browser === 'firefox' ? 'android-firefox' : 'android-other'
  } else if (os === 'windows') {
    platform = browser === 'chrome' ? 'windows-chrome' :
               browser === 'edge' ? 'windows-edge' :
               browser === 'firefox' ? 'windows-firefox' : 'windows-other'
  } else if (os === 'macos') {
    platform = browser === 'safari' ? 'macos-safari' :
               browser === 'chrome' ? 'macos-chrome' :
               browser === 'firefox' ? 'macos-firefox' : 'macos-other'
  } else if (os === 'linux') {
    platform = 'linux'
  }

  // Determine install support
  // Native install works on: Chrome (Android/Desktop), Edge, Samsung Browser, Opera
  const supportsNativeInstall =
    (browser === 'chrome' && os !== 'ios') ||
    browser === 'edge' ||
    browser === 'samsung' ||
    browser === 'opera'

  // Manual install required on: iOS (all browsers), Firefox, Safari desktop
  const requiresManualInstall =
    os === 'ios' ||
    browser === 'firefox' ||
    (browser === 'safari' && os === 'macos')

  return {
    platform,
    os,
    browser,
    supportsNativeInstall,
    requiresManualInstall,
    isMobile,
    isTablet,
  }
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isStandalone, setIsStandalone] = useState(false)
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    platform: 'unknown',
    os: 'unknown',
    browser: 'unknown',
    supportsNativeInstall: false,
    requiresManualInstall: false,
    isMobile: false,
    isTablet: false,
  })

  useEffect(() => {
    // Detect platform
    const info = detectPlatform()
    setPlatformInfo(info)

    // Check if running in standalone mode (already installed)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true

    setIsStandalone(standalone)
    setIsInstalled(standalone)

    // Set initial online state
    setIsOnline(navigator.onLine)

    // Listen for install prompt (only fires on supported browsers)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for successful install
    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsInstallable(false)
      setIsInstalled(true)
    }

    // Listen for online/offline
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setIsInstallable(false)
        return true
      }
      return false
    } catch (error) {
      console.error('Error installing PWA:', error)
      return false
    }
  }, [deferredPrompt])

  // Determine if we should show install prompt
  // Show if: native install available OR manual install possible (and not already installed)
  const canShowInstallPrompt = !isInstalled && !isStandalone &&
    (isInstallable || platformInfo.requiresManualInstall)

  return {
    isInstallable,
    isInstalled,
    isOnline,
    isStandalone,
    platformInfo,
    canShowInstallPrompt,
    install,
  }
}

// Hook to register service worker
export function useServiceWorker() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        setRegistration(reg)
        setIsRegistered(true)

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
              }
            })
          }
        })

        // Check for updates periodically
        setInterval(() => {
          reg.update()
        }, 60 * 60 * 1000) // Check every hour
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    }

    registerSW()
  }, [])

  const update = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }, [registration])

  return {
    isRegistered,
    updateAvailable,
    update,
  }
}
