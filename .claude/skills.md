# Metanoia Moment - Project Skills

## Overview

This document defines Claude Code skills (slash commands) for the Metanoia Moment project. These skills automate common development tasks and maintain consistency across the codebase.

---

## Available Skills

### `/component` - Create UI Component

Creates a new component in the shared UI library with proper TypeScript types and exports.

**Usage**: `/component ButtonGroup`

**Creates**:

- `packages/ui/src/components/button-group.tsx`
- Updates `packages/ui/src/index.ts` exports

**Template**:

```tsx
import * as React from 'react'
import { cn } from '../lib/utils'

export interface {Name}Props {
  className?: string
  children: React.ReactNode
}

export function {Name}({ className, children }: {Name}Props) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}
```

---

### `/page` - Create New Page

Creates a new internationalized page with proper layout integration.

**Usage**: `/page privacy` or `/page testimonies/[id]`

**Creates**:

- `apps/web/src/app/[locale]/{path}/page.tsx`
- Adds translation keys to `messages/en.json`

**Template**:

```tsx
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function {Name}Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="section">
      <div className="container">
        <h1 className="font-display text-4xl font-bold text-warm-900">
          {/* Page content */}
        </h1>
      </div>
    </div>
  )
}
```

---

### `/translate` - Add Translations

Adds translation keys to all language files.

**Usage**: `/translate testimonies.empty "No testimonies found"`

**Updates**:

- `apps/web/messages/en.json`
- `apps/web/messages/es.json`
- Other language files (prompts for translations)

---

### `/mock` - Add Mock Data

Adds new mock data entries for development.

**Usage**: `/mock testimony` or `/mock user`

**Updates**: `apps/web/src/lib/mock-data.ts`

---

### `/store` - Create Zustand Store

Creates a new Zustand store with TypeScript types.

**Usage**: `/store notifications`

**Creates**: `apps/web/src/lib/stores/notification-store.ts`

**Template**:

```tsx
import { create } from 'zustand'

interface {Name}Store {
  // State
  items: {Name}[]
  isLoading: boolean

  // Actions
  fetch: () => Promise<void>
  add: (item: {Name}) => void
  remove: (id: string) => void
}

export const use{Name}Store = create<{Name}Store>((set, get) => ({
  items: [],
  isLoading: false,

  fetch: async () => {
    set({ isLoading: true })
    // TODO: Replace with API call
    set({ isLoading: false })
  },

  add: (item) => {
    set((state) => ({ items: [...state.items, item] }))
  },

  remove: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
  },
}))
```

---

### `/api` - Create API Route

Creates a new API route with proper error handling.

**Usage**: `/api testimonies/[id]/view`

**Creates**: `apps/web/src/app/api/{path}/route.ts`

**Template**:

```tsx
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // TODO: Implement

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

### `/supabase` - Add Supabase Integration

Replaces a stubbed store with Supabase implementation.

**Usage**: `/supabase auth` or `/supabase testimonies`

**Updates**:

- Adds Supabase client imports
- Replaces mock data calls with Supabase queries
- Maintains existing TypeScript interfaces

---

### `/test` - Create Test File

Creates a test file for a component or utility using Vitest and React Testing Library.

**Usage**: `/test button` or `/test auth-store`

**Creates**: `{path}/__tests__/{name}.test.tsx`

**Template for Component**:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { {Name} } from '../{name}'

describe('{Name}', () => {
  it('renders correctly', () => {
    render(<{Name}>Test</{Name}>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<{Name} onClick={onClick}>Click me</{Name}>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

**Template for Store**:

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act } from '@testing-library/react'
import { use{Name}Store } from '../{name}-store'

describe('{Name} Store', () => {
  beforeEach(() => {
    use{Name}Store.setState(use{Name}Store.getInitialState())
    vi.clearAllMocks()
  })

  it('should have initial state', () => {
    const state = use{Name}Store.getState()
    expect(state.items).toEqual([])
    expect(state.isLoading).toBe(false)
  })

  it('should perform action', async () => {
    await act(async () => {
      await use{Name}Store.getState().fetch()
    })
    expect(use{Name}Store.getState().items.length).toBeGreaterThan(0)
  })
})
```

