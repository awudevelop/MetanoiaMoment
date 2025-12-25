import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole, SignInCredentials, SignUpCredentials } from '@/types'
import { MOCK_USERS } from '@/lib/mock-data'
import {
  createAppError,
  parseError,
  type AppError,
  type Result,
  success,
  failure,
} from '@/lib/errors'

// =============================================================================
// AUTH STORE
// This is a stubbed authentication store using Zustand.
// When implementing the real backend, replace the mock implementations
// with actual API calls to Supabase or your auth provider.
// =============================================================================

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: AppError | null
  lastSignInAttempt: number | null
}

interface AuthActions {
  // Core auth actions (return Result type for proper error handling)
  signIn: (credentials: SignInCredentials) => Promise<Result<User>>
  signUp: (credentials: SignUpCredentials) => Promise<Result<User>>
  signOut: () => void
  setUser: (user: User | null) => void
  clearError: () => void
  refreshSession: () => Promise<boolean>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: { fullName?: string; bio?: string; avatarUrl?: string }) => Promise<void>

  // For demo purposes - instant sign-in without API delay
  signInAsDemo: (role: UserRole) => void
  signInAsUser: () => void
  signInAsCreator: () => void
  signInAsAdmin: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      lastSignInAttempt: null,

      signIn: async (credentials: SignInCredentials): Promise<Result<User>> => {
        set({ isLoading: true, error: null, lastSignInAttempt: Date.now() })

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Simulate network error occasionally in development
          if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
            throw new Error('Simulated network error')
          }

          // STUB: Find user by email (in real app, validate password on server)
          const user = MOCK_USERS.find(
            (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
          )

          if (user) {
            set({ user, isAuthenticated: true, isLoading: false })
            return success(user)
          }

          const error = createAppError('AUTH_INVALID')
          set({ isLoading: false, error })
          return failure('AUTH_INVALID')
        } catch (err) {
          const error = parseError(err)
          set({ isLoading: false, error })
          return { success: false, error }
        }
      },

      signUp: async (credentials: SignUpCredentials): Promise<Result<User>> => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // STUB: Check if email already exists
          const exists = MOCK_USERS.some(
            (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
          )

          if (exists) {
            const error = createAppError('VALIDATION_ERROR', {
              message: 'An account with this email already exists',
              field: 'email',
            })
            set({ isLoading: false, error })
            return { success: false, error }
          }

          // STUB: Create new user (in real app, this would be an API call)
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: credentials.email,
            fullName: credentials.fullName,
            avatarUrl: null,
            bio: null,
            role: 'user',
            isAdmin: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          set({ user: newUser, isAuthenticated: true, isLoading: false })
          return success(newUser)
        } catch (err) {
          const error = parseError(err)
          set({ isLoading: false, error })
          return { success: false, error }
        }
      },

      signOut: () => {
        set({ user: null, isAuthenticated: false, error: null })
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user, error: null })
      },

      clearError: () => {
        set({ error: null })
      },

      refreshSession: async (): Promise<boolean> => {
        // STUB: In real app, this would refresh the auth token
        const { user } = get()
        if (!user) return false

        try {
          // Simulate session refresh
          await new Promise((resolve) => setTimeout(resolve, 500))
          return true
        } catch {
          set({ user: null, isAuthenticated: false })
          return false
        }
      },

      resetPassword: async (email: string): Promise<void> => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // STUB: In real app, this would send a password reset email
          if (!email.includes('@')) {
            throw new Error('Invalid email address')
          }

          set({ isLoading: false })
        } catch (err) {
          const error = parseError(err)
          set({ isLoading: false, error })
          throw err
        }
      },

      updateProfile: async (data: {
        fullName?: string
        bio?: string
        avatarUrl?: string
      }): Promise<void> => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500))

          const { user } = get()
          if (!user) throw new Error('Not authenticated')

          // STUB: Update user profile
          const updatedUser: User = {
            ...user,
            fullName: data.fullName ?? user.fullName,
            bio: data.bio ?? user.bio,
            avatarUrl: data.avatarUrl ?? user.avatarUrl,
            updatedAt: new Date().toISOString(),
          }

          set({ user: updatedUser, isLoading: false })
        } catch (err) {
          const error = parseError(err)
          set({ isLoading: false, error })
          throw err
        }
      },

      // Demo sign-in for testing - instant, no API delay
      signInAsDemo: (role: UserRole) => {
        const demoUser = MOCK_USERS.find((u) => u.role === role)
        if (demoUser) {
          set({ user: demoUser, isAuthenticated: true, error: null })
        }
      },

      signInAsUser: () => {
        const user = MOCK_USERS.find((u) => u.role === 'user')
        if (user) {
          set({ user, isAuthenticated: true, error: null })
        }
      },

      signInAsCreator: () => {
        const creator = MOCK_USERS.find((u) => u.role === 'creator')
        if (creator) {
          set({ user: creator, isAuthenticated: true, error: null })
        }
      },

      signInAsAdmin: () => {
        const admin = MOCK_USERS.find((u) => u.role === 'admin')
        if (admin) {
          set({ user: admin, isAuthenticated: true, error: null })
        }
      },
    }),
    {
      name: 'metanoia-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// =============================================================================
// HELPER HOOKS
// =============================================================================

export function useUser() {
  return useAuthStore((state) => state.user)
}

export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated)
}

export function useIsAdmin() {
  return useAuthStore((state) => state.user?.role === 'admin')
}

export function useIsCreator() {
  return useAuthStore((state) => state.user?.role === 'creator' || state.user?.role === 'admin')
}

export function useUserRole() {
  return useAuthStore((state) => state.user?.role ?? null)
}

export function useAuthError() {
  const error = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)
  return { error, clearError }
}

export function useAuthLoading() {
  return useAuthStore((state) => state.isLoading)
}
