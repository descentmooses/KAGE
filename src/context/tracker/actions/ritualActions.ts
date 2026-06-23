import type { AreaId, MorningLogEntry, ReflectionEntry } from '../../../types'
import { addMorningLog, addReflectionLog, getGamification } from '../../../lib/db'
import { resetQuestsIfNewDay, xpForMorning, xpForReflection } from '../../../lib/gamification'
import { todayKey } from '../../../lib/dates'
import { emitDataChanged } from '../../../lib/syncEvents'
import type { ApplyGamificationXp, RefreshHandler } from './types'
import { createUid } from './types'

export interface RitualActionDeps {
  refresh: RefreshHandler
  applyGamificationXp: ApplyGamificationXp
  persistLog: (
    patch: { mind: number; body: number; spirit: number; notes?: string },
    source: 'reflect',
    options?: { silent?: boolean; notes?: string },
  ) => Promise<unknown>
}

export function createRitualActions(deps: RitualActionDeps) {
  const saveMorning = async (energy: number, intention: string, discipline: string) => {
    const date = todayKey()
    const entry: MorningLogEntry = {
      id: createUid(),
      date,
      energy,
      intention: intention.trim(),
      discipline: discipline.trim(),
      loggedAt: new Date().toISOString(),
    }
    await addMorningLog(entry)
    const g = resetQuestsIfNewDay(await getGamification(), date)
    await deps.applyGamificationXp(g, xpForMorning(), 'Dawn protocol sealed — +40 XP')
    await deps.refresh()
    emitDataChanged()
  }

  const saveReflection = async (r: Record<AreaId, number>, journal: string) => {
    const date = todayKey()
    const entry: ReflectionEntry = {
      id: createUid(),
      date,
      mind: r.mind,
      body: r.body,
      spirit: r.spirit,
      journal: journal.trim(),
      loggedAt: new Date().toISOString(),
    }
    await addReflectionLog(entry)
    await deps.persistLog(
      { mind: r.mind, body: r.body, spirit: r.spirit, notes: journal },
      'reflect',
      { silent: true },
    )
    const g = await getGamification()
    await deps.applyGamificationXp(g, xpForReflection(), 'Shadow archive sealed — +50 XP')
    await deps.refresh()
  }

  return { saveMorning, saveReflection }
}
