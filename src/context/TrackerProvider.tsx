import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { TrackerContext } from './trackerContext'
import type { TrackerContextValue } from './trackerTypes'
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
import {
  addMorningLog,
  addReflectionLog,
  deleteGoal,
  exportAllData,
  getAllDailyLogs,
  getDailyLog,
  getGamification,
  getGoals,
  getMorningLogByDate,
  getReflectionLogByDate,
  getSettings,
  importAllData,
  putDailyLog,
  putGamification,
  putGoal,
  putSettings,
} from '../lib/db'
import { DEFAULT_RATINGS, computeCore } from '../types'
import { migrateFromLocalStorage } from '../lib/migrate'
import { todayKey } from '../lib/dates'
import {
  addXp,
  updateStreak,
  xpForDailyLog,
  xpForMorning,
  xpForReflection,
} from '../lib/gamification'
import { buildTrend, generateInsights } from '../lib/insights'
import { DAILY_QUESTS, evaluateQuests } from '../lib/quests'

function uid() {
  return crypto.randomUUID()
}

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null)
  const [allLogs, setAllLogs] = useState<DailyLog[]>([])
  const [gamification, setGamification] = useState<GamificationState | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [morningToday, setMorningToday] = useState<MorningLogEntry | null>(null)
  const [reflectionToday, setReflectionToday] = useState<ReflectionEntry | null>(null)
  const [period, setPeriod] = useState<Period>('weekly')

  const refresh = useCallback(async () => {
    const date = todayKey()
    const [log, logs, g, goalList, s, morning, reflection] = await Promise.all([
      getDailyLog(date),
      getAllDailyLogs(),
      getGamification(),
      getGoals(),
      getSettings(),
      getMorningLogByDate(date),
      getReflectionLogByDate(date),
    ])
    setTodayLog(log)
    setAllLogs(logs)
    setGamification(g)
    setGoals(goalList)
    setSettings(s)
    setMorningToday(morning)
    setReflectionToday(reflection)
  }, [])

  useEffect(() => {
    void (async () => {
      await migrateFromLocalStorage()
      await refresh()
      setReady(true)
    })()
  }, [refresh])

  const ratings = useMemo(
    () => ({
      mind: todayLog?.mind ?? DEFAULT_RATINGS.mind,
      body: todayLog?.body ?? DEFAULT_RATINGS.body,
      spirit: todayLog?.spirit ?? DEFAULT_RATINGS.spirit,
    }),
    [todayLog],
  )

  const core = useMemo(
    () => computeCore(ratings.mind, ratings.body, ratings.spirit),
    [ratings],
  )

  const trend = useMemo(() => buildTrend(allLogs, 7), [allLogs])
  const insights = useMemo(() => generateInsights(allLogs), [allLogs])

  const quests = useMemo(
    () =>
      evaluateQuests(
        {
          todayLog,
          morningLogged: !!morningToday,
          reflectionLogged: !!reflectionToday,
        },
        gamification?.completedQuestIds ?? [],
      ),
    [todayLog, morningToday, reflectionToday, gamification],
  )

  const persistLog = useCallback(
    async (patch: Partial<DailyLog> & { mind: number; body: number; spirit: number }, source: LogSource) => {
      const date = todayKey()
      const log: DailyLog = {
        date,
        mind: patch.mind,
        body: patch.body,
        spirit: patch.spirit,
        core: computeCore(patch.mind, patch.body, patch.spirit),
        notes: patch.notes,
        source,
        loggedAt: new Date().toISOString(),
      }
      await putDailyLog(log)

      let g = await getGamification()
      if (g.questDate !== date) {
        g = { ...g, questDate: date, completedQuestIds: [] }
      }
      const hadLog = await getDailyLog(date)
      if (!hadLog) {
        g = updateStreak(g, date)
      }
      g = addXp(g, xpForDailyLog(log))

      const completed = new Set(g.completedQuestIds)
      for (const quest of DAILY_QUESTS) {
        if (
          quest.check({
            todayLog: log,
            morningLogged: !!morningToday,
            reflectionLogged: !!reflectionToday,
          })
        ) {
          if (!completed.has(quest.id)) {
            completed.add(quest.id)
            g = addXp(g, quest.xp)
          }
        }
      }
      g = { ...g, completedQuestIds: [...completed] }
      await putGamification(g)
      await refresh()
      return log
    },
    [morningToday, reflectionToday, refresh],
  )

  const logRating = useCallback(
    async (area: AreaId, value: number, source: LogSource = 'quick') => {
      await persistLog({ ...ratings, [area]: value }, source)
    },
    [persistLog, ratings],
  )

  const quickBump = useCallback(
    async (area: AreaId, delta = 1) => {
      const next = Math.min(10, Math.max(1, ratings[area] + delta))
      await logRating(area, next, 'quick')
    },
    [logRating, ratings],
  )

  const saveMorning = useCallback(
    async (energy: number, intention: string, discipline: string) => {
      const date = todayKey()
      const entry: MorningLogEntry = {
        id: uid(),
        date,
        energy,
        intention: intention.trim(),
        discipline: discipline.trim(),
        loggedAt: new Date().toISOString(),
      }
      await addMorningLog(entry)
      let g = await getGamification()
      g = addXp(g, xpForMorning())
      await putGamification(g)
      await refresh()
    },
    [refresh],
  )

  const saveReflection = useCallback(
    async (r: Record<AreaId, number>, journal: string) => {
      const date = todayKey()
      const entry: ReflectionEntry = {
        id: uid(),
        date,
        mind: r.mind,
        body: r.body,
        spirit: r.spirit,
        journal: journal.trim(),
        loggedAt: new Date().toISOString(),
      }
      await addReflectionLog(entry)
      await persistLog(
        { mind: r.mind, body: r.body, spirit: r.spirit, notes: journal },
        'reflect',
      )
      let g = await getGamification()
      g = addXp(g, xpForReflection())
      await putGamification(g)
      await refresh()
    },
    [persistLog, refresh],
  )

  const addGoal = useCallback(
    async (title: string, category: Goal['category'], target?: string) => {
      const goal: Goal = {
        id: uid(),
        title,
        category,
        target,
        progress: 0,
        createdAt: new Date().toISOString(),
      }
      await putGoal(goal)
      await refresh()
    },
    [refresh],
  )

  const updateGoalProgress = useCallback(
    async (id: string, progress: number) => {
      const goal = goals.find((g) => g.id === id)
      if (!goal) return
      await putGoal({ ...goal, progress: Math.min(100, Math.max(0, progress)) })
      await refresh()
    },
    [goals, refresh],
  )

  const removeGoal = useCallback(
    async (id: string) => {
      await deleteGoal(id)
      await refresh()
    },
    [refresh],
  )

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      const current = (await getSettings()) ?? settings!
      const next = { ...current, ...patch }
      await putSettings(next)
      await refresh()
    },
    [refresh, settings],
  )

  const exportData = useCallback(async () => {
    const data = await exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kage-export-${todayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const importData = useCallback(
    async (file: File) => {
      const text = await file.text()
      const payload = JSON.parse(text)
      await importAllData(payload)
      await refresh()
    },
    [refresh],
  )

  if (!ready || !gamification || !settings) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050505',
          color: '#c41e3a',
          fontFamily: '"Orbitron", sans-serif',
          letterSpacing: '0.5em',
          fontSize: 12,
        }}
      >
        KAGE
      </div>
    )
  }

  const value: TrackerContextValue = {
    ready,
    todayLog,
    ratings,
    core,
    allLogs,
    trend,
    insights,
    period,
    setPeriod,
    gamification,
    goals,
    settings,
    morningToday,
    reflectionToday,
    quests,
    logRating,
    quickBump,
    saveMorning,
    saveReflection,
    addGoal,
    updateGoalProgress,
    removeGoal,
    updateSettings,
    exportData,
    importData,
    refresh,
  }

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
}
