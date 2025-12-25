'use client'

import { useState } from 'react'
import { Card, CardContent, Button, Input, useToast } from '@metanoia/ui'
import {
  Settings,
  Globe,
  Video,
  Shield,
  Mail,
  Bell,
  Palette,
  Save,
  RefreshCw,
} from 'lucide-react'

export default function AdminSettingsPage() {
  const toast = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // Mock settings state
  const [settings, setSettings] = useState({
    siteName: 'Metanoia Moment',
    siteDescription: 'A global platform for sharing faith video testimonies',
    contactEmail: 'contact@metanoiamoment.org',
    maxVideoLength: 600,
    maxFileSize: 500,
    autoApprove: false,
    requireEmailVerification: true,
    allowAnonymous: false,
    moderationEnabled: true,
    notifyOnNewSubmission: true,
    notifyOnReport: true,
    maintenanceMode: false,
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success('Settings saved', 'Your changes have been applied.')
  }

  const updateSetting = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Settings</h1>
          <p className="text-warm-600">Configure your platform</p>
        </div>
        <Button onClick={handleSave} loading={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <Globe className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="font-semibold text-warm-900">General</h2>
                <p className="text-sm text-warm-500">Basic site settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-warm-700">
                  Site Name
                </label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => updateSetting('siteName', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-warm-700">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-warm-300 px-4 py-2 text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-warm-700">
                  Contact Email
                </label>
                <Input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => updateSetting('contactEmail', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100">
                <Video className="h-5 w-5 text-accent-600" />
              </div>
              <div>
                <h2 className="font-semibold text-warm-900">Video Settings</h2>
                <p className="text-sm text-warm-500">Upload and playback options</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-warm-700">
                  Max Video Length (seconds)
                </label>
                <Input
                  type="number"
                  value={settings.maxVideoLength}
                  onChange={(e) => updateSetting('maxVideoLength', parseInt(e.target.value) || 0)}
                />
                <p className="mt-1 text-xs text-warm-500">
                  Current: {Math.floor(settings.maxVideoLength / 60)} minutes
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-warm-700">
                  Max File Size (MB)
                </label>
                <Input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value) || 0)}
                />
              </div>

              <ToggleSetting
                label="Auto-approve submissions"
                description="Skip moderation for new testimonies"
                checked={settings.autoApprove}
                onChange={(checked) => updateSetting('autoApprove', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-100">
                <Shield className="h-5 w-5 text-secondary-600" />
              </div>
              <div>
                <h2 className="font-semibold text-warm-900">Security</h2>
                <p className="text-sm text-warm-500">Authentication and moderation</p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleSetting
                label="Require email verification"
                description="Users must verify email before posting"
                checked={settings.requireEmailVerification}
                onChange={(checked) => updateSetting('requireEmailVerification', checked)}
              />

              <ToggleSetting
                label="Allow anonymous submissions"
                description="Let users submit without an account"
                checked={settings.allowAnonymous}
                onChange={(checked) => updateSetting('allowAnonymous', checked)}
              />

              <ToggleSetting
                label="Content moderation"
                description="Enable automatic content screening"
                checked={settings.moderationEnabled}
                onChange={(checked) => updateSetting('moderationEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Bell className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-warm-900">Notifications</h2>
                <p className="text-sm text-warm-500">Admin alert preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleSetting
                label="New submission alerts"
                description="Get notified when a testimony is submitted"
                checked={settings.notifyOnNewSubmission}
                onChange={(checked) => updateSetting('notifyOnNewSubmission', checked)}
              />

              <ToggleSetting
                label="Report alerts"
                description="Get notified when content is reported"
                checked={settings.notifyOnReport}
                onChange={(checked) => updateSetting('notifyOnReport', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Settings className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-warm-900">Danger Zone</h2>
              <p className="text-sm text-warm-500">Proceed with caution</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-warm-200 p-4">
              <div>
                <p className="font-medium text-warm-900">Maintenance Mode</p>
                <p className="text-sm text-warm-500">
                  Temporarily disable the site for maintenance
                </p>
              </div>
              <ToggleSwitch
                checked={settings.maintenanceMode}
                onChange={(checked) => updateSetting('maintenanceMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
              <div>
                <p className="font-medium text-red-900">Clear All Cache</p>
                <p className="text-sm text-red-600">
                  Force refresh all cached data
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-100">
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Cache
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-warm-900">{label}</p>
        <p className="text-sm text-warm-500">{description}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  )
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        checked ? 'bg-primary-500' : 'bg-warm-300'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  )
}
