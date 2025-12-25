import type { User, Testimony, TestimonyFilters, TestimonySort } from '@/types'

// =============================================================================
// MOCK USERS
// =============================================================================

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'michael.r@example.com',
    fullName: 'Michael Robinson',
    avatarUrl: null,
    bio: 'Saved by grace, sharing my story.',
    isAdmin: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    email: 'sarah.m@example.com',
    fullName: 'Sarah Mitchell',
    avatarUrl: null,
    bio: 'Walking in faith since 2018.',
    isAdmin: false,
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'user-3',
    email: 'david.k@example.com',
    fullName: 'David Kim',
    avatarUrl: null,
    bio: 'Former prodigal, now home.',
    isAdmin: false,
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@metanoiamoment.com',
    fullName: 'Admin User',
    avatarUrl: null,
    bio: null,
    isAdmin: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// =============================================================================
// MOCK TESTIMONIES
// =============================================================================

export const MOCK_TESTIMONIES: Testimony[] = [
  {
    id: 'testimony-1',
    userId: 'user-1',
    title: 'From Addiction to Freedom',
    description:
      'After 15 years of struggling with addiction, I found hope in Christ. My journey from darkness to light, and how Jesus broke every chain.',
    videoUrl: '/videos/placeholder.mp4',
    thumbnailUrl: null,
    duration: 342,
    language: 'en',
    tags: ['addiction', 'freedom', 'healing'],
    status: 'approved',
    viewCount: 1245,
    featured: true,
    publishedAt: '2024-06-15T12:00:00Z',
    createdAt: '2024-06-14T10:00:00Z',
    updatedAt: '2024-06-15T12:00:00Z',
    author: {
      id: 'user-1',
      fullName: 'Michael Robinson',
      avatarUrl: null,
    },
  },
  {
    id: 'testimony-2',
    userId: 'user-2',
    title: 'Healing from Grief',
    description:
      'How God brought me through the darkest season of my life after losing my husband. Finding peace that surpasses understanding.',
    videoUrl: '/videos/placeholder.mp4',
    thumbnailUrl: null,
    duration: 456,
    language: 'en',
    tags: ['grief', 'healing', 'peace', 'loss'],
    status: 'approved',
    viewCount: 892,
    featured: true,
    publishedAt: '2024-07-20T14:00:00Z',
    createdAt: '2024-07-19T11:30:00Z',
    updatedAt: '2024-07-20T14:00:00Z',
    author: {
      id: 'user-2',
      fullName: 'Sarah Mitchell',
      avatarUrl: null,
    },
  },
  {
    id: 'testimony-3',
    userId: 'user-3',
    title: 'A Prodigal Returns',
    description:
      'I ran from God for 20 years, chasing success and pleasure. Here is my story of coming home to the Father who never stopped waiting.',
    videoUrl: '/videos/placeholder.mp4',
    thumbnailUrl: null,
    duration: 521,
    language: 'en',
    tags: ['prodigal', 'restoration', 'faith'],
    status: 'approved',
    viewCount: 2103,
    featured: true,
    publishedAt: '2024-08-05T09:00:00Z',
    createdAt: '2024-08-04T16:45:00Z',
    updatedAt: '2024-08-05T09:00:00Z',
    author: {
      id: 'user-3',
      fullName: 'David Kim',
      avatarUrl: null,
    },
  },
  {
    id: 'testimony-4',
    userId: 'user-1',
    title: 'Finding Purpose After Retirement',
    description:
      'When my career ended, I thought my purpose was over. God had bigger plans for me than I ever imagined.',
    videoUrl: '/videos/placeholder.mp4',
    thumbnailUrl: null,
    duration: 389,
    language: 'en',
    tags: ['purpose', 'retirement', 'calling'],
    status: 'approved',
    viewCount: 567,
    featured: false,
    publishedAt: '2024-09-10T11:00:00Z',
    createdAt: '2024-09-09T15:20:00Z',
    updatedAt: '2024-09-10T11:00:00Z',
    author: {
      id: 'user-1',
      fullName: 'Michael Robinson',
      avatarUrl: null,
    },
  },
  {
    id: 'testimony-5',
    userId: 'user-2',
    title: 'Saved from the Streets',
    description:
      'From homelessness to hope - my journey with Jesus. How a chance encounter at a shelter changed everything.',
    videoUrl: '/videos/placeholder.mp4',
    thumbnailUrl: null,
    duration: 445,
    language: 'en',
    tags: ['homelessness', 'hope', 'salvation'],
    status: 'approved',
    viewCount: 1876,
    featured: false,
    publishedAt: '2024-10-01T08:00:00Z',
    createdAt: '2024-09-30T14:10:00Z',
    updatedAt: '2024-10-01T08:00:00Z',
    author: {
      id: 'user-2',
      fullName: 'Sarah Mitchell',
      avatarUrl: null,
    },
  },
  {
    id: 'testimony-6',
    userId: 'user-3',
    title: 'Marriage Restored',
    description:
      'When divorce seemed inevitable after infidelity, God stepped in. How we rebuilt trust and found a love stronger than before.',
    videoUrl: '/videos/placeholder.mp4',
    thumbnailUrl: null,
    duration: 298,
    language: 'en',
    tags: ['marriage', 'restoration', 'forgiveness'],
    status: 'approved',
    viewCount: 2341,
    featured: false,
    publishedAt: '2024-10-15T10:00:00Z',
    createdAt: '2024-10-14T09:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
    author: {
      id: 'user-3',
      fullName: 'David Kim',
      avatarUrl: null,
    },
  },
  // Pending testimonies for admin testing
  {
    id: 'testimony-7',
    userId: 'user-1',
    title: 'My Testimony of Faith',
    description: 'A new submission waiting for review.',
    videoUrl: '/videos/placeholder.mp4',
    thumbnailUrl: null,
    duration: 180,
    language: 'en',
    tags: ['faith'],
    status: 'pending',
    viewCount: 0,
    featured: false,
    publishedAt: null,
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z',
    author: {
      id: 'user-1',
      fullName: 'Michael Robinson',
      avatarUrl: null,
    },
  },
  {
    id: 'testimony-8',
    userId: 'user-2',
    title: 'How Jesus Changed My Life',
    description: 'Another pending testimony for admin review.',
    videoUrl: '/videos/placeholder.mp4',
    thumbnailUrl: null,
    duration: 240,
    language: 'es',
    tags: ['salvation'],
    status: 'pending',
    viewCount: 0,
    featured: false,
    publishedAt: null,
    createdAt: '2024-12-21T14:00:00Z',
    updatedAt: '2024-12-21T14:00:00Z',
    author: {
      id: 'user-2',
      fullName: 'Sarah Mitchell',
      avatarUrl: null,
    },
  },
]

