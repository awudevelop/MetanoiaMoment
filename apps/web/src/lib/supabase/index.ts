// =============================================================================
// SUPABASE CLIENT EXPORTS
// =============================================================================

// Browser client
export { createClient, getClient } from './client'

// Server clients
export { createClient as createServerClient, createRouteHandlerClient } from './server'

// Middleware
export { updateSession } from './middleware'

// Types
export type { Database } from './types'
export type {
  Profile,
  Story,
  FamilyVault,
  FamilyMember,
  Prompt,
  StoryResponse,
  StoryLike,
  StoryView,
  Referral,
  Organization,
  OrganizationMember,
  Tables,
  InsertTables,
  UpdateTables,
} from './types'

// Helpers
export {
  transformProfile,
  transformProfileToPreview,
  transformStory,
  SupabaseError,
  handleSupabaseError,
  buildPagination,
  getStorageUrl,
  getVideoPath,
  getThumbnailPath,
  getAvatarPath,
} from './helpers'
