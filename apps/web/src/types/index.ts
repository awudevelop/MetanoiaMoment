// =============================================================================
// CORE DOMAIN TYPES
// These types define the data structures for the entire application.
// Aligned with Supabase schema v2.0 - "Generous Individual, Premium Family"
// =============================================================================

// =============================================================================
// ENUMS (matching Supabase enums)
// =============================================================================

export type UserRole = 'user' | 'creator' | 'admin'

export type UserTier = 'free' | 'family' | 'legacy'

export type StoryCategory =
  | 'life_wisdom'
  | 'family_history'
  | 'transformation'
  | 'faith_journey'
  | 'final_messages'
  | 'milestones'

export type StoryStatus = 'pending' | 'approved' | 'rejected' | 'flagged'

export type StoryVisibility = 'public' | 'unlisted' | 'private' | 'family'

export type FamilyRole = 'owner' | 'admin' | 'member' | 'viewer'

export type ReferralStatus = 'signed_up' | 'recorded' | 'upgraded_family' | 'upgraded_legacy'

// Legacy type alias for backward compatibility
export type TestimonyStatus = StoryStatus

// =============================================================================
// USER & PROFILE
// =============================================================================

export interface User {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  bio: string | null

  // Role & permissions
  role: UserRole

  // Subscription
  tier: UserTier
  tierExpiresAt: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null

  // Referral system
  referralCode: string
  referredBy: string | null
  referralCredits: number
  totalReferrals: number

  // Metadata
  language: string
  timezone: string | null
  createdAt: string
  updatedAt: string

  // Computed helpers
  isAdmin: boolean // Derived: role === 'admin'
  isCreator: boolean // Derived: role === 'creator' || role === 'admin'
  hasFamilyTier: boolean // Derived: tier === 'family' || tier === 'legacy'
  hasLegacyTier: boolean // Derived: tier === 'legacy'
}

// Minimal user data for display
export interface UserPreview {
  id: string
  fullName: string | null
  avatarUrl: string | null
}

// =============================================================================
// STORIES (formerly Testimonies)
// =============================================================================

export interface Story {
  id: string
  userId: string

  // Content
  title: string
  description: string | null
  videoUrl: string | null
  thumbnailUrl: string | null
  duration: number | null // seconds

  // Categorization
  category: StoryCategory
  tags: string[]
  language: string
  promptId: string | null

  // Status & visibility
  status: StoryStatus
  visibility: StoryVisibility

  // Family vault
  familyVaultId: string | null

  // Engagement
  viewCount: number
  likeCount: number
  shareCount: number

  // Quality & backup
  has4k: boolean
  ipfsHash: string | null

  // Moderation
  moderatedBy: string | null
  moderatedAt: string | null
  rejectionReason: string | null

  // Featured
  featured: boolean

  // Timestamps
  createdAt: string
  updatedAt: string
  publishedAt: string | null

  // Joined data
  author?: UserPreview
  prompt?: Prompt
  responses?: StoryResponse[]
  isLiked?: boolean // Current user has liked
}

// Legacy type alias for backward compatibility
export type Testimony = Story

export interface StoryUpload {
  title: string
  description?: string
  category: StoryCategory
  language: string
  tags?: string[]
  video: Blob | File
  visibility?: StoryVisibility
  familyVaultId?: string
  promptId?: string
}

// Legacy alias
export type TestimonyUpload = StoryUpload

// =============================================================================
// STORY RESPONSES
// =============================================================================

export interface StoryResponse {
  id: string
  storyId: string
  responderId: string

  // Content (video or text)
  videoUrl: string | null
  thumbnailUrl: string | null
  duration: number | null
  textResponse: string | null

  createdAt: string
  updatedAt: string

  // Joined
  responder?: UserPreview
}

// =============================================================================
// PROMPTS
// =============================================================================

export interface Prompt {
  id: string
  category: StoryCategory

  // i18n content
  promptText: Record<string, string> // { "en": "...", "es": "..." }

  isActive: boolean
  displayOrder: number
  timesUsed: number

