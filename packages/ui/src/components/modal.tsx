'use client'

import * as React from 'react'
import { X, AlertTriangle, Info, CheckCircle, HelpCircle } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './button'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const [isExiting, setIsExiting] = React.useState(false)
  const modalRef = React.useRef<HTMLDivElement>(null)

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeOnEscape])

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap
  React.useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    firstElement?.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [isOpen])

  const handleClose = React.useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose()
    }, 200)
  }, [onClose])

  if (!isOpen && !isExiting) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200',
        isExiting ? 'opacity-0' : 'opacity-100 animate-in'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200',
          isExiting ? 'opacity-0' : 'opacity-100'
        )}
        onClick={closeOnOverlayClick ? handleClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full rounded-xl bg-white shadow-xl transition-all duration-200',
          sizeClasses[size],
          isExiting
            ? 'scale-95 opacity-0 translate-y-4'
            : 'scale-100 opacity-100 translate-y-0 animate-zoom-in-95 animate-slide-in-from-bottom-4'
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between border-b border-warm-100 p-4">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-warm-900">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-warm-600">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="rounded-lg p-1 text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

// Confirmation Modal
export type ConfirmationType = 'danger' | 'warning' | 'info' | 'success'

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  type?: ConfirmationType
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}

const confirmIcons: Record<ConfirmationType, React.ComponentType<{ className?: string }>> = {
  danger: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
}

const confirmStyles: Record<ConfirmationType, { iconBg: string; iconColor: string; buttonVariant: 'destructive' | 'primary' | 'secondary' }> = {
  danger: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonVariant: 'destructive',
  },
  warning: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonVariant: 'primary',
  },
  info: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonVariant: 'primary',
  },
  success: {
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    buttonVariant: 'primary',
  },
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
}: ConfirmModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const Icon = confirmIcons[type]
  const style = confirmStyles[type]

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setIsProcessing(false)
    }
  }

  const isLoading = loading || isProcessing

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <div
          className={cn(
            'mx-auto flex h-14 w-14 items-center justify-center rounded-full',
            style.iconBg
          )}
        >
          <Icon className={cn('h-7 w-7', style.iconColor)} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-warm-900">{title}</h3>
        <p className="mt-2 text-sm text-warm-600">{message}</p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={style.buttonVariant as 'destructive' | 'primary'}
            className="flex-1"
            onClick={handleConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// Alert Modal (info only, no confirmation needed)
export interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: ConfirmationType
  buttonLabel?: string
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonLabel = 'OK',
}: AlertModalProps) {
  const Icon = confirmIcons[type]
  const style = confirmStyles[type]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <div
          className={cn(
            'mx-auto flex h-14 w-14 items-center justify-center rounded-full',
            style.iconBg
          )}
        >
          <Icon className={cn('h-7 w-7', style.iconColor)} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-warm-900">{title}</h3>
        <p className="mt-2 text-sm text-warm-600">{message}</p>
        <Button className="mt-6 w-full" onClick={onClose}>
          {buttonLabel}
        </Button>
      </div>
    </Modal>
  )
}
