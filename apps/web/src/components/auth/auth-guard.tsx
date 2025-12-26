'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getRouteAuthConfig, hasMinimumRole, type UserRole } from '@/lib/auth/route-config'

interface AuthGuardProps {
  children: ReactNode
  /** Override the route-based config with explicit requirements */
  requireAuth?: boolean
  /** Minimum role required */
  minRole?: UserRole
  /** Custom redirect for unauthenticated users */
  redirectTo?: string
  /** Custom redirect for unauthorized users (wrong role) */
  roleRedirectTo?: string
  /** Custom loading component */
  loadingComponent?: ReactNode
  /** Custom fallback for unauthorized access (instead of redirect) */
  fallback?: ReactNode
}

/**
 * AuthGuard - Protects routes based on authentication and role requirements
 *
 * Usage:
 * 1. Wrap in a layout for route-group protection
 * 2. Use explicit props to override route config
 * 3. Automatically reads from central route config if no props provided
 *
 * @example
 * // In a layout.tsx - uses route config automatically
 * <AuthGuard>{children}</AuthGuard>
 *
 * @example
 * // With explicit requirements
 * <AuthGuard minRole="creator" fallback={<UpgradePrompt />}>
 *   {children}
 * </AuthGuard>
 */
export function AuthGuard({
  children,
  requireAuth,
  minRole,
  redirectTo,
  roleRedirectTo,
  loadingComponent,
  fallback,
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Get config from props or route config
    const routeConfig = getRouteAuthConfig(pathname)
    const needsAuth = requireAuth ?? routeConfig?.requiresAuth ?? false
    const requiredRole = minRole ?? routeConfig?.minRole ?? null
    const authRedirect = redirectTo ?? routeConfig?.redirectTo ?? '/auth/signin'
    const roleRedirect = roleRedirectTo ?? routeConfig?.roleRedirectTo ?? '/account'

    // Public route - allow access
    if (!needsAuth) {
      setIsAuthorized(true)
      setIsChecking(false)
      return
    }

    // Not authenticated - redirect to sign in
    if (!isAuthenticated) {
      if (!fallback) {
        router.replace(authRedirect)
      }
      setIsAuthorized(false)
      setIsChecking(false)
      return
    }

    // Check role requirements
    if (requiredRole && !hasMinimumRole(user?.role as UserRole | null, requiredRole)) {
      if (!fallback) {
        router.replace(roleRedirect)
      }
      setIsAuthorized(false)
      setIsChecking(false)
      return
    }

    // All checks passed
    setIsAuthorized(true)
    setIsChecking(false)
  }, [
    isAuthenticated,
    user,
    pathname,
    requireAuth,
    minRole,
    redirectTo,
    roleRedirectTo,
    fallback,
    router,
  ])

  // Show loading state
  if (isChecking) {
    return (
      loadingComponent ?? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      )
    )
  }

  // Not authorized - show fallback or nothing (redirect already triggered)
  if (!isAuthorized) {
    return fallback ?? null
  }

  // Authorized - render children
  return <>{children}</>
}

/**
 * Higher-order component version of AuthGuard
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps?: Omit<AuthGuardProps, 'children'>
) {
  return function GuardedComponent(props: P) {
    return (
      <AuthGuard {...guardProps}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
