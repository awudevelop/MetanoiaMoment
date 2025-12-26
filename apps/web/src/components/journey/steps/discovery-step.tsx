'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Textarea, Card, CardContent } from '@metanoia/ui'
import { ArrowRight, ArrowLeft, HelpCircle, CheckCircle, MessageSquare } from 'lucide-react'
import type { JourneyProgress } from '@/lib/story-journey'
import { DISCOVERY_QUESTIONS } from '@/lib/story-journey'

interface DiscoveryStepProps {
  journey: JourneyProgress
  onUpdate: (updates: Partial<JourneyProgress>) => void
  onContinue: () => void
  onBack: () => void
}

export function DiscoveryStep({ journey, onUpdate, onContinue, onBack }: DiscoveryStepProps) {
  const t = useTranslations('journey.discovery')
  const common = useTranslations('common')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(journey.discoveryAnswers || {})
  const [showFollowUp, setShowFollowUp] = useState(false)

  const category = journey.category
  if (!category) return null

  const questions = DISCOVERY_QUESTIONS[category]
  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestion.id] || ''

  const isAnswerValid = () => {
    if (!currentQuestion.required && !currentAnswer.trim()) return true
    if (currentQuestion.required && !currentAnswer.trim()) return false
    if (currentQuestion.minLength && currentAnswer.length < currentQuestion.minLength) return false
    return true
  }

  const handleAnswerChange = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)
    onUpdate({ discoveryAnswers: newAnswers })
  }

  const handleNext = () => {
    // Show follow-up message if exists and haven't shown yet
    if (currentQuestion.followUp && currentAnswer.trim() && !showFollowUp) {
      setShowFollowUp(true)
      return
    }

    setShowFollowUp(false)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      onContinue()
    }
  }

  const handlePrev = () => {
    setShowFollowUp(false)
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else {
      onBack()
    }
  }

  const handleSkip = () => {
    if (!currentQuestion.required) {
      setShowFollowUp(false)
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        onContinue()
      }
    }
  }

  const completedCount = Object.keys(answers).filter(
    (key) => answers[key]?.trim().length > 0
  ).length
  const requiredCount = questions.filter((q) => q.required).length
  const requiredCompleted = questions
    .filter((q) => q.required)
    .filter((q) => answers[q.id]?.trim().length > 0).length

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      {/* Progress */}
      <div className="mb-6 text-center">
        <p className="text-sm text-warm-500">
          {t('questionOf', { current: currentQuestionIndex + 1, total: questions.length })}
        </p>
        <div className="mx-auto mt-2 flex max-w-xs gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < currentQuestionIndex
                  ? 'bg-primary-500'
                  : i === currentQuestionIndex
                    ? 'bg-primary-300'
                    : 'bg-warm-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Question Header */}
          <div className="bg-primary-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-warm-900">{currentQuestion.question}</h3>
                {currentQuestion.helpText && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-warm-600">
                    <HelpCircle className="h-4 w-4 text-primary-500" />
                    {currentQuestion.helpText}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Answer Area */}
          <div className="p-6">
            {showFollowUp && currentQuestion.followUp ? (
              <div className="animate-fade-in-up rounded-lg border border-primary-200 bg-primary-50 p-4 text-center">
                <CheckCircle className="mx-auto mb-2 h-8 w-8 text-primary-500" />
                <p className="text-warm-800">{currentQuestion.followUp}</p>
                <Button onClick={handleNext} className="mt-4">
                  {common('continue')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Textarea
                  placeholder={currentQuestion.placeholder}
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  rows={5}
                  className="resize-none text-lg"
                />
                {currentQuestion.minLength && (
                  <p
                    className={`mt-2 text-xs ${
                      currentAnswer.length >= currentQuestion.minLength
                        ? 'text-green-600'
                        : 'text-warm-500'
                    }`}
                  >
                    {currentAnswer.length >= currentQuestion.minLength ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {t('greatDetail')}
                      </span>
                    ) : (
                      `${t('shareMore')} (${t('characters', { current: currentAnswer.length, min: currentQuestion.minLength })})`
                    )}
                  </p>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      {!showFollowUp && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={handlePrev}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            {common('back')}
          </Button>
          <div className="flex gap-3">
            {!currentQuestion.required && (
              <Button variant="ghost" onClick={handleSkip}>
                {common('skip')}
              </Button>
            )}
            <Button onClick={handleNext} disabled={!isAnswerValid()}>
              {currentQuestionIndex < questions.length - 1 ? common('next') : t('seeOutline')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Completion Status */}
      <div className="mt-6 text-center text-sm text-warm-500">
        {requiredCompleted === requiredCount ? (
          <span className="flex items-center justify-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            {t('allRequired')}
          </span>
        ) : (
          <span>
            {t('requiredProgress', { completed: requiredCompleted, total: requiredCount })}
          </span>
        )}
      </div>
    </div>
  )
}
