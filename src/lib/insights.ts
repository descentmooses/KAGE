import type { AreaId, DailyLog, Period } from '../types'
import { isSameMonth, isSameWeek, lastNDays } from './dates'
import { pickInsightAffirmation } from './affirmations'

export interface TrendPoint {
  date: string
  label: string
  mind: number
  body: number
  spirit: number
  core: number
}

export interface Insight {
  id: string
  message: string
  area?: AreaId
}

function avgForArea(logs: DailyLog[], area: AreaId): number {
  if (logs.length === 0) return 0
  return logs.reduce((sum, l) => sum + l[area], 0) / logs.length
}

export function buildTrend(logs: DailyLog[], days = 7): TrendPoint[] {
  const keys = lastNDays(days)
  const byDate = new Map(logs.map((l) => [l.date, l]))

  return keys.map((date) => {
    const log = byDate.get(date)
    return {
      date,
      label: date.slice(5),
      mind: log?.mind ?? 0,
      body: log?.body ?? 0,
      spirit: log?.spirit ?? 0,
      core: log?.core ?? 0,
    }
  })
}

export function filterLogsByPeriod(logs: DailyLog[], period: Period): DailyLog[] {
  const today = new Date().toISOString().slice(0, 10)
  if (period === 'daily') {
    return logs.filter((l) => l.date === today)
  }
  if (period === 'weekly') {
    return logs.filter((l) => isSameWeek(l.date, today))
  }
  return logs.filter((l) => isSameMonth(l.date, today))
}

export function generateInsights(logs: DailyLog[]): Insight[] {
  const insights: Insight[] = []
  const thisWeek = filterLogsByPeriod(logs, 'weekly')
  const lastWeekKeys = lastNDays(14).slice(0, 7)
  const prevWeek = logs.filter((l) => lastWeekKeys.includes(l.date))

  for (const area of ['mind', 'body', 'spirit'] as AreaId[]) {
    const current = avgForArea(thisWeek, area)
    const previous = avgForArea(prevWeek, area)
    if (current === 0 || previous === 0) continue
    const delta = ((current - previous) / previous) * 100
    if (Math.abs(delta) >= 5) {
      const label = area === 'mind' ? 'Mind' : area === 'body' ? 'Body' : 'Spirit'
      insights.push({
        id: `${area}-trend`,
        area,
        message: pickInsightAffirmation(label, delta),
      })
    }
  }

  if (insights.length === 0 && thisWeek.length > 0) {
    insights.push({
      id: 'steady',
      message: 'Steady week in the shadow log. Consistency unlocks the next rank.',
    })
  }

  return insights.slice(0, 3)
}
