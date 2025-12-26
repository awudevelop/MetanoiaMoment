# Backend Specification

This document outlines all backend requirements for Metanoia Moment. The frontend is built with stubs that can be replaced with real implementations following these specifications.

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Authentication](#authentication)
4. [File Storage](#file-storage)
5. [Webhooks](#webhooks)
6. [Video Processing](#video-processing)
7. [Implementation Phases](#implementation-phases)

---

## Database Schema

### Overview

The application uses PostgreSQL (recommended: Supabase) with the following core concepts:

- **Roles** (`user`, `creator`, `admin`) - Permission levels for platform access
- **Tiers** (`free`, `family`, `legacy`) - Subscription levels with feature limits

### Enums

```sql
-- User permission levels
CREATE TYPE user_role AS ENUM ('user', 'creator', 'admin');

-- Subscription tiers (independent of roles)
CREATE TYPE user_tier AS ENUM ('free', 'family', 'legacy');

-- Story categories
CREATE TYPE story_category AS ENUM (
  'life_wisdom',
  'family_history',
  'transformation',
  'faith_journey',
  'final_messages',
  'milestones'
);

-- Story moderation status
CREATE TYPE story_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');

-- Story visibility levels
CREATE TYPE story_visibility AS ENUM ('public', 'unlisted', 'private', 'family');

-- Family vault member roles
CREATE TYPE family_role AS ENUM ('owner', 'admin', 'member', 'viewer');

-- Referral progression
CREATE TYPE referral_status AS ENUM ('signed_up', 'recorded', 'upgraded_family', 'upgraded_legacy');
```

### Tables

#### `profiles`

Extends the authentication user. Created automatically on user signup.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Identity
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,

  -- Role & Permissions (what they can DO)
  role user_role DEFAULT 'user' NOT NULL,

  -- Subscription Tier (what features they GET)
  tier user_tier DEFAULT 'free' NOT NULL,
  tier_expires_at TIMESTAMPTZ,

  -- Stripe billing
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Referral system
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT REFERENCES profiles(referral_code),
  referral_credits INTEGER DEFAULT 0 NOT NULL,
  total_referrals INTEGER DEFAULT 0 NOT NULL,

  -- Preferences
  language TEXT DEFAULT 'en' NOT NULL,
  timezone TEXT
);

-- Indexes
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_role_idx ON profiles(role);
CREATE INDEX profiles_tier_idx ON profiles(tier);
CREATE INDEX profiles_referral_code_idx ON profiles(referral_code);
```

#### Role vs Tier Matrix

|            | User                            | Creator                                | Admin                |
| ---------- | ------------------------------- | -------------------------------------- | -------------------- |
| **Free**   | Browse, view, save favorites    | Record stories (10 min max)            | Full platform access |
| **Family** | + Family Vault access           | + 30 min videos, 4K, 10 family members | Full platform access |
| **Legacy** | + IPFS backup, unlimited family | + 60 min videos, all premium features  | Full platform access |

**Key distinction:**

- **Role** = What you can _do_ (permissions)
- **Tier** = What features you _get_ (subscription benefits)

A user with `role=user` and `tier=legacy` can access Family Vault and IPFS backup, but cannot record stories (that requires `creator` role).

A user with `role=creator` and `tier=free` can record stories but is limited to 10 minutes and 720p.

#### `stories` (formerly testimonies)

Stores all story metadata and references to video files.

```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- seconds

  -- Categorization
  category story_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'en' NOT NULL,
  prompt_id UUID REFERENCES prompts(id),

  -- Status & Visibility
  status story_status DEFAULT 'pending' NOT NULL,
  visibility story_visibility DEFAULT 'public' NOT NULL,

  -- Family vault (for tier=family or tier=legacy users)
  family_vault_id UUID REFERENCES family_vaults(id),

  -- Engagement
  view_count INTEGER DEFAULT 0 NOT NULL,
  like_count INTEGER DEFAULT 0 NOT NULL,
  share_count INTEGER DEFAULT 0 NOT NULL,

  -- Quality (tier-dependent)
  has_4k BOOLEAN DEFAULT FALSE NOT NULL,
  ipfs_hash TEXT, -- For legacy tier

  -- Moderation
  moderated_by UUID REFERENCES profiles(id),
  moderated_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Featured
  featured BOOLEAN DEFAULT FALSE NOT NULL,
  published_at TIMESTAMPTZ,

  -- Search optimization
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED
);

-- Indexes
CREATE INDEX stories_user_id_idx ON stories(user_id);
CREATE INDEX stories_status_idx ON stories(status);
CREATE INDEX stories_category_idx ON stories(category);
CREATE INDEX stories_visibility_idx ON stories(visibility);
CREATE INDEX stories_language_idx ON stories(language);
CREATE INDEX stories_featured_idx ON stories(featured) WHERE featured = TRUE;
CREATE INDEX stories_published_at_idx ON stories(published_at DESC NULLS LAST);
CREATE INDEX stories_search_idx ON stories USING GIN(search_vector);
CREATE INDEX stories_family_vault_idx ON stories(family_vault_id) WHERE family_vault_id IS NOT NULL;
```

#### `family_vaults`

Family vaults for tier=family and tier=legacy users.

```sql
CREATE TABLE family_vaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Memorial mode
  is_memorial BOOLEAN DEFAULT FALSE NOT NULL,
  memorial_for TEXT,
  memorial_date DATE,

  -- Settings
  allow_responses BOOLEAN DEFAULT TRUE NOT NULL,
  require_approval BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE INDEX family_vaults_owner_idx ON family_vaults(owner_id);
```

#### `family_members`

Members of family vaults with their own role hierarchy.

```sql
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id UUID REFERENCES family_vaults(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Family role (independent of user role!)
  role family_role DEFAULT 'member' NOT NULL,
  relationship TEXT, -- e.g., "Grandmother", "Uncle"

  -- Invitation
  invited_email TEXT,
  invited_by UUID REFERENCES profiles(id),
  invitation_token TEXT UNIQUE,
  invited_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  joined_at TIMESTAMPTZ,

  -- Preferences
  notify_new_stories BOOLEAN DEFAULT TRUE NOT NULL,
  notify_responses BOOLEAN DEFAULT TRUE NOT NULL,

  CONSTRAINT user_or_email CHECK (user_id IS NOT NULL OR invited_email IS NOT NULL)
);

CREATE INDEX family_members_vault_idx ON family_members(vault_id);
CREATE INDEX family_members_user_idx ON family_members(user_id);
CREATE INDEX family_members_invitation_idx ON family_members(invitation_token) WHERE invitation_token IS NOT NULL;
```

#### `prompts`

Recording prompts organized by category.

```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  category story_category NOT NULL,
  prompt_text JSONB NOT NULL, -- {"en": "...", "es": "..."}

  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  times_used INTEGER DEFAULT 0 NOT NULL
);

CREATE INDEX prompts_category_idx ON prompts(category);
CREATE INDEX prompts_active_idx ON prompts(is_active) WHERE is_active = TRUE;
```

#### `referrals`

Track referral relationships and rewards.

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  status referral_status DEFAULT 'signed_up' NOT NULL,

  -- Rewards
  reward_months INTEGER DEFAULT 0 NOT NULL,
  reward_cash_cents INTEGER DEFAULT 0 NOT NULL,
  reward_claimed BOOLEAN DEFAULT FALSE NOT NULL,
  reward_claimed_at TIMESTAMPTZ,

  UNIQUE(referrer_id, referred_id)
);

CREATE INDEX referrals_referrer_idx ON referrals(referrer_id);
CREATE INDEX referrals_referred_idx ON referrals(referred_id);
CREATE INDEX referrals_status_idx ON referrals(status);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Check if user is creator or admin
CREATE OR REPLACE FUNCTION is_creator_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('creator', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Check user tier
CREATE OR REPLACE FUNCTION get_user_tier()
RETURNS user_tier AS $$
  SELECT tier FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Anyone can read, users can update own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Stories: Approved/public visible to all, pending/rejected only to owner or admin
CREATE POLICY "stories_select" ON stories FOR SELECT
  USING (
    (status = 'approved' AND visibility = 'public')
    OR auth.uid() = user_id
    OR is_admin()
    -- Family visibility: user is member of the family vault
    OR (visibility = 'family' AND family_vault_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM family_members
      WHERE vault_id = stories.family_vault_id AND user_id = auth.uid()
    ))
  );

-- Only creators and admins can insert stories
CREATE POLICY "stories_insert" ON stories FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_creator_or_admin());

CREATE POLICY "stories_update" ON stories FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "stories_delete" ON stories FOR DELETE
  USING (is_admin());

-- Family Vaults: Owner can manage, members can view
CREATE POLICY "family_vaults_select" ON family_vaults FOR SELECT
  USING (
    owner_id = auth.uid()
    OR is_admin()
    OR EXISTS (
      SELECT 1 FROM family_members
      WHERE vault_id = family_vaults.id AND user_id = auth.uid()
    )
  );

-- Only users with family or legacy tier can create vaults
CREATE POLICY "family_vaults_insert" ON family_vaults FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id
    AND get_user_tier() IN ('family', 'legacy')
  );

CREATE POLICY "family_vaults_update" ON family_vaults FOR UPDATE
  USING (owner_id = auth.uid() OR is_admin());

CREATE POLICY "family_vaults_delete" ON family_vaults FOR DELETE
  USING (owner_id = auth.uid() OR is_admin());

-- Family Members: Vault owner/admin can manage
CREATE POLICY "family_members_select" ON family_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_admin()
    OR EXISTS (
      SELECT 1 FROM family_vaults
      WHERE id = family_members.vault_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "family_members_insert" ON family_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_vaults v
      WHERE v.id = vault_id
      AND (v.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM family_members fm
        WHERE fm.vault_id = v.id
        AND fm.user_id = auth.uid()
        AND fm.role IN ('owner', 'admin')
      ))
    )
  );

-- Prompts: Public read, admin write
CREATE POLICY "prompts_select" ON prompts FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "prompts_insert" ON prompts FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "prompts_update" ON prompts FOR UPDATE USING (is_admin());
CREATE POLICY "prompts_delete" ON prompts FOR DELETE USING (is_admin());

-- Referrals: Users can see their own
CREATE POLICY "referrals_select" ON referrals FOR SELECT
  USING (referrer_id = auth.uid() OR referred_id = auth.uid() OR is_admin());
```

### Triggers

```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER family_vaults_updated_at
  BEFORE UPDATE ON family_vaults
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup with referral code
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
BEGIN
  -- Generate unique referral code
  ref_code := 'REF' || UPPER(SUBSTRING(NEW.id::TEXT FROM 1 FOR 8));

  INSERT INTO profiles (id, email, full_name, referral_code, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    ref_code,
    NEW.raw_user_meta_data->>'referral_code'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Validate story duration based on tier
CREATE OR REPLACE FUNCTION validate_story_tier_limits()
RETURNS TRIGGER AS $$
DECLARE
  user_tier user_tier;
  max_duration INTEGER;
BEGIN
  SELECT tier INTO user_tier FROM profiles WHERE id = NEW.user_id;

  -- Set max duration based on tier
  max_duration := CASE user_tier
    WHEN 'free' THEN 600      -- 10 minutes
    WHEN 'family' THEN 1800   -- 30 minutes
    WHEN 'legacy' THEN 3600   -- 60 minutes
    ELSE 600
  END;

  IF NEW.duration > max_duration THEN
    RAISE EXCEPTION 'Video duration exceeds tier limit. Max % minutes allowed.', max_duration / 60;
  END IF;

  -- Set 4K based on tier
  IF user_tier = 'free' THEN
    NEW.has_4k := FALSE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stories_validate_tier
  BEFORE INSERT OR UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION validate_story_tier_limits();

-- Validate family vault member count based on tier
CREATE OR REPLACE FUNCTION validate_family_member_limit()
RETURNS TRIGGER AS $$
DECLARE
  owner_tier user_tier;
  member_count INTEGER;
  max_members INTEGER;
BEGIN
  -- Get vault owner's tier
  SELECT p.tier INTO owner_tier
  FROM family_vaults v
  JOIN profiles p ON p.id = v.owner_id
  WHERE v.id = NEW.vault_id;

  -- Set max members based on tier
  max_members := CASE owner_tier
    WHEN 'family' THEN 10
    WHEN 'legacy' THEN 999999  -- Effectively unlimited
    ELSE 0
  END;

  -- Count current members
  SELECT COUNT(*) INTO member_count
  FROM family_members
  WHERE vault_id = NEW.vault_id;

  IF member_count >= max_members THEN
    RAISE EXCEPTION 'Family vault member limit reached. Upgrade to add more members.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER family_members_validate_limit
  BEFORE INSERT ON family_members
  FOR EACH ROW EXECUTE FUNCTION validate_family_member_limit();
```

---

## API Endpoints

### Authentication

| Method | Endpoint                    | Description            | Auth Required |
| ------ | --------------------------- | ---------------------- | ------------- |
| POST   | `/api/auth/signup`          | Register new user      | No            |
| POST   | `/api/auth/signin`          | Sign in                | No            |
| POST   | `/api/auth/signout`         | Sign out               | Yes           |
| POST   | `/api/auth/forgot-password` | Request password reset | No            |
| POST   | `/api/auth/reset-password`  | Reset password         | No            |
| GET    | `/api/auth/me`              | Get current user       | Yes           |

### Testimonies

| Method | Endpoint                    | Description               | Auth Required |
| ------ | --------------------------- | ------------------------- | ------------- |
| GET    | `/api/testimonies`          | List approved testimonies | No            |
| GET    | `/api/testimonies/:id`      | Get single testimony      | No            |
| POST   | `/api/testimonies`          | Create new testimony      | Yes           |
| PATCH  | `/api/testimonies/:id`      | Update testimony          | Yes (owner)   |
| DELETE | `/api/testimonies/:id`      | Delete testimony          | Yes (admin)   |
| POST   | `/api/testimonies/:id/view` | Increment view count      | No            |

### Admin

| Method | Endpoint                             | Description              | Auth Required |
| ------ | ------------------------------------ | ------------------------ | ------------- |
| GET    | `/api/admin/testimonies/pending`     | List pending testimonies | Yes (admin)   |
| POST   | `/api/admin/testimonies/:id/approve` | Approve testimony        | Yes (admin)   |
| POST   | `/api/admin/testimonies/:id/reject`  | Reject testimony         | Yes (admin)   |
| GET    | `/api/admin/stats`                   | Get dashboard stats      | Yes (admin)   |

### Users

| Method | Endpoint                     | Description            | Auth Required |
| ------ | ---------------------------- | ---------------------- | ------------- |
| GET    | `/api/users/:id`             | Get user profile       | No            |
| PATCH  | `/api/users/:id`             | Update profile         | Yes (owner)   |
| GET    | `/api/users/:id/testimonies` | Get user's testimonies | No            |

### Request/Response Examples

#### GET `/api/testimonies`

Query Parameters:

- `page` (number, default: 1)
- `pageSize` (number, default: 12, max: 50)
- `language` (string, optional)
- `featured` (boolean, optional)
- `search` (string, optional)
- `sort` (string: "recent" | "popular" | "oldest")

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "From Addiction to Freedom",
      "description": "...",
      "videoUrl": "https://...",
      "thumbnailUrl": "https://...",
      "duration": 342,
      "language": "en",
      "tags": ["addiction", "freedom"],
      "viewCount": 1245,
      "publishedAt": "2024-06-15T12:00:00Z",
      "author": {
        "id": "uuid",
        "fullName": "Michael R.",
        "avatarUrl": null
      }
    }
  ],
  "total": 156,
  "page": 1,
  "pageSize": 12,
  "hasMore": true
}
```

#### POST `/api/testimonies`

Request (multipart/form-data):

```
title: "My Testimony"
description: "How Jesus changed my life..."
language: "en"
tags: "salvation,hope"
video: [File]
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "pending"
  }
}
```

---

## Authentication

### Recommended: Supabase Auth

Supabase provides built-in authentication with:

- Email/password signup
- Magic link (passwordless)
- OAuth providers (Google, Apple, etc.)
- Session management via JWT

### Implementation Notes

1. **JWT Tokens**: Store in HTTP-only cookies for security
2. **Session Refresh**: Use middleware to refresh sessions automatically
3. **Protected Routes**: Check auth in middleware, not individual pages
4. **Admin Verification**: Always verify admin status server-side

### Auth Flow

```
1. User signs up → Create auth.users record → Trigger creates profile
2. User signs in → JWT issued → Stored in cookie
3. Request made → Middleware validates JWT → Injects user into context
4. Protected action → Verify user.isAdmin if needed
```

---

## File Storage

### Video Storage

Recommended: Supabase Storage or S3-compatible

#### Bucket Structure

```
testimonies/
├── {user_id}/
│   ├── {testimony_id}/
│   │   ├── original.webm      # Original upload
│   │   ├── processed.mp4      # Transcoded version
│   │   └── thumbnail.jpg      # Auto-generated thumbnail
```

#### Upload Flow

1. Client records/selects video
2. Client requests signed upload URL
3. Client uploads directly to storage (avoids server memory issues)
4. Server receives webhook on upload complete
5. Video processing job triggered

#### Storage Policies

```sql
-- Public read for processed videos
CREATE POLICY "testimonies_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'testimonies');

