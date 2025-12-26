/**
 * Story Journey System
 *
 * A guided, multi-step preparation flow that helps users discover
 * what story they want to tell before recording. Captures email early
 * for abandonment recovery.
 */

import type { StoryCategory } from '@/types'

// =============================================================================
// TYPES
// =============================================================================

export type JourneyStep =
  | 'welcome' // Intro + email capture
  | 'category' // Choose story type
  | 'discovery' // Deep questions to unlock story
  | 'outline' // Story structure preview
  | 'ready' // Final prep before recording

export interface JourneyProgress {
  id: string
  step: JourneyStep
  email: string | null
  consentToReminders: boolean
  category: StoryCategory | null
  discoveryAnswers: Record<string, string>
  storyOutline: StoryOutline | null
  startedAt: string
  lastActiveAt: string
  completedAt: string | null
  abandoned: boolean
  remindersSent: number
}

export interface StoryOutline {
  hook: string // Opening hook (from discovery)
  context: string // Background/setting
  turning: string // The moment of change
  impact: string // How it affected you/others
  message: string // What you want viewers to know
}

export interface DiscoveryQuestion {
  id: string
  question: string
  placeholder: string
  helpText?: string
  required: boolean
  minLength?: number
  followUp?: string // Shown after they answer
}

// =============================================================================
// DISCOVERY QUESTIONS BY CATEGORY
// =============================================================================

export const DISCOVERY_QUESTIONS: Record<StoryCategory, DiscoveryQuestion[]> = {
  life_wisdom: [
    {
      id: 'moment',
      question: 'Think of a moment that changed how you see life. What happened?',
      placeholder: 'I remember when...',
      helpText: "Don't worry about details yet - just the core memory.",
      required: true,
      minLength: 20,
      followUp: "That sounds powerful. Let's explore it more.",
    },
    {
      id: 'before',
      question: 'How did you see things before this moment?',
      placeholder: 'Before this, I believed...',
      helpText: 'What was your mindset or worldview?',
      required: true,
    },
    {
      id: 'lesson',
      question: 'What did you learn that you wish everyone knew?',
      placeholder: 'I learned that...',
      helpText: 'This becomes the heart of your message.',
      required: true,
      minLength: 30,
    },
    {
      id: 'recipient',
      question: 'If you could share this with one person, who would it be?',
      placeholder: "I'd share this with...",
      helpText: 'A child, grandchild, younger self, stranger struggling with the same thing?',
      required: false,
    },
  ],

  family_history: [
    {
      id: 'person',
      question: 'Who is the family member or ancestor you want to honor?',
      placeholder: 'I want to share about...',
      helpText: 'Could be a parent, grandparent, or someone from generations past.',
      required: true,
    },
    {
      id: 'memory',
      question: "What's a specific memory or story about them that captures who they were?",
      placeholder: 'I remember when they...',
      helpText: 'The more specific, the more powerful.',
      required: true,
      minLength: 30,
    },
    {
      id: 'legacy',
      question: 'What part of them lives on in you or your family?',
      placeholder: 'They taught us to...',
      helpText: 'Values, traditions, sayings, recipes, ways of being.',
      required: true,
    },
    {
      id: 'preserve',
      question: 'What do you never want future generations to forget about them?',
      placeholder: 'I never want people to forget...',
      required: false,
    },
  ],

  transformation: [
    {
      id: 'before',
      question: 'What was your life like at your lowest or hardest point?',
      placeholder: 'I was struggling with...',
      helpText: "Be as honest as you're comfortable being.",
      required: true,
      minLength: 30,
    },
    {
      id: 'turning',
      question: 'What was the moment or event that started your transformation?',
      placeholder: 'Everything changed when...',
      helpText: "Sometimes it's a single moment, sometimes a series of events.",
      required: true,
      minLength: 30,
    },
    {
      id: 'how',
      question: 'What helped you through the change? People, faith, resources?',
      placeholder: 'What helped me was...',
      required: true,
    },
    {
      id: 'now',
      question: 'How is your life different now?',
      placeholder: 'Today, I...',
      helpText: "Help viewers see what's possible.",
      required: true,
    },
    {
      id: 'hope',
      question: 'What would you say to someone going through what you went through?',
      placeholder: "If you're struggling with this, I want you to know...",
      required: false,
      followUp: 'This is the gift your story gives to others.',
    },
  ],

  faith_journey: [
    {
      id: 'before',
      question: 'What was your relationship with faith before your journey began?',
      placeholder: 'Before, I thought faith was...',
      helpText: 'Skeptical, religious but empty, seeking, or something else?',
      required: true,
    },
    {
      id: 'moment',
      question: 'When did God become real to you? What happened?',
      placeholder: 'I encountered God when...',
      helpText: 'A specific moment, event, or gradual realization.',
      required: true,
      minLength: 30,
    },
    {
      id: 'change',
      question: 'How has your faith changed the way you live?',
      placeholder: 'My faith has changed how I...',
      required: true,
    },
    {
      id: 'challenges',
      question: 'What challenges have you faced in your faith journey?',
      placeholder: "It hasn't always been easy...",
      helpText: 'Doubt, struggle, and growth are all part of real faith.',
      required: false,
    },
    {
      id: 'invitation',
      question: 'What would you want to share with someone curious about faith?',
      placeholder: "If you're curious about faith, I'd want you to know...",
      required: false,
    },
  ],

  final_messages: [
    {
      id: 'to_whom',
      question: 'Who is this message for? You can name specific people or speak generally.',
      placeholder: 'This message is for...',
      helpText: 'Your children, grandchildren, friends, or anyone who will remember you.',
      required: true,
    },
    {
      id: 'gratitude',
      question: 'What are you most grateful for in your life?',
      placeholder: "I'm most grateful for...",
      required: true,
    },
    {
      id: 'wisdom',
      question: "What's the most important thing you've learned about living a good life?",
      placeholder: "The most important thing I've learned is...",
      required: true,
      minLength: 30,
    },
    {
      id: 'forgiveness',
      question: 'Is there anything you want to say about forgiveness - given or received?',
      placeholder: 'About forgiveness, I want to say...',
      helpText: 'This is optional but can bring great peace.',
      required: false,
    },
    {
      id: 'love',
      question: 'What do you want your loved ones to remember about your love for them?',
      placeholder: 'I want you to know how much...',
      required: true,
    },
  ],

  milestones: [
    {
      id: 'occasion',
      question: 'What milestone are you celebrating or documenting?',
      placeholder: "I'm celebrating/documenting...",
      helpText: 'Wedding, graduation, birth, anniversary, achievement, etc.',
      required: true,
    },
    {
      id: 'journey',
      question: 'What was the journey that led to this moment?',
      placeholder: 'The path to this moment included...',
      required: true,
      minLength: 30,
    },
    {
      id: 'feelings',
      question: 'How are you feeling right now? What emotions come up?',
      placeholder: "Right now I'm feeling...",
      helpText: 'Joy, gratitude, nervousness, excitement, bittersweetness?',
      required: true,
    },
    {
      id: 'thanks',
      question: 'Who do you want to thank for helping you reach this moment?',
      placeholder: 'I want to thank...',
      required: false,
    },
    {
      id: 'hopes',
      question: 'What hopes do you have for the future from this point forward?',
      placeholder: 'Looking ahead, I hope...',
      required: false,
    },
  ],
}

