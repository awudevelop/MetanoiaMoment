'use client'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JourneyStep } from '@/lib/story-journey'

interface JourneyProgressProps {
  currentStep: JourneyStep
  className?: string
}

const STEP_KEYS: JourneyStep[] = ['welcome', 'category', 'discovery', 'outline', 'ready']

export function JourneyProgress({ currentStep, className = '' }: JourneyProgressProps) {
  const t = useTranslations('journey.progress')
  const currentIndex = STEP_KEYS.indexOf(currentStep)

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {STEP_KEYS.map((stepKey, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={stepKey} className="flex items-center">
            {/* Step Circle */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                isCompleted
                  ? 'bg-primary-500 text-white'
                  : isCurrent
                    ? 'bg-primary-500 text-white ring-4 ring-primary-200'
                    : 'bg-warm-200 text-warm-500'
              }`}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
            </div>

            {/* Step Label (hidden on mobile) */}
            <span
              className={`ml-2 hidden text-sm font-medium md:block ${
                isCompleted || isCurrent ? 'text-warm-900' : 'text-warm-400'
              }`}
            >
              {t(stepKey)}
            </span>

            {/* Connector Line */}
            {index < STEP_KEYS.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-8 md:mx-4 md:w-12 ${
                  isCompleted ? 'bg-primary-500' : 'bg-warm-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