**Test Configuration**: Uses `vitest.config.ts` with jsdom environment and `@testing-library/jest-dom` matchers.

---

### `/deploy` - Deployment Checklist

Runs through deployment preparation steps.

**Checks**:

1. TypeScript compilation (`pnpm build`)
2. Linting (`pnpm lint`)
3. Environment variables configured
4. Git status clean

---

### `/animation` - Create Animation Component

Creates a new animation component with Intersection Observer integration.

**Usage**: `/animation FadeInSection`

**Creates**: `apps/web/src/components/animations/{name}.tsx`

**Template**:

```tsx
'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface {Name}Props {
  children: ReactNode
  className?: string
  delay?: number
}

export function {Name}({ children, className, delay = 0 }: {Name}Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      {children}
    </div>
  )
}
```

---

### `/pwa` - PWA Component

Creates a new PWA-related component with proper hooks.

**Usage**: `/pwa ShareButton`

**Creates**: `apps/web/src/components/pwa/{name}.tsx`

**Template**:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { usePWA } from '@/hooks/use-pwa'

export function {Name}() {
  const t = useTranslations('pwa')
  const { platformInfo } = usePWA()

  return (
    <div>
      {/* Component implementation */}
    </div>
  )
}
```

**Updates**: `apps/web/src/components/pwa/index.ts` exports

---

### `/skeleton` - Loading Skeleton

Creates a skeleton loading component for a specific content type.

**Usage**: `/skeleton UserCard`

**Creates**: Adds to `apps/web/src/components/animations/skeleton.tsx`

**Template**:

```tsx
export function Skeleton{Name}() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-warm-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-warm-200 rounded w-1/2" />
    </div>
  )
}
```

---

### `/share` - Add Social Sharing

Adds social sharing functionality to a page or component.

**Usage**: `/share testimony-detail`

**Imports**:

- `SocialShare` - Full sharing widget with all platforms
- `ShareModal` - Modal dialog for sharing
- `QuickShareButton` - Compact button for cards

**Template**:

```tsx
import { ShareModal } from '@/components/sharing'

// In component:
const [showShare, setShowShare] = useState(false)
const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/testimonies/${id}`

// In JSX:
<button onClick={() => setShowShare(true)}>Share</button>
<ShareModal
  isOpen={showShare}
  onClose={() => setShowShare(false)}
  url={shareUrl}
  title={title}
  description={description}
/>
```

**Available Components**:

- `SocialShare` - Buttons for Facebook, Twitter, WhatsApp, Email, with QR code option
- `ShareModal` - Full-page modal with all sharing options
- `QuickShareButton` - Minimal share button for cards

---

### `/protect` - Add Bot Protection

Adds bot protection to a form with reCAPTCHA, honeypot, and rate limiting.

**Usage**: `/protect contact-form`

**Imports**:

```tsx
import { useBotProtection } from '@/lib/hooks/use-recaptcha'
```

**Template**:

```tsx
const { validateSubmission, honeypotProps, isReady } = useBotProtection({
  action: 'contact',
})

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const botCheck = await validateSubmission()
  if (!botCheck.isValid) {
    toast.error('Submission blocked', botCheck.error)
    return
  }

  // Send botCheck.token to backend for verification
  // Continue with form submission...
}

// In form JSX:
<input type="text" {...honeypotProps} />
<button disabled={!isReady}>Submit</button>
```

