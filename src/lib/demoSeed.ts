import type {
  AppSettings,
  DailyLog,
  GamificationState,
  Goal,
  MorningLogEntry,
  ReflectionEntry,
} from '../types'
import { computeCore } from '../types'
import { DEFAULT_GAMIFICATION } from './gamification'
import { daysAgo, todayKey } from './dates'
import { getDb } from './db'
import { getGitHubSyncConfig } from './github/githubSyncStorage'

function isoAt(date: string, hour: number): string {
  return `${date}T${String(hour).padStart(2, '0')}:30:00.000Z`
}

function buildDemoLogs(): DailyLog[] {
  const samples: Array<{ mind: number; body: number; spirit: number; notes?: string }> = [
    { mind: 7, body: 6, spirit: 8, notes: 'Steady focus day — gym and reading.' },
    { mind: 6, body: 7, spirit: 7, notes: 'Good movement, scattered afternoon.' },
    { mind: 8, body: 5, spirit: 7, notes: 'Deep work block in the morning.' },
    { mind: 5, body: 6, spirit: 6, notes: 'Recovery day — honest low scores.' },
    { mind: 7, body: 8, spirit: 8, notes: 'Strong body day, grateful evening.' },
    { mind: 8, body: 7, spirit: 9, notes: 'Family dinner grounded the night.' },
    { mind: 7, body: 7, spirit: 8, notes: 'Demo archive — explore freely.' },
  ]

  return samples.map((sample, index) => {
    const offset = samples.length - 1 - index
    const date = offset === 0 ? todayKey() : daysAgo(offset)
    const { mind, body, spirit, notes } = sample
    return {
      date,
      mind,
      body,
      spirit,
      core: computeCore(mind, body, spirit),
      notes,
      source: 'import' as const,
      loggedAt: isoAt(date, 12 + index),
    }
  })
}

function buildDemoGoals(): Goal[] {
  const created = daysAgo(10)
  return [
    {
      id: 'demo-goal-health',
      title: 'Morning movement ritual',
      category: 'health',
      progress: 40,
      milestones: [
        { id: 'm1', label: '10 sessions logged', done: true },
        { id: 'm2', label: '30-day streak', done: false },
        { id: 'm3', label: 'Feel stronger in body pillar', done: false },
      ],
      createdAt: isoAt(created, 9),
    },
    {
      id: 'demo-goal-craft',
      title: 'Ship one creative project',
      category: 'craft',
      progress: 25,
      milestones: [
        { id: 'm4', label: 'Outline the idea', done: true },
        { id: 'm5', label: 'First working draft', done: false },
      ],
      createdAt: isoAt(created, 10),
    },
  ]
}

function buildDemoMorningLogs(): MorningLogEntry[] {
  return [
    {
      id: 'demo-morning-1',
      date: daysAgo(1),
      energy: 7,
      intention: 'Stay present and protect a deep work block',
      discipline: 'Phone stays in another room until noon',
      loggedAt: isoAt(daysAgo(1), 7),
    },
    {
      id: 'demo-morning-2',
      date: todayKey(),
      energy: 8,
      intention: 'Lead with clarity — one honest log at a time',
      discipline: 'Ten minutes of stillness before messages',
      loggedAt: isoAt(todayKey(), 7),
    },
  ]
}

function buildDemoReflectionLogs(): ReflectionEntry[] {
  return [
    {
      id: 'demo-reflect-1',
      date: daysAgo(1),
      mind: 7,
      body: 6,
      spirit: 8,
      journal: 'Grateful for small wins. Tomorrow I protect sleep earlier.',
      loggedAt: isoAt(daysAgo(1), 21),
    },
    {
      id: 'demo-reflect-2',
      date: daysAgo(2),
      mind: 6,
      body: 7,
      spirit: 7,
      journal: 'Body felt strong. Mind wandered — logging brought me back.',
      loggedAt: isoAt(daysAgo(2), 22),
    },
  ]
}

function buildDemoGamification(): GamificationState {
  return {
    ...DEFAULT_GAMIFICATION,
    xp: 340,
    level: 2,
    rank: 'Shade',
    currentStreak: 5,
    longestStreak: 5,
    lastLogDate: todayKey(),
    questDate: todayKey(),
    completedQuestIds: [],
  }
}

