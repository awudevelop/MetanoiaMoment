'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, Button, useToast } from '@metanoia/ui'
import {
  Shield,
  AlertTriangle,
  Flag,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Ban,
} from 'lucide-react'
import { LoadingSpinner } from '@/components/global-loading'

// Mock reports data
const MOCK_REPORTS = [
  {
    id: 'report-1',
    type: 'testimony',
    targetId: 'testimony-3',
    targetTitle: 'A Prodigal Returns',
    reason: 'inappropriate_content',
    description: 'This video contains content that might not be appropriate for all audiences.',
    reportedBy: 'user-anonymous',
    status: 'pending',
    createdAt: '2024-12-22T14:30:00Z',
  },
  {
    id: 'report-2',
    type: 'testimony',
    targetId: 'testimony-5',
    targetTitle: 'Saved from the Streets',
    reason: 'spam',
    description: 'Promotional content disguised as testimony.',
    reportedBy: 'user-2',
    status: 'pending',
    createdAt: '2024-12-21T09:15:00Z',
  },
  {
    id: 'report-3',
    type: 'user',
    targetId: 'user-1',
    targetTitle: 'Michael Robinson',
    reason: 'harassment',
    description: 'User has been leaving inappropriate comments.',
    reportedBy: 'user-3',
    status: 'reviewed',
    createdAt: '2024-12-20T16:45:00Z',
    resolvedAt: '2024-12-21T10:00:00Z',
    resolution: 'warning_issued',
  },
]

const MOCK_FLAGGED_WORDS = [
  { word: 'spam', count: 3, lastDetected: '2024-12-22T10:00:00Z' },
  { word: 'promotional', count: 2, lastDetected: '2024-12-21T15:30:00Z' },
  { word: 'click here', count: 5, lastDetected: '2024-12-23T08:00:00Z' },
]

type Report = (typeof MOCK_REPORTS)[0]

