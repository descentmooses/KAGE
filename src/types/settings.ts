import type { ElaraPersona } from './elaraPersona'

export interface AppSettings {
  affirmationsEnabled: boolean
  elaraWhispers: boolean
  whisperHistory?: string[]
  favoriteWhispers?: string[]
  elaraPersona?: ElaraPersona
  demoMode?: boolean
  tutorialComplete?: boolean
  tutorialStep?: number
  hasOnboarded?: boolean
  whatsNewSeen?: string
  githubConnectPromptDismissed?: boolean
}
