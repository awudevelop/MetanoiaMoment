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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // TODO: Implement

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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

Creates a test file for a component or utility.

**Usage**: `/test button` or `/test auth-store`

**Creates**: `{path}/__tests__/{name}.test.tsx`

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

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `VideoPlayer` |
| Files | kebab-case | `video-player.tsx` |
| Stores | camelCase with `use` prefix | `useAuthStore` |
| API routes | kebab-case paths | `/api/testimonies` |
| Types | PascalCase | `TestimonyStatus` |

### File Locations

```
apps/web/src/
├── app/
│   ├── [locale]/     # Pages (use /page)
│   └── api/          # API routes (use /api)
├── components/
│   ├── animations/   # Animation components (use /animation)
│   ├── layout/       # Header, footer, mobile-nav
│   ├── pwa/          # PWA components (use /pwa)
│   └── seo/          # SEO components (use /seo)
├── hooks/            # Custom React hooks
├── lib/
│   ├── stores/       # Zustand stores (use /store)
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

| Animation | Description |
|-----------|-------------|
| `animate-fade-in-up` | Fade in from below |
| `animate-fade-in-down` | Fade in from above |
| `animate-fade-in-left` | Fade in from left |
| `animate-fade-in-right` | Fade in from right |
| `animate-scale-in` | Scale from 95% to 100% |
| `animate-scale-in-bounce` | Scale with bounce effect |
| `animate-slide-in-up` | Slide up from bottom |
| `animate-slide-in-down` | Slide down from top |
| `animate-slide-in-left` | Slide in from left |
| `animate-slide-in-right` | Slide in from right |
| `animate-wiggle` | Subtle wiggle effect |
| `animate-shimmer` | Loading shimmer effect |
| `animate-bounce-soft` | Gentle bounce |
| `animate-pulse-soft` | Gentle pulse |

---

## PWA Reference

### Platform Detection

The `usePWA` hook provides:

```tsx
const {
  isInstallable,      // Can show native install prompt
  isInstalled,        // Already installed as PWA
  isStandalone,       // Running in standalone mode
  platformInfo,       // { os, browser, isMobile, isTablet, ... }
  canShowInstallPrompt,
  install             // Trigger native install
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

| Child Table | Column | Parent Table | Parent Column | On Delete |
|-------------|--------|--------------|---------------|-----------|
| `profiles` | `id` | `auth.users` | `id` | CASCADE |
| `testimonies` | `user_id` | `profiles` | `id` | CASCADE |

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

| Trigger | Table | Event | Function |
|---------|-------|-------|----------|
| `profiles_updated_at` | profiles | BEFORE UPDATE | `update_updated_at()` |
| `testimonies_updated_at` | testimonies | BEFORE UPDATE | `update_updated_at()` |
| `on_auth_user_created` | auth.users | AFTER INSERT | `handle_new_user()` |

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
   - [ ] Create `src/lib/supabase/client.ts`
   - [ ] Create `src/lib/supabase/server.ts`
   - [ ] Update `src/middleware.ts` for session refresh
   - [ ] Replace `auth-store.ts` → Supabase Auth

2. **Profiles second** (testimonies depend on profiles)
   - [ ] Add profile fetch/update functions
   - [ ] Connect to auth flow

3. **Testimonies last** (depends on auth + profiles)
   - [ ] Replace `testimony-store.ts` → Supabase queries
   - [ ] Implement video upload to Storage

### TypeScript Interfaces (Already Defined)

Frontend types in `src/lib/stores/` already match schema:

```typescript
// Profile (matches profiles table)
interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  isAdmin: boolean
}

// Testimony (matches testimonies table)
interface Testimony {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: number
  language: string
  tags: string[]
  status: 'pending' | 'approved' | 'rejected'
  viewCount: number
  featured: boolean
  publishedAt?: string
  authorId: string
  authorName: string
  authorAvatar?: string
  createdAt: string
}
```

### Full SQL Schema

See [docs/BACKEND_SPEC.md](../docs/BACKEND_SPEC.md) for complete SQL migration scripts.
