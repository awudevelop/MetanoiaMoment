'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Input, Card, CardContent } from '@metanoia/ui'
import { ArrowRight, Heart, Mail, CheckCircle } from 'lucide-react'
import type { JourneyProgress } from '@/lib/story-journey'

interface WelcomeStepProps {
  journey: JourneyProgress
  onUpdate: (updates: Partial<JourneyProgress>) => void
  onContinue: () => void
}

export function WelcomeStep({ journey, onUpdate, onContinue }: WelcomeStepProps) {
  const t = useTranslations('journey.welcome')
  const [email, setEmail] = useState(journey.email || '')
  const [consent, setConsent] = useState(journey.consentToReminders)
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string) => {
    if (!email) return true // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleContinue = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    onUpdate({
      email: email || null,
      consentToReminders: consent,
    })
    onContinue()
  }

  const steps = [t('step1'), t('step2'), t('step3'), t('step4')]

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      {/* Hero Section */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
          <Heart className="h-10 w-10 text-primary-600" />
        </div>
        <h2 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">{t('title')}</h2>
        <p className="mt-4 text-lg text-warm-600">{t('subtitle')}</p>
      </div>

      {/* What to Expect */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold text-warm-900">{t('whatToExpect')}</h3>
          <ul className="space-y-3">
            {steps.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" />
                <span className="text-warm-700">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Email Capture (Early) */}
      <Card className="mb-8 border-primary-200 bg-primary-50/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
              <Mail className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warm-900">{t('saveProgress')}</h3>
              <p className="mt-1 text-sm text-warm-600">{t('saveProgressDescription')}</p>
              <div className="mt-4">
                <Input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError('')
                  }}
                  error={emailError}
                  className="bg-white"
                />
                {email && (
                  <label className="mt-3 flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-warm-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-warm-600">{t('consentLabel')}</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center">
        <Button onClick={handleContinue} size="lg" className="min-w-[200px]">
          {t('letsBegin')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="mt-4 text-sm text-warm-500">{t('duration')}</p>
      </div>
    </div>
  )
}
