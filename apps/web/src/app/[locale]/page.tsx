import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Button, TestimonyCard } from '@metanoia/ui'
import {
  ArrowRight,
  Play,
  Globe,
  Users,
  Video,
  Sparkles,
  Clock,
  Layers,
  Check,
  Crown,
} from 'lucide-react'
import { AnimateOnScroll, StaggerChildren, CountUp, AnimatedCard } from '@/components/animations'
import { FeaturedTestimoniesClient } from './featured-testimonies-client'
import { RecentlySharedClient } from './recently-shared-client'
import { CategoryBrowseClient } from './category-browse-client'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <HeroSection />
      <FeaturedTestimonies />
      <CategoryBrowse />
      <RecentlyShared />
      <ImpactSection />
      <PricingPreview />
      <CTASection />
    </>
  )
}

function RecentlyShared() {
  const t = useTranslations('home.recentlyShared')

  return (
    <section className="section bg-warm-50">
      <div className="container">
        <AnimateOnScroll animation="fade-in-up" className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-100 px-4 py-1.5 text-sm font-medium text-accent-700">
            <Sparkles className="h-4 w-4" />
            Live Activity
          </div>
          <h2 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-warm-600">{t('subtitle')}</p>
        </AnimateOnScroll>

        <RecentlySharedClient />
      </div>
    </section>
  )
}

function HeroSection() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-warm-50 via-primary-50/30 to-warm-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 animate-pulse-soft rounded-full bg-primary-100 opacity-50 blur-3xl" />
        <div
          className="absolute -bottom-20 -left-20 h-96 w-96 animate-pulse-soft rounded-full bg-accent-100 opacity-50 blur-3xl"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="container relative">
        <div className="flex min-h-[80vh] flex-col items-center justify-center py-20 text-center">
          <AnimateOnScroll animation="fade-in-down" delay={0}>
            <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-warm-900 sm:text-5xl md:text-6xl lg:text-7xl">
              {t('title')}
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-in-up" delay={200}>
            <p className="mt-6 max-w-2xl text-lg text-warm-600 md:text-xl">{t('subtitle')}</p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-in-up" delay={400}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/record">
                <Button
                  size="lg"
                  className="group transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  {t('cta')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/testimonies">
                <Button
                  variant="outline"
                  size="lg"
                  className="group transition-all duration-300 hover:scale-105"
                >
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  {t('watchTestimonies')}
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}

function FeaturedTestimonies() {
  const t = useTranslations('home.featured')

  return (
    <section className="section bg-white">
      <div className="container">
        <AnimateOnScroll animation="fade-in-up" className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-warm-600">{t('subtitle')}</p>
        </AnimateOnScroll>

        <FeaturedTestimoniesClient />

        <AnimateOnScroll animation="fade-in-up" delay={400} className="mt-12 text-center">
          <Link href="/testimonies">
            <Button
              variant="outline"
              size="lg"
              className="group transition-all duration-300 hover:scale-105"
            >
              View All Testimonies
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  )
}

function CategoryBrowse() {
  const t = useTranslations('home.categories')

  return (
    <section className="section bg-warm-50">
      <div className="container">
        <AnimateOnScroll animation="fade-in-up" className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
            <Layers className="h-4 w-4" />
            {t('badge')}
          </div>
          <h2 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-warm-600">{t('subtitle')}</p>
        </AnimateOnScroll>

        <CategoryBrowseClient />
      </div>
    </section>
  )
}

function ImpactSection() {
  const t = useTranslations('home.impact')

  const stats = [
    { icon: Video, value: 500, suffix: '+', label: t('testimoniesShared') },
    { icon: Globe, value: 45, suffix: '', label: t('countriesReached') },
    { icon: Users, value: 50, suffix: 'K+', label: t('livesTouched') },
  ]

  return (
    <section className="section bg-gradient-to-br from-primary-600 to-primary-700">
      <div className="container">
        <AnimateOnScroll animation="fade-in-up">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-white md:text-4xl">
            {t('title')}
          </h2>
        </AnimateOnScroll>

        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <AnimateOnScroll
              key={index}
              animation="scale-in"
              delay={index * 150}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 hover:scale-110 hover:bg-white/20">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white md:text-5xl">
                <CountUp end={stat.value} duration={2000} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-lg text-primary-100">{stat.label}</div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingPreview() {
  const t = useTranslations('home.pricing')

  const tiers = [
    {
      name: t('free.name'),
      price: '$0',
      period: t('free.period'),
      description: t('free.description'),
      features: [t('free.f1'), t('free.f2'), t('free.f3')],
      cta: t('free.cta'),
      href: '/auth/signup',
      icon: Video,
      color: 'from-blue-400 to-cyan-500',
      popular: false,
    },
    {
      name: t('family.name'),
      price: '$9.99',
      period: t('family.period'),
      description: t('family.description'),
      features: [t('family.f1'), t('family.f2'), t('family.f3')],
      cta: t('family.cta'),
      href: '/pricing',
      icon: Users,
      color: 'from-primary-400 to-primary-600',
      popular: true,
    },
    {
      name: t('legacy.name'),
      price: '$199',
      period: t('legacy.period'),
      description: t('legacy.description'),
      features: [t('legacy.f1'), t('legacy.f2'), t('legacy.f3')],
      cta: t('legacy.cta'),
      href: '/pricing',
      icon: Crown,
      color: 'from-amber-400 to-orange-500',
      popular: false,
    },
  ]

  return (
    <section className="section bg-warm-50">
      <div className="container">
        <AnimateOnScroll animation="fade-in-up" className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
            <Sparkles className="h-4 w-4" />
            {t('badge')}
          </div>
          <h2 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-warm-600">{t('subtitle')}</p>
        </AnimateOnScroll>

        <StaggerChildren
          animation="fade-in-up"
          staggerDelay={100}
          className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3"
        >
          {tiers.map((tier) => {
            const Icon = tier.icon
            return (
              <div
                key={tier.name}
                className={`relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  tier.popular ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-primary-500 px-3 py-1 text-xs font-medium text-white">
                    {t('popular')}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tier.color} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-warm-900">{tier.name}</h3>
                </div>

                <div className="mt-4">
                  <span className="text-3xl font-bold text-warm-900">{tier.price}</span>
                  <span className="text-warm-500">/{tier.period}</span>
                </div>

                <p className="mt-2 text-sm text-warm-600">{tier.description}</p>

                <ul className="mt-4 space-y-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-warm-700">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={tier.href} className="mt-6 block">
                  <Button
                    variant={tier.popular ? 'primary' : 'outline'}
                    className="w-full"
                    size="sm"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            )
          })}
        </StaggerChildren>

        <AnimateOnScroll animation="fade-in-up" delay={400} className="mt-10 text-center">
          <Link href="/pricing">
            <Button variant="ghost" className="group">
              {t('viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  )
}

function CTASection() {
  const t = useTranslations('home.cta')

  return (
    <section className="section">
      <div className="container">
        <AnimateOnScroll animation="scale-in">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-warm-100 to-primary-50 p-8 text-center transition-all duration-500 hover:shadow-xl md:p-12">
            <h2 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-lg text-warm-600">{t('description')}</p>
            <Link href="/record" className="mt-8 inline-block">
              <Button
                size="lg"
                className="group transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {t('button')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