**Configuration**: Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` in `.env` for full reCAPTCHA support

---

### `/seo` - SEO Component

Creates JSON-LD structured data for a specific page type.

**Usage**: `/seo testimony`

**Updates**: `apps/web/src/lib/seo.ts`

**Adds**:

```tsx
export function generate{Name}JsonLd(data: {Name}): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    // ... structured data
  }
}
```

---

## Skill Implementation Notes

### For Claude Code Integration

These skills should be implemented as Claude Code custom commands. Each skill:

1. **Validates input** - Ensures proper naming conventions
2. **Follows patterns** - Uses existing code as templates
3. **Updates exports** - Maintains barrel files (index.ts)
4. **Adds types** - Ensures TypeScript compliance

### Naming Conventions

| Type       | Convention                  | Example            |
| ---------- | --------------------------- | ------------------ |
| Components | PascalCase                  | `VideoPlayer`      |
| Files      | kebab-case                  | `video-player.tsx` |
| Stores     | camelCase with `use` prefix | `useAuthStore`     |
| API routes | kebab-case paths            | `/api/testimonies` |
| Types      | PascalCase                  | `TestimonyStatus`  |

### File Locations

```
apps/web/src/
├── app/
│   ├── [locale]/     # Pages (use /page)
│   └── api/          # API routes (use /api)
├── components/
│   ├── animations/   # Animation components (use /animation)
│   ├── auth/         # AuthGuard, protected route wrappers
│   ├── forms/        # Form components (use /password, /validate)
│   ├── layout/       # Header, footer, mobile-nav
│   ├── notifications/# NotificationCenter, toasts (use /notification)
│   ├── pwa/          # PWA components (use /pwa)
│   ├── search/       # Search modal, input (use /search)
│   ├── seo/          # SEO components (use /seo)
│   └── sharing/      # Social share components (use /share)
├── hooks/            # Custom React hooks
├── lib/
│   ├── auth/         # Route auth config
│   ├── stores/       # Zustand stores (use /store)
│   ├── validation.ts # Form validation utilities
│   ├── animations.ts # Animation utilities
│   └── seo.ts        # SEO helpers
└── types/            # TypeScript types

apps/web/public/
├── manifest.json     # PWA manifest
├── sw.js             # Service worker
└── icons/            # App icons

packages/ui/src/
├── components/       # Shared components (use /component)
└── index.ts          # Barrel exports
```

---

---

### `/schema` - Backend Schema Reference

Displays the complete database schema with foreign key relationships and integration roadmap. Use this when planning backend integration or understanding the data model.

**Usage**: `/schema` or `/schema profiles` or `/schema testimonies`

**Displays**: Complete schema documentation including entity relationships, RLS policies, and integration checklist.

**See**: [Backend Schema Reference](#backend-schema-reference) section below.

---

### `/validate` - Add Form Validation

Adds internationalized form validation to a form component.

**Usage**: `/validate signup-form`

**Imports**:

```tsx
import { useTranslations } from 'next-intl'
import {
  useFormValidation,
  required,
  email,
  minLength,
  match,
} from '@/lib/hooks/use-form-validation'
```

**Template**:

```tsx
type FormData = {
  email: string
  password: string
  confirmPassword: string
}

export function MyForm() {
  const v = useTranslations('validation')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { validateAll, handleBlur, getFieldError } = useFormValidation<FormData>({
    email: [required(v('emailRequired')), email(v('invalidEmail'))],
    password: [required(v('passwordRequired')), minLength(8, v('passwordMinLength', { min: 8 }))],
    confirmPassword: [
      required(v('confirmPasswordRequired')),
      match(() => password, v('passwordMatch')),
    ],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAll({ email, password, confirmPassword })) {
      return
    }
    // Submit form...
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur('email', email)}
        error={getFieldError('email')}
      />
      {/* More fields... */}
    </form>
  )
}
```

**Available Validators**:

- `required(message)` - Field must not be empty
- `email(message)` - Must be valid email format
- `minLength(min, message)` - Minimum character length
- `maxLength(max, message)` - Maximum character length
- `match(getValue, message)` - Must match another field value
- `pattern(regex, message)` - Must match regex pattern

**Translation Keys** (in `validation` namespace):

- `emailRequired`, `passwordRequired`, `nameRequired`
- `invalidEmail`, `passwordMinLength`, `nameMinLength`
- `confirmPasswordRequired`, `passwordMatch`
- `formErrors`, `checkFields`, `securityFailed`

---

### `/icons` - Generate PWA Icons

Generates PWA icons and splash screens for all device sizes.

**Usage**: `/icons` or `/icons splash`

**Commands**:

```bash
# Generate all PWA icons (72px to 512px)
npm run generate-icons

