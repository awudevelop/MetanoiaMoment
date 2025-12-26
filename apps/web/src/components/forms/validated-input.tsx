'use client'

import { useState, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Input, cn } from '@metanoia/ui'
import { Check, AlertCircle } from 'lucide-react'
import { PasswordStrengthIndicator } from './password-strength'
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateName,
  type ValidationResult,
} from '@/lib/validation'

export type ValidationType = 'email' | 'password' | 'name' | 'required' | 'custom'

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
  validationType?: ValidationType
  customValidation?: (value: string) => ValidationResult
  showPasswordStrength?: boolean
  validateOnBlur?: boolean
  validateOnChange?: boolean
  onValidationChange?: (isValid: boolean, error: string | null) => void
}

export function ValidatedInput({
  label,
  icon,
  validationType = 'required',
  customValidation,
  showPasswordStrength = false,
  validateOnBlur = true,
  validateOnChange = false,
  onValidationChange,
  className,
  value,
  onChange,
  onBlur,
  type,
  ...props
}: ValidatedInputProps) {
  const t = useTranslations('validation')
  const [touched, setTouched] = useState(false)
  const [internalValue, setInternalValue] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)

  const currentValue = (value as string) ?? internalValue

  const validate = useCallback(
    (val: string): ValidationResult => {
      if (customValidation) {
        return customValidation(val)
      }

      switch (validationType) {
        case 'email':
          return validateEmail(val)
        case 'password':
          return validatePassword(val)
        case 'name':
          return validateName(val)
        case 'required':
        default:
          return validateRequired(val)
      }
    },
    [validationType, customValidation]
  )

  const translateError = useCallback(
    (result: ValidationResult): string | null => {
      if (result.isValid || !result.errorKey) return null
      return t(result.errorKey.replace('validation.', ''), result.errorParams || {})
    },
    [t]
  )

  const handleValidation = useCallback(
    (val: string) => {
      const result = validate(val)
      const error = translateError(result)
      setValidationError(error)
      setIsValid(result.isValid)
      onValidationChange?.(result.isValid, error)
    },
    [validate, translateError, onValidationChange]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setInternalValue(val)
      onChange?.(e)

      if (validateOnChange || touched) {
        handleValidation(val)
      }
    },
    [onChange, validateOnChange, touched, handleValidation]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true)
      onBlur?.(e)

      if (validateOnBlur) {
        handleValidation(e.target.value)
      }
    },
    [onBlur, validateOnBlur, handleValidation]
  )

  // Determine if we should show success state
  const showSuccess = touched && isValid && currentValue.length > 0
  const showError = touched && validationError

  // Status icon for the input
  const statusIcon = useMemo(() => {
    if (!touched || !currentValue) return icon

    if (showSuccess) {
      return (
        <div className="relative">
          {icon}
          <Check className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-accent-500 p-0.5 text-white" />
        </div>
      )
    }

    if (showError) {
      return (
        <div className="relative">
          {icon}
          <AlertCircle className="absolute -bottom-1 -right-1 h-3 w-3 text-red-500" />
        </div>
      )
    }

    return icon
  }, [touched, currentValue, showSuccess, showError, icon])

  return (
    <div className="w-full">
      <Input
        label={label}
        icon={statusIcon}
        error={showError ? validationError || undefined : undefined}
        type={type}
        value={currentValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          showSuccess && 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20',
          className
        )}
        {...props}
      />

      {/* Password Strength Indicator */}
      {showPasswordStrength && type === 'password' && (
        <PasswordStrengthIndicator password={currentValue} showRequirements={touched} />
      )}
    </div>
  )
}
