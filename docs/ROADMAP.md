# Metanoia Moment - Development Roadmap

## Vision

Build a global, censorship-resistant platform for sharing faith testimonies that will stand for generations.

---

## Phase Overview

| Phase | Focus | Status |
|-------|-------|--------|
| **Phase 1** | Frontend Foundation | **Complete** |
| **Phase 1.5** | Frontend Enhancements | **Complete** |
| **Phase 2** | Backend Integration | Ready to Start |
| **Phase 3** | Video Processing | Planned |
| **Phase 4** | Production Features | Planned |
| **Phase 5** | Scale & Resilience | Planned |

---

## Phase 1: Frontend Foundation ✅

**Status**: Complete

### Completed Tasks

- [x] **Project Structure**
  - Turborepo mono-repo with pnpm workspaces
  - Next.js 15 with App Router
  - TypeScript configuration
  - Tailwind CSS with custom design tokens

- [x] **UI Component Library** (`@metanoia/ui`)
  - Button (primary, secondary, outline, ghost, link variants)
  - Card (header, content, footer, title, description)
  - Input & Textarea with labels and error states
  - VideoPlayer with custom controls
  - VideoRecorder with webcam capture
  - TestimonyCard for archive display
  - LanguageSwitcher (8 languages)

- [x] **Pages**
  - Home (hero, featured testimonies, stats, CTA)
  - Testimonies archive with search/filter UI
  - Record page with 3-step flow
  - About (mission, meaning, vision)
  - Support/Donate page
  - Authentication (sign in, sign up)
  - Admin dashboard

- [x] **State Management**
  - Zustand stores for auth and testimonies
  - Mock data layer with realistic content
  - TypeScript interfaces for all entities

- [x] **Internationalization**
  - next-intl with 8 locales
  - EN and ES translations complete
  - RTL support for Arabic

- [x] **Documentation**
  - Backend specification (database, API, webhooks)
  - Project README with quick start
  - Skills documentation

### Deliverables

```
apps/web/           # Fully functional frontend
packages/ui/        # Reusable component library
docs/               # Technical documentation
```

---

## Phase 1.5: Frontend Enhancements ✅

**Status**: Complete

### Completed Tasks

- [x] **Admin Dashboard** (`/admin`)
  - Testimony moderation with approve/reject/flag actions
  - Statistics cards (total, pending, approved, views)
  - User management interface
  - Settings panel
  - Responsive table with mobile-friendly cards

- [x] **SEO & Social Sharing**
  - JSON-LD structured data (Organization, Website schemas)
  - Open Graph meta tags for all pages
  - Twitter card support
  - Dynamic OG image generation
  - Sitemap and robots.txt ready

- [x] **Animation & Micro-interactions**
  - CSS-based animation library (no Framer Motion dependency)
  - 15+ custom animations: fade-in, slide-in, scale, bounce, shimmer, confetti
  - `AnimateOnScroll` component with Intersection Observer
  - `StaggerChildren` for sequential animations
  - Loading skeletons for all content types
  - Interactive components: AnimatedCard, AnimatedButton, CountUp, TypeWriter
  - Celebration/Confetti component for success moments
  - Tailwind animation utilities in config

- [x] **PWA (Progressive Web App)**
  - Web app manifest with icons and shortcuts
  - Service worker with intelligent caching strategies
  - Offline page with localized content
  - Install prompt with platform-specific instructions
  - Update notification prompt
  - Offline/online status indicator
  - Background sync ready for offline submissions

- [x] **Global Platform Support**
  - Comprehensive platform detection (iOS, Android, Windows, macOS, Linux)
  - Browser detection (Safari, Chrome, Firefox, Edge, Samsung)
  - Platform-specific PWA install instructions
  - Localized PWA prompts (EN, ES)
  - Service worker locale detection

- [x] **Accessibility**
  - Skip to main content link
  - Focus visible states with ring indicator
  - Reduced motion support (CSS + JS)
  - ARIA live regions for dynamic announcements
  - Screen reader friendly component structure