# Generate iOS splash screens (16 device sizes)
npm run generate-splash
```

**Icon Sizes Generated**:

- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Splash Screen Devices**:

- iPhone: SE, 8, 11, 12, 13, 14, 15 (all variants)
- iPad: Mini, Air, Pro 10.5", 11", 12.9"

**Output Locations**:

- Icons: `apps/web/public/icons/`
- Splash: `apps/web/public/splash/`

**Scripts Location**:

- `scripts/generate-icons.js`
- `scripts/convert-icons-to-png.js`
- `scripts/generate-splash-screens.js`

---

### `/hook` - Create Custom Hook

Creates a new React hook with proper TypeScript types.

**Usage**: `/hook useDebounce`

**Creates**: `apps/web/src/lib/hooks/{name}.ts`

**Template**:

```tsx
import { useState, useEffect, useCallback } from 'react'

interface Use{Name}Options {
  delay?: number
}

interface Use{Name}Result {
  value: string
  setValue: (value: string) => void
  isLoading: boolean
}

export function use{Name}(options: Use{Name}Options = {}): Use{Name}Result {
  const { delay = 300 } = options
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Hook logic
  }, [value, delay])

  return {
    value,
    setValue,
    isLoading,
  }
}
```

**Existing Hooks**:

- `usePWA` - PWA install, platform detection
- `useFormValidation` - Form validation with i18n
- `useBotProtection` - reCAPTCHA + honeypot + rate limiting
- `useAsync` - Async operation state management
- `useIsAdmin` - Check if current user has admin role
- `useIsCreator` - Check if current user has creator or admin role
- `useUserRole` - Get current user's role ('user' | 'creator' | 'admin')

---

### `/portal` - Create Portal Dashboard Page

Creates a new page for a user portal (admin, creator, or user).

**Usage**: `/portal creator/settings` or `/portal admin/reports`

**Creates**: `apps/web/src/app/[locale]/{portal}/{page}/page.tsx`

**Template**:

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@metanoia/ui'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useAuthStore, useIsCreator } from '@/lib/stores/auth-store'
import { AnimateOnScroll } from '@/components/animations'

export default function {Name}Page() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const isCreator = useIsCreator() // or useIsAdmin()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }
    if (!isCreator) {
      router.push('/account')
      return
    }
  }, [isAuthenticated, isCreator, router])

  if (!isAuthenticated || !user || !isCreator) {
    return null
  }

  return (
    <div className="section">
      <div className="container max-w-6xl">
        <AnimateOnScroll animation="fade-in-down">
          <Link
            href="/creator"
            className="mb-4 inline-flex items-center gap-2 text-sm text-warm-500 hover:text-warm-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-display text-3xl font-bold text-warm-900">
            {/* Page Title */}
          </h1>
        </AnimateOnScroll>

        {/* Page Content */}
      </div>
    </div>
  )
}
```

**Available Portals**:

| Portal  | Route      | Access Check     | Description                        |
| ------- | ---------- | ---------------- | ---------------------------------- |
| Admin   | `/admin`   | `useIsAdmin()`   | Full platform management           |
| Creator | `/creator` | `useIsCreator()` | Manage own testimonies & analytics |
| User    | `/account` | Authenticated    | Profile & settings                 |

**Portal Structure**:

```
/admin/                    # Admin Portal
├── page.tsx               # Dashboard with stats
├── testimonies/page.tsx   # Moderation queue
├── users/page.tsx         # User management
├── analytics/page.tsx     # Platform analytics
├── moderation/page.tsx    # Reports & flagged content
└── settings/page.tsx      # Platform settings

/creator/                  # Creator Portal
├── page.tsx               # Dashboard with personal stats
├── testimonies/page.tsx   # Manage own testimonies
└── analytics/page.tsx     # Personal analytics

/account/                  # User Portal
├── page.tsx               # Profile settings
└── testimonies/page.tsx   # View own testimonies
```

---

### `/category` - Add Category Badge/Section

Adds category badges or category browsing sections to components and pages.

**Usage**: `/category badge` or `/category section`

**For Badge** - Adds to a card or list item:

