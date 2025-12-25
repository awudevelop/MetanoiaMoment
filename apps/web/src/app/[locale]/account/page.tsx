'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Card, CardContent, CardHeader, CardTitle, useToast } from '@metanoia/ui'
import { User, Mail, Camera, Save, LogOut, Video, Eye, Calendar } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useAuthStore } from '@/lib/stores/auth-store'
import { AnimateOnScroll } from '@/components/animations'

export default function AccountPage() {
  const t = useTranslations('account')
  const router = useRouter()
  const toast = useToast()
  const { user, isAuthenticated, signOut, updateProfile, isLoading } = useAuthStore()

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }
    if (user) {
      setFullName(user.fullName || '')
      setBio(user.bio || '')
    }
  }, [isAuthenticated, user, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateProfile({
        fullName: fullName.trim(),
        bio: bio.trim(),
      })
      toast.success(t('saved'), t('savedDescription'))
    } catch {
      toast.error(t('error'), t('errorDescription'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    toast.info(t('signedOut'), t('signedOutDescription'))
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Mock stats - will be real when backend is connected
  const stats = [
    { icon: Video, label: t('stats.testimonies'), value: 3 },
    { icon: Eye, label: t('stats.totalViews'), value: 1245 },
    { icon: Calendar, label: t('stats.memberSince'), value: 'Dec 2024' },
  ]

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <AnimateOnScroll animation="fade-in-down">
          <h1 className="mb-2 font-display text-3xl font-bold text-warm-900 md:text-4xl">
            {t('title')}
          </h1>
          <p className="mb-8 text-warm-600">{t('subtitle')}</p>
        </AnimateOnScroll>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Card */}
          <AnimateOnScroll animation="fade-in-left" className="md:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                {/* Avatar */}
                <div className="relative mx-auto mb-4 h-24 w-24">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName || ''}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12" />
                    )}
                  </div>
                  <button
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white shadow-md transition-transform hover:scale-110"
                    title={t('changePhoto')}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <h2 className="text-xl font-semibold text-warm-900">
                  {user.fullName || t('anonymous')}
                </h2>
                <p className="text-sm text-warm-500">{user.email}</p>

                {user.isAdmin && (
                  <span className="mt-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                    {t('admin')}
                  </span>
                )}

                {/* Stats */}
                <div className="mt-6 space-y-3 border-t border-warm-100 pt-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-warm-600">
                        <stat.icon className="h-4 w-4" />
                        {stat.label}
                      </span>
                      <span className="font-medium text-warm-900">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 space-y-2">
                  <Link href="/account/testimonies" className="block">
                    <Button variant="outline" className="w-full">
                      <Video className="mr-2 h-4 w-4" />
                      {t('myTestimonies')}
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('signOut')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimateOnScroll>

          {/* Settings Form */}
          <AnimateOnScroll animation="fade-in-right" className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <Input
                    label={t('email')}
                    type="email"
                    value={user.email}
                    disabled
                    icon={<Mail className="h-5 w-5" />}
                  />

                  <Input
                    label={t('fullName')}
                    placeholder={t('fullNamePlaceholder')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    icon={<User className="h-5 w-5" />}
                  />

                  <Textarea
                    label={t('bio')}
                    placeholder={t('bioPlaceholder')}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" loading={isSaving}>
                      <Save className="mr-2 h-4 w-4" />
                      {t('saveChanges')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="mt-6 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">{t('dangerZone')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-warm-600">{t('dangerZoneDescription')}</p>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  {t('deleteAccount')}
                </Button>
              </CardContent>
            </Card>
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  )
}