- [x] **Performance Optimization**
  - Font subsetting for non-Latin scripts (Cyrillic, Greek, Vietnamese, Latin-ext)
  - System font fallbacks for CJK, Arabic, and Devanagari scripts
  - Bundle analyzer integration (`npm run analyze`)
  - Next.js optimizePackageImports for tree-shaking
  - Modern image formats (AVIF, WebP) enabled
  - CSS minification with cssnano in production
  - Route-level loading.tsx for instant feedback
  - Font display swap and preload

- [x] **Viral Sharing & Engagement (NEW)**
  - SocialShare component (Facebook, Twitter, WhatsApp, Email)
  - QR code generation for testimonies
  - ShareModal for full sharing experience
  - Share buttons on testimony cards (hover to reveal)
  - Embed code generator for testimony pages
  - Copy-to-clipboard functionality

- [x] **Security & Bot Protection (NEW)**
  - reCAPTCHA v3 integration (configurable via env)
  - Honeypot fields for catching bots
  - Client-side rate limiting
  - useBotProtection hook for forms
  - Protected signin/signup forms

- [x] **User Experience Polish (NEW)**
  - Record page auth check (must sign in first)
  - "Recently Shared" live activity feed on home page
  - Confetti celebration on testimony submission
  - Password reset flow
  - User account/profile page
  - My Testimonies page
  - Custom 404 page with inspirational message
  - Fixed dead links on Support page

### New Components

```
src/components/animations/
├── animate-on-scroll.tsx    # Scroll-triggered animations + reduced motion
├── skeleton.tsx             # Loading skeletons
├── interactive.tsx          # AnimatedCard, CountUp, TypeWriter
├── confetti.tsx             # Celebration confetti component
└── index.ts

src/components/sharing/
├── social-share.tsx         # SocialShare, QuickShareButton, ShareModal
└── index.ts

src/components/pwa/
├── install-prompt.tsx       # Smart install banner
├── update-prompt.tsx        # Update notification
├── offline-indicator.tsx    # Online/offline status
└── index.ts

src/components/seo/
└── json-ld.tsx              # Structured data component

src/components/accessibility/
├── skip-link.tsx            # Skip to main content
├── live-region.tsx          # ARIA live announcements
└── index.ts

src/lib/
├── animations.ts            # Animation utilities
└── seo.ts                   # SEO helper functions

src/lib/hooks/
├── use-pwa.ts               # PWA hook with platform detection
├── use-form-validation.ts   # Form validation hook
└── use-recaptcha.ts         # Bot protection hook

src/app/[locale]/
├── account/page.tsx         # User profile page
├── account/testimonies/page.tsx  # My testimonies
├── auth/forgot-password/page.tsx # Password reset
├── not-found.tsx            # Custom 404 page
├── featured-testimonies-client.tsx
└── recently-shared-client.tsx

public/
├── manifest.json           # PWA manifest
└── sw.js                   # Service worker
```

### Deliverables

```
apps/web/src/components/animations/      # Animation component library
apps/web/src/components/pwa/             # PWA components
apps/web/src/components/seo/             # SEO components
apps/web/src/components/accessibility/   # Accessibility components
apps/web/public/manifest.json            # PWA manifest
apps/web/public/sw.js                    # Service worker
apps/web/src/app/globals.css             # Focus/reduced motion styles
```

---

## Phase 2: Backend Integration

**Status**: Ready to Start

### Prerequisites

- [ ] Create Supabase account and project
- [ ] Configure environment variables
- [ ] Run database migrations

### Tasks

#### 2.1 Database Setup
- [ ] Create Supabase project
- [ ] Run `supabase/schema.sql` migrations
- [ ] Verify RLS policies
- [ ] Set up storage bucket for videos
- [ ] Configure storage policies

