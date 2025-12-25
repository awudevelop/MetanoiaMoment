'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { X, Download, Share, Plus, MoreVertical, Menu, Settings } from 'lucide-react'
import { Button } from '@metanoia/ui'
import { usePWA, type PlatformInfo } from '@/hooks/use-pwa'

export function InstallPrompt() {
  const t = useTranslations('pwa')
  const { isInstallable, isInstalled, isStandalone, platformInfo, canShowInstallPrompt, install } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already installed or in standalone mode
    if (isInstalled || isStandalone) return

    // Check if user has previously dismissed
    const wasDismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (wasDismissed) {
      const dismissedAt = new Date(wasDismissed)
      const daysSinceDismissed = (Date.now() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24)
      // Don't show again for 7 days
      if (daysSinceDismissed < 7) {
        setDismissed(true)
        return
      }
    }

    // Show prompt after a delay (let user explore first)
    const timer = setTimeout(() => {
      if (canShowInstallPrompt) {
        setShowPrompt(true)
      }
    }, 30000) // 30 seconds

    return () => clearTimeout(timer)
  }, [canShowInstallPrompt, isInstalled, isStandalone])

  const handleInstall = async () => {
    // If native install is available, use it
    if (isInstallable) {
      const success = await install()
      if (success) {
        setShowPrompt(false)
      }
      return
    }

    // Otherwise show manual instructions
    setShowInstructions(true)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowInstructions(false)
    setDismissed(true)
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString())
  }

  if (!showPrompt || dismissed) return null

  return (
    <>
      {/* Install Prompt Banner */}
      <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-6 md:left-auto md:right-6 md:w-96 animate-slide-in-up">
        <div className="rounded-xl bg-white shadow-2xl border border-warm-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                <span className="font-semibold">{t('install.title')}</span>
              </div>
              <button
                onClick={handleDismiss}
                className="rounded-full p-1 hover:bg-white/20 transition-colors"
                aria-label={t('install.dismiss')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-warm-600 mb-4">
              {t('install.description')}
            </p>

            <div className="flex gap-3">
              <Button onClick={handleInstall} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                {t('install.button')}
              </Button>
              <Button variant="outline" onClick={handleDismiss}>
                {t('install.notNow')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform-Specific Instructions Modal */}
      {showInstructions && (
        <PlatformInstructions
          platformInfo={platformInfo}
          onClose={() => setShowInstructions(false)}
        />
      )}
    </>
  )
}

interface PlatformInstructionsProps {
  platformInfo: PlatformInfo
  onClose: () => void
}

