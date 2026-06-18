import type { DailyLog } from './logs'
import type { Goal } from './goals'

export type ShadowRank =
  | 'Initiate'
  | 'Shade'
  | 'Phantom'
  | 'Wraith'
  | 'Oni'
  | 'Kage'

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

export interface QuestContext {
  todayLog: DailyLog | null
  morningLogged: boolean
  reflectionLogged: boolean
  goals?: Goal[]
}

export interface DailyQuest {
  id: string
  title: string
  description: string
  xp: number
  check: (ctx: QuestContext) => boolean
}
