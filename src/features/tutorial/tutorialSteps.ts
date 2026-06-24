import type { TabId } from '../../types'

export type TutorialTarget =
  | 'home-core'
  | 'home-quick-log'
  | 'home-goals'
  | 'nav-activate'
  | 'nav-reflect'
  | 'nav-codex'
  | null

export interface TutorialStep {
  id: string
  tab: TabId
  title: string
  elara: string
  target: TutorialTarget
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    tab: 'home',
    title: 'Welcome to KAGE',
    target: null,
    elara:
      'I am Elara — I witness what you log here. This is demo mode: a sample shadow archive so you can learn without pressure. Walk with me.',
  },
  {
    id: 'core',
    tab: 'home',
    title: 'Your Core',
    target: 'home-core',
    elara:
      'Home is your command center. Core blends Mind, Body, and Spirit into one score — your daily shadow state at a glance.',
  },
  {
    id: 'quick-log',
    tab: 'home',
    title: 'Quick log',
    target: 'home-quick-log',
    elara:
      'Tap a pillar to log fast. Swipe right for a strong day, left to fine-tune. Every honest tap trains the archive — and me.',
  },
  {
    id: 'goals',
    tab: 'home',
    title: 'Trends & goals',
    target: 'home-goals',
    elara:
      'Scroll for trends, freedom goals, and the full log form. Goals are seeds — wealth, health, family, craft — that I learn over time.',
  },
  {
    id: 'activate',
    tab: 'activate',
    title: 'Morning activation',
    target: 'nav-activate',
    elara:
      'Morning Activation seals intention before the day accelerates: breathe, score your energy, name one discipline.',
  },
  {
    id: 'reflect',
    tab: 'reflect',
    title: 'Evening reflection',
    target: 'nav-reflect',
    elara:
      'Evening Reflection closes the loop. Score the triad, journal one truth — honesty without performance.',
  },
  {
    id: 'codex',
    tab: 'codex',
    title: 'The Codex',
    target: 'nav-codex',
    elara:
      'The Codex holds stats, affirmations, and settings. Export your data anytime. You own every entry.',
  },
  {
    id: 'complete',
    tab: 'home',
    title: 'You are ready',
    target: null,
    elara:
      'You have seen the shadow archive. Open Settings and tap Start my archive when you are ready — your real pillars begin at zero. I will learn your rhythm from there.',
  },
]

export function tutorialTargetId(target: TutorialTarget): string | null {
  if (!target) return null
  return `tutorial-${target}`
}
