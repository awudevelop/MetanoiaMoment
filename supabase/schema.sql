-- MetanoiaMoment Database Schema v2.0
-- Updated for "Generous Individual, Premium Family" business model
-- Run this in your Supabase SQL Editor

-- ============================================
-- CLEANUP (if migrating from v1)
-- ============================================
-- Uncomment these if you need to drop existing tables
-- DROP TABLE IF EXISTS public.story_views CASCADE;
-- DROP TABLE IF EXISTS public.story_likes CASCADE;
-- DROP TABLE IF EXISTS public.story_responses CASCADE;
-- DROP TABLE IF EXISTS public.referrals CASCADE;
-- DROP TABLE IF EXISTS public.family_members CASCADE;
-- DROP TABLE IF EXISTS public.family_vaults CASCADE;
-- DROP TABLE IF EXISTS public.organization_members CASCADE;
-- DROP TABLE IF EXISTS public.organizations CASCADE;
-- DROP TABLE IF EXISTS public.prompts CASCADE;
-- DROP TABLE IF EXISTS public.stories CASCADE;
-- DROP TABLE IF EXISTS public.testimonies CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;
-- DROP TYPE IF EXISTS story_category CASCADE;
-- DROP TYPE IF EXISTS story_status CASCADE;
-- DROP TYPE IF EXISTS story_visibility CASCADE;
-- DROP TYPE IF EXISTS user_role CASCADE;
-- DROP TYPE IF EXISTS user_tier CASCADE;
-- DROP TYPE IF EXISTS family_role CASCADE;
-- DROP TYPE IF EXISTS referral_status CASCADE;
-- DROP TYPE IF EXISTS testimony_status CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM ('user', 'creator', 'admin');

-- Subscription tiers
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

-- Story status
CREATE TYPE story_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');

-- Story visibility
CREATE TYPE story_visibility AS ENUM ('public', 'unlisted', 'private', 'family');

-- Family member roles
CREATE TYPE family_role AS ENUM ('owner', 'admin', 'member', 'viewer');

-- Referral status
CREATE TYPE referral_status AS ENUM ('signed_up', 'recorded', 'upgraded_family', 'upgraded_legacy');

-- ============================================
-- CORE TABLES
-- ============================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,

  -- Role & permissions
  role user_role DEFAULT 'user',

  -- Subscription
  tier user_tier DEFAULT 'free',
  tier_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Referral system
  referral_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  referred_by UUID REFERENCES public.profiles(id),
  referral_credits INTEGER DEFAULT 0, -- months of free Family tier

  -- Affiliate level (calculated from total_referrals)
  total_referrals INTEGER DEFAULT 0,

  -- Metadata
  language TEXT DEFAULT 'en',
  timezone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FAMILY FEATURES (must come before stories)
-- ============================================

-- Family vaults
CREATE TABLE public.family_vaults (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Memorial mode
  is_memorial BOOLEAN DEFAULT FALSE,
  memorial_for TEXT, -- name of deceased
  memorial_date DATE, -- date of passing

  -- Settings
  allow_responses BOOLEAN DEFAULT TRUE,
  require_approval BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family members
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id UUID NOT NULL REFERENCES public.family_vaults(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Role & permissions
  role family_role DEFAULT 'member',
  relationship TEXT, -- 'spouse', 'child', 'grandchild', 'parent', etc.

  -- Invitation tracking
  invited_email TEXT, -- for pending invitations
  invited_by UUID REFERENCES public.profiles(id),
  invitation_token TEXT UNIQUE,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,

  -- Notification preferences
  notify_new_stories BOOLEAN DEFAULT TRUE,
  notify_responses BOOLEAN DEFAULT TRUE,

  UNIQUE(vault_id, user_id)
);

-- ============================================
-- CONTENT MANAGEMENT
-- ============================================

-- Recording prompts
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category story_category NOT NULL,

  -- Content (supports i18n)
  prompt_text JSONB NOT NULL, -- { "en": "...", "es": "..." }

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,

  -- Stats
  times_used INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories (formerly testimonies)
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- seconds

  -- Categorization
  category story_category DEFAULT 'life_wisdom',
  tags TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'en',
  prompt_id UUID REFERENCES public.prompts(id), -- optional reference to prompt used

  -- Status & visibility
  status story_status DEFAULT 'pending',
  visibility story_visibility DEFAULT 'public',

  -- For family vault stories
  family_vault_id UUID REFERENCES public.family_vaults(id),

  -- Engagement metrics
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,

  -- Video quality (for tier gating)
  has_4k BOOLEAN DEFAULT FALSE,
  ipfs_hash TEXT, -- for Legacy tier backup

  -- Moderation
  moderated_by UUID REFERENCES public.profiles(id),
  moderated_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Featured
  featured BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Story responses (family conversations)
CREATE TABLE public.story_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Response content (video or text)
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  text_response TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story likes
CREATE TABLE public.story_likes (
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (story_id, user_id)
);

-- Story views (for analytics)
CREATE TABLE public.story_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- View data
  view_duration INTEGER, -- seconds watched
  completed BOOLEAN DEFAULT FALSE,

  -- Context
  referrer TEXT,
  user_agent TEXT,
  country TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REFERRAL & REWARDS
-- ============================================

-- Referrals
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Status tracking
  status referral_status DEFAULT 'signed_up',

  -- Rewards
  reward_months INTEGER DEFAULT 0,
  reward_cash_cents INTEGER DEFAULT 0,
  reward_claimed BOOLEAN DEFAULT FALSE,
  reward_claimed_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(referrer_id, referred_id)
);

