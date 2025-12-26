'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Check, X } from 'lucide-react'
import { getPasswordStrength, type PasswordStrength } from '@/lib/validation'
import { cn } from '@metanoia/ui'

interface PasswordStrengthIndicatorProps {
  password: string
  showRequirements?: boolean
  className?: string
}

const STRENGTH_COLORS = {
  0: 'bg-warm-200',
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-accent-500',
}

const STRENGTH_LABELS = {
  0: 'passwordEmpty',
  1: 'passwordWeak',
  2: 'passwordFair',
  3: 'passwordGood',
  4: 'passwordStrong',
}

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
  className,
}: PasswordStrengthIndicatorProps) {
  const t = useTranslations('validation')

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const requirements = useMemo(() => {
    return [
      {
        key: 'length',
        label: t('passwordMinLength', { min: 8 }),
        met: password.length >= 8,
      },
      {
        key: 'mixedCase',
        label: t('passwordMixedCase'),
        met: /[a-z]/.test(password) && /[A-Z]/.test(password),
      },
      {
        key: 'number',
        label: t('passwordNumber'),
        met: /\d/.test(password),
      },
      {
        key: 'special',
        label: t('passwordSpecial'),
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ]
  }, [password, t])

  if (!password) return null

  const strengthLabel = t(STRENGTH_LABELS[strength.score as keyof typeof STRENGTH_LABELS])
  const strengthColor = STRENGTH_COLORS[strength.score as keyof typeof STRENGTH_COLORS]

  return (
    <div className={cn('mt-2 space-y-2', className)}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-warm-600">{t('passwordStrength')}</span>
          <span
            className={cn(
              'font-medium',
              strength.score <= 1 && 'text-red-600',
              strength.score === 2 && 'text-orange-600',
              strength.score === 3 && 'text-yellow-600',
              strength.score === 4 && 'text-accent-600'
            )}
          >
            {strengthLabel}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-200',
                level <= strength.score ? strengthColor : 'bg-warm-200'
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <ul className="space-y-1">
          {requirements.map((req) => (
            <li
              key={req.key}
              className={cn(
                'flex items-center gap-2 text-xs transition-colors duration-200',
                req.met ? 'text-accent-600' : 'text-warm-500'
              )}
            >
              {req.met ? (
                <Check className="h-3.5 w-3.5 flex-shrink-0" />
              ) : (
                <X className="h-3.5 w-3.5 flex-shrink-0" />
              )}
              {req.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export type { PasswordStrength }
