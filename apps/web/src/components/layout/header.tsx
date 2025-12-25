'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, User, LogOut, Shield } from 'lucide-react'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import { Button, LanguageSwitcher } from '@metanoia/ui'
import { useAuthStore } from '@/lib/stores/auth-store'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { user, isAuthenticated, signOut } = useAuthStore()

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('testimonies'), href: '/testimonies' },
    { name: t('record'), href: '/record' },
    { name: t('about'), href: '/about' },
    { name: t('support'), href: '/support' },
  ]

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  const handleSignOut = () => {
    signOut()
    setUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-warm-200 bg-white/95 backdrop-blur">
      <nav className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <span className="hidden font-display text-xl font-semibold text-warm-900 sm:block">
              Metanoia Moment
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-warm-700 hover:bg-warm-100 hover:text-warm-900'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
            {user?.isAdmin && (
              <Link
                href="/admin"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-primary-600 hover:bg-primary-50'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher
              currentLocale={locale}
              onLocaleChange={handleLocaleChange}
              className="hidden sm:block"
            />

            {isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    {user.fullName?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                  </div>
                  <span className="hidden lg:block">{user.fullName || 'User'}</span>
                  {user.isAdmin && <Shield className="h-4 w-4 text-primary-500" />}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-warm-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-warm-100 px-4 py-2">
                      <p className="text-sm font-medium text-warm-900">{user.fullName}</p>
                      <p className="text-xs text-warm-500">{user.email}</p>
                    </div>
                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-warm-700 hover:bg-warm-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-warm-700 hover:bg-warm-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  {t('signIn')}
                </Button>
              </Link>
            )}

            <Link href="/record" className="hidden lg:block">
              <Button size="sm">{t('record')}</Button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="rounded-lg p-2 text-warm-700 hover:bg-warm-100 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-warm-200 py-4">
            <div className="flex flex-col gap-2">
              {navigation.map((item, index) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-warm-700 hover:bg-warm-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {item.name}
                  </Link>
                )
              })}
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-lg px-4 py-3 text-base font-medium text-primary-600 transition-colors hover:bg-primary-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <hr className="my-2 border-warm-200" />
              <div className="px-4">
                <LanguageSwitcher
                  currentLocale={locale}
                  onLocaleChange={handleLocaleChange}
                />
              </div>
              {isAuthenticated && user ? (
                <div className="px-4">
                  <p className="mb-2 text-sm text-warm-500">
                    Signed in as {user.fullName || user.email}
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('signOut')}
                  </Button>
                </div>
              ) : (
                <Link href="/auth/signin" className="px-4">
                  <Button variant="outline" className="w-full">
                    {t('signIn')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
