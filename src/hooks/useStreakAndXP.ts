import { useTracker } from '../context/trackerContext'

/** Streak, XP, rank, daily quests, and celebration toasts. */
export function useStreakAndXP() {
  const { gamification, quests, claimQuest, celebration, clearCelebration } = useTracker()

  return { gamification, quests, claimQuest, celebration, clearCelebration }
}
