import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Button } from '@metanoia/ui'
import { Heart, Target, Eye, ArrowRight } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div>
      <AboutHero />
      <MissionSection />
      <MeaningSection />
      <VisionSection />
      <JoinCTA />
    </div>
  )
}

function AboutHero() {
  const t = useTranslations('about')

  return (
    <section className="section bg-gradient-to-br from-warm-50 to-primary-50/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold text-warm-900 md:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
        </div>
      </div>
    </section>
  )
}

function MissionSection() {
  const t = useTranslations('about.mission')

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-100">
              <Target className="h-10 w-10 text-primary-600" />
            </div>
            <div>
              <h2 className="mb-4 font-display text-3xl font-bold text-warm-900">
                {t('title')}
              </h2>
              <p className="text-lg leading-relaxed text-warm-600">{t('description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MeaningSection() {
  const t = useTranslations('about.meaning')

  return (
    <section className="section bg-warm-50">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-8 md:flex-row-reverse md:items-start">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-accent-100">
              <Heart className="h-10 w-10 text-accent-600" />
            </div>
            <div>
              <h2 className="mb-4 font-display text-3xl font-bold text-warm-900">
                {t('title')}
              </h2>
              <p className="text-lg leading-relaxed text-warm-600">{t('description')}</p>

              <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
                <p className="font-serif text-2xl italic text-warm-700">
                  "μετάνοια"
                </p>
                <p className="mt-2 text-warm-600">
                  <span className="font-semibold">Metanoia</span> — A transformative
                  change of heart; to turn around completely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VisionSection() {
  const t = useTranslations('about.vision')

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-100">
              <Eye className="h-10 w-10 text-secondary-600" />
            </div>
            <div>
              <h2 className="mb-4 font-display text-3xl font-bold text-warm-900">
                {t('title')}
              </h2>
              <p className="text-lg leading-relaxed text-warm-600">{t('description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function JoinCTA() {
  return (
    <section className="section bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Be Part of the Story
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Your testimony could be the very thing that leads someone to Christ. Share
            your story and leave a legacy of faith.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/record">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Share Your Testimony
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/support">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Support the Mission
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
