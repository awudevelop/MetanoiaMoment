'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@metanoia/ui'
import {
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Share2,
  Heart,
  ArrowLeft,
  BarChart3,
  Calendar,
} from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useAuthStore, useIsCreator } from '@/lib/stores/auth-store'
import { AnimateOnScroll, StaggerChildren } from '@/components/animations'
import { MOCK_TESTIMONIES } from '@/lib/mock-data'

export default function CreatorAnalyticsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const isCreator = useIsCreator()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }
    if (!isCreator) {
      router.push('/account')
      return
    }
  }, [isAuthenticated, isCreator, router])

  if (!isAuthenticated || !user || !isCreator) {
    return null
  }

  // Get creator's testimonies from mock data
  const myTestimonies = MOCK_TESTIMONIES.filter(
    (t) => t.userId === user.id || t.author?.fullName === user.fullName
  )

  // Calculate analytics
  const totalViews = myTestimonies.reduce((sum, t) => sum + t.viewCount, 0)
  const totalLikes = myTestimonies.reduce((sum, t) => sum + t.likeCount, 0)
  const totalShares = myTestimonies.reduce((sum, t) => sum + (t.shareCount || 0), 0)
  const approvedCount = myTestimonies.filter((t) => t.status === 'approved').length

  // Mock trend data (in a real app, this would come from the API)
  const viewsTrend = 12.5
  const likesTrend = 8.3
  const sharesTrend = -2.1

  const stats = [
    {
      icon: Eye,
      label: 'Total Views',
      value: totalViews.toLocaleString(),
      trend: viewsTrend,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Heart,
      label: 'Total Likes',
      value: totalLikes.toLocaleString(),
      trend: likesTrend,
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Share2,
      label: 'Total Shares',
      value: totalShares.toLocaleString(),
      trend: sharesTrend,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Users,
      label: 'Avg. Engagement',
      value:
        myTestimonies.length > 0
          ? `${Math.round((totalLikes + totalShares) / myTestimonies.length)}`
          : '0',
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  // Top performing testimonies
  const topTestimonies = [...myTestimonies].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5)

  // Recent activity (mock data)
  const recentActivity = [
    { type: 'view', count: 24, time: '2 hours ago', testimony: 'My Journey to Faith' },
    { type: 'like', count: 5, time: '4 hours ago', testimony: 'Finding Hope in Darkness' },
    { type: 'share', count: 2, time: '1 day ago', testimony: 'My Journey to Faith' },
    { type: 'view', count: 156, time: '2 days ago', testimony: 'Healing Through Prayer' },
  ]

  return (
    <div className="section">
      <div className="container max-w-6xl">
        {/* Header */}
        <AnimateOnScroll animation="fade-in-down">
          <div className="mb-8">
            <Link
              href="/creator"
              className="mb-4 inline-flex items-center gap-2 text-sm text-warm-500 hover:text-warm-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
                  Analytics
                </h1>
                <p className="mt-1 text-warm-600">Track the performance of your testimonies.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-warm-500">
                <Calendar className="h-4 w-4" />
                Last 30 days
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Stats Grid */}
        <StaggerChildren
          animation="fade-in-up"
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  {stat.trend !== undefined && (
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.trend >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(stat.trend)}%
                    </div>
                  )}
                </div>
                <p className="mt-3 text-2xl font-bold text-warm-900">{stat.value}</p>
                <p className="text-sm text-warm-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </StaggerChildren>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Performing Testimonies */}
          <AnimateOnScroll animation="fade-in-up" delay={200}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-warm-400" />
                  Top Performing
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topTestimonies.length === 0 ? (
                  <p className="py-8 text-center text-warm-500">
                    No testimonies yet. Record your first one to see analytics!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {topTestimonies.map((testimony, index) => (
                      <div key={testimony.id} className="flex items-center gap-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warm-100 text-sm font-bold text-warm-600">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-warm-900">{testimony.title}</p>
                          <div className="flex items-center gap-3 text-xs text-warm-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {testimony.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {testimony.likeCount}
                            </span>
                          </div>
                        </div>
                        <Link href={`/testimonies/${testimony.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimateOnScroll>

          {/* Recent Activity */}
          <AnimateOnScroll animation="fade-in-up" delay={300}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warm-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          activity.type === 'view'
                            ? 'bg-blue-100 text-blue-600'
                            : activity.type === 'like'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {activity.type === 'view' && <Eye className="h-5 w-5" />}
                        {activity.type === 'like' && <Heart className="h-5 w-5" />}
                        {activity.type === 'share' && <Share2 className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-warm-900">
                          <span className="font-medium">{activity.count}</span>{' '}
                          {activity.type === 'view'
                            ? 'new views'
                            : activity.type === 'like'
                              ? 'new likes'
                              : 'shares'}
                        </p>
                        <p className="text-xs text-warm-500">{activity.testimony}</p>
                      </div>
                      <span className="text-xs text-warm-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimateOnScroll>
        </div>

        {/* Placeholder for Chart */}
        <AnimateOnScroll animation="fade-in-up" delay={400}>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-warm-200 bg-warm-50">
                <div className="text-center">
                  <BarChart3 className="mx-auto mb-2 h-12 w-12 text-warm-300" />
                  <p className="text-warm-500">Chart visualization coming soon</p>
                  <p className="text-sm text-warm-400">
                    Detailed analytics will be available with Supabase integration
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