```tsx
import { STORY_CATEGORIES } from '@/types'
import type { StoryCategory } from '@/types'
import { Lightbulb, Users, Sparkles, Heart, MessageCircle, Trophy } from 'lucide-react'

const CATEGORY_ICONS: Record<StoryCategory, React.ElementType> = {
  life_wisdom: Lightbulb,
  family_history: Users,
  transformation: Sparkles,
  faith_journey: Heart,
  final_messages: MessageCircle,
  milestones: Trophy,
}

const CATEGORY_COLORS: Record<StoryCategory, string> = {
  life_wisdom: 'bg-amber-100 text-amber-700',
  family_history: 'bg-blue-100 text-blue-700',
  transformation: 'bg-purple-100 text-purple-700',
  faith_journey: 'bg-rose-100 text-rose-700',
  final_messages: 'bg-teal-100 text-teal-700',
  milestones: 'bg-green-100 text-green-700',
}

// Usage in JSX:
{
  category && CATEGORY_ICONS[category] && (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
    >
      {React.createElement(CATEGORY_ICONS[category], { className: 'h-3 w-3' })}
      {STORY_CATEGORIES[category]?.label}
    </span>
  )
}
```

**For Section** - Category browse grid:

```tsx
import { CategoryBrowseClient } from '@/app/[locale]/category-browse-client'

// In JSX:
;<section className="section bg-warm-50">
  <div className="container">
    <h2>Browse by Category</h2>
    <CategoryBrowseClient />
  </div>
</section>
```

**Existing Category Components**:

- `TestimonyCard` - Has `category` and `categoryLabel` props for badge display
- `CategoryBrowseClient` - Full category grid with icons, descriptions, counts

**Available Categories**:

| Key              | Label          | Icon          | Color  |
| ---------------- | -------------- | ------------- | ------ |
| `life_wisdom`    | Life Wisdom    | Lightbulb     | amber  |
| `family_history` | Family History | Users         | blue   |
| `transformation` | Transformation | Sparkles      | purple |
| `faith_journey`  | Faith Journey  | Heart         | rose   |
| `final_messages` | Final Messages | MessageCircle | teal   |
| `milestones`     | Milestones     | Trophy        | green  |

---

### `/search` - Add Search Functionality

Adds search modal with autocomplete, recent searches, and keyboard shortcuts.

**Usage**: `/search header` or `/search page`

**Components Available**:

```tsx
import { SearchTrigger, SearchModal, SearchInput } from '@/components/search'

// Button trigger (shows search icon, opens modal)
<SearchTrigger className="hidden sm:block" />

// Input-style trigger (shows placeholder, opens modal)
<SearchTrigger variant="input" />

// Standalone search input (no modal)
<SearchInput
  placeholder="Search..."
  onSearch={(query) => handleSearch(query)}
  isLoading={isSearching}
/>
```

**Features**:

- Keyboard shortcut: ⌘K (Mac) / Ctrl+K (Windows)
- Recent searches (persisted to localStorage)
- Trending/popular topics
- Debounced search with loading state
- i18n support (EN/ES)

**Translation Keys** (in `search` namespace):

- `placeholder`, `label`, `clear`, `open`, `cancel`
- `results`, `noResults`, `tryDifferent`
- `recent`, `clearRecent`, `trending`, `hint`

---

### `/notification` - Add Notification System

Adds notification center and toast notifications.

**Usage**: `/notification center` or `/notification toast`

**Components Available**:

```tsx
import { NotificationCenter, NotificationToastContainer } from '@/components/notifications'
import { useNotifications, showSuccessNotification } from '@/lib/stores/app-store'

// Bell icon dropdown (header)
<NotificationCenter className="hidden sm:block" />

// Toast container (root layout)
<NotificationToastContainer />

// Programmatic notifications
showSuccessNotification('Success!', 'Your changes were saved.')
showErrorNotification('Error', 'Something went wrong.')
showWarningNotification('Warning', 'This action is irreversible.')
showInfoNotification('Info', 'New updates available.')

// With hook
const { add, remove, clear, notifications } = useNotifications()
add({ type: 'success', title: 'Done!', description: 'Task completed.' })
```

**Notification Types**: `success`, `error`, `warning`, `info`

**Features**:

- Auto-dismiss (configurable duration)
- Action buttons
- Badge count
- i18n support

---

### `/password` - Add Password Strength Indicator

Adds password strength indicator with requirements checklist.

**Usage**: `/password signup-form`

**Components Available**:

```tsx
import { PasswordStrengthIndicator } from '@/components/forms'

<Input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
<PasswordStrengthIndicator
  password={password}
  showRequirements={password.length > 0}
/>
```

