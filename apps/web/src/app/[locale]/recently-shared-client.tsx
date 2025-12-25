'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { Clock, MapPin, Play, Heart } from 'lucide-react'
import { AnimateOnScroll } from '@/components/animations'

// Mock data for recent activity - would come from real-time database
const recentActivity = [
  {
    id: 'r1',
    authorName: 'Maria G.',
    location: 'Brazil',
    timeAgo: '2 minutes ago',
    title: 'Finding Peace After Loss',
    action: 'shared',
  },
  {
    id: 'r2',
    authorName: 'John D.',
    location: 'United States',
    timeAgo: '5 minutes ago',
    title: 'From Addiction to Freedom',
    action: 'watched',
  },
  {
    id: 'r3',
    authorName: 'Sophie L.',
    location: 'France',
    timeAgo: '8 minutes ago',
    title: 'A Journey of Faith',
    action: 'shared',
  },
  {
    id: 'r4',
    authorName: 'Ahmed K.',
    location: 'Egypt',
    timeAgo: '12 minutes ago',
    title: 'Healing Through Prayer',
    action: 'watched',
  },
  {
    id: 'r5',
    authorName: 'Lisa M.',
    location: 'Canada',
    timeAgo: '15 minutes ago',
    title: 'My Story of Redemption',
    action: 'shared',
  },
]

export function RecentlySharedClient() {
  const [activities, setActivities] = useState(recentActivity)
  const [isHovered, setIsHovered] = useState(false)

  // Simulate real-time updates by rotating activities
  useEffect(() => {
    if (isHovered) return // Pause animation on hover

    const interval = setInterval(() => {
      setActivities((prev) => {
        const first = prev[0]
        const rest = prev.slice(1)
        return [...rest, first]
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient masks for infinite scroll effect */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-warm-50 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-warm-50 to-transparent" />

      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-4">
        {activities.map((activity, index) => (
          <ActivityCard key={`${activity.id}-${index}`} activity={activity} index={index} />
        ))}
      </div>

      {/* Live indicator */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-accent-500" />
        </span>
        <span className="text-sm font-medium text-warm-600">
          Testimonies being shared around the world right now
        </span>
      </div>
    </div>
  )
}

function ActivityCard({
  activity,
  index,
}: {
  activity: (typeof recentActivity)[0]
  index: number
}) {
  const isShared = activity.action === 'shared'

  return (
    <div
      className="group min-w-[280px] flex-shrink-0 rounded-xl border border-warm-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary-200 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-semibold text-white">
          {activity.authorName.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Author and action */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-warm-900 truncate">{activity.authorName}</span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              isShared
                ? 'bg-accent-100 text-accent-700'
                : 'bg-primary-100 text-primary-700'
            }`}>
              {isShared ? (
                <>
                  <Heart className="h-3 w-3" />
                  shared
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  watched
                </>
              )}
            </span>
          </div>

          {/* Testimony title */}
          <p className="mt-1 text-sm text-warm-700 line-clamp-1 group-hover:text-primary-600 transition-colors">
            "{activity.title}"
          </p>

          {/* Meta info */}
          <div className="mt-2 flex items-center gap-3 text-xs text-warm-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {activity.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
