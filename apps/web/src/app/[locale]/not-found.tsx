import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@metanoia/ui'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <div className="section flex items-center justify-center">
      <div className="mx-auto max-w-lg py-20 text-center">
        {/* 404 Display */}
        <div className="relative mb-8 animate-fade-in">
          <div className="text-[150px] font-bold leading-none text-warm-100 md:text-[200px]">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-primary-100 p-6 animate-scale-in">
              <Search className="h-12 w-12 text-primary-500" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="font-display text-3xl font-bold text-warm-900 md:text-4xl animate-fade-in-up">
          {t('title')}
        </h1>
        <p className="mt-4 text-lg text-warm-600 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {t('description')}
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-5 w-5" />
              {t('goHome')}
            </Button>
          </Link>
          <Link href="/testimonies">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Search className="mr-2 h-5 w-5" />
              Browse Testimonies
            </Button>
          </Link>
        </div>

        {/* Inspirational Quote */}
        <div className="mt-12 rounded-xl bg-warm-50 p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <p className="font-serif text-lg italic text-warm-700">
            "For I know the plans I have for you," declares the Lord, "plans to prosper you
            and not to harm you, plans to give you hope and a future."
          </p>
          <p className="mt-2 text-sm text-warm-500">— Jeremiah 29:11</p>
        </div>
      </div>
    </div>
  )
}
