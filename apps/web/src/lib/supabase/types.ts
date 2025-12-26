// =============================================================================
// DATABASE TYPES - Auto-generated from Supabase schema
// Run `supabase gen types typescript` to regenerate
// =============================================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          role: 'user' | 'creator' | 'admin'
          tier: 'free' | 'family' | 'legacy'
          tier_expires_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          referral_code: string
          referred_by: string | null
          referral_credits: number
          total_referrals: number
          language: string
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'user' | 'creator' | 'admin'
          tier?: 'free' | 'family' | 'legacy'
          tier_expires_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          referral_code?: string
          referred_by?: string | null
          referral_credits?: number
          total_referrals?: number
          language?: string
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'user' | 'creator' | 'admin'
          tier?: 'free' | 'family' | 'legacy'
          tier_expires_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          referral_code?: string
          referred_by?: string | null
          referral_credits?: number
          total_referrals?: number
          language?: string
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_referred_by_fkey'
            columns: ['referred_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      stories: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          video_url: string | null
          thumbnail_url: string | null
          duration: number | null
          category:
            | 'life_wisdom'
            | 'family_history'
            | 'transformation'
            | 'faith_journey'
            | 'final_messages'
            | 'milestones'
          tags: string[]
          language: string
          prompt_id: string | null
          status: 'pending' | 'approved' | 'rejected' | 'flagged'
          visibility: 'public' | 'unlisted' | 'private' | 'family'
          family_vault_id: string | null
          view_count: number
          like_count: number
          share_count: number
          has_4k: boolean
          ipfs_hash: string | null
          moderated_by: string | null
          moderated_at: string | null
          rejection_reason: string | null
          featured: boolean
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          duration?: number | null
          category?:
            | 'life_wisdom'
            | 'family_history'
            | 'transformation'
            | 'faith_journey'
            | 'final_messages'
            | 'milestones'
          tags?: string[]
          language?: string
          prompt_id?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'flagged'
          visibility?: 'public' | 'unlisted' | 'private' | 'family'
          family_vault_id?: string | null
          view_count?: number
          like_count?: number
          share_count?: number
          has_4k?: boolean
          ipfs_hash?: string | null
          moderated_by?: string | null
          moderated_at?: string | null
          rejection_reason?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          duration?: number | null
          category?:
            | 'life_wisdom'
            | 'family_history'
            | 'transformation'
            | 'faith_journey'
            | 'final_messages'
            | 'milestones'
          tags?: string[]
          language?: string
          prompt_id?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'flagged'
          visibility?: 'public' | 'unlisted' | 'private' | 'family'
          family_vault_id?: string | null
          view_count?: number
          like_count?: number
          share_count?: number
          has_4k?: boolean
          ipfs_hash?: string | null
          moderated_by?: string | null
          moderated_at?: string | null
          rejection_reason?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'stories_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'stories_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'stories_family_vault_id_fkey'
            columns: ['family_vault_id']
            isOneToOne: false
            referencedRelation: 'family_vaults'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'stories_moderated_by_fkey'
            columns: ['moderated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      family_vaults: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          is_memorial: boolean
          memorial_for: string | null
          memorial_date: string | null
          allow_responses: boolean
          require_approval: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          is_memorial?: boolean
          memorial_for?: string | null
          memorial_date?: string | null
          allow_responses?: boolean
          require_approval?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          is_memorial?: boolean
          memorial_for?: string | null
          memorial_date?: string | null
          allow_responses?: boolean
          require_approval?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'family_vaults_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      family_members: {
        Row: {
          id: string
          vault_id: string
          user_id: string | null
          role: 'owner' | 'admin' | 'member' | 'viewer'
          relationship: string | null
          invited_email: string | null
          invited_by: string | null
          invitation_token: string | null
          invited_at: string
          joined_at: string | null
          notify_new_stories: boolean
          notify_responses: boolean
        }
        Insert: {
          id?: string
          vault_id: string
          user_id?: string | null
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          relationship?: string | null
          invited_email?: string | null
          invited_by?: string | null
          invitation_token?: string | null
          invited_at?: string
          joined_at?: string | null
          notify_new_stories?: boolean
          notify_responses?: boolean
        }
        Update: {
          id?: string
          vault_id?: string
          user_id?: string | null
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          relationship?: string | null
          invited_email?: string | null
          invited_by?: string | null
          invitation_token?: string | null
          invited_at?: string
          joined_at?: string | null
          notify_new_stories?: boolean
          notify_responses?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'family_members_vault_id_fkey'
            columns: ['vault_id']
            isOneToOne: false
            referencedRelation: 'family_vaults'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'family_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'family_members_invited_by_fkey'
            columns: ['invited_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      prompts: {
        Row: {
          id: string
          category:
            | 'life_wisdom'
            | 'family_history'
            | 'transformation'
            | 'faith_journey'
            | 'final_messages'
            | 'milestones'
          prompt_text: Json
          is_active: boolean
          display_order: number
          times_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category:
            | 'life_wisdom'
            | 'family_history'
            | 'transformation'
            | 'faith_journey'
            | 'final_messages'
            | 'milestones'
          prompt_text: Json
          is_active?: boolean
          display_order?: number
          times_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?:
            | 'life_wisdom'
            | 'family_history'
            | 'transformation'
            | 'faith_journey'
            | 'final_messages'
            | 'milestones'
          prompt_text?: Json
          is_active?: boolean
          display_order?: number
          times_used?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      story_responses: {
        Row: {
          id: string
          story_id: string
          responder_id: string
          video_url: string | null
          thumbnail_url: string | null
          duration: number | null
          text_response: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          story_id: string
          responder_id: string
          video_url?: string | null
          thumbnail_url?: string | null
          duration?: number | null
          text_response?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          responder_id?: string
          video_url?: string | null
          thumbnail_url?: string | null
          duration?: number | null
          text_response?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'story_responses_story_id_fkey'
            columns: ['story_id']
            isOneToOne: false
            referencedRelation: 'stories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'story_responses_responder_id_fkey'
            columns: ['responder_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      story_likes: {
        Row: {
          story_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          story_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          story_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'story_likes_story_id_fkey'
            columns: ['story_id']
            isOneToOne: false
            referencedRelation: 'stories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'story_likes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          viewer_id: string | null
          view_duration: number | null
          completed: boolean
          referrer: string | null
          user_agent: string | null
          country: string | null
          created_at: string
        }
        Insert: {
          id?: string
          story_id: string
          viewer_id?: string | null
          view_duration?: number | null
          completed?: boolean
          referrer?: string | null
          user_agent?: string | null
          country?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          viewer_id?: string | null
          view_duration?: number | null
          completed?: boolean
          referrer?: string | null
          user_agent?: string | null
          country?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'story_views_story_id_fkey'
            columns: ['story_id']
            isOneToOne: false
            referencedRelation: 'stories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'story_views_viewer_id_fkey'
            columns: ['viewer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          status: 'signed_up' | 'recorded' | 'upgraded_family' | 'upgraded_legacy'
          reward_months: number
          reward_cash_cents: number
          reward_claimed: boolean
          reward_claimed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          status?: 'signed_up' | 'recorded' | 'upgraded_family' | 'upgraded_legacy'
          reward_months?: number
          reward_cash_cents?: number
          reward_claimed?: boolean
          reward_claimed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          status?: 'signed_up' | 'recorded' | 'upgraded_family' | 'upgraded_legacy'
          reward_months?: number
          reward_cash_cents?: number
          reward_claimed?: boolean
          reward_claimed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'referrals_referrer_id_fkey'
            columns: ['referrer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'referrals_referred_id_fkey'
            columns: ['referred_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          contact_email: string | null
          contact_name: string | null
          tier: 'free' | 'small' | 'large'
          member_count: number
          story_limit: number
          stories_used: number
          primary_color: string | null
          custom_domain: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          contact_email?: string | null
          contact_name?: string | null
          tier?: 'free' | 'small' | 'large'
          member_count?: number
          story_limit?: number
          stories_used?: number
          primary_color?: string | null
          custom_domain?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          contact_email?: string | null
          contact_name?: string | null
          tier?: 'free' | 'small' | 'large'
          member_count?: number
          story_limit?: number
          stories_used?: number
          primary_color?: string | null
          custom_domain?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'organizations_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      organization_members: {
        Row: {
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          organization_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          organization_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'organization_members_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'organization_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'creator' | 'admin'
      user_tier: 'free' | 'family' | 'legacy'
      story_category:
        | 'life_wisdom'
        | 'family_history'
        | 'transformation'
        | 'faith_journey'
        | 'final_messages'
        | 'milestones'
      story_status: 'pending' | 'approved' | 'rejected' | 'flagged'
      story_visibility: 'public' | 'unlisted' | 'private' | 'family'
      family_role: 'owner' | 'admin' | 'member' | 'viewer'
      referral_status: 'signed_up' | 'recorded' | 'upgraded_family' | 'upgraded_legacy'
      org_tier: 'free' | 'small' | 'large'
      org_role: 'owner' | 'admin' | 'member'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for working with tables
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Convenience type aliases
export type Profile = Tables<'profiles'>
export type Story = Tables<'stories'>
export type FamilyVault = Tables<'family_vaults'>
export type FamilyMember = Tables<'family_members'>
export type Prompt = Tables<'prompts'>
export type StoryResponse = Tables<'story_responses'>
export type StoryLike = Tables<'story_likes'>
export type StoryView = Tables<'story_views'>
export type Referral = Tables<'referrals'>
export type Organization = Tables<'organizations'>
export type OrganizationMember = Tables<'organization_members'>