-- ============================================
-- CHURCH/MINISTRY FEATURES
-- ============================================

-- Churches/Organizations
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,

  -- Contact
  contact_email TEXT,
  contact_name TEXT,

  -- Subscription
  tier TEXT DEFAULT 'free', -- 'free', 'small', 'large'
  member_count INTEGER DEFAULT 0,
  story_limit INTEGER DEFAULT 50,
  stories_used INTEGER DEFAULT 0,

  -- Branding (for white-label)
  primary_color TEXT,
  custom_domain TEXT,

  -- Stripe
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Admin
  owner_id UUID NOT NULL REFERENCES public.profiles(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization members
CREATE TABLE public.organization_members (
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (organization_id, user_id)
);

-- ============================================
-- INDEXES
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX idx_profiles_tier ON public.profiles(tier);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Stories
CREATE INDEX idx_stories_user_id ON public.stories(user_id);
CREATE INDEX idx_stories_status ON public.stories(status);
CREATE INDEX idx_stories_category ON public.stories(category);
CREATE INDEX idx_stories_visibility ON public.stories(visibility);
CREATE INDEX idx_stories_created_at ON public.stories(created_at DESC);
CREATE INDEX idx_stories_family_vault ON public.stories(family_vault_id);
CREATE INDEX idx_stories_featured ON public.stories(featured) WHERE featured = true;
CREATE INDEX idx_stories_published ON public.stories(published_at DESC NULLS LAST);

-- Prompts
CREATE INDEX idx_prompts_category ON public.prompts(category);
CREATE INDEX idx_prompts_active ON public.prompts(is_active) WHERE is_active = true;

-- Family
CREATE INDEX idx_family_members_vault ON public.family_members(vault_id);
CREATE INDEX idx_family_members_user ON public.family_members(user_id);
CREATE INDEX idx_family_members_token ON public.family_members(invitation_token);
CREATE INDEX idx_family_vaults_owner ON public.family_vaults(owner_id);

-- Referrals
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON public.referrals(referred_id);

-- Views
CREATE INDEX idx_story_views_story ON public.story_views(story_id);
CREATE INDEX idx_story_views_created ON public.story_views(created_at DESC);

-- Organizations
CREATE INDEX idx_organizations_slug ON public.organizations(slug);
CREATE INDEX idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX idx_org_members_user ON public.organization_members(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: Profiles
-- ============================================

-- Anyone can view public profile info
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- RLS POLICIES: Stories
-- ============================================

-- View policy: public approved, own stories, or admin
CREATE POLICY "stories_select" ON public.stories
  FOR SELECT USING (
    (status = 'approved' AND visibility = 'public')
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR (
      family_vault_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.family_members
        WHERE vault_id = stories.family_vault_id AND user_id = auth.uid()
      )
    )
  );

-- Users can insert their own stories
CREATE POLICY "stories_insert_own" ON public.stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own stories
CREATE POLICY "stories_update_own" ON public.stories
  FOR UPDATE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can delete their own stories
CREATE POLICY "stories_delete_own" ON public.stories
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: Family Vaults
-- ============================================

-- Family members can view their vaults
CREATE POLICY "vaults_select" ON public.family_vaults
  FOR SELECT USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.family_members
      WHERE vault_id = id AND user_id = auth.uid()
    )
  );

