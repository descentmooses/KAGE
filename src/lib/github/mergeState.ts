import type { AppSettings, DailyLog, Goal } from '../../types'
import type { KageSyncPayload } from './types'
import { normalizeGoal } from '../goals'
import { mergeElaraPersona } from '../elaraPersona'

function pickNewerLog(a: DailyLog, b: DailyLog): DailyLog {
  return a.loggedAt >= b.loggedAt ? a : b
}

function pickNewerGoal(a: Goal, b: Goal): Goal {
  const aTime = a.completedAt ?? a.createdAt
  const bTime = b.completedAt ?? b.createdAt
  if (a.progress !== b.progress) return a.progress >= b.progress ? a : b
  return aTime >= bTime ? a : b
}

function mergeByKey<T extends { id: string }>(
  local: T[],
  remote: T[],
  pick: (a: T, b: T) => T,
): T[] {
  const map = new Map<string, T>()
  for (const item of local) map.set(item.id, item)
  for (const item of remote) {
    const existing = map.get(item.id)
    map.set(item.id, existing ? pick(existing, item) : item)
  }
  return [...map.values()]
}

function mergeDailyLogs(local: DailyLog[], remote: DailyLog[]): DailyLog[] {
  const map = new Map<string, DailyLog>()
  for (const log of local) map.set(log.date, log)
  for (const log of remote) {
    const existing = map.get(log.date)
    map.set(log.date, existing ? pickNewerLog(existing, log) : log)
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date))
}

function mergeGoals(local: Goal[], remote: Goal[]): Goal[] {
  return mergeByKey(
    local.map(normalizeGoal),
    remote.map(normalizeGoal),
    pickNewerGoal,
  )
}

function mergeStringArrays(a: string[] = [], b: string[] = []): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of [...a, ...b]) {
    if (!seen.has(item)) {
      seen.add(item)
      out.push(item)
    }
  }
  return out.slice(-24)
}

function mergeSettings(local: AppSettings, remote: AppSettings): AppSettings {
  const merged: AppSettings = {
    ...local,
    ...remote,
    whisperHistory: mergeStringArrays(local.whisperHistory, remote.whisperHistory),
    favoriteWhispers: mergeStringArrays(local.favoriteWhispers, remote.favoriteWhispers),
    elaraPersona: mergeElaraPersona(local.elaraPersona, remote.elaraPersona),
  }

  // Tutorial graduation is local — never let a remote demo snapshot re-enable demo mode.
  if (local.tutorialComplete && local.demoMode === false) {
    merged.tutorialComplete = true
    merged.demoMode = false
  } else if (local.tutorialComplete) {
    merged.tutorialComplete = true
  }

  return merged
}

/** Timestamp-aware merge — keeps the newest record per entity. */
export function mergeSyncPayloads(
  local: KageSyncPayload,
  remote: KageSyncPayload,
): KageSyncPayload {
  const localTime = Date.parse(local.exportedAt)
  const remoteTime = Date.parse(remote.exportedAt)

  const gamification = { ...local.gamification }
  if (remote.gamification.xp > gamification.xp) {
    gamification.xp = remote.gamification.xp
    gamification.level = remote.gamification.level
    gamification.rank = remote.gamification.rank
  }
  gamification.currentStreak = Math.max(
    local.gamification.currentStreak,
    remote.gamification.currentStreak,
  )
  gamification.longestStreak = Math.max(
    local.gamification.longestStreak,
    remote.gamification.longestStreak,
  )
  gamification.lastLogDate =
    [local.gamification.lastLogDate, remote.gamification.lastLogDate]
      .filter(Boolean)
      .sort()
      .at(-1) ?? gamification.lastLogDate

  return {
    version: 2,
    exportedAt: new Date(Math.max(localTime, remoteTime)).toISOString(),
    dailyLogs: mergeDailyLogs(local.dailyLogs, remote.dailyLogs),
    morningLogs: mergeByKey(local.morningLogs, remote.morningLogs, (a, b) =>
      a.loggedAt >= b.loggedAt ? a : b,
    ),
    reflectionLogs: mergeByKey(local.reflectionLogs, remote.reflectionLogs, (a, b) =>
      a.loggedAt >= b.loggedAt ? a : b,
    ),
    goals: mergeGoals(local.goals, remote.goals),
    gamification,
    settings: mergeSettings(local.settings, remote.settings),
  }
}
