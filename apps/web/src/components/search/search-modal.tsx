'use client'

import { useState, useEffect, useCallback, Fragment } from 'react'
import { useTranslations } from 'next-intl'
import { Search, X, Video, Clock, TrendingUp, Loader2 } from 'lucide-react'
import { cn, Button } from '@metanoia/ui'
import { Link } from '@/i18n/routing'
import { useTestimonyStore } from '@/lib/stores/testimony-store'
import { debounce } from '@/lib/validation'
import type { Testimony } from '@/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const t = useTranslations('search')
  const { testimonies, fetchTestimonies } = useTestimonyStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Testimony[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [])

  // Fetch testimonies if not loaded
  useEffect(() => {
    if (isOpen && testimonies.length === 0) {
      fetchTestimonies()
    }
  }, [isOpen, testimonies.length, fetchTestimonies])

  // Search function
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const q = searchQuery.toLowerCase()

      // Simple client-side search - in production this would hit an API
      const filtered = testimonies.filter((t) => {
        return (
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.author?.fullName?.toLowerCase().includes(q)
        )
      })

      // Simulate API delay
      setTimeout(() => {
        setResults(filtered.slice(0, 10))
        setIsLoading(false)
      }, 150)
    },
    [testimonies]
  )

  // Debounced search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(performSearch, 300), [performSearch])

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  const handleResultClick = (testimony: Testimony) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
    onClose()
  }

  const handleRecentClick = (search: string) => {
    setQuery(search)
    performSearch(search)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl md:inset-x-auto">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-warm-100 px-4 py-3">
            <Search className="h-5 w-5 flex-shrink-0 text-warm-400" />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder={t('placeholder')}
              className="flex-1 bg-transparent text-lg text-warm-900 placeholder:text-warm-400 focus:outline-none"
              autoFocus
            />
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-primary-500" />}
            {query && !isLoading && (
              <button
                onClick={() => {
                  setQuery('')
                  setResults([])
                }}
                className="rounded-full p-1 text-warm-400 hover:bg-warm-100 hover:text-warm-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button onClick={onClose} className="ml-2 text-sm text-warm-500 hover:text-warm-700">
              {t('cancel')}
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Search Results */}
            {query && results.length > 0 && (
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-warm-500">
                  {t('results', { count: results.length })}
                </p>
                <ul>
                  {results.map((testimony) => (
                    <li key={testimony.id}>
                      <Link
                        href={`/testimonies/${testimony.id}`}
                        onClick={() => handleResultClick(testimony)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-warm-50"
                      >
                        {/* Thumbnail */}
                        <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-warm-100">
                          {testimony.thumbnailUrl ? (
                            <img
                              src={testimony.thumbnailUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Video className="h-5 w-5 text-warm-400" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-warm-900">{testimony.title}</p>
                          <p className="truncate text-sm text-warm-500">
                            {testimony.author?.fullName || 'Anonymous'} &middot;{' '}
                            {testimony.category}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No Results */}
            {query && results.length === 0 && !isLoading && (
              <div className="px-4 py-8 text-center">
                <Search className="mx-auto h-10 w-10 text-warm-300" />
                <p className="mt-2 text-warm-600">{t('noResults')}</p>
                <p className="mt-1 text-sm text-warm-400">{t('tryDifferent')}</p>
              </div>
            )}

            {/* Recent Searches & Suggestions (when no query) */}
            {!query && (
              <div className="p-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-warm-500">
                        <Clock className="h-4 w-4" />
                        {t('recent')}
                      </p>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-warm-400 hover:text-warm-600"
                      >
                        {t('clearRecent')}
                      </button>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {recentSearches.map((search, i) => (
                        <li key={i}>
                          <button
                            onClick={() => handleRecentClick(search)}
                            className="rounded-full bg-warm-100 px-3 py-1.5 text-sm text-warm-700 transition-colors hover:bg-warm-200"
                          >
                            {search}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Trending/Popular */}
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-warm-500">
                    <TrendingUp className="h-4 w-4" />
                    {t('trending')}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {['Addiction Recovery', 'Marriage Restored', 'Healing', 'Faith Journey'].map(
                      (topic) => (
                        <li key={topic}>
                          <button
                            onClick={() => handleRecentClick(topic)}
                            className="rounded-full border border-warm-200 px-3 py-1.5 text-sm text-warm-600 transition-colors hover:bg-warm-50"
                          >
                            {topic}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-warm-100 bg-warm-50 px-4 py-2">
            <p className="text-center text-xs text-warm-400">{t('hint')}</p>
          </div>
        </div>
      </div>
    </>
  )
}
