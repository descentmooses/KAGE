import { describe, expect, it } from 'vitest'
import {
  aggregateGoalGrowth,
  normalizeGoal,
  progressFromMilestones,
  questHintForGoals,
  topActiveGoal,
} from './goals'
import type { Goal } from '../types'

const baseGoal = (overrides: Partial<Goal> = {}): Goal => ({
  id: 'g1',
  title: 'Test seed',
  category: 'health',
  milestones: [],
  progress: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

describe('goals', () => {
  it('normalizes legacy goals without milestones', () => {
    const raw = { ...baseGoal(), milestones: undefined as unknown as Goal['milestones'] }
    expect(normalizeGoal(raw).milestones).toEqual([])
    expect(normalizeGoal(raw).progress).toBe(0)
  })

  it('computes milestone progress as done ratio', () => {
    const milestones = [
      { id: '1', label: 'A', done: true },
      { id: '2', label: 'B', done: false },
      { id: '3', label: 'C', done: true },
      { id: '4', label: 'D', done: false },
    ]
    expect(progressFromMilestones(milestones)).toBe(50)
  })

  it('returns 0 progress for empty milestones', () => {
    expect(progressFromMilestones([])).toBe(0)
  })

  it('aggregates average growth across goals', () => {
    const goals = [baseGoal({ progress: 40 }), baseGoal({ id: 'g2', progress: 80 })]
    expect(aggregateGoalGrowth(goals)).toBe(60)
  })

  it('picks top active goal by progress', () => {
    const goals = [
      baseGoal({ id: 'a', progress: 20 }),
      baseGoal({ id: 'b', progress: 75, title: 'Lead goal' }),
      baseGoal({ id: 'c', progress: 100, completedAt: '2026-01-02' }),
    ]
    expect(topActiveGoal(goals)?.title).toBe('Lead goal')
  })

  it('builds quest hint from top active goal', () => {
    const goals = [baseGoal({ progress: 55, title: 'Run 5K', category: 'health' })]
    expect(questHintForGoals(goals)).toContain('Run 5K')
  })
})
