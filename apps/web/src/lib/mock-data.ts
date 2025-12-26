import type { User, Story, StoryFilters, StorySort, Prompt, StoryCategory } from '@/types'

// =============================================================================
// MOCK USERS
// Demo credentials for testing:
// - User:    user@demo.com / demo123
// - Creator: creator@demo.com / demo123
// - Admin:   admin@demo.com / demo123
// =============================================================================

// Helper to create a complete user with all required fields
function createUser(partial: {
  id: string
  email: string
  fullName: string
  bio: string
  role: 'user' | 'creator' | 'admin'
  tier?: 'free' | 'family' | 'legacy'
  referralCredits?: number
  totalReferrals?: number
  createdAt: string
}): User {
  const isAdmin = partial.role === 'admin'
  const isCreator = partial.role === 'creator' || partial.role === 'admin'
  const tier = partial.tier || 'free'

  return {
    id: partial.id,
    email: partial.email,
    fullName: partial.fullName,
    avatarUrl: null,
    bio: partial.bio,
    role: partial.role,
    tier,
    tierExpiresAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    referralCode: `REF${partial.id.toUpperCase().replace(/-/g, '').slice(0, 8)}`,
    referredBy: null,
    referralCredits: partial.referralCredits || 0,
    totalReferrals: partial.totalReferrals || 0,
    language: 'en',
    timezone: 'America/New_York',
    createdAt: partial.createdAt,
    updatedAt: partial.createdAt,
    // Computed helpers
    isAdmin,
    isCreator,
    hasFamilyTier: tier === 'family' || tier === 'legacy',
    hasLegacyTier: tier === 'legacy',
  }
}

export const MOCK_USERS: User[] = [
  // Demo User (can view, favorite, comment)
  createUser({
    id: 'demo-user',
    email: 'user@demo.com',
    fullName: 'Demo User',
    bio: 'A regular user exploring testimonies.',
    role: 'user',
    tier: 'free',
    createdAt: '2024-01-01T00:00:00Z',
  }),
  // Demo Creator (can record and manage own testimonies)
  createUser({
    id: 'demo-creator',
    email: 'creator@demo.com',
    fullName: 'Demo Creator',
    bio: 'Sharing my faith journey with the world.',
    role: 'creator',
    tier: 'family',
    referralCredits: 2,
    totalReferrals: 5,
    createdAt: '2024-01-01T00:00:00Z',
  }),
  // Demo Admin (full access)
  createUser({
    id: 'demo-admin',
    email: 'admin@demo.com',
    fullName: 'Demo Admin',
    bio: 'Platform administrator.',
    role: 'admin',
    tier: 'legacy',
    createdAt: '2024-01-01T00:00:00Z',
  }),
  // Regular users/creators for content
  createUser({
    id: 'user-1',
    email: 'michael.r@example.com',
    fullName: 'Michael Robinson',
    bio: 'Saved by grace, sharing my story.',
    role: 'creator',
    tier: 'family',
    createdAt: '2024-01-15T10:00:00Z',
  }),
  createUser({
    id: 'user-2',
    email: 'sarah.m@example.com',
    fullName: 'Sarah Mitchell',
    bio: 'Walking in faith since 2018.',
    role: 'creator',
    tier: 'free',
    createdAt: '2024-02-20T14:30:00Z',
  }),
  createUser({
    id: 'user-3',
    email: 'david.k@example.com',
    fullName: 'David Kim',
    bio: 'Former prodigal, now home.',
    role: 'creator',
    tier: 'legacy',
    createdAt: '2024-03-10T09:15:00Z',
  }),
]

// =============================================================================
// MOCK STORIES (formerly Testimonies)
// =============================================================================

