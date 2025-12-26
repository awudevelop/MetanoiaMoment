# Metanoia Moment - Development Roadmap

## Vision

Build a global platform for preserving life's transformative moments across generations. From faith testimonies to family wisdom, every story of change has the power to inspire and endure.

> "Every life has a turning point worth sharing."

---

## Business Model: Generous Individual, Premium Family

### Core Philosophy

**Free for YOU. Premium for your FAMILY.**

Individual storytelling is completely free and high-quality. The paywall only appears when families want to collaborate and preserve stories together.

### Tier Structure

| Tier       | Price                      | Target User                   |
| ---------- | -------------------------- | ----------------------------- |
| **Free**   | $0                         | Individuals recording stories |
| **Family** | $9.99/mo or $79/yr         | Families preserving together  |
| **Legacy** | $199 one-time or $19.99/mo | Serious legacy preservation   |
| **Church** | Free - $99/mo              | Ministries & congregations    |

### Free Tier - "Your Story"

- Unlimited stories
- 10-minute videos
- Forever storage
- 720p HD quality
- Public, unlisted, or private links
- HD downloads (own videos)
- QR code generation
- Full prompt library

### Family Tier - "Your Legacy"

Everything in Free, plus:

- Family Vault (private archive)
- Up to 10 family contributors
- 4K video quality
- No branding watermark
- Family tree visualization
- Story responses (reply to family)
- Memorial mode
- Family notifications
- Download any family story

### Legacy Tier - "Generations"

Everything in Family, plus:

- Unlimited family members
- IPFS decentralized backup
- Annual USB drive mailed
- 1 hardcover book/year
- QR frame art printables
- Estate documentation
- Annual contact verification
- Phone support

### Church Tier - "Congregation"

| Size            | Price  | Stories/year |
| --------------- | ------ | ------------ |
| < 100 members   | Free   | 50           |
| 100-500 members | $29/mo | 200          |
| 500+ members    | $99/mo | Unlimited    |

---

## Revenue Projections

### Year 1 Target: $80K ARR

| Source                  | Estimate |
| ----------------------- | -------- |
| Family Tier (500 users) | $39,500  |
| Legacy Tier (100 users) | $19,900  |
| Legacy One-time (50)    | $9,950   |
| Book Sales (200)        | $5,800   |
| Church Tier (10 paying) | $5,880   |

### Year 2 Target: $400K ARR

5x growth through referral engine and church partnerships.

---

## Story Categories

Stories are organized by type, with faith naturally integrated:

| Category           | Description                             |
| ------------------ | --------------------------------------- |
| **Life Wisdom**    | Lessons learned, advice for descendants |
| **Family History** | Ancestry, traditions, heritage          |
| **Transformation** | Recovery, healing, change moments       |
| **Faith Journey**  | Spiritual testimony (opt-in tag)        |
| **Final Messages** | End-of-life, terminal illness           |
| **Milestones**     | Weddings, births, graduations           |

---

## Phase Overview

| Phase         | Focus                      | Status             |
| ------------- | -------------------------- | ------------------ |
| **Phase 1**   | Frontend Foundation        | **Complete**       |
| **Phase 1.5** | Frontend Enhancements      | **Complete**       |
| **Phase 2**   | Backend Integration        | **In Progress** 🔧 |
| **Phase 2.5** | Story Categories & Prompts | **Complete**       |
| **Phase 3**   | Monetization & Tiers       | Planned            |
| **Phase 4**   | Family Features            | Planned            |
| **Phase 5**   | Viral & Referral Engine    | Planned            |
| **Phase 6**   | Legacy & Preservation      | Planned            |
| **Phase 7**   | Scale & Resilience         | Planned            |

---

## Phase 1: Frontend Foundation ✅

**Status**: Complete

### Completed Tasks

- [x] **Project Structure**
  - Turborepo mono-repo with npm workspaces
  - Next.js 15 with App Router
  - TypeScript configuration
  - Tailwind CSS with custom design tokens

