// =============================================================================
// CORE DOMAIN TYPES
// These types define the data structures for the entire application.
// When implementing the real backend, these same types should be used.
// =============================================================================

export type TestimonyStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  bio: string | null
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface Testimony {
  id: string
  userId: string
  title: string
  description: string | null
  videoUrl: string
  thumbnailUrl: string | null
  duration: number | null // seconds
  language: string
  tags: string[]
  status: TestimonyStatus
  viewCount: number
  featured: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  // Joined data
  author?: Pick<User, 'id' | 'fullName' | 'avatarUrl'>
}

export interface TestimonyUpload {
  title: string
  description?: string
  language: string
  tags?: string[]
  videoFile: File
}

// =============================================================================
// API RESPONSE TYPES
// Standardized response structures for when we implement the real API
// =============================================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// =============================================================================
// FILTER & QUERY TYPES
// =============================================================================

export interface TestimonyFilters {
  status?: TestimonyStatus
  language?: string
  featured?: boolean
  search?: string
  userId?: string
}

export interface TestimonySort {
  field: 'createdAt' | 'viewCount' | 'publishedAt'
  direction: 'asc' | 'desc'
}

export interface TestimonyQuery {
  filters?: TestimonyFilters
  sort?: TestimonySort
  page?: number
  pageSize?: number
}

// =============================================================================
// AUTH TYPES
// =============================================================================

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  fullName: string
}

// =============================================================================
// WEBHOOK EVENT TYPES (for future implementation)
// =============================================================================

export type WebhookEventType =
  | 'testimony.created'
  | 'testimony.approved'
  | 'testimony.rejected'
  | 'testimony.deleted'
  | 'user.created'
  | 'user.deleted'
  | 'video.processed'
  | 'video.transcoded'

export interface WebhookEvent<T = unknown> {
  id: string
  type: WebhookEventType
  timestamp: string
  data: T
}

export interface TestimonyCreatedEvent {
  testimonyId: string
  userId: string
  title: string
}

export interface VideoProcessedEvent {
  testimonyId: string
  videoUrl: string
  thumbnailUrl: string
  duration: number
}
