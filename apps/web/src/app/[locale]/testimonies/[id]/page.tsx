import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getTestimonyById } from '@/lib/mock-data'
import { generateTestimonyMetadata, generateTestimonyJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/json-ld'
import { TestimonyDetailClient } from './testimony-detail-client'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params
  const testimony = getTestimonyById(id)

  if (!testimony) {
    return {
      title: 'Testimony Not Found',
      description: 'This testimony could not be found.',
    }
  }

  return generateTestimonyMetadata(testimony, locale)
}

export default async function TestimonyDetailPage({ params }: Props) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const testimony = getTestimonyById(id)

  // Generate structured data for SEO
  const jsonLdData = testimony
    ? [
        generateTestimonyJsonLd(testimony),
        generateBreadcrumbJsonLd([
          { name: 'Home', url: 'https://metanoiamoment.org' },
          { name: 'Testimonies', url: 'https://metanoiamoment.org/testimonies' },
          { name: testimony.title, url: `https://metanoiamoment.org/testimonies/${testimony.id}` },
        ]),
      ]
    : []

  return (
    <>
      {testimony && <JsonLd data={jsonLdData} />}
      <TestimonyDetailClient testimonyId={id} initialTestimony={testimony} />
    </>
  )
}