**Strength Levels**:

| Score | Label  | Color  |
| ----- | ------ | ------ |
| 0     | Empty  | gray   |
| 1     | Weak   | red    |
| 2     | Fair   | orange |
| 3     | Good   | yellow |
| 4     | Strong | green  |

**Requirements Checked**:

- Minimum 8 characters
- Mixed case (uppercase + lowercase)
- Contains number
- Contains special character

**Translation Keys** (in `validation` namespace):

- `passwordStrength`, `passwordWeak`, `passwordFair`, `passwordGood`, `passwordStrong`
- `passwordMixedCase`, `passwordNumber`, `passwordSpecial`

---

### `/related` - Related Content Algorithm

Adds related content section with smart scoring algorithm.

**Usage**: `/related testimonies`

**Algorithm Template**:

```tsx
// Score each item based on relevance
const scored = items.map((item) => {
  let score = 0
  // Category match is most important (3 points)
  if (currentItem.category && item.category === currentItem.category) {
    score += 3
  }
  // Same language (2 points)
  if (item.language === currentItem.language) {
    score += 2
  }
  // Shared tags (1 point each)
  const sharedTags = item.tags.filter((tag) => currentItem.tags.includes(tag)).length
  score += sharedTags
  return { item, score }
})

// Sort by score (descending), then by popularity for ties
const related = scored
  .filter((s) => s.score > 0)
  .sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.item.viewCount - a.item.viewCount
  })
  .slice(0, 3)
  .map((s) => s.item)
```

**Scoring Weights**:

| Factor        | Points | Rationale             |
| ------------- | ------ | --------------------- |
| Same category | 3      | Most relevant match   |
| Same language | 2      | Content accessibility |
| Shared tag    | 1 each | Thematic connection   |

**Example Implementation**: See `apps/web/src/app/[locale]/testimonies/[id]/testimony-detail-client.tsx`

---

## Future Skills (Phase 2+)

### `/migration` - Database Migration

Creates Supabase migration files.

### `/webhook` - Webhook Handler

Creates webhook endpoint with signature verification.

### `/email` - Email Template

Creates email template for notifications.

### `/analytics` - Analytics Event

Adds analytics tracking to a component or page.

---

## Animation Reference

Available animation classes (Tailwind config):

| Animation                 | Description              |
| ------------------------- | ------------------------ |
| `animate-fade-in-up`      | Fade in from below       |
| `animate-fade-in-down`    | Fade in from above       |
| `animate-fade-in-left`    | Fade in from left        |
| `animate-fade-in-right`   | Fade in from right       |
| `animate-scale-in`        | Scale from 95% to 100%   |
| `animate-scale-in-bounce` | Scale with bounce effect |
| `animate-slide-in-up`     | Slide up from bottom     |
| `animate-slide-in-down`   | Slide down from top      |
| `animate-slide-in-left`   | Slide in from left       |
| `animate-slide-in-right`  | Slide in from right      |
| `animate-wiggle`          | Subtle wiggle effect     |
| `animate-shimmer`         | Loading shimmer effect   |
| `animate-bounce-soft`     | Gentle bounce            |
| `animate-pulse-soft`      | Gentle pulse             |

---

## PWA Reference

### Platform Detection

The `usePWA` hook provides:

```tsx
const {
  isInstallable, // Can show native install prompt
  isInstalled, // Already installed as PWA
  isStandalone, // Running in standalone mode
  platformInfo, // { os, browser, isMobile, isTablet, ... }
  canShowInstallPrompt,
  install, // Trigger native install
} = usePWA()
```

### Supported Platforms

- **iOS**: Safari, Chrome (redirects to Safari)
- **Android**: Chrome, Firefox, Samsung Browser
- **Desktop**: Chrome, Edge, Safari (macOS), Firefox (limited)

### Service Worker

- Network-first for navigation
- Cache-first for static assets
- Locale-aware offline pages
- Background sync ready

---

## Backend Schema Reference

This section documents the complete database schema for when backend integration begins.

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         auth.users                               │
│                    (Supabase managed)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ id (UUID) PK                                             │   │
│  │ email                                                    │   │
│  │ encrypted_password                                       │   │
│  │ raw_user_meta_data (JSONB) → full_name, avatar_url       │   │
│  │ created_at, updated_at                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ ON DELETE CASCADE
                             │ (1:1 relationship)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          profiles                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ id (UUID) PK, FK → auth.users.id                         │   │
