export type GoalCategory = 'wealth' | 'health' | 'family' | 'craft' | 'custom'

export interface GoalMilestone {
  id: string
  label: string
  done: boolean
}

export interface Goal {
  id: string
  title: string
  category: GoalCategory
  target?: string
  targetDate?: string
  milestones: GoalMilestone[]
  progress: number
  createdAt: string
  completedAt?: string
}
