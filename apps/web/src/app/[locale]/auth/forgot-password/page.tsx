'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Input, Card, CardContent, useToast } from '@metanoia/ui'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useAuthStore } from '@/lib/stores/auth-store'
import { AnimateOnScroll } from '@/components/animations'

export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPassword')
  const toast = useToast()
  const { resetPassword, isLoading } = useAuthStore()

  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.warning('Email required', 'Please enter your email address.')
      return
    }

    try {
      await resetPassword(email.trim())
      setIsSubmitted(true)
      toast.success(t('sent'), t('sentDescription'))
    } catch {
      toast.error(t('error'), t('errorDescription'))
    }
  }

  return (
    <div className="section flex min-h-[70vh] items-center">
      <div className="container max-w-md">
        <AnimateOnScroll animation="fade-in-up">
          <Card>
            <CardContent className="p-8">
              {isSubmitted ? (
                <SuccessState email={email} />
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                      <Mail className="h-8 w-8 text-primary-600" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-warm-900">
                      {t('title')}
                    </h1>
                    <p className="mt-2 text-warm-600">{t('subtitle')}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label={t('email')}
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail className="h-5 w-5" />}
                      required
                    />

                    <Button type="submit" className="w-full" loading={isLoading}>
                      {t('button')}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      href="/auth/signin"
                      className="inline-flex items-center gap-1 text-sm text-primary-600 transition-colors hover:text-primary-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t('backToSignIn')}
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </AnimateOnScroll>
      </div>
    </div>
  )
}

function SuccessState({ email }: { email: string }) {
  const t = useTranslations('forgotPassword')

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
        <CheckCircle className="h-8 w-8 text-accent-600" />
      </div>
      <h2 className="font-display text-2xl font-bold text-warm-900">{t('sent')}</h2>
      <p className="mt-2 text-warm-600">
        We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
      </p>
      <p className="mt-4 text-sm text-warm-500">
        Didn't receive the email? Check your spam folder or try again.
      </p>
      <div className="mt-6">
        <Link href="/auth/signin">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToSignIn')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