-- Users with family/legacy tier can create vaults
CREATE POLICY "vaults_insert" ON public.family_vaults
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tier IN ('family', 'legacy')
    )
  );

-- Owners can update their vaults
CREATE POLICY "vaults_update" ON public.family_vaults
  FOR UPDATE USING (owner_id = auth.uid());

-- Owners can delete their vaults
CREATE POLICY "vaults_delete" ON public.family_vaults
  FOR DELETE USING (owner_id = auth.uid());

-- ============================================
-- RLS POLICIES: Family Members
-- ============================================

-- Members can view family member list
CREATE POLICY "family_members_select" ON public.family_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.family_vaults
      WHERE id = vault_id AND owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.vault_id = family_members.vault_id AND fm.user_id = auth.uid()
    )
  );

-- Vault owners/admins can invite
CREATE POLICY "family_members_insert" ON public.family_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_vaults
      WHERE id = vault_id AND owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.vault_id = family_members.vault_id
      AND fm.user_id = auth.uid()
      AND fm.role IN ('owner', 'admin')
    )
  );

-- Members can update their own preferences
CREATE POLICY "family_members_update" ON public.family_members
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.family_vaults
      WHERE id = vault_id AND owner_id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES: Prompts
-- ============================================

-- Everyone can view active prompts
CREATE POLICY "prompts_select" ON public.prompts
  FOR SELECT USING (is_active = true);

-- Only admins can manage prompts
CREATE POLICY "prompts_admin" ON public.prompts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: Likes
-- ============================================

-- Anyone can view likes
CREATE POLICY "likes_select" ON public.story_likes
  FOR SELECT USING (true);

-- Authenticated users can like
CREATE POLICY "likes_insert" ON public.story_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can unlike
CREATE POLICY "likes_delete" ON public.story_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: Views
-- ============================================

-- Anyone can insert views
CREATE POLICY "views_insert" ON public.story_views
  FOR INSERT WITH CHECK (true);

-- Users can view their own story analytics
CREATE POLICY "views_select" ON public.story_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stories
      WHERE id = story_id AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: Story Responses
-- ============================================

-- Family members can view responses
CREATE POLICY "responses_select" ON public.story_responses
  FOR SELECT USING (
    responder_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.stories s
      WHERE s.id = story_id AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.stories s
      JOIN public.family_members fm ON fm.vault_id = s.family_vault_id
      WHERE s.id = story_id AND fm.user_id = auth.uid()
    )
  );

-- Users can create responses
CREATE POLICY "responses_insert" ON public.story_responses
  FOR INSERT WITH CHECK (auth.uid() = responder_id);

-- Users can update their own responses
CREATE POLICY "responses_update" ON public.story_responses
  FOR UPDATE USING (auth.uid() = responder_id);

-- Users can delete their own responses
CREATE POLICY "responses_delete" ON public.story_responses
  FOR DELETE USING (auth.uid() = responder_id);

-- ============================================
-- RLS POLICIES: Referrals
-- ============================================

-- Users can view their own referrals
CREATE POLICY "referrals_select" ON public.referrals
  FOR SELECT USING (
    referrer_id = auth.uid() OR referred_id = auth.uid()
  );

-- System creates referrals (via function)
CREATE POLICY "referrals_insert" ON public.referrals
  FOR INSERT WITH CHECK (true);

-- ============================================
-- RLS POLICIES: Organizations
-- ============================================

-- Public can view organizations
CREATE POLICY "organizations_select" ON public.organizations
  FOR SELECT USING (true);

-- Owners can manage
CREATE POLICY "organizations_manage" ON public.organizations
  FOR ALL USING (owner_id = auth.uid());

-- ============================================
-- RLS POLICIES: Organization Members
-- ============================================

CREATE POLICY "org_members_select" ON public.organization_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.organizations
      WHERE id = organization_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "org_members_manage" ON public.organization_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organizations
      WHERE id = organization_id AND owner_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  referrer_code TEXT;
  referrer_id UUID;
