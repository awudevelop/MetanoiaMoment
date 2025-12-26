'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@metanoia/ui'
import { useNotifications } from '@/lib/stores/app-store'

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const COLORS = {
  success: {
    bg: 'bg-accent-50 border-accent-200',
    icon: 'text-accent-500',
    title: 'text-accent-800',
    description: 'text-accent-600',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    title: 'text-red-800',
    description: 'text-red-600',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    icon: 'text-amber-500',
    title: 'text-amber-800',
    description: 'text-amber-600',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    description: 'text-blue-600',
  },
}

interface NotificationToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

function NotificationToast({
  id,
  type,
  title,
  description,
  action,
  dismissible = true,
}: NotificationToastProps) {
  const { remove } = useNotifications()
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const Icon = ICONS[type]
  const colors = COLORS[type]

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  const handleDismiss = () => {
    setIsLeaving(true)
    setTimeout(() => {
      remove(id)
    }, 200)
  }

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-200',
        colors.bg,
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
      )}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <Icon className={cn('h-5 w-5 flex-shrink-0', colors.icon)} />

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className={cn('text-sm font-medium', colors.title)}>{title}</p>
            {description && <p className={cn('mt-1 text-sm', colors.description)}>{description}</p>}
            {action && (
              <button
                onClick={() => {
                  action.onClick()
                  handleDismiss()
                }}
                className={cn('mt-2 text-sm font-medium underline', colors.title)}
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Dismiss */}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className={cn(
                'flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/5',
                colors.icon
              )}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function NotificationToastContainer() {
  const { notifications } = useNotifications()

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-3 md:bottom-6 md:right-6"
    >
      {notifications.slice(0, 5).map((notification) => (
        <NotificationToast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          description={notification.description}
          action={notification.action}
          dismissible={notification.dismissible}
        />
      ))}
    </div>
  )
}
