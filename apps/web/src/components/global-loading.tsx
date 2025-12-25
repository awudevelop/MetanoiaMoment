'use client'

import { useAppStore } from '@/lib/stores/app-store'

export function GlobalLoadingOverlay() {
  const globalLoading = useAppStore((state) => state.globalLoading)

  if (!globalLoading) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
        </div>
        {globalLoading.message && (
          <p className="text-warm-600">{globalLoading.message}</p>
        )}
      </div>
    </div>
  )
}

// Inline loading spinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div
      className={`animate-spin rounded-full border-primary-200 border-t-primary-500 ${sizes[size]}`}
    />
  )
}

// Loading state for sections
export function SectionLoading({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" />
      {message && <p className="mt-4 text-warm-600">{message}</p>}
    </div>
  )
}
