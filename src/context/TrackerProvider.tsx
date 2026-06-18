import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { TrackerContext } from './trackerContext'
import type { CelebrationEvent, TrackerContextValue } from './trackerTypes'
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
  clearAllData,
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
  applyXpDelta,
  resetQuestsIfNewDay,
  updateStreak,
  xpForDailyLog,
  xpForMorning,
  xpForReflection,
} from '../lib/gamification'
import { buildTrendForPeriod, generateInsights } from '../lib/insights'
import { normalizeGoal, progressFromMilestones } from '../lib/goals'
import { emitFirstShadowLog, emitShadowLogged } from '../lib/pwa/installUtils'
import { isStreakMilestone } from '../lib/affirmations'
import { LoadingScreen } from '../components/LoadingScreen'
import { DAILY_QUESTS, evaluateQuests, QUEST_BONUSES } from '../lib/quests'

function uid() {
  return crypto.randomUUID()
}

function celebrationId() {
  return crypto.randomUUID()
}

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null)
  const [allLogs, setAllLogs] = useState<DailyLog[]>([])
  const [gamification, setGamification] = useState<GamificationState | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [morningToday, setMorningToday] = useState<MorningLogEntry | null>(null)
  const [reflectionToday, setReflectionToday] = useState<ReflectionEntry | null>(null)
  const [period, setPeriod] = useState<Period>('weekly')
  const [celebration, setCelebration] = useState<CelebrationEvent | null>(null)
  const [pendingVoiceNote, setPendingVoiceNote] = useState<string | null>(null)

  const clearCelebration = useCallback(() => setCelebration(null), [])

  const pushCelebration = useCallback((message: string, type: CelebrationEvent['type'] = 'success') => {
    setCelebration({ id: celebrationId(), message, type })
  }, [])

  const refresh = useCallback(async () => {
    const date = todayKey()
    let g = await getGamification()
    const resetG = resetQuestsIfNewDay(g, date)
    if (resetG !== g) {
      await putGamification(resetG)
      g = resetG
    }

    const [log, logs, goalList, s, morning, reflection] = await Promise.all([
      getDailyLog(date),
      getAllDailyLogs(),
      getGoals(),
      getSettings(),
      getMorningLogByDate(date),
      getReflectionLogByDate(date),
    ])
    setTodayLog(log)
    setAllLogs(logs)
    setGamification(g)
    setGoals(goalList.map(normalizeGoal))
    setSettings(s)
    setMorningToday(morning)
    setReflectionToday(reflection)
    setLoadError(null)
  }, [])

  const bootstrap = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      await migrateFromLocalStorage()
      await refresh()
      setReady(true)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not open your shadow archive.'
      setLoadError(message)
      setReady(true)
    } finally {
      setLoading(false)
    }
  }, [refresh])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time IndexedDB bootstrap on mount
    void bootstrap()
  }, [bootstrap])

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

  const trend = useMemo(() => buildTrendForPeriod(allLogs, period), [allLogs, period])
  const insights = useMemo(() => generateInsights(allLogs), [allLogs])

  const questCtx = useMemo(
    () => ({
      todayLog,
      morningLogged: !!morningToday,
      reflectionLogged: !!reflectionToday,
      goals,
    }),
    [todayLog, morningToday, reflectionToday, goals],
  )

  const quests = useMemo(
    () =>
      evaluateQuests(
        questCtx,
        gamification?.completedQuestIds ?? [],
        gamification?.questDate ?? null,
      ),
    [questCtx, gamification],
  )

  const applyGamificationXp = useCallback(
    async (g: GamificationState, amount: number, successMessage?: string) => {
      const delta = applyXpDelta(g, amount)
      await putGamification(delta.state)
      if (delta.rankUp) {
        pushCelebration(`Rank ascended — ${delta.state.rank}`, 'success')
      } else if (delta.leveledUp) {
        pushCelebration(`Level ${delta.state.level} — the shadow deepens`, 'success')
      } else if (successMessage) {
        pushCelebration(successMessage, 'success')
      }
      return delta.state
    },
    [pushCelebration],
  )

  const persistLog = useCallback(
    async (
      patch: Partial<DailyLog> & { mind: number; body: number; spirit: number },
      source: LogSource,
      options?: { silent?: boolean; notes?: string },
    ) => {
      const date = todayKey()
      const existingLog = await getDailyLog(date)
      const priorLogs = await getAllDailyLogs()
      const wasFirstEver = priorLogs.length === 0 && !existingLog
      const log: DailyLog = {
        date,
        mind: patch.mind,
        body: patch.body,
        spirit: patch.spirit,
        core: computeCore(patch.mind, patch.body, patch.spirit),
        notes: options?.notes ?? patch.notes,
        source,
        loggedAt: new Date().toISOString(),
      }
      await putDailyLog(log)

      let g = resetQuestsIfNewDay(await getGamification(), date)
      if (!existingLog) {
        g = updateStreak(g, date)
        if (isStreakMilestone(g.currentStreak)) {
          pushCelebration(`${g.currentStreak} days — the flame holds steady`, 'success')
        }
      }
      if (log.core >= 85 && (!existingLog || existingLog.core < 85)) {
        pushCelebration('Core ascendant — peak shadow state', 'success')
      }
      const xpGain = xpForDailyLog(log)
      if (!options?.silent) {
        await applyGamificationXp(g, xpGain, `Shadow logged — +${xpGain} XP`)
      } else {
        await putGamification(applyXpDelta(g, xpGain).state)
      }
      await refresh()
      if (wasFirstEver) emitFirstShadowLog()
      if (!options?.silent) emitShadowLogged()
      return log
    },
    [applyGamificationXp, pushCelebration, refresh],
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

  const saveTodayShadow = useCallback(
    async (
      r: Record<AreaId, number>,
      notes?: string,
      source: LogSource = 'quick',
    ) => {
      await persistLog(
        { mind: r.mind, body: r.body, spirit: r.spirit },
        source,
        { notes },
      )
    },
    [persistLog],
  )

  const claimQuest = useCallback(
    async (questId: string) => {
      const quest = DAILY_QUESTS.find((q) => q.id === questId)
      if (!quest) return

      const date = todayKey()
      let g = resetQuestsIfNewDay(await getGamification(), date)

      if (g.completedQuestIds.includes(questId)) {
        pushCelebration('Quest already claimed today.', 'info')
        return
      }

      if (!quest.check(questCtx)) {
        pushCelebration(quest.description, 'info')
        return
      }

      g = {
        ...g,
        questDate: date,
        completedQuestIds: [...g.completedQuestIds, questId],
      }
      const bonus = QUEST_BONUSES[questId]
      const msg = bonus
        ? `${quest.title} — +${quest.xp} XP · ${bonus}`
        : `${quest.title} — +${quest.xp} XP`
      await applyGamificationXp(g, quest.xp, msg)
      await refresh()
    },
    [applyGamificationXp, pushCelebration, questCtx, refresh],
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
      const g = resetQuestsIfNewDay(await getGamification(), date)
      await applyGamificationXp(g, xpForMorning(), 'Dawn protocol sealed — +40 XP')
      await refresh()
    },
    [applyGamificationXp, refresh],
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
        { silent: true },
      )
      const g = await getGamification()
      await applyGamificationXp(g, xpForReflection(), 'Shadow archive sealed — +50 XP')
      await refresh()
    },
    [applyGamificationXp, persistLog, refresh],
  )

  const addGoal = useCallback(
    async (data: {
      title: string
      category: Goal['category']
      target?: string
      targetDate?: string
      milestones?: Goal['milestones']
    }) => {
      const milestones = data.milestones ?? []
      const progress =
        milestones.length > 0 ? progressFromMilestones(milestones) : 0
      const goal: Goal = {
        id: uid(),
        title: data.title,
        category: data.category,
        target: data.target,
        targetDate: data.targetDate,
        milestones,
        progress,
        createdAt: new Date().toISOString(),
        completedAt: progress >= 100 ? new Date().toISOString() : undefined,
      }
      await putGoal(goal)
      if (progress >= 100) {
        pushCelebration(`Seed bloomed — “${goal.title}” complete`, 'success')
      }
      await refresh()
    },
    [pushCelebration, refresh],
  )

  const updateGoal = useCallback(
    async (
      id: string,
      patch: Partial<
        Pick<Goal, 'title' | 'category' | 'target' | 'targetDate' | 'progress' | 'milestones'>
      >,
    ) => {
      const goal = goals.find((g) => g.id === id)
      if (!goal) return
      const milestones = patch.milestones ?? goal.milestones
      const progress =
        patch.progress ??
        (milestones.length > 0 ? progressFromMilestones(milestones) : goal.progress)
      const completedAt =
        progress >= 100
          ? goal.completedAt ?? new Date().toISOString()
          : patch.progress !== undefined && patch.progress < 100
            ? undefined
            : goal.completedAt
      await putGoal({ ...goal, ...patch, milestones, progress, completedAt })
      await refresh()
    },
    [goals, refresh],
  )

  const updateGoalProgress = useCallback(
    async (id: string, progress: number) => {
      const clamped = Math.min(100, Math.max(0, progress))
      const goal = goals.find((g) => g.id === id)
      if (goal && clamped >= 100 && goal.progress < 100) {
        pushCelebration(`Seed bloomed — “${goal.title}” complete`, 'success')
      }
      await updateGoal(id, { progress: clamped })
    },
    [goals, pushCelebration, updateGoal],
  )

  const toggleMilestone = useCallback(
    async (goalId: string, milestoneId: string) => {
      const goal = goals.find((g) => g.id === goalId)
      if (!goal) return
      const milestones = goal.milestones.map((m) =>
        m.id === milestoneId ? { ...m, done: !m.done } : m,
      )
      const progress =
        milestones.length > 0 ? progressFromMilestones(milestones) : goal.progress
      const wasComplete = goal.progress >= 100
      const completedAt =
        progress >= 100 ? goal.completedAt ?? new Date().toISOString() : undefined
      await putGoal({ ...goal, milestones, progress, completedAt })
      if (progress >= 100 && !wasComplete) {
        pushCelebration(`Milestone arc sealed — “${goal.title}”`, 'success')
      }
      await refresh()
    },
    [goals, pushCelebration, refresh],
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

  const saveWhisper = useCallback(
    async (text: string) => {
      const current = (await getSettings()) ?? settings!
      const history = [text, ...(current.whisperHistory ?? [])].slice(0, 12)
      await putSettings({ ...current, whisperHistory: history })
      await refresh()
    },
    [refresh, settings],
  )

  const toggleFavoriteWhisper = useCallback(
    async (text: string) => {
      const current = (await getSettings()) ?? settings!
      const favorites = current.favoriteWhispers ?? []
      const next = favorites.includes(text)
        ? favorites.filter((w) => w !== text)
        : [text, ...favorites].slice(0, 24)
      await putSettings({ ...current, favoriteWhispers: next })
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
      const payload = JSON.parse(text) as Awaited<ReturnType<typeof exportAllData>>
      if (!payload?.dailyLogs || !Array.isArray(payload.dailyLogs)) {
        throw new Error('Invalid KAGE backup file')
      }
      await importAllData(payload)
      await refresh()
    },
    [refresh],
  )

  const resetDemoData = useCallback(async () => {
    await clearAllData()
    await refresh()
    pushCelebration('Demo data reset — your shadow slate is clean.', 'info')
  }, [pushCelebration, refresh])

  if (loading) {
    return <LoadingScreen />
  }

  if (loadError) {
    return (
      <div
        role="alert"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          background: '#050505',
          color: '#e8e8f0',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 11,
            letterSpacing: '0.35em',
            color: '#c41e3a',
            textTransform: 'uppercase',
          }}
        >
          Archive error
        </p>
        <p style={{ margin: 0, fontSize: 13, maxWidth: 320 }}>{loadError}</p>
        <button
          type="button"
          onClick={() => void bootstrap()}
          style={{
            minHeight: 48,
            minWidth: 140,
            padding: '12px 20px',
            borderRadius: 8,
            border: '1px solid #c41e3a',
            background: 'rgba(196,30,58,0.12)',
            color: '#e85d4c',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!ready || !gamification || !settings) {
    return <LoadingScreen message="Finalizing…" />
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
    celebration,
    clearCelebration,
    pendingVoiceNote,
    setPendingVoiceNote,
    logRating,
    quickBump,
    saveTodayShadow,
    claimQuest,
    saveMorning,
    saveReflection,
    addGoal,
    updateGoal,
    updateGoalProgress,
    toggleMilestone,
    removeGoal,
    updateSettings,
    saveWhisper,
    toggleFavoriteWhisper,
    exportData,
    importData,
    resetDemoData,
    refresh,
  }

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
}
