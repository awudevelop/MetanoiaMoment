'use client'

import { useState } from 'react'
import { TestimonyCard } from '@metanoia/ui'
import { Link } from '@/i18n/routing'
import { AnimateOnScroll, AnimatedCard } from '@/components/animations'
import { ShareModal } from '@/components/sharing'
import { MOCK_TESTIMONIES } from '@/lib/mock-data'
import { STORY_CATEGORIES } from '@/types'
import type { Testimony } from '@/types'

// Get featured testimonies (approved, sorted by views, take top 3)
const testimonies = MOCK_TESTIMONIES.filter((t) => t.status === 'approved')
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, 3)

export function FeaturedTestimoniesClient() {
  const [shareTestimony, setShareTestimony] = useState<Testimony | null>(null)

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonies.map((testimony, index) => (
          <AnimateOnScroll key={testimony.id} animation="fade-in-up" delay={index * 100}>
            <Link href={`/testimonies/${testimony.id}`}>
              <AnimatedCard hoverEffect="lift">
                <TestimonyCard
                  id={testimony.id}
                  title={testimony.title}
                  description={testimony.description || undefined}
                  thumbnailUrl={testimony.thumbnailUrl || undefined}
                  duration={testimony.duration || undefined}
                  viewCount={testimony.viewCount}
                  authorName={testimony.author?.fullName || undefined}
                  authorAvatar={testimony.author?.avatarUrl || undefined}
                  category={testimony.category}
                  categoryLabel={
                    testimony.category ? STORY_CATEGORIES[testimony.category]?.label : undefined
                  }
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
        url={
          shareTestimony
            ? `${typeof window !== 'undefined' ? window.location.origin : ''}/testimonies/${shareTestimony.id}`
            : ''
        }
        title={shareTestimony?.title || ''}
        description={shareTestimony?.description || ''}
      />
    </>
  )
}
