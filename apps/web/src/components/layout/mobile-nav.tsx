'use client'

import { usePathname } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Home, Video, Mic, Heart, User } from 'lucide-react'
import { cn } from '@metanoia/ui'
import { useAuthStore } from '@/lib/stores/auth-store'

const NAV_ITEMS = [
  { key: 'home', href: '/', icon: Home, primary: false },
  { key: 'testimonies', href: '/testimonies', icon: Video, primary: false },
  { key: 'record', href: '/record', icon: Mic, primary: true },
  { key: 'support', href: '/support', icon: Heart, primary: false },
  { key: 'account', href: '/auth/signin', authHref: '/account', icon: User, primary: false },
] as const

export function MobileNav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStore()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-warm-200 bg-white/95 backdrop-blur md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const href = item.key === 'account' && isAuthenticated ? item.authHref : item.href
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          const Icon = item.icon

          if (item.primary) {
            return (
              <Link
                key={item.key}
                href={href}
                className="flex flex-col items-center justify-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform active:scale-95">
                  <Icon className="h-6 w-6" />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                'flex min-w-[56px] flex-col items-center justify-center gap-1 px-2 py-1 transition-colors',
                isActive ? 'text-primary-600' : 'text-warm-500'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'text-primary-600')} />
              <span className="text-[10px] font-medium">
                {item.key === 'account' ? (isAuthenticated ? 'Profile' : t('signIn')) : t(item.key)}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  )
}
