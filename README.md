# Metanoia Moment

**Capture Your Metanoia — Echoes for Eternity**

A global, censorship-resistant platform for sharing faith testimonies via video. Built to preserve stories of transformation through Jesus Christ for generations to come.

## Current Status: Phase 1.5 (Frontend Enhancements Complete)

The frontend is fully functional with stubbed backend, enhanced with PWA support, animations, and SEO optimization. Ready for global deployment with platform-specific install experiences.

## Tech Stack

- **Monorepo**: Turborepo with pnpm workspaces
- **Frontend**: Next.js 15 (App Router) with React 19
- **Styling**: Tailwind CSS with faith-inspired design tokens
- **State**: Zustand (local stores, ready for backend integration)
- **Internationalization**: next-intl (8 languages supported)
- **UI Components**: Custom shared library (`@metanoia/ui`)
- **PWA**: Service worker, offline support, installable
- **Animations**: CSS-based with Intersection Observer
- **SEO**: JSON-LD structured data, Open Graph, Twitter cards

**Backend (Phase 2)**:
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- Storage: Supabase Storage
- Video Processing: FFmpeg / Cloud service

## Project Structure

```
metanoia-moment/
├── apps/
│   └── web/                     # Next.js application
│       ├── public/
│       │   ├── manifest.json    # PWA manifest
│       │   └── sw.js            # Service worker
│       ├── src/
│       │   ├── app/[locale]/    # Internationalized pages
│       │   ├── components/
│       │   │   ├── animations/  # Animation components
│       │   │   ├── layout/      # Header, footer, nav
│       │   │   ├── pwa/         # Install prompt, offline indicator
│       │   │   └── seo/         # JSON-LD structured data
│       │   ├── hooks/           # Custom hooks (use-pwa, etc.)
│       │   ├── i18n/            # i18n configuration
│       │   ├── lib/
│       │   │   ├── stores/      # Zustand stores
│       │   │   ├── animations.ts
│       │   │   ├── seo.ts
│       │   │   └── mock-data.ts
│       │   └── types/           # TypeScript interfaces
│       └── messages/            # Translation files (en, es)
├── packages/
│   └── ui/                      # Shared UI components
├── docs/
│   ├── BACKEND_SPEC.md          # Backend specification
│   └── ROADMAP.md               # Development roadmap
└── supabase/
    └── schema.sql               # Database schema (for Phase 2)
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
cd MetanoiaMoment_2.0
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Mode

The app runs with mock data. Use the demo sign-in buttons:
- **Demo User**: Regular user experience
- **Admin User**: Access admin dashboard at `/admin`

## Features

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured testimonies, stats, CTA |
| Testimonies | `/testimonies` | Searchable testimony archive |
| Record | `/record` | Video recording/upload flow |
| About | `/about` | Mission, meaning, vision |
| Support | `/support` | Donation page |
| Sign In | `/auth/signin` | Authentication |
| Sign Up | `/auth/signup` | Registration |
| Admin | `/admin` | Testimony moderation (admin only) |

### UI Components (`@metanoia/ui`)

- `Button` - Primary, secondary, outline, ghost variants
- `Card` - Content containers
- `Input` / `Textarea` - Form inputs with labels
- `VideoPlayer` - Custom video player with controls
- `VideoRecorder` - Webcam recording with preview
- `TestimonyCard` - Testimony preview cards
- `LanguageSwitcher` - 8-language selector
- `ToastProvider` - Toast notifications

### Animation Components

- `AnimateOnScroll` - Intersection Observer triggered animations
- `StaggerChildren` - Sequential child animations
- `AnimatedCard` / `AnimatedButton` - Interactive hover effects
- `CountUp` - Animated number counter
- `TypeWriter` - Typing effect
- `Skeleton` - Loading placeholders

### PWA Components

- `InstallPrompt` - Platform-specific install instructions
- `UpdatePrompt` - Service worker update notification
- `OfflineIndicator` - Network status indicator

### Internationalization

Supported languages:
- English (en)
- Spanish (es)
- French (fr)
- Portuguese (pt)
- Chinese (zh)
- Arabic (ar) - RTL support
- Hindi (hi)
- Russian (ru)

Add languages by creating `messages/{locale}.json`.

## Implementation Phases

### Phase 1: Frontend Foundation (Complete)
- [x] All pages built with responsive design
- [x] Stubbed authentication with Zustand
- [x] Mock data layer
- [x] Video recording component
- [x] Admin dashboard
- [x] Multilingual support (8 languages)

### Phase 1.5: Frontend Enhancements (Complete)
- [x] PWA with service worker and offline support
- [x] Platform-specific install prompts (iOS, Android, Desktop)
- [x] CSS-based animation library
- [x] Scroll-triggered animations
- [x] Loading skeletons
- [x] SEO with JSON-LD structured data
- [x] Open Graph and Twitter cards
- [x] Localized PWA prompts

### Phase 2: Backend Integration (Next)
- [ ] Set up Supabase project
- [ ] Run database migrations
- [ ] Replace auth store with Supabase Auth
- [ ] Replace testimony store with Supabase calls
- [ ] Configure storage for video uploads

### Phase 3: Video Processing
- [ ] FFmpeg transcoding
- [ ] Thumbnail generation
- [ ] Duration extraction
- [ ] Consider cloud processing (Mux, Cloudflare Stream)

### Phase 4: Production Features
- [ ] Webhook integrations
- [ ] Email notifications
- [ ] Analytics
- [ ] Content moderation tools

## Backend Documentation

See [docs/BACKEND_SPEC.md](docs/BACKEND_SPEC.md) for:
- Complete database schema with SQL
- API endpoint specifications
- Authentication flow
- File storage structure
- Webhook events
- Video processing options

## Deployment

### Frontend (Vercel)

```bash
# Connect to Vercel
vercel

# Environment variables needed for Phase 2:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Anti-Censorship Hosting

For resilience, mirror on:
- **IncogNET** (US, privacy-focused)
- **1984 Hosting** (Iceland)
- **Shinjiru** (DMCA-ignored)

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary (Gold) | `#ed7412` | CTAs, highlights, divine light |
| Secondary (Earth) | `#988862` | Stability, grounding |
| Accent (Green) | `#4d9653` | Success, new life, growth |
| Warm (Neutral) | `#fafaf8` - `#2d2a24` | Backgrounds, text |

### Typography

- **Display**: Playfair Display (headings)
- **Serif**: Lora (quotes, emphasis)
- **Sans**: Inter (body text)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - Build freely for His glory.

---

*"Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come."* — 2 Corinthians 5:17