BEGIN
  -- Check for referral code in metadata
  referrer_code := NEW.raw_user_meta_data->>'referral_code';

  IF referrer_code IS NOT NULL THEN
    SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = referrer_code;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, avatar_url, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    referrer_id
  );

  -- Create referral record if referred
  IF referrer_id IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referred_id, status)
    VALUES (referrer_id, NEW.id, 'signed_up');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if exist
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS stories_updated_at ON public.stories;
DROP TRIGGER IF EXISTS family_vaults_updated_at ON public.family_vaults;
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS handle_testimonies_updated_at ON public.testimonies;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER family_vaults_updated_at
  BEFORE UPDATE ON public.family_vaults
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(story_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.stories
  SET view_count = view_count + 1
  WHERE id = story_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment like count
CREATE OR REPLACE FUNCTION public.handle_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.stories SET like_count = like_count + 1 WHERE id = NEW.story_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.stories SET like_count = like_count - 1 WHERE id = OLD.story_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER handle_like_insert
  AFTER INSERT ON public.story_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_count();

CREATE TRIGGER handle_like_delete
  AFTER DELETE ON public.story_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_count();

-- Update referral stats
CREATE OR REPLACE FUNCTION public.update_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET total_referrals = (
    SELECT COUNT(*) FROM public.referrals
    WHERE referrer_id = NEW.referrer_id
  )
  WHERE id = NEW.referrer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_referrer_stats
  AFTER INSERT ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_referral_stats();

-- Update referral status when user records first story
CREATE OR REPLACE FUNCTION public.handle_first_story()
RETURNS TRIGGER AS $$
BEGIN
  -- Update referral status if this is user's first story
  IF (SELECT COUNT(*) FROM public.stories WHERE user_id = NEW.user_id) = 1 THEN
    UPDATE public.referrals
    SET status = 'recorded',
        reward_months = reward_months + 1,
        updated_at = NOW()
    WHERE referred_id = NEW.user_id AND status = 'signed_up';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER handle_first_story
  AFTER INSERT ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.handle_first_story();

-- ============================================
-- SEED DATA: Default Prompts
-- ============================================

INSERT INTO public.prompts (category, prompt_text, display_order) VALUES
-- Life Wisdom
('life_wisdom', '{"en": "What''s the best advice you ever received?", "es": "Cual es el mejor consejo que has recibido?"}', 1),
('life_wisdom', '{"en": "What do you want your grandchildren to know?", "es": "Que quieres que sepan tus nietos?"}', 2),
('life_wisdom', '{"en": "What mistake taught you the most?", "es": "Que error te enseno mas?"}', 3),
('life_wisdom', '{"en": "What would you tell your younger self?", "es": "Que le dirias a tu yo mas joven?"}', 4),
('life_wisdom', '{"en": "What are you most proud of?", "es": "De que estas mas orgulloso?"}', 5),
('life_wisdom', '{"en": "What does success mean to you?", "es": "Que significa el exito para ti?"}', 6),
('life_wisdom', '{"en": "What lesson took you the longest to learn?", "es": "Que leccion te tomo mas tiempo aprender?"}', 7),

-- Family History
('family_history', '{"en": "Tell the story of how you met your spouse", "es": "Cuenta la historia de como conociste a tu pareja"}', 1),
('family_history', '{"en": "What traditions did your family have?", "es": "Que tradiciones tenia tu familia?"}', 2),
('family_history', '{"en": "Describe your childhood home", "es": "Describe tu hogar de la infancia"}', 3),
('family_history', '{"en": "What was your parents'' greatest lesson?", "es": "Cual fue la mayor leccion de tus padres?"}', 4),
('family_history', '{"en": "What stories did your grandparents tell?", "es": "Que historias contaban tus abuelos?"}', 5),
('family_history', '{"en": "What was your favorite family vacation?", "es": "Cual fue tu vacacion familiar favorita?"}', 6),
('family_history', '{"en": "Describe a typical Sunday in your childhood", "es": "Describe un domingo tipico de tu infancia"}', 7),

-- Transformation
('transformation', '{"en": "Describe the moment everything changed", "es": "Describe el momento en que todo cambio"}', 1),
('transformation', '{"en": "What helped you through your darkest time?", "es": "Que te ayudo en tu momento mas oscuro?"}', 2),
('transformation', '{"en": "Who or what saved your life?", "es": "Quien o que salvo tu vida?"}', 3),
('transformation', '{"en": "How did you overcome your biggest challenge?", "es": "Como superaste tu mayor desafio?"}', 4),
('transformation', '{"en": "What gave you hope when you had none?", "es": "Que te dio esperanza cuando no tenias ninguna?"}', 5),
('transformation', '{"en": "What addiction or habit did you overcome?", "es": "Que adiccion o habito superaste?"}', 6),
('transformation', '{"en": "How did failure lead to your greatest success?", "es": "Como el fracaso te llevo a tu mayor exito?"}', 7),

-- Faith Journey
('faith_journey', '{"en": "How did you come to faith?", "es": "Como llegaste a la fe?"}', 1),
('faith_journey', '{"en": "Describe a moment when God felt real", "es": "Describe un momento en que Dios se sintio real"}', 2),
('faith_journey', '{"en": "What does your faith mean to you?", "es": "Que significa tu fe para ti?"}', 3),
('faith_journey', '{"en": "How has prayer changed your life?", "es": "Como ha cambiado la oracion tu vida?"}', 4),
('faith_journey', '{"en": "What scripture has meant the most to you?", "es": "Que escritura ha significado mas para ti?"}', 5),
('faith_journey', '{"en": "Tell about a miracle you witnessed", "es": "Cuenta sobre un milagro que presenciaste"}', 6),
('faith_journey', '{"en": "How do you handle doubt?", "es": "Como manejas la duda?"}', 7),

-- Final Messages
('final_messages', '{"en": "What do you want your family to remember?", "es": "Que quieres que recuerde tu familia?"}', 1),
('final_messages', '{"en": "What brings you peace?", "es": "Que te trae paz?"}', 2),
('final_messages', '{"en": "What are you most grateful for?", "es": "Por que estas mas agradecido?"}', 3),
('final_messages', '{"en": "What is your hope for your loved ones?", "es": "Cual es tu esperanza para tus seres queridos?"}', 4),
('final_messages', '{"en": "What has your life taught you about love?", "es": "Que te ha ensenado tu vida sobre el amor?"}', 5),
('final_messages', '{"en": "If you could live forever, what would you do?", "es": "Si pudieras vivir para siempre, que harias?"}', 6),
('final_messages', '{"en": "What do you believe happens after death?", "es": "Que crees que sucede despues de la muerte?"}', 7),

-- Milestones
('milestones', '{"en": "Describe the day you got married", "es": "Describe el dia que te casaste"}', 1),
('milestones', '{"en": "What was it like becoming a parent?", "es": "Como fue convertirte en padre/madre?"}', 2),
('milestones', '{"en": "Tell the story of a meaningful birthday", "es": "Cuenta la historia de un cumpleanos significativo"}', 3),
('milestones', '{"en": "What achievement are you most proud of?", "es": "De que logro estas mas orgulloso?"}', 4),
('milestones', '{"en": "Describe a moment of answered prayer", "es": "Describe un momento de oracion contestada"}', 5),
('milestones', '{"en": "What was graduation day like for you?", "es": "Como fue el dia de tu graduacion?"}', 6),
('milestones', '{"en": "Tell about the day you became a grandparent", "es": "Cuenta sobre el dia que te convertiste en abuelo/a"}', 7)
ON CONFLICT DO NOTHING;

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in the Supabase Dashboard under Storage

-- Create buckets:
-- 1. "videos" (public: false) - for story videos
-- 2. "thumbnails" (public: true) - for video thumbnails
-- 3. "avatars" (public: true) - for user avatars

-- After creating buckets, add these policies in the dashboard:

-- videos bucket policies:
-- SELECT: Allow users to view their own videos OR approved story videos
-- INSERT: Allow authenticated users to upload to their own folder (uid/filename)
-- UPDATE: Allow users to update their own files
-- DELETE: Allow users to delete their own files

-- thumbnails bucket policies:
-- SELECT: Allow public access
-- INSERT: Allow authenticated users
-- UPDATE/DELETE: Allow users to manage their own

-- avatars bucket policies:
-- SELECT: Allow public access
-- INSERT/UPDATE/DELETE: Allow users to manage their own (uid/filename pattern)