#### 2.2 Authentication
- [ ] Add `@supabase/ssr` package
- [ ] Create `src/lib/supabase/client.ts`
- [ ] Create `src/lib/supabase/server.ts`
- [ ] Update middleware for session refresh
- [ ] Replace `auth-store.ts` with Supabase calls
- [ ] Add OAuth providers (Google, Apple) - optional
- [ ] Email verification flow
- [ ] Password reset flow

#### 2.3 Testimony CRUD
- [ ] Replace `testimony-store.ts` with Supabase queries
- [ ] Implement video upload to Supabase Storage
- [ ] Create API routes for:
  - `GET /api/testimonies` (with pagination)
  - `GET /api/testimonies/[id]`
  - `POST /api/testimonies`
  - `PATCH /api/testimonies/[id]`
  - `DELETE /api/testimonies/[id]`
- [ ] View count increment endpoint

#### 2.4 Admin Functions
- [ ] Server-side admin verification
- [ ] Approve/reject endpoints
- [ ] Admin stats dashboard data
- [ ] Audit logging (optional)

### Success Criteria

- [ ] Users can register and sign in
- [ ] Users can upload video testimonies
- [ ] Admins can approve/reject testimonies
- [ ] Approved testimonies appear in public archive
- [ ] Data persists across sessions

---

## Phase 3: Video Processing

**Status**: Planned

### Tasks

#### 3.1 Basic Processing (FFmpeg)
- [ ] Set up FFmpeg in serverless function or worker
- [ ] Transcode uploads to MP4 (H.264/AAC)
- [ ] Generate thumbnail at 5-second mark
- [ ] Extract video duration
- [ ] Update testimony record with metadata

#### 3.2 Storage Optimization
- [ ] Implement chunked uploads for large files
- [ ] Add upload progress indicators
- [ ] Compress videos for web delivery
- [ ] Generate multiple quality levels (optional)

#### 3.3 Cloud Processing (Optional - for scale)
- [ ] Evaluate Mux vs Cloudflare Stream vs AWS MediaConvert
- [ ] Implement webhook handlers for processing status
- [ ] Add HLS streaming support
- [ ] CDN integration for global delivery

### Success Criteria

- [ ] All videos transcoded to web-friendly format
- [ ] Thumbnails auto-generated
- [ ] Duration displayed on cards
- [ ] Large files upload reliably

---

## Phase 4: Production Features

**Status**: Planned

### Tasks

#### 4.1 User Experience
- [ ] Email notifications (welcome, testimony approved)
- [x] User profile pages *(moved to Phase 1.5)*
- [x] "My Testimonies" dashboard *(moved to Phase 1.5)*
- [x] Share buttons (copy link, social media) *(moved to Phase 1.5)*
- [x] Embed code generator *(moved to Phase 1.5)*

#### 4.2 Content Management
- [ ] Featured testimonies curation
- [ ] Tag/category management
- [ ] Content moderation queue improvements
- [ ] Bulk actions for admins
- [ ] Reporting/flagging system

#### 4.3 Discovery
- [ ] Full-text search implementation
- [ ] Filter by language, tags, date
- [ ] Related testimonies suggestions
- [ ] Popular/trending algorithm

#### 4.4 Analytics
- [ ] View tracking
- [ ] Play/completion metrics
- [ ] Geographic distribution
- [ ] Admin analytics dashboard

#### 4.5 Donations
- [ ] Stripe integration
- [ ] Recurring donation support
- [ ] Donation receipt emails
- [ ] Donor management

### Success Criteria

- [ ] Users receive email notifications
- [ ] Search returns relevant results
- [ ] Analytics dashboard shows engagement
- [ ] Donations can be processed

---

## Phase 5: Scale & Resilience

**Status**: Planned

### Tasks

#### 5.1 Performance
- [ ] Image/video optimization
- [ ] Edge caching strategy
- [ ] Database query optimization
- [ ] Lazy loading improvements
- [ ] Core Web Vitals optimization

#### 5.2 Anti-Censorship
- [ ] IPFS video backup integration
- [ ] Mirror deployment to IncogNET/1984 Hosting
- [ ] Decentralized storage evaluation (Filecoin, Arweave)
- [ ] Alternative distribution (Odysee, Bitchute push)

