import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTestimonyStore } from '../testimony-store'

describe('Testimony Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTestimonyStore.setState({
      testimonies: [],
      currentTestimony: null,
      featuredTestimonies: [],
      isLoading: false,
      isLoadingMore: false,
      error: null,
      filters: { status: 'approved' },
      sort: { field: 'publishedAt', direction: 'desc' },
      page: 1,
      pageSize: 12,
      total: 0,
      hasMore: false,
      lastFetched: null,
    })
  })

  describe('initial state', () => {
    it('should have empty testimonies initially', () => {
      const state = useTestimonyStore.getState()
      expect(state.testimonies).toEqual([])
      expect(state.currentTestimony).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should have default filters', () => {
      const state = useTestimonyStore.getState()
      expect(state.filters).toEqual({ status: 'approved' })
      expect(state.sort).toEqual({ field: 'publishedAt', direction: 'desc' })
    })
  })

  describe('fetchTestimonies', () => {
    it('should fetch approved testimonies', async () => {
      const { fetchTestimonies } = useTestimonyStore.getState()

      const result = await fetchTestimonies()

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.length).toBeGreaterThan(0)
        // All should be approved since that's the default filter
        result.data.forEach((t) => {
          expect(t.status).toBe('approved')
        })
      }

      const state = useTestimonyStore.getState()
      expect(state.testimonies.length).toBeGreaterThan(0)
      expect(state.isLoading).toBe(false)
      expect(state.lastFetched).not.toBeNull()
    })

    it('should cache results', async () => {
      const { fetchTestimonies } = useTestimonyStore.getState()

      // First fetch
      await fetchTestimonies()
      const firstFetch = useTestimonyStore.getState().lastFetched

      // Second fetch should use cache
      await fetchTestimonies()
      const secondFetch = useTestimonyStore.getState().lastFetched

      expect(secondFetch).toBe(firstFetch)
    })

    it('should append results when append option is true', async () => {
      const { fetchTestimonies } = useTestimonyStore.getState()

      // First fetch
      await fetchTestimonies()
      const initialCount = useTestimonyStore.getState().testimonies.length

      // Invalidate cache and fetch with append
      useTestimonyStore.setState({ lastFetched: null })
      await fetchTestimonies({ append: true })

      const finalCount = useTestimonyStore.getState().testimonies.length
      expect(finalCount).toBeGreaterThanOrEqual(initialCount)
    })

    it('should set loading state during fetch', async () => {
      const { fetchTestimonies } = useTestimonyStore.getState()

      const promise = fetchTestimonies()

      // Check loading state immediately after starting
      const loadingState = useTestimonyStore.getState()
      expect(loadingState.isLoading).toBe(true)

      await promise

      expect(useTestimonyStore.getState().isLoading).toBe(false)
    })
  })

  describe('fetchTestimonyById', () => {
    it('should fetch a specific testimony', async () => {
      const { fetchTestimonyById } = useTestimonyStore.getState()

      const result = await fetchTestimonyById('testimony-1')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('testimony-1')
        expect(result.data.title).toBe('From Addiction to Freedom')
      }

      const state = useTestimonyStore.getState()
      expect(state.currentTestimony?.id).toBe('testimony-1')
    })

    it('should return cached testimony if already loaded', async () => {
      const { fetchTestimonyById } = useTestimonyStore.getState()

      // First fetch
      await fetchTestimonyById('testimony-1')

      // Second fetch should be instant (cached)
      const start = Date.now()
      await fetchTestimonyById('testimony-1')
      const duration = Date.now() - start

      // Should be much faster than the 300ms simulated delay
      expect(duration).toBeLessThan(100)
    })

    it('should return error for non-existent testimony', async () => {
      const { fetchTestimonyById } = useTestimonyStore.getState()

      const result = await fetchTestimonyById('non-existent')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.code).toBe('NOT_FOUND')
      }
    })
  })

  describe('fetchFeaturedTestimonies', () => {
    it('should fetch featured testimonies', async () => {
      const { fetchFeaturedTestimonies } = useTestimonyStore.getState()

      const result = await fetchFeaturedTestimonies()

      expect(result.success).toBe(true)
      if (result.success) {
        result.data.forEach((t) => {
          expect(t.featured).toBe(true)
          expect(t.status).toBe('approved')
        })
      }

      const state = useTestimonyStore.getState()
      expect(state.featuredTestimonies.length).toBeGreaterThan(0)
    })
  })

  describe('fetchPendingTestimonies', () => {
    it('should fetch pending testimonies', async () => {
      const { fetchPendingTestimonies } = useTestimonyStore.getState()

      const result = await fetchPendingTestimonies()

      expect(result.success).toBe(true)
      if (result.success) {
        result.data.forEach((t) => {
          expect(t.status).toBe('pending')
        })
      }
    })
  })

  describe('setFilters', () => {
    it('should update filters and reset pagination', () => {
      useTestimonyStore.setState({ page: 3, lastFetched: Date.now() })

      const { setFilters } = useTestimonyStore.getState()
      setFilters({ language: 'es' })

      const state = useTestimonyStore.getState()
      expect(state.filters.language).toBe('es')
      expect(state.filters.status).toBe('approved') // Merged with existing
      expect(state.page).toBe(1) // Reset
      expect(state.lastFetched).toBeNull() // Cache invalidated
    })
  })

  describe('setSort', () => {
    it('should update sort and reset pagination', () => {
      useTestimonyStore.setState({ page: 2 })

      const { setSort } = useTestimonyStore.getState()
      setSort({ field: 'viewCount', direction: 'desc' })

      const state = useTestimonyStore.getState()
      expect(state.sort).toEqual({ field: 'viewCount', direction: 'desc' })
      expect(state.page).toBe(1)
    })
  })

  describe('resetFilters', () => {
    it('should reset to default filters', () => {
      const { setFilters, resetFilters } = useTestimonyStore.getState()

      // Set custom filters
      setFilters({ language: 'es', search: 'test' })

      // Reset
      resetFilters()

      const state = useTestimonyStore.getState()
      expect(state.filters).toEqual({ status: 'approved' })
      expect(state.sort).toEqual({ field: 'publishedAt', direction: 'desc' })
      expect(state.page).toBe(1)
    })
  })

  describe('loadMore', () => {
    it('should increment page and append results', async () => {
      const { fetchTestimonies, loadMore } = useTestimonyStore.getState()

      // First fetch
      await fetchTestimonies()

      // Simulate having more pages
      useTestimonyStore.setState({ hasMore: true })

      await loadMore()

      const state = useTestimonyStore.getState()
      expect(state.page).toBe(2)
    })

    it('should not load more if hasMore is false', async () => {
      const { loadMore } = useTestimonyStore.getState()

      useTestimonyStore.setState({ hasMore: false, page: 1 })

      await loadMore()

      expect(useTestimonyStore.getState().page).toBe(1)
    })

    it('should not load more if already loading', async () => {
      const { loadMore } = useTestimonyStore.getState()

      useTestimonyStore.setState({ hasMore: true, isLoadingMore: true, page: 1 })

      await loadMore()

      expect(useTestimonyStore.getState().page).toBe(1)
    })
  })

  describe('clearError', () => {
    it('should clear error state', () => {
      const { clearError } = useTestimonyStore.getState()

      useTestimonyStore.setState({
        error: { code: 'UNKNOWN', message: 'Test error', retryable: false },
      })

      clearError()

      expect(useTestimonyStore.getState().error).toBeNull()
    })
  })

  describe('approveTestimony', () => {
    it('should approve a pending testimony', async () => {
      const { approveTestimony } = useTestimonyStore.getState()

      const result = await approveTestimony('testimony-7')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('approved')
        expect(result.data.publishedAt).not.toBeNull()
      }
    })

    it('should fail for non-existent testimony', async () => {
      const { approveTestimony } = useTestimonyStore.getState()

      const result = await approveTestimony('non-existent')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.code).toBe('NOT_FOUND')
      }
    })
  })

  describe('rejectTestimony', () => {
    it('should reject a pending testimony', async () => {
      const { rejectTestimony } = useTestimonyStore.getState()

      const result = await rejectTestimony('testimony-8')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('rejected')
      }
    })
  })

  describe('incrementViewCount', () => {
    it('should increment view count', async () => {
      const { incrementViewCount, fetchTestimonyById } = useTestimonyStore.getState()

      // Get initial view count
      await fetchTestimonyById('testimony-1')
      const initialCount = useTestimonyStore.getState().currentTestimony?.viewCount || 0

      // Increment
      incrementViewCount('testimony-1')

      // Refetch to check
      useTestimonyStore.setState({ currentTestimony: null })
      await fetchTestimonyById('testimony-1')
      const newCount = useTestimonyStore.getState().currentTestimony?.viewCount || 0

      expect(newCount).toBe(initialCount + 1)
    })
  })
})
