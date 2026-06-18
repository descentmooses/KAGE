import type { DailyQuest, QuestContext } from '../types'
import { todayKey } from './dates'

export const DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'log-all-pillars',
    title: 'Triad Complete',
    description: 'Log Mind, Body, and Spirit today',
    xp: 35,
    check: ({ todayLog }) =>
      !!todayLog && todayLog.mind > 0 && todayLog.body > 0 && todayLog.spirit > 0,
  },
  {
    id: 'morning-protocol',
    title: 'Dawn Protocol',
    description: 'Complete morning activation (+Mind & Spirit)',
    xp: 40,
    check: ({ morningLogged }) => morningLogged,
  },
  {
    id: 'evening-archive',
    title: 'Shadow Archive',
    description: 'Log evening reflection (+Spirit)',
    xp: 50,
    check: ({ reflectionLogged }) => reflectionLogged,
  },
  {
    id: 'high-pillar',
    title: 'Peak Pillar',
    description: 'Score 8+ on any pillar',
    xp: 30,
    check: ({ todayLog }) =>
      !!todayLog && (todayLog.mind >= 8 || todayLog.body >= 8 || todayLog.spirit >= 8),
  },
]

/** Bonus flavor text when a quest is claimed. */
export const QUEST_BONUSES: Record<string, string> = {
  'morning-protocol': '+Mind & +Spirit aligned',
  'evening-archive': '+Spirit archived',
  'log-all-pillars': 'Triad sealed',
  'high-pillar': 'Peak discipline recorded',
}

export function evaluateQuests(
  ctx: QuestContext,
  completedIds: string[],
  questDate: string | null,
  today = todayKey(),
) {
  const questsAreToday = questDate === today
  return DAILY_QUESTS.map((quest) => {
    const eligible = quest.check(ctx)
    const claimed = questsAreToday && completedIds.includes(quest.id)
    return {
      ...quest,
      done: claimed,
      eligible: eligible && !claimed,
      newlyComplete: eligible && !claimed,
    }
  })
}
