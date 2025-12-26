'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@metanoia/ui'
import {
  Check,
  X,
  Sparkles,
  Users,
  Crown,
  Church,
  ArrowRight,
  Video,
  Download,
  Shield,
  Infinity,
  Clock,
  QrCode,
  HardDrive,
  BookOpen,
  Phone,
  Heart,
} from 'lucide-react'
import { AnimateOnScroll, StaggerChildren } from '@/components/animations'

type BillingCycle = 'monthly' | 'yearly'

const TIERS = {
  free: {
    name: 'Free',
    tagline: 'Your Story',
    description: 'Everything you need to share your story',
    monthlyPrice: 0,
    yearlyPrice: 0,
    oneTimePrice: null as number | null,
    icon: Video,
    color: 'from-blue-400 to-cyan-500',
    popular: false,
    features: [
      { text: 'Unlimited stories', included: true },
      { text: '10-minute videos', included: true },
      { text: 'Forever storage', included: true },
      { text: '720p HD quality', included: true },
      { text: 'Public, unlisted, or private', included: true },
      { text: 'HD downloads (own videos)', included: true },
      { text: 'QR code generation', included: true },
      { text: 'Full prompt library', included: true },
      { text: 'Family Vault', included: false },
      { text: '4K video quality', included: false },
      { text: 'No branding watermark', included: false },
    ],
    cta: 'Get Started Free',
    ctaHref: '/auth/signup',
  },
  family: {
    name: 'Family',
    tagline: 'Your Legacy',
    description: 'Preserve stories together as a family',
    monthlyPrice: 9.99,
    yearlyPrice: 79,
    oneTimePrice: null as number | null,
    icon: Users,
    color: 'from-primary-400 to-primary-600',
    popular: true,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Family Vault (private archive)', included: true },
      { text: 'Up to 10 family contributors', included: true },
      { text: '4K video quality', included: true },
      { text: 'No branding watermark', included: true },
      { text: 'Family tree visualization', included: true },
      { text: 'Story responses (reply to family)', included: true },
      { text: 'Memorial mode', included: true },
      { text: 'Family notifications', included: true },
      { text: 'Download any family story', included: true },
      { text: 'IPFS backup', included: false },
      { text: 'Physical products', included: false },
    ],
    cta: 'Start Family Plan',
    ctaHref: '/auth/signup?plan=family',
  },
  legacy: {
    name: 'Legacy',
    tagline: 'Generations',
    description: 'Preserve your stories for eternity',
    monthlyPrice: 19.99,
    yearlyPrice: 199,
    oneTimePrice: 199 as number | null,
    icon: Crown,
    color: 'from-amber-400 to-orange-500',
    popular: false,
    features: [
      { text: 'Everything in Family', included: true },
      { text: 'Unlimited family members', included: true },
      { text: 'IPFS decentralized backup', included: true },
      { text: 'Annual USB drive mailed', included: true },
      { text: '1 hardcover book/year', included: true },
      { text: 'QR frame art printables', included: true },
      { text: 'Estate documentation', included: true },
      { text: 'Annual contact verification', included: true },
      { text: 'Phone support', included: true },
      { text: 'Priority processing', included: true },
    ],
    cta: 'Go Legacy',
    ctaHref: '/auth/signup?plan=legacy',
  },
}

const CHURCH_TIERS = [
  { size: '< 100 members', price: 'Free', stories: '50/year' },
  { size: '100-500 members', price: '$29/mo', stories: '200/year' },
  { size: '500+ members', price: '$99/mo', stories: 'Unlimited' },
]