function buildDemoSettings(): AppSettings {
  return {
    affirmationsEnabled: true,
    elaraWhispers: true,
    whisperHistory: [],
    favoriteWhispers: [],
    demoMode: true,
    tutorialComplete: false,
    tutorialStep: 0,
    hasOnboarded: false,
  }
}

/** Wipe and load sample logs, rituals, goals, and gamification for exploration. */
export async function seedDemoData(): Promise<void> {
  const logs = buildDemoLogs()
  const goals = buildDemoGoals()
  const morningLogs = buildDemoMorningLogs()
  const reflectionLogs = buildDemoReflectionLogs()
  const gamification = buildDemoGamification()
  const settings = buildDemoSettings()

  const db = await getDb()
  const tx = db.transaction(
    ['dailyLogs', 'morningLogs', 'reflectionLogs', 'goals', 'meta'],
    'readwrite',
  )

  await tx.objectStore('dailyLogs').clear()
  await tx.objectStore('morningLogs').clear()
  await tx.objectStore('reflectionLogs').clear()
  await tx.objectStore('goals').clear()

  for (const log of logs) await tx.objectStore('dailyLogs').put(log)
  for (const goal of goals) await tx.objectStore('goals').put(goal)
  for (const entry of morningLogs) await tx.objectStore('morningLogs').put(entry)
  for (const entry of reflectionLogs) await tx.objectStore('reflectionLogs').put(entry)

  await tx.objectStore('meta').put(gamification, 'gamification')
  await tx.objectStore('meta').put(settings, 'settings')
  await tx.done
}

/** True when a PAT and vault repo are stored locally. */
export async function isGitHubVaultConnected(): Promise<boolean> {
  const config = await getGitHubSyncConfig()
  return !!(config?.token?.trim() && config?.repoName?.trim())
}

/** Empty archive for a real user journey (leaves tutorial complete). */
export async function startRealArchive(): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(
    ['dailyLogs', 'morningLogs', 'reflectionLogs', 'goals', 'meta'],
    'readwrite',
  )

  await tx.objectStore('dailyLogs').clear()
  await tx.objectStore('morningLogs').clear()
  await tx.objectStore('reflectionLogs').clear()
  await tx.objectStore('goals').clear()

  await tx.objectStore('meta').put(DEFAULT_GAMIFICATION, 'gamification')
  await tx.objectStore('meta').put(
    {
      affirmationsEnabled: true,
      elaraWhispers: true,
      whisperHistory: [],
      favoriteWhispers: [],
      demoMode: false,
      tutorialComplete: true,
      hasOnboarded: true,
    },
    'settings',
  )
  await tx.done
}

/** Stop Elara tutorial prompts immediately (before archive wipe). */
export async function dismissTutorialPrompts(tutorialStep: number): Promise<void> {
  const db = await getDb()
  const current = (await db.get('meta', 'settings')) as AppSettings | undefined
  await db.put(
    'meta',
    {
      ...current,
      affirmationsEnabled: current?.affirmationsEnabled ?? true,
      elaraWhispers: current?.elaraWhispers ?? true,
      demoMode: false,
      tutorialComplete: true,
      hasOnboarded: true,
      tutorialStep,
    },
    'settings',
  )
}

/** Users who finished the tour but still have demoMode (e.g. stale UI or v0.8.3). */
export async function repairStuckDemoGraduation(): Promise<boolean> {
  const db = await getDb()
  const settings = (await db.get('meta', 'settings')) as AppSettings | undefined
  if (!settings?.demoMode || !settings.tutorialComplete) return false
  const step = settings.tutorialStep && settings.tutorialStep > 0 ? settings.tutorialStep : 8
  await graduateFromDemo(step)
  return true
}

export async function graduateFromDemo(tutorialStep: number): Promise<{ resetArchive: boolean }> {
  await dismissTutorialPrompts(tutorialStep)

  const connected = await isGitHubVaultConnected()
  if (!connected) {
    await startRealArchive()
    return { resetArchive: true }
  }

  return { resetArchive: false }
}

export async function shouldSeedDemoOnLaunch(): Promise<boolean> {
  const db = await getDb()
  const logs = await db.getAll('dailyLogs')
  const settings = (await db.get('meta', 'settings')) as AppSettings | undefined
  return logs.length === 0 && !settings?.demoMode
}
