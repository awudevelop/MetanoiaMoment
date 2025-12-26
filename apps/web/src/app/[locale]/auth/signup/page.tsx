'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/i18n/routing'
import { Button, Input, Card, CardContent, useToast } from '@metanoia/ui'
import { useAuthStore, useAuthError } from '@/lib/stores/auth-store'
import { InlineError } from '@/components/error-boundary'
import { PasswordStrengthIndicator } from '@/components/forms'
import { CheckCircle, Shield, User, Mail, Lock } from 'lucide-react'
import {
  useFormValidation,
  required,
  email as emailRule,
  minLength,
  match,
} from '@/lib/hooks/use-form-validation'
import { useBotProtection, isRecaptchaEnabled } from '@/lib/hooks/use-recaptcha'

type SignUpForm = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignUpPage() {
  const t = useTranslations('auth.signUp')
  const v = useTranslations('validation')
  const router = useRouter()
  const toast = useToast()
  const { signUp, isLoading } = useAuthStore()
  const { error: authError, clearError } = useAuthError()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [botError, setBotError] = useState<string | null>(null)

  // Bot protection
  const {
    validateSubmission,
    honeypotProps,
    isReady: botProtectionReady,
  } = useBotProtection({
    action: 'signup',
  })

  const { validateAll, handleBlur, getFieldError } = useFormValidation<SignUpForm>({
    name: [required(v('nameRequired')), minLength(2, v('nameMinLength', { min: 2 }))],
    email: [required(v('emailRequired')), emailRule(v('invalidEmail'))],
    password: [required(v('passwordRequired')), minLength(8, v('passwordMinLength', { min: 8 }))],
    confirmPassword: [
      required(v('confirmPasswordRequired')),
      match(() => password, v('passwordMatch')),
    ],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setBotError(null)

    if (!validateAll({ name, email, password, confirmPassword })) {
      toast.warning(v('formErrors'), v('checkFields'))
      return
    }

    // Validate bot protection
    const botCheck = await validateSubmission()
    if (!botCheck.isValid) {
      setBotError(botCheck.error || v('securityFailed'))
      toast.error(v('securityFailed'), botCheck.error || v('checkFields'))
      return
    }

    // In production, send botCheck.token to backend for verification
    const result = await signUp({ email, password, fullName: name })

    if (result.success) {
      setSuccess(true)
      toast.success('Account created!', 'Welcome to Metanoia Moment.')
    } else {
      toast.error('Sign up failed', result.error.message)
    }
  }

  if (success) {
    return (
      <div className="section flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
            <CheckCircle className="h-8 w-8 text-accent-600" />
          </div>
          <h2 className="text-2xl font-bold text-warm-900">Account Created!</h2>
          <p className="mt-4 text-warm-600">
            Welcome to Metanoia Moment, <strong>{name}</strong>. You can now share your testimony
            with the world.
          </p>
          <p className="mt-2 text-sm text-warm-500">
            (In production, email verification would be required)
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.push('/')}>
              Return Home
            </Button>
            <Button onClick={() => router.push('/record')}>Share Testimony</Button>
          </div>
        </div>
      </div>
    )
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
                type="text"
                label={t('name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name', name)}
                error={getFieldError('name')}
                icon={<User className="h-5 w-5" />}
                required
              />

              <Input
                type="email"
                label={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email', email)}
                error={getFieldError('email')}
                icon={<Mail className="h-5 w-5" />}
                required
              />

              <div>
                <Input
                  type="password"
                  label={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password', password)}
                  error={getFieldError('password')}
                  icon={<Lock className="h-5 w-5" />}
                  required
                />
                <PasswordStrengthIndicator
                  password={password}
                  showRequirements={password.length > 0}
                />
              </div>

              <Input
                type="password"
                label={t('confirmPassword')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                error={getFieldError('confirmPassword')}
                icon={<Lock className="h-5 w-5" />}
                required
              />

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

            <div className="mt-6 text-center text-sm text-warm-600">
              {t('hasAccount')}{' '}
              <Link href="/auth/signin" className="font-medium text-primary-600 hover:underline">
                {t('signIn')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