-- Authenticated upload to own folder
CREATE POLICY "testimonies_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'testimonies' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## Webhooks

### Outgoing Webhooks (Events We Send)

Configure webhook endpoints in admin settings. Events are sent as POST requests with JSON payload.

#### Event Types

| Event                | Trigger                     | Payload                                       |
| -------------------- | --------------------------- | --------------------------------------------- |
| `testimony.created`  | New testimony submitted     | `{ testimonyId, userId, title }`              |
| `testimony.approved` | Testimony approved by admin | `{ testimonyId, userId, title, publishedAt }` |
| `testimony.rejected` | Testimony rejected          | `{ testimonyId, userId, reason }`             |
| `user.created`       | New user registered         | `{ userId, email }`                           |

#### Webhook Payload Structure

```json
{
  "id": "evt_uuid",
  "type": "testimony.approved",
  "timestamp": "2024-12-24T10:30:00Z",
  "data": {
    "testimonyId": "uuid",
    "userId": "uuid",
    "title": "My Testimony"
  }
}
```

#### Webhook Security

- Include signature header: `X-Webhook-Signature`
- Signature: `HMAC-SHA256(payload, webhook_secret)`
- Implement retry logic with exponential backoff

### Incoming Webhooks (Events We Receive)

#### Video Processing Complete