- [x] **UI Component Library** (`@metanoia/ui`)
  - Button, Card, Input, Textarea components
  - VideoPlayer with custom controls
  - VideoRecorder with webcam capture
  - TestimonyCard for archive display
  - LanguageSwitcher (8 languages)

- [x] **Pages**
  - Home (hero, featured, stats, CTA)
  - Testimonies archive with search/filter
  - Record page with 3-step flow
  - About, Support, Auth pages
  - Admin dashboard

- [x] **State Management**
  - Zustand stores for auth and testimonies
  - Mock data layer
  - TypeScript interfaces

- [x] **Internationalization**
  - next-intl with 8 locales
  - EN and ES translations
  - RTL support for Arabic

---

## Phase 1.5: Frontend Enhancements ✅

**Status**: Complete

### Completed Tasks

- [x] **Admin Dashboard** - Moderation, stats, user management
- [x] **SEO & Social Sharing** - JSON-LD, OG tags, dynamic images
- [x] **Animation Library** - 15+ CSS animations, no dependencies
- [x] **PWA** - Offline support, install prompts, service worker
- [x] **Accessibility** - Skip links, focus states, reduced motion
- [x] **Performance** - Font subsetting, bundle optimization
- [x] **Viral Sharing** - Social share, QR codes, embed generator
- [x] **Bot Protection** - reCAPTCHA, honeypot, rate limiting
- [x] **Multi-Portal System** - User/Creator/Admin roles

---

## Phase 2: Backend Integration

**Status**: In Progress (Foundation Complete)

### 2.1 Database Setup

- [ ] Create Supabase project
- [ ] Run schema migrations (see below)
- [ ] Configure RLS policies
- [ ] Set up video storage bucket
- [ ] Configure storage policies

### 2.2 Authentication (Frontend Ready)

- [x] Add `@supabase/ssr` package
- [x] Create Supabase client utilities (browser, server, middleware)
- [x] Create database types (`src/lib/supabase/types.ts`)
- [x] Create transformer helpers (`src/lib/supabase/helpers.ts`)
- [x] Update TypeScript types for User (tier, referrals, computed helpers)
- [x] Update TypeScript types for Story (category, visibility, 4K, IPFS)
- [ ] Replace auth-store with Supabase calls
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] OAuth providers (Google, Apple) - optional

### 2.3 Story CRUD

- [x] Update mock data with new Story schema (categories, visibility, etc.)
- [ ] Replace testimony-store with Supabase queries
- [ ] Video upload to Supabase Storage
- [ ] API routes for stories
- [ ] View count tracking

### 2.4 Admin Functions

- [ ] Server-side admin verification
- [ ] Moderation endpoints
- [ ] Admin stats queries

### Database Schema

```sql
-- Core users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user', -- 'user' | 'creator' | 'admin'
  tier TEXT DEFAULT 'free', -- 'free' | 'family' | 'legacy'
  tier_expires_at TIMESTAMP,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stories (renamed from testimonies for broader appeal)
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- seconds
  category TEXT DEFAULT 'life_wisdom',
  tags TEXT[],
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  visibility TEXT DEFAULT 'public', -- 'public' | 'unlisted' | 'private' | 'family'
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Story categories enum reference
-- 'life_wisdom' | 'family_history' | 'transformation' | 'faith_journey' | 'final_messages' | 'milestones'
```

### Success Criteria

- [ ] Users can register and sign in
- [ ] Users can upload video stories
- [ ] Admins can moderate content
- [ ] Approved stories appear publicly
- [ ] Data persists across sessions

---

## Phase 2.5: Story Categories & Prompts ✅

**Status**: Complete

### 2.5.1 Category System

- [x] Add story category selection to record flow (PrepareStep)
- [x] Category icons and descriptions (6 categories)
- [x] Browse page category filters
- [x] Category badges on testimony cards (TestimonyCard component)
- [x] Homepage "Browse by Category" section (CategoryBrowseClient)
- [x] Related testimonies prioritized by category (scoring algorithm)
- [ ] Category-specific landing pages (deferred)

### 2.5.2 Recording Prompts

