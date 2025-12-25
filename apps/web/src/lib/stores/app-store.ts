import { create } from 'zustand'
import type { AppError } from '@/lib/errors'

// =============================================================================
// APP STORE
// Global application state for cross-component communication.
// Manages loading states, global errors, and app-wide settings.
// =============================================================================

interface GlobalLoading {
  key: string
  message?: string
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  duration?: number
}

interface AppStore {
  // Global loading state
  globalLoading: GlobalLoading | null
  setGlobalLoading: (loading: GlobalLoading | null) => void

  // Route loading (for page transitions)
  isRouteLoading: boolean
  setRouteLoading: (loading: boolean) => void

  // Global error (for critical failures)
  globalError: AppError | null
  setGlobalError: (error: AppError | null) => void
  clearGlobalError: () => void

  // Notification queue
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // Online status
  isOnline: boolean
  setOnline: (online: boolean) => void

  // Session refresh indicator
  isRefreshingSession: boolean
  setRefreshingSession: (refreshing: boolean) => void

  // Last activity timestamp (for session timeout)
  lastActivity: number
  updateLastActivity: () => void

  // Feature flags / settings
  settings: {
    reducedMotion: boolean
    autoplayVideos: boolean
  }
  updateSettings: (settings: Partial<AppStore['settings']>) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Loading states
  globalLoading: null,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  isRouteLoading: false,
  setRouteLoading: (loading) => set({ isRouteLoading: loading }),

  // Error states
  globalError: null,
  setGlobalError: (error) => set({ globalError: error }),
  clearGlobalError: () => set({ globalError: null }),

  // Notifications
  notifications: [],
  addNotification: (notification) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newNotification = { ...notification, id, dismissible: notification.dismissible ?? true }
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // Auto-dismiss after duration
    if (newNotification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, newNotification.duration || 5000)
    }

    return id
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },
  clearNotifications: () => set({ notifications: [] }),

  // Online status
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  setOnline: (online) => set({ isOnline: online }),

  // Session
  isRefreshingSession: false,
  setRefreshingSession: (refreshing) => set({ isRefreshingSession: refreshing }),

  // Activity tracking
  lastActivity: Date.now(),
  updateLastActivity: () => set({ lastActivity: Date.now() }),

  // Settings
  settings: {
    reducedMotion: false,
    autoplayVideos: true,
  },
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }))
  },
}))

// =============================================================================
// HELPER HOOKS
// =============================================================================

export function useGlobalLoading() {
  return useAppStore((state) => ({
    loading: state.globalLoading,
    setLoading: state.setGlobalLoading,
  }))
}

export function useGlobalError() {
  return useAppStore((state) => ({
    error: state.globalError,
    setError: state.setGlobalError,
    clearError: state.clearGlobalError,
  }))
}

export function useIsOnline() {
  return useAppStore((state) => state.isOnline)
}

export function useNotifications() {
  return useAppStore((state) => ({
    notifications: state.notifications,
    add: state.addNotification,
    remove: state.removeNotification,
    clear: state.clearNotifications,
  }))
}

// =============================================================================
// ACTIONS
// Helper functions for common operations
// =============================================================================

export async function withGlobalLoading<T>(
  key: string,
  fn: () => Promise<T>,
  message?: string
): Promise<T> {
  const { setGlobalLoading } = useAppStore.getState()
  setGlobalLoading({ key, message })
  try {
    return await fn()
  } finally {
    setGlobalLoading(null)
  }
}

export function showSuccessNotification(title: string, description?: string) {
  return useAppStore.getState().addNotification({
    type: 'success',
    title,
    description,
  })
}

export function showErrorNotification(title: string, description?: string) {
  return useAppStore.getState().addNotification({
    type: 'error',
    title,
    description,
    duration: 8000, // Errors stay longer
  })
}

export function showWarningNotification(title: string, description?: string) {
  return useAppStore.getState().addNotification({
    type: 'warning',
    title,
    description,
  })
}

export function showInfoNotification(title: string, description?: string) {
  return useAppStore.getState().addNotification({
    type: 'info',
    title,
    description,
  })
}