  createdAt: string
  updatedAt: string
}

// =============================================================================
// FAMILY FEATURES
// =============================================================================

export interface FamilyVault {
  id: string
  name: string
  description: string | null
  ownerId: string

  // Memorial mode
  isMemorial: boolean
  memorialFor: string | null
  memorialDate: string | null

  // Settings
  allowResponses: boolean
  requireApproval: boolean

  createdAt: string
  updatedAt: string

  // Joined
  owner?: UserPreview
  members?: FamilyMember[]
  stories?: Story[]
  memberCount?: number
  storyCount?: number
}

export interface FamilyMember {
  id: string
  vaultId: string
  userId: string | null

  // Role & relationship
  role: FamilyRole
  relationship: string | null

  // Invitation
  invitedEmail: string | null
  invitedBy: string | null
  invitationToken: string | null
  invitedAt: string
  joinedAt: string | null

  // Preferences
  notifyNewStories: boolean
  notifyResponses: boolean

  // Joined
  user?: UserPreview
  inviter?: UserPreview
}

export interface FamilyInvitation {
  email: string
  relationship?: string
  role?: FamilyRole
}

// =============================================================================
// REFERRAL SYSTEM
// =============================================================================

export interface Referral {
  id: string
  referrerId: string
  referredId: string

  status: ReferralStatus

  // Rewards
  rewardMonths: number
  rewardCashCents: number
  rewardClaimed: boolean
  rewardClaimedAt: string | null

  createdAt: string
  updatedAt: string

  // Joined
  referrer?: UserPreview
  referred?: UserPreview
}

export type AffiliateLevel = 'storyteller' | 'family_champion' | 'legacy_builder' | 'ambassador'

export interface AffiliateStats {
  level: AffiliateLevel
  totalReferrals: number
  pendingRewards: number // months
  claimedRewards: number // months
  cashEarned: number // cents
  nextLevelAt: number // referrals needed
}

// =============================================================================
// ORGANIZATIONS (Churches/Ministries)
// =============================================================================

export interface Organization {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  websiteUrl: string | null

  // Contact
  contactEmail: string | null
  contactName: string | null

  // Subscription
  tier: 'free' | 'small' | 'large'
  memberCount: number
  storyLimit: number
  storiesUsed: number

  // Branding
  primaryColor: string | null
  customDomain: string | null

  // Stripe
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null

  ownerId: string

  createdAt: string
  updatedAt: string

  // Joined
  owner?: UserPreview
  members?: OrganizationMember[]
}

export interface OrganizationMember {
  organizationId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string

  // Joined
  user?: UserPreview
}

// =============================================================================
// ANALYTICS
// =============================================================================

export interface StoryView {
  id: string
  storyId: string
  viewerId: string | null

  viewDuration: number | null // seconds
  completed: boolean

  referrer: string | null
  userAgent: string | null
  country: string | null

  createdAt: string
}

export interface StoryAnalytics {
  storyId: string
  totalViews: number
  uniqueViewers: number
  avgWatchTime: number
  completionRate: number
  topCountries: Array<{ country: string; count: number }>
  viewsByDay: Array<{ date: string; count: number }>
}

export interface UserAnalytics {
  userId: string
  totalStories: number
  totalViews: number
  totalLikes: number
  totalShares: number
  topStory: Story | null
}

// =============================================================================
// API RESPONSE TYPES
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

export interface StoryFilters {
  status?: StoryStatus
  category?: StoryCategory
  visibility?: StoryVisibility
  language?: string
  featured?: boolean
  search?: string
  userId?: string
  familyVaultId?: string
}

// Legacy alias
export type TestimonyFilters = StoryFilters

export interface StorySort {
  field: 'createdAt' | 'viewCount' | 'likeCount' | 'publishedAt'
  direction: 'asc' | 'desc'
}

// Legacy alias
export type TestimonySort = StorySort

export interface StoryQuery {
  filters?: StoryFilters
  sort?: StorySort
  page?: number
  pageSize?: number
}

