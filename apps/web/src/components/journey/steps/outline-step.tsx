'use client'

import { useTranslations } from 'next-intl'
import { Button, Card, CardContent } from '@metanoia/ui'
import { ArrowRight, ArrowLeft, FileText, Sparkles, CheckCircle } from 'lucide-react'
import type { JourneyProgress, StoryOutline } from '@/lib/story-journey'
import { generateStoryOutline } from '@/lib/story-journey'

interface OutlineStepProps {
  journey: JourneyProgress
  onUpdate: (updates: Partial<JourneyProgress>) => void
  onContinue: () => void
  onBack: () => void
}

const SECTION_KEYS: (keyof StoryOutline)[] = ['hook', 'context', 'turning', 'impact', 'message']

export function OutlineStep({ journey, onUpdate, onContinue, onBack }: OutlineStepProps) {
  const t = useTranslations('journey.outline')

  if (!journey.category) return null

  // Generate outline from discovery answers
  const outline = generateStoryOutline(journey.category, journey.discoveryAnswers)

  // Count non-empty sections
  const filledSections = SECTION_KEYS.filter((key) => outline[key]?.trim().length > 0).length

  const handleContinue = () => {
    onUpdate({ storyOutline: outline })
    onContinue()
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in-up">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <FileText className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-warm-900 md:text-3xl">{t('title')}</h2>
        <p className="mt-2 text-warm-600">{t('subtitle')}</p>
      </div>

      {/* Status Badge */}
      <div className="mb-6 flex justify-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
            filledSections >= 3 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {filledSections >= 3 ? (
            <>
              <CheckCircle className="h-4 w-4" />
              {t('sectionsReady', { count: filledSections, total: SECTION_KEYS.length })}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {t('addMoreLater', { count: filledSections })}
            </>
          )}
        </div>
      </div>

      {/* Outline Sections */}
      <Card className="mb-8">
        <CardContent className="divide-y divide-warm-100 p-0">
          {SECTION_KEYS.map((sectionKey, index) => {
            const content = outline[sectionKey]
            const hasContent = content?.trim().length > 0

            return (
              <div key={sectionKey} className="p-5">
                <div className="flex items-start gap-4">
                  {/* Step Number */}
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      hasContent ? 'bg-primary-500 text-white' : 'bg-warm-100 text-warm-400'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-warm-900">
                        {t(`sections.${sectionKey}.label`)}
                      </h4>
                      {hasContent && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="mt-0.5 text-xs text-warm-500">
                      {t(`sections.${sectionKey}.description`)}
                    </p>

                    {hasContent ? (
                      <div className="mt-3 rounded-lg bg-warm-50 p-3">
                        <p className="text-warm-700">{content}</p>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-lg border border-dashed border-warm-300 bg-warm-50/50 p-3">
                        <p className="text-sm italic text-warm-400">{t('speakDuringRecording')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mb-8 border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <h4 className="flex items-center gap-2 font-semibold text-amber-800">
            <Sparkles className="h-4 w-4" />
            {t('proTips')}
          </h4>
          <ul className="mt-2 space-y-1 text-sm text-amber-700">
            <li>• {t('tip1')}</li>
            <li>• {t('tip2')}</li>
            <li>• {t('tip3')}</li>
            <li>• {t('tip4')}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('editAnswers')}
        </Button>
        <Button onClick={handleContinue} size="lg">
          {t('readyToRecord')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