- [x] Mock prompts data (18 prompts, 3 per category)
- [x] Prompts organized by category
- [x] Randomize/shuffle prompts ("Inspire Me" button)
- [x] User can select or skip prompts
- [x] Selected prompt shown in DetailsStep
- [x] i18n support (EN/ES)

### Prompt Examples by Category

**Life Wisdom:**

- "What's the best advice you ever received?"
- "What do you want your grandchildren to know?"
- "What mistake taught you the most?"

**Transformation:**

- "Describe the moment everything changed"
- "What helped you through your darkest time?"
- "Who or what saved your life?"

**Faith Journey:**

- "How did you come to faith?"
- "Describe a moment when God felt real"
- "What does your faith mean to you?"

**Final Messages:**

- "What do you want your family to remember?"
- "What brings you peace?"
- "What are you most grateful for?"

### 2.5.3 Prompt-Based Discovery

- [ ] Show prompts on story cards
- [ ] "Answer this prompt" CTA
- [ ] Related stories by prompt

### Success Criteria

- [ ] Users can browse and select prompts
- [ ] Each category has 10+ prompts
- [ ] Faith prompts are opt-in, not forced
- [ ] Prompts inspire meaningful content

---

## Phase 3: Monetization & Tiers

**Status**: Planned

### 3.1 Stripe Integration

- [ ] Stripe account setup
- [ ] Products and prices in Stripe
- [ ] Checkout session API
- [ ] Webhook handlers
- [ ] Customer portal

### 3.2 Tier System

- [ ] User tier field in database
- [ ] Tier expiration handling
- [ ] Feature gating logic
- [ ] Upgrade prompts (tasteful, not pushy)

### 3.3 Upgrade Triggers

Strategic moments to suggest upgrade:

| Trigger               | Message                                          |
| --------------------- | ------------------------------------------------ |
| 3+ family viewers     | "Your family loves your stories! Create a vault" |
| Memorial inquiry      | "Preserve their memory with Family tier"         |
| 4K request            | "Unlock stunning 4K quality"                     |
| Download family story | "Upgrade to download family stories"             |

### 3.4 Stripe Products

```javascript
const products = {
  family_monthly: { price: 999, interval: 'month' },
  family_yearly: { price: 7900, interval: 'year' },
  legacy_monthly: { price: 1999, interval: 'month' },
  legacy_onetime: { price: 19900 },
  book_standard: { price: 2900 },
  book_premium: { price: 5900 },
  usb_drive: { price: 1900 },
  church_small: { price: 2900, interval: 'month' },
  church_large: { price: 9900, interval: 'month' },
}
```

### Success Criteria

- [ ] Users can upgrade to paid tiers
- [ ] Subscriptions renew automatically
- [ ] Users can cancel/manage subscription
- [ ] Feature gating works correctly
- [ ] Upgrade prompts appear at right moments

---

## Phase 4: Family Features

**Status**: Planned

### 4.1 Family Vault

- [ ] Family vault creation
- [ ] Invite family members
- [ ] Accept/decline invitations
- [ ] Family vault dashboard
- [ ] Permission levels (owner, admin, member, viewer)

### 4.2 Family Invitations

Beautiful invitation emails:

> "Your grandmother Ruth recorded a special message for the family. Watch now."

- [ ] Email invitation system
- [ ] Invitation landing page
- [ ] Auto-create account on accept
- [ ] Track invitation status

### 4.3 Family Tree

- [ ] Visual family tree component
- [ ] Link stories to family members
- [ ] Relationship definitions
- [ ] Tree-based story browsing

### 4.4 Story Responses

- [ ] Record response to family story
- [ ] Response appears linked to original
- [ ] Notification: "Grandson replied to your story"
- [ ] Conversation threads

### 4.5 Memorial Mode

- [ ] Mark account as memorial
- [ ] Special memorial UI treatment
- [ ] Notify all family members
- [ ] Preserve account permanently
- [ ] "Record in their honor" prompt

### Database Schema

