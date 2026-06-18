export type TabId = 'home' | 'activate' | 'reflect' | 'codex'

export type AreaId = 'mind' | 'body' | 'spirit'

export type Period = 'daily' | 'weekly' | 'monthly'

export type GoalCategory = 'wealth' | 'health' | 'family' | 'craft' | 'custom'

export type ShadowRank =
  | 'Initiate'
  | 'Shade'
  | 'Phantom'
  | 'Wraith'
  | 'Oni'
  | 'Kage'

export type LogSource = 'quick' | 'reflect' | 'morning' | 'import' | 'voice'

export interface Ratings {
  mind: number | null
  body: number | null
  spirit: number | null
}

export interface DailyLog {
  date: string
  mind: number
  body: number
  spirit: number
  core: number
  notes?: string
  source: LogSource
  loggedAt: string
}

export interface MorningLogEntry {
  id: string
  date: string
  energy: number
  intention: string
  discipline: string
  loggedAt: string
}

export interface ReflectionEntry {
  id: string
  date: string
  mind: number
  body: number
  spirit: number
  journal: string
  loggedAt: string
}

export interface GoalMilestone {
  id: string
  label: string
  done: boolean
}

export interface Goal {
  id: string
  title: string
  category: GoalCategory
  target?: string
  targetDate?: string
  milestones: GoalMilestone[]
  progress: number
  createdAt: string
  completedAt?: string
}

export interface DailyQuest {
  id: string
  title: string
  description: string
  xp: number
  check: (ctx: QuestContext) => boolean
}

export interface QuestContext {
  todayLog: DailyLog | null
  morningLogged: boolean
  reflectionLogged: boolean
  goals?: Goal[]
}

export interface GamificationState {
  xp: number
  level: number
  rank: ShadowRank
  currentStreak: number
  longestStreak: number
  lastLogDate: string | null
  questDate: string | null
  completedQuestIds: string[]
}

export interface AppSettings {
  affirmationsEnabled: boolean
  elaraWhispers: boolean
  voiceEnabled: boolean
  whisperHistory?: string[]
  favoriteWhispers?: string[]
  hasOnboarded?: boolean
  whatsNewSeen?: string
}

export interface AreaConfig {
  id: AreaId
  label: string
  kanji: string
  color: 'crimson' | 'ember'
  hint: string
}

export interface TabConfig {
  id: TabId
  label: string
  kanji: string
}

export const AREA_CONFIGS: AreaConfig[] = [
  {
    id: 'mind',
    label: 'Mind',
    kanji: '心',
    color: 'crimson',
    hint: 'Meditation, focus, learning',
  },
  {
    id: 'body',
    label: 'Body',
    kanji: '体',
    color: 'ember',
    hint: 'Gym, macros, sleep recovery',
  },
  {
    id: 'spirit',
    label: 'Spirit',
    kanji: '魂',
    color: 'crimson',
    hint: 'Gratitude, family, purpose',
  },
]

export const DEFAULT_RATINGS = { mind: 7, body: 7, spirit: 7 } as const

export function computeCore(mind: number, body: number, spirit: number): number {
  return Math.round(((mind + body + spirit) / 3) * 10)
}
