import type { Metadata } from 'next'
import type { Testimony } from '@/types'

// =============================================================================
// SEO UTILITIES
// Centralized SEO configuration and helpers for metadata generation.
// =============================================================================

const SITE_NAME = 'Metanoia Moment'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://metanoiamoment.org'

/**
 * Generate OG image URL with parameters
 */
export function generateOgImageUrl(params: {
  title: string
  description?: string
  author?: string
  type?: 'default' | 'testimony'
}): string {
  const searchParams = new URLSearchParams()
  searchParams.set('title', params.title)
  if (params.description) searchParams.set('description', params.description.slice(0, 100))
  if (params.author) searchParams.set('author', params.author)
  if (params.type) searchParams.set('type', params.type)
  return `${SITE_URL}/api/og?${searchParams.toString()}`
}

const DEFAULT_OG_IMAGE = generateOgImageUrl({
  title: 'Metanoia Moment',
  description: 'Share your testimony of transformation through Jesus Christ',
})

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article' | 'video.other'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  noIndex?: boolean
  locale?: string
  alternates?: Record<string, string>
}

/**
 * Generate metadata for a page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = DEFAULT_OG_IMAGE,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    noIndex = false,
    locale = 'en',
  } = config

  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`

  return {
    title,
    description,
    keywords: [...keywords, 'testimony', 'faith', 'Jesus', 'transformation', 'Christian'],
    authors: author ? [{ name: author }] : [{ name: SITE_NAME }],
    openGraph: {
      title: fullTitle,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: SITE_URL,
    },
  }
}

/**
 * Generate metadata for a testimony page
 */
export function generateTestimonyMetadata(testimony: Testimony, locale: string = 'en'): Metadata {
  const description = testimony.description
    ? testimony.description.slice(0, 160)
    : `Watch ${testimony.author?.fullName || 'this'}'s testimony of transformation through Jesus Christ.`

  // Generate dynamic OG image with testimony details
  const ogImage = generateOgImageUrl({
    title: testimony.title,
    description: description.slice(0, 100),
    author: testimony.author?.fullName,
    type: 'testimony',
  })

  return generateMetadata({
    title: testimony.title,
    description,
    keywords: testimony.tags,
    image: ogImage,
    type: 'video.other',
    publishedTime: testimony.publishedAt || undefined,
    modifiedTime: testimony.updatedAt,
    author: testimony.author?.fullName || undefined,
    locale,
  })
}

/**
 * Generate JSON-LD structured data for a testimony
 */
export function generateTestimonyJsonLd(testimony: Testimony): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: testimony.title,
    description: testimony.description || `A testimony from ${testimony.author?.fullName || 'anonymous'}`,
    thumbnailUrl: testimony.thumbnailUrl || DEFAULT_OG_IMAGE,
    uploadDate: testimony.createdAt,
    ...(testimony.publishedAt && { datePublished: testimony.publishedAt }),
    duration: testimony.duration ? `PT${Math.floor(testimony.duration / 60)}M${testimony.duration % 60}S` : undefined,
    contentUrl: testimony.videoUrl,
    embedUrl: `${SITE_URL}/testimonies/${testimony.id}`,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: testimony.viewCount,
    },
    author: testimony.author
      ? {
          '@type': 'Person',
          name: testimony.author.fullName || 'Anonymous',
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: testimony.tags.join(', '),
    inLanguage: testimony.language,
  }
}

/**
 * Generate JSON-LD for the website (homepage)
 */
export function generateWebsiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Share your testimony of transformation through Jesus Christ. Capture your story for generations.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/testimonies?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate JSON-LD for the organization
 */
export function generateOrganizationJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/metanoiamoment',
      'https://facebook.com/metanoiamoment',
      'https://instagram.com/metanoiamoment',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@metanoiamoment.org',
      contactType: 'customer service',
    },
  }
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
