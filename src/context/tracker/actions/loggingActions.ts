import type { AreaId, DailyLog, LogSource } from '../../../types'
import { getGamification } from '../../../lib/db'
import { resetQuestsIfNewDay } from '../../../lib/gamification'
import { persistDailyLog } from '../../../lib/tracker/persistDailyLog'
import { todayKey } from '../../../lib/dates'
import type { ApplyGamificationXp, CelebrationHandler, RefreshHandler } from './types'

export interface LoggingActionDeps {
  ratings: Record<AreaId, number>
  refresh: RefreshHandler
  onCelebrate: CelebrationHandler
  applyGamificationXp: ApplyGamificationXp
}

export function createLoggingActions(deps: LoggingActionDeps) {
  const persistLog = async (
    patch: Partial<DailyLog> & { mind: number; body: number; spirit: number },
    source: LogSource,
    options?: { silent?: boolean; notes?: string },
  ) => {
    const date = todayKey()
    const g = resetQuestsIfNewDay(await getGamification(), date)
    const log = await persistDailyLog({
      patch,
      source,
      date,
      gamification: g,
      options,
      onCelebration: (message) => deps.onCelebrate(message, 'success'),
      applyGamificationXp: deps.applyGamificationXp,
    })
    await deps.refresh()
    return log
  }

  const logRating = async (area: AreaId, value: number, source: LogSource = 'quick') => {
    await persistLog({ ...deps.ratings, [area]: value }, source)
  }

  const quickBump = async (area: AreaId, delta = 1) => {
    const next = Math.min(10, Math.max(1, deps.ratings[area] + delta))
    await logRating(area, next, 'quick')
  }

  const saveTodayShadow = async (
    r: Record<AreaId, number>,
    notes?: string,
    source: LogSource = 'quick',
  ) => {
    await persistLog({ mind: r.mind, body: r.body, spirit: r.spirit }, source, { notes })
  }

  return { persistLog, logRating, quickBump, saveTodayShadow }
}
