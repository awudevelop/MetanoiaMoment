import { MetadataRoute } from 'next'
import { getTestimonies } from '@/lib/mock-data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://metanoiamoment.org'

// Supported locales
const locales = ['en', 'es', 'pt', 'fr']

export default function sitemap(): MetadataRoute.Sitemap {
  const testimonies = getTestimonies({ filters: { status: 'approved' } })

  // Static pages for each locale
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/${locale}/testimonies`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/${locale}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/${locale}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ])

  // Testimony pages for each locale
  const testimonyPages = testimonies.data.flatMap((testimony) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/testimonies/${testimony.id}`,
      lastModified: new Date(testimony.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  return [...staticPages, ...testimonyPages]
}