#### 5.3 Reliability
- [ ] Error monitoring (Sentry)
- [ ] Uptime monitoring
- [ ] Automated backups
- [ ] Disaster recovery plan
- [ ] Rate limiting

#### 5.4 Accessibility
- [ ] WCAG 2.1 AA compliance audit
- [ ] Screen reader testing
- [ ] Keyboard navigation improvements
- [ ] Color contrast verification
- [ ] Captioning support for videos
- [ ] Focus management for modals
- [ ] ARIA labels audit

### Success Criteria

- [ ] Lighthouse score > 90 all categories
- [ ] Content accessible from multiple hosts
- [ ] 99.9% uptime target
- [ ] Accessibility audit passed
- [ ] PWA installable on all major platforms

---

## Technical Debt & Improvements

### Known Issues
- [ ] Video player needs keyboard controls
- [ ] Form validation messages need i18n
- [ ] PWA icons need to be generated (currently placeholders)
- [ ] Splash screens for iOS need creation

### Code Quality
- [ ] Add unit tests for stores
- [ ] Add component tests for UI library
- [ ] Add E2E tests with Playwright
- [ ] Set up CI/CD pipeline
- [ ] Add pre-commit hooks (lint, format)
- [ ] Add typecheck script to package.json

### Documentation
- [ ] Component Storybook
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Contribution guidelines
- [ ] Code of conduct
- [ ] Animation component usage guide
- [ ] PWA setup guide for contributors

### Performance Optimization (Phase 1.5 complete)
- [x] CSS-level reduced motion support
- [ ] Image optimization with next/image (deferred to Phase 2 - needs real images)
- [x] Font subsetting for non-Latin scripts (Inter, Lora, Playfair with extended subsets)
- [x] Critical CSS extraction (cssnano, loading.tsx, Next.js auto-optimization)
- [x] Bundle analysis and optimization (bundle-analyzer, optimizePackageImports, image formats)

### Accessibility (Phase 1.5 complete)
- [x] Skip to main content link
- [x] Focus visible states for all interactive elements
- [x] Reduced motion support for animations
- [x] ARIA live regions for dynamic content (LiveRegionProvider)
- [x] Keyboard-accessible focus ring (global CSS)

---

## Milestone Definitions

### MVP (Minimum Viable Product)
Phase 2 complete:
- User authentication working
- Video upload and storage functional
- Admin can moderate content
- Public can view approved testimonies

### Beta
Phase 3 + partial Phase 4:
- Video processing automated
- Email notifications active
- Basic search working
- Analytics tracking

### 1.0 Release
Phase 4 complete:
- All user-facing features polished
- Donation system operational
- Comprehensive admin tools
- Performance optimized

### 2.0 Release
Phase 5 complete:
- Multi-host deployment
- Decentralized backup
- Full accessibility compliance
- Scaled for global traffic

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2024-12 | Frontend-first approach | Validate UX before backend investment |
| 2024-12 | Zustand for state | Lightweight, works well with Next.js |
| 2024-12 | Supabase for backend | Auth + DB + Storage in one, good free tier |
| 2024-12 | next-intl for i18n | Best App Router support, type-safe |
| 2024-12 | CSS animations over Framer Motion | Smaller bundle, better performance, no dependencies |
| 2024-12 | Custom service worker | Full control over caching, offline strategy |
| 2024-12 | Platform-specific PWA instructions | Better UX for global audience, handles browser differences |
| 2024-12 | Locale-aware offline pages | Consistent i18n experience even when offline |
| 2024-12 | reCAPTCHA v3 + honeypot + rate limiting | Multi-layer bot protection without friction |
| 2024-12 | Pull forward UX features to Phase 1.5 | Viral sharing and engagement crucial for adoption |

---

## Resources

- [Backend Specification](./BACKEND_SPEC.md)
- [Skills Documentation](../.claude/skills.md)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
