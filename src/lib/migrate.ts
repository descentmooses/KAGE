import type { DailyLog, Ratings } from '../types'
import { computeCore } from '../types'
import { putDailyLog } from './db'
import { todayKey } from './dates'

const MIGRATED_KEY = 'kage-idb-migrated'

export async function migrateFromLocalStorage(): Promise<void> {
  if (localStorage.getItem(MIGRATED_KEY)) return

  try {
    const ratingsRaw = localStorage.getItem('kage-ratings')
    if (ratingsRaw) {
      const ratings = JSON.parse(ratingsRaw) as Ratings
      const mind = ratings.mind ?? 7
      const body = ratings.body ?? 7
      const spirit = ratings.spirit ?? 7
      const log: DailyLog = {
        date: todayKey(),
        mind,
        body,
        spirit,
        core: computeCore(mind, body, spirit),
        source: 'import',
        loggedAt: new Date().toISOString(),
      }
      await putDailyLog(log)
    }
  } catch {
    /* ignore corrupt legacy data */
  }

  localStorage.setItem(MIGRATED_KEY, '1')
}
