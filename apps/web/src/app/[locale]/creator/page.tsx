'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@metanoia/ui'
import {
  Video,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
  LogOut,
  User,
} from 'lucide-react'
import { Link, useRouter } from '@/i18n/routing'
import { useAuthStore, useIsCreator } from '@/lib/stores/auth-store'
import { AnimateOnScroll, StaggerChildren } from '@/components/animations'
import { MOCK_TESTIMONIES } from '@/lib/mock-data'

export default function CreatorPortalPage() {
  const t = useTranslations('creator')
  const router = useRouter()
  const { user, isAuthenticated, signOut } = useAuthStore()
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

  const pendingCount = myTestimonies.filter((t) => t.status === 'pending').length
  const approvedCount = myTestimonies.filter((t) => t.status === 'approved').length
  const totalViews = myTestimonies.reduce((sum, t) => sum + t.viewCount, 0)

  const stats = [
    {
      icon: Video,
      label: 'Total Testimonies',
      value: myTestimonies.length,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Clock,
      label: 'Pending Review',
      value: pendingCount,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: CheckCircle,
      label: 'Approved',
      value: approvedCount,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: totalViews.toLocaleString(),
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  const quickActions = [
    {
      icon: Plus,
      label: 'Record New Testimony',
      href: '/record',
      color: 'bg-primary-500 hover:bg-primary-600 text-white',
      primary: true,
    },
    {
      icon: Video,
      label: 'My Testimonies',
      href: '/creator/testimonies',
      color: 'bg-white hover:bg-warm-50 border border-warm-200',
    },
    {
      icon: TrendingUp,
      label: 'View Analytics',
      href: '/creator/analytics',
      color: 'bg-white hover:bg-warm-50 border border-warm-200',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/account',
      color: 'bg-white hover:bg-warm-50 border border-warm-200',
    },
  ]

  return (
    <div className="section">
      <div className="container max-w-6xl">
        {/* Header */}
        <AnimateOnScroll animation="fade-in-down">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
                Creator Dashboard
              </h1>
              <p className="mt-1 text-warm-600">
                Welcome back, {user.fullName || 'Creator'}! Manage your testimonies here.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/account">
                <Button variant="ghost" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  signOut()
                  router.push('/')
                }}
                className="text-warm-500 hover:text-warm-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
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
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warm-900">{stat.value}</p>
                  <p className="text-sm text-warm-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </StaggerChildren>

        {/* Quick Actions */}
        <AnimateOnScroll animation="fade-in-up" delay={200}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href}>
                    <button
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${action.color}`}
                    >
                      <action.icon className="h-5 w-5" />
                      <span className="font-medium">{action.label}</span>
                    </button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimateOnScroll>

        {/* Recent Testimonies */}
        <AnimateOnScroll animation="fade-in-up" delay={300}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Testimonies</CardTitle>
              <Link href="/creator/testimonies">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {myTestimonies.length === 0 ? (
                <div className="py-12 text-center">
                  <Video className="mx-auto mb-4 h-12 w-12 text-warm-300" />
                  <h3 className="mb-2 text-lg font-medium text-warm-700">No testimonies yet</h3>
                  <p className="mb-4 text-warm-500">
                    Share your faith journey with the world by recording your first testimony.
                  </p>
                  <Link href="/record">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Record Your First Testimony
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-warm-100">
                  {myTestimonies.slice(0, 5).map((testimony) => (
                    <div
                      key={testimony.id}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-24 flex-shrink-0 rounded-lg bg-warm-100">
                          {testimony.thumbnailUrl ? (
                            <img
                              src={testimony.thumbnailUrl}
                              alt={testimony.title}
                              className="h-full w-full rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-warm-100">
                              <Video className="h-6 w-6 text-warm-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-warm-900">{testimony.title}</h4>
                          <div className="mt-1 flex items-center gap-3 text-sm text-warm-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {testimony.viewCount} views
                            </span>
                            <span>{new Date(testimony.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={testimony.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </AnimateOnScroll>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' | 'flagged' }) {
  const config = {
    pending: {
      icon: Clock,
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-700',
    },
    approved: {
      icon: CheckCircle,
      label: 'Approved',
      className: 'bg-green-100 text-green-700',
    },
    rejected: {
      icon: XCircle,
      label: 'Rejected',
      className: 'bg-red-100 text-red-700',
    },
    flagged: {
      icon: AlertTriangle,
      label: 'Flagged',
      className: 'bg-orange-100 text-orange-700',
    },
  }

  const { icon: Icon, label, className } = config[status]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}
