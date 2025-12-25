'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@metanoia/ui'
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Video,
  Users,
  Globe,
  Clock,
  Calendar,
} from 'lucide-react'
import { MOCK_TESTIMONIES, MOCK_USERS, getStats } from '@/lib/mock-data'
import { LoadingSpinner } from '@/components/global-loading'

// Mock analytics data
const MOCK_DAILY_VIEWS = [
  { date: '2024-12-18', views: 145 },
  { date: '2024-12-19', views: 189 },
  { date: '2024-12-20', views: 234 },
  { date: '2024-12-21', views: 278 },
  { date: '2024-12-22', views: 312 },
  { date: '2024-12-23', views: 256 },
  { date: '2024-12-24', views: 198 },
]

const MOCK_TOP_COUNTRIES = [
  { country: 'United States', views: 4521, percentage: 35 },
  { country: 'Brazil', views: 2340, percentage: 18 },
  { country: 'United Kingdom', views: 1890, percentage: 15 },
  { country: 'Nigeria', views: 1456, percentage: 11 },
  { country: 'Philippines', views: 1234, percentage: 10 },
  { country: 'Other', views: 1412, percentage: 11 },
]

const MOCK_LANGUAGE_DISTRIBUTION = [
  { language: 'English', count: 4, percentage: 67 },
  { language: 'Spanish', count: 1, percentage: 16.5 },
  { language: 'Portuguese', count: 0, percentage: 0 },
  { language: 'French', count: 0, percentage: 0 },
  { language: 'Other', count: 1, percentage: 16.5 },
]

export default function AdminAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setStats(getStats())
      setIsLoading(false)
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const maxViews = Math.max(...MOCK_DAILY_VIEWS.map((d) => d.views))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Analytics</h1>
          <p className="text-warm-600">Track your platform performance</p>
        </div>

        <div className="flex rounded-lg border border-warm-200 bg-white p-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-500 text-white'
                  : 'text-warm-600 hover:text-warm-900'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Views"
          value={stats?.totalViews || 0}
          change={12.5}
          icon={Eye}
          color="primary"
        />
        <MetricCard
          label="Total Testimonies"
          value={stats?.totalTestimonies || 0}
          change={8.3}
          icon={Video}
          color="accent"
        />
        <MetricCard
          label="Active Users"
          value={stats?.totalUsers || 0}
          change={15.2}
          icon={Users}
          color="secondary"
        />
        <MetricCard
          label="Countries Reached"
          value={stats?.countriesReached || 0}
          change={4.1}
          icon={Globe}
          color="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Views Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-semibold text-warm-900">Views Over Time</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 text-accent-600">
                  <TrendingUp className="h-4 w-4" />
                  +23%
                </span>
                <span className="text-warm-500">vs last week</span>
              </div>
            </div>

            {/* Simple bar chart */}
            <div className="flex h-48 items-end gap-2">
              {MOCK_DAILY_VIEWS.map((day, index) => {
                const height = (day.views / maxViews) * 100
                return (
                  <div key={day.date} className="group flex flex-1 flex-col items-center">
                    <div className="relative w-full">
                      <div
                        className="w-full rounded-t-md bg-primary-500 transition-all group-hover:bg-primary-600"
                        style={{ height: `${height * 1.8}px` }}
                      />
                      <div className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-warm-900 px-2 py-1 text-xs text-white group-hover:block">
                        {day.views}
                      </div>
                    </div>
                    <span className="mt-2 text-xs text-warm-500">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-6 font-semibold text-warm-900">Top Countries</h2>
            <div className="space-y-4">
              {MOCK_TOP_COUNTRIES.map((country) => (
                <div key={country.country}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-warm-700">{country.country}</span>
                    <span className="text-warm-500">{country.views.toLocaleString()} views</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-warm-100">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Language Distribution */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-6 font-semibold text-warm-900">By Language</h2>
            <div className="space-y-3">
              {MOCK_LANGUAGE_DISTRIBUTION.map((lang) => (
                <div key={lang.language} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-primary-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-700">{lang.language}</span>
                      <span className="text-sm text-warm-500">{lang.count} videos</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-warm-100">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Testimonies */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="mb-6 font-semibold text-warm-900">Top Performing Testimonies</h2>
            <div className="space-y-4">
              {MOCK_TESTIMONIES.filter((t) => t.status === 'approved')
                .sort((a, b) => b.viewCount - a.viewCount)
                .slice(0, 5)
                .map((testimony, index) => (
                  <div
                    key={testimony.id}
                    className="flex items-center gap-4 rounded-lg border border-warm-100 p-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warm-100 text-sm font-semibold text-warm-600">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-warm-900">{testimony.title}</p>
                      <p className="text-sm text-warm-500">{testimony.author?.fullName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-warm-900">{testimony.viewCount.toLocaleString()}</p>
                      <p className="text-xs text-warm-500">views</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-6 font-semibold text-warm-900">Engagement Metrics</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <EngagementStat
              label="Avg. Watch Time"
              value="4:32"
              subtext="per video"
              icon={Clock}
            />
            <EngagementStat
              label="Completion Rate"
              value="68%"
              subtext="of videos"
              icon={Video}
            />
            <EngagementStat
              label="Shares"
              value="1,234"
              subtext="this month"
              icon={Users}
            />
            <EngagementStat
              label="New Submissions"
              value="12"
              subtext="this week"
              icon={Calendar}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  change: number
  icon: React.ElementType
  color: 'primary' | 'secondary' | 'accent' | 'warning'
}) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    accent: 'bg-accent-100 text-accent-600',
    warning: 'bg-amber-100 text-amber-600',
  }

  const isPositive = change >= 0

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-accent-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {Math.abs(change)}%
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-warm-900">{value.toLocaleString()}</p>
          <p className="text-sm text-warm-600">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function EngagementStat({
  label,
  value,
  subtext,
  icon: Icon,
}: {
  label: string
  value: string
  subtext: string
  icon: React.ElementType
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-warm-50 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
        <Icon className="h-6 w-6 text-primary-600" />
      </div>
      <div>
        <p className="text-2xl font-bold text-warm-900">{value}</p>
        <p className="text-sm text-warm-600">{label}</p>
        <p className="text-xs text-warm-500">{subtext}</p>
      </div>
    </div>
  )
}
