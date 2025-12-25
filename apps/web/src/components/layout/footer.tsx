import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Heart } from 'lucide-react'
import { cn } from '@metanoia/ui'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn('border-t border-warm-200 bg-white', className)}>
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="font-display text-xl font-semibold text-warm-900">
                Metanoia Moment
              </span>
            </Link>
            <p className="mt-4 max-w-md text-warm-600">{t('tagline')}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold text-warm-900">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/testimonies"
                  className="text-warm-600 transition-colors hover:text-primary-600"
                >
                  {t('links.testimonies')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-warm-600 transition-colors hover:text-primary-600"
                >
                  {t('links.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-warm-600 transition-colors hover:text-primary-600"
                >
                  {t('links.support')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold text-warm-900">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-warm-600 transition-colors hover:text-primary-600"
                >
                  {t('links.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-warm-600 transition-colors hover:text-primary-600"
                >
                  {t('links.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-warm-200 pt-8 md:flex-row">
          <p className="text-sm text-warm-500">
            {t('copyright', { year: currentYear })}
          </p>
          <p className="flex items-center gap-1 text-sm text-warm-500">
            Made with <Heart className="h-4 w-4 text-red-500" fill="currentColor" /> for His glory
          </p>
        </div>
      </div>
    </footer>
  )
}