```sql
-- Family vaults
CREATE TABLE public.family_vaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id),
  is_memorial BOOLEAN DEFAULT FALSE,
  memorial_for TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Family members
CREATE TABLE public.family_members (
  vault_id UUID REFERENCES public.family_vaults(id),
  user_id UUID REFERENCES public.profiles(id),
  role TEXT DEFAULT 'member', -- 'owner' | 'admin' | 'member' | 'viewer'
  relationship TEXT, -- 'spouse' | 'child' | 'grandchild' | etc
  invited_by UUID REFERENCES public.profiles(id),
  invited_at TIMESTAMP DEFAULT NOW(),
  joined_at TIMESTAMP,
  PRIMARY KEY (vault_id, user_id)
);

-- Story responses
CREATE TABLE public.story_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES public.stories(id),
  responder_id UUID REFERENCES public.profiles(id),
  response_video_url TEXT,
  response_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Success Criteria

- [ ] Users can create family vaults
- [ ] Family members can be invited
- [ ] Family-only stories are protected
- [ ] Story responses work
- [ ] Memorial mode preserves accounts

---

## Phase 5: Viral & Referral Engine

**Status**: Planned

### 5.1 Referral System

- [ ] Unique referral codes per user
- [ ] Referral tracking
- [ ] Reward calculation
- [ ] Reward claiming

### Referral Rewards

| Action                    | Reward                |
| ------------------------- | --------------------- |
| Friend signs up           | 1 month Family credit |
| Friend records story      | +1 month credit       |
| Friend upgrades to Family | 3 months OR $10 cash  |
| Friend upgrades to Legacy | 6 months OR $25 cash  |

### 5.2 Affiliate Tiers

| Level           | Referrals | Benefits                            |
| --------------- | --------- | ----------------------------------- |
| Storyteller     | 0-4       | Standard rewards                    |
| Family Champion | 5-19      | 1.5x rewards + badge                |
| Legacy Builder  | 20-49     | 2x rewards + featured               |
| Ambassador      | 50+       | Free Legacy forever + 25% rev share |

### 5.3 Church Partnership Program

- [ ] Church signup flow
- [ ] Congregation management
- [ ] Bulk testimony collection
- [ ] Church-branded experience
- [ ] Member referral tracking

### 5.4 Viral Mechanics

- [ ] Beautiful share cards
- [ ] QR code generation
- [ ] Embed widgets
- [ ] "Family has X stories" social proof
- [ ] Milestone celebrations

### Database Schema

```sql
-- Referrals
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES public.profiles(id),
  referred_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'signed_up', -- 'signed_up' | 'recorded' | 'upgraded'
  reward_type TEXT,
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Referral rewards ledger
CREATE TABLE public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  reward_type TEXT, -- 'free_months' | 'cash'
  amount INTEGER, -- months or cents
  source_referral_id UUID REFERENCES public.referrals(id),
  claimed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Success Criteria

- [ ] Referral codes work
- [ ] Rewards calculated correctly
- [ ] Affiliate tiers unlock
- [ ] Churches can sign up and manage
- [ ] Viral sharing feels natural

---

## Phase 6: Legacy & Preservation

**Status**: Planned

### 6.1 IPFS Backup (Legacy Tier)

- [ ] IPFS integration (Web3.storage or similar)
- [ ] Automatic backup on upload
- [ ] IPFS hash stored in database
- [ ] Verification UI

### 6.2 Physical Products

- [ ] Book generation service
- [ ] USB drive fulfillment
- [ ] QR frame printables
- [ ] Order management
- [ ] Shipping integration

### 6.3 Estate Planning

- [ ] Digital asset documentation
- [ ] Beneficiary designation
- [ ] Annual contact verification
- [ ] Account transfer on death

### 6.4 Long-term Preservation

- [ ] Cold storage for old videos
- [ ] Format migration planning
- [ ] Redundant backups
- [ ] "100-year plan" documentation

### Success Criteria

- [ ] IPFS backup works
- [ ] Books can be ordered and shipped
- [ ] Estate features documented
- [ ] Stories can survive platform changes

---

## Phase 7: Scale & Resilience

**Status**: Planned

### 7.1 Video Processing

