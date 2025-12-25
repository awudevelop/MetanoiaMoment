import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

// =============================================================================
// MIDDLEWARE
// Currently only handles internationalization.
// When implementing auth backend, add session validation here.
// =============================================================================

const intlMiddleware = createMiddleware(routing)

export default intlMiddleware

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - Next.js internals
    // - Static files
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