// Helper to create a complete story with all required fields
function createStory(partial: {
  id: string
  userId: string
  title: string
  description: string
  category:
    | 'life_wisdom'
    | 'family_history'
    | 'transformation'
    | 'faith_journey'
    | 'final_messages'
    | 'milestones'
  duration: number
  language: string
  tags: string[]
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  visibility?: 'public' | 'unlisted' | 'private' | 'family'
  viewCount: number
  likeCount: number
  shareCount: number
  featured: boolean
  publishedAt: string | null
  createdAt: string
  author: { id: string; fullName: string; avatarUrl: string | null }
}): Story {
  return {
    id: partial.id,
    userId: partial.userId,
    title: partial.title,
    description: partial.description,
    videoUrl: '/videos/placeholder.mp4',
    thumbnailUrl: null,
    duration: partial.duration,
    category: partial.category,
    tags: partial.tags,
    language: partial.language,
    promptId: null,
    status: partial.status,
    visibility: partial.visibility || 'public',
    familyVaultId: null,
    viewCount: partial.viewCount,
    likeCount: partial.likeCount,
    shareCount: partial.shareCount,
    has4k: false,
    ipfsHash: null,
    moderatedBy: partial.status === 'approved' ? 'demo-admin' : null,
    moderatedAt: partial.status === 'approved' ? partial.publishedAt : null,
    rejectionReason: null,
    featured: partial.featured,
    createdAt: partial.createdAt,
    updatedAt: partial.createdAt,
    publishedAt: partial.publishedAt,
    author: partial.author,
  }
}