- [ ] FFmpeg serverless function
- [ ] Transcode to web-friendly format
- [ ] Generate thumbnails
- [ ] Multiple quality levels (720p free, 4K paid)
- [ ] Chunked uploads

### 7.2 Performance

- [ ] Edge caching (Cloudflare)
- [ ] Database optimization
- [ ] Lazy loading
- [ ] Core Web Vitals > 90

### 7.3 Reliability

- [ ] Error monitoring (Sentry)
- [ ] Uptime monitoring
- [ ] Automated backups
- [ ] Disaster recovery plan

### 7.4 Anti-Censorship

- [ ] IPFS backup (Legacy tier)
- [ ] Mirror deployments
- [ ] Decentralized storage evaluation
- [ ] Alternative distribution

### Success Criteria

- [ ] Videos process automatically
- [ ] Lighthouse > 90 all categories
- [ ] 99.9% uptime
- [ ] Content survives censorship

---

## Technical Debt & Improvements

### Code Quality

- [x] Unit tests for stores (89 tests)
- [x] Component tests for UI (48 tests)
- [ ] E2E tests with Playwright
- [x] CI/CD pipeline (GitHub Actions)
- [x] Pre-commit hooks (husky)

### Documentation

- [ ] API documentation (OpenAPI)
- [ ] Component Storybook
- [ ] Contribution guidelines
- [ ] Business model documentation

### Testing Infrastructure

**Framework**: Vitest + React Testing Library

```bash
npm test              # Watch mode
npm run test:run      # CI mode
npm run test:coverage # Coverage
```

---

## Milestone Definitions

### MVP (Phase 2 complete)

- User authentication
- Video upload & storage
- Basic moderation
- Public story viewing

### Beta (Phase 3-4 complete)

- Monetization working
- Family vaults functional
- Story categories live
- Referral system active

### 1.0 Release (Phase 5 complete)

- Viral engine running
- Church partnerships
- All tiers available
- Stable & performant

### 2.0 Release (Phase 6-7 complete)

- Legacy preservation
- Physical products
- Multi-host deployment
- Long-term sustainability

---

## Decision Log

| Date    | Decision                              | Rationale                               |
| ------- | ------------------------------------- | --------------------------------------- |
| 2024-12 | Frontend-first approach               | Validate UX before backend              |
| 2024-12 | Zustand for state                     | Lightweight, Next.js friendly           |
| 2024-12 | Supabase for backend                  | Auth + DB + Storage in one              |
| 2024-12 | next-intl for i18n                    | Best App Router support                 |
| 2024-12 | CSS animations                        | Smaller bundle, no dependencies         |
| 2024-12 | Custom service worker                 | Full control over caching               |
| 2024-12 | Multi-portal system                   | Separate user experiences               |
| 2024-12 | "Generous Individual, Premium Family" | Maximize adoption, monetize families    |
| 2024-12 | Story categories (not just faith)     | Broader appeal, organic faith discovery |
| 2024-12 | Referral rewards (cash + credits)     | Incentivize viral growth                |
| 2024-12 | Church tier (free for small)          | Ministry partnership, B2B2C             |
| 2024-12 | IPFS for Legacy tier                  | Censorship resistance, permanence       |

---

## Competitive Positioning

| Feature          | StoryWorth | Remento | StoryFile | MetanoiaMoment |
| ---------------- | ---------- | ------- | --------- | -------------- |
| Video-first      | No         | Yes     | Yes       | **Yes**        |
| Free tier        | No ($99)   | No      | No        | **Unlimited**  |
| Faith community  | No         | No      | No        | **Yes**        |
| IPFS backup      | No         | No      | No        | **Yes**        |
| Family vault     | No         | Partial | No        | **Yes**        |
| Church tier      | No         | No      | No        | **Yes**        |
| Referral rewards | No         | No      | No        | **Yes**        |
| Printed books    | Yes        | Yes     | No        | **Yes**        |

---

## Resources

- [Backend Specification](./BACKEND_SPEC.md)
- [Skills Documentation](../.claude/skills.md)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Stripe Docs](https://stripe.com/docs)
- [IPFS/Web3.storage](https://web3.storage/docs/)
