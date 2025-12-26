'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { VideoRecorder, Button, Input, Textarea, useToast, Card, CardContent } from '@metanoia/ui'
import {
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  LogIn,
  User,
  Lightbulb,
  Users,
  Sparkles,
  Heart,
  MessageCircle,
  Trophy,
  Shuffle,
} from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTestimonyStore } from '@/lib/stores/testimony-store'
import { useIsAuthenticated, useUser } from '@/lib/stores/auth-store'
import { InlineError } from '@/components/error-boundary'
import { Confetti } from '@/components/animations/confetti'
import { SocialShare } from '@/components/sharing'
import { STORY_CATEGORIES, type StoryCategory, type Prompt } from '@/types'
import { getPromptsByCategory, getRandomPrompt } from '@/lib/mock-data'

type Step = 'prepare' | 'record' | 'details' | 'success'

// Category icons mapping
const CATEGORY_ICONS = {
  life_wisdom: Lightbulb,
  family_history: Users,
  transformation: Sparkles,
  faith_journey: Heart,
  final_messages: MessageCircle,
  milestones: Trophy,
}

export default function RecordPage() {
  const [currentStep, setCurrentStep] = useState<Step>('prepare')
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const isAuthenticated = useIsAuthenticated()

  // Show auth prompt if not signed in
  if (!isAuthenticated) {
    return <AuthPrompt />
  }

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <RecordHeader />
        <StepIndicator currentStep={currentStep} />

        <div className="mt-12">
          {currentStep === 'prepare' && (
            <PrepareStep
              selectedCategory={selectedCategory}
              selectedPrompt={selectedPrompt}
              onCategoryChange={(category) => {
                setSelectedCategory(category)
                setSelectedPrompt(null) // Reset prompt when category changes
              }}
              onPromptChange={setSelectedPrompt}
              onContinue={() => setCurrentStep('record')}
            />
          )}
          {currentStep === 'record' && (
            <RecordStep
              onRecordingComplete={(blob) => {
                setRecordedBlob(blob)
                setCurrentStep('details')
              }}
              onBack={() => setCurrentStep('prepare')}
            />
          )}
          {currentStep === 'details' && (
            <DetailsStep
              videoBlob={recordedBlob}
              selectedCategory={selectedCategory}
              selectedPrompt={selectedPrompt}
              onSubmit={() => setCurrentStep('success')}
              onBack={() => setCurrentStep('record')}
            />
          )}
          {currentStep === 'success' && <SuccessStep />}
        </div>
      </div>
    </div>
  )
}

