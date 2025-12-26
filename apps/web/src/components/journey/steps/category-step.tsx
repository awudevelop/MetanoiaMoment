'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@metanoia/ui'
import {
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Users,
  Sparkles,
  Heart,
  MessageCircle,
  Trophy,
} from 'lucide-react'
import type { StoryCategory } from '@/types'
import type { JourneyProgress } from '@/lib/story-journey'

interface CategoryStepProps {
  journey: JourneyProgress
  onUpdate: (updates: Partial<JourneyProgress>) => void
  onContinue: () => void
  onBack: () => void
}

const CATEGORY_CONFIG: {
  key: StoryCategory
  translationKey: string
  icon: typeof Lightbulb
  color: string
}[] = [
  {
    key: 'life_wisdom',
    translationKey: 'lifeWisdom',
    icon: Lightbulb,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    key: 'family_history',
    translationKey: 'familyHistory',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    key: 'transformation',
    translationKey: 'transformation',
    icon: Sparkles,
    color: 'bg-green-100 text-green-600',
  },
  {
    key: 'faith_journey',
    translationKey: 'faithJourney',
    icon: Heart,
    color: 'bg-rose-100 text-rose-600',
  },
  {
    key: 'final_messages',
    translationKey: 'finalMessages',
    icon: MessageCircle,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    key: 'milestones',
    translationKey: 'milestones',
    icon: Trophy,
    color: 'bg-orange-100 text-orange-600',
  },
]

export function CategoryStep({ journey, onUpdate, onContinue, onBack }: CategoryStepProps) {
  const t = useTranslations('journey.category')
  const common = useTranslations('common')
  const selectedCategory = journey.category

  const handleSelect = (category: StoryCategory) => {
    onUpdate({ category, discoveryAnswers: {} }) // Reset answers when category changes
  }

  const handleContinue = () => {
    if (selectedCategory) {
      onContinue()
    }
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in-up">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-bold text-warm-900 md:text-3xl">{t('title')}</h2>
        <p className="mt-2 text-warm-600">{t('subtitle')}</p>
      </div>

      {/* Category Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORY_CONFIG.map((cat) => {
          const Icon = cat.icon
          const isSelected = selectedCategory === cat.key

          return (
            <button
              key={cat.key}
              onClick={() => handleSelect(cat.key)}
              className={`group flex flex-col items-start rounded-xl border-2 p-5 text-left transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                  : 'border-warm-200 hover:border-primary-300 hover:bg-warm-50'
              }`}
            >
              <div className="flex w-full items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    isSelected ? 'bg-primary-500 text-white' : cat.color
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                {isSelected && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-warm-900">{t(`${cat.translationKey}.label`)}</h3>
                <p className="mt-0.5 text-sm text-warm-600">
                  {t(`${cat.translationKey}.description`)}
                </p>
                <p className="mt-2 text-xs italic text-warm-400">
                  {t(`${cat.translationKey}.example`)}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          {common('back') || 'Back'}
        </Button>
        <Button onClick={handleContinue} disabled={!selectedCategory} size="lg">
          {common('continue') || 'Continue'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
