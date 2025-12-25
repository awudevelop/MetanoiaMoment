'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/routing'
import { Card, CardContent, Button } from '@metanoia/ui'
import {
  Video,
  Users,
  Clock,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Globe,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { getStats, getPendingTestimonies, MOCK_TESTIMONIES } from '@/lib/mock-data'
import { LoadingSpinner } from '@/components/global-loading'
import type { Testimony } from '@/types'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null)
  const [pending, setPending] = useState<Testimony[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setStats(getStats())
      setPending(getPendingTestimonies())
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-warm-900">Dashboard</h1>
        <p className="text-warm-600">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Testimonies"
          value={stats?.totalTestimonies || 0}
          icon={Video}
          color="primary"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          label="Pending Review"
          value={stats?.pendingTestimonies || 0}
          icon={Clock}
          color="warning"
          action={pending.length > 0 ? '/admin/testimonies?status=pending' : undefined}
        />
        <StatCard
          label="Total Views"
          value={formatNumber(stats?.totalViews || 0)}
          icon={Eye}
          color="accent"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          label="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="secondary"
          trend={{ value: 5, positive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Testimonies */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-warm-900">Pending Review</h2>
              {pending.length > 0 && (
                <Link href="/admin/testimonies?status=pending">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

            {pending.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle className="mb-2 h-10 w-10 text-accent-500" />
                <p className="text-warm-600">All caught up! No pending testimonies.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.slice(0, 3).map((testimony) => (
                  <Link
                    key={testimony.id}
                    href={`/admin/testimonies?review=${testimony.id}`}
                    className="flex items-center gap-3 rounded-lg border border-warm-200 p-3 transition-colors hover:bg-warm-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warm-100">
                      <Video className="h-5 w-5 text-warm-500" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium text-warm-900">{testimony.title}</p>
                      <p className="text-sm text-warm-500">
                        {testimony.author?.fullName} · {new Date(testimony.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold text-warm-900">Platform Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-warm-50 p-3">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary-600" />
                  <span className="text-warm-700">Countries Reached</span>
                </div>
                <span className="font-semibold text-warm-900">{stats?.countriesReached}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-warm-50 p-3">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-accent-600" />
                  <span className="text-warm-700">Avg. Video Duration</span>
                </div>
                <span className="font-semibold text-warm-900">
                  {formatDuration(getAverageDuration())}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-warm-50 p-3">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-secondary-600" />
                  <span className="text-warm-700">Avg. Views per Video</span>
                </div>
                <span className="font-semibold text-warm-900">
                  {Math.round((stats?.totalViews || 0) / (stats?.totalTestimonies || 1))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-semibold text-warm-900">Recent Activity</h2>
          <div className="space-y-3">
            {getRecentActivity().map((activity, index) => (
              <div key={index} className="flex items-start gap-3 border-b border-warm-100 pb-3 last:border-0 last:pb-0">
                <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${activity.iconBg}`}>
                  <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-warm-900">{activity.message}</p>
                  <p className="text-xs text-warm-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
  action,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color: 'primary' | 'secondary' | 'accent' | 'warning'
  trend?: { value: number; positive: boolean }
  action?: string
}) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    accent: 'bg-accent-100 text-accent-600',
    warning: 'bg-amber-100 text-amber-600',
  }

  const content = (
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend.positive ? 'text-accent-600' : 'text-red-600'}`}>
            {trend.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-warm-900">{value}</p>
        <p className="text-sm text-warm-600">{label}</p>
      </div>
    </CardContent>
  )

  if (action) {
    return (
      <Link href={action}>
        <Card className="transition-shadow hover:shadow-md">{content}</Card>
      </Link>
    )
  }

  return <Card>{content}</Card>
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getAverageDuration(): number {
  const approved = MOCK_TESTIMONIES.filter((t) => t.status === 'approved')
  const total = approved.reduce((sum, t) => sum + (t.duration || 0), 0)
  return Math.round(total / approved.length)
}

function getRecentActivity() {
  return [
    {
      icon: Video,
      iconBg: 'bg-accent-100',
      iconColor: 'text-accent-600',
      message: 'New testimony submitted by Sarah Mitchell',
      time: '2 hours ago',
    },
    {
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      message: 'Testimony "A Prodigal Returns" was approved',
      time: '5 hours ago',
    },
    {
      icon: Users,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      message: 'New user registered: john.d@example.com',
      time: '1 day ago',
    },
    {
      icon: Eye,
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      message: '"Marriage Restored" reached 2,000 views',
      time: '2 days ago',
    },
  ]
}
