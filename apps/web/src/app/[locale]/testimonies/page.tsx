'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import { TestimonyCard, Button, useToast } from '@metanoia/ui'
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Tag,
  Globe,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Share2,
  Layers,
} from 'lucide-react'
import { ShareModal } from '@/components/sharing'
import { useTestimonies, useTestimonyFilters } from '@/lib/stores/testimony-store'
import { MOCK_TESTIMONIES, getTestimonies } from '@/lib/mock-data'
import { ErrorFallback, InlineError } from '@/components/error-boundary'
import { AnimatedCard, SkeletonTestimonyCard } from '@/components/animations'
import type { Testimony, TestimonySort, StoryCategory } from '@/types'
import { STORY_CATEGORIES } from '@/types'

const ITEMS_PER_PAGE = 9

// Get unique tags from all testimonies
const ALL_TAGS = Array.from(new Set(MOCK_TESTIMONIES.flatMap((t) => t.tags))).sort()

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
]

type SortOption = 'recent' | 'popular' | 'oldest' | 'shortest' | 'longest'

export default function TestimoniesPage() {
  const t = useTranslations('testimonies')
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // State from URL params
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || '')
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'recent'
  )
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [total, setTotal] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [shareTestimony, setShareTestimony] = useState<Testimony | null>(null)

  // Update URL when filters change
  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })

    // Reset page when filters change (except when changing page itself)
    if (!('page' in params)) {
      newParams.delete('page')
    }

    const queryString = newParams.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
  }

  // Fetch testimonies based on filters
  useEffect(() => {
    const loadTestimonies = async () => {
      setIsLoading(true)
      setLoadError(null)

      try {
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Build sort config
        let sort: TestimonySort = { field: 'publishedAt', direction: 'desc' }
        if (sortBy === 'popular') sort = { field: 'viewCount', direction: 'desc' }
        if (sortBy === 'oldest') sort = { field: 'publishedAt', direction: 'asc' }

        const result = getTestimonies({
          filters: {
            status: 'approved',
            category: (selectedCategory as StoryCategory) || undefined,
            language: selectedLanguage || undefined,
            search: search || undefined,
          },
          sort,
          page,
          pageSize: ITEMS_PER_PAGE,
        })

        // Additional client-side filtering for tags and duration sort
        let filtered = result.data

        if (selectedTag) {
          filtered = filtered.filter((t) => t.tags.includes(selectedTag))
        }

        if (sortBy === 'shortest') {
          filtered = [...filtered].sort((a, b) => (a.duration || 0) - (b.duration || 0))
        } else if (sortBy === 'longest') {
          filtered = [...filtered].sort((a, b) => (b.duration || 0) - (a.duration || 0))
        }

        setTestimonies(filtered)
        setTotal(result.total)
      } catch (err) {
        setLoadError('Failed to load testimonies. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadTestimonies()
  }, [search, selectedTag, selectedCategory, selectedLanguage, sortBy, page])

  const handleRetry = () => {
    setLoadError(null)
    setIsLoading(true)
    // Trigger re-fetch by updating a dependency
    setPage((p) => p)
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const hasActiveFilters = !!(selectedTag || selectedCategory || selectedLanguage || search)

  const clearFilters = () => {
    setSearch('')
    setSelectedTag('')
    setSelectedCategory('')
    setSelectedLanguage('')
    setSortBy('recent')
    setPage(1)
    router.push(pathname, { scroll: false })
  }

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up text-center">
          <h1 className="font-display text-4xl font-bold text-warm-900 md:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-warm-600">{t('subtitle')}</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-warm-400" />
              <input
                type="search"
                placeholder={t('search')}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="w-full rounded-lg border border-warm-300 py-3 pl-10 pr-4 text-warm-900 placeholder:text-warm-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-primary-600">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 rounded-lg border border-warm-200 bg-white p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Category Filter */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-warm-700">
                    <Layers className="h-4 w-4" />
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      setPage(1)
                    }}
                    className="w-full rounded-lg border border-warm-300 px-3 py-2 text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="">All Categories</option>
                    {Object.entries(STORY_CATEGORIES).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag Filter */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-warm-700">
                    <Tag className="h-4 w-4" />
                    Topic
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => {
                      setSelectedTag(e.target.value)
                      setPage(1)
                    }}
                    className="w-full rounded-lg border border-warm-300 px-3 py-2 text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="">All Topics</option>
                    {ALL_TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-warm-700">
                    <Globe className="h-4 w-4" />
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value)
                      setPage(1)
                    }}
                    className="w-full rounded-lg border border-warm-300 px-3 py-2 text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="">All Languages</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-warm-700">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as SortOption)
                      setPage(1)
                    }}
                    className="w-full rounded-lg border border-warm-300 px-3 py-2 text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Viewed</option>
                    <option value="oldest">Oldest First</option>
                    <option value="shortest">Shortest</option>
                    <option value="longest">Longest</option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex items-center justify-between border-t border-warm-100 pt-4">
                  <p className="text-sm text-warm-500">
                    {testimonies.length} result{testimonies.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Filter Pills */}
          {hasActiveFilters && !showFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-warm-500">Active filters:</span>
              {selectedCategory && (
                <FilterPill
                  label={`Category: ${STORY_CATEGORIES[selectedCategory as StoryCategory]?.label}`}
                  onRemove={() => setSelectedCategory('')}
                />
              )}
              {selectedTag && (
                <FilterPill label={`Topic: ${selectedTag}`} onRemove={() => setSelectedTag('')} />
              )}
              {selectedLanguage && (
                <FilterPill
                  label={`Language: ${LANGUAGES.find((l) => l.code === selectedLanguage)?.name}`}
                  onRemove={() => setSelectedLanguage('')}
                />
              )}
              {search && (
                <FilterPill label={`Search: "${search}"`} onRemove={() => setSearch('')} />
              )}
              <button onClick={clearFilters} className="text-sm text-primary-600 hover:underline">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loadError ? (
          <div className="py-12">
            <InlineError message={loadError} onRetry={handleRetry} />
          </div>
        ) : isLoading ? (
          <TestimoniesGridSkeleton />
        ) : testimonies.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonies.map((testimony, index) => (
                <div
                  key={testimony.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link href={`/testimonies/${testimony.id}`}>
                    <AnimatedCard hoverEffect="lift" className="h-full">
                      <TestimonyCard
                        id={testimony.id}
                        title={testimony.title}
                        description={testimony.description || undefined}
                        thumbnailUrl={testimony.thumbnailUrl || undefined}
                        duration={testimony.duration || undefined}
                        viewCount={testimony.viewCount}
                        authorName={testimony.author?.fullName || undefined}
                        authorAvatar={testimony.author?.avatarUrl || undefined}
                        category={testimony.category}
                        categoryLabel={
                          testimony.category
                            ? STORY_CATEGORIES[testimony.category]?.label
                            : undefined
                        }
                        className="h-full"
                        onShare={() => setShareTestimony(testimony)}
                      />
                    </AnimatedCard>
                  </Link>
                </div>
              ))}
            </div>

            {/* Share Modal */}
            <ShareModal
              isOpen={!!shareTestimony}
              onClose={() => setShareTestimony(null)}
              url={
                shareTestimony
                  ? `${typeof window !== 'undefined' ? window.location.origin : ''}/testimonies/${shareTestimony.id}`
                  : ''
              }
              title={shareTestimony?.title || ''}
              description={shareTestimony?.description || ''}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  setPage(newPage)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700">
      {label}
      <button onClick={onRemove} className="ml-1 rounded-full p-0.5 hover:bg-primary-200">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const pages = useMemo(() => {
    const items: (number | 'ellipsis')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i)
    } else {
      items.push(1)

      if (currentPage > 3) items.push('ellipsis')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) items.push(i)

      if (currentPage < totalPages - 2) items.push('ellipsis')

      items.push(totalPages)
    }

    return items
  }, [currentPage, totalPages])

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-warm-300 text-warm-700 transition-colors hover:bg-warm-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-warm-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              currentPage === item
                ? 'bg-primary-500 text-white'
                : 'border border-warm-300 text-warm-700 hover:bg-warm-100'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-warm-300 text-warm-700 transition-colors hover:bg-warm-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

function TestimoniesGridSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
          <SkeletonTestimonyCard />
        </div>
      ))}
    </div>
  )
}

function EmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean
  onClearFilters: () => void
}) {
  const t = useTranslations('testimonies')

  return (
    <div className="animate-fade-in-up py-20 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 animate-scale-in items-center justify-center rounded-full bg-warm-100">
        <Search className="h-10 w-10 text-warm-400" />
      </div>
      <h2 className="text-xl font-semibold text-warm-900">No testimonies found</h2>
      <p className="mt-2 text-warm-600">
        {hasFilters ? 'Try adjusting your filters or search terms.' : t('empty')}
      </p>
      {hasFilters && (
        <Button
          variant="outline"
          className="mt-6 transition-transform hover:scale-105"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}