// Legacy alias
export type TestimonyQuery = StoryQuery

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
  referralCode?: string
}

// =============================================================================
// SUBSCRIPTION & BILLING
// =============================================================================

export interface SubscriptionPlan {
  id: string
  name: string
  tier: UserTier
  priceMonthly: number // cents
  priceYearly: number // cents
  features: string[]
}

export interface CheckoutSession {
  id: string
  url: string
}

// =============================================================================
// WEBHOOK EVENT TYPES
// =============================================================================

export type WebhookEventType =
  | 'story.created'
  | 'story.approved'
  | 'story.rejected'
  | 'story.deleted'
  | 'user.created'
  | 'user.deleted'
  | 'user.upgraded'
  | 'video.processed'
  | 'video.transcoded'
  | 'referral.signup'
  | 'referral.recorded'
  | 'referral.upgraded'
  | 'family.invited'
  | 'family.joined'

export interface WebhookEvent<T = unknown> {
  id: string
  type: WebhookEventType
  timestamp: string
  data: T
}

export interface StoryCreatedEvent {
  storyId: string
  userId: string
  title: string
  category: StoryCategory
}

export interface VideoProcessedEvent {
  storyId: string
  videoUrl: string
  thumbnailUrl: string
  duration: number
}

export interface ReferralEvent {
  referralId: string
  referrerId: string
  referredId: string
  status: ReferralStatus
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

// Category display info
export const STORY_CATEGORIES: Record<
  StoryCategory,
  { label: string; description: string; icon: string }
> = {
  life_wisdom: {
    label: 'Life Wisdom',
    description: 'Lessons learned, advice for descendants',
    icon: 'Lightbulb',
  },
  family_history: {
    label: 'Family History',
    description: 'Ancestry, traditions, heritage',
    icon: 'Users',
  },
  transformation: {
    label: 'Transformation',
    description: 'Recovery, healing, change moments',
    icon: 'Sparkles',
  },
  faith_journey: {
    label: 'Faith Journey',
    description: 'Spiritual testimony',
    icon: 'Heart',
  },
  final_messages: {
    label: 'Final Messages',
    description: 'End-of-life, legacy',
    icon: 'MessageCircle',
  },
  milestones: {
    label: 'Milestones',
    description: 'Weddings, births, graduations',
    icon: 'Trophy',
  },
}

// Tier limits
export const TIER_LIMITS: Record<
  UserTier,
  {
    maxVideoMinutes: number
    maxFamilyMembers: number
    has4k: boolean
    hasIpfsBackup: boolean
    hasPhysicalProducts: boolean
  }
> = {
  free: {
    maxVideoMinutes: 10,
    maxFamilyMembers: 0,
    has4k: false,
    hasIpfsBackup: false,
    hasPhysicalProducts: false,
  },
  family: {
    maxVideoMinutes: 30,
    maxFamilyMembers: 10,
    has4k: true,
    hasIpfsBackup: false,
    hasPhysicalProducts: false,
  },
  legacy: {
    maxVideoMinutes: 60,
    maxFamilyMembers: Infinity,
    has4k: true,
    hasIpfsBackup: true,
    hasPhysicalProducts: true,
  },
}

// Affiliate levels
export const AFFILIATE_LEVELS: Record<
  AffiliateLevel,
  { minReferrals: number; rewardMultiplier: number; benefits: string[] }
> = {
  storyteller: {
    minReferrals: 0,
    rewardMultiplier: 1,
    benefits: ['Standard referral rewards'],
  },
  family_champion: {
    minReferrals: 5,
    rewardMultiplier: 1.5,
    benefits: ['1.5x rewards', 'Profile badge'],
  },
  legacy_builder: {
    minReferrals: 20,
    rewardMultiplier: 2,
    benefits: ['2x rewards', 'Featured profile', 'Early access'],
  },
  ambassador: {
    minReferrals: 50,
    rewardMultiplier: 2.5,
    benefits: ['Free Legacy tier forever', '25% revenue share', 'VIP support'],
  },
}
