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

The application requires two primary tables with support for PostgreSQL (recommended: Supabase).

### Tables

#### `profiles`

Extends the authentication user. Created automatically on user signup.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL
);

-- Indexes
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_is_admin_idx ON profiles(is_admin) WHERE is_admin = TRUE;
```

#### `testimonies`

Stores all testimony metadata and references to video files.

```sql
CREATE TYPE testimony_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE testimonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- seconds

  -- Metadata
  language TEXT DEFAULT 'en' NOT NULL,
  tags TEXT[] DEFAULT '{}',

  -- Status
  status testimony_status DEFAULT 'pending' NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  featured BOOLEAN DEFAULT FALSE NOT NULL,
  published_at TIMESTAMPTZ,

  -- Search optimization
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED
);

-- Indexes
CREATE INDEX testimonies_user_id_idx ON testimonies(user_id);
CREATE INDEX testimonies_status_idx ON testimonies(status);
CREATE INDEX testimonies_language_idx ON testimonies(language);
CREATE INDEX testimonies_featured_idx ON testimonies(featured) WHERE featured = TRUE;
CREATE INDEX testimonies_published_at_idx ON testimonies(published_at DESC NULLS LAST);
CREATE INDEX testimonies_search_idx ON testimonies USING GIN(search_vector);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read, users can update own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Testimonies: Approved visible to all, pending/rejected only to owner
CREATE POLICY "testimonies_select" ON testimonies FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "testimonies_insert" ON testimonies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "testimonies_update" ON testimonies FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "testimonies_delete" ON testimonies FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
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

CREATE TRIGGER testimonies_updated_at
  BEFORE UPDATE ON testimonies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/signin` | Sign in | No |
| POST | `/api/auth/signout` | Sign out | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Testimonies

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/testimonies` | List approved testimonies | No |
| GET | `/api/testimonies/:id` | Get single testimony | No |
| POST | `/api/testimonies` | Create new testimony | Yes |
| PATCH | `/api/testimonies/:id` | Update testimony | Yes (owner) |
| DELETE | `/api/testimonies/:id` | Delete testimony | Yes (admin) |
| POST | `/api/testimonies/:id/view` | Increment view count | No |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/testimonies/pending` | List pending testimonies | Yes (admin) |
| POST | `/api/admin/testimonies/:id/approve` | Approve testimony | Yes (admin) |
| POST | `/api/admin/testimonies/:id/reject` | Reject testimony | Yes (admin) |
| GET | `/api/admin/stats` | Get dashboard stats | Yes (admin) |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/:id` | Get user profile | No |
| PATCH | `/api/users/:id` | Update profile | Yes (owner) |
| GET | `/api/users/:id/testimonies` | Get user's testimonies | No |

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

| Event | Trigger | Payload |
|-------|---------|---------|
| `testimony.created` | New testimony submitted | `{ testimonyId, userId, title }` |
| `testimony.approved` | Testimony approved by admin | `{ testimonyId, userId, title, publishedAt }` |
| `testimony.rejected` | Testimony rejected | `{ testimonyId, userId, reason }` |
| `user.created` | New user registered | `{ userId, email }` |

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
