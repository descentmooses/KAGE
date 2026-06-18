import type { AreaId } from './pillars'

export type LogSource = 'quick' | 'reflect' | 'morning' | 'import' | 'voice'

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

/** Trend chart window selector. */
export type Period = 'daily' | 'weekly' | 'monthly'

export type PillarRatings = Record<AreaId, number>