When using external video processing (e.g., Mux, Cloudflare Stream):

```json
POST /api/webhooks/video-processed
{
  "testimonyId": "uuid",
  "status": "complete",
  "outputs": {
    "mp4Url": "https://...",
    "thumbnailUrl": "https://...",
    "duration": 342
  }
}
```

---

## Video Processing

### Phase 1: Basic (No Processing)

Accept uploads directly, serve as-is. Works for MVP.

### Phase 2: Server-Side Processing

Use FFmpeg for:

- Transcoding to MP4 (H.264/AAC)
- Generating thumbnails
- Extracting duration

```bash
# Transcode to web-friendly MP4
ffmpeg -i input.webm -c:v libx264 -crf 23 -c:a aac output.mp4

# Generate thumbnail at 5 second mark
ffmpeg -i input.mp4 -ss 00:00:05 -vframes 1 thumbnail.jpg
```

### Phase 3: Cloud Processing (Recommended for Scale)

Options:

- **Mux**: Managed video platform with HLS streaming
- **Cloudflare Stream**: Good pricing, global CDN
- **AWS MediaConvert**: If already on AWS

Benefits:

- Automatic transcoding
- Adaptive bitrate streaming
- Global CDN delivery
- Thumbnail generation

---

## Implementation Phases

### Phase 1: MVP (Current - Frontend Complete)

