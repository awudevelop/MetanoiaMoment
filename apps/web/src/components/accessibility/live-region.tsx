'use client'

import { useEffect, useState, createContext, useContext, useCallback, type ReactNode } from 'react'

type Politeness = 'polite' | 'assertive'

interface Announcement {
  message: string
  politeness: Politeness
  id: number
}

interface LiveRegionContextType {
  announce: (message: string, politeness?: Politeness) => void
}

const LiveRegionContext = createContext<LiveRegionContextType | null>(null)

export function useLiveRegion() {
  const context = useContext(LiveRegionContext)
  if (!context) {
    throw new Error('useLiveRegion must be used within a LiveRegionProvider')
  }
  return context
}

interface LiveRegionProviderProps {
  children: ReactNode
}

export function LiveRegionProvider({ children }: LiveRegionProviderProps) {
  const [politeAnnouncement, setPoliteAnnouncement] = useState('')
  const [assertiveAnnouncement, setAssertiveAnnouncement] = useState('')

  const announce = useCallback((message: string, politeness: Politeness = 'polite') => {
    if (politeness === 'assertive') {
      // Clear first to ensure the announcement is read even if the same message
      setAssertiveAnnouncement('')
      setTimeout(() => setAssertiveAnnouncement(message), 50)
    } else {
      setPoliteAnnouncement('')
      setTimeout(() => setPoliteAnnouncement(message), 50)
    }
  }, [])

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}
      {/* Polite announcements - for non-urgent updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeAnnouncement}
      </div>
      {/* Assertive announcements - for urgent updates */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveAnnouncement}
      </div>
    </LiveRegionContext.Provider>
  )
}

// Standalone live region for simple use cases
interface LiveRegionProps {
  message: string
  politeness?: Politeness
  className?: string
}

export function LiveRegion({ message, politeness = 'polite', className }: LiveRegionProps) {
  return (
    <div
      role={politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={politeness}
      aria-atomic="true"
      className={className || 'sr-only'}
    >
      {message}
    </div>
  )
}
