'use client'

import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@metanoia/ui'
import { useServiceWorker } from '@/hooks/use-pwa'

export function UpdatePrompt() {
  const t = useTranslations('pwa.update')
  const { updateAvailable, update } = useServiceWorker()

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-6 md:left-6 md:right-auto md:w-80 animate-slide-in-up">
      <div className="flex items-center gap-3 rounded-lg bg-accent-600 p-4 text-white shadow-lg">
        <RefreshCw className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{t('title')}</p>
          <p className="text-xs text-accent-100">{t('description')}</p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={update}
          className="bg-white text-accent-700 hover:bg-accent-50"
        >
          {t('button')}
        </Button>
      </div>
    </div>
  )
}
