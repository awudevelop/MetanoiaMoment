import * as React from 'react'
import {
  Play,
  Clock,
  Eye,
  Share2,
  Lightbulb,
  Users,
  Sparkles,
  Heart,
  MessageCircle,
  Trophy,
} from 'lucide-react'
import { cn } from '../lib/utils'

export type StoryCategory =
  | 'life_wisdom'
  | 'family_history'
  | 'transformation'
  | 'faith_journey'
  | 'final_messages'
  | 'milestones'

const CATEGORY_CONFIG: Record<
  StoryCategory,
  { icon: React.ElementType; label: string; color: string }
> = {
  life_wisdom: { icon: Lightbulb, label: 'Life Wisdom', color: 'bg-amber-100 text-amber-700' },
  family_history: { icon: Users, label: 'Family History', color: 'bg-blue-100 text-blue-700' },
  transformation: {
    icon: Sparkles,
    label: 'Transformation',
    color: 'bg-purple-100 text-purple-700',
  },
  faith_journey: { icon: Heart, label: 'Faith Journey', color: 'bg-rose-100 text-rose-700' },
  final_messages: {
    icon: MessageCircle,
    label: 'Final Messages',
    color: 'bg-teal-100 text-teal-700',
  },
  milestones: { icon: Trophy, label: 'Milestones', color: 'bg-green-100 text-green-700' },
}

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
  category?: StoryCategory
  categoryLabel?: string // Optional custom label (for i18n)
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
  category,
  categoryLabel,
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
      <div className="bg-warm-200 relative aspect-video overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="from-primary-100 to-primary-200 flex h-full items-center justify-center bg-gradient-to-br">
            <Play className="text-primary-500 h-12 w-12" />
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <div className="bg-primary-500 scale-0 rounded-full p-3 text-white shadow-lg transition-transform group-hover:scale-100">
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
            className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onShare?.()
            }}
          >
            {shareButton || (
              <button
                type="button"
                className="text-warm-700 hover:text-primary-600 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
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
        {/* Category badge */}
        {category && CATEGORY_CONFIG[category] && (
          <div
            className={cn(
              'mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              CATEGORY_CONFIG[category].color
            )}
          >
            {React.createElement(CATEGORY_CONFIG[category].icon, { className: 'h-3 w-3' })}
            <span>{categoryLabel || CATEGORY_CONFIG[category].label}</span>
          </div>
        )}

        <h3 className="text-warm-900 group-hover:text-primary-600 mb-1 line-clamp-2 font-semibold transition-colors">
          {title}
        </h3>

        {description && <p className="text-warm-600 mb-3 line-clamp-2 text-sm">{description}</p>}

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
                <div className="bg-primary-100 text-primary-600 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-warm-600 text-sm">{authorName}</span>
            </div>
          )}

          {/* View count */}
          {viewCount !== undefined && (
            <div className="text-warm-500 flex items-center gap-1 text-sm">
              <Eye className="h-4 w-4" />
              {formatViews(viewCount)}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
