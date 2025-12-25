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
import { Shield, User, Video, Settings } from 'lucide-react'

// Demo credentials for quick testing
const DEMO_CREDENTIALS = {
  user: { email: 'user@demo.com', password: 'demo123' },
  creator: { email: 'creator@demo.com', password: 'demo123' },
  admin: { email: 'admin@demo.com', password: 'demo123' },
} as const

type SignInForm = {
  email: string
  password: string
}

export default function SignInPage() {
  const t = useTranslations('auth.signIn')
  const v = useTranslations('validation')
  const router = useRouter()
  const toast = useToast()
  const { signIn, signInAsUser, signInAsCreator, signInAsAdmin, isLoading } = useAuthStore()
  const { error: authError, clearError } = useAuthError()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [botError, setBotError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<'user' | 'creator' | 'admin' | null>(null)

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

  // Pre-fill credentials when a demo role is selected
  const handleSelectRole = (role: 'user' | 'creator' | 'admin') => {
    setSelectedRole(role)
    setEmail(DEMO_CREDENTIALS[role].email)
    setPassword(DEMO_CREDENTIALS[role].password)
    clearError()
    setBotError(null)
  }

  // Instant sign-in for demo roles (no form submission needed)
  const handleQuickSignIn = (role: 'user' | 'creator' | 'admin') => {
    if (role === 'user') {
      signInAsUser()
      toast.success('Welcome!', 'Signed in as Demo User.')
      router.push('/account')
    } else if (role === 'creator') {
      signInAsCreator()
      toast.success('Welcome Creator!', 'Signed in as Demo Creator.')
      router.push('/creator')
    } else {
      signInAsAdmin()
      toast.success('Admin Access', 'Signed in as Demo Admin.')
      router.push('/admin')
    }
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

            {/* Demo Portal Selection */}
            <div className="mt-6 border-t border-warm-200 pt-6">
              <p className="mb-4 text-center text-sm font-medium text-warm-700">
                Quick Demo Access
              </p>
              <div className="grid grid-cols-3 gap-2">
                {/* User Portal */}
                <button
                  type="button"
                  onClick={() => handleQuickSignIn('user')}
                  onMouseEnter={() => handleSelectRole('user')}
                  className={`group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-primary-500 hover:bg-primary-50 ${
                    selectedRole === 'user'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-warm-200 bg-white'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-warm-700">User</span>
                </button>

                {/* Creator Portal */}
                <button
                  type="button"
                  onClick={() => handleQuickSignIn('creator')}
                  onMouseEnter={() => handleSelectRole('creator')}
                  className={`group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-primary-500 hover:bg-primary-50 ${
                    selectedRole === 'creator'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-warm-200 bg-white'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-200">
                    <Video className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-warm-700">Creator</span>
                </button>

                {/* Admin Portal */}
                <button
                  type="button"
                  onClick={() => handleQuickSignIn('admin')}
                  onMouseEnter={() => handleSelectRole('admin')}
                  className={`group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-primary-500 hover:bg-primary-50 ${
                    selectedRole === 'admin'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-warm-200 bg-white'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-200">
                    <Settings className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-warm-700">Admin</span>
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-warm-400">
                Click to sign in instantly, or hover to pre-fill credentials
              </p>
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
