import type { DailyLog, GamificationState, ShadowRank } from '../types'
import { todayKey } from './dates'

export const RANKS: { rank: ShadowRank; minLevel: number }[] = [
  { rank: 'Initiate', minLevel: 1 },
  { rank: 'Shade', minLevel: 3 },
  { rank: 'Phantom', minLevel: 6 },
  { rank: 'Wraith', minLevel: 10 },
  { rank: 'Oni', minLevel: 15 },
  { rank: 'Kage', minLevel: 22 },
]

export const DEFAULT_GAMIFICATION: GamificationState = {
  xp: 0,
  level: 1,
  rank: 'Initiate',
  currentStreak: 0,
  longestStreak: 0,
  lastLogDate: null,
  questDate: null,
  completedQuestIds: [],
}

export function xpForLevel(level: number): number {
  return level * 120
}

export function rankForLevel(level: number): ShadowRank {
  let rank: ShadowRank = 'Initiate'
  for (const entry of RANKS) {
    if (level >= entry.minLevel) rank = entry.rank
  }
  return rank
}

export function levelFromXp(xp: number): number {
  let level = 1
  let remaining = xp
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level)
    level += 1
  }
  return level
}

export function addXp(state: GamificationState, amount: number): GamificationState {
  const xp = state.xp + amount
  const level = levelFromXp(xp)
  return { ...state, xp, level, rank: rankForLevel(level) }
}

export interface GamificationDelta {
  state: GamificationState
  leveledUp: boolean
  rankUp: boolean
  previousLevel: number
  previousRank: ShadowRank
}

/** Apply XP and report whether level or rank changed (for celebration toasts). */
export function applyXpDelta(
  state: GamificationState,
  amount: number,
): GamificationDelta {
  const previousLevel = state.level
  const previousRank = state.rank
  const next = addXp(state, amount)
  return {
    state: next,
    leveledUp: next.level > previousLevel,
    rankUp: next.rank !== previousRank,
    previousLevel,
    previousRank,
  }
}

/** Reset quest completion when the calendar day changes. */
export function resetQuestsIfNewDay(
  state: GamificationState,
  date = todayKey(),
): GamificationState {
  if (state.questDate === date) return state
  return { ...state, questDate: date, completedQuestIds: [] }
}

export function updateStreak(
  state: GamificationState,
  logDate: string = todayKey(),
): GamificationState {
  if (state.lastLogDate === logDate) return state

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = yesterday.toISOString().slice(0, 10)

  let currentStreak = 1
  if (state.lastLogDate === yesterdayKey) {
    currentStreak = state.currentStreak + 1
  }

  return {
    ...state,
    lastLogDate: logDate,
    currentStreak,
    longestStreak: Math.max(state.longestStreak, currentStreak),
  }
}

export function xpForDailyLog(log: DailyLog): number {
  const avg = (log.mind + log.body + log.spirit) / 3
  return Math.round(25 + avg * 8)
}

export function xpForMorning(): number {
  return 40
}

export function xpProgressInLevel(xp: number, level: number): number {
  let spent = 0
  for (let l = 1; l < level; l++) spent += xpForLevel(l)
  const inLevel = Math.max(0, xp - spent)
  return inLevel / xpForLevel(level)
}

export function xpForReflection(): number {
  return 50
}
