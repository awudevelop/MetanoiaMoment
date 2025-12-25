import { create } from 'zustand'
import type { Testimony, TestimonyFilters, TestimonySort, TestimonyUpload } from '@/types'
import {
  getTestimonies as getMockTestimonies,
  getTestimonyById as getMockTestimonyById,
  getFeaturedTestimonies as getMockFeaturedTestimonies,
  getPendingTestimonies as getMockPendingTestimonies,
  MOCK_TESTIMONIES,
} from '@/lib/mock-data'
import {
  createAppError,
  parseError,
  type AppError,
  type Result,
  success,
  failure,
} from '@/lib/errors'

// =============================================================================
// TESTIMONY STORE
// Manages testimony state on the frontend.
// When implementing the real backend, replace mock calls with API calls.
// =============================================================================

interface TestimonyState {
  testimonies: Testimony[]
  currentTestimony: Testimony | null
  featuredTestimonies: Testimony[]
  isLoading: boolean
  isLoadingMore: boolean
  error: AppError | null
  filters: TestimonyFilters
  sort: TestimonySort
  page: number
  pageSize: number
  total: number
  hasMore: boolean
  lastFetched: number | null
}

interface TestimonyActions {
  // Fetch actions
  fetchTestimonies: (options?: { append?: boolean }) => Promise<Result<Testimony[]>>
  fetchTestimonyById: (id: string) => Promise<Result<Testimony>>
  fetchFeaturedTestimonies: () => Promise<Result<Testimony[]>>
  fetchPendingTestimonies: () => Promise<Result<Testimony[]>>

  // Filter/sort/pagination
  setFilters: (filters: TestimonyFilters) => void
  setSort: (sort: TestimonySort) => void
  setPage: (page: number) => void
  loadMore: () => Promise<void>
  resetFilters: () => void

  // Error handling
  clearError: () => void
  retry: () => Promise<void>

  // Mutations
  uploadTestimony: (data: TestimonyUpload) => Promise<Result<Testimony>>
  approveTestimony: (id: string) => Promise<Result<Testimony>>
  rejectTestimony: (id: string) => Promise<Result<Testimony>>
  deleteTestimony: (id: string) => Promise<Result<void>>
  incrementViewCount: (id: string) => void
}

type TestimonyStore = TestimonyState & TestimonyActions

