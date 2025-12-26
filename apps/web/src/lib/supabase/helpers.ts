import type { Profile, Story } from './types'
import type { User, Story as AppStory, UserPreview } from '@/types'

// =============================================================================
// PROFILE TRANSFORMERS
// Transform database rows to application types
// =============================================================================

export function transformProfile(profile: Profile): User {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    role: profile.role,
    tier: profile.tier,
    tierExpiresAt: profile.tier_expires_at,
    stripeCustomerId: profile.stripe_customer_id,
    stripeSubscriptionId: profile.stripe_subscription_id,
    referralCode: profile.referral_code,
    referredBy: profile.referred_by,
    referralCredits: profile.referral_credits,
    totalReferrals: profile.total_referrals,
    language: profile.language,
    timezone: profile.timezone,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    // Computed helpers
    isAdmin: profile.role === 'admin',
    isCreator: profile.role === 'creator' || profile.role === 'admin',
    hasFamilyTier: profile.tier === 'family' || profile.tier === 'legacy',
    hasLegacyTier: profile.tier === 'legacy',
  }
}

export function transformProfileToPreview(profile: Profile): UserPreview {
  return {
    id: profile.id,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
  }
}

// =============================================================================
// STORY TRANSFORMERS
// =============================================================================

export function transformStory(story: Story, author?: Profile | null, isLiked?: boolean): AppStory {
  return {
    id: story.id,
    userId: story.user_id,
    title: story.title,
    description: story.description,
    videoUrl: story.video_url,
    thumbnailUrl: story.thumbnail_url,
    duration: story.duration,
    category: story.category,
    tags: story.tags,
    language: story.language,
    promptId: story.prompt_id,
    status: story.status,
    visibility: story.visibility,
    familyVaultId: story.family_vault_id,
    viewCount: story.view_count,
    likeCount: story.like_count,
    shareCount: story.share_count,
    has4k: story.has_4k,
    ipfsHash: story.ipfs_hash,
    moderatedBy: story.moderated_by,
    moderatedAt: story.moderated_at,
    rejectionReason: story.rejection_reason,
    featured: story.featured,
    createdAt: story.created_at,
    updatedAt: story.updated_at,
    publishedAt: story.published_at,
    author: author ? transformProfileToPreview(author) : undefined,
    isLiked,
  }
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

export class SupabaseError extends Error {
  code: string
  details: string | null
  hint: string | null

  constructor(message: string, code: string, details?: string, hint?: string) {
    super(message)
    this.name = 'SupabaseError'
    this.code = code
    this.details = details || null
    this.hint = hint || null
  }
}

export function handleSupabaseError(error: unknown): never {
  if (error && typeof error === 'object' && 'code' in error) {
    const supaError = error as { code: string; message: string; details?: string; hint?: string }
    throw new SupabaseError(supaError.message, supaError.code, supaError.details, supaError.hint)
  }
  throw error
}

// =============================================================================
// QUERY HELPERS
// =============================================================================

export function buildPagination(page: number = 1, pageSize: number = 10) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  return { from, to }
}

// =============================================================================
// STORAGE HELPERS
// =============================================================================

export function getStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return ''
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

export function getVideoPath(userId: string, storyId: string): string {
  return `${userId}/${storyId}/video`
}

export function getThumbnailPath(userId: string, storyId: string): string {
  return `${userId}/${storyId}/thumbnail`
}

export function getAvatarPath(userId: string): string {
  return `avatars/${userId}`
}
