'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  type JourneyProgress,
  type JourneyStep,
  createNewJourney,
  getNextStep,
  getPrevStep,
  saveJourneyToStorage,
  loadJourneyFromStorage,
  clearJourneyFromStorage,
} from '@/lib/story-journey'
import { JourneyProgress as JourneyProgressIndicator } from './journey-progress'
import { WelcomeStep } from './steps/welcome-step'
import { CategoryStep } from './steps/category-step'
import { DiscoveryStep } from './steps/discovery-step'
import { OutlineStep } from './steps/outline-step'
import { ReadyStep } from './steps/ready-step'
import type { StoryCategory } from '@/types'
import type { StoryOutline } from '@/lib/story-journey'

interface StoryJourneyProps {
  /** Called when user completes the journey and is ready to record */
  onComplete: (data: {
    category: StoryCategory
    outline: StoryOutline
    email: string | null
  }) => void
  /** Called when user explicitly exits the journey */
  onExit?: () => void
}

export function StoryJourney({ onComplete, onExit }: StoryJourneyProps) {
  const [journey, setJourney] = useState<JourneyProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load existing journey from storage on mount
  useEffect(() => {
    const stored = loadJourneyFromStorage()
    if (stored && !stored.completedAt) {
      setJourney(stored)
    } else {
      setJourney(createNewJourney())
    }
    setIsLoading(false)
  }, [])

  // Save journey to storage whenever it changes
  useEffect(() => {
    if (journey) {
      const updated = {
        ...journey,
        lastActiveAt: new Date().toISOString(),
      }
      saveJourneyToStorage(updated)
    }
  }, [journey])

  const updateJourney = useCallback((updates: Partial<JourneyProgress>) => {
    setJourney((prev) => {
      if (!prev) return prev
      return { ...prev, ...updates }
    })
  }, [])

  const goToStep = useCallback((step: JourneyStep) => {
    setJourney((prev) => {
      if (!prev) return prev
      return { ...prev, step }
    })
  }, [])

  const handleNext = useCallback(() => {
    if (!journey) return
    const next = getNextStep(journey.step)
    if (next) {
      goToStep(next)
    }
  }, [journey, goToStep])

  const handlePrev = useCallback(() => {
    if (!journey) return
    const prev = getPrevStep(journey.step)
    if (prev) {
      goToStep(prev)
    }
  }, [journey, goToStep])

  const handleComplete = useCallback(() => {
    if (!journey || !journey.category || !journey.storyOutline) return

    // Mark journey as completed
    const completedJourney = {
      ...journey,
      completedAt: new Date().toISOString(),
    }
    saveJourneyToStorage(completedJourney)

    // Clear storage for next journey
    clearJourneyFromStorage()

    // Notify parent
    onComplete({
      category: journey.category,
      outline: journey.storyOutline,
      email: journey.email,
    })
  }, [journey, onComplete])

  if (isLoading || !journey) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Indicator */}
      <JourneyProgressIndicator currentStep={journey.step} className="mb-8" />

      {/* Step Content */}
      <div className="mt-8">
        {journey.step === 'welcome' && (
          <WelcomeStep journey={journey} onUpdate={updateJourney} onContinue={handleNext} />
        )}

        {journey.step === 'category' && (
          <CategoryStep
            journey={journey}
            onUpdate={updateJourney}
            onContinue={handleNext}
            onBack={handlePrev}
          />
        )}

        {journey.step === 'discovery' && (
          <DiscoveryStep
            journey={journey}
            onUpdate={updateJourney}
            onContinue={handleNext}
            onBack={handlePrev}
          />
        )}

        {journey.step === 'outline' && (
          <OutlineStep
            journey={journey}
            onUpdate={updateJourney}
            onContinue={handleNext}
            onBack={handlePrev}
          />
        )}

        {journey.step === 'ready' && (
          <ReadyStep journey={journey} onStartRecording={handleComplete} onBack={handlePrev} />
        )}
      </div>
    </div>
  )
}
