'use client'

import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] bg-amber-500 px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>You're offline. Some features may be unavailable.</span>
      </div>
    </div>
  )
}
