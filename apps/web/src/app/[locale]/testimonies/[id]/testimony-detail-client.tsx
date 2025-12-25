'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import {
  VideoPlayer,
  Button,
  Card,
  CardContent,
} from '@metanoia/ui'
import {
  ChevronLeft,
  Share2,
  Calendar,
  Clock,
  Eye,
  Globe,
  Tag,
  User,
  Code,
  Copy,
  Check,
  X,
} from 'lucide-react'
import { useTestimonyStore } from '@/lib/stores/testimony-store'
import { getTestimonies } from '@/lib/mock-data'
import { ErrorFallback } from '@/components/error-boundary'
import type { Testimony } from '@/types'

interface TestimonyDetailClientProps {
  testimonyId: string
  initialTestimony: Testimony | null
}

export function TestimonyDetailClient({ testimonyId, initialTestimony }: TestimonyDetailClientProps) {
  const incrementViewCount = useTestimonyStore((state) => state.incrementViewCount)
  const [relatedTestimonies, setRelatedTestimonies] = useState<Testimony[]>([])

  useEffect(() => {
    if (initialTestimony) {
      // Increment view count on client
      incrementViewCount(testimonyId)

      // Get related testimonies
      const all = getTestimonies({ filters: { status: 'approved' } })
      const related = all.data
        .filter((t) => t.id !== initialTestimony.id)
        .filter(
          (t) =>
            t.language === initialTestimony.language ||
            t.tags.some((tag) => initialTestimony.tags.includes(tag))
        )
        .slice(0, 3)
      setRelatedTestimonies(related)
    }
  }, [testimonyId, initialTestimony, incrementViewCount])

  if (!initialTestimony) {
    return <TestimonyNotFound />
  }

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumb title={initialTestimony.title} />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <MainContent testimony={initialTestimony} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TestimonyMeta testimony={initialTestimony} />
            <RelatedTestimonies testimonies={relatedTestimonies} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Breadcrumb({ title }: { title: string }) {
  const t = useTranslations('nav')

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      <Link
        href="/testimonies"
        className="flex items-center gap-1 text-warm-500 transition-colors hover:text-primary-600"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('testimonies')}
      </Link>
      <span className="text-warm-300" aria-hidden="true">/</span>
      <span className="truncate text-warm-700" aria-current="page">{title}</span>
    </nav>
  )
}

