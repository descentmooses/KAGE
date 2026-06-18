import { describe, expect, it, vi } from 'vitest'
import { createGoalActions } from './goalActions'
import type { Goal } from '../../../types'

const putGoal = vi.hoisted(() => vi.fn())
const deleteGoal = vi.hoisted(() => vi.fn())

vi.mock('../../../lib/db', () => ({
  putGoal: (...args: unknown[]) => putGoal(...args),
  deleteGoal: (...args: unknown[]) => deleteGoal(...args),
}))

describe('goalActions', () => {
  it('adds a goal and refreshes state', async () => {
    const refresh = vi.fn()
    const onCelebrate = vi.fn()
    const { addGoal } = createGoalActions({ goals: [], refresh, onCelebrate })

    await addGoal({
      title: 'Emergency fund',
      category: 'wealth',
      milestones: [{ id: 'm1', label: 'First $1k', done: false }],
    })

    expect(putGoal).toHaveBeenCalledOnce()
    expect(refresh).toHaveBeenCalledOnce()
    const saved = putGoal.mock.calls[0][0] as Goal
    expect(saved.title).toBe('Emergency fund')
    expect(saved.progress).toBe(0)
  })

  it('toggles milestone and recalculates progress', async () => {
    const goal: Goal = {
      id: 'g1',
      title: 'Health',
      category: 'health',
      milestones: [
        { id: 'm1', label: 'A', done: false },
        { id: 'm2', label: 'B', done: false },
      ],
      progress: 0,
      createdAt: '2026-01-01',
    }
    const refresh = vi.fn()
    const onCelebrate = vi.fn()
    const { toggleMilestone } = createGoalActions({
      goals: [goal],
      refresh,
      onCelebrate,
    })

    await toggleMilestone('g1', 'm1')

    const saved = putGoal.mock.calls.at(-1)?.[0] as Goal
    expect(saved.milestones.find((m) => m.id === 'm1')?.done).toBe(true)
    expect(saved.progress).toBe(50)
  })
})
