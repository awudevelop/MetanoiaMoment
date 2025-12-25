'use client'

import { useState, useCallback, useEffect } from 'react'

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
      render: (container: HTMLElement, options: {
        sitekey: string
        callback: (token: string) => void
        'expired-callback': () => void
        'error-callback': () => void
        size?: 'compact' | 'normal' | 'invisible'
        theme?: 'light' | 'dark'
      }) => number
      reset: (widgetId?: number) => void
    }
  }
}

// reCAPTCHA v3 site key - should be from env in production
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

// Check if reCAPTCHA is configured
export function isRecaptchaEnabled(): boolean {
  return !!RECAPTCHA_SITE_KEY
}

// Load reCAPTCHA script dynamically
function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'))
      return
    }

    // Already loaded
    if (window.grecaptcha) {
      resolve()
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="recaptcha"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
    document.head.appendChild(script)
  })
}

interface UseRecaptchaOptions {
  action?: string
}

interface UseRecaptchaReturn {
  isLoading: boolean
  isReady: boolean
  error: string | null
  executeRecaptcha: () => Promise<string | null>
  resetRecaptcha: () => void
}

export function useRecaptcha(options: UseRecaptchaOptions = {}): UseRecaptchaReturn {
  const { action = 'submit' } = options
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load reCAPTCHA on mount if enabled
  useEffect(() => {
    if (!isRecaptchaEnabled()) {
      // If not enabled, mark as ready so forms can still work
      setIsReady(true)
      return
    }

    loadRecaptchaScript()
      .then(() => {
        window.grecaptcha.ready(() => {
          setIsReady(true)
        })
      })
      .catch((err) => {
        console.error('reCAPTCHA load error:', err)
        setError('Failed to load security verification')
        // Still mark as ready so forms don't get stuck
        setIsReady(true)
      })
  }, [])

  const executeRecaptcha = useCallback(async (): Promise<string | null> => {
    if (!isRecaptchaEnabled()) {
      // Return null token when not configured - server should handle this
      return null
    }

    if (!window.grecaptcha) {
      setError('Security verification not available')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
      setIsLoading(false)
      return token
    } catch (err) {
      console.error('reCAPTCHA execute error:', err)
      setError('Security verification failed')
      setIsLoading(false)
      return null
    }
  }, [action])

  const resetRecaptcha = useCallback(() => {
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    isLoading,
    isReady,
    error,
    executeRecaptcha,
    resetRecaptcha,
  }
}

// Honeypot field component for additional bot protection
interface HoneypotFieldProps {
  name?: string
}

export function useHoneypot(name = 'website') {
  const [value, setValue] = useState('')

  // If honeypot has a value, it's likely a bot
  const isBot = value.length > 0

  return {
    fieldProps: {
      name,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
      tabIndex: -1,
      autoComplete: 'off',
      'aria-hidden': true,
      style: {
        position: 'absolute' as const,
        left: '-9999px',
        top: '-9999px',
        opacity: 0,
        height: 0,
        width: 0,
        pointerEvents: 'none' as const,
      },
    },
    isBot,
  }
}

// Rate limiting helper (client-side)
const submissionTimes: number[] = []
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 5 // max 5 submissions per minute

export function checkRateLimit(): boolean {
  const now = Date.now()

  // Remove old entries
  while (submissionTimes.length > 0 && submissionTimes[0] < now - RATE_LIMIT_WINDOW) {
    submissionTimes.shift()
  }

  if (submissionTimes.length >= RATE_LIMIT_MAX) {
    return false // Rate limited
  }

  submissionTimes.push(now)
  return true
}

// Combined protection hook
export function useBotProtection(options: UseRecaptchaOptions = {}) {
  const recaptcha = useRecaptcha(options)
  const honeypot = useHoneypot()

  const validateSubmission = useCallback(async (): Promise<{
    isValid: boolean
    token: string | null
    error: string | null
  }> => {
    // Check honeypot
    if (honeypot.isBot) {
      return { isValid: false, token: null, error: 'Submission blocked' }
    }

    // Check rate limit
    if (!checkRateLimit()) {
      return { isValid: false, token: null, error: 'Too many submissions. Please wait a moment.' }
    }

    // Get reCAPTCHA token
    const token = await recaptcha.executeRecaptcha()

    // Even if reCAPTCHA fails, we might still allow submission (server decides)
    return {
      isValid: true,
      token,
      error: recaptcha.error,
    }
  }, [honeypot.isBot, recaptcha])

  return {
    ...recaptcha,
    honeypotProps: honeypot.fieldProps,
    validateSubmission,
  }
}
