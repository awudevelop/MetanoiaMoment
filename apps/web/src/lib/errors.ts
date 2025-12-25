// =============================================================================
// ERROR HANDLING UTILITIES
// Centralized error handling for consistent error management across the app.
// =============================================================================

export type ErrorCode =
  | 'UNKNOWN'
  | 'NETWORK_ERROR'
  | 'AUTH_REQUIRED'
  | 'AUTH_INVALID'
  | 'AUTH_EXPIRED'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'UPLOAD_FAILED'
  | 'PROCESSING_FAILED'

export interface AppError {
  code: ErrorCode
  message: string
  details?: string
  retryable: boolean
  field?: string // For form validation errors
}

// Error messages by code
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  UNKNOWN: 'An unexpected error occurred. Please try again.',
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  AUTH_REQUIRED: 'Please sign in to continue.',
  AUTH_INVALID: 'Invalid email or password.',
  AUTH_EXPIRED: 'Your session has expired. Please sign in again.',
  NOT_FOUND: 'The requested resource was not found.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  PROCESSING_FAILED: 'Failed to process your request. Please try again.',
}

// Create an AppError from various sources
export function createAppError(
  code: ErrorCode,
  options?: { message?: string; details?: string; field?: string }
): AppError {
  const retryableCodes: ErrorCode[] = ['NETWORK_ERROR', 'RATE_LIMITED', 'SERVER_ERROR', 'UPLOAD_FAILED']

  return {
    code,
    message: options?.message || ERROR_MESSAGES[code],
    details: options?.details,
    retryable: retryableCodes.includes(code),
    field: options?.field,
  }
}

// Parse error from HTTP response
export async function parseHttpError(response: Response): Promise<AppError> {
  const status = response.status

  // Try to parse JSON error body
  let body: { message?: string; error?: string; code?: string } | null = null
  try {
    body = await response.json()
  } catch {
    // Response body is not JSON
  }

  const details = body?.message || body?.error

  switch (status) {
    case 400:
      return createAppError('VALIDATION_ERROR', { details })
    case 401:
      return createAppError('AUTH_REQUIRED', { details })
    case 403:
      return createAppError('FORBIDDEN', { details })
    case 404:
      return createAppError('NOT_FOUND', { details })
    case 429:
      return createAppError('RATE_LIMITED', { details })
    case 500:
    case 502:
    case 503:
    case 504:
      return createAppError('SERVER_ERROR', { details })
    default:
      return createAppError('UNKNOWN', { details })
  }
}

// Parse error from caught exception
export function parseError(error: unknown): AppError {
  // Already an AppError
  if (isAppError(error)) {
    return error
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return createAppError('NETWORK_ERROR')
  }

  // Standard Error objects
  if (error instanceof Error) {
    // Check for common network error messages
    if (
      error.message.includes('network') ||
      error.message.includes('Network') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')
    ) {
      return createAppError('NETWORK_ERROR')
    }

    return createAppError('UNKNOWN', { details: error.message })
  }

  // String errors
  if (typeof error === 'string') {
    return createAppError('UNKNOWN', { details: error })
  }

  return createAppError('UNKNOWN')
}

// Type guard for AppError
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'retryable' in error
  )
}

// Get user-friendly error message
export function getErrorMessage(error: unknown): string {
  const appError = parseError(error)
  return appError.message
}

// Check if error is retryable
export function isRetryableError(error: unknown): boolean {
  const appError = parseError(error)
  return appError.retryable
}

// Result type for operations that can fail
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: AppError }

// Helper to create success result
export function success<T>(data: T): Result<T> {
  return { success: true, data }
}

// Helper to create error result
export function failure<T>(error: AppError | ErrorCode, options?: { message?: string; details?: string }): Result<T> {
  const appError = typeof error === 'string'
    ? createAppError(error, options)
    : error
  return { success: false, error: appError }
}

// Wrap async function with error handling
export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await fn()
    return success(data)
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}

// Retry wrapper for retryable operations
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    delayMs?: number
    backoff?: boolean
    onRetry?: (attempt: number, error: AppError) => void
  } = {}
): Promise<T> {
  const { maxAttempts = 3, delayMs = 1000, backoff = true, onRetry } = options

  let lastError: AppError | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = parseError(error)

      // Don't retry non-retryable errors
      if (!lastError.retryable || attempt === maxAttempts) {
        throw lastError
      }

      onRetry?.(attempt, lastError)

      // Wait before retrying
      const delay = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError || createAppError('UNKNOWN')
}