│  │ email (TEXT) NOT NULL                                    │   │
│  │ full_name (TEXT)                                         │   │
│  │ avatar_url (TEXT)                                        │   │
│  │ bio (TEXT)                                               │   │
│  │ is_admin (BOOLEAN) DEFAULT FALSE                         │   │
│  │ created_at, updated_at (TIMESTAMPTZ)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ ON DELETE CASCADE
                             │ (1:many relationship)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        testimonies                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ id (UUID) PK DEFAULT gen_random_uuid()                   │   │
│  │ user_id (UUID) FK → profiles.id, NOT NULL                │   │
│  │                                                          │   │
│  │ ─── Content ───                                          │   │
│  │ title (TEXT) NOT NULL                                    │   │
│  │ description (TEXT)                                       │   │
│  │ video_url (TEXT) NOT NULL                                │   │
│  │ thumbnail_url (TEXT)                                     │   │
│  │ duration (INTEGER) — seconds                             │   │
│  │                                                          │   │
│  │ ─── Metadata ───                                         │   │
│  │ language (TEXT) DEFAULT 'en'                             │   │
│  │ tags (TEXT[]) DEFAULT '{}'                               │   │
│  │                                                          │   │
│  │ ─── Status ───                                           │   │
│  │ status (ENUM: pending|approved|rejected) DEFAULT pending │   │
│  │ view_count (INTEGER) DEFAULT 0                           │   │
│  │ featured (BOOLEAN) DEFAULT FALSE                         │   │
│  │ published_at (TIMESTAMPTZ)                               │   │
│  │                                                          │   │
│  │ ─── Search (auto-generated) ───                          │   │
│  │ search_vector (TSVECTOR) GENERATED ALWAYS                │   │
│  │                                                          │   │
│  │ created_at, updated_at (TIMESTAMPTZ)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Foreign Key Relationships

| Child Table   | Column    | Parent Table | Parent Column | On Delete |
| ------------- | --------- | ------------ | ------------- | --------- |
| `profiles`    | `id`      | `auth.users` | `id`          | CASCADE   |
| `testimonies` | `user_id` | `profiles`   | `id`          | CASCADE   |

### Database Indexes

**profiles**:

- `profiles_email_idx` on `email`
- `profiles_is_admin_idx` on `is_admin` WHERE `is_admin = TRUE` (partial)

**testimonies**:

- `testimonies_user_id_idx` on `user_id`
- `testimonies_status_idx` on `status`
- `testimonies_language_idx` on `language`
- `testimonies_featured_idx` on `featured` WHERE `featured = TRUE` (partial)
- `testimonies_published_at_idx` on `published_at DESC NULLS LAST`
- `testimonies_search_idx` on `search_vector` (GIN for full-text search)

### Row Level Security (RLS) Policies

**profiles**:
| Policy | Operation | Rule |
|--------|-----------|------|
| `profiles_select` | SELECT | Anyone can read all profiles |
| `profiles_update` | UPDATE | Users can only update their own profile |

**testimonies**:
| Policy | Operation | Rule |
|--------|-----------|------|
| `testimonies_select` | SELECT | Approved visible to all, pending/rejected only to owner |
| `testimonies_insert` | INSERT | Only authenticated users can create (must match user_id) |
| `testimonies_update` | UPDATE | Owner can update, OR admin can update |
| `testimonies_delete` | DELETE | Only admins can delete |

### Database Triggers

| Trigger                  | Table       | Event         | Function              |
| ------------------------ | ----------- | ------------- | --------------------- |
| `profiles_updated_at`    | profiles    | BEFORE UPDATE | `update_updated_at()` |
| `testimonies_updated_at` | testimonies | BEFORE UPDATE | `update_updated_at()` |
| `on_auth_user_created`   | auth.users  | AFTER INSERT  | `handle_new_user()`   |

### Storage Buckets

```
testimonies/                    ← Public bucket
├── {user_id}/
│   └── {testimony_id}/
│       ├── original.webm       ← Raw upload
│       ├── processed.mp4       ← Transcoded
│       └── thumbnail.jpg       ← Auto-generated
```