- [x] Frontend pages with mock data
- [x] Stubbed authentication
- [x] Type definitions for all entities
- [ ] Deploy frontend to Vercel

### Phase 2: Core Backend

1. Set up Supabase project
2. Run database migrations
3. Configure authentication
4. Set up storage bucket
5. Replace stubs with Supabase calls

Files to update:

- `src/lib/stores/auth-store.ts` → Use `@supabase/ssr`
- `src/lib/stores/testimony-store.ts` → Use Supabase client
- Add `src/lib/supabase/client.ts` and `server.ts`
- Update middleware for session refresh

### Phase 3: Video Processing

1. Add basic FFmpeg processing (Node.js worker or Edge Function)
2. Implement thumbnail generation
3. Add duration extraction
4. Consider external service for scale

### Phase 4: Advanced Features

1. Webhook system for integrations
2. Email notifications
3. Social sharing optimization
4. Analytics tracking
5. Content moderation enhancements

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_SITE_URL=https://metanoiamoment.com

# Video Processing (Phase 3)
FFMPEG_PATH=/usr/bin/ffmpeg
# OR
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

# Webhooks (Phase 4)
WEBHOOK_SECRET=
```

---

## Security Considerations

1. **Never trust client data** - Validate all inputs server-side
2. **Use RLS** - Database-level security for multi-tenant data
3. **Rate limiting** - Protect against abuse (especially uploads)
4. **Content moderation** - Review all testimonies before publishing
5. **CORS** - Restrict to known domains
6. **Secrets** - Never expose service keys to client

---

## Monitoring & Observability

Recommended tools:

- **Vercel Analytics** - Frontend performance
- **Supabase Dashboard** - Database metrics
- **Sentry** - Error tracking
- **LogTail/Axiom** - Log aggregation
