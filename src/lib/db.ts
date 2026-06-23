import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type {
  AppSettings,
  DailyLog,
  GamificationState,
  Goal,
  MorningLogEntry,
  ReflectionEntry,
} from '../types'
import { DEFAULT_GAMIFICATION } from './gamification'
import { normalizeGoal } from './goals'

interface KageDB extends DBSchema {
  dailyLogs: {
    key: string
    value: DailyLog
  }
  morningLogs: {
    key: string
    value: MorningLogEntry
    indexes: { 'by-date': string }
  }
  reflectionLogs: {
    key: string
    value: ReflectionEntry
    indexes: { 'by-date': string }
  }
  goals: {
    key: string
    value: Goal
  }
  meta: {
    key: string
    value: unknown
  }
}

const DB_NAME = 'kage-tracker'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<KageDB>> | null = null

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<KageDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('dailyLogs', { keyPath: 'date' })
        const morning = db.createObjectStore('morningLogs', { keyPath: 'id' })
        morning.createIndex('by-date', 'date')
        const reflection = db.createObjectStore('reflectionLogs', { keyPath: 'id' })
        reflection.createIndex('by-date', 'date')
        db.createObjectStore('goals', { keyPath: 'id' })
        db.createObjectStore('meta')
      },
    })
  }
  return dbPromise
}

export async function getDailyLog(date: string): Promise<DailyLog | null> {
  const db = await getDb()
  return (await db.get('dailyLogs', date)) ?? null
}

export async function getAllDailyLogs(): Promise<DailyLog[]> {
  const db = await getDb()
  const logs = await db.getAll('dailyLogs')
  return logs.sort((a, b) => a.date.localeCompare(b.date))
}

export async function putDailyLog(log: DailyLog): Promise<void> {
  const db = await getDb()
  await db.put('dailyLogs', log)
}

export async function addMorningLog(entry: MorningLogEntry): Promise<void> {
  const db = await getDb()
  await db.put('morningLogs', entry)
}

export async function getMorningLogByDate(date: string): Promise<MorningLogEntry | null> {
  const db = await getDb()
  const items = await db.getAllFromIndex('morningLogs', 'by-date', date)
  return items.sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))[0] ?? null
}

export async function getAllMorningLogs(): Promise<MorningLogEntry[]> {
  const db = await getDb()
  return (await db.getAll('morningLogs')).sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))
}

export async function addReflectionLog(entry: ReflectionEntry): Promise<void> {
  const db = await getDb()
  await db.put('reflectionLogs', entry)
}

export async function getReflectionLogByDate(date: string): Promise<ReflectionEntry | null> {
  const db = await getDb()
  const items = await db.getAllFromIndex('reflectionLogs', 'by-date', date)
  return items.sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))[0] ?? null
}

export async function getAllReflectionLogs(): Promise<ReflectionEntry[]> {
  const db = await getDb()
  return (await db.getAll('reflectionLogs')).sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))
}

export async function getGoals(): Promise<Goal[]> {
  const db = await getDb()
  return await db.getAll('goals')
}

export async function putGoal(goal: Goal): Promise<void> {
  const db = await getDb()
  await db.put('goals', goal)
}

export async function deleteGoal(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('goals', id)
}

export async function getGamification(): Promise<GamificationState> {
  const db = await getDb()
  return (
    ((await db.get('meta', 'gamification')) as GamificationState | undefined) ??
    DEFAULT_GAMIFICATION
  )
}

export async function putGamification(state: GamificationState): Promise<void> {
  const db = await getDb()
  await db.put('meta', state, 'gamification')
}

export async function getSettings(): Promise<AppSettings> {
  const db = await getDb()
  return (
    ((await db.get('meta', 'settings')) as AppSettings | undefined) ?? {
      affirmationsEnabled: true,
      elaraWhispers: true,
      whisperHistory: [],
      favoriteWhispers: [],
      hasOnboarded: false,
    }
  )
}

export async function putSettings(settings: AppSettings): Promise<void> {
  const db = await getDb()
  await db.put('meta', settings, 'settings')
}

export async function exportAllData() {
  const [dailyLogs, morningLogs, reflectionLogs, goals, gamification, settings] =
    await Promise.all([
      getAllDailyLogs(),
      getAllMorningLogs(),
      getAllReflectionLogs(),
      getGoals(),
      getGamification(),
      getSettings(),
    ])
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    dailyLogs,
    morningLogs,
    reflectionLogs,
    goals,
    gamification,
    settings,
  }
}

export async function importAllData(payload: Awaited<ReturnType<typeof exportAllData>>) {
  const db = await getDb()
  const tx = db.transaction(
    ['dailyLogs', 'morningLogs', 'reflectionLogs', 'goals', 'meta'],
    'readwrite',
  )
  await tx.objectStore('dailyLogs').clear()
  await tx.objectStore('morningLogs').clear()
  await tx.objectStore('reflectionLogs').clear()
  await tx.objectStore('goals').clear()

  for (const log of payload.dailyLogs) await tx.objectStore('dailyLogs').put(log)
  for (const log of payload.morningLogs) await tx.objectStore('morningLogs').put(log)
  for (const log of payload.reflectionLogs) await tx.objectStore('reflectionLogs').put(log)
  for (const goal of payload.goals) await tx.objectStore('goals').put(normalizeGoal(goal))
  await tx.objectStore('meta').put(payload.gamification, 'gamification')
  await tx.objectStore('meta').put(payload.settings, 'settings')
  await tx.done
}

/** Wipe all user data and restore default gamification + settings. */
export async function clearAllData(): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(
    ['dailyLogs', 'morningLogs', 'reflectionLogs', 'goals', 'meta'],
    'readwrite',
  )
  await tx.objectStore('dailyLogs').clear()
  await tx.objectStore('morningLogs').clear()
  await tx.objectStore('reflectionLogs').clear()
  await tx.objectStore('goals').clear()
  await tx.objectStore('meta').clear()
  await tx.objectStore('meta').put(DEFAULT_GAMIFICATION, 'gamification')
  await tx.objectStore('meta').put(
    {
      affirmationsEnabled: true,
      elaraWhispers: true,
      whisperHistory: [],
      favoriteWhispers: [],
      hasOnboarded: false,
    },
    'settings',
  )
  await tx.done
}
