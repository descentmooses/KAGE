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
  DailyLog,
  GamificationState,
  Goal,
  MorningLogEntry,
  Period,
  ReflectionEntry,
} from '../types'
import {
  getAllDailyLogs,
  getAllMorningLogs,
  getAllReflectionLogs,
  getDailyLog,
  getGamification,
  getGoals,
  getMorningLogByDate,
  getReflectionLogByDate,
  getSettings,
  putGamification,
  putSettings,
} from '../lib/db'
import { DEFAULT_RATINGS, computeCore } from '../types'
import { migrateFromLocalStorage } from '../lib/migrate'
import { todayKey } from '../lib/dates'
import { resetQuestsIfNewDay } from '../lib/gamification'
import { buildTrendForPeriod, generateInsights } from '../lib/insights'
import { normalizeGoal } from '../lib/goals'
import { buildElaraPersona, personaChanged } from '../lib/elaraPersona'
import { LoadingScreen } from '../components/LoadingScreen'
import { evaluateQuests } from '../lib/quests'
import { createApplyGamificationXp } from './tracker/actions/gamificationActions'
import { createLoggingActions } from './tracker/actions/loggingActions'
import { createGoalActions } from './tracker/actions/goalActions'
import { createRitualActions } from './tracker/actions/ritualActions'
import { createSettingsActions } from './tracker/actions/settingsActions'
import { createDataActions } from './tracker/actions/dataActions'
import { createQuestActions } from './tracker/actions/questActions'
import { createCelebrationId } from './tracker/actions/types'

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

  const pushCelebration = useCallback(
    (message: string, type: CelebrationEvent['type'] = 'success') => {
      setCelebration({ id: createCelebrationId(), message, type })
    },
    [],
  )

  const refresh = useCallback(async () => {
    const date = todayKey()
    let g = await getGamification()
    const resetG = resetQuestsIfNewDay(g, date)
    if (resetG !== g) {
      await putGamification(resetG)
      g = resetG
    }

    const [log, logs, goalList, s, morning, reflection, morningLogs, reflectionLogs] =
      await Promise.all([
      getDailyLog(date),
      getAllDailyLogs(),
      getGoals(),
      getSettings(),
      getMorningLogByDate(date),
      getReflectionLogByDate(date),
      getAllMorningLogs(),
      getAllReflectionLogs(),
    ])

    const persona = buildElaraPersona({
      allLogs: logs,
      morningLogs,
      reflectionLogs,
      goals: goalList.map(normalizeGoal),
      streak: g.currentStreak,
      favoriteWhispers: s.favoriteWhispers,
    })
    const nextSettings =
      personaChanged(s.elaraPersona, persona) ? { ...s, elaraPersona: persona } : s
    if (nextSettings !== s) {
      await putSettings(nextSettings)
    }

    setTodayLog(log)
    setAllLogs(logs)
    setGamification(g)
    setGoals(goalList.map(normalizeGoal))
    setSettings(nextSettings)
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

  const applyGamificationXp = useMemo(
    () => createApplyGamificationXp(pushCelebration),
    [pushCelebration],
  )

  const { logRating, quickBump, saveTodayShadow, persistLog } = useMemo(
    () =>
      createLoggingActions({
        ratings,
        refresh,
        onCelebrate: pushCelebration,
        applyGamificationXp,
      }),
    [ratings, refresh, pushCelebration, applyGamificationXp],
  )

  const { saveMorning, saveReflection } = useMemo(
    () =>
      createRitualActions({
        refresh,
        applyGamificationXp,
        persistLog,
      }),
    [refresh, applyGamificationXp, persistLog],
  )

  const { addGoal, updateGoal, updateGoalProgress, toggleMilestone, removeGoal } = useMemo(
    () =>
      createGoalActions({
        goals,
        refresh,
        onCelebrate: pushCelebration,
      }),
    [goals, refresh, pushCelebration],
  )

  const { updateSettings, saveWhisper, toggleFavoriteWhisper } = useMemo(
    () =>
      createSettingsActions({
        settings,
        refresh,
      }),
    [settings, refresh],
  )

  const { exportData, importData, resetDemoData } = useMemo(
    () =>
      createDataActions({
        refresh,
        onCelebrate: pushCelebration,
      }),
    [refresh, pushCelebration],
  )

  const { claimQuest } = useMemo(
    () =>
      createQuestActions({
        questCtx,
        refresh,
        onCelebrate: pushCelebration,
        applyGamificationXp,
      }),
    [questCtx, refresh, pushCelebration, applyGamificationXp],
  )

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
