/**
 * Central Route Authorization Configuration
 *
 * This file defines the authorization requirements for all routes in the application.
 * It provides a single source of truth for what roles/tiers can access each route.
 */

export type UserRole = 'user' | 'creator' | 'admin'
export type UserTier = 'free' | 'family' | 'legacy'

export interface RouteAuthConfig {
  /** If true, route requires authentication */
  requiresAuth: boolean
  /** Minimum role required (null = any authenticated user) */
  minRole?: UserRole | null
  /** Minimum tier required (null = any tier) */
  minTier?: UserTier | null
  /** Where to redirect unauthenticated users */
  redirectTo?: string
  /** Where to redirect users without required role */
  roleRedirectTo?: string
  /** Custom message to show on redirect */
  redirectMessage?: string
}

/**
 * Role hierarchy for comparison
 * Higher index = more permissions
 */
export const ROLE_HIERARCHY: UserRole[] = ['user', 'creator', 'admin']

/**
 * Tier hierarchy for comparison
 * Higher index = more features
 */
export const TIER_HIERARCHY: UserTier[] = ['free', 'family', 'legacy']

/**
 * Check if a role meets the minimum requirement
 */
export function hasMinimumRole(userRole: UserRole | null, minRole: UserRole): boolean {
  if (!userRole) return false
  const userIndex = ROLE_HIERARCHY.indexOf(userRole)
  const minIndex = ROLE_HIERARCHY.indexOf(minRole)
  return userIndex >= minIndex
}

/**
 * Check if a tier meets the minimum requirement
 */
export function hasMinimumTier(userTier: UserTier | null, minTier: UserTier): boolean {
  if (!userTier) return false
  const userIndex = TIER_HIERARCHY.indexOf(userTier)
  const minIndex = TIER_HIERARCHY.indexOf(minTier)
  return userIndex >= minIndex
}

/**
 * Route configuration for protected routes
 *
 * Routes not listed here are considered public.
 * Use pattern matching for dynamic routes.
 */
export const ROUTE_AUTH_CONFIG: Record<string, RouteAuthConfig> = {
  // =============================================================================
  // USER ROUTES - Any authenticated user
  // =============================================================================
  '/account': {
    requiresAuth: true,
    minRole: null,
    redirectTo: '/auth/signin',
  },
  '/account/testimonies': {
    requiresAuth: true,
    minRole: null,
    redirectTo: '/auth/signin',
  },

  // =============================================================================
  // CREATOR ROUTES - Creator role or higher
  // =============================================================================
  '/record': {
    requiresAuth: true,
    minRole: 'creator',
    redirectTo: '/auth/signin',
    roleRedirectTo: '/auth/signup?plan=family',
    redirectMessage: 'Upgrade to Family plan to record testimonies',
  },
  '/creator': {
    requiresAuth: true,
    minRole: 'creator',
    redirectTo: '/auth/signin',
    roleRedirectTo: '/account',
  },
  '/creator/testimonies': {
    requiresAuth: true,
    minRole: 'creator',
    redirectTo: '/auth/signin',
    roleRedirectTo: '/account',
  },
  '/creator/analytics': {
    requiresAuth: true,
    minRole: 'creator',
    redirectTo: '/auth/signin',
    roleRedirectTo: '/account',
  },

  // =============================================================================
  // ADMIN ROUTES - Admin role only
  // =============================================================================
  '/admin': {
    requiresAuth: true,
    minRole: 'admin',
    redirectTo: '/auth/signin',
    roleRedirectTo: '/',
  },
  '/admin/testimonies': {
    requiresAuth: true,
    minRole: 'admin',
    redirectTo: '/auth/signin',
    roleRedirectTo: '/',
  },
  '/admin/users': {
    requiresAuth: true,
    minRole: 'admin',
    redirectTo: '/auth/signin',
    roleRedirectTo: '/',
  },
  '/admin/analytics': {
    requiresAuth: true,
    minRole: 'admin',
    redirectTo: '/auth/signin',
    roleRedirectTo: '/',
  },
  '/admin/moderation': {
    requiresAuth: true,
    minRole: 'admin',
    redirectTo: '/auth/signin',
    roleRedirectTo: '/',
  },
  '/admin/settings': {
    requiresAuth: true,
    minRole: 'admin',
    redirectTo: '/auth/signin',
    roleRedirectTo: '/',
  },
}

/**
 * Get auth config for a route, handling pattern matching
 */
export function getRouteAuthConfig(pathname: string): RouteAuthConfig | null {
  // Remove locale prefix if present (e.g., /en/account -> /account)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/'

  // Direct match
  if (ROUTE_AUTH_CONFIG[pathWithoutLocale]) {
    return ROUTE_AUTH_CONFIG[pathWithoutLocale]
  }

  // Pattern match for nested routes
  for (const [pattern, config] of Object.entries(ROUTE_AUTH_CONFIG)) {
    if (pathWithoutLocale.startsWith(pattern + '/') || pathWithoutLocale === pattern) {
      return config
    }
  }

  return null
}

/**
 * Check if a route is public (no auth required)
 */
export function isPublicRoute(pathname: string): boolean {
  return getRouteAuthConfig(pathname) === null
}

/**
 * Route groups for easy reference
 */
export const ROUTE_GROUPS = {
  public: [
    '/',
    '/about',
    '/pricing',
    '/testimonies',
    '/support',
    '/terms',
    '/privacy',
    '/offline',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
  ],
  user: ['/account', '/account/testimonies'],
  creator: ['/record', '/creator', '/creator/testimonies', '/creator/analytics'],
  admin: [
    '/admin',
    '/admin/testimonies',
    '/admin/users',
    '/admin/analytics',
    '/admin/moderation',
    '/admin/settings',
  ],
} as const
