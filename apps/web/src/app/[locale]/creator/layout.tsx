'use client'

import { AuthGuard } from '@/components/auth'

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard minRole="creator">{children}</AuthGuard>
}
