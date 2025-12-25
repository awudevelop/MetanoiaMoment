'use client'

import { useState } from 'react'
import { TestimonyCard } from '@metanoia/ui'
import { Link } from '@/i18n/routing'
import { AnimateOnScroll, AnimatedCard } from '@/components/animations'
import { ShareModal } from '@/components/sharing'

// Mock data - replace with real data from Supabase
const testimonies = [
  {
    id: '1',
    title: 'From Addiction to Freedom',
    description: 'After 15 years of struggling with addiction, I found hope in Christ.',
    duration: 342,
    viewCount: 1245,
    authorName: 'Michael R.',
  },
  {
    id: '2',
    title: 'Healing from Grief',
    description: 'How God brought me through the darkest season of my life.',
    duration: 456,
    viewCount: 892,
    authorName: 'Sarah M.',
  },
  {
    id: '3',
    title: 'A Prodigal Returns',
    description: 'I ran from God for 20 years. Here is my story of coming home.',
    duration: 521,
    viewCount: 2103,
    authorName: 'David K.',
  },
]

export function FeaturedTestimoniesClient() {
  const [shareTestimony, setShareTestimony] = useState<typeof testimonies[0] | null>(null)

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonies.map((testimony, index) => (
          <AnimateOnScroll
            key={testimony.id}
            animation="fade-in-up"
            delay={index * 100}
          >
            <Link href={`/testimonies/${testimony.id}`}>
              <AnimatedCard hoverEffect="lift">
                <TestimonyCard
                  {...testimony}
                  className="h-full"
                  onShare={() => setShareTestimony(testimony)}
                />
              </AnimatedCard>
            </Link>
          </AnimateOnScroll>
        ))}
      </div>

      <ShareModal
        isOpen={!!shareTestimony}
        onClose={() => setShareTestimony(null)}
        url={shareTestimony ? `${typeof window !== 'undefined' ? window.location.origin : ''}/testimonies/${shareTestimony.id}` : ''}
        title={shareTestimony?.title || ''}
        description={shareTestimony?.description || ''}
      />
    </>
  )
}
