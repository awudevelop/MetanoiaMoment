'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { Button, Input, Card, CardContent, useToast } from '@metanoia/ui'
import { useAuthStore, useAuthError } from '@/lib/stores/auth-store'
import { InlineError } from '@/components/error-boundary'
import {
  useFormValidation,
  required,
  email as emailRule,
  minLength,
} from '@/lib/hooks/use-form-validation'
import { useBotProtection } from '@/lib/hooks/use-recaptcha'
import { Shield } from 'lucide-react'

type SignInForm = {
  email: string
  password: string
}

export default function SignInPage() {
  const t = useTranslations('auth.signIn')
  const v = useTranslations('validation')
  const router = useRouter()
  const toast = useToast()
  const { signIn, signInAsDemo, signInAsAdmin, isLoading } = useAuthStore()
  const { error: authError, clearError } = useAuthError()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [botError, setBotError] = useState<string | null>(null)

  // Bot protection
  const {
    validateSubmission,
    honeypotProps,
    isReady: botProtectionReady,
  } = useBotProtection({
    action: 'signin',
  })

  const { validateAll, handleBlur, getFieldError } = useFormValidation<SignInForm>({
    email: [required(v('emailRequired')), emailRule(v('invalidEmail'))],
    password: [required(v('passwordRequired')), minLength(6, v('passwordMinLength', { min: 6 }))],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setBotError(null)

    if (!validateAll({ email, password })) {
      return
    }

    // Validate bot protection
    const botCheck = await validateSubmission()
    if (!botCheck.isValid) {
      setBotError(botCheck.error || v('securityFailed'))
      toast.error(v('securityFailed'), botCheck.error || v('checkFields'))
      return
    }

    const result = await signIn({ email, password })

    if (result.success) {
      toast.success('Welcome back!', 'You have been signed in successfully.')
      router.push('/')
    } else {
      // Error is now in authError state
      toast.error('Sign in failed', result.error.message)
    }
  }

  const handleDemoSignIn = () => {
    signInAsDemo()
    toast.success('Demo mode activated', 'You are now signed in as a demo user.')
    router.push('/')
  }

  const handleAdminSignIn = () => {
    signInAsAdmin()
    toast.success('Admin access granted', 'You are now signed in as an administrator.')
    router.push('/admin')
  }

  return (
    <div className="section flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600">
              <span className="text-2xl font-bold text-white">M</span>
            </div>
          </Link>
          <h1 className="mt-6 font-display text-3xl font-bold text-warm-900">{t('title')}</h1>
          <p className="mt-2 text-warm-600">{t('subtitle')}</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {(authError || botError) && (
                <InlineError message={authError?.message || botError || ''} />
              )}

              {/* Honeypot field - hidden from users, catches bots */}
              <input type="text" {...honeypotProps} />

              <Input
                type="email"
                label={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email', email)}
                error={getFieldError('email')}
                placeholder="michael.r@example.com"
                required
              />

              <Input
                type="password"
                label={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password', password)}
                error={getFieldError('password')}
                placeholder="Any password (demo mode)"
                required
              />

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:underline"
                >
                  {t('forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={!botProtectionReady}
              >
                {t('button')}
              </Button>

              {/* Security indicator */}
              <p className="flex items-center justify-center gap-1 text-xs text-warm-400">
                <Shield className="h-3 w-3" />
                Protected by reCAPTCHA
              </p>
            </form>

            {/* Demo mode buttons */}
            <div className="mt-6 border-t border-warm-200 pt-6">
              <p className="mb-3 text-center text-sm text-warm-500">Demo Mode - Quick Sign In</p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleDemoSignIn}
                >
                  Demo User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleAdminSignIn}
                >
                  Admin User
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-warm-600">
              {t('noAccount')}{' '}
              <Link href="/auth/signup" className="font-medium text-primary-600 hover:underline">
                {t('signUp')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
