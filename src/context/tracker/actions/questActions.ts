import { getGamification } from '../../../lib/db'
import { resetQuestsIfNewDay } from '../../../lib/gamification'
import { DAILY_QUESTS, evaluateQuests, QUEST_BONUSES } from '../../../lib/quests'
import { todayKey } from '../../../lib/dates'
import type { QuestContext } from '../../../types'
import type { ApplyGamificationXp, CelebrationHandler, RefreshHandler } from './types'

export interface QuestActionDeps {
  questCtx: QuestContext
  refresh: RefreshHandler
  onCelebrate: CelebrationHandler
  applyGamificationXp: ApplyGamificationXp
}

export function createQuestActions(deps: QuestActionDeps) {
  const claimQuest = async (questId: string) => {
    const quest = DAILY_QUESTS.find((q) => q.id === questId)
    if (!quest) return

    const date = todayKey()
    let g = resetQuestsIfNewDay(await getGamification(), date)

    if (g.completedQuestIds.includes(questId)) {
      deps.onCelebrate('Quest already claimed today.', 'info')
      return
    }

    if (!quest.check(deps.questCtx)) {
      deps.onCelebrate(quest.description, 'info')
      return
    }

    g = {
      ...g,
      questDate: date,
      completedQuestIds: [...g.completedQuestIds, questId],
    }
    const bonus = QUEST_BONUSES[questId]
    const msg = bonus
      ? `${quest.title} — +${quest.xp} XP · ${bonus}`
      : `${quest.title} — +${quest.xp} XP`
    await deps.applyGamificationXp(g, quest.xp, msg)
    await deps.refresh()
  }

  return { claimQuest }
}

export { evaluateQuests }