function MainContent({ testimony }: { testimony: Testimony }) {
  const [copied, setCopied] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: testimony.title,
          text: testimony.description || '',
          url,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <article>
      {/* Video Player */}
      <div className="overflow-hidden rounded-xl bg-warm-900">
        <VideoPlayer
          src={testimony.videoUrl}
          poster={testimony.thumbnailUrl || undefined}
          className="aspect-video w-full"
        />
      </div>

      {/* Title & Actions */}
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-warm-900 md:text-3xl">
          {testimony.title}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEmbed(true)} aria-label="Get embed code">
            <Code className="mr-2 h-4 w-4" />
            Embed
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} aria-label="Share this testimony">
            <Share2 className="mr-2 h-4 w-4" />
            {copied ? 'Copied!' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Embed Modal */}
      {showEmbed && (
        <EmbedModal
          testimony={testimony}
          onClose={() => setShowEmbed(false)}
        />
      )}

      {/* Author */}
      {testimony.author && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            {testimony.author.avatarUrl ? (
              <img
                src={testimony.author.avatarUrl}
                alt={testimony.author.fullName || ''}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="font-medium text-warm-900">
              {testimony.author.fullName || 'Anonymous'}
            </p>
            <p className="text-sm text-warm-500">
              <time dateTime={testimony.publishedAt || undefined}>
                {testimony.publishedAt &&
                  new Date(testimony.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </time>
            </p>
          </div>
        </div>
      )}

      {/* Description */}
      {testimony.description && (
        <div className="mt-6">
          <p className="whitespace-pre-wrap text-warm-700 leading-relaxed">
            {testimony.description}
          </p>
        </div>
      )}

      {/* Tags */}
      {testimony.tags.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2" role="list" aria-label="Tags">
            {testimony.tags.map((tag) => (
              <Link
                key={tag}
                href={`/testimonies?tag=${tag}`}
                className="inline-flex items-center gap-1 rounded-full bg-warm-100 px-3 py-1 text-sm text-warm-700 transition-colors hover:bg-primary-100 hover:text-primary-700"
                role="listitem"
              >
                <Tag className="h-3 w-3" aria-hidden="true" />
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

function TestimonyMeta({ testimony }: { testimony: Testimony }) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const stats = [
    {
      icon: Eye,
      label: 'Views',
      value: formatViews(testimony.viewCount),
    },
    {
      icon: Clock,
      label: 'Duration',
      value: testimony.duration ? formatDuration(testimony.duration) : '-',
    },
    {
      icon: Globe,
      label: 'Language',
      value: testimony.language.toUpperCase(),
    },
    {
      icon: Calendar,
      label: 'Published',
      value: testimony.publishedAt
        ? new Date(testimony.publishedAt).toLocaleDateString()
        : '-',
    },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="mb-4 font-semibold text-warm-900">Details</h2>
        <dl className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-warm-600">
                <stat.icon className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm">{stat.label}</span>
              </dt>
              <dd className="text-sm font-medium text-warm-900">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

function RelatedTestimonies({ testimonies }: { testimonies: Testimony[] }) {
  if (testimonies.length === 0) return null

  return (
    <aside>
      <h2 className="mb-4 font-semibold text-warm-900">Related Testimonies</h2>
      <div className="space-y-4">
        {testimonies.map((testimony) => (
          <Link key={testimony.id} href={`/testimonies/${testimony.id}`}>
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-warm-100">
                    {testimony.thumbnailUrl ? (
                      <img
                        src={testimony.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Eye className="h-6 w-6 text-warm-300" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-medium text-warm-900">
                      {testimony.title}
                    </h3>
                    <p className="mt-1 text-xs text-warm-500">
                      {testimony.author?.fullName || 'Anonymous'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </aside>
  )
}

function TestimonyNotFound() {
  return (
    <div className="section">
      <div className="container">
        <div className="mx-auto max-w-md py-20 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-warm-100">
            <Eye className="h-10 w-10 text-warm-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-warm-900">Testimony Not Found</h1>
          <p className="mt-2 text-warm-600">
            This testimony may have been removed or doesn't exist.
          </p>
          <Link href="/testimonies" className="mt-6 inline-block">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Testimonies
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function EmbedModal({ testimony, onClose }: { testimony: Testimony; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium')

  const sizes = {
    small: { width: 480, height: 270 },
    medium: { width: 640, height: 360 },
    large: { width: 854, height: 480 },
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://metanoiamoment.org'
  const embedUrl = `${baseUrl}/embed/${testimony.id}`

  const embedCode = `<iframe
  src="${embedUrl}"
  width="${sizes[size].width}"
  height="${sizes[size].height}"
  frameborder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowfullscreen
  title="${testimony.title}"
></iframe>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
            <Code className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-warm-900">Embed Testimony</h2>
            <p className="text-sm text-warm-500">Share this testimony on your website</p>
          </div>
        </div>

        {/* Size selector */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-warm-700">Size</label>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  size === s
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-warm-300 text-warm-700 hover:bg-warm-50'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="block text-xs text-warm-500">
                  {sizes[s].width}x{sizes[s].height}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Code preview */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-warm-700">Embed Code</label>
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg bg-warm-900 p-4 text-xs text-warm-100">
              <code>{embedCode}</code>
            </pre>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-warm-700">Preview</label>
          <div
            className="overflow-hidden rounded-lg border border-warm-200 bg-warm-50"
            style={{ aspectRatio: `${sizes[size].width}/${sizes[size].height}` }}
          >
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Eye className="mx-auto h-8 w-8 text-warm-300" />
                <p className="mt-2 text-sm text-warm-500">{testimony.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
