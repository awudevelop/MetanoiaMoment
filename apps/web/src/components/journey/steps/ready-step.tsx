'use client'

import { useTranslations } from 'next-intl'
import { Button, Card, CardContent } from '@metanoia/ui'
import { ArrowLeft, Video, CheckCircle, Camera, Mic, Sun, Shirt, Clock, Heart } from 'lucide-react'
import type { JourneyProgress } from '@/lib/story-journey'
import { STORY_CATEGORIES, type StoryCategory } from '@/types'

interface ReadyStepProps {
  journey: JourneyProgress
  onStartRecording: () => void
  onBack: () => void
}

const CHECKLIST_ITEMS = [
  { icon: Camera, key: 'camera' },
  { icon: Sun, key: 'lighting' },
  { icon: Mic, key: 'quiet' },
  { icon: Shirt, key: 'clothing' },
  { icon: Clock, key: 'time' },
  { icon: Heart, key: 'authentic' },
] as const

export function ReadyStep({ journey, onStartRecording, onBack }: ReadyStepProps) {
  const t = useTranslations('journey.ready')
  const category = journey.category as StoryCategory
  const categoryInfo = category ? STORY_CATEGORIES[category] : null

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-warm-900 md:text-3xl">{t('title')}</h2>
        <p className="mt-2 text-warm-600">{t('subtitle')}</p>
      </div>

      {/* Story Summary */}
      {categoryInfo && (
        <Card className="mb-8 border-primary-200 bg-primary-50/50">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-primary-600">{t('aboutToShare')}</p>
            <h3 className="mt-1 text-xl font-bold text-warm-900">{categoryInfo.label}</h3>
            <p className="mt-1 text-sm text-warm-600">{categoryInfo.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Checklist */}
      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="border-b border-warm-200 bg-warm-50 px-5 py-3">
            <h4 className="font-semibold text-warm-900">{t('checklist')}</h4>
            <p className="text-sm text-warm-600">{t('beforeRecord')}</p>
          </div>
          <div className="divide-y divide-warm-100">
            {CHECKLIST_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.key} className="flex items-start gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-warm-100">
                    <Icon className="h-5 w-5 text-warm-600" />
                  </div>
                  <div>
                    <p className="font-medium text-warm-900">{t(`checks.${item.key}.label`)}</p>
                    <p className="text-sm text-warm-500">{t(`checks.${item.key}.detail`)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Encouragement */}
      <div className="mb-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-center text-white">
        <h4 className="text-lg font-semibold">{t('remember')}</h4>
        <p className="mt-2 text-primary-100">{t('encouragement')}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('reviewOutline')}
        </Button>
        <Button onClick={onStartRecording} size="lg" className="gap-2">
          <Video className="h-5 w-5" />
          {t('startRecording')}
        </Button>
      </div>
    </div>
  )
}
