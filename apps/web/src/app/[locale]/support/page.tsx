import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Button, Card, CardContent } from '@metanoia/ui'
import { Heart, Share2, Video, HandHeart } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function SupportPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="section">
      <div className="container">
        <SupportHeader />
        <DonationSection />
        <OtherWaysSection />
      </div>
    </div>
  )
}

function SupportHeader() {
  const t = useTranslations('support')

  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
        <Heart className="h-8 w-8 text-primary-600" />
      </div>
      <h1 className="font-display text-4xl font-bold text-warm-900 md:text-5xl">
        {t('title')}
      </h1>
      <p className="mt-4 text-lg text-warm-600">{t('subtitle')}</p>
      <p className="mt-4 max-w-2xl text-warm-600">{t('description')}</p>
    </div>
  )
}

function DonationSection() {
  const t = useTranslations('support.donate')

  const amounts = ['$10', '$25', '$50', '$100']

  return (
    <div className="mx-auto mt-16 max-w-xl">
      <Card>
        <CardContent className="p-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-warm-900">
            {t('title')}
          </h2>

          {/* Frequency toggle */}
          <div className="mb-6 flex justify-center gap-2 rounded-lg bg-warm-100 p-1">
            <button className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-warm-900 shadow-sm">
              {t('monthly')}
            </button>
            <button className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-warm-600 hover:text-warm-900">
              {t('oneTime')}
            </button>
          </div>

          {/* Amount selection */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {amounts.map((amount, index) => (
              <button
                key={amount}
                className={`rounded-lg border-2 py-3 text-lg font-semibold transition-colors ${
                  index === 1
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-warm-200 text-warm-700 hover:border-primary-300'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-warm-700">
              {t('custom')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-500">
                $
              </span>
              <input
                type="number"
                placeholder="0"
                className="w-full rounded-lg border border-warm-300 py-3 pl-8 pr-4 text-warm-900 placeholder:text-warm-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <Button className="w-full" size="lg">
            <HandHeart className="mr-2 h-5 w-5" />
            {t('button')}
          </Button>

          <p className="mt-4 text-center text-sm text-warm-500">
            Secure payment processing. Your generosity makes a difference.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function OtherWaysSection() {
  const t = useTranslations('support.other')

  const ways = [
    {
      icon: Video,
      title: t('share.title'),
      description: t('share.description'),
      href: '/record',
      color: 'primary',
    },
    {
      icon: Share2,
      title: t('spread.title'),
      description: t('spread.description'),
      href: '/testimonies',
      color: 'accent',
    },
    {
      icon: Heart,
      title: t('pray.title'),
      description: t('pray.description'),
      href: '/about',
      color: 'secondary',
    },
  ]

  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    accent: 'bg-accent-100 text-accent-600',
    secondary: 'bg-secondary-100 text-secondary-600',
  }

  return (
    <div className="mt-20">
      <h2 className="mb-8 text-center text-2xl font-bold text-warm-900">{t('title')}</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {ways.map((way) => (
          <Link key={way.title} href={way.href}>
            <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${colorClasses[way.color as keyof typeof colorClasses]}`}
                >
                  <way.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-warm-900">{way.title}</h3>
                <p className="text-warm-600">{way.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
