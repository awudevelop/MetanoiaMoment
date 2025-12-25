'use client'

import { useRouter } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { Card, CardContent, useToast } from '@metanoia/ui'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Shield, User, Video, ArrowRight } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const toast = useToast()
  const { signInAsUser, signInAsCreator, signInAsAdmin } = useAuthStore()

  const handleSignIn = (role: 'user' | 'creator' | 'admin') => {
    if (role === 'user') {
      signInAsUser()
      toast.success('Welcome!', 'Signed in as Demo User')
      router.push('/account')
    } else if (role === 'creator') {
      signInAsCreator()
      toast.success('Welcome Creator!', 'Signed in as Demo Creator')
      router.push('/creator')
    } else {
      signInAsAdmin()
      toast.success('Admin Access', 'Signed in as Demo Admin')
      router.push('/admin')
    }
  }

  return (
    <div className="section flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600">
              <span className="text-2xl font-bold text-white">M</span>
            </div>
          </Link>
          <h1 className="mt-6 font-display text-3xl font-bold text-warm-900">
            Welcome to Metanoia Moment
          </h1>
          <p className="mt-2 text-warm-600">Choose a portal to explore the platform</p>
        </div>

        {/* Portal Selection Cards */}
        <div className="space-y-4">
          {/* User Portal */}
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <button onClick={() => handleSignIn('user')} className="w-full text-left">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-warm-900">User Portal</h2>
                  <p className="text-sm text-warm-500">user@demo.com</p>
                  <p className="mt-1 text-xs text-warm-400">
                    Browse testimonies, save favorites, manage profile
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-warm-400" />
              </CardContent>
            </button>
          </Card>

          {/* Creator Portal */}
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <button onClick={() => handleSignIn('creator')} className="w-full text-left">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Video className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-warm-900">Creator Portal</h2>
                  <p className="text-sm text-warm-500">creator@demo.com</p>
                  <p className="mt-1 text-xs text-warm-400">
                    Record testimonies, view analytics, manage content
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-warm-400" />
              </CardContent>
            </button>
          </Card>

          {/* Admin Portal */}
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <button onClick={() => handleSignIn('admin')} className="w-full text-left">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Shield className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-warm-900">Admin Portal</h2>
                  <p className="text-sm text-warm-500">admin@demo.com</p>
                  <p className="mt-1 text-xs text-warm-400">
                    Moderate content, manage users, platform settings
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-warm-400" />
              </CardContent>
            </button>
          </Card>
        </div>

        {/* Demo Mode Notice */}
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-sm text-amber-800">
            <strong>Demo Mode:</strong> Click any portal above to sign in instantly. No password
            required.
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-warm-500 hover:text-warm-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
