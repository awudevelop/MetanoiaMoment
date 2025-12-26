'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@metanoia/ui'
import {
  Video,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react'
import { Link, useRouter } from '@/i18n/routing'
import { useAuthStore, useIsCreator } from '@/lib/stores/auth-store'
import { AnimateOnScroll, StaggerChildren } from '@/components/animations'
import { MOCK_TESTIMONIES } from '@/lib/mock-data'
import type { Testimony } from '@/types'

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

export default function CreatorTestimoniesPage() {
  const t = useTranslations('creator')
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const isCreator = useIsCreator()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

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

  // Apply filters
  const filteredTestimonies = myTestimonies.filter((testimony) => {
    const matchesSearch =
      testimony.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimony.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || testimony.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: myTestimonies.length,
    pending: myTestimonies.filter((t) => t.status === 'pending').length,
    approved: myTestimonies.filter((t) => t.status === 'approved').length,
    rejected: myTestimonies.filter((t) => t.status === 'rejected').length,
  }

  const handleDeleteTestimony = (_id: string) => {
    // TODO: In a real app, this would call an API to delete the testimony
    setActiveMenu(null)
  }

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
                  My Testimonies
                </h1>
                <p className="mt-1 text-warm-600">
                  Manage and track all your testimony submissions.
                </p>
              </div>
              <Link href="/record">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record New
                </Button>
              </Link>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Filters */}
        <AnimateOnScroll animation="fade-in-up" delay={100}>
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
                  <Input
                    type="text"
                    placeholder="Search testimonies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter Tabs */}
                <div className="flex gap-2">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        filterStatus === status
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-warm-500 hover:bg-warm-100 hover:text-warm-700'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                      <span className="ml-1.5 text-xs opacity-70">({statusCounts[status]})</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimateOnScroll>

        {/* Testimonies List */}
        <AnimateOnScroll animation="fade-in-up" delay={200}>
          {filteredTestimonies.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Video className="mx-auto mb-4 h-12 w-12 text-warm-300" />
                {myTestimonies.length === 0 ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <h3 className="mb-2 text-lg font-medium text-warm-700">No matches found</h3>
                    <p className="text-warm-500">Try adjusting your search or filter criteria.</p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTestimonies.map((testimony) => (
                <TestimonyCard
                  key={testimony.id}
                  testimony={testimony}
                  isMenuOpen={activeMenu === testimony.id}
                  onMenuToggle={() =>
                    setActiveMenu(activeMenu === testimony.id ? null : testimony.id)
                  }
                  onDelete={() => handleDeleteTestimony(testimony.id)}
                />
              ))}
            </div>
          )}
        </AnimateOnScroll>
      </div>
    </div>
  )
}

function TestimonyCard({
  testimony,
  isMenuOpen,
  onMenuToggle,
  onDelete,
}: {
  testimony: Testimony
  isMenuOpen: boolean
  onMenuToggle: () => void
  onDelete: () => void
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="h-20 w-32 flex-shrink-0 rounded-lg bg-warm-100">
            {testimony.thumbnailUrl ? (
              <img
                src={testimony.thumbnailUrl}
                alt={testimony.title}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-warm-100">
                <Video className="h-8 w-8 text-warm-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-warm-900">{testimony.title}</h3>
                {testimony.description && (
                  <p className="mt-1 line-clamp-1 text-sm text-warm-500">{testimony.description}</p>
                )}
              </div>

              {/* Actions Menu */}
              <div className="relative">
                <button
                  onClick={onMenuToggle}
                  className="rounded-lg p-2 text-warm-400 hover:bg-warm-100 hover:text-warm-600"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={onMenuToggle} />
                    <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-warm-200 bg-white py-1 shadow-lg">
                      <Link
                        href={`/testimonies/${testimony.id}`}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-warm-700 hover:bg-warm-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Public Page
                      </Link>
                      <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-warm-700 hover:bg-warm-50">
                        <Edit className="h-4 w-4" />
                        Edit Details
                      </button>
                      <button
                        onClick={onDelete}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-warm-500">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {testimony.viewCount} views
              </span>
              <span>{new Date(testimony.createdAt).toLocaleDateString()}</span>
              <StatusBadge status={testimony.status} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' | 'flagged' }) {
  const config = {
    pending: {
      icon: Clock,
      label: 'Pending Review',
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
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}