// =============================================================================
// JOURNEY HELPERS
// =============================================================================

export function createNewJourney(): JourneyProgress {
  return {
    id: `journey-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    step: 'welcome',
    email: null,
    consentToReminders: false,
    category: null,
    discoveryAnswers: {},
    storyOutline: null,
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    completedAt: null,
    abandoned: false,
    remindersSent: 0,
  }
}

export function getStepIndex(step: JourneyStep): number {
  const steps: JourneyStep[] = ['welcome', 'category', 'discovery', 'outline', 'ready']
  return steps.indexOf(step)
}

export function getNextStep(current: JourneyStep): JourneyStep | null {
  const steps: JourneyStep[] = ['welcome', 'category', 'discovery', 'outline', 'ready']
  const index = steps.indexOf(current)
  return index < steps.length - 1 ? steps[index + 1] : null
}

export function getPrevStep(current: JourneyStep): JourneyStep | null {
  const steps: JourneyStep[] = ['welcome', 'category', 'discovery', 'outline', 'ready']
  const index = steps.indexOf(current)
  return index > 0 ? steps[index - 1] : null
}

export function generateStoryOutline(
  category: StoryCategory,
  answers: Record<string, string>
): StoryOutline {
  // Generate a story outline based on discovery answers
  const questions = DISCOVERY_QUESTIONS[category]

  // Default structure based on category
  switch (category) {
    case 'life_wisdom':
      return {
        hook: answers.moment?.slice(0, 100) || '',
        context: answers.before || '',
        turning: answers.moment || '',
        impact: answers.lesson || '',
        message: answers.recipient
          ? `For ${answers.recipient}: ${answers.lesson}`
          : answers.lesson || '',
      }

    case 'family_history':
      return {
        hook: `Let me tell you about ${answers.person || 'someone special'}...`,
        context: answers.person || '',
        turning: answers.memory || '',
        impact: answers.legacy || '',
        message: answers.preserve || answers.legacy || '',
      }

    case 'transformation':
      return {
        hook: answers.before?.slice(0, 100) || '',
        context: answers.before || '',
        turning: answers.turning || '',
        impact: `${answers.how || ''} ${answers.now || ''}`,
        message: answers.hope || '',
      }

    case 'faith_journey':
      return {
        hook: answers.moment?.slice(0, 100) || '',
        context: answers.before || '',
        turning: answers.moment || '',
        impact: answers.change || '',
        message: answers.invitation || '',
      }

    case 'final_messages':
      return {
        hook: `To ${answers.to_whom || 'those I love'}...`,
        context: answers.gratitude || '',
        turning: answers.wisdom || '',
        impact: answers.forgiveness || '',
        message: answers.love || '',
      }

    case 'milestones':
      return {
        hook: answers.occasion || '',
        context: answers.journey || '',
        turning: answers.feelings || '',
        impact: answers.thanks || '',
        message: answers.hopes || '',
      }

    default:
      return {
        hook: '',
        context: '',
        turning: '',
        impact: '',
        message: '',
      }
  }
}

// =============================================================================
// ABANDONMENT DETECTION
// =============================================================================

export const ABANDONMENT_THRESHOLDS = {
  // Time in milliseconds before considering a session abandoned
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  // Minimum time before sending first reminder
  FIRST_REMINDER_DELAY: 24 * 60 * 60 * 1000, // 24 hours
  // Time between subsequent reminders
  REMINDER_INTERVAL: 72 * 60 * 60 * 1000, // 72 hours
  // Maximum reminders to send
  MAX_REMINDERS: 3,
}

export function shouldMarkAbandoned(journey: JourneyProgress): boolean {
  if (journey.completedAt) return false
  if (!journey.email || !journey.consentToReminders) return false

  const lastActive = new Date(journey.lastActiveAt).getTime()
  const now = Date.now()

  return now - lastActive > ABANDONMENT_THRESHOLDS.SESSION_TIMEOUT
}

export function canSendReminder(journey: JourneyProgress): boolean {
  if (!journey.abandoned) return false
  if (!journey.email || !journey.consentToReminders) return false
  if (journey.completedAt) return false
  if (journey.remindersSent >= ABANDONMENT_THRESHOLDS.MAX_REMINDERS) return false

  const lastActive = new Date(journey.lastActiveAt).getTime()
  const now = Date.now()

  if (journey.remindersSent === 0) {
    return now - lastActive > ABANDONMENT_THRESHOLDS.FIRST_REMINDER_DELAY
  }

  return now - lastActive > ABANDONMENT_THRESHOLDS.REMINDER_INTERVAL * journey.remindersSent
}

// =============================================================================
// REMINDER TEMPLATES
// =============================================================================

export interface ReminderEmail {
  subject: string
  previewText: string
  bodyHtml: string
}

export function generateReminderEmail(
  journey: JourneyProgress,
  reminderNumber: number
): ReminderEmail {
  const categoryLabels: Record<StoryCategory, string> = {
    life_wisdom: 'life wisdom',
    family_history: 'family history',
    transformation: 'transformation',
    faith_journey: 'faith journey',
    final_messages: 'final message',
    milestones: 'milestone',
  }

  const categoryLabel = journey.category ? categoryLabels[journey.category] : 'story'

  // First reminder - gentle and encouraging
  if (reminderNumber === 1) {
    return {
      subject: 'Your story is waiting ✨',
      previewText: 'You started something beautiful. We saved your progress.',
      bodyHtml: `
        <p>Hi there,</p>
        <p>You started preparing a ${categoryLabel} story on Metanoia Moment, and we saved everything you shared.</p>
        <p>Your story matters. Someone out there needs to hear exactly what you have to say.</p>
        <p><a href="{{continue_url}}">Continue where you left off →</a></p>
        <p>With encouragement,<br>The Metanoia Moment Team</p>
      `,
    }
  }

  // Second reminder - social proof
  if (reminderNumber === 2) {
    return {
      subject: 'Stories like yours are changing lives',
      previewText: 'This week, 47 people shared their stories. Yours could be next.',
      bodyHtml: `
        <p>Hi there,</p>
        <p>This week, 47 people finished recording their stories on Metanoia Moment.</p>
        <p>One person wrote back: <em>"I was nervous to share, but my grandmother cried when she watched it. She said it was the best gift she ever received."</em></p>
        <p>You started preparing your ${categoryLabel} story. All your notes are still saved.</p>
        <p><a href="{{continue_url}}">Finish your story →</a></p>
        <p>Cheering you on,<br>The Metanoia Moment Team</p>
      `,
    }
  }

  // Third reminder - last chance, urgency
  return {
    subject: 'Last reminder about your story',
    previewText: "We'll stop sending reminders, but your draft will stay saved.",
    bodyHtml: `
      <p>Hi there,</p>
      <p>This is our last reminder about the ${categoryLabel} story you started preparing.</p>
      <p>We won't email you again about this, but your notes and progress will stay saved in case you ever want to come back.</p>
      <p>When you're ready, your story will be here waiting:</p>
      <p><a href="{{continue_url}}">Complete your story →</a></p>
      <p>No pressure. Your timing is perfect when it's right for you.</p>
      <p>Warmly,<br>The Metanoia Moment Team</p>
    `,
  }
}

// =============================================================================
// LOCAL STORAGE PERSISTENCE
// =============================================================================

const STORAGE_KEY = 'metanoia_story_journey'

export function saveJourneyToStorage(journey: JourneyProgress): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journey))
  } catch (e) {
    console.error('Failed to save journey to localStorage:', e)
  }
}

export function loadJourneyFromStorage(): JourneyProgress | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as JourneyProgress
  } catch (e) {
    console.error('Failed to load journey from localStorage:', e)
    return null
  }
}

export function clearJourneyFromStorage(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear journey from localStorage:', e)
  }
}