export const MOCK_STORIES: Story[] = [
  createStory({
    id: 'story-1',
    userId: 'user-1',
    title: 'From Addiction to Freedom',
    description:
      'After 15 years of struggling with addiction, I found hope in Christ. My journey from darkness to light, and how Jesus broke every chain.',
    category: 'transformation',
    duration: 342,
    language: 'en',
    tags: ['addiction', 'freedom', 'healing'],
    status: 'approved',
    viewCount: 1245,
    likeCount: 87,
    shareCount: 23,
    featured: true,
    publishedAt: '2024-06-15T12:00:00Z',
    createdAt: '2024-06-14T10:00:00Z',
    author: { id: 'user-1', fullName: 'Michael Robinson', avatarUrl: null },
  }),
  createStory({
    id: 'story-2',
    userId: 'user-2',
    title: 'Healing from Grief',
    description:
      'How God brought me through the darkest season of my life after losing my husband. Finding peace that surpasses understanding.',
    category: 'life_wisdom',
    duration: 456,
    language: 'en',
    tags: ['grief', 'healing', 'peace', 'loss'],
    status: 'approved',
    viewCount: 892,
    likeCount: 64,
    shareCount: 18,
    featured: true,
    publishedAt: '2024-07-20T14:00:00Z',
    createdAt: '2024-07-19T11:30:00Z',
    author: { id: 'user-2', fullName: 'Sarah Mitchell', avatarUrl: null },
  }),
  createStory({
    id: 'story-3',
    userId: 'user-3',
    title: 'A Prodigal Returns',
    description:
      'I ran from God for 20 years, chasing success and pleasure. Here is my story of coming home to the Father who never stopped waiting.',
    category: 'faith_journey',
    duration: 521,
    language: 'en',
    tags: ['prodigal', 'restoration', 'faith'],
    status: 'approved',
    viewCount: 2103,
    likeCount: 156,
    shareCount: 42,
    featured: true,
    publishedAt: '2024-08-05T09:00:00Z',
    createdAt: '2024-08-04T16:45:00Z',
    author: { id: 'user-3', fullName: 'David Kim', avatarUrl: null },
  }),
  createStory({
    id: 'story-4',
    userId: 'user-1',
    title: 'Finding Purpose After Retirement',
    description:
      'When my career ended, I thought my purpose was over. God had bigger plans for me than I ever imagined.',
    category: 'life_wisdom',
    duration: 389,
    language: 'en',
    tags: ['purpose', 'retirement', 'calling'],
    status: 'approved',
    viewCount: 567,
    likeCount: 38,
    shareCount: 12,
    featured: false,
    publishedAt: '2024-09-10T11:00:00Z',
    createdAt: '2024-09-09T15:20:00Z',
    author: { id: 'user-1', fullName: 'Michael Robinson', avatarUrl: null },
  }),
  createStory({
    id: 'story-5',
    userId: 'user-2',
    title: 'Saved from the Streets',
    description:
      'From homelessness to hope - my journey with Jesus. How a chance encounter at a shelter changed everything.',
    category: 'transformation',
    duration: 445,
    language: 'en',
    tags: ['homelessness', 'hope', 'salvation'],
    status: 'approved',
    viewCount: 1876,
    likeCount: 124,
    shareCount: 35,
    featured: false,
    publishedAt: '2024-10-01T08:00:00Z',
    createdAt: '2024-09-30T14:10:00Z',
    author: { id: 'user-2', fullName: 'Sarah Mitchell', avatarUrl: null },
  }),
  createStory({
    id: 'story-6',
    userId: 'user-3',
    title: 'Marriage Restored',
    description:
      'When divorce seemed inevitable after infidelity, God stepped in. How we rebuilt trust and found a love stronger than before.',
    category: 'family_history',
    duration: 298,
    language: 'en',
    tags: ['marriage', 'restoration', 'forgiveness'],
    status: 'approved',
    viewCount: 2341,
    likeCount: 189,
    shareCount: 56,
    featured: false,
    publishedAt: '2024-10-15T10:00:00Z',
    createdAt: '2024-10-14T09:00:00Z',
    author: { id: 'user-3', fullName: 'David Kim', avatarUrl: null },
  }),
  createStory({
    id: 'story-7',
    userId: 'user-1',
    title: 'A Message for My Grandchildren',
    description: 'Recording my life lessons and faith journey for future generations.',
    category: 'final_messages',
    duration: 480,
    language: 'en',
    tags: ['legacy', 'grandchildren', 'wisdom'],
    status: 'approved',
    visibility: 'family',
    viewCount: 45,
    likeCount: 12,
    shareCount: 0,
    featured: false,
    publishedAt: '2024-11-01T10:00:00Z',
    createdAt: '2024-10-30T14:00:00Z',
    author: { id: 'user-1', fullName: 'Michael Robinson', avatarUrl: null },
  }),
  createStory({
    id: 'story-8',
    userId: 'user-2',
    title: 'Our Family Traditions',
    description:
      'Preserving the stories and traditions that have shaped our family for generations.',
    category: 'family_history',
    duration: 520,
    language: 'en',
    tags: ['traditions', 'heritage', 'family'],
    status: 'approved',
    visibility: 'family',
    viewCount: 78,
    likeCount: 23,
    shareCount: 2,
    featured: false,
    publishedAt: '2024-11-15T09:00:00Z',
    createdAt: '2024-11-14T11:00:00Z',
    author: { id: 'user-2', fullName: 'Sarah Mitchell', avatarUrl: null },
  }),
  // Pending stories for admin testing
  createStory({
    id: 'story-pending-1',
    userId: 'user-1',
    title: 'My Testimony of Faith',
    description: 'A new submission waiting for review.',
    category: 'faith_journey',
    duration: 180,
    language: 'en',
    tags: ['faith'],
    status: 'pending',
    viewCount: 0,
    likeCount: 0,
    shareCount: 0,
    featured: false,
    publishedAt: null,
    createdAt: '2024-12-20T10:00:00Z',
    author: { id: 'user-1', fullName: 'Michael Robinson', avatarUrl: null },
  }),
  createStory({
    id: 'story-pending-2',
    userId: 'user-2',
    title: 'How Jesus Changed My Life',
    description: 'Another pending story for admin review.',
    category: 'transformation',
    duration: 240,
    language: 'es',
    tags: ['salvation'],
    status: 'pending',
    viewCount: 0,
    likeCount: 0,
    shareCount: 0,
    featured: false,
    publishedAt: null,
    createdAt: '2024-12-21T14:00:00Z',
    author: { id: 'user-2', fullName: 'Sarah Mitchell', avatarUrl: null },
  }),
  // Milestones category
  createStory({
    id: 'story-9',
    userId: 'user-3',
    title: "My Daughter's Graduation",
    description: "Celebrating my daughter's achievement and the faith that carried us through.",
    category: 'milestones',
    duration: 320,
    language: 'en',
    tags: ['graduation', 'celebration', 'family'],
    status: 'approved',
    viewCount: 234,
    likeCount: 45,
    shareCount: 8,
    featured: false,
    publishedAt: '2024-11-20T15:00:00Z',
    createdAt: '2024-11-19T10:00:00Z',
    author: { id: 'user-3', fullName: 'David Kim', avatarUrl: null },
  }),
]

// Legacy export - aliased for backward compatibility
export const MOCK_TESTIMONIES = MOCK_STORIES

// =============================================================================
// MOCK DATA ACCESS FUNCTIONS
// These simulate API calls and will be replaced with real API calls later
// =============================================================================

