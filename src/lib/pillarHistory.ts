import type { AreaId, DailyLog } from '../types'
import { lastNDays } from './dates'

export interface PillarHistory {
  daysLogged: number
  avgMind: number
  avgBody: number
  avgSpirit: number
  steadyPillar: AreaId | null
  risingPillar: AreaId | null
  softPillar: AreaId | null
  mixedScores: boolean
  longDays: boolean
}

function avg(logs: DailyLog[], area: AreaId): number {
  if (logs.length === 0) return 0
  return logs.reduce((sum, l) => sum + l[area], 0) / logs.length
}

function stdDev(logs: DailyLog[], area: AreaId, mean: number): number {
  if (logs.length < 2) return 0
  const variance =
    logs.reduce((sum, l) => sum + (l[area] - mean) ** 2, 0) / logs.length
  return Math.sqrt(variance)
}

export function buildPillarHistory(logs: DailyLog[], lookbackDays = 7): PillarHistory {
  const keys = lastNDays(lookbackDays)
  const recent = logs.filter((l) => keys.includes(l.date) && l.core > 0)

  const avgMind = avg(recent, 'mind')
  const avgBody = avg(recent, 'body')
  const avgSpirit = avg(recent, 'spirit')

  const pillars: AreaId[] = ['mind', 'body', 'spirit']
  const avgs = { mind: avgMind, body: avgBody, spirit: avgSpirit }

  const variability = pillars.map((p) => ({
    pillar: p,
    std: stdDev(recent, p, avgs[p]),
  }))
  const steadyPillar =
    variability.length > 0
      ? variability.reduce((a, b) => (a.std < b.std ? a : b)).pillar
      : null

  const firstHalf = recent.filter((l) => keys.indexOf(l.date) >= Math.floor(keys.length / 2))
  const secondHalf = recent.filter((l) => keys.indexOf(l.date) < Math.floor(keys.length / 2))

  let risingPillar: AreaId | null = null
  let bestRise = 0
  for (const p of pillars) {
    const rise = avg(secondHalf, p) - avg(firstHalf, p)
    if (rise > bestRise && rise >= 0.5) {
      bestRise = rise
      risingPillar = p
    }
  }

  const softPillar = pillars.reduce<AreaId | null>((lowest, p) => {
    if (!lowest) return p
    return avgs[p] < avgs[lowest] ? p : lowest
  }, null)

  const scores = recent.flatMap((l) => [l.mind, l.body, l.spirit])
  const mixedScores =
    scores.length > 0 &&
    Math.max(...scores) - Math.min(...scores) >= 3 &&
    stdDev(recent, 'mind', avgMind) + stdDev(recent, 'body', avgBody) + stdDev(recent, 'spirit', avgSpirit) >
      2.5

  return {
    daysLogged: recent.length,
    avgMind,
    avgBody,
    avgSpirit,
    steadyPillar,
    risingPillar,
    softPillar: avgs[softPillar ?? 'mind'] > 0 && avgs[softPillar ?? 'mind'] < 6 ? softPillar : null,
    mixedScores,
    longDays: recent.length >= 5,
  }
}

export function shadowPresenceStrength(history: PillarHistory, streak: number): number {
  const logFactor = Math.min(1, history.daysLogged / 7)
  const streakFactor = Math.min(1, streak / 14)
  return Math.min(1, logFactor * 0.65 + streakFactor * 0.35)
}
