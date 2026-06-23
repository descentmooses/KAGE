import type { ElaraPersona } from './elaraPersona'

export interface AppSettings {
  affirmationsEnabled: boolean
  elaraWhispers: boolean
  voiceEnabled: boolean
  whisperHistory?: string[]
  favoriteWhispers?: string[]
  elaraPersona?: ElaraPersona
  hasOnboarded?: boolean
  whatsNewSeen?: string
  githubConnectPromptDismissed?: boolean
}