const defaultSort: TestimonySort = { field: 'publishedAt', direction: 'desc' }
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const useTestimonyStore = create<TestimonyStore>((set, get) => ({
  testimonies: [],
  currentTestimony: null,
  featuredTestimonies: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  filters: { status: 'approved' },
  sort: defaultSort,
  page: 1,
  pageSize: 12,
  total: 0,
  hasMore: false,
  lastFetched: null,

  fetchTestimonies: async (options = {}): Promise<Result<Testimony[]>> => {
    const { filters, sort, page, pageSize, lastFetched } = get()
    const { append = false } = options

    // Check cache validity
    if (!append && lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      return success(get().testimonies)
    }

    set({
      isLoading: !append,
      isLoadingMore: append,
      error: null,
    })

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const result = getMockTestimonies({ filters, sort, page, pageSize })

      set({
        testimonies: append ? [...get().testimonies, ...result.data] : result.data,
        total: result.total,
        hasMore: result.hasMore,
        isLoading: false,
        isLoadingMore: false,
        lastFetched: Date.now(),
      })

      return success(result.data)
    } catch (err) {
      const error = parseError(err)
      set({
        error,
        isLoading: false,
        isLoadingMore: false,
      })
      return { success: false, error }
    }
  },

  fetchTestimonyById: async (id: string): Promise<Result<Testimony>> => {
    // Check if already loaded
    const existing = get().currentTestimony
    if (existing?.id === id) {
      return success(existing)
    }

    set({ isLoading: true, error: null, currentTestimony: null })

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const testimony = getMockTestimonyById(id)
      if (testimony) {
        set({ currentTestimony: testimony, isLoading: false })
        return success(testimony)
      }

      const error = createAppError('NOT_FOUND', {
        message: 'This testimony could not be found. It may have been removed.',
      })
      set({ error, isLoading: false })
      return { success: false, error }
    } catch (err) {
      const error = parseError(err)
      set({ error, isLoading: false })
      return { success: false, error }
    }
  },

  fetchFeaturedTestimonies: async (): Promise<Result<Testimony[]>> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const testimonies = getMockFeaturedTestimonies()
      set({ featuredTestimonies: testimonies })
      return success(testimonies)
    } catch (err) {
      return { success: false, error: parseError(err) }
    }
  },

  fetchPendingTestimonies: async (): Promise<Result<Testimony[]>> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const testimonies = getMockPendingTestimonies()
      return success(testimonies)
    } catch (err) {
      return { success: false, error: parseError(err) }
    }
  },

  setFilters: (filters: TestimonyFilters) => {
    set({
      filters: { ...get().filters, ...filters },
      page: 1,
      lastFetched: null, // Invalidate cache
    })
    get().fetchTestimonies()
  },

  setSort: (sort: TestimonySort) => {
    set({
      sort,
      page: 1,
      lastFetched: null,
    })
    get().fetchTestimonies()
  },

  setPage: (page: number) => {
    set({ page })
    get().fetchTestimonies()
  },

  loadMore: async () => {
    const { hasMore, page, isLoadingMore } = get()
    if (!hasMore || isLoadingMore) return

    set({ page: page + 1 })
    await get().fetchTestimonies({ append: true })
  },

  resetFilters: () => {
    set({
      filters: { status: 'approved' },
      sort: defaultSort,
      page: 1,
      lastFetched: null,
    })
    get().fetchTestimonies()
  },

  clearError: () => {
    set({ error: null })
  },

  retry: async () => {
    const { currentTestimony } = get()
    if (currentTestimony) {
      await get().fetchTestimonyById(currentTestimony.id)
    } else {
      await get().fetchTestimonies()
    }
  },

  // ==========================================================================
  // MUTATION STUBS
  // These simulate backend operations. Replace with real API calls later.
  // ==========================================================================

  uploadTestimony: async (data: TestimonyUpload): Promise<Result<Testimony>> => {
    set({ isLoading: true, error: null })

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // STUB: In real implementation, upload video to storage and create record
      const newTestimony: Testimony = {
        id: `testimony-${Date.now()}`,
        userId: 'current-user',
        title: data.title,
        description: data.description || null,
        videoUrl: URL.createObjectURL(data.video),
        thumbnailUrl: null,
        duration: null,
        language: data.language,
        tags: data.tags || [],
        status: 'pending',
        viewCount: 0,
        likeCount: 0,
        shareCount: 0,
        featured: false,
        author: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: null,
      }

      // Add to mock data
      MOCK_TESTIMONIES.push(newTestimony)

      set({ isLoading: false, lastFetched: null })
      return success(newTestimony)
    } catch (err) {
      const error = createAppError('UPLOAD_FAILED', {
        details: err instanceof Error ? err.message : undefined,
      })
      set({ error, isLoading: false })
      return { success: false, error }
    }
  },

  approveTestimony: async (id: string): Promise<Result<Testimony>> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const testimony = MOCK_TESTIMONIES.find((t) => t.id === id)
      if (!testimony) {
        return failure('NOT_FOUND')
      }

      testimony.status = 'approved'
      testimony.publishedAt = new Date().toISOString()

      set({ lastFetched: null }) // Invalidate cache
      return success(testimony)
    } catch (err) {
      return { success: false, error: parseError(err) }
    }
  },

  rejectTestimony: async (id: string): Promise<Result<Testimony>> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const testimony = MOCK_TESTIMONIES.find((t) => t.id === id)
      if (!testimony) {
        return failure('NOT_FOUND')
      }

      testimony.status = 'rejected'

      set({ lastFetched: null })
      return success(testimony)
    } catch (err) {
      return { success: false, error: parseError(err) }
    }
  },

  deleteTestimony: async (id: string): Promise<Result<void>> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const index = MOCK_TESTIMONIES.findIndex((t) => t.id === id)
      if (index === -1) {
        return failure('NOT_FOUND')
      }

      MOCK_TESTIMONIES.splice(index, 1)

      set({ lastFetched: null })
      return success(undefined)
    } catch (err) {
      return { success: false, error: parseError(err) }
    }
  },

  incrementViewCount: (id: string) => {
    // STUB: In real app, this would be an API call
    const testimony = MOCK_TESTIMONIES.find((t) => t.id === id)
    if (testimony) {
      testimony.viewCount += 1
    }
  },
}))

// =============================================================================
// HELPER HOOKS
// =============================================================================

export function useTestimonies() {
  return useTestimonyStore((state) => ({
    testimonies: state.testimonies,
    isLoading: state.isLoading,
    error: state.error,
    hasMore: state.hasMore,
    total: state.total,
    fetch: state.fetchTestimonies,
    loadMore: state.loadMore,
    retry: state.retry,
  }))
}

export function useCurrentTestimony() {
  return useTestimonyStore((state) => ({
    testimony: state.currentTestimony,
    isLoading: state.isLoading,
    error: state.error,
    fetch: state.fetchTestimonyById,
    retry: state.retry,
  }))
}

export function useFeaturedTestimonies() {
  return useTestimonyStore((state) => ({
    testimonies: state.featuredTestimonies,
    fetch: state.fetchFeaturedTestimonies,
  }))
}

export function useTestimonyFilters() {
  return useTestimonyStore((state) => ({
    filters: state.filters,
    sort: state.sort,
    setFilters: state.setFilters,
    setSort: state.setSort,
    reset: state.resetFilters,
  }))
}