function AuthPrompt() {
  const t = useTranslations('record')

  return (
    <div className="section flex min-h-[60vh] items-center justify-center">
      <div className="container max-w-md">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 animate-scale-in items-center justify-center rounded-full bg-primary-100">
              <User className="h-10 w-10 text-primary-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-warm-900">
              Sign In to Share Your Story
            </h2>
            <p className="mt-3 text-warm-600">
              Create an account or sign in to record and share your testimony with the world.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/auth/signin">
                <Button className="w-full">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-warm-500">
              By sharing your testimony, you agree to our{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RecordHeader() {
  const t = useTranslations('record')

  return (
    <div className="text-center">
      <h1 className="font-display text-4xl font-bold text-warm-900 md:text-5xl">{t('title')}</h1>
      <p className="mt-4 text-lg text-warm-600">{t('subtitle')}</p>
    </div>
  )
}

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const t = useTranslations('record.steps')

  const steps = [
    { key: 'prepare', title: t('prepare.title') },
    { key: 'record', title: t('record.title') },
    { key: 'submit', title: t('submit.title') },
  ]

  const getStepIndex = (step: Step) => {
    if (step === 'prepare') return 0
    if (step === 'record') return 1
    return 2
  }

  const currentIndex = getStepIndex(currentStep)

  return (
    <div className="mt-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                index <= currentIndex ? 'bg-primary-500 text-white' : 'bg-warm-200 text-warm-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 hidden text-sm font-medium sm:block ${
                index <= currentIndex ? 'text-warm-900' : 'text-warm-400'
              }`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-12 sm:w-20 ${
                  index < currentIndex ? 'bg-primary-500' : 'bg-warm-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PrepareStep({
  selectedCategory,
  selectedPrompt,
  onCategoryChange,
  onPromptChange,
  onContinue,
}: {
  selectedCategory: StoryCategory | null
  selectedPrompt: Prompt | null
  onCategoryChange: (category: StoryCategory) => void
  onPromptChange: (prompt: Prompt | null) => void
  onContinue: () => void
}) {
  const t = useTranslations('record')
  const locale = useLocale()

  const prompts = selectedCategory ? getPromptsByCategory(selectedCategory) : []

  const handleRandomPrompt = () => {
    if (selectedCategory) {
      const random = getRandomPrompt(selectedCategory)
      onPromptChange(random)
    }
  }

  const getPromptText = (prompt: Prompt) => {
    return prompt.promptText[locale] || prompt.promptText['en'] || ''
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step 1: Choose Category */}
      <div className="rounded-xl border border-warm-200 bg-white p-6 sm:p-8">
        <h2 className="mb-2 text-xl font-semibold text-warm-900">{t('category.title')}</h2>
        <p className="mb-6 text-warm-600">{t('category.subtitle')}</p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(STORY_CATEGORIES).map(([key, { label, description }]) => {
            const Icon = CATEGORY_ICONS[key as StoryCategory]
            const isSelected = selectedCategory === key
            return (
              <button
                key={key}
                onClick={() => onCategoryChange(key as StoryCategory)}
                className={`group flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                    : 'border-warm-200 hover:border-primary-300 hover:bg-warm-50'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : 'bg-warm-100 text-warm-600 group-hover:bg-primary-100 group-hover:text-primary-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-warm-900">{label}</h3>
                  <p className="mt-0.5 text-xs text-warm-500">{description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2: Choose Prompt (shown when category is selected) */}
      {selectedCategory && (
        <div className="mt-6 animate-fade-in-up rounded-xl border border-warm-200 bg-white p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-warm-900">{t('prompts.title')}</h2>
              <p className="text-warm-600">{t('prompts.intro')}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRandomPrompt}>
              <Shuffle className="mr-2 h-4 w-4" />
              {t('prompts.inspire')}
            </Button>
          </div>

          <div className="space-y-3">
            {prompts.map((prompt) => {
              const isSelected = selectedPrompt?.id === prompt.id
              return (
                <button
                  key={prompt.id}
                  onClick={() => onPromptChange(isSelected ? null : prompt)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-warm-200 hover:border-primary-300 hover:bg-warm-50'
                  }`}
                >
                  <p className="text-warm-800">{getPromptText(prompt)}</p>
                  {isSelected && (
                    <p className="mt-2 text-xs text-primary-600">✓ {t('prompts.selected')}</p>
                  )}
                </button>
              )
            })}
          </div>

          <p className="mt-4 text-center text-sm text-warm-500">{t('prompts.optional')}</p>
        </div>
      )}

      {/* Continue Button */}
      <div className="mt-8 flex justify-center">
        <Button onClick={onContinue} size="lg" disabled={!selectedCategory}>
          {t('prompts.ready')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

function RecordStep({
  onRecordingComplete,
  onBack,
}: {
  onRecordingComplete: (blob: Blob) => void
  onBack: () => void
}) {
  const t = useTranslations('record')
  const v = useTranslations('validation')
  const toast = useToast()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error(v('invalidFile'), v('invalidFileDescription'))
      return
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(v('fileTooLarge'), v('fileTooLargeDescription'))
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)

    // Convert file to blob and pass to parent
    try {
      const blob = new Blob([await file.arrayBuffer()], { type: file.type })
      onRecordingComplete(blob)
      toast.success('Video uploaded', 'Your video is ready for the next step.')
    } catch {
      toast.error('Upload failed', 'Could not process the video file.')
      setUploadedFile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <VideoRecorder onRecordingComplete={onRecordingComplete} maxDuration={600} />

      <div className="mt-8 text-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Preparation
        </Button>
      </div>

      {/* Upload alternative */}
      <div className="mt-12 rounded-xl border-2 border-dashed border-warm-300 bg-warm-50 p-8 text-center transition-colors hover:border-primary-400 hover:bg-primary-50/50">
        <Upload className="mx-auto h-12 w-12 text-warm-400" />
        <h3 className="mt-4 text-lg font-semibold text-warm-900">{t('upload.title')}</h3>
        <p className="mt-2 text-warm-600">{t('upload.description')}</p>
        <label className="mt-4 inline-block cursor-pointer">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isProcessing}
          />
          <span className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-primary-500 px-6 font-medium text-primary-600 transition-all duration-200 hover:bg-primary-50 active:bg-primary-100">
            {isProcessing ? (
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : null}
            {uploadedFile ? uploadedFile.name : t('upload.browse')}
          </span>
        </label>
        <p className="mt-2 text-sm text-warm-500">{t('upload.maxSize')}</p>
      </div>
    </div>
  )
}

function DetailsStep({
  videoBlob,
  selectedCategory,
  selectedPrompt,
  onSubmit,
  onBack,
}: {
  videoBlob: Blob | null
  selectedCategory: StoryCategory | null
  selectedPrompt: Prompt | null
  onSubmit: () => void
  onBack: () => void
}) {
  const t = useTranslations('record.form')
  const v = useTranslations('validation')
  const locale = useLocale()
  const toast = useToast()
  const { uploadTestimony, isLoading, error, clearError } = useTestimonyStore((state) => ({
    uploadTestimony: state.uploadTestimony,
    isLoading: state.isLoading,
    error: state.error,
    clearError: state.clearError,
  }))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<StoryCategory>(selectedCategory || 'life_wisdom')
  const [language, setLanguage] = useState('en')
  const [tags, setTags] = useState('')

  const getPromptText = (prompt: Prompt) => {
    return prompt.promptText[locale] || prompt.promptText['en'] || ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!videoBlob) {
      toast.error(v('noVideo'), v('noVideoDescription'))
      return
    }

    if (!title.trim()) {
      toast.warning(v('titleRequired'), v('titleRequiredDescription'))
      return
    }

    const result = await uploadTestimony({
      video: videoBlob,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      language,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      promptId: selectedPrompt?.id,
    })

    if (result.success) {
      toast.success('Testimony submitted!', 'Your testimony is now pending review.')
      onSubmit()
    } else {
      toast.error('Upload failed', result.error.message)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 overflow-hidden rounded-xl bg-black">
        {videoBlob && (
          <video src={URL.createObjectURL(videoBlob)} controls className="aspect-video w-full" />
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <InlineError
            message={error.message}
            onRetry={error.retryable ? () => handleSubmit : undefined}
          />
        )}

        {/* Show selected prompt if any */}
        {selectedPrompt && (
          <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
              {t('answering')}
            </p>
            <p className="mt-1 text-warm-800">{getPromptText(selectedPrompt)}</p>
          </div>
        )}

        <Input
          label={t('title')}
          placeholder={t('titlePlaceholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          label={t('description')}
          placeholder={t('descriptionPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-warm-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as StoryCategory)}
            className="w-full rounded-lg border border-warm-300 px-4 py-3 text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {Object.entries(STORY_CATEGORIES).map(([key, { label, description }]) => (
              <option key={key} value={key}>
                {label} - {description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-warm-700">{t('language')}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-warm-300 px-4 py-3 text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="pt">Português</option>
            <option value="zh">中文</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        <Input
          label={t('tags')}
          placeholder={t('tagsPlaceholder')}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <Button type="submit" loading={isLoading} className="flex-1">
            Submit Testimony
          </Button>
        </div>
      </form>
    </div>
  )
}

function SuccessStep() {
  const t = useTranslations('record.success')
  const shareUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://metanoiamoment.org'

  return (
    <div className="mx-auto max-w-lg">
      {/* Confetti */}
      <Confetti active={true} particleCount={60} />

      {/* Success Message */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 animate-bounce-in items-center justify-center rounded-full bg-accent-100">
          <CheckCircle className="h-12 w-12 text-accent-500" />
        </div>
        <h2 className="animate-fade-in-up text-3xl font-bold text-warm-900">{t('title')}</h2>
        <p
          className="mt-4 animate-fade-in-up text-lg text-warm-600"
          style={{ animationDelay: '100ms' }}
        >
          {t('message')}
        </p>
      </div>

      {/* Share Section */}
      <div
        className="mt-10 animate-fade-in-up rounded-xl border border-warm-200 bg-warm-50 p-6"
        style={{ animationDelay: '200ms' }}
      >
        <h3 className="mb-4 text-center font-semibold text-warm-900">Share the Good News</h3>
        <p className="mb-6 text-center text-sm text-warm-600">
          Spread the word! Let others know about your testimony.
        </p>
        <SocialShare
          url={shareUrl}
          title="I just shared my testimony on Metanoia Moment!"
          description="Join me in sharing how Jesus transformed my life."
          showQR={true}
        />
      </div>

      {/* Next Steps */}
      <div
        className="mt-8 animate-fade-in-up rounded-xl bg-primary-50 p-4"
        style={{ animationDelay: '300ms' }}
      >
        <p className="text-center text-sm text-primary-700">
          <strong>What happens next?</strong> Your testimony is now pending review. We'll notify you
          by email once it's live!
        </p>
      </div>

      {/* Actions */}
      <div
        className="mt-8 flex animate-fade-in-up flex-col gap-4 sm:flex-row sm:justify-center"
        style={{ animationDelay: '400ms' }}
      >
        <Link href="/record">
          <Button variant="outline" className="w-full sm:w-auto">
            {t('shareMore')}
          </Button>
        </Link>
        <Link href="/testimonies">
          <Button className="w-full sm:w-auto">Browse Testimonies</Button>
        </Link>
      </div>
    </div>
  )
}
