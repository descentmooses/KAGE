import type { Goal, GoalCategory, GoalMilestone } from '../types'

export const GOAL_CATEGORY_LABEL: Record<GoalCategory, string> = {
  wealth: 'Wealth',
  health: 'Health',
  family: 'Family',
  craft: 'Craft',
  custom: 'Custom',
}

/** Ensure legacy imported goals have milestone arrays. */
export function normalizeGoal(goal: Goal): Goal {
  return {
    ...goal,
    milestones: goal.milestones ?? [],
    progress: goal.progress ?? 0,
  }
}

export function progressFromMilestones(milestones: GoalMilestone[]): number {
  if (milestones.length === 0) return 0
  const done = milestones.filter((m) => m.done).length
  return Math.round((done / milestones.length) * 100)
}

export function aggregateGoalGrowth(goals: Goal[]): number {
  if (goals.length === 0) return 0
  const total = goals.reduce((sum, g) => sum + g.progress, 0)
  return Math.round(total / goals.length)
}

export function topActiveGoal(goals: Goal[]): Goal | null {
  const active = goals.filter((g) => g.progress < 100 && !g.completedAt)
  if (active.length === 0) return null
  return active.sort((a, b) => b.progress - a.progress)[0]
}

export function goalsByCategory(goals: Goal[]): Record<string, Goal[]> {
  return goals.reduce<Record<string, Goal[]>>((acc, g) => {
    acc[g.category] = acc[g.category] ?? []
    acc[g.category].push(g)
    return acc
  }, {})
}

export function questHintForGoals(goals: Goal[]): string | null {
  const top = topActiveGoal(goals)
  if (!top) return null
  const cat = GOAL_CATEGORY_LABEL[top.category]
  return `Feed your ${cat} seed: “${top.title}”`
}