export function getStories(options?: {
  filters?: StoryFilters
  sort?: StorySort
  page?: number
  pageSize?: number
}) {
  const { filters, sort, page = 1, pageSize = 12 } = options || {}

  let result = [...MOCK_STORIES]

  // Apply filters
  if (filters) {
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status)
    }
    if (filters.category) {
      result = result.filter((t) => t.category === filters.category)
    }
    if (filters.visibility) {
      result = result.filter((t) => t.visibility === filters.visibility)
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
    if (filters.familyVaultId) {
      result = result.filter((t) => t.familyVaultId === filters.familyVaultId)
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

// Legacy alias
export const getTestimonies = getStories

export function getStoryById(id: string) {
  return MOCK_STORIES.find((t) => t.id === id) || null
}

// Legacy alias
export const getTestimonyById = getStoryById

export function getFeaturedStories(limit = 3) {
  return MOCK_STORIES.filter((t) => t.status === 'approved' && t.featured).slice(0, limit)
}

// Legacy alias
export const getFeaturedTestimonies = getFeaturedStories

export function getPendingStories() {
  return MOCK_STORIES.filter((t) => t.status === 'pending')
}

// Legacy alias
export const getPendingTestimonies = getPendingStories

export function getStats() {
  const approved = MOCK_STORIES.filter((t) => t.status === 'approved')
  return {
    totalStories: approved.length,
    totalTestimonies: approved.length, // Legacy alias
    pendingStories: MOCK_STORIES.filter((t) => t.status === 'pending').length,
    pendingTestimonies: MOCK_STORIES.filter((t) => t.status === 'pending').length, // Legacy
    totalViews: approved.reduce((sum, t) => sum + t.viewCount, 0),
    totalUsers: MOCK_USERS.filter((u) => !u.isAdmin).length,
    countriesReached: 45, // Mock stat
  }
}

export function getUserById(id: string) {
  return MOCK_USERS.find((u) => u.id === id) || null
}

// =============================================================================
// CATEGORY HELPERS
// =============================================================================

export function getStoriesByCategory(category: Story['category'], limit?: number) {
  const stories = MOCK_STORIES.filter(
    (s) => s.category === category && s.status === 'approved' && s.visibility === 'public'
  )
  return limit ? stories.slice(0, limit) : stories
}

export function getCategoryStats() {
  const approved = MOCK_STORIES.filter((s) => s.status === 'approved')

  return {
    life_wisdom: approved.filter((s) => s.category === 'life_wisdom').length,
    family_history: approved.filter((s) => s.category === 'family_history').length,
    transformation: approved.filter((s) => s.category === 'transformation').length,
    faith_journey: approved.filter((s) => s.category === 'faith_journey').length,
    final_messages: approved.filter((s) => s.category === 'final_messages').length,
    milestones: approved.filter((s) => s.category === 'milestones').length,
  }
}

// =============================================================================
// MOCK PROMPTS
// Recording prompts organized by category
// =============================================================================

export const MOCK_PROMPTS: Prompt[] = [
  // Life Wisdom prompts
  {
    id: 'prompt-lw-1',
    category: 'life_wisdom',
    promptText: {
      en: "What's the most important life lesson you've learned?",
      es: '¿Cuál es la lección de vida más importante que has aprendido?',
    },
    isActive: true,
    displayOrder: 1,
    timesUsed: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-lw-2',
    category: 'life_wisdom',
    promptText: {
      en: 'What advice would you give to your younger self?',
      es: '¿Qué consejo le darías a tu yo más joven?',
    },
    isActive: true,
    displayOrder: 2,
    timesUsed: 38,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-lw-3',
    category: 'life_wisdom',
    promptText: {
      en: 'What do you want your grandchildren to know about life?',
      es: '¿Qué quieres que tus nietos sepan sobre la vida?',
    },
    isActive: true,
    displayOrder: 3,
    timesUsed: 29,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Family History prompts
  {
    id: 'prompt-fh-1',
    category: 'family_history',
    promptText: {
      en: 'What family traditions have shaped who you are?',
      es: '¿Qué tradiciones familiares han moldeado quién eres?',
    },
    isActive: true,
    displayOrder: 1,
    timesUsed: 32,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-fh-2',
    category: 'family_history',
    promptText: {
      en: 'Tell me about your parents or grandparents.',
      es: 'Cuéntame sobre tus padres o abuelos.',
    },
    isActive: true,
    displayOrder: 2,
    timesUsed: 28,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-fh-3',
    category: 'family_history',
    promptText: {
      en: "What's a story from your family that should never be forgotten?",
      es: '¿Cuál es una historia de tu familia que nunca debería olvidarse?',
    },
    isActive: true,
    displayOrder: 3,
    timesUsed: 21,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Transformation prompts
  {
    id: 'prompt-tr-1',
    category: 'transformation',
    promptText: {
      en: 'Describe the moment that changed everything for you.',
      es: 'Describe el momento que lo cambió todo para ti.',
    },
    isActive: true,
    displayOrder: 1,
    timesUsed: 67,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-tr-2',
    category: 'transformation',
    promptText: {
      en: 'What helped you through your darkest time?',
      es: '¿Qué te ayudó en tu momento más oscuro?',
    },
    isActive: true,
    displayOrder: 2,
    timesUsed: 54,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-tr-3',
    category: 'transformation',
    promptText: {
      en: 'How are you different today than you were before?',
      es: '¿Cómo eres diferente hoy de lo que eras antes?',
    },
    isActive: true,
    displayOrder: 3,
    timesUsed: 41,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Faith Journey prompts
  {
    id: 'prompt-fj-1',
    category: 'faith_journey',
    promptText: {
      en: 'How did you come to faith?',
      es: '¿Cómo llegaste a la fe?',
    },
    isActive: true,
    displayOrder: 1,
    timesUsed: 89,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-fj-2',
    category: 'faith_journey',
    promptText: {
      en: 'Describe a moment when God felt real to you.',
      es: 'Describe un momento en que Dios se sintió real para ti.',
    },
    isActive: true,
    displayOrder: 2,
    timesUsed: 72,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-fj-3',
    category: 'faith_journey',
    promptText: {
      en: 'What would you tell someone who is searching for hope?',
      es: '¿Qué le dirías a alguien que está buscando esperanza?',
    },
    isActive: true,
    displayOrder: 3,
    timesUsed: 58,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Final Messages prompts
  {
    id: 'prompt-fm-1',
    category: 'final_messages',
    promptText: {
      en: 'What do you want your family to remember about you?',
      es: '¿Qué quieres que tu familia recuerde de ti?',
    },
    isActive: true,
    displayOrder: 1,
    timesUsed: 23,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-fm-2',
    category: 'final_messages',
    promptText: {
      en: 'What brings you peace?',
      es: '¿Qué te trae paz?',
    },
    isActive: true,
    displayOrder: 2,
    timesUsed: 18,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-fm-3',
    category: 'final_messages',
    promptText: {
      en: 'What are you most grateful for in your life?',
      es: '¿Por qué estás más agradecido en tu vida?',
    },
    isActive: true,
    displayOrder: 3,
    timesUsed: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Milestones prompts
  {
    id: 'prompt-ms-1',
    category: 'milestones',
    promptText: {
      en: 'Tell me about this special moment in your life.',
      es: 'Cuéntame sobre este momento especial en tu vida.',
    },
    isActive: true,
    displayOrder: 1,
    timesUsed: 34,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-ms-2',
    category: 'milestones',
    promptText: {
      en: 'What does this achievement mean to you?',
      es: '¿Qué significa este logro para ti?',
    },
    isActive: true,
    displayOrder: 2,
    timesUsed: 27,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prompt-ms-3',
    category: 'milestones',
    promptText: {
      en: 'Who helped you get to this moment?',
      es: '¿Quién te ayudó a llegar a este momento?',
    },
    isActive: true,
    displayOrder: 3,
    timesUsed: 22,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// =============================================================================
// PROMPT HELPERS
// =============================================================================

export function getPromptsByCategory(category: StoryCategory): Prompt[] {
  return MOCK_PROMPTS.filter((p) => p.category === category && p.isActive).sort(
    (a, b) => a.displayOrder - b.displayOrder
  )
}

export function getPromptById(id: string): Prompt | null {
  return MOCK_PROMPTS.find((p) => p.id === id) || null
}

export function getRandomPrompt(category: StoryCategory): Prompt | null {
  const prompts = getPromptsByCategory(category)
  if (prompts.length === 0) return null
  return prompts[Math.floor(Math.random() * prompts.length)]
}

export function getAllActivePrompts(): Prompt[] {
  return MOCK_PROMPTS.filter((p) => p.isActive).sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.displayOrder - b.displayOrder
  })
}
