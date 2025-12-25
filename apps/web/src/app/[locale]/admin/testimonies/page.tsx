'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter, usePathname } from '@/i18n/routing'
import { Card, CardContent, Button, Input, useToast } from '@metanoia/ui'
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Video,
  Play,
  MoreVertical,
  Trash2,
  Star,
  Globe,
  Calendar,
} from 'lucide-react'
import { MOCK_TESTIMONIES } from '@/lib/mock-data'
import { useTestimonyStore } from '@/lib/stores/testimony-store'
import { LoadingSpinner } from '@/components/global-loading'
import type { Testimony } from '@/types'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

export default function AdminTestimoniesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const toast = useToast()

  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    (searchParams.get('status') as StatusFilter) || 'all'
  )
  const [selectedTestimony, setSelectedTestimony] = useState<Testimony | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  const { approveTestimony, rejectTestimony, deleteTestimony } = useTestimonyStore()

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setTestimonies([...MOCK_TESTIMONIES])
      setIsLoading(false)

      // Check for review param
      const reviewId = searchParams.get('review')
      if (reviewId) {
        const testimony = MOCK_TESTIMONIES.find((t) => t.id === reviewId)
        if (testimony) {
          setSelectedTestimony(testimony)
        }
      }
    }
    loadData()
  }, [searchParams])

  const filteredTestimonies = useMemo(() => {
    let result = [...testimonies]

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.author?.fullName?.toLowerCase().includes(searchLower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [testimonies, statusFilter, search])

  const updateFilter = (status: StatusFilter) => {
    setStatusFilter(status)
    const params = new URLSearchParams(searchParams.toString())
    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleApprove = async (id: string) => {
    setProcessing(id)
    const result = await approveTestimony(id)
    if (result.success) {
      setTestimonies((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: 'approved' as const, publishedAt: new Date().toISOString() } : t))
      )
      toast.success('Testimony approved', 'The testimony is now live.')
      if (selectedTestimony?.id === id) {
        setSelectedTestimony(null)
      }
    } else {
      toast.error('Failed to approve', result.error.message)
    }
    setProcessing(null)
  }

  const handleReject = async (id: string) => {
    setProcessing(id)
    const result = await rejectTestimony(id)
    if (result.success) {
      setTestimonies((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: 'rejected' as const } : t))
      )
      toast.success('Testimony rejected', 'The testimony has been rejected.')
      if (selectedTestimony?.id === id) {
        setSelectedTestimony(null)
      }
    } else {
      toast.error('Failed to reject', result.error.message)
    }
    setProcessing(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimony? This action cannot be undone.')) {
      return
    }

    setProcessing(id)
    const result = await deleteTestimony(id)
    if (result.success) {
      setTestimonies((prev) => prev.filter((t) => t.id !== id))
      toast.success('Testimony deleted', 'The testimony has been permanently removed.')
      if (selectedTestimony?.id === id) {
        setSelectedTestimony(null)
      }
    } else {
      toast.error('Failed to delete', result.error.message)
    }
    setProcessing(null)
  }

  const handleToggleFeatured = (id: string) => {
    setTestimonies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t))
    )
    const testimony = testimonies.find((t) => t.id === id)
    toast.success(
      testimony?.featured ? 'Removed from featured' : 'Added to featured',
      testimony?.featured
        ? 'This testimony will no longer appear in featured sections.'
        : 'This testimony will now appear in featured sections.'
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const statusCounts = {
    all: testimonies.length,
    pending: testimonies.filter((t) => t.status === 'pending').length,
    approved: testimonies.filter((t) => t.status === 'approved').length,
    rejected: testimonies.filter((t) => t.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warm-900">Testimonies</h1>
        <p className="text-warm-600">Manage and review all testimonies</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => updateFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-warm-100 text-warm-700 hover:bg-warm-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1.5 text-xs opacity-75">({statusCounts[status]})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
          <input
            type="search"
            placeholder="Search testimonies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-warm-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Testimonies List */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {filteredTestimonies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Video className="mb-3 h-12 w-12 text-warm-300" />
                  <p className="text-warm-600">No testimonies found</p>
                </div>
              ) : (
                <div className="divide-y divide-warm-100">
                  {filteredTestimonies.map((testimony) => (
                    <TestimonyRow
                      key={testimony.id}
                      testimony={testimony}
                      isSelected={selectedTestimony?.id === testimony.id}
                      isProcessing={processing === testimony.id}
                      onSelect={() => setSelectedTestimony(testimony)}
                      onApprove={() => handleApprove(testimony.id)}
                      onReject={() => handleReject(testimony.id)}
                      onDelete={() => handleDelete(testimony.id)}
                      onToggleFeatured={() => handleToggleFeatured(testimony.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {selectedTestimony ? (
            <TestimonyPreview
              testimony={selectedTestimony}
              isProcessing={processing === selectedTestimony.id}
              onApprove={() => handleApprove(selectedTestimony.id)}
              onReject={() => handleReject(selectedTestimony.id)}
              onDelete={() => handleDelete(selectedTestimony.id)}
              onClose={() => setSelectedTestimony(null)}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="mb-3 h-12 w-12 text-warm-300" />
                <p className="text-warm-600">Select a testimony to preview</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function TestimonyRow({
  testimony,
  isSelected,
  isProcessing,
  onSelect,
  onApprove,
  onReject,
  onDelete,
  onToggleFeatured,
}: {
  testimony: Testimony
  isSelected: boolean
  isProcessing: boolean
  onSelect: () => void
  onApprove: () => void
  onReject: () => void
  onDelete: () => void
  onToggleFeatured: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <div
      className={`flex items-center gap-4 p-4 transition-colors ${
        isSelected ? 'bg-primary-50' : 'hover:bg-warm-50'
      }`}
    >
      <button
        onClick={onSelect}
        className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-warm-100"
      >
        <Play className="h-5 w-5 text-warm-500" />
      </button>

      <div className="min-w-0 flex-1" onClick={onSelect} role="button" tabIndex={0}>
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-warm-900">{testimony.title}</h3>
          {testimony.featured && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
        </div>
        <div className="mt-1 flex items-center gap-3 text-sm text-warm-500">
          <span>{testimony.author?.fullName || 'Anonymous'}</span>
          <span>·</span>
          <span>{new Date(testimony.createdAt).toLocaleDateString()}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {testimony.viewCount}
          </span>
        </div>
      </div>

      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[testimony.status]}`}>
        {testimony.status}
      </span>

      {testimony.status === 'pending' && (
        <div className="flex gap-1">
          <Button
            size="sm"
            onClick={onApprove}
            disabled={isProcessing}
            className="h-8 w-8 p-0"
            title="Approve"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onReject}
            disabled={isProcessing}
            className="h-8 w-8 border-red-300 p-0 text-red-600 hover:bg-red-50"
            title="Reject"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-lg p-1.5 hover:bg-warm-100"
        >
          <MoreVertical className="h-4 w-4 text-warm-500" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-warm-200 bg-white py-1 shadow-lg">
              <button
                onClick={() => {
                  onToggleFeatured()
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
              >
                <Star className={`h-4 w-4 ${testimony.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                {testimony.featured ? 'Remove from Featured' : 'Add to Featured'}
              </button>
              <button
                onClick={() => {
                  onDelete()
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Testimony
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function TestimonyPreview({
  testimony,
  isProcessing,
  onApprove,
  onReject,
  onDelete,
  onClose,
}: {
  testimony: Testimony
  isProcessing: boolean
  onApprove: () => void
  onReject: () => void
  onDelete: () => void
  onClose: () => void
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-warm-900">Preview</h3>
          <button onClick={onClose} className="text-warm-500 hover:text-warm-700">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-warm-900">
          <div className="flex h-full items-center justify-center">
            <Play className="h-12 w-12 text-warm-400" />
          </div>
        </div>

        <h4 className="font-medium text-warm-900">{testimony.title}</h4>

        {testimony.description && (
          <p className="mt-2 text-sm text-warm-600 line-clamp-3">{testimony.description}</p>
        )}

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-warm-600">
            <Clock className="h-4 w-4" />
            <span>
              {testimony.duration
                ? `${Math.floor(testimony.duration / 60)}:${(testimony.duration % 60).toString().padStart(2, '0')}`
                : 'Unknown duration'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-warm-600">
            <Globe className="h-4 w-4" />
            <span>{testimony.language.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2 text-warm-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(testimony.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {testimony.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {testimony.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-warm-100 px-2 py-0.5 text-xs text-warm-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {testimony.status === 'pending' && (
          <div className="mt-6 flex gap-2">
            <Button onClick={onApprove} loading={isProcessing} className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={onReject}
              loading={isProcessing}
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={onDelete}
          disabled={isProcessing}
          className="mt-2 w-full text-red-600 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Permanently
        </Button>
      </CardContent>
    </Card>
  )
}
