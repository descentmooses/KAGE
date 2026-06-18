import { useMemo } from 'react'
import type {
  AppSettings,
  AreaId,
  DailyLog,
  GamificationState,
  Goal,
  LogSource,
  MorningLogEntry,
  Period,
  ReflectionEntry,
} from '../types'
import { filterLogsByPeriod, type Insight, type TrendPoint } from '../lib/insights'
import { evaluateQuests } from '../lib/quests'
import { useTracker } from './trackerContext'

export interface CelebrationEvent {
  id: string
  message: string
  type: 'success' | 'info'
}

export interface TrackerContextValue {
  ready: boolean
  todayLog: DailyLog | null
  ratings: { mind: number; body: number; spirit: number }
  core: number
  allLogs: DailyLog[]
  trend: TrendPoint[]
  insights: Insight[]
  period: Period
  setPeriod: (p: Period) => void
  gamification: GamificationState
  goals: Goal[]
  settings: AppSettings
  morningToday: MorningLogEntry | null
  reflectionToday: ReflectionEntry | null
  quests: ReturnType<typeof evaluateQuests>
  celebration: CelebrationEvent | null
  clearCelebration: () => void
  pendingVoiceNote: string | null
  setPendingVoiceNote: (text: string | null) => void
  logRating: (area: AreaId, value: number, source?: LogSource) => Promise<void>
  quickBump: (area: AreaId, delta?: number) => Promise<void>
  saveTodayShadow: (
    ratings: Record<AreaId, number>,
    notes?: string,
    source?: LogSource,
  ) => Promise<void>
  claimQuest: (questId: string) => Promise<void>
  saveMorning: (energy: number, intention: string, discipline: string) => Promise<void>
  saveReflection: (ratings: Record<AreaId, number>, journal: string) => Promise<void>
  addGoal: (data: {
    title: string
    category: Goal['category']
    target?: string
    targetDate?: string
    milestones?: Goal['milestones']
  }) => Promise<void>
  updateGoal: (
    id: string,
    patch: Partial<
      Pick<Goal, 'title' | 'category' | 'target' | 'targetDate' | 'progress' | 'milestones'>
    >,
  ) => Promise<void>
  updateGoalProgress: (id: string, progress: number) => Promise<void>
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>
  removeGoal: (id: string) => Promise<void>
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>
  saveWhisper: (text: string) => Promise<void>
  toggleFavoriteWhisper: (text: string) => Promise<void>
  exportData: () => Promise<void>
  importData: (file: File) => Promise<void>
  resetDemoData: () => Promise<void>
  refresh: () => Promise<void>
}

export function usePeriodLogs() {
  const { allLogs, period } = useTracker()
  return useMemo(() => filterLogsByPeriod(allLogs, period), [allLogs, period])
}