export default function AdminModerationPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('pending')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const toast = useToast()

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setReports([...MOCK_REPORTS])
      setIsLoading(false)
    }
    loadData()
  }, [])

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true
    return r.status === filter
  })

  const handleResolve = (reportId: string, action: 'dismiss' | 'remove_content' | 'warn_user' | 'ban_user') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'reviewed', resolvedAt: new Date().toISOString(), resolution: action }
          : r
      )
    )

    const actionMessages = {
      dismiss: 'Report dismissed',
      remove_content: 'Content removed',
      warn_user: 'Warning issued to user',
      ban_user: 'User has been banned',
    }

    toast.success(actionMessages[action], 'Moderation action completed.')
    setSelectedReport(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const pendingCount = reports.filter((r) => r.status === 'pending').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warm-900">Moderation</h1>
        <p className="text-warm-600">Review reports and manage content</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Flag className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warm-900">{pendingCount}</p>
              <p className="text-sm text-warm-600">Pending Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warm-900">
                {reports.filter((r) => r.status === 'reviewed').length}
              </p>
              <p className="text-sm text-warm-600">Reviewed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warm-900">
                {MOCK_FLAGGED_WORDS.reduce((sum, w) => sum + w.count, 0)}
              </p>
              <p className="text-sm text-warm-600">Flagged Content</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
              <Shield className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warm-900">0</p>
              <p className="text-sm text-warm-600">Banned Users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reports List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-warm-900">Reports</h2>
            <div className="flex gap-2">
              {(['pending', 'reviewed', 'all'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-warm-100 text-warm-700 hover:bg-warm-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="mb-3 h-12 w-12 text-accent-500" />
                  <p className="text-warm-600">
                    {filter === 'pending' ? 'No pending reports' : 'No reports found'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-warm-100">
                  {filteredReports.map((report) => (
                    <ReportRow
                      key={report.id}
                      report={report}
                      isSelected={selectedReport?.id === report.id}
                      onSelect={() => setSelectedReport(report)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flagged Words */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold text-warm-900">Auto-Flagged Content</h3>
              <p className="mb-4 text-sm text-warm-600">
                Content containing these keywords is automatically flagged for review.
              </p>
              <div className="space-y-3">
                {MOCK_FLAGGED_WORDS.map((item) => (
                  <div
                    key={item.word}
                    className="flex items-center justify-between rounded-lg border border-warm-200 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <code className="rounded bg-warm-100 px-2 py-1 text-sm text-warm-700">
                        {item.word}
                      </code>
                      <span className="text-sm text-warm-500">
                        Detected {item.count} times
                      </span>
                    </div>
                    <span className="text-xs text-warm-400">
                      Last: {new Date(item.lastDetected).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4">
                Manage Keywords
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Report Detail */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {selectedReport ? (
            <ReportDetail
              report={selectedReport}
              onResolve={(action) => handleResolve(selectedReport.id, action)}
              onClose={() => setSelectedReport(null)}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Flag className="mb-3 h-12 w-12 text-warm-300" />
                <p className="text-warm-600">Select a report to review</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function ReportRow({
  report,
  isSelected,
  onSelect,
}: {
  report: Report
  isSelected: boolean
  onSelect: () => void
}) {
  const reasonLabels: Record<string, string> = {
    inappropriate_content: 'Inappropriate Content',
    spam: 'Spam',
    harassment: 'Harassment',
    copyright: 'Copyright Violation',
    other: 'Other',
  }

  const typeIcons: Record<string, typeof Flag> = {
    testimony: MessageSquare,
    user: Ban,
  }

  const Icon = typeIcons[report.type] || Flag

  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-4 p-4 text-left transition-colors ${
        isSelected ? 'bg-primary-50' : 'hover:bg-warm-50'
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          report.status === 'pending' ? 'bg-amber-100' : 'bg-green-100'
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            report.status === 'pending' ? 'text-amber-600' : 'text-green-600'
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-warm-900">{report.targetTitle}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              report.status === 'pending'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {report.status}
          </span>
        </div>
        <p className="text-sm text-warm-500">
          {reasonLabels[report.reason] || report.reason}
        </p>
      </div>

      <div className="text-right text-sm text-warm-500">
        {new Date(report.createdAt).toLocaleDateString()}
      </div>
    </button>
  )
}

function ReportDetail({
  report,
  onResolve,
  onClose,
}: {
  report: Report
  onResolve: (action: 'dismiss' | 'remove_content' | 'warn_user' | 'ban_user') => void
  onClose: () => void
}) {
  const reasonLabels: Record<string, string> = {
    inappropriate_content: 'Inappropriate Content',
    spam: 'Spam',
    harassment: 'Harassment',
    copyright: 'Copyright Violation',
    other: 'Other',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="font-semibold text-warm-900">Report Details</h3>
          <button onClick={onClose} className="text-warm-400 hover:text-warm-600">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-warm-500">Reported Content</p>
            <p className="font-medium text-warm-900">{report.targetTitle}</p>
            <span className="text-sm text-warm-500 capitalize">{report.type}</span>
          </div>

          <div>
            <p className="text-sm text-warm-500">Reason</p>
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
              {reasonLabels[report.reason] || report.reason}
            </span>
          </div>

          <div>
            <p className="text-sm text-warm-500">Description</p>
            <p className="text-warm-700">{report.description}</p>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-warm-400" />
            <span className="text-warm-600">
              Reported on {new Date(report.createdAt).toLocaleString()}
            </span>
          </div>

          {report.status === 'reviewed' && report.resolvedAt && (
            <div className="rounded-lg bg-green-50 p-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Resolved</span>
              </div>
              <p className="mt-1 text-sm text-green-600">
                {new Date(report.resolvedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {report.status === 'pending' && (
          <div className="mt-6 space-y-2">
            <p className="mb-3 text-sm font-medium text-warm-700">Take Action</p>

            <Button variant="outline" onClick={() => onResolve('dismiss')} className="w-full justify-start">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Dismiss Report
            </Button>

            <Button
              variant="outline"
              onClick={() => onResolve('remove_content')}
              className="w-full justify-start"
            >
              <Trash2 className="mr-2 h-4 w-4 text-amber-600" />
              Remove Content
            </Button>

            <Button
              variant="outline"
              onClick={() => onResolve('warn_user')}
              className="w-full justify-start"
            >
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
              Warn User
            </Button>

            <Button
              variant="outline"
              onClick={() => onResolve('ban_user')}
              className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
            >
              <Ban className="mr-2 h-4 w-4" />
              Ban User
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
