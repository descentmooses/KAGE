import type { AffirmationContext } from './affirmations'
import { topActiveGoal } from './goals'
import { buildPillarHistory } from './pillarHistory'
import { userMentionsDriving } from './drivingContext'
import type { DailyLog, Goal, MorningLogEntry, ReflectionEntry } from '../types'

export function buildAffirmationContext(input: {
  elara: boolean
  mind: number
  body: number
  spirit: number
  core: number
  streak: number
  allLogs: DailyLog[]
  goals: Goal[]
  morningToday: MorningLogEntry | null
  reflectionToday: ReflectionEntry | null
  todayLog: DailyLog | null
  nonce?: number
}): AffirmationContext {
  const top = topActiveGoal(input.goals)
  const recentLogDays = input.allLogs.filter((l) => {
    const days =
      (Date.now() - new Date(l.date + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24)
    return days <= 7
  }).length

  return {
    elara: input.elara,
    mind: input.mind,
    body: input.body,
    spirit: input.spirit,
    core: input.core,
    streak: input.streak,
    hasLoggedToday: !!input.todayLog,
    mentionsDriving: userMentionsDriving(
      input.allLogs,
      input.morningToday,
      input.reflectionToday,
    ),
    history: buildPillarHistory(input.allLogs),
    goals: input.goals,
    recentLogDays,
    morningLogged: !!input.morningToday,
    reflectionLogged: !!input.reflectionToday,
    topGoal: top
      ? { title: top.title, category: top.category, progress: top.progress }
      : undefined,
    nonce: input.nonce,
  }
}