function PlatformInstructions({ platformInfo, onClose }: PlatformInstructionsProps) {
  const t = useTranslations('pwa')
  const instructions = getInstructionsForPlatform(platformInfo, t)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 md:rounded-2xl animate-slide-in-up max-h-[80vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-warm-900">{instructions.title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-warm-100"
            aria-label={t('install.dismiss')}
          >
            <X className="h-5 w-5 text-warm-500" />
          </button>
        </div>

        {/* Platform indicator */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-warm-100 px-3 py-1 text-sm text-warm-600">
          {instructions.platformLabel}
        </div>

        <div className="space-y-4">
          {instructions.steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-warm-900">{step.title}</p>
                <p className="text-sm text-warm-600 mt-1">{step.description}</p>
                {step.icon && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-warm-50 px-3 py-2">
                    {step.icon}
                    <span className="text-sm text-warm-700">{step.iconLabel}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={onClose} className="mt-6 w-full">
          {t('install.gotIt')}
        </Button>
      </div>
    </div>
  )
}

interface InstructionStep {
  title: string
  description: string
  icon?: React.ReactNode
  iconLabel?: string
}

interface Instructions {
  title: string
  platformLabel: string
  steps: InstructionStep[]
}

function getInstructionsForPlatform(
  platformInfo: PlatformInfo,
  t: ReturnType<typeof useTranslations<'pwa'>>
): Instructions {
  const { os, browser } = platformInfo

  // iOS Safari
  if (os === 'ios' && browser === 'safari') {
    return {
      title: t('instructions.ios.title'),
      platformLabel: 'iOS Safari',
      steps: [
        {
          title: t('instructions.ios.step1.title'),
          description: t('instructions.ios.step1.description'),
          icon: <Share className="h-5 w-5 text-primary-600" />,
          iconLabel: t('instructions.ios.step1.iconLabel'),
        },
        {
          title: t('instructions.ios.step2.title'),
          description: t('instructions.ios.step2.description'),
          icon: <Plus className="h-5 w-5 text-primary-600" />,
          iconLabel: t('instructions.ios.step2.iconLabel'),
        },
        {
          title: t('instructions.ios.step3.title'),
          description: t('instructions.ios.step3.description'),
        },
      ],
    }
  }

  // iOS Chrome/Other browsers
  if (os === 'ios') {
    return {
      title: t('instructions.iosChrome.title'),
      platformLabel: `iOS ${browser === 'chrome' ? 'Chrome' : 'Browser'}`,
      steps: [
        {
          title: t('instructions.iosChrome.step1.title'),
          description: t('instructions.iosChrome.step1.description'),
        },
        {
          title: t('instructions.iosChrome.step2.title'),
          description: t('instructions.iosChrome.step2.description'),
          icon: <Share className="h-5 w-5 text-primary-600" />,
          iconLabel: t('instructions.ios.step1.iconLabel'),
        },
        {
          title: t('instructions.ios.step2.title'),
          description: t('instructions.ios.step2.description'),
        },
      ],
    }
  }

  // Android Firefox
  if (os === 'android' && browser === 'firefox') {
    return {
      title: t('instructions.androidFirefox.title'),
      platformLabel: 'Android Firefox',
      steps: [
        {
          title: t('instructions.androidFirefox.step1.title'),
          description: t('instructions.androidFirefox.step1.description'),
          icon: <MoreVertical className="h-5 w-5 text-primary-600" />,
          iconLabel: t('instructions.androidFirefox.step1.iconLabel'),
        },
        {
          title: t('instructions.androidFirefox.step2.title'),
          description: t('instructions.androidFirefox.step2.description'),
        },
        {
          title: t('instructions.androidFirefox.step3.title'),
          description: t('instructions.androidFirefox.step3.description'),
        },
      ],
    }
  }

  // macOS Safari
  if (os === 'macos' && browser === 'safari') {
    return {
      title: t('instructions.macosSafari.title'),
      platformLabel: 'macOS Safari',
      steps: [
        {
          title: t('instructions.macosSafari.step1.title'),
          description: t('instructions.macosSafari.step1.description'),
          icon: <Share className="h-5 w-5 text-primary-600" />,
          iconLabel: t('instructions.macosSafari.step1.iconLabel'),
        },
        {
          title: t('instructions.macosSafari.step2.title'),
          description: t('instructions.macosSafari.step2.description'),
        },
        {
          title: t('instructions.macosSafari.step3.title'),
          description: t('instructions.macosSafari.step3.description'),
        },
      ],
    }
  }

  // Firefox (Desktop)
  if (browser === 'firefox') {
    return {
      title: t('instructions.firefox.title'),
      platformLabel: 'Firefox',
      steps: [
        {
          title: t('instructions.firefox.step1.title'),
          description: t('instructions.firefox.step1.description'),
        },
        {
          title: t('instructions.firefox.step2.title'),
          description: t('instructions.firefox.step2.description'),
        },
      ],
    }
  }

  // Default/Generic instructions
  return {
    title: t('instructions.generic.title'),
    platformLabel: t('instructions.generic.platformLabel'),
    steps: [
      {
        title: t('instructions.generic.step1.title'),
        description: t('instructions.generic.step1.description'),
        icon: <Menu className="h-5 w-5 text-primary-600" />,
        iconLabel: t('instructions.generic.step1.iconLabel'),
      },
      {
        title: t('instructions.generic.step2.title'),
        description: t('instructions.generic.step2.description'),
      },
      {
        title: t('instructions.generic.step3.title'),
        description: t('instructions.generic.step3.description'),
      },
    ],
  }
}
