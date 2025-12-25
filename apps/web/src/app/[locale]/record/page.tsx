'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { VideoRecorder, Button, Input, Textarea, useToast, Card, CardContent } from '@metanoia/ui'
import { Upload, CheckCircle, ArrowRight, ArrowLeft, LogIn, User } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTestimonyStore } from '@/lib/stores/testimony-store'
import { useIsAuthenticated, useUser } from '@/lib/stores/auth-store'
import { InlineError } from '@/components/error-boundary'
import { Confetti } from '@/components/animations/confetti'
import { SocialShare } from '@/components/sharing'

type Step = 'prepare' | 'record' | 'details' | 'success'

export default function RecordPage() {
  const [currentStep, setCurrentStep] = useState<Step>('prepare')
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
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
            <PrepareStep onContinue={() => setCurrentStep('record')} />
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
    <div className="section flex items-center justify-center min-h-[60vh]">
      <div className="container max-w-md">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 animate-scale-in">
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
      <h1 className="font-display text-4xl font-bold text-warm-900 md:text-5xl">
        {t('title')}
      </h1>
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
                index <= currentIndex
                  ? 'bg-primary-500 text-white'
                  : 'bg-warm-200 text-warm-500'
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

function PrepareStep({ onContinue }: { onContinue: () => void }) {
  const t = useTranslations('record.prompts')

  const questions = t.raw('questions') as string[]

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-warm-200 bg-white p-8">
        <h2 className="mb-2 text-xl font-semibold text-warm-900">{t('title')}</h2>
        <p className="mb-6 text-warm-600">{t('intro')}</p>

        <ul className="space-y-4">
          {questions.map((question, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-600">
                {index + 1}
              </span>
              <span className="text-warm-700">{question}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Button onClick={onContinue} size="lg">
            I'm Ready to Record
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
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
  const toast = useToast()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Invalid file', 'Please select a video file.')
      return
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File too large', 'Maximum file size is 100MB.')
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
          <Button variant="outline" as="span" loading={isProcessing}>
            {uploadedFile ? uploadedFile.name : t('upload.browse')}
          </Button>
        </label>
        <p className="mt-2 text-sm text-warm-500">{t('upload.maxSize')}</p>
      </div>
    </div>
  )
}

function DetailsStep({
  videoBlob,
  onSubmit,
  onBack,
}: {
  videoBlob: Blob | null
  onSubmit: () => void
  onBack: () => void
}) {
  const t = useTranslations('record.form')
  const toast = useToast()
  const { uploadTestimony, isLoading, error, clearError } = useTestimonyStore((state) => ({
    uploadTestimony: state.uploadTestimony,
    isLoading: state.isLoading,
    error: state.error,
    clearError: state.clearError,
  }))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('en')
  const [tags, setTags] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!videoBlob) {
      toast.error('No video', 'Please record a video first.')
      return
    }

    if (!title.trim()) {
      toast.warning('Title required', 'Please enter a title for your testimony.')
      return
    }

    const result = await uploadTestimony({
      video: videoBlob,
      title: title.trim(),
      description: description.trim() || undefined,
      language,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
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
          <video
            src={URL.createObjectURL(videoBlob)}
            controls
            className="aspect-video w-full"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <InlineError message={error.message} onRetry={error.retryable ? () => handleSubmit : undefined} />
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
          <label className="mb-2 block text-sm font-medium text-warm-700">
            {t('language')}
          </label>
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
          <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={isLoading}>
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
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://metanoiamoment.org'

  return (
    <div className="mx-auto max-w-lg">
      {/* Confetti */}
      <Confetti active={true} particleCount={60} />

      {/* Success Message */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent-100 animate-bounce-in">
          <CheckCircle className="h-12 w-12 text-accent-500" />
        </div>
        <h2 className="text-3xl font-bold text-warm-900 animate-fade-in-up">{t('title')}</h2>
        <p className="mt-4 text-lg text-warm-600 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {t('message')}
        </p>
      </div>

      {/* Share Section */}
      <div className="mt-10 rounded-xl border border-warm-200 bg-warm-50 p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h3 className="mb-4 text-center font-semibold text-warm-900">
          Share the Good News
        </h3>
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
      <div className="mt-8 rounded-xl bg-primary-50 p-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <p className="text-center text-sm text-primary-700">
          <strong>What happens next?</strong> Your testimony is now pending review.
          We'll notify you by email once it's live!
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <Link href="/record">
          <Button variant="outline" className="w-full sm:w-auto">{t('shareMore')}</Button>
        </Link>
        <Link href="/testimonies">
          <Button className="w-full sm:w-auto">Browse Testimonies</Button>
        </Link>
      </div>
    </div>
  )
}
