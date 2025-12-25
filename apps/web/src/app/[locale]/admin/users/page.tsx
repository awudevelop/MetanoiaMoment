'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, Button, useToast } from '@metanoia/ui'
import {
  Search,
  Users,
  Mail,
  Calendar,
  Video,
  Shield,
  ShieldOff,
  MoreVertical,
  Ban,
  Check,
} from 'lucide-react'
import { MOCK_USERS, MOCK_TESTIMONIES } from '@/lib/mock-data'
import { LoadingSpinner } from '@/components/global-loading'
import type { User } from '@/types'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const toast = useToast()

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setUsers([...MOCK_USERS])
      setIsLoading(false)
    }
    loadData()
  }, [])

  const filteredUsers = users.filter((user) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    )
  })

  const getUserTestimonies = (userId: string) => {
    return MOCK_TESTIMONIES.filter((t) => t.userId === userId)
  }

  const handleToggleAdmin = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u))
    )
    const user = users.find((u) => u.id === userId)
    toast.success(
      user?.isAdmin ? 'Admin role removed' : 'Admin role granted',
      `${user?.fullName || user?.email} ${user?.isAdmin ? 'is no longer an admin' : 'is now an admin'}.`
    )
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => (prev ? { ...prev, isAdmin: !prev.isAdmin } : null))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warm-900">Users</h1>
        <p className="text-warm-600">Manage platform users</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warm-900">{users.length}</p>
              <p className="text-sm text-warm-600">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100">
              <Shield className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warm-900">
                {users.filter((u) => u.isAdmin).length}
              </p>
              <p className="text-sm text-warm-600">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-100">
              <Video className="h-5 w-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warm-900">
                {users.filter((u) => getUserTestimonies(u.id).length > 0).length}
              </p>
              <p className="text-sm text-warm-600">Contributors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
        <input
          type="search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-warm-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Users List */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="mb-3 h-12 w-12 text-warm-300" />
                  <p className="text-warm-600">No users found</p>
                </div>
              ) : (
                <div className="divide-y divide-warm-100">
                  {filteredUsers.map((user) => {
                    const testimonies = getUserTestimonies(user.id)
                    return (
                      <UserRow
                        key={user.id}
                        user={user}
                        testimoniesCount={testimonies.length}
                        isSelected={selectedUser?.id === user.id}
                        onSelect={() => setSelectedUser(user)}
                        onToggleAdmin={() => handleToggleAdmin(user.id)}
                      />
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Detail */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {selectedUser ? (
            <UserDetail
              user={selectedUser}
              testimonies={getUserTestimonies(selectedUser.id)}
              onToggleAdmin={() => handleToggleAdmin(selectedUser.id)}
              onClose={() => setSelectedUser(null)}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="mb-3 h-12 w-12 text-warm-300" />
                <p className="text-warm-600">Select a user to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function UserRow({
  user,
  testimoniesCount,
  isSelected,
  onSelect,
  onToggleAdmin,
}: {
  user: User
  testimoniesCount: number
  isSelected: boolean
  onSelect: () => void
  onToggleAdmin: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      className={`flex items-center gap-4 p-4 transition-colors ${
        isSelected ? 'bg-primary-50' : 'hover:bg-warm-50'
      }`}
    >
      <button
        onClick={onSelect}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600"
      >
        {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
      </button>

      <div className="min-w-0 flex-1" onClick={onSelect} role="button" tabIndex={0}>
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-warm-900">{user.fullName || 'No name'}</p>
          {user.isAdmin && (
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
              Admin
            </span>
          )}
        </div>
        <p className="truncate text-sm text-warm-500">{user.email}</p>
      </div>

      <div className="text-right text-sm">
        <p className="font-medium text-warm-700">{testimoniesCount}</p>
        <p className="text-warm-500">testimonies</p>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-lg p-1.5 hover:bg-warm-100"
        >
          <MoreVertical className="h-4 w-4 text-warm-500" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-warm-200 bg-white py-1 shadow-lg">
              <button
                onClick={() => {
                  onToggleAdmin()
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
              >
                {user.isAdmin ? (
                  <>
                    <ShieldOff className="h-4 w-4" />
                    Remove Admin Role
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Make Admin
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function UserDetail({
  user,
  testimonies,
  onToggleAdmin,
  onClose,
}: {
  user: User
  testimonies: typeof MOCK_TESTIMONIES
  onToggleAdmin: () => void
  onClose: () => void
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-600">
              {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-warm-900">{user.fullName || 'No name'}</h3>
              {user.isAdmin && (
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                  Admin
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-warm-400 hover:text-warm-600">
            ×
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-warm-400" />
            <span className="text-warm-700">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-warm-400" />
            <span className="text-warm-700">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Video className="h-4 w-4 text-warm-400" />
            <span className="text-warm-700">{testimonies.length} testimonies</span>
          </div>
        </div>

        {user.bio && (
          <div className="mt-4 rounded-lg bg-warm-50 p-3">
            <p className="text-sm italic text-warm-600">"{user.bio}"</p>
          </div>
        )}

        {testimonies.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 text-sm font-medium text-warm-900">Testimonies</h4>
            <div className="space-y-2">
              {testimonies.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-warm-100 p-2 text-sm"
                >
                  <span className="truncate text-warm-700">{t.title}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      t.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : t.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={onToggleAdmin}
            className="w-full"
          >
            {user.isAdmin ? (
              <>
                <ShieldOff className="mr-2 h-4 w-4" />
                Remove Admin Role
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Make Admin
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
