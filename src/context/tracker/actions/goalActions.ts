import type { Goal } from '../../../types'
import { deleteGoal, putGoal } from '../../../lib/db'
import { progressFromMilestones } from '../../../lib/goals'
import type { CelebrationHandler, RefreshHandler } from './types'
import { createUid } from './types'

export interface GoalActionDeps {
  goals: Goal[]
  refresh: RefreshHandler
  onCelebrate: CelebrationHandler
}

export function createGoalActions(deps: GoalActionDeps) {
  const addGoal = async (data: {
    title: string
    category: Goal['category']
    target?: string
    targetDate?: string
    milestones?: Goal['milestones']
  }) => {
    const milestones = data.milestones ?? []
    const progress = milestones.length > 0 ? progressFromMilestones(milestones) : 0
    const goal: Goal = {
      id: createUid(),
      title: data.title,
      category: data.category,
      target: data.target,
      targetDate: data.targetDate,
      milestones,
      progress,
      createdAt: new Date().toISOString(),
      completedAt: progress >= 100 ? new Date().toISOString() : undefined,
    }
    await putGoal(goal)
    if (progress >= 100) {
      deps.onCelebrate(`Seed bloomed — “${goal.title}” complete`, 'success')
    }
    await deps.refresh()
  }

  const updateGoal = async (
    id: string,
    patch: Partial<
      Pick<Goal, 'title' | 'category' | 'target' | 'targetDate' | 'progress' | 'milestones'>
    >,
  ) => {
    const goal = deps.goals.find((g) => g.id === id)
    if (!goal) return
    const milestones = patch.milestones ?? goal.milestones
    const progress =
      patch.progress ??
      (milestones.length > 0 ? progressFromMilestones(milestones) : goal.progress)
    const completedAt =
      progress >= 100
        ? goal.completedAt ?? new Date().toISOString()
        : patch.progress !== undefined && patch.progress < 100
          ? undefined
          : goal.completedAt
    await putGoal({ ...goal, ...patch, milestones, progress, completedAt })
    await deps.refresh()
  }

  const updateGoalProgress = async (id: string, progress: number) => {
    const clamped = Math.min(100, Math.max(0, progress))
    const goal = deps.goals.find((g) => g.id === id)
    if (goal && clamped >= 100 && goal.progress < 100) {
      deps.onCelebrate(`Seed bloomed — “${goal.title}” complete`, 'success')
    }
    await updateGoal(id, { progress: clamped })
  }

  const toggleMilestone = async (goalId: string, milestoneId: string) => {
    const goal = deps.goals.find((g) => g.id === goalId)
    if (!goal) return
    const milestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, done: !m.done } : m,
    )
    const progress =
      milestones.length > 0 ? progressFromMilestones(milestones) : goal.progress
    const wasComplete = goal.progress >= 100
    const completedAt =
      progress >= 100 ? goal.completedAt ?? new Date().toISOString() : undefined
    await putGoal({ ...goal, milestones, progress, completedAt })
    if (progress >= 100 && !wasComplete) {
      deps.onCelebrate(`Milestone arc sealed — “${goal.title}”`, 'success')
    }
    await deps.refresh()
  }

  const removeGoal = async (id: string) => {
    await deleteGoal(id)
    await deps.refresh()
  }

  return { addGoal, updateGoal, updateGoalProgress, toggleMilestone, removeGoal }
}
