'use client'

import { Link } from '@/i18n/routing'
import { Lightbulb, Users, Sparkles, Heart, MessageCircle, Trophy, ArrowRight } from 'lucide-react'
import { AnimateOnScroll, StaggerChildren } from '@/components/animations'
import { MOCK_TESTIMONIES } from '@/lib/mock-data'
import type { StoryCategory } from '@/types'

const CATEGORY_CONFIG: Record<
  StoryCategory,
  {
    icon: React.ElementType
    label: string
    description: string
    gradient: string
  }
> = {
  life_wisdom: {
    icon: Lightbulb,
    label: 'Life Wisdom',
    description: 'Lessons learned through experience',
    gradient: 'from-amber-400 to-orange-500',
  },
  family_history: {
    icon: Users,
    label: 'Family History',
    description: 'Stories that connect generations',
    gradient: 'from-blue-400 to-cyan-500',
  },
  transformation: {
    icon: Sparkles,
    label: 'Transformation',
    description: 'Journeys of profound change',
    gradient: 'from-purple-400 to-pink-500',
  },
  faith_journey: {
    icon: Heart,
    label: 'Faith Journey',
    description: 'Spiritual growth and discovery',
    gradient: 'from-rose-400 to-red-500',
  },
  final_messages: {
    icon: MessageCircle,
    label: 'Final Messages',
    description: 'Words meant to last forever',
    gradient: 'from-teal-400 to-emerald-500',
  },
  milestones: {
    icon: Trophy,
    label: 'Milestones',
    description: 'Celebrating life achievements',
    gradient: 'from-green-400 to-lime-500',
  },
}

// Get counts for each category
function getCategoryCounts(): Record<StoryCategory, number> {
  const counts: Record<string, number> = {}
  for (const category of Object.keys(CATEGORY_CONFIG)) {
    counts[category] = MOCK_TESTIMONIES.filter(
      (t) => t.category === category && t.status === 'approved'
    ).length
  }
  return counts as Record<StoryCategory, number>
}

export function CategoryBrowseClient() {
  const counts = getCategoryCounts()
  const categories = Object.entries(CATEGORY_CONFIG) as [
    StoryCategory,
    (typeof CATEGORY_CONFIG)[StoryCategory],
  ][]

  return (
    <StaggerChildren
      animation="fade-in-up"
      staggerDelay={100}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {categories.map(([key, config]) => {
        const Icon = config.icon
        const count = counts[key]

        return (
          <Link
            key={key}
            href={`/testimonies?category=${key}`}
            className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Gradient background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
            />

            <div className="relative flex items-start gap-4">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${config.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-warm-900 transition-colors group-hover:text-primary-600">
                  {config.label}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-warm-500">{config.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-medium text-warm-400">
                    {count} {count === 1 ? 'story' : 'stories'}
                  </span>
                  <ArrowRight className="h-3 w-3 text-warm-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary-500" />
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </StaggerChildren>
  )
}
