'use client'

import * as React from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '../lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  success: (title: string, description?: string) => string
  error: (title: string, description?: string) => string
  warning: (title: string, description?: string) => string
  info: (title: string, description?: string) => string
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  defaultDuration?: number
}

export function ToastProvider({
  children,
  position = 'bottom-right',
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast = { ...toast, id, duration: toast.duration ?? defaultDuration }
      setToasts((prev) => [...prev, newToast])
      return id
    },
    [defaultDuration]
  )

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = React.useCallback(
    (title: string, description?: string) => addToast({ type: 'success', title, description }),
    [addToast]
  )

  const error = React.useCallback(
    (title: string, description?: string) => addToast({ type: 'error', title, description }),
    [addToast]
  )

  const warning = React.useCallback(
    (title: string, description?: string) => addToast({ type: 'warning', title, description }),
    [addToast]
  )

  const info = React.useCallback(
    (title: string, description?: string) => addToast({ type: 'info', title, description }),
    [addToast]
  )

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <div
        className={cn(
          'fixed z-[100] flex flex-col gap-2',
          positionClasses[position],
          position.includes('bottom') ? 'flex-col-reverse' : ''
        )}
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const icons: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: {
    bg: 'bg-green-50',
    icon: 'text-green-500',
    border: 'border-green-200',
  },
  error: {
    bg: 'bg-red-50',
    icon: 'text-red-500',
    border: 'border-red-200',
  },
  warning: {
    bg: 'bg-amber-50',
    icon: 'text-amber-500',
    border: 'border-amber-200',
  },
  info: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    border: 'border-blue-200',
  },
}

interface ToastItemProps {
  toast: Toast
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = React.useState(false)
  const Icon = icons[toast.type]
  const style = styles[toast.type]

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true)
      }, toast.duration - 300) // Start exit animation 300ms before removal

      const removeTimer = setTimeout(() => {
        onClose()
      }, toast.duration)

      return () => {
        clearTimeout(exitTimer)
        clearTimeout(removeTimer)
      }
    }
  }, [toast.duration, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={cn(
        'flex w-80 items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300',
        style.bg,
        style.border,
        isExiting
          ? 'translate-x-full opacity-0'
          : 'translate-x-0 opacity-100 animate-slide-in-from-right-full'
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', style.icon)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-warm-900">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-sm text-warm-600">{toast.description}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded p-1 text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
