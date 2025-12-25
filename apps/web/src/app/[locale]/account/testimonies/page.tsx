'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, useToast } from '@metanoia/ui'
import {
  Video,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Edit,
  ChevronLeft,
} from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useTestimonyStore } from '@/lib/stores/testimony-store'
import { AnimateOnScroll, StaggerChildren } from '@/components/animations'
import { Skeleton } from '@/components/animations/skeleton'
import type { Testimony } from '@/types'

export default function MyTestimoniesPage() {
  const t = useTranslations('myTestimonies')
  const router = useRouter()
  const toast = useToast()
  const { user, isAuthenticated } = useAuthStore()
  const { testimonies, isLoading, fetchTestimonies, deleteTestimony } = useTestimonyStore()
  const [userTestimonies, setUserTestimonies] = useState<Testimony[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }
    fetchTestimonies()
  }, [isAuthenticated, router, fetchTestimonies])

  useEffect(() => {
    if (user && testimonies.length > 0) {
      // Filter testimonies by current user
      const filtered = testimonies.filter((t) => t.author?.id === user.id)
      setUserTestimonies(filtered)
    }
  }, [user, testimonies])

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return

    try {
      await deleteTestimony(id)
      toast.success(t('deleted'), t('deletedDescription'))
    } catch {
      toast.error(t('error'), t('errorDescription'))
    }
  }

  const getStatusIcon = (status: Testimony['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-accent-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusLabel = (status: Testimony['status']) => {
    switch (status) {
      case 'approved':
        return t('status.approved')
      case 'rejected':
        return t('status.rejected')
      default:
        return t('status.pending')
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="section">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/account"
            className="flex items-center gap-1 text-sm text-warm-500 transition-colors hover:text-primary-600"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('backToAccount')}
          </Link>
        </nav>

        <AnimateOnScroll animation="fade-in-down">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-warm-900 md:text-4xl">
                {t('title')}
              </h1>
              <p className="mt-2 text-warm-600">{t('subtitle')}</p>
            </div>
            <Link href="/record">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('recordNew')}
              </Button>
            </Link>
          </div>
        </AnimateOnScroll>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-20 w-32 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userTestimonies.length === 0 ? (
          <AnimateOnScroll animation="fade-in-up">
            <Card>
              <CardContent className="py-16 text-center">
                <Video className="mx-auto h-16 w-16 text-warm-300" />
                <h2 className="mt-4 text-xl font-semibold text-warm-900">{t('empty.title')}</h2>
                <p className="mt-2 text-warm-600">{t('empty.description')}</p>
                <Link href="/record" className="mt-6 inline-block">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('empty.cta')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </AnimateOnScroll>
        ) : (
          <StaggerChildren staggerDelay={100}>
            <div className="space-y-4">
              {userTestimonies.map((testimony) => (
                <AnimateOnScroll key={testimony.id} animation="fade-in-up">
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <Link href={`/testimonies/${testimony.id}`} className="flex-shrink-0">
                          <div className="relative h-20 w-32 overflow-hidden rounded bg-warm-100">
                            {testimony.thumbnailUrl ? (
                              <img
                                src={testimony.thumbnailUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Video className="h-8 w-8 text-warm-300" />
                              </div>
                            )}
                            {testimony.duration && (
                              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                                {formatDuration(testimony.duration)}
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <Link href={`/testimonies/${testimony.id}`}>
                            <h3 className="line-clamp-1 font-semibold text-warm-900 transition-colors hover:text-primary-600">
                              {testimony.title}
                            </h3>
                          </Link>

                          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-warm-500">
                            {/* Status */}
                            <span className="flex items-center gap-1">
                              {getStatusIcon(testimony.status)}
                              {getStatusLabel(testimony.status)}
                            </span>

                            {/* Views */}
                            {testimony.status === 'approved' && (
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {testimony.viewCount} {t('views')}
                              </span>
                            )}

                            {/* Date */}
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(testimony.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {testimony.description && (
                            <p className="mt-2 line-clamp-1 text-sm text-warm-600">
                              {testimony.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-shrink-0 items-center gap-2">
                          {testimony.status === 'pending' && (
                            <Button variant="ghost" size="sm" title={t('edit')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(testimony.id)}
                            title={t('delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              ))}
            </div>
          </StaggerChildren>
        )}
      </div>
    </div>
  )
}
