import { useTracker } from '../context/trackerContext'

/** Freedom goals (planting, milestones, progress). */
export function useFreedomGoals() {
  const { goals, addGoal, updateGoal, updateGoalProgress, toggleMilestone, removeGoal } =
    useTracker()

  return { goals, addGoal, updateGoal, updateGoalProgress, toggleMilestone, removeGoal }
}
