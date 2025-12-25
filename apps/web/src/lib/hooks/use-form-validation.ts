import { useState, useCallback } from 'react'

export type ValidationRule<T = unknown> = {
  validate: (value: T) => boolean
  message: string
}

export type FieldValidation = ValidationRule[]

export type FormErrors<T> = Partial<Record<keyof T, string>>

export function useFormValidation<T extends Record<string, unknown>>(
  validationRules: Partial<Record<keyof T, FieldValidation>>
) {
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = useCallback(
    (field: keyof T, value: unknown): string | undefined => {
      const rules = validationRules[field]
      if (!rules) return undefined

      for (const rule of rules) {
        if (!rule.validate(value)) {
          return rule.message
        }
      }
      return undefined
    },
    [validationRules]
  )

  const validateAll = useCallback(
    (values: T): boolean => {
      const newErrors: FormErrors<T> = {}
      let isValid = true

      for (const field of Object.keys(validationRules) as Array<keyof T>) {
        const error = validateField(field, values[field])
        if (error) {
          newErrors[field] = error
          isValid = false
        }
      }

      setErrors(newErrors)
      // Mark all fields as touched
      const allTouched = Object.keys(validationRules).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>
      )
      setTouched(allTouched)

      return isValid
    },
    [validationRules, validateField]
  )

  const handleBlur = useCallback(
    (field: keyof T, value: unknown) => {
      setTouched((prev) => ({ ...prev, [field]: true }))
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    },
    [validateField]
  )

  const clearErrors = useCallback(() => {
    setErrors({})
    setTouched({})
  }, [])

  const getFieldError = useCallback(
    (field: keyof T): string | undefined => {
      return touched[field] ? errors[field] : undefined
    },
    [errors, touched]
  )

  return {
    errors,
    touched,
    validateField,
    validateAll,
    handleBlur,
    clearErrors,
    getFieldError,
  }
}

// Common validation rules
export const required = (message = 'This field is required'): ValidationRule => ({
  validate: (value) => {
    if (typeof value === 'string') return value.trim().length > 0
    return value !== null && value !== undefined
  },
  message,
})

export const email = (message = 'Please enter a valid email address'): ValidationRule => ({
  validate: (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message,
})

export const minLength = (
  min: number,
  message = `Must be at least ${min} characters`
): ValidationRule => ({
  validate: (value) => typeof value === 'string' && value.length >= min,
  message,
})

export const maxLength = (
  max: number,
  message = `Must be at most ${max} characters`
): ValidationRule => ({
  validate: (value) => typeof value === 'string' && value.length <= max,
  message,
})

export const match = (
  getOtherValue: () => string,
  message = 'Values do not match'
): ValidationRule => ({
  validate: (value) => value === getOtherValue(),
  message,
})

export const pattern = (regex: RegExp, message: string): ValidationRule => ({
  validate: (value) => typeof value === 'string' && regex.test(value),
  message,
})
