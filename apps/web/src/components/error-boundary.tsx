'use client'

import { Component, type ReactNode } from 'react'
import { Button } from '@metanoia/ui'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { parseError, type AppError } from '@/lib/errors'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: AppError) => void
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: AppError | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: parseError(error),
    }
  }

  componentDidCatch(error: Error) {
    const appError = parseError(error)
    this.props.onError?.(appError)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: AppError | null
  onReset?: () => void
  minimal?: boolean
}

export function ErrorFallback({ error, onReset, minimal }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  if (minimal) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-amber-500" />
        <p className="mt-2 text-sm text-warm-600">
          {error?.message || 'Something went wrong'}
        </p>
        {error?.retryable && onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-amber-100 p-4">
        <AlertTriangle className="h-10 w-10 text-amber-600" />
      </div>

      <h2 className="mt-6 font-display text-2xl font-bold text-warm-900">
        Something went wrong
      </h2>

      <p className="mt-2 max-w-md text-warm-600">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>

      {error?.details && (
        <p className="mt-2 text-sm text-warm-500">
          {error.details}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        {error?.retryable && onReset && (
          <Button onClick={onReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
        <Button variant="outline" onClick={handleGoHome}>
          <Home className="mr-2 h-4 w-4" />
          Go Home
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-8 w-full max-w-lg rounded-lg bg-warm-100 p-4 text-left">
          <summary className="cursor-pointer text-sm font-medium text-warm-700">
            Error Details (Development Only)
          </summary>
          <pre className="mt-2 overflow-auto text-xs text-warm-600">
            {JSON.stringify(error, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}

// Inline error display for smaller components
export function InlineError({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm">
      <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />
      <span className="text-red-700">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-auto flex items-center gap-1 text-red-600 hover:text-red-800"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  )
}
