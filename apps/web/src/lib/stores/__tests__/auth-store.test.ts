import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../auth-store'

// Mock the persist middleware storage
vi.mock('zustand/middleware', async () => {
  const actual = await vi.importActual('zustand/middleware')
  return {
    ...actual,
    persist: (fn: any) => fn,
  }
})

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      lastSignInAttempt: null,
    })
  })

  describe('initial state', () => {
    it('should have null user initially', () => {
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('signIn', () => {
    it('should sign in a valid user', async () => {
      const { signIn } = useAuthStore.getState()

      const result = await signIn({
        email: 'michael.r@example.com',
        password: 'password',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('michael.r@example.com')
        expect(result.data.fullName).toBe('Michael Robinson')
      }

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).not.toBeNull()
      expect(state.user?.email).toBe('michael.r@example.com')
    })

    it('should fail for invalid email', async () => {
      const { signIn } = useAuthStore.getState()

      const result = await signIn({
        email: 'invalid@example.com',
        password: 'password',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.code).toBe('AUTH_INVALID')
      }

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
    })

    it('should set loading state during sign in', async () => {
      const { signIn } = useAuthStore.getState()

      // Start sign in (don't await)
      const promise = signIn({
        email: 'michael.r@example.com',
        password: 'password',
      })

      // Check loading state immediately
      const loadingState = useAuthStore.getState()
      expect(loadingState.isLoading).toBe(true)

      // Wait for completion
      await promise

      // Loading should be false after completion
      const finalState = useAuthStore.getState()
      expect(finalState.isLoading).toBe(false)
    })

    it('should set lastSignInAttempt timestamp', async () => {
      const { signIn } = useAuthStore.getState()
      const before = Date.now()

      await signIn({
        email: 'michael.r@example.com',
        password: 'password',
      })

      const state = useAuthStore.getState()
      expect(state.lastSignInAttempt).not.toBeNull()
      expect(state.lastSignInAttempt).toBeGreaterThanOrEqual(before)
    })
  })

  describe('signUp', () => {
    it('should create a new user', async () => {
      const { signUp } = useAuthStore.getState()

      const result = await signUp({
        email: 'newuser@example.com',
        password: 'password123',
        fullName: 'New User',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('newuser@example.com')
        expect(result.data.fullName).toBe('New User')
        expect(result.data.isAdmin).toBe(false)
      }

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.email).toBe('newuser@example.com')
    })

    it('should fail if email already exists', async () => {
      const { signUp } = useAuthStore.getState()

      const result = await signUp({
        email: 'michael.r@example.com',
        password: 'password123',
        fullName: 'Duplicate User',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR')
        expect(result.error.field).toBe('email')
      }
    })
  })

  describe('signOut', () => {
    it('should clear user and auth state', async () => {
      // First sign in
      const { signIn, signOut } = useAuthStore.getState()
      await signIn({
        email: 'michael.r@example.com',
        password: 'password',
      })

      // Verify signed in
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Sign out
      signOut()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('setUser', () => {
    it('should set user directly', () => {
      const { setUser } = useAuthStore.getState()

      setUser({
        id: 'test-user',
        email: 'test@example.com',
        fullName: 'Test User',
        avatarUrl: null,
        bio: null,
        role: 'user',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const state = useAuthStore.getState()
      expect(state.user?.email).toBe('test@example.com')
      expect(state.isAuthenticated).toBe(true)
    })

    it('should clear user when set to null', () => {
      const { setUser } = useAuthStore.getState()

      // First set a user
      setUser({
        id: 'test-user',
        email: 'test@example.com',
        fullName: 'Test User',
        avatarUrl: null,
        bio: null,
        role: 'user',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Then clear
      setUser(null)

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('clearError', () => {
    it('should clear error state', async () => {
      const { signIn, clearError } = useAuthStore.getState()

      // Trigger an error
      await signIn({
        email: 'invalid@example.com',
        password: 'password',
      })

      expect(useAuthStore.getState().error).not.toBeNull()

      // Clear error
      clearError()

      expect(useAuthStore.getState().error).toBeNull()
    })
  })

  describe('refreshSession', () => {
    it('should return true if user is authenticated', async () => {
      const { signIn, refreshSession } = useAuthStore.getState()

      await signIn({
        email: 'michael.r@example.com',
        password: 'password',
      })

      const result = await refreshSession()
      expect(result).toBe(true)
    })

    it('should return false if no user', async () => {
      const { refreshSession } = useAuthStore.getState()

      const result = await refreshSession()
      expect(result).toBe(false)
    })
  })

  describe('resetPassword', () => {
    it('should complete for valid email', async () => {
      const { resetPassword } = useAuthStore.getState()

      await expect(resetPassword('test@example.com')).resolves.not.toThrow()
    })

    it('should throw for invalid email format', async () => {
      const { resetPassword } = useAuthStore.getState()

      await expect(resetPassword('invalid')).rejects.toThrow()
    })
  })

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const { signIn, updateProfile } = useAuthStore.getState()

      await signIn({
        email: 'michael.r@example.com',
        password: 'password',
      })

      await updateProfile({
        fullName: 'Updated Name',
        bio: 'New bio',
      })

      const state = useAuthStore.getState()
      expect(state.user?.fullName).toBe('Updated Name')
      expect(state.user?.bio).toBe('New bio')
    })

    it('should throw if not authenticated', async () => {
      const { updateProfile } = useAuthStore.getState()

      await expect(updateProfile({ fullName: 'Test' })).rejects.toThrow('Not authenticated')
    })
  })

  describe('demo sign in', () => {
    it('signInAsDemo should sign in as specified role', () => {
      const { signInAsDemo } = useAuthStore.getState()

      signInAsDemo('user')

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.role).toBe('user')
      expect(state.user?.isAdmin).toBe(false)
    })

    it('signInAsUser should sign in as regular user', () => {
      const { signInAsUser } = useAuthStore.getState()

      signInAsUser()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.role).toBe('user')
    })

    it('signInAsCreator should sign in as creator', () => {
      const { signInAsCreator } = useAuthStore.getState()

      signInAsCreator()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.role).toBe('creator')
    })

    it('signInAsAdmin should sign in as admin user', () => {
      const { signInAsAdmin } = useAuthStore.getState()

      signInAsAdmin()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.isAdmin).toBe(true)
    })
  })
})
