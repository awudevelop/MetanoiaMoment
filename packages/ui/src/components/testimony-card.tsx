import * as React from 'react'
import { Play, Clock, Eye, Share2 } from 'lucide-react'
import { cn } from '../lib/utils'

export interface TestimonyCardProps {
  id: string
  title: string
  description?: string
  thumbnailUrl?: string
  duration?: number // in seconds
  viewCount?: number
  authorName?: string
  authorAvatar?: string
  language?: string
  className?: string
  onClick?: () => void
  onShare?: () => void
  shareButton?: React.ReactNode
}

export function TestimonyCard({
  id,
  title,
  description,
  thumbnailUrl,
  duration,
  viewCount,
  authorName,
  authorAvatar,
  className,
  onClick,
  onShare,
  shareButton,
}: TestimonyCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <article
      className={cn(
        'group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg',
        className
      )}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-warm-200">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <Play className="h-12 w-12 text-primary-500" />
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <div className="scale-0 rounded-full bg-primary-500 p-3 text-white shadow-lg transition-transform group-hover:scale-100">
            <Play className="h-6 w-6" fill="currentColor" />
          </div>
        </div>

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
            <Clock className="h-3 w-3" />
            {formatDuration(duration)}
          </div>
        )}

        {/* Share button */}
        {(onShare || shareButton) && (
          <div
            className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onShare?.()
            }}
          >
            {shareButton || (
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-warm-700 shadow-md transition-colors hover:bg-white hover:text-primary-600"
                aria-label="Share testimony"
              >
                <Share2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 font-semibold text-warm-900 transition-colors group-hover:text-primary-600">
          {title}
        </h3>

        {description && (
          <p className="mb-3 line-clamp-2 text-sm text-warm-600">{description}</p>
        )}

        <div className="flex items-center justify-between">
          {/* Author */}
          {authorName && (
            <div className="flex items-center gap-2">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-600">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-warm-600">{authorName}</span>
            </div>
          )}

          {/* View count */}
          {viewCount !== undefined && (
            <div className="flex items-center gap-1 text-sm text-warm-500">
              <Eye className="h-4 w-4" />
              {formatViews(viewCount)}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
