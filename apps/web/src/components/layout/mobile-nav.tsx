'use client'

import { useState, useEffect } from 'react'
import { usePathname } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Home, Video, Mic, Heart, User, Shield, Sparkles } from 'lucide-react'
import { cn } from '@metanoia/ui'
import { useAuthStore, useIsAdmin, useIsCreator } from '@/lib/stores/auth-store'

interface NavItem {
  key: string
  href: string
  icon: typeof Home
  primary?: boolean
  authHref?: string
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '/', icon: Home },
  { key: 'testimonies', href: '/testimonies', icon: Video },
  { key: 'record', href: '/record', icon: Mic, primary: true },
  { key: 'support', href: '/support', icon: Heart },
  { key: 'account', href: '/auth/signin', authHref: '/account', icon: User },
]

export function MobileNav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuthStore()
  const isAdmin = useIsAdmin()
  const isCreator = useIsCreator()
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide nav on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Get the right account href based on role
  const getAccountHref = () => {
    if (!isAuthenticated) return '/auth/signin'
    if (isAdmin) return '/admin'
    if (isCreator) return '/creator'
    return '/account'
  }

  // Get the right icon for account based on role
  const getAccountIcon = () => {
    if (isAdmin) return Shield
    if (isCreator) return Sparkles
    return User
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-warm-200 bg-white/95 backdrop-blur-lg transition-transform duration-300 md:hidden',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isAccountItem = item.key === 'account'
          const href = isAccountItem ? getAccountHref() : item.href
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          const Icon = isAccountItem ? getAccountIcon() : item.icon
          const isPressed = pressedKey === item.key

          if (item.primary) {
            return (
              <Link
                key={item.key}
                href={href}
                className="relative flex flex-col items-center justify-center"
                onTouchStart={() => setPressedKey(item.key)}
                onTouchEnd={() => setPressedKey(null)}
                onMouseDown={() => setPressedKey(item.key)}
                onMouseUp={() => setPressedKey(null)}
                onMouseLeave={() => setPressedKey(null)}
              >
                {/* Glow effect */}
                <div className="absolute -top-1 h-14 w-14 rounded-full bg-primary-400/20 blur-xl" />
                <div
                  className={cn(
                    'relative flex h-14 w-14 -translate-y-3 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-500/30 transition-all duration-150',
                    isPressed ? 'scale-90' : 'scale-100',
                    isActive && 'ring-2 ring-primary-300 ring-offset-2'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="absolute -bottom-0.5 text-[9px] font-semibold text-primary-600">
                  {t(item.key)}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                'group relative flex min-w-[60px] flex-col items-center justify-center gap-0.5 px-2 py-2 transition-all duration-150',
                isPressed && 'scale-95'
              )}
              onTouchStart={() => setPressedKey(item.key)}
              onTouchEnd={() => setPressedKey(null)}
              onMouseDown={() => setPressedKey(item.key)}
              onMouseUp={() => setPressedKey(null)}
              onMouseLeave={() => setPressedKey(null)}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-primary-500" />
              )}

              {/* Icon with badge for authenticated account */}
              <div className="relative">
                <Icon
                  className={cn(
                    'h-5 w-5 transition-colors duration-150',
                    isActive ? 'text-primary-600' : 'text-warm-400 group-hover:text-warm-600'
                  )}
                />
                {isAccountItem && isAuthenticated && user?.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="absolute -right-1 -top-1 h-3 w-3 rounded-full border border-white"
                  />
                )}
              </div>

              <span
                className={cn(
                  'text-[10px] font-medium transition-colors duration-150',
                  isActive ? 'text-primary-600' : 'text-warm-400 group-hover:text-warm-600'
                )}
              >
                {isAccountItem
                  ? isAuthenticated
                    ? isAdmin
                      ? 'Admin'
                      : isCreator
                        ? 'Portal'
                        : t('myAccount')
                    : t('signIn')
                  : t(item.key)}
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
