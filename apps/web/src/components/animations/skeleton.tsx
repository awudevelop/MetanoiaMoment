'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-warm-200',
        className
      )}
    />
  )
}

export function SkeletonText({ className, lines = 3 }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-xl border border-warm-200 bg-white p-4', className)}>
      <Skeleton className="mb-4 aspect-video w-full rounded-lg" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-4 h-4 w-1/2" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export function SkeletonTestimonyCard({ className }: SkeletonProps) {
  return (
    <div className={cn('group relative overflow-hidden rounded-xl bg-white shadow-sm', className)}>
      <Skeleton className="aspect-video w-full" />
      <div className="p-4">
        <Skeleton className="mb-2 h-5 w-4/5" />
        <Skeleton className="mb-3 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonAvatar({ className, size = 'md' }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  return <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />
}

export function SkeletonButton({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-24 rounded-lg', className)} />
}

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-warm-200', className)}>
      {/* Header */}
      <div className="flex gap-4 border-b border-warm-200 bg-warm-50 p-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 border-b border-warm-100 p-4 last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonStats({ count = 4, className }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn('grid gap-4', className)} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-warm-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-6 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonVideoPlayer({ className }: SkeletonProps) {
  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-xl bg-warm-900', className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-16 w-16 rounded-full bg-warm-700" />
          <Skeleton className="h-4 w-24 bg-warm-700" />
        </div>
      </div>
    </div>
  )
}