export default function PricingPage() {
  const t = useTranslations('pricing')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly')

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-50 to-white">
      {/* Hero */}
      <section className="section">
        <div className="container">
          <AnimateOnScroll animation="fade-in-up" className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
              <Sparkles className="h-4 w-4" />
              {t('badge')}
            </div>
            <h1 className="font-display text-4xl font-bold text-warm-900 md:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg text-warm-600 md:text-xl">{t('subtitle')}</p>

            {/* Billing toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-warm-100 p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-warm-900 shadow-sm'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                {t('monthly')}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-warm-900 shadow-sm'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                {t('yearly')}
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {t('savePercent')}
                </span>
              </button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section pt-0">
        <div className="container">
          <StaggerChildren
            animation="fade-in-up"
            staggerDelay={100}
            className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3"
          >
            {Object.entries(TIERS).map(([key, tier]) => {
              const Icon = tier.icon
              const price = billingCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice
              const isPopular = tier.popular

              return (
                <div
                  key={key}
                  className={`relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isPopular ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-primary-500 px-3 py-1 text-xs font-medium text-white">
                      {t('mostPopular')}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${tier.color} text-white`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-warm-900">
                          {tier.name}
                        </h3>
                        <p className="text-sm text-warm-500">{tier.tagline}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-6">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-4xl font-bold text-warm-900">
                          ${price === 0 ? '0' : price}
                        </span>
                        {price > 0 && (
                          <span className="text-warm-500">
                            /{billingCycle === 'yearly' ? t('year') : t('month')}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && tier.monthlyPrice > 0 && (
                        <p className="mt-1 text-sm text-warm-500">
                          {t('billedYearly', { amount: tier.yearlyPrice })}
                        </p>
                      )}
                      {key === 'legacy' && (
                        <p className="mt-1 text-sm text-green-600">
                          {t('orOneTime', { amount: tier.oneTimePrice })}
                        </p>
                      )}
                    </div>

                    <p className="mt-4 text-sm text-warm-600">{tier.description}</p>

                    {/* CTA */}
                    <Link href={tier.ctaHref} className="mt-6 block">
                      <Button
                        className="w-full"
                        variant={isPopular ? 'primary' : 'outline'}
                        size="lg"
                      >
                        {tier.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>

                    {/* Features */}
                    <ul className="mt-8 space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                          ) : (
                            <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-warm-300" />
                          )}
                          <span
                            className={`text-sm ${feature.included ? 'text-warm-700' : 'text-warm-400'}`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Church Section */}
      <section className="section bg-gradient-to-br from-primary-50 to-warm-50">
        <div className="container">
          <AnimateOnScroll animation="fade-in-up" className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-warm-700 shadow-sm">
              <Church className="h-4 w-4" />
              {t('church.badge')}
            </div>
            <h2 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
              {t('church.title')}
            </h2>
            <p className="mt-4 text-lg text-warm-600">{t('church.subtitle')}</p>
          </AnimateOnScroll>

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-xl bg-white shadow-lg">
            <table className="w-full">
              <thead className="bg-warm-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-warm-900">
                    {t('church.size')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-warm-900">
                    {t('church.price')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-warm-900">
                    {t('church.stories')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {CHURCH_TIERS.map((tier, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-warm-50">
                    <td className="px-6 py-4 text-sm text-warm-700">{tier.size}</td>
                    <td className="px-6 py-4 text-sm font-medium text-warm-900">{tier.price}</td>
                    <td className="px-6 py-4 text-sm text-warm-700">{tier.stories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-warm-100 bg-warm-50 px-6 py-4">
              <Link href="/contact?type=church">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Church className="mr-2 h-4 w-4" />
                  {t('church.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="container">
          <AnimateOnScroll animation="fade-in-up" className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
              {t('features.title')}
            </h2>
            <p className="mt-4 text-lg text-warm-600">{t('features.subtitle')}</p>
          </AnimateOnScroll>

          <StaggerChildren
            animation="fade-in-up"
            staggerDelay={50}
            className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: Infinity,
                title: t('features.unlimited.title'),
                description: t('features.unlimited.description'),
              },
              {
                icon: Clock,
                title: t('features.forever.title'),
                description: t('features.forever.description'),
              },
              {
                icon: Shield,
                title: t('features.secure.title'),
                description: t('features.secure.description'),
              },
              {
                icon: QrCode,
                title: t('features.qr.title'),
                description: t('features.qr.description'),
              },
              {
                icon: Download,
                title: t('features.download.title'),
                description: t('features.download.description'),
              },
              {
                icon: Heart,
                title: t('features.support.title'),
                description: t('features.support.description'),
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-warm-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-warm-600">{feature.description}</p>
                </div>
              )
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-warm-50">
        <div className="container">
          <AnimateOnScroll animation="fade-in-up" className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
              {t('faq.title')}
            </h2>
          </AnimateOnScroll>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {[
              { q: t('faq.q1'), a: t('faq.a1') },
              { q: t('faq.q2'), a: t('faq.a2') },
              { q: t('faq.q3'), a: t('faq.a3') },
              { q: t('faq.q4'), a: t('faq.a4') },
            ].map((faq, idx) => (
              <AnimateOnScroll key={idx} animation="fade-in-up" delay={idx * 50}>
                <details className="group rounded-xl bg-white p-6 shadow-sm">
                  <summary className="flex cursor-pointer items-center justify-between font-medium text-warm-900">
                    {faq.q}
                    <span className="ml-4 text-warm-400 transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-warm-600">{faq.a}</p>
                </details>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <AnimateOnScroll animation="scale-in">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 text-center md:p-12">
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                {t('cta.title')}
              </h2>
              <p className="mt-4 text-lg text-primary-100">{t('cta.description')}</p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                    {t('cta.button')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/testimonies">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    {t('cta.watch')}
                  </Button>
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
