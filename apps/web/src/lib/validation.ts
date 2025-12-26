/**
 * Form Validation Utilities
 *
 * Provides reusable validation rules and helpers for form validation.
 * Designed to work with i18n - returns translation keys, not hardcoded messages.
 */

export interface ValidationResult {
  isValid: boolean
  errorKey?: string
  errorParams?: Record<string, string | number>
}

export interface ValidationRule<T = string> {
  validate: (value: T) => boolean
  errorKey: string
  errorParams?: Record<string, string | number>
}

// =============================================================================
// EMAIL VALIDATION
// =============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, errorKey: 'validation.required' }
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, errorKey: 'validation.invalidEmail' }
  }
  return { isValid: true }
}

// =============================================================================
// PASSWORD VALIDATION
// =============================================================================

export interface PasswordStrength {
  score: number // 0-4
  feedback: string[]
  isStrong: boolean
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, errorKey: 'validation.required' }
  }
  if (password.length < 8) {
    return {
      isValid: false,
      errorKey: 'validation.passwordTooShort',
      errorParams: { min: 8 },
    }
  }
  return { isValid: true }
}

export function getPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  if (!password) {
    return { score: 0, feedback: ['validation.passwordEmpty'], isStrong: false }
  }

  // Length checks
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++
  } else {
    feedback.push('validation.passwordMixedCase')
  }

  if (/\d/.test(password)) {
    score++
  } else {
    feedback.push('validation.passwordNumber')
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++
  } else {
    feedback.push('validation.passwordSpecial')
  }

  // Cap at 4
  score = Math.min(4, score)

  return {
    score,
    feedback,
    isStrong: score >= 3,
  }
}

// =============================================================================
// TEXT VALIDATION
// =============================================================================

export function validateRequired(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, errorKey: 'validation.required' }
  }
  return { isValid: true }
}

export function validateMinLength(value: string, min: number): ValidationResult {
  if (!value) {
    return { isValid: false, errorKey: 'validation.required' }
  }
  if (value.length < min) {
    return {
      isValid: false,
      errorKey: 'validation.minLength',
      errorParams: { min },
    }
  }
  return { isValid: true }
}

export function validateMaxLength(value: string, max: number): ValidationResult {
  if (value && value.length > max) {
    return {
      isValid: false,
      errorKey: 'validation.maxLength',
      errorParams: { max },
    }
  }
  return { isValid: true }
}

// =============================================================================
// NAME VALIDATION
// =============================================================================

export function validateName(name: string): ValidationResult {
  if (!name || !name.trim()) {
    return { isValid: false, errorKey: 'validation.required' }
  }
  if (name.length < 2) {
    return {
      isValid: false,
      errorKey: 'validation.nameTooShort',
      errorParams: { min: 2 },
    }
  }
  if (name.length > 100) {
    return {
      isValid: false,
      errorKey: 'validation.nameTooLong',
      errorParams: { max: 100 },
    }
  }
  return { isValid: true }
}

// =============================================================================
// FORM FIELD VALIDATION
// =============================================================================

export type FieldValidators<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

export type FormErrors<T> = {
  [K in keyof T]?: string
}

export function validateForm<T extends Record<string, unknown>>(
  values: T,
  validators: FieldValidators<T>
): FormErrors<T> {
  const errors: FormErrors<T> = {}

  for (const [field, rules] of Object.entries(validators)) {
    if (!rules) continue

    for (const rule of rules as ValidationRule[]) {
      const value = values[field as keyof T]
      if (!rule.validate(value as string)) {
        errors[field as keyof T] = rule.errorKey
        break
      }
    }
  }

  return errors
}

// =============================================================================
// REAL-TIME VALIDATION HOOK HELPERS
// =============================================================================

export interface FieldState {
  value: string
  touched: boolean
  error: string | null
  isValidating: boolean
}

export interface UseFieldValidation {
  validate: () => ValidationResult
  touch: () => void
  reset: () => void
}

// Debounce helper for real-time validation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