// =============================================================================
// MOCK DATA ACCESS FUNCTIONS
// These simulate API calls and will be replaced with real API calls later
// =============================================================================

export function getTestimonies(options?: {
  filters?: TestimonyFilters
  sort?: TestimonySort
  page?: number
  pageSize?: number
}) {
  const { filters, sort, page = 1, pageSize = 12 } = options || {}

  let result = [...MOCK_TESTIMONIES]

  // Apply filters
  if (filters) {
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status)
    }
    if (filters.language) {
      result = result.filter((t) => t.language === filters.language)
    }
    if (filters.featured !== undefined) {
      result = result.filter((t) => t.featured === filters.featured)
    }
    if (filters.userId) {
      result = result.filter((t) => t.userId === filters.userId)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search) ||
          t.tags.some((tag) => tag.toLowerCase().includes(search))
      )
    }
  }

  // Apply sort
  if (sort) {
    result.sort((a, b) => {
      const aVal = a[sort.field]
      const bVal = b[sort.field]
      if (aVal === null) return 1
      if (bVal === null) return -1
      if (sort.direction === 'asc') {
        return aVal < bVal ? -1 : 1
      }
      return aVal > bVal ? -1 : 1
    })
  } else {
    // Default sort by publishedAt desc
    result.sort((a, b) => {
      if (!a.publishedAt) return 1
      if (!b.publishedAt) return -1
      return b.publishedAt.localeCompare(a.publishedAt)
    })
  }

  // Apply pagination
  const total = result.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedData = result.slice(start, end)

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    hasMore: end < total,
  }
}

export function getTestimonyById(id: string) {
  return MOCK_TESTIMONIES.find((t) => t.id === id) || null
}

export function getFeaturedTestimonies(limit = 3) {
  return MOCK_TESTIMONIES.filter((t) => t.status === 'approved' && t.featured).slice(0, limit)
}

export function getPendingTestimonies() {
  return MOCK_TESTIMONIES.filter((t) => t.status === 'pending')
}

export function getStats() {
  const approved = MOCK_TESTIMONIES.filter((t) => t.status === 'approved')
  return {
    totalTestimonies: approved.length,
    pendingTestimonies: MOCK_TESTIMONIES.filter((t) => t.status === 'pending').length,
    totalViews: approved.reduce((sum, t) => sum + t.viewCount, 0),
    totalUsers: MOCK_USERS.filter((u) => !u.isAdmin).length,
    countriesReached: 45, // Mock stat
  }
}

export function getUserById(id: string) {
  return MOCK_USERS.find((u) => u.id === id) || null
}
