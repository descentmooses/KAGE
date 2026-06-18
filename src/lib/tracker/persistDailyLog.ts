import type { DailyLog, GamificationState, LogSource } from '../../types'
import { computeCore } from '../../types'
import { applyXpDelta, updateStreak, xpForDailyLog } from '../gamification'
import { isStreakMilestone } from '../affirmations'
import { emitFirstShadowLog, emitShadowLogged } from '../pwa/installUtils'
import { getDailyLog, getAllDailyLogs, putDailyLog, putGamification } from '../db'

export interface PersistDailyLogInput {
  patch: Partial<DailyLog> & { mind: number; body: number; spirit: number }
  source: LogSource
  date: string
  gamification: GamificationState
  options?: { silent?: boolean; notes?: string }
  onCelebration: (message: string) => void
  applyGamificationXp: (
    g: GamificationState,
    amount: number,
    successMessage?: string,
  ) => Promise<GamificationState>
}

/**
 * Writes today's daily log, updates streak/XP, and fires PWA install hooks.
 * Shared by quick-log, full-log, reflect, and voice flows.
 */
export async function persistDailyLog({
  patch,
  source,
  date,
  gamification,
  options,
  onCelebration,
  applyGamificationXp,
}: PersistDailyLogInput): Promise<DailyLog> {
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

  let g = gamification
  if (!existingLog) {
    g = updateStreak(g, date)
    if (isStreakMilestone(g.currentStreak)) {
      onCelebration(`${g.currentStreak} days — the flame holds steady`)
    }
  }
  if (log.core >= 85 && (!existingLog || existingLog.core < 85)) {
    onCelebration('Core ascendant — peak shadow state')
  }

  const xpGain = xpForDailyLog(log)
  if (!options?.silent) {
    await applyGamificationXp(g, xpGain, `Shadow logged — +${xpGain} XP`)
  } else {
    await putGamification(applyXpDelta(g, xpGain).state)
  }

  if (wasFirstEver) emitFirstShadowLog()
  if (!options?.silent) emitShadowLogged()

  return log
}