### Backend Integration Checklist

Execute in this order to respect foreign key dependencies:

**Phase 1: Supabase Setup**

- [ ] Create Supabase project
- [ ] Note project URL and anon key
- [ ] Note service role key (server-side only)

**Phase 2: Database Migration Order**

```
1. Create testimony_status ENUM type
2. Create profiles table (depends on auth.users)
3. Create testimonies table (depends on profiles)
4. Create indexes
5. Enable RLS on all tables
6. Create RLS policies
7. Create trigger functions
8. Create triggers
```

**Phase 3: Storage Setup**

- [ ] Create `testimonies` storage bucket
- [ ] Set bucket to public (for video serving)
- [ ] Create storage policies

**Phase 4: Frontend Integration Order**

1. **Auth first** (other stores depend on user state)
   - [x] Create `src/lib/supabase/client.ts`
   - [x] Create `src/lib/supabase/server.ts`
   - [x] Create `src/lib/supabase/middleware.ts`
   - [ ] Update `src/middleware.ts` for session refresh
   - [ ] Replace `auth-store.ts` → Supabase Auth

2. **Profiles second** (testimonies depend on profiles)
   - [x] Add `src/lib/supabase/types.ts` (Database types)
   - [x] Add `src/lib/supabase/helpers.ts` (transformers)
   - [ ] Add profile fetch/update functions
   - [ ] Connect to auth flow

3. **Stories last** (depends on auth + profiles)
   - [ ] Replace `testimony-store.ts` → Supabase queries
   - [ ] Implement video upload to Storage

### Supabase Client Utilities (Ready to Use)

Located in `apps/web/src/lib/supabase/`:

```typescript
// Browser client (client components)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server client (server components, route handlers)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Middleware client (Next.js middleware)
import { createClient } from '@/lib/supabase/middleware'
const { supabase, response } = createClient(request)

// Database types
import type { Database, Profile, Story } from '@/lib/supabase/types'

// Transformers (DB → App types)
import { transformProfile, transformStory } from '@/lib/supabase/helpers'
```

**Helper Functions**:

- `transformProfile(profile)` → User type with computed helpers
- `transformStory(story, author?)` → Story type with author preview
- `buildPagination(page, pageSize)` → { from, to } for Supabase range queries
- `getStorageUrl(bucket, path)` → Full public URL
- `getVideoPath(userId, storyId)` → Storage path for videos
- `getThumbnailPath(userId, storyId)` → Storage path for thumbnails

### TypeScript Interfaces (Already Defined)

Frontend types in `src/types/` match schema:

```typescript
// User (matches profiles table with computed helpers)
interface User {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  bio: string | null
  role: 'user' | 'creator' | 'admin'
  tier: 'free' | 'family' | 'legacy'
  tierExpiresAt: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  referralCode: string
  referredBy: string | null
  referralCredits: number
  totalReferrals: number
  language: string
  timezone: string | null
  createdAt: string
  updatedAt: string
  // Computed helpers
  isAdmin: boolean
  isCreator: boolean
  hasFamilyTier: boolean
  hasLegacyTier: boolean
}

// Story (matches stories table)
interface Story {
  id: string
  userId: string
  title: string
  description: string | null
  videoUrl: string
  thumbnailUrl: string | null
  duration: number | null
  category: StoryCategory
  tags: string[]
  language: string
  promptId: string | null
  status: 'pending' | 'approved' | 'rejected'
  visibility: 'public' | 'unlisted' | 'private' | 'family'
  familyVaultId: string | null
  viewCount: number
  likeCount: number
  shareCount: number
  has4k: boolean
  ipfsHash: string | null
  moderatedBy: string | null
  moderatedAt: string | null
  rejectionReason: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  author?: UserPreview
  isLiked?: boolean
}

// Story categories
type StoryCategory =
  | 'life_wisdom'
  | 'family_history'
  | 'transformation'
  | 'faith_journey'
  | 'final_messages'
  | 'milestones'
```

### Full SQL Schema

See [docs/BACKEND_SPEC.md](../docs/BACKEND_SPEC.md) for complete SQL migration scripts.
