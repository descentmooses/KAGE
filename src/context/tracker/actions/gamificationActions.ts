import { applyXpDelta } from '../../../lib/gamification'
import { putGamification } from '../../../lib/db'
import type { ApplyGamificationXp, CelebrationHandler } from './types'

export function createApplyGamificationXp(
  onCelebrate: CelebrationHandler,
): ApplyGamificationXp {
  return async (g, amount, successMessage) => {
    const delta = applyXpDelta(g, amount)
    await putGamification(delta.state)
    if (delta.rankUp) {
      onCelebrate(`Rank ascended — ${delta.state.rank}`, 'success')
    } else if (delta.leveledUp) {
      onCelebrate(`Level ${delta.state.level} — the shadow deepens`, 'success')
    } else if (successMessage) {
      onCelebrate(successMessage, 'success')
    }
    return delta.state
  }
}
