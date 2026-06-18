import type { DailyQuest, QuestContext } from '../types'

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
    description: 'Complete morning activation',
    xp: 40,
    check: ({ morningLogged }) => morningLogged,
  },
  {
    id: 'evening-archive',
    title: 'Shadow Archive',
    description: 'Log evening reflection',
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

export function evaluateQuests(ctx: QuestContext, completedIds: string[]) {
  return DAILY_QUESTS.map((quest) => ({
    ...quest,
    done: completedIds.includes(quest.id) || quest.check(ctx),
    newlyComplete: !completedIds.includes(quest.id) && quest.check(ctx),
  }))
}
