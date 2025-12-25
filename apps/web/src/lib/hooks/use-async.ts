import { useState, useCallback, useRef, useEffect } from 'react'
import { parseError, type AppError, type Result, withRetry } from '@/lib/errors'

// =============================================================================
// USE ASYNC HOOK
// A hook for managing async operations with loading, error, and retry states.
// =============================================================================

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: AppError) => void
  retryCount?: number
  retryDelay?: number
}

interface UseAsyncState<T> {
  data: T | null
  isLoading: boolean
  error: AppError | null
  isSuccess: boolean
  isError: boolean
}

interface UseAsyncActions<T, Args extends unknown[]> {
  execute: (...args: Args) => Promise<Result<T>>
  reset: () => void
  retry: () => Promise<Result<T>>
  setData: (data: T | null) => void
}

type UseAsyncReturn<T, Args extends unknown[]> = UseAsyncState<T> & UseAsyncActions<T, Args>

export function useAsync<T, Args extends unknown[] = []>(
  asyncFn: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, Args> {
  const { onSuccess, onError, retryCount = 0, retryDelay = 1000 } = options

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false,
  })

  const lastArgsRef = useRef<Args | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const execute = useCallback(
    async (...args: Args): Promise<Result<T>> => {
      lastArgsRef.current = args

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        isError: false,
      }))

      try {
        let data: T

        if (retryCount > 0) {
          data = await withRetry(() => asyncFn(...args), {
            maxAttempts: retryCount + 1,
            delayMs: retryDelay,
          })
        } else {
          data = await asyncFn(...args)
        }

        if (mountedRef.current) {
          setState({
            data,
            isLoading: false,
            error: null,
            isSuccess: true,
            isError: false,
          })
          onSuccess?.(data)
        }

        return { success: true, data }
      } catch (err) {
        const error = parseError(err)

        if (mountedRef.current) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error,
            isSuccess: false,
            isError: true,
          }))
          onError?.(error)
        }

        return { success: false, error }
      }
    },
    [asyncFn, onSuccess, onError, retryCount, retryDelay]
  )

  const retry = useCallback(async (): Promise<Result<T>> => {
    if (lastArgsRef.current) {
      return execute(...lastArgsRef.current)
    }
    return { success: false, error: parseError(new Error('No previous call to retry')) }
  }, [execute])

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
      isError: false,
    })
    lastArgsRef.current = null
  }, [])

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }))
  }, [])

  return {
    ...state,
    execute,
    reset,
    retry,
    setData,
  }
}

// =============================================================================
// USE ASYNC EFFECT
// Like useEffect, but for async operations with automatic cleanup.
// =============================================================================

export function useAsyncEffect<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList,
  options: UseAsyncOptions<T> = {}
): UseAsyncState<T> & { retry: () => Promise<void> } {
  const { onSuccess, onError, retryCount = 0, retryDelay = 1000 } = options

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    isLoading: true,
    error: null,
    isSuccess: false,
    isError: false,
  })

  const asyncFnRef = useRef(asyncFn)
  asyncFnRef.current = asyncFn

  const runAsync = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      isError: false,
    }))

    try {
      let data: T

      if (retryCount > 0) {
        data = await withRetry(() => asyncFnRef.current(), {
          maxAttempts: retryCount + 1,
          delayMs: retryDelay,
        })
      } else {
        data = await asyncFnRef.current()
      }

      setState({
        data,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
      })
      onSuccess?.(data)
    } catch (err) {
      const error = parseError(err)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error,
        isSuccess: false,
        isError: true,
      }))
      onError?.(error)
    }
  }, [retryCount, retryDelay, onSuccess, onError])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!cancelled) {
        await runAsync()
      }
    }

    run()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    ...state,
    retry: runAsync,
  }
}

// =============================================================================
// USE MUTATION
// For mutations that should show loading state and handle errors.
// =============================================================================

interface UseMutationOptions<T, Args extends unknown[]> {
  onSuccess?: (data: T, args: Args) => void
  onError?: (error: AppError, args: Args) => void
  onSettled?: (data: T | null, error: AppError | null, args: Args) => void
}

export function useMutation<T, Args extends unknown[] = []>(
  mutationFn: (...args: Args) => Promise<T>,
  options: UseMutationOptions<T, Args> = {}
) {
  const { onSuccess, onError, onSettled } = options

  const [state, setState] = useState<{
    isLoading: boolean
    error: AppError | null
    data: T | null
  }>({
    isLoading: false,
    error: null,
    data: null,
  })

  const mutate = useCallback(
    async (...args: Args): Promise<Result<T>> => {
      setState({ isLoading: true, error: null, data: null })

      try {
        const data = await mutationFn(...args)
        setState({ isLoading: false, error: null, data })
        onSuccess?.(data, args)
        onSettled?.(data, null, args)
        return { success: true, data }
      } catch (err) {
        const error = parseError(err)
        setState({ isLoading: false, error, data: null })
        onError?.(error, args)
        onSettled?.(null, error, args)
        return { success: false, error }
      }
    },
    [mutationFn, onSuccess, onError, onSettled]
  )

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null })
  }, [])

  return {
    ...state,
    mutate,
    reset,
    isSuccess: state.data !== null && !state.error,
    isError: state.error !== null,
  }
}
