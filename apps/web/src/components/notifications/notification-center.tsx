'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Bell, X, Check, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import { cn, Button } from '@metanoia/ui'
import { useNotifications } from '@/lib/stores/app-store'
import { AnimateOnScroll } from '@/components/animations'

interface NotificationCenterProps {
  className?: string
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const t = useTranslations('notifications')
  const { notifications, remove, clear } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const unreadCount = notifications.length

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-accent-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className={cn('relative', className)}>
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors',
          isOpen
            ? 'bg-primary-100 text-primary-600'
            : 'text-warm-500 hover:bg-warm-100 hover:text-warm-700'
        )}
        aria-label={t('toggle')}
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-warm-200 bg-white shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-warm-100 bg-warm-50 px-4 py-3">
            <h3 className="font-semibold text-warm-900">{t('title')}</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  clear()
                  setIsOpen(false)
                }}
                className="text-xs text-warm-500 hover:text-warm-700"
              >
                {t('clearAll')}
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto h-10 w-10 text-warm-300" />
                <p className="mt-2 text-sm text-warm-500">{t('empty')}</p>
              </div>
            ) : (
              <ul className="divide-y divide-warm-100">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="group relative flex gap-3 px-4 py-3 transition-colors hover:bg-warm-50"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 pt-0.5">{getIcon(notification.type)}</div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-warm-900">{notification.title}</p>
                      {notification.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-warm-500">
                          {notification.description}
                        </p>
                      )}
                      {notification.action && (
                        <button
                          onClick={() => {
                            notification.action?.onClick()
                            remove(notification.id)
                          }}
                          className="mt-1.5 text-xs font-medium text-primary-600 hover:text-primary-700"
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>

                    {/* Dismiss Button */}
                    {notification.dismissible !== false && (
                      <button
                        onClick={() => remove(notification.id)}
                        className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label={t('dismiss')}
                      >
                        <X className="h-4 w-4 text-warm-400 hover:text-warm-600" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-warm-100 bg-warm-50 px-4 py-2">
              <p className="text-center text-xs text-warm-500">
                {t('count', { count: notifications.length })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
